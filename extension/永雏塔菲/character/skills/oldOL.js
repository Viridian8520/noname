import { lib, game, ui, get, ai, _status } from "../../extension/noname.js";

/** @type { importCharacterConfig['skill'] } */
const oldOL = {
	//旧OL芮姬
	taffyold_qiaoli: {
		audio: "qiaoli",
		enable: "chooseToUse",
		viewAs: {
			name: "juedou",
		},
		viewAsFilter: function (player) {
			return player.hasCard(function (card) {
				return get.type(card) == "equip";
			}, "ehs");
		},
		filterCard: {
			type: "equip",
		},
		check: function (card) {
			if (get.position(card) == "e") return 7.5 - get.value(card);
			return 12 - _status.event.player.getUseValue(card);
		},
		position: "hes",
		group: ["taffyold_qiaoli_effect", "taffyold_qiaoli_gain", "taffyold_qiaoli_norespond"],
		ai: {
			directHit_ai: true,
			skillTagFilter: function (player, tag, arg) {
				return arg && arg.card && arg.card.name == "juedou" && _status.event.skill == "taffyold_qiaoli";
			},
		},
		subSkill: {
			norespond: {
				trigger: {
					player: "useCard1",
				},
				forced: true,
				charlotte: true,
				popup: false,
				filter: function (event, player) {
					if (event.skill != "taffyold_qiaoli") return false;
					var card = event.cards[0];
					return get.subtype(card) != "equip1";
				},
				content: function () {
					trigger.directHit.addArray(
						game.filterPlayer(function (current) {
							return current != player;
						})
					);
				},
			},
			effect: {
				trigger: {
					player: "useCardAfter",
				},
				forced: true,
				charlotte: true,
				popup: false,
				filter: function (event, player) {
					if (event.skill != "taffyold_qiaoli") return false;
					var card = event.cards[0];
					return get.subtype(card) == "equip1";
				},
				content: function () {
					"step 0";
					var card = trigger.cards[0];
					var num = 1;
					var info = get.info(card, false);
					if (info && info.distance && typeof info.distance.attackFrom == "number") num -= info.distance.attackFrom;
					player.draw(num);
					("step 1");
					var cards = result;
					if (get.itemtype(cards) != "cards") {
						event.finish(5);
						return;
					}
					var hs = player.getCards("h");
					cards = cards.filter(function (card) {
						return hs.includes(card);
					});
					if (!cards.length) {
						event.finish(5);
						return;
					}
					event.cards = cards;
					if (_status.connectMode)
						game.broadcastAll(function () {
							_status.noclearcountdown = true;
						});
					event.given_map = {};
					("step 2");
					player.chooseCardTarget({
						filterCard: function (card) {
							return _status.event.cards.includes(card) && !card.hasGaintag("taffyold_qiaoli_given");
						},
						cards: cards,
						filterTarget: lib.filter.notMe,
						selectCard: [1, cards.length],
						prompt: "是否将获得的牌分配给其他角色？",
						ai1: function (card) {
							return -1;
						},
						ai2: function (target) {
							return -1;
						},
					});
					("step 3");
					if (result.bool) {
						var res = result.cards,
							target = result.targets[0].playerid;
						player.addGaintag(res, "taffyold_qiaoli_given");
						cards.removeArray(res);
						if (!event.given_map[target]) event.given_map[target] = [];
						event.given_map[target].addArray(res);
						if (cards.length) event.goto(2);
					}
					("step 4");
					if (_status.connectMode) {
						game.broadcastAll(function () {
							delete _status.noclearcountdown;
							game.stopCountChoose();
						});
					}
					var map = [],
						cards = [];
					for (var i in event.given_map) {
						var source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
						player.line(source, "green");
						map.push([source, event.given_map[i]]);
						cards.addArray(event.given_map[i]);
					}
					if (map.length)
						game.loseAsync({
							gain_list: map,
							player: player,
							cards: cards,
							giver: player,
							animate: "giveAuto",
						}).setContent("gaincardMultiple");
				},
			},
			gain: {
				audio: "qiaoli",
				trigger: {
					player: "phaseJieshuBegin",
				},
				forced: true,
				filter: function (event, player) {
					return player.hasHistory("useCard", function (evt) {
						return evt.skill == "taffyold_qiaoli";
					});
				},
				content: function () {
					var card = get.cardPile2(function (card) {
						return get.type(card) == "equip";
					});
					if (card) player.gain(card, "gain2");
				},
			},
		},
	},
	taffyold_qingliang: {
		audio: "qingliang",
		trigger: {
			target: "useCardToTarget",
		},
		usable: 1,
		filter: function (event, player) {
			return player != event.player && player.countCards("h") > 0;
		},
		logTarget: "player",
		check: function (event, player) {
			if (get.attitude(player, event.player) > 0 || event.player.hasSkillTag("nogain")) return true;
			var eff = get.effect(player, event.card, event.player, player);
			if (eff >= 0) return false;
			var suits = [],
				banned = [],
				hs = player.getCards("h");
			for (var i of hs) {
				var suit = get.suit(i, player);
				suits.add(suit);
				if (!lib.filter.cardDiscardable(i, player, "taffyold_qingliang")) banned.add(suit);
			}
			suits.removeArray(banned);
			for (var i of suits) {
				var cards = player.getCards("h", function (card) {
					return get.suit(card, player) == i;
				});
				if (-eff / 2 - get.value(cards, player) > 0) return true;
			}
			return false;
		},
		content: function () {
			"step 0";
			player.showHandcards(get.translation(player) + "发动了【清靓】");
			("step 1");
			var suits = [],
				banned = [],
				hs = player.getCards("h");
			for (var i of hs) {
				var suit = get.suit(i, player);
				suits.add(suit);
				if (!lib.filter.cardDiscardable(i, player, "taffyold_qingliang")) banned.add(suit);
			}
			if (suits.length > banned.length) {
				player
					.chooseControl()
					.set("choiceList", ["和" + get.translation(trigger.player) + "各摸一张牌", "弃置一种花色的所有手牌，令" + get.translation(trigger.card) + "对自己无效"])
					.set("ai", function () {
						var player = _status.event.player,
							event = _status.event.getTrigger();
						if (get.attitude(player, event.player) > 0 || event.player.hasSkillTag("nogain")) return 0;
						return 1;
					});
				event.suits = suits;
				suits.removeArray(banned);
				suits.sort();
			} else {
				event._result = {
					index: 0,
				};
			}
			("step 2");
			if (result.index == 0) {
				var list = [player, trigger.player].sortBySeat();
				list[0].draw("nodelay");
				list[1].draw();
				event.finish();
			} else {
				if (event.suits.length == 1)
					event._result = {
						control: event.suits[0],
					};
				else
					player
						.chooseControl(event.suits)
						.set("prompt", "选择弃置一种花色的所有牌")
						.set("ai", function () {
							var player = _status.event.player,
								list = _status.event.controls.slice(0);
							var gett = function (suit) {
								var cards = player.getCards("h", function (card) {
									return get.suit(card, player) == suit;
								});
								return get.value(cards);
							};
							return list.sort(function (b, a) {
								return gett(b) - gett(a);
							})[0];
						});
			}
			("step 3");
			var cards = player.getCards("h", function (card) {
				return get.suit(card) == result.control;
			});
			if (cards.length) player.discard(cards);
			trigger.targets.remove(player);
			trigger.getParent().triggeredTargets2.remove(player);
			trigger.untrigger();
		},
	},
	//旧OL滕芳兰
	taffyold_luochong: {
		audio: "luochong",
		trigger: {
			player: ["phaseZhunbeiBegin", "damageEnd"],
		},
		direct: true,
		filter: function (event, player) {
			var storage1 = player.getStorage("taffyold_luochong_round"),
				storage2 = player.getStorage("taffyold_luochong");
			for (var i = 0; i < 4; i++) {
				if (
					!storage1.includes(i) &&
					!storage2.includes(i) &&
					(i != 2 ||
						game.hasPlayer(function (current) {
							return (
								current != player &&
								current.hasCard(function (card) {
									return lib.filter.canBeDiscarded(card, player, current);
								}, "he")
							);
						}))
				)
					return true;
			}
			return false;
		},
		onremove: true,
		content: function () {
			"step 0";
			var list = [];
			var choiceList = ["令一名角色回复1点体力。", "令一名其他角色失去1点体力。", "弃置一名其他角色的至多两张牌。", "令一名角色摸两张牌。"];
			var storage1 = player.getStorage("taffyold_luochong_round"),
				storage2 = player.getStorage("taffyold_luochong");
			for (var i = 0; i < 4; i++) {
				if (storage2.includes(i)) {
					choiceList[i] = '<span style="text-decoration: line-through; opacity:0.5; ">' + choiceList[i] + "</span>";
				} else if (
					storage1.includes(i) ||
					(i == 2 &&
						!game.hasPlayer(function (current) {
							return (
								current != player &&
								current.hasCard(function (card) {
									return lib.filter.canBeDiscarded(card, player, current);
								}, "he")
							);
						}))
				) {
					choiceList[i] = '<span style="opacity:0.5;">' + choiceList[i] + "</span>";
				} else list.push("选项" + get.cnNumber(i + 1, true));
			}
			list.push("cancel2");
			player
				.chooseControl(list)
				.set("prompt", get.prompt("taffyold_luochong"))
				.set("choiceList", choiceList)
				.set("ai", function () {
					var player = _status.event.player;
					var list = _status.event.controls.slice(0);
					var gett = function (choice) {
						if (choice == "cancel2") return 0.1;
						var max = 0,
							func = {
								选项一: function (current) {
									if (current.isDamaged()) max = Math.max(max, get.recoverEffect(current, player, player));
								},
								选项二: function (target) {
									max = Math.max(
										max,
										get.effect(
											target,
											{
												name: "losehp",
											},
											player,
											player
										)
									);
								},
								选项三: function (target) {
									var num = target.countDiscardableCards(player, "he");
									if (num > 0)
										max = Math.max(
											max,
											Math.sqrt(Math.min(2, num)) *
												get.effect(
													target,
													{
														name: "guohe_copy2",
													},
													player,
													player
												)
										);
								},
								选项四: function (target) {
									max = Math.max(
										max,
										get.effect(
											target,
											{
												name: "wuzhong",
											},
											player,
											player
										)
									);
								},
							}[choice];
						game.countPlayer(func);
						return max;
					};
					return list.sort(function (a, b) {
						return gett(b) - gett(a);
					})[0];
				});
			("step 1");
			if (result.control != "cancel2") {
				var index = ["选项一", "选项二", "选项三", "选项四"].indexOf(result.control);
				event.index = index;
				var list = [
					[
						"选择一名角色，令其回复1点体力",
						function (target) {
							var player = _status.event.player;
							return get.recoverEffect(target, player, player);
						},
					],
					[
						"选择一名其他角色，令其失去1点体力",
						function (target) {
							return get.effect(
								target,
								{
									name: "losehp",
								},
								player,
								player
							);
						},
						lib.filter.notMe,
					],
					[
						"选择一名其他角色，弃置其至多两张牌",
						function (target) {
							var player = _status.event.player;
							return (
								get.effect(
									target,
									{
										name: "guohe_copy2",
									},
									player,
									player
								) * Math.sqrt(Math.min(2, target.countCards("he")))
							);
						},
						function (card, player, target) {
							return (
								target != player &&
								target.hasCard(function (card) {
									return lib.filter.canBeDiscarded(card, player, target);
								}, "he")
							);
						},
					],
					[
						"选择一名角色，令其摸两张牌",
						function (target) {
							var player = _status.event.player;
							return get.effect(
								target,
								{
									name: "wuzhong",
								},
								player,
								player
							);
						},
					],
				][index];
				var next = player.chooseTarget(list[0], true);
				next.set("ai", list[1]);
				if (list.length > 2) next.set("filterTarget", list[2]);
			} else event.finish();
			("step 2");
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("taffyold_luochong", target);
				if (player != target) player.addExpose(0.2);
				player.addTempSkill("taffyold_luochong_round", "roundStart");
				player.markAuto("taffyold_luochong_round", [event.index]);
				switch (event.index) {
					case 0:
						target.recover();
						break;
					case 1:
						target.loseHp();
						break;
					case 2:
						player.discardPlayerCard(target, true, "he", [1, 2]);
						break;
					case 3:
						target.draw(2);
						break;
				}
			}
		},
		subSkill: {
			round: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	taffyold_aichen: {
		audio: "aichen",
		trigger: {
			player: "dying",
		},
		forced: true,
		filter: function (event, player) {
			return player.hasSkill("taffyold_luochong", null, null, false) && player.getStorage("taffyold_luochong").length < 3;
		},
		content: function () {
			"step 0";
			var num = 1 - player.hp;
			if (num > 0) player.recover(num);
			("step 1");
			var list = [];
			var choiceList = ["令一名角色回复1点体力。", "令一名其他角色失去1点体力。", "弃置一名其他角色的至多两张牌。", "令一名角色摸两张牌。"];
			var storage2 = player.getStorage("taffyold_luochong");
			for (var i = 0; i < 4; i++) {
				if (storage2.includes(i)) {
					choiceList[i] = '<span style="text-decoration: line-through; opacity:0.5; ">' + choiceList[i] + "</span>";
				} else list.push("选项" + get.cnNumber(i + 1, true));
			}
			player
				.chooseControl(list)
				.set("prompt", "哀尘：选择移去一个〖落宠〗的选项")
				.set("choiceList", choiceList)
				.set("ai", function () {
					var controls = _status.event.controls.slice(0);
					var list = ["选项三", "选项四", "选项二", "选项一"];
					for (var i of list) {
						if (controls.includes(i)) return i;
					}
					return 0;
				});
			("step 2");
			var index = ["选项一", "选项二", "选项三", "选项四"].indexOf(result.control);
			player.markAuto("taffyold_luochong", [index]);
			game.log(player, "移去了", "#g【落宠】", "的", "#y" + ["令一名角色回复1点体力", "令一名其他角色失去1点体力", "弃置一名其他角色的至多两张牌", "令一名角色摸两张牌"][index], "的选项");
		},
	},
	//旧OL费祎
	taffyold_yanru: {
		audio: "yanru",
		enable: "phaseUse",
		filter: function (event, player) {
			if (!player.countCards("h")) return false;
			var num = player.countCards("h") % 2;
			return !player.hasSkill("taffyold_yanru_" + num);
		},
		filterCard: function (card, player) {
			if (player.countCards("h") && player.countCards("h") % 2 == 0) return lib.filter.cardDiscardable(card, player);
			return false;
		},
		selectCard: function () {
			var player = _status.event.player;
			if (player.countCards("h") && player.countCards("h") % 2 == 0) return [player.countCards("h") / 2, Infinity];
			return -1;
		},
		prompt: function () {
			var player = _status.event.player;
			return [(player.countCards("h") ? "弃置至少一半的手牌，然后" : "") + "摸三张牌", "摸三张牌，然后弃置至少一半的手牌"][player.countCards("h") % 2];
		},
		check: function (card) {
			var player = _status.event.player;
			if (player.hasSkill("taffyold_hezhong")) {
				if (player.countCards("h") - ui.selected.cards.length > 1) return 1 / (get.value(card) || 0.5);
				return 0;
			}
			if (ui.selected.cards.length < player.countCards("h") / 2) return 5 - get.value(card);
			return 0;
		},
		complexCard: true,
		discard: false,
		lose: false,
		delay: 0,
		content: function () {
			"step 0";
			var bool = player.countCards("h") % 2;
			if (cards) player.discard(cards);
			player.addTempSkill("taffyold_yanru_" + bool, "phaseUseAfter");
			player.draw(3);
			if (!bool) event.finish();
			("step 1");
			player.chooseToDiscard("h", "宴如：弃置至少一半手牌", [Math.floor(player.countCards("h") / 2), Infinity], true).set("ai", card => {
				var player = _status.event.player;
				if (player.hasSkill("taffyold_hezhong") && player.countCards("h") - ui.selected.cards.length > 1) return 1 / (get.value(card) || 0.5);
				if (!player.hasSkill("taffyold_hezhong") && ui.selected.cards.length < Math.floor(player.countCards("h") / 2)) return 1 / (get.value(card) || 0.5);
				return 0;
			});
		},
		subSkill: {
			0: {
				charlotte: true,
			},
			1: {
				charlotte: true,
			},
		},
		ai: {
			order: 3,
			result: {
				player: 1,
			},
		},
	},
	taffyold_hezhong: {
		audio: "hezhong",
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter: function (event, player) {
			if (player.countCards("h") != 1 || typeof get.number(player.getCards("h")[0], player) != "number") return false;
			if (player.hasSkill("taffyold_hezhong_0") && player.hasSkill("taffyold_hezhong_1")) return false;
			if (event.getg) return event.getg(player).length;
			var evt = event.getl(player);
			return evt && evt.player == player && evt.hs && evt.hs.length > 0;
		},
		prompt2: function (event, player) {
			var str = "展示最后一张手牌并摸一张牌";
			if (!player.hasSkill("taffyold_hezhong_0") || !player.hasSkill("taffyold_hezhong_0")) {
				str += "，然后令本回合使用点数";
				if (!player.hasSkill("taffyold_hezhong_0")) str += "大于";
				if (!player.hasSkill("taffyold_hezhong_0") && !player.hasSkill("taffyold_hezhong_0")) str += "或";
				if (!player.hasSkill("taffyold_hezhong_1")) str += "小于";
				str += get.number(player.getCards("h")[0], player);
				str += "的牌额外结算一次";
			}
			return str;
		},
		frequent: true,
		content: function () {
			"step 0";
			player.showHandcards(get.translation(player) + "发动了【技能】");
			event.num = get.number(player.getCards("h")[0], player);
			("step 1");
			player.draw();
			("step 2");
			if (player.hasSkill("taffyold_hezhong_0"))
				event._result = {
					index: 1,
				};
			else if (player.hasSkill("taffyold_hezhong_1"))
				event._result = {
					index: 0,
				};
			else {
				player
					.chooseControl()
					.set("choiceList", ["本回合使用点数大于" + num + "的牌额外结算一次", "本回合使用点数小于" + num + "的牌额外结算一次"])
					.set("ai", () => {
						var player = _status.event.player;
						var num = _status.event.player;
						if (
							player.getCards("h").reduce(function (num, card) {
								return num + (get.number(card, player) || 0);
							}, 0) >
							num * 2
						)
							return 0;
						return 1;
					})
					.set("num", num);
			}
			("step 3");
			var skill = "taffyold_hezhong_" + result.index;
			player.addTempSkill(skill);
			player.markAuto(skill, [num]);
		},
		subSkill: {
			0: {
				charlotte: true,
				onremove: true,
				marktext: "＞",
				intro: {
					markcount: list => {
						var list2 = [1, 11, 12, 13];
						return list.reduce((str, num) => {
							if (list2.includes(num)) return str + ["A", "J", "Q", "K"][list2.indexOf(num)];
							return str + parseFloat(num);
						}, "");
					},
					content: "使用点数小于$的牌额外结算一次",
				},
				audio: "hezhong",
				trigger: {
					player: "useCard",
				},
				filter: function (event, player) {
					// if(get.type(event.card)!='trick') return false;
					var num = get.number(event.card, player);
					return typeof num == "number" && player.getStorage("taffyold_hezhong_0").some(numx => num > numx);
				},
				forced: true,
				content: function () {
					trigger.effectCount++;
					game.log(trigger.card, "额外结算一次");
				},
				ai: {
					effect: {
						player: function (card, player, target) {
							if (card.name == "tiesuo") return "zerotarget";
						},
					},
				},
			},
			1: {
				charlotte: true,
				onremove: true,
				marktext: "<",
				intro: {
					markcount: list => {
						var list2 = [1, 11, 12, 13];
						return list.reduce((str, num) => {
							if (list2.includes(num)) return str + ["A", "J", "Q", "K"][list2.indexOf(num)];
							return str + parseFloat(num);
						}, "");
					},
					content: "使用点数小于$的牌额外结算一次",
				},
				audio: "hezhong",
				trigger: {
					player: "useCard",
				},
				filter: function (event, player) {
					// if(get.type(event.card)!='trick') return false;
					var num = get.number(event.card, player);
					return typeof num == "number" && player.getStorage("taffyold_hezhong_1").some(numx => num < numx);
				},
				forced: true,
				content: function () {
					trigger.effectCount++;
					game.log(trigger.card, "额外结算一次");
				},
				ai: {
					effect: {
						player: function (card, player, target) {
							if (card.name == "tiesuo") return "zerotarget";
						},
					},
				},
			},
		},
	},
	//旧二袁
	taffyold_neifa: {
		audio: "neifa",
		trigger: {
			player: "phaseUseBegin",
		},
		content: function () {
			"step 0";
			player.draw();
			("step 1");
			player.chooseToDiscard(true, "he");
			("step 2");
			if (result.bool && result.cards && result.cards.length) {
				var name = get.type(result.cards[0]) == "basic" ? "taffyold_neifa_basic" : "taffyold_neifa_nobasic";
				player.addTempSkill(name);
				player.addMark(name, 1, false);
			}
		},
	},
	taffyold_neifa_basic: {
		mark: true,
		marktext: "伐",
		onremove: true,
		intro: {
			name: "内伐 - 基本牌",
			content: "本回合内不能使用锦囊牌和装备牌，且使用【杀】选择目标时可以多选择#个目标，且使用【杀】的目标次数上限+X。（X为手牌中不能使用的牌且最多为5）",
		},
		mod: {
			cardEnabled: function (card, player) {
				if (["trick", "equip"].contains(get.type(card, "trick"))) return false;
			},
			cardSavable: function (card, player) {
				if (["trick", "equip"].includes(get.type(card, "trick"))) return false;
			},
			cardUsable: function (card, player, num) {
				if (card.name == "sha") {
					return (
						num +
						player.countMark("taffyold_neifa_basic") *
							Math.min(
								5,
								player.countCards("h", function (cardx) {
									return !lib.filter.cardEnabled(cardx, player);
								})
							)
					);
				}
			},
		},
		trigger: {
			player: "useCard2",
		},
		filter: function (event, player) {
			if (event.card.name != "sha") return false;
			return game.hasPlayer(function (current) {
				return !event.targets.contains(current) && player.canUse(event.card, current);
			});
		},
		direct: true,
		content: function () {
			"step 0";
			player
				.chooseTarget(get.prompt("taffyold_neifa"), "为" + get.translation(trigger.card) + "增加至多" + get.cnNumber(player.countMark("taffyold_neifa_basic")) + "个目标", [1, player.countMark("taffyold_neifa_basic")], function (card, player, target) {
					return !_status.event.sourcex.contains(target) && player.canUse(_status.event.card, target);
				})
				.set("sourcex", trigger.targets)
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.effect(target, _status.event.card, player, player);
				})
				.set("card", trigger.card);
			("step 1");
			if (result.bool) {
				if (!event.isMine() && !_status.connectMode) game.delayx();
				event.targets = result.targets;
			} else {
				event.finish();
			}
			("step 2");
			player.logSkill("taffyold_neifa", event.target);
			trigger.targets.addArray(event.targets);
		},
	},
	taffyold_neifa_nobasic: {
		trigger: {
			player: "useCard2",
		},
		direct: true,
		mark: true,
		marktext: "伐",
		onremove: true,
		mod: {
			cardEnabled: function (card, player) {
				if (get.type(card) == "basic") return false;
			},
			cardSavable: function (card, player) {
				if (get.type(card) == "basic") return false;
			},
		},
		intro: {
			name: "内伐 - 非基本牌",
			content: "本回合内不能使用基本牌，且使用普通锦囊牌选择目标时可以多选择#个目标，且使用装备牌时摸X张牌（X为手牌中不能使用的牌且最多为5）。",
		},
		filter: function (event, player) {
			if (get.type(event.card) != "trick") return false;
			var info = get.info(event.card);
			if (info.allowMultiple == false) return false;
			if (event.targets && !info.multitarget) {
				if (
					game.hasPlayer(function (current) {
						return lib.filter.targetEnabled2(event.card, player, current) && !event.targets.contains(current);
					})
				) {
					return true;
				}
			}
			return false;
		},
		content: function () {
			"step 0";
			var prompt2 = "为" + get.translation(trigger.card) + "额外指定" + get.cnNumber(player.countMark(event.name)) + "名目标";
			player
				.chooseTarget([1, player.countMark(event.name)], get.prompt("taffyold_neifa"), function (card, player, target) {
					var player = _status.event.player;
					if (_status.event.targets.contains(target)) return false;
					return lib.filter.targetEnabled2(_status.event.card, player, target);
				})
				.set("prompt2", prompt2)
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					return get.effect(target, trigger.card, player, player);
				})
				.set("targets", trigger.targets)
				.set("card", trigger.card);
			("step 1");
			if (result.bool) {
				if (!event.isMine()) game.delayx();
				event.targets = result.targets;
			} else {
				event.finish();
			}
			("step 2");
			if (event.targets) {
				player.logSkill("taffyold_neifa", event.targets);
				trigger.targets.addArray(event.targets);
			}
		},
		group: "taffyold_neifa_use",
		ai: {
			reverseOrder: true,
			effect: {
				target: function (card, player, target) {
					if (player == target && get.type(card) == "equip") return [1, 3];
				},
			},
		},
	},
	taffyold_neifa_use: {
		audio: "neifa",
		trigger: {
			player: "useCard",
		},
		forced: true,
		filter: function (event, player) {
			return (
				get.type(event.card) == "equip" &&
				player.countMark("taffyold_neifa_nobasic") *
					Math.min(
						5,
						player.countCards("h", function (cardx) {
							return !lib.filter.cardEnabled(cardx, player);
						})
					) >
					0
			);
		},
		content: function () {
			player.draw(
				player.countMark("taffyold_neifa_nobasic") *
					Math.min(
						5,
						player.countCards("h", function (cardx) {
							return !lib.filter.cardEnabled(cardx, player);
						})
					)
			);
		},
	},
	//旧OL彭羕
	taffyold_olxiaofan: {
		audio: "olxiaofan",
		enable: "chooseToUse",
		hiddenCard: function (player, name) {
			if (name != "wuxie" && lib.inpile.includes(name)) return true;
		},
		filter: function (event, player) {
			if (event.responded || event.type == "wuxie" || event.taffyold_olxiaofan) return false;
			for (var i of lib.inpile) {
				if (
					i != "wuxie" &&
					event.filterCard(
						{
							name: i,
						},
						player,
						event
					)
				)
					return true;
			}
			return false;
		},
		delay: false,
		content: function () {
			"step 0";
			var evt = event.getParent(2);
			evt.set("taffyold_olxiaofan", true);
			var cards = get.bottomCards(1 + player.getStorage("taffyold_olxiaofan").length, true);
			var aozhan = player.hasSkill("aozhan");
			player
				.chooseButton(["器翻：选择要使用的牌", cards])
				.set("filterButton", function (button) {
					return _status.event.cards.includes(button.link);
				})
				.set(
					"cards",
					cards.filter(function (card) {
						if (aozhan && card.name == "tao") {
							return (
								evt.filterCard(
									{
										name: "sha",
										isCard: true,
										cards: [card],
									},
									evt.player,
									evt
								) ||
								evt.filterCard(
									{
										name: "shan",
										isCard: true,
										cards: [card],
									},
									evt.player,
									evt
								)
							);
						}
						return evt.filterCard(card, evt.player, evt);
					})
				)
				.set("ai", function (button) {
					if (get.type(button.link) == "equip") return 0;
					var evt = _status.event.getParent(3),
						player = _status.event.player;
					if (evt.type == "phase" && !player.hasValueTarget(button.link, null, true)) return 0;
					if (evt && evt.ai) {
						var tmp = _status.event;
						_status.event = evt;
						var result = (evt.ai || event.ai1)(button.link, _status.event.player, evt);
						_status.event = tmp;
						return result;
					}
					return 1;
				});
			("step 1");
			var evt = event.getParent(2);
			if (result.bool && result.links && result.links.length) {
				var card = result.links[0];
				var name = card.name,
					aozhan = player.hasSkill("aozhan") && name == "tao";
				if (aozhan) {
					name = evt.filterCard(
						{
							name: "sha",
							isCard: true,
							cards: [card],
						},
						evt.player,
						evt
					)
						? "sha"
						: "shan";
				}
				game.broadcastAll(
					function (result, name) {
						lib.skill.taffyold_olxiaofan_backup.viewAs = {
							name: name,
							cards: [result],
							isCard: true,
						};
					},
					card,
					name
				);
				evt.set("_backupevent", "taffyold_olxiaofan_backup");
				evt.set("openskilldialog", "请选择" + get.translation(card) + "的目标");
				evt.backup("taffyold_olxiaofan_backup");
			}
			evt.goto(0);
		},
		ai: {
			effect: {
				target: function (card, player, target, effect) {
					if (get.tag(card, "respondShan")) return 0.7;
					if (get.tag(card, "respondSha")) return 0.7;
				},
			},
			order: 12,
			respondShan: true,
			respondSha: true,
			result: {
				player: function (player) {
					if (_status.event.dying) return get.attitude(player, _status.event.dying);
					return 1;
				},
			},
		},
		onremove: true,
		intro: {
			content: "已使用过$牌",
		},
		subSkill: {
			discard: {
				trigger: {
					player: "chooseToUseAfter",
				},
				forced: true,
				charlotte: true,
				filter: player => {
					var num = player.getStorage("taffyold_olxiaofan").length,
						pos = "jeh".slice(0, num);
					return num > 0 && player.countCards(pos) > 0;
				},
				content: function () {
					var pos = "jeh"[event.num],
						hs = player.countCards(pos);
					if (hs > 0) player.chooseToDiscard(hs, pos, true);
					event.num++;
					if (event.num < event.maxNum) event.redo();
				},
			},
		},
	},
	taffyold_olxiaofan_backup: {
		sourceSkill: "taffyold_olxiaofan",
		precontent: function () {
			delete event.result.skill;
			var name = event.result.card.name,
				cards = event.result.card.cards.slice(0);
			event.result.cards = cards;
			var rcard = cards[0],
				card;
			if (rcard.name == name) card = get.autoViewAs(rcard);
			else
				card = get.autoViewAs({
					name,
					isCard: true,
				});
			event.result.card = card;
			player.markAuto("taffyold_olxiaofan", [get.type2(card, false)]);
			var id = get.id();
			player
				.when("chooseToUseAfter")
				.filter(evt => evt == event.getParent())
				.then(() => {
					if (!lib.skill.taffyold_olxiaofan_discard.filter(player)) {
						event.finish();
					} else {
						event.maxNum = Math.min(3, player.getStorage("taffyold_olxiaofan").length);
						event.num = 0;
					}
				})
				.then(lib.skill.taffyold_olxiaofan_discard.content)
				.translation("器翻");
		},
		filterCard: function () {
			return false;
		},
		selectCard: -1,
	},
	taffyold_oltuishi: {
		audio: "oltuishi",
		mod: {
			wuxieJudgeEnabled: () => false,
			wuxieEnabled: () => false,
			cardEnabled: card => {
				if (card.name == "wuxie") return false;
			},
			targetInRange: card => {
				if (card.storage && card.storage.taffyold_oltuishi) return true;
			},
			aiValue: (player, card, val) => {
				if (card.name == "wuxie") return 0;
				var num = get.number(card);
				if ([1, 11, 12, 13].includes(num)) return val * 1.1;
			},
			aiUseful: (player, card, val) => {
				if (card.name == "wuxie") return 0;
				var num = get.number(card);
				if ([1, 11, 12, 13].includes(num)) return val * 1.1;
			},
			aiOrder: (player, card, order) => {
				if (get.name(card) == "sha" && player.hasSkill("taffyold_oltuishi_unlimit")) order += 9;
				var num = get.number(card);
				if ([1, 11, 12, 13].includes(num)) order += 3;
				return order;
			},
		},
		trigger: {
			player: "useCardAfter",
		},
		forced: true,
		filter: function (event) {
			const num = get.number(event.card);
			return [1, 11, 12, 13].includes(num);
		},
		content: function () {
			player.draw(2);
			player.addSkill("taffyold_oltuishi_unlimit");
		},
		subSkill: {
			unlimit: {
				charlotte: true,
				mod: {
					cardUsable: () => Infinity,
					targetInRange: () => true,
				},
				trigger: {
					player: "useCard1",
				},
				forced: true,
				popup: false,
				silent: true,
				firstDo: true,
				content: function () {
					player.removeSkill("taffyold_oltuishi_unlimit");
					var card = trigger.card;
					if (!card.storage) card.storage = {};
					card.storage.taffyold_oltuishi = true;
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						player.getStat("card")[card.name]--;
					}
				},
				mark: true,
				intro: {
					content: "使用的下一张牌无距离次数限制",
				},
			},
		},
	},
	//旧族钟会
	taffyold_clanyuzhi: {
		mod: {
			aiOrder(player, card, num) {
				if (card.name == "tao") return num / 114514;
			},
		},
		audio: "clanyuzhi",
		trigger: {
			global: "roundStart",
		},
		direct: true,
		locked: true,
		content() {
			"step 0";
			player.unmarkSkill("taffyold_clanyuzhi");
			var num1 = 0,
				num2 = 0,
				num3 = 0,
				bool = true;
			var history = player.actionHistory;
			for (var i = history.length - 2; i >= 0; i--) {
				for (var evt of history[i].gain) {
					if (evt.getParent().name == "draw" && evt.getParent(2).name == "taffyold_clanyuzhi") {
						if (bool) num1 += evt.cards.length;
						else num2 += evt.cards.length;
					}
				}
				if (bool) num3 += history[i].useCard.length;
				if (history[i].isRound) {
					if (bool) bool = false;
					else break;
				}
			}
			event.num1 = num1;
			if ((num1 > 0 && num2 > 0 && num1 > num2) || num1 > num3) {
				player.logSkill("taffyold_clanyuzhi");
				if (num2 > 0 && num1 > num2) game.log(player, "的野心已开始膨胀", "#y(" + num1 + "张>" + num2 + "张)");
				if (num1 > num3) game.log(player, "的行动未达到野心", "#y(" + num3 + "张<" + num1 + "张)");
				if (player.hasSkill("clanbaozu", null, false, false)) player.chooseBool("迂志：是否失去〖保族〗？", "若选择“否”，则你失去1点体力").set("choice", player.awakenedSkills.includes("taffyold_clanbao"));
				else
					event._result = {
						bool: false,
					};
			} else event.goto(2);
			("step 1");
			if (result.bool) {
				player.removeSkills("clanbaozu");
			} else player.loseHp();
			("step 2");
			if (!player.countCards("h")) event.finish();
			("step 3");
			player
				.chooseCard("迂志：请展示一张手牌", "摸此牌牌名字数的牌。下一轮开始时，若本轮你使用的牌数或上一轮你以此法摸的牌数小于此牌牌名字数，则你失去1点体力。", true, function (card, player) {
					var num = get.cardNameLength(card);
					return typeof num == "number" && num > 0;
				})
				.set("ai", function (card) {
					if (_status.event.dying && _status.event.num > 0 && get.cardNameLength(card) > _status.event.num) return 1 / get.cardNameLength(card); //怂
					return get.cardNameLength(card); //勇
				})
				.set(
					"dying",
					player.hp +
						player.countCards("hs", {
							name: ["tao", "jiu"],
						}) <
						1
				)
				.set("num", event.num1);
			("step 4");
			if (result.bool) {
				player.logSkill("taffyold_clanyuzhi");
				player.showCards(result.cards, get.translation(player) + "发动了【迂志】");
				player.draw(get.cardNameLength(result.cards[0]));
				player.storage.taffyold_clanyuzhi = get.cardNameLength(result.cards[0]);
				player.markSkill("taffyold_clanyuzhi");
			}
		},
		ai: {
			threaten: 3,
			nokeep: true,
		},
		onremove: true,
		intro: {
			content: "本轮野心：#张",
		},
	},
	taffyold_clanxieshu: {
		audio: "clanxieshu",
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		filter(event, player) {
			if (!event.card) return false;
			var num = get.cardNameLength(event.card);
			return typeof num == "number" && num > 0 && player.countCards("he") > 0;
		},
		direct: true,
		content() {
			"step 0";
			var num = get.cardNameLength(trigger.card),
				str = "";
			if (player.getDamagedHp() > 0) str += "并摸" + get.cnNumber(player.getDamagedHp()) + "张牌";
			player
				.chooseToDiscard(get.prompt("taffyold_clanxieshu"), "弃置" + get.cnNumber(num) + "张牌" + str, "he", num)
				.set("ai", function (card) {
					var player = _status.event.player;
					var num = _status.event.num;
					var num2 = player.getDamagedHp();
					if (num < num2) return 8 - get.value(card);
					if (num == num2 || num2 >= 2 + num - num2) return lib.skill.zhiheng.check(card);
					return 0;
				})
				.set("num", num).logSkill = "taffyold_clanxieshu";
			("step 1");
			if (result.bool && player.getDamagedHp() > 0) player.draw(player.getDamagedHp());
		},
		ai: {
			threaten: 3,
		},
	},
	// 旧OL陆郁生
	taffyold_olcangxin: {
		audio: "olcangxin",
		trigger: {
			player: "damageBegin4",
		},
		checkx: function (event, player) {
			var target = event.source;
			return get.damageEffect(player, target, player) <= 0;
		},
		forced: true,
		content: function () {
			"step 0";
			var cards = get.bottomCards(3, true);
			player
				.chooseButton(["###藏心：请选择要弃置的牌###若以此法弃置了红桃牌，则防止此伤害", cards], [1, cards.length], true)
				.set("ai", function (button) {
					if (!_status.event.bool && get.suit(button.link, false) == "heart") return 0;
					if (get.suit(button.link, false) != "heart") return 1;
					if (!ui.selected.buttons.some(but => get.suit(but.link, false) == "heart")) return 1;
					return 0;
				})
				.set("bool", lib.skill.taffyold_olcangxin.checkx(trigger, player));
			("step 1");
			if (result.bool) {
				player.$throw(result.links, 1000);
				game.cardsDiscard(result.links);
				if (result.links.some(card => get.suit(card, false) == "heart")) trigger.cancel();
			} else event.finish();
			("step 2");
			game.delayx();
		},
		group: "taffyold_olcangxin_yingzi",
		subSkill: {
			yingzi: {
				audio: "olcangxin",
				trigger: {
					player: "phaseDrawBegin",
				},
				forced: true,
				content: function () {
					var cards = get.bottomCards(3, true);
					player.showCards(cards, get.translation(player) + "发动了【藏心】");
					var num = cards.filter(card => get.suit(card, false) == "heart").length;
					if (num) player.draw(num);
				},
			},
		},
	},
	// 旧张让
	taffyold_taoluan: {
		hiddenCard: function (player, name) {
			return !player.getStorage("taffyold_taoluan").includes(name) && player.countCards("hes") > 0 && lib.inpile.includes(name);
		},
		audio: "taoluan",
		enable: "chooseToUse",
		filter: function (event, player) {
			return (
				player.hasCard(card =>
					lib.inpile.some(name => {
						if (player.getStorage("taffyold_taoluan").includes(name)) return false;
						if (get.type(name) != "basic" && get.type(name) != "trick") return false;
						if (event.filterCard({ name: name, isCard: true, cards: [card] }, player, event)) return true;
						if (name == "sha") {
							for (var nature of lib.inpile_nature) {
								if (event.filterCard({ name: name, nature: nature, isCard: true, cards: [card] }, player, event)) return true;
							}
						}
						return false;
					}, "hes")
				) > 0
			);
		},
		onremove: true,
		chooseButton: {
			dialog: function (event, player) {
				var list = [];
				for (var name of lib.inpile) {
					if (get.type(name) == "basic" || get.type(name) == "trick") {
						if (player.getStorage("taffyold_taoluan").includes(name)) continue;
						list.push([get.translation(get.type(name)), "", name]);
						if (name == "sha") {
							for (var j of lib.inpile_nature) list.push(["基本", "", "sha", j]);
						}
					}
				}
				return ui.create.dialog("滔乱", [list, "vcard"]);
			},
			// filter: function (button, player) {
			// 	return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
			// },
			check: function (button) {
				var player = _status.event.player;
				var card = { name: button.link[2], nature: button.link[3] };
				if (player.countCards("hes", cardx => cardx.name == card.name)) return 0;
				return _status.event.getParent().type == "phase" ? player.getUseValue(card) : 1;
			},
			backup: function (links, player) {
				return {
					audio: "taffyold_taoluan",
					filterCard: () => false,
					selectCard: -1,
					popname: true,
					check: function (card) {
						return 7 - get.value(card);
					},
					viewAs: { name: links[0][2], nature: links[0][3] },
					onuse: function (result, player) {
						player.markAuto("taffyold_taoluan", [result.card.name]);
					},
				};
			},
			prompt: function (links, player) {
				return "视为使用" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]);
			},
		},
		ai: {
			save: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter: function (player, tag, arg) {
				if (!player.countCards("hes")) return false;
				if (tag == "respondSha" || tag == "respondShan") {
					if (arg == "respond") return false;
					return !player.getStorage("taffyold_taoluan").includes(tag == "respondSha" ? "sha" : "shan");
				}
				return !player.getStorage("taffyold_taoluan").includes("tao") || (!player.getStorage("taffyold_taoluan").includes("jiu") && arg == player);
			},
			order: 4,
			result: {
				player: function (player) {
					var allshown = true,
						players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i].ai.shown == 0) {
							allshown = false;
						}
						if (players[i] != player && players[i].countCards("h") && get.attitude(player, players[i]) > 0) {
							return 1;
						}
					}
					if (allshown) return 1;
					return 0;
				},
			},
			threaten: 1.9,
		},
		group: "taffyold_taoluan2",
	},
	taffyold_taoluan2: {
		charlotte: true,
		trigger: { player: "useCardAfter" },
		filter: function (event, player) {
			if (!game.hasPlayer(current => current != player)) return false;
			return event.skill == "taffyold_taoluan_backup";
		},
		forced: true,
		popup: false,
		content: function () {
			"step 0";
			player
				.chooseTarget(
					true,
					function (card, player, target) {
						return target != player;
					},
					'滔乱<br><br><div class="text center">令一名其他角色选择一项：1.交给你一张与你以此法使用的牌类别不同的牌；2.你失去1点体力'
				)
				.set("ai", function (target) {
					var player = _status.event.player;
					if (get.attitude(player, target) > 0) {
						if (get.attitude(target, player) > 0) {
							return target.countCards("he");
						}
						return target.countCards("he") / 2;
					}
					return 0;
				});
			("step 1");
			var target = result.targets[0];
			event.target = target;
			player.line(target, "green");
			var type = get.type(trigger.card, "trick");
			target
				.chooseCard('滔乱<br><br><div class="text center">交给' + get.translation(player) + "一张不为" + get.translation(type) + "牌的牌，或令其失去1点体力", "he", function (card, player, target) {
					return get.type(card, "trick") != _status.event.cardType;
				})
				.set("cardType", type)
				.set("ai", function (card) {
					if (_status.event.att) {
						return 11 - get.value(card);
					}
					return 0;
				})
				.set("att", get.attitude(target, player) > 0);
			("step 2");
			var target = event.target;
			if (result.bool) {
				target.give(result.cards, player);
			} else {
				player.loseHp();
			}
		},
	},
	taffyold_taoluan_backup: {},
	// 旧胡金定
	taffyold_olchongshen: {
		audio: "olchongshen",
		locked: false,
		enable: "chooseToUse",
		filterCard(card) {
			return get.itemtype(card) == "card" && card.hasGaintag("taffyold_olchongshen");
		},
		position: "h",
		viewAs: {
			name: "shan",
		},
		viewAsFilter(player) {
			if (!player.countCards("h", card => card.hasGaintag("taffyold_olchongshen"))) return false;
		},
		prompt: "将本轮得到的牌当作【闪】使用",
		check(card) {
			return 7 - get.value(card);
		},
		ai: {
			order: 2,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (arg == "respond" || !player.countCards("h", card => _status.connectMode || card.hasGaintag("taffyold_olchongshen"))) return false;
			},
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "respondShan") && current < 0) return 0.6;
				},
			},
			basic: {
				useful: (card, i) => {
					let player = _status.event.player,
						basic = [7, 5.1, 2],
						num = basic[Math.min(2, i)];
					if (player.hp > 2 && player.hasSkillTag("maixie")) num *= 0.57;
					if (player.hasSkillTag("freeShan", false, null, true) || player.getEquip("rewrite_renwang")) num *= 0.8;
					return num;
				},
				value: [7, 5.1, 2],
			},
			result: {
				player: 1,
			},
		},
		group: "taffyold_olchongshen_mark",
		mod: {
			aiValue(player, card, num) {
				if (get.name(card) != "shan" && get.itemtype(card) == "card" && !card.hasGaintag("taffyold_olchongshen")) return;
				let cards = player.getCards("hs", card => get.name(card) == "shan" || card.hasGaintag("taffyold_olchongshen"));
				cards.sort((a, b) => (get.name(b) == "shan" ? 1 : 2) - (get.name(a) == "shan" ? 1 : 2));
				const geti = () => {
					if (cards.includes(card)) return cards.indexOf(card);
					return cards.length;
				};
				if (get.name(card) == "shan") return Math.min(num, [6, 4, 3][Math.min(geti(), 2)]) * 0.6;
				return Math.max(num, [6.5, 4, 3][Math.min(geti(), 2)]);
			},
			aiUseful() {
				return lib.skill.taffyold_olchongshen.mod.aiValue.apply(this, arguments);
			},
			ignoredHandcard: function (card, player) {
				if (card.hasGaintag("taffyold_olchongshen")) return true;
			},
			cardDiscardable: function (card, player, name) {
				if (name == "phaseDiscard" && card.hasGaintag("taffyold_olchongshen")) return false;
			},
		},
		init(player) {
			if (game.phaseNumber > 0) {
				const hs = player.getCards("h"),
					history = player.getAllHistory();
				let cards = [];
				for (let i = history.length - 1; i >= 0; i--) {
					for (const evt of history[i].gain) {
						cards.addArray(evt.cards);
					}
					if (history[i].isRound) break;
				}
				cards = cards.filter(i => hs.includes(i));
				if (cards.length) player.addGaintag(cards, "taffyold_olchongshen");
			}
		},
		onremove(player) {
			player.removeGaintag("taffyold_olchongshen");
		},
		subSkill: {
			mark: {
				charlotte: true,
				trigger: {
					player: "gainBegin",
					global: "roundStart",
				},
				filter(event, player) {
					return event.name == "gain" || game.roundNumber > 1;
				},
				forced: true,
				popup: false,
				content() {
					if (trigger.name == "gain") trigger.gaintag.add("taffyold_olchongshen");
					else player.removeGaintag("taffyold_olchongshen");
				},
			},
		},
	},
	// 旧OL谋关羽
	taffyold_olsbweilin: {
		audio: "olsbweilin",
		enable: "chooseToUse",
		filter(event, player) {
			return get
				.inpileVCardList(info => {
					const name = info[2];
					return get.type(name) == "basic";
				})
				.some(card => player.hasCard(cardx => event.filterCard({ name: card[2], nature: card[3], cards: [cardx] }, player, event), "hes"));
		},
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				const list = get
					.inpileVCardList(info => {
						const name = info[2];
						return get.type(name) == "basic";
					})
					.filter(card => player.hasCard(cardx => event.filterCard({ name: card[2], nature: card[3], cards: [cardx] }, player, event), "hes"));
				return ui.create.dialog("威临", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2], nature: button.link[3] }, player, _status.event.getParent());
			},
			check(button) {
				if (_status.event.getParent().type != "phase") return 1;
				const player = get.event("player"),
					value = player.getUseValue({ name: button.link[2], nature: button.link[3] });
				if (button.link[2] == "sha" && !player.getHistory("useCard", evt => get.type(evt.card) == "basic").length) {
					if (value > 0) return value + 20;
				}
				return value;
			},
			backup(links, player) {
				return {
					audio: "taffyold_olsbweilin",
					filterCard: true,
					popname: true,
					check(card) {
						const name = lib.skill.taffyold_olsbweilin_backup.viewAs.name,
							color = get.color(card);
						const phase = _status.event.getParent().type == "phase";
						if (phase && name == "sha" && color == "red") return 10 - get.value(card);
						if (name == "tao") return 7 + [-2, 0, 2][["black", "red", "none"].indexOf(color)] - get.value(card);
						return 6 - get.value(card);
					},
					position: "hse",
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent() {
						if (!player.storage.taffyold_olsbweilin_backup) {
							player.storage.taffyold_olsbweilin_backup = true;
							player
								.when("useCardToTargeted")
								.filter(evt => evt.getParent().skill == "taffyold_olsbweilin_backup" && evt.getParent().triggeredTargets3.length == evt.targets.length)
								.then(() => {
									delete player.storage.taffyold_olsbweilin_backup;
									const targets = trigger.targets.slice().sortBySeat();
									player.line(targets);
									for (const target of targets) {
										target.addTempSkill("taffyold_olsbweilin_wusheng");
										target.markAuto("taffyold_olsbweilin_wusheng", [get.color(trigger.card)]);
									}
								});
						}
					},
					ai: {
						directHit_ai: true,
						skillTagFilter(player, tag, arg) {
							if (get.event("skill") != "taffyold_olsbweilin_backup") return false;
							return arg && arg.card && arg.card.name == "sha" && get.color(arg.card) == "red";
						},
					},
				};
			},
			prompt(links, player) {
				return "将一张牌当作" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】使用";
			},
		},
		hiddenCard(player, name) {
			return get.type(name) == "basic" && !player.getStat("skill").taffyold_olsbweilin && player.countCards("hes");
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (arg == "respond") return false;
				if (player.getStat("skill").taffyold_olsbweilin || !player.countCards("hes")) return false;
			},
			order(item, player) {
				if (player && _status.event.type == "phase" && player.hasValueTarget({ name: "sha" }, true, true)) {
					let max = 0,
						names = get.inpileVCardList(info => {
							const name = info[2];
							return get.type(name) == "basic";
						});
					names = names.map(namex => {
						return { name: namex[2], nature: namex[3] };
					});
					names.forEach(card => {
						if (player.getUseValue(card) > 0) {
							let temp = get.order(card);
							if (card.name == "jiu") {
								let cards = player.getCards("hs", cardx => get.value(cardx) < 8);
								cards.sort((a, b) => get.value(a) - get.value(b));
								if (!cards.some(cardx => get.name(cardx) == "sha" && !cards.slice(0, 2).includes(cardx))) temp = 0;
							}
							if (temp > max) max = temp;
						}
					});
					if (max > 0) max += 15;
					return max;
				}
				return 0.5;
			},
			result: {
				player(player) {
					if (_status.event.dying) return get.attitude(player, _status.event.dying);
					return 1;
				},
			},
		},
		subSkill: {
			backup: {},
			wusheng: {
				charlotte: true,
				onremove: true,
				mod: {
					cardname(card, player) {
						if (player.getStorage("taffyold_olsbweilin_wusheng").includes(get.color(card))) return "sha";
					},
				},
				intro: {
					content: "手牌中所有$牌均视为【杀】",
				},
			},
		},
	},
	// 旧神曹丕
	taffyold_chuyuan: {
		audio: "chuyuan",
		trigger: { global: "damageEnd" },
		filter: function (event, player) {
			return event.player.isAlive();
		},
		logTarget: "player",
		locked: false,
		content: function () {
			"step 0";
			trigger.player.draw();
			("step 1");
			if (!trigger.player.countCards("h")) event.finish();
			else if (trigger.player.countCards("h") == 1)
				event._result = {
					cards: trigger.player.getCards("h"),
				};
			else trigger.player.chooseCard("h", true, "选择一张牌置于" + get.translation(player) + "的武将牌上作为“储”");
			("step 2");
			player.addToExpansion(result.cards, trigger.player, "give").gaintag.add("taffyold_chuyuan");
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove: function (player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
		mod: {
			maxHandcard: function (player, num) {
				return num + player.getExpansions("taffyold_chuyuan").length;
			},
		},
		ai: { combo: "taffyold_dengji" },
	},
	taffyold_dengji: {
		audio: "dengji",
		derivation: ["tianxing", "new_rejianxiong", "rerende", "rezhiheng", "olluanji", "olfangquan"],
		trigger: { player: "phaseBegin" },
		forced: true,
		unique: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "water",
		filter: function (event, player) {
			return player.getExpansions("taffyold_chuyuan").length >= 3;
		},
		content: function () {
			player.awakenSkill(event.name);
			player.addSkills(["taffyold_tianxing", "new_rejianxiong"]);
			player.loseMaxHp();
			player.gain(player.getExpansions("taffyold_chuyuan"), "gain2", "fromStorage");
		},
	},
	taffyold_tianxing: {
		audio: "tianxing",
		trigger: { player: "phaseBegin" },
		forced: true,
		unique: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter: function (event, player) {
			return player.getExpansions("taffyold_chuyuan").length >= 3;
		},
		content: function () {
			"step 0";
			player.awakenSkill(event.name);
			player.loseMaxHp();
			player.gain(player.getExpansions("taffyold_chuyuan"), "gain2", "fromStorage");
			("step 1");
			player.removeSkill("taffyold_chuyuan");
			player
				.chooseControl("rerende", "rezhiheng", "olluanji", "olfangquan")
				.set("prompt", "选择获得一个技能")
				.set("ai", function () {
					var player = _status.event.player;
					if (
						!player.hasSkill("luanji") &&
						!player.hasSkill("olluanji") &&
						player.getUseValue({
							name: "wanjian",
						}) > 4
					)
						return "olluanji";
					if (!player.hasSkill("rezhiheng")) return "rezhiheng";
					return "rerende";
				});
			("step 2");
			player.addSkillLog(result.control);
		},
	},
	// 旧族荀采
	taffyold_clanlieshi: {
		enable: "phaseUse",
		chooseButton: {
			dialog: function (event, player) {
				var dialog = ui.create.dialog("烈誓：选择一项", "hidden");
				dialog.add([lib.skill.taffyold_clanlieshi.choices.slice(), "textbutton"]);
				return dialog;
			},
			filter: function (button, player) {
				var link = button.link;
				if (link == "damage") return true;
				var num = player.countCards("h", link);
				return num > 0 && num == player.getDiscardableCards(player, "h").filter(i => get.name(i) == link).length;
			},
			check: function (button) {
				var player = _status.event.player;
				switch (button.link) {
					case "damage":
						if (get.damageEffect(player, player, player, "fire") >= 0) return 10;
						if (player.hasSkill("copol_huanyin") && player.canSave(player)) return Math.max(0, 1 + Math.random() - player.hp / 3);
						if (player.hp >= Math.max(2, 3 - player.getFriends().length) && game.countPlayer(current => get.attitude(player, current) < 0 && current.countCards("h", card => ["sha", "shan"].includes(get.name(card))))) return 0.8 + Math.random();
						return 0;
					case "shan":
						if (player.countCards("h", "shan") == 1) return 8 + Math.random();
						return 1 + Math.random();
					case "sha":
						if (player.countCards("h", "sha") == 1) return 8 + Math.random();
						return 0.9 + Math.random();
				}
			},
			backup: function (links) {
				var next = get.copy(lib.skill["taffyold_clanlieshi_backupx"]);
				next.choice = links[0];
				return next;
			},
			prompt: function (links) {
				if (links[0] == "damage") return "受到1点火焰伤害，废除判定区";
				return "弃置所有【" + get.translation(links[0]) + "】";
			},
		},
		choices: [
			["damage", "受到1点火焰伤害，然后废除判定区"],
			["shan", "弃置所有【闪】"],
			["sha", "弃置所有【杀】"],
		],
		ai: {
			order: function (item, player) {
				if (!player) return;
				var eff = get.damageEffect(player, player, player, "fire");
				if ((player.countCards("h", "sha") == 1 || player.countCards("h", "shan") == 1) && eff < 0) return 8;
				else if (eff >= 0) return 5.8;
				if (!player.countCards("h", card => ["sha", "shan"].includes(get.name(card)))) {
					if ((!player.hasSkill("copol_huanyin") || !player.canSave(player)) && player.hp <= 1) return 0;
					if (player.canSave(player) && player.hp == 1 && player.countCards("h") <= 1) return 2.6;
					if (player.hp < Math.max(2, 3 - player.getFriends().length) || !game.countPlayer(current => get.attitude(player, current) < 0 && current.countCards("h", card => ["sha", "shan"].includes(get.name(card))))) return 0;
				}
				return 2.5;
			},
			expose: 0.2,
			result: { player: 1 },
		},
		subSkill: {
			backup: {},
			backupx: {
				audio: "clanlieshi",
				selectCard: -1,
				selectTarget: -1,
				filterCard: () => false,
				filterTarget: () => false,
				multitarget: true,
				content: function () {
					"step 0";
					var choice = lib.skill.taffyold_clanlieshi_backup.choice;
					event.choice = choice;
					if (choice == "damage") {
						player.damage("fire");
						if (!player.storage._disableJudge) player.disableJudge();
					} else {
						var cards = player.getCards("h", choice);
						if (cards.length) player.discard(cards);
					}
					("step 1");
					if (!player.isIn()) event.finish();
					else
						player.chooseTarget("烈誓：令一名其他角色选择另一项", lib.filter.notMe, true).set("ai", target => {
							var player = _status.event.player,
								chosen = _status.event.getParent().choice,
								att = get.attitude(player, target);
							if (chosen == "damage") {
								if (att > 0) return 0;
								return -att / 2 + target.countCards("h", card => ["sha", "shan"].includes(get.name(card)));
							}
							return get.damageEffect(target, player, player, "fire");
						});
					("step 2");
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.line(target, "fire");
						var list = [],
							choice = event.choice;
						var choiceList = lib.skill.taffyold_clanlieshi.choices.slice();
						choiceList = choiceList.map((link, ind, arr) => {
							link = link[1];
							var ok = true;
							if (arr[ind][0] == choice) {
								link += "（" + get.translation(player) + "已选）";
								ok = false;
							}
							if (ind > 0) {
								var name = ind == 1 ? "shan" : "sha";
								if (!target.countCards("h", name)) ok = false;
							}
							if (!ok) link = '<span style="opacity:0.5">' + link + "</span>";
							else list.push("选项" + get.cnNumber(ind + 1, true));
							return link;
						});
						if (!list.length) {
							event.finish();
							return;
						}
						target
							.chooseControl(list)
							.set("choiceList", choiceList)
							.set("ai", () => {
								var controls = _status.event.controls.slice(),
									player = _status.event.player,
									user = _status.event.getParent().player;
								if (controls.length == 1) return controls[0];
								if (controls.includes("选项一") && get.damageEffect(player, user, player, "fire") >= 0) return "选项一";
								if (controls.includes("选项一") && player.hp <= 2 && player.countCards("h", card => ["sha", "shan"].includes(get.name(card))) <= 3) controls.remove("选项一");
								if (controls.length == 1) return controls[0];
								if (player.getCards("h", "sha").reduce((p, c) => p + get.value(c, player), 0) > player.getCards("h", "sha").reduce((p, c) => p + get.value(c, player), 0)) {
									if (controls.includes("选项三")) return "选项三";
								} else if (controls.includes("选项二")) return "选项二";
								return controls.randomGet();
							});
					} else event.finish();
					("step 3");
					if (result.control == "选项一") {
						target.damage("fire");
						if (!target.storage._disableJudge) target.disableJudge();
					} else {
						var cards = target.getCards("h", result.control == "选项二" ? "shan" : "sha");
						if (cards.length) target.discard(cards);
					}
				},
			},
		},
	},
	taffyold_clandianzhan: {
		audio: "clandianzhan",
		trigger: { player: "useCardAfter" },
		forced: true,
		filter: function (event, player) {
			if (!lib.suit.includes(get.suit(event.card))) return false;
			var card = event.card,
				suit = get.suit(card);
			for (var i = player.actionHistory.length - 1; i >= 0; i--) {
				var history = player.actionHistory[i].useCard;
				for (var evt of history) {
					if (evt == event) continue;
					if (get.suit(evt.card) == suit) return false;
				}
				if (player.actionHistory[i].isRound) break;
			}
			return (
				(event.targets && event.targets.length == 1 && !event.targets[0].isLinked()) ||
				player
					.getCards("h", card => get.suit(card) == get.suit(event.card))
					.every(card => {
						var mod = game.checkMod(card, player, "unchanged", "cardChongzhuable", player);
						if (mod != "unchanged") return false;
						return true;
					})
			);
		},
		content: function () {
			if (trigger.targets && trigger.targets.length == 1) {
				trigger.targets[0].link(true);
			}
			var cards = player.getCards("h", card => get.suit(card) == get.suit(trigger.card));
			if (
				cards.every(card => {
					var mod = game.checkMod(card, player, "unchanged", "cardChongzhuable", player);
					if (mod != "unchanged") return false;
					return true;
				})
			) {
				player.loseToDiscardpile(cards);
				player.draw(cards.length);
			}
		},
	},
	// 旧OL徐荣
	taffyold_xinfu_xionghuo: {
		audio: "xinfu_xionghuo",
		enable: "phaseUse",
		filter: function (event, player) {
			return player.countMark("taffyold_xinfu_xionghuo") > 0;
		},
		filterTarget: function (card, player, target) {
			return player != target && !target.hasMark("taffyold_xinfu_xionghuo");
		},
		content: function () {
			player.removeMark("taffyold_xinfu_xionghuo", 1);
			target.addMark("taffyold_xinfu_xionghuo", 1);
		},
		ai: {
			order: 11,
			result: {
				target: function (player, target) {
					if (
						(player.countMark("taffyold_xinfu_xionghuo") >= 2 ||
							!game.hasPlayer(function (current) {
								return current != player && get.attitude(player, current) < 0 && current.hasMark("taffyold_xinfu_xionghuo");
							})) &&
						player.countCards("h", function (card) {
							return (
								get.tag(card, "damage") &&
								player.canUse(card, target, null, true) &&
								player.getUseValue(card) > 0 &&
								get.effect_use(target, card, player) > 0 &&
								target.hasSkillTag("filterDamage", null, {
									player: player,
									card: card,
								})
							);
						})
					)
						return 3 / Math.max(1, target.hp);
					if (
						(!player.hasUnknown() &&
							game.countPlayer(function (current) {
								return get.attitude(player, current) < 0;
							}) <= 1) ||
						player.countMark("taffyold_xinfu_xionghuo") >= 2
					) {
						return -1;
					}
					return 0;
				},
			},
			effect: {
				player: function (card, player, target) {
					if (
						player != target &&
						get.tag(card, "damage") &&
						target &&
						target.hasMark("taffyold_xinfu_xionghuo") &&
						!target.hasSkillTag("filterDamage", null, {
							player: player,
							card: card,
						})
					)
						return [1, 0, 1, -2];
				},
			},
			threaten: 1.6,
		},
		marktext: "戾",
		intro: {
			name: "暴戾",
			content: "mark",
		},
		group: ["taffyold_xinfu_xionghuo_init", "taffyold_xinfu_xionghuo_damage", "taffyold_xinfu_xionghuo_effect"],
		subSkill: {
			init: {
				audio: "taffyold_xinfu_xionghuo",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter: function (event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				forced: true,
				locked: false,
				content: function () {
					player.addMark("taffyold_xinfu_xionghuo", 3);
				},
			},
			damage: {
				audio: "taffyold_xinfu_xionghuo",
				trigger: { source: "damageBegin1" },
				filter: function (event, player) {
					return event.player.countMark("taffyold_xinfu_xionghuo") > 0 && event.player != player;
				},
				forced: true,
				locked: false,
				logTarget: "player",
				content: function () {
					trigger.num++;
				},
			},
			effect: {
				audio: "taffyold_xinfu_xionghuo",
				trigger: { global: "phaseUseBegin" },
				filter: function (event, player) {
					return event.player.countMark("taffyold_xinfu_xionghuo") > 0 && event.player != player;
				},
				line: false,
				forced: true,
				locked: false,
				logTarget: "player",
				content: function () {
					"step 0";
					trigger.player.removeMark("taffyold_xinfu_xionghuo", trigger.player.countMark("taffyold_xinfu_xionghuo"));
					("step 1");
					var num = get.rand(0, 2);
					switch (num) {
						case 0:
							player.line(trigger.player, "fire");
							trigger.player.damage("fire");
							trigger.player.addTempSkill("taffyold_xinfu_xionghuo_disable");
							trigger.player.markAuto("taffyold_xinfu_xionghuo_disable", [player]);
							break;
						case 1:
							player.line(trigger.player, "water");
							trigger.player.loseHp();
							trigger.player.addMark("taffyold_xinfu_xionghuo_low", 1, false);
							trigger.player.addTempSkill("taffyold_xinfu_xionghuo_low");
							break;
						case 2:
							player.line(trigger.player, "green");
							var card1 = trigger.player.getCards("h").randomGet();
							var card2 = trigger.player.getCards("e").randomGet();
							var list = [];
							if (card1) list.push(card1);
							if (card2) list.push(card2);
							if (list.length) player.gain(list, trigger.player, "giveAuto", "bySelf");
							break;
					}
					("step 2");
					game.delay();
				},
			},
			disable: {
				mod: {
					playerEnabled: function (card, player, target) {
						if (card.name == "sha" && player.getStorage("taffyold_xinfu_xionghuo_disable").includes(target)) return false;
					},
				},
				charlotte: true,
				onremove: true,
				mark: true,
				marktext: "禁",
				intro: { content: "不能对$使用【杀】" },
			},
			low: {
				mod: {
					maxHandcard: function (player, num) {
						return num - player.countMark("taffyold_xinfu_xionghuo_low");
					},
				},
				charlotte: true,
				onremove: true,
				mark: true,
				marktext: "减",
				intro: { content: "手牌上限-#" },
			},
		},
	},
	taffyold_xinfu_shajue: {
		audio: "xinfu_shajue",
		trigger: { global: "dying" },
		filter: function (event, player) {
			return event.player != player;
		},
		forced: true,
		content: function () {
			player.addMark("taffyold_xinfu_xionghuo", 1);
			if (trigger.player.hp < 0 && get.itemtype(trigger.parent.cards) == "cards" && get.position(trigger.parent.cards[0], true) == "o") {
				player.gain(trigger.parent.cards, "gain2");
			}
		},
	},
	//旧OL南华老仙
	taffyold_olhedao: {
		audio: "olhedao",
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "dyingAfter"],
		},
		filter(event, player) {
			if (event.name === "dying") return game.getAllGlobalHistory("everything", evt => evt.name === "dying" && evt.player === player).indexOf(event) === 0;
			return event.name !== "phase" || game.phaseNumber === 0;
		},
		forced: true,
		priority: 12, //本体御用优先级
		content() {
			player.storage[event.name] = 2 + (trigger.name === "dying");
			player.markSkill(event.name);
		},
		intro: { content: "至多拥有#册“天书”" },
		getLimit(player) {
			const num = player.storage.taffyold_olhedao;
			return typeof num === "number" ? num : 1;
		},
		//时机
		tianshuTrigger: [
			//用牌相关
			{
				fromIndex: 1,
				name: "当你使用牌后",
				effect: {
					trigger: { player: "useCardAfter" },
				},
			},
			{
				fromIndex: 2,
				name: "当你使用或打出【闪】时",
				effect: {
					trigger: { player: "useCard" },
					filter(event, player) {
						return event.card.name === "shan";
					},
				},
			},
			{
				fromIndex: 2,
				name: "当你成为【杀】的目标时",
				effect: {
					trigger: { target: "useCardToTarget" },
					filter(event, player) {
						return event.card.name === "sha";
					},
				},
			},
			{
				fromIndex: 2,
				name: "当你成为普通锦囊牌的目标后",
				effect: {
					trigger: { target: "useCardToTargeted" },
					filter(event, player) {
						return get.type(event.card) === "trick";
					},
				},
			},
			{
				fromIndex: 1,
				name: "其他角色对你使用牌后",
				effect: {
					trigger: { global: "useCardAfter" },
					filter(event, player) {
						return event.player !== player && event.targets?.includes(player);
					},
				},
			},
			{
				fromIndex: 3,
				name: "一名角色使用【南蛮入侵】或【万箭齐发】后",
				effect: {
					trigger: { global: "useCardAfter" },
					filter(event, player) {
						return ["nanman", "wanjian"].includes(event.card?.name);
					},
				},
			},
			{
				fromIndex: 2,
				name: "当你使用牌被抵消后",
				effect: {
					trigger: { player: ["eventNeutralized", "shaMiss"] },
					filter(event, player) {
						return event.type === "card";
					},
				},
			},
			//失去牌相关
			{
				fromIndex: 1,
				name: "当你失去手牌后",
				effect: {
					trigger: {
						player: "loseAfter",
						global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
					},
					filter(event, player) {
						return event.getl?.(player)?.hs?.length;
					},
				},
			},
			{
				fromIndex: 3,
				name: "当你失去装备牌后",
				effect: {
					trigger: {
						player: "loseAfter",
						global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
					},
					filter(event, player) {
						return event.getl?.(player)?.cards2?.some(i => get.type(i, null, player) === "equip");
					},
				},
			},
			{
				fromIndex: 2,
				name: "当你于回合外失去红色牌后",
				effect: {
					trigger: {
						player: "loseAfter",
						global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
					},
					filter(event, player) {
						return _status.currentPhase !== player && event.getl?.(player)?.cards2?.some(i => get.color(i, player) === "red");
					},
				},
			},
			{
				fromIndex: 3,
				name: "一名角色失去最后的手牌后",
				effect: {
					trigger: {
						global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
					},
					filter(event, player) {
						return game.hasPlayer(target => !target.countCards("h") && event.getl?.(target)?.hs?.length);
					},
				},
			},
			//判定相关
			{
				fromIndex: 2,
				name: "当一张判定牌生效前",
				effect: {
					trigger: { global: "judge" },
				},
			},
			{
				fromIndex: 2,
				name: "当一张判定牌生效后",
				effect: {
					trigger: { global: "judgeAfter" },
				},
			},
			//阶段相关
			{
				fromIndex: 2,
				name: "每轮开始时",
				effect: {
					trigger: { global: "roundStart" },
				},
			},
			{
				fromIndex: 2,
				name: "准备阶段",
				effect: {
					trigger: { player: "phaseZhunbeiBegin" },
				},
			},
			{
				fromIndex: 2,
				name: "摸牌阶段开始时",
				effect: {
					trigger: { player: "phaseDrawBegin" },
				},
			},
			{
				fromIndex: 2,
				name: "出牌阶段开始时",
				effect: {
					trigger: { player: "phaseUseBegin" },
				},
			},
			{
				fromIndex: 2,
				name: "弃牌阶段开始时",
				effect: {
					trigger: { player: "phaseDiscardBegin" },
				},
			},
			{
				fromIndex: 2,
				name: "结束阶段",
				effect: {
					trigger: { player: "phaseJieshuBegin" },
				},
			},
			//伤害相关
			{
				fromIndex: 2,
				name: "当你造成伤害后",
				effect: {
					trigger: { source: "damageSource" },
				},
			},
			{
				fromIndex: 2,
				name: "当你受到伤害后",
				effect: {
					trigger: { player: "damageEnd" },
				},
			},
			{
				fromIndex: 2,
				name: "当你的体力值变化后",
				effect: {
					trigger: { player: "changeHpEnd" },
					filter(event, player) {
						return event.num !== 0;
					},
				},
			},
			{
				fromIndex: 3,
				name: "当你使用【杀】造成伤害后",
				effect: {
					trigger: { source: "damageSource" },
					filter(event, player) {
						return event.card?.name === "sha";
					},
				},
			},
			{
				fromIndex: 2,
				name: "一名角色受到【杀】造成的伤害后",
				effect: {
					trigger: { global: "damageEnd" },
					filter(event, player) {
						return event.card?.name === "sha";
					},
				},
			},
			{
				fromIndex: 2,
				name: "一名角色造成伤害时",
				effect: {
					trigger: { global: "damageBegin3" },
					filter(event, player) {
						return event.source?.isIn();
					},
				},
			},
			{
				fromIndex: 2,
				name: "一名角色受到伤害时",
				effect: {
					trigger: { global: "damageBegin4" },
				},
			},
			{
				fromIndex: 3,
				name: "一名角色受到属性伤害后",
				effect: {
					trigger: { global: "damageEnd" },
					filter(event, player) {
						return event.hasNature();
					},
				},
			},
			//其他
			{
				fromIndex: 3,
				name: "一名角色进入濒死状态时",
				effect: {
					trigger: { global: "dying" },
				},
			},
			{
				fromIndex: 3,
				name: "其他角色死亡后",
				effect: {
					trigger: { global: "dieAfter" },
					filter(event, player) {
						return event.player !== player;
					},
				},
			},
			{
				fromIndex: 2,
				name: "一名角色进入连环状态后",
				effect: {
					trigger: { global: "linkAfter" },
					filter(event, player) {
						return event.player.isLinked();
					},
				},
			},
		],
		//执行
		tianshuContent: [
			{
				toIndex: 1,
				name: "你可以摸一张牌",
				effect: {
					content() {
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						player.draw();
					},
				},
			},
			{
				toIndex: 1,
				name: "你可以弃置一名角色区域内的一张牌",
				effect: {
					getIndex(event, player) {
						return 0 + game.hasPlayer(target => target.countCards("hej"));
					},
					async cost(event, trigger, player) {
						event.result = await player
							.chooseTarget(get.prompt2(event.name.slice(0, -"_cost".length)), (card, player, target) => {
								return target.countCards("hej");
							})
							.set("ai", target => {
								const player = get.player();
								return get.effect(target, { name: "guohe" }, player, player);
							})
							.forResult();
					},
					content() {
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						player.discardPlayerCard(event.targets[0], "hej", true);
					},
				},
			},
			{
				toIndex: 1,
				name: "你可以观看牌堆顶三张牌，然后将这些牌以任意顺序置于牌堆顶或牌堆底",
				effect: {
					content() {
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						player.chooseToGuanxing(3);
					},
				},
			},
			{
				toIndex: 1,
				name: "你可以弃置任意张牌并摸等量张牌",
				effect: {
					getIndex(event, player) {
						return (
							0 +
							player.hasCard(card => {
								if (get.position(card) === "h" && _status.connectMode) return true;
								return lib.filter.cardDiscardable(card, player);
							}, "he")
						);
					},
					async cost(event, trigger, player) {
						const name = event.name.slice(0, -"_cost".length);
						event.result = await player.chooseToDiscard(get.prompt2(name), "he", [1, Infinity], "chooseonly").set("ai", lib.skill.zhiheng.check).set("logSkill", name).forResult();
					},
					popup: false,
					content() {
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						player.discard(event.cards);
						player.draw(event.cards.length);
					},
				},
			},
			{
				toIndex: 1,
				name: "你可以获得造成伤害的牌",
				filter: item => item.includes("伤害"),
				effect: {
					getIndex(event, player) {
						return 0 + (get.itemtype(event.cards) === "cards" && event.cards.someInD());
					},
					prompt2(event, player) {
						return "获得" + get.translation(event.cards.filterInD());
					},
					content() {
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						player.gain(trigger.cards.filterInD(), "gain2");
					},
				},
			},
			{
				toIndex: 1,
				name: "你可以视为使用一张无距离和次数限制的【杀】",
				effect: {
					getIndex(event, player) {
						const card = new lib.element.VCard({ name: "sha" });
						return 0 + player.hasUseTarget(card, false);
					},
					direct: true,
					async content(event, trigger, player) {
						const card = new lib.element.VCard({ name: "sha" });
						event.result = await player
							.chooseUseTarget(get.prompt2(event.name), card, false, "nodistance")
							.set("oncard", () => {
								const event = _status.event.getParent(2);
								lib.skill.taffyold_olhedao.tianshuClear(event.name, event.player);
							})
							.set("logSkill", event.name)
							.forResult();
					},
				},
			},
			{
				toIndex: 2,
				name: "你可以获得一名角色区域内的一张牌",
				effect: {
					getIndex(event, player) {
						return 0 + game.hasPlayer(target => target.countCards("hej"));
					},
					async cost(event, trigger, player) {
						event.result = await player
							.chooseTarget(get.prompt2(event.name.slice(0, -"_cost".length)), (card, player, target) => {
								return target.countCards("hej");
							})
							.set("ai", target => {
								const player = get.player();
								return get.effect(target, { name: "shunshou" }, player, player);
							})
							.forResult();
					},
					content() {
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						player.gainPlayerCard(event.targets[0], "hej", true);
					},
				},
			},
			{
				toIndex: 2,
				name: "你可以回复1点体力",
				effect: {
					getIndex(event, player) {
						return 0 + player.isDamaged();
					},
					check(event, player) {
						return get.recoverEffect(player, player, player) > 0;
					},
					content() {
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						player.recover();
					},
				},
			},
			{
				toIndex: 3,
				name: "你可以摸三张牌，然后弃置一张牌",
				effect: {
					async content(event, trigger, player) {
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						await player.draw(3);
						await player.chooseToDiscard("he", true);
					},
				},
			},
			{
				toIndex: 3,
				name: "你可以将手牌摸至体力上限（至多摸五张）",
				effect: {
					getIndex(event, player) {
						return 0 + (player.countCards("h") < player.maxHp);
					},
					content() {
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						player.drawTo(Math.min(player.maxHp, player.countCards("h") + 5));
					},
				},
			},
			{
				toIndex: 3,
				name: "你可以令一名角色的非锁定技失效直到其下个回合开始",
				effect: {
					getIndex(event, player) {
						return 0 + game.hasPlayer(target => !target.hasSkill("fengyin"));
					},
					async cost(event, trigger, player) {
						event.result = await player
							.chooseTarget(get.prompt2(event.name.slice(0, -"_cost".length)), (card, player, target) => {
								return !target.hasSkill("fengyin");
							})
							.set("ai", target => {
								const player = get.player();
								return (
									-get.sgn(get.attitude(player, target)) *
									(target.getSkills(null, false, false).filter(skill => {
										return !get.is.locked(skill);
									}).length +
										1) *
									(target === _status.currentPhase ? 10 : 1)
								);
							})
							.forResult();
					},
					content() {
						const target = event.targets[0];
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						target.addTempSkill("fengyin", { player: "phaseBegin" });
					},
				},
			},
			{
				toIndex: 3,
				name: "你可以令一名角色摸两张牌并将武将牌翻面",
				effect: {
					async cost(event, trigger, player) {
						event.result = await player
							.chooseTarget(get.prompt2(event.name.slice(0, -"_cost".length)))
							.set("ai", target => {
								const player = get.player(),
									draw = 2;
								if (target.hasSkillTag("noturn")) return 0;
								const att = get.attitude(player, target),
									current = _status.currentPhase;
								const dis = current ? get.distance(current, target, "absolute") : 1;
								if (att == 0) return target.hasJudge("lebu") ? Math.random() / 3 : Math.sqrt(get.threaten(target)) / 5 + Math.random() / 2;
								if (att > 0) {
									if (target.isTurnedOver()) return att + draw;
									if (current && target.getSeatNum() > current.getSeatNum()) return att + draw / 3;
									return (10 * Math.sqrt(Math.max(0.01, get.threaten(target)))) / (3.5 - draw) + dis / (2 * game.countPlayer());
								} else {
									if (target.isTurnedOver()) return att - draw;
									if (current && target.getSeatNum() <= current.getSeatNum()) return -att + draw / 3;
									return (4.25 - draw) * 10 * Math.sqrt(Math.max(0.01, get.threaten(target))) + (2 * game.countPlayer()) / dis;
								}
							})
							.forResult();
					},
					content() {
						const target = event.targets[0];
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						target.draw(2);
						target.turnOver();
					},
				},
			},
			{
				toIndex: 2,
				name: "你可以令此牌对你无效",
				filter: item => item.includes("你成为") && (item.includes("的目标时") || item.includes("的目标后")),
				effect: {
					prompt2(event, player) {
						return "令" + get.translation(event.card) + "对你无效";
					},
					check(event, player) {
						return get.effect(player, event.card, event.player, player) < 0;
					},
					content() {
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						trigger.getParent().excluded.add(player);
						game.log(trigger.card, "对", player, "无效");
					},
				},
			},
			{
				toIndex: 2,
				name: "你可以令一名其他角色判定，若判定结果为黑桃，则其受到2点雷属性伤害",
				effect: {
					getIndex(event, player) {
						return 0 + game.hasPlayer(target => target !== player);
					},
					async cost(event, trigger, player) {
						event.result = await player
							.chooseTarget(get.prompt2(event.name.slice(0, -"_cost".length)), lib.filter.notMe)
							.set("ai", target => {
								const player = get.player();
								if (target.hasSkill("hongyan")) return 0;
								return get.damageEffect(target, player, player, "thunder");
							})
							.forResult();
					},
					async content(event, trigger, player) {
						const target = event.targets[0];
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						const result = await target
							.judge(card => {
								return get.suit(card) === "spade" ? -4 : 0;
							})
							.set("judge2", result => (result.bool === false ? true : false))
							.forResult();
						if (result.bool === false) await target.damage(2, "thunder");
					},
				},
			},
			{
				toIndex: 2,
				name: "你可以打出一张手牌替换此判定牌",
				filter: item => item.includes("判定牌生效前"),
				effect: {
					getIndex(event, player) {
						return 0 + Boolean(player.countCards("hs"));
					},
					async cost(event, trigger, player) {
						const {
							result: { bool, cards },
						} = await player
							.chooseCard(get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，" + get.prompt(event.name.slice(0, -"_cost".length)), "hs", card => {
								const player = _status.event.player;
								const mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
								if (mod2 != "unchanged") return mod2;
								const mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
								if (mod != "unchanged") return mod;
								return true;
							})
							.set("ai", card => {
								const trigger = _status.event.getTrigger();
								const player = _status.event.player;
								const judging = _status.event.judging;
								const result = trigger.judge(card) - trigger.judge(judging);
								const attitude = get.attitude(player, trigger.player);
								if (attitude == 0 || result == 0) return 0;
								if (attitude > 0) {
									return result - get.value(card) / 2;
								} else {
									return -result - get.value(card) / 2;
								}
							})
							.set("judging", trigger.player.judging[0]);
						if (bool) event.result = { bool, cost_data: { cards } };
					},
					popup: false,
					async content(event, trigger, player) {
						const chooseCardResultCards = event.cost_data.cards;
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						await player.respond(chooseCardResultCards, event.name, "highlight", "noOrdering");
						if (trigger.player.judging[0].clone) {
							trigger.player.judging[0].clone.classList.remove("thrownhighlight");
							game.broadcast(card => {
								if (card.clone) card.clone.classList.remove("thrownhighlight");
							}, trigger.player.judging[0]);
							game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
						}
						player.$gain2(trigger.player.judging);
						await player.gain(trigger.player.judging);
						trigger.player.judging[0] = chooseCardResultCards[0];
						trigger.orderingCards.addArray(chooseCardResultCards);
						game.log(trigger.player, "的判定牌改为", chooseCardResultCards[0]);
						await game.delay(2);
					},
					ai: {
						rejudge: true,
						tag: { rejudge: 1 },
					},
				},
			},
			{
				toIndex: 2,
				name: "你可以获得此判定牌",
				filter: item => item.includes("判定牌生效后"),
				effect: {
					getIndex(event, player) {
						return 0 + (get.position(event.result.card, true) === "o");
					},
					check(event, player) {
						return get.value(event.result.card) > 0;
					},
					content() {
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						player.gain(trigger.result.card, "gain2");
					},
				},
			},
			{
				toIndex: 2,
				name: "若你不是体力上限最高的角色，则你可以增加1点体力上限",
				filter: item => item.includes("判定牌生效后"),
				effect: {
					getIndex(event, player) {
						return 0 + game.hasPlayer(t => t.maxHp > player.maxHp);
					},
					content() {
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						player.gainMaxHp();
					},
				},
			},
			{
				toIndex: 2,
				name: "你可以与一名已受伤角色拼点，若你赢，你获得其两张牌",
				effect: {
					getIndex(event, player) {
						return 0 + game.hasPlayer(target => target.isDamaged() && player.canCompare(target));
					},
					async cost(event, trigger, player) {
						event.result = await player
							.chooseTarget(get.prompt2(event.name.slice(0, -"_cost".length)), (card, player, target) => {
								return target.isDamaged() && player.canCompare(target);
							})
							.set("ai", target => {
								if (!get.event().goon) return 0;
								const player = get.player();
								return -get.attitude(player, target) * (1 + target.countCards("he"));
							})
							.set(
								"goon",
								player.hasCard(card => {
									const val = get.value(card);
									if (val < 0) return true;
									if (val <= 5) return card.number >= 12;
									if (val <= 6) return card.number >= 13;
									return false;
								}, "h")
							)
							.forResult();
					},
					async content(event, trigger, player) {
						const target = event.targets[0];
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						const result = await player.chooseToCompare(target).forResult();
						if (result.bool) await player.gainPlayerCard(target, 2, "he", true);
					},
				},
			},
			{
				toIndex: 2,
				name: "你可以令至多两名角色各摸一张牌",
				effect: {
					async cost(event, trigger, player) {
						event.result = await player
							.chooseTarget(get.prompt2(event.name.slice(0, -"_cost".length)), [1, 2])
							.set("ai", target => {
								const player = get.player();
								return get.effect(target, { name: "draw" }, player, player);
							})
							.forResult();
					},
					async content(event, trigger, player) {
						const { targets } = event;
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						if (targets.length === 1) await targets[0].draw();
						else {
							await game.asyncDraw(targets);
							await game.delayx();
						}
					},
				},
			},
			{
				toIndex: 1,
				name: "你可以令一名角色的手牌上限+2直到其回合结束",
				effect: {
					async cost(event, trigger, player) {
						event.result = await player
							.chooseTarget(get.prompt2(event.name.slice(0, -"_cost".length)))
							.set("ai", target => {
								const player = get.player();
								return get.effect(target, { name: "draw" }, player, player) * (1 + target.countCards("h"));
							})
							.forResult();
					},
					async content(event, trigger, player) {
						const target = event.targets[0];
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						target.addTempSkill("taffyold_olhedao_hand", { player: "phaseEnd" });
						target.addMark("taffyold_olhedao_hand", 2, false);
					},
				},
			},
			{
				toIndex: 3,
				name: "你可以获得两张非基本牌",
				effect: {
					content() {
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						let list = [];
						while (list.length < 2) {
							const card = get.cardPile(card => get.type(card) !== "basic" && !list.includes(card));
							if (card) list.push(card);
							else break;
						}
						if (list.length) player.gain(list, "gain2");
					},
				},
			},
			{
				toIndex: 3,
				name: "你可以获得两张锦囊牌",
				effect: {
					content() {
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						let list = [];
						while (list.length < 2) {
							const card = get.cardPile(card => get.type2(card) === "trick" && !list.includes(card));
							if (card) list.push(card);
							else break;
						}
						if (list.length) player.gain(list, "gain2");
					},
				},
			},
			{
				toIndex: 2,
				name: "你可以摸四张牌并将武将牌翻面",
				effect: {
					content() {
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						player.draw(4);
						player.turnOver();
					},
				},
			},
			{
				toIndex: 3,
				name: "你可令你对一名角色使用牌无距离和次数限制直到回合结束",
				effect: {
					getIndex(event, player) {
						return 0 + game.hasPlayer(target => !player.getStorage("taffyold_olhedao_effect").includes(target));
					},
					async cost(event, trigger, player) {
						event.result = await player
							.chooseTarget(get.prompt2(event.name.slice(0, -"_cost".length)), (card, player, target) => {
								return !player.getStorage("taffyold_olhedao_effect").includes(target);
							})
							.set("ai", target => {
								const player = get.player();
								return 1145141919810 - get.attitude(player, target);
							})
							.forResult();
					},
					async content(event, trigger, player) {
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						player.addTempSkill("taffyold_olhedao_effect", { player: "phaseEnd" });
						player.markAuto("taffyold_olhedao_effect", event.targets);
					},
				},
			},
			{
				toIndex: 2,
				name: "你可以弃置两张牌，令你与一名其他角色各回复1点体力",
				effect: {
					getIndex(event, player) {
						return (
							0 +
							(player.countCards("he", card => {
								if (get.position(card) === "h" && _status.connectMode) return true;
								return lib.filter.cardDiscardable(card, player);
							}) >= 2 && game.hasPlayer(target => target !== player))
						);
					},
					async cost(event, trigger, player) {
						event.result = await player
							.chooseCardTarget({
								prompt: get.prompt2(event.name.slice(0, -"_cost".length)),
								filterTarget(card, player, target) {
									return !player.getStorage("taffyold_olhedao_effect").includes(target);
								},
								filterCard: lib.filter.cardDiscardable,
								selectCard: 2,
								position: "he",
								ai1(card) {
									return 7 - get.value(card);
								},
								ai2(target) {
									const player = get.player();
									return get.recoverEffect(target, player, player) + get.recoverEffect(player, player, player);
								},
							})
							.forResult();
					},
					async content(event, trigger, player) {
						const { targets, cards } = event,
							[target] = targets;
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						await player.discard(cards);
						await player.recover();
						await target.recover();
					},
				},
			},
			{
				toIndex: 2,
				name: "你可令此伤害+1",
				filter: item => item.includes("伤害时"),
				effect: {
					logTarget: "player",
					check(event, player) {
						const target = event.player;
						return get.damageEffect(target, event.source, player) > 0 && !target.hasSkillTag("filterDamage", null, { player: event.source, card: event.card });
					},
					content() {
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						trigger.num++;
						game.log(trigger.player, "受到的伤害", "#y+1");
					},
				},
			},
			{
				toIndex: 2,
				name: "你可以失去1点体力并摸三张牌",
				effect: {
					check(event, player) {
						return player.countCards("hs", card => player.canSaveCard(card, player)) + player.getHp() - 1 > 0;
					},
					content() {
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						player.loseHp();
						player.draw(3);
					},
				},
			},
			{
				toIndex: 3,
				name: "你可以交换两名角色的手牌",
				effect: {
					getIndex(event, player) {
						return 0 + game.hasPlayer(target => target.countCards("h"));
					},
					async cost(event, trigger, player) {
						event.result = await player
							.chooseTarget(
								get.prompt2(event.name.slice(0, -"_cost".length)),
								(card, player, target) => {
									if (!ui.selected.targets.length) return true;
									return target.countCards("h") + ui.selected.targets[0].countCards("h") > 0;
								},
								2
							)
							.set("complexTarget", true)
							.set("ai", target => {
								const player = get.player();
								return get.effect(target, "dimeng", player, player);
							})
							.forResult();
					},
					content() {
						const { targets } = event;
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						targets[0].swapHandcards(targets[1]);
					},
				},
			},
			{
				toIndex: 3,
				name: "你可以交换两名角色装备区的牌",
				effect: {
					getIndex(event, player) {
						return 0 + game.hasPlayer(target => target.countVCards("e"));
					},
					async cost(event, trigger, player) {
						event.result = await player
							.chooseTarget(
								get.prompt2(event.name.slice(0, -"_cost".length)),
								(card, player, target) => {
									if (!ui.selected.targets.length) return true;
									return target.countVCards("e") + ui.selected.targets[0].countVCards("e") > 0;
								},
								2
							)
							.set("complexTarget", true)
							.set("ai", target => {
								const player = get.player();
								return get.effect(target, "ganlu", player, player);
							})
							.forResult();
					},
					content() {
						const { targets } = event;
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						targets[0].swapEquip(targets[1]);
					},
				},
			},
			{
				toIndex: 2,
				name: "你可以防止此伤害，令伤害来源摸三张牌",
				filter: item => item.includes("伤害时"),
				effect: {
					getIndex(event, player) {
						return 0 + event.source?.isIn();
					},
					check(event, player) {
						if (get.attitude(player, event.player) > 0) return true;
						if (get.effect(event.source, { name: "draw" }, player, player) * 3 + event.num * get.damageEffect(player, event.source, player, event.nature) > 0) return true;
						return event.source.hasSkillTag("nogain");
					},
					logTarget: "source",
					content() {
						lib.skill.taffyold_olhedao.tianshuClear(event.name, player);
						trigger.cancel();
						trigger.source.draw(3);
					},
				},
			},
		],
		//清理
		tianshuClear(skill, player, num = 1) {
			if (num > 0 && get.info(skill)?.nopop) {
				game.broadcastAll(skill => delete lib.skill[skill].nopop, skill);
				player.update();
			}
			player.storage[skill][0] -= num;
			player[player.storage[skill][0] <= 0 ? "removeSkill" : "markSkill"](skill);
		},
		subSkill: {
			hand: {
				charlotte: true,
				onremove: true,
				markimage: "image/card/handcard.png",
				mod: { maxHandcard: (player, num) => num + player.countMark("taffyold_olhedao_hand") },
				intro: {
					name: "天书",
					content: "手牌上限+#",
				},
			},
			effect: {
				charlotte: true,
				onremove: true,
				mod: {
					targetInRange(card, player, target) {
						if (player.getStorage("taffyold_olhedao_effect").includes(target)) return true;
					},
					cardUsableTarget(card, player, target) {
						if (player.getStorage("taffyold_olhedao_effect").includes(target)) return Infinity;
					},
				},
				intro: {
					name: "天书",
					content: "对$使用牌无距离和次数限制",
				},
			},
		},
		ai: {
			threaten: 4,
			combo: "taffyold_olqingshu",
		},
	},
	taffyold_olqingshu: {
		audio: "olqingshu",
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "phaseZhunbeiBegin", "phaseJieshuBegin"],
		},
		filter(event, player) {
			return event.name !== "phase" || game.phaseNumber === 0;
		},
		forced: true,
		async content(event, trigger, player) {
			const FromItems = lib.skill.taffyold_olhedao.tianshuTrigger.slice();
			const froms = await player
				.chooseButton(["青书：请选择“天书”时机", [FromItems.randomGets(3).map(item => [item, item.name]), "textbutton"]], true)
				.set("ai", () => 1 + Math.random())
				.forResult("links");
			if (!froms?.length) return;
			const [from] = froms;
			const ToItems = lib.skill.taffyold_olhedao.tianshuContent.filter(item => {
				return !item.filter || item.filter(from.name);
			});
			const tos = await player
				.chooseButton(['###青书：请选择“天书”效果###<div class="text center">' + from.name + "</div>", [ToItems.randomGets(3).map(item => [item, item.name]), "textbutton"]], true)
				.set("ai", () => 1 + Math.random())
				.forResult("links");
			if (!tos?.length) return;
			const [to] = tos;
			let skill;
			while (true) {
				skill = "taffyold_olhedao_tianshu_" + Math.random().toString(36).slice(-8);
				if (!lib.skill[skill]) break;
			}
			game.broadcastAll(
				(skill, from, to) => {
					lib.skill[skill] = { nopop: true, taffyold_olhedao: true, charlotte: true, onremove: true, ...from.effect, ...to.effect };
					lib.skill[skill].init = (player, skill) => (player.storage[skill] = player.storage[skill] || [0, skill]);
					lib.skill[skill].intro = {
						markcount: (storage = [0]) => storage[0],
						content(storage, player) {
							const book = storage?.[1];
							if (!book) return "查无此书";
							return [
								"此书还可使用" + storage[0] + "次",
								(() => {
									if (!player.isUnderControl(true) && get.info(book)?.nopop) return "此书仍是个秘密";
									return lib.translate[book + "_info"];
								})(),
							]
								.map(str => "<li>" + str)
								.join("<br>");
						},
					};
					lib.translate[skill] = "天书";
					lib.translate[skill + "_info"] = from.name + "，" + to.name + "。";
					game.finishSkill(skill);
				},
				skill,
				from,
				to
			);
			player.addSkill(skill);
			lib.skill.taffyold_olhedao.tianshuClear(skill, player, -3);
			const skills = player.getSkills(null, false, false).filter(skill => get.info(skill)?.taffyold_olhedao);
			const num = skills.length - get.info("taffyold_olhedao").getLimit(player);
			if (num > 0) {
				const result =
					num < skills.length
						? await player
								.chooseButton(["青书：选择失去" + get.cnNumber(num) + "册多余的“天书”", [skills.map(item => [item, "（剩余" + player.storage[item][0] + "次）" + lib.translate[item + "_info"]]), "textbutton"]], true, num)
								.set("ai", () => 1 + Math.random())
								.forResult()
						: { bool: true, links: skills };
				if (result?.bool && result.links?.length) player.removeSkill(result.links);
			}
		},
		ai: {
			threaten: 4,
			combo: "taffyold_olhedao",
		},
		derivation: "taffyold_olhedao_faq",
	},
	taffyold_olshoushu: {
		audio: "olshoushu",
		enable: "phaseUse",
		filter(event, player) {
			return (
				player.getSkills(null, false, false).some(skill => {
					return get.info(skill)?.taffyold_olhedao && get.info(skill).nopop;
				}) && game.hasPlayer(target => target !== player)
			);
		},
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const { target } = event;
			const result = await player
				.chooseButton(
					[
						"授术：请选择你要授予" + get.translation(target) + "的天书",
						[
							player
								.getSkills(null, false, false)
								.filter(skill => {
									return get.info(skill)?.taffyold_olhedao && get.info(skill).nopop;
								})
								.map(item => [item, get.translation(item + "_info")]),
							"textbutton",
						],
					],
					true
				)
				.set("ai", () => 1 + Math.random())
				.forResult();
			if (result?.bool && result.links?.length) {
				const [skill] = result.links;
				player.removeSkill(skill);
				target.addSkill(skill);
				lib.skill.taffyold_olhedao.tianshuClear(skill, target, -1);
				let skills = target.getSkills(null, false, false).filter(skill => get.info(skill)?.taffyold_olhedao);
				const num = skills.length - get.info("taffyold_olhedao").getLimit(target);
				skills = skills.slice(0, Math.max(0, num));
				if (skills.length) target.removeSkill(skills);
			}
		},
		ai: {
			order: 1,
			result: { target: 1 },
			combo: "taffyold_olhedao",
		},
	},
	// 旧OL谋董卓
	taffyold_olguanbian: {
		audio: "olguanbian",
		trigger: {
			global: ["phaseBefore", "roundStart"],
			player: ["enterGame", "taffyold_olxiongniAfter", "taffyold_olfengshangAfter"],
		},
		filter(event, player, name) {
			if (name == "roundStart") return game.roundNumber == 2;
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		async content(event, trigger, player) {
			if (event.triggername == "roundStart" || ["taffyold_olxiongni", "taffyold_olfengshang"].includes(trigger.name)) await player.removeSkills(event.name);
			else player.addMark(event.name, game.players.length + game.dead.length, false);
		},
		mod: {
			maxHandcard(player, num) {
				return num + player.countMark("taffyold_olguanbian");
			},
			globalFrom(from, to, current) {
				return current + from.countMark("taffyold_olguanbian");
			},
			globalTo(from, to, current) {
				return current + to.countMark("taffyold_olguanbian");
			},
		},
		intro: {
			content: "<li>手牌上限+#<br><li>计算与其他角色的距离+#<br><li>其他角色计算与你的距离+#",
		},
	},
	taffyold_olxiongni: {
		audio: "olxiongni",
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			if (!game.hasPlayer(target => target != player)) return false;
			return player.countCards("he", card => _status.connectMode || lib.filter.cardDiscardable(card, player));
		},
		async cost(event, trigger, player) {
			const skillName = event.name.slice(0, -5);
			event.result = await player
				.chooseToDiscard(get.prompt2(skillName), "he")
				.set("ai", card => {
					const player = get.player();
					if (!game.hasPlayer(target => player != target && get.damageEffect(target, player, player) > 0)) return 0;
					if (get.suit(card, player) == "heart") return 8 - get.value(card);
					return 7.5 - get.value(card);
				})
				.set("logSkill", [skillName, get.info(skillName).logTarget(trigger, player)])
				.forResult();
		},
		popup: false,
		logTarget: (event, player) => game.filterPlayer(target => target != player).sortBySeat(),
		async content(event, trigger, player) {
			player.changeSkin({ characterName: "taffyold_ol_sb_dongzhuo" }, "ol_sb_dongzhuo_shadow1");
			const suit = get.suit(event.cards[0]);
			for (const target of event.targets) {
				const bool = await target
					.chooseToDiscard(`弃置一张${get.translation(suit)}牌，否则${get.translation(player)}对你造成1点伤害`, "he", (card, player) => {
						return get.event("suit") == get.suit(card);
					})
					.set("ai", card => {
						const player = get.player(),
							target = get.event().getParent().player;
						if (get.damageEffect(player, target, player) > 0) return 0;
						return 7.5 - get.value(card);
					})
					.set("suit", suit)
					.forResultBool();
				if (!bool) await target.damage();
			}
		},
	},
	taffyold_olfengshang: {
		audio: "olfengshang",
		getCards() {
			const cards = [];
			game.checkGlobalHistory("cardMove", evt => {
				if (evt.name != "cardsDiscard" && (evt.name != "lose" || evt.position != ui.discardPile)) return;
				cards.addArray(evt.cards.filterInD("d"));
			});
			return cards;
		},
		enable: "phaseUse",
		trigger: {
			global: "dying",
		},
		filter(event, player) {
			const cards = event.name == "chooseToUse" ? event.taffyold_olfengshang_cards || [] : get.info("taffyold_olfengshang").getCards();
			if (!lib.suit.some(suit => cards.filter(card => get.suit(card) == suit).length > 1)) return false;
			return event.name != "chooseToUse" || !player.hasSkill("taffyold_olfengshang_used", null, null, false);
		},
		onChooseToUse(event) {
			if (!game.online && !event.taffyold_olfengshang_cards) {
				event.set("taffyold_olfengshang_cards", get.info("taffyold_olfengshang").getCards());
			}
		},
		async content(event, trigger, player) {
			if (!trigger) player.addTempSkill(event.name + "_used", "phaseUseAfter");
			if (_status.connectMode) game.broadcastAll(() => (_status.noclearcountdown = true));
			player.changeSkin(
				{
					characterName: "taffyold_ol_sb_dongzhuo",
				},
				"ol_sb_dongzhuo_shadow2"
			);
			const given_map = {};
			event.given_map = given_map;
			const cards = !trigger ? event.getParent(2).taffyold_olfengshang_cards : get.info(event.name).getCards();
			let result;
			while (Object.keys(given_map).length < 2 && cards.length) {
				if (cards.length > 1) {
					result = await player
						.chooseCardButton("封赏：请选择要分配的牌", cards, true)
						.set("filterButton", button => {
							const { link } = button,
								map = get.event().getParent().given_map;
							if (!Object.values(map).flat().length) return get.event("cards").filter(card => get.suit(card) == get.suit(link)).length > 1;
							return get.suit(link) == get.suit(Object.values(map).flat()[0]);
						})
						.set("ai", button => {
							return get.buttonValue(button);
						})
						.set("cards", cards)
						.forResult();
				} else if (cards.length === 1)
					result = {
						bool: true,
						links: cards.slice(0),
					};
				else return;
				if (!result.bool) return;
				const toGive = result.links;
				result = await player
					.chooseTarget("选择获得" + get.translation(toGive) + "的角色", true, (card, player, target) => {
						return !get.event().getParent().given_map[target.playerid];
					})
					.set("ai", target => {
						const att = get.attitude(get.player(), target);
						if (get.event("toEnemy")) return Math.max(0.01, 100 - att);
						else if (att > 0) {
							if (
								player.getUseValue({
									name: "jiu",
								}) &&
								player != target
							)
								return 10;
							return Math.max(0.1, att / Math.sqrt(1 + target.countCards("h") + (get.event().getParent().given_map[target.playerid] || 0)));
						} else return Math.max(0.01, (100 + att) / 200);
					})
					.set("toEnemy", get.value(toGive[0], player, "raw") < 0)
					.forResult();
				if (result.bool) {
					cards.removeArray(toGive);
					const id = result.targets[0].playerid;
					if (!given_map[id]) given_map[id] = [];
					given_map[id].addArray(toGive);
				}
			}
			if (_status.connectMode) {
				game.broadcastAll(() => {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			const gain_list = [];
			for (const i in given_map) {
				const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
				player.line(source, "green");
				game.log(source, "获得了", given_map[i]);
				gain_list.push([source, given_map[i]]);
			}
			await game
				.loseAsync({
					gain_list,
					giver: player,
					animate: "gain2",
				})
				.setContent("gaincardMultiple");
			await game.delayx();
			if (
				!player.hasHistory("gain", evt => evt.getParent(2) == event) &&
				player.hasUseTarget(
					{
						name: "jiu",
						isCard: true,
					},
					true,
					false
				)
			) {
				await player.chooseUseTarget(
					{
						name: "jiu",
						isCard: true,
					},
					true,
					false
				);
			}
		},
		ai: {
			order: 7,
			result: {
				player: 1,
			},
		},
		subSkill: {
			used: {
				charlotte: true,
			},
		},
	},
	//旧OL猴子
	taffyold_olkuangjuan: {
		audio: "olkuangjuan",
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(target => get.info("taffyold_olkuangjuan").filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return target.countCards("h") > player.countCards("h") && !player.getStorage("taffyold_olkuangjuan_used").includes(target);
		},
		content() {
			player.addTempSkill("taffyold_olkuangjuan_used");
			player.markAuto("taffyold_olkuangjuan_used", [target]);
			player.addTempSkill("taffyold_olkuangjuan_effect");
			player.drawTo(target.countCards("h")).gaintag.add("taffyold_olkuangjuan_effect");
		},
		ai: {
			order: 0.1,
			result: {
				player(player, target) {
					return target.countCards("h") - player.countCards("h");
				},
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			effect: {
				charlotte: true,
				trigger: { player: "useCard0" },
				filter(event, player) {
					if (event.addCount === false) return false;
					return player.hasHistory("lose", evt => {
						if (evt.getParent() !== event) return false;
						return Object.values(evt.gaintag_map).flat().includes("taffyold_olkuangjuan_effect");
					});
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					trigger.addCount = false;
					player.getStat("card")[trigger.card.name]--;
				},
				mod: {
					cardUsable(card, player) {
						if (!card.cards || card.cards.length !== 1) return;
						if (get.itemtype(card.cards[0]) === "card" && card.cards[0].hasGaintag("taffyold_olkuangjuan_effect")) return true;
					},
				},
			},
		},
	},
	taffyold_olfeibian: {
		audio: "olfeibian",
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			if (event.player === player) return _status.currentPhase === player;
			return event.targets?.includes(player);
		},
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			const cards = target.getDiscardableCards(target, "h");
			if (cards.length) await target.discard(cards.randomGets(1));
			const info = target.forceCountChoose;
			if (_status.countDown) return;
			let time;
			if (typeof info?.["chooseToUse"] === "number") time = info["chooseToUse"];
			else if (typeof info?.default === "number") time = info.default;
			else {
				if (!_status.connectMode) return;
				time = lib.configOL.choose_timeout;
			}
			if (time) {
				time = parseInt(time);
				if (time > 1) {
					time--;
					target.addTempSkill("taffyold_olfeibian_time", "roundStart");
					target.addMark("taffyold_olfeibian_time", 1, false);
					game.broadcastAll(
						(player, time) => {
							if (!player.forceCountChoose) player.forceCountChoose = {};
							player.forceCountChoose.chooseToUse = time;
						},
						target,
						time
					);
					game.log(target, "出牌时限", "#y-1s");
				}
			}
		},
		group: ["taffyold_olfeibian_init", "taffyold_olfeibian_loseHp"],
		init() {
			game.broadcastAll(() => {
				const countDown = game.countDown;
				if (typeof countDown !== "function") return;
				game.countDown = function (time, onEnd) {
					const newOnEnd = () => {
						const event = get.event();
						if (event?.name === "chooseToUse" && event.player?.isIn()) event.player.addTempSkill("taffyold_olfeibian_effect");
						if (typeof onEnd === "function") onEnd();
					};
					return countDown.call(this, time, newOnEnd);
				};
			});
		},
		subSkill: {
			effect: { charlotte: true },
			time: {
				charlotte: true,
				onremove(player, skill) {
					game.broadcastAll(
						(player, time) => {
							player.forceCountChoose.chooseToUse = time;
						},
						player,
						player.forceCountChoose.chooseToUse + player.countMark(skill)
					);
					delete player.storage[skill];
				},
			},
			init: {
				audio: "olfeibian",
				trigger: { global: "phaseBefore", player: "enterGame" },
				filter: event => event.name !== "phase" || game.phaseNumber === 0,
				forced: true,
				content() {
					game.broadcastAll(player => {
						if (!player.forceCountChoose) player.forceCountChoose = {};
						player.forceCountChoose.chooseToUse = 15;
					}, player);
					game.log(player, "的出牌时限改为了", "#g15s");
				},
			},
			loseHp: {
				audio: "olfeibian",
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					return game.hasPlayer(target => target.hasSkill("taffyold_olfeibian_effect"));
				},
				logTarget(event, player) {
					return game.filterPlayer(target => target.hasSkill("taffyold_olfeibian_effect"));
				},
				forced: true,
				content() {
					for (const i of event.targets) i.loseHp();
				},
			},
		},
	},
	//族杨修 —— by 刘巴
	taffyold_clanjiewu: {
		audio: "clanjiewu",
		trigger: {
			player: "phaseUseBegin",
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt("taffyold_clanjiewu"), "令一名角色的手牌在本阶段对你可见")
				.set("ai", target => {
					let items = target.getCards("h");
					let count = [...new Set(items.map(item => get.suit(item, target)))].length;
					const player = get.player();
					return (4 - count) * get.effect(target, { name: "draw" }, target, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.markAuto(event.name + "_effect", target);
			player.addSkill(event.name + "_effect");
			player
				.when({ global: "phaseUseAfter" })
				.filter(evt => evt === trigger)
				.then(() => player.removeSkill("taffyold_clanjiewu_effect"));
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				trigger: {
					player: "useCardToPlayered",
				},
				filter: (event, player) => event.isFirstTarget,
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt("taffyold_clanjiewu"), "选择一名「捷悟」角色展示其一张手牌")
						.set("filterTarget", (card, player, target) => target.hasCard(true, "h") && player.getStorage("taffyold_clanjiewu_effect").includes(target))
						.set("ai", target => {
							let items = target.getCards("h");
							let count = [...new Set(items.map(item => get.suit(item, target)))].length;
							const player = get.player();
							return (4 - count) * get.effect(target, { name: "draw" }, target, player);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					let cards;
					if (target === player) {
						cards = await player.chooseCard("h", true, `捷悟：展示你的一张手牌`).forResultCards();
					} else {
						cards = await player.choosePlayerCard(target, true, "h", `捷悟：展示${get.translation(target)}的一张手牌`).forResultCards();
					}
					if (!cards?.length) return;
					const card = cards[0];
					await player.showCards(card, `${get.translation(player)}对${get.translation(target)}发动了【捷悟】`).set("taffyold_clanjiewu", true);
					if (get.suit(trigger.card, player) === get.suit(card, target)) await player.draw();
					if (
						game.getGlobalHistory("everything", evt => {
							return evt.name === "showCards" && evt.cards.length && evt.cards.some(c => c === card) && evt?.taffyold_clanjiewu;
						}).length > 1
					) {
						let cardsx;
						if ((target.countCards("h") !== player.countCards("h") && target !== player) || target === player) {
							const putee = player.countCards("h") > target.countCards("h") || target === player ? player : target;
							if (!putee.countCards("he")) return;
							if (player !== putee) {
								cardsx = await player.choosePlayerCard(putee, true, "he", "捷悟：将" + get.translation(putee) + "的一张牌置于牌堆顶").forResultCards();
							} else {
								cardsx = await player.chooseCard("he", true, "捷悟：将你的一张牌置于牌堆顶").forResultCards();
							}
							const card = cardsx[0];
							putee.$throw(get.position(card) == "h" ? 1 : card, 1000);
							game.log(player, "将", putee === player ? "" : get.translation(putee) + "的", get.position(card) == "h" ? "一张牌" : card, "置于牌堆顶");
							await putee.lose(card, ui.cardPile, "insert");
						}
					}
				},
				ai: {
					viewHandcard: true,
					skillTagFilter(player, tag, arg) {
						if (!player.getStorage("taffyold_clanjiewu_effect").includes(arg)) return false;
					},
				},
			},
		},
	},
	taffyold_clangaoshi: {
		audio: "clangaoshi",
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		filter: (event, player) => player.hasHistory("useSkill", evt => ["taffyold_clanjiewu", "taffyold_clanjiewu_effect"].includes(evt.skill)),
		prompt(event, player) {
			return get.prompt("taffyold_clangaoshi") + "（可亮出" + get.cnNumber(player.getHistory("useSkill", evt => ["taffyold_clanjiewu", "taffyold_clanjiewu_effect"].includes(evt.skill)).length) + "张牌）";
		},
		async content(event, trigger, player) {
			const num = player.getHistory("useSkill", evt => {
				return ["taffyold_clanjiewu", "taffyold_clanjiewu_effect"].includes(evt.skill);
			}).length;
			const names = player.getHistory("useCard", evt => evt.isPhaseUsing()).map(evt => evt.card.name);
			let cards = get.cards(num);
			await game.cardsGotoOrdering(cards);
			await player.showCards(cards, `${get.translation(player)}发动了〖高视〗`);
			//game.log(player, "亮出了牌堆顶的", cards);
			while (cards.some(card => player.hasUseTarget(card))) {
				const links = await player
					.chooseButton([`高视：是否使用其中一张牌？`, cards])
					.set("filterButton", button => {
						const player = get.player(),
							card = button.link;
						return player.hasUseTarget(card) && !get.event().names.includes(card.name);
					})
					.set("names", names)
					.set("ai", button => {
						return get.player().getUseValue(button.link);
					})
					.forResultLinks();
				if (!links?.length) break;
				cards.remove(links[0]);
				player.$gain(links[0], false);
				await player.chooseUseTarget(links[0], true, false);
			}
			if (!cards.length) await player.draw(2);
		},
	},
	//旧OL谋卢植
	taffyold_olsibing: {
		audio: "olsibing",
		trigger: {
			player: "useCardToPlayer",
			global: "useCardAfter",
		},
		filter(event, player, name) {
			if (name == "useCardToPlayer") return get.tag(event.card, "damage") > 0.5 && event.targets.length == 1 && player.countDiscardableCards(player, "he", card => get.color(card, player) == "red");
			return get.tag(event.card, "damage") > 0.5 && event.targets.includes(player) && !player.hasHistory("damage", evt => evt.getParent("useCard") == event) && player.countDiscardableCards(player, "he", card => get.color(card, player) == "black") && player.hasUseTarget({ name: "sha", isCard: true }, false, false);
		},
		logTarget(event, player, name) {
			if (name == "useCardToPlayer") return [event.target];
			return [];
		},
		async cost(event, trigger, player) {
			const name = event.triggername;
			if (name == "useCardToPlayer") {
				event.result = await player
					.chooseToDiscard(`###${get.prompt(event.skill, trigger.target)}###弃置任意张红色牌并令其弃置等量红色手牌，否则不能响应该牌`, [1, Infinity], "he", "chooseonly", card => get.color(card, player) == "red")
					.set("ai", card => {
						const player = get.player(),
							target = get.event().getTrigger().target,
							cardx = get.event().getTrigger().card;
						if (get.effect(target, cardx, player, player) < 0 || cardx.name == "huogong") return 0;
						if (ui.selected.cards?.length == target.countCards("h", { color: "red" })) return 0;
						return 7 - get.value(card);
					})
					.forResult();
			} else {
				event.result = await player
					.chooseToDiscard(`###${get.prompt(event.skill)}###弃置一张黑色牌并视为使用一张【杀】`, "he", "chooseonly", card => get.color(card, player) == "black")
					.set("ai", card => {
						if (!get.player().hasValueTarget({ name: "sha", isCard: true }, false, false)) return 0;
						return 6 - get.value(card);
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			const cards = event.cards,
				name = event.triggername;
			await player.discard(cards);
			if (name == "useCardToPlayer") {
				const target = trigger.target;
				const result = await target
					.chooseToDiscard(`司兵：请弃置${cards.length}张红色手牌，或取消令你不可响应${get.translation(trigger.card)}`, cards.length, card => {
						return get.color(card, get.player()) == "red";
					})
					.set("ai", card => {
						const trigger = get.event().getTrigger(),
							player = get.player();
						if (get.event().num > 2 || !player.canRespond(trigger) || trigger.card.name == "huogong") return 0;
						if (player.canRespond(trigger, card)) return 6 - get.value(card);
						return 7 - get.value(card);
					})
					.set("num", cards.length)
					.forResult();
				if (result?.bool === false) {
					trigger.getParent().directHit.add(target);
					target.popup("不可响应");
					game.log(target, "不可响应", trigger.card);
				}
			} else {
				const card = get.autoViewAs({ name: "sha", isCard: true });
				await player.chooseUseTarget(card, true, false, "nodistance");
			}
		},
	},
	taffyold_olliance: {
		audio: "olliance",
		trigger: {
			player: "loseAfter",
			global: ["loseAsyncAfter", "equipAfter", "addToExpansionAfter", "gainAfter", "addJudgeAfter"],
		},
		usable: 1,
		filter(event, player) {
			const bool1 = event.getg && event.getg(player)?.length,
				bool2 = event.getl && event.getl(player)?.hs?.length;
			return (bool1 || bool2) && player.isMinHandcard() && player.countCards("h") < player.maxHp;
		},
		check(event, player) {
			return player.countCards("h") < player.maxHp;
		},
		async content(event, trigger, player) {
			await player.drawTo(player.maxHp);
			player.addTempSkill(event.name + "_damage");
			player.addMark(event.name + "_damage", 1, false);
		},
		subSkill: {
			damage: {
				audio: "olliance",
				charlotte: true,
				forced: true,
				forceDie: true,
				onremove: true,
				trigger: { global: "damageBegin1" },
				content() {
					trigger.num += player.countMark(event.name);
					player.removeSkill(event.name);
				},
				mark: true,
				intro: {
					content: "本回合下一次有角色造成的伤害+#",
				},
			},
		},
	},
};

export default oldOL;
