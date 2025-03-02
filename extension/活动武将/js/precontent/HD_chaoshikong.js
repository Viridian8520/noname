import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const packs = function () {
    var HD_chaoshikong = {
        name: 'HD_chaoshikong',
        connect: true,
        characterSort: {
            HD_chaoshikong: {
                cike_mitan: ['cike_wuliuqi', 'cike_meihuashisan', 'cike_mitan'],
                cike_wei: ['cike_caocao', 'cike_caopi', 'cike_caorui', 'cike_caomao', 'cike_caosong'],
                cike_shu: ['cike_liubei', 'cike_liushan', 'cike_liuchen', 'cike_liufeng', 'cike_liuyong'],
                cike_wu: ['cike_sunquan', 'cike_sunce', 'cike_sunliang', 'cike_sunxiu', 'cike_sunhao'],
                cike_extra: ['cike_lingju', 'cike_xugong'],
            },
        },
        character: {
            //密探
            cike_wuliuqi: ['male', 'qun', 3, ['cike_feijian', 'cike_yirong', 'cike_qingsuo', 'cike_xuefa']],
            cike_meihuashisan: ['female', 'qun', 3, ['cike_meibiao', 'cike_biandao', 'cike_yingyue', 'cike_huti']],
            cike_mitan: ['male', 'qun', 3, ['cike_zhibi'], ['unseen']],
            //魏国
            cike_caocao: ['male', 'wei', 16, ['new_rejianxiong', 'cike_hujia', 'feiying']],
            cike_caopi: ['male', 'wei', 10, ['xingshang', 'fangzhu', 'cike_songwei', 'lxzhuixi', 'zhichi']],
            cike_caorui: ['male', 'wei', 18, ['huituo', 'mingjian', 'cike_xingshuai']],
            cike_caomao: ['male', 'wei', 12, ['cike_wenhui', 'cike_qintao', 'cike_xianggong']],
            cike_caosong: ['male', 'wei', 20, ['cslilu', 'csyizheng', 'cike_taiwang']],
            //蜀国
            cike_liubei: ['male', 'shu', 20, ['rerende', 'cike_jijiang']],
            cike_liushan: ['male', 'shu', 18, ['xiangle', 'fangquan', 'cike_ruoyu']],
            cike_liuchen: ['male', 'shu', 16, ['zhanjue', 'cike_qinwang']],
            cike_liufeng: ['male', 'shu', 14, ['xiansi', 'cike_suizhan']],
            cike_liuyong: ['male', 'shu', 12, ['cike_zhuning', 'cike_fengxiang', 'cike_jitong']],
            //吴国
            cike_sunquan: ['male', 'wu', 16, ['rezhiheng', 'cike_jiuyuan']],
            cike_sunce: ['male', 'wu', 12, ['cike_zhiba', 'jiang', 'reyingzi', 'yinghun']],
            cike_sunliang: ['male', 'wu', 20, ['xinkuizhu', 'xinzhizheng', 'cike_lijun']],
            cike_sunxiu: ['male', 'wu', 14, ['reyanzhu', 'rexingxue', 'cike_zhaofu']],
            cike_sunhao: ['male', 'wu', 18, ['cike_canshi', 'chouhai', 'cike_guiming']],
            //特殊
            cike_lingju: ['female', 'qun', 12, ['jieyuan', 'cike_yinci']],
            cike_xugong: ['male', 'wu', 12, ['biaozhao', 'yechou']],
        },
        characterIntro: {
            wuliuqi: '伍六七，动画《刺客伍六七》及其衍生作品中的主人公，失忆前是玄武国第一刺客，失忆后成了大保发廊的高级发型师，虽然经常接些乱七八糟的廉价任务，但是伍六七却是一个假贱贱、真温柔、热血的短裤男。<br>没有记忆，身世是个谜，在大保发廊做理发师，身体伪装成任何形态，为了寻找自己的过去，走上了刺客之路。',
            meihuashisan: '梅花十三，动画《刺客伍六七》及其衍生作品中的女性角色，玄武国刺客，刺客排名37位，擅长使用双刀流和梅花镖，发辫上的短刃可以用于攻击。性格冷漠、好强，有着超越常人的果敢和强烈的使命感，内心其实很柔软。<br>小时候拜玄武国刺客青凤为师，长大后受命来到小鸡岛收集情报，意外认识了伍六七。起初，梅花十三因伍六七看到了自己脸，决定杀他灭口，但随着剧情的发展，二人的关系变得渐渐复杂起来。',
        },
        perfectPair: {
            wuliuqi: ['meihuashisan'],
        },
        skill: {
            _cike_chooseskill_wuliuqi: {
                forbid: ['guozhan'],
                unique: true,
                trigger: { global: 'gameStart', player: 'enterGame' },
                filter(event, player) {
                    return player.name == 'cike_meihuashisan' || player.name2 == 'cike_meihuashisan';
                },
                direct: true,
                content() {
                    'step 0'
                    var list = ['cike_biandao', 'cike_yingyue', 'cike_huti'];
                    event.videoId = lib.status.videoId++;
                    var func = function (skills, id) {
                        var dialog = ui.create.dialog('forcebutton');
                        dialog.videoId = id;
                        dialog.add('选择保留一个梅花十三的专属技能');
                        for (var i = 0; i < list.length; i++) {
                            dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + get.translation(list[i]) + '】</div><div>' + lib.translate[skills[i] + '_info'] + '</div></div>');
                        }
                        dialog.addText(' <br> ');
                    }
                    if (player.isOnline()) player.send(func, list, event.videoId);
                    else if (player == game.me) func(list, event.videoId);
                    player.chooseControl(list).set('ai', function () {
                        if (game.players.length < 4) {
                            var list2 = ['cike_biandao', 'cike_huti'];
                            return list2.randomGet();
                        }
                        return list.randomGet();
                    });
                    'step 1'
                    game.broadcastAll('closeDialog', event.videoId);
                    var skills = ['cike_biandao', 'cike_yingyue', 'cike_huti'];
                    skills.remove(result.control);
                    player.removeSkill(skills);
                    player.popup(result.control);
                    game.log(player, '保留了技能', '#g【' + get.translation(result.control) + '】');
                },
            },
            _cike_chooseskill_meihuashishan: {
                forbid: ['guozhan'],
                unique: true,
                trigger: { global: 'gameStart', player: 'enterGame' },
                filter(event, player) {
                    return player.name == 'cike_wuliuqi' || player.name2 == 'cike_wuliuqi';
                },
                direct: true,
                content() {
                    'step 0'
                    var list = ['cike_yirong', 'cike_qingsuo', 'cike_xuefa'];
                    event.videoId = lib.status.videoId++;
                    var func = function (skills, id) {
                        var dialog = ui.create.dialog('forcebutton');
                        dialog.videoId = id;
                        dialog.add('选择保留一个伍六七的专属技能');
                        for (var i = 0; i < list.length; i++) {
                            dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + get.translation(list[i]) + '】</div><div>' + lib.translate[skills[i] + '_info'] + '</div></div>');
                        }
                        dialog.addText(' <br> ');
                    }
                    if (player.isOnline()) player.send(func, list, event.videoId);
                    else if (player == game.me) func(list, event.videoId);
                    player.chooseControl(list).set('ai', function () {
                        return 'cike_xuefa';
                    });
                    'step 1'
                    game.broadcastAll('closeDialog', event.videoId);
                    var skills = ['cike_yirong', 'cike_qingsuo', 'cike_xuefa'];
                    skills.remove(result.control);
                    player.removeSkill(skills);
                    player.popup(result.control);
                    game.log(player, '保留了技能', '#g【' + get.translation(result.control) + '】');
                },
            },
            _cike_gzchooseskill_wuliuqi: {
                mode: ['guozhan'],
                unique: true,
                trigger: { player: 'showCharacterAfter' },
                filter(event, player) {
                    return event.toShow && event.toShow.includes('cike_meihuashisan');
                },
                direct: true,
                content() {
                    'step 0'
                    var list = ['cike_biandao', 'cike_yingyue', 'cike_huti'];
                    event.videoId = lib.status.videoId++;
                    var func = function (skills, id) {
                        var dialog = ui.create.dialog('forcebutton');
                        dialog.videoId = id;
                        dialog.add('选择保留一个梅花十三的专属技能');
                        for (var i = 0; i < list.length; i++) {
                            dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + get.translation(list[i]) + '】</div><div>' + lib.translate[skills[i] + '_info'] + '</div></div>');
                        }
                        dialog.addText(' <br> ');
                    }
                    if (player.isOnline()) player.send(func, list, event.videoId);
                    else if (player == game.me) func(list, event.videoId);
                    player.chooseControl(list).set('ai', function () {
                        if (game.players.length < 4) {
                            var list2 = ['cike_biandao', 'cike_huti'];
                            return list2.randomGet();
                        }
                        return list.randomGet();
                    });
                    'step 1'
                    game.broadcastAll('closeDialog', event.videoId);
                    var skills = ['cike_biandao', 'cike_yingyue', 'cike_huti'];
                    skills.remove(result.control);
                    player.removeSkill(skills);
                    player.popup(result.control);
                    game.log(player, '保留了技能', '#g【' + get.translation(result.control) + '】');
                },
            },
            _cike_gzchooseskill_meihuashishan: {
                mode: ['guozhan'],
                unique: true,
                trigger: { player: 'showCharacterAfter' },
                filter(event, player) {
                    return event.toShow && event.toShow.includes('cike_wuliuqi');
                },
                direct: true,
                content() {
                    'step 0'
                    var list = ['cike_yirong', 'cike_qingsuo', 'cike_xuefa'];
                    event.videoId = lib.status.videoId++;
                    var func = function (skills, id) {
                        var dialog = ui.create.dialog('forcebutton');
                        dialog.videoId = id;
                        dialog.add('选择保留一个伍六七的专属技能');
                        for (var i = 0; i < list.length; i++) {
                            dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + get.translation(list[i]) + '】</div><div>' + lib.translate[skills[i] + '_info'] + '</div></div>');
                        }
                        dialog.addText(' <br> ');
                    }
                    if (player.isOnline()) player.send(func, list, event.videoId);
                    else if (player == game.me) func(list, event.videoId);
                    player.chooseControl(list).set('ai', function () {
                        return 'cike_xuefa';
                    });
                    'step 1'
                    game.broadcastAll('closeDialog', event.videoId);
                    var skills = ['cike_yirong', 'cike_qingsuo', 'cike_xuefa'];
                    skills.remove(result.control);
                    player.removeSkill(skills);
                    player.popup(result.control);
                    game.log(player, '保留了技能', '#g【' + get.translation(result.control) + '】');
                },
            },
            cike_shenghu: {
                group: 'cike_chooseskill',
                derivation: 'cike_chooseskill',
                unique: true,
                forced: true,
                trigger: { global: 'damageBegin4' },
                filter(event, player) {
                    return event.player != player && ((get.mode() == 'identity' && get.attitude(player, event.player) > 0) || (get.mode() != 'identity' && event.player.isFriendOf(player)));
                },
                logTarget: 'player',
                content() {
                    trigger.num--;
                    player.loseHp();
                    game.asyncDraw([player, trigger.player]);
                },
            },
            cike_feijian: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseUseEnd' },
                filter(event, player) {
                    return player.getEquips(1).length && player.getHistory('sourceDamage', function (evt) {
                        return evt.player != player;
                    }).length;
                },
                forced: true,
                logTarget(event, player) {
                    return game.filterPlayer(function (current) {
                        if (current == player) return false;
                        return player.getHistory('sourceDamage', function (evt) {
                            return evt.player == current;
                        }).length;
                    }).sortBySeat();
                },
                content() {
                    'step 0'
                    player.discard(player.getEquips(1));
                    event.list = lib.skill.cike_feijian.logTarget(trigger, player);
                    'step 1'
                    var target = event.list.shift();
                    target.damage(get.rand(2, 4));
                    if (event.list.length) event.redo();
                },
            },
            cike_yirong: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { source: 'damageBefore' },
                filter(event, player) {
                    return game.players.length > 2;
                },
                usable: 1,
                forced: true,
                content() {
                    var list = game.filterPlayer();
                    list.remove(player);
                    list.remove(trigger.player);
                    var target = list.randomGet();
                    player.logSkill('cike_yirong', target);
                    trigger.source = target;
                },
            },
            cike_qingsuo: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'damageEnd' },
                filter(event, player) {
                    return event.source != player;
                },
                forced: true,
                logTarget: 'source',
                content() {
                    player.turnOver();
                    trigger.source.turnOver();
                },
            },
            cike_xuefa: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { source: 'damageSource' },
                filter(event, player) {
                    return event.player != player && event.player.countCards('he');
                },
                forced: true,
                content() {
                    trigger.player.discard(trigger.player.getCards('he').randomGets(get.rand(1, 3)));
                },
            },
            cike_lingshou: {
                group: 'cike_chooseskill',
                derivation: 'cike_chooseskill',
                unique: true,
                forced: true,
                trigger: { global: 'damageBegin4' },
                filter(event, player) {
                    return event.source && event.player != player && ((get.mode() == 'identity' && get.attitude(player, event.player) > 0) || (get.mode() != 'identity' && event.player.isFriendOf(player)));
                },
                logTarget: 'player',
                content() {
                    trigger.num--;
                    player.loseHp();
                    trigger.source.chooseToDiscard('he', 2, true);
                },
            },
            cike_meibiao: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'useCard' },
                forced: true,
                filter(event, player) {
                    return get.suit(event.card) == 'club';
                },
                content() {
                    trigger.directHit.addArray(game.filterPlayer(function (current) {
                        return current != player;
                    }));
                    if (get.tag(trigger.card, 'damage')) trigger.baseDamage += 2;
                },
            },
            cike_biandao: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseUseEnd' },
                filter(event, player) {
                    return player.getHistory('sourceDamage').length == 0;
                },
                logTarget(event, player) {
                    return game.filterPlayer(function (current) {
                        if (get.mode() == 'guozhan') return current.isEnemyOf(player);
                        return get.attitude(player, current) < 0;
                    });
                },
                forced: true,
                content() {
                    'step 0'
                    event.list = game.filterPlayer(function (current) {
                        if (get.mode() == 'guozhan') return current.isEnemyOf(player);
                        return get.attitude(player, current) < 0;
                    });
                    event.list.sort(lib.sort.seat);
                    'step 1'
                    var target = event.list.shift();
                    target.damage([1, 2].randomGet());
                    if (event.list.length) event.redo();
                },
            },
            cike_yingyue: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'useCard2' },
                filter(event, player) {
                    if (player != _status.currentPhase || !event.targets || event.targets.length != 1) return false;
                    return (event.card.name == 'sha' || get.type(event.card) == 'trick') && game.hasPlayer(function (current) {
                        return current != player && !event.targets.includes(current);
                    });
                },
                usable: 1,
                direct: true,
                content() {
                    'step 0'
                    player.chooseTarget(get.prompt('cike_yingyue'), '为' + get.translation(trigger.card) + '增加一个目标', function (card, player, target) {
                        var evt = _status.event.getTrigger();
                        return !evt.targets.includes(target) && lib.filter.filterTarget(evt.card, player, target);
                    }).set('ai', function (target) {
                        var evt = _status.event.getTrigger(), eff = get.effect(target, evt.card, evt.player, evt.player);
                        return eff;
                    }).animate = false;
                    'step 1'
                    if (result.bool) {
                        if (player != game.me && !player.isOnline()) game.delayx();
                        event.target = result.targets[0];
                    }
                    else event.finish();
                    'step 2'
                    player.logSkill('cike_yingyue', target);
                    trigger.targets.push(target);
                    game.log(target, '成为了', trigger.card, '的额外目标');
                },
            },
            cike_huti: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'damageBegin4' },
                filter(event, player) {
                    return event.source && event.source != player && !event.source.getHistory('sourceDamage').length;
                },
                forced: true,
                usable: 1,
                content() {
                    trigger.cancel();
                    player.discard(player.getCards('he', function (card) {
                        return lib.filter.cardDiscardable(card, player, 'cike_huti');
                    }).randomGet());
                },
            },
            cike_wenhui: {
                mod: {
                    cardUsable(card, player) {
                        if (!card.cards || !(game.online ? player == _status.currentPhase : player.isPhaseUsing())) return;
                        for (var i of card.cards) {
                            if (i.hasGaintag('cike_wenhui')) return Infinity;
                        }
                    },
                },
                trigger: { global: 'loseAfter' },
                forced: true,
                locked: false,
                filter(event, player) {
                    var target = _status.currentPhase;
                    if (!target || player != target || event.type != 'discard' || player == event.player || event.getParent(2).player != player) return false;
                    return event.cards2 && event.cards2.length > 0;
                },
                content() {
                    player.addTempSkill('cike_wenhui_keep');
                    var cards = [], cardx = trigger.cards2;
                    for (var i = 0; i < cardx.length; i++) {
                        var card = get.cardPile2(function (card) {
                            return !cards.includes(card) && get.type2(card, false) == get.type2(cardx[i], false);
                        });
                        if (card) cards.push(card);
                    }
                    player.gain(cards, 'gain2').gaintag.add('cike_wenhui');
                    player.draw(trigger.cards2.length - cards.length).gaintag = ['cike_wenhui'];
                },
                subSkill: {
                    keep: {
                        charlotte: true,
                        onremove(player) {
                            player.removeGaintag('cike_wenhui');
                        },
                        mod: {
                            ignoredHandcard(card, player) {
                                if (card.hasGaintag('cike_wenhui')) return true;
                            },
                            cardDiscardable(card, player, name) {
                                if (name == 'phaseDiscard' && card.hasGaintag('cike_wenhui')) return false;
                            },
                        },
                    },
                },
            },
            cike_qintao: {
                shaRelated: true,
                trigger: { player: 'useCardAfter' },
                filter(event, player) {
                    return event.card.name == 'sha' && !player.getHistory('sourceDamage', function (evt) {
                        return evt.card == event.card;
                    }).length && event.targets.length == 1;
                },
                check(event, player) {
                    return player.hp >= 2;
                },
                logTarget: 'targets',
                content() {
                    'step 0'
                    player.loseHp();
                    if (!trigger.targets[0].countCards('he')) result.index = 0;
                    else trigger.targets[0].chooseControl().set('choiceList', ['失去1点体力', '令' + get.translation(player) + '弃置你两张牌']).set('ai', function () {
                        if (trigger.targets[0].hp > 2 && trigger.targets[0].countCards('he') < 2) return 0;
                        return 1;
                    });
                    'step 1'
                    if (result.index == 0) trigger.targets[0].loseHp();
                    else player.discardPlayerCard(trigger.targets[0], 'he', 2, true);
                },
            },
            cike_xianggong: {
                trigger: { player: 'damageEnd' },
                filter(event, player) {
                    return event.source && event.source.countCards('he');
                },
                forced: true,
                logTarget: 'source',
                content() {
                    'step 0'
                    var num = Math.min(player.getDamagedHp(), trigger.source.countCards('he'));
                    trigger.source.chooseToDiscard(num, 'he', true);
                    'step 1'
                    trigger.source.draw();
                },
            },
            //By 活动群群主--lonely patients
            cike_zhibi: {
                audio: 'ext:活动武将/audio/skill:true',
                skillAnimation: true,
                animationColor: 'wood',
                limited: true,
                mark: true,
                init(player) {
                    player.storage.cike_zhibi = false;
                },
                enable: 'phaseUse',
                filter(event, player) {
                    return !player.storage.cike_zhibi;
                },
                intro: {
                    content: 'limited'
                },
                filterTarget(card, player, target) {
                    if (get.mode() == 'guozhan') return target.isEnemyOf(player);
                    return get.attitude(player, target) < 0;
                },
                content() {
                    player.awakenSkill('cike_zhibi');
                    player.storage.cike_zhibi = true;
                    target.addTempSkill('cike_zhibi_block');
                },
                subSkill: {
                    block: {
                        init(player, skill) {
                            player.addSkillBlocker(skill);
                        },
                        onremove(player, skill) {
                            player.removeSkillBlocker(skill);
                        },
                        charlotte: true,
                        locked: true,
                        skillBlocker(skill, player) {
                            return skill != 'cike_zhibi_block' && !lib.skill[skill].charlotte;
                        },
                        mark: true,
                        marktext: '锁',
                        intro: {
                            name: '知彼',
                            content: '本回合所有技能失效',
                        },
                    }
                },
            },
            cike_hujia: {
                audio: 'hujia',
                trigger: { player: ['chooseToRespondBegin', 'chooseToUseBegin'] },
                filter(event, player) {
                    if (event.responded) return false;
                    if (event.cike_hujia) return false;
                    if (!event.filterCard || !event.filterCard({ name: 'shan' }, player, event)) return false;
                    if (event.name == 'chooseToRespond' && !lib.filter.cardRespondable({ name: 'shan' }, player, event)) return false;
                    var hs = _status.currentPhase.getCards('h');
                    if (hs.length <= 0) return false;
                    return true;
                },
                forced: true,
                content() {
                    "step 0"
                    trigger.cike_hujia = true;
                    var hs = _status.currentPhase.getCards('h');
                    if (hs.length > 0) {
                        event.card = hs.randomGet();
                        _status.currentPhase.discard(event.card);
                    }
                    else event.finish();
                    "step 1"
                    if (get.name(event.card) == 'shan') {
                        trigger.untrigger();
                        trigger.set('responded', true);
                        trigger.result = { bool: true, card: { name: 'shan', isCard: true } }
                    }
                },
            },
            cike_songwei: {
                trigger: { global: 'judgeEnd' },
                forced: true,
                audio: 'songwei2',
                filter(event, player) {
                    var hs = event.player.getCards('he');
                    return event.player != player && hs.length > 0;
                },
                content() {
                    var hs = trigger.player.getCards('he');
                    if (hs.length > 0) {
                        var card = hs.randomGet();
                        player.line(trigger.player, 'thunder');
                        player.gain(card, 'gain2');
                    }
                }
            },
            cike_xingshuai: {
                audio: 'xingshuai',
                forced: true,
                trigger: { player: 'dyingAfter' },
                content() {
                    event.list = game.filterPlayer(function (current) {
                        if (get.mode() == 'guozhan') return current.isEnemyOf(player);
                        return get.attitude(player, current) < 0;
                    });
                    if (event.list.length > 0) {
                        var target = event.list.randomGet();
                        target.loseHp();
                    }
                }
            },
            cike_taiwang: {
                forced: true,
                usable: 1,
                trigger: { global: 'damageEnd' },
                filter(event, player) {
                    return event.num > 1;
                },
                content() {
                    player.gainMaxHp();
                },
            },
            cike_jijiang: {
                group: ['cike_jijiang_refresh', 'cike_jijiang_clear', 'cike_jijiang_plus'],
                audio: 'jijiang1',
                forced: true,
                trigger: { player: ['useCard', 'respond'] },
                filter(event, player) {
                    return event.card.name == 'sha';
                },
                init(player) {
                    player.storage.nownum = 0;
                    player.storage.nextnum = 0;
                },
                content() {
                    'step 0'
                    player.draw();
                    'step 1'
                    event.card = result[0];
                    if (get.type(event.card) == 'basic') {
                        player.storage.nextnum++;
                    }
                },
                mark: true,
                intro: {
                    content(storage, player) {
                        var str = '';
                        if (player.storage.nownum != 0) str += '<span class=\"texiaotext\" style=\"color:#00FF00\">本次</span>出牌阶段可额外使用' + player.storage.nownum + '张【杀】。<br>';
                        if (player.storage.nextnum != 0) str += '<span class=\"texiaotext\" style=\"color:#FF8247\">下个</span>出牌阶段可额外使用' + player.storage.nextnum + '张【杀】。';
                        return str;
                    }
                },
                subSkill: {
                    refresh: {
                        trigger: { player: 'phaseUseBefore' },
                        direct: true,
                        content() {
                            player.storage.nownum = player.storage.nextnum;
                            player.storage.nextnum = 0;
                        },
                    },
                    clear: {
                        trigger: { player: 'phaseUseAfter' },
                        direct: true,
                        content() {
                            player.storage.nownum = 0;
                        }
                    },
                    plus: {
                        mod: {
                            cardUsable(card, player, num) {
                                if (card.name == 'sha') return num + player.storage.nownum;
                            }
                        },
                    }
                },
            },
            cike_ruoyu: {
                audio: 'ruoyu',
                forced: true,
                trigger: { player: 'phaseBefore' },
                filter(event, player) {
                    if (game.hasPlayer(function (current) {
                        return current.hp < player.hp;
                    })) return false;
                    if (player.hp == player.maxHp) return false;
                    return true;
                },
                content() {
                    player.recover();
                }
            },
            cike_qinwang: {
                audio: 'qinwang1',
                forced: true,
                trigger: { global: 'useCard' },
                filter(event, player) {
                    return event.card.name == 'juedou';
                },
                content() {
                    var card = get.cardPile2(function (card) {
                        return get.type(card, false) == 'basic';
                    });
                    if (card)
                        player.gain(card, 'gain2');
                },
            },
            cike_suizhan: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseDrawBegin2' },
                filter(event, player) {
                    return !event.numFixed;
                },
                forced: true,
                content() {
                    trigger.num += player.getExpansions('xiansi').length;
                },
            },
            cike_zhuning: {
                audio: 'zhuning',
                trigger: { source: 'damageBegin1' },
                frequent: true,
                filter(event, player) {
                    return event.card && (event.card.name == 'sha') && event.notLink() && !player.getHistory('sourceDamage').length;
                },
                content() {
                    trigger.num++;
                },
            },
            cike_fengxiang: {
                audio: 'fengxiang',
                trigger: { player: 'gainEnd' },
                filter(event, player) {
                    return event.source && event.source != player && event.cards?.length;
                },
                prompt(event, player) {
                    return '封乡：是否将本次获得的' + get.translation(event.cards) + '当作【杀】使用？';
                },
                check(event, player) {
                    var num = event.cards.length;
                    if (num == 1) return true;
                    else if (num == 2) return !player.hasHistory('useCard', function (evt) {
                        return evt.card.name == 'sha';
                    });
                    else return false;
                },
                content() {
                    'step 0'
                    player.chooseTarget('请选择使用【杀】的目标', function (card, player, target) {
                        return player.canUse('sha', target, false);
                    }).set('ai', function (target) {
                        return get.effect(target, { name: 'sha' }, player, player);
                    });
                    'step 1'
                    if (result.bool) {
                        var target = result.targets[0];
                        var cards = trigger.cards;
                        var next = player.useCard({ name: 'sha' }, cards, target, false);
                    }
                    else event.finish();
                }
            },
            cike_jitong: {
                audio: 'ext:活动武将/audio/skill:true',
                group: ['cike_jitong_judge'],
                direct: true,
                trigger: { source: 'damageSource' },
                filter(event, player) {
                    return event.card && event.card.name == 'sha' && event.getParent().name == 'sha' && _status.currentPhase == player && !player.hasSkill('cike_jitong_ban');
                },
                content() {
                    player.addTempSkill('cike_jitong_ban');
                },
                subSkill: {
                    ban: {
                        charlotte: true,
                    },
                    judge: {
                        forced: true,
                        trigger: { player: 'phaseEnd' },
                        filter(event, player) {
                            return !player.hasSkill('cike_jitong_ban') && !player.hasSkill('cike_jitong_pro');
                        },
                        content() {
                            player.addTempSkill('cike_jitong_pro', { player: 'damageBegin4' });
                        },
                    },
                    pro: {
                        forced: true,
                        mark: true,
                        marktext: '护',
                        intro: {
                            content: '防止你受到的下次伤害',
                        },
                        trigger: { player: 'damageBegin2' },
                        content() {
                            trigger.cancel();
                            player.removeSkill('cike_jitong_pro');
                        }
                    },
                }
            },
            cike_jiuyuan: {
                audio: 'rejiuyuan',
                forced: true,
                usable: 1,
                trigger: { global: 'useCardAfter' },
                filter(event, player) {
                    return event.player.isPhaseUsing() && event.card.name == 'tao' && event.player != player && player.hp < player.maxHp;
                },
                content() {
                    player.recover();
                },
            },
            cike_zhiba: {
                forced: true,
                audio: 'zhiba2',
                trigger: { global: ['chooseToCompareAfter', 'compareMultipleAfter'] },
                filter(event, player) {
                    return !get.owner(event.card1) || !get.owner(event.card2);
                },
                content() {
                    var cardsx = [];
                    if (!get.owner(trigger.card1)) cardsx.push(trigger.card1);
                    if (!get.owner(trigger.card2)) cardsx.push(trigger.card2);
                    if (cardsx.length > 0) player.gain(cardsx, 'gain2');
                }
            },
            cike_lijun: {
                audio: 'nzry_lijun1',
                trigger: { global: 'loseAfter' },
                filter(event, player) {
                    return event.player != player && _status.currentPhase == player && event.type == 'discard';
                },
                forced: true,
                content() {
                    player.gain(trigger.cards, 'gain2');
                },
            },
            cike_zhaofu: {
                audio: 'zhaofu',
                mark: true,
                intro: {
                    onunmark: true,
                    content: '己方角色计算与其他角色距离为1。'
                },
                locked: true,
                global: 'cike_zhaofu_eff',
                subSkill: {
                    eff: {
                        mod: {
                            globalFrom(from, to, distance) {
                                if (game.hasPlayer(function (current) {
                                    return current.hasSkill('cike_zhaofu') && (get.mode() == 'guozhan' ? current.isFriendOf(from) : get.attitude(from, current) > 0);
                                })) {
                                    return -Infinity;
                                }
                            }
                        },
                    },
                },
            },
            cike_canshi: {
                audio: 'canshi',
                trigger: { player: 'phaseDrawBegin2' },
                filter(event, player) {
                    return !event.numFixed && game.hasPlayer(function (current) {
                        if (player.hasSkill('cike_guiming') && current != player) return true;
                        return current.isDamaged();
                    });
                },
                prompt(event, player) {
                    var num = game.countPlayer(function (current) {
                        if (player.hasSkill('cike_guiming') && current != player) return true;
                        return current.isDamaged();
                    });
                    return '残蚀：是否多摸' + get.cnNumber(num) + '张牌？';
                },
                content() {
                    var num = game.countPlayer(function (current) {
                        if (player.hasSkill('cike_guiming') && current != player) return true;
                        return current.isDamaged();
                    });
                    trigger.num += num;
                    player.addTempSkill('recanshi2');
                },
            },
            cike_guiming: {
                unique: true,
                audio: 'guiming',
                trigger: { player: 'cike_canshiBegin' },
                forced: true,
                content() { },
            },
            cike_yinci: {
                trigger: { global: 'useCardToPlayered' },
                filter(event, player) {
                    return event.target && event.card && (get.type(event.card) == 'trick' || get.type(event.card) == 'basic' && !['shan', 'tao', 'jiu', 'du'].includes(event.card.name))
                        && event.target != event.player && get.distance(event.target, event.player) <= 1
                        && (get.mode() == 'guozhan' ? event.player.isFriendOf(player) : get.attitude(player, event.player) > 0);
                },
                forced: true,
                content() {
                    trigger.directHit.add(trigger.target);
                },
            },
        },
        translate: {
            cike_mitan: '<span style="font-family: yuanli">超时空密探特殊规则：</span>' +
                '<br><span style="font-family: yuanli">游戏开始时须选择属于自己的三</span>' +
                '<br><span style="font-family: yuanli">个专属技能中的一个保留</span>' +
                '<br>' +
                '超时空密探',
            cike_wei: '魏国',
            cike_shu: '蜀国',
            cike_wu: '吴国',
            cike_extra: '特殊',
            cike_wuliuqi: '伍六七',
            cike_meihuashisan: '梅花十三',
            cike_chooseskill: '技能选择',
            cike_chooseskill_info: '<li>游戏开始时，你选择保留一个对应特殊人物的专属技能，并失去其它技能。<br><li>伍六七：“易容”、“情锁”、“削发”。<br><li>梅花十三：“辫刀”、“映月”、“护体”。',
            cike_shenghu: '圣护',
            cike_lingshou_info: '锁定技，己方其他角色受到伤害时，令该伤害-1，你失去1点体力，伤害来源弃置两张牌。（玩家可以在“活动武将”扩展界面禁用此技能）',
            //cike_shenghu_append:'<span style="font-family: yuanli">技能选择<br><li>游戏开始时，你选择保留一个伍六七的专属技能，并失去其它技能。<br><li>伍六七：“易容”、“情锁”、“削发”。</span>',
            cike_feijian: '飞剪',
            cike_feijian_info: '锁定技，出牌阶段结束时，若你的装备区中有武器牌且本回合对其他角色造成过伤害，则弃置该武器牌并对这些角色依次造成2~4点随机伤害。',
            cike_yirong: '易容',
            cike_yirong_info: '锁定技，你每回合首次造成伤害时，将伤害来源改为场上一名随机其他角色。',
            cike_qingsuo: '情锁',
            cike_qingsuo_info: '锁定技，其他角色对你造成伤害后，你与其将武将牌翻面。',
            cike_xuefa: '削发',
            cike_xuefa_info: '锁定技，当你对其他角色造成伤害后，你随机弃置其一至三张牌。',
            cike_lingshou: '灵守',
            cike_shenghu_info: '锁定技，己方其他角色受到伤害时，令该伤害-1，你失去1点体力，然后你与该己方角色各摸一张牌。（玩家可以在“活动武将”扩展界面禁用此技能）',
            //cike_lingshou_append:'<span style="font-family: yuanli">技能选择<br><li>游戏开始时，你选择保留一个梅花十三的专属技能，并失去其它技能。<br><li>梅花十三：“辫刀”、“映月”、“护体”。</span>',
            cike_meibiao: '梅镖',
            cike_meibiao_info: '锁定技，你使用梅花牌无法被其他角色响应，且此牌造成的伤害+2。',
            cike_biandao: '辫刀',
            cike_biandao_info: '锁定技，你的出牌阶段结束时，若本回合未对其他角色造成过伤害，你对所有敌方角色依次造成1~2点随机伤害。',
            cike_yingyue: '映月',
            cike_yingyue_info: '你在出牌阶段使用首张指定单一目标的【杀】或普通锦囊牌时，可为此牌额外增加一个目标。',
            cike_huti: '护体',
            cike_huti_info: '锁定技，其他角色对你造成伤害时，若此伤害为该角色本回合首次造成的伤害，则你防止此伤害，然后随机弃置一张牌。',
            _cike_chooseskill_wuliuqi: '技能选择',
            _cike_chooseskill_meihuashishan: '技能选择',
            _cike_gzchooseskill_wuliuqi: '技能选择',
            _cike_gzchooseskill_meihuashishan: '技能选择',
            cike_caomao: '密探·曹髦',
            cike_wenhui: '文绘',
            cike_wenhui_info: '当你于回合内弃置其他角色的牌后，你随机从牌堆中获得一张与此牌类别相同的牌（没有则改为摸一张牌）。你以此法获得的牌本回合不计入使用次数和手牌上限。',
            cike_qintao: '亲讨',
            cike_qintao_info: '若你使用的指定唯一目标的【杀】未造成伤害，结算完成后，你可以失去1点体力并令其选择一项：①失去1点体力；②令你弃置其两张牌。',
            cike_xianggong: '乡公',
            cike_xianggong_info: '锁定技，当你受到伤害后，伤害来源须弃置X张牌，然后摸一张牌。（X为你已损失的体力值）',
            cike_mitan: '密探',
            cike_zhibi: '知彼',
            cike_zhibi_info: '限定技，出牌阶段，你可以选择一名敌方角色，该角色本回合所有技能失效。',
            cike_caocao: '密探·曹操',
            cike_hujia: '护驾',
            cike_hujia_info: '锁定技，当你需要使用或打出一张【闪】时，当前回合角色随机弃置一张手牌，若此牌为【闪】，则视为你使用或打出了一张【闪】。',
            cike_caopi: '密探·曹丕',
            cike_songwei: '颂威',
            cike_songwei_info: '锁定技，当其他角色的判定牌生效后，你随机获得其一张牌。',
            cike_caorui: '密探·曹叡',
            cike_xingshuai: '兴衰',
            cike_xingshuai_info: '锁定技，当你脱离濒死状态时，你令随机一名敌方角色失去1点体力。',
            cike_caosong: '密探·曹嵩',
            cike_taiwang: '太王',
            cike_taiwang_info: '锁定技，每回合限一次，当一名角色受到大于1点的伤害后，你加一点体力上限。',
            cike_liubei: '密探·刘备',
            cike_jijiang: '激将',
            cike_jijiang_info: '锁定技，每当你使用或打出一张【杀】时，你摸一张牌，若此牌为基本牌，你下个出牌阶段使用【杀】的次数上限+1。',
            cike_liushan: '密探·刘禅',
            cike_ruoyu: '若愚',
            cike_ruoyu_info: '锁定技，准备阶段，若你的体力值为全场最少，你回复1点体力。',
            cike_liuchen: '密探·刘谌',
            cike_qinwang: '勤王',
            cike_qinwang_info: '锁定技，当一名角色使用【决斗】时，你从牌堆随机获得一张基本牌。',
            cike_liufeng: '密探·刘封',
            cike_suizhan: '随战',
            cike_suizhan_info: '锁定技，摸牌阶段，你额外摸X张牌（X为你武将牌上“逆”的数量）。',
            cike_liuyong: '密探·刘永',
            cike_zhuning: '诛佞',
            cike_zhuning_info: '当你使用【杀】造成伤害时，若这是你该回合造成的首次伤害，则此伤害+1。',
            cike_fengxiang: '封乡',
            cike_fengxiang_info: '每当你获得其他角色的牌后，你可以立即将这些牌当作无距离限制且不计次数的【杀】使用。',
            cike_jitong: '继统',
            cike_jitong_info: '锁定技，结束阶段，若你本回合内未使用【杀】造成过伤害，则防止你受到的下一次伤害。',
            cike_sunquan: '密探·孙权',
            cike_jiuyuan: '救援',
            cike_jiuyuan_info: '锁定技，每回合限一次，当其他角色于其出牌阶段使用【桃】后，若你已受伤，则你回复1点体力。',
            cike_sunce: '密探·孙策',
            cike_zhiba: '制霸',
            cike_zhiba_info: '锁定技，任意角色拼点结束后，你获得此次拼点的牌。',
            cike_sunliang: '密探·孙亮',
            cike_lijun: '立军',
            cike_lijun_info: '锁定技，你的回合内，其他角色因弃置而失去牌后，你获得之。',
            cike_sunxiu: '密探·孙休',
            cike_zhaofu: '诏缚',
            cike_zhaofu_info: '锁定技，己方角色计算与其他角色距离为1',
            cike_sunhao: '密探·孙皓',
            cike_canshi: '残蚀',
            cike_canshi_info: '摸牌阶段开始时，你可以多摸X张牌（X为已受伤的角色数），若如此做，当你于此回合内使用【杀】或普通锦囊牌时，你弃置一张牌。',
            cike_guiming: '归命',
            cike_guiming_info: '锁定技，当你发动【残蚀】计算受伤角色数时，所有其他角色均视为已受伤。',
            cike_lingju: '密探·灵雎',
            cike_yinci: '隐刺',
            cike_yinci_info: '锁定技，当一名友方角色使用牌指定与其距离为1的角色为目标时，目标角色不能响应此牌。',
            cike_xugong: '密探·许贡',
        },
    };
    for (var i in HD_chaoshikong.character) {
        if (!HD_chaoshikong.character[i][4]) HD_chaoshikong.character[i][4] = [];
        if (HD_chaoshikong.translate[i] && HD_chaoshikong.translate[i].indexOf('密探·') == 0) HD_chaoshikong.translate[i + '_ab'] = HD_chaoshikong.translate[i].slice(HD_chaoshikong.translate[i].indexOf('密探·') + 3, HD_chaoshikong.translate[i].length);
        // taffy: 注释HD_chaoshikong.js原版代码
        // HD_chaoshikong.character[i][4].push(((lib.device || lib.node) ? 'ext:' : 'db:extension-') + '活动武将/image/character/' + i + '.jpg');
        /* taffy分界线 */
        // taffy: 修复Web端武将图片不可见问题
        HD_chaoshikong.character[i][4].push('ext:活动武将/image/character/' + i + '.jpg');
        /* taffy分界线 */
    }
    lib.config.all.characters.push('HD_chaoshikong');
    lib.config.all.sgscharacters.push('HD_chaoshikong');
    if (!lib.config.characters.includes('HD_chaoshikong')) lib.config.characters.remove('HD_chaoshikong');
    lib.translate['HD_chaoshikong_character_config'] = '<span style="font-family: xingkai">超时空密探</span>';
    return HD_chaoshikong;
};

export default packs;