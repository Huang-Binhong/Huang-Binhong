// src/services/TimelineDataService.js

// 黄宾虹生平事件数据（包含所有年份）
export const getTimelineEvents = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 个人事件数据（移除 historicalEvents 字段）
            const personalEvents = [
                {
                    id: 1,
                    year: 1865,
                    title: '出生于浙江金华',
                    description: '1月27日黄宾虹出生于浙江金华铁岭头街。',
                    type: 'birth',
                    location: '浙江金华',
                    period: '早年求学',
                    detailedContent: '黄宾虹，原名质，字朴存，号宾虹，1865年1月27日出生于浙江金华铁岭头街的一个书香门第。其家族为当地书香门第，自幼受到严格的传统文化教育，为后来的艺术创作奠定了坚实基础。',
                    relatedWorks: []
                },
                {
                    id: 2,
                    year: 1879,
                    title: '考取丽正、长山两书院',
                    description: '考取丽正、长山两书院并获得奖学金。',
                    type: 'education',
                    location: '浙江金华',
                    period: '早年求学',
                    detailedContent: '少年黄宾虹展现出卓越的文学天赋，成功考取丽正书院和长山书院，并获得奖学金，开始了系统的传统文化学习。',
                    relatedWorks: []
                },
                {
                    id: 3,
                    year: 1881,
                    title: '师从陈春帆学画',
                    description: '师从于陈春帆学画，正式开始绘画学习。',
                    type: 'education',
                    location: '浙江金华',
                    period: '早年求学',
                    detailedContent: '拜当地著名画家陈春帆为师，系统学习传统绘画技法，为日后成为一代艺术大师奠定基础。',
                    relatedWorks: []
                },
                {
                    id: 4,
                    year: 1885,
                    title: '游览大江南北山水',
                    description: '出新安江经杭州、南京至扬州游览大江南北山水沿途写生。',
                    type: 'travel',
                    location: '浙江、江苏',
                    period: '早年求学',
                    detailedContent: '黄宾虹开始游历生涯，从新安江出发，途经杭州、南京至扬州，沿途写生，感受各地山水风光，为后来的山水画创作积累素材。',
                    relatedWorks: []
                },
                {
                    id: 5,
                    year: 1886,
                    title: '师从郑姗、陈若水',
                    description: '师从于画家郑姗绘山水又从学于陈若水绘花鸟。',
                    type: 'education',
                    location: '浙江金华',
                    period: '早年求学',
                    detailedContent: '先后师从郑姗学习山水画，向陈若水学习花鸟画，广泛涉猎不同画科，艺术修养日益深厚。',
                    relatedWorks: []
                },
                {
                    id: 6,
                    year: 1889,
                    title: '师从汪仲伊习艺',
                    description: '师从于汪仲伊并习弹琴、击剑之术并与汪律本合作创作绢本作品《梅竹图》。',
                    type: 'education',
                    location: '浙江金华',
                    period: '早年求学',
                    detailedContent: '拜汪仲伊为师，学习弹琴、击剑等传统技艺，培养全面的艺术修养。与汪律本合作创作绢本作品《梅竹图》，展现艺术才华。',
                    relatedWorks: [
                        { id: 1, title: '《梅竹图》' }
                    ]
                },
                {
                    id: 7,
                    year: 1891,
                    title: '开始收集古玺印',
                    description: '开始收集古玺印。',
                    type: 'collection',
                    location: '浙江金华',
                    period: '早年求学',
                    detailedContent: '开始系统收集和研究古玺印，为后来的金石学研究奠定基础，这一爱好贯穿其艺术生涯。',
                    relatedWorks: []
                },
                {
                    id: 8,
                    year: 1904,
                    title: '任教芜湖安徽公学',
                    description: '任教于芜湖安徽公学，开始教学生涯。',
                    type: 'work',
                    location: '安徽芜湖',
                    period: '任教编著',
                    detailedContent: '开始从事美术教育工作，在芜湖安徽公学任教，培养艺术人才，开启教育生涯。',
                    relatedWorks: []
                },
                {
                    id: 9,
                    year: 1905,
                    title: '任教新安中学堂',
                    description: '任教于歙县新安中学堂并编著出版《国粹学报》。',
                    type: 'work',
                    location: '安徽歙县',
                    period: '任教编著',
                    detailedContent: '在歙县新安中学堂任教，同时参与《国粹学报》的编著出版工作，致力于传统文化的传承与发展。',
                    relatedWorks: []
                },
                {
                    id: 10,
                    year: 1907,
                    title: '参加国学保存会',
                    description: '参加国学保存会与邓实、黄节编辑《国粹学报》另编辑《神州国光集》。',
                    type: 'work',
                    location: '上海',
                    period: '任教编著',
                    detailedContent: '积极参与文化保护工作，与邓实、黄节等学者共同编辑《国粹学报》和《神州国光集》，致力于传统文化的传承与发展。',
                    relatedWorks: []
                },
                {
                    id: 11,
                    year: 1908,
                    title: '编辑《美术丛书》',
                    description: '在上海与邓实合编《美术丛书》编辑《神州国光集》及各种书画册参加海上题襟馆金石画会在《国粹学报》发表《宾虹画论》《宾虹杂著叙村居》。',
                    type: 'work',
                    location: '上海',
                    period: '任教编著',
                    detailedContent: '与邓实合作编辑《美术丛书》，系统整理中国传统美术理论。同时编辑《神州国光集》等书画册，参与海上题襟馆金石画会活动，在《国粹学报》发表重要理论文章。',
                    relatedWorks: []
                },
                {
                    id: 12,
                    year: 1909,
                    title: '创作系列作品',
                    description: '创作作品《歙县渔梁》《水墨山水》等。',
                    type: 'creation',
                    location: '上海',
                    period: '任教编著',
                    detailedContent: '创作《歙县渔梁》《水墨山水》等作品，艺术创作进入成熟期，作品风格逐渐形成。',
                    relatedWorks: [
                        { id: 2, title: '《歙县渔梁》' },
                        { id: 3, title: '《水墨山水》' }
                    ]
                },
                {
                    id: 13,
                    year: 1910,
                    title: '创作楼阁图系列',
                    description: '创作作品《蒹葭楼写诗图》《风雨楼图》《平等阁图》等。',
                    type: 'creation',
                    location: '上海',
                    period: '任教编著',
                    detailedContent: '创作《蒹葭楼写诗图》《风雨楼图》《平等阁图》等楼阁题材作品，展现对传统建筑与自然景观的深刻理解。',
                    relatedWorks: [
                        { id: 4, title: '《蒹葭楼写诗图》' },
                        { id: 5, title: '《风雨楼图》' },
                        { id: 6, title: '《平等阁图》' }
                    ]
                },
                {
                    id: 14,
                    year: 1912,
                    title: '任《神州日报》主编',
                    description: '任《神州日报》主编先后在《真相画报》发表《真相报叙》《上古三代图画之本原》《两汉之石刻图画》《论晋魏六朝记载之名画》《论画法之宗唐上、下》《论五代画院界作创体》《论五代荆浩关仝之画》《论北宋画之盛》《东坡开文人墨戏画》《论宣和图画谱之美备》《论徐熙、黄筌花鸟画之派别》等论文另创作山水画作《焦山北望》《海西庵》等。',
                    type: 'work',
                    location: '上海',
                    period: '任教编著',
                    detailedContent: '担任《神州日报》主编，在《真相画报》发表系列重要画论，系统阐述中国绘画发展脉络。同时创作《焦山北望》《海西庵》等山水画作，理论与实践相结合。',
                    relatedWorks: [
                        { id: 7, title: '《焦山北望》' },
                        { id: 8, title: '《海西庵》' }
                    ]
                },
                {
                    id: 15,
                    year: 1913,
                    title: '与吴昌硕合作创作',
                    description: '与吴昌硕创作作品《蕉石图》另创作作品《仿古山水册》《泰岱游踪》《征献论词图》《剪凇阁图》《黄叶楼图》《龙禅语业室图》《龙湫图》等。',
                    type: 'creation',
                    location: '上海',
                    period: '任教编著',
                    detailedContent: '与艺术大师吴昌硕合作创作《蕉石图》，展现艺术家之间的交流与碰撞。同时创作多幅重要作品，艺术风格更加成熟。',
                    relatedWorks: [
                        { id: 9, title: '《蕉石图》' },
                        { id: 10, title: '《仿古山水册》' },
                        { id: 11, title: '《泰岱游踪》' }
                    ]
                },
                {
                    id: 16,
                    year: 1914,
                    title: '与多位艺术家合作',
                    description: '与郑曼殊、蔡哲夫、王一亭合作创作作品《分湖吊梦图》另创作《冲雪访碑图》《近游图》等。',
                    type: 'creation',
                    location: '上海',
                    period: '任教编著',
                    detailedContent: '与郑曼殊、蔡哲夫、王一亭等艺术家合作创作《分湖吊梦图》，艺术交流活跃。创作《冲雪访碑图》《近游图》等作品，展现对传统与创新的探索。',
                    relatedWorks: [
                        { id: 12, title: '《分湖吊梦图》' },
                        { id: 13, title: '《冲雪访碑图》' },
                        { id: 14, title: '《近游图》' }
                    ]
                },
                {
                    id: 17,
                    year: 1915,
                    title: '任《时报》编辑',
                    description: '任《时报》编辑另创作作品《分湖旧隐图》《潭渡图》《抱头室图》《天苏阁图》《近游图》等。',
                    type: 'work',
                    location: '上海',
                    period: '任教编著',
                    detailedContent: '担任《时报》编辑，继续从事文化传播工作。创作《分湖旧隐图》《潭渡图》等系列作品，艺术创作持续高产。',
                    relatedWorks: [
                        { id: 15, title: '《分湖旧隐图》' },
                        { id: 16, title: '《潭渡图》' },
                        { id: 17, title: '《抱头室图》' }
                    ]
                },
                {
                    id: 18,
                    year: 1916,
                    title: '创作黄山题材作品',
                    description: '创作作品《黄山狮子林》《写陆放翁诗意》等。',
                    type: 'creation',
                    location: '上海',
                    period: '任教编著',
                    detailedContent: '创作《黄山狮子林》等黄山题材作品，展现对黄山奇景的深刻感悟。以陆游诗意入画，体现文人画特色。',
                    relatedWorks: [
                        { id: 18, title: '《黄山狮子林》' },
                        { id: 19, title: '《写陆放翁诗意》' }
                    ]
                },
                {
                    id: 19,
                    year: 1917,
                    title: '创作山水与治印图',
                    description: '创作作品《金华雅岩村山水图》《秦斋治玺图》等。',
                    type: 'creation',
                    location: '上海',
                    period: '任教编著',
                    detailedContent: '创作《金华雅岩村山水图》，描绘家乡风光，寄托乡愁。创作《秦斋治玺图》，展现对金石篆刻的热爱。',
                    relatedWorks: [
                        { id: 20, title: '《金华雅岩村山水图》' },
                        { id: 21, title: '《秦斋治玺图》' }
                    ]
                },
                {
                    id: 20,
                    year: 1918,
                    title: '创作《校碑图卷》',
                    description: '6月创作作品《校碑图卷》等。',
                    type: 'creation',
                    location: '上海',
                    period: '任教编著',
                    detailedContent: '6月创作《校碑图卷》，作品体现对古代碑刻的研究与理解，展现深厚的金石学功底。',
                    relatedWorks: [
                        { id: 22, title: '《校碑图卷》' }
                    ]
                },
                {
                    id: 21,
                    year: 1920,
                    title: '创作设色山水',
                    description: '创作作品《设色山水》等。',
                    type: 'creation',
                    location: '上海',
                    period: '任教编著',
                    detailedContent: '创作《设色山水》等作品，在墨色基础上运用色彩，丰富画面表现力，探索新的艺术语言。',
                    relatedWorks: [
                        { id: 23, title: '《设色山水》' }
                    ]
                },
                {
                    id: 22,
                    year: 1921,
                    title: '创作《黄山图》',
                    description: '创作作品《黄山图》。',
                    type: 'creation',
                    location: '上海',
                    period: '任教编著',
                    detailedContent: '创作《黄山图》，以独特的视角和笔墨表现黄山奇景，展现对黄山的热爱与理解。',
                    relatedWorks: [
                        { id: 24, title: '《黄山图》' }
                    ]
                },
                {
                    id: 23,
                    year: 1922,
                    title: '任商务印书馆美术部主任',
                    description: '4月在商务印书馆编译所事务部任美术部主任与汪鞠友、汪声远、汪珊若、杨雪瑶、杨雪玫等合作创作作品《寒林远岫图》另创作作品《天苏阁》《纯飞馆》等。',
                    type: 'work',
                    location: '上海',
                    period: '任教编著',
                    detailedContent: '4月任商务印书馆编译所事务部美术部主任，负责美术出版工作。与多位艺术家合作创作《寒林远岫图》，创作《天苏阁》《纯飞馆》等作品。',
                    relatedWorks: [
                        { id: 25, title: '《寒林远岫图》' },
                        { id: 26, title: '《天苏阁》' },
                        { id: 27, title: '《纯飞馆》' }
                    ]
                },
                {
                    id: 24,
                    year: 1923,
                    title: '发表诗文与创作',
                    description: '7月创作作品《题画寿佩忍先生五十》12月七言古诗《题朱生君实延龄墨》《题晴窗读画图为顾某作》《贵池坞渡北诧古松歌为汪鞠友题》发表在《南社丛刻》另创作作品《项湖感旧图》《月夜驱车图》《天南赏枫图》等。',
                    type: 'creation',
                    location: '上海',
                    period: '任教编著',
                    detailedContent: '创作《题画寿佩忍先生五十》等作品，在《南社丛刻》发表多首七言古诗，展现文学才华。创作《项湖感旧图》《月夜驱车图》《天南赏枫图》等系列作品。',
                    relatedWorks: [
                        { id: 28, title: '《项湖感旧图》' },
                        { id: 29, title: '《月夜驱车图》' },
                        { id: 30, title: '《天南赏枫图》' }
                    ]
                },
                {
                    id: 25,
                    year: 1924,
                    title: '创作诗歌与画作',
                    description: '创作《甲子新秋池阳湖上》诗与椿树、雪按合作创作作品《冷香阁图卷》另创作作品《剪松阁图》。',
                    type: 'creation',
                    location: '上海',
                    period: '任教编著',
                    detailedContent: '创作《甲子新秋池阳湖上》诗，展现诗文才华。与椿树、雪按合作创作《冷香阁图卷》，创作《剪松阁图》，艺术创作多样化。',
                    relatedWorks: [
                        { id: 31, title: '《冷香阁图卷》' },
                        { id: 32, title: '《剪松阁图》' }
                    ]
                },
                {
                    id: 26,
                    year: 1925,
                    title: '创作《遥山苍翠》',
                    description: '创作作品《遥山苍翠》画史专著《古画微》刊行。',
                    type: 'creation',
                    location: '上海',
                    period: '任教编著',
                    detailedContent: '创作《遥山苍翠》，画史专著《古画微》刊行，系统阐述中国古代绘画发展历程，理论与实践相结合。',
                    relatedWorks: [
                        { id: 33, title: '《遥山苍翠》' }
                    ]
                },
                {
                    id: 27,
                    year: 1926,
                    title: '复任《神州国光社》编辑',
                    description: '复任《神州国光社》编辑。',
                    type: 'work',
                    location: '上海',
                    period: '任教编著',
                    detailedContent: '重新担任《神州国光社》编辑，继续从事美术出版工作，推动传统艺术传播。',
                    relatedWorks: []
                },
                {
                    id: 28,
                    year: 1927,
                    title: '主持《中国名画集》编印',
                    description: '主持《中国名画集》编印事务另创作作品《红树室图》《碧梧仙馆图》《丹枫白凤图卷》《晓江风便图》等。',
                    type: 'work',
                    location: '上海',
                    period: '任教编著',
                    detailedContent: '主持《中国名画集》编印事务，系统整理中国历代名画。创作《红树室图》《碧梧仙馆图》《丹枫白凤图卷》《晓江风便图》等系列作品。',
                    relatedWorks: [
                        { id: 34, title: '《红树室图》' },
                        { id: 35, title: '《碧梧仙馆图》' },
                        { id: 36, title: '《丹枫白凤图卷》' }
                    ]
                },
                {
                    id: 29,
                    year: 1928,
                    title: '任暨南大学讲席',
                    description: '任暨南大学中国画研究会讲席编著出版《烂漫社同人画集》《神州大观续编》《艺观》等。是年陈柱代表广西教育厅邀请黄宾虹到广西大学讲学之后便开始四处讲学、会友的游历生活陈柱作为东道主一直陪同在游玩桂林之后邀请黄宾虹一行前来北流萝村采风为陈柱作《勾漏听泉图》《暗螺山图》《北流萝村陈柱尊山屋图》等画作。',
                    type: 'work',
                    location: '上海、广西',
                    period: '讲学游历',
                    detailedContent: '受聘为暨南大学中国画研究会讲席，编著出版多部画集。应广西教育厅邀请到广西大学讲学，开始四处讲学、会友的游历生活。在广西期间创作《勾漏听泉图》《暗螺山图》《北流萝村陈柱尊山屋图》等作品。',
                    relatedWorks: [
                        { id: 37, title: '《勾漏听泉图》' },
                        { id: 38, title: '《暗螺山图》' },
                        { id: 39, title: '《北流萝村陈柱尊山屋图》' }
                    ]
                },
                {
                    id: 30,
                    year: 1929,
                    title: '任教上海美专',
                    description: '任上海美专国画理论与诗文教授、新华艺术大学教席在《艺观》发表《明代画家沈石田先生传》《宾虹草堂古印谱序》《古玺用于陶器之文字》《虹庐画谈》《重印美术丛书序》《美展国画谈》《籀庐画谈》等文章另在《美展汇刊》发表《画家品格之区异》一文并刊行《宾虹草堂古印谱》。',
                    type: 'work',
                    location: '上海',
                    period: '讲学游历',
                    detailedContent: '任上海美专国画理论与诗文教授、新华艺术大学教席，在《艺观》发表多篇重要理论文章，系统阐述艺术观点。刊行《宾虹草堂古印谱》，展示金石收藏研究成果。',
                    relatedWorks: []
                },
                {
                    id: 31,
                    year: 1930,
                    title: '多校任教与国际获奖',
                    description: '任中国艺术专科学校教授、昌明艺术专科学校教席、新华艺专国画教授作品参加比利时独立一百周年纪念国际博览会获珍品特别奖另创作作品《绿绮园图》。',
                    type: 'work',
                    location: '上海、比利时',
                    period: '讲学游历',
                    detailedContent: '在多所艺术院校任教，培养艺术人才。作品参加比利时独立一百周年纪念国际博览会，荣获珍品特别奖，国际声誉提升。创作《绿绮园图》。',
                    relatedWorks: [
                        { id: 40, title: '《绿绮园图》' }
                    ]
                },
                {
                    id: 32,
                    year: 1931,
                    title: '游雁荡山创作',
                    description: '5月游雁荡山创作作品《雁荡山巨幛》《大龙湫图》《三折瀑图》《响岩三景》《铁城壮观之图》等另创作作品《雁宕山轴》《山水图》《南巡图》《北濠草堂图》《大至阁图》《雁荡风景》《焦山北岸浮屿》《甘露寺》《墨石》《无数飞花送小舟》《浅绛山水》等。',
                    type: 'creation',
                    location: '浙江雁荡山',
                    period: '讲学游历',
                    detailedContent: '5月游览雁荡山，被其壮丽景色所震撼，创作了大量山水作品，包括《雁荡山巨幛》《大龙湫图》《三折瀑图》等系列重要作品。这些作品展现了黄宾虹对自然山水的深刻理解和独特的艺术表现力，艺术创作达到新的高度。',
                    relatedWorks: [
                        { id: 41, title: '《雁荡山巨幛》' },
                        { id: 42, title: '《大龙湫图》' },
                        { id: 43, title: '《三折瀑图》' },
                        { id: 44, title: '《响岩三景》' }
                    ]
                },
                {
                    id: 33,
                    year: 1932,
                    title: '与张大千等合作创作',
                    description: '与谢觐虞、张大千、张善孖同游上海浦东合作创作作品《红梵精舍图》另被四川艺术专科学校聘为校董、中国画系主任创作作品《潜县落云山浙皖纪游》《黄山智慧海一角》《丹台黄山游纪》《临安县留山浙皖纪游》《舟山》《罗东埠》《白帝城》《峨嵋山春色卷》《孤舟山水云晴时》《湖荷忆昨图》等。',
                    type: 'creation',
                    location: '上海',
                    period: '讲学游历',
                    detailedContent: '与谢觐虞、张大千、张善孖等艺术家同游上海浦东，合作创作《红梵精舍图》，艺术交流活跃。同时被四川艺术专科学校聘为校董、中国画系主任，创作了大量山水作品，展现了对各地风光的深刻感悟。',
                    relatedWorks: [
                        { id: 45, title: '《红梵精舍图》' },
                        { id: 46, title: '《潜县落云山浙皖纪游》' },
                        { id: 47, title: '《黄山智慧海一角》' }
                    ]
                },
                {
                    id: 34,
                    year: 1933,
                    title: '任暨南大学山水画导师',
                    description: '任暨南大学中国画研究会山水画导师另创作作品《北碚纪游》《设色山水扇面》《江郎山化石亭》《大背口》《海山南望》《尧山》《象鼻山》《桂林山水》等。',
                    type: 'work',
                    location: '上海',
                    period: '讲学游历',
                    detailedContent: '担任暨南大学中国画研究会山水画导师，培养山水画人才。创作《北碚纪游》《桂林山水》等作品，记录游历见闻，艺术创作持续丰富。',
                    relatedWorks: [
                        { id: 48, title: '《北碚纪游》' },
                        { id: 49, title: '《桂林山水》' },
                        { id: 50, title: '《江郎山化石亭》' }
                    ]
                },
                {
                    id: 35,
                    year: 1934,
                    title: '参加百川书画会展览',
                    description: '10月参加百川书画会在上海湖社举行的第一届书画展览会另创作作品《墨巢图》《峨嵋道中》《白华》《听帆楼图之二、之三》《松石》《甲戌题蜀游诗》《山水赠天知》等。',
                    type: 'exhibition',
                    location: '上海',
                    period: '讲学游历',
                    detailedContent: '10月参加百川书画会在上海湖社举行的第一届书画展览会，展示艺术成就。创作《墨巢图》《峨嵋道中》等作品，记录艺术探索历程。',
                    relatedWorks: [
                        { id: 51, title: '《墨巢图》' },
                        { id: 52, title: '《峨嵋道中》' },
                        { id: 53, title: '《听帆楼图》' }
                    ]
                },
                {
                    id: 36,
                    year: 1935,
                    title: '发表重要论文与创作',
                    description: '在《国画月刊》发表《新安派论略》《中国山水画今昔之变迁》《论画宜取所长》《精神重于物质说》等论文在《教育杂志》上发表《画学升降之大因》一文8月创作作品《四川山水长卷》《西湖长卷》9月与刘海粟合作创作作品《苍鹰松石图》与徐悲鸿合作创作作品《杂树岩泉》另创作作品《灌县离堆》《黄牛山风景》《龙凤潭风景》《设色花卉》《黄鹂湾》《鸡回角》《宋王台》《翠崖》《深壑微磴》《疏林春意》《泛舟》《渔乐》《粤江风便图》等。',
                    type: 'creation',
                    location: '上海',
                    period: '讲学游历',
                    detailedContent: '在《国画月刊》《教育杂志》发表多篇重要理论文章，系统阐述艺术观点。8月创作《四川山水长卷》《西湖长卷》等大幅作品，9月与刘海粟、徐悲鸿等艺术家合作创作，艺术交流活跃。',
                    relatedWorks: [
                        { id: 54, title: '《四川山水长卷》' },
                        { id: 55, title: '《西湖长卷》' },
                        { id: 56, title: '《苍鹰松石图》' },
                        { id: 57, title: '《杂树岩泉》' }
                    ]
                },
                {
                    id: 37,
                    year: 1936,
                    title: '出版纪游画册',
                    description: '4月编著出版《黄宾虹纪游画册》另创作作品《茹经堂图》《横槎江上》《湖波如镜绕山斜》《翠峦帆影》《浓阴喁语》《讲外彩屿》等。',
                    type: 'publication',
                    location: '上海',
                    period: '讲学游历',
                    detailedContent: '4月编著出版《黄宾虹纪游画册》，系统整理游历创作成果。同时创作《茹经堂图》《横槎江上》等作品，艺术风格更加成熟。',
                    relatedWorks: [
                        { id: 59, title: '《茹经堂图》' },
                        { id: 60, title: '《横槎江上》' },
                        { id: 61, title: '《翠峦帆影》' }
                    ]
                },
                {
                    id: 38,
                    year: 1937,
                    title: '任教北京艺专',
                    description: '4月任全国美术研究学会临时理事8月任教于古物陈列所国画研究院馆并任北京艺术专科学校教授另创作作品《水墨水山》《海山揽胜》等。',
                    type: 'work',
                    location: '北京',
                    period: '讲学游历',
                    detailedContent: '4月任全国美术研究学会临时理事，8月任教于古物陈列所国画研究院馆并任北京艺术专科学校教授，继续艺术教育工作。创作《水墨水山》《海山揽胜》等作品。',
                    relatedWorks: [
                        { id: 62, title: '《水墨水山》' },
                        { id: 63, title: '《海山揽胜》' }
                    ]
                },
                {
                    id: 39,
                    year: 1938,
                    title: '创作山水作品',
                    description: '创作作品《设色山水》《宋故行宫图》《光网楼图》等。',
                    type: 'creation',
                    location: '北京',
                    period: '讲学游历',
                    detailedContent: '在抗日战争期间坚持艺术创作，完成《设色山水》《宋故行宫图》《光网楼图》等作品，展现艺术家的坚守与执着。',
                    relatedWorks: [
                        { id: 64, title: '《设色山水》' },
                        { id: 65, title: '《宋故行宫图》' },
                        { id: 66, title: '《光网楼图》' }
                    ]
                },
                {
                    id: 40,
                    year: 1939,
                    title: '创作系列山水',
                    description: '创作作品《黄山风景》《淡沱云波见》《括岭入青天》《息茶庵图》《海岸一角》《李莼客句》等。',
                    type: 'creation',
                    location: '北京',
                    period: '讲学游历',
                    detailedContent: '在抗战相持阶段坚持艺术创作，完成《黄山风景》《淡沱云波见》《括岭入青天》等作品，以艺术表达对祖国山河的热爱。',
                    relatedWorks: [
                        { id: 67, title: '《黄山风景》' },
                        { id: 68, title: '《淡沱云波见》' },
                        { id: 69, title: '《括岭入青天》' }
                    ]
                },
                {
                    id: 41,
                    year: 1940,
                    title: '出版印谱与发表论文',
                    description: '编著著作《滨虹草堂集古玺印谱》《古玉印叙》《滨虹草堂藏古印自叙》另在《中和月刊》发表论文《画谈》《庚辰降生之书画家》《医无闾山摩崖巨手之书书画》《渐江大师事迹佚闻》《龙凤印谈》《周秦印谈》《释傩古印谈之一》等文章创作作品《匡庐白云》《设色山水卷》《拟李希古写蜀中山景》《白云深处药苗香》《百般峦清流》《叠翠泉生》《春雨朦霏》等。',
                    type: 'publication',
                    location: '北京',
                    period: '讲学游历',
                    detailedContent: '编著出版多部印谱著作，在《中和月刊》发表系列重要理论文章，系统阐述艺术观点。同时创作《匡庐白云》《设色山水卷》等作品，理论与实践并重。',
                    relatedWorks: [
                        { id: 70, title: '《匡庐白云》' },
                        { id: 71, title: '《设色山水卷》' },
                        { id: 72, title: '《拟李希古写蜀中山景》' }
                    ]
                },
                {
                    id: 42,
                    year: 1941,
                    title: '发表论文与创作',
                    description: '在《中和月刊》发表《阳识象形受觯说》创作作品《听园校书图》《西山有鹤鸣》《粤西兴坪纪游之一、之二》《设色山水》《具区渔艇》《潭上清兴》等。',
                    type: 'creation',
                    location: '北京',
                    period: '讲学游历',
                    detailedContent: '在《中和月刊》发表《阳识象形受觯说》等重要论文，继续艺术理论研究。创作《听园校书图》《西山有鹤鸣》等作品，艺术创作持续进行。',
                    relatedWorks: [
                        { id: 73, title: '《听园校书图》' },
                        { id: 74, title: '《西山有鹤鸣》' },
                        { id: 75, title: '《粤西兴坪纪游》' }
                    ]
                },
                {
                    id: 43,
                    year: 1942,
                    title: '创作诗意山水',
                    description: '创作作品《写李空同诗意》《没骨山水》《萧疏淡远》《拟李檀园笔意》等。',
                    type: 'creation',
                    location: '北京',
                    period: '讲学游历',
                    detailedContent: '创作《写李空同诗意》等以诗意入画的作品，探索文人画的新境界。尝试《没骨山水》等不同技法，艺术探索不断深入。',
                    relatedWorks: [
                        { id: 76, title: '《写李空同诗意》' },
                        { id: 77, title: '《没骨山水》' },
                        { id: 78, title: '《萧疏淡远》' }
                    ]
                },
                {
                    id: 44,
                    year: 1943,
                    title: '发表研究文章',
                    description: '在《中和月刊》发表《垢道人佚事》《垢道人遗著》。',
                    type: 'publication',
                    location: '北京',
                    period: '讲学游历',
                    detailedContent: '在《中和月刊》发表《垢道人佚事》《垢道人遗著》等研究文章，深入探讨古代画家艺术成就，展现深厚的艺术史研究功底。',
                    relatedWorks: []
                },
                {
                    id: 45,
                    year: 1944,
                    title: '发表文章与创作',
                    description: '在《中和月刊》发表《画家佚事》创作作品《拟董巨二米大意》《闲闲草堂》《山水扇面》等。',
                    type: 'creation',
                    location: '北京',
                    period: '讲学游历',
                    detailedContent: '在《中和月刊》发表《画家佚事》，同时创作《拟董巨二米大意》《闲闲草堂》等作品，理论与实践相结合。',
                    relatedWorks: [
                        { id: 79, title: '《拟董巨二米大意》' },
                        { id: 80, title: '《闲闲草堂》' },
                        { id: 81, title: '《山水扇面》' }
                    ]
                },
                {
                    id: 46,
                    year: 1945,
                    title: '创作抗战胜利题材',
                    description: '创作作品《黄河冰封图》《归猎》《灵岩》《南桥》《桂林山水》《设色山水》《金文联》等。',
                    type: 'creation',
                    location: '北京',
                    period: '讲学游历',
                    detailedContent: '在抗日战争胜利之际创作《黄河冰封图》等作品，表达对祖国山河的热爱和对和平的向往。',
                    relatedWorks: [
                        { id: 82, title: '《黄河冰封图》' },
                        { id: 83, title: '《归猎》' },
                        { id: 84, title: '《桂林山水》' }
                    ]
                },
                {
                    id: 47,
                    year: 1946,
                    title: '创作山水作品',
                    description: '创作作品《挹翠阁图》《海印庵图卷》《设色山水》《松涛》《阳朔山水》等。',
                    type: 'creation',
                    location: '北京',
                    period: '讲学游历',
                    detailedContent: '在解放战争期间坚持艺术创作，完成《挹翠阁图》《海印庵图卷》等作品，记录对祖国山河的深情。',
                    relatedWorks: [
                        { id: 85, title: '《挹翠阁图》' },
                        { id: 86, title: '《海印庵图卷》' },
                        { id: 87, title: '《阳朔山水》' }
                    ]
                },
                {
                    id: 48,
                    year: 1947,
                    title: '创作多样题材',
                    description: '创作作品《聪明才智训草堂图》《拟元人花卉》《拟董北苑笔意卷》《写元人诗意》《金华洞风景》《武夷山水》《蜀山玲珑》《严陵上游写景》《闽江舟中所见》《虎溪》《青山敛轻云》《红尘飞尽》等。',
                    type: 'creation',
                    location: '北京',
                    period: '讲学游历',
                    detailedContent: '创作题材丰富多样，包括《聪明才智训草堂图》等人物画，《拟元人花卉》等花鸟画，以及《金华洞风景》等山水画，展现全面的艺术造诣。',
                    relatedWorks: [
                        { id: 88, title: '《聪明才智训草堂图》' },
                        { id: 89, title: '《拟元人花卉》' },
                        { id: 90, title: '《金华洞风景》' }
                    ]
                },
                {
                    id: 49,
                    year: 1948,
                    title: '创作晚期作品',
                    description: '创作作品《山水轴》《蜀山纪游》《江山无尽》《阳朔山水》《山墨山水》《写陈擅诗意》《嘉陵江上小景卷》《坐年枫林百叠秋》《拟米南宫意》《山水诗轴酬君量》《蜀江玉垒关写景》等。',
                    type: 'creation',
                    location: '北京',
                    period: '讲学游历',
                    detailedContent: '在解放战争胜利前夕创作大量作品，包括《山水轴》《蜀山纪游》《江山无尽》等，艺术风格更加成熟凝重。',
                    relatedWorks: [
                        { id: 91, title: '《山水轴》' },
                        { id: 92, title: '《蜀山纪游》' },
                        { id: 93, title: '《江山无尽》' }
                    ]
                },
                {
                    id: 50,
                    year: 1949,
                    title: '任国立艺专教授',
                    description: '8月任国立艺术专科学校教授并被杭州市人民政府推为杭州市各界人民代表会议代表另创作作品《潭渡村图》《梅竹双清图》《内伶仃风景》《云山叠翠》《湖滨纪游》《新安江舟中所见》《西湖栖霞岭南望》《仙山楼阁》《黄山异卉轴》等。',
                    type: 'work',
                    location: '杭州',
                    period: '新中国成立后',
                    detailedContent: '新中国成立后，8月任国立艺术专科学校教授，并被推为杭州市各界人民代表会议代表，积极参与新中国的文化建设。创作《潭渡村图》《梅竹双清图》等作品，艺术创作进入新阶段。',
                    relatedWorks: [
                        { id: 94, title: '《潭渡村图》' },
                        { id: 95, title: '《梅竹双清图》' },
                        { id: 96, title: '《云山叠翠》' }
                    ]
                },
                {
                    id: 51,
                    year: 1950,
                    title: '创作新中国题材',
                    description: '创作作品《湖山爽气图》《焦墨山水》《拟王翘草虫花卉》《峰叠云回》《挹翠阁图之二》《简笔山水》《雁宕泷湫实景》《青城樵者》。',
                    type: 'creation',
                    location: '杭州',
                    period: '新中国成立后',
                    detailedContent: '在新中国成立初期创作《湖山爽气图》《焦墨山水》等作品，艺术风格更加简练凝重，体现新时代的艺术追求。',
                    relatedWorks: [
                        { id: 97, title: '《湖山爽气图》' },
                        { id: 98, title: '《焦墨山水》' },
                        { id: 99, title: '《简笔山水》' }
                    ]
                },
                {
                    id: 52,
                    year: 1952,
                    title: '创作晚期山水',
                    description: '创作作品《黄山风景》《黄山松谷白龙潭》《设色长卷》《殊音阁摹印图》《湖山欲雨图》《山水》《黄山鸣弦泉》《湖舍晴初》《拟色安吴》等。',
                    type: 'creation',
                    location: '杭州',
                    period: '新中国成立后',
                    detailedContent: '晚年创作《黄山风景》《黄山松谷白龙潭》等作品，对黄山的描绘更加深刻，艺术达到炉火纯青的境界。',
                    relatedWorks: []
                },
                {
                    id: 53,
                    year: 1953,
                    title: '被授予人民艺术家称号',
                    description: '被授予人民艺术家称号并当选为中国美术家协会常务理事和中国文学艺术界联合会第二届全国委员另创作作品《南岳山水图》《松柏同春》《芙蓉轴》《神仙伴侣》《新安江舟行所见》《江上归帆》《横槎江上》《焦墨山水》《蜀山图》《江树图》《永康山》《练江南岸》《题赠怒庵山水扇面》《羚羊峡》《拟邹衣白慎山水》等。',
                    type: 'award',
                    location: '北京',
                    period: '新中国成立后',
                    detailedContent: '因其在艺术领域的卓越贡献，被授予"人民艺术家"荣誉称号，并当选为中国美术家协会常务理事和中国文学艺术界联合会第二届全国委员。同时创作《南岳山水图》《松柏同春》等大量作品，艺术成就达到顶峰。',
                    relatedWorks: [
                        { id: 100, title: '《南岳山水图》' },
                        { id: 101, title: '《松柏同春》' },
                        { id: 102, title: '《芙蓉轴》' }
                    ]
                },
                {
                    id: 54,
                    year: 1954,
                    title: '担任重要职务',
                    description: '当选为中国美术家协会华东分会副主席并任中央美术学院民族美术研究所所长7月当选为浙江省人民代表大会代表另创作作品《蜀江归舟》《云谷寺晓望》《澄怀观化》《西溪草堂》《青城宵深》《富春览胜》《苍霭静籁》《新安江纪游》《风岩曲流》《叠嶂幽林》《叙州对岸》《清凉台西望》《舟山》等。',
                    type: 'work',
                    location: '杭州、北京',
                    period: '新中国成立后',
                    detailedContent: '当选为中国美术家协会华东分会副主席，任中央美术学院民族美术研究所所长，7月当选为浙江省人民代表大会代表，积极参与新中国美术事业建设。创作《蜀江归舟》《云谷寺晓望》等作品。',
                    relatedWorks: []
                },
                {
                    id: 55,
                    year: 1955,
                    title: '在杭州逝世',
                    description: '获评为中国人民优秀的画家1月当选中国人民政治协商会议第二届全国委员会委员3月25日在杭州逝世享年90岁。',
                    type: 'death',
                    location: '杭州',
                    period: '不幸逝世',
                    detailedContent: '1955年1月当选中国人民政治协商会议第二届全国委员会委员，3月25日在杭州逝世，享年90岁。黄宾虹的艺术成就和理论贡献对中国近现代绘画发展产生了深远影响，被誉为"中国人民优秀的画家"。',
                    relatedWorks: []
                }
            ];

            // 历史事件数据
            const historicalEvents = [
                {
                    id: 'h1',
                    year: 1865,
                    title: '南北战争结束',
                    description: '5月，南北战争结束，合众国重归统一。',
                    type: 'military',
                    location: '美国',
                    detailedContent: '1865年5月，美国南北战争结束，北方联邦获得胜利，维护了国家的统一，废除了奴隶制度，为美国的工业化发展奠定了基础。'
                },
                {
                    id: 'h2',
                    year: 1866,
                    title: '普奥战争',
                    description: '普奥战争，普胜…清廷与比利时王国签订中比通商条约。',
                    type: 'military',
                    location: '欧洲、中国',
                    detailedContent: '1866年，普鲁士与奥地利之间的战争爆发，普鲁士获胜。同年，清政府与比利时王国签订《中比通商条约》，进一步开放中国市场。'
                },
                {
                    id: 'h3',
                    year: 1867,
                    title: '日本大政奉还',
                    description: '日本大政奉还…福尔摩沙远征。',
                    type: 'political',
                    location: '日本、台湾',
                    detailedContent: '1867年，日本发生大政奉还事件，标志着幕府时代的结束。同时，清朝与法国远征台湾（当时称福尔摩沙）。'
                },
                {
                    id: 'h4',
                    year: 1868,
                    title: '明治维新开始',
                    description: '明治维新开始。',
                    type: 'political',
                    location: '日本',
                    detailedContent: '1868年，明治维新正式开始，日本开始全面西化改革，成为亚洲第一个实现工业化的国家。'
                },
                {
                    id: 'h5',
                    year: 1869,
                    title: '版籍奉还与苏伊士运河开航',
                    description: '版籍奉还；苏伊士运河开航。',
                    type: 'industrial',
                    location: '日本、埃及',
                    detailedContent: '1869年，日本进行版籍奉还改革，加强中央集权。同年，苏伊士运河正式开通，大大缩短了欧洲到亚洲的海上航线。'
                },
                {
                    id: 'h6',
                    year: 1870,
                    title: '普法战争与意大利统一',
                    description: '普法战争爆发；意大利统一。',
                    type: 'military',
                    location: '欧洲',
                    detailedContent: '1870年，普法战争爆发，普鲁士获胜，德意志帝国建立。同年，意大利完成统一，建立意大利王国。'
                },
                {
                    id: 'h7',
                    year: 1871,
                    title: '德意志帝国成立',
                    description: '巴黎公社；德意志帝国成立；台湾八瑶湾事件。',
                    type: 'political',
                    location: '欧洲、台湾',
                    detailedContent: '1871年，巴黎公社成立，德意志帝国正式宣告成立。在台湾，发生八瑶湾事件，涉及当地原住民与外来势力的冲突。'
                },
                {
                    id: 'h8',
                    year: 1872,
                    title: '日本修建第一条铁路',
                    description: '日本修建第一条铁路。',
                    type: 'industrial',
                    location: '日本',
                    detailedContent: '1872年，日本修建第一条铁路，标志着日本现代化进程的加速。'
                },
                {
                    id: 'h9',
                    year: 1873,
                    title: '西班牙第一共和国',
                    description: '西班牙第一共和国；三帝同盟。',
                    type: 'political',
                    location: '西班牙、欧洲',
                    detailedContent: '1873年，西班牙第一共和国成立。同年，德意志、奥地利和俄罗斯结成三帝同盟。'
                },
                {
                    id: 'h10',
                    year: 1874,
                    title: '牡丹社事件',
                    description: '牡丹社事件；中日北京专约。',
                    type: 'military',
                    location: '台湾',
                    detailedContent: '1874年，牡丹社事件发生，日本以琉球漂流民被杀为借口出兵台湾。后中日签订《北京专约》。'
                },
                {
                    id: 'h11',
                    year: 1875,
                    title: '光绪继位',
                    description: '同治帝去世，光绪继位。',
                    type: 'political',
                    location: '中国',
                    detailedContent: '1875年，同治帝去世，年仅4岁的光绪帝继位，慈禧太后继续垂帘听政。'
                },
                {
                    id: 'h12',
                    year: 1876,
                    title: '贝尔发明电话',
                    description: '贝尔发明电话；阿古柏侵新疆。',
                    type: 'industrial',
                    location: '美国、中国',
                    detailedContent: '1876年，贝尔发明电话，开启通信新时代。同时，阿古柏入侵新疆，威胁中国西北边疆安全。'
                },
                {
                    id: 'h13',
                    year: 1877,
                    title: '印度女皇',
                    description: '印度女皇；罗马尼亚独立；新疆收复。',
                    type: 'political',
                    location: '印度、罗马尼亚、中国',
                    detailedContent: '1877年，英国维多利亚女王加冕为印度女皇。罗马尼亚宣布独立。左宗棠收复新疆。'
                },
                {
                    id: 'h14',
                    year: 1878,
                    title: '柏林会议',
                    description: '柏林会议。',
                    type: 'diplomatic',
                    location: '德国',
                    detailedContent: '1878年，柏林会议召开，重新调整巴尔干半岛的政治格局。'
                },
                {
                    id: 'h15',
                    year: 1879,
                    title: '日本吞并琉球',
                    description: '日本吞并琉球；德奥同盟。',
                    type: 'political',
                    location: '日本、欧洲',
                    detailedContent: '1879年，日本正式吞并琉球王国，改为冲绳县。德国与奥地利结成德奥同盟。'
                },
                {
                    id: 'h16',
                    year: 1881,
                    title: '中俄《伊犁条约》',
                    description: '中俄《伊犁条约》。',
                    type: 'diplomatic',
                    location: '中国、俄罗斯',
                    detailedContent: '1881年，中俄签订《伊犁条约》，清政府收回伊犁地区，但仍丧失部分领土主权。'
                },
                {
                    id: 'h17',
                    year: 1882,
                    title: '英国并吞埃及',
                    description: '英国并吞埃及；三国同盟。',
                    type: 'political',
                    location: '埃及、欧洲',
                    detailedContent: '1882年，英国并吞埃及，控制苏伊士运河。德国、奥地利、意大利结成三国同盟。'
                },
                {
                    id: 'h18',
                    year: 1884,
                    title: '中法战争',
                    description: '柏林西非会议；中法战争。',
                    type: 'military',
                    location: '欧洲、中国',
                    detailedContent: '1884年，柏林西非会议召开，讨论非洲殖民地问题。中法战争爆发，法国侵略越南和中国。'
                },
                {
                    id: 'h19',
                    year: 1885,
                    title: '保加利亚危机',
                    description: '保加利亚危机。',
                    type: 'political',
                    location: '保加利亚',
                    detailedContent: '1885年，保加利亚危机爆发，导致欧洲列强关系紧张。'
                },
                {
                    id: 'h20',
                    year: 1886,
                    title: '汽车诞生',
                    description: '可口可乐发明；汽车诞生；中英缅甸条约。',
                    type: 'industrial',
                    location: '美国、德国、中国',
                    detailedContent: '1886年，可口可乐发明，卡尔·本茨制造出第一辆汽车。中英签订《缅甸条约》，英国控制缅甸。'
                },
                {
                    id: 'h21',
                    year: 1887,
                    title: '澳门沦为葡殖地',
                    description: '再保险条约；澳门沦为葡殖地。',
                    type: 'political',
                    location: '欧洲、澳门',
                    detailedContent: '1887年，德俄签订再保险条约。中葡签订《中葡和好通商条约》，澳门正式沦为葡萄牙殖民地。'
                },
                {
                    id: 'h22',
                    year: 1888,
                    title: '英国侵藏战争',
                    description: '英国侵藏战争。',
                    type: 'military',
                    location: '西藏',
                    detailedContent: '1888年，英国发动第一次侵藏战争，试图控制西藏。'
                },
                {
                    id: 'h23',
                    year: 1889,
                    title: '光绪亲政',
                    description: '光绪亲政；日本宪法；埃菲尔铁塔。',
                    type: 'political',
                    location: '中国、日本、法国',
                    detailedContent: '1889年，光绪帝开始亲政。日本颁布《大日本帝国宪法》。埃菲尔铁塔建成。'
                },
                {
                    id: 'h24',
                    year: 1890,
                    title: '中英藏印条约',
                    description: '中英藏印条约；威廉二世免俾斯麦。',
                    type: 'diplomatic',
                    location: '中国、德国',
                    detailedContent: '1890年，中英签订《藏印条约》，划定西藏与锡金边界。德皇威廉二世解除俾斯麦职务。'
                },
                {
                    id: 'h25',
                    year: 1891,
                    title: '法俄同盟',
                    description: '法俄同盟。',
                    type: 'political',
                    location: '法国、俄罗斯',
                    detailedContent: '1891年，法国与俄罗斯结成法俄同盟，对抗德奥意三国同盟。'
                },
                {
                    id: 'h26',
                    year: 1893,
                    title: '中英藏印续约',
                    description: '中英藏印续约。',
                    type: 'diplomatic',
                    location: '中国',
                    detailedContent: '1893年，中英签订《藏印续约》，进一步明确西藏与英属印度的关系。'
                },
                {
                    id: 'h27',
                    year: 1894,
                    title: '甲午战争',
                    description: '甲午战争。',
                    type: 'military',
                    location: '中国、日本',
                    detailedContent: '1894年，甲午战争爆发，日本侵略朝鲜和中国，清政府战败。'
                },
                {
                    id: 'h28',
                    year: 1895,
                    title: '马关条约',
                    description: '马关条约；台湾乙未战争；诺贝尔奖设立。',
                    type: 'diplomatic',
                    location: '中国、台湾、瑞典',
                    detailedContent: '1895年，中日签订《马关条约》，中国割让台湾、澎湖给日本。台湾爆发乙未抗日战争。诺贝尔奖设立。'
                },
                {
                    id: 'h29',
                    year: 1896,
                    title: '首届奥运会',
                    description: '中俄密约；首届奥运。',
                    type: 'cultural',
                    location: '中国、希腊',
                    detailedContent: '1896年，中俄签订密约。第一届现代奥运会在希腊雅典举行。'
                },
                {
                    id: 'h30',
                    year: 1897,
                    title: '大韩帝国',
                    description: '大韩帝国；胶州湾事件。',
                    type: 'political',
                    location: '韩国、中国',
                    detailedContent: '1897年，朝鲜改国号为大韩帝国。德国强占胶州湾。'
                },
                {
                    id: 'h31',
                    year: 1898,
                    title: '戊戌变法',
                    description: '各国租界；美西战争；戊戌变法。',
                    type: 'political',
                    location: '中国、美国、西班牙',
                    detailedContent: '1898年，列强在中国划分租界。美西战争爆发。光绪帝推行戊戌变法，但很快失败。'
                },
                {
                    id: 'h32',
                    year: 1899,
                    title: '义和团',
                    description: '广州湾租界；门户开放；义和团。',
                    type: 'political',
                    location: '中国',
                    detailedContent: '1899年，法国强租广州湾。美国提出门户开放政策。义和团运动兴起。'
                },
                {
                    id: 'h33',
                    year: 1900,
                    title: '八国联军',
                    description: '八国联军；庚子俄难。',
                    type: 'military',
                    location: '中国',
                    detailedContent: '1900年，八国联军侵华，镇压义和团运动。俄国趁机侵占中国东北。'
                },
                {
                    id: 'h34',
                    year: 1901,
                    title: '辛丑条约',
                    description: '辛丑条约。',
                    type: 'diplomatic',
                    location: '中国',
                    detailedContent: '1901年，清政府与列强签订《辛丑条约》，中国完全沦为半殖民地半封建社会。'
                },
                {
                    id: 'h35',
                    year: 1902,
                    title: '英日同盟',
                    description: '英日同盟；天津各租界。',
                    type: 'political',
                    location: '英国、日本、中国',
                    detailedContent: '1902年，英国与日本结成英日同盟。天津各国租界形成。'
                },
                {
                    id: 'h36',
                    year: 1903,
                    title: '莱特兄弟首飞',
                    description: '第二次英侵藏；莱特兄弟首飞。',
                    type: 'military',
                    location: '西藏、美国',
                    detailedContent: '1903年，英国第二次入侵西藏。莱特兄弟首次成功进行动力飞行。'
                },
                {
                    id: 'h37',
                    year: 1904,
                    title: '日俄战争',
                    description: '日俄战争。',
                    type: 'military',
                    location: '中国东北',
                    detailedContent: '1904年，日俄战争在中国东北爆发，日本获胜。'
                },
                {
                    id: 'h38',
                    year: 1905,
                    title: '相对论',
                    description: '瑞挪分离；摩洛哥危机；相对论。',
                    type: 'scientific',
                    location: '欧洲、摩洛哥',
                    detailedContent: '1905年，瑞典与挪威分离。第一次摩洛哥危机爆发。爱因斯坦发表狭义相对论。'
                },
                {
                    id: 'h39',
                    year: 1906,
                    title: '旧金山地震',
                    description: '旧金山地震；全印穆盟成立。',
                    type: 'natural',
                    location: '美国、印度',
                    detailedContent: '1906年，旧金山发生大地震。全印度穆斯林联盟成立。'
                },
                {
                    id: 'h40',
                    year: 1907,
                    title: '协约国体系',
                    description: '第二次海牙会议；协约国体系。',
                    type: 'diplomatic',
                    location: '荷兰、欧洲',
                    detailedContent: '1907年，第二次海牙和平会议召开。英法俄协约国体系形成。'
                },
                {
                    id: 'h41',
                    year: 1908,
                    title: '溥仪即位',
                    description: '溥仪即位；波斯尼亚危机。',
                    type: 'political',
                    location: '中国、欧洲',
                    detailedContent: '1908年，光绪帝和慈禧太后相继去世，溥仪即位。波斯尼亚危机引发欧洲紧张局势。'
                },
                {
                    id: 'h42',
                    year: 1909,
                    title: '土耳其青年党革命',
                    description: '土耳其青年党革命。',
                    type: 'political',
                    location: '土耳其',
                    detailedContent: '1909年，土耳其青年党发动革命，推行现代化改革。'
                },
                {
                    id: 'h43',
                    year: 1910,
                    title: '日韩合并',
                    description: '日韩合并；日本吞并韩国。',
                    type: 'political',
                    location: '日本、韩国',
                    detailedContent: '1910年，日本正式吞并韩国，韩国沦为日本殖民地。'
                },
                {
                    id: 'h44',
                    year: 1911,
                    title: '辛亥革命',
                    description: '辛亥革命；第二次摩洛哥危机。',
                    type: 'political',
                    location: '中国、摩洛哥',
                    detailedContent: '1911年，辛亥革命爆发，清朝统治被推翻。第二次摩洛哥危机引发国际紧张。'
                },
                {
                    id: 'h45',
                    year: 1912,
                    title: '中华民国成立',
                    description: '中华民国成立；泰坦尼克号沉没。',
                    type: 'political',
                    location: '中国、大西洋',
                    detailedContent: '1912年，中华民国成立，孙中山就任临时大总统。泰坦尼克号沉没。'
                },
                {
                    id: 'h46',
                    year: 1913,
                    title: '第二次巴尔干战争',
                    description: '第二次巴尔干战争。',
                    type: 'military',
                    location: '巴尔干',
                    detailedContent: '1913年，第二次巴尔干战争爆发，进一步加剧了欧洲的紧张局势。'
                },
                {
                    id: 'h47',
                    year: 1914,
                    title: '一战爆发',
                    description: '萨拉热窝事件；一战爆发；日本参战。',
                    type: 'military',
                    location: '欧洲、亚洲',
                    detailedContent: '1914年，萨拉热窝事件引发第一次世界大战。日本对德宣战，占领青岛。'
                },
                {
                    id: 'h48',
                    year: 1915,
                    title: '二十一条',
                    description: '二十一条；西来庵事件。',
                    type: 'diplomatic',
                    location: '中国、台湾',
                    detailedContent: '1915年，日本向中国提出二十一条要求。台湾发生西来庵事件（噍吧哖事件）。'
                },
                {
                    id: 'h49',
                    year: 1916,
                    title: '凡尔登战役',
                    description: '凡尔登；索姆河；洪宪帝制瓦解。',
                    type: 'military',
                    location: '法国、中国',
                    detailedContent: '1916年，凡尔登战役和索姆河战役成为一战最惨烈的战役。袁世凯洪宪帝制瓦解。'
                },
                {
                    id: 'h50',
                    year: 1917,
                    title: '俄国革命',
                    description: '俄国革命；美国参战；中国对德宣战。',
                    type: 'political',
                    location: '俄罗斯、美国、中国',
                    detailedContent: '1917年，俄国发生十月革命。美国对德宣战。中国对德奥宣战。'
                },
                {
                    id: 'h51',
                    year: 1918,
                    title: '一战结束',
                    description: '一战结束；西班牙流感。',
                    type: 'military',
                    location: '全球',
                    detailedContent: '1918年，第一次世界大战结束。西班牙流感全球大流行。'
                },
                {
                    id: 'h52',
                    year: 1919,
                    title: '五四运动',
                    description: '凡尔赛条约；共产国际；五四运动。',
                    type: 'political',
                    location: '法国、苏联、中国',
                    detailedContent: '1919年，巴黎和会签订《凡尔赛条约》。共产国际成立。中国爆发五四运动。'
                },
                {
                    id: 'h53',
                    year: 1920,
                    title: '国际联盟',
                    description: '国际联盟；中国直皖战争。',
                    type: 'political',
                    location: '瑞士、中国',
                    detailedContent: '1920年，国际联盟成立。中国爆发直皖战争。'
                },
                {
                    id: 'h54',
                    year: 1921,
                    title: '中共成立',
                    description: '华盛顿会议；中共成立。',
                    type: 'political',
                    location: '美国、中国',
                    detailedContent: '1921年，华盛顿会议召开，讨论远东问题。中国共产党成立。'
                },
                {
                    id: 'h55',
                    year: 1922,
                    title: '墨索里尼掌权',
                    description: '墨索里尼掌权；苏联成立。',
                    type: 'political',
                    location: '意大利、苏联',
                    detailedContent: '1922年，墨索里尼在意大利掌权。苏联正式成立。'
                },
                {
                    id: 'h56',
                    year: 1923,
                    title: '关东大地震',
                    description: '占领鲁尔；日本关东大地震。',
                    type: 'natural',
                    location: '德国、日本',
                    detailedContent: '1923年，法国和比利时占领德国鲁尔区。日本关东大地震造成重大损失。'
                },
                {
                    id: 'h57',
                    year: 1924,
                    title: '第二次直奉战争',
                    description: '第二次直奉战争。',
                    type: 'military',
                    location: '中国',
                    detailedContent: '1924年，第二次直奉战争爆发，奉系获胜。'
                },
                {
                    id: 'h58',
                    year: 1925,
                    title: '孙中山逝世',
                    description: '孙中山逝世。',
                    type: 'political',
                    location: '中国',
                    detailedContent: '1925年，孙中山在北京逝世。'
                },
                {
                    id: 'h59',
                    year: 1926,
                    title: '北伐开始',
                    description: '北伐开始。',
                    type: 'military',
                    location: '中国',
                    detailedContent: '1926年，国民革命军开始北伐，旨在统一中国。'
                },
                {
                    id: 'h60',
                    year: 1927,
                    title: '第一次国共内战',
                    description: '第一次国共内战。',
                    type: 'military',
                    location: '中国',
                    detailedContent: '1927年，第一次国共内战爆发。'
                },
                {
                    id: 'h61',
                    year: 1928,
                    title: '非战公约',
                    description: '非战公约。',
                    type: 'diplomatic',
                    location: '法国',
                    detailedContent: '1928年，《非战公约》在巴黎签订，宣布放弃以战争作为国家政策工具。'
                },
                {
                    id: 'h62',
                    year: 1929,
                    title: '世界经济危机',
                    description: '世界经济危机。',
                    type: 'economic',
                    location: '全球',
                    detailedContent: '1929年，世界经济大危机爆发，全球陷入经济萧条。'
                },
                {
                    id: 'h63',
                    year: 1930,
                    title: '首届世界杯',
                    description: '首届世界杯；伦敦海军条约；雾社事件。',
                    type: 'cultural',
                    location: '乌拉圭、英国、台湾',
                    detailedContent: '1930年，首届世界杯足球赛在乌拉圭举行。伦敦海军条约签订。台湾发生雾社事件。'
                },
                {
                    id: 'h64',
                    year: 1931,
                    title: '九一八事变',
                    description: '九一八事变。',
                    type: 'military',
                    location: '中国东北',
                    detailedContent: '1931年，九一八事变爆发，日本侵占中国东北。'
                },
                {
                    id: 'h65',
                    year: 1932,
                    title: '满洲国成立',
                    description: '满洲国成立；五一五事件。',
                    type: 'political',
                    location: '中国东北、日本',
                    detailedContent: '1932年，日本扶植溥仪建立伪满洲国。日本发生五一五事件。'
                },
                {
                    id: 'h66',
                    year: 1933,
                    title: '希特勒掌权',
                    description: '希特勒掌权。',
                    type: 'political',
                    location: '德国',
                    detailedContent: '1933年，希特勒成为德国总理，开始纳粹统治。'
                },
                {
                    id: 'h67',
                    year: 1934,
                    title: '长征开始',
                    description: '长征开始。',
                    type: 'military',
                    location: '中国',
                    detailedContent: '1934年，中国工农红军开始长征。'
                },
                {
                    id: 'h68',
                    year: 1936,
                    title: '西安事变',
                    description: '西安事变；柏林奥运；西班牙内战。',
                    type: 'political',
                    location: '中国、德国、西班牙',
                    detailedContent: '1936年，西安事变促使国共合作抗日。柏林奥运会举行。西班牙内战爆发。'
                },
                {
                    id: 'h69',
                    year: 1937,
                    title: '七七事变',
                    description: '七七事变；南京大屠杀；轴心国形成。',
                    type: 'military',
                    location: '中国、南京、欧洲',
                    detailedContent: '1937年，七七事变爆发，全面抗日战争开始。南京大屠杀发生。德意日轴心国形成。'
                },
                {
                    id: 'h70',
                    year: 1938,
                    title: '武汉会战',
                    description: '德奥合并；武汉会战；慕尼黑协定。',
                    type: 'military',
                    location: '德国、中国、捷克',
                    detailedContent: '1938年，德国吞并奥地利。武汉会战结束。慕尼黑协定牺牲捷克利益。'
                },
                {
                    id: 'h71',
                    year: 1939,
                    title: '二战爆发',
                    description: '二战爆发；苏芬冬季战争。',
                    type: 'military',
                    location: '欧洲',
                    detailedContent: '1939年，第二次世界大战爆发。苏联与芬兰爆发冬季战争。'
                },
                {
                    id: 'h72',
                    year: 1940,
                    title: '百团大战',
                    description: '法国沦陷；不列颠空战；百团大战。',
                    type: 'military',
                    location: '法国、英国、中国',
                    detailedContent: '1940年，法国沦陷。不列颠空战爆发。八路军发动百团大战。'
                },
                {
                    id: 'h73',
                    year: 1941,
                    title: '太平洋战争',
                    description: '巴巴罗萨；珍珠港；太平洋战争。',
                    type: 'military',
                    location: '苏联、美国、太平洋',
                    detailedContent: '1941年，德国入侵苏联（巴巴罗萨行动）。日本偷袭珍珠港，太平洋战争爆发。'
                },
                {
                    id: 'h74',
                    year: 1942,
                    title: '中途岛战役',
                    description: '中途岛；斯大林格勒。',
                    type: 'military',
                    location: '太平洋、苏联',
                    detailedContent: '1942年，中途岛海战成为太平洋战争转折点。斯大林格勒战役成为二战转折点。'
                },
                {
                    id: 'h75',
                    year: 1943,
                    title: '开罗宣言',
                    description: '开罗宣言；西西里战役。',
                    type: 'diplomatic',
                    location: '埃及、意大利',
                    detailedContent: '1943年，开罗会议发表《开罗宣言》，要求日本归还中国领土。盟军在西西里登陆。'
                },
                {
                    id: 'h76',
                    year: 1944,
                    title: '诺曼底登陆',
                    description: '诺曼底登陆；豫湘桂战役。',
                    type: 'military',
                    location: '法国、中国',
                    detailedContent: '1944年，诺曼底登陆成功，开辟欧洲第二战场。日军发动豫湘桂战役。'
                },
                {
                    id: 'h77',
                    year: 1945,
                    title: '二战结束',
                    description: '德国战败；美国投原子弹；日本投降；联合国成立。',
                    type: 'military',
                    location: '全球',
                    detailedContent: '1945年，德国战败投降。美国向日本投原子弹。日本无条件投降。联合国成立。'
                },
                {
                    id: 'h78',
                    year: 1946,
                    title: '叙利亚独立',
                    description: '叙利亚独立；通过《中华民国宪法》。',
                    type: 'political',
                    location: '叙利亚、中国',
                    detailedContent: '1946年，叙利亚获得独立。中华民国通过《中华民国宪法》。'
                },
                {
                    id: 'h79',
                    year: 1947,
                    title: '印巴分治',
                    description: '印巴分治；以巴战争。',
                    type: 'political',
                    location: '印度、巴勒斯坦',
                    detailedContent: '1947年，印巴分治，印度和巴基斯坦独立。第一次中东战争爆发。'
                },
                {
                    id: 'h80',
                    year: 1948,
                    title: '以色列建国',
                    description: '以色列建国；马歇尔计划；柏林危机。',
                    type: 'political',
                    location: '以色列、欧洲',
                    detailedContent: '1948年，以色列建国。马歇尔计划开始实施。柏林危机爆发。'
                },
                {
                    id: 'h81',
                    year: 1949,
                    title: '中华人民共和国成立',
                    description: '中华人民共和国成立；北约成立；苏联原子弹试爆成功。',
                    type: 'political',
                    location: '中国、欧洲、苏联',
                    detailedContent: '1949年，中华人民共和国成立。北约成立。苏联成功试爆原子弹。'
                },
                {
                    id: 'h82',
                    year: 1950,
                    title: '朝鲜战争',
                    description: '朝鲜战争。',
                    type: 'military',
                    location: '朝鲜半岛',
                    detailedContent: '1950年，朝鲜战争爆发，中国人民志愿军赴朝作战。'
                },
                {
                    id: 'h83',
                    year: 1951,
                    title: '氢弹试爆',
                    description: '氢弹试爆；旧金山和约。',
                    type: 'military',
                    location: '美国、日本',
                    detailedContent: '1951年，美国首次试爆氢弹。旧金山和约签订，结束对日占领。'
                },
                {
                    id: 'h84',
                    year: 1953,
                    title: '朝鲜停战',
                    description: '朝鲜停战。',
                    type: 'military',
                    location: '朝鲜半岛',
                    detailedContent: '1953年，朝鲜战争停战协定签订。'
                },
                {
                    id: 'h85',
                    year: 1954,
                    title: '第一次印度支那战争结束',
                    description: '第一次印度支那战争结束。',
                    type: 'military',
                    location: '越南',
                    detailedContent: '1954年，第一次印度支那战争结束，越南分裂为南北两部分。'
                },
                {
                    id: 'h86',
                    year: 1955,
                    title: '华沙条约',
                    description: '华沙条约；一江山战役。',
                    type: 'political',
                    location: '波兰、台湾',
                    detailedContent: '1955年，华沙条约组织成立，与北约对峙。解放军攻占一江山岛。'
                }
            ];

            resolve({
                code: 0,
                message: 'success',
                data: {
                    personalEvents: personalEvents,
                    historicalEvents: historicalEvents
                }
            });
        }, 800);
    });
};

