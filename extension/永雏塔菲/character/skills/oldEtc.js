import { lib, game, ui, get, ai, _status } from "../../extension/noname.js";

/** @type { importCharacterConfig['skill'] } */
const oldEtc = {
	// 旧牛董
	taffyold_twjuntun: {
		audio: "twjuntun",
		trigger: {
			global: ["phaseBefore", "dyingAfter"],
			player: "enterGame",
		},
		init: function (player) {
			lib.skill.taffyold_baonvezhi.change(player, 0);
		},
		direct: true,
		derivation: ["taffyold_twxiongjun", "taffyold_baonvezhi_faq"],
		group: "taffyold_twjuntun_extra",
		filter: function (event, player) {
			return (
				(event.name != "phase" || game.phaseNumber == 0) &&
				game.hasPlayer(current => {
					return !current.hasSkill("taffyold_twxiongjun");
				})
			);
		},
		content: function () {
			"step 0";
			player
				.chooseTarget(get.prompt("taffyold_twjuntun"), "令一名角色获得〖凶军〗", (card, player, target) => {
					return !target.hasSkill("taffyold_twxiongjun");
				})
				.set("ai", target => get.attitude(player, target) - 2);
			("step 1");
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("taffyold_twjuntun", target);
				target.addSkillLog("taffyold_twxiongjun");
				if (target != player) player.addExpose(0.25);
			}
		},
		subSkill: {
			extra: {
				audio: "twjuntun_extra",
				trigger: {
					global: "damageSource",
				},
				forced: true,
				locked: false,
				filter: function (event, player) {
					return event.source && event.source.hasSkill("taffyold_twxiongjun") && event.source != player;
				},
				logTarget: "source",
				content: function () {
					lib.skill.taffyold_baonvezhi.change(player, trigger.num);
				},
			},
		},
	},
	taffyold_baonvezhi: {
		audio: "baonvezhi",
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		silent: true,
		forced: true,
		charlotte: true,
		taffyold_baonvezhi_max: 5,
		change: function (player, num) {
			var taffyold_baonvezhi_max = lib.skill.taffyold_baonvezhi.taffyold_baonvezhi_max;
			player.addSkill("taffyold_baonvezhi");
			var tmp = player.countMark("taffyold_baonvezhi");
			if (tmp + num > taffyold_baonvezhi_max) num = taffyold_baonvezhi_max - tmp;
			else if (tmp + num < 0) num = -tmp;
			if (num === 0) return;
			player[num > 0 ? "addMark" : "removeMark"]("taffyold_baonvezhi", Math.abs(num), false);
			game.log(player, num >= 0 ? "获得了" : "失去了", get.cnNumber(Math.abs(num)) + '点<span class="firetext">暴虐值</span>');
			player[player.countMark("taffyold_baonvezhi") > 0 ? "markSkill" : "unmarkSkill"]("taffyold_baonvezhi");
		},
		filter: function (event, player) {
			return player.countMark("taffyold_baonvezhi") < lib.skill.taffyold_baonvezhi.taffyold_baonvezhi_max;
		},
		content: function () {
			lib.skill.taffyold_baonvezhi.change(player, trigger.num);
		},
		marktext: "暴",
		intro: {
			name: "暴虐值",
			content: function (storage, player) {
				return get.translation(player) + "的暴虐值为" + (player.storage.taffyold_baonvezhi || 0);
			},
		},
	},
	taffyold_baonvezhi_faq: {},
	taffyold_twxiongjun: {
		init: function (player) {
			lib.skill.taffyold_baonvezhi.change(player, 0);
		},
		audio: "twxiongjun",
		trigger: {
			source: "damageSource",
		},
		forced: true,
		// usable: 1,
		content: function () {
			var targets = game.filterPlayer(current => current.hasSkill("taffyold_twxiongjun")).sortBySeat();
			player.line(targets, "green");
			game.asyncDraw(targets);
		},
	},
	taffyold_twxiongxi: {
		audio: "twxiongxi",
		enable: "phaseUse",
		// usable: 1,
		init: function (player) {
			lib.skill.taffyold_baonvezhi.change(player, 0);
		},
		filterCard: () => true,
		selectCard: function () {
			return (lib.skill.taffyold_baonvezhi.taffyold_baonvezhi_max || 5) - _status.event.player.countMark("taffyold_baonvezhi");
		},
		check: function (card) {
			return 6 - get.value(card);
		},
		position: "he",
		filterTarget: function (card, player, target) {
			return player != target && !player.getStorage("taffyold_twxiongxi_target").includes(target);
		},
		content: function () {
			player.addTempSkill("taffyold_twxiongxi_clear", ["phaseUseAfter", "phaseAfter"]);
			player.markAuto("taffyold_twxiongxi_target", [target]);
			player.syncStorage();
			target.damage();
		},
		subSkill: {
			clear: {
				trigger: {
					player: "phaseAfter",
				},
				charlotte: true,
				silent: true,
				onremove: function (player) {
					delete player.storage.taffyold_twxiongxi_target;
				},
			},
		},
		ai: {
			expose: 0.25,
			order: 8,
			result: {
				target: function (player, target) {
					return get.damageEffect(target, player, player);
				},
			},
		},
	},
	taffyold_twxiafeng: {
		audio: "twxiafeng",
		trigger: {
			player: "phaseUseBegin",
		},
		filter: function (event, player) {
			return player.countMark("taffyold_baonvezhi") > 0;
		},
		init: function (player) {
			lib.skill.taffyold_baonvezhi.change(player, 0);
		},
		direct: true,
		content: function () {
			"step 0";
			player
				.chooseButton(["黠凤：选择要消耗的暴虐值", [["taffyold_tw_bn_1", "taffyold_tw_bn_2", "taffyold_tw_bn_3"], "vcard"]], button => {
					var num = player.countCards("hs", card => get.tag(card, "damage") && game.hasPlayer(current => get.effect(current, card, player, player) > 0));
					if (num <= 0) return 0;
					if (num >= 3) num = 3;
					if (button.link[2] == "taffyold_tw_bn_" + num) return 10;
					return 1;
				})
				.set("filterButton", button => {
					var player = _status.event.player;
					var link = button.link[2];
					if (link[link.length - 1] * 1 > player.storage.taffyold_baonvezhi) return false;
					return true;
				});
			("step 1");
			if (result.bool) {
				player.logSkill("taffyold_twxiafeng");
				var link = result.links[0][2],
					num = link[link.length - 1] * 1;
				player.addTempSkill("taffyold_twxiafeng_effect");
				player.storage.taffyold_twxiafeng_effect = num;
				lib.skill.taffyold_baonvezhi.change(player, -num);
			}
		},
		subSkill: {
			effect: {
				trigger: {
					player: "useCard",
				},
				filter: function (event, player) {
					return !player.storage.taffyold_twxiafeng_effect2;
				},
				forced: true,
				content: function () {
					var count = player.getHistory("useCard", evt => evt.getParent("phaseUse").player == player).length;
					if (count == player.storage.taffyold_twxiafeng_effect) {
						player.storage.taffyold_twxiafeng_effect2 = true;
					}
					if (count <= player.storage.taffyold_twxiafeng_effect) {
						trigger.directHit.addArray(game.players);
						if (trigger.addCount !== false) {
							trigger.addCount = false;
							var stat = player.getStat().card,
								name = trigger.card.name;
							if (typeof stat[name] == "number") stat[name]--;
						}
					}
				},
				onremove: function (player) {
					delete player.storage.taffyold_twxiafeng_effect;
					delete player.storage.taffyold_twxiafeng_effect2;
				},
				mod: {
					targetInRange: function (card, player, target, now) {
						if (!player.storage.taffyold_twxiafeng_effect2) return true;
					},
					cardUsableTarget: function (card, player, target) {
						if (!player.storage.taffyold_twxiafeng_effect2) return true;
					},
					maxHandcard: function (player, num) {
						return num + (player.storage.taffyold_twxiafeng_effect || 0);
					},
				},
			},
		},
	},
	// 旧张曼成
	taffyold_twbudao: {
		audio: "twbudao",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		derivation: ["twzhouhu", "twharvestinori", "twzuhuo"],
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		check: function (event, player) {
			return !player.hasUnknown() || !player.hasFriend();
		},
		skillValue: {
			twzhouhu: target => 1,
			twzuhuo: (target, player) => 1,
			twharvestinori: target => 1,
		},
		content: function () {
			"step 0";
			player.awakenSkill("taffyold_twbudao");
			player.loseMaxHp();
			player.recover();
			var skills = lib.skill.taffyold_twbudao.derivation,
				map = lib.skill.taffyold_twbudao.skillValue;
			skills = skills.randomGets(3);
			var target = game.filterPlayer().sort((a, b) => get.attitude(player, b) - get.attitude(player, a))[0];
			if (player.identity == "nei" || get.attitude(player, target) < 6) target = player;
			player
				.chooseControl(skills)
				.set(
					"choiceList",
					skills.map(function (i) {
						return '<div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player) + "</div>";
					})
				)
				.set("displayIndex", false)
				.set("prompt", "布道：选择获得一个技能")
				.set("ai", () => {
					return "twharvestinori";
				})
				.set("choice", skills.sort((a, b) => (map[b](target, player) || 0.5) - (map[a](target, player) || 0.5))[0]);
			("step 1");
			var skill = result.control;
			player.addSkillLog(skill);
			event.taffyold_twbudao_skill = skill;
			player.chooseTarget(lib.filter.notMe, "是否令一名其他角色也获得【" + get.translation(skill) + "】？").set("ai", function (target) {
				var player = _status.event.player;
				if (player.identity == "nei") return 0;
				return get.attitude(player, target);
			});
			("step 2");
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.line(target, "green");
				target.addSkillLog(event.taffyold_twbudao_skill);
				var cards = target.getCards("he");
				if (!cards.length) event.finish();
				else if (cards.length == 1)
					event._result = {
						bool: true,
						cards: cards,
					};
				else target.chooseCard("he", true, "交给" + get.translation(player) + "一张牌作为学费");
			} else event.finish();
			("step 3");
			if (result.bool) target.give(result.cards, player);
		},
	},
	// 旧TW鲍信
	taffyold_twmutao: {
		audio: "twmutao",
		enable: "phaseUse",
		usable: 1,
		filterTarget: function (card, player, target) {
			return target.countCards("h");
		},
		content: function () {
			"step 0";
			event.togive = target.getNext();
			var cards = target.getCards("h", { name: "sha" });
			if (!cards.length) {
				game.log("但", target, "没有", "#y杀", "！");
				event.finish();
			}
			("step 1");
			var cards = target.getCards("h", { name: "sha" }),
				card = cards.randomRemove(1)[0];
			target.give(card, event.togive);
			if (cards.length) {
				event.togive = event.togive.getNext();
				event.redo();
			}
			("step 2");
			target.line(event.togive);
			event.togive.damage(Math.min(3, event.togive.countCards("h", { name: "sha" })), target);
		},
		ai: {
			order: 10,
			result: {
				target: function (player, target) {
					var num = 0,
						numx = target.countCards("h", { name: "sha" }),
						targetx = target;
					for (var i = 0; i < numx; i++) {
						targetx = targetx.next;
						if (targetx == player) targetx = targetx.next;
					}
					var att1 = get.attitude(player, target),
						att2 = get.attitude(player, targetx);
					if (att1 > 0 && att2 < 0) num = 0.25;
					if (att1 < 0 && att2 < 0) num = 4;
					return att1 * num * numx * (targetx.countCards("h", { name: "sha" }) + 1);
				},
			},
		},
	},
	taffyold_twyimou: {
		audio: "twyimou",
		trigger: { global: "damageEnd" },
		filter(event, player) {
			return event.player.isIn() && get.distance(event.player, player) <= 1;
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		content() {
			"step 0";
			if (trigger.player != player) {
				player.addExpose(0.3);
			}
			var target = get.translation(trigger.player);
			var choiceList = ["令" + target + "获得牌堆里的一张【杀】", "令" + target + "将一张手牌交给另一名角色，然后" + target + "摸两张牌", "背水！" + (trigger.player != player ? "将所有手牌交给" + target + "，然后" : "") + "依次执行以上所有选项"];
			var list = ["选项一"];
			if (trigger.player.countCards("h") && game.hasPlayer(t => t !== trigger.player)) {
				list.push("选项二");
			} else {
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			}
			list.push("背水！");
			player
				.chooseControl(list)
				.set("prompt", "毅谋：请选择一项")
				.set("choiceList", choiceList)
				.set("ai", function () {
					var evt = _status.event.getTrigger(),
						list = _status.event.list;
					var player = _status.event.player;
					var target = evt.player;
					if ((target.hp >= target.countCards("h") + 2 || target == player) && list.includes("背水！")) {
						return "背水！";
					}
					if (target.countCards("h") && list.includes("选项二")) {
						return "选项二";
					}
					return "选项一";
				})
				.set("list", list);
			("step 1");
			event.choice = result.control;
			if (event.choice == "背水！" && player != trigger.player) {
				player.give(player.getCards("h"), trigger.player);
			}
			("step 2");
			if (event.choice != "选项二") {
				var card = get.cardPile2(function (card) {
					return card.name == "sha";
				});
				if (card) {
					trigger.player.gain(card, "gain2");
				} else {
					game.log("但牌堆里已经没有", "#y杀", "了！");
				}
				if (event.choice == "选项一") {
					event.finish();
				}
			}
			("step 3");
			if (event.choice != "选项一") {
				if (trigger.player.countCards("h") && game.hasPlayer(t => t !== trigger.player)) {
					trigger.player.chooseCardTarget({
						prompt: "将一张手牌交给另一名其他角色并摸两张牌",
						filterCard: true,
						forced: true,
						filterTarget: lib.filter.notMe,
						ai1(card) {
							return 1 / Math.max(0.1, get.value(card));
						},
						ai2(target) {
							var player = _status.event.player,
								att = get.attitude(player, target);
							if (target.hasSkillTag("nogain")) {
								att /= 9;
							}
							return 4 + att;
						},
					});
				} else {
					event.finish();
				}
			}
			("step 4");
			if (!result?.bool || !result.cards?.length || !result.targets?.length) {
				return;
			}
			var target = result.targets[0];
			trigger.player.line(target);
			trigger.player.give(result.cards, target);
			trigger.player.draw(2);
		},
		ai: {
			threaten: 2.5,
		},
	},
	//旧海外神吕蒙
	taffyold_twshelie: {
		audio: "shelie",
		inherit: "shelie",
		prompt2: () => lib.translate.shelie_info,
		group: "taffyold_twshelie_jingce",
		//什么精策技能啊喂！
		subSkill: {
			round: { charlotte: true },
			count: {
				charlotte: true,
				onremove: true,
				intro: {
					markcount(storage) {
						return storage.length;
					},
					content: "本回合已使用$花色的牌",
				},
			},
			jingce: {
				audio: "shelie",
				trigger: { player: ["phaseJieshuBegin", "useCard1"] },
				filter(event, player) {
					if (player.hasSkill("taffyold_twshelie_round") || player != _status.currentPhase) return false;
					var list = [];
					player.getHistory("useCard", function (evt) {
						if (lib.suit.includes(get.suit(evt.card)) && !list.includes(get.suit(evt.card))) list.push(get.suit(evt.card));
					});
					if (list.length) {
						player.addTempSkill("taffyold_twshelie_count");
						player.storage.taffyold_twshelie_count = list.sort(function (a, b) {
							return lib.suit.indexOf(b) - lib.suit.indexOf(a);
						});
						player.markSkill("taffyold_twshelie_count");
						player.syncStorage("taffyold_twshelie_count");
					}
					return event.name != "useCard" && list.length >= player.hp;
				},
				forced: true,
				locked: false,
				content() {
					"step 0";
					player.addTempSkill("taffyold_twshelie_round", "roundStart");
					player.chooseControl("摸牌阶段", "出牌阶段").set("prompt", "涉猎：请选择要执行的额外阶段");
					("step 1");
					if (result.index == 0) {
						var next = player.phaseDraw();
						event.next.remove(next);
						trigger.getParent().next.push(next);
					}
					if (result.index == 1) {
						var next = player.phaseUse();
						event.next.remove(next);
						trigger.getParent().next.push(next);
					}
				},
			},
		},
	},
	taffyold_twgongxin: {
		audio: "gongxin",
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && current.countCards("h");
			});
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		usable: 1,
		content() {
			"step 0";
			event.num = target.getCards("h").reduce(function (arr, card) {
				return arr.add(get.suit(card, player)), arr;
			}, []).length;
			("step 1");
			var cards = target.getCards("h");
			player
				.chooseButton(2, ["攻心", cards, [["弃置此牌", "置于牌堆顶"], "tdnodes"]])
				.set("filterButton", function (button) {
					var type = typeof button.link;
					if (ui.selected.buttons.length && type == typeof ui.selected.buttons[0].link) return false;
					return true;
				})
				.set("ai", function (button) {
					var target = _status.event.target;
					var type = typeof button.link;
					if (type == "object") return get.value(button.link, target);
				});
			("step 2");
			if (result.bool) {
				if (typeof result.links[0] != "string") result.links.reverse();
				var card = result.links[1],
					choice = result.links[0];
				if (choice == "弃置此牌") target.discard(card);
				else {
					player.showCards(card, get.translation(player) + "对" + get.translation(target) + "发动了【攻心】");
					target.lose(card, ui.cardPile, "visible", "insert");
					game.log(card, "被置于了牌堆顶");
				}
			}
			("step 3");
			if (
				event.num ==
				target.getCards("h").reduce(function (arr, card) {
					return arr.add(get.suit(card, player)), arr;
				}, []).length
			)
				event.finish();
			("step 4");
			var num1 = 0;
			for (var card of target.getCards("h")) {
				if (get.color(card) == "red") num1++;
			}
			var num2 = target.countCards("h") - num1;
			player
				.chooseControl(["红色", "黑色", "cancel2"])
				.set("prompt", "是否令" + get.translation(target) + "本回合无法使用一种颜色的牌？")
				.set("ai", function () {
					return num1 >= num2 ? "红色" : "黑色";
				});
			("step 5");
			if (result.control != "cancel2") {
				player.line(target);
				target.addTempSkill("taffyold_twgongxin2");
				target.markAuto("taffyold_twgongxin2", [result.control == "红色" ? "red" : "black"]);
				game.log(target, "本回合无法使用" + result.control + "牌");
				if (!event.isMine() && !event.isOnline()) game.delayx();
			}
		},
		ai: {
			order: 10,
			expose: 0.25,
			result: {
				target(player, target) {
					return -target.countCards("h");
				},
			},
		},
	},
	taffyold_twgongxin2: {
		mod: {
			cardEnabled2(card, player) {
				const color = get.color(card);
				if (color != "unsure" && player.getStorage("taffyold_twgongxin2").includes(color)) return false;
			},
		},
		charlotte: true,
		onremove: true,
		intro: { content: "本回合内不能使用或打出$牌" },
	},
	//旧幻诸葛果
	taffyold_rexianyuan: {
		audio: "twxianyuan",
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return event.player.hasMark("taffyold_rexianyuan");
		},
		forced: true,
		locked: false,
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player,
				str = get.translation(target);
			const num = target.countMark("taffyold_rexianyuan");
			let choice;
			if (!target.countCards("h")) choice = 1;
			else
				choice = await player
					.chooseControl()
					.set("choiceList", ["观看" + str + "的手牌并将其中至多" + get.cnNumber(num) + "张牌置于牌堆顶", "令" + str + "摸" + get.cnNumber(num) + "张牌"])
					.set("ai", () => (get.attitude(get.player(), get.event().getTrigger().player) > 0 ? 1 : 0))
					.forResult("index");
			if (typeof choice != "number") return;
			if (choice == 0) {
				const result = await player.choosePlayerCard(target, "h", "visible", [1, num], true, '###仙援###<div class="text center">将其中至多' + get.cnNumber(num) + "张牌置于牌堆顶（先选择的在上）</div>").forResult();
				if (result.bool && result.cards?.length) {
					const cards = result.cards.slice();
					target.$throw(cards.length, 1000);
					await target.lose(cards, ui.cardPile, "insert");
				}
			} else await target.draw(num);
			if (_status.currentPhase !== player) target.clearMark("taffyold_rexianyuan");
		},
		limit: 4,
		intro: { content: "mark" },
		group: ["taffyold_rexianyuan_give", "taffyold_rexianyuan_gain"],
		subSkill: {
			give: {
				audio: "twxianyuan",
				enable: "phaseUse",
				filter(event, player) {
					return player.hasMark("taffyold_rexianyuan") && game.hasPlayer(i => lib.skill.taffyold_rexianyuan.subSkill.give.filterTarget(null, player, i));
				},
				filterTarget(card, player, target) {
					return target != player && target.countMark("taffyold_rexianyuan") < lib.skill.taffyold_rexianyuan.limit;
				},
				prompt: "将“仙援”标记分配给其他角色",
				async content(event, trigger, player) {
					const target = event.target;
					const gives = Array.from({ length: player.countMark("taffyold_rexianyuan") }).map((_, i) => get.cnNumber(i + 1) + "枚");
					let give;
					if (gives.length == 1) give = 0;
					else
						give = await player
							.chooseControl(gives)
							.set("ai", () => 0)
							.set("prompt", "仙援：将任意枚“仙援”标记分配给" + get.translation(target))
							.forResult("index");
					if (typeof give != "number") return;
					give++;
					player.removeMark("taffyold_rexianyuan", give);
					target.addMark("taffyold_rexianyuan", give);
				},
				ai: {
					order: 1,
					result: {
						player: 1,
						target(player, target) {
							const sgn = get.sgn(get.attitude(player, target));
							return sgn == 0 ? 0.5 : sgn * (2 - sgn);
						},
					},
				},
			},
			gain: {
				audio: "twxianyuan",
				trigger: { global: "roundStart" },
				filter(event, player) {
					return player.countMark("taffyold_rexianyuan") < lib.skill.taffyold_rexianyuan.limit;
				},
				forced: true,
				locked: false,
				content() {
					player.addMark("taffyold_rexianyuan", Math.min(4, lib.skill.taffyold_rexianyuan.limit - player.countMark("taffyold_rexianyuan")));
				},
			},
		},
	},
	//旧幻曹昂
	taffyold_twchihui: {
		audio: "twchihui",
		audioname: ["huan_caoang_shadow"],
		trigger: { global: "phaseBegin" },
		filter(event, player) {
			return event.player != player && player.hasEnabledSlot();
		},
		async cost(event, trigger, player) {
			const { player: target } = trigger,
				equips = Array.from({ length: 5 })
					.map((_, i) => [i + 1, get.translation(`equip${i + 1}`)])
					.filter(i => player.hasEnabledSlot(`equip${i[0]}`));
			const {
				result: { bool, links },
			} = await player
				.chooseButton(2, [
					"炽灰：请选择你要废除的装备栏和相应操作",
					'<div class="text center">即将废除的装备栏</div>',
					[equips, "tdnodes"],
					`<div class="text center">对${get.translation(target)}执行的操作</div>`,
					[
						[
							["discard", `弃置其牌`],
							["equip", `置入装备牌`],
						],
						"tdnodes",
					],
				])
				.set("filterButton", button => {
					const { link } = button,
						{ player, target } = get.event();
					if (Boolean(ui.selected.buttons.length) == (typeof link == "number")) return false;
					if (ui.selected.buttons.length) {
						return link == "equip" || target.countDiscardableCards(player, "hej");
					}
					return true;
				})
				.set("ai", button => {
					const { link } = button,
						{ player, target, list } = get.event();
					let att = get.attitude(player, target);
					if (att < 0) {
						att = -Math.sqrt(-att);
					} else {
						att = Math.sqrt(att);
					}
					const eff = att * lib.card.guohe.ai.result.target(player, target);
					if (!ui.selected.buttons.length) {
						const bool = player.hasSkill("taffyold_twfuxi");
						const getVal = num => {
							const card = player.getEquip(`equip${num}`);
							if (card) {
								const val = get.value(card);
								if (val > 0) return 0;
								return 5 - val;
							}
							switch (num) {
								case "3":
									return 4.5;
								case "4":
									return 4.4;
								case "5":
									return 4.3;
								case "2":
									return (3 - player.hp) * 1.5;
								case "1": {
									if (game.hasPlayer(current => (get.realAttitude || get.attitude)(player, current) < 0 && get.distance(player, current) > 1) && !bool) return 0;
									return bool ? 4.9 : 3.2;
								}
							}
						};
						list.sort((a, b) => getVal(b) - getVal(a));
						if (link == list[0]) return 1;
						return 0;
					}
					if (link == "discard" && eff < 0) return 0;
					if ((att < 0 || target.isMaxEquip()) && link == "equip") return 0;
					return 1;
				})
				.set("target", target)
				.set(
					"list",
					equips.map(i => i[0])
				);
			event.result = {
				bool: bool,
				cost_data: links,
			};
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const { player: target } = trigger,
				{ cost_data: links } = event;
			await player.disableEquip(`equip${links[0]}`);
			if (links[1] == "discard") {
				if (target.countDiscardableCards(player, "hej")) await player.discardPlayerCard(target, "hej", true);
			} else {
				const equip = get.cardPile2(card => get.subtype(card) == `equip${links[0]}`);
				if (equip) {
					await target.equip(equip);
					await game.delayx();
				}
			}
			await player.loseHp();
			const num = player.getDamagedHp();
			if (num) await player.draw(num);
		},
	},
	taffyold_twfuxi: {
		audio: "twfuxi",
		persevereSkill: true,
		trigger: { player: ["dying", "disableEquipAfter"] },
		filter(event, player) {
			return event.name == "dying" || !player.hasEnabledSlot();
		},
		async cost(event, trigger, player) {
			const {
				result: { bool, links },
			} = await player
				.chooseButton([
					get.prompt(event.name.slice(0, -5)),
					[
						[
							["phase", "当前回合结束后执行一个额外的回合"],
							["taffyold_twchihui", `保留〖炽灰〗直到下次退幻`],
							["draw", `摸牌至体力上限`],
							["enable", `恢复所有装备栏`],
						],
						"textbutton",
					],
				])
				.set("filterButton", button => {
					const { link } = button,
						player = get.player();
					if (link == "draw" && player.countCards("h") >= player.maxHp) return false;
					if (link == "enable" && player.hasEnabledSlot()) return false;
					return true;
				})
				.set("ai", button => {
					const { link } = button,
						player = get.player();
					const num = player.getAllHistory("useSkill", evt => evt.skill == "taffyold_twfuxi")?.lastItem?.taffyold_twfuxi_num;
					if (num == 2 && player.maxHp <= 2 && ui.selected.buttons.length) return 0;
					if (link == "enable") return 5;
					if (link == "draw") return 5 - player.countCards("h");
					if (link == "phase") return Math.max(4, player.countCards("h"));
					return 1;
				})
				.set("selectButton", [1, 2]);
			event.result = {
				bool: bool,
				cost_data: links,
			};
		},
		async content(event, trigger, player) {
			const { cost_data: choices } = event,
				num = choices.length,
				history = player.getAllHistory("useSkill", evt => evt.skill == event.name);
			const skills = ["taffyold_twchihui", "taffyold_twfuxi"];
			if (history.length) {
				history[history.length - 1][event.name + "_num"] = num;
			}
			if (choices.includes("phase")) {
				game.log(player, "选择了", "#y选项一");
				player.addTempSkill(event.name + "_mark");
				player.insertPhase();
			}
			if (choices.includes("taffyold_twchihui")) {
				game.log(player, "选择了", "#y选项二");
				skills.remove("taffyold_twchihui");
			}
			if (choices.includes("draw")) {
				game.log(player, "选择了", "#y选项三");
				await player.drawTo(Math.min(player.maxHp, 5));
			}
			if (choices.includes("enable")) {
				game.log(player, "选择了", "#y选项四");
				const list = Array.from({ length: 5 })
					.map((_, i) => `equip${i + 1}`)
					.filter(i => player.hasDisabledSlot(i));
				await player.enableEquip(list);
			}
			await player.recoverTo(player.maxHp);
			player.changeSkin({ characterName: "taffyold_huan_caoang" }, "huan_caoang_shadow");
			await player.changeSkills(["taffyold_twhuangzhu", "taffyold_twliyuan", "taffyold_twjifa"], skills);
		},
		derivation: ["taffyold_twhuangzhu", "taffyold_twliyuan", "taffyold_twjifa"],
		subSkill: {
			mark: {
				charlotte: true,
				mark: true,
				intro: {
					content: "本回合结束后执行一个额外回合",
				},
			},
		},
	},
	taffyold_twhuangzhu: {
		audio: "twhuangzhu",
		audioname: ["huan_caoang"],
		trigger: { player: ["phaseZhunbeiBegin", "phaseUseBegin"] },
		filter(event, player) {
			if (event.name == "phaseZhunbei") return player.hasDisabledSlot();
			return player.getStorage("taffyold_twhuangzhu_effect").length;
		},
		async cost(event, trigger, player) {
			if (trigger.name == "phaseZhunbei") {
				const list = Array.from({ length: 5 })
					.map((_, i) => `equip${i}`)
					.filter(i => player.hasDisabledSlot(i))
					.concat(["cancel2"]);
				const control = await player
					.chooseControl(list)
					.set("prompt", "煌烛：选择一个已废除装备栏的类别")
					.set("prompt2", "从牌堆或弃牌堆中随机获得一张对应副类别的装备牌，并记录其牌名")
					.set("ai", () => {
						return get
							.event()
							.controls.filter(i => i !== "cancel2")
							.randomGet();
					})
					.forResultControl();
				event.result = {
					bool: control != "cancel2",
					cost_data: control,
				};
			} else {
				const storag = player.getStorage("taffyold_twhuangzhu_effect");
				const {
					result: { bool, links },
				} = await player.chooseButton(['###煌烛：是否选择或替换至多两个牌名？###<div class="text center">你视为拥有选择牌名的技能</div>', [storag, "vcard"]], [1, 2]).set("ai", button => get.equipValue({ name: button.link[2] }, get.player()));
				event.result = {
					bool: bool,
					cost_data: links,
				};
			}
		},
		async content(event, trigger, player) {
			const { cost_data } = event;
			if (trigger.name == "phaseZhunbei") {
				const equip = get.cardPile(card => get.subtype(card) == cost_data);
				if (equip) {
					await player.gain(equip, "gain2");
					await game.delayx();
					player.addSkill(event.name + "_effect");
					player.markAuto(event.name + "_effect", [get.name(equip)]);
				}
			} else {
				const equip = event.name + "_equip";
				const subtypes = cost_data.map(name => get.subtypes(name[2])).flat();
				player.unmarkAuto(
					equip,
					player.getStorage(equip).filter(name => subtypes.some(t => get.subtypes(name[2]).includes(t)))
				);
				player.addSkill(equip);
				player.markAuto(equip, cost_data);
				player.addAdditionalSkill(
					equip,
					player
						.getStorage(equip)
						.map(name => lib.card[name[2]]?.skills || [])
						.flat()
				);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: { content: "已记录牌名：$" },
			},
			equip: {
				charlotte: true,
				mod: {
					globalFrom(from, to, distance) {
						return distance + from.getStorage("taffyold_twhuangzhu_equip").reduce((sum, name) => sum + (lib.card[name[2]]?.distance?.globalFrom || 0), 0);
					},
					globalTo(from, to, distance) {
						return distance + to.getStorage("taffyold_twhuangzhu_equip").reduce((sum, name) => sum + (lib.card[name[2]]?.distance?.globalTo || 0), 0);
					},
					attackRange(from, distance) {
						return distance - from.getStorage("taffyold_twhuangzhu_equip").reduce((sum, name) => sum + (lib.card[name[2]]?.distance?.attackFrom || 0), 0);
					},
					attackTo(from, to, distance) {
						return distance + to.getStorage("taffyold_twhuangzhu_equip").reduce((sum, name) => sum + (lib.card[name[2]]?.distance?.attackTo || 0), 0);
					},
				},
				onremove(player, skill) {
					player.removeAdditionalSkill(skill);
				},
				intro: {
					markcount: "expansion",
					mark(dialog, storage = []) {
						if (!storage.length) return "当前未视为装备任意牌";
						dialog.addText("当前视为装备");
						dialog.addSmall([storage, "vcard"]);
					},
				},
				trigger: { player: "enableEquipEnd" },
				filter(event, player) {
					if (!event.slots?.length) return false;
					return player.getStorage("taffyold_twhuangzhu_equip").some(name => event.slots.some(t => get.subtypes(name[2]).includes(t)));
				},
				forced: true,
				popup: false,
				content() {
					player.unmarkAuto(
						event.name,
						player.getStorage(event.name).filter(name => trigger.slots.some(t => get.subtypes(name[2]).includes(t)))
					);
					if (!player.getStorage(event.name).length) player.removeSkill(event.name);
				},
			},
		},
	},
	taffyold_twliyuan: {
		audio: "twliyuan",
		audioname: ["huan_caoang"],
		mod: {
			targetInRange(card) {
				if (card.storag?.taffyold_twliyuan) return true;
			},
			cardUsable(card, player, num) {
				if (card.storag?.taffyold_twliyuan) return Infinity;
			},
		},
		enable: ["chooseToUse", "chooseToRespond"],
		filterCard(card, player) {
			return get.subtypes(card).some(i => player.hasDisabledSlot(i));
		},
		locked: false,
		viewAs: {
			name: "sha",
			storage: {
				taffyold_twliyuan: true,
			},
		},
		filter(event, player) {
			return player.countCards("hes", card => get.subtypes(card).some(i => player.hasDisabledSlot(i)));
		},
		position: "hes",
		precontent() {
			player
				.when({ player: ["useCard", "respond"] })
				.filter(evt => evt.skill == "taffyold_twliyuan")
				.then(() => player.draw(2));
			event.getParent().addCount = false;
		},
		prompt: "将一张与你已废除的装备栏对应副类别的装备牌当【杀】使用或打出",
		check(card) {
			const val = get.value(card);
			if (_status.event.name == "chooseToRespond") return 1 / Math.max(0.1, val);
			return 6 - val;
		},
	},
	taffyold_twjifa: {
		audio: "twjifa",
		trigger: { player: "dying" },
		forced: true,
		async content(event, trigger, player) {
			const num = player.getAllHistory("useSkill", evt => evt.skill == "taffyold_twfuxi")?.lastItem?.taffyold_twfuxi_num;
			if (num > 0) await player.loseMaxHp(num);
			const control = await player
				.chooseControl(["taffyold_twhuangzhu", "taffyold_twliyuan"])
				.set("prompt", "选择保留的技能")
				.set("ai", () => {
					return get.event().controls.randomGet();
				})
				.forResultControl();
			await player.recoverTo(player.maxHp);
			player.changeSkin({ characterName: "taffyold_huan_caoang" }, "huan_caoang");
			await player.changeSkills(["taffyold_twchihui", "taffyold_twfuxi"], ["taffyold_twhuangzhu", "taffyold_twliyuan", "taffyold_twjifa"].remove(control));
		},
	},
	// 旧欢杀神司马懿
	taffyold_baby_renjie: {
		audio: "renjie2",
		trigger: {
			player: ["damageEnd", "loseAfter"],
			global: "loseAsyncAfter",
		},
		forced: true,
		group: "taffyold_baby_renjie_begin",
		filter: function (event, player) {
			if (event.name == "damage") return event.num > 0;
			if (event.type != "discard" || event.getlx === false) return false;
			var evt = event.getParent("phaseDiscard"),
				evt2 = event.getl(player);
			return evt && evt2 && evt.name == "phaseDiscard" && evt.player == player && evt2.cards2 && evt2.cards2.length > 0;
		},
		content: function () {
			player.addMark("taffyold_baby_renjie", trigger.name == "damage" ? trigger.num : trigger.getl(player).cards2.length);
		},
		intro: {
			name2: "忍",
			content: "mark",
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			combo: "taffyold_baby_jilue",
		},
		subSkill: {
			begin: {
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				forced: true,
				filter: function (event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				audio: "taffyold_baby_jilue",
				forced: true,
				unique: true,
				content: function () {
					player.addMark("taffyold_baby_renjie", 1);
				},
			},
		},
	},
	taffyold_baby_jilue: {
		audio: "sbaiyin",
		group: ["taffyold_baby_jilue_guicai", "taffyold_baby_jilue_fangzhu", "taffyold_baby_jilue_wansha", "taffyold_baby_jilue_jizhi", "taffyold_baby_jilue_qixi", "taffyold_baby_jilue_draw"],
		derivation: ["taffyold_baby_jilue_guicai", "taffyold_baby_jilue_fangzhu", "taffyold_baby_jilue_jizhi", "taffyold_baby_jilue_qixi", "taffyold_baby_jilue_wansha"],
		subfrequent: ["draw"],
		subSkill: {
			guicai: {
				audio: "jilue_guicai",
				trigger: {
					global: "judge",
				},
				direct: true,
				filter: function (event, player) {
					return player.countCards("hes") > 0 && player.hasMark("taffyold_baby_renjie");
				},
				content: function () {
					"step 0";
					player.chooseCard("是否弃置一枚“忍”，并发动〖鬼才〗？", get.skillInfoTranslation("taffyold_baby_jilue_guicai"), "he", function (card) {
						var player = _status.event.player;
						var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
						if (mod2 != "unchanged") return mod2;
						var mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
						if (mod != "unchanged") return mod;
						return true;
					}).ai = function (card) {
						var trigger = _status.event.parent._trigger;
						var player = _status.event.player;
						var result = trigger.judge(card) - trigger.judge(trigger.player.judging[0]);
						var attitude = get.attitude(player, trigger.player);
						if (attitude == 0 || result == 0) return 0;
						if (attitude > 0) {
							return result - get.value(card) / 2;
						} else {
							return -result - get.value(card) / 2;
						}
					};
					("step 1");
					if (result.bool) {
						player.respond(result.cards, "highlight", "taffyold_baby_jilue_guicai", "noOrdering");
					} else {
						event.finish();
					}
					("step 2");
					if (result.bool) {
						player.removeMark("taffyold_baby_renjie", 1);
						if (trigger.player.judging[0].clone) {
							trigger.player.judging[0].clone.delete();
							game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
						}
						game.cardsDiscard(trigger.player.judging[0]);
						trigger.player.judging[0] = result.cards[0];
						trigger.orderingCards.addArray(result.cards);
						game.log(trigger.player, "的判定牌改为", result.cards[0]);
						game.delay(2);
					}
				},
				ai: {
					rejudge: true,
					tag: {
						rejudge: 1,
					},
				},
			},
			fangzhu: {
				audio: "jilue_fangzhu",
				trigger: {
					player: "damageEnd",
				},
				direct: true,
				filter: function (event, player) {
					return player.hasMark("taffyold_baby_renjie");
				},
				content: function () {
					"step 0";
					player.chooseTarget("是否弃置一枚“忍”，并发动【放逐】？", get.skillInfoTranslation("taffyold_baby_jilue_fangzhu"), function (card, player, target) {
						return player != target;
					}).ai = function (target) {
						if (target.hasSkillTag("noturn")) return 0;
						if (target.isTurnedOver()) {
							return get.attitude(player, target) - 1;
						}
						return -get.attitude(player, target) - 1;
					};
					("step 1");
					if (result.bool) {
						player.removeMark("taffyold_baby_renjie", 1);
						player.logSkill("taffyold_baby_jilue_fangzhu", result.targets);
						player.draw();
						result.targets[0].draw();
						result.targets[0].turnOver();
					}
				},
				ai: {
					maixie: true,
					maixie_hp: true,
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
								if (target.hp <= 1) return;
								if (!target.hasFriend()) return;
								var hastarget = false;
								var turnfriend = false;
								var players = game.filterPlayer();
								for (var i = 0; i < players.length; i++) {
									if (get.attitude(target, players[i]) < 0 && !players[i].isTurnedOver()) {
										hastarget = true;
									}
									if (get.attitude(target, players[i]) > 0 && players[i].isTurnedOver()) {
										hastarget = true;
										turnfriend = true;
									}
								}
								if (get.attitude(player, target) > 0 && !hastarget) return;
								if (turnfriend) return [0.5, 1];
								if (target.hp > 1) return [1, 1];
							}
						},
					},
				},
			},
			wansha: {
				audio: "jilue_wansha",
				global: "taffyold_baby_jilue_wansha_global",
				trigger: {
					global: "dyingBegin",
				},
				// logTarget: 'player',
				prompt: "是否弃一枚“忍”，本回合获得【完杀】？",
				prompt2: () => get.skillInfoTranslation("taffyold_baby_jilue_wansha"),
				filter: function (event, player) {
					if (!player.hasMark("taffyold_baby_renjie")) return false;
					if (player.hasSkill("taffyold_baby_jilue_wansha_clear")) return false;
					return player == _status.currentPhase;
				},
				content: function () {
					player.removeMark("taffyold_baby_renjie", 1);
					player.addTempSkill("taffyold_baby_jilue_wansha_clear");
				},
			},
			wansha_global: {
				mod: {
					cardEnabled: function (card, player) {
						var source = _status.currentPhase;
						if (card.name == "tao" && source && source != player && source.hasSkill("taffyold_baby_jilue_wansha_clear")) return false;
					},
					cardSavable: function (card, player) {
						var source = _status.currentPhase;
						if (card.name == "tao" && source && source != player && source.hasSkill("taffyold_baby_jilue_wansha_clear")) return false;
					},
				},
			},
			wansha_clear: {
				charlotte: true,
			},
			jizhi: {
				audio: "jilue_jizhi",
				trigger: {
					player: "useCard",
				},
				prompt: "是否弃一枚“忍”，发动【集智】？",
				prompt2: () => get.skillInfoTranslation("taffyold_baby_jilue_jizhi"),
				filter: function (event, player) {
					return get.type(event.card) == "trick" && event.card.isCard && player.hasMark("taffyold_baby_renjie");
				},
				content: function () {
					player.removeMark("taffyold_baby_renjie", 1);
					player.draw();
				},
				ai: {
					threaten: 1.4,
					noautowuxie: true,
				},
			},
			qixi: {
				audio: "jilue_zhiheng",
				trigger: { player: "phaseUseBegin" },
				filter: function (event, player) {
					return player.hasMark("taffyold_baby_renjie");
				},
				direct: true,
				content: function () {
					"step 0";
					player.chooseTarget("是否弃置一枚“忍”，并发动【奇袭】？", get.skillInfoTranslation("taffyold_baby_jilue_qixi"), function (card, player, target) {
						return player != target && target.countCards("he") > 0;
					}).ai = function (target) {
						return -get.attitude(player, target);
					};
					("step 1");
					if (result.bool && result.targets && result.targets.length) {
						player.removeMark("taffyold_baby_renjie", 1);
						player.logSkill("taffyold_baby_jilue_qixi", result.targets);
						player.discardPlayerCard(result.targets[0], true);
					}
				},
			},
			draw: {
				trigger: {
					player: "logSkill",
				},
				frequent: true,
				prompt2: "当你每回合首次发动〖极略〗后，可摸一张牌",
				filter: function (event, player) {
					return event.skill.indexOf("taffyold_baby_jilue_") == 0 && player.getHistory("useSkill", evt => evt.skill.indexOf("taffyold_baby_jilue_") == 0).length == 1;
				},
				content: function () {
					player.draw();
				},
			},
		},
	},
	taffyold_baby_lianpo: {
		audio: "lianpo",
		trigger: {
			global: "phaseAfter",
		},
		frequent: true,
		filter: function (event, player) {
			return player.getStat("kill") > 0;
		},
		content: function () {
			player.insertPhase();
		},
	},
	// 极关羽
	taffyold_wechatyihan: {
		audio: 2,
		shiwuSkill: true,
		categories: () => ["奋武技"],
		shiwuAble(player, skill) {
			return (
				player.getRoundHistory("useSkill", evt => evt.skill == skill).length <
				Math.min(
					5,
					player
						.getRoundHistory("damage", () => true)
						.concat(player.getRoundHistory("sourceDamage", () => true))
						.reduce((sum, evt) => sum + evt.num, 0) + 1
				)
			);
		},
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(current => player != current) && get.info("taffyold_wechatyihan").shiwuAble(player, "taffyold_wechatyihan");
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const { target } = event,
				sha = get.autoViewAs({ name: "sha", isCard: true });
			const bool = await target
				.chooseToUse(function (card, player, event) {
					if (get.type(card) == "equip") return false;
					return lib.filter.filterCard.apply(this, arguments);
				}, `翊汉：是否使用一张非装备牌，若你不使用，则${get.translation(player)}视为对你使用一张【杀】`)
				.set("addCount", false)
				.forResultBool();
			if (!bool && player.canUse(sha, target, false, false)) await player.useCard(sha, target, false);
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					return -1;
				},
			},
		},
	},
	taffyold_wechatwuwei: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => get.info("taffyold_wechatyihan").filterTarget(null, player, current)) && player.countCards("he");
		},
		filterTarget(card, player, target) {
			return target.countDiscardableCards(player, "hej");
		},
		filterCard: true,
		selectCard: [1, Infinity],
		position: "he",
		check(card) {
			if (ui.selected.cards.length > 2) return 0;
			return 7.5 - get.value(card);
		},
		async content(event, trigger, player) {
			const { cards, target } = event,
				num1 = cards.reduce((sum, card) => sum + get.number(card), 0);
			const links = await player.discardPlayerCard(target, "hej", cards.length, true).forResultLinks();
			if (!links || !links.some(card => get.type(card) == "equip")) return;
			const num2 = links.filter(card => get.type(card) == "equip").reduce((sum, card) => sum + get.number(card), 0);
			if (num1 <= num2) await target.damage("thunder");
		},
		ai: {
			order: 10,
			result: {
				player(player, target) {
					return get.effect(target, { name: "guohe_copy2" }, player, player);
				},
			},
		},
	},
	//极曹操
	taffyold_wechatdelu: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			if (player.hasSkillTag("noCompareSource")) return false;
			return game.hasPlayer(target => lib.skill.taffyold_wechatdelu.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return player.canCompare(target) && target.getHp() <= player.getHp();
		},
		usable: 1,
		selectTarget: [1, Infinity],
		multitarget: true,
		multiline: true,
		content() {
			"step 0";
			player.draw();
			player.addTempSkill("taffyold_wechatdelu_compare");
			("step 1");
			player
				.chooseToCompare(targets, function (card) {
					return get.number(card);
				})
				.setContent("chooseToCompareMeanwhile");
			("step 2");
			if (result.winner) {
				var targetx = [player].addArray(targets).sortBySeat(player);
				targetx.remove(result.winner);
				for (var target of targetx) result.winner.gainPlayerCard(target, "hej", true);
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					if (target.countCards("he") > 1) return -3;
					return -1;
				},
			},
		},
		subSkill: {
			compare: {
				charlotte: true,
				trigger: { player: "compare" },
				filter(event, player) {
					return event.getParent().name == "taffyold_wechatdelu" && !event.iwhile;
				},
				forced: true,
				popup: false,
				content() {
					var num = trigger.lose_list.length;
					trigger.num1 += num;
					if (trigger.num1 > 13) trigger.num1 = 13;
					game.log(player, "的拼点牌点数+", num);
				},
			},
		},
	},
	taffyold_wechatzhujiu: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			if (!player.countCards("h")) return false;
			return game.hasPlayer(target => lib.skill.taffyold_wechatzhujiu.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h");
		},
		usable: 1,
		content() {
			"step 0";
			var next = player
				.chooseCardOL([player, target], "煮酒：请选择要交换的牌", true)
				.set("ai", card => -get.value(card))
				.set("source", player);
			next.aiCard = function (target) {
				var hs = target.getCards("h");
				return { bool: true, cards: [hs.randomGet()] };
			};
			next._args.remove("glow_result");
			("step 1");
			var cards = [result[0].cards, result[1].cards];
			event.cards = cards;
			game.loseAsync({
				player: player,
				target: target,
				cards1: result[0].cards,
				cards2: result[1].cards,
			}).setContent("swapHandcardsx");
			("step 2");
			game.loseAsync({
				gain_list: [
					[player, cards[1].filterInD()],
					[target, cards[0].filterInD()],
				],
			}).setContent("gaincardMultiple");
			("step 3");
			game.delayx();
			("step 4");
			var card1 = cards[0][0];
			var card2 = cards[1][0];
			if (get.color(card1, player) == get.color(card2, target)) player.recover();
			else {
				player.line(target);
				target.damage();
			}
		},
		ai: {
			order: 9,
			result: { target: -1 },
		},
	},
	//极诸葛亮
	taffyold_wechatsangu: {
		init(player) {
			player.storage.taffyold_wechatsangu_count = game.getAllGlobalHistory("useCard", evt => evt.targets && evt.targets.includes(player)).length;
			player.markSkill("taffyold_wechatsangu_count");
			player.addSkill("taffyold_wechatsangu_count");
		},
		onremove(player) {
			delete player.storage.taffyold_wechatsangu_count;
			player.unmarkSkill("taffyold_wechatsangu_count");
			player.removeSkill("taffyold_wechatsangu_count");
		},
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			//if(player.countMark('taffyold_wechatmoulvenum')>=lib.skill.taffyold_wechatmoulvenum.getMax) return false;
			return game.getAllGlobalHistory("useCard", evt => evt.targets && evt.targets.includes(player)).indexOf(event.getParent()) % 3 == 2;
		},
		forced: true,
		content() {
			"step 0";
			lib.skill.taffyold_wechatmoulvenum.changeNum(3, player);
			("step 1");
			player.chooseToGuanxing(3);
		},
		subSkill: {
			count: {
				charlotte: true,
				trigger: { target: "useCardToTargeted" },
				forced: true,
				popup: false,
				priority: 114514,
				content() {
					player.storage.taffyold_wechatsangu_count = game.getAllGlobalHistory("useCard", evt => evt.targets && evt.targets.includes(player)).length;
					player.markSkill("taffyold_wechatsangu_count");
				},
				intro: {
					markcount(storage, player) {
						return ((storage || 0) % 3).toString();
					},
					content(storage, player) {
						return "获得" + (get.MouLveInform ? get.MouLveInform() : "谋略值") + "进度：" + ((storage || 0) % 3) + "/3";
					},
				},
			},
		},
		derivation: ["taffyold_wechatmiaoji"],
	},
	taffyold_wechatyanshi: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return event.taffyold_wechatyanshi;
		},
		onChooseToUse(event) {
			if (!game.online && !event.taffyold_wechatyanshi) event.set("taffyold_wechatyanshi", ui.cardPile.childNodes.length);
		},
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("###演势###" + lib.translate.taffyold_wechatyanshi_info);
			},
			chooseControl: () => ["牌堆顶", "牌堆底", "cancel2"],
			check(event, player) {
				var card1 = get.cards(1, true)[0];
				var card2 = get.bottomCards(1, true)[0];
				if (player.hasValueTarget(card1) && player.getCardUsable(card1) > 0) return "牌堆顶";
				if (player.hasValueTarget(card2) && player.getCardUsable(card2) > 0) return "牌堆底";
				return get.value(card1) >= get.value(card2) ? "牌堆顶" : "牌堆底";
			},
			backup(result) {
				var next = get.copy(lib.skill.taffyold_wechatyanshi.subSkill.draw);
				next.position = result.control;
				return next;
			},
		},
		ai: {
			order: 10,
			result: { player: 1 },
		},
		subSkill: {
			draw: {
				audio: "taffyold_wechatyanshi",
				content() {
					var position = lib.skill.taffyold_wechatyanshi_backup.position;
					player.addTempSkill("taffyold_wechatyanshi_effect", "phaseUseAfter");
					player.popup(position);
					var next = player.draw();
					if (position == "牌堆底") next.bottom = true;
					next.gaintag = ["taffyold_wechatyanshi_effect"];
				},
			},
			effect: {
				charlotte: true,
				onremove: function (player) {
					player.removeGaintag("taffyold_wechatyanshi_effect");
				},
				trigger: { player: "useCard" },
				filter: function (event, player) {
					return player.getHistory("lose", function (evt) {
						if (evt.getParent() != event) return false;
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("taffyold_wechatyanshi_effect")) return true;
						}
						return false;
					}).length;
				},
				forced: true,
				popup: false,
				content: function () {
					delete player.getStat("skill").taffyold_wechatyanshi;
					player.popup("演势");
					game.log(player, "重置了技能", "#g【演势】");
				},
			},
		},
	},
	//谋略值
	taffyold_wechatmoulvenum: {
		changeNum(num, player) {
			if (typeof num != "number" || num == 0) return;
			var numx = player.countMark("taffyold_wechatmoulvenum");
			if (num > 0 && numx >= 5) return;
			if (num < 0 && !numx) return;
			game.addGlobalSkill("taffyold_wechatmiaoji");
			num = Math[num > 0 ? "min" : "max"](num, (num > 0 ? 5 : 0) - numx);
			player[num > 0 ? "addMark" : "removeMark"]("taffyold_wechatmoulvenum", Math.abs(num), false);
			game.log(player, num > 0 ? "获得了" : "失去了", num > 0 ? "#g" + num : "#y" + -num, "点", "谋略值");
		},
		marktext: "谋",
		intro: {
			name: "谋略值",
			content: "当前拥有#点" + (get.MouLveInform ? get.MouLveInform() : "谋略值"),
		},
		getMax: 5,
	},
	// 妙计
	taffyold_wechatmiaoji: {
		audio: 2,
		audioname2: {
			wechat_zhiyin_zhugeliang: "taffyold_wechatsangu",
		},
		forceaudio: true,
		list: {
			guohe: 1,
			wuxie: 2,
			wuzhong: 3,
		},
		subSkill: {
			used: { charlotte: true },
			taffyold_wechat_ji_zhugeliang: { audio: 2 },
		},
		enable: "chooseToUse",
		hiddenCard(player, name) {
			if (player.hasSkill("taffyold_wechatmiaoji_used")) return false;
			const list = lib.skill.taffyold_wechatmiaoji.list;
			return list[name] && player.countMark("taffyold_wechatmoulvenum") >= list[name];
		},
		filter(event, player) {
			if (player.hasSkill("taffyold_wechatmiaoji_used")) return false;
			var num = player.countMark("taffyold_wechatmoulvenum");
			if (!num) return false;
			const list = lib.skill.taffyold_wechatmiaoji.list;
			for (var namex in list) {
				if (num < list[namex]) continue;
				if (event.filterCard({ name: namex, isCard: true }, player, event)) return true;
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [],
					num = player.countMark("taffyold_wechatmoulvenum");
				const listx = lib.skill.taffyold_wechatmiaoji.list;
				for (var namex in listx) {
					if (num < listx[namex]) continue;
					if (event.filterCard({ name: namex, isCard: true }, player, event)) list.push(["锦囊", "", namex]);
				}
				return ui.create.dialog("妙计", [list, "vcard"], "hidden");
			},
			check(button) {
				var player = _status.event.player;
				return player.getUseValue({ name: button.link[2], nature: button.link[3] });
			},
			backup(links, player) {
				return {
					selectCard: -1,
					filterCard: () => false,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						isCard: true,
					},
					precontent() {
						player.logSkill("taffyold_wechatmiaoji");
						player.addTempSkill("taffyold_wechatmiaoji_used");
						delete event.result.skill;
						var num = lib.skill.taffyold_wechatmiaoji.list[event.result.card.name];
						lib.skill.taffyold_wechatmoulvenum.changeNum(-num, player);
					},
				};
			},
			prompt(links, player) {
				var name = links[0][2];
				var num = lib.skill.taffyold_wechatmiaoji.list[name];
				return "失去" + num + "点" + (get.MouLveInform ? get.MouLveInform() : "谋略值") + "，视为使用" + get.translation(name);
			},
		},
		ai: {
			order: 1,
			result: { player: 1 },
		},
	},
	//极孙笨
	taffyold_wechattaoni: {
		audio: 2,
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return player.getHp() > 0;
		},
		async cost(event, trigger, player) {
			const choices = Array.from({ length: player.getHp() }).map((_, i) => get.cnNumber(i + 1, true));
			const { result } = await player
				.chooseControl(choices, "cancel2")
				.set("prompt", "讨逆：选择失去任意点体力")
				.set("ai", () => {
					const player = get.player();
					if (player.getHp() < 2 || !game.hasPlayer(current => current != player && !current.hasMark("taffyold_wechattaoni") && get.attitude(player, current) < 0)) return "cancel2";
					const num = Math.min(
						player.getHp() - 1,
						game.countPlayer(current => current != player && !current.hasMark("taffyold_wechattaoni") && get.attitude(player, current) < 0)
					);
					return Math.min(choices.length - 1, num - 1);
				});
			event.result = {
				bool: result.control != "cancel2",
				cost_data: result.index + 1,
			};
		},
		async content(event, trigger, player) {
			const num = event.cost_data;
			await player.loseHp(num);
			await player.draw(num);
			player.addTempSkill(event.name + "_hand");
			if (!game.hasPlayer(current => current != player)) return;
			const targets = await player
				.chooseTarget(`令至多${get.cnNumber(num)}名其他角色获得1枚“讨逆”标记`, lib.filter.notMe, [1, num])
				.set("ai", target => {
					const player = get.player(),
						att = get.attitude(player, target);
					if (att >= 0) return 0;
					if (att < 0 && target.hasMark("taffyold_wechattaoni")) return 0;
					return -att;
				})
				.forResultTargets();
			if (!targets || !targets.length) return;
			for (const target of targets) target.addMark(event.name, 1, false);
		},
		marktext: "逆",
		intro: {
			name: "讨逆",
			content: "mark",
			onunmark: true,
		},
		subSkill: {
			hand: {
				charlotte: true,
				mod: {
					maxHandcardBase(player, num) {
						return player.maxHp;
					},
				},
			},
		},
	},
	taffyold_wechatpingjiang: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(current => get.info("taffyold_wechatpingjiang").filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return target.hasMark("taffyold_wechattaoni") && player.canUse({ name: "juedou" }, target, false);
		},
		async content(event, trigger, player) {
			const juedou = get.autoViewAs({ name: "juedou", isCard: true, storage: { taffyold_wechatpingjiang: true } });
			const { target } = event;
			await player.useCard(juedou, target, false);
		},
		ai: {
			order: 4,
			result: {
				player(player, target) {
					return get.effect(target, { name: "juedou" }, player, player);
				},
			},
			combo: "taffyold_wechattaoni",
		},
		group: "taffyold_wechatpingjiang_buff",
		subSkill: {
			buff: {
				trigger: {
					player: "juedouAfter",
				},
				filter(event, player) {
					return event.card.storage?.taffyold_wechatpingjiang;
				},
				charlotte: true,
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					if (trigger.turn == player) player.tempBanSkill("taffyold_wechatpingjiang");
					else {
						if (trigger.target.isIn() && trigger.target.hasMark("taffyold_wechattaoni")) trigger.target.clearMark("taffyold_wechattaoni");
						player.addTempSkill("taffyold_wechatpingjiang_wushuang");
					}
				},
			},
			wushuang: {
				trigger: {
					player: "useCardToPlayered",
					source: "damageBegin1",
				},
				filter(event, player) {
					return event.card?.name == "juedou";
				},
				charlotte: true,
				forced: true,
				logTarget(event, player) {
					return event.name == "useCardToPlayered" ? event.target : event.player;
				},
				async content(event, trigger, player) {
					if (trigger.name == "useCardToPlayered") {
						const id = trigger.target.playerid;
						const idt = trigger.target.playerid;
						const map = trigger.getParent().customArgs;
						if (!map[idt]) map[idt] = {};
						if (!map[idt].shaReq) map[idt].shaReq = {};
						if (!map[idt].shaReq[id]) map[idt].shaReq[id] = 1;
						map[idt].shaReq[id]++;
					} else trigger.num++;
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (arg.card.name != "juedou" || Math.floor(arg.target.countCards("h", "sha") / 2) > player.countCards("h", "sha")) return false;
					},
				},
			},
		},
	},
	taffyold_wechatdingye: {
		audio: 2,
		trigger: {
			player: "phaseJieshuBegin",
		},
		filter(event, player) {
			return player.isDamaged() && game.hasPlayer2(current => current.hasHistory("damage"));
		},
		forced: true,
		async content(event, trigger, player) {
			player.recover(game.countPlayer2(current => current.hasHistory("damage")));
		},
	},
};

export default oldEtc;
