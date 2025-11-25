// src/services/bioDataService.js

// 黄宾虹生平事件数据（包含所有年份）
export const getTimelineEvents = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                code: 0,
                message: 'success',
                data: [
                    {
                        id: 1,
                        year: 1865,
                        title: '出生于浙江金华',
                        description: '1月27日黄宾虹出生于浙江金华铁岭头街。',
                        type: 'birth',
                        location: '浙江金华',
                        period: '早年求学',
                        detailedContent: '黄宾虹，原名质，字朴存，号宾虹，1865年1月27日出生于浙江金华铁岭头街的一个书香门第。其家族为当地书香门第，自幼受到严格的传统文化教育，为后来的艺术创作奠定了坚实基础。',
                        historicalEvents: [
                            {
                                id: 'h1',
                                description: '江南制造总局在上海成立（晚清重要军事工业基地）',
                                type: 'industrial'
                            },
                            {
                                id: 'h2',
                                description: '捻军在山东曹州歼灭僧格林沁部',
                                type: 'military'
                            }
                        ]
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
                        historicalEvents: [
                            {
                                id: 'h3',
                                description: '日本正式吞并琉球国（后改为冲绳县）',
                                type: 'diplomatic'
                            },
                            {
                                id: 'h4',
                                description: '上海轮船招商局并购美国旗昌轮船公司',
                                type: 'economic'
                            }
                        ]
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
                        historicalEvents: [
                            {
                                id: 'h5',
                                description: '清政府与沙俄签订《中俄伊犁条约》，收回伊犁地区',
                                type: 'diplomatic'
                            },
                            {
                                id: 'h6',
                                description: '唐山至胥各庄铁路建成（中国第一条自建标准轨铁路）',
                                type: 'industrial'
                            }
                        ]
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
                        historicalEvents: [
                            {
                                id: 'h7',
                                description: '中法战争结束，签订《中法新约》',
                                type: 'military'
                            },
                            {
                                id: 'h8',
                                description: '冯子材取得镇南关大捷，重创法军',
                                type: 'military'
                            }
                        ]
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
                        historicalEvents: [
                            {
                                id: 'h9',
                                description: '张之洞在广州创办广雅书院（近代著名书院）',
                                type: 'education'
                            },
                            {
                                id: 'h10',
                                description: '清政府设立海军衙门，统筹海军建设',
                                type: 'military'
                            }
                        ]
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
                        historicalEvents: [
                            {
                                id: 'h11',
                                description: '光绪帝亲政，慈禧太后归政',
                                type: 'political'
                            },
                            {
                                id: 'h12',
                                description: '张之洞在武汉创办汉阳铁厂（中国近代最大钢铁企业）',
                                type: 'industrial'
                            }
                        ],
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
                        historicalEvents: [
                            {
                                id: 'h13',
                                description: '康有为在广州创办万木草堂，宣传维新思想',
                                type: 'cultural'
                            },
                            {
                                id: 'h14',
                                description: '北洋舰队开始每年巡弋黄海',
                                type: 'military'
                            }
                        ]
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
                        historicalEvents: [
                            {
                                id: 'h15',
                                description: '日俄战争在中国东北爆发，清政府宣布"中立"',
                                type: 'diplomatic'
                            },
                            {
                                id: 'h16',
                                description: '清政府颁布《奏定学堂章程》，近代教育体系确立',
                                type: 'education'
                            }
                        ]
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
                        historicalEvents: [
                            {
                                id: 'h17',
                                description: '中国同盟会在日本东京成立，孙中山提出"三民主义"',
                                type: 'political'
                            },
                            {
                                id: 'h18',
                                description: '清政府废除科举制度（延续1300年）',
                                type: 'education'
                            }
                        ]
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
                        historicalEvents: [
                            {
                                id: 'h19',
                                description: '徐锡麟、秋瑾领导浙皖起义，失败牺牲',
                                type: 'political'
                            },
                            {
                                id: 'h20',
                                description: '清政府颁布《钦定宪法大纲》，预备立宪',
                                type: 'political'
                            }
                        ]
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
                        historicalEvents: []
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
                        historicalEvents: [],
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
                        historicalEvents: [
                            {
                                id: 'h21',
                                description: '全国范围爆发抗捐抗税运动，社会矛盾激化',
                                type: 'social'
                            },
                            {
                                id: 'h22',
                                description: '清政府资政院正式成立',
                                type: 'political'
                            }
                        ],
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
                        historicalEvents: [
                            {
                                id: 'h23',
                                description: '中华民国成立，孙中山就任临时大总统',
                                type: 'political'
                            },
                            {
                                id: 'h24',
                                description: '清宣统帝退位，封建帝制结束',
                                type: 'political'
                            }
                        ],
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
                        historicalEvents: [
                            {
                                id: 'h25',
                                description: '"二次革命"爆发，反对袁世凯独裁',
                                type: 'political'
                            },
                            {
                                id: 'h26',
                                description: '袁世凯强迫国会选举其为正式大总统',
                                type: 'political'
                            }
                        ],
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
                        historicalEvents: [
                            {
                                id: 'h27',
                                description: '第一次世界大战爆发，日本对德宣战并占领青岛',
                                type: 'military'
                            },
                            {
                                id: 'h28',
                                description: '袁世凯解散国会，废除《中华民国临时约法》',
                                type: 'political'
                            }
                        ],
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
                        historicalEvents: [
                            {
                                id: 'h29',
                                description: '袁世凯复辟帝制，改国号为"中华帝国"',
                                type: 'political'
                            },
                            {
                                id: 'h30',
                                description: '新文化运动开始，陈独秀创办《新青年》',
                                type: 'cultural'
                            }
                        ],
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
                        historicalEvents: [
                            {
                                id: 'h31',
                                description: '袁世凯取消帝制，不久病逝',
                                type: 'political'
                            },
                            {
                                id: 'h32',
                                description: '军阀割据局面形成，段祺瑞掌握北京政权',
                                type: 'political'
                            }
                        ],
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
                        historicalEvents: [
                            {
                                id: 'h33',
                                description: '张勋复辟失败',
                                type: 'political'
                            },
                            {
                                id: 'h34',
                                description: '孙中山发起"护法运动"，反对段祺瑞独裁',
                                type: 'political'
                            }
                        ],
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
                        historicalEvents: [
                            {
                                id: 'h35',
                                description: '第一次世界大战结束，中国作为战胜国参加巴黎和会',
                                type: 'diplomatic'
                            },
                            {
                                id: 'h36',
                                description: '李大钊发表《庶民的胜利》，传播马克思主义',
                                type: 'cultural'
                            }
                        ],
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
                        historicalEvents: [
                            {
                                id: 'h37',
                                description: '陈独秀、李大钊等在各地建立共产主义小组',
                                type: 'political'
                            },
                            {
                                id: 'h38',
                                description: '中国第一条民航航线（北京-天津）开通',
                                type: 'industrial'
                            }
                        ],
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
                        historicalEvents: [
                            {
                                id: 'h39',
                                description: '中国共产党第一次全国代表大会召开，中国共产党成立',
                                type: 'political'
                            },
                            {
                                id: 'h40',
                                description: '华盛顿会议召开，讨论远东及太平洋问题',
                                type: 'diplomatic'
                            }
                        ],
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
                        historicalEvents: [
                            {
                                id: 'h41',
                                description: '第一次直奉战争爆发，直系军阀获胜',
                                type: 'military'
                            },
                            {
                                id: 'h42',
                                description: '中国共产党第二次全国代表大会召开，提出反帝反封建纲领',
                                type: 'political'
                            }
                        ],
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
                        historicalEvents: [
                            {
                                id: 'h43',
                                description: '京汉铁路工人大罢工，遭到军阀镇压（二七惨案）',
                                type: 'social'
                            },
                            {
                                id: 'h44',
                                description: '孙中山与苏俄代表越飞会谈，确立联俄政策',
                                type: 'diplomatic'
                            }
                        ],
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
                        historicalEvents: [
                            {
                                id: 'h45',
                                description: '中国国民党第一次全国代表大会召开，国共第一次合作正式形成',
                                type: 'political'
                            },
                            {
                                id: 'h46',
                                description: '黄埔军校成立，蒋介石任校长',
                                type: 'military'
                            }
                        ],
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
                        historicalEvents: [
                            {
                                id: 'h47',
                                description: '孙中山逝世',
                                type: 'political'
                            },
                            {
                                id: 'h48',
                                description: '五卅运动爆发，反帝爱国运动高涨',
                                type: 'social'
                            },
                            {
                                id: 'h49',
                                description: '国民革命军成立',
                                type: 'military'
                            }
                        ],
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
                        historicalEvents: [
                            {
                                id: 'h50',
                                description: '国民革命军开始北伐，讨伐吴佩孚、孙传芳等军阀',
                                type: 'military'
                            },
                            {
                                id: 'h51',
                                description: '冯玉祥率部参加国民革命，进军河南',
                                type: 'military'
                            }
                        ]
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
                        historicalEvents: [
                            {
                                id: 'h52',
                                description: '蒋介石发动"四一二"反革命政变，屠杀共产党人',
                                type: 'political'
                            },
                            {
                                id: 'h53',
                                description: '汪精卫发动"七一五"反革命政变，国共合作破裂',
                                type: 'political'
                            },
                            {
                                id: 'h54',
                                description: '南昌起义、秋收起义爆发，中国共产党开始创建革命根据地',
                                type: 'military'
                            }
                        ],
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
                        historicalEvents: [
                            {
                                id: 'h55',
                                description: '张学良宣布"东北易帜"，南京国民政府形式上统一全国',
                                type: 'political'
                            },
                            {
                                id: 'h56',
                                description: '井冈山革命根据地建立，"工农武装割据"开始',
                                type: 'political'
                            }
                        ],
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
                        historicalEvents: [
                            {
                                id: 'h57',
                                description: '古田会议召开，确立人民军队建设原则',
                                type: 'political'
                            },
                            {
                                id: 'h58',
                                description: '世界经济大危机爆发，影响中国经济',
                                type: 'economic'
                            }
                        ]
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
                        historicalEvents: [
                            {
                                id: 'h59',
                                description: '中原大战爆发（蒋介石与冯玉祥、阎锡山等军阀混战）',
                                type: 'military'
                            },
                            {
                                id: 'h60',
                                description: '红军开始反"围剿"斗争',
                                type: 'military'
                            }
                        ],
                        relatedWorks: [
                            { id: 40, title: '《绿绮园图》' }
                        ]
                    },// 在 src/services/bioDataService.js 的 getTimelineEvents 函数中继续添加

// 1931年
                    {
                        id: 32,
                        year: 1931,
                        title: '游雁荡山创作',
                        description: '5月游雁荡山创作作品《雁荡山巨幛》《大龙湫图》《三折瀑图》《响岩三景》《铁城壮观之图》等另创作作品《雁宕山轴》《山水图》《南巡图》《北濠草堂图》《大至阁图》《雁荡风景》《焦山北岸浮屿》《甘露寺》《墨石》《无数飞花送小舟》《浅绛山水》等。',
                        type: 'creation',
                        location: '浙江雁荡山',
                        period: '讲学游历',
                        detailedContent: '5月游览雁荡山，被其壮丽景色所震撼，创作了大量山水作品，包括《雁荡山巨幛》《大龙湫图》《三折瀑图》等系列重要作品。这些作品展现了黄宾虹对自然山水的深刻理解和独特的艺术表现力，艺术创作达到新的高度。',
                        historicalEvents: [
                            {
                                id: 'h61',
                                description: '"九一八事变"爆发，日本侵占中国东北',
                                type: 'military'
                            },
                            {
                                id: 'h62',
                                description: '中华苏维埃共和国临时中央政府在瑞金成立',
                                type: 'political'
                            }
                        ],
                        relatedWorks: [
                            { id: 41, title: '《雁荡山巨幛》' },
                            { id: 42, title: '《大龙湫图》' },
                            { id: 43, title: '《三折瀑图》' },
                            { id: 44, title: '《响岩三景》' }
                        ]
                    },

// 1932年
                    {
                        id: 33,
                        year: 1932,
                        title: '与张大千等合作创作',
                        description: '与谢觐虞、张大千、张善孖同游上海浦东合作创作作品《红梵精舍图》另被四川艺术专科学校聘为校董、中国画系主任创作作品《潜县落云山浙皖纪游》《黄山智慧海一角》《丹台黄山游纪》《临安县留山浙皖纪游》《舟山》《罗东埠》《白帝城》《峨嵋山春色卷》《孤舟山水云晴时》《湖荷忆昨图》等。',
                        type: 'creation',
                        location: '上海',
                        period: '讲学游历',
                        detailedContent: '与谢觐虞、张大千、张善孖等艺术家同游上海浦东，合作创作《红梵精舍图》，艺术交流活跃。同时被四川艺术专科学校聘为校董、中国画系主任，创作了大量山水作品，展现了对各地风光的深刻感悟。',
                        historicalEvents: [
                            {
                                id: 'h63',
                                description: '"一二八事变"爆发，十九路军在上海抗击日军',
                                type: 'military'
                            },
                            {
                                id: 'h64',
                                description: '日本扶植溥仪成立"伪满洲国"',
                                type: 'political'
                            }
                        ],
                        relatedWorks: [
                            { id: 45, title: '《红梵精舍图》' },
                            { id: 46, title: '《潜县落云山浙皖纪游》' },
                            { id: 47, title: '《黄山智慧海一角》' }
                        ]
                    },

// 1933年
                    {
                        id: 34,
                        year: 1933,
                        title: '任暨南大学山水画导师',
                        description: '任暨南大学中国画研究会山水画导师另创作作品《北碚纪游》《设色山水扇面》《江郎山化石亭》《大背口》《海山南望》《尧山》《象鼻山》《桂林山水》等。',
                        type: 'work',
                        location: '上海',
                        period: '讲学游历',
                        detailedContent: '担任暨南大学中国画研究会山水画导师，培养山水画人才。创作《北碚纪游》《桂林山水》等作品，记录游历见闻，艺术创作持续丰富。',
                        historicalEvents: [
                            {
                                id: 'h65',
                                description: '长城抗战爆发，中国军队抗击日军',
                                type: 'military'
                            },
                            {
                                id: 'h66',
                                description: '冯玉祥、吉鸿昌等成立察哈尔民众抗日同盟军',
                                type: 'military'
                            }
                        ],
                        relatedWorks: [
                            { id: 48, title: '《北碚纪游》' },
                            { id: 49, title: '《桂林山水》' },
                            { id: 50, title: '《江郎山化石亭》' }
                        ]
                    },

// 1934年
                    {
                        id: 35,
                        year: 1934,
                        title: '参加百川书画会展览',
                        description: '10月参加百川书画会在上海湖社举行的第一届书画展览会另创作作品《墨巢图》《峨嵋道中》《白华》《听帆楼图之二、之三》《松石》《甲戌题蜀游诗》《山水赠天知》等。',
                        type: 'exhibition',
                        location: '上海',
                        period: '讲学游历',
                        detailedContent: '10月参加百川书画会在上海湖社举行的第一届书画展览会，展示艺术成就。创作《墨巢图》《峨嵋道中》等作品，记录艺术探索历程。',
                        historicalEvents: [
                            {
                                id: 'h67',
                                description: '红军第五次反"围剿"失败，开始长征',
                                type: 'military'
                            },
                            {
                                id: 'h68',
                                description: '伪"满洲国"改为"满洲帝国"，溥仪称帝',
                                type: 'political'
                            }
                        ],
                        relatedWorks: [
                            { id: 51, title: '《墨巢图》' },
                            { id: 52, title: '《峨嵋道中》' },
                            { id: 53, title: '《听帆楼图》' }
                        ]
                    },

// 1935年 - 第一个事件
                    {
                        id: 36,
                        year: 1935,
                        title: '发表重要论文与创作',
                        description: '在《国画月刊》发表《新安派论略》《中国山水画今昔之变迁》《论画宜取所长》《精神重于物质说》等论文在《教育杂志》上发表《画学升降之大因》一文8月创作作品《四川山水长卷》《西湖长卷》9月与刘海粟合作创作作品《苍鹰松石图》与徐悲鸿合作创作作品《杂树岩泉》另创作作品《灌县离堆》《黄牛山风景》《龙凤潭风景》《设色花卉》《黄鹂湾》《鸡回角》《宋王台》《翠崖》《深壑微磴》《疏林春意》《泛舟》《渔乐》《粤江风便图》等。受广西壮族自治区教育厅之邀请已是70岁高龄的黄宾虹再度来广西讲学之后游大容山、北流的勾漏洞、容县都峤山等地方曾住冯振北流山围村人时任无锡国专教授的山围家中与冯振作诗文互答与绘画写生稿甚多创作《山围八景》图卷等。',
                        type: 'creation',
                        location: '上海',
                        period: '讲学游历',
                        detailedContent: '在《国画月刊》《教育杂志》发表多篇重要理论文章，系统阐述艺术观点。8月创作《四川山水长卷》《西湖长卷》等大幅作品，9月与刘海粟、徐悲鸿等艺术家合作创作，艺术交流活跃。',
                        historicalEvents: [
                            {
                                id: 'h69',
                                description: '遵义会议召开，确立毛泽东在党中央和红军的领导地位',
                                type: 'political'
                            },
                            {
                                id: 'h70',
                                description: '"一二九运动"爆发，抗日救亡运动高涨',
                                type: 'social'
                            },
                            {
                                id: 'h71',
                                description: '日本策划"华北五省自治"，企图分裂中国',
                                type: 'political'
                            }
                        ],
                        relatedWorks: [
                            { id: 54, title: '《四川山水长卷》' },
                            { id: 55, title: '《西湖长卷》' },
                            { id: 56, title: '《苍鹰松石图》' },
                            { id: 57, title: '《杂树岩泉》' }
                        ]
                    },

                    {
                        id: 38,
                        year: 1936,
                        title: '出版纪游画册',
                        description: '4月编著出版《黄宾虹纪游画册》另创作作品《茹经堂图》《横槎江上》《湖波如镜绕山斜》《翠峦帆影》《浓阴喁语》《讲外彩屿》等。',
                        type: 'publication',
                        location: '上海',
                        period: '讲学游历',
                        detailedContent: '4月编著出版《黄宾虹纪游画册》，系统整理游历创作成果。同时创作《茹经堂图》《横槎江上》等作品，艺术风格更加成熟。',
                        historicalEvents: [
                            {
                                id: 'h74',
                                description: '"西安事变"爆发，张学良、杨虎城逼蒋抗日，国共第二次合作初步形成',
                                type: 'political'
                            },
                            {
                                id: 'h75',
                                description: '红军三大主力在甘肃会宁会师，长征胜利结束',
                                type: 'military'
                            }
                        ],
                        relatedWorks: [
                            { id: 59, title: '《茹经堂图》' },
                            { id: 60, title: '《横槎江上》' },
                            { id: 61, title: '《翠峦帆影》' }
                        ]
                    },

// 1937年
                    {
                        id: 39,
                        year: 1937,
                        title: '任教北京艺专',
                        description: '4月任全国美术研究学会临时理事8月任教于古物陈列所国画研究院馆并任北京艺术专科学校教授另创作作品《水墨水山》《海山揽胜》等。',
                        type: 'work',
                        location: '北京',
                        period: '讲学游历',
                        detailedContent: '4月任全国美术研究学会临时理事，8月任教于古物陈列所国画研究院馆并任北京艺术专科学校教授，继续艺术教育工作。创作《水墨水山》《海山揽胜》等作品。',
                        historicalEvents: [
                            {
                                id: 'h76',
                                description: '"七七事变"（卢沟桥事变）爆发，全面抗日战争开始',
                                type: 'military'
                            },
                            {
                                id: 'h77',
                                description: '"八一三事变"爆发，淞沪会战开始',
                                type: 'military'
                            },
                            {
                                id: 'h78',
                                description: '南京大屠杀，日军屠杀中国平民30万人以上',
                                type: 'military'
                            }
                        ],
                        relatedWorks: [
                            { id: 62, title: '《水墨水山》' },
                            { id: 63, title: '《海山揽胜》' }
                        ]
                    },

// 1938年
                    {
                        id: 40,
                        year: 1938,
                        title: '创作山水作品',
                        description: '创作作品《设色山水》《宋故行宫图》《光网楼图》等。',
                        type: 'creation',
                        location: '北京',
                        period: '讲学游历',
                        detailedContent: '在抗日战争期间坚持艺术创作，完成《设色山水》《宋故行宫图》《光网楼图》等作品，展现艺术家的坚守与执着。',
                        historicalEvents: [
                            {
                                id: 'h79',
                                description: '台儿庄大捷，中国军队重创日军',
                                type: 'military'
                            },
                            {
                                id: 'h80',
                                description: '武汉会战结束，抗日战争进入相持阶段',
                                type: 'military'
                            }
                        ],
                        relatedWorks: [
                            { id: 64, title: '《设色山水》' },
                            { id: 65, title: '《宋故行宫图》' },
                            { id: 66, title: '《光网楼图》' }
                        ]
                    },

// 1939年
                    {
                        id: 41,
                        year: 1939,
                        title: '创作系列山水',
                        description: '创作作品《黄山风景》《淡沱云波见》《括岭入青天》《息茶庵图》《海岸一角》《李莼客句》等。',
                        type: 'creation',
                        location: '北京',
                        period: '讲学游历',
                        detailedContent: '在抗战相持阶段坚持艺术创作，完成《黄山风景》《淡沱云波见》《括岭入青天》等作品，以艺术表达对祖国山河的热爱。',
                        historicalEvents: [
                            {
                                id: 'h81',
                                description: '日军对国民党正面战场和共产党敌后战场发动大规模进攻',
                                type: 'military'
                            },
                            {
                                id: 'h82',
                                description: '国民党五届五中全会确立"溶共、防共、限共、反共"方针',
                                type: 'political'
                            }
                        ],
                        relatedWorks: [
                            { id: 67, title: '《黄山风景》' },
                            { id: 68, title: '《淡沱云波见》' },
                            { id: 69, title: '《括岭入青天》' }
                        ]
                    },

// 1940年
                    {
                        id: 42,
                        year: 1940,
                        title: '出版印谱与发表论文',
                        description: '编著著作《滨虹草堂集古玺印谱》《古玉印叙》《滨虹草堂藏古印自叙》另在《中和月刊》发表论文《画谈》《庚辰降生之书画家》《医无闾山摩崖巨手之书书画》《渐江大师事迹佚闻》《龙凤印谈》《周秦印谈》《释傩古印谈之一》等文章创作作品《匡庐白云》《设色山水卷》《拟李希古写蜀中山景》《白云深处药苗香》《百般峦清流》《叠翠泉生》《春雨朦霏》等。',
                        type: 'publication',
                        location: '北京',
                        period: '讲学游历',
                        detailedContent: '编著出版多部印谱著作，在《中和月刊》发表系列重要理论文章，系统阐述艺术观点。同时创作《匡庐白云》《设色山水卷》等作品，理论与实践并重。',
                        historicalEvents: [
                            {
                                id: 'h83',
                                description: '百团大战爆发，八路军在华北大规模出击日军',
                                type: 'military'
                            },
                            {
                                id: 'h84',
                                description: '汪精卫在南京成立伪国民政府，投靠日本',
                                type: 'political'
                            }
                        ],
                        relatedWorks: [
                            { id: 70, title: '《匡庐白云》' },
                            { id: 71, title: '《设色山水卷》' },
                            { id: 72, title: '《拟李希古写蜀中山景》' }
                        ]
                    },

// 1941年
                    {
                        id: 43,
                        year: 1941,
                        title: '发表论文与创作',
                        description: '在《中和月刊》发表《阳识象形受觯说》创作作品《听园校书图》《西山有鹤鸣》《粤西兴坪纪游之一、之二》《设色山水》《具区渔艇》《潭上清兴》等。',
                        type: 'creation',
                        location: '北京',
                        period: '讲学游历',
                        detailedContent: '在《中和月刊》发表《阳识象形受觯说》等重要论文，继续艺术理论研究。创作《听园校书图》《西山有鹤鸣》等作品，艺术创作持续进行。',
                        historicalEvents: [
                            {
                                id: 'h85',
                                description: '太平洋战争爆发，中国对日本、德国、意大利宣战',
                                type: 'military'
                            },
                            {
                                id: 'h86',
                                description: '日军对延安等抗日根据地发动"扫荡"，实行"三光"政策',
                                type: 'military'
                            }
                        ],
                        relatedWorks: [
                            { id: 73, title: '《听园校书图》' },
                            { id: 74, title: '《西山有鹤鸣》' },
                            { id: 75, title: '《粤西兴坪纪游》' }
                        ]
                    },

// 1942年
                    {
                        id: 44,
                        year: 1942,
                        title: '创作诗意山水',
                        description: '创作作品《写李空同诗意》《没骨山水》《萧疏淡远》《拟李檀园笔意》等。',
                        type: 'creation',
                        location: '北京',
                        period: '讲学游历',
                        detailedContent: '创作《写李空同诗意》等以诗意入画的作品，探索文人画的新境界。尝试《没骨山水》等不同技法，艺术探索不断深入。',
                        historicalEvents: [
                            {
                                id: 'h87',
                                description: '中国远征军入缅作战，支援盟军',
                                type: 'military'
                            },
                            {
                                id: 'h88',
                                description: '延安整风运动开始，加强党的思想建设',
                                type: 'political'
                            }
                        ],
                        relatedWorks: [
                            { id: 76, title: '《写李空同诗意》' },
                            { id: 77, title: '《没骨山水》' },
                            { id: 78, title: '《萧疏淡远》' }
                        ]
                    },

// 1943年
                    {
                        id: 45,
                        year: 1943,
                        title: '发表研究文章',
                        description: '在《中和月刊》发表《垢道人佚事》《垢道人遗著》。',
                        type: 'publication',
                        location: '北京',
                        period: '讲学游历',
                        detailedContent: '在《中和月刊》发表《垢道人佚事》《垢道人遗著》等研究文章，深入探讨古代画家艺术成就，展现深厚的艺术史研究功底。',
                        historicalEvents: [
                            {
                                id: 'h89',
                                description: '中、美、英三国发表《开罗宣言》，明确日本必须归还中国领土',
                                type: 'diplomatic'
                            },
                            {
                                id: 'h90',
                                description: '国民党发动第三次反共高潮，被挫败',
                                type: 'political'
                            }
                        ]
                    },

// 1944年
                    {
                        id: 46,
                        year: 1944,
                        title: '发表文章与创作',
                        description: '在《中和月刊》发表《画家佚事》创作作品《拟董巨二米大意》《闲闲草堂》《山水扇面》等。',
                        type: 'creation',
                        location: '北京',
                        period: '讲学游历',
                        detailedContent: '在《中和月刊》发表《画家佚事》，同时创作《拟董巨二米大意》《闲闲草堂》等作品，理论与实践相结合。',
                        historicalEvents: [
                            {
                                id: 'h91',
                                description: '日军发动"豫湘桂战役"，国民党军队大溃败',
                                type: 'military'
                            },
                            {
                                id: 'h92',
                                description: '中国共产党提出建立民主联合政府的主张',
                                type: 'political'
                            }
                        ],
                        relatedWorks: [
                            { id: 79, title: '《拟董巨二米大意》' },
                            { id: 80, title: '《闲闲草堂》' },
                            { id: 81, title: '《山水扇面》' }
                        ]
                    },

// 1945年
                    {
                        id: 47,
                        year: 1945,
                        title: '创作抗战胜利题材',
                        description: '创作作品《黄河冰封图》《归猎》《灵岩》《南桥》《桂林山水》《设色山水》《金文联》等。',
                        type: 'creation',
                        location: '北京',
                        period: '讲学游历',
                        detailedContent: '在抗日战争胜利之际创作《黄河冰封图》等作品，表达对祖国山河的热爱和对和平的向往。',
                        historicalEvents: [
                            {
                                id: 'h93',
                                description: '日本宣布无条件投降，抗日战争胜利结束',
                                type: 'military'
                            },
                            {
                                id: 'h94',
                                description: '重庆谈判开始，国共两党商讨建国大计',
                                type: 'political'
                            },
                            {
                                id: 'h95',
                                description: '中国共产党第七次全国代表大会召开，确立毛泽东思想为党的指导思想',
                                type: 'political'
                            }
                        ],
                        relatedWorks: [
                            { id: 82, title: '《黄河冰封图》' },
                            { id: 83, title: '《归猎》' },
                            { id: 84, title: '《桂林山水》' }
                        ]
                    },

// 1946年
                    {
                        id: 48,
                        year: 1946,
                        title: '创作山水作品',
                        description: '创作作品《挹翠阁图》《海印庵图卷》《设色山水》《松涛》《阳朔山水》等。',
                        type: 'creation',
                        location: '北京',
                        period: '讲学游历',
                        detailedContent: '在解放战争期间坚持艺术创作，完成《挹翠阁图》《海印庵图卷》等作品，记录对祖国山河的深情。',
                        historicalEvents: [
                            {
                                id: 'h96',
                                description: '国民党撕毁《双十协定》，全面内战爆发',
                                type: 'military'
                            },
                            {
                                id: 'h97',
                                description: '中国共产党领导解放区军民开始自卫反击',
                                type: 'military'
                            }
                        ],
                        relatedWorks: [
                            { id: 85, title: '《挹翠阁图》' },
                            { id: 86, title: '《海印庵图卷》' },
                            { id: 87, title: '《阳朔山水》' }
                        ]
                    },

// 1947年
                    {
                        id: 49,
                        year: 1947,
                        title: '创作多样题材',
                        description: '创作作品《聪明才智训草堂图》《拟元人花卉》《拟董北苑笔意卷》《写元人诗意》《金华洞风景》《武夷山水》《蜀山玲珑》《严陵上游写景》《闽江舟中所见》《虎溪》《青山敛轻云》《红尘飞尽》等。',
                        type: 'creation',
                        location: '北京',
                        period: '讲学游历',
                        detailedContent: '创作题材丰富多样，包括《聪明才智训草堂图》等人物画，《拟元人花卉》等花鸟画，以及《金华洞风景》等山水画，展现全面的艺术造诣。',
                        historicalEvents: [
                            {
                                id: 'h98',
                                description: '刘邓大军挺进大别山，揭开战略反攻序幕',
                                type: 'military'
                            },
                            {
                                id: 'h99',
                                description: '国民党发布"戡乱总动员令"，镇压爱国民主运动',
                                type: 'political'
                            }
                        ],
                        relatedWorks: [
                            { id: 88, title: '《聪明才智训草堂图》' },
                            { id: 89, title: '《拟元人花卉》' },
                            { id: 90, title: '《金华洞风景》' }
                        ]
                    },

// 1948年
                    {
                        id: 50,
                        year: 1948,
                        title: '创作晚期作品',
                        description: '创作作品《山水轴》《蜀山纪游》《江山无尽》《阳朔山水》《山墨山水》《写陈擅诗意》《嘉陵江上小景卷》《坐年枫林百叠秋》《拟米南宫意》《山水诗轴酬君量》《蜀江玉垒关写景》等。',
                        type: 'creation',
                        location: '北京',
                        period: '讲学游历',
                        detailedContent: '在解放战争胜利前夕创作大量作品，包括《山水轴》《蜀山纪游》《江山无尽》等，艺术风格更加成熟凝重。',
                        historicalEvents: [
                            {
                                id: 'h100',
                                description: '辽沈、淮海、平津三大战役先后开始，解放军歼灭国民党主力部队',
                                type: 'military'
                            },
                            {
                                id: 'h101',
                                description: '国民党统治区经济崩溃，物价飞涨',
                                type: 'economic'
                            }
                        ],
                        relatedWorks: [
                            { id: 91, title: '《山水轴》' },
                            { id: 92, title: '《蜀山纪游》' },
                            { id: 93, title: '《江山无尽》' }
                        ]
                    },

// 1949年
                    {
                        id: 51,
                        year: 1949,
                        title: '任国立艺专教授',
                        description: '8月任国立艺术专科学校教授并被杭州市人民政府推为杭州市各界人民代表会议代表另创作作品《潭渡村图》《梅竹双清图》《内伶仃风景》《云山叠翠》《湖滨纪游》《新安江舟中所见》《西湖栖霞岭南望》《仙山楼阁》《黄山异卉轴》等。',
                        type: 'work',
                        location: '杭州',
                        period: '新中国成立后',
                        detailedContent: '新中国成立后，8月任国立艺术专科学校教授，并被推为杭州市各界人民代表会议代表，积极参与新中国的文化建设。创作《潭渡村图》《梅竹双清图》等作品，艺术创作进入新阶段。',
                        historicalEvents: [
                            {
                                id: 'h102',
                                description: '中华人民共和国成立，毛泽东在天安门宣布新中国诞生',
                                type: 'political'
                            },
                            {
                                id: 'h103',
                                description: '国民党退守台湾，解放战争基本结束',
                                type: 'military'
                            }
                        ],
                        relatedWorks: [
                            { id: 94, title: '《潭渡村图》' },
                            { id: 95, title: '《梅竹双清图》' },
                            { id: 96, title: '《云山叠翠》' }
                        ]
                    },

// 1950年
                    {
                        id: 52,
                        year: 1950,
                        title: '创作新中国题材',
                        description: '创作作品《湖山爽气图》《焦墨山水》《拟王翘草虫花卉》《峰叠云回》《挹翠阁图之二》《简笔山水》《雁宕泷湫实景》《青城樵者》。',
                        type: 'creation',
                        location: '杭州',
                        period: '新中国成立后',
                        detailedContent: '在新中国成立初期创作《湖山爽气图》《焦墨山水》等作品，艺术风格更加简练凝重，体现新时代的艺术追求。',
                        historicalEvents: [
                            {
                                id: 'h104',
                                description: '抗美援朝战争开始，中国人民志愿军赴朝作战',
                                type: 'military'
                            },
                            {
                                id: 'h105',
                                description: '土地改革运动在全国展开，废除封建土地制度',
                                type: 'social'
                            }
                        ],
                        relatedWorks: [
                            { id: 97, title: '《湖山爽气图》' },
                            { id: 98, title: '《焦墨山水》' },
                            { id: 99, title: '《简笔山水》' }
                        ]
                    },

// 1952年
                    {
                        id: 53,
                        year: 1952,
                        title: '创作晚期山水',
                        description: '创作作品《黄山风景》《黄山松谷白龙潭》《设色长卷》《殊音阁摹印图》《湖山欲雨图》《山水》《黄山鸣弦泉》《湖舍晴初》《拟色安吴》等。',
                        type: 'creation',
                        location: '杭州',
                        period: '新中国成立后',
                        detailedContent: '晚年创作《黄山风景》《黄山松谷白龙潭》等作品，对黄山的描绘更加深刻，艺术达到炉火纯青的境界。',
                        historicalEvents: []
                    },

// 1953年
                    {
                        id: 54,
                        year: 1953,
                        title: '被授予人民艺术家称号',
                        description: '被授予人民艺术家称号并当选为中国美术家协会常务理事和中国文学艺术界联合会第二届全国委员另创作作品《南岳山水图》《松柏同春》《芙蓉轴》《神仙伴侣》《新安江舟行所见》《江上归帆》《横槎江上》《焦墨山水》《蜀山图》《江树图》《永康山》《练江南岸》《题赠怒庵山水扇面》《羚羊峡》《拟邹衣白慎山水》等。',
                        type: 'award',
                        location: '北京',
                        period: '新中国成立后',
                        detailedContent: '因其在艺术领域的卓越贡献，被授予"人民艺术家"荣誉称号，并当选为中国美术家协会常务理事和中国文学艺术界联合会第二届全国委员。同时创作《南岳山水图》《松柏同春》等大量作品，艺术成就达到顶峰。',
                        historicalEvents: [
                            {
                                id: 'h106',
                                description: '抗美援朝战争结束，中朝军队取得胜利',
                                type: 'military'
                            },
                            {
                                id: 'h107',
                                description: '第一个五年计划开始实施，集中力量发展重工业',
                                type: 'economic'
                            },
                            {
                                id: 'h108',
                                description: '三大改造开始（农业、手工业、资本主义工商业）',
                                type: 'social'
                            }
                        ],
                        relatedWorks: [
                            { id: 100, title: '《南岳山水图》' },
                            { id: 101, title: '《松柏同春》' },
                            { id: 102, title: '《芙蓉轴》' }
                        ]
                    },

// 1954年
                    {
                        id: 55,
                        year: 1954,
                        title: '担任重要职务',
                        description: '当选为中国美术家协会华东分会副主席并任中央美术学院民族美术研究所所长7月当选为浙江省人民代表大会代表另创作作品《蜀江归舟》《云谷寺晓望》《澄怀观化》《西溪草堂》《青城宵深》《富春览胜》《苍霭静籁》《新安江纪游》《风岩曲流》《叠嶂幽林》《叙州对岸》《清凉台西望》《舟山》等。',
                        type: 'work',
                        location: '杭州、北京',
                        period: '新中国成立后',
                        detailedContent: '当选为中国美术家协会华东分会副主席，任中央美术学院民族美术研究所所长，7月当选为浙江省人民代表大会代表，积极参与新中国美术事业建设。创作《蜀江归舟》《云谷寺晓望》等作品。',
                        historicalEvents: []
                    },

// 1955年
                    {
                        id: 56,
                        year: 1955,
                        title: '在杭州逝世',
                        description: '获评为中国人民优秀的画家1月当选中国人民政治协商会议第二届全国委员会委员3月25日在杭州逝世享年90岁。',
                        type: 'death',
                        location: '杭州',
                        period: '不幸逝世',
                        detailedContent: '1955年1月当选中国人民政治协商会议第二届全国委员会委员，3月25日在杭州逝世，享年90岁。黄宾虹的艺术成就和理论贡献对中国近现代绘画发展产生了深远影响，被誉为"中国人民优秀的画家"。',
                        historicalEvents: [
                            {
                                id: 'h109',
                                description: '万隆会议召开，中国提出"和平共处五项原则"',
                                type: 'diplomatic'
                            },
                            {
                                id: 'h110',
                                description: '三大改造基本完成，社会主义制度在中国确立',
                                type: 'social'
                            }
                        ]
                    }
                ]
            });
        }, 800);
    });
};

// 获取历史事件类型颜色
export const getHistoricalEventColor = (type) => {
    const colors = {
        political: '#8B4513',      // 深棕色，象征政治的历史厚重感
        military: '#A52A2A',       // 红棕色，象征军事的激烈
        diplomatic: '#556B2F',     // 橄榄绿，象征外交的平和
        economic: '#DAA520',       // 金黄色，象征经济的繁荣
        industrial: '#696969',     // 深灰色，象征工业的坚实
        education: '#2E8B57',      // 海绿色，象征教育的生机
        cultural: '#B8860B',       // 暗金色，象征文化的传承
        social: '#CD853F'          // 秘鲁色，象征社会的温暖
    };
    return colors[type] || '#8FBC8F'; // 默认使用淡墨绿色
};

// 获取历史事件类型文本
export const getHistoricalEventText = (type) => {
    const texts = {
        political: '政治',
        military: '军事',
        diplomatic: '外交',
        economic: '经济',
        industrial: '工业',
        education: '教育',
        cultural: '文化',
        social: '社会'
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
    return colors[type] || '#8FBC8F'; // 默认使用淡墨绿色
};

// 获取事件类型文本
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