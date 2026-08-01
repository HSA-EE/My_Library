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

// 修改书评时，只需要替换对应书目的 note 内容。
// colors 控制文字封面的两种渐变颜色。
export const readingLibrary: BookEntry[] = [
  { title: "黄金时代", author: "王小波", category: "小说 · 中国文学", note: "初二时买下这本书，算下来已经跟着我十六七年了。它从一本书变成了某种随身物件，见证住处、书架和我的变化。每次翻开，都像重新碰到那个刚开始认真读小说的自己。", colors: ["#d6aa43", "#7a3b23"] },
  { title: "星星是冰冷的玩具", author: "谢尔盖·卢基扬年科", category: "科幻 · 太空歌剧", note: "这本书展示了苏联给俄罗斯民族留下的持久 PTSD，以至于他们不得不写大量故事去攻击一具早已死去的尸体。宏大的太空叙事背后，真正挥之不去的是历史留下的羞耻、恐惧与反抗。它不像一场遥远的星际战争，更像一次迟到的民族心理清算。", colors: ["#142c49", "#5986a0"] },
  { title: "献给阿尔吉侬的花束", author: "丹尼尔·凯斯", category: "科幻 · 心理", note: "只争朝夕", colors: ["#d8cbb6", "#765f54"] },
  { title: "你一生的故事", author: "特德·姜", category: "科幻 · 时间与语言", note: "语言在这里不只是表达思想的工具，而是改变时间知觉的器官。明知结局之后仍然走入人生，并不是屈服，而是另一种更彻底的选择。它把宿命写得如此温柔，以至于自由意志似乎也不再需要胜负。", colors: ["#3e5362", "#b28a67"] },
  { title: "地海巫师", author: "厄休拉·勒古恩", category: "奇幻 · 地海系列 I", note: "格得最大的敌人不是外部世界，而是被自己傲慢释放出来的阴影。真正的成长并不是获得更强的法术，而是终于能够说出阴影的名字。地海的力量因此始终带着克制，与今天常见的升级故事很不一样。", colors: ["#244f4b", "#c49a54"] },
  { title: "阿图安的墓穴", author: "厄休拉·勒古恩", category: "奇幻 · 地海系列 II", note: "这一本把辽阔的地海收缩成了漫长、潮湿而沉默的地下迷宫。恬娜从被赋予的身份中夺回名字，也重新学会选择光明。自由在这里不是推开一扇门，而是承认门外的世界确实存在。", colors: ["#2f3135", "#8a684d"] },
  { title: "呼吸", author: "特德·姜", category: "科幻 · 短篇集", note: "闭上眼睛，就是精密的气体驱动大脑中闪动纷飞的气门。气门的开合状态组成思维，也组成幻梦。意识因此显得既机械又脆弱，而有限的空气让每一次思考都带着倒计时。", colors: ["#623c31", "#d29b68"] },
  { title: "领悟", author: "特德·姜", category: "科幻 · 智识", note: "超人类智能是超越人类的，既无法理解，更无法刻画。小说真正高明的地方，是让我们只能从边缘感受它留下的压力与形状。任何能够被完整写清楚的“超人类”，最终都仍然只是放大后的人类。", colors: ["#334d66", "#8b99aa"] },
  { title: "生死疲劳", author: "莫言", category: "小说 · 中国文学", note: "六次轮回把个人恩怨拉长成一部乡土社会的编年史。它喧闹、夸张，甚至粗粝，却比一本正经的历史更接近生活的体温。人不停变成别的动物，执念却始终保持着人的形状。", colors: ["#7c2f25", "#c39245"] },
  { title: "看不见的城市", author: "伊塔洛·卡尔维诺", category: "小说 · 城市", note: "每一座城市都像一个关于欲望、记忆或死亡的思想模型。它们看似来自远方，其实不断折返回我们居住的同一座城市。旅行最后不是为了看见更多地方，而是为了学会辨认自己身处何处。", colors: ["#657d71", "#d0ae72"] },
  { title: "索拉里斯星", author: "斯坦尼斯瓦夫·莱姆", category: "科幻 · 哲思", note: "人类来到索拉里斯，以为任务是理解一种异星智能，最后遇见的却全是自己的记忆。真正的未知不是尚未翻译的语言，而是完全拒绝进入人类意义系统的存在。那片海越沉默，人类的自恋就越响亮。", colors: ["#243e43", "#b36f4b"] },
  { title: "局外人", author: "阿尔贝·加缪", category: "小说 · 法国文学", note: "默尔索并非没有感受，只是拒绝按照社会规定的方式表演感受。审判最终针对的不是他的罪行，而是他没有在母亲葬礼上哭。荒诞并不来自世界毫无意义，而来自人们迫切要求它必须显得有意义。", colors: ["#d8c18e", "#66788a"] },
  { title: "银河系漫游指南", author: "道格拉斯·亚当斯", category: "科幻 · 喜剧", note: "宇宙越宏大，生活中的官僚主义和愚蠢就越显得无处不在。它用最不正经的方式处理最严肃的问题，再把答案写成四十二。读完之后并不会更理解宇宙，但至少知道出门要带毛巾。", colors: ["#344c3b", "#87a061"] },
  { title: "海边的卡夫卡", author: "村上春树", category: "小说 · 日本文学", note: "森林、图书馆和梦境组成了一条通往内心深处的隐秘道路。人物似乎一直在逃离命运，却又主动走进命运为他们准备的房间。它的许多谜没有答案，但留下了足够长久的回声。", colors: ["#5c3447", "#b77574"] },
  { title: "黑暗的左手", author: "厄休拉·勒古恩", category: "科幻 · 性别与社会", note: "勒古恩不是简单地取消性别，而是借此拆掉读者习以为常的观察坐标。漫长冰原上的同行，比任何政治报告都更能说明信任如何发生。真正陌生的从来不是格森人，而是我们自己那些未经检查的常识。", colors: ["#263c4a", "#97a8ad"] },
  { title: "一无所有", author: "厄休拉·勒古恩", category: "科幻 · 社会构想", note: "两个世界都拥有自己的自由，也拥有自己不愿承认的牢笼。谢维克的旅程不是选择更好的制度，而是拒绝让任何制度停止被质疑。最动人的不是乌托邦蓝图，而是那堵必须一次次推倒的墙。", colors: ["#705841", "#b7a47d"] },
  { title: "海伯利安", author: "丹·西蒙斯", category: "科幻 · 太空歌剧", note: "七位朝圣者带着七种完全不同的故事走向同一个谜。它把太空歌剧、侦探小说、战争回忆和宗教寓言缝合在一起，却仍然保持各自的质地。读到最后，最可怕的并不是伯劳，而是时间本身。", colors: ["#4b343f", "#a65e54"] },
  { title: "童年的终结", author: "阿瑟·克拉克", category: "科幻 · 文明演化", note: "一个没有战争、贫困与匮乏的世界，未必仍然属于人类。克拉克把乌托邦写成了物种终结前短暂而安静的候车室。站在文明尺度上，幸福与灭亡竟然可以是同一件事。", colors: ["#315267", "#8fb2bd"] },
  { title: "莱博维茨的赞歌", author: "小沃尔特·M·米勒", category: "科幻 · 文明循环", note: "知识被保存下来，并不意味着人类会因此变得更加明智。修道院跨越漫长年代守护文明的火种，最后看着它再次点燃世界。历史并非简单重复，而是人类一次次用更精密的工具犯同样的错误。", colors: ["#4a4031", "#aa8d5e"] },
  { title: "百年孤独", author: "加西亚·马尔克斯", category: "小说 · 拉美文学", note: "布恩迪亚家族不断使用相同的名字，也不断走回相似的命运。魔幻并不是对现实的逃离，而是现实本身已经荒诞到只能如此讲述。直到最后一页，时间才忽然合拢，仿佛整本书早已写完并等待我们读到。", colors: ["#80682f", "#3d6656"] },
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
export const travelGallery: TravelEntry[] = [
  { title: "舷窗之外", location: "海上航行", year: "年份待补充", image: "/travel/舷窗.jpg" },
  { title: "飞往上海的云", location: "上海上空", year: "年份待补充", image: "/travel/云-上海.jpg" },
  { title: "飞往东京的云 · I", location: "东京上空", year: "年份待补充", image: "/travel/云-东京-1.jpg" },
  { title: "飞往东京的云 · II", location: "东京上空", year: "年份待补充", image: "/travel/云-东京-2.jpg" },
  { title: "雪山与云", location: "新疆", year: "年份待补充", image: "/travel/新疆-0.jpg" },
  { title: "玉龙雪山窗景", location: "云南 · 丽江", year: "年份待补充", image: "/travel/丽江-1.jpg" },
  { title: "丽江 · II", location: "云南 · 丽江", year: "年份待补充", image: "/travel/丽江-2.jpg" },
  { title: "丽江 · III", location: "云南 · 丽江", year: "年份待补充", image: "/travel/丽江-3.jpg" },
  { title: "大理窗景", location: "云南 · 大理", year: "年份待补充", image: "/travel/大理-1.jpg" },
  { title: "大理 · II", location: "云南 · 大理", year: "年份待补充", image: "/travel/大理-2.jpg" },
  { title: "大理 · III", location: "云南 · 大理", year: "年份待补充", image: "/travel/大理-3.jpg" },
  { title: "大理 · IV", location: "云南 · 大理", year: "年份待补充", image: "/travel/大理-4.jpg" },
  { title: "大理 · V", location: "云南 · 大理", year: "年份待补充", image: "/travel/大理-5.jpg" },
  { title: "大理 · VI", location: "云南 · 大理", year: "年份待补充", image: "/travel/大理-6.jpg" },
  { title: "大理 · VII", location: "云南 · 大理", year: "年份待补充", image: "/travel/大理-7.jpg" },
  { title: "大理 · VIII", location: "云南 · 大理", year: "年份待补充", image: "/travel/大理-8.jpg" },
  { title: "大理 · IX", location: "云南 · 大理", year: "年份待补充", image: "/travel/大理-9.jpg" },
  { title: "大理 · X", location: "云南 · 大理", year: "年份待补充", image: "/travel/大理-10.jpg" },
  { title: "古城窗外", location: "山西 · 大同", year: "年份待补充", image: "/travel/大同.jpg" },
  { title: "湿地的天空", location: "黑龙江 · 杜尔伯特", year: "年份待补充", image: "/travel/杜尔伯特-1.jpg" },
  { title: "海与口琴", location: "浙江 · 枸杞岛", year: "年份待补充", image: "/travel/枸杞岛-1.jpg" },
  { title: "枸杞岛 · II", location: "浙江 · 枸杞岛", year: "年份待补充", image: "/travel/枸杞岛-2.jpg" },
  { title: "枸杞岛 · III", location: "浙江 · 枸杞岛", year: "年份待补充", image: "/travel/枸杞岛-3.jpg" },
  { title: "枸杞岛 · IV", location: "浙江 · 枸杞岛", year: "年份待补充", image: "/travel/枸杞岛-4.jpg" },
  { title: "枸杞岛 · V", location: "浙江 · 枸杞岛", year: "年份待补充", image: "/travel/枸杞岛-5.jpg" },
  { title: "枸杞岛 · VI", location: "浙江 · 枸杞岛", year: "年份待补充", image: "/travel/枸杞岛-6.jpg" },
  { title: "枸杞岛 · VII", location: "浙江 · 枸杞岛", year: "年份待补充", image: "/travel/枸杞岛-7.jpg" },
  { title: "枸杞岛 · VIII", location: "浙江 · 枸杞岛", year: "年份待补充", image: "/travel/枸杞岛-8.jpg" },
  { title: "日本旅途 · I", location: "日本", year: "年份待补充", image: "/travel/日本-1.jpg" },
  { title: "日本旅途 · II", location: "日本", year: "年份待补充", image: "/travel/日本-2.jpg" },
  { title: "江之岛鱼见亭", location: "日本 · 江之岛", year: "年份待补充", image: "/travel/日本-3-江之岛鱼见亭.jpg" },
  { title: "东京台场", location: "日本 · 东京", year: "年份待补充", image: "/travel/日本-4-东京台场.jpg" },
  { title: "清水寺的红灯笼", location: "日本 · 京都", year: "年份待补充", image: "/travel/日本-5-京都清水寺.jpg" },
  { title: "大阪 USJ", location: "日本 · 大阪", year: "年份待补充", image: "/travel/日本-6-大阪usj.jpg" },
  { title: "日本旅途 · VII", location: "日本", year: "年份待补充", image: "/travel/日本-7.jpg" },
  { title: "日本旅途 · VIII", location: "日本", year: "年份待补充", image: "/travel/日本-8.jpg" },
  { title: "雨夜车窗", location: "上海", year: "年份待补充", image: "/travel/上海-1.jpg" },
  { title: "雪中的小熊猫 · I", location: "地点待补充", year: "年份待补充", image: "/travel/小熊猫-1.jpg" },
  { title: "雪中的小熊猫 · II", location: "地点待补充", year: "年份待补充", image: "/travel/小熊猫-2.jpg" },
];
