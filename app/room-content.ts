export type BookEntry = {
  title: string;
  author: string;
  category: string;
  note: string;
  colors: [string, string];
};

export type TravelEntry = {
  title: string;
  location: string;
  year: string;
  image?: string;
};

export type TravelAlbum = {
  title: string;
  location: string;
  year: string;
  cover?: string;
  photos: TravelEntry[];
};

// 修改书评时，只需要替换对应书目的 note 内容。
// colors 控制文字封面的两种渐变颜色。
export const readingLibrary: BookEntry[] = [
  { title: "黄金时代", author: "王小波", category: "小说 · 中国文学", note: "阅读笔记待整理", colors: ["#d6aa43", "#7a3b23"] },
  { title: "星星是冰冷的玩具", author: "谢尔盖·卢基扬年科", category: "科幻 · 太空歌剧", note: "阅读笔记待整理", colors: ["#142c49", "#5986a0"] },
  { title: "献给阿尔吉侬的花束", author: "丹尼尔·凯斯", category: "科幻 · 心理", note: "阅读笔记待整理", colors: ["#d8cbb6", "#765f54"] },
  { title: "你一生的故事", author: "特德·姜", category: "科幻 · 时间与语言", note: "阅读笔记待整理", colors: ["#3e5362", "#b28a67"] },
  { title: "地海巫师", author: "厄休拉·勒古恩", category: "奇幻 · 地海系列 I", note: "阅读笔记待整理", colors: ["#244f4b", "#c49a54"] },
  { title: "阿图安的墓穴", author: "厄休拉·勒古恩", category: "奇幻 · 地海系列 II", note: "阅读笔记待整理", colors: ["#2f3135", "#8a684d"] },
  { title: "呼吸", author: "特德·姜", category: "科幻 · 短篇集", note: "阅读笔记待整理", colors: ["#623c31", "#d29b68"] },
  { title: "领悟", author: "特德·姜", category: "科幻 · 智识", note: "阅读笔记待整理", colors: ["#334d66", "#8b99aa"] },
  { title: "生死疲劳", author: "莫言", category: "小说 · 中国文学", note: "阅读笔记待整理", colors: ["#7c2f25", "#c39245"] },
  { title: "看不见的城市", author: "伊塔洛·卡尔维诺", category: "小说 · 城市", note: "阅读笔记待整理", colors: ["#657d71", "#d0ae72"] },
  { title: "索拉里斯星", author: "斯坦尼斯瓦夫·莱姆", category: "科幻 · 哲思", note: "阅读笔记待整理", colors: ["#243e43", "#b36f4b"] },
  { title: "局外人", author: "阿尔贝·加缪", category: "小说 · 法国文学", note: "阅读笔记待整理", colors: ["#d8c18e", "#66788a"] },
  { title: "银河系漫游指南", author: "道格拉斯·亚当斯", category: "科幻 · 喜剧", note: "阅读笔记待整理", colors: ["#344c3b", "#87a061"] },
  { title: "海边的卡夫卡", author: "村上春树", category: "小说 · 日本文学", note: "阅读笔记待整理", colors: ["#5c3447", "#b77574"] },
  { title: "黑暗的左手", author: "厄休拉·勒古恩", category: "科幻 · 性别与社会", note: "阅读笔记待整理", colors: ["#263c4a", "#97a8ad"] },
  { title: "一无所有", author: "厄休拉·勒古恩", category: "科幻 · 社会构想", note: "阅读笔记待整理", colors: ["#705841", "#b7a47d"] },
  { title: "海伯利安", author: "丹·西蒙斯", category: "科幻 · 太空歌剧", note: "阅读笔记待整理", colors: ["#4b343f", "#a65e54"] },
  { title: "童年的终结", author: "阿瑟·克拉克", category: "科幻 · 文明演化", note: "阅读笔记待整理", colors: ["#315267", "#8fb2bd"] },
  { title: "莱博维茨的赞歌", author: "小沃尔特·M·米勒", category: "科幻 · 文明循环", note: "阅读笔记待整理", colors: ["#4a4031", "#aa8d5e"] },
  { title: "百年孤独", author: "加西亚·马尔克斯", category: "小说 · 拉美文学", note: "阅读笔记待整理", colors: ["#80682f", "#3d6656"] },
];

