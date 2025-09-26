import { HistoricalFigure } from '@/types';

export const historicalFigures: HistoricalFigure[] = [
  {
    id: 'alexander-the-great',
    name: 'Alexander the Great',
    chineseName: '亚历山大大帝',
    birthYear: -356,
    deathYear: -323,
    birthDate: '-356-07-20',
    deathDate: '-323-06-10',
    nationality: '马其顿',
    occupation: ['国王', '军事家', '征服者'],
    category: 'military',
    era: '古典时期',
    biography: '亚历山大三世，史称亚历山大大帝，是古代马其顿王国的国王，也是世界历史上最伟大的军事天才和征服者之一。他建立了从希腊到印度的庞大帝国，将希腊文化传播到整个已知世界，开创了希腊化时代。',
    knownFor: [
      '征服波斯帝国',
      '建立横跨欧亚非的庞大帝国',
      '传播希腊文化',
      '创建亚历山大城'
    ],
    influence: 10,
    tags: ['征服者', '军事天才', '国王', '希腊化'],
    quotes: [
      '我不怕千万人阻挡，只怕自己投降',
      '通过每一次胜利，我们不是在征服敌人，而是在征服自己'
    ],
    achievements: [
      {
        id: 'alex-1',
        age: 13,
        year: -343,
        title: '师从亚里士多德',
        description: '开始在亚里士多德门下学习哲学、政治、医学和文学，这位伟大的哲学家培养了他的智慧和领导才能。',
        category: 'education',
        importance: 'high',
        location: '马其顿',
        sources: ['Plutarch, Life of Alexander', 'Arrian, Anabasis of Alexander']
      },
      {
        id: 'alex-2',
        age: 16,
        year: -340,
        title: '镇压马其顿起义',
        description: '父王腓力二世外征时，亚历山大代为摄政，成功镇压了色雷斯人的起义，展现出卓越的军事和政治才能。',
        category: 'leadership',
        importance: 'medium',
        location: '马其顿',
        sources: ['Diodorus Siculus, Historical Library']
      },
      {
        id: 'alex-3',
        age: 18,
        year: -338,
        title: '喀罗尼亚战役',
        description: '在父王腓力二世领导下参与对抗希腊城邦联军的决定性战役，亚历山大指挥骑兵，为马其顿的胜利立下汗马功劳。',
        category: 'achievement',
        importance: 'high',
        location: '喀罗尼亚',
        relatedFigures: ['腓力二世', '德摩斯梯尼'],
        sources: ['Plutarch, Life of Alexander']
      },
      {
        id: 'alex-4',
        age: 20,
        year: -336,
        title: '继承马其顿王位',
        description: '父王腓力二世遇刺身亡后继承王位，迅速巩固了马其顿的统治，并准备实施父亲征服波斯的计划。',
        category: 'leadership',
        importance: 'high',
        location: '马其顿',
        sources: ['Diodorus Siculus, Historical Library']
      },
      {
        id: 'alex-5',
        age: 22,
        year: -334,
        title: '渡过赫勒斯滂海峡',
        description: '率领3.5万大军渡过赫勒斯滂海峡（今达达尼尔海峡），开始了征服波斯帝国的伟大远征。',
        category: 'achievement',
        importance: 'high',
        location: '小亚细亚',
        sources: ['Arrian, Anabasis of Alexander']
      },
      {
        id: 'alex-6',
        age: 22,
        year: -334,
        title: '格拉尼库斯河战役',
        description: '在小亚细亚的第一次重大胜利，击败了波斯军队，为进一步征服小亚细亚奠定了基础。',
        category: 'achievement',
        importance: 'high',
        location: '格拉尼库斯河',
        sources: ['Arrian, Anabasis of Alexander', 'Plutarch, Life of Alexander']
      },
      {
        id: 'alex-7',
        age: 23,
        year: -333,
        title: '伊苏斯战役',
        description: '在决定性的伊苏斯战役中击败波斯国王大流士三世，俘获了波斯王室的家属，确立了在小亚细亚的统治地位。',
        category: 'achievement',
        importance: 'high',
        location: '伊苏斯',
        relatedFigures: ['大流士三世'],
        sources: ['Arrian, Anabasis of Alexander', 'Curtius Rufus, Histories of Alexander']
      },
      {
        id: 'alex-8',
        age: 24,
        year: -332,
        title: '征服埃及',
        description: '征服埃及，被埃及人奉为解放者和法老，在尼罗河口建立了著名的亚历山大城。',
        category: 'achievement',
        importance: 'high',
        location: '埃及',
        sources: ['Arrian, Anabasis of Alexander', 'Diodorus Siculus']
      },
      {
        id: 'alex-9',
        age: 25,
        year: -331,
        title: '高加米拉战役',
        description: '在高加米拉战役中彻底击败大流士三世，征服了波斯帝国的心脏地带，成为亚洲的主宰。',
        category: 'achievement',
        importance: 'high',
        location: '高加米拉',
        relatedFigures: ['大流士三世'],
        sources: ['Arrian, Anabasis of Alexander', 'Plutarch, Life of Alexander']
      },
      {
        id: 'alex-10',
        age: 26,
        year: -330,
        title: '征服波斯波利斯',
        description: '攻占波斯帝国的礼仪首都波斯波利斯，焚毁了薛西斯宫殿，为希腊报了波斯战争的仇。',
        category: 'achievement',
        importance: 'high',
        location: '波斯波利斯',
        sources: ['Arrian, Anabasis of Alexander', 'Plutarch, Life of Alexander']
      },
      {
        id: 'alex-11',
        age: 29,
        year: -327,
        title: '征服印度河流域',
        description: '越过印度河，在海达斯佩斯河战役中击败印度国王波鲁斯，将帝国疆域扩展到印度。',
        category: 'achievement',
        importance: 'high',
        location: '印度河流域',
        relatedFigures: ['波鲁斯国王'],
        sources: ['Arrian, Anabasis of Alexander']
      },
      {
        id: 'alex-12',
        age: 32,
        year: -324,
        title: '回到巴比伦',
        description: '经过8年的征战，回到巴比伦，开始规划将希腊文化与东方文化融合的宏伟计划。',
        category: 'leadership',
        importance: 'medium',
        location: '巴比伦',
        sources: ['Arrian, Anabasis of Alexander', 'Plutarch, Life of Alexander']
      }
    ]
  },

  {
    id: 'leonardo-da-vinci',
    name: 'Leonardo da Vinci',
    chineseName: '列奥纳多·达·芬奇',
    birthYear: 1452,
    deathYear: 1519,
    birthDate: '1452-04-15',
    deathDate: '1519-05-02',
    nationality: '意大利',
    occupation: ['画家', '发明家', '科学家', '工程师', '建筑师'],
    category: 'artist',
    era: '文艺复兴时期',
    biography: '列奥纳多·达·芬奇是意大利文艺复兴时期最杰出的代表人物之一，被誉为"文艺复兴完人"。他不仅是伟大的画家，还是发明家、科学家、工程师、建筑师，在多个领域都有卓越贡献。',
    knownFor: [
      '创作《蒙娜丽莎》',
      '创作《最后的晚餐》',
      '设计飞行器和军事工程',
      '解剖学研究'
    ],
    influence: 10,
    tags: ['画家', '发明家', '科学家', '天才', '文艺复兴'],
    quotes: [
      '学习是永远不嫌多的',
      '障碍不能使我弯腰',
      '简单是复杂的最高境界'
    ],
    achievements: [
      {
        id: 'leonardo-1',
        age: 14,
        year: 1466,
        title: '进入维罗基奥工作坊',
        description: '进入佛罗伦萨著名艺术家安德烈·德尔·维罗基奥的工作坊做学徒，开始系统学习绘画、雕塑和工程技术。',
        category: 'education',
        importance: 'high',
        location: '佛罗伦萨',
        relatedFigures: ['安德烈·德尔·维罗基奥'],
        sources: ['Vasari, Lives of the Most Excellent Painters', 'Kemp, Leonardo da Vinci']
      },
      {
        id: 'leonardo-2',
        age: 20,
        year: 1472,
        title: '加入画家公会',
        description: '正式加入佛罗伦萨画家公会"圣路加公会"，标志着他从学徒晋升为独立的职业艺术家。',
        category: 'career',
        importance: 'medium',
        location: '佛罗伦萨',
        sources: ['Vasari, Lives of the Most Excellent Painters']
      },
      {
        id: 'leonardo-3',
        age: 23,
        year: 1475,
        title: '创作《天使报喜》',
        description: '独立完成第一件重要作品《天使报喜》，展现了他在透视法和自然观察方面的天赋。',
        category: 'creation',
        importance: 'medium',
        location: '佛罗伦萨',
        sources: ['Kemp, Leonardo da Vinci', 'Clark, Leonardo da Vinci']
      },
      {
        id: 'leonardo-4',
        age: 30,
        year: 1482,
        title: '前往米兰宫廷',
        description: '离开佛罗伦萨前往米兰，为卢多维科·斯福尔扎公爵服务，开始了生涯中最辉煌的时期。',
        category: 'career',
        importance: 'high',
        location: '米兰',
        relatedFigures: ['卢多维科·斯福尔扎'],
        sources: ['Pedretti, Leonardo da Vinci', 'Nicholl, Leonardo da Vinci']
      },
      {
        id: 'leonardo-5',
        age: 33,
        year: 1485,
        title: '设计飞行机器',
        description: '开始设计各种飞行器，包括扑翼飞机和直升机的早期概念，体现了他超前的工程思维。',
        category: 'discovery',
        importance: 'high',
        location: '米兰',
        sources: ['Hart, The Inventions of Leonardo da Vinci']
      },
      {
        id: 'leonardo-6',
        age: 43,
        year: 1495,
        title: '开始创作《最后的晚餐》',
        description: '在米兰圣玛利亚感恩教堂开始创作著名壁画《最后的晚餐》，这幅作品革新了宗教画的表现手法。',
        category: 'creation',
        importance: 'high',
        location: '米兰',
        sources: ['Steinberg, Leonardo\'s Incessant Last Supper']
      },
      {
        id: 'leonardo-7',
        age: 50,
        year: 1502,
        title: '担任切萨雷·博尔贾的军事工程师',
        description: '为切萨雷·博尔贾服务，设计军事防御工事和攻城器械，展现了他在军事工程方面的才能。',
        category: 'career',
        importance: 'medium',
        location: '意大利各地',
        relatedFigures: ['切萨雷·博尔贾'],
        sources: ['Masters, The Military Engineer']
      },
      {
        id: 'leonardo-8',
        age: 51,
        year: 1503,
        title: '开始创作《蒙娜丽莎》',
        description: '开始创作世界上最著名的肖像画《蒙娜丽莎》，这幅画体现了他在肖像画技法上的最高成就。',
        category: 'creation',
        importance: 'high',
        location: '佛罗伦萨',
        sources: ['Zöllner, Leonardo da Vinci: Complete Paintings']
      },
      {
        id: 'leonardo-9',
        age: 54,
        year: 1506,
        title: '深入解剖学研究',
        description: '与医生合作进行人体解剖研究，绘制了精确的解剖图，为现代解剖学做出了重要贡献。',
        category: 'discovery',
        importance: 'high',
        location: '米兰',
        sources: ['Clayton, Leonardo da Vinci: Anatomist']
      },
      {
        id: 'leonardo-10',
        age: 64,
        year: 1516,
        title: '前往法国宫廷',
        description: '受法国国王弗朗西斯一世邀请前往法国，在克洛吕斯城堡度过晚年，继续从事科学研究和发明。',
        category: 'career',
        importance: 'medium',
        location: '法国',
        relatedFigures: ['弗朗西斯一世'],
        sources: ['Bramly, Leonardo: The Artist and the Man']
      }
    ]
  },

  {
    id: 'isaac-newton',
    name: 'Isaac Newton',
    chineseName: '艾萨克·牛顿',
    birthYear: 1643,
    deathYear: 1727,
    birthDate: '1643-01-04',
    deathDate: '1727-03-31',
    nationality: '英国',
    occupation: ['物理学家', '数学家', '天文学家', '自然哲学家'],
    category: 'scientist',
    era: '科学革命时期',
    biography: '艾萨克·牛顿是英国著名的物理学家、数学家、天文学家和自然哲学家，被誉为人类历史上最伟大的科学家之一。他提出了万有引力定律和牛顿运动定律，建立了经典力学体系，同时在数学、光学等领域也有重要贡献。',
    knownFor: [
      '发现万有引力定律',
      '提出牛顿运动三定律',
      '发明微积分',
      '著作《自然哲学的数学原理》'
    ],
    influence: 10,
    tags: ['物理学家', '数学家', '科学革命', '万有引力'],
    quotes: [
      '如果我看得更远，那是因为我站在巨人的肩膀上',
      '没有大胆的猜测就做不出伟大的发现',
      '我能计算天体的运行，却无法计算人心的疯狂'
    ],
    achievements: [
      {
        id: 'newton-1',
        age: 12,
        year: 1655,
        title: '进入格兰瑟姆国王学校',
        description: '离开家乡林肯郡伍尔索普，在格兰瑟姆国王学校接受正规教育，展现出对机械制作和数学的天赋。',
        category: 'education',
        importance: 'medium',
        location: '格兰瑟姆',
        sources: ['Westfall, Never at Rest: A Biography of Isaac Newton']
      },
      {
        id: 'newton-2',
        age: 18,
        year: 1661,
        title: '进入剑桥大学三一学院',
        description: '作为减费生进入剑桥大学三一学院学习，开始接触亚里士多德哲学和当时的自然哲学理论。',
        category: 'education',
        importance: 'high',
        location: '剑桥',
        sources: ['Westfall, Never at Rest']
      },
      {
        id: 'newton-3',
        age: 22,
        year: 1665,
        title: '获得学士学位并开始"奇迹年"',
        description: '获得文学士学位，随后因鼠疫返回家乡，在家中的18个月里取得了科学史上最重要的发现。',
        category: 'education',
        importance: 'high',
        location: '伍尔索普/剑桥',
        sources: ['Hall, Isaac Newton: Adventurer in Thought']
      },
      {
        id: 'newton-4',
        age: 23,
        year: 1666,
        title: '发现万有引力定律',
        description: '在家乡思考"苹果落地"问题，提出万有引力的概念，虽然精确的数学表述要到20年后才完成。',
        category: 'discovery',
        importance: 'high',
        location: '伍尔索普',
        sources: ['Cohen, The Newtonian Revolution']
      },
      {
        id: 'newton-5',
        age: 23,
        year: 1666,
        title: '发明微积分',
        description: '发展了流数法（微积分的早期形式），为解决物理问题提供了强有力的数学工具。',
        category: 'discovery',
        importance: 'high',
        location: '伍尔索普',
        sources: ['Whiteside, The Mathematical Papers of Isaac Newton']
      },
      {
        id: 'newton-6',
        age: 24,
        year: 1667,
        title: '当选三一学院研究员',
        description: '返回剑桥大学，当选三一学院研究员，开始了在剑桥的学术生涯。',
        category: 'career',
        importance: 'medium',
        location: '剑桥',
        sources: ['Westfall, Never at Rest']
      },
      {
        id: 'newton-7',
        age: 26,
        year: 1669,
        title: '出任卢卡斯数学教授',
        description: '年仅26岁就被任命为剑桥大学卢卡斯数学教授，这是英国最著名的数学教授职位。',
        category: 'career',
        importance: 'high',
        location: '剑桥',
        sources: ['Westfall, Never at Rest']
      },
      {
        id: 'newton-8',
        age: 29,
        year: 1672,
        title: '当选皇家学会会员',
        description: '因反射望远镜的发明和光学研究成果，当选英国皇家学会会员。',
        category: 'achievement',
        importance: 'high',
        location: '伦敦',
        sources: ['Hall, All Was Light: An Introduction to Newton\'s Opticks']
      },
      {
        id: 'newton-9',
        age: 41,
        year: 1684,
        title: '开始撰写《原理》',
        description: '在哈雷的催促下开始系统整理引力理论，着手撰写《自然哲学的数学原理》。',
        category: 'creation',
        importance: 'high',
        location: '剑桥',
        relatedFigures: ['埃德蒙·哈雷'],
        sources: ['Cohen, The Newtonian Revolution']
      },
      {
        id: 'newton-10',
        age: 44,
        year: 1687,
        title: '出版《自然哲学的数学原理》',
        description: '出版了科学史上最重要的著作之一《自然哲学的数学原理》，奠定了经典力学的基础。',
        category: 'creation',
        importance: 'high',
        location: '伦敦',
        sources: ['Principia Mathematica', 'Cohen, Introduction to Newton\'s Principia']
      },
      {
        id: 'newton-11',
        age: 57,
        year: 1700,
        title: '担任皇家造币厂厂长',
        description: '离开剑桥，担任皇家造币厂厂长，负责英国货币改革，打击伪造货币犯罪。',
        category: 'career',
        importance: 'medium',
        location: '伦敦',
        sources: ['Levenson, Newton and the Counterfeiter']
      },
      {
        id: 'newton-12',
        age: 60,
        year: 1703,
        title: '当选皇家学会主席',
        description: '当选英国皇家学会主席，此后连续担任此职位24年直到去世，推动了英国科学事业的发展。',
        category: 'leadership',
        importance: 'high',
        location: '伦敦',
        sources: ['Westfall, Never at Rest']
      },
      {
        id: 'newton-13',
        age: 62,
        year: 1705,
        title: '被册封为爵士',
        description: '因科学成就被安妮女王册封为爵士，成为第一位因科学贡献而受封爵位的人。',
        category: 'achievement',
        importance: 'medium',
        location: '伦敦',
        sources: ['Westfall, Never at Rest']
      }
    ]
  },

  {
    id: 'napoleon-bonaparte',
    name: 'Napoleon Bonaparte',
    chineseName: '拿破仑·波拿巴',
    birthYear: 1769,
    deathYear: 1821,
    birthDate: '1769-08-15',
    deathDate: '1821-05-05',
    nationality: '法国',
    occupation: ['军事家', '政治家', '皇帝', '立法者'],
    category: 'politician',
    era: '拿破仑时代',
    biography: '拿破仑·波拿巴是法国历史上最伟大的军事家和政治家之一，也是19世纪初欧洲最重要的历史人物。他通过军事天才和政治手腕从一个科西嘉岛的小贵族成为法国皇帝，建立了横跨欧洲的庞大帝国。',
    knownFor: [
      '建立法兰西第一帝国',
      '颁布《拿破仑法典》',
      '征服大部分欧洲',
      '滑铁卢战役'
    ],
    influence: 9,
    tags: ['皇帝', '军事家', '征服者', '立法者'],
    quotes: [
      '不想当将军的士兵不是好士兵',
      '中国是一头沉睡的狮子，一旦被惊醒，世界会为之震动',
      '我成功，是因为我有决心，从不踌躇'
    ],
    achievements: [
      {
        id: 'napoleon-1',
        age: 9,
        year: 1778,
        title: '进入布里埃纳军校',
        description: '离开科西嘉岛前往法国本土，进入布里埃纳军事学校学习，开始接受正规的军事教育。',
        category: 'education',
        importance: 'medium',
        location: '布里埃纳',
        sources: ['Chandler, Napoleon', 'Tulard, Napoleon: The Myth of the Saviour']
      },
      {
        id: 'napoleon-2',
        age: 15,
        year: 1784,
        title: '进入巴黎军事学校',
        description: '以优异成绩考入巴黎军事学校，专攻炮兵学，为日后的军事生涯奠定了坚实基础。',
        category: 'education',
        importance: 'medium',
        location: '巴黎',
        sources: ['Asprey, The Rise of Napoleon Bonaparte']
      },
      {
        id: 'napoleon-3',
        age: 16,
        year: 1785,
        title: '成为炮兵少尉',
        description: '以第42名的成绩从巴黎军事学校毕业，被任命为炮兵少尉，开始了军官生涯。',
        category: 'career',
        importance: 'medium',
        location: '法国',
        sources: ['Chandler, Napoleon']
      },
      {
        id: 'napoleon-4',
        age: 24,
        year: 1793,
        title: '土伦战役一战成名',
        description: '在围攻土伦的战役中提出突破性的战术建议，成功夺回土伦，被提升为准将。',
        category: 'achievement',
        importance: 'high',
        location: '土伦',
        sources: ['Chandler, The Campaigns of Napoleon']
      },
      {
        id: 'napoleon-5',
        age: 26,
        year: 1795,
        title: '平定葡月政变',
        description: '用"一阵葡萄弹"成功镇压保皇党人的葡月政变，保卫了共和政府，声名大震。',
        category: 'achievement',
        importance: 'high',
        location: '巴黎',
        sources: ['Schom, Napoleon Bonaparte']
      },
      {
        id: 'napoleon-6',
        age: 26,
        year: 1796,
        title: '出征意大利',
        description: '被任命为意大利方面军司令，开始了辉煌的意大利战役，连续击败奥地利和撒丁王国军队。',
        category: 'achievement',
        importance: 'high',
        location: '意大利',
        sources: ['Chandler, The Campaigns of Napoleon']
      },
      {
        id: 'napoleon-7',
        age: 29,
        year: 1798,
        title: '远征埃及',
        description: '率领法军远征埃及，虽然军事上得失参半，但这次东方之旅增强了他的传奇色彩。',
        category: 'achievement',
        importance: 'medium',
        location: '埃及',
        sources: ['Strathern, Napoleon in Egypt']
      },
      {
        id: 'napoleon-8',
        age: 30,
        year: 1799,
        title: '发动雾月政变',
        description: '回国后发动雾月十八日政变，推翻督政府，建立执政府，成为第一执政。',
        category: 'leadership',
        importance: 'high',
        location: '巴黎',
        sources: ['Tulard, Napoleon: The Myth of the Saviour']
      },
      {
        id: 'napoleon-9',
        age: 31,
        year: 1800,
        title: '马伦戈战役',
        description: '在马伦戈战役中击败奥军，巩固了在法国的统治地位，确立了第一执政的权威。',
        category: 'achievement',
        importance: 'high',
        location: '马伦戈',
        sources: ['Chandler, The Campaigns of Napoleon']
      },
      {
        id: 'napoleon-10',
        age: 32,
        year: 1801,
        title: '与教皇签署政教协议',
        description: '与教皇庇护七世签署政教协议，恢复了法国的宗教和谐，获得了天主教徒的支持。',
        category: 'leadership',
        importance: 'medium',
        location: '巴黎',
        relatedFigures: ['教皇庇护七世'],
        sources: ['Ellis, Napoleon']
      },
      {
        id: 'napoleon-11',
        age: 34,
        year: 1804,
        title: '颁布《拿破仑法典》',
        description: '颁布《拿破仑法典》（《民法典》），这部法典成为世界各国民法的典范，影响至今。',
        category: 'creation',
        importance: 'high',
        location: '巴黎',
        sources: ['Zweigert, Introduction to Comparative Law']
      },
      {
        id: 'napoleon-12',
        age: 35,
        year: 1804,
        title: '加冕为法国皇帝',
        description: '在巴黎圣母院举行盛大加冕典礼，成为法兰西第一帝国皇帝拿破仑一世。',
        category: 'leadership',
        importance: 'high',
        location: '巴黎',
        sources: ['Tulard, Napoleon: The Myth of the Saviour']
      },
      {
        id: 'napoleon-13',
        age: 36,
        year: 1805,
        title: '奥斯特利茨战役',
        description: '在奥斯特利茨战役中以少胜多，同时击败奥俄联军，这一胜利被称为"三皇会战"。',
        category: 'achievement',
        importance: 'high',
        location: '奥斯特利茨',
        relatedFigures: ['亚历山大一世', '弗朗茨二世'],
        sources: ['Chandler, The Campaigns of Napoleon']
      },
      {
        id: 'napoleon-14',
        age: 37,
        year: 1806,
        title: '建立莱茵联邦',
        description: '解散神圣罗马帝国，建立莱茵联邦，重新塑造了欧洲的政治版图。',
        category: 'leadership',
        importance: 'high',
        location: '德国',
        sources: ['Grab, Napoleon and the Transformation of Europe']
      },
      {
        id: 'napoleon-15',
        age: 43,
        year: 1812,
        title: '远征俄国',
        description: '率领60万大军远征俄国，虽然攻占莫斯科，但最终因严寒和补给问题遭受惨败。',
        category: 'achievement',
        importance: 'high',
        location: '俄国',
        relatedFigures: ['亚历山大一世'],
        sources: ['Zamoyski, 1812: Napoleon\'s Fatal March on Moscow']
      },
      {
        id: 'napoleon-16',
        age: 46,
        year: 1815,
        title: '滑铁卢战役',
        description: '在滑铁卢战役中被英普联军击败，结束了"百日王朝"，随后被流放到圣赫勒拿岛。',
        category: 'achievement',
        importance: 'high',
        location: '滑铁卢',
        relatedFigures: ['威灵顿公爵', '布吕歇尔'],
        sources: ['Houssaye, 1815: Waterloo']
      }
    ]
  }
];

// 根据类别过滤人物
export function getFiguresByCategory(category: string): HistoricalFigure[] {
  return historicalFigures.filter(figure => figure.category === category);
}

// 根据时代过滤人物
export function getFiguresByEra(era: string): HistoricalFigure[] {
  return historicalFigures.filter(figure => figure.era === era);
}

// 根据影响力排序
export function getFiguresByInfluence(): HistoricalFigure[] {
  return historicalFigures.slice().sort((a, b) => b.influence - a.influence);
}

// 获取所有类别
export function getAllCategories(): string[] {
  const categories = historicalFigures.map(figure => figure.category);
  return Array.from(new Set(categories));
}

// 获取所有时代
export function getAllEras(): string[] {
  const eras = historicalFigures.map(figure => figure.era);
  return Array.from(new Set(eras));
}