// 获取历史事件类型颜色
export const getHistoricalEventColor = (type) => {
    const colors = {
        political: '#8B0000',      // 深红色 - 政治
        military: '#B22222',       // 砖红色 - 军事
        diplomatic: '#8B4513',     // 马鞍棕 - 外交
        economic: '#DAA520',       // 金黄 - 经济
        industrial: '#696969',     // 暗灰 - 工业
        scientific: '#2E8B57',     // 海绿 - 科学
        cultural: '#D2691E',       // 巧克力色 - 文化
        social: '#CD853F',         // 秘鲁色 - 社会
        natural: '#4682B4'         // 钢蓝 - 自然灾害
    };
    return colors[type] || '#8B4513'; // 默认棕色
};

// 获取历史事件类型文本
export const getHistoricalEventText = (type) => {
    const texts = {
        political: '政治',
        military: '军事',
        diplomatic: '外交',
        economic: '经济',
        industrial: '工业',
        scientific: '科学',
        cultural: '文化',
        social: '社会',
        natural: '自然'
    };
    return texts[type] || '历史事件';
};

// 获取事件类型颜色（个人事件用）
export const getEventTypeColor = (type) => {
    const colors = {
        birth: '#2E2E2E',          // 墨黑 - 出生
        education: '#556B2F',      // 橄榄绿 - 求学
        work: '#8B4513',           // 深棕色 - 工作
        creation: '#3B4F3A',       // 墨绿色 - 创作
        award: '#D4A451',          // 金黄色 - 荣誉
        death: '#696969',          // 深灰色 - 逝世
        travel: '#2E8B57',         // 海绿色 - 游历
        collection: '#B8860B',     // 暗金色 - 收藏
        publication: '#A52A2A',    // 红棕色 - 出版
        exhibition: '#CD853F'      // 秘鲁色 - 展览
    };
    return colors[type] || '#8FBC8F';
};