export const professionalLibrary: BookEntry[] = [
  { title: "高等工程流体力学", author: "专业教材", category: "流体力学 · 理论", note: "阅读笔记待整理。这里可以汇总关键章节、常用公式、推导索引以及与研究课题的关联。", colors: ["#183f5a", "#5289a2"] },
  { title: "Order-of-Magnitude Physics", author: "Sanjoy Mahajan", category: "尺度分析 · 估算", note: "阅读笔记待整理。适合记录最常复用的量纲分析方法和数量级估算案例。", colors: ["#702d31", "#c88355"] },
  { title: "Computational Fluid Dynamics", author: "Reference Shelf", category: "CFD · 数值方法", note: "阅读笔记待整理。可放置离散格式、稳定性、收敛性与验证算例的索引。", colors: ["#24384a", "#8197a5"] },
  { title: "Turbulence", author: "Research Notes", category: "湍流 · 模型", note: "研究笔记待整理。记录不同模型的适用范围、假设以及实验或数值结果对照。", colors: ["#2c4d45", "#80a28f"] },
  { title: "Numerical Heat Transfer", author: "Reference Shelf", category: "传热 · 计算", note: "阅读笔记待整理。这里可以沉淀边界条件处理和耦合计算经验。", colors: ["#783c2c", "#c99258"] },
  { title: "论文集 · I", author: "Published Work", category: "个人论文 · 已发表", note: "论文信息待补充。未来可以加入摘要、作者列表、期刊信息、DOI 和项目页面链接。", colors: ["#403a62", "#8880b0"] },
  { title: "论文集 · II", author: "Working Papers", category: "个人论文 · 进行中", note: "内容待补充。可展示正在推进的研究问题、方法、阶段性结果与合作者。", colors: ["#4a4b43", "#979784"] },
  { title: "实验与算例档案", author: "Lab Archive", category: "数据 · 验证", note: "内容待补充。用于收纳基准算例、实验装置、数据说明和复现实验入口。", colors: ["#315052", "#77a1a0"] },
];

// 把照片放在 public/travel/ 目录后，将 image 写成 "/travel/文件名.jpg"。
export const travelGallery: TravelAlbum[] = [
  {
    title: "广州",
    location: "广州",
    year: "2026",
    cover: "/travel/guangzhou/guangzhou-cover.jpg",
    photos: [
      { title: "广州 · I", location: "广州", year: "2026", image: "/travel/guangzhou/guangzhou-01.jpg" },
      { title: "广州 · 封面", location: "广州", year: "2026", image: "/travel/guangzhou/guangzhou-cover.jpg" },
      { title: "广州 · II", location: "广州", year: "2026", image: "/travel/guangzhou/guangzhou-02.jpg" },
      { title: "广州 · III", location: "广州", year: "2026", image: "/travel/guangzhou/guangzhou-03.jpg" },
      { title: "广州 · IV", location: "广州", year: "2026", image: "/travel/guangzhou/guangzhou-04.jpg" },
    ],
  },
  {
    title: "江西",
    location: "江西",
    year: "2026",
    cover: "/travel/jiangxi/jiangxi-cover.jpg",
    photos: [
      { title: "江西 · I", location: "江西", year: "2026", image: "/travel/jiangxi/jiangxi-01.jpg" },
      { title: "江西 · II", location: "江西", year: "2026", image: "/travel/jiangxi/jiangxi-02.jpg" },
      { title: "江西 · 封面", location: "江西", year: "2026", image: "/travel/jiangxi/jiangxi-cover.jpg" },
    ],
  },
];
