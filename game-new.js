// 破产重生：金融帝国 - 核心逻辑

// ==================== 游戏状态 ====================
class GameState {
    constructor() {
        this.player = {
            gender: null,         // 性别 'male' or 'female'
            name: '玩家',         // 玩家姓名
            cash: 1000,           // 初始现金
            totalAssets: 1000,    // 总资产
            debt: 0,              // 负债
            day: 1,               // 当前天数
            creditScore: 300,     // 信用分数
            reputation: 0         // 声望
        };

        // 股票
        this.stock = {
            price: 100,
            history: [100],
            holdings: 0,
            cost: 0
        };

        // 期货
        this.futures = {
            type: null,
            price: 0,
            holdings: 0,
            margin: 0,
            leverage: 0,
            direction: null  // 'long' or 'short'
        };

        // 二元合约
        this.binary = {
            active: false,
            betAmount: 0,
            direction: null,
            startPrice: 0,
            timer: 60,
            asset: 'stock', // 预测标的：stock, gold, oil, bitcoin, weather, sports
            assets: {
                stock: { name: '股票指数', price: 100, icon: '📈' },
                gold: { name: '黄金价格', price: 1800, icon: '🥇' },
                oil: { name: '原油价格', price: 75, icon: '🛢️' },
                bitcoin: { name: '比特币', price: 45000, icon: '₿' },
                weather: { name: '气温变化', price: 25, icon: '🌡️' },
                sports: { name: '比赛结果', price: 50, icon: '⚽' }
            }
        };

        // 大富翁
        this.monopoly = {
            position: 0,
            properties: [],
            dailyRent: 0,
            // 四人模式
            players: [
                { id: 0, name: '你', cash: 15000, position: 0, properties: [], isAI: false, color: '#FF0000', bankrupt: false },
                { id: 1, name: 'AI-张', cash: 15000, position: 0, properties: [], isAI: true, color: '#0000FF', bankrupt: false },
                { id: 2, name: 'AI-李', cash: 15000, position: 0, properties: [], isAI: true, color: '#00FF00', bankrupt: false },
                { id: 3, name: 'AI-王', cash: 15000, position: 0, properties: [], isAI: true, color: '#FF00FF', bankrupt: false }
            ],
            currentPlayer: 0, // 当前回合玩家
            turn: 1 // 回合数
        };

        // 剧情进度
        this.story = {
            currentChapter: 0,
            currentScene: 0,
            completed: [],
            milestones: {
                5000: false,   // 资产达到5000触发剧情
                10000: false,  // 资产达到10000触发剧情
                50000: false,  // 资产达到50000触发剧情
                100000: false, // 资产达到100000触发剧情
                500000: false  // 资产达到500000触发剧情
            }
        };
    }
}

// ==================== 剧情系统 ====================
const StoryData = {
    // 初始剧情
    chapters: [
        {
            id: 0,
            title: "第一章：破产之夜",
            scenes: [
                {
                    title: "噩梦的开始",
                    getText: (gender, playerName) => {
                        const spouse = gender === 'male' ? '妻子' : '丈夫';
                        return `${playerName}，2024年寒冬，深夜11点。

你站在公司大楼的天台上，望着城市的万家灯火。
就在几个小时前，你收到了人生中最沉重的打击——
你辛苦经营了十年的投资公司，因为一次错误决策，亏损了2.3亿。

债主们像闻到血腥味的鲨鱼，开始疯狂追债。
银行冻结了你的所有账户，房子被查封，车子被拖走。
曾经风光无限的你，一夜之间变得一无所有。

手机响了，是${spouse}发来的短信："我们离婚吧，我受不了这种生活了。"

你苦笑着放下手机，看着城市的夜景。
这就是你人生的终点吗？

不！你握紧拳头，眼神中燃起不屈的火焰。
"我要重新开始！我要夺回属于我的一切！"

就在这时，你发现口袋里还有一张皱巴巴的1000元现金。
这是你最后的资本，也是你重生的起点...`;
                    },
                    action: "开始重生之路"
                },
                {
                    title: "第一步",
                    getText: (gender, playerName) => {
                        return `${playerName}，你离开了天台，走在寒风中。
现在你面临一个选择：如何用这最后的1000元开始翻身？

你知道，金融市场是你最熟悉的战场。
虽然现在一无所有，但你还有知识和经验。
股票、期货、二元合约、房地产投资...
每一种方式都蕴含着机会，也暗藏风险。

"这次，我要更加谨慎，更加聪明。"
你暗暗发誓，"我要一步步建立我的金融帝国！"

你找到了一家24小时营业的网吧，
用最后的钱开了一个交易账户。
游戏，正式开始！`;
                    },
                    action: "开始交易"
                }
            ]
        }
    ],
    
    // 资产里程碑剧情
    milestones: {
        5000: {
            title: "初见曙光",
            getText: (gender, playerName) => {
                return `${playerName}，经过一番努力，你的资产终于突破了$5,000！

虽然这点钱对过去的你来说微不足道，
但现在，这是你重生的第一步。

债主们开始注意到你的动向，
有人打电话来试探你的还款能力。

"这只是开始。"你看着账户余额，
"我要让他们知道，我回来了！"`;
            }
        },
        10000: {
            title: "站稳脚跟",
            getText: (gender, playerName) => {
                return `${playerName}，你的资产已经达到$10,000！

你终于在这个残酷的市场中站稳了脚跟。
银行开始重新评估你的信用，
有人愿意给你提供小额贷款了。

但你知道，这还不够。
真正的挑战才刚刚开始。`;
            }
        },
        50000: {
            title: "东山再起",
            getText: (gender, playerName) => {
                return `${playerName}，$50,000！你的资产已经相当可观了！

那些曾经看不起你的人，
开始重新审视你的能力。
投资机会开始主动找上门来。

"我回来了。"你站在窗前，
"而且这次，我会走得更稳。"`;
            }
        },
        100000: {
            title: "重返巅峰",
            getText: (gender, playerName) => {
                return `${playerName}，$100,000！你做到了！

你的资产已经超过了破产前的水平！
银行主动给你提供高额贷款。
曾经离开你的人，又来巴结你了。

但你知道，这次不一样。
你更加谨慎，更加成熟。
你建立了完善的风险控制体系，
不再犯当年的错误。

"这才是真正的成功。"
"不是运气，而是实力。"`;
            }
        },
        500000: {
            title: "金融帝国",
            getText: (gender, playerName) => {
                return `${playerName}，$500,000！你建立了自己的金融帝国！

从破产到重生，从$1,000到$500,000，
你用实力证明了自己。

那些曾经嘲笑你的人，
现在只能仰望你的背影。

你站在新的办公室里，
望着窗外的城市夜景，
嘴角露出自信的微笑。

"这才是真正的成功。"
"不是运气，而是实力。"`;
            }
        }
    }
};

