"use client";

import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, RoundedBox, useTexture } from "@react-three/drei";
import { createContext, Suspense, useContext, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { professionalLibrary as professionalContent, readingLibrary as readingContent, travelGallery, type BookEntry, type TravelAlbum } from "./room-content";
import { withBase } from "./base";

type ViewName = "overview" | "seat" | "reading" | "work";
type Selection = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  detail: string;
  target: [number, number, number];
  camera: [number, number, number];
};

const selections: Record<string, Selection> = {
  readingBooks: { id: "readingBooks", eyebrow: "Library / 01", title: "手边的书", body: "阅读区西侧是一整面私人书架，收纳小说、科幻与随手重读的作品。", detail: "《黄金时代》 · 《星星是冰冷的玩具》 · 阅读笔记", target: [-4.55, 2.05, -.35], camera: [-1.6, 3.1, 2.2] },
  professionalBooks: { id: "professionalBooks", eyebrow: "Research / 02", title: "专业书柜", body: "中央书柜保存专业教材、研究资料和我自己发表的论文，并作为阅读区与办公区之间的知识隔断。", detail: "《高等工程流体力学》 · Order-of-Magnitude Physics · 发表论文", target: [-.3, 2.05, -.9], camera: [-3.0, 3.2, 2.4] },
  monitors: { id: "monitors", eyebrow: "Compute / 03", title: "正在计算", body: "双屏展示正在进行的数值计算、数据可视化和三维建模工作，也可以连接到具体项目页面。", detail: "数值计算 · 三维建模 · 数据可视化", target: [2.45, 1.5, -3.3], camera: [2.5, 2.7, .25] },
  coffee: { id: "coffee", eyebrow: "Ritual / 04", title: "咖啡与马克杯", body: "右侧的咖啡角保存日常仪式感。上层陈列马克杯，台面安放咖啡机。", detail: "咖啡机 · 马克杯收藏", target: [4.55, 2.1, -1.0], camera: [2.25, 2.9, -1.0] },
  recordPlayer: { id: "recordPlayer", eyebrow: "Listening / 06", title: "正在播放", body: "唱片机保存几段适合阅读与工作的声音。", detail: "唱片 · 氛围旋律 · 本地播放", target: [4.55, 2.12, -.5], camera: [2.35, 3.0, -.72] },
  whiteboard: { id: "whiteboard", eyebrow: "Derivation / 05", title: "近期推导", body: "白板用于展示近期正在推进的公式推导、假设、边界条件与尚待验证的思路。", detail: "近期推导 · 边界条件 · 待验证假设", target: [2.55, 2.33, 3.55], camera: [2.55, 3.25, .75] },
  art: { id: "art", eyebrow: "Private / 03", title: "阅读角的画", body: "坐下时它在身后，进门时却先于扶手椅被看见。它是阅读区对外暴露的唯一线索。", detail: "墙面收藏 · 可替换为个人摄影或艺术作品", target: [-3.55, 2.67, -3.74], camera: [-2.0, 3.2, -.5] },
};

const views: Record<ViewName, { camera: [number, number, number]; target: [number, number, number] }> = {
  overview: { camera: [8.8, 7.2, 9.2], target: [0, 0.5, 0] },
  seat: { camera: [-3.55, 1.48, -2.7], target: [-3.05, 2.35, 3.62] },
  reading: { camera: [-0.3, 4.2, 3.8], target: [-3.0, 0.65, -1.0] },
  work: { camera: [2.55, 1.62, -.72], target: [2.37, 1.62, -3.35] },
};

function BookCover({ book, large = false }: { book: BookEntry; large?: boolean }) {
  return (
    <div className={`book-cover ${large ? "large" : ""}`} style={{ background: `linear-gradient(145deg, ${book.colors[0]}, ${book.colors[1]})` }}>
      <span className="book-cover-rule" />
      <span className="book-cover-category">{book.category.split(" · ")[0]}</span>
      <strong>{book.title}</strong>
      <small>{book.author}</small>
    </div>
  );
}

function LibraryExperience({ title, subtitle, books, activeBook, onSelect, onBack }: { title: string; subtitle: string; books: BookEntry[]; activeBook: BookEntry | null; onSelect: (book: BookEntry) => void; onBack: () => void }) {
  if (activeBook) {
    return (
      <div className="book-detail-view">
        <button className="content-back" onClick={onBack}>← 返回书架</button>
        <div className="book-detail-cover"><BookCover book={activeBook} large /></div>
        <article className="book-review">
          <div className="content-kicker">{activeBook.category}</div>
          <h2>{activeBook.title}</h2>
          <div className="book-author">{activeBook.author}</div>
          <div className="review-rule" />
          <h3>我的书评</h3>
          <p>{activeBook.note}</p>
          <p className="review-hint">这里以后可以继续加入摘录、评分、阅读日期和相关文章链接。</p>
        </article>
      </div>
    );
  }

  const shelves = Array.from({ length: Math.ceil(books.length / 4) }, (_, index) => books.slice(index * 4, index * 4 + 4));
  return (
    <div className="library-view">
      <div className="content-heading"><div className="content-kicker">Personal Library</div><h2>{title}</h2><p>{subtitle}</p></div>
      <div className="shelf-unit">
        {shelves.map((row, rowIndex) => (
          <div className="book-row" key={rowIndex}>
            <div className="book-row-items">
              {row.map((book) => (
                <button className="book-button" key={book.title} onClick={() => onSelect(book)} aria-label={`打开《${book.title}》的书评`}>
                  <BookCover book={book} />
                </button>
              ))}
            </div>
            <div className="wood-shelf"><span /></div>
          </div>
        ))}
      </div>
      <div className="library-footnote">点击一本书，打开阅读笔记</div>
    </div>
  );
}

