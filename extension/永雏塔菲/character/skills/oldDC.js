import { lib, game, ui, get, ai, _status } from "../../extension/noname.js";

/** @type { importCharacterConfig['skill'] } */
const oldDC = {
	// 旧武诸葛
	taffyold_dcqingshi: {
		audio: "dcqingshi",
		trigger: {
			player: "useCard",
		},
		filter: function (event, player) {
			if (!player.isPhaseUsing() || player.hasSkill("taffyold_dcqingshi_blocker")) return false;
			// if(player.getStorage('taffyold_dcqingshi_clear').includes(event.card.name)) return false;
			if (
				player.hasCard(card => {
					return get.name(card) == event.card.name;
				})
			)
				return true;
			return false;
		},
		direct: true,
		content: function () {
			"step 0";
			var choices = [];
			var choiceList = ["令" + get.translation(trigger.card) + "对其中一个目标角色造成的伤害+1", "令任意名其他角色各摸一张牌", "摸" + get.cnNumber(player.hp) + "张牌，然后〖情势〗于本回合失效"];
			if (trigger.targets && trigger.targets.length) choices.push("选项一");
			else choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "(无目标角色)</span>";
			if (game.countPlayer(i => i != player)) choices.push("选项二");
			else choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			if (player.hp > 0) choices.push("选项三");
			else choiceList[2] = '<span style="opacity:0.5">' + choiceList[1] + "(体力值为0)</span>";
			player
				.chooseControl(choices, "cancel2")
				.set("choiceList", choiceList)
				.set("prompt", get.prompt("taffyold_dcqingshi"))
				.set("ai", () => {
					return _status.event.choice;
				})
				.set(
					"choice",
					(() => {
						var choicesx = choices.slice();
						var cards = player.getCards("hs");
						for (var i = 0; i < cards.length; i++) {
							var name = get.name(cards[i]);
							for (var j = i + 1; j < cards.length; j++) {
								if (name == get.name(cards[j]) && get.position(cards[i]) + get.position(cards[j]) != "ss" && player.hasValueTarget(cards[i])) {
									choicesx.remove("选项三");
									break;
								}
							}
						}
						if (choicesx.includes("选项三")) return "选项三";
						if (choicesx.includes("选项二")) {
							var cnt = game.countPlayer(current => get.attitude(player, current) > 0);
							if (cnt > 2) {
								return "选项二";
							} else if (!cnt) choicesx.remove("选项二");
						}
						if (
							get.tag(trigger.card, "damage") &&
							choicesx.includes("选项一") &&
							trigger.targets.some(current => {
								return get.attitude(player, current) < 0;
							})
						)
							return "选项一";
						return 0;
					})()
				);
			("step 1");
			if (result.control != "cancel2") {
				player.logSkill("taffyold_dcqingshi");
				game.log(player, "选择了", "#y" + result.control);
				var index = ["选项一", "选项二", "选项三"].indexOf(result.control) + 1;
				player.storage.taffyold_dcqingshi = index;
				var next = game.createEvent("taffyold_dcqingshi_after");
				next.player = player;
				next.card = trigger.card;
				next.setContent(lib.skill.taffyold_dcqingshi["content" + index]);
			}
		},
		content1: function () {
			"step 0";
			player
				.chooseTarget("令" + get.translation(card) + "对其中一个目标造成的伤害+1", true, (card, player, target) => {
					return _status.event.targets.includes(target);
				})
				.set("ai", target => {
					return 2 - get.attitude(_status.event.player, target);
				})
				.set("targets", event.getParent().getTrigger().targets);
			("step 1");
			if (result.bool) {
				var target = result.targets[0];
				player.line(target);
				player.addTempSkill("taffyold_dcqingshi_ex");
				if (!player.storage.taffyold_dcqingshi_ex) player.storage.taffyold_dcqingshi_ex = [];
				player.storage.taffyold_dcqingshi_ex.push([target, card]);
			}
		},
		content2: function () {
			"step 0";
			player.chooseTarget("令任意名其他角色各摸一张牌", [1, Infinity], true, lib.filter.notMe).set("ai", target => {
				return get.attitude(_status.event.player, target);
			});
			("step 1");
			if (result.bool) {
				var targets = result.targets;
				targets.sortBySeat();
				player.line(targets);
				game.asyncDraw(targets);
				game.delayex();
			}
		},
		content3: function () {
			"step 0";
			player.draw(player.hp);
			player.addTempSkill("taffyold_dcqingshi_blocker");
		},
		subSkill: {
			ex: {
				trigger: {
					source: "damageBegin1",
				},
				filter: function (event, player) {
					return (
						player.storage.taffyold_dcqingshi_ex &&
						player.storage.taffyold_dcqingshi_ex.some(info => {
							return info[0] == event.player && info[1] == event.card;
						})
					);
				},
				forced: true,
				charlotte: true,
				popup: false,
				onremove: true,
				content: function () {
					trigger.num++;
					for (var i = 0; i < player.storage.taffyold_dcqingshi_ex.length; i++) {
						if (player.storage.taffyold_dcqingshi_ex[i][1] == trigger.card) player.storage.taffyold_dcqingshi_ex.splice(i--, 1);
					}
				},
			},
			blocker: {
				charlotte: true,
			},
		},
	},
	taffyold_dczhizhe: {
		audio: "dczhizhe",
		enable: "phaseUse",
		limited: true,
		filterCard: true,
		position: "h",
		discard: false,
		lose: false,
		delay: false,
		check: function (card) {
			if (get.type(card) != "basic" && get.type(card) != "trick") return 0;
			return get.value(card) - 7.5;
		},
		content: function () {
			"step 0";
			var card = cards[0];
			player.awakenSkill("taffyold_dczhizhe");
			var cardx = game.createCard2(card.name, card.suit, card.number, card.nature);
			player.gain(cardx).gaintag.add("taffyold_dczhizhe");
			player.addSkill("taffyold_dczhizhe_effect");
		},
		ai: {
			order: 15,
			result: {
				player: 1,
			},
		},
		subSkill: {
			effect: {
				trigger: {
					player: ["useCardAfter", "respondAfter"],
				},
				charlotte: true,
				forced: true,
				filter: function (event, player) {
					return player.hasHistory("lose", function (evt) {
						if (evt.getParent() != event) return false;
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("taffyold_dczhizhe")) {
								if (
									event.cards.some(card => {
										return get.position(card, true) == "o" && card.cardid == i;
									})
								)
									return true;
							}
						}
						return false;
					});
				},
				content: function () {
					"step 0";
					var cards = [];
					player.getHistory("lose", function (evt) {
						if (evt.getParent() != trigger) return false;
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("taffyold_dczhizhe")) {
								var cardsx = trigger.cards.filter(card => {
									return get.position(card, true) == "o" && card.cardid == i;
								});
								if (cardsx.length) cards.addArray(cardsx);
							}
						}
					});
					if (cards.length) {
						player.gain(cards, "gain2").gaintag.addArray(["taffyold_dczhizhe", "taffyold_dczhizhe_clear"]);
						player.addTempSkill("taffyold_dczhizhe_clear");
					}
				},
				mod: {
					ignoredHandcard: function (card, player) {
						if (card.hasGaintag("taffyold_dczhizhe")) {
							return true;
						}
					},
					cardDiscardable: function (card, player, name) {
						if (name == "phaseDiscard" && card.hasGaintag("taffyold_dczhizhe")) {
							return false;
						}
					},
				},
			},
			clear: {
				charlotte: true,
				onremove: function (player) {
					player.removeGaintag("taffyold_dczhizhe_clear");
				},
				mod: {
					cardEnabled2: function (card, player) {
						var cards = [];
						if (card.cards) cards.addArray(cards);
						if (get.itemtype(card) == "card") cards.push(card);
						for (var cardx of cards) {
							if (cardx.hasGaintag("taffyold_dczhizhe_clear")) return false;
						}
					},
					cardRespondable: function (card, player) {
						var cards = [];
						if (card.cards) cards.addArray(cards);
						if (get.itemtype(card) == "card") cards.push(card);
						for (var cardx of cards) {
							if (cardx.hasGaintag("taffyold_dczhizhe_clear")) return false;
						}
					},
					cardSavable: function (card, player) {
						var cards = [];
						if (card.cards) cards.addArray(cards);
						if (get.itemtype(card) == "card") cards.push(card);
						for (var cardx of cards) {
							if (cardx.hasGaintag("taffyold_dczhizhe_clear")) return false;
						}
					},
				},
			},
		},
	},
	// 旧柏灵筠
	taffyold_dclinghui: {
		audio: "dclinghui",
		trigger: {
			global: "phaseJieshuBegin",
		},
		filter(event, player) {
			if (_status.currentPhase === player) return true;
			return game.getGlobalHistory("everything", evt => evt.name == "dying").length;
		},
		frequent: true,
		async content(event, trigger, player) {
			let cards = get.cards(3, true);
			await game.cardsGotoOrdering(cards);
			const {
				result: { bool, links },
			} = await player
				.chooseButton(["灵慧：是否使用其中的一张牌并获得其余牌？", cards])
				.set("filterButton", button => {
					return get.player().hasUseTarget(button.link);
				})
				.set("ai", button => {
					return get.event("player").getUseValue(button.link);
				});
			if (bool) {
				const card = links[0];
				cards.remove(card);
				player.$gain2(card, false);
				await game.asyncDelayx();
				await player.chooseUseTarget(true, card, false);
				if (cards.length) await player.gain(cards, "gain2");
			}
		},
	},
	// 旧武关羽
	taffyold_dcjuewu: {
		audio: "dcjuewu",
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (
				!player.hasCard(card => {
					return _status.connectMode || get.number(card) === 2;
				}, "hes")
			)
				return false;
			for (const name of ["shuiyanqijuny"].concat(lib.inpile)) {
				const card = get.autoViewAs(
					{
						name,
					},
					"unsure"
				);
				if (!get.tag(card, "damage")) continue;
				if (event.filterCard(card, player, event)) return true;
				if (name === "sha") {
					for (const nature of lib.inpile_nature) {
						card.nature = nature;
						if (event.filterCard(card, player, event)) return true;
					}
				}
			}
			return false;
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name)) return false;
			if (
				!player.hasCard(card => {
					return _status.connectMode || get.number(card) === 2;
				}, "hes")
			)
				return false;
			return get.tag(
				{
					name,
				},
				"damage"
			);
		},
		group: "taffyold_dcjuewu_inTwo",
		chooseButton: {
			dialog(event, player) {
				let list = get.inpileVCardList(info => {
					return get.tag(
						{
							name: info[2],
						},
						"damage"
					);
				});
				if (!list.some(info => info[2] === "shuiyanqijuny")) list.add(["锦囊", "", "shuiyanqijuny"]);
				list = list.filter(info => {
					const name = info[2],
						nature = info[3];
					const card = get.autoViewAs(
						{
							name,
							nature,
						},
						"unsure"
					);
					return event.filterCard(card, player, event);
				});
				return ui.create.dialog("绝武", [list, "vcard"]);
			},
			check(button) {
				if (get.event().getParent().type != "phase") return 1;
				const player = get.player();
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					audio: "dcjuewu",
					filterCard(card, player) {
						return get.number(card) === 2;
					},
					position: "hes",
					check(card) {
						return 8 - get.value(card);
					},
					popname: true,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
				};
			},
			prompt(links, player) {
				return "将一张点数为2的牌当" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用或打出";
			},
		},
		subSkill: {
			backup: {},
			inTwo: {
				audio: "dcjuewu",
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				filter(event, player) {
					const cards = event.getg(player);
					if (!cards.length) return false;
					return game.hasPlayer(current => {
						if (current === player) return false;
						const evt = event.getl(current);
						return evt && evt.hs.length + evt.es.length + evt.js.length > 0;
					});
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.addGaintag(trigger.getg(player), "taffyold_dcjuewu_two");
					player.addSkill("taffyold_dcjuewu_two");
				},
			},
			two: {
				charlotte: true,
				mod: {
					cardnumber(card) {
						if (card.hasGaintag("taffyold_dcjuewu_two")) return 2;
					},
				},
			},
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			skillTagFilter(player) {
				if (
					!player.hasCard(card => {
						return _status.connectMode || get.number(card) === 2;
					}, "hes")
				)
					return false;
			},
			order: 1,
			result: {
				player(player) {
					if (get.event("dying")) return get.attitude(player, get.event("dying"));
					return 1;
				},
			},
		},
	},
	taffyold_dcwuyou: {
		audio: "dcwuyou",
		global: "taffyold_dcwuyou_g",
		subSkill: {
			g: {
				audio: "dcwuyou",
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					if (!player.countCards("h")) return false;
					// taffy: 自己不能拜自己
					const list = game.filterPlayer(current => {
						return current.hasSkill("taffyold_dcwuyou");
					});
					const moreThanOne = list.length > 1,
						includesMe = list.includes(player);
					if (!moreThanOne && includesMe) return false;
					/* taffy分界线 */
					return game.hasPlayer(current => {
						return current.hasSkill("taffyold_dcwuyou");
					});
				},
				filterCard: true,
				filterTarget(card, player, target) {
					return target.hasSkill("taffyold_dcwuyou");
				},
				selectTarget() {
					const count = game.countPlayer(current => {
						return current.hasSkill("taffyold_dcwuyou");
					});
					return count > 1 ? 1 : -1;
				},
				check(card) {
					const player = get.player();
					const hasFriend = game.hasPlayer(current => {
						return current.hasSkill("taffyold_dcwuyou") && get.attitude(player, current) > 0;
					});
					return (hasFriend ? 7 : 1) - get.value(card);
				},
				prompt() {
					const player = get.player(),
						list = game.filterPlayer(current => {
							return current.hasSkill("taffyold_dcwuyou");
						}),
						list2 = list.filter(current => current !== player);
					const moreThanOne = list.length > 1,
						includesMe = list.includes(player);
					let str = "选择一张手牌，";
					if (includesMe) str += `点击“确定”，${moreThanOne ? "或" : ""}`;
					if (moreThanOne || !includesMe) str += `将此牌交给${get.translation(list2)}${list2.length > 1 ? "中的一人" : ""}，`;
					str += "然后执行后续效果。";
					return str;
				},
				discard: false,
				lose: false,
				delay: false,
				async content(event, trigger, player) {
					const { target } = event;
					const isMe = target === player;
					let { cards } = event;
					if (!isMe) await player.give(cards, target);
					const names = lib.inpile.filter(name => {
						return get.type2(name) !== "equip";
					});
					if (names.includes("sha")) names.splice(names.indexOf("sha") + 1, 0, ...lib.inpile_nature.map(nature => ["sha", nature]));
					const vcard = names.map(namex => {
						let name = namex,
							nature;
						if (Array.isArray(namex)) [name, nature] = namex;
						const info = [get.type(name), "", name, nature];
						return info;
					});
					const links = await target
						.chooseButton(["武佑：选择一个牌名", [vcard, "vcard"]], true)
						.set("user", player)
						.set("ai", button => {
							const player = get.player(),
								user = get.event("user");
							return (
								user.getUseValue({
									name: button.link[2],
									nature: button.link[3],
								}) * get.attitude(player, user)
							);
						})
						.forResultLinks();
					if (!links || !links.length) return;
					const viewAs = {
						name: links[0][2],
						nature: links[0][3],
					};
					if (!isMe) {
						cards = await target
							.chooseToGive(player)
							.set("ai", card => {
								const player = get.event("player"),
									target = get.event().getParent().player;
								if (get.attitude(player, target) <= 0) return 0;
								return 6 - get.value(card);
							})
							.forResultCards();
					}
					if (!cards) return;
					const card = cards[0];
					if (player.getCards("h").includes(card)) {
						if (!player.storage.taffyold_dcwuyou_transfer) player.storage.taffyold_dcwuyou_transfer = {};
						player.storage.taffyold_dcwuyou_transfer[card.cardid] = viewAs;
						player.addGaintag(cards, "taffyold_dcwuyou_transfer");
						player.addSkill("taffyold_dcwuyou_transfer");
					}
				},
				ai: {
					order: 10,
					result: {
						player(player, target) {
							if (get.attitude(player, target) > 0) return 1;
							return 0;
						},
						target: 0.5,
					},
				},
			},
			transfer: {
				trigger: {
					player: "useCard1",
				},
				forced: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					if (event.addCount === false) return false;
					return player.hasHistory("lose", evt => {
						if (evt.getParent() != event) return false;
						for (const i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("taffyold_dcwuyou_transfer")) return true;
						}
						return false;
					});
				},
				async content(event, trigger, player) {
					trigger.addCount = false;
					const stat = player.getStat().card,
						name = trigger.card.name;
					if (typeof stat[name] === "number") stat[name]--;
				},
				mod: {
					cardname(card, player) {
						const map = player.storage.taffyold_dcwuyou_transfer;
						if (map && map[card.cardid] && get.itemtype(card) == "card" && card.hasGaintag("taffyold_dcwuyou_transfer")) return map[card.cardid].name;
					},
					cardnature(card, player) {
						const map = player.storage.taffyold_dcwuyou_transfer;
						if (map && map[card.cardid] && get.itemtype(card) == "card" && card.hasGaintag("taffyold_dcwuyou_transfer")) return map[card.cardid].nature || false;
					},
				},
			},
		},
	},
	taffyold_dcyixian: {
		audio: "dcyixian",
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		filterCard: () => false,
		selectCard: -1,
		filterTarget: () => false,
		selectTarget: -1,
		async content(event, trigger, player) {
			player.awakenSkill("taffyold_dcyixian");
			const position = "field";
			let cards = [];
			cards.addArray(
				game
					.filterPlayer()
					.map(current => current.getGainableCards(player, "hes").filter(card => get.equipNum(card) == 1 || get.equipNum(card) == 2))
					.flat()
			);
			if (!cards.length) return;
			await player.gain(cards, "give");
			const pairs = game.filterPlayer().map(current => {
				let lostNum = 0;
				current.checkHistory("lose", evt => {
					if (evt.getParent(2) === event) lostNum += evt.cards2.length;
				});
				return [current, lostNum];
			});
			for (const pair of pairs) {
				const [target, num] = pair;
				if (!num) continue;
				const { result } = await player
					.chooseControl(`摸${get.cnNumber(num)}张牌`, "回复1点体力", "cancel2")
					.set("prompt", get.prompt("taffyold_dcyixian"))
					.set("prompt2", `令${get.translation(target)}执行一项`)
					.set("ai", function () {
						return Math.max(
							get.effect(
								target,
								{
									name: "draw",
								},
								player,
								player
							),
							get.recoverEffect(target, player, player) / 5
						);
					});
				if (result.index === 0) {
					player.line(target, "green");
					await target.draw(num);
				} else if (result.index === 1) {
					player.line(target, "green");
					await target.recover();
				}
				if (!event.isMine() && !event.isOnline()) await game.asyncDelayx();
			}
		},
		ai: {
			order: 10,
			threaten: 2.9,
			result: {
				player(player) {
					const enemies = game.filterPlayer(current => {
							return get.rawAttitude(player, current) < 0 && get.attitude(player, current) >= 0;
						}),
						knownEnemies = game.filterPlayer(current => {
							return get.attitude(player, current) < 0;
						});
					if ((!knownEnemies.length && player.countCards("e") > 1) || (player.getHp() > 3 && enemies.length > 0 && knownEnemies.length < 2 && knownEnemies.length < enemies.length && !knownEnemies.some(enemy => get.attitude(player, enemy) <= -9))) return 0;
					const val1 = game
						.filterPlayer()
						.map(current => {
							const cards = [];
							player.getEquip(1) && cards.push(player.getEquip(1));
							player.getEquip(2) && cards.push(player.getEquip(2));
							att = get.sgnAttitude(player, current);
							return cards
								.map(card => {
									return Math.max(player.hasSkill("taffyold_dcjuewu") ? 5 : 0, get.value(card, player)) - get.value(card, current) * att;
								})
								.reduce((p, c) => p + c, 0);
						})
						.reduce((p, c) => p + c, 0);
					return val1 > 10 ? 4 : 0;
				},
			},
		},
	},
	// 旧新杀神华佗
	taffyold_jingyu: {
		audio: "jingyu",
		trigger: {
			global: ["useSkill", "logSkillBegin", "useCard", "respond"],
		},
		filter(event, player) {
			if (["global", "equip"].includes(event.type)) return false;
			let skill = event.sourceSkill || event.skill;
			if (!skill || event.player === player) return false;
			if (!player.storage.taffyold_jingyu_used) {
				player
					.when({
						global: "phaseBefore",
					})
					.assign({
						firstDo: true,
					})
					.then(() => delete player.storage.taffyold_jingyu_used);
			}
			if (skill === "jingyu" || skill === "taffyold_jingyu") {
				if (!player.getStorage("taffyold_jingyu_used").includes(skill)) {
					player.markAuto("taffyold_jingyu_used", skill);
					return true;
				} else {
					return false;
				}
			}
			let info = get.info(skill);
			while (true) {
				if (!info || info.charlotte || info.equipSkill) return false;
				if (info && !info.sourceSkill) break;
				skill = info.sourceSkill;
				info = get.info(skill);
			}
			return !player.getStorage("taffyold_jingyu_used").includes(skill);
		},
		forced: true,
		async content(event, trigger, player) {
			let skill = trigger.sourceSkill || trigger.skill,
				info = get.info(skill);
			while (true) {
				if (info && !info.sourceSkill) break;
				skill = info.sourceSkill;
				info = get.info(skill);
			}
			player.markAuto("taffyold_jingyu_used", skill);
			await player.draw();
		},
		ai: {
			threaten: 6,
		},
	},
	taffyold_lvxin: {
		audio: "lvxin",
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		filterTarget: lib.filter.notMe,
		check(card) {
			const round = game.roundNumber,
				player = get.player();
			let valueFix = 0;
			if (["sha", "shan"].includes(get.name(card, false))) valueFix += 3;
			if (
				(round <= 2 &&
					player.hasCard(card => {
						return ["sha", "shan"].includes(get.name(card)) && get.value(card) <= 3;
					})) ||
				game.hasPlayer(current => {
					return current !== player && get.attitude(player, current) > 0;
				})
			)
				return 6 - get.value(card) + valueFix;
			return 4.5 - get.value(card) + valueFix;
		},
		delay: false,
		discard: false,
		lose: false,
		async content(event, trigger, player) {
			const { target, cards } = event,
				round = game.roundNumber;
			const name = get.translation(target);
			await player.give(cards, target);
			const result = await player
				.chooseControl(["摸牌", "弃牌"])
				.set("choiceList", [`令${name}摸${get.cnNumber(round)}张牌`, `令${name}随机弃置${get.cnNumber(round)}张手牌`])
				.set("prompt", "滤心：请选择一项")
				.set("ai", () => {
					return get.event("choice");
				})
				.set("choice", get.attitude(player, target) > 0 ? "摸牌" : "弃牌")
				.forResult();
			let cards2 = [];
			const makeDraw = result.index === 0;
			if (makeDraw) {
				cards2 = await target.draw(round).forResult();
			} else {
				const cards = target.getCards("h", card => {
					return lib.filter.cardDiscardable(card, target, "taffyold_lvxin");
				});
				if (cards.length > 0) {
					const evt = await target.discard(cards.randomGets(round)).set("discarder", target);
					cards2 = evt.done.cards2;
				}
			}
			const cardName = get.name(cards[0], player);
			if (
				cards2.some(card => {
					return get.name(card, target) === cardName;
				})
			) {
				const skillName = `taffyold_lvxin_${makeDraw ? "recover" : "lose"}`;
				target.addSkill(skillName);
				target.addMark(skillName, 1, false);
			}
		},
		subSkill: {
			recover: {
				trigger: {
					player: ["useSkill", "logSkillBegin", "useCard", "respond"],
				},
				filter(event, player) {
					if (["global", "equip"].includes(event.type)) return false;
					if ((get.info(event.skill) || {}).charlotte) return false;
					const skill = event.sourceSkill || event.skill;
					const info = get.info(skill);
					return info && !info.charlotte && !info.equipSkill;
				},
				forced: true,
				onremove: true,
				charlotte: true,
				async content(event, trigger, player) {
					player.recover(player.countMark("taffyold_lvxin_recover"));
					player.removeSkill("taffyold_lvxin_recover");
				},
				intro: {
					content: "下次发动技能时回复#点体力",
				},
			},
			lose: {
				trigger: {
					player: ["useSkill", "logSkillBegin", "useCard", "respond"],
				},
				filter(event, player) {
					if (["global", "equip"].includes(event.type)) return false;
					if ((get.info(event.skill) || {}).charlotte) return false;
					const skill = event.sourceSkill || event.skill;
					const info = get.info(skill);
					return info && !info.charlotte && !info.equipSkill;
				},
				forced: true,
				onremove: true,
				charlotte: true,
				async content(event, trigger, player) {
					player.loseHp(player.countMark("taffyold_lvxin_lose"));
					player.removeSkill("taffyold_lvxin_lose");
				},
				intro: {
					content: "下次发动技能时失去#点体力",
				},
			},
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					const round = game.roundNumber;
					if (
						round <= 2 &&
						target.countCards("h") > round * 2 &&
						player.getCards("h").some(card => {
							return ["sha", "shan"].includes(get.name(card)) && get.value(card) <= 3;
						})
					)
						return 1;
					if (get.attitude(player, target) > 0) {
						return round + Math.sqrt(1 + target.getDamagedHp());
					}
					return -(round + Math.sqrt(Math.max(0, 2 - target.getHp())));
				},
			},
		},
	},
	// 旧神许褚
	taffyold_zhengqing: {
		audio: "zhengqing",
		trigger: {
			global: "roundStart",
		},
		forced: true,
		filter() {
			return (
				game.hasPlayer(current => {
					return current.countMark("taffyold_zhengqing");
				}) || lib.skill.taffyold_zhengqing.getMostInfoLastRound()[0] > 0
			);
		},
		getMostInfoLastRound() {
			let max = -1,
				players = [];
			const history = game.getAllGlobalHistory();
			if (history.length <= 2) return [max, players];
			for (let i = history.length - 2; i >= 0; i--) {
				const evts = history[i]["everything"].filter(evt => {
					if (evt.name !== "damage") return false;
					const source = evt.source;
					return source && source.isIn();
				});
				if (evts.length) {
					let curMax = -1,
						curPlayers = [];
					const map = {};
					for (const evt of evts) {
						const source = evt.source;
						const id = source.playerid;
						if (typeof map[id] !== "number") map[id] = 0;
						map[id] += evt.num;
						if (map[id] > curMax) {
							curMax = map[id];
							curPlayers = [source];
						} else if (map[id] == curMax) {
							curPlayers.add(source);
						}
					}
					if (curMax > max) {
						max = curMax;
						players = curPlayers.slice();
					} else if (curMax === max) {
						players.addArray(curPlayers);
					}
				}
				if (history[i].isRound) break;
			}
			return [max, players];
		},
		async content(event, trigger, player) {
			game.countPlayer(current => {
				if (current.hasMark("taffyold_zhengqing")) current.clearMark("taffyold_zhengqing");
			});
			const [num, players] = lib.skill.taffyold_zhengqing.getMostInfoLastRound();
			player.line(players, "thunder");
			const onlyMe = players.length === 1 && players[0] === player;
			const isMax =
				(player
					.getAllHistory("custom", evt => evt && evt.taffyold_zhengqing_count)
					.map(evt => evt.taffyold_zhengqing_count)
					.sort((a, b) => b - a)[0] || 0) <= num;
			players.forEach(current => {
				current.addMark("taffyold_zhengqing", num);
			});
			if (onlyMe && isMax) {
				player.draw(num);
				player.getHistory("custom").push({
					taffyold_zhengqing_count: num,
				});
			} else {
				const drawers = [player].concat(players).sortBySeat(trigger.player);
				for (const drawer of drawers) {
					await drawer.draw();
				}
			}
		},
		marktext: "擎",
		intro: {
			name: "争擎",
			name2: "擎",
			content: "mark",
		},
	},
	// 旧滕公主
	taffyold_xingchong: {
		audio: "xingchong",
		trigger: { global: "roundStart" },
		direct: true,
		filter: function (event, player) {
			return player.maxHp > 0;
		},
		content: function () {
			"step 0";
			var list = [];
			for (var i = 0; i <= player.maxHp; i++) {
				list.push(get.cnNumber(i) + "张");
			}
			list.push("cancel2");
			player
				.chooseControl(list)
				.set("prompt", get.prompt("taffyold_xingchong"))
				.set("prompt2", "请首先选择摸牌的张数")
				.set("ai", function () {
					var player = _status.event.player,
						num1 = player.maxHp,
						num2 = player.countCards("h");
					if (num1 <= num2) return 0;
					return Math.ceil((num1 - num2) / 2);
				});
			("step 1");
			if (result.control != "cancel2") {
				player.logSkill("taffyold_xingchong");
				var num2 = result.index;
				if (num2 > 0) player.draw(num2);
				var num = player.maxHp - num2;
				if (num == 0) event.finish();
				else event.num = num;
			} else event.finish();
			("step 2");
			if (player.countCards("h") > 0) {
				player.chooseCard("h", [1, Math.min(player.countCards("h"), event.num)], "请选择要展示的牌").set("ai", () => 1 + Math.random());
			} else event.finish();
			("step 3");
			if (result.bool) {
				var cards = result.cards;
				player.showCards(cards, get.translation(player) + "发动了【幸宠】");
				player.addGaintag(cards, "taffyold_xingchong");
				player.addTempSkill("taffyold_xingchong_effect", "roundStart");
			}
		},
		subSkill: {
			effect: {
				audio: "taffyold_xingchong",
				trigger: {
					player: ["loseAfter"],
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter: function (event, player) {
					var evt = event.getl(player);
					if (!evt || !evt.cards2 || !evt.cards2.length) return false;
					if (event.name == "lose") {
						for (var i in event.gaintag_map) {
							if (event.gaintag_map[i].includes("taffyold_xingchong")) return true;
						}
						return false;
					}
					return player.hasHistory("lose", function (evt) {
						if (event != evt.getParent()) return false;
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("taffyold_xingchong")) return true;
						}
						return false;
					});
				},
				forced: true,
				popup: false,
				charlotte: true,
				onremove: function (player) {
					player.removeGaintag("taffyold_xingchong");
				},
				content: function () {
					"step 0";
					if (trigger.delay === false) game.delayx();
					("step 1");
					player.logSkill("taffyold_xingchong_effect");
					var num = 0;
					if (trigger.name == "lose") {
						for (var i in trigger.gaintag_map) {
							if (trigger.gaintag_map[i].includes("taffyold_xingchong")) num++;
						}
					} else
						player.getHistory("lose", function (evt) {
							if (trigger != evt.getParent()) return false;
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("taffyold_xingchong")) num++;
							}
						});
					player.draw(2 * num);
				},
			},
		},
	},
	taffyold_liunian: {
		audio: "liunian",
		trigger: { global: "phaseEnd" },
		forced: true,
		filter: function (event, player) {
			return game.hasGlobalHistory("cardMove", function (evt) {
				return evt.washCard && evt.shuffleNumber == 1;
			});
		},
		content: function () {
			"step 0";
			if (
				game.hasGlobalHistory("cardMove", function (evt) {
					return evt.washCard && evt.shuffleNumber == 1;
				})
			) {
				player.loseMaxHp();
				if (player.maxHp > player.hp) player.recover(player.maxHp - player.hp);
				game.delayx();
			} else event.finish();
			("step 1");
			player.addSkill("taffyold_liunian_effect");
			player.addMark("taffyold_liunian_effect", 10, false);
		},
		subSkill: {
			effect: {
				charlotte: true,
				mod: {
					maxHandcard: function (player, num) {
						return num + player.countMark("taffyold_liunian_effect");
					},
				},
				marktext: "年",
				intro: {
					content: "手牌上限+#",
				},
			},
		},
	},
	// 旧张曼成
	taffyold_dclvecheng: {
		audio: "dclvecheng",
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		content: function () {
			player.addTempSkill("taffyold_dclvecheng_xiongluan");
			player.markAuto("taffyold_dclvecheng_xiongluan", [target]);
		},
		ai: {
			threaten: 3.1,
			order: 9,
			expose: 0.2,
			result: {
				target: function (player, target) {
					if (player.getStorage("taffyold_dclvecheng_xiongluan").includes(target)) return 0;
					if (
						target.hasSkillTag(
							"freeShan",
							false,
							{
								player: player,
							},
							true
						)
					)
						return -0.6;
					var hs = player.countCards("h", card => {
						return get.name(card) == "sha" && get.effect(target, card, player, player) != 0;
					});
					var ts = target.hp;
					if (hs >= ts && ts > 1) return -2;
					return -1;
				},
			},
		},
		subSkill: {
			xiongluan: {
				trigger: { player: "phaseEnd" },
				charlotte: true,
				forced: true,
				popup: false,
				onremove: true,
				filter: function (event, player) {
					return player.getStorage("taffyold_dclvecheng_xiongluan").some(i => i.isIn());
				},
				content: function () {
					"step 0";
					event.targets = player.getStorage("taffyold_dclvecheng_xiongluan").slice();
					event.targets.sortBySeat();
					("step 1");
					if (!event.targets.length) {
						event.finish();
						return;
					}
					var target = event.targets.shift();
					event.target = target;
					target.showHandcards();
					var cards = target.getCards("h", "sha");
					if (!cards.length) event.redo();
					else event.forced = false;
					("step 2");
					var forced = event.forced;
					var prompt2 = forced ? "掠城：选择对" + get.translation(player) + "使用的【杀】" : "掠城：是否依次对" + get.translation(player) + "使用所有的【杀】？";
					target
						.chooseToUse(
							forced,
							function (card, player, event) {
								if (get.itemtype(card) != "card" || get.name(card) != "sha") return false;
								return lib.filter.filterCard.apply(this, arguments);
							},
							prompt2
						)
						.set("targetRequired", true)
						.set("complexSelect", true)
						.set("filterTarget", function (card, player, target) {
							if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
							return lib.filter.targetEnabled.apply(this, arguments);
						})
						.set("sourcex", player);
					("step 3");
					if (result.bool) {
						if (target.countCards("h", "sha")) {
							event.forced = true;
							event.goto(2);
							return;
						}
					}
					event.forced = false;
					event.goto(1);
				},
				intro: {
					content: "可以对$随意大喊大叫",
				},
				mod: {
					cardUsableTarget: function (card, player, target) {
						if (card.name == "sha" && player.getStorage("taffyold_dclvecheng_xiongluan").includes(target)) return true;
					},
				},
			},
		},
	},
	taffyold_dczhongji: {
		audio: "dczhongji",
		trigger: { player: "useCard" },
		filter: function (event, player) {
			var suit = get.suit(event.card);
			return !lib.suit.includes(suit) || !player.countCards("h", { suit: suit });
		},
		check: function (event, player) {
			var num = Math.min(20, player.maxHp - player.countCards("h"));
			if (num <= 0) return false;
			var numx =
				player.getHistory("useSkill", evt => {
					return evt.skill == "taffyold_dczhongji";
				}).length + 1;
			if (numx > num) return false;
			if (_status.currentPhase != player) return true;
			if (
				player.hasCard(card => {
					var suit = get.suit(card);
					return (
						player.hasValueTarget(card) &&
						!player.hasCard(cardx => {
							return cardx != card && get.suit(cardx) == suit;
						})
					);
				})
			)
				return false;
			return true;
		},
		prompt2: function (event, player) {
			var num = Math.min(20, player.maxHp - player.countCards("h"));
			var str = num > 0 ? "摸" + get.cnNumber(num) + "张牌，然后" : "";
			return (
				str +
				"弃置" +
				get.cnNumber(
					1 +
						player.getHistory("useSkill", evt => {
							return evt.skill == "taffyold_dczhongji";
						}).length
				) +
				"张牌"
			);
		},
		content: function () {
			"step 0";
			var num = Math.min(20, player.maxHp - player.countCards("h"));
			if (num > 0) player.draw(num);
			("step 1");
			var num = player.getHistory("useSkill", evt => {
				return evt.skill == "taffyold_dczhongji";
			}).length;
			player.chooseToDiscard("螽集：请弃置" + get.cnNumber(num) + "张牌", "he", true, num).set("ai", get.unuseful);
		},
		ai: {
			threaten: 3.2,
		},
	},
	//旧神黄忠
	//丁真神将，赤矢神将，爆头神将，吃人神将
	taffyold_yiwu: {
		intro: { content: "已击伤过$" },
		audio: "dclieqiong",
		trigger: { source: "damageSource" },
		filter(event, player) {
			return event.player.isIn() && event.source != event.player;
		},
		derivation: ["taffyold_yiwu_place1", "taffyold_yiwu_place4", "taffyold_yiwu_place5", "taffyold_yiwu_place6", "taffyold_yiwu_place7"],
		positions: {
			head: {
				name: "头部",
				info: "令其失去所有体力，若其因此死亡，你增加1点体力上限",
				css_male: {
					left: "50%",
					top: "14%",
				},
				css_female: {
					left: "45%",
					top: "10%",
				},
				async content(event, trigger, player) {
					const { target, position } = event;
					game.log(player, "击伤了", target, "的", "#y头部");
					if (target.getHp() > 0) {
						await target.loseHp(target.getHp());
						if (
							game.getGlobalHistory("everything", evt => {
								if (evt.name != "die" || evt.player != target) {
									return false;
								}
								return evt.reason?.getParent() == event;
							}).length > 0
						) {
							await player.gainMaxHp();
						}
					}
				},
			},
			hand: {
				name: "上肢",
				info: "令其随机弃置一半手牌（向下取整）",
				css_male: {
					left: "28%",
					top: "40%",
				},
				css_female: {
					left: "72%",
					top: "40%",
				},
				async content(event, trigger, player) {
					const { target, position } = event;
					game.log(player, "击伤了", target, "的", "#y上肢");
					const cardx = target.getDiscardableCards(target, "h");
					const num = Math.floor(cardx.length / 2);
					if (cardx.length) {
						await target.discard(cardx.randomGets(num));
					}
					player.markAuto("taffyold_yiwu", [target]);
				},
			},
			leg: {
				name: "下肢",
				info: "令其体力值大于1时，受到的伤害+1直到其回合结束",
				css_male: {
					left: "35%",
					top: "80%",
				},
				css_female: {
					left: "67%",
					top: "80%",
				},
				async content(event, trigger, player) {
					const { target, position } = event;
					game.log(player, "击伤了", target, "的", "#y下肢");
					target.addTempSkill("taffyold_yiwu_leg", {
						player: "phaseEnd",
					});
					player.markAuto("taffyold_yiwu", [target]);
				},
			},
			chest: {
				name: "胸部",
				info: "令其下回合使用伤害牌造成的伤害-1",
				css_male: {
					left: "50%",
					top: "30%",
				},
				css_female: {
					left: "40%",
					top: "25%",
				},
				async content(event, trigger, player) {
					const { target, position } = event;
					game.log(player, "击伤了", target, "的", "#y胸部");
					target.addTempSkill("taffyold_yiwu_chest", {
						player: "phaseEnd",
					});
					player.markAuto("taffyold_yiwu", [target]);
				},
			},
			abdomen: {
				name: "腹部",
				info: "令其不能使用【闪】和【桃】直到其回合结束",
				css_male: {
					left: "50%",
					top: "42%",
				},
				css_female: {
					left: "40%",
					top: "35%",
				},
				async content(event, trigger, player) {
					const { target, position } = event;
					game.log(player, "击伤了", target, "的", "#y腹部");
					target.addTempSkill("taffyold_yiwu_abdomen", {
						player: "phaseEnd",
					});
					player.markAuto("taffyold_yiwu", [target]);
				},
			},
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			await Promise.all(event.next);
			event.videoId = lib.status.videoId++;
			let list = Object.keys(lib.skill[event.skill].positions);
			if (!player.getStorage("taffyold_yiwu").includes(target)) {
				list.remove("head");
			}
			if (!list?.length) {
				event.result = { bool: false };
				return;
			}
			const switchToAuto = function () {
				_status.imchoosing = false;
				if (event.dialog) {
					event.dialog.close();
				}
				if (event.control) {
					event.control.close();
				}
				game.resume();
				if (get.attitude(player, target) > 0) {
					event._result = { bool: false };
				} else {
					event._result = {
						bool: true,
						position: list.includes("head") ? "head" : "abdomen",
					};
				}
				return Promise.resolve(event._result);
			};
			const choosePosition = function (player, target, list) {
				const { promise, resolve } = Promise.withResolvers();
				const event = _status.event;
				event.switchToAuto = function () {
					_status.imchoosing = false;
					if (get.attitude(player, target) > 0) {
						event._result = { bool: false };
					} else {
						event._result = {
							bool: true,
							position: list.includes("head") ? "head" : "abdomen",
						};
					}
					resolve(event._result);
					if (event.dialog) {
						event.dialog.close();
					}
					if (event.control_cancel) {
						event.control_cancel.close();
					}
					if (event.control_ok) {
						event.control_ok.close();
					}
				};
				event.control_ok = ui.create.control("ok", function (link) {
					event.dialog.close();
					event.control_cancel.close();
					event.control_ok.close();
					game.resume();
					_status.imchoosing = false;
					event._result = {
						bool: true,
						position: event.selectedPos,
					};
					resolve(event._result);
				});
				event.control_ok.classList.add("disabled");
				event.control_cancel = ui.create.control("cancel2", function (link) {
					event.dialog.close();
					event.control_cancel.close();
					if (event.control_ok) {
						event.control_ok.close();
					}
					game.resume();
					_status.imchoosing = false;
					event._result = { bool: false };
					resolve(event._result);
				});
				//创建对话框
				const dialog = ui.create.dialog("forcebutton", "hidden");
				dialog.listen(() => {
					let allpos = dialog.querySelectorAll(".position");
					allpos.forEach(pos => pos.classList.remove("selected_cp"));
					event.selectedPos = null;
					event.control_ok.classList.add("disabled");
				});
				event.dialog = dialog;
				dialog.classList.add("dclieqiong", "fixed", "fullheight");
				dialog.style.backgroundImage = "url(" + lib.assetURL + "image/card/yiwu_" + (target.hasSex("male") ? "male" : "female") + ".png)";
				const title = ui.create.div(".title", dialog);
				title.innerHTML = `毅武：是否击伤${get.translation(target)}的一个部位？`;
				//添加部位
				for (let pos of list) {
					let position = lib.skill.taffyold_yiwu.positions[pos];
					let div = ui.create.div(".position", dialog, e => {
						e.stopPropagation();
						let allPosDiv = Array.from(dialog.querySelectorAll(".position"));
						allPosDiv.forEach(p => p.classList.remove("selected_cp"));
						div.classList.add("selected_cp");
						event.selectedPos = pos;
						if (allPosDiv.some(p => p.classList.contains("selected_cp")) && event.selectedPos) {
							event.control_ok.classList.remove("disabled");
						} else {
							event.control_ok.classList.add("disabled");
						}
					});
					let sex = target.hasSex("male") ? "male" : "female";
					div.css(position["css_" + sex] || {});

					div.setNodeIntro(position.name, position.info);
					div.style.setProperty("--info", `"【${position.name}】:${position.info}"`);
				}
				dialog.open();
				game.pause();
				game.countChoose();
				return promise;
			};
			/** @type {Promise<{bool:boolean,position:string}>} */
			let next;
			if (event.isMine()) {
				next = choosePosition(player, target, list);
			} else if (event.isOnline()) {
				const { promise, resolve } = Promise.withResolvers();
				event.player.send(choosePosition, player, target, list);
				event.player.wait(async result => {
					if (result == "ai") {
						result = await switchToAuto();
					}
					resolve(result);
				});
				game.pause();
				next = promise;
			} else {
				next = switchToAuto();
			}

			const result = await next;
			if (event.control2) {
				event.control2.close();
			}
			game.resume();
			event.result = {
				bool: result.bool,
				targets: [target],
				cost_data: {
					position: result.position,
					target: target,
				},
			};
		},
		async content(event, trigger, player) {
			const { target, position } = event.cost_data;
			game.broadcastAll(function (position) {
				if (lib.config.background_speak) {
					game.playAudio("skill", "dclieqiong_" + position);
				}
			}, position);
			const positionObj = lib.skill[event.name].positions[position];
			let next = game.createEvent(event.name + "effect", false);
			next.setContent(positionObj.content);
			next.set("target", target);
			next.set("player", player);
			next.set("position", positionObj);
			await next;
		},
		subSkill: {
			chest: {
				init(player, skill) {
					player.addTip(skill, "毅武 胸部");
				},
				onremove(player, skill) {
					player.removeTip(skill);
				},
				charlotte: true,
				forced: true,
				mark: true,
				marktext: "伤",
				intro: {
					name: "中伤 - 胸部",
					content: (_, player) => "使用伤害牌造成的伤害-1",
				},
				trigger: {
					source: "damageBegin1",
				},
				filter(event, player) {
					if (event.card) {
						return true;
					}
				},
				content() {
					trigger.num--;
				},
			},
			leg: {
				init(player, skill) {
					player.addTip(skill, "毅武 下肢");
				},
				onremove(player, skill) {
					player.removeTip(skill);
				},
				charlotte: true,
				mark: true,
				marktext: "伤",
				intro: {
					name: "中伤 - 下肢",
					content: (_, player) => "体力值大于1时，受到的伤害+1",
				},
				filter(event, player) {
					if (player.hp > 1) return true;
				},
				trigger: {
					player: "damageBegin3",
				},
				forced: true,
				content() {
					trigger.num++;
				},
			},
			abdomen: {
				init(player, skill) {
					player.addTip(skill, "毅武 腹部");
				},
				onremove(player, skill) {
					player.removeTip(skill);
				},
				charlotte: true,
				mark: true,
				marktext: "伤",
				intro: {
					name: "中伤 - 腹部",
					content: (_, player) => "不能使用【闪】和【桃】",
				},
				mod: {
					cardEnabled(card) {
						if (card.name == "tao" || card.name == "shan") {
							return false;
						}
					},
					cardSavable(card) {
						if (card.name == "tao" || card.name == "shan") {
							return false;
						}
					},
				},
			},
		},
	},
	taffyold_chiren: {
		audio: "dczhanjue",
		trigger: {
			player: "phaseUseBegin",
		},
		async cost(event, trigger, player) {
			const hps = [player.getHp(), player.getDamagedHp()];
			let list = [(hps[0] > 0 ? "摸" + get.cnNumber(hps[0]) + "张牌，" : "") + "此阶段【杀】无距离限制且不能被响应。", (hps[1] > 0 ? "摸" + get.cnNumber(hps[1]) + "张牌，" : "") + "此阶段造成伤害后，回复1点体力。"];
			let result = await player
				.chooseControlList(list)
				.set("ai", function () {
					let player = get.event("player"),
						damaged = player.getDamagedHp();
					if (damaged) {
						damaged +=
							0.6 *
							(player.countCards("hs", card => {
								if (card.name == "sha" || !get.tag(card, "damage")) {
									return 0;
								}
								let info = get.info(card);
								if (!info || info.type != "trick") {
									return false;
								}
								if (info.notarget) {
									return false;
								}
								if (info.selectTarget != undefined) {
									if (Array.isArray(info.selectTarget)) {
										if (info.selectTarget[1] == -2) {
											return 1;
										}
										if (info.selectTarget[1] == -1) {
											let func = info.filterTarget;
											if (typeof func != "function") {
												func = () => true;
											}
											return game.countPlayer(cur => {
												return func(card, player, cur);
											});
										}
										return Math.max(1, info.selectTarget[0], info.selectTarget[1]);
									} else {
										if (info.selectTarget == -2) {
											return 1;
										}
										if (info.selectTarget == -1) {
											let func = info.filterTarget;
											if (typeof func != "function") {
												func = () => true;
											}
											return game.countPlayer(cur => {
												return func(card, player, cur);
											});
										}
										return Math.max(1, info.selectTarget);
									}
								}
								return 1;
							}) +
								Math.max(player.getCardUsable("sha"), player.countCards("hs", "sha")));
					}
					if (damaged > player.hp) {
						return "选项二";
					}
					return "选项一";
				})
				.forResult();
			event.result = {
				bool: result.control != "cancel2",
				cost_data: result.control,
			};
		},
		async content(event, trigger, player) {
			if (event.cost_data == "选项一") {
				player.draw(player.getHp());
				player.addTempSkill("taffyold_chiren_directHit", {
					player: "phaseUseEnd",
				});
			} else {
				player.draw(player.getDamagedHp());
				player.addTempSkill("taffyold_chiren_recover", {
					player: "phaseUseEnd",
				});
			}
		},
		subSkill: {
			directHit: {
				audio: "dczhanjue",
				charlotte: true,
				forced: true,
				mod: {
					targetInRange(card) {
						if (card.name == "sha") {
							return true;
						}
					},
				},
				trigger: {
					player: "useCard",
				},
				filter(event, player) {
					return event.card.name == "sha";
				},
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.players);
					game.log(trigger.card, "不可被响应");
				},
			},
			recover: {
				audio: "dczhanjue",
				trigger: {
					source: "damageSource",
				},
				forced: true,
				charlotte: true,
				content: async function (event, trigger, player) {
					if (player.isDamaged()) {
						player.recover();
					}
				},
			},
		},
	},
	//旧乐綝
	taffyold_dcporui: {
		audio: "dcporui",
		trigger: { global: "phaseJieshuBegin" },
		filter: function (event, player) {
			if (player == event.player) return false;
			if (player.hasSkill("taffyold_dcporui_round")) return false;
			return (
				game.hasPlayer(current => {
					if (current == player) return false;
					return current.getHistory("lose").length > 0;
				}) &&
				(_status.connectMode || player.hasCard({ type: "basic" }, "h"))
			);
		},
		direct: true,
		content: function () {
			"step 0";
			player.chooseCardTarget({
				prompt: get.prompt("taffyold_dcporui"),
				//prompt2:'弃置一张基本牌并选择一名本回合失去过牌的其他角色，你视为对其依次使用'+get.cnNumber(Math.max(0,player.hp)+1)+'张【杀】',
				prompt2: get.skillInfoTranslation("taffyold_dcporui", player),
				filterCard: function (card, player) {
					if (get.type(card) != "basic") return false;
					return lib.filter.cardDiscardable.apply(this, arguments);
				},
				selectCard: 1,
				targets: game.filterPlayer(current => {
					if (current == player) return false;
					return current.getHistory("lose").length > 0;
				}),
				filterTarget: function (card, player, target) {
					return _status.event.targets.contains(target);
				},
				ai1: function (card) {
					return 7 - get.value(card);
				},
				ai2: function (target) {
					return get.effect(target, { name: "sha" }, _status.event.player, _status.event.player);
				},
			});
			("step 1");
			if (result.bool) {
				var target = result.targets[0],
					cards = result.cards;
				event.target = target;
				player.logSkill("taffyold_dcporui", target);
				player.discard(cards);
				event.num2 = Math.max(0, player.hp);
				event.num = event.num2 + 1;
				player.addTempSkill("taffyold_dcporui_round", "roundStart");
			} else event.finish();
			("step 2");
			var card = { name: "sha", isCard: true, storage: { taffyold_dcporui: true } };
			if (player.canUse(card, target, false) && target.isIn()) {
				player.useCard(card, target);
				event.num--;
			} else event.goto(4);
			("step 3");
			if (event.num > 0) event.goto(2);
			("step 4");
			if (!player.hasMark("taffyold_dcgonghu_damage")) {
				var cards = player.getCards("h");
				if (cards.length == 0) event._result = { bool: false };
				else if (cards.length <= event.num2) event._result = { bool: true, cards: cards };
				else player.chooseCard("破锐：交给" + get.translation(target) + get.cnNumber(event.num2) + "张手牌", true, event.num2);
			} else event.goto(6);
			("step 5");
			if (result.bool) {
				player.give(result.cards, target);
			}
			("step 6");
			if (player.hasMark("taffyold_dcgonghu_basic")) {
				if (
					!target.hasHistory("damage", evt => {
						return evt.card && evt.card.storage && evt.card.storage.taffyold_dcporui && evt.getParent("taffyold_dcporui") == event;
					})
				) {
					player.recover();
				}
			}
		},
		subSkill: {
			round: { charlotte: true },
		},
		ai: {
			expose: 0.4,
			threaten: 4.8,
		},
	},
	taffyold_dcgonghu: {
		audio: "dcgonghu",
		trigger: {
			player: ["loseAfter", "damageEnd"],
			source: "damageSource",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		filter: function (event, player) {
			if (event.name == "damage") {
				if (player.hasMark("taffyold_dcgonghu_damage")) return false;
				return _status.currentPhase && _status.currentPhase != player;
			}
			if (player.hasMark("taffyold_dcgonghu_basic")) return false;
			var evt = event.getl(player);
			return evt && evt.cards2 && evt.cards2.some(i => get.type2(i, player) == "basic");
		},
		group: ["taffyold_dcgonghu_basic", "taffyold_dcgonghu_trick"],
		content: function () {
			player.addMark("taffyold_dcgonghu_" + (trigger.name == "damage" ? "damage" : "basic"), 1, false);
			game.log(player, "修改了技能", "#g【破锐】");
		},
		subSkill: {
			trick: {
				audio: "taffyold_dcgonghu",
				trigger: { player: "useCard2" },
				direct: true,
				locked: true,
				filter: function (event, player) {
					if (!player.hasMark("taffyold_dcgonghu_basic") || !player.hasMark("taffyold_dcgonghu_damage")) return false;
					var card = event.card;
					if (get.color(card, false) != "red" || get.type(card, null, true) != "trick") return false;
					var info = get.info(card);
					if (info.allowMultiple == false) return false;
					if (event.targets && !info.multitarget) {
						if (
							game.hasPlayer(function (current) {
								return !event.targets.contains(current) && lib.filter.targetEnabled2(card, player, current);
							})
						) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					var prompt2 = "为" + get.translation(trigger.card) + "增加一个目标";
					player
						.chooseTarget(get.prompt("taffyold_dcgonghu_trick"), function (card, player, target) {
							var player = _status.event.player;
							return !_status.event.targets.contains(target) && lib.filter.targetEnabled2(_status.event.card, player, target);
						})
						.set("prompt2", prompt2)
						.set("ai", function (target) {
							var trigger = _status.event.getTrigger();
							var player = _status.event.player;
							return get.effect(target, trigger.card, player, player);
						})
						.set("card", trigger.card)
						.set("targets", trigger.targets);
					("step 1");
					if (result.bool) {
						if (!event.isMine() && !event.isOnline()) game.delayx();
						event.targets = result.targets;
					} else {
						event.finish();
					}
					("step 2");
					if (event.targets) {
						player.logSkill("taffyold_dcgonghu_trick", event.targets);
						trigger.targets.addArray(event.targets);
					}
				},
			},
			basic: {
				audio: "taffyold_dcgonghu",
				trigger: { player: "useCard" },
				forced: true,
				filter: function (event, player) {
					if (!player.hasMark("taffyold_dcgonghu_basic") || !player.hasMark("taffyold_dcgonghu_damage")) return false;
					var card = event.card;
					return get.color(card, false) == "red" && get.type(card, null, false) == "basic";
				},
				content: function () {
					trigger.directHit.addArray(game.filterPlayer());
					game.log(trigger.card, "不可被响应");
				},
			},
		},
	},
	// 旧阮瑀
	taffyold_miaoxian: {
		hiddenCard: function (player, name) {
			return get.type(name) == "trick" && !player.getStorage("taffyold_miaoxian2").contains(name) && player.countCards("h", { color: "black" }) == 1;
		},
		audio: "miaoxian",
		enable: "chooseToUse",
		filter: function (event, player) {
			var cards = player.getCards("h", { color: "black" });
			if (cards.length != 1) return false;
			var mod2 = game.checkMod(cards[0], player, "unchanged", "cardEnabled2", player);
			if (mod2 === false) return false;
			var storage = player.getStorage("taffyold_miaoxian2");
			for (var i of lib.inpile) {
				if (
					!storage.contains(i) &&
					get.type(i) == "trick" &&
					event.filterCard(
						{
							name: i,
							cards: cards,
						},
						player,
						event
					)
				)
					return true;
			}
			return false;
		},
		chooseButton: {
			dialog: function (event, player) {
				var cards = player.getCards("h", { color: "black" });
				var storage = player.getStorage("taffyold_miaoxian2");
				var list = [];
				for (var i of lib.inpile) {
					if (
						!storage.contains(i) &&
						get.type(i) == "trick" &&
						event.filterCard(
							{
								name: i,
								cards: cards,
							},
							player,
							event
						)
					) {
						list.push(["锦囊", "", i]);
					}
				}
				return ui.create.dialog("妙弦", [list, "vcard"], "hidden");
			},
			check: function (button) {
				var player = _status.event.player;
				return player.getUseValue({ name: button.link[2] }) + 1;
			},
			backup: function (links, player) {
				return {
					audio: "taffyold_miaoxian",
					popname: true,
					filterCard: { color: "black" },
					selectCard: -1,
					position: "h",
					viewAs: {
						name: links[0][2],
					},
					onuse: function (links, player) {
						if (!player.storage.taffyold_miaoxian2) player.storage.taffyold_miaoxian2 = [];
						player.storage.taffyold_miaoxian2.add(links.card.name);
						player.addTempSkill("taffyold_miaoxian2");
					},
				};
			},
			prompt: function (links, player) {
				return "将" + get.translation(player.getCards("h", { color: "black" })[0]) + "当做" + get.translation(links[0][2]) + "使用";
			},
		},
		group: "taffyold_miaoxian_use",
		subfrequent: ["use"],
		subSkill: {
			use: {
				audio: "miaoxian",
				trigger: { player: "loseAfter" },
				frequent: true,
				prompt: "是否发动【妙弦】摸一张牌？",
				filter: function (event, player) {
					var evt = event.getParent();
					if (evt.name != "useCard") return false;
					return event.hs && event.hs.length == 1 && event.cards && event.cards.length == 1 && get.color(event.hs[0], player) == "red" && !player.countCards("h", { color: "red" });
				},
				content: function () {
					player.draw();
				},
			},
			backup: {
				audio: "miaoxian",
			},
		},
		ai: {
			order: 12,
			result: {
				player: 1,
			},
		},
	},
	taffyold_miaoxian2: { onremove: true },
	// 旧陆凯
	taffyold_lkbushi: {
		audio: "lkbushi",
		getBushi: function (player) {
			if (!player.storage.taffyold_lkbushi) return ["spade", "heart", "club", "diamond"];
			return player.storage.taffyold_lkbushi;
		},
		onremove: true,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		direct: true,
		locked: false,
		content: function () {
			"step 0";
			var list = lib.skill.taffyold_lkbushi.getBushi(player);
			list = list.map(function (i) {
				return ["", "", "lukai_" + i];
			});
			var next = player.chooseToMove("卜筮：是否调整【卜筮】的花色顺序？");
			next.set("list", [
				[
					"无次数限制/使用打出摸牌<br>成为目标拿牌/结束阶段或被指定时拿牌",
					[list, "vcard"],
					function (list) {
						var list2 = list.map(function (i) {
							return get.translation(i[2].slice(6));
						});
						return "你使用" + list2[0] + "牌无次数限制；使用或打出" + list2[1] + "时，摸两张牌；<br>结束阶段，或当你成为" + list2[2] + "牌目标后，获得一张" + list2[3] + "牌";
					},
				],
			]);
			next.set("processAI", function () {
				var player = _status.event.player;
				var list = lib.skill.taffyold_lkbushi.getBushi(player);
				var list2 = [];
				var hs = player.getCards("hs", function (card) {
					return player.hasValueTarget(card);
				});
				list.sort(function (a, b) {
					return hs.filter(i => get.suit(i) == b).length - hs.filter(i => get.suit(i) == a).length;
				});
				list2.push(list.shift());
				hs = player.getCards("hs", "sha");
				list.sort(function (a, b) {
					return hs.filter(i => get.suit(i) == b).length - hs.filter(i => get.suit(i) == a).length;
				});
				list2.unshift(list.shift());
				list.randomSort();
				list2.addArray(list);
				return [list2.map(i => ["", "", "lukai_" + i])];
			});
			("step 1");
			if (result.bool) {
				var list = lib.skill.taffyold_lkbushi.getBushi(player),
					list2 = result.moved[0].map(function (i) {
						return i[2].slice(6);
					});
				for (var i = 0; i < 4; i++) {
					if (list[i] != list2[i]) {
						player.logSkill("taffyold_lkbushi");
						player.storage.taffyold_lkbushi = list2;
						var str = "#g";
						for (var j = 0; j < 4; j++) {
							str += get.translation(list2[j]);
							if (j != 3) str += "/";
						}
						game.log(player, "将", "#g【卜筮】", "的花色序列改为", str);
						game.delayx();
						break;
					}
				}
			}
		},
		mark: true,
		marktext: "筮",
		intro: {
			content: function (storage, player) {
				var list = lib.skill.taffyold_lkbushi.getBushi(player).map(i => get.translation(i));
				return "①你使用" + list[0] + "牌无次数限制。②当你使用或打出" + list[1] + "牌后，你摸2张牌。③结束阶段，或当你成为" + list[2] + "牌的目标后，你从牌堆或弃牌堆获得一张" + list[3] + "牌。④准备阶段开始时，你可调整此技能中四种花色的对应顺序。";
			},
		},
		group: ["taffyold_lkbushi_unlimit", "taffyold_lkbushi_draw", "taffyold_lkbushi_gain"],
		subSkill: {
			unlimit: {
				mod: {
					cardUsable: function (card, player) {
						var list = lib.skill.taffyold_lkbushi.getBushi(player);
						if (list[0] == get.suit(card)) return Infinity;
					},
				},
				trigger: {
					player: "useCard1",
				},
				forced: true,
				popup: false,
				silent: true,
				firstDo: true,
				filter: function (event, player) {
					if (event.addCount === false) return true;
					var list = lib.skill.taffyold_lkbushi.getBushi(player);
					return list[0] == get.suit(event.card);
				},
				content: function () {
					trigger.addCount = false;
					var stat = player.getStat().card,
						name = trigger.card.name;
					if (stat[name] && typeof stat[name] == "number") stat[name]--;
				},
			},
			draw: {
				audio: "lkbushi",
				trigger: {
					player: ["useCard", "respond"],
				},
				forced: true,
				locked: false,
				filter: function (event, player) {
					var list = lib.skill.taffyold_lkbushi.getBushi(player);
					return list[1] == get.suit(event.card);
				},
				content: function () {
					player.draw(2);
				},
			},
			gain: {
				audio: "lkbushi",
				trigger: {
					player: "phaseJieshuBegin",
					target: "useCardToTargeted",
				},
				filter: function (event, player) {
					var list = lib.skill.taffyold_lkbushi.getBushi(player);
					if (event.name != "phaseJieshu") return list[2] == get.suit(event.card) && !event.excluded.contains(player);
					else return true;
				},
				forced: true,
				locked: false,
				content: function () {
					var list = lib.skill.taffyold_lkbushi.getBushi(player);
					var card = get.cardPile(function (card) {
						return get.suit(card, false) == list[3];
					});
					if (card) player.gain(card, "gain2");
				},
			},
		},
	},
	taffyold_lkzhongzhuang: {
		audio: "lkzhongzhuang",
		trigger: {
			source: ["damageBegin1", "damageBegin4"],
		},
		forced: true,
		filter: function (event, player, name) {
			if (!event.card || event.card.name != "sha" || event.getParent().type != "card") return false;
			var range = player.getAttackRange();
			if (name == "damageBegin1") return range < 3;
			return range > 3 && event.num > 1;
		},
		content: function () {
			if (event.triggername == "damageBegin1") trigger.num++;
			else trigger.num = 1;
		},
		global: "taffyold_lkzhongzhuang_ai",
		subSkill: {
			ai: {
				ai: {
					filterDamage: true,
					skillTagFilter: function (player, tag, arg) {
						if (arg && arg.card && arg.card.name == "sha") {
							if (arg.player && arg.player.hasSkill("taffyold_lkzhongzhuang") && arg.player.getAttackRange() > 3) return true;
						}
						return false;
					},
				},
			},
		},
	},
	// 旧刘理
	taffyold_dcfuli: {
		audio: "dcfuli",
		enable: "phaseUse",
		filter(event, player) {
			return (
				player.countDiscardableCards(player, "h") &&
				player.countCards("h", function (card) {
					return !player.storage.taffyold_dcfuli.contains(get.type2(card));
				}) > 0
			);
		},
		init: function (player) {
			player.storage.taffyold_dcfuli = [];
		},
		async content(event, trigger, player) {
			await player.showHandcards(get.translation(player) + "发动了【抚黎】");
			const getNum = type => {
				let num = ["basic", "trick", "equip"].indexOf(type);
				if (num === -1) num = 3;
				return num;
			};
			const types = player
				.getDiscardableCards(player, "h")
				.reduce((list, card) => {
					if (player.storage.taffyold_dcfuli.contains(get.type2(card))) return list;
					else return list.add(get.type2(card));
				}, [])
				.sort((a, b) => getNum(a) - getNum(b));
			if (types.length) {
				const {
					result: { control },
				} = await player
					.chooseControl(types)
					.set("ai", () => {
						const player = get.event("player"),
							types = get.event("controls").slice();
						const getNum = type => {
							const cards = player.getDiscardableCards(player, "h").filter(card => get.type2(card) == type);
							const countCards = (target, player, cards) => {
								return target.countCards("h") - (target == player ? cards.length : 0);
							};
							const max = game
								.findPlayer(target => {
									return !game.hasPlayer(target2 => {
										return countCards(target2, player, cards) > countCards(target, player, cards);
									});
								})
								.countCards("h");
							return (
								Math.min(
									max,
									cards.reduce((sum, card) => sum + get.cardNameLength(card), 0)
								) / cards.length
							);
						};
						return types.sort((a, b) => {
							return getNum(b) - getNum(a);
						})[0];
					})
					.set("prompt", "弃置一种类别的所有手牌，然后摸这些牌的名字字数之和的牌");
				if (control) {
					player.storage.taffyold_dcfuli.push(control);
					player.addTempSkill("taffyold_dcfuli_mark");
					const cards = player.getDiscardableCards(player, "h").filter(card => get.type2(card) == control);
					await player.discard(cards);
					const max = game.findPlayer(target => target.isMaxHandcard()).countCards("h");
					const num = Math.min(
						max,
						cards.reduce((sum, card) => sum + get.cardNameLength(card), 0)
					);
					if (num) await player.draw(num);
					if (cards.some(card => card.name != "shandian" && get.tag(card, "damage"))) {
						const {
							result: { bool, targets },
						} = await player.chooseTarget("抚黎：是否令一名角色的攻击范围-1直到你的下个回合开始？").set("ai", target => {
							const player = get.event("player"),
								num = target.getAttackRange();
							return -get.sgn(get.attitude(player, target)) * (target.getAttackRange() + (num <= 0 ? -num + 0.5 : num));
						});
						if (bool) {
							const target = targets[0];
							player.line(target);
							target.addSkill("taffyold_dcfuli_range");
							target.addMark("taffyold_dcfuli_range", 1, false);
							player
								.when(["phaseBegin", "dieBegin"])
								.then(() => {
									target.removeMark("taffyold_dcfuli_range", 1, false);
									if (!target.hasMark("taffyold_dcfuli_range")) target.removeSkill("taffyold_dcfuli_range");
								})
								.vars({ target: target });
						}
					}
				}
			}
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					const types = player.getDiscardableCards(player, "h").reduce((list, card) => {
						return list.add(get.type2(card));
					}, []);
					if (
						!types.some(type => {
							const cards = player.getDiscardableCards(player, "h").filter(card => get.type2(card) == type);
							const countCards = (target, player, cards) => {
								return target.countCards("h") - (target == player ? cards.length : 0);
							};
							return !game
								.filterPlayer(target => {
									return !game.hasPlayer(target2 => {
										return countCards(target2, player, cards) > countCards(target, player, cards);
									});
								})
								.includes(player);
						})
					)
						return 0;
					return 1;
				},
			},
		},
		group: "taffyold_dcfuli_clear",
		subSkill: {
			clear: {
				charlotte: true,
				direct: true,
				trigger: { player: "phaseEnd" },
				content: function () {
					player.storage.taffyold_dcfuli = [];
				},
			},
			range: {
				charlotte: true,
				onremove: true,
				mod: {
					attackRange(player, num) {
						return num - player.countMark("taffyold_dcfuli_range");
					},
				},
				marktext: " - ",
				intro: {
					content: "攻击范围-#",
				},
			},
			mark: {
				mark: true,
				intro: {
					onunmark: true,
					content: function (storage, player) {
						var str = "本回合已弃置过的类型：";
						for (var i of player.storage.taffyold_dcfuli) str += get.translation(i) + " ";
						return str;
					},
				},
			},
		},
	},
	// 旧乐祢衡
	taffyold_dcjigu: {
		audio: "dcjigu",
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		content() {
			const cards = player.getCards("h");
			player.addGaintag(cards, "taffyold_dcjigu");
		},
		mod: {
			ignoredHandcard(card) {
				if (card.hasGaintag("taffyold_dcjigu")) return true;
			},
			cardDiscardable(card, _, name) {
				if (name == "phaseDiscard" && card.hasGaintag("taffyold_dcjigu")) return false;
			},
		},
		group: "taffyold_dcjigu_temp",
		subSkill: {
			temp: {
				audio: "dcjigu",
				trigger: {
					player: "damageEnd",
					source: "damageSource",
				},
				filter(event, player) {
					return player.countCards("e") == player.countCards("h", card => card.hasGaintag("taffyold_dcjigu"));
				},
				prompt2(event, player) {
					return (
						"摸" +
						get.cnNumber(
							Array.from({ length: 5 })
								.map((_, i) => i + 1)
								.reduce((sum, i) => sum + player.countEmptySlot(i), 0)
						) +
						"张牌"
					);
				},
				content() {
					player.draw(
						Array.from({ length: 5 })
							.map((_, i) => i + 1)
							.reduce((sum, i) => sum + player.countEmptySlot(i), 0)
					);
				},
			},
		},
	},
	//旧荀彧荀攸
	taffyold_zhinang: {
		audio: "zhinang",
		getMap() {
			if (!_status.taffyold_zhinang_map) {
				_status.taffyold_zhinang_map = {
					name: {},
					info: {},
				};
				let list;
				if (_status.connectMode) {
					list = get.charactersOL();
				} else {
					list = get.gainableCharacters();
				}
				list.forEach(name => {
					if (name !== "taffyold_xunyuxunyou") {
						const skills = get.character(name, 3);
						skills.forEach(skill => {
							const info = get.info(skill);
							if (!info || (info.ai && info.ai.combo)) return;
							if (skill in _status.taffyold_zhinang_map) return;
							if (get.translation(skill).includes("谋")) _status.taffyold_zhinang_map.name[skill] = name;
							const voices = game.parseSkillText(skill, name);
							if (voices.some(data => data.includes("谋"))) {
								_status.taffyold_zhinang_map.info[skill] = name;
							}
						});
					}
				});
			}
			return _status.taffyold_zhinang_map;
		},
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player) {
			return ["trick", "equip"].includes(get.type2(event.card));
		},
		frequent: true,
		async content(event, trigger, player) {
			const map = lib.skill.taffyold_zhinang.getMap(),
				type = get.type2(trigger.card) == "equip" ? "name" : "info",
				list = Object.keys(map[type]);
			if (list.length > 0) {
				const skill = list.randomGet(),
					voiceMap = game.parseSkillTextMap(skill, map[type][skill]);
				if (type == "info") {
					findaudio: for (let data of voiceMap) {
						if (!data.text) continue;
						if (data.text.includes("谋")) {
							player.chat(data.text);
							game.broadcastAll(file => game.playAudio(file), data.file);
							break findaudio;
						}
					}
				} else player.flashAvatar("taffyold_zhinang", map[type][skill]);
				player.popup(skill);
				await player.addSkills(skill);
			}
		},
	},
	taffyold_gouzhu: {
		audio: "gouzhu",
		trigger: {
			player: ["useSkillAfter", "logSkill"],
		},
		filter(event, player) {
			if (["global", "equip"].includes(event.type)) return false;
			let skill = get.sourceSkillFor(event);
			if (!skill || skill == "taffyold_gouzhu") return false;
			let info = get.info(skill);
			while (true) {
				if (!info || info.charlotte || info.equipSkill) return false;
				if (info && !info.sourceSkill) break;
				skill = info.sourceSkill;
				info = get.info(skill);
			}
			let list = get.skillCategoriesOf(skill, player);
			return list.length && list.some(item => item in lib.skill.taffyold_gouzhu.effectMap);
		},
		frequent: true,
		effectMap: {
			锁定技: async function () {
				let player = _status.event.player;
				if (player.isDamaged()) await player.recover();
			},
			觉醒技: async function () {
				let player = _status.event.player;
				let card = get.cardPile(card => get.type(card) == "basic");
				if (card) await player.gain(card, "gain2");
			},
			限定技: async function () {
				let player = _status.event.player;
				let target = game.filterPlayer(current => current != player).randomGet();
				if (target) {
					player.line(target, "green");
					await target.damage(player);
				}
			},
			转换技: async function () {
				let player = _status.event.player;
				player.addMark("taffyold_gouzhu", 1, false);
				game.log(player, "手牌上限+1");
				await game.asyncDelay();
			},
			主公技: async function () {
				let player = _status.event.player;
				await player.gainMaxHp();
			},
		},
		mod: {
			maxHandcard: function (player, num) {
				return num + player.countMark("taffyold_gouzhu");
			},
		},
		intro: {
			content: "手牌上限+#",
		},
		locked: false,
		onremove: true,
		async content(event, trigger, player) {
			let skill = get.sourceSkillFor(trigger),
				info = get.info(skill);
			while (true) {
				if (info && !info.sourceSkill) break;
				skill = info.sourceSkill;
				info = get.info(skill);
			}
			let list = get.skillCategoriesOf(skill, player);
			for (const item of list) {
				if (item in lib.skill.taffyold_gouzhu.effectMap) {
					const next = game.createEvent("taffyold_gouzhu_effect", false);
					next.player = player;
					next.setContent(lib.skill.taffyold_gouzhu.effectMap[item]);
					await next;
				}
			}
		},
	},
	// 旧马钧
	taffyold_yjjingyi: {
		trigger: { player: "equipAfter" },
		forced: true,
		filter(event, player) {
			return event.cards?.length > 0;
		},
		async content(event, trigger, player) {
			const num = player.countCards("e");
			if (num > 0) await player.draw(num);
			if (player.countCards("he") > 0) await player.chooseToDiscard(2, "he", true);
		},
	},
	//旧武皇甫嵩
	taffyold_dclianjie: {
		audio: "dclianjie",
		trigger: {
			player: "useCardToPlayered",
		},
		locked: false,
		filter(event, player) {
			if (
				!game.hasPlayer(current => {
					return current.countCards("h");
				}) ||
				!player.hasHistory("lose", evt => {
					if (evt.getParent() != event.getParent()) return false;
					return event.cards.some(card => (evt.hs || []).includes(card));
				})
			)
				return false;
			const num = get.number(event.card, player) || 0;
			if (
				player.countCards("h", card => {
					return get.number(card, player) < num;
				})
			)
				return false;
			return true; //return !player.getStorage("taffyold_dclianjie_used").includes(num);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.name.slice(0, -5)), (card, player, target) => {
					return target.countCards("h");
				})
				.set("drawed", player.getStorage("taffyold_dclianjie_used").includes(get.number(trigger.card, player) || 0))
				.set("ai", target => {
					const player = get.player();
					const eff1 = get.effect(target, { name: "guohe_copy2" }, player, player);
					const eff2 = get.effect(target, { name: "draw" }, player, player);
					if (player == target && !get.event("drawed")) return eff2 * (1 + player.maxHp - player.countCards("h"));
					return eff1;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const cards = target.getCards("h"),
				minNumber = cards.map(card => get.number(card)).sort((a, b) => a - b)[0];
			const toLose = cards.filter(card => get.number(card) === minNumber);
			if (target != player || toLose.length <= 1) {
				await target.lose(toLose.randomGet(), ui.cardPile);
			} else {
				const result = await player
					.chooseCard("h", card => get.event("toLose")?.includes(card), true)
					.set("toLose", toLose)
					.set("ai", card => 10 - get.value(card))
					.forResult();
				if (result.bool) await player.lose(result.cards[0], ui.cardPile);
			}
			game.broadcastAll(function (player) {
				var cardx = ui.create.card();
				cardx.classList.add("infohidden");
				cardx.classList.add("infoflip");
				player.$throw(cardx, 1000, "nobroadcast");
			}, target);
			await game.delayx();
			const num = get.number(trigger.card, player) || 0;
			if (player.countCards("h") >= player.maxHp || player.getStorage("taffyold_dclianjie_used").includes(num)) return;
			player.addTempSkill("taffyold_dclianjie_used");
			player.markAuto("taffyold_dclianjie_used", num);
			const result = await player.drawTo(player.maxHp).forResult();
			if (result) player.addGaintag(result, "taffyold_dclianjie");
		},
		mod: {
			aiOrder(player, card, num) {
				var number = get.number(card, player);
				if (player.countCards("h") < player.maxHp) {
					return num + number / 10;
				} else if (!player.getStorage("taffyold_dclianjie_used").includes(number)) {
					return num - 0.5;
				}
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeGaintag("taffyold_dclianjie");
				},
				mod: {
					targetInRange(card, player, target) {
						if (get.suit(card) == "unsure") return true;
						if (!card.cards) return;
						for (var i of card.cards) {
							if (i.hasGaintag("taffyold_dclianjie")) return true;
						}
					},
					cardUsable(card, player, num) {
						if (get.suit(card) == "unsure") return Infinity;
						if (!card.cards) return;
						for (var i of card.cards) {
							if (i.hasGaintag("taffyold_dclianjie")) return Infinity;
						}
					},
				},
				intro: {
					content: (storage, player) =>
						`已摸点数：${get
							.translation(storage.sort((a, b) => a - b))
							.replace("13", "K")
							.replace("12", "Q")
							.replace("11", "J")
							.replace("1", "A")}`,
				},
			},
		},
	},
	taffyold_dcjiangxian: {
		audio: "dcjiangxian",
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.addTempSkill(event.name + "_effect");
			const evtx = event.getParent("phase", true, true);
			player
				.when({ global: "phaseAfter" })
				.filter((evt, player) => {
					return evt == evtx && ["dcchaozhen", "taffyold_dclianjie"].some(skill => player.hasSkill(skill, null, null, false));
				})
				.step(async () => {
					const {
						result: { bool, links },
					} = await player
						.chooseButton(
							[
								"将贤：请选择一项",
								[
									[
										["dcchaozhen", "失去〖朝镇〗"],
										["taffyold_dclianjie", "失去〖连捷〗"],
									],
									"textbutton",
								],
							],
							true
						)
						.set("filterButton", button => {
							const player = get.player();
							return player.hasSkill(button.link, null, null, false);
						})
						.set("ai", button => {
							if (button.link == "dcchaozhen" && player.getHp() > 2) return 1.1;
							return 1;
						});
					if (bool) await player.removeSkills(links);
				});
		},
		subSkill: {
			effect: {
				charlotte: true,
				mark: true,
				intro: {
					content: "本回合因使用〖连捷〗摸的牌造成的伤害+X（X为你本回合造成伤害的次数且至多为5），回合结束后失去〖连捷〗或〖朝镇〗",
				},
				trigger: {
					source: "damageBegin1",
				},
				filter(event, player) {
					if (
						!player.hasHistory("lose", evt => {
							let gaintag = false;
							if (evt.getParent() != event.getParent("useCard")) return false;
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("taffyold_dclianjie")) gaintag = true;
							}
							return gaintag && event.cards.some(card => (evt.hs || []).includes(card));
						})
					)
						return false;
					return player.getHistory("sourceDamage").length > 0;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					trigger.num += Math.min(5, player.getHistory("sourceDamage").length);
				},
			},
		},
		ai: {
			order: 9,
			threaten: 2.9,
			result: {
				player(player) {
					if (!game.hasPlayer(current => get.attitude(player, current) < 0)) return 0;
					return player.countCards("h", card => card.hasGaintag("taffyold_dclianjie") && player.hasUseTarget(card)) > 2 ? 4 : 0;
				},
			},
			combo: "taffyold_dclianjie",
		},
	},
	//旧神庞统
	//复活神将
	taffyold_kunyu: {
		audio: "kunyu",
		trigger: { player: "dieBegin" },
		filter(event, player) {
			if (!(event.getParent().name !== "giveup" && player.maxHp > 0)) return false;
			return get.cardPile2(c => get.tag(c, "fireDamage"));
		},
		forced: true,
		async content(event, trigger, player) {
			const card = get.cardPile2(c => get.tag(c, "fireDamage"));
			if (!card) return;
			await game.cardsGotoSpecial(card);
			game.log(player, "将", card, "移出游戏");
			trigger.cancel();
			await player.recoverTo(1);
		},
	},
	//旧威孙权
	taffyold_dcwoheng: {
		audio: "dcwoheng",
		trigger: {
			player: "damageEnd",
		},
		enable: "phaseUse",
		filterTarget: true,
		prompt(event) {
			const { player } = event;
			const num = player.getRoundHistory("useSkill", evt => evt.skill == "taffyold_dcwoheng").length;
			return `令一名角色摸或弃置${num + 1}张牌`;
		},
		async cost(event, trigger, player) {
			const num = player.getRoundHistory("useSkill", evt => evt.skill == "taffyold_dcwoheng").length;
			event.result = await player.chooseTarget(`令一名角色摸或弃置${num + 1}张牌`).forResult();
		},
		async content(event, trigger, player) {
			const num = player.getRoundHistory("useSkill", evt => evt.skill == "taffyold_dcwoheng").length;
			const [target] = event.targets;
			const str1 = "摸" + get.cnNumber(num, true);
			const str2 = "弃" + get.cnNumber(num, true);
			const list = [str1];
			if (
				target.countCards("he", function (card) {
					return lib.filter.cardDiscardable(card, target);
				})
			) {
				list.push(str2);
			}
			let directcontrol =
				str1 ==
				(await player
					.chooseControl(list, function (event, player) {
						return _status.event.choice;
					})
					.set("choice", get.attitude(player, target) > 0 ? str1 : str2)
					.forResultControl());
			if (directcontrol) {
				await target.draw(num);
			} else {
				await target.chooseToDiscard(num, true, "he");
			}
			if (target == player || player.countCards("h") !== target.countCards("h")) {
				player.tempBanSkill("taffyold_dcwoheng");
			}
		},
	},
	taffyold_dcjizheng: {
		feedPigSkill: true,
		zhuSkill: true,
		unique: true,
		audio: "dcyuhui",
		global: "taffyold_dcjizheng_global",
		subSkill: {
			global: {
				enable: "phaseUse",
				discard: false,
				lose: false,
				delay: false,
				line: true,
				log: false,
				prepare: function (cards, player, targets) {
					targets[0].logSkill("taffyold_dcjizheng");
				},
				prompt: function () {
					var player = _status.event.player;
					var list = game.filterPlayer(function (target) {
						return target != player && target.hasZhuSkill("taffyold_dcjizheng", player);
					});
					var str = "将一张牌交给" + get.translation(list);
					if (list.length > 1) str += "中的一人";
					return str;
				},
				filter: function (event, player) {
					if (player.countCards("h", lib.skill.taffyold_dcjizheng_global.filterCard) == 0) return false;
					return game.hasPlayer(function (target) {
						return target != player && target.hasZhuSkill("taffyold_dcjizheng", player) && !target.hasSkill("taffyold_dcjizheng_blocker");
					});
				},
				filterCard: function (card) {
					return true;
				},
				visible: true,
				filterTarget: function (card, player, target) {
					return target != player && target.hasZhuSkill("taffyold_dcjizheng", player) && !target.hasSkill("taffyold_dcjizheng_blocker");
				},
				async content(event, trigger, player) {
					const { cards, targets } = event;
					await player.give(cards, targets[0]);
					targets[0].addTempSkill("taffyold_dcjizheng_blocker", "phaseUseEnd");
					if (player.group == "wu") {
						player.addTempSkill("taffyold_dcjizheng_buff");
					} else {
						player.addTempSkill("taffyold_dcjizheng_buff", { player: "useCardAfter" });
					}
				},
				ai: {
					expose: 0.3,
					order: 1,
					result: {
						target: 5,
					},
				},
			},
			blocker: {
				charlotte: true,
				onremove: true,
			},
			buff: {
				charlotte: true,
				mod: {
					targetInRange: function (card, player) {
						return true;
					},
				},
			},
		},
	},
	//旧庞凤衣
	taffyold_dcyitong: {
		audio: "dcyitong",
		trigger: {
			global: ["phaseBefore", "loseAfter", "loseAsyncAfter", "cardsDiscardAfter"],
			player: "enterGame",
		},
		filter(event, player, name) {
			const suits = player.getStorage("taffyold_dcyitong");
			if (name === "phaseBefore" || name === "enterGame") {
				return suits.length < 4 && (event.name !== "phase" || game.phaseNumber === 0);
			}
			return suits.some(suit => {
				if (!event.getd?.().some(card => get.suit(card, false) === suit)) return false;
				return (
					game
						.getGlobalHistory("everything", evt => {
							return evt.getd?.()?.some(card => get.suit(card, false) === suit);
						})
						.indexOf(event) === 0
				);
			});
		},
		forced: true,
		async content(event, trigger, player) {
			const name = event.triggername,
				storage = player.getStorage("taffyold_dcyitong"),
				suits = lib.suit
					.filter(suit => {
						if (name === "phaseBefore" || name === "enterGame") return !storage.includes(suit);
						if (!storage.includes(suit) || !trigger.getd?.().some(card => get.suit(card, false) === suit)) return false;
						return (
							game
								.getGlobalHistory("everything", evt => {
									return evt.getd?.()?.some(card => get.suit(card, false) === suit);
								})
								.indexOf(trigger) === 0
						);
					})
					.reverse();
			if (name === "phaseBefore" || name === "enterGame") {
				const result =
					suits.length > 1
						? await player
								.chooseControl(suits)
								.set("ai", () => {
									return get.event().controls.randomGet();
								})
								.set("prompt", "异瞳：请记录一个花色")
								.forResult()
						: { control: suits[0] };
				const suit = result.control;
				if (suit) {
					player.markAuto("taffyold_dcyitong", [suit]);
					player.addTip("taffyold_dcyitong", get.translation("taffyold_dcyitong") + player.getStorage("taffyold_dcyitong").reduce((str, suit) => str + get.translation(suit), ""));
				}
			} else {
				let gains = [];
				for (const suitx of suits) {
					for (const suit of lib.suit.slice().reverse()) {
						if (suitx === suit) continue;
						const card = get.cardPile(card => get.suit(card) === suit && !gains.includes(card));
						if (card) gains.push(card);
					}
				}
				if (gains.length) await player.gain(gains, "gain2");
			}
		},
		onremove(player, skill) {
			delete player.storage[skill];
			player.removeTip(skill);
		},
		intro: { content: "已记录$花色" },
	},
	taffyold_dcpeiniang: {
		audio: "dcpeiniang",
		mod: {
			cardUsable(card) {
				if (card?.storage?.taffyold_dcpeiniang) return Infinity;
			},
		},
		enable: "chooseToUse",
		filterCard(card, player) {
			return player.getStorage("taffyold_dcyitong").includes(get.suit(card));
		},
		viewAs: {
			name: "jiu",
			storage: { taffyold_dcpeiniang: true },
		},
		prompt() {
			const player = get.player();
			return "将" + player.getStorage("taffyold_dcyitong").reduce((str, suit) => str + get.translation(suit), "") + "牌当作【酒】使用";
		},
		check(card, player) {
			return 0 + lib.skill.oljiuchi?.check?.(card, player);
		},
		precontent() {
			event.getParent().addCount = false;
		},
		position: "hes",
		ai: {
			jiuOther: true,
			combo: "taffyold_dcyitong",
		},
		trigger: { source: "recoverBegin" },
		filter(event, player) {
			if (event.name === "chooseToUse") return player.hasCard(card => lib.skill.taffyold_dcpeiniang.filterCard(card, player), "hes");
			return event.getParent()?.name === "jiu" && event.num + event.player.hp < 1;
		},
		forced: true,
		locked: false,
		logTarget: "player",
		content() {
			trigger.num = 1 - trigger.player.hp;
		},
	},
	//群祝融
	taffyold_dcremanhou: {
		audio: "dcmanhou",
		enable: "phaseUse",
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("###蛮后###摸至多四张牌并执行等量项");
			},
			chooseControl(event, player) {
				var list = Array.from({
					length: 4,
				}).map((_, i) => get.cnNumber(i + 1) + "张");
				list.push("cancel2");
				return list;
			},
			check(event, player) {
				if (get.effect(player, { name: "losehp" }, player, player) > 4 || player.countCards("hs", card => player.canSaveCard(card, player)) > 0 || player.hp > 2) return "四张";
				return "两张";
			},
			backup(result, player) {
				return {
					num: result.control,
					audio: "dcmanhou",
					filterCard: () => false,
					selectCard: -1,
					async content(event, trigger, player) {
						var num =
							Array.from({
								length: 4,
							})
								.map((_, i) => get.cnNumber(i + 1) + "张")
								.indexOf(lib.skill.taffyold_dcremanhou_backup.num) + 1;
						await player.draw(num);
						if (num >= 1) await player.removeSkills("taffyold_dcretanluan");
						if (num >= 2 && player.countCards("h")) await player.chooseToDiscard("h", true);
						if (num >= 3) {
							await player.loseHp();
							if (game.hasPlayer(target => target !== player && target.countCards("h"))) {
								const [target] =
									(await player
										.chooseTarget("是否获得一名其他角色的一张手牌？", (card, player, target) => {
											return target !== player && target.countCards("h");
										})
										.set("ai", target => {
											const player = get.player();
											return get.effect(target, { name: "shunshou_copy", position: "h" }, player, player);
										})
										.forResult("targets")) ?? [];
								if (target) {
									player.line(target);
									await player.gainPlayerCard(target, "h", true);
								}
							}
						}
						if (num >= 4) {
							if (game.hasPlayer(target => target.countDiscardableCards(player, "ej"))) {
								const [target] =
									(await player
										.chooseTarget(
											"弃置场上的一张牌",
											(card, player, target) => {
												return target.countDiscardableCards(player, "ej");
											},
											true
										)
										.set("ai", target => {
											const player = get.player();
											return get.effect(target, { name: "guohe_copy", position: "ej" }, player, player);
										})
										.forResult("targets")) ?? [];
								if (target) {
									player.line(target);
									await player.discardPlayerCard(target, "ej", true);
								}
							}
							await player.addSkills("taffyold_dcretanluan");
						}
					},
				};
			},
		},
		ai: {
			order: 8,
			result: { player: 1 },
		},
		subSkill: { backup: {} },
	},
	taffyold_dcretanluan: {
		init(player, skill) {
			if (typeof player.getStat("skill")?.[skill] === "number") {
				delete player.getStat("skill")[skill];
			}
		},
		onChooseToUse(event) {
			if (!game.online && !event.taffyold_dcretanluan) {
				event.set(
					"taffyold_dcretanluan",
					game.filterPlayer2().reduce((list, target) => {
						return list.addArray(
							target
								.getHistory("lose", evt => {
									return evt.type === "discard";
								})
								.map(evt => evt.cards.filterInD("d"))
								.flat()
								.unique()
						);
					}, [])
				);
			}
		},
		audio: "dctanluan",
		enable: "phaseUse",
		filter(event, player) {
			return event.taffyold_dcretanluan?.some(card => player.hasUseTarget(card));
		},
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				const dialog = ui.create.dialog('###探乱###<div class="text center">' + lib.translate.taffyold_dcretanluan_info + "</div>");
				dialog.add(event.taffyold_dcretanluan);
				return dialog;
			},
			filter(button, player) {
				return player.hasUseTarget(button.link);
			},
			check(button) {
				const card = button.link;
				return get.player().getUseValue(card) * (get.tag(card, "damage") >= 1 ? 3 : 1);
			},
			prompt(links) {
				return '###探乱###<div class="text center">使用' + get.translation(links) + "，若你因此造成伤害，则重置〖蛮后〗</div>";
			},
			backup(links, player) {
				return {
					audio: "dctanluan",
					filterCard: () => false,
					selectCard: -1,
					popname: true,
					viewAs: links[0],
					card: links[0],
					precontent() {
						player.addTempSkill("taffyold_dcretanluan_effect");
						const card = get.info("taffyold_dcretanluan_backup").card;
						event.result.cards = [card];
						event.result.card = get.autoViewAs(card, [card]);
						event.result.card.taffyold_dcretanluan = true;
					},
				};
			},
		},
		subSkill: {
			backup: {},
			effect: {
				charlotte: true,
				audio: "dctanluan",
				trigger: { source: "damageSource" },
				filter(event, player) {
					if (typeof player.getStat("skill")["taffyold_dcremanhou"] !== "number") return false;
					return event.card?.taffyold_dcretanluan === true;
				},
				forced: true,
				content() {
					delete player.getStat("skill")["taffyold_dcremanhou"];
					player.popup("taffyold_dcremanhou");
					game.log(player, "重置了技能", "【" + get.translation("taffyold_dcremanhou") + "】");
				},
			},
		},
	},
	//旧二刘
	taffyold_dcllqixin: {
		audio: "dcllqixin",
		trigger: {
			player: ["gainAfter", "useCard"],
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (event.name === "useCard") return event.getParent(2).name !== "taffyold_dcllqixin" && get.type(event.card) === "basic";
			if (event.name === "gain" && (event.getParent().name !== "draw" || event.getParent(2).name === "taffyold_dcllqixin")) return false;
			if (event.name !== "gain" && event.type !== "draw") return false;
			return event.getg(player).length === 2;
		},
		direct: true,
		clearTime: true,
		frequent: true,
		async content(event, trigger, player) {
			if (trigger.name === "useCard") {
				const bool = await player.chooseBool(get.prompt(event.name), "摸两张牌").set("frequentSkill", event.name).forResult("bool");
				if (bool) {
					player.logSkill(event.name);
					await player.draw(2);
				}
			} else {
				await player
					.chooseToUse(function (card, player, event) {
						if (get.type(card) !== "basic") return false;
						return lib.filter.cardEnabled.apply(this, arguments);
					}, get.translation(event.name) + "：是否使用一张基本牌？")
					.set("logSkill", event.name)
					.set("addCount", false);
			}
		},
	},
	// 旧新杀诸葛均
	taffyold_dcgumai: {
		audio: "dcgumai",
		trigger: {
			player: "damageBegin3",
			source: "damageBegin1",
		},
		usable: 1,
		filter(event, player) {
			return player.countCards("h");
		},
		async content(event, trigger, player) {
			const suit = get.suit(player.getCards("h")[0], player),
				bool = player.getCards("h").every(i => get.suit(i, player) == suit);
			await player.showHandcards(`${get.translation(player)}发动了【孤脉】`);
			const result = await player
				.chooseControl("+1", "-1")
				.set("prompt", "令此伤害+1或-1")
				.set("ai", () => {
					if (_status.event.eff < 0) {
						return 1;
					}
					return 0;
				})
				.set("eff", get.damageEffect(trigger.player, trigger.source, player))
				.forResult();
			if (result.index == 0) {
				trigger.num++;
				player.popup(" +1 ", "fire");
				game.log(player, "令此伤害+1");
			}
			if (result.index == 1) {
				trigger.num--;
				player.popup(" -1 ", "water");
				game.log(player, "令此伤害-1");
			}
			if (bool) {
				const result2 = await player
					.chooseToDiscard("h", "是否弃置一张手牌并重置【孤脉】？")
					.set("ai", card => {
						const { player, eff } = get.event();
						if (eff) {
							return 7 - get.value(card);
						}
						return 0;
					})
					.set("eff", player.countCards("hs", card => player.hasValueTarget(card) && get.tag(card, "damage")) > 0)
					.forResult();
				if (result2.bool) {
					player.storage.counttrigger.taffyold_dcgumai--;
				}
			}
		},
	},
	// 旧新杀夏侯玄
	taffyold_dcyizheng: {
		audio: "dcyizheng",
		trigger: { player: ["phaseBegin", "phaseEnd"] },
		filter(event, player) {
			return (
				player.countCards("h") &&
				game.hasPlayer(target => {
					return target != player && target.countCards("h");
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), [1, Infinity], (card, player, target) => {
					return target != player && target.countCards("h");
				})
				.set("ai", target => {
					if (player.hp == 1) {
						return 0;
					}
					return -get.attitude(get.player(), target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = [player].concat(event.targets).sortBySeat();
			//先选牌
			let showEvent = player
				.chooseCardOL(targets, "议政：请选择要展示的牌", true)
				.set("ai", function (card) {
					return -get.value(card);
				})
				.set("source", player);
			showEvent.aiCard = function (target) {
				const hs = target.getCards("h");
				return { bool: true, cards: [hs.randomGet()] };
			};
			showEvent._args.remove("glow_result");
			const result = await showEvent.forResult();
			const cards = [];
			for (var i = 0; i < targets.length; i++) {
				cards.push(result[i].cards[0]);
			}
			//新建showCards事件，不然没法兼容庞宏、OL罗宪这些角色的技能
			let next = game.createEvent("showCards");
			next.set("player", player);
			next.set("targets", targets);
			next.set("cards", cards);
			next.set("skill", event.name);
			next.setContent(() => {
				//照搬showCards的事件然后改动了一下dialog
				"step 0";
				event.dialog = ui.create.dialog(`${get.translation(player)} 发动了〖${get.translation(event.skill)}〗`, cards);
				event.dialogid = lib.status.videoId++;
				event.dialog.videoId = event.dialogid;
				game.broadcastAll(
					function (skill, targets, cards, id, player) {
						let dialog = ui.create.dialog(`${get.translation(player)} 发动了〖${get.translation(skill)}〗`, cards);
						dialog.videoId = id;
						const getName = function (target) {
							if (target._tempTranslate) {
								return target._tempTranslate;
							}
							const name = target.name;
							if (lib.translate[name + "_ab"]) {
								return lib.translate[name + "_ab"];
							}
							return get.translation(name);
						};
						for (let i = 0; i < targets.length; i++) {
							dialog.buttons[i].querySelector(".info").innerHTML = getName(targets[i]) + get.translation(cards[i].suit) + cards[i].number;
						}
					},
					event.skill,
					targets,
					cards,
					event.dialogid,
					player
				);
				for (let i = 0; i < targets.length; i++) {
					game.log(targets[i], "展示了", cards[i]);
				}
				game.addCardKnower(cards, "everyone");
				game.delay(4);
				game.addVideo("showCards", player, [get.translation(player) + "发动了〖议政〗", get.cardsInfo(cards)]);
				("step 1");
				game.broadcastAll("closeDialog", event.dialogid);
				event.dialog.close();
			});
			await next;
			if (cards.map(card => get.type2(card)).unique().length == 1) {
				player.popup("洗具");
				const result = await player
					.chooseTarget(true)
					.set("createDialog", [`议政：令一名角色获得这些牌`, cards])
					.set("ai", target => get.attitude(get.player(), target))
					.forResult();
				if (result?.targets) {
					const target = result.targets[0];
					player.line(target);
					let gainEvent = target.gain(cards);
					gainEvent.set(
						"givers",
						targets.filter(i => i != target)
					);
					gainEvent.set("animate", function (event) {
						const player = event.player,
							cards = event.cards,
							givers = event.givers;
						for (let i = 0; i < givers.length; i++) {
							givers[i].$give(cards[i], player);
						}
						return 500;
					});
					await gainEvent;
				}
			} else {
				player.popup("杯具");
				await game
					.loseAsync({
						lose_list: targets.map((target, index) => {
							return [target, [cards[index]]];
						}),
						discarder: player,
					})
					.setContent("discardMultiple");
			}
		},
	},
	taffyold_dcguilin: {
		audio: "dcguilin",
		derivation: ["dcboxuan_rewrite"],
		limited: true,
		unique: true,
		skillAnimation: true,
		animationColor: "thunder",
		enable: "phaseUse",
		trigger: { player: "dying" },
		filter(event, player) {
			if (event.name == "dying") {
				return player.isDying();
			}
			return player.isDamaged();
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const num = player.getDamagedHp();
			await player.recover(num);
			await player.draw(num);
			await player.removeSkills("taffyold_dcyizheng");
			if (player.hasSkill("dcboxuan")) {
				player.storage.dcboxuan = true;
			}
			game.log(player, `修改了〖博玄〗`);
		},
		ai: {
			order: 5,
			result: {
				player: 1,
			},
		},
	},
	//旧任婉
	taffyold_dcjuanji: {
		trigger: {
			player: ["phaseUseBegin", "phaseDrawBegin", "phaseDiscardBegin"],
		},
		filter(event, player) {
			if (event.name == "phaseUse") {
				const card = new lib.element.VCard({ name: "sha" });
				return player.hasUseTarget(card, false);
			}
			if (event.name == "phaseDiscard") {
				return player.countCards("h") != player.getHandcardLimit();
			}
			return true;
		},
		audio: "dcjuanji",
		async cost(event, trigger, player) {
			const name = trigger.name.slice(5);
			event.result =
				name == "Draw"
					? await player.chooseBool(get.prompt(event.skill)).set("prompt2", "摸体力上限张牌").forResult()
					: name == "Use"
					? await player
							.chooseTarget(get.prompt(event.skill))
							.set("prompt2", "失去1点体力并视为对一名角色使用一张【杀】")
							.set("filterTarget", (event, player, target) => {
								const card = new lib.element.VCard({ name: "sha" });
								return player.canUse(card, target, false);
							})
							.set("ai", target => {
								const card = new lib.element.VCard({ name: "sha" }),
									player = get.player(),
									eff1 = get.effect(target, card, player, player),
									eff2 = get.effect(player, { name: "losehp" }, player, player);
								return Math.max(0, eff1 - eff2);
							})
							.forResult()
					: await player
							.chooseCardTarget({
								filterCard(card, player) {
									const num = get.event("numx");
									return num > 0 && lib.filter.cardDiscardable(card, player, "taffyold_dcjuanji");
								},
								prompt: get.prompt(event.skill),
								prompt2: "将手牌调整至手牌上限，然后弃置一名角色区域里至多两张牌",
								numx: player.countCards("h") - player.getHandcardLimit(),
								selectCard() {
									const num = get.event("numx");
									if (num > 0) {
										return num;
									}
									return -1;
								},
								filterTarget(card, player, target) {
									return player == target || target.countCards("hej");
								},
								ai1(card) {
									return 10 - get.value(card);
								},
								ai2(target) {
									const player = get.player();
									return get.effect(target, { name: "guohe" }, player, player);
								},
							})
							.forResult();
		},
		async content(event, trigger, player) {
			const name = trigger.name.slice(5);
			if (name == "Draw") {
				await player.draw(player.maxHp);
			} else if (name == "Use") {
				const {
					targets: [target],
				} = event;
				const card = new lib.element.VCard({ name: "sha" });
				await player.loseHp();
				await player.useCard(card, target, false);
			} else {
				const {
					cards,
					targets: [target],
				} = event;
				if (cards?.length) {
					await player.discard(cards);
				} else {
					await player.drawTo(player.getHandcardLimit());
				}
				if (target.countCards("hej")) {
					await player.discardPlayerCard(target, "hej", [1, 2], true);
				}
			}
		},
	},
	taffyold_dcrenshuang: {
		trigger: {
			player: ["dying", "dyingAfter"],
		},
		audio: "dcrenshuang",
		filter(event, player, name) {
			if (name == "dyingAfter") {
				return player.isIn();
			}
			return game.getRoundHistory("everything", evt => evt.name == "dying" && evt.player == player).indexOf(event) == 0;
		},
		forced: true,
		async content(event, trigger, player) {
			if (event.triggername == "dying") {
				await player.recoverTo(1);
				if (player.getAllHistory("custom", evt => evt.taffyold_dcrenshuang).length < 3) {
					player.getHistory("custom").push({
						taffyold_dcrenshuang: true,
					});
					await player.gainMaxHp();
				}
			} else {
				await player.link(false);
				await player.turnOver(false);
				const cards = get.inpileVCardList(info => info[0] == "trick" && player.hasUseTarget(info[2]));
				if (!cards?.length) {
					return;
				}
				const result = await player
					.chooseButton(["纫霜：选择要视为使用的牌", [cards, "vcard"]], true)
					.set("ai", button => {
						return get.player().getUseValue(button.link[2]);
					})
					.forResult();
				if (result?.bool) {
					const card = new lib.element.VCard({ name: result.links[0][2] });
					if (player.hasUseTarget(card)) {
						await player.chooseUseTarget(card, true);
					}
				}
			}
		},
	},
	// 爻袁术二号
	taffyyao_yaoyi: {
		init(player, skill) {
			game.broadcastAll(
				(player, skill) => {
					const observer = new MutationObserver(mutationsList => {
						for (const mutation of mutationsList) {
							if (mutation.type === "childList") {
								const cards = player._start_cards ?? [];
								if (player.node.handcards1.cardMod[skill] && !_status.gameDrawed) {
									for (const card of mutation.addedNodes) {
										if (cards.includes(card)) {
											game.broadcastAll(
												(card, skill) => {
													card.classList.add(skill);
													card.addGaintag(`${skill}_tag`);
												},
												card,
												skill
											);
											console.log(card.classList.contains("taffyyao_yaoyi"));
										}
									}
								}
								for (const card of mutation.removedNodes) {
									if (cards.includes(card)) {
										game.broadcastAll((card, skill) => card.classList.remove(skill), card, skill);
										console.log(card.classList.contains("taffyyao_yaoyi"));
									}
								}
							}
						}
					});
					const config = {
						childList: true,
					};
					observer.observe(player.node.handcards1, config);
					observer.observe(player.node.handcards2, config);
					player.node.handcards1.cardMod ??= {};
					player.node.handcards2.cardMod ??= {};
					const cardMod = card => {
						if (card.classList.contains(skill)) return ["爻疑", "此牌对你不可见"];
					};
					player.node.handcards1.cardMod[skill] = cardMod;
					player.node.handcards2.cardMod[skill] = cardMod;
					player.node.handcards1.classList.add(skill);
					player.node.handcards2.classList.add(skill);
					if (!ui.css[skill]) {
						ui.css[skill] = lib.init.sheet([".handcards.taffyyao_yaoyi>.card.taffyyao_yaoyi {", "background-image: var(--cardback-url) !important;", "background-size: 100% 100% !important;", "background-position: center !important;", "}"].join(""));
						lib.init.sheet([".handcards.taffyyao_yaoyi>.card.taffyyao_yaoyi > * {", "visibility: hidden !important;", "}"].join(""));
					}
					const { card, blank, ...others } = ui.create.buttonPresets;
					ui.create.buttonPresets = {
						...others,
						card(item, ...args) {
							if (item.classList.contains(skill) && args[args.length - 1] !== skill) return blank(item, ...args, skill);
							return card(item, ...args);
						},
						blank(item, ...args) {
							if (item.classList.contains(skill) && args[args.length - 1] !== skill) return card(item, ...args, skill);
							return blank(item, ...args);
						},
					};
				},
				player,
				skill
			);
		},
		onremove(player, skill) {
			player.removeGaintag(`${skill}_tag`);
			game.broadcastAll(
				(player, skill) => {
					player.node.handcards1.classList.remove(skill);
					player.node.handcards2.classList.remove(skill);
					delete player.node.handcards1.cardMod[skill];
					delete player.node.handcards2.cardMod[skill];
					player.getCards("h", card => card.classList.contains(skill)).forEach(card => card.classList.remove(skill));
				},
				player,
				skill
			);
		},
		enable: "chooseToUse",
		filter(event, player) {
			return player.hasCard(cardx => cardx.classList.contains("taffyyao_yaoyi"), "h");
		},
		chooseButton: {
			dialog(event, player) {
				const list = get
					.inpileVCardList(info => lib.skill.taffyyao_yaoyi.hiddenCard(player, info[2]))
					.filter(info => {
						const card = {
							name: info[2],
							nature: info[3],
						};
						return player.hasCard(
							cardx =>
								cardx.classList.contains("taffyyao_yaoyi") &&
								event.filterCard(
									{
										...card,
										cards: [cardx],
									},
									player,
									event
								),
							"h"
						);
					});
				return ui.create.dialog("爻疑", [list, "vcard"]);
			},
			filter(button, player) {
				const event = get.event().getParent(),
					info = button.link,
					card = {
						name: info[2],
						nature: info[3],
					};
				return player.hasCard(
					cardx =>
						cardx.classList.contains("taffyyao_yaoyi") &&
						event.filterCard(
							{
								...card,
								cards: [cardx],
							},
							player,
							event
						),
					"h"
				);
			},
			check(button) {
				const event = get.event().getParent();
				if (event.type !== "phase") return 1;
				return get.player().getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			prompt(links) {
				const event = get.event().getParent();
				return "将一张背置牌当作" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】" + (event.name === "chooseToRespond" ? "打出" : "使用");
			},
			backup(links, player) {
				return {
					filterCard(card) {
						return card.classList.contains("taffyyao_yaoyi");
					},
					popname: true,
					check(card) {
						return 1 + Math.random();
					},
					position: "hse",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					precontent() {
						player.addTempSkill("taffyyao_yaoyi_used");
						player.markAuto("taffyyao_yaoyi_used", [event.result.card.name]);
					},
				};
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name) || player.getStorage("taffyyao_yaoyi_used").includes(name)) return false;
			return ["basic", "trick"].includes(get.type(name)) && player.hasCard(card => _status.connectMode || card.classList.contains("taffyyao_yaoyi"), "h");
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (!player.hasCard(card => _status.connectMode || card.classList.contains("taffyyao_yaoyi"), "h")) return false;
			},
			order(item, player) {
				if (player && _status.event.type == "phase") {
					const list = get.inpileVCardList(info => lib.skill.taffyyao_yaoyi.hiddenCard(player, info[2]));
					let max = 0;
					list.forEach(info => {
						const card = {
							name: info[2],
							nature: info[3],
						};
						if (player.getUseValue(card) > 0) {
							const temp = get.order(card);
							if (temp > max) max = temp;
						}
					});
					if (max > 0) max += 1;
					return max;
				}
				return 1;
			},
			result: {
				player(player) {
					return get.event().dying ? get.attitude(player, get.event().dying) : 1;
				},
			},
		},
		group: "taffyyao_yaoyi_ban",
		subSkill: {
			ban: {
				mod: {
					cardname: function (card, player, name) {
						if (card.hasGaintag("taffyyao_yaoyi_tag")) return "hschenzhi_poker";
					},
				},
				sub: true,
				sourceSkill: "taffyyao_yaoyi",
				_priority: 0,
			},
			backup: {
				sub: true,
				sourceSkill: "taffyyao_yaoyi",
				_priority: 0,
			},
			tag: {
				sub: true,
				sourceSkill: "taffyyao_yaoyi",
				_priority: 0,
			},
			used: {
				charlotte: true,
				onremove: true,
				sub: true,
				sourceSkill: "taffyyao_yaoyi",
				_priority: 0,
			},
		},
		_priority: 0,
	},
	taffyyao_chenwei: {
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			if (
				player.hasHistory("lose", evt => {
					if (evt.getParent() !== event) return false;
					return Object.values(evt.gaintag_map).flat().includes("taffyyao_yaoyi_tag");
				}) === !!player.storage.taffyyao_chenwei
			)
				return false;
			if (!player.storage.taffyyao_chenwei) return player.countCards("h") > 0;
			return game.hasPlayer(target => target !== player && target.countGainableCards(player, "he"));
		},
		async cost(event, trigger, player) {
			const next = player.chooseTarget(get.prompt(event.skill));
			if (player.storage[event.skill]) {
				next.prompt2 = "获得一名其他角色的一张牌并将此牌背置";
				next.filterTarget = function (card, player, target) {
					return target !== player && target.countGainableCards(player, "he");
				};
				next.ai = function (target) {
					const player = get.player();
					return get.effect(
						target,
						{
							name: "shunshou_copy2",
						},
						player,
						player
					);
				};
			} else {
				next.prompt2 = "令一名角色将你的一张手牌翻面";
				next.ai = function (target) {
					const player = get.player();
					return 1 + Math.sign(get.attitude(player, target)) + Math.random();
				};
			}
			event.result = await next.forResult();
		},
		async content(event, trigger, player) {
			const storage = player.storage[event.name],
				target = event.targets[0];
			player.changeZhuanhuanji(event.name);
			if (storage) {
				const result = await player.gainPlayerCard(target, "he", true).forResult();
				if (result?.bool && result.cards?.some(i => get.position(i) === "h" && get.owner(i) === player && !i.classList.contains("taffyyao_yaoyi"))) {
					game.broadcastAll(
						cards => {
							for (const card of cards) {
								card.classList.add("taffyyao_yaoyi");
								card.addGaintag("taffyyao_yaoyi_tag");
							}
						},
						result.cards.filter(i => get.position(i) === "h" && get.owner(i) === player && !i.classList.contains("taffyyao_yaoyi"))
					);
				}
			} else {
				const result = await target
					.choosePlayerCard(player, "h", true)
					.set("prompt2", `将${get.translation(player)}的一张手牌翻面`)
					.forResult();
				if (result?.bool && result.cards?.some(i => get.position(i) === "h" && get.owner(i) === player)) {
					game.broadcastAll(
						cards => {
							for (const card of cards) {
								card.classList.toggle("taffyyao_yaoyi");
								card[card.hasGaintag("taffyyao_yaoyi_tag") ? "removeGaintag" : "addGaintag"]("taffyyao_yaoyi_tag");
							}
						},
						result.cards.filter(i => get.position(i) === "h" && get.owner(i) === player)
					);
				}
			}
		},
		zhuanhuanji: true,
		marktext: "☯",
		mark: true,
		intro: {
			content(storage) {
				if (storage) return "当你使用非背置牌时，你可以获得一名其他角色的一张牌并将此牌背置";
				return "当你使用背置牌时，你可以令一名角色将你的一张手牌翻面";
			},
		},
		_priority: 0,
	},
	//旧威孙权二号
	taffyoldtwo_dcwoheng: {
		audio: "dcwoheng",
		trigger: { player: "damageEnd" },
		enable: "phaseUse",
		filterTarget: lib.filter.notMe,
		mark: true,
		intro: {
			markcount(num = 0) {
				return num + 1;
			},
			content(num = 0) {
				return `令一名其他角色摸${get.cnNumber(num + 1)}张牌或弃置${get.cnNumber(num + 1)}张牌`;
			},
		},
		prompt() {
			const num = get.player().countMark("taffyoldtwo_dcwoheng");
			return `令一名其他角色摸${get.cnNumber(num + 1)}张牌或弃置${get.cnNumber(num + 1)}张牌`;
		},
		async cost(event, trigger, player) {
			const num = player.countMark("taffyoldtwo_dcwoheng");
			event.result = await player
				.chooseTarget(get.prompt("taffyoldtwo_dcwoheng"), `令一名其他角色摸${get.cnNumber(num + 1)}张牌或弃置${get.cnNumber(num + 1)}张牌`, lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, "taffyoldtwo_dcwoheng", player, player);
				})
				.forResult();
		},
		onremove(player, skill) {
			player.removeTip(skill);
		},
		async content(event, trigger, player) {
			const target = event.target || event.targets[0];
			if (player.hasSkill("taffyoldtwo_dcwoheng", null, null, false)) {
				player.addTempSkill("taffyoldtwo_dcwoheng_used", "roundStart");
				player.addMark("taffyoldtwo_dcwoheng", 1, false);
			}
			const goon = (event.getParent(2) || {}).name !== "taffyoldtwo_dcyuhui_buff";
			const num = goon ? player.countMark("taffyoldtwo_dcwoheng") : 1;
			if (!target?.isIn()) return;
			const str1 = "摸" + get.cnNumber(num) + "张牌";
			const str2 = "弃" + get.cnNumber(num) + "张牌";
			const list = [str1];
			if (target.countCards("he")) list.push(str2);
			let directcontrol =
				str1 ==
				(await player
					.chooseControl(list)
					.set("ai", () => get.event().choice)
					.set(
						"choice",
						get.effect(target, { name: "draw" }, player, player) *
							(() => {
								if (goon && player.countMark("taffyoldtwo_dcwoheng") < 4) {
									if (target.countCards("h") + num === player.countCards("h")) return 100 * num;
								}
								return num;
							})() >
							get.effect(target, { name: "guohe_copy2" }, target, player) *
								(() => {
									const numx = Math.min(num, target.countDiscardableCards(target, "he"));
									if (goon && player.countMark("taffyoldtwo_dcwoheng") < 4) {
										if (target.countCards("h") - numx === player.countCards("h")) return 100 * numx;
									}
									return numx;
								})()
							? str1
							: str2
					)
					.set("prompt", get.translation("taffyoldtwo_dcwoheng") + "：令" + get.translation(target) + "…")
					.forResultControl());
			if (directcontrol) {
				await target.draw(num);
			} else await target.chooseToDiscard(num, true, "he");
			if (player.countMark("taffyoldtwo_dcwoheng") >= 5 || player.countCards("h") !== target.countCards("h")) {
				await player.draw(2);
				if (player.hasSkill("taffyoldtwo_dcwoheng", null, null, false)) player.tempBanSkill("taffyoldtwo_dcwoheng");
			}
		},
		ai: {
			order(item, player) {
				const num = player.countMark("taffyoldtwo_dcwoheng") + 1;
				if (
					game.hasPlayer(target => {
						if (get.effect(target, { name: "draw" }, player, player) > 0) {
							if (target.countCards("h") + num === player.countCards("h")) return true;
						}
						if (get.effect(target, { name: "guohe_copy2" }, player, player) > 0) {
							const numx = Math.min(num, target.countDiscardableCards(target, "he"));
							if (target.countCards("h") - numx === player.countCards("h")) return true;
						}
						return false;
					})
				)
					return 100;
				return 7;
			},
			result: {
				player(player, target) {
					const goon = !get.event()?.getParent()?.name.includes("taffyoldtwo_dcyuhui_buff");
					const num = goon ? player.countMark("taffyoldtwo_dcwoheng") + 1 : 1;
					return Math.max(
						get.effect(target, { name: "draw" }, player, player) *
							(() => {
								if (goon && player.countMark("taffyoldtwo_dcwoheng") < 4) {
									if (target.countCards("h") + num === player.countCards("h")) return 100 * num;
								}
								return num;
							})(),
						get.effect(target, { name: "guohe_copy2" }, target, player) *
							(() => {
								const numx = Math.min(num, target.countDiscardableCards(target, "he"));
								if (goon && player.countMark("taffyoldtwo_dcwoheng") < 4) {
									if (target.countCards("h") - numx === player.countCards("h")) return 100 * numx;
								}
								return numx;
							})()
					);
				},
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove(player) {
					player.clearMark("taffyoldtwo_dcwoheng", false);
				},
			},
		},
	},
	taffyoldtwo_dcyuhui: {
		audio: "dcyuhui",
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return game.hasPlayer(target => {
				if (target == player) return false;
				return target.group === "wu";
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("taffyoldtwo_dcyuhui"), [1, Infinity])
				.set("filterTarget", (_, player, target) => {
					if (target == player) return false;
					return target.group === "wu";
				})
				.set("ai", target => get.attitude(get.player(), target))
				.forResult();
		},
		async content(event, trigger, player) {
			const { targets } = event;
			for (const target of targets) {
				target.addSkill("taffyoldtwo_dcyuhui_buff");
				target.markAuto("taffyoldtwo_dcyuhui_buff", [player]);
			}
		},
		subSkill: {
			buff: {
				charlotte: true,
				trigger: { player: "phaseUseBegin" },
				getIndex(event, player) {
					return player.getStorage("taffyoldtwo_dcyuhui_buff");
				},
				async cost(event, trigger, player) {
					const target = event.indexedData;
					player.unmarkAuto("taffyoldtwo_dcyuhui_buff", [target]);
					if (!player.getStorage("taffyoldtwo_dcyuhui_buff").length) player.removeSkill("taffyoldtwo_dcyuhui_buff");
					if (!target?.isIn() || !game.hasPlayer(target => target !== player)) {
						event.result = { bool: false };
						return;
					}
					const list = ["taffyoldtwo_dcyuhui_buff", target];
					event.result = await player
						.chooseToGive(
							target,
							card => {
								return get.color(card) == "red" && get.type(card) == "basic";
							},
							"he",
							get.prompt(...list)
						)
						.set("ai", card => {
							const player = get.player();
							if (get.attitude(player, get.event().getParent().indexedData) < 0) return 0;
							return (
								Math.max(
									...game
										.filterPlayer(target => target !== player)
										.map(target => {
											return get.effect(target, "taffyoldtwo_dcwoheng", player, player);
										})
								) - get.value(card)
							);
						})
						.set("prompt2", "交给" + get.translation(target) + "一张红色基本牌，发动一次X为1的〖斡衡〗")
						.set("logSkill", list)
						.forResult();
				},
				popup: false,
				async content(event, trigger, player) {
					const result = await player
						.chooseTarget(get.prompt("taffyoldtwo_dcwoheng"), `令一名其他角色摸一张牌或弃置一张牌`, lib.filter.notMe)
						.set("ai", target => {
							const player = get.player();
							return get.effect(target, "taffyoldtwo_dcwoheng", player, player);
						})
						.forResult();
					if (result?.bool && result.targets?.length) await player.useSkill("taffyoldtwo_dcwoheng", result.targets);
				},
				intro: { content: "出牌阶段开始时，你可以交给$一张红色基本牌，发动一次X为1的〖斡衡〗" },
			},
		},
	},
	//旧新杀谋陆逊
	taffyold_dcsbjunmou: {
		audio: "dcsbjunmou",
		group: "taffyold_dcsbjunmou_change",
		audioname: ["dc_sb_luxun_shadow"],
		zhuanhuanji(player, skill) {
			player.storage[skill] = !player.storage[skill];
			player.changeSkin({ characterName: "dc_sb_luxun" }, "dc_sb_luxun" + (player.storage[skill] ? "_shadow" : ""));
		},
		marktext: "☯",
		mark: true,
		intro: {
			content(storage, player) {
				if (!storage) {
					return `转换技，若你成为牌的目标，此牌结算后你可摸一张牌并选择一张手牌，此牌视为无次数限制的火【杀】。`;
				}
				return `转换技，若你成为牌的目标，此牌结算后你可摸一张牌并选择一张手牌，重铸此牌并横置一名角色。`;
			},
		},
		trigger: {
			global: ["useCardAfter"],
		},
		filter(event, player) {
			return event.targets?.includes(player);
		},
		check: () => true,
		frequent: true,
		async content(event, trigger, player) {
			const bool = player.storage[event.name];
			player.changeZhuanhuanji(event.name);
			await player.draw();
			if (!player.countCards("h")) {
				return;
			}
			const result = await player.chooseCard(`隽谋：选择一张手牌，${bool ? "重铸此牌并横置一名角色" : "此牌视为无次数限制的火【杀】"}`, "h", true).forResult();
			if (result?.cards?.length) {
				const card = result.cards[0];
				if (!bool) {
					player.addSkill(event.name + "_sha");
					player.addGaintag(card, event.name + "_sha");
				} else {
					await player.recast(card);
					if (game.hasPlayer(target => !target.isLinked())) {
						const resultx = await player
							.chooseTarget("隽谋：横置一名角色", true, (card, player, target) => {
								return !target.isLinked();
							})
							.set("ai", target => -get.attitude(get.player(), target))
							.forResult();
						if (resultx?.targets?.length) {
							const target = resultx.targets[0];
							player.line(target, "yellow");
							await target.link(true);
						}
					}
				}
			}
		},
		subSkill: {
			sha: {
				mod: {
					cardname(card, player, name) {
						if (card.hasGaintag("taffyold_dcsbjunmou_sha")) {
							return "sha";
						}
					},
					cardnature(card, player, nature) {
						if (card.hasGaintag("taffyold_dcsbjunmou_sha")) {
							return "fire";
						}
					},
					cardUsable(card, player, num) {
						if (card.cards?.length !== 1 || !card.isCard) {
							return;
						}
						if (card.cards[0].hasGaintag("taffyold_dcsbjunmou_sha")) {
							return Infinity;
						}
					},
				},
				forced: true,
				popup: false,
				charlotte: true,
				firstDo: true,
				trigger: {
					player: "useCard1",
				},
				filter(event, player) {
					return (
						event.addCount !== false &&
						event.card.isCard &&
						event.cards?.length == 1 &&
						player.hasHistory("lose", evt => {
							if ((evt.relatedEvent || evt.getParent()) !== event) {
								return false;
							}
							return evt.hs.length == 1 && Object.values(evt.gaintag_map).flat().includes("taffyold_dcsbjunmou_sha");
						})
					);
				},
				async content(event, trigger, player) {
					trigger.addCount = false;
					const stat = player.getStat().card,
						name = trigger.card.name;
					if (typeof stat[name] == "number") {
						stat[name]--;
					}
					game.log(trigger.card, "不计入次数");
				},
			},
			change: {
				audio: "taffyold_dcsbjunmou",
				audioname: ["dc_sb_luxun_shadow"],
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				prompt2(event, player) {
					return "切换【隽谋】为状态" + (player.storage.taffyold_dcsbjunmou ? "阳" : "阴");
				},
				check: () => Math.random() > 0.5,
				content() {
					player.changeZhuanhuanji("taffyold_dcsbjunmou");
				},
			},
		},
	},
	taffyold_dcsbzhanyan: {
		audio: "dcsbzhanyan",
		limited: true,
		enable: "phaseUse",
		skillAnimation: true,
		animationColor: "wood",
		filter(event, player) {
			return game.hasPlayer(target => target.isLinked() && target != player);
		},
		filterTarget(card, player, target) {
			return target.isLinked() && target != player;
		},
		selectTarget: [1, Infinity],
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.addTempSkill(event.name + "_draw");
			let { targets } = event;
			await player.draw(targets.length);
			while (true) {
				targets = targets.filter(target => target.isIn() && target.countCards("h"));
				if (!targets.length) {
					break;
				}
				const showEvent = player
					.chooseCardOL(targets, "绽炎：请选择要展示的牌", true)
					.set("ai", function (card) {
						return Math.random();
					})
					.set("source", player);
				showEvent.aiCard = function (target) {
					const hs = target.getCards("h");
					return { bool: true, cards: [hs.randomGet()] };
				};
				showEvent._args.remove("glow_result");
				const result = await showEvent.forResult();
				const cards = [];
				for (var i = 0; i < targets.length; i++) {
					cards.push(result[i].cards[0]);
				}
				const suits = cards.map(card => get.suit(card)).unique();
				const next = player
					.showCards(cards, `${get.translation(player)} 发动了【${get.translation(event.name)}】`, false)
					.set("showers", targets)
					.set("customButton", button => {
						const target = get.owner(button.link);
						if (target) {
							const div = button.querySelector(".info");
							div.innerHTML = "<span style = 'font-weight:bold'>" + get.translation(get.suit(button.link, target)) + target.getName() + "</span>";
						}
					})
					.set("delay_time", targets.length * 2)
					.set("closeDialog", false);
				await next;
				const id = next.videoId;

				const update = function (id, suits) {
					const dialog = get.idDialog(id);
					if (dialog) {
						const div = dialog.querySelector(".caption");
						div.innerHTML = `绽炎：你可以弃置任意张花色为<span style = "font-weight:bold;font-size: 150%">${get.translation(suits)}</span>的牌对所选角色造成1点火焰伤害`;
						ui.update();
					}
				};
				if (player == game.me) {
					update(id, suits);
				} else if (player.isOnline()) {
					player.send(update, id, suits);
				}
				const nextx = player.chooseCardTarget({
					prompt: false,
					dialog: get.idDialog(id),
					filterCard(card) {
						if (!get.event().suits.includes(get.suit(card, get.player()))) {
							return false;
						}
						return lib.filter.cardDiscardable.apply(this, arguments);
					},
					selectCard: [1, Infinity],
					filterTarget(card, player, target) {
						const selected = ui.selected.cards;
						if (!selected.length) {
							return false;
						}
						const suits = selected.map(card => get.suit(card, player)).unique();
						return suits.includes(get.suit(get.event().cards[get.event().targets.indexOf(target)], target));
					},
					//complexTarget: true,
					selectTarget: -1,
					suits: suits,
					cards: cards,
					targets: targets,
					position: "he",
					ai1(card) {
						return 10 - get.value(card);
					},
				});
				nextx.set(
					"targetprompt2",
					nextx.targetprompt2.concat([
						target => {
							const evt = get.event();
							if (!target.isIn() || !evt.filterTarget(null, get.player(), target)) {
								return;
							}
							const card = evt.cards[evt.targets.indexOf(target)];
							if (!card) {
								return;
							}
							const suit = get.suit(card, target);
							const color = get.color(card, target);
							const str = get.translation(suit);
							return `<span style = "color:${color};font-weight:bold;font-size: 200%">${str}</span>`;
						},
					])
				);
				const resultx = await nextx.forResult();
				game.broadcastAll("closeDialog", id);
				if (resultx?.cards?.length && resultx.targets?.length) {
					const damage = resultx.targets;
					await player.discard(resultx.cards);
					player.line(damage, "fire");
					const damaged = [];
					await game.doAsyncInOrder(damage, async target => {
						const next = target.damage("fire");
						await next;
						damaged.addArray(targets.filter(i => i.hasHistory("damage", evt => (evt.getParent()?.getTrigger() || evt) == next)));
					});
					if (damaged.length != event.targets.length) {
						targets.forEach(target => {
							if (!damaged.includes(target)) {
								target.chat("☝🤓唉，没打着");
								target.throwEmotion(player, ["egg", "shoe"].randomGet());
							}
						});
						break;
					}
				} else {
					targets.forEach(target => {
						target.chat("☝🤓唉，没打着");
						target.throwEmotion(player, ["egg", "shoe"].randomGet());
					});
					break;
				}
			}
			player.removeSkill(event.name + "_draw");
		},
		subSkill: {
			draw: {
				audio: "dcsbzhanyan",
				charlotte: true,
				forced: true,
				trigger: {
					player: "loseAfter",
					global: ["gainAfter", "loseAsyncAfter", "addJudgeAfter", "addToExpansionAfter", "equipAfter"],
				},
				filter(event, player) {
					return event.getl?.(player)?.cards2?.length;
				},
				async content(event, trigger, player) {
					await player.draw(trigger.getl?.(player)?.cards2?.length);
				},
			},
		},
		ai: {
			order: 1,
			result: {
				target: -1,
			},
		},
	},
	//旧新杀谋邓艾
	taffyold_dcsbzhouxi: {
		audio: "dcsbzhouxi",
		enable: "phaseUse",
		usable: 1,
		filterCard(card, player, event) {
			return game.players.every(current => current == player || !player.canUse(card, current, true, true));
		},
		filter(event, player) {
			return player.countCards("h", card => get.info("taffyold_dcsbzhouxi")?.filterCard(card, player, event));
		},
		selectCard: -1,
		manualConfirm: true,
		position: "h",
		async content(event, trigger, player) {
			let num = Math.min(3, event.cards.length),
				select = [];
			const bool1 =
					game.countPlayer(current => {
						return player.canUse("shunshou", current, true) && get.effect(current, { name: "shunshou" }, player, player) > 0;
					}) < num,
				bool2 = game.hasPlayer(current => {
					return player.canUse("shunshou", current, false) && get.distance(player, current) == 2 && get.effect(current, { name: "shunshou" }, player, player) > 0;
				});
			while (num > 0) {
				num--;
				const choiceList = [`计算与其他角色距离-${select.length + 1}`, `视为对至多${select.length + 1}名角色使用【顺手牵羊】`, `视为对至多${select.length + 1}名角色使用【杀】`],
					controls = ["选项一", "选项二", "选项三"];
				for (const chosen of select) {
					const index = controls.indexOf(chosen);
					choiceList[index] = `<span style="opacity:0.5;">${choiceList[index]}</span>`;
				}
				const result = await player
					.chooseControl(controls.removeArray(select))
					.set("prompt", `骤袭：请选择一项（还可选择${num}项）`)
					.set("choiceList", choiceList)
					.set("ai", () => {
						return get.event("res");
					})
					.set(
						"res",
						(() => {
							if (controls.includes("选项一") && (num > 1 || (num > 0 && bool1 && bool2))) {
								return "选项一";
							}
							return controls[controls.length - 1];
						})()
					)
					.forResult();
				const control = result.control;
				select.push(control);
				game.log(player, "选择了", `#g${choiceList[["选项一", "选项二", "选项三"].indexOf(control)]}`);
			}
			let count = 0;
			while (select.length) {
				let result = select.shift();
				switch (result) {
					case "选项一": {
						player.addTempSkill("taffyold_dcsbzhouxi_range");
						player.addMark("taffyold_dcsbzhouxi_range", count, false);
						count++;
						break;
					}
					case "选项二": {
						const card = new lib.element.VCard({ name: "shunshou" });
						if (player.hasUseTarget(card)) {
							count++;
							await player.chooseUseTarget(card, [1, count], true);
						}
						break;
					}
					case "选项三": {
						const card = new lib.element.VCard({ name: "sha" });
						if (player.hasUseTarget(card)) {
							count++;
							await player.chooseUseTarget(card, [1, count], true, false);
						}
						break;
					}
				}
			}
			if (count >= 3) {
				if (player.getStat("skill")[event.name]) {
					delete player.getStat("skill")[event.name];
					game.log(player, "重置了", "#g【骤袭】");
				}
			}
		},
		subSkill: {
			range: {
				charlotte: true,
				onremove: true,
				intro: {
					markcount(storage) {
						return storage ? `-${storage}` : null;
					},
					content: "计算与其他角色距离-#",
				},
				mod: {
					globalFrom(from, to, num) {
						return num - from.countMark("taffyold_dcsbzhouxi_range");
					},
				},
			},
		},
		ai: {
			order: 6,
			result: {
				player(player) {
					if (
						game.hasPlayer(current => {
							if (get.distance(player, current) > 2 || get.effect(current, { name: "shunshou" }, player, player) <= 0) {
								return false;
							}
							return player.canUse("shunshou", current, false) || player.canUse("sha", current, false);
						})
					) {
						if (player.hasSkill("taffyold_dcsbshijin") && !player.getStorage("taffyold_dcsbshijin", false)) {
							const num = player.countCards("h", card => get.info("taffyold_dcsbzhouxi")?.filterCard(card, player, get.event()));
							if (num < 3 && player.getHistory("sourceDamage").length) {
								return 0;
							}
						}
						return 1;
					}
					return 0;
				},
			},
		},
	},
	taffyold_dcsbshijin: {
		audio: "dcsbshijin",
		enable: "phaseUse",
		manualConfirm: true,
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		onChooseToUse(event) {
			if (!game.online && !event.shijin_record) {
				event.set("shijin_record", event.player.getHistory("sourceDamage"));
			}
		},
		filter(event, player) {
			return event.shijin_record?.length;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			let cards = [];
			while (true) {
				const card = get.cardPile(card => cards.every(cardx => get.type2(cardx) != get.type2(card)));
				if (card) {
					cards.push(card);
				} else {
					break;
				}
			}
			if (cards.length) {
				await player.gain(cards, "gain2");
			}
			player.addTempSkill("taffyold_dcsbshijin_defend", { player: "phaseBeginStart" });
			player
				.when({
					player: "phaseBegin",
				})
				.step(async (event, trigger, player) => {
					const cards = player.getDiscardableCards(player, "h").filter(card => {
						return get.name(card) == "sha" || get.type2(card) == "trick";
					});
					if (cards.length) {
						await player.discard(cards);
						await player.loseHp(cards.length);
					} else {
						player.restoreSkill("taffyold_dcsbshijin");
						game.log(player, "重置了", "#g【恃矜】");
					}
				});
		},
		ai: {
			order: 5,
			result: {
				player: 1,
			},
		},
		subSkill: {
			defend: {
				charlotte: true,
				mark: true,
				intro: {
					content: "受到伤害时，防止之并摸一张牌",
				},
				trigger: {
					player: "damageBegin3",
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					trigger.cancel();
					await player.draw();
				},
				ai: {
					filterDamage: true,
					skillTagFilter(player, tag, arg) {
						if (arg.player.hasSkillTag("jueqing", false, player)) {
							return false;
						}
					},
				},
			},
		},
	},
};

export default oldDC;