// ==================== 事件系统 ====================
const Events = {
    positive: [
        { text: "🎉 好消息！你投资的股票涨停了！", cash: 5000 },
        { text: "💼 有人愿意高价收购你的房产！", cash: 10000 },
        { text: "📈 市场大涨，你的资产增值了！", cash: 3000 },
        { text: "🏆 你获得了最佳投资者奖！", reputation: 50 },
        { text: "💰 收到一笔意外分红！", cash: 2000 }
    ],
    negative: [
        { text: "😱 坏消息！市场突然暴跌！", cash: -3000 },
        { text: "🏚️ 你的房产需要维修！", cash: -2000 },
        { text: "📉 投资失败，损失惨重！", cash: -5000 },
        { text: "⚠️ 银行提高利率，还款压力增加！", debt: 1000 },
        { text: "💨 遭遇黑天鹅事件！", cash: -4000 }
    ],
    neutral: [
        { text: "📰 市场保持平稳，观望中..." },
        { text: "📊 分析师建议谨慎投资" },
        { text: "🔍 发现新的投资机会！" }
    ]
};

// ==================== 大富翁地图 ====================
const MonopolyMap = [
    // 底边（从起点开始，顺时针）
    { name: "起点", type: "start", icon: "🚀", position: {x: 0, y: 10} },
    { name: "地中海大道", type: "property", price: 600, rent: 20, icon: "🏠", color: "#8B4513", position: {x: 1, y: 10} },
    { name: "机会", type: "chance", icon: "❓", position: {x: 2, y: 10} },
    { name: "波罗的海大道", type: "property", price: 600, rent: 40, icon: "🏠", color: "#8B4513", position: {x: 3, y: 10} },
    { name: "所得税", type: "tax", amount: 200, icon: "💰", position: {x: 4, y: 10} },
    { name: "东方铁路", type: "railroad", price: 2000, rent: 100, icon: "🚂", position: {x: 5, y: 10} },
    { name: "东方大道", type: "property", price: 1000, rent: 60, icon: "🏠", color: "#87CEEB", position: {x: 6, y: 10} },
    { name: "命运", type: "fate", icon: "🎲", position: {x: 7, y: 10} },
    { name: "佛蒙特大道", type: "property", price: 1000, rent: 60, icon: "🏠", color: "#87CEEB", position: {x: 8, y: 10} },
    { name: "康涅狄格大道", type: "property", price: 1200, rent: 80, icon: "🏠", color: "#87CEEB", position: {x: 9, y: 10} },
    
    // 右边
    { name: "监狱/访问", type: "jail", icon: "🔒", position: {x: 10, y: 10} },
    { name: "圣查尔斯广场", type: "property", price: 1400, rent: 100, icon: "🏠", color: "#FF69B4", position: {x: 10, y: 9} },
    { name: "电力公司", type: "utility", price: 1500, icon: "💡", position: {x: 10, y: 8} },
    { name: "美国大道", type: "property", price: 1400, rent: 100, icon: "🏠", color: "#FF69B4", position: {x: 10, y: 7} },
    { name: "弗吉尼亚大道", type: "property", price: 1600, rent: 120, icon: "🏠", color: "#FF69B4", position: {x: 10, y: 6} },
    { name: "宾夕法尼亚铁路", type: "railroad", price: 2000, rent: 100, icon: "🚂", position: {x: 10, y: 5} },
    { name: "圣詹姆斯广场", type: "property", price: 1800, rent: 140, icon: "🏠", color: "#FFA500", position: {x: 10, y: 4} },
    { name: "机会", type: "chance", icon: "❓", position: {x: 10, y: 3} },
    { name: "田纳西大道", type: "property", price: 1800, rent: 140, icon: "🏠", color: "#FFA500", position: {x: 10, y: 2} },
    { name: "纽约大道", type: "property", price: 2000, rent: 160, icon: "🏠", color: "#FFA500", position: {x: 10, y: 1} },
    
    // 顶边
    { name: "免费停车", type: "parking", icon: "🚗", position: {x: 10, y: 0} },
    { name: "肯塔基大道", type: "property", price: 2200, rent: 180, icon: "🏠", color: "#FF0000", position: {x: 9, y: 0} },
    { name: "命运", type: "fate", icon: "🎲", position: {x: 8, y: 0} },
    { name: "印第安纳大道", type: "property", price: 2200, rent: 180, icon: "🏠", color: "#FF0000", position: {x: 7, y: 0} },
    { name: "伊利诺伊大道", type: "property", price: 2400, rent: 200, icon: "🏠", color: "#FF0000", position: {x: 6, y: 0} },
    { name: "B&O铁路", type: "railroad", price: 2000, rent: 100, icon: "🚂", position: {x: 5, y: 0} },
    { name: "大西洋大道", type: "property", price: 2600, rent: 220, icon: "🏠", color: "#FFFF00", position: {x: 4, y: 0} },
    { name: "文图诺大道", type: "property", price: 2600, rent: 220, icon: "🏠", color: "#FFFF00", position: {x: 3, y: 0} },
    { name: "自来水公司", type: "utility", price: 1500, icon: "💧", position: {x: 2, y: 0} },
    { name: "马文花园", type: "property", price: 2800, rent: 240, icon: "🏠", color: "#FFFF00", position: {x: 1, y: 0} },
    
    // 左边
    { name: "入狱", type: "gotojail", icon: "⚠️", position: {x: 0, y: 0} },
    { name: "太平洋大道", type: "property", price: 3000, rent: 260, icon: "🏠", color: "#00FF00", position: {x: 0, y: 1} },
    { name: "北卡罗来纳大道", type: "property", price: 3000, rent: 260, icon: "🏠", color: "#00FF00", position: {x: 0, y: 2} },
    { name: "机会", type: "chance", icon: "❓", position: {x: 0, y: 3} },
    { name: "宾夕法尼亚大道", type: "property", price: 3200, rent: 280, icon: "🏠", color: "#00FF00", position: {x: 0, y: 4} },
    { name: "短途铁路", type: "railroad", price: 2000, rent: 100, icon: "🚂", position: {x: 0, y: 5} },
    { name: "机会", type: "chance", icon: "❓", position: {x: 0, y: 6} },
    { name: "公园广场", type: "property", price: 3500, rent: 350, icon: "🏠", color: "#0000FF", position: {x: 0, y: 7} },
    { name: "奢侈品税", type: "tax", amount: 100, icon: "💎", position: {x: 0, y: 8} },
    { name: "木板路", type: "property", price: 4000, rent: 400, icon: "🏠", color: "#0000FF", position: {x: 0, y: 9} }
];