function TravelGallery() {
  const [activeAlbum, setActiveAlbum] = useState<TravelAlbum | null>(null);

  if (activeAlbum) {
    return (
      <div className="gallery-view">
        <button className="content-back" onClick={() => setActiveAlbum(null)}>← 返回旅行画廊</button>
        <div className="content-heading"><div className="content-kicker">Travel Album</div><h2>{activeAlbum.title}</h2><p>{activeAlbum.location} · {activeAlbum.year}</p></div>
        <div className="gallery-grid album-photo-grid">
          {activeAlbum.photos.map((photo, index) => (
            <div className="gallery-placeholder has-photo" key={`${photo.title}-${index}`}>
              {photo.image && <img className="travel-photo" src={withBase(photo.image)} alt={photo.title} loading="lazy" />}
              <div className="gallery-matte"><span>{String(index + 1).padStart(2, "0")}</span><strong>{photo.title}</strong><small>{photo.location} · {photo.year}</small></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-view">
      <div className="content-heading"><div className="content-kicker">Travel Archive</div><h2>旅行画廊</h2><p>每一张卡片代表一次旅行，点击后查看这次旅行的完整照片。</p></div>
      <div className="gallery-grid">
        {travelGallery.map((album, index) => (
          <button className={`gallery-placeholder gallery-album-card gallery-placeholder-${index + 1}`} key={`${album.title}-${index}`} onClick={() => setActiveAlbum(album)}>
            {album.cover && <img className="travel-photo" src={withBase(album.cover)} alt={album.title} loading="lazy" />}
            <div className="gallery-matte"><span>{String(index + 1).padStart(2, "0")}</span><strong>{album.title}</strong><small>{album.location} · {album.year} · {album.photos.length} 张照片</small></div>
          </button>
        ))}
      </div>
    </div>
  );
}

function WhiteboardExperience() {
  const [source, setSource] = useState("");
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(withBase("/content/whiteboard.md"), { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("whiteboard content unavailable");
        return response.text();
      })
      .then((text) => { if (active) setSource(text); })
      .catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, []);

  return (
    <div className="whiteboard-view">
      <div className="whiteboard-meta">
        <div className="content-kicker">Current Derivation</div>
        <span>手动发布 · Markdown + LaTeX</span>
      </div>
      <article className="whiteboard-sheet">
        {loadError ? (
          <p className="whiteboard-status">无法读取白板内容，请检查 public/content/whiteboard.md。</p>
        ) : source ? (
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{source}</ReactMarkdown>
        ) : (
          <p className="whiteboard-status">正在展开近期推导……</p>
        )}
      </article>
      <div className="whiteboard-file">SOURCE · public/content/whiteboard.md</div>
    </div>
  );
}

const recordTracks = [{ title: "都选C", mood: "缝纫机乐队 · MP3", src: withBase("/audio/dou-xuan-c.mp3") }];

function RecordPlayerExperience({ trackIndex, playing, onToggle, onStop, onSelectTrack }: {
  trackIndex: number;
  playing: boolean;
  onToggle: () => void;
  onStop: () => void;
  onSelectTrack: (index: number) => void;
}) {
  const track = recordTracks[trackIndex];

  return (
    <div className="record-player-view">
      <div className="record-visual" aria-hidden="true">
        <div className="record-disc-shell"><div className={`record-disc ${playing ? "spinning" : ""}`}><span /></div></div>
        <div className="record-arm"><span /></div>
      </div>
      <div className="record-controls">
        <div className="content-kicker">Listening Room</div>
        <h2>{track.title}</h2>
        <p>{track.mood}</p>
        <div className="record-transport">
          <button className="play-button" onClick={onToggle} aria-pressed={playing}>{playing ? "暂停" : "播放"}</button>
          <button className="stop-button" onClick={onStop}>停止</button>
        </div>
        <div className="track-list" aria-label="选择唱片">
          {recordTracks.map((item, index) => (
            <button className={trackIndex === index ? "active" : ""} key={item.title} onClick={() => onSelectTrack(index)}>
              <span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><small>{item.mood}</small>
            </button>
          ))}
        </div>
        <div className="record-note">三段原创氛围旋律 · 本地音频 · 可替换为你的歌曲</div>
      </div>
    </div>
  );
}

function ContentExperience({ selection, onClose, recordPlayer }: {
  selection: Selection;
  onClose: () => void;
  recordPlayer: {
    trackIndex: number;
    playing: boolean;
    onToggle: () => void;
    onStop: () => void;
    onSelectTrack: (index: number) => void;
  };
}) {
  const [activeBook, setActiveBook] = useState<BookEntry | null>(null);
  useEffect(() => { setActiveBook(null); }, [selection.id]);
  const closeCurrentLevel = () => {
    if (activeBook) setActiveBook(null);
    else onClose();
  };
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") closeCurrentLevel(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [activeBook, onClose]);
  return (
    <div className="content-overlay" role="dialog" aria-modal="true" aria-label={selection.title} onMouseDown={closeCurrentLevel}>
      <section className="content-window" onMouseDown={(event) => event.stopPropagation()}>
        <button className="content-close" onClick={closeCurrentLevel} aria-label={activeBook ? "返回书架" : "关闭"}>×</button>
        {selection.id === "readingBooks" && <LibraryExperience title="手边的书" subtitle="小说、科幻，以及那些值得一再重读的书。" books={readingContent} activeBook={activeBook} onSelect={setActiveBook} onBack={() => setActiveBook(null)} />}
        {selection.id === "professionalBooks" && <LibraryExperience title="专业书柜" subtitle="专业教材、研究资料、论文和计算档案。" books={professionalContent} activeBook={activeBook} onSelect={setActiveBook} onBack={() => setActiveBook(null)} />}
        {selection.id === "art" && <TravelGallery />}
        {selection.id === "whiteboard" && <WhiteboardExperience />}
        {selection.id === "recordPlayer" && <RecordPlayerExperience {...recordPlayer} />}
      </section>
    </div>
  );
}

function Interactive({ id, children }: { id: keyof typeof selections; children: React.ReactNode }) {
  const { setSelection } = useRoomState();
  return (
    <group
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        const isPrimaryClick = event.button === 0;
        const stayedInPlace = event.delta <= 4;
        if (!isPrimaryClick || !stayedInPlace) return;
        setSelection(selections[id]);
      }}
      onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "default"; }}
    >
      {children}
    </group>
  );
}