// 获取事件类型文本（个人事件用）
export const getEventTypeText = (type) => {
    const texts = {
        birth: '出生',
        education: '求学',
        work: '工作',
        creation: '创作',
        award: '荣誉',
        death: '逝世',
        travel: '游历',
        collection: '收藏',
        publication: '出版',
        exhibition: '展览'
    };
    return texts[type] || type;
};

// 轮播图图片数据
export const getCarouselImages = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                code: 0,
                message: 'success',
                data: {
                    total: 12,
                    page: 1,
                    pageSize: 12,
                    items: [
                        {
                            id: 1,
                            url: '/images/carousel/young.jpg',
                            alt: '黄宾虹青年时期',
                            caption: '黄宾虹青年时期照片',
                            description: '黄宾虹在金华家中的青年时期留影，展现出文人气质',
                            source: '家族相册',
                            year: '约1890年',
                            category: 'portrait',
                            location: '浙江金华'
                        },
                        {
                            id: 2,
                            url: '/images/carousel/teaching.jpg',
                            alt: '教学场景',
                            caption: '黄宾虹在北平艺术专科学校教学',
                            description: '1937年在北京艺术专科学校任教时的教学场景',
                            source: '学校档案',
                            year: '1938年',
                            category: 'work',
                            location: '北京'
                        },
                        {
                            id: 3,
                            url: '/images/carousel/creation.jpg',
                            alt: '创作场景',
                            caption: '黄宾虹在工作室进行艺术创作',
                            description: '黄宾虹在画室中专心创作山水画的工作状态',
                            source: '个人收藏',
                            year: '1945年',
                            category: 'creation',
                            location: '杭州'
                        },
                        {
                            id: 4,
                            url: '/images/carousel/award.jpg',
                            alt: '授奖仪式',
                            caption: '「人民艺术家」称号授奖',
                            description: '1953年被授予"人民艺术家"荣誉称号的重要时刻',
                            source: '新闻照片',
                            year: '1953年',
                            category: 'award',
                            location: '北京'
                        }
                    ]
                }
            });
        }, 600);
    });
};