// ==================== 游戏控制器 ====================
class GameController {
    constructor() {
        this.state = new GameState();
        this.chartCtx = null;
        this.storyIndex = 0;
        this.sceneIndex = 0;
        this.gameStarted = false;

        this.init();
    }

    init() {
        // 显示加载屏幕
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            document.getElementById('gender-screen').style.display = 'flex';
        }, 1500);

        // 绑定事件
        this.bindEvents();

        // 初始化图表
        this.initChart();

        // 初始化大富翁地图
        this.initMonopolyBoard();
    }

    // 选择性别
    selectGender(gender) {
        console.log('GameController.selectGender被调用');
        
        // 获取玩家输入的姓名
        const nameInput = document.getElementById('player-name');
        const playerName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : '玩家';
        
        console.log('玩家姓名:', playerName);
        console.log('性别:', gender);
        
        this.state.player.gender = gender;
        this.state.player.name = playerName;
        
        console.log('隐藏gender-screen，显示剧情');
        document.getElementById('gender-screen').style.display = 'none';
        this.showStory();
    }

    bindEvents() {
        // 导航标签切换
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // 更新标签状态
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // 更新面板显示
        document.querySelectorAll('.content-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-panel`).classList.add('active');
    }

    initChart() {
        const canvas = document.getElementById('stock-chart');
        if (canvas) {
            this.chartCtx = canvas.getContext('2d');
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = 300;
        }
    }

    initMonopolyBoard() {
        const board = document.getElementById('monopoly-board');
        if (!board) return;

        // 清空棋盘
        board.innerHTML = '';

        // 创建40个格子
        MonopolyMap.forEach((tile, index) => {
            const cell = document.createElement('div');
            cell.id = `monopoly-cell-${index}`;
            cell.dataset.index = index;
            
            // 计算格子的位置和大小
            const isCorner = [0, 10, 20, 30].includes(index);
            const cellSize = isCorner ? '60px' : '50px';
            
            // 根据位置设置样式
            let style = `
                position: absolute;
                width: ${cellSize};
                height: ${cellSize};
                background: ${this.getCellBackground(tile)};
                border: 2px solid #333;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 12px;
                overflow: hidden;
            `;
            
            // 根据位置坐标定位格子
            const x = tile.position.x;
            const y = tile.position.y;
            
            // 计算实际像素位置
            const boardWidth = 800;
            const boardHeight = 600;
            const cellWidth = (boardWidth - 120) / 10; // 中间区域宽度
            const cellHeight = (boardHeight - 120) / 10; // 中间区域高度
            
            let left, top;
            
            if (y === 10) {
                // 底边
                left = x === 0 ? 0 : (x === 10 ? boardWidth - 60 : 60 + (x - 1) * cellWidth);
                top = boardHeight - 60;
            } else if (y === 0) {
                // 顶边
                left = x === 0 ? 0 : (x === 10 ? boardWidth - 60 : 60 + (10 - x - 1) * cellWidth);
                top = 0;
            } else if (x === 0) {
                // 左边
                left = 0;
                top = 60 + (10 - y - 1) * cellHeight;
            } else if (x === 10) {
                // 右边
                left = boardWidth - 60;
                top = 60 + (y - 1) * cellHeight;
            }
            
            style += `left: ${left}px; top: ${top}px;`;
            
            cell.style.cssText = style;
            
            // 添加内容
            const isOwned = this.state.monopoly.properties.includes(index);
            
            cell.innerHTML = `
                <div style="font-size: 20px; pointer-events: none;">${tile.icon}</div>
                <div style="font-size: 10px; text-align: center; pointer-events: none; color: #333; font-weight: bold;">
                    ${tile.name.length > 6 ? tile.name.substring(0, 6) + '...' : tile.name}
                </div>
                ${tile.price ? `<div style="font-size: 9px; color: #666; pointer-events: none;">$${tile.price}</div>` : ''}
                ${isOwned ? '<div style="position: absolute; top: 2px; right: 2px; font-size: 12px;">✓</div>' : ''}
            `;
            
            // 添加颜色条（房产）
            if (tile.color) {
                const colorBar = document.createElement('div');
                colorBar.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 8px;
                    background: ${tile.color};
                `;
                cell.appendChild(colorBar);
            }
            
            // 添加点击事件
            cell.addEventListener('click', () => {
                if (tile.type === 'property' && !isOwned) {
                    this.buyProperty(index);
                }
            });
            
            board.appendChild(cell);
        });
        
        // 添加玩家棋子
        this.updatePlayerToken();
    }
    
    // 获取格子背景色
    getCellBackground(tile) {
        switch (tile.type) {
            case 'start': return 'linear-gradient(135deg, #90EE90 0%, #98FB98 100%)';
            case 'jail': return 'linear-gradient(135deg, #D3D3D3 0%, #C0C0C0 100%)';
            case 'parking': return 'linear-gradient(135deg, #87CEEB 0%, #ADD8E6 100%)';
            case 'gotojail': return 'linear-gradient(135deg, #FFA07A 0%, #FA8072 100%)';
            case 'property': return '#FFF8DC';
            case 'railroad': return 'linear-gradient(135deg, #DEB887 0%, #D2B48C 100%)';
            case 'utility': return 'linear-gradient(135deg, #E6E6FA 0%, #D8BFD8 100%)';
            case 'chance': return 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
            case 'fate': return 'linear-gradient(135deg, #FF6B6B 0%, #FF4757 100%)';
            case 'tax': return 'linear-gradient(135deg, #B22222 0%, #8B0000 100%)';
            default: return '#FFFFFF';
        }
    }
    
    // 更新玩家棋子位置
    updatePlayerToken() {
        // 移除所有旧棋子
        document.querySelectorAll('[id^="player-token-"]').forEach(token => token.remove());
        
        // 为每个玩家创建棋子
        this.monopoly.players.forEach((player, index) => {
            if (player.bankrupt) return; // 跳过破产玩家
            
            const token = document.createElement('div');
            token.id = `player-token-${index}`;
            token.style.cssText = `
                position: absolute;
                width: 25px;
                height: 25px;
                background: linear-gradient(135deg, ${player.color} 0%, ${player.color}dd 100%);
                border: 3px solid #FFD700;
                border-radius: 50%;
                z-index: ${100 + index};
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                transition: all 0.5s ease;
            `;
            token.innerHTML = player.isAI ? '🤖' : '👤';
            
            // 获取当前格子
            const currentCell = document.getElementById(`monopoly-cell-${player.position}`);
            if (currentCell) {
                const rect = currentCell.getBoundingClientRect();
                const board = document.getElementById('monopoly-board');
                const boardRect = board.getBoundingClientRect();
                
                // 计算偏移，避免重叠
                const offset = index * 5;
                
                token.style.left = `${rect.left - boardRect.left + 10 + offset}px`;
                token.style.top = `${rect.top - boardRect.top + 10 + offset}px`;
                
                board.appendChild(token);
            }
        });
    }

    // ==================== 剧情系统 ====================
    showStory() {
        const chapter = StoryData.chapters[this.storyIndex];
        if (!chapter) {
            this.startGame();
            return;
        }

        const scene = chapter.scenes[this.sceneIndex];
        if (!scene) {
            this.storyIndex++;
            this.sceneIndex = 0;
            this.showStory();
            return;
        }

        document.getElementById('status-bar').style.display = 'none';
        document.getElementById('game-main').style.display = 'none';
        document.getElementById('story-panel').style.display = 'block';

        // 根据性别获取剧情文本
        const gender = this.state.player.gender || 'male';
        const playerName = this.state.player.name || '玩家';
        const storyText = scene.getText(gender, playerName);

        document.getElementById('story-title').textContent = `${chapter.title} - ${scene.title}`;
        document.getElementById('story-text').innerHTML = storyText.replace(/\n/g, '<br>');
        document.getElementById('story-continue').innerHTML = `
            <button class="continue-btn" onclick="game.nextScene()">${scene.action} →</button>
        `;
    }

    nextScene() {
        this.sceneIndex++;
        this.showStory();
    }

    startGame() {
        document.getElementById('story-panel').style.display = 'none';
        document.getElementById('status-bar').style.display = 'grid';
        document.getElementById('game-main').style.display = 'block';

        this.gameStarted = true;
        this.updateUI();

        // 启动游戏循环
        this.startGameLoop();
    }

    startGameLoop() {
        // 股票价格更新
        setInterval(() => {
            this.updateStockPrice();
        }, 1000);

        // 期货价格更新
        setInterval(() => {
            this.updateFuturesPrice();
        }, 2000);

        // 二元合约计时和价格更新
        setInterval(() => {
            this.updateBinaryTimer();
            this.updateBinaryAssetPrices();
        }, 1000);

        // 每日结算
        setInterval(() => {
            this.dailySettlement();
        }, 60000);
    }

    // 更新二元合约所有标的价格
    updateBinaryAssetPrices() {
        const assets = this.state.binary.assets;
        
        // 股票指数
        assets.stock.price += (Math.random() - 0.5) * 2;
        assets.stock.price = Math.max(50, Math.min(150, assets.stock.price));
        
        // 黄金价格
        assets.gold.price += (Math.random() - 0.5) * 10;
        assets.gold.price = Math.max(1700, Math.min(1900, assets.gold.price));
        
        // 原油价格
        assets.oil.price += (Math.random() - 0.5) * 1;
        assets.oil.price = Math.max(60, Math.min(90, assets.oil.price));
        
        // 比特币
        assets.bitcoin.price += (Math.random() - 0.5) * 500;
        assets.bitcoin.price = Math.max(40000, Math.min(50000, assets.bitcoin.price));
        
        // 气温
        assets.weather.price += (Math.random() - 0.5) * 0.5;
        assets.weather.price = Math.max(15, Math.min(35, assets.weather.price));
        
        // 比赛结果（随机变化）
        assets.sports.price = Math.random() * 100;
    }

    // ==================== 股票系统 ====================
    updateStockPrice() {
        if (!this.gameStarted) return;

        const change = (Math.random() - 0.5) * 3;
        this.state.stock.price += change;
        this.state.stock.price = Math.max(10, Math.min(500, this.state.stock.price));
        this.state.stock.history.push(this.state.stock.price);

        if (this.state.stock.history.length > 100) {
            this.state.stock.history.shift();
        }

        this.renderChart();
        this.updateUI();
    }

    renderChart() {
        if (!this.chartCtx) return;

        const ctx = this.chartCtx;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const history = this.state.stock.history;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, width, height);

        if (history.length < 2) return;

        const min = Math.min(...history) * 0.95;
        const max = Math.max(...history) * 1.05;
        const range = max - min;

        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.beginPath();

        history.forEach((price, i) => {
            const x = (i / (history.length - 1)) * width;
            const y = height - ((price - min) / range) * height;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();
    }

    buyStock() {
        const amount = parseInt(document.getElementById('stock-amount').value) || 10;
        const cost = this.state.stock.price * amount;

        if (this.state.player.cash >= cost) {
            const newCost = (this.state.stock.cost * this.state.stock.holdings + cost) /
                          (this.state.stock.holdings + amount);
            this.state.stock.holdings += amount;
            this.state.stock.cost = newCost;
            this.state.player.cash -= cost;

            this.showMessage(`买入 ${amount} 股，花费 $${cost.toFixed(2)}`);
            this.updateUI();
        } else {
            this.showMessage('资金不足！', 'error');
        }
    }

    sellStock() {
        const amount = parseInt(document.getElementById('stock-sell-amount').value) || 10;

        if (this.state.stock.holdings >= amount) {
            const revenue = this.state.stock.price * amount;
            this.state.player.cash += revenue;
            this.state.stock.holdings -= amount;

            if (this.state.stock.holdings === 0) {
                this.state.stock.cost = 0;
            }

            this.showMessage(`卖出 ${amount} 股，收入 $${revenue.toFixed(2)}`);
            this.updateUI();
        } else {
            this.showMessage('持仓不足！', 'error');
        }
    }

    // ==================== 期货系统 ====================
    selectFutures(type) {
        document.querySelectorAll('.futures-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');

        const futuresData = {
            gold: { price: 1800, margin: 5000, leverage: 10 },
            oil: { price: 75, margin: 3000, leverage: 15 },
            wheat: { price: 6.5, margin: 2000, leverage: 8 }
        };

        const data = futuresData[type];
        this.state.futures.type = type;
        this.state.futures.price = data.price;
        this.state.futures.margin = data.margin;
        this.state.futures.leverage = data.leverage;

        this.updateUI();
    }

    updateFuturesPrice() {
        if (!this.state.futures.type) return;

        const change = (Math.random() - 0.5) * 2;
        this.state.futures.price += change;
        this.state.futures.price = Math.max(1, this.state.futures.price);

        this.updateUI();
    }

    buyFutures() {
        if (!this.state.futures.type) {
            this.showMessage('请先选择期货品种！', 'error');
            return;
        }

        const amount = parseInt(document.getElementById('futures-amount').value) || 1;
        const marginRequired = this.state.futures.margin * amount;

        if (this.state.player.cash >= marginRequired) {
            this.state.futures.holdings += amount;
            this.state.futures.margin = marginRequired;
            this.state.futures.direction = 'long';
            this.state.player.cash -= marginRequired;

            this.showMessage(`开多仓 ${amount} 手，保证金 $${marginRequired}`);
            this.updateUI();
        } else {
            this.showMessage('保证金不足！', 'error');
        }
    }

    sellFutures() {
        if (!this.state.futures.type) {
            this.showMessage('请先选择期货品种！', 'error');
            return;
        }

        const amount = parseInt(document.getElementById('futures-sell-amount').value) || 1;
        const marginRequired = this.state.futures.margin * amount;

        if (this.state.player.cash >= marginRequired) {
            this.state.futures.holdings += amount;
            this.state.futures.margin = marginRequired;
            this.state.futures.direction = 'short';
            this.state.player.cash -= marginRequired;

            this.showMessage(`开空仓 ${amount} 手，保证金 $${marginRequired}`);
            this.updateUI();
        } else {
            this.showMessage('保证金不足！', 'error');
        }
    }

    // ==================== 二元合约系统 ====================
    updateBinaryTimer() {
        if (!this.state.binary.active) return;

        this.state.binary.timer--;

        if (this.state.binary.timer <= 0) {
            this.resolveBinaryBet();
        }

        this.updateUI();
    }

    binaryBet(direction) {
        if (this.state.binary.active) {
            this.showMessage('已有进行中的合约！', 'error');
            return;
        }

        const amount = parseInt(document.getElementById('binary-amount').value) || 100;

        if (this.state.player.cash >= amount) {
            const currentAsset = this.state.binary.assets[this.state.binary.asset];
            
            this.state.binary.active = true;
            this.state.binary.betAmount = amount;
            this.state.binary.direction = direction;
            this.state.binary.startPrice = currentAsset.price;
            this.state.binary.timer = 60;
            this.state.player.cash -= amount;

            this.showMessage(`下注 $${amount} 预测${currentAsset.name}${direction === 'up' ? '上涨' : '下跌'}`);
            this.updateUI();
        } else {
            this.showMessage('资金不足！', 'error');
        }
    }

    resolveBinaryBet() {
        const currentAsset = this.state.binary.assets[this.state.binary.asset];
        const currentPrice = currentAsset.price;
        const startPrice = this.state.binary.startPrice;
        const direction = this.state.binary.direction;

        const isUp = currentPrice > startPrice;
        const won = (direction === 'up' && isUp) || (direction === 'down' && !isUp);

        if (won) {
            const winAmount = this.state.binary.betAmount * 1.85;
            this.state.player.cash += winAmount;
            this.showMessage(`🎉 恭喜！赢了 $${winAmount.toFixed(2)}`);
        } else {
            this.showMessage('😢 很遗憾，输了！');
        }

        this.state.binary.active = false;
        this.state.binary.betAmount = 0;
        this.updateUI();
    }

    // ==================== 大富翁系统 ====================
    rollDice() {
        const currentPlayer = this.monopoly.players[this.monopoly.currentPlayer];
        
        // 检查当前玩家是否破产
        if (currentPlayer.bankrupt) {
            this.nextTurn();
            return;
        }
        
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const total = dice1 + dice2;
        
        this.showMessage(`${currentPlayer.name} 掷出 ${dice1} + ${dice2} = ${total} 点`);
        
        // 移动玩家
        const oldPosition = currentPlayer.position;
        currentPlayer.position = (currentPlayer.position + total) % MonopolyMap.length;
        
        // 经过起点获得奖励
        if (currentPlayer.position < oldPosition) {
            currentPlayer.cash += 2000;
            this.showMessage(`${currentPlayer.name} 经过起点，获得 $2,000！`);
        }
        
        // 更新玩家棋子位置（带动画）
        setTimeout(() => {
            this.updatePlayerToken();
        }, 100);
        
        const currentTile = MonopolyMap[currentPlayer.position];
        
        // 处理不同类型的格子
        setTimeout(() => {
            if (currentPlayer.isAI) {
                this.handleAITurn(currentPlayer, currentTile);
            } else {
                this.handleMonopolyTile(currentTile);
            }
            this.updateUI();
        }, 600);
    }
    
    // 处理AI回合
    handleAITurn(player, tile) {
        switch (tile.type) {
            case 'property':
            case 'railroad':
            case 'utility':
                if (!this.isPropertyOwned(tile, player.id)) {
                    // AI决策是否购买
                    if (player.cash >= tile.price && Math.random() > 0.3) {
                        this.buyPropertyAI(player, tile);
                    }
                } else {
                    // 支付租金
                    this.payRent(player, tile);
                }
                break;
                
            case 'tax':
                player.cash -= tile.amount;
                this.showMessage(`${player.name} 支付 ${tile.name}：$${tile.amount}`);
                break;
                
            case 'gotojail':
                player.position = 10;
                this.showMessage(`${player.name} 入狱了！`);
                this.updatePlayerToken();
                break;
                
            case 'chance':
            case 'fate':
                this.triggerRandomEventAI(player);
                break;
        }
        
        // 检查破产
        this.checkBankruptcy(player);
        
        // 下一个回合
        setTimeout(() => {
            this.nextTurn();
        }, 1000);
    }
    
    // 下一个回合
    nextTurn() {
        this.monopoly.currentPlayer = (this.monopoly.currentPlayer + 1) % 4;
        
        // 如果回到玩家0，回合数+1
        if (this.monopoly.currentPlayer === 0) {
            this.monopoly.turn++;
        }
        
        // 跳过破产的玩家
        let attempts = 0;
        while (this.monopoly.players[this.monopoly.currentPlayer].bankrupt && attempts < 4) {
            this.monopoly.currentPlayer = (this.monopoly.currentPlayer + 1) % 4;
            attempts++;
        }
        
        // 检查游戏是否结束
        if (this.checkGameEnd()) {
            return;
        }
        
        // 如果是AI，自动掷骰子
        const currentPlayer = this.monopoly.players[this.monopoly.currentPlayer];
        if (currentPlayer.isAI && !currentPlayer.bankrupt) {
            setTimeout(() => {
                this.rollDice();
            }, 1000);
        } else {
            this.showMessage(`轮到你了！`);
            this.updateUI();
        }
    }
    
    // 检查房产是否被拥有
    isPropertyOwned(tile, excludePlayerId = -1) {
        for (const player of this.monopoly.players) {
            if (player.id !== excludePlayerId && player.properties.includes(tile)) {
                return player;
            }
        }
        return null;
    }
    
    // AI购买房产
    buyPropertyAI(player, tile) {
        if (player.cash >= tile.price) {
            player.cash -= tile.price;
            player.properties.push(tile);
            this.showMessage(`${player.name} 购买了 ${tile.name}`);
        }
    }
    
    // 支付租金
    payRent(player, tile) {
        const owner = this.isPropertyOwned(tile);
        if (owner && owner.id !== player.id) {
            const rent = tile.rent || 100;
            if (player.cash >= rent) {
                player.cash -= rent;
                owner.cash += rent;
                this.showMessage(`${player.name} 向 ${owner.name} 支付租金 $${rent}`);
            } else {
                // 资金不足，增加债务
                const debt = rent - player.cash;
                player.cash = 0;
                this.state.player.debt += debt;
                owner.cash += rent;
                this.showMessage(`${player.name} 支付租金 $${rent}，负债增加 $${debt}`, 'error');
            }
        }
    }
    
    // 检查破产
    checkBankruptcy(player) {
        if (player.cash < 0 && player.properties.length === 0) {
            player.bankrupt = true;
            this.showMessage(`${player.name} 破产了！`, 'error');
        }
    }
    
    // 检查游戏结束
    checkGameEnd() {
        const activePlayers = this.monopoly.players.filter(p => !p.bankrupt);
        
        if (activePlayers.length === 1) {
            const winner = activePlayers[0];
            if (!winner.isAI) {
                this.showMessage('🎉 恭喜！你赢了！', 'success');
                this.state.player.cash += 50000; // 奖励
            } else {
                this.showMessage(`😢 ${winner.name} 获胜！你输了...`, 'error');
                this.state.player.debt += 10000; // 增加债务
            }
            return true;
        }
        
        // 检查玩家是否破产
        if (this.monopoly.players[0].bankrupt) {
            this.showMessage('😢 你破产了！游戏结束...', 'error');
            this.state.player.debt += 20000;
            return true;
        }
        
        return false;
    }
    
    // AI触发随机事件
    triggerRandomEventAI(player) {
        const rand = Math.random();
        let event;
        
        if (rand < 0.3) {
            event = Events.positive[Math.floor(Math.random() * Events.positive.length)];
        } else if (rand < 0.6) {
            event = Events.negative[Math.floor(Math.random() * Events.negative.length)];
        } else {
            event = Events.neutral[Math.floor(Math.random() * Events.neutral.length)];
        }
        
        this.showMessage(`${player.name}: ${event.text}`);
        
        if (event.cash) {
            player.cash += event.cash;
        }
    }

    handleMonopolyTile(tile) {
        const currentPlayer = this.monopoly.players[0]; // 玩家
        
        switch (tile.type) {
            case 'property':
                const owner = this.isPropertyOwned(tile, 0);
                if (!owner) {
                    // 无人拥有，可以购买
                    if (this.state.player.cash >= tile.price) {
                        if (confirm(`是否购买 ${tile.name}？价格：$${tile.price}\n租金：$${tile.rent}`)) {
                            this.buyProperty(this.monopoly.position);
                        }
                    } else {
                        this.showMessage(`资金不足，无法购买 ${tile.name}`, 'error');
                    }
                } else if (owner.id !== 0) {
                    // 别人的房产，支付租金
                    this.payRent(currentPlayer, tile);
                } else {
                    this.showMessage(`${tile.name} 是你的房产`);
                }
                break;

            case 'railroad':
            case 'utility':
                const utilityOwner = this.isPropertyOwned(tile, 0);
                if (!utilityOwner) {
                    if (this.state.player.cash >= tile.price) {
                        if (confirm(`是否购买 ${tile.name}？价格：$${tile.price}`)) {
                            this.buyProperty(this.monopoly.position);
                        }
                    }
                } else if (utilityOwner.id !== 0) {
                    this.payRent(currentPlayer, tile);
                }
                break;

            case 'chance':
            case 'fate':
                this.triggerRandomEvent();
                break;

            case 'tax':
                currentPlayer.cash -= tile.amount;
                this.showMessage(`支付 ${tile.name}：$${tile.amount}`);
                break;

            case 'gotojail':
                currentPlayer.position = 10;
                this.showMessage('入狱了！', 'error');
                this.updatePlayerToken();
                break;

            case 'start':
                this.showMessage('经过起点！');
                break;

            case 'jail':
                this.showMessage('访问监狱');
                break;

            case 'parking':
                this.showMessage('免费停车');
                break;
        }
        
        // 检查破产
        this.checkBankruptcy(currentPlayer);
        
        // 玩家回合结束，进入下一个回合
        setTimeout(() => {
            this.nextTurn();
        }, 1000);
    }

    buyProperty(index) {
        const property = MonopolyMap[index];
        if (property.type !== 'property' && property.type !== 'railroad' && property.type !== 'utility') return;

        const currentPlayer = this.monopoly.players[0]; // 玩家
        
        if (this.isPropertyOwned(property, 0)) {
            this.showMessage('这个房产已经有主人了！');
            return;
        }

        if (currentPlayer.cash >= property.price) {
            currentPlayer.cash -= property.price;
            currentPlayer.properties.push(property);
            this.state.monopoly.properties.push(index); // 保持兼容性
            
            // 更新租金收入
            if (property.rent) {
                this.state.monopoly.dailyRent += property.rent;
            }

            this.showMessage(`购买 ${property.name} 成功！`);
            this.initMonopolyBoard();
            this.updateUI();
        } else {
            this.showMessage('资金不足！', 'error');
        }
    }

    triggerRandomEvent() {
        const rand = Math.random();
        let event;

        if (rand < 0.3) {
            event = Events.positive[Math.floor(Math.random() * Events.positive.length)];
        } else if (rand < 0.6) {
            event = Events.negative[Math.floor(Math.random() * Events.negative.length)];
        } else {
            event = Events.neutral[Math.floor(Math.random() * Events.neutral.length)];
        }

        document.getElementById('event-text').textContent = event.text;

        if (event.cash) {
            this.state.player.cash += event.cash;
        }
        if (event.debt) {
            this.state.player.debt += event.debt;
        }
        if (event.reputation) {
            this.state.player.reputation += event.reputation;
        }

        this.updateUI();
    }

    // ==================== 每日结算 ====================
    dailySettlement() {
        this.state.player.day++;

        // 收取租金
        if (this.state.monopoly.dailyRent > 0) {
            this.state.player.cash += this.state.monopoly.dailyRent;
            this.showMessage(`每日租金收入：$${this.state.monopoly.dailyRent}`);
        }

        // 扣除利息
        if (this.state.player.debt > 0) {
            const interest = this.state.player.debt * 0.01;
            this.state.player.cash -= interest;
            this.showMessage(`支付利息：$${interest.toFixed(2)}`);
        }

        this.updateUI();
    }

    // ==================== 资产里程碑检测 ====================
    checkAssetMilestone() {
        const totalAssets = this.state.player.totalAssets;
        const milestones = this.state.story.milestones;

        for (const [threshold, triggered] of Object.entries(milestones)) {
            const milestoneValue = parseInt(threshold);
            if (!triggered && totalAssets >= milestoneValue) {
                // 触发里程碑剧情
                this.state.story.milestones[threshold] = true;
                this.showMilestoneStory(milestoneValue);
                break; // 一次只触发一个里程碑
            }
        }
    }

    // 显示里程碑剧情
    showMilestoneStory(milestone) {
        const milestoneData = StoryData.milestones[milestone];
        if (!milestoneData) return;

        const gender = this.state.player.gender || 'male';
        const playerName = this.state.player.name || '玩家';
        const storyText = milestoneData.getText(gender, playerName);

        // 创建剧情弹窗
        const overlay = document.createElement('div');
        overlay.className = 'story-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(10, 22, 40, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.5s ease;
        `;

        overlay.innerHTML = `
            <div style="max-width: 700px; padding: 40px; text-align: center;">
                <h2 style="font-size: 32px; color: #ffd700; margin-bottom: 30px;">
                    🎉 ${milestoneData.title}
                </h2>
                <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; margin-bottom: 30px; text-align: left;">
                    <p style="font-size: 16px; line-height: 2; color: #E0E7FF; white-space: pre-line;">
                        ${storyText}
                    </p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    padding: 15px 40px;
                    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
                    border: none;
                    border-radius: 10px;
                    color: #1a1a2e;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                ">继续游戏 →</button>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    // ==================== UI更新 ====================
    updateUI() {
        // 计算总资产
        const stockValue = this.state.stock.holdings * this.state.stock.price;
        const futuresValue = this.state.futures.holdings * this.state.futures.price * this.state.futures.leverage;
        const propertyValue = this.state.monopoly.properties.reduce((sum, index) => {
            return sum + (MonopolyMap[index].price || 0);
        }, 0);

        this.state.player.totalAssets = this.state.player.cash + stockValue + futuresValue + propertyValue;

        // 检测资产里程碑
        this.checkAssetMilestone();

        // 更新状态栏
        document.getElementById('cash').textContent = `$${this.state.player.cash.toFixed(2)}`;
        document.getElementById('total-assets').textContent = `$${this.state.player.totalAssets.toFixed(2)}`;
        document.getElementById('debt').textContent = `$${this.state.player.debt.toFixed(2)}`;
        document.getElementById('day').textContent = this.state.player.day;

        // 更新股票信息
        document.getElementById('stock-price').textContent = `$${this.state.stock.price.toFixed(2)}`;
        const change = this.state.stock.history.length > 1 ?
            ((this.state.stock.price - this.state.stock.history[0]) / this.state.stock.history[0] * 100).toFixed(2) : 0;
        document.getElementById('stock-change').textContent = `${change >= 0 ? '+' : ''}${change}%`;
        document.getElementById('stock-holdings').textContent = this.state.stock.holdings;
        document.getElementById('stock-value').textContent = `$${stockValue.toFixed(2)}`;

        // 更新期货信息
        if (this.state.futures.type) {
            document.getElementById('futures-price').textContent = `$${this.state.futures.price.toFixed(2)}`;
            document.getElementById('futures-holdings').textContent = this.state.futures.holdings;
            document.getElementById('futures-margin').textContent = `$${this.state.futures.margin.toFixed(2)}`;
        }

        // 更新二元合约信息
        const currentAsset = this.state.binary.assets[this.state.binary.asset];
        const assetPrice = currentAsset ? currentAsset.price : 100;
        document.getElementById('binary-price').textContent = `$${assetPrice.toFixed(2)}`;
        document.getElementById('binary-timer').textContent = `${this.state.binary.timer}秒`;
        document.getElementById('binary-bet').textContent = `$${this.state.binary.betAmount}`;
        document.getElementById('binary-potential').textContent = `$${(this.state.binary.betAmount * 1.85).toFixed(2)}`;

        // 更新大富翁信息
        const player = this.monopoly.players[0];
        const propertyCount = player.properties.length;
        const propertyValue = player.properties.reduce((sum, prop) => {
            return sum + (prop.price || 0);
        }, 0);
        
        document.getElementById('property-count').textContent = propertyCount;
        document.getElementById('daily-rent').textContent = `$${this.state.monopoly.dailyRent}`;
        document.getElementById('current-position').textContent = MonopolyMap[player.position].name;
        document.getElementById('monopoly-assets').textContent = `$${propertyValue.toFixed(2)}`;
        
        // 更新回合信息
        document.getElementById('turn-number').textContent = this.monopoly.turn;
        document.getElementById('current-player-name').textContent = 
            this.monopoly.players[this.monopoly.currentPlayer].name;
        
        // 更新所有玩家状态
        this.monopoly.players.forEach((p, index) => {
            const statusDiv = document.getElementById(`player-${index}-status`);
            if (statusDiv) {
                const cashDiv = statusDiv.querySelector('div:nth-child(2)');
                const propDiv = statusDiv.querySelector('div:nth-child(3)');
                
                if (cashDiv) cashDiv.textContent = `现金: $${p.cash.toFixed(0)}`;
                if (propDiv) propDiv.textContent = `房产: ${p.properties.length}`;
                
                // 高亮当前玩家
                if (index === this.monopoly.currentPlayer) {
                    statusDiv.style.borderColor = p.color;
                    statusDiv.style.transform = 'scale(1.05)';
                } else {
                    statusDiv.style.borderColor = 'transparent';
                    statusDiv.style.transform = 'scale(1)';
                }
                
                // 显示破产状态
                if (p.bankrupt) {
                    statusDiv.style.opacity = '0.5';
                    if (cashDiv) cashDiv.textContent = '已破产';
                }
            }
        });
        
        // 更新玩家现金（使用大富翁玩家的现金）
        if (this.monopoly.currentPlayer === 0) {
            document.getElementById('cash').textContent = `$${player.cash.toFixed(2)}`;
        }
    }

    showMessage(text, type = 'success') {
        const msg = document.createElement('div');
        msg.className = 'message';
        msg.textContent = text;

        if (type === 'error') {
            msg.style.background = 'linear-gradient(135deg, #ff1744 0%, #ff5252 100%)';
        }

        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
    }
    
    // 加载存档数据
    loadSaveData(saveData) {
        if (!saveData) return;
        
        try {
            // 恢复玩家数据
            if (saveData.player) {
                Object.assign(this.state.player, saveData.player);
            }
            
            // 恢复股票数据
            if (saveData.stock) {
                Object.assign(this.state.stock, saveData.stock);
            }
            
            // 恢复期货数据
            if (saveData.futures) {
                Object.assign(this.state.futures, saveData.futures);
            }
            
            // 恢复二元合约数据
            if (saveData.binary) {
                Object.assign(this.state.binary, saveData.binary);
            }
            
            // 恢复大富翁数据
            if (saveData.monopoly) {
                Object.assign(this.state.monopoly, saveData.monopoly);
            }
            
            // 恢复剧情进度
            if (saveData.story) {
                Object.assign(this.state.story, saveData.story);
            }
            
            this.showMessage('存档加载成功！');
            this.updateUI();
        } catch (error) {
            console.error('加载存档失败:', error);
        }
    }
}

// 启动游戏
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new GameController();
    window.game = game; // 将游戏实例暴露到全局
});