function CigarChair() {
  return (
    <group position={[-3.55, 0, -3.12]}>
      <group>
        <RoundedBox castShadow position={[0, .52, 0]} args={[1.22, .62, 1.08]} radius={.16}>
          <meshStandardMaterial color="#4d2119" roughness={.62} />
        </RoundedBox>
        <RoundedBox castShadow position={[0, 1.12, -.38]} rotation={[.1, 0, 0]} args={[1.18, 1.08, .32]} radius={.14}>
          <meshStandardMaterial color="#5b291e" roughness={.64} />
        </RoundedBox>
        <RoundedBox castShadow position={[0, .72, -.08]} args={[.86, .18, .76]} radius={.08}>
          <meshStandardMaterial color="#7a3e2a" roughness={.58} />
        </RoundedBox>
        {[-.57, .57].map((x) => (
          <group key={x} position={[x, .72, 0]}>
            <RoundedBox castShadow args={[.28, .58, 1.02]} radius={.11}>
              <meshStandardMaterial color="#401a15" roughness={.68} />
            </RoundedBox>
            <RoundedBox castShadow position={[0, .34, -.03]} args={[.31, .14, .86]} radius={.07}>
              <meshStandardMaterial color="#612b20" roughness={.62} />
            </RoundedBox>
          </group>
        ))}
        {[-.45, .45].flatMap((x) => [-.34, .34].map((z) => (
          <mesh key={`${x}-${z}`} castShadow position={[x, .17, z]}>
            <cylinderGeometry args={[.055, .07, .34, 12]} />
            <meshStandardMaterial color="#211916" />
          </mesh>
        )))}
      </group>
      <group position={[.02, 0, 1.72]}>
        <RoundedBox castShadow position={[0, .31, 0]} args={[1.02, .42, .82]} radius={.13}>
          <meshStandardMaterial color="#57271d" roughness={.68} />
        </RoundedBox>
        {[-.34, .34].flatMap((x) => [-.24, .24].map((z) => (
          <mesh key={`${x}-${z}`} castShadow position={[x, .09, z]}>
            <cylinderGeometry args={[.04, .055, .18, 10]} />
            <meshStandardMaterial color="#211916" />
          </mesh>
        )))}
      </group>
    </group>
  );
}

const RoomContext = createContext<{ setSelection: (selection: Selection | null) => void }>({ setSelection: () => undefined });
function useRoomState() { return useContext(RoomContext); }

function Bookcase({ position, rotation = [0,0,0], width = 1.1, height = 2.7, openBack = false }: { position: [number,number,number]; rotation?: [number,number,number]; width?: number; height?: number; openBack?: boolean }) {
  const bookColors = ["#6f382c", "#a27a3c", "#273c38", "#c0aa82", "#3f4144", "#845544"];
  const bookCount = openBack ? Math.max(8, Math.round(width * 2.35)) : Math.max(6, Math.round(width * 5.5));
  const shelfCount = openBack ? 5 : Math.max(3, Math.floor((height - .2) / .58));
  const shelfYs = Array.from({ length: shelfCount }, (_, index) =>
    -height / 2 + .1 + index * (height - .68) / (shelfCount - 1)
  );
  const bookSides = openBack ? [0] : [-.2];
  return (
    <group position={position} rotation={rotation}>
      {openBack ? (
        <group>
          {[-width/2+.06, 0, width/2-.06].map((x) => (
            <mesh key={x} castShadow position={[x,0,0]}><boxGeometry args={[.11,height,.54]} /><meshStandardMaterial color="#5b412f" roughness={.72} /></mesh>
          ))}
        </group>
      ) : (
        <mesh castShadow receiveShadow><boxGeometry args={[width, height, .34]} /><meshStandardMaterial color="#382b23" roughness={.7} /></mesh>
      )}
      {shelfYs.map((y, shelf) => (
        <group key={y} position={[0,y,0]}>
          <mesh castShadow position={[0,0,openBack ? 0 : -.2]}><boxGeometry args={[width+.04,.06,openBack ? .58 : .45]} /><meshStandardMaterial color="#6b4b34" /></mesh>
          {bookSides.map((z, side) => Array.from({length: bookCount}).map((_,i) => {
            const leaveGap = openBack && ((i + shelf * 2) % 5 === 0 || (i + shelf) % 11 === 0);
            if (leaveGap) return null;
            return (
              <mesh key={`${side}-${i}`} castShadow={!openBack} position={[-width/2+.16+i*(width-.32)/(bookCount-1), .18, z]} rotation={[0,0,(i%3-1)*.03]}>
                <boxGeometry args={[openBack ? .16 : .11,.34+(i%2)*.08,openBack ? .34 : .24]} />
                <meshStandardMaterial color={bookColors[(i+shelf)%bookColors.length]} roughness={.82} />
              </mesh>
            );
          }))}
        </group>
      ))}
    </group>
  );
}

