import { lib, game, ui, get, ai, _status } from '../../../noname.js'
export let config = {
    FL0: {
        name: '<b><font color="#00FF66">★𝑪𝒊𝒂𝒍𝒍𝒐～(∠・ω< )⌒★',
        //name: "<img style=width:240px src=" + lib.assetURL + "extension/十周年UI/shoushaUI/line.png>",
        intro: "",
        init: true,
        clear: true,
        onclick: function () {
            game.playAudio("..", "extension", "十周年UI/audio", "Ciallo");
        },
    },
    eruda: {
        name: "调试助手",
        init: false,
    },
    translate: {
        name: "卡牌拖拽",
        init: false,
        intro: "开启后手牌可以任意拖拽牌序，自动重启",
        onclick(bool) {
            game.saveConfig("extension_十周年UI_translate", bool);
            setTimeout(() => game.reload(), 100);
        },
    },
    newDecadeStyle: {
        name: "切换样式",
        intro: "切换武将边框样式和界面布局，初始为十周年样式，根据个人喜好自行切换，选择不同的设置后游戏会自动重启以生效新的设置",
        init: "on",
        item: {
            on: "十周年",
            off: "新手杀",
            othersOn: "旧手杀",
            onlineUI: "online",
            othersOff: "一将成名",
            babysha: "欢乐三国杀",
        },
        onclick(control) {
            const origin = lib.config.extension_十周年UI_newDecadeStyle;
            game.saveConfig("extension_十周年UI_newDecadeStyle", control);
            if (origin != control) {
                setTimeout(() => game.reload(), 100);
            }
        },
        update() {
            if (window.decadeUI) {
                ui.arena.dataset.newDecadeStyle = lib.config.extension_十周年UI_newDecadeStyle;
                ui.arena.dataset.decadeLayout = lib.config.extension_十周年UI_newDecadeStyle == "on" || lib.config.extension_十周年UI_newDecadeStyle == "othersOff" || lib.config.extension_十周年UI_newDecadeStyle == "onlineUI" || lib.config.extension_十周年UI_newDecadeStyle == "babysha" ? "on" : "off";
            }
        },
    },
    rightLayout: {
        name: "左右布局",
        init: "on",
        intro: "切换完以后自动重启游戏，手杀十周年一将之后的样式不再维护",
        item: {
            off: "左手",
            on: "右手",
        },
        update() {
            if (lib.config["extension_十周年UI_rightLayout"] == "on" || lib.config["extension_十周年UI_rightLayout"] == "off") {
                ui.arena.dataset.rightLayout = lib.config["extension_十周年UI_rightLayout"];
            }
        },
        onclick(item) {
            lib.config["extension_十周年UI_rightLayout"] = item || "off";
            game.saveConfig("extension_十周年UI_rightLayout", item);
            game.reload();
        },
    },
    FL120: {
        name: '<b><font color="#00FF66">★𝑪𝒊𝒂𝒍𝒍𝒐～(∠・ω< )⌒★',
        intro: "",
        init: true,
        clear: true,
        onclick: function () {
            game.playAudio("..", "extension", "十周年UI/audio", "Ciallo");
        },
    },
    cardPrettify: {
        name: "卡牌美化",
        init: "png",
        item: {
            off: "关闭",
            jpg: "OL卡牌",
            webp: "彩色卡牌",
            png: "原十周年",
        },
    },
    cardkmh: {
        name: "卡牌边框",
        init: "off",
        item: {
            off: "关闭",
            kuang1: "大司马",
            kuang2: "大将军",
            kuang3: "国都护",
        },
    },
    cardbj: {
        name: "卡牌背景",
        init: "kb1",
        item: {
            kb1: "默认",
            kb2: "国都护",
            kb3: "大将军",
            kb4: "大司马",
        },
        onclick: function (item) {
            game.saveConfig("extension_十周年UI_cardbj", item);
        },
        visualMenu: function (node, link) {
            node.style.height = node.offsetWidth * 1.4 + "px";
            node.style.backgroundSize = "100% 100%";
            node.className = "button character incardback";
            node.setBackgroundImage("extension/十周年UI/assets/image/" + link + ".png");
        },
    },
    chupaizhishi: {
        name: "出牌指示",
        intro: "此选项可以切换目标指示特效，根据个人喜好自行切换，重启生效",
        init: "off",
        item: {
            jiangjun: "将军",
            weijiangjun: "卫将军",
            cheqijiangjun: "车骑将军",
            biaoqijiangjun: "骠骑将军",
            dajiangjun: "大将军",
            dasima: "大司马",
            shoushaX: "手杀经典",
            shousha: "手杀新版",
            random: "随机",
            off: "关闭",
        },
        update: function () {
            if (lib.config["extension_十周年UI_chupaizhishi"] == "random") {
                var i = ["shousha", "shoushaX", "jiangjun", "weijiangjun", "cheqijiangjun", "biaoqijiangjun", "dajiangjun", "dasima"].randomGet();
                if (window.decadeUI) decadeUI.config.chupaizhishi = i;
            } else if (window.decadeUI) ui.arena.dataset.chupaizhishi = lib.config["extension_十周年UI_chupaizhishi"];
        },
    },
    //菜单美化
    meanPrettify: {
        name: "菜单美化",
        intro: "开启全屏的菜单样式",
        init: false,
        onclick(bool) {
            game.saveConfig("extension_十周年UI_meanPrettify", bool);
            if (bool) lib.init.css(window.decadeUIPath + "extension/十周年UI", "menu");
            else {
                for (const link of document.head.querySelectorAll("link")) {
                    if (link.href.includes("menu.css")) {
                        link.remove();
                        break;
                    }
                }
            }
            setTimeout(() => game.reload(), 100);
        },
    },
    jiaohuyinxiao: {
        name: "交互音效",
        intro: "开启后，对局内点击卡牌或按钮会有交互音效",
        init: false,
    },
    dynamicBackground: {
        name: "动态背景",
        init: "skin_xiaosha_default",
        item: {
            off: "关闭",
            skin_xiaosha_default: "小杀",
            skin_chengzhu_城主边框: "城主边框",
        },
        update() {
            if (!window.decadeUI) return;
            var item = lib.config["extension_十周年UI_dynamicBackground"];
            if (!item || item == "off") {
                decadeUI.backgroundAnimation.stopSpineAll();
            } else {
                var name = item.split("_");
                var skin = name.splice(name.length - 1, 1)[0];
                name = name.join("_");
                decadeUI.backgroundAnimation.play(name, skin);
            }
        },
    },
    dynamicSkin: {
        name: "动态皮肤",
        init: false,
        onclick: function (value) {
            game.saveConfig("extension_十周年UI_dynamicSkin", value);
            lib.config.dynamicSkin = value;
            game.saveConfig("dynamicSkin", value);
            if (confirm("此功能需要手动导入骨骼文件以及安装《皮肤切换》和《千幻聆音》扩展\n点击确定自动重启")) game.reload();
        },
    },
    dynamicSkinOutcrop: {
        name: "动皮露头",
        init: true,
        update() {
            if (window.decadeUI) {
                var enable = lib.config["extension_十周年UI_dynamicSkinOutcrop"];
                ui.arena.dataset.dynamicSkinOutcrop = enable ? "on" : "off";
                var players = game.players;
                if (!players) return;
                for (var i = 0; i < players.length; i++) {
                    if (players[i].dynamic) {
                        players[i].dynamic.outcropMask = enable;
                        players[i].dynamic.update(false);
                    }
                }
            }
        },
    },
    dynamicSkin_dieAfter: {
        name: "保留动皮",
        intro: "阵亡后依旧显示动态皮肤",
        init: true,
    },
    cardAlternateNameVisible: {
        name: "牌名辅助",
        init: false,
        update() {
            if (window.decadeUI) ui.window.dataset.cardAlternateNameVisible = lib.config["extension_十周年UI_cardAlternateNameVisible"] ? "on" : "off";
        },
    },
    showTemp: {
        name: "卡牌显示",
        init: true,
        intro: "开启此选项后，视为卡牌显示将会替换为十周年UI内置替换显示",
        onclick(bool) {
            game.saveConfig("extension_十周年UI_showTemp", bool);
            if (game.me && lib.config.cardtempname != "off") {
                let cards = game.me.getCards("h", card => card._tempName);
                const skill = _status.event.skill,
                    goon = skill && get.info(skill) && get.info(skill).viewAs && !get.info(skill).ignoreMod && cards.some(card => (ui.selected.cards || []).includes(card));
                if (cards.length) {
                    for (let j = 0; j < cards.length; j++) {
                        const card = cards[j];
                        card._tempName.delete();
                        delete card._tempName;
                        let cardname, cardnature, cardskb;
                        if (!goon) {
                            cardname = get.name(card);
                            cardnature = get.nature(card);
                        } else {
                            cardskb = typeof get.info(skill).viewAs == "function" ? get.info(skill).viewAs([card], game.me) : get.info(skill).viewAs;
                            cardname = get.name(cardskb);
                            cardnature = get.nature(cardskb);
                        }
                        if (card.name != cardname || !get.is.sameNature(card.nature, cardnature, true)) {
                            if (bool) {
                                if (!card._tempName) card._tempName = ui.create.div(".temp-name", card);
                                let tempname = "",
                                    tempname2 = get.translation(cardname);
                                if (cardnature) {
                                    card._tempName.dataset.nature = cardnature;
                                    if (cardname == "sha") {
                                        tempname2 = get.translation(cardnature) + tempname2;
                                    }
                                }
                                tempname += tempname2;
                                card._tempName.innerHTML = tempname;
                                card._tempName.tempname = tempname;
                            } else {
                                const node = goon ? ui.create.cardTempName(cardskb, card) : ui.create.cardTempName(card);
                                if (lib.config.cardtempname !== "default") node.classList.remove("vertical");
                            }
                        }
                    }
                    //game.uncheck();
                    //game.check();
                }
            }
        },
    },
    wujiangbeijing: {
        name: "武将背景",
        init: false,
        intro: "开启后，单双将和国战模式将用设置好的武将背景",
    },
    shiliyouhua: {
        name: "官方势力",
        init: false,
        intro: "开启后，非魏蜀吴群晋势力的角色将会重新选择势力",
    },
    forcestyle: {
        name: "势力样式",
        init: "2",
        item: {
            1: "文字样式",
            2: "图片样式",
        },
        update() {
            if (window.decadeUI) ui.arena.dataset.forcestyle = lib.config["extension_十周年UI_forcestyle"];
        },
    },
    shouqikamh: {
        name: "手气卡美化",
        init: false,
        intro: "开启后，手气卡锁定五次",
    },
    aloneEquip: {
        name: "单独装备栏",
        intro: "切换玩家装备栏为单独装备栏或非单独装备栏，初始为单独装备栏，根据个人喜好调整",
        init: true,
        update() {
            const config = lib.config["extension_十周年UI_aloneEquip"];
            if (window.decadeUI) ui.arena.dataset.aloneEquip = config ? "on" : "off";
            _status.nopopequip = config;
            if (_status.gameStarted && ui && ui.equipSolts) {
                if (config && game.me != ui.equipSolts.me) {
                    if (ui.equipSolts.me) {
                        ui.equipSolts.me.appendChild(ui.equipSolts.equips);
                    }
                    ui.equipSolts.me = game.me;
                    ui.equipSolts.equips = game.me.node.equips;
                    ui.equipSolts.appendChild(game.me.node.equips);
                    game.me.$syncExpand();
                }
                if (!config && game.me == ui.equipSolts.me) {
                    ui.equipSolts.me.appendChild(ui.equipSolts.equips);
                    ui.equipSolts.me = undefined;
                }
            }
        },
    },
    viewInformationPause: {
        name: "查看武将资料页不暂停",
        intro: "打开此选项后，单机模式下查看本扩展设计的武将资料页时游戏不会暂停",
        init: false,
    },
    outcropSkin: {
        name: "露头样式",
        init: "off",
        item: {
            shizhounian: "十周年露头",
            shousha: "手杀露头",
            off: "关闭",
        },
        update() {
            if (window.decadeUI) ui.arena.dataset.outcropSkin = lib.config["extension_十周年UI_outcropSkin"];
        },
    },
    borderLevel: {
        name: "等阶边框",
        init: "five",
        item: {
            one: "一阶",
            two: "二阶",
            three: "三阶",
            four: "四阶",
            five: "五阶",
        },
        update() {
            if (window.decadeUI) ui.arena.dataset.borderLevel = lib.config["extension_十周年UI_borderLevel"];
        },
    },
    longLevel: {
        name: "等阶龙头",
        init: "eight",
        item: {
            eight: "关闭",
            one: "银龙",
            two: "金龙",
            three: "玉龙",
            five: "炎龙",
            sex: "随机",
            seven: "评级",
            ten: "OL等阶框·评级",
            eleven: "OL等阶框·随机",
        },
        update() {
            if (window.decadeUI) ui.arena.dataset.longLevel = lib.config["extension_十周年UI_longLevel"];
        },
    },
    foldCardMinWidth: {
        name: "手牌折叠",
        intro: "设置当手牌过多时，折叠手牌露出部分的最小宽度（默认值为9）",
        init: "9",
        item: {
            9: "9",
            18: "18",
            27: "27",
            36: "36",
            45: "45",
            54: "54",
            63: "63",
            72: "72",
            81: "81",
            90: "90",
            cardWidth: "卡牌宽度",
        },
        update: () => {
            if (window.decadeUI) decadeUI.layout.updateHand();
        },
    },
    cardScale: {
        name: "卡牌大小",
        intro: "输入0.10~1.00的小数，回车保存并生效",
        init: "0.18",
        input: true,
        onblur: function () {
            this.innerHTML = this.innerHTML.replace(/<br>/g, "");
            var value = parseFloat(this.innerHTML);
            if (isNaN(value)) value = 0.18;
            if (value < 0.1) value = 0.1;
            if (value > 1) value = 1;
            this.innerHTML = value.toFixed(2);
            game.saveConfig("extension_十周年UI_cardScale", value);
            if (window.decadeUI) {
                decadeUI.zooms.card = decadeUI.getCardBestScale();
                decadeUI.layout.resize();
            }
        },
    },
    playerMarkStyle: {
        name: "标记样式",
        init: "decade",
        item: {
            red: "红灯笼",
            yellow: "黄灯笼",
            decade: "十周年",
        },
        update() {
            if (window.decadeUI) ui.arena.dataset.playerMarkStyle = lib.config["extension_十周年UI_playerMarkStyle"];
        },
    },
    shadowStyle: {
        name: "特效风格",
        intro: "可根据个人喜好切换局内阴影动态特效与人物弹出文字的样式，目前只有新手杀/online样式可用",
        init: "off",
        item: {
            on: "原样式",
            off: "新样式",
        },
        update() {
            if (window.decadeUI) ui.arena.dataset.shadowStyle = lib.config["extension_十周年UI_shadowStyle"];
        },
    },
    gainSkillsVisible: {
        name: "获得技能显示",
        init: "on",
        item: {
            on: "显示",
            off: "不显示",
            othersOn: "显示他人",
        },
        update() {
            if (window.decadeUI) ui.arena.dataset.gainSkillsVisible = lib.config["extension_十周年UI_gainSkillsVisible"];
        },
    },
    loadingStyle: {
        name: "更换光标+loading框",
        intro: "可以更换局内选项框以及光标",
        init: "on",
        item: {
            off: "关闭",
            on: '<div style="width:60px;height:40px;position:relative;background-image: url(' + lib.assetURL + 'extension/十周年UI/assets/image/dialog2.png);background-size: 100% 100%;"></div>',
            On: '<div style="width:60px;height:40px;position:relative;background-image: url(' + lib.assetURL + 'extension/十周年UI/assets/image/dialog1.png);background-size: 100% 100%;"></div>',
            othersOn: '<div style="width:60px;height:40px;position:relative;background-image: url(' + lib.assetURL + 'extension/十周年UI/assets/image/dialog3.png);background-size: 100% 100%;"></div>',
            othersOff: '<div style="width:60px;height:40px;position:relative;background-image: url(' + lib.assetURL + 'extension/十周年UI/assets/image/dialog4.png);background-size: 100% 100%;"></div>',
            onlineUI: '<div style="width:60px;height:40px;position:relative;background-image: url(' + lib.assetURL + 'extension/十周年UI/assets/image/dialog5.png);background-size: 100% 100%;"></div>',
        },
        update() {
            if (window.decadeUI) ui.arena.dataset.loadingStyle = lib.config["extension_十周年UI_loadingStyle"];
        },
    },
    //手杀UI
    FL1: {
        name: '<b><font color="#00FF66">★𝑪𝒊𝒂𝒍𝒍𝒐～(∠・ω< )⌒★',
        intro: "",
        init: true,
        clear: true,
        onclick: function () {
            game.playAudio("..", "extension", "十周年UI/audio", "Ciallo");
        },
    },
    /*进度条说明*/
    JDTSM: {
        name: '<div class="shousha_menu">进度条&阶段提示·查看</div>',
        clear: true,
        onclick() {
            if (this.JDTSM == undefined) {
                var more = ui.create.div(".JDTSM", '<div class="shousha_text"><li><b>进度条</b>:完善时机包括玩家回合内、人机回合内、玩家回合外、人机回合外。<li><b>进度条时间间隔</b>:设置玩家进度条的时间间隔，默认100毫秒/次<li><b>时间间隔</b>：通俗点说，就是进度条刷新的自定义时间单位/次。时间间隔越小，进度条总时间越少，反之亦然。<li><b>切换不生效？</b>:在游戏里切换时间间隔后不会马上生效，会在下一次进度条出现时生效。<li><b>进度条高度百分比</b>:现在可以在游戏里动态调节进度条高度了，变化发生在每次刷新时，建议开启<b>进度条刷新</b>功能搭配使用。可调节的范围在10%-40%左右。<li><b>进度条刷新</b>:在游戏里开启后，进度条会在每个节点进行刷新（也就是大伙说的旧版进度条）。</div>');
                this.parentNode.insertBefore(more, this.nextSibling);
                this.JDTSM = more;
                this.innerHTML = '<div class="shousha_menu">进度条&阶段提示·关闭</div>';
            } else {
                this.parentNode.removeChild(this.JDTSM);
                delete this.JDTSM;
                this.innerHTML = '<div class="shousha_menu">进度条&阶段提示·查看</div>';
            }
        },
    },
    /*-----进度条-------*/
    jindutiao: {
        init: true,
        intro: "自己回合内显示进度条带素材",
        name: "进度条",
    },
    JDTS: {
        init: true,
        intro: "自己回合内显示对应阶段图片提示",
        name: "阶段提示",
    },
    jindutiaotuoguan: {
        name: "托管效果",
        init: false,
        intro: "开启进度条的情况下，开启此选项后，当玩家的进度条时间走完时，将自动托管。",
    },
    JDTSYangshi: {
        name: "阶段提示",
        init: "2",
        intro: "切换阶段提示样式，可根据个人喜好切换",
        item: {
            1: "手杀阶段提示",
            2: "十周年阶段提示",
            3: "OL阶段提示",
            4: "欢乐阶段提示",
        },
    },
    jindutiaoYangshi: {
        name: "进度条样式",
        init: "3",
        intro: "切换进度条样式，可根据个人喜好切换手杀进度条或十周年进度条，切换后重启生效",
        item: {
            1: "手杀进度条",
            2: "十周年PC端进度条",
            3: "十周年客户端进度条",
            4: "一将成名进度条",
        },
    },
    jindutiaoST: {
        name: "进度条时间间隔",
        init: "100",
        intro: "<li>设置玩家进度条的时间间隔。",
        item: {
            10: "10毫秒/次",
            50: "50毫秒/次",
            100: "100毫秒/次",
            200: "200毫秒/次",
            500: "500毫秒/次",
            800: "800毫秒/次",
            1000: "1秒/次",
            2000: "2秒/次",
        },
    },
    jindutiaoSet: {
        name: "进度条高度",
        init: "22",
        intro: "<li>设置玩家进度条的高度百分比。",
        item: {
            10: "10%",
            15: "15%",
            20: "20%",
            21: "21%",
            22: "22%",
            23: "23%",
            24: "24%",
            25: "25%",
            26: "26%",
            27: "27%",
            28: "28%",
            29: "29%",
            30: "30%",
            31: "31%",
            32: "32%",
            33: "33%",
            34: "34%",
            35: "35%",
            36: "36%",
            37: "37%",
            38: "38%",
            39: "39%",
        },
    },
    FL3: {
        name: '<b><font color="#00FF66">★𝑪𝒊𝒂𝒍𝒍𝒐～(∠・ω< )⌒★',
        intro: "",
        init: true,
        clear: true,
        onclick: function () {
            game.playAudio("..", "extension", "十周年UI/audio", "Ciallo");
        },
    },
    /*狗托播报说明*/
    GTBBSM: {
        name: '<div class="shousha_menu">狗托播报·查看</div>',
        clear: true,
        onclick() {
            if (this.GTBBSM == undefined) {
                var more = ui.create.div(".GTBBSM", '<div class="shousha_text"><li><b>狗托播报</b>:开启后，顶部会出现滚动播报栏。PS:狗托误我啊!<li><b>播报样式</b>：新增一种样式，可选择切换，需重启。【手杀/十周年】<li><b>播报时间间隔</b>:需重启，调整每条播报的出现频率。</div>');
                this.parentNode.insertBefore(more, this.nextSibling);
                this.GTBBSM = more;
                this.innerHTML = '<div class="shousha_menu">狗托播报·关闭</div>';
            } else {
                this.parentNode.removeChild(this.GTBBSM);
                delete this.GTBBSM;
                this.innerHTML = '<div class="shousha_menu">狗托播报·查看</div>';
            }
        },
    },
    /*-------狗托播报-----*/
    GTBB: {
        init: false,
        intro: "开启后，顶部会出现滚动播报栏。",
        name: "狗托播报",
    },
    GTBBYangshi: {
        name: "播报样式",
        init: "on",
        intro: "切换狗托播报样式",
        item: {
            on: "手杀",
            off: "十周年",
        },
    },
    GTBBFont: {
        name: "播报字体",
        init: "on",
        intro: "切换狗托播报字体，可根据个人喜好切换（即时生效）",
        item: {
            on: '<font face="shousha">手杀',
            off: '<font face="yuanli">十周年',
        },
    },
    GTBBTime: {
        name: "时间间隔",
        init: "60000",
        intro: "更改狗托播报出现的时间间隔，可根据个人喜好调整频率",
        item: {
            30000: "0.5min/次",
            60000: "1min/次",
            120000: "2min/次",
            300000: "5min/次",
        },
    },
    XPJ: {
        name: "小配件",
        init: "off",
        intro: "十周年样式下，选择切换左下角小配件",
        item: {
            on: "原版",
            off: "新版",
        },
    },
    LTAN: {
        init: false,
        intro: "<li>手杀样式下在游戏中，隐藏左下角的聊天按钮<li>需重启",
        name: "聊天按钮隐藏",
    },
    mx_decade_characterDialog: {
        name: "自由选将筛选框",
        init: "default",
        intro: "更改自由选将筛选框",
        item: {
            default: "默认本体框",
            "extension-OL-system": "扩展内置框",
            offDialog: "关闭筛选框",
        },
    },
    //手杀UI
    FL5: {
        name: '<b><font color="#00FF66">★𝑪𝒊𝒂𝒍𝒍𝒐～(∠・ω< )⌒★',
        intro: "",
        init: true,
        clear: true,
        onclick: function () {
            game.playAudio("..", "extension", "十周年UI/audio", "Ciallo");
        },
    },
}