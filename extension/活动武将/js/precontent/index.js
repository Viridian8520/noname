import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
import FaDongCharacter from './FaDongCharacter.js';
import NianShouCharacter from './NianShouCharacter.js';
import hezongkangqincharacter from './hezongkangqincharacter.js';
import decadeQiHuan from './decadeQiHuan.js';
import decadeZhuoGui from './decadeZhuoGui.js';
import decadeKuiBa from './decadeKuiBa.js';
import HD_chaoshikong from './HD_chaoshikong.js';
import MiNikill from './MiNikill.js';
import WeChatkill from './WeChatkill.js';
import MX_feihongyinxue from './MX_feihongyinxue.js';
import huodongcharacter from './huodongcharacter.js';

export function precontent(bilibilicharacter) {
    //判断是否有XX扩展
    game.TrueHasExtension = game.TrueHasExtension || function (ext) {
        return lib.config.extensions && lib.config.extensions.includes(ext);
    };
    game.HasExtension = game.HasExtension || function (ext) {
        return game.TrueHasExtension(ext) && lib.config['extension_' + ext + '_enable'];
    };
    //阵亡配音
    lib.skill._HD_die = {
        charlotte: true,
        ruleSkill: true,
        trigger: { player: 'dieBegin' },
        filter(event, player) {
            return lib.config.background_speak && event.player.name;
        },
        firstDo: true,
        direct: true,
        priority: -Infinity,
        lasrDo: true,
        content() {
            game.broadcastAll(function (name) {
                game.playAudio('..', 'extension', '活动武将/audio/die', name);
            }, trigger.player.name);
        },
    };
    //困难年兽体力上限和体力值为所有其他角色的体力上限和
    lib.skill._YJplusmaxHp = {
        charlotte: true,
        ruleSkill: true,
        trigger: { global: 'gameStart', player: 'enterGame' },
        filter(event, player) {
            return player.name == 'NS_nianshouC' || player.name2 == 'NS_nianshouC';
        },
        priority: 114514,//恶臭(划掉)
        direct: true,
        content() {
            for (var i = 0; i < game.players.length; i++) {
                if (game.players[i] == player) continue;
                player.maxHp += game.players[i].maxHp;
            }
            player.hp = player.maxHp;
            player.update();
        },
    };
    //一轮的结束
    lib.skill._bilibili_roundEnd = {
        charlotte: true,
        ruleSkill: true,
        trigger: { player: ['phaseAfter', 'phaseCancelled', 'phaseSkipped'] },//伪·一轮的结束
        filter(event, player) {
            return !event.skill && player.next == _status.roundStart;
        },
        forceDie: true,
        direct: true,
        priority: -Infinity,
        lastDo: true,
        content() {
            'step 0'
            event.trigger('roundEnd');//End时机常用于技能结算
            'step 1'
            event.trigger('roundAfter');//After时机常用于效果清除
        },
    };
    //闪闪节
    lib.arenaReady.push(() => {
        if (lib.config.extension_活动武将_HD_shanshan) {
            for (var i = 0; i < lib.card.list.length; i++) {
                if (lib.card.list[i][2] != 'shan' || lib.card.list[i][0] != 'diamond') continue;
                if ([5, 6, 7].includes(lib.card.list[i][1])) lib.card.list[i][2] = 'bol_shanshan';
            }
            game.log('三张', '#g【闪闪】', '已加入牌堆');
        }
    });
    //合纵抗秦、官渡之战模式特殊规则
    lib.skill._hzkq_shijian = {
        charlotte: true,
        ruleSkill: true,
        trigger: { global: 'chooseButtonBefore' },
        filter(event, player) {
            if (!lib.config.extension_活动武将_KQShiJian) lib.config.extension_活动武将_KQShiJian = 'off';
            if (!lib.config.extension_活动武将_GDShiJian) lib.config.extension_活动武将_GDShiJian = 'off';
            if (event.parent.name != 'chooseCharacter' || get.mode() == 'boss') return false;
            return (lib.config.extension_活动武将_KQShiJian != 'off' && !game.hzkqshijianed) || (lib.config.extension_活动武将_GDShiJian != 'off' && !game.GDZZshijianed);
        },
        direct: true,
        content() {
            'step 0'
            if (lib.config.extension_活动武将_KQShiJian != 'off' && !game.hzkqshijianed) {
                game.hzkqshijianed = true;
                var evt = lib.config.extension_活动武将_KQShiJian;
                if (['hzlh', 'cpzz', 'lscq', 'sqzb', 'zjzl', 'scth'].includes(evt)) game.addGlobalSkill(evt);
                switch (evt) {
                    case 'bftq':
                        game.bianfaed = true;
                        var list = [5, 7, 9];
                        for (var i = 0; i < 2; i++) {
                            var card = game.createCard2('qin_shangyangbianfa', 'spade', list[i]);
                            ui.cardPile.insertBefore(card, ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
                            game.broadcastAll(function () { lib.inpile.add('qin_zhenlongchangjian') });
                        }
                        game.updateRoundNumber();
                        game.log('商鞅变法已加入牌堆');
                        break;
                    case 'hzlh':
                        game.lianhenged = true;
                        break;
                    case 'cpzz':
                        _status._aozhan = true;
                        game.playBackgroundMusic();
                        break;
                    case 'hslh':
                        var list = [];
                        if (!lib.inpile.includes('qin_chuanguoyuxi')) {
                            list.push('qin_chuanguoyuxi');
                            var card = game.createCard2('qin_chuanguoyuxi', 'heart', 7);
                            ui.cardPile.insertBefore(card, ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
                            game.broadcastAll(function () { lib.inpile.add('qin_chuanguoyuxi') });
                        }
                        if (!lib.inpile.includes('qin_zhenlongchangjian')) {
                            list.push('qin_zhenlongchangjian');
                            var card = game.createCard2('qin_zhenlongchangjian', 'heart', 2);
                            ui.cardPile.insertBefore(card, ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
                            game.broadcastAll(function () { lib.inpile.add('qin_zhenlongchangjian') });
                        }
                        game.updateRoundNumber();
                        game.log(get.translation(list), '已加入牌堆');
                        game.hslh = true;
                        break;
                    case 'scth':
                        for (var name in lib.character) {
                            if (lib.character[name][0] == 'female') {
                                if (typeof lib.character[name][2] == 'number') lib.character[name][2] = lib.character[name][2] + 1;
                                else {
                                    var hp = get.infoHp(lib.character[name][2]);
                                    var maxHp = get.infoMaxHp(lib.character[name][2]);
                                    var hujia = get.infoHujia(lib.character[name][2]);
                                    if (hujia) lib.character[name][2] = (hp + 1) + '/' + (maxHp + 1) + '/' + (hujia + 1);
                                    else lib.character[name][2] = (hp + 1) + '/' + (maxHp + 1);
                                }
                            }
                        }
                        game.uncheck();
                        game.check();
                        break;
                }
                game.broadcastAll(function (evt) {
                    if (get.is.phoneLayout()) ui.bolhzkqInfo = ui.create.div('.touchinfo.left', ui.window);
                    else ui.bolhzkqInfo = ui.create.div(ui.gameinfo);
                    ui.bolhzkqInfo.innerHTML = '当前事件：' + get.translation(evt);
                    if (evt == 'cpzz') ui.bolhzkqInfo.innerHTML += '/鏖战模式';
                    ui.bolhzkqInfo.innerHTML += '<br>事件内容：' + get.translation(evt + '_info');
                }, evt);
                game.me.chooseControl('ok').set('prompt', '###合纵抗秦特殊事件：' + get.translation(evt) + '###' + get.translation(evt + '_info'));
            }
            'step 1'
            if (lib.config.extension_活动武将_GDShiJian != 'off' && !game.GDZZshijianed) {
                game.GDZZshijianed = true;
                var evt = lib.config.extension_活动武将_GDShiJian;
                game.addGlobalSkill(evt);
                game.broadcastAll(function (evt) {
                    if (get.is.phoneLayout()) ui.bolGuanDuInfo = ui.create.div('.touchinfo.left', ui.window);
                    else ui.bolGuanDuInfo = ui.create.div(ui.gameinfo);
                    ui.bolGuanDuInfo.innerHTML = '当前事件：' + get.translation(evt);
                    ui.bolGuanDuInfo.innerHTML += '<br>事件内容：' + get.translation(evt + '_info');
                }, evt);
                game.me.chooseControl('ok').set('prompt', '###官渡之战特殊事件：' + get.translation(evt) + '###' + get.translation(evt + '_info'));
            }
        },
    };
    //嬴政装备传国玉玺和真龙长剑
    lib.skill._qin_start = {
        charlotte: true,
        ruleSkill: true,
        trigger: { global: 'gameStart' },
        filter(event, player) {
            return game.hslh && (player.name && player.name == 'qin_yingzheng') || (player.name2 && player.name2 == 'qin_yingzheng');
        },
        direct: true,
        priority: 1 + 1 + 4 + 5 + 1 + 4 + 1 + 9 + 1 + 9 + 8 + 1 + 0,
        content() {
            //传国玉玺
            var card1 = get.cardPile2(function (card1) {
                return card1.name == 'qin_chuanguoyuxi';
            });
            if (card1) player.equip(card1);
            //真龙长剑
            var card2 = get.cardPile2(function (card2) {
                return card2.name == 'qin_zhenlongchangjian';
            });
            if (card2) player.equip(card2);
        },
    };
    //座位号显示
    lib.skill._firstPlayer = {
        charlotte: true,
        ruleSkill: true,
        trigger: { global: 'phaseBefore' },
        filter(event, player) {
            if (!lib.config.extension_活动武将_ShowSeatNum) return false;
            return !game.firstPlayer && game.phaseNumber == 0;
        },
        direct: true,
        priority: 1145141919810,
        content() {
            game.firstPlayer = true;
            game.players.forEach(i => {
                if (i.getSeatNum() != 0) i.setNickname(get.cnNumber(i.getSeatNum(), true) + '号位');
            });
            var originSwapSeat = game.swapSeat;
            game.swapSeat = function (player1, player2, prompt, behind, noanimate) {
                originSwapSeat.apply(this, arguments);
                if (player1.getSeatNum() != 0) player1.setNickname(get.cnNumber(player1.getSeatNum(), true) + '号位');
                if (player2.getSeatNum() != 0) player2.setNickname(get.cnNumber(player2.getSeatNum(), true) + '号位');
            };
        },
    };
    //弃牌阶段相关技能
    lib.skill._bilibili_phaseDiscard_audio = {
        charlotte: true,
        ruleSkill: true,
        trigger: { player: 'phaseDiscardBegin' },
        filter(event, player) {
            return player.countCards('h') > player.hp;
        },
        direct: true,
        firstDo: true,
        priority: 15,
        content() {
            if (player.hasSkill('zongshi')) player.logSkill('zongshi');
            if (player.hasSkill('rezongshi')) player.logSkill('rezongshi');
            if (player.hasSkill('decadezongshi')) player.logSkill('decadezongshi');
            if (player.hasSkill('huaibi') && player.storage.yinlang && game.hasPlayer(function (current) {
                return current.group == player.storage.yinlang;
            })) player.logSkill('huaibi');
            if (player.hasSkill('rehuaibi') && player.storage.yaohu && game.hasPlayer(function (current) {
                return current.group == player.storage.yaohu;
            })) player.logSkill('rehuaibi');
            if (player.hasSkill('sbxueyi') && game.hasPlayer(current => player != current && current.group == 'qun')) player.logSkill('sbxueyi');
        },
    };
    //失去体力上限配音
    lib.skill._bilibili_loseMaxHp = {
        charlotte: true,
        ruleSkill: true,
        trigger: { player: 'loseMaxHpBegin' },
        filter(event, player) {
            return lib.config.extension_活动武将_HDdamageAudio && lib.config.background_audio;
        },
        direct: true,
        priority: -Infinity,
        lastDo: true,
        content() {
            game.broadcastAll(function () {
                game.playAudio('..', 'extension', '活动武将/audio/effect', 'bilibili_loseMaxHp');
            });
        },
    };
    //神张飞拼点彩蛋
    lib.skill._bol_shenzhangfei_chat = {
        charlotte: true,
        ruleSkill: true,
        trigger: { player: ['chooseToCompareAfter', 'compareMultipleAfter'], target: ['chooseToCompareAfter', 'compareMultipleAfter'] },
        filter(event, player) {
            return (player.name == 'shen_zhangfei' || player.name2 == 'shen_zhangfei') && event.num1 == event.num2;
        },
        priority: -3,
        direct: true,
        content() {
            player.chat('俺也一样');
            game.broadcastAll(function () {
                if (lib.config.background_speak) game.playAudio('..', 'extension', '活动武将/audio/effect', 'shen_zhangfei_anyeyiyang');
            });
        },
    };
    //神张飞俺颇有家资彩蛋
    lib.skill._bol_shenzhangfei_use = {
        charlotte: true,
        ruleSkill: true,
        trigger: { player: 'useCard' },
        filter(event, player) {
            return (player.name == 'shen_zhangfei' || player.name2 == 'shen_zhangfei') && event.card.name == 'wugu';
        },
        priority: -3,
        direct: true,
        content() {
            player.chat('俺颇有家资');
            game.broadcastAll(function () {
                if (lib.config.background_speak) game.playAudio('..', 'extension', '活动武将/audio/effect', 'shen_zhangfei_anpoyoujiazi');
            });
        },
    };
    //点击显示
    //低配+仅限电脑版
    get.bolInform = function (str1, str2) {
        return '<abbr title=\"' + str2 + '\"><ins>' + str1 + '</ins></abbr>';
    };
    //高配
    //感谢 雷 的技术支持
    game.getBolPhone = function () {
        //获取浏览器navigator对象的userAgent属性（浏览器用于HTTP请求的用户代理头的值）
        var info = navigator.userAgent;
        //通过正则表达式的test方法判断是否包含“Mobile”字符串
        var isPhone = /mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i.test(info);
        //如果包含“Mobile”（是手机设备）则返回true
        return isPhone;
    };
    get.bolskillTips = function (tipname, id) {
        var dibeijing = ui.create.div('.bol-dibeijing', document.body);
        dibeijing.style.zIndex = 16;
        var skilltip = ui.create.div('.bol-skilltip', dibeijing);
        skilltip.innerHTML = tipname;
        var herf = document.getElementById(id);
        if (herf) {
            var left = herf.getBoundingClientRect().left;
            if (game.getBolPhone()) left += herf.offsetParent.offsetLeft;
            left += document.body.offsetWidth * 0.15;
            skilltip.style.left = left + 'px';
            skilltip.style.top = (herf.getBoundingClientRect().top + 30) + 'px';
        }
        dibeijing.listen(function (e) {
            e.stopPropagation();
            this.remove();
        })
    };
    get.bolInformX = function (str1, str2) {
        const id = Math.random().toString(36).slice(-8);
        return "<a id='" + id + "' style='color:unset' href=\"javascript:get.bolskillTips('" + str2 + "','" + id + "');\">" + str1 + "※</a>";
    };
    get.YunLvInform = () => get.bolInformX('韵律技', '韵律技分为平和仄两种状态，韵律技初始默认状态为平，满足转韵条件时韵律技会转成另一种状态并重置技能的发动次数');
    get.RenWangInform = () => get.bolInformX('仁望值', '拥有涉及仁望值技能的角色于游戏开始时获得1点仁望值，且其出牌阶段结束时，其根据以下满足的条件数增加等量的仁望值：①本阶段有角色获得过累计两张牌；②本阶段有角色回复过体力；③本阶段未对其他角色造成过伤害。一名角色的仁望值上限为5。');
    get.ZhengSuInform = () => get.bolInformX('整肃', '<li>技能发动者从“擂进”、“变阵”、“鸣止”三个选项中选择一个令目标执行，若其于其本回合弃牌阶段结束后达成选项条件，则选择整肃奖励。<br><li>整肃奖励：选择摸两张牌或回复1点体力<br><li>擂进：回合内所有于出牌阶段使用的牌点数递增且不少于三张。<br><li>变阵：回合内所有于出牌阶段使用的牌花色相同且不少于两张。<br><li>鸣止：回合内所有于弃牌阶段弃置的牌花色均不相同且不少于两张。');
    get.MouLveInform = () => get.bolInformX('谋略值', '上限为5，拥有谋略值的角色可以发动技能【妙计】（每回合限一次，你可以：①失去1点谋略值，视为使用【过河拆桥】；②失去2点谋略值，视为使用【无懈可击】；③失去3点谋略值，视为使用【无中生有】）');
    get.ShiwuInform = () => get.bolInformX('奋武技', '奋武技的使用次数为本轮你造成和受到的伤害值+1，至多为5');
    //----------------游戏播报·始----------------
    lib.skill._OpenTheGame = {
        charlotte: true,
        ruleSkill: true,
        forceDie: true,
        trigger: { global: 'gameDrawAfter' },
        filter(event, player) {
            const config = lib.config.extension_活动武将_HDfightAudio;
            return config && config !== 'off' && player == game.me && (!game.HasExtension('十周年UI') || !lib.config.extension_十周年UI_gameAnimationEffect);
        },
        direct: true,
        firstDo: true,
        priority: Infinity,
        content() {
            player.$fullscreenpop('游戏开始', 'fire');
            game.broadcastAll(function (config) {
                if (lib.config.background_audio) game.playAudio('..', 'extension', '活动武将/audio/effect', 'bilibili_OpenTheGame' + (config === 'default' ? '' : ('_' + config)));
            }, lib.config.extension_活动武将_HDfightAudio);
        },
    };
    lib.skill._bilibili_miaoshou = {
        charlotte: true,
        ruleSkill: true,
        trigger: { global: 'xmiaoshou' },
        filter(event, player) {
            const config = lib.config.extension_活动武将_HDfightAudio;
            return config && config !== 'off' && event.player == player;
        },
        direct: true,
        firstDo: true,
        forceDie: true,
        content() {
            const config = lib.config.extension_活动武将_HDfightAudio;
            trigger.player.$fullscreenpop({ 'default': '妙手回春', 'decade': '青囊济世', 'ol': '悬壶济世' }[config], 'water');
            game.broadcastAll(function (config) {
                if (lib.config.background_audio) game.playAudio('..', 'extension', '活动武将/audio/effect', 'bilibili_miaoshou' + (config === 'default' ? '' : ('_' + config)));
            }, config);
        },
    };
    lib.skill._bilibili_yishu = {
        charlotte: true,
        ruleSkill: true,
        trigger: { global: 'xyishu' },
        filter(event, player) {
            const config = lib.config.extension_活动武将_HDfightAudio;
            return config && config !== 'off' && event.player == player;
        },
        direct: true,
        firstDo: true,
        forceDie: true,
        content() {
            const config = lib.config.extension_活动武将_HDfightAudio;
            trigger.player.$fullscreenpop({ 'default': '医术高超', 'decade': '神医妙手', 'ol': '杏林春满' }[config], 'water');
            game.broadcastAll(function (config) {
                if (lib.config.background_audio) game.playAudio('..', 'extension', '活动武将/audio/effect', 'bilibili_yishu' + (config === 'default' ? '' : ('_' + config)));
            }, config);
        },
    };
    lib.skill._recovertrigger = {
        charlotte: true,
        ruleSkill: true,
        trigger: {
            player: 'phaseEnd',
            global: 'recoverEnd',
        },
        filter(event, player) {
            if (event.name === 'phase') return player.storage.jstxyishugaochao;
            if (_status.currentPhase === player) return true;
            return event.player != event.source && event.source == player;
        },
        direct: true,
        firstDo: true,
        forceDie: true,
        content() {
            if (trigger.name === 'phase') delete player.storage.jstxyishugaochao;
            else if (_status.currentPhase !== player) _status.event.trigger('xmiaoshou');
            else {
                if (player.storage.jstxyishugaochao == undefined) player.storage.jstxyishugaochao = trigger.num;
                else player.storage.jstxyishugaochao += trigger.num;
                if (player.storage.jstxyishugaochao >= 3) {
                    player.storage.jstxyishugaochao -= 3;
                    _status.event.trigger('xyishu');
                }
            }
        },
    };
    lib.skill._jishaAudio = {
        charlotte: true,
        ruleSkill: true,
        trigger: { global: 'dieBegin' },
        filter(event, player) {
            const config = lib.config.extension_活动武将_HDfightAudio;
            return config && config !== 'off' && event.source == player && event.player != player;
        },
        direct: true,
        firstDo: true,
        content() {
            'step 0'
            if (!player.storage.bilibili_kill) player.storage.bilibili_kill = 0;
            player.storage.bilibili_kill++;
            'step 1'
            let config = lib.config.extension_活动武将_HDfightAudio;
            config = config === 'default' ? lib.config.extension_活动武将_HDkillAudio : config;
            let list;
            switch (config) {
                case 'new':
                    list = ['一破·卧龙出山', '双连·一战成名', '三连·举世皆惊', '四连·天下无敌', '五连·诛天灭地', '六连·诛天灭地', '七连·诛天灭地'];
                    break;
                case 'decade':
                    list = ['首破<br>一骑当先', '连破<br>世无双', '三破<br>冠三军', '四破<br>震诸侯', '五破<br>天下无敌', '六破<br>统九州乾坤', '七破<br>千古第一人'];
                    break;
                case 'ol':
                    list = ['一破·龙战于野', '二连<br>飞龙在天', '三连<br>亢龙有悔', '四连<br>天下无敌', '五连<br>威震天下', '六连<br>天崩地裂', '七连<br>毁天灭地'];
                    break;
                default:
                    list = ['一血·卧龙出山', '双杀·一战成名', '三杀·举世皆惊', '四杀·天下无敌', '五杀·诛天灭地', '六杀·癫狂杀戮', '无双·万军取首'];
                    break;
            }
            var num = Math.min(7, player.storage.bilibili_kill);
            player.$fullscreenpop(list[num - 1], ['water', 'wood', 'thunder', 'fire'][Math.min(3, num - 1)]);
            game.broadcastAll(function (num, config) {
                if (lib.config.background_audio) {
                    game.playAudio('..', 'extension', '活动武将/audio/effect', 'bilibili_jisha' + num + (config === 'default' ? '' : ('_' + config)));
                }
            }, num, config);
        },
    };
    lib.skill._bilibili_HighDamageAudio = {
        charlotte: true,
        ruleSkill: true,
        trigger: { source: 'damageBegin4' },
        filter(event, player) {
            const config = lib.config.extension_活动武将_HDfightAudio;
            return ['decade', 'default'].includes(config) && event.player != player && event.num >= 3;
        },
        direct: true,
        lastDo: true,
        priority: -Infinity,
        content() {
            const config = lib.config.extension_活动武将_HDfightAudio === 'decade';
            if (trigger.num == 3) {
                player.$fullscreenpop(config ? '万夫莫敌' : '癫狂屠戮', 'fire');
                game.broadcastAll(function (config) {
                    if (lib.config.background_audio) game.playAudio('..', 'extension', '活动武将/audio/effect', 'bilibili_diankuang' + (config ? '_decade' : ''));
                }, config);
            }
            else {
                player.$fullscreenpop(config ? '神威震乾坤' : '无双<br>万军取首', 'fire');
                game.broadcastAll(function (config) {
                    if (lib.config.background_audio) game.playAudio('..', 'extension', '活动武将/audio/effect', 'bilibili_wanjun' + (config ? '_decade' : ''));
                }, config);
            }
        },
    };
    //skillAnimation技能配音播放
    var originTrySkillAnimate = lib.element.player.trySkillAnimate;
    lib.element.player.trySkillAnimate = function (name, popname, checkShow) {
        if (!game.online && lib.config.skill_animation_type != 'off' && lib.skill[name] && lib.skill[name].skillAnimation && lib.config.extension_活动武将_HDskillAnimateAudio) {
            game.broadcastAll(function (name) {
                if (ui.backgroundMusic) ui.backgroundMusic.pause();
                game.playAudio('..', 'extension', '活动武将/audio/effect', 'spell_' + (lib.skill[name].juexingji ? 'wake' : 'limit'));
            }, name);
            setTimeout(function () {
                if (ui.backgroundMusic) ui.backgroundMusic.play();
            }, 4000);
        }
        originTrySkillAnimate.apply(this, arguments);
    };
    //对局BGM
    game.bol_playAudio = function () {
        ui.backgroundMusic.src = lib.assetURL + 'extension/活动武将/audio/effect/bgm_1.mp3';
        ui.backgroundMusic.volume = lib.config.volumn_background / 8;
        ui.backgroundMusic.addEventListener('ended', game.players.length > 4 ? game.bol_playAudio : game.bol_playAudiox);
    };
    game.bol_playAudiox = function () {
        game.bol_playAudio3 = true;
        ui.backgroundMusic.src = lib.assetURL + 'extension/活动武将/audio/effect/bgm_2.mp3';
        ui.backgroundMusic.volume = lib.config.volumn_background / 8;
        ui.backgroundMusic.addEventListener('ended', game.bol_playAudiox);
    };
    //选将
    lib.skill._bol_playAudio1 = {
        ruleSkill: true,
        charlotte: true,
        trigger: { global: 'chooseButtonBefore' },
        filter(event, player) {
            if (!lib.config.extension_活动武将_HD_bgmPlay || !game.zhu || game.zhu.identity != 'zhu') return false;
            return !game.bol_playAudio1 && event.parent.name == 'chooseCharacter' && get.mode() == 'identity' && _status.mode == 'normal';
        },
        direct: true,
        firstDo: true,
        priority: Infinity + 114 - 514,
        content() {
            'step 0'
            lib.config.background_music = 'music_off';
            game.playBackgroundMusic();
            lib.onover.push(function () {
                ui.backgroundMusic.src = '';
            });
            game.bol_playAudio1 = true;
            'step 1'
            ui.backgroundMusic.src = lib.assetURL + 'extension/活动武将/audio/effect/bgm_0.mp3';
            ui.backgroundMusic.volume = lib.config.volumn_background / 8;
        },
    };
    //开局、对局、残局
    lib.skill._bol_playAudio2 = {
        ruleSkill: true,
        charlotte: true,
        trigger: { global: ['gameDrawAfter', 'phaseBefore'] },
        filter(event, player) {
            return game.bol_playAudio1 && !game.bol_playAudio2;
        },
        direct: true,
        firstDo: true,
        priority: Infinity + 114 - 514,
        content() {
            game.bol_playAudio2 = true;
            var bgm = ((game.zhu && ['wei', 'shu', 'wu', 'qun'].includes(game.zhu.group)) ? game.zhu.group : 'qun');
            ui.backgroundMusic.src = lib.assetURL + 'extension/活动武将/audio/effect/bgm_' + bgm + '.mp3';
            ui.backgroundMusic.volume = lib.config.volumn_background / 8;
            ui.backgroundMusic.addEventListener('ended', game.players.length > 4 ? game.bol_playAudio : game.bol_playAudiox);
        },
    };
    lib.skill._bol_playAudio3 = {
        ruleSkill: true,
        charlotte: true,
        trigger: { global: 'phaseBeginStart' },
        filter(event, player) {
            return game.bol_playAudio2 && !game.bol_playAudio3 && game.players.length <= 4;
        },
        direct: true,
        firstDo: true,
        priority: Infinity + 114 - 514,
        content() {
            game.bol_playAudiox();
        },
    };
    //----------------游戏播报·末----------------

    //设定势力+颜色显示
    game.bolAddGroupNature = function (name, mapping, gradient, push) {
        var n;
        if (!name || !Array.isArray(name)) return;
        n = name[0];
        if (!mapping || !Array.isArray(mapping) || mapping.length != 3) mapping = [199, 21, 133];
        var y = "(" + mapping[0] + "," + mapping[1] + "," + mapping[2];
        var y1 = y + ",1)", y2 = y + ")";
        var s = document.createElement('style');
        var l = ".player .identity[data-color='diy" + n + "'],";
        l += "div[data-nature='diy" + n + "'],";
        l += "span[data-nature='diy" + n + "'] {text-shadow: black 0 0 1px,rgba" + y1 + " 0 0 2px,rgba" + y1 + " 0 0 5px,rgba" + y1 + " 0 0 10px,rgba" + y1 + " 0 0 10px}";
        l += "div[data-nature='diy" + n + "m'],";
        l += "span[data-nature='diy" + n + "m'] {text-shadow: black 0 0 1px,rgba" + y1 + " 0 0 2px,rgba" + y1 + " 0 0 5px,rgba" + y1 + " 0 0 5px,rgba" + y1 + " 0 0 5px,black 0 0 1px;}";
        l += "div[data-nature='diy" + n + "mm'],";
        l += "span[data-nature='diy" + n + "mm'] {text-shadow: black 0 0 1px,rgba" + y1 + " 0 0 2px,rgba" + y1 + " 0 0 2px,rgba" + y1 + " 0 0 2px,rgba" + y1 + " 0 0 2px,black 0 0 1px;}";
        s.innerHTML = l;
        document.head.appendChild(s);
        if (gradient && Array.isArray(gradient) && Array.isArray(gradient[0]) && gradient[0].length == 3) {
            var str = "", st2 = [];
            for (var i = 0; i < gradient.length; i++) {
                str += ",rgb(" + gradient[i][0] + "," + gradient[i][1] + "," + gradient[i][2] + ")";
                if (i < 2) st2[i] = "rgb(" + gradient[i][0] + "," + gradient[i][1] + "," + gradient[i][2] + ")";
            }
            var tenUi = document.createElement('style');
            tenUi.innerHTML = ".player>.camp-zone[data-camp='" + n + "']>.camp-back {background: linear-gradient(to bottom" + str + ");}";
            tenUi.innerHTML += ".player>.camp-zone[data-camp='" + n + "']>.camp-name {text-shadow: 0 0 5px " + st2[0] + ", 0 0 10px " + st2[1] + ";}";
            document.head.appendChild(tenUi);
        }
        if (push === true) lib.group.add(n);
        if (!_status.mx_group) _status.mx_group = '夏商周秦汉晋南北隋唐宋元明清';
        lib.translate[n] = name[1];
        lib.translate[n + '2'] = (name[2] ? name[2] : (name[1] + (_status.mx_group.includes(name[1]) ? '朝' : '国')));
        lib.groupnature[n] = "diy" + n;
    };
    //武将包和卡包
    if (bilibilicharacter.enable) {
        //--------------------武将包--------------------//
        //诸侯伐董
        game.import('character', FaDongCharacter);
        //生肖年兽
        game.import('character', NianShouCharacter);
        //合纵抗秦
        game.import('character', hezongkangqincharacter);
        //戚宦之争——我补完了！！！
        game.import('character', decadeQiHuan);
        //捉鬼驱邪
        game.import('character', decadeZhuoGui);
        //魁拔
        game.import('character', decadeKuiBa);
        //超时空密探
        game.import('character', HD_chaoshikong);
        //欢乐三国杀
        game.import('character', MiNikill);
        //微信三国杀
        game.import('character', WeChatkill);
        //线下--飞鸿印雪
        game.import('character', MX_feihongyinxue);
        //没想到吧，我换前缀了
        game.import('character', huodongcharacter);
        //--------------------卡牌包--------------------//
    }
}