function OrbitalPorthole() {
  const earthTexture = useTexture(withBase("/earth-blue-marble.png"));
  const groupRef = useRef<THREE.Group>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const shader = useMemo(() => ({
    uniforms: {
      uMap: { value: earthTexture },
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D uMap;
      uniform float uTime;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      void main() {
        vec3 color = vec3(0.004, 0.009, 0.014);
        vec2 starCell = floor(vUv * vec2(220.0, 110.0));
        float star = step(0.9965, hash(starCell));
        color += star * vec3(0.34, 0.39, 0.39);

        vec2 center = vec2(0.5, -0.4);
        float radius = 1.28;
        vec2 p = (vUv - center) / radius;
        p.y *= 1.266;
        float r2 = dot(p, p);

        if (r2 < 1.0) {
          float z = sqrt(1.0 - r2);
          vec3 normal = normalize(vec3(p.x, p.y, z));
          float longitude = atan(normal.x, normal.z) / 6.2831853 + 0.51 + uTime * 0.0018;
          float latitude = asin(clamp(normal.y, -1.0, 1.0)) / 3.1415926 + 0.5;
          vec3 earth = texture2D(uMap, vec2(fract(longitude), latitude)).rgb;

          float luminance = dot(earth, vec3(0.299, 0.587, 0.114));
          earth = mix(vec3(luminance), earth, 0.68);
          earth *= vec3(0.72, 0.83, 0.82);

          vec3 sunDirection = normalize(vec3(-0.42, 0.54, 0.72));
          float daylight = smoothstep(-0.2, 0.52, dot(normal, sunDirection));
          earth *= mix(0.075, 0.92, daylight);

          float rim = pow(1.0 - z, 3.4);
          earth += vec3(0.16, 0.48, 0.55) * rim * (0.35 + daylight * 0.55);
          color = earth;
        }

        gl_FragColor = vec4(color, 1.0);
      }
    `,
  }), [earthTexture]);

  useEffect(() => {
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.needsUpdate = true;
  }, [earthTexture]);

  useFrame(({ camera }, delta) => {
    if (groupRef.current) groupRef.current.visible = camera.position.z < 3.69;
    if (shaderRef.current) shaderRef.current.uniforms.uTime.value += delta;
  });

  return (
    <group ref={groupRef} position={[-3.05, 2.1, 3.69]}>
      <mesh position={[0, 0, -.035]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[3.08, 3.9]} />
        <shaderMaterial ref={shaderRef} args={[shader]} side={THREE.FrontSide} toneMapped={false} />
      </mesh>
      {[-1.6, 1.6].map((x) => (
        <RoundedBox key={`side-${x}`} castShadow position={[x, 0, 0]} args={[.16, 4.2, .2]} radius={.045}>
          <meshStandardMaterial color="#242824" metalness={.62} roughness={.36} />
        </RoundedBox>
      ))}
      {[-2.02, 2.02].map((y) => (
        <RoundedBox key={`edge-${y}`} castShadow position={[0, y, 0]} args={[3.36, .16, .2]} radius={.045}>
          <meshStandardMaterial color="#242824" metalness={.62} roughness={.36} />
        </RoundedBox>
      ))}
      {[-.53, .53].map((x) => (
        <mesh key={`mullion-${x}`} castShadow position={[x, 0, -.005]}>
          <boxGeometry args={[.055, 3.96, .13]} />
          <meshStandardMaterial color="#30342f" metalness={.54} roughness={.4} />
        </mesh>
      ))}
      <mesh position={[0, 0, -.072]}>
        <planeGeometry args={[3.08, 3.9]} />
        <meshPhysicalMaterial color="#8da2a0" transparent opacity={.055} roughness={.12} metalness={.08} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <pointLight position={[0, -.12, -1.1]} color="#7faab0" intensity={1.4} distance={4.8} decay={2} />
    </group>
  );
}

function ReadingZone({ warm }: { warm: boolean }) {
  return (
    <group>
      <mesh receiveShadow position={[-2.65,.018,.25]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[4.6,7.05]} /><meshStandardMaterial color="#41352b" roughness={1} /></mesh>
      <Interactive id="readingBooks">
        <Bookcase position={[-4.72,2.1,-.35]} rotation={[0,-Math.PI/2,0]} width={3.1} height={4.2} />
      </Interactive>
      <Interactive id="professionalBooks">
        <Bookcase position={[-.3,2.1,-.98]} rotation={[0,-Math.PI/2,0]} width={5.85} height={4.2} openBack />
      </Interactive>
      <Bookcase position={[-3.55,.74,3.52]} width={2.35} height={1.45} />
      <OrbitalPorthole />
      <CigarChair />
      <mesh castShadow position={[-2.3,.48,-1.38]}><cylinderGeometry args={[.55,.6,.08,32]} /><meshStandardMaterial color="#6f4a31" /></mesh>
      <mesh castShadow position={[-2.3,.23,-1.38]}><cylinderGeometry args={[.07,.12,.5,16]} /><meshStandardMaterial color="#1d1e1b" metalness={.35} /></mesh>
      <mesh castShadow position={[-2.3,.04,-1.38]}><cylinderGeometry args={[.36,.42,.07,24]} /><meshStandardMaterial color="#1d1e1b" /></mesh>
      <group position={[-2.65,0,-2.58]}>
        <mesh castShadow position={[0,.76,0]}><cylinderGeometry args={[.035,.055,1.52,16]} /><meshStandardMaterial color="#171815" metalness={.4} /></mesh>
        <mesh castShadow position={[0,1.6,0]} rotation={[0,0,-.25]}><coneGeometry args={[.33,.52,24,1,true]} /><meshStandardMaterial color="#a36a3a" side={THREE.DoubleSide} /></mesh>
        <pointLight position={[.12,1.35,0]} color="#ffbd72" intensity={warm ? 16 : 0} distance={4.5} decay={2} />
      </group>
      <Interactive id="art">
        <group position={[-3.5,2.67,-3.77]}>
          <mesh castShadow><boxGeometry args={[1.45,1.18,.08]} /><meshStandardMaterial color="#171813" /></mesh>
          <mesh position={[0,0,.05]}><planeGeometry args={[1.27,1]} /><meshStandardMaterial color="#bf8b55" /></mesh>
          <mesh position={[-.15,.05,.061]} rotation={[0,0,.5]}><planeGeometry args={[.45,.75]} /><meshStandardMaterial color="#243a36" /></mesh>
          <mesh position={[.28,-.1,.062]} rotation={[0,0,-.45]}><circleGeometry args={[.24,24]} /><meshStandardMaterial color="#7f392c" /></mesh>
        </group>
      </Interactive>
    </group>
  );
}

function Desk() {
  const monitors = [
    { x: 1.72, y: 1.58, width: 1.2, height: .76, angle: .08 },
    { x: 2.74, y: 1.78, width: .72, height: 1.18, angle: -.08 },
  ];
  return (
    <group>
      <mesh castShadow receiveShadow position={[2.55,.88,-3.1]}><boxGeometry args={[4.6,.15,1.05]} /><meshStandardMaterial color="#6d4932" roughness={.58} /></mesh>
      {[.4,4.7].map(x => <group key={x} position={[x,.43,-3.1]}>{[-.4,.4].map(z => <mesh key={z} castShadow position={[0,0,z]}><boxGeometry args={[.1,.86,.1]} /><meshStandardMaterial color="#24251f" metalness={.35} /></mesh>)}</group>)}
      <Interactive id="monitors">
        {monitors.map(({ x, y, width, height, angle }, i) => (
          <group key={x} position={[x,y,-3.35]} rotation={[0,angle,0]}>
            <RoundedBox castShadow args={[width,height,.07]} radius={.04}><meshStandardMaterial color="#171a18" /></RoundedBox>
            <mesh position={[0,0,.041]}><planeGeometry args={[width-.12,height-.12]} /><meshStandardMaterial color={i===0?"#1a3837":"#352c3c"} emissive={i===0?"#0d2423":"#21182b"} emissiveIntensity={.8} /></mesh>
            <mesh castShadow position={[0,-height/2-.12,0]}><boxGeometry args={[.07,.24,.07]} /><meshStandardMaterial color="#20221f" /></mesh>
            <RoundedBox castShadow position={[0,-height/2-.24,.05]} args={[i===0?.52:.42,.05,.28]} radius={.025}><meshStandardMaterial color="#20221f" metalness={.22} /></RoundedBox>
          </group>
        ))}
        <RoundedBox castShadow position={[2.45,1.01,-2.73]} args={[1.2,.045,.33]} radius={.03}><meshStandardMaterial color="#262925" /></RoundedBox>
        <mesh castShadow position={[3.45,1.03,-2.72]}><sphereGeometry args={[.12,18,12]} /><meshStandardMaterial color="#2a2b27" /></mesh>
        <group position={[4.15,1.12,-2.85]}><mesh castShadow><cylinderGeometry args={[.13,.12,.26,20]} /><meshStandardMaterial color="#d2c2a0" /></mesh><mesh position={[.16,.03,0]}><torusGeometry args={[.09,.025,8,16,Math.PI*1.45]} /><meshStandardMaterial color="#d2c2a0" /></mesh></group>
      </Interactive>
    </group>
  );
}

function OfficeChair() {
  return (
    <group position={[2.55, .62, -.6]}>
      <RoundedBox castShadow position={[0, .23, 0]} args={[.92, .18, .84]} radius={.1}>
        <meshStandardMaterial color="#202421" roughness={.7} />
      </RoundedBox>
      <RoundedBox castShadow position={[0, .93, .34]} rotation={[.1, 0, 0]} args={[.94, 1.25, .2]} radius={.13}>
        <meshStandardMaterial color="#1d211f" roughness={.75} />
      </RoundedBox>
      {[-.57, .57].map((x) => (
        <group key={x} position={[x, .65, -.02]}>
          <mesh castShadow position={[0, -.2, .08]}><boxGeometry args={[.07, .48, .07]} /><meshStandardMaterial color="#272b28" metalness={.25} /></mesh>
          <RoundedBox castShadow position={[0, .05, -.04]} args={[.18, .09, .7]} radius={.04}><meshStandardMaterial color="#1d211f" /></RoundedBox>
        </group>
      ))}
      <mesh castShadow position={[0, -.18, 0]}><cylinderGeometry args={[.07, .09, .72, 16]} /><meshStandardMaterial color="#272b28" metalness={.4} /></mesh>
      {[0,1,2,3,4].map(i => (
        <group key={i} rotation={[0, i * 1.256, 0]}>
          <mesh castShadow position={[0, -.55, .34]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.035, .05, .68, 10]} /><meshStandardMaterial color="#242724" /></mesh>
          <mesh castShadow position={[0, -.58, .67]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[.07, .07, .1, 12]} /><meshStandardMaterial color="#171917" /></mesh>
        </group>
      ))}
    </group>
  );
}

function CoffeeStation() {
  const mugs = ["#c5b58d","#6d7f79","#a04e35","#d1d0c4","#7e6757","#d0b58c","#526966","#9f7352"];
  return (
    <group position={[4.62,0,0]} rotation={[0,-Math.PI/2,0]}>
      <group position={[-1.0,0,0]}>
        <mesh castShadow position={[0,.9,0]}><boxGeometry args={[2.3,1.8,.65]} /><meshStandardMaterial color="#514537" /></mesh>
        <mesh castShadow position={[0,1.86,0]}><boxGeometry args={[2.35,.08,.7]} /><meshStandardMaterial color="#78624a" /></mesh>
        <mesh castShadow position={[0,1.3,.35]}><boxGeometry args={[2.15,.06,.05]} /><meshStandardMaterial color="#2c2b26" /></mesh>
        {mugs.map((color,index) => <group key={`${color}-${index}`} position={[-.84+index*.24,1.52,.22]}><mesh castShadow><cylinderGeometry args={[.085,.075,.19,16]} /><meshStandardMaterial color={color} /></mesh><mesh position={[.1,.01,0]}><torusGeometry args={[.06,.018,8,14]} /><meshStandardMaterial color={color} /></mesh></group>)}

        <Interactive id="coffee">
          <group position={[-.58,0,0]}>
            <RoundedBox castShadow position={[0,2.15,0]} args={[.66,.56,.54]} radius={.055}><meshStandardMaterial color="#272b28" metalness={.28} roughness={.42} /></RoundedBox>
            <mesh castShadow position={[0,2.52,-.02]}><cylinderGeometry args={[.16,.2,.2,20]} /><meshStandardMaterial color="#3c413d" transparent opacity={.78} roughness={.25} /></mesh>
            <mesh position={[0,2.3,.276]}><boxGeometry args={[.42,.14,.025]} /><meshStandardMaterial color="#111411" emissive="#173327" emissiveIntensity={.55} /></mesh>
            {[-.12,.12].map((x) => <mesh key={x} position={[x,2.3,.294]}><circleGeometry args={[.025,14]} /><meshStandardMaterial color={x < 0 ? "#d6b56d" : "#819d8b"} emissive={x < 0 ? "#6d4c1f" : "#294d38"} /></mesh>)}
            <mesh castShadow position={[0,2.11,.32]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.055,.055,.18,14]} /><meshStandardMaterial color="#b4aaa0" metalness={.72} roughness={.2} /></mesh>
            <mesh castShadow position={[0,2.0,.34]}><boxGeometry args={[.36,.035,.22]} /><meshStandardMaterial color="#141715" metalness={.3} /></mesh>
            {[[-.22,2.16],[.22,2.16]].map(([x,y]) => <mesh key={x} castShadow position={[x,y,.3]}><cylinderGeometry args={[.032,.032,.05,12]} /><meshStandardMaterial color="#c1b5a5" metalness={.7} /></mesh>)}
          </group>
        </Interactive>

        <Interactive id="recordPlayer">
          <group position={[.55,1.93,0]}>
            <RoundedBox castShadow position={[0,.03,0]} args={[.96,.13,.58]} radius={.045}><meshStandardMaterial color="#332a24" roughness={.55} /></RoundedBox>
            <mesh castShadow position={[-.12,.12,0]}><cylinderGeometry args={[.265,.265,.055,32]} /><meshStandardMaterial color="#121412" roughness={.28} /></mesh>
            <mesh position={[-.12,.151,0]}><cylinderGeometry args={[.07,.07,.012,24]} /><meshStandardMaterial color="#9c3e32" roughness={.7} /></mesh>
            <mesh castShadow position={[.34,.14,.16]}><cylinderGeometry args={[.07,.075,.1,16]} /><meshStandardMaterial color="#b5aa98" metalness={.58} /></mesh>
            <mesh castShadow position={[.18,.2,.03]} rotation={[0,-.68,0]}><boxGeometry args={[.035,.035,.48]} /><meshStandardMaterial color="#c5b9a8" metalness={.65} /></mesh>
            <mesh position={[-.42,.12,.2]}><circleGeometry args={[.025,12]} /><meshStandardMaterial color="#d8b15f" emissive="#7f501e" emissiveIntensity={.8} /></mesh>
          </group>
        </Interactive>
      </group>
      <group position={[1.65,0,.17]}>
        <RoundedBox castShadow position={[0,1.35,0]} args={[1.18,2.7,1.05]} radius={.07}>
          <meshStandardMaterial color="#555a56" metalness={.28} roughness={.48} />
        </RoundedBox>
        <RoundedBox castShadow position={[0,1.74,.545]} args={[1.04,1.68,.035]} radius={.035}>
          <meshStandardMaterial color="#666b66" metalness={.32} roughness={.42} />
        </RoundedBox>
        <RoundedBox castShadow position={[0,.49,.545]} args={[1.04,.7,.035]} radius={.035}>
          <meshStandardMaterial color="#606560" metalness={.32} roughness={.42} />
        </RoundedBox>
        <mesh castShadow position={[.42,1.72,.59]}><boxGeometry args={[.055,1.15,.06]} /><meshStandardMaterial color="#252825" metalness={.55} /></mesh>
        <mesh castShadow position={[.42,.48,.59]}><boxGeometry args={[.055,.42,.06]} /><meshStandardMaterial color="#252825" metalness={.55} /></mesh>
        <mesh position={[-.3,2.35,.59]}><boxGeometry args={[.28,.12,.025]} /><meshStandardMaterial color="#222724" emissive="#17251f" emissiveIntensity={.6} /></mesh>
      </group>
    </group>
  );
}

function WorkZone({ warm }: { warm: boolean }) {
  return (
    <group>
      <mesh receiveShadow position={[2.35,.012,.1]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[5.1,7.05]} /><meshStandardMaterial color="#313531" roughness={1} /></mesh>
      <Desk />
      <group position={[2.55,2.67,-3.7]}>
        <RoundedBox castShadow args={[3.55,.1,.1]} radius={.04}>
          <meshStandardMaterial color="#272822" roughness={.5} />
        </RoundedBox>
        <mesh position={[0,0,.056]}>
          <planeGeometry args={[3.42,.055]} />
          <meshStandardMaterial color="#fff4dd" emissive={warm ? "#ffd89a" : "#c6e3ff"} emissiveIntensity={3.4} />
        </mesh>
        {[-1.15,0,1.15].map((x) => (
          <pointLight key={x} position={[x,-.24,.58]} color={warm ? "#ffd39a" : "#bbdcff"} intensity={warm ? 7 : 5} distance={4.2} decay={2} />
        ))}
      </group>
      <OfficeChair />
      <CoffeeStation />
      <Interactive id="whiteboard">
        <group position={[2.55,2.33,3.66]}>
          <RoundedBox castShadow args={[2.55,1.45,.09]} radius={.05}><meshStandardMaterial color="#d5d2c6" roughness={.32} /></RoundedBox>
          <mesh position={[0,-.79,0]}><boxGeometry args={[2.7,.06,.17]} /><meshStandardMaterial color="#292c29" /></mesh>
          {[
            [-.78,.3,.48,.018],[-.42,.3,.16,.018],[-.23,.3,.08,.1],[-.06,.3,.2,.018],[.24,.3,.36,.018],[.58,.3,.12,.018],
            [-.7,.02,.62,.018],[-.22,.02,.12,.018],[-.02,.02,.26,.018],[.33,.02,.22,.018],[.62,.02,.12,.018],
            [-.62,-.28,.38,.018],[-.31,-.28,.08,.1],[-.14,-.28,.2,.018],[.17,-.28,.34,.018],[.51,-.28,.2,.018],
          ].map(([x,y,w,h],i) => (
            <mesh key={i} position={[x,y,-.051]}>
              <planeGeometry args={[w,h]} />
              <meshStandardMaterial color="#2f4b49" side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      </Interactive>
    </group>
  );
}

function Architecture() {
  return (
    <group>
      <mesh receiveShadow position={[0,-.04,0]}><boxGeometry args={[10,.08,7.8]} /><meshStandardMaterial color="#252824" roughness={1} /></mesh>
      <group position={[-1.85,1.1,-3.78]} rotation={[0,0,0]}>
        <mesh castShadow><boxGeometry args={[1.25,2.2,.08]} /><meshStandardMaterial color="#574636" /></mesh>
        <mesh position={[.42,0,.06]}><sphereGeometry args={[.045,12,8]} /><meshStandardMaterial color="#c9a967" metalness={.7} /></mesh>
      </group>
    </group>
  );
}

function CameraRig({ view, selection, controlsRef, paused }: { view: ViewName; selection: Selection | null; controlsRef: React.RefObject<OrbitControlsImpl | null>; paused: boolean }) {
  const { camera } = useThree();
  const animating = useRef(true);
  const desiredCamera = useMemo(() => new THREE.Vector3(...(selection?.camera ?? views[view].camera)), [selection, view]);
  const desiredTarget = useMemo(() => new THREE.Vector3(...(selection?.target ?? views[view].target)), [selection, view]);
  useEffect(() => { animating.current = true; }, [view, selection?.id]);
  useFrame(() => {
    if (paused || !animating.current) return;
    camera.position.lerp(desiredCamera, .032);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(desiredTarget, .04);
      controlsRef.current.update();
      if (camera.position.distanceTo(desiredCamera) < .025 && controlsRef.current.target.distanceTo(desiredTarget) < .025) {
        camera.position.copy(desiredCamera);
        controlsRef.current.target.copy(desiredTarget);
        animating.current = false;
      }
    }
  });
  return null;
}

function Scene({ view, selection, setSelection, warm }: { view: ViewName; selection: Selection | null; setSelection: (selection: Selection | null) => void; warm: boolean }) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [userControlling, setUserControlling] = useState(false);
  useEffect(() => { setUserControlling(false); }, [view, selection?.id]);
  return (
    <RoomContext.Provider value={{ setSelection }}>
      <color attach="background" args={[warm ? "#171915" : "#11161a"]} />
      <fog attach="fog" args={[warm ? "#171915" : "#11161a", 11, 23]} />
      <ambientLight intensity={warm ? .48 : .28} color={warm ? "#ffd9a4" : "#b7d8ff"} />
      <directionalLight castShadow position={[3,7,3]} intensity={warm ? 2.3 : 1.55} color={warm ? "#ffe2ae" : "#d6e8ff"} shadow-mapSize={[1024,1024]} />
      <pointLight position={[1.4,2.4,-2]} intensity={warm ? 8 : 3} color={warm ? "#ffc77d" : "#9fc8ff"} distance={8} decay={2} />
      <Architecture />
      <ReadingZone warm={warm} />
      <WorkZone warm={warm} />
      <ContactShadows position={[0,.02,0]} opacity={.42} scale={14} blur={2.5} far={6} frames={1} />
      <Environment preset="warehouse" environmentIntensity={.24} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        enableRotate
        enableZoom
        dampingFactor={.07}
        rotateSpeed={.72}
        zoomSpeed={1.15}
        minDistance={2.1}
        maxDistance={18}
        minPolarAngle={.25}
        maxPolarAngle={1.5}
        onStart={() => setUserControlling(true)}
      />
      <CameraRig view={view} selection={selection} controlsRef={controlsRef} paused={userControlling} />
    </RoomContext.Provider>
  );
}

export function StudyRoom() {
  const [view, setView] = useState<ViewName>("overview");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [warm, setWarm] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const [recordTrackIndex, setRecordTrackIndex] = useState(0);
  const [recordPlaying, setRecordPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recordTrack = recordTracks[recordTrackIndex];
  const opensContent = selection ? ["readingBooks", "professionalBooks", "art", "recordPlayer", "whiteboard"].includes(selection.id) : false;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    audio.volume = .68;
    if (recordPlaying) audio.play().catch(() => setRecordPlaying(false));
  }, [recordTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (recordPlaying) audio.play().catch(() => setRecordPlaying(false));
    else audio.pause();
  }, [recordPlaying]);

  useEffect(() => () => audioRef.current?.pause(), []);

  useEffect(() => {
    setContentReady(false);
    if (!opensContent) return;
    const timer = window.setTimeout(() => setContentReady(true), 1250);
    return () => window.clearTimeout(timer);
  }, [selection?.id, opensContent]);
  const stopRecord = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setRecordPlaying(false);
  };
  const chooseView = (next: ViewName) => { setSelection(null); setView(next); };
  return (
    <main className="room-app">
      <audio
        ref={audioRef}
        src={recordTrack.src}
        preload="metadata"
        onEnded={() => setRecordTrackIndex((index) => (index + 1) % recordTracks.length)}
      />
      <div className="scene" aria-label="可交互的三维私人书房">
        <Canvas shadows dpr={[1,1.35]} camera={{ position: views.overview.camera, fov: 38, near: .1, far: 100 }} onPointerMissed={() => setSelection(null)}>
          <Suspense fallback={null}><Scene view={view} selection={selection} setSelection={setSelection} warm={warm} /></Suspense>
        </Canvas>
      </div>

      <header className="topbar">
        <div className="brand"><span className="brand-mark" /><div><h1>The Quiet Split</h1><p>Interactive private study · 01</p></div></div>
        <nav className="view-switcher" aria-label="预设视角">
          {(["overview","seat","reading","work"] as ViewName[]).map((item) => <button key={item} className={view===item && !selection ? "active" : ""} onClick={() => chooseView(item)}>{({overview:"全景",seat:"入座",reading:"阅读",work:"办公"})[item]}</button>)}
        </nav>
      </header>

      <div className="instructions" aria-hidden="true"><span>拖拽旋转</span><span>滚轮缩放</span><span>点击探索</span></div>
      <button className="light-toggle" onClick={() => setWarm(value => !value)} aria-label="切换书房灯光"><span className={`light-dot ${warm ? "" : "off"}`} />{warm ? "暖光开启" : "冷光模式"}</button>

      {selection && opensContent && contentReady && (
        <ContentExperience
          selection={selection}
          onClose={() => setSelection(null)}
          recordPlayer={{
            trackIndex: recordTrackIndex,
            playing: recordPlaying,
            onToggle: () => setRecordPlaying((value) => !value),
            onStop: stopRecord,
            onSelectTrack: (index) => { setRecordTrackIndex(index); setRecordPlaying(true); },
          }}
        />
      )}
    </main>
  );
}
