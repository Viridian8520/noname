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
};

export default oldEtc;
