import { lib, game, ui, get, ai, _status } from "../../extension/noname.js";

/** @type { importCharacterConfig['skill'] } */
const oldMB = {
	//旧谋曹丕
	taffyold_sbxingshang: {
		audio: "sbxingshang",
		trigger: {
			global: ["die", "damageEnd"],
		},
		usable: 1,
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			player.addMark("taffyold_sbxingshang", 1);
		},
		marktext: "颂",
		intro: {
			name: "颂",
			content: "mark",
		},
		ai: {
			threaten: 2.5,
		},
		group: "taffyold_sbxingshang_use",
		subSkill: {
			use: {
				audio: "taffyold_sbxingshang",
				enable: "phaseUse",
				filter: function (event, player) {
					return game.hasPlayer(target => {
						if (player.countMark("taffyold_sbxingshang") > 1) return true;
						return player.countMark("taffyold_sbxingshang") && (target.isLinked() || target.isTurnedOver());
					});
				},
				usable: 2,
				chooseButton: {
					dialog: function () {
						var dialog = ui.create.dialog(
							"行殇：请选择你要执行的一项",
							[
								[
									[1, "　　　⒈复原一名角色的武将牌　　　"],
									[2, "　　　⒉令一名角色摸" + Math.min(5, Math.max(2, game.dead.length)) + "张牌　　　"],
								],
								"tdnodes",
							],
							[[[3, "　　　⒊令一名体力上限小于10的角色加1点体力上限并回复1点体力，然后随机恢复一个被废除的装备栏　　　"]], "tdnodes"],
							[[[4, "　　　⒋获得一名已阵亡角色的所有技能，然后失去武将牌上的所有技能　　　"]], "tdnodes"]
						);
						return dialog;
					},
					filter: function (button, player) {
						if (button.link > player.countMark("taffyold_sbxingshang")) return false;
						switch (button.link) {
							case 1:
								return game.hasPlayer(target => target.isLinked() || target.isTurnedOver());
							case 2:
								return true;
							case 3:
								return game.hasPlayer(target => target.maxHp < 10);
							case 4:
								return game.dead.length;
						}
					},
					check: function (button) {
						let player = _status.event.player;
						switch (button.link) {
							case 1:
								return game
									.filterPlayer(current => get.attitude(player, current) > 0)
									.reduce((list, target) => {
										let num = 0;
										if (target.isLinked()) num += 0.5;
										if (target.isTurnedOver()) num += 10;
										list.push(num);
										return list;
									}, [])
									.sort((a, b) => b - a)[0];
							case 2:
								let draw = Math.min(5, Math.max(2, game.dead.length));
								return draw > 2 ? draw : 0;
							case 3:
								return game
									.filterPlayer()
									.reduce((list, target) => {
										list.push(get.recoverEffect(target, player, player));
										return list;
									}, [])
									.sort((a, b) => b - a)[0];
							case 4:
								return game.dead
									.reduce((list, target) => {
										let num = 0;
										if (target.name && lib.character[target.name]) num += get.rank(target.name, true);
										if (target.name2 && lib.character[target.name2]) num += get.rank(target.name2, true);
										list.push(num);
										return list;
									}, [])
									.sort((a, b) => b - a)[0];
						}
					},
					backup: function (links, player) {
						return {
							num: links[0],
							audio: "taffyold_sbxingshang",
							filterTarget: function (card, player, target) {
								switch (lib.skill.taffyold_sbxingshang_use_backup.num) {
									case 1:
										return target => target.isLinked() || target.isTurnedOver();
									case 2:
										return true;
									case 3:
										return target.maxHp < 10;
									case 4:
										return target == player;
								}
							},
							selectTarget: () => (lib.skill.taffyold_sbxingshang_use_backup.num == 4 ? -1 : 1),
							async content(event, trigger, player) {
								const target = event.targets[0];
								const num = lib.skill.taffyold_sbxingshang_use_backup.num;
								player.removeMark("taffyold_sbxingshang", num);
								switch (num) {
									case 1:
										if (target.isLinked()) target.link(false);
										if (target.isTurnedOver()) target.turnOver();
										break;
									case 2:
										target.draw(Math.min(5, Math.max(2, game.dead.length)));
										break;
									case 3:
										target.gainMaxHp();
										target.recover();
										let list = [];
										for (let i = 1; i <= 5; i++) {
											if (target.hasDisabledSlot(i)) list.push("equip" + i);
										}
										if (list.length) target.enableEquip(list.randomGet());
										break;
									case 4:
										let map = {};
										game.dead.forEach(target => (map[target.playerid] = get.translation(target)));
										const {
											result: { control },
										} = await player
											.chooseControl(Object.values(map))
											.set("ai", () => {
												const getNum = target => {
													let num = 0;
													if (target.name && lib.character[target.name]) num += get.rank(target.name, true);
													if (target.name2 && lib.character[target.name2]) num += get.rank(target.name2, true);
													return num;
												};
												let controls = _status.event.controls.slice();
												controls = controls.map(name => [name, game.dead.find(target => _status.event.map[target.playerid] == name)]);
												controls.sort((a, b) => getNum(b[1]) - getNum(a[1]));
												return controls[0][0];
											})
											.set("prompt", "获得一名已阵亡角色的所有技能")
											.set("map", map);
										if (control) {
											const target2 = game.dead.find(targetx => map[targetx.playerid] == control);
											player.line(target2);
											game.log(player, "选择了", target2);
											const skills = target2.getStockSkills(true, true);
											const skills2 = player.getStockSkills(true, true);
											player.addSkillLog(skills);
											player.removeSkillLog(skills2);
										}
								}
							},
							ai1: function () {
								return 1;
							},
							ai2: function (target) {
								let player = _status.event.player;
								switch (lib.skill.taffyold_sbxingshang_use_backup.num) {
									case 1:
										if (get.attitude(player, target) > 0) {
											if (target.isLinked()) return 0.5;
											if (target.isTurnedOver()) return 10;
										}
									case 3:
										if (get.attitude(player, target) > 0) return get.recoverEffect(target, player, player);
									case 2:
										if (get.attitude(player, target) > 0) return Math.min(5, Math.max(2, game.dead.length));
								}
								return 0;
							},
						};
					},
					prompt: function (links, player) {
						switch (links[0]) {
							case 1:
								return "复原一名角色的武将牌";
							case 2:
								return "令一名角色摸" + get.cnNumber(Math.min(5, Math.max(2, game.dead.length))) + "张牌";
							case 3:
								return "令一名体力上限小于10的角色加1点体力上限并回复1点体力，然后随机恢复一个被废除的装备栏";
							case 4:
								return "获得一名已阵亡角色的所有技能，然后失去武将牌上的所有技能";
						}
					},
				},
				ai: {
					order: 9,
					result: {
						player: 1,
					},
				},
			},
			use_backup: {},
		},
	},
	taffyold_sbfangzhu: {
		audio: "sbfangzhu",
		enable: "phaseUse",
		filter: function (event, player) {
			return player.countMark("taffyold_sbxingshang") > 0;
		},
		usable: 2,
		chooseButton: {
			dialog: function () {
				var dialog = ui.create.dialog("放逐：请选择你要执行的一项", "hidden");
				dialog.add([
					[
						[4, "移去1个“颂”标记，令一名其他角色只能使用你选择的一种类型的牌直到其回合结束"],
						[1, "移去2个“颂”标记，令一名其他角色的非Charlotte技能失效直到其回合结束"],
						[2, "移去2个“颂”标记，令一名其他角色不能响应除其外的角色使用的牌直到其回合结束"],
						[3, "移去3个“颂”标记，令一名其他角色将武将牌翻面"],
					],
					"textbutton",
				]);
				return dialog;
			},
			filter: function (button, player) {
				switch (button.link) {
					case 1:
						if (2 > player.countMark("taffyold_sbxingshang")) return false;
						return true;
					case 2:
						if (2 > player.countMark("taffyold_sbxingshang")) return false;
						return true;
					case 3:
						if (3 > player.countMark("taffyold_sbxingshang")) return false;
						return true;
					case 4:
						if (1 > player.countMark("taffyold_sbxingshang")) return false;
						return game.hasPlayer(target => target != player && !target.hasSkill("taffyold_sbfangzhu_ban"));
				}
			},
			check: function (button) {
				let player = _status.event.player;
				switch (button.link) {
					case 1:
						return game
							.filterPlayer(current => get.attitude(player, current) < 0)
							.reduce((list, target) => {
								let num = 0;
								if (target.name && lib.character[target.name]) num += get.rank(target.name, true);
								if (target.name2 && lib.character[target.name2]) num += get.rank(target.name2, true);
								list.push(num);
								return list;
							}, [])
							.sort((a, b) => b - a)[0];
					case 2:
						return 0;
					case 3:
						return game
							.filterPlayer(target => target != player && !target.hasSkill("taffyold_sbfangzhu_ban"))
							.reduce((list, target) => {
								if (get.attitude(player, target) > 0 && target.isTurnedOver()) list.push(10 * target.countCards("hs") + 1);
								else if (get.attitude(player, target) < 0 && !target.isTurnedOver()) list.push(5 * target.countCards("hs") + 1);
								else list.push(0);
								return list;
							}, [])
							.sort((a, b) => b - a)[0];
					case 4:
						return game
							.filterPlayer(target => target != player && !target.hasSkill("taffyold_sbfangzhu_ban"))
							.reduce((list, target) => {
								if (get.attitude(player, target) < 0 && !target.isTurnedOver()) list.push(5 * target.countCards("hs") + 1);
								else list.push(0);
								return list;
							}, [])
							.sort((a, b) => b - a)[0];
				}
			},
			backup: function (links, player) {
				return {
					num: links[0],
					audio: "taffyold_sbfangzhu",
					filterTarget: lib.filter.notMe,
					async content(event, trigger, player) {
						const target = event.target;
						const num = lib.skill.taffyold_sbfangzhu_backup.num;
						switch (num) {
							case 1:
								player.removeMark("taffyold_sbxingshang", 2);
								target.removeSkill("baiban");
								target.addTempSkill("baiban", {
									player: "phaseEnd",
								});
								break;
							case 2:
								player.removeMark("taffyold_sbxingshang", 2);
								target.addTempSkill("taffyold_sbfangzhu_kill", {
									player: "phaseEnd",
								});
								break;
							case 3:
								player.removeMark("taffyold_sbxingshang", 3);
								target.turnOver();
								break;
							case 4:
								player.removeMark("taffyold_sbxingshang", 1);
								const {
									result: { control },
								} = await player
									.chooseControl("basic", "trick", "equip")
									.set("ai", () => "equip")
									.set("prompt", "放逐：请选择" + get.translation(target) + "仅能使用的类别的牌");
								if (control) {
									player.line(target);
									player.popup(get.translation(control) + "牌");
									target.addTempSkill("taffyold_sbfangzhu_ban", {
										player: "phaseEnd",
									});
									target.markAuto("taffyold_sbfangzhu_ban", [control]);
								}
						}
					},
					ai1: function () {
						return 1;
					},
					ai2: function (target) {
						let player = _status.event.player;
						let num = 0;
						switch (lib.skill.taffyold_sbfangzhu_backup.num) {
							case 1:
								if (get.attitude(player, target) < 0 && !target.hasSkill("baiban") && target.name && lib.character[target.name]) num += get.rank(target.name, true);
								if (get.attitude(player, target) < 0 && !target.hasSkill("baiban") && target.name2 && lib.character[target.name2]) num += get.rank(target.name2, true);
								return num;
							case 2:
								return 0;
							case 3:
								if (get.attitude(player, target) > 0 && target.isTurnedOver()) return 10 * target.countCards("hs") + 1;
								if (get.attitude(player, target) < 0 && !target.isTurnedOver()) return -5 * target.countCards("hs") + 1;
								return 0;
							case 4:
								if (get.attitude(player, target) < 0 && !target.hasSkill("taffyold_sbfangzhu_ban") && player.countMark("taffyold_sbxingshang") < 3 && target.name && lib.character[target.name]) num += get.rank(target.name, true) + 1;
								if (get.attitude(player, target) < 0 && !target.hasSkill("taffyold_sbfangzhu_ban") && player.countMark("taffyold_sbxingshang") < 3 && target.name2 && lib.character[target.name2]) num += get.rank(target.name2, true) + 1;
								return num;
						}
						return 0;
					},
				};
			},
			prompt: function (links, player) {
				switch (links[0]) {
					case 1:
						return "移去2个“颂”标记，令一名其他角色的非Charlotte技能失效直到其回合结束";
					case 2:
						return "移去2个“颂”标记，令一名其他角色不能响应除其外的角色使用的牌直到其回合结束";
					case 3:
						return "移去3个“颂”标记，令一名其他角色将武将牌翻面";
					case 4:
						return "移去1个“颂”标记，令一名其他角色只能使用你选择的一种类型的牌直到其回合结束";
				}
			},
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
		},
		subSkill: {
			backup: {},
			kill: {
				charlotte: true,
				mark: true,
				marktext: "禁",
				intro: {
					content: "不能响应其他角色使用的牌",
				},
				trigger: {
					global: "useCard1",
				},
				filter: function (event, player) {
					return event.player != player;
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.directHit.add(player);
				},
			},
			ban: {
				charlotte: true,
				onremove: true,
				mark: true,
				marktext: "禁",
				intro: {
					markcount: () => 0,
					content: "只能使用$牌",
				},
				mod: {
					cardEnabled: function (card, player) {
						if (!player.getStorage("taffyold_sbfangzhu_ban").includes(get.type2(card))) return false;
					},
					cardSavable: function (card, player) {
						if (!player.getStorage("taffyold_sbfangzhu_ban").includes(get.type2(card))) return false;
					},
				},
			},
		},
	},
	taffyold_sbsongwei: {
		audio: "sbsongwei",
		init: player => {
			player.addSkill("taffyold_sbsongwei_delete");
		},
		trigger: {
			player: "phaseUseBegin",
		},
		filter: function (event, player) {
			return game.hasPlayer(target => target.group == "wei" && target != player);
		},
		zhuSkill: true,
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			player.addMark(
				"taffyold_sbxingshang",
				game.countPlayer(target => target.group == "wei" && target != player)
			);
		},
		subSkill: {
			delete: {
				audio: "taffyold_sbsongwei",
				enable: "phaseUse",
				filter: function (event, player) {
					return game.hasPlayer(target => lib.skill.taffyold_sbsongwei.subSkill.delete.filterTarget(null, player, target));
				},
				filterTarget: function (card, player, target) {
					return target != player && target.group == "wei" && target.getStockSkills(false, true).length;
				},
				skillAnimation: true,
				animationColor: "thunder",
				async content(event, trigger, player) {
					player.awakenSkill("taffyold_sbsongwei_delete");
					event.target.removeSkillLog(event.target.getStockSkills(false, true));
				},
				ai: {
					order: 13,
					result: {
						target: function (player, target) {
							return -target.getStockSkills(false, true).length;
						},
					},
				},
			},
		},
	},
	// 旧谋诸葛亮
	taffyold_sbhuoji: {
		audio: "sbhuoji",
		dutySkill: true,
		derivation: ["taffyold_sbguanxing", "taffyold_sbkongcheng"],
		group: ["taffyold_sbhuoji_fire", "taffyold_sbhuoji_achieve", "taffyold_sbhuoji_fail", "taffyold_sbhuoji_mark"],
		subSkill: {
			fire: {
				audio: "sbhuoji1",
				enable: "phaseUse",
				filterTarget: lib.filter.notMe,
				prompt: "选择一名其他角色，对其与其势力相同的所有其他角色各造成1点火属性伤害",
				usable: 1,
				line: "fire",
				content: function () {
					"step 0";
					target.damage("fire");
					("step 1");
					var targets = game.filterPlayer(current => {
						if (current == player || current == target) return false;
						return current.group == target.group;
					});
					if (targets.length) {
						game.delayx();
						player.line(targets, "fire");
						targets.forEach(i => i.damage("fire"));
					}
				},
				ai: {
					order: 7,
					fireAttack: true,
					result: {
						target: function (player, target) {
							var att = get.attitude(player, target);
							return (
								get.sgn(att) *
								game
									.filterPlayer(current => {
										if (current == player) return false;
										return current.group == target.group;
									})
									.reduce((num, current) => num + get.damageEffect(current, player, player, "fire"), 0)
							);
						},
					},
				},
			},
			achieve: {
				audio: "sbhuoji2",
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				filter: function (event, player) {
					return player.getAllHistory("sourceDamage", evt => evt.hasNature("fire")).reduce((num, evt) => num + evt.num, 0) >= game.players.length + game.dead.length;
				},
				forced: true,
				locked: false,
				skillAnimation: true,
				animationColor: "fire",
				content: function () {
					player.awakenSkill("taffyold_sbhuoji");
					game.log(player, "成功完成使命");
					var list = [];
					if (player.name && get.character(player.name)[3].includes("taffyold_sbhuoji")) list.add(player.name);
					if (player.name1 && get.character(player.name1)[3].includes("taffyold_sbhuoji")) list.add(player.name1);
					if (player.name2 && get.character(player.name2)[3].includes("taffyold_sbhuoji")) list.add(player.name2);
					if (list.length) list.forEach(name => player.reinit(name, "taffyold_sb_zhugeliang"));
					else {
						player.removeSkill(["taffyold_sbhuoji", "taffyold_sbkanpo"]);
						player.addSkill(["taffyold_sbguanxing", "taffyold_sbkongcheng"]);
					}
				},
			},
			fail: {
				audio: "sbhuoji3",
				trigger: {
					player: "dying",
				},
				forced: true,
				locked: false,
				content: function () {
					player.awakenSkill("taffyold_sbhuoji");
					game.log(player, "使命失败");
				},
			},
			mark: {
				charlotte: true,
				trigger: {
					source: "damage",
				},
				filter: function (event, player) {
					return event.hasNature("fire");
				},
				firstDo: true,
				forced: true,
				popup: false,
				content: function () {
					player.addTempSkill("taffyold_sbhuoji_count", {
						player: ["taffyold_sbhuoji_achieveBegin", "taffyold_sbhuoji_failBegin"],
					});
					player.storage.taffyold_sbhuoji_count = player.getAllHistory("sourceDamage", evt => evt.hasNature("fire")).reduce((num, evt) => num + evt.num, 0);
					player.markSkill("taffyold_sbhuoji_count");
				},
			},
			count: {
				charlotte: true,
				intro: {
					content: "本局游戏已造成过#点火属性伤害",
				},
			},
		},
	},
	taffyold_sbkanpo: {
		audio: "sbkanpo",
		trigger: {
			global: "roundStart",
		},
		forced: true,
		locked: false,
		get getNumber() {
			return 3;
		},
		content: function* (event, map) {
			var player = map.player;
			var storage = player.getStorage("taffyold_sbkanpo").slice();
			if (storage.length) {
				player.unmarkAuto("taffyold_sbkanpo", storage);
			}
			const list = get.inpileVCardList(info => {
				if (info[2] == "sha" && info[3]) return false;
				return info[0] != "equip";
			});
			const func = () => {
				const event = get.event();
				const controls = [
					link => {
						const evt = get.event();
						if (link == "cancel2") ui.click.cancel();
						else {
							if (evt.dialog && evt.dialog.buttons) {
								for (let i = 0; i < evt.dialog.buttons.length; i++) {
									const button = evt.dialog.buttons[i];
									button.classList.remove("selectable");
									button.classList.remove("selected");
									const counterNode = button.querySelector(".caption");
									if (counterNode) {
										counterNode.childNodes[0].innerHTML = ``;
									}
								}
								ui.selected.buttons.length = 0;
								game.check();
							}
							return;
						}
					},
				];
				event.controls = ["清除选择", "cancel2"].map(control => {
					return ui.create.control(controls.concat(control == "清除选择" ? [control, "stayleft"] : control));
				});
			};
			if (event.isMine()) func();
			else if (event.isOnline()) event.player.send(func);
			var result = yield player
				.chooseButton(["看破：是否记录三个牌名？", [list, "vcard"]], [1, 3], true)
				.set("ai", function (button) {
					switch (button.link[2]) {
						case "wuxie":
							return 5 + Math.random();
						case "sha":
							return 5 + Math.random();
						case "tao":
							return 4 + Math.random();
						case "jiu":
							return 3 + Math.random();
						case "lebu":
							return 3 + Math.random();
						case "shan":
							return 4.5 + Math.random();
						case "wuzhong":
							return 4 + Math.random();
						case "shunshou":
							return 2.7 + Math.random();
						case "nanman":
							return 2 + Math.random();
						case "wanjian":
							return 1.6 + Math.random();
						default:
							return 1.5 + Math.random();
					}
				})
				.set("filterButton", button => {
					return !_status.event.names.includes(button.link[2]);
				})
				.set("names", storage)
				.set("custom", {
					add: {
						confirm: function (bool) {
							if (bool != true) return;
							const event = get.event().parent;
							if (event.controls) event.controls.forEach(i => i.close());
							if (ui.confirm) ui.confirm.close();
							game.uncheck();
						},
						button: function () {
							if (ui.selected.buttons.length) return;
							const event = get.event();
							if (event.dialog && event.dialog.buttons) {
								for (let i = 0; i < event.dialog.buttons.length; i++) {
									const button = event.dialog.buttons[i];
									const counterNode = button.querySelector(".caption");
									if (counterNode) {
										counterNode.childNodes[0].innerHTML = ``;
									}
								}
							}
							if (!ui.selected.buttons.length) {
								const evt = event.parent;
								if (evt.controls) evt.controls[0].hide();
							}
						},
					},
					replace: {
						button: function (button) {
							const event = get.event();
							if (!event.isMine()) return;
							if (button.classList.contains("selectable") == false) return;
							if (ui.selected.buttons.length >= lib.skill.taffyold_sbkanpo.getNumber) return false;
							button.classList.add("selected");
							ui.selected.buttons.push(button);
							let counterNode = button.querySelector(".caption");
							const count = ui.selected.buttons.filter(i => i == button).length;
							if (counterNode) {
								counterNode = counterNode.childNodes[0];
								counterNode.innerHTML = `×${count}`;
							} else {
								counterNode = ui.create.caption(`<span style="font-size:24px; font-family:xinwei; text-shadow:#FFF 0 0 4px, #FFF 0 0 4px, rgba(74,29,1,1) 0 0 3px;">×${count}</span>`, button);
								counterNode.style.right = "5px";
								counterNode.style.bottom = "2px";
							}
							const evt = event.parent;
							if (evt.controls) evt.controls[0].show();
							game.check();
						},
					},
				});
			if (result.bool) {
				var names = result.links.map(link => link[2]);
				player.setStorage("taffyold_sbkanpo", names);
				player.markSkill("taffyold_sbkanpo");
			}
		},
		marktext: "破",
		intro: {
			markcount: function (storage, player) {
				if (player.isUnderControl(true)) return storage.length;
				return "?";
			},
			mark: function (dialog, content, player) {
				if (player.isUnderControl(true)) {
					const storage = player.getStorage("taffyold_sbkanpo");
					dialog.addText("已记录牌名：");
					dialog.addSmall([storage, "vcard"]);
				} else {
					return `${get.translation(player)}记录了一些牌名`;
				}
			},
		},
		group: "taffyold_sbkanpo_kanpo",
		subSkill: {
			kanpo: {
				audio: "taffyold_sbkanpo",
				trigger: {
					global: "useCard",
				},
				filter: function (event, player) {
					return event.player != player && player.getStorage("taffyold_sbkanpo").includes(event.card.name);
				},
				prompt2: function (event, player) {
					return "移除" + get.translation(event.card.name) + "的记录，令" + get.translation(event.card) + "无效";
				},
				check: function (event, player) {
					var effect = 0;
					if (event.card.name == "wuxie" || event.card.name == "shan") {
						if (get.attitude(player, event.player) < -1) effect = -1;
					} else if (event.targets && event.targets.length) {
						for (var i = 0; i < event.targets.length; i++) {
							effect += get.effect(event.targets[i], event.card, event.player, player);
						}
					}
					if (effect < 0) {
						if (event.card.name == "sha") {
							var target = event.targets[0];
							if (target == player) return !player.countCards("h", "shan");
							else return target.hp == 1 || (target.countCards("h") <= 2 && target.hp <= 2);
						} else return true;
					}
					return false;
				},
				logTarget: "player",
				content: function () {
					player.unmarkAuto("taffyold_sbkanpo", [trigger.card.name]);
					trigger.targets.length = 0;
					trigger.all_excluded = true;
				},
			},
		},
	},
	taffyold_sbguanxing: {
		audio: "sbguanxing",
		trigger: {
			player: ["phaseZhunbeiBegin", "phaseJieshuBegin"],
		},
		filter: function (event, player) {
			return event.name == "phaseZhunbei" || (player.hasSkill("taffyold_sbguanxing_on") && player.countCards("s", card => card.hasGaintag("taffyold_sbguanxing")));
		},
		forced: true,
		locked: false,
		content: function () {
			"step 0";
			if (trigger.name == "phaseJieshu") {
				event.goto(2);
				return;
			}
			var cards = player.getCards("s", card => card.hasGaintag("taffyold_sbguanxing"));
			if (cards.length) player.loseToDiscardpile(cards);
			var bool = player.getAllHistory("useSkill", evt => evt.skill == "taffyold_sbguanxing").length > 1;
			event.num = Math.min(7, bool ? cards.length + 1 : 7);
			("step 1");
			var cards2 = get.cards(num);
			player.$gain2(cards2, false);
			game.log(player, "将", cards2, "置于了武将牌上");
			player.loseToSpecial(cards2, "taffyold_sbguanxing").visible = true;
			player.markSkill("taffyold_sbguanxing");
			("step 2");
			var cards = player.getCards("s", card => card.hasGaintag("taffyold_sbguanxing"));
			if (cards.length) {
				player
					.chooseToMove()
					.set("list", [["你的“星”", cards], ["牌堆顶"]])
					.set("prompt", "观星：点击将牌移动到牌堆顶")
					.set("processAI", function (list) {
						var cards = list[0][1].slice(),
							player = _status.event.player;
						var name = _status.event.getTrigger().name;
						var target = name == "phaseZhunbei" ? player : player.getNext();
						var judges = target.getCards("j");
						var top = [],
							att = get.sgn(get.attitude(player, target));
						if (judges.length && att != 0 && (target != player || !player.hasWuxie())) {
							for (var i = 0; i < judges.length; i++) {
								var judge = (card, num) => get.judge(card) * num;
								cards.sort((a, b) => judge(b, att) - judge(a, att));
								if (judge(cards[0], att) < 0) break;
								else top.unshift(cards.shift());
							}
						}
						return [cards, top];
					})
					.set("filterOk", function (moved) {
						return moved[1].length;
					});
			} else
				event._result = {
					bool: false,
				};
			("step 3");
			if (result.bool) {
				var cards = result.moved[1];
				player.loseToDiscardpile(cards, ui.cardPile, "insert").log = false;
				game.log(player, "将", cards, "置于了牌堆顶");
			} else if (trigger.name == "phaseZhunbei") player.addTempSkill("taffyold_sbguanxing_on");
		},
		group: "taffyold_sbguanxing_unmark",
		subSkill: {
			on: {
				charlotte: true,
			},
			unmark: {
				trigger: {
					player: "loseAfter",
				},
				filter: function (event, player) {
					if (!event.ss || !event.ss.length) return false;
					return !player.countCards("s", card => card.hasGaintag("taffyold_sbguanxing"));
				},
				charlotte: true,
				forced: true,
				silent: true,
				content: function () {
					player.unmarkSkill("taffyold_sbguanxing");
				},
			},
		},
		marktext: "星",
		intro: {
			mark: function (dialog, storage, player) {
				var cards = player.getCards("s", card => card.hasGaintag("taffyold_sbguanxing"));
				if (!cards || !cards.length) return;
				dialog.addAuto(cards);
			},
			markcount: function (storage, player) {
				return player.countCards("s", card => card.hasGaintag("taffyold_sbguanxing"));
			},
			onunmark: function (storage, player) {
				var cards = player.getCards("s", card => card.hasGaintag("taffyold_sbguanxing"));
				if (cards.length) player.loseToDiscardpile(cards);
			},
		},
		mod: {
			aiOrder: function (player, card, num) {
				var cards = player.getCards("s", card => card.hasGaintag("taffyold_sbguanxing"));
				if (get.itemtype(card) == "card" && card.hasGaintag("taffyold_sbguanxing")) return num + (cards.length > 1 ? 0.5 : -0.0001);
			},
		},
	},
	taffyold_sbkongcheng: {
		audio: "sbkongcheng",
		trigger: {
			player: ["damageBegin3", "damageBegin4"],
		},
		filter: function (event, player, name) {
			if (!player.hasSkill("taffyold_sbguanxing")) return false;
			const num = player.countCards("s", card => card.hasGaintag("taffyold_sbguanxing"));
			if (name == "damageBegin3" && !num) return true;
			if (name == "damageBegin4" && num) return true;
			return false;
		},
		forced: true,
		content: function () {
			"step 0";
			var num = player.countCards("s", card => card.hasGaintag("taffyold_sbguanxing"));
			if (!num && event.triggername == "damageBegin3") {
				trigger.increase("num");
			} else if (num && event.triggername == "damageBegin4") {
				player
					.judge(function (result) {
						if (get.number(result) <= get.player().countCards("s", card => card.hasGaintag("taffyold_sbguanxing"))) return 2;
						return -1;
					})
					.set("judge2", result => result.bool)
					.set("callback", function () {
						if (event.judgeResult.number <= player.countCards("s", card => card.hasGaintag("taffyold_sbguanxing"))) {
							event.getParent("taffyold_sbkongcheng").getTrigger().decrease("num");
						}
					});
			}
		},
	},
	//旧谋关羽
	taffyold_sbwusheng: {
		audio: "sbwusheng",
		trigger: {
			player: "phaseUseBegin",
		},
		filter: function (event, player) {
			return game.hasPlayer(target => target != player && !target.isZhu2());
		},
		direct: true,
		content: function* (event, map) {
			var player = map.player;
			var result = yield player
				.chooseTarget(get.prompt("taffyold_sbwusheng"), "选择一名非主公的其他角色，本阶段对其使用【杀】无距离和次数限制，使用【杀】指定其为目标后摸一张牌，对其使用五张【杀】后不能对其使用【杀】", (card, player, target) => {
					return target != player && !target.isZhu2();
				})
				.set("ai", target => {
					var player = _status.event.player;
					return get.effect(
						target,
						{
							name: "sha",
						},
						player,
						player
					);
				});
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("taffyold_sbwusheng", target);
				if (get.mode() !== "identity" || player.identity !== "nei") player.addExpose(0.25);
				player.addTempSkill("taffyold_sbwusheng_effect", {
					player: "phaseUseAfter",
				});
				player.storage.taffyold_sbwusheng_effect[target.playerid] = 0;
			}
		},
		group: "taffyold_sbwusheng_wusheng",
		subSkill: {
			wusheng: {
				audio: "taffyold_sbwusheng",
				enable: ["chooseToUse", "chooseToRespond"],
				hiddenCard: function (player, name) {
					return name == "sha" && player.countCards("hs");
				},
				filter: function (event, player) {
					if (!player.countCards("h")) return false;
					return (
						event.filterCard(
							get.autoViewAs(
								{
									name: "sha",
								},
								"unsure"
							),
							player,
							event
						) ||
						lib.inpile_nature.some(nature =>
							event.filterCard(
								get.autoViewAs(
									{
										name: "sha",
										nature,
									},
									"unsure"
								),
								player,
								event
							)
						)
					);
				},
				chooseButton: {
					dialog: function (event, player) {
						var list = [];
						if (
							event.filterCard(
								{
									name: "sha",
								},
								player,
								event
							)
						)
							list.push(["基本", "", "sha"]);
						for (var j of lib.inpile_nature) {
							if (
								event.filterCard(
									{
										name: "sha",
										nature: j,
									},
									player,
									event
								)
							)
								list.push(["基本", "", "sha", j]);
						}
						var dialog = ui.create.dialog("武圣", [list, "vcard"], "hidden");
						dialog.direct = true;
						return dialog;
					},
					check: function (button) {
						var player = _status.event.player;
						var card = {
							name: button.link[2],
							nature: button.link[3],
						};
						if (
							_status.event.getParent().type == "phase" &&
							game.hasPlayer(function (current) {
								return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
							})
						) {
							switch (button.link[2]) {
								case "sha":
									if (button.link[3] == "fire") return 2.95;
									else if (button.link[3] == "thunder" || button.link[3] == "ice") return 2.92;
									else return 2.9;
							}
						}
						return 1 + Math.random();
					},
					backup: function (links, player) {
						return {
							audio: "taffyold_sbwusheng",
							filterCard: true,
							check: function (card) {
								return 6 - get.value(card);
							},
							viewAs: {
								name: links[0][2],
								nature: links[0][3],
							},
							position: "hs",
							popname: true,
						};
					},
					prompt: function (links, player) {
						return "将一张手牌当作" + get.translation(links[0][3] || "") + "【" + get.translation(links[0][2]) + "】" + (_status.event.name == "chooseToUse" ? "使用" : "打出");
					},
				},
				ai: {
					respondSha: true,
					fireAttack: true,
					skillTagFilter: function (player, tag) {
						if (!player.countCards("hs")) return false;
					},
					order: function (item, player) {
						if (player && _status.event.type == "phase") {
							var max = 0;
							if (
								lib.inpile_nature.some(
									i =>
										player.getUseValue({
											name: "sha",
											nature: i,
										}) > 0
								)
							) {
								var temp = get.order({
									name: "sha",
								});
								if (temp > max) max = temp;
							}
							if (max > 0) max += 0.3;
							return max;
						}
						return 4;
					},
					result: {
						player: 1,
					},
				},
			},
			effect: {
				charlotte: true,
				onremove: true,
				init: function (player) {
					if (!player.storage.taffyold_sbwusheng_effect) player.storage.taffyold_sbwusheng_effect = {};
				},
				mod: {
					targetInRange: function (card, player, target) {
						if (card.name == "sha" && typeof player.storage.taffyold_sbwusheng_effect[target.playerid] == "number") return true;
					},
					cardUsableTarget: function (card, player, target) {
						if (card.name !== "sha" && typeof player.storage.taffyold_sbwusheng_effect[target.playerid] !== "number") return;
						return player.storage.taffyold_sbwusheng_effect[target.playerid] < 5;
					},
					playerEnabled: function (card, player, target) {
						if (card.name != "sha" || typeof player.storage.taffyold_sbwusheng_effect[target.playerid] != "number") return;
						if (player.storage.taffyold_sbwusheng_effect[target.playerid] >= 5) return false;
					},
				},
				audio: "taffyold_sbwusheng",
				trigger: {
					player: ["useCardToPlayered", "useCardAfter"],
				},
				filter: function (event, player) {
					if (event.card.name != "sha") return false;
					if (event.name == "useCard") return event.targets.some(target => typeof player.storage.taffyold_sbwusheng_effect[target.playerid] == "number");
					return typeof player.storage.taffyold_sbwusheng_effect[event.target.playerid] == "number";
				},
				direct: true,
				content: function () {
					if (trigger.name == "useCard") {
						var targets = trigger.targets.filter(target => typeof player.storage.taffyold_sbwusheng_effect[target.playerid] == "number");
						targets.forEach(target => player.storage.taffyold_sbwusheng_effect[target.playerid]++);
					} else {
						player.logSkill("taffyold_sbwusheng_effect", trigger.target);
						player.draw();
					}
				},
			},
		},
		ai: {
			threaten: 114514,
		},
	},
	taffyold_sbyijue: {
		audio: "sbyijue",
		trigger: { global: "damageBegin4" },
		filter: function (event, player) {
			if (!event.source || event.source != player || event.player == player) return false;
			return event.num >= event.player.hp && !player.getStorage("taffyold_sbyijue").includes(event.player);
		},
		forced: true,
		logTarget: "player",
		content: function () {
			trigger.cancel();
			player.addTempSkill("taffyold_sbyijue_effect");
			player.markAuto("taffyold_sbyijue", [trigger.player]);
			player.markAuto("taffyold_sbyijue_effect", [trigger.player]);
		},
		ai: {
			neg: true,
		},
		marktext: "绝",
		intro: { content: "已放$一马" },
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				audio: "taffyold_sbyijue",
				trigger: { player: "useCardToPlayer" },
				filter: function (event, player) {
					return player.getStorage("taffyold_sbyijue_effect").includes(event.target);
				},
				forced: true,
				logTarget: "target",
				content: function () {
					trigger.getParent().excluded.add(trigger.target);
				},
				ai: {
					effect: {
						player(card, player, target) {
							if (player.getStorage("taffyold_sbyijue_effect").includes(target)) return "zeroplayertarget";
						},
					},
				},
				marktext: "义",
				intro: { content: "本回合放$一马" },
			},
		},
	},
	// 旧神鲁肃
	taffyold_dingzhou: {
		audio: "dingzhou",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			const num = player.countCards("he");
			return game.hasPlayer(current => {
				if (current == player) return false;
				const total = current.countCards("ej");
				return total > 0 && num >= total;
			});
		},
		filterCard: true,
		selectCard() {
			return [1, Math.max(...game.filterPlayer(i => i != get.player()).map(i => i.countCards("ej")))];
		},
		check(card) {
			return 7 - get.value(card);
		},
		filterTarget(card, player, target) {
			const num = target.countCards("ej");
			if (!num) return false;
			return ui.selected.cards.length == num && player != target;
		},
		filterOk() {
			return ui.selected.cards.length == ui.selected.targets[0].countCards("ej");
		},
		position: "he",
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player.give(event.cards, target);
			const cards = target.getGainableCards(player, "ej");
			if (cards.length) player.gain(cards, "give", target);
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					let eff = 0;
					if (ui.selected.cards.length) eff = ui.selected.cards.map(card => get.value(card)).reduce((p, c) => p + c, 0);
					if (player.hasSkill("taffyold_zhimeng") && (get.mode() == "identity" || player.countCards("h") - target.countCards("h") > 2 * ui.selected.cards.length)) eff *= 1 + get.sgnAttitude(player, target) * 0.15;
					const es = target.getCards("e"),
						js = target.getCards("j");
					es.forEach(card => {
						eff -= get.value(card, target);
					});
					js.forEach(card => {
						eff -= get.effect(
							target,
							{
								name: card.viewAs || card.name,
								cards: [card],
							},
							target,
							target
						);
					});
					return eff;
				},
			},
		},
	},
	taffyold_tamo: {
		audio: "tamo",
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return (
				(event.name != "phase" || game.phaseNumber == 0) &&
				game.countPlayer(current => {
					return !current.isZhu2();
				}) > 1
			);
		},
		direct: true,
		changeSeat: true,
		derivation: "taffyold_tamo_faq",
		async content(event, trigger, player) {
			const toSortPlayers = game.filterPlayer(current => !current.isZhu2());
			toSortPlayers.sortBySeat(game.findPlayer2(current => current.getSeatNum() == 1, true));
			const next = player.chooseToMove("榻谟：是否分配" + (game.hasPlayer(cur => cur.isZhu2()) ? "除主公外" : "") + "所有角色的座次？");
			next.set("list", [
				[
					"（以下排列的顺序即为发动技能后角色的座次顺序）",
					[
						toSortPlayers.map(i => `${i.getSeatNum()}|${i.name}`),
						(item, type, position, noclick, node) => {
							const info = item.split("|"),
								_item = item;
							const seat = parseInt(info[0]);
							item = info[1];
							if (node) {
								node.classList.add("button");
								node.classList.add("character");
								node.style.display = "";
							} else {
								node = ui.create.div(".button.character", position);
							}
							node._link = item;
							node.link = item;

							const func = function (node, item) {
								const currentPlayer = game.findPlayer(current => current.getSeatNum() == seat);
								if (currentPlayer.classList.contains("unseen_show")) node.setBackground("hidden_image", "character");
								else if (item != "unknown") node.setBackground(item, "character");
								if (node.node) {
									node.node.name.remove();
									node.node.hp.remove();
									node.node.group.remove();
									node.node.intro.remove();
									if (node.node.replaceButton) node.node.replaceButton.remove();
								}
								node.node = {
									name: ui.create.div(".name", node),
									group: ui.create.div(".identity", node),
									intro: ui.create.div(".intro", node),
								};
								const infoitem = [currentPlayer.sex, currentPlayer.group, `${currentPlayer.hp}/${currentPlayer.maxHp}/${currentPlayer.hujia}`];
								node.node.name.innerHTML = get.slimName(item);
								if (lib.config.buttoncharacter_style == "default" || lib.config.buttoncharacter_style == "simple") {
									if (lib.config.buttoncharacter_style == "simple") {
										node.node.group.style.display = "none";
									}
									node.classList.add("newstyle");
									node.node.name.dataset.nature = get.groupnature(get.bordergroup(infoitem));
									node.node.group.dataset.nature = get.groupnature(get.bordergroup(infoitem), "raw");
								}
								node.node.name.style.top = "8px";
								if (node.node.name.querySelectorAll("br").length >= 4) {
									node.node.name.classList.add("long");
									if (lib.config.buttoncharacter_style == "old") {
										node.addEventListener("mouseenter", ui.click.buttonnameenter);
										node.addEventListener("mouseleave", ui.click.buttonnameleave);
									}
								}
								node.node.intro.innerHTML = lib.config.intro;
								if (!noclick) {
									lib.setIntro(node);
								}
								node.node.group.innerHTML = `<div>${get.cnNumber(seat, true)}号</div>`;
								node.node.group.style.backgroundColor = get.translation(`${get.bordergroup(infoitem)}Color`);
							};
							node.refresh = func;
							node.refresh(node, item);

							node.link = _item;
							node.seatNumber = seat;
							node._customintro = uiintro => {
								uiintro.add(`${get.translation(node._link)}(原${get.cnNumber(node.seatNumber, true)}号位)`);
							};
							return node;
						},
					],
				],
			]);
			next.set("processAI", list => {
				const listx = list[0][1][0];
				const me = listx.find(info => parseInt(info.split("|")[0]) == get.player().getSeatNum());
				listx.randomSort();
				if (me) {
					listx.remove(me);
					listx.unshift(me);
				}
				return [listx];
			});
			const { result } = await next;
			if (!result.bool) return;
			await player.logSkill("taffyold_tamo");
			const resultList = result.moved[0].map(info => {
				return info && parseInt(info.split("|")[0]);
			});
			const toSwapList = [];
			const cmp = (a, b) => {
				return resultList.indexOf(a) - resultList.indexOf(b);
			};
			for (let i = 0; i < toSortPlayers.length; i++) {
				for (let j = 0; j < toSortPlayers.length; j++) {
					if (cmp(toSortPlayers[i].getSeatNum(), toSortPlayers[j].getSeatNum()) < 0) {
						toSwapList.push([toSortPlayers[i], toSortPlayers[j]]);
						[toSortPlayers[i], toSortPlayers[j]] = [toSortPlayers[j], toSortPlayers[i]];
					}
				}
			}
			game.broadcastAll(toSwapList => {
				for (const list of toSwapList) {
					game.swapSeat(list[0], list[1], false);
				}
			}, toSwapList);
			if (trigger.name === "phase" && !trigger.player.isZhu2() && trigger.player !== toSortPlayers[0] && !trigger._finished) {
				trigger.finish();
				trigger._triggered = 5;
				const evt = toSortPlayers[0].insertPhase();
				delete evt.skill;
				const evt2 = trigger.getParent();
				if (evt2.name == "phaseLoop" && evt2._isStandardLoop) {
					evt2.player = toSortPlayers[0];
				}
				//跳过新回合的phaseBefore
				evt.pushHandler("onPhase", (event, option) => {
					if (event.step === 0 && option.state === "begin") {
						event.step = 1;
					}
				});
			}
			await game.asyncDelay();
		},
	},
	//什么均贫卡
	taffyold_zhimeng: {
		audio: "zhimeng",
		trigger: {
			player: "phaseAfter",
		},
		filter(event, player) {
			return game.hasPlayer(current => {
				return current.countCards("h") + player.countCards("h") > 0 && player != current;
			});
		},
		direct: true,
		async content(event, trigger, player) {
			const {
				result: { bool, targets },
			} = await player
				.chooseTarget(get.prompt("taffyold_zhimeng"), "与一名其他角色平分手牌", (card, player, target) => {
					return target.countCards("h") + player.countCards("h") > 0 && player != target;
				})
				.set("ai", target => {
					const player = get.player();
					const pvalue = -player
						.getCards("h")
						.map(card => get.value(card, player))
						.reduce((p, c) => p + c, 0);
					const tvalue =
						-target
							.getCards("h")
							.map(card => get.value(card, target))
							.reduce((p, c) => p + c, 0) * get.sgnAttitude(player, target);
					return (pvalue + tvalue) / 2;
				});
			if (!bool) return;
			const target = targets[0];
			player.logSkill("taffyold_zhimeng", target);
			const lose_list = [];
			let cards = [];
			[player, target].forEach(current => {
				const hs = current.getCards("h");
				if (hs.length) {
					cards.addArray(hs);
					current.$throw(hs.length, 500);
					game.log(current, "将", get.cnNumber(hs.length), "张牌置入了处理区");
					lose_list.push([current, hs]);
				}
			});
			await game
				.loseAsync({
					lose_list: lose_list,
				})
				.setContent("chooseToCompareLose");
			await game.asyncDelay();
			cards = cards.filterInD();
			const pcards = cards.randomGets(Math.ceil(cards.length / 2));
			const tcards = cards.removeArray(pcards);
			const list = [];
			if (pcards.length) {
				list.push([player, pcards]);
				game.log(player, "获得了", get.cnNumber(pcards.length), "张牌");
			}
			if (tcards.length) {
				list.push([target, tcards]);
				game.log(target, "获得了", get.cnNumber(tcards.length), "张牌");
			}
			game.loseAsync({
				gain_list: list,
				player: player,
				animate: "draw",
			}).setContent("gaincardMultiple");
		},
		ai: {
			threaten: 4,
		},
	},
	//旧十常侍
	taffyold_mbdanggu: {
		audio: "mbdanggu",
		trigger: {
			player: "enterGame",
			global: "phaseBefore",
		},
		filter: function (event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		derivation: ["taffyold_mbdanggu_faq", "taffyold_mbdanggu_faq2"],
		forced: true,
		unique: true,
		onremove: function (player) {
			delete player.storage.taffyold_mbdanggu;
			delete player.storage.taffyold_mbdanggu_current;
		},
		changshi: [
			["taffyold_scs_zhangrang", "taffyold_scstaoluan"],
			["taffyold_scs_zhaozhong", "taffyold_scschiyan"],
			["taffyold_scs_sunzhang", "taffyold_scszimou"],
			["taffyold_scs_bilan", "taffyold_scspicai"],
			["taffyold_scs_xiayun", "taffyold_scsyaozhuo"],
			["taffyold_scs_hankui", "taffyold_scsxiaolu"],
			["taffyold_scs_lisong", "taffyold_scskuiji"],
			["taffyold_scs_duangui", "taffyold_scschihe"],
			["taffyold_scs_guosheng", "taffyold_scsniqu"],
			["taffyold_scs_gaowang", "taffyold_scsanruo"],
		],
		conflictMap: function (player) {
			if (!_status.taffyold_changshiMap) {
				_status.taffyold_changshiMap = {
					taffyold_scs_zhangrang: [],
					taffyold_scs_zhaozhong: [],
					taffyold_scs_sunzhang: [],
					taffyold_scs_bilan: ["taffyold_scs_hankui"],
					taffyold_scs_xiayun: [],
					taffyold_scs_hankui: ["taffyold_scs_bilan"],
					taffyold_scs_lisong: [],
					taffyold_scs_duangui: ["taffyold_scs_guosheng"],
					taffyold_scs_guosheng: ["taffyold_scs_duangui"],
					taffyold_scs_gaowang: ["taffyold_scs_hankui", "taffyold_scs_duangui", "taffyold_scs_guosheng", "taffyold_scs_bilan"],
				};
			}
			return _status.taffyold_changshiMap;
		},
		group: "taffyold_mbdanggu_back",
		content: function () {
			"step 0";
			var list = lib.skill.taffyold_mbdanggu.changshi.map(i => i[0]);
			player.markAuto("taffyold_mbdanggu", list);
			game.broadcastAll(
				function (player, list) {
					var cards = [];
					for (var i = 0; i < list.length; i++) {
						var cardname = "huashen_card_" + list[i];
						lib.card[cardname] = {
							fullimage: true,
							image: "character/" + list[i],
						};
						lib.translate[cardname] = get.rawName2(list[i]);
						cards.push(game.createCard(cardname, "", ""));
					}
					player.$draw(cards, "nobroadcast");
				},
				player,
				list
			);
			("step 1");
			var next = game.createEvent("taffyold_mbdanggu_clique");
			next.player = player;
			next.setContent(lib.skill.taffyold_mbdanggu.contentx);
		},
		contentx: function () {
			"step 0";
			var list = player.getStorage("taffyold_mbdanggu").slice();
			var first;
			if (list.length == 10 && Math.random() < 0.5) {
				first = ["taffyold_scs_gaowang"];
				list.removeArray(first);
			} else {
				first = list.randomRemove(1);
			}
			event.first = first[0];
			first = first[0];
			if (list.contains("taffyold_scs_gaowang")) {
				var others = list
					.filter(changshi => {
						return changshi != "taffyold_scs_gaowang";
					})
					.randomGets(3);
				others.push("taffyold_scs_gaowang");
				others.randomSort();
			} else {
				var others = list.randomGets(4);
			}
			if (others.length == 1)
				event._result = {
					bool: true,
					links: others,
				};
			else {
				var map = {
						taffyold_scs_bilan: "taffyold_scs_hankui",
						taffyold_scs_hankui: "taffyold_scs_bilan",
						taffyold_scs_duangui: "taffyold_scs_guosheng",
						taffyold_scs_guosheng: "taffyold_scs_duangui",
					},
					map2 = lib.skill.taffyold_mbdanggu.conflictMap(player);
				var conflictList = others.filter(changshi => {
						if (map[first] && others.some(changshi2 => map[first] == changshi2)) return map[first] == changshi;
						else return map2[first].includes(changshi);
					}),
					list = others.slice();
				if (conflictList.length) {
					var conflict = conflictList.randomGet();
					list.remove(conflict);
					game.broadcastAll(
						function (changshi, player) {
							if (lib.config.background_speak) {
								if (player.isUnderControl(true)) game.playAudio("skill", (changshi + "_enter").slice(9));
							}
						},
						conflict,
						player
					);
				}
				player
					.chooseButton(["党锢：请选择结党对象", [[first], "character"], '<div class="text center">可选常侍</div>', [others, "character"]], true)
					.set("filterButton", button => {
						return _status.event.canChoose.includes(button.link);
					})
					.set("canChoose", list)
					.set("ai", button => {
						if (button.link == "taffyold_scs_gaowang") return 10;
						return Math.random() * 10;
					});
			}
			("step 1");
			if (result.bool) {
				var first = event.first;
				var chosen = result.links[0];
				var skills = [];
				var list = lib.skill.taffyold_mbdanggu.changshi;
				var changshis = [first, chosen];
				player.unmarkAuto("taffyold_mbdanggu", changshis);
				player.storage.taffyold_mbdanggu_current = changshis;
				for (var changshi of changshis) {
					for (var cs of list) {
						if (changshi == cs[0]) skills.push(cs[1]);
					}
				}
				if (lib.skill.taffyold_mbdanggu.isSingleShichangshi(player)) {
					game.broadcastAll(
						function (player, first, chosen) {
							player.name1 = first;
							player.node.avatar.setBackground(first, "character");
							player.node.name.innerHTML = get.slimName(first);
							player.name2 = chosen;
							player.classList.add("fullskin2");
							player.node.avatar2.classList.remove("hidden");
							player.node.avatar2.setBackground(chosen, "character");
							player.node.name2.innerHTML = get.slimName(chosen);
							if (player == game.me && ui.fakeme) {
								ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
							}
						},
						player,
						first,
						chosen
					);
				}
				game.log(player, "选择了常侍", "#y" + get.translation(changshis));
				if (skills.length) {
					player.addAdditionalSkill("taffyold_mbdanggu", skills);
					var str = "";
					for (var i of skills) {
						str += "【" + get.translation(i) + "】、";
						player.popup(i);
					}
					str = str.slice(0, -1);
					game.log(player, "获得了技能", "#g" + str);
				}
			}
		},
		isSingleShichangshi: function (player) {
			var map = lib.skill.taffyold_mbdanggu.conflictMap(player);
			return player.name == "taffyold_shichangshi" && ((map[player.name1] && map[player.name2]) || (map[player.name1] && !player.name2) || (!player.name1 && !player.name2) || (player.name == player.name1 && !player.name2));
		},
		mod: {
			aiValue: function (player, card, num) {
				if (["shan", "tao", "wuxie", "caochuan"].includes(card.name)) return num / 10;
			},
			aiUseful: function () {
				return lib.skill.taffyold_mbdanggu.mod.aiValue.apply(this, arguments);
			},
		},
		ai: {
			combo: "taffyold_mbmowang",
			nokeep: true,
		},
		intro: {
			mark: function (dialog, storage, player) {
				dialog.addText("剩余常侍");
				dialog.addSmall([storage, "character"]);
				if (player.storage.taffyold_mbdanggu_current && player.isIn()) {
					dialog.addText("当前常侍");
					dialog.addSmall([player.storage.taffyold_mbdanggu_current, "character"]);
				}
			},
		},
		subSkill: {
			back: {
				audio: "taffyold_mbdanggu",
				trigger: {
					global: "restEnd",
				},
				filter: function (event, player) {
					return event.getTrigger().player == player;
				},
				forced: true,
				content: function () {
					"step 0";
					delete player.storage.taffyold_mbdanggu_current;
					if (lib.skill.taffyold_mbdanggu.isSingleShichangshi(player)) {
						game.broadcastAll(function (player) {
							player.name1 = player.name;
							player.smoothAvatar(false);
							player.node.avatar.setBackground(player.name, "character");
							player.node.name.innerHTML = get.slimName(player.name);
							delete player.name2;
							player.classList.remove("fullskin2");
							player.node.avatar2.classList.add("hidden");
							player.node.name2.innerHTML = "";
							if (player == game.me && ui.fakeme) {
								ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
							}
						}, player);
					}
					("step 1");
					var next = game.createEvent("taffyold_mbdanggu_clique");
					next.player = player;
					next.setContent(lib.skill.taffyold_mbdanggu.contentx);
					player.draw(2);
				},
			},
		},
	},
	taffyold_mbmowang: {
		audio: "mbmowang",
		trigger: {
			player: "dieBefore",
		},
		filter: function (event, player) {
			return player.getStorage("taffyold_mbdanggu").length && event.getParent().name != "giveup" && player.maxHp > 0;
		},
		derivation: "taffyold_mbmowang_faq",
		forced: true,
		direct: true,
		priority: 15,
		group: ["taffyold_mbmowang_die", "taffyold_mbmowang_return"],
		content: function () {
			if (_status.taffyold_mbmowang_return && _status.taffyold_mbmowang_return[player.playerid]) {
				trigger.cancel();
			} else {
				player.logSkill("taffyold_mbmowang");
				game.broadcastAll(function () {
					if (lib.config.background_speak) game.playAudio("die", "shichangshiRest");
				});
				trigger.setContent(lib.skill.taffyold_mbmowang.dieContent);
				trigger.includeOut = true;
			}
		},
		ai: {
			combo: "taffyold_mbdanggu",
			neg: true,
		},
		dieContent: function () {
			"step 0";
			event.forceDie = true;
			if (source) {
				game.log(player, "被", source, "杀害");
				if (source.stat[source.stat.length - 1].kill == undefined) {
					source.stat[source.stat.length - 1].kill = 1;
				} else {
					source.stat[source.stat.length - 1].kill++;
				}
			} else {
				game.log(player, "阵亡");
			}
			if (player.isIn() && (!_status.taffyold_mbmowang_return || !_status.taffyold_mbmowang_return[player.playerid])) {
				event.reserveOut = true;
				game.log(player, "进入了修整状态");
				game.log(player, "移出了游戏");
				//game.addGlobalSkill('taffyold_mbmowang_return');
				if (!_status.taffyold_mbmowang_return) _status.taffyold_mbmowang_return = {};
				_status.taffyold_mbmowang_return[player.playerid] = 1;
			} else event.finish();
			if (!game.countPlayer()) game.over();
			else if (player.hp != 0) {
				player.changeHp(0 - player.hp, false).forceDie = true;
			}
			game.broadcastAll(function (player) {
				if (player.isLinked()) {
					if (get.is.linked2(player)) {
						player.classList.toggle("linked2");
					} else {
						player.classList.toggle("linked");
					}
				}
				if (player.isTurnedOver()) {
					player.classList.toggle("turnedover");
				}
			}, player);
			game.addVideo("link", player, player.isLinked());
			game.addVideo("turnOver", player, player.classList.contains("turnedover"));
			("step 1");
			event.trigger("die");
			("step 2");
			if (event.reserveOut) {
				if (!game.reserveDead) {
					for (var mark in player.marks) {
						if (mark == "taffyold_mbdanggu") continue;
						player.unmarkSkill(mark);
					}
					var count = 1;
					var list = Array.from(player.node.marks.childNodes);
					if (list.some(i => i.name == "taffyold_mbdanggu")) count++;
					while (player.node.marks.childNodes.length > count) {
						var node = player.node.marks.lastChild;
						if (node.name == "taffyold_mbdanggu") {
							node = node.previousSibling;
						}
						node.remove();
					}
					game.broadcast(
						function (player, count) {
							while (player.node.marks.childNodes.length > count) {
								var node = player.node.marks.lastChild;
								if (node.name == "taffyold_mbdanggu") {
									node = node.previousSibling;
								}
								node.remove();
							}
						},
						player,
						count
					);
				}
				for (var i in player.tempSkills) {
					player.removeSkill(i);
				}
				var skills = player.getSkills();
				for (var i = 0; i < skills.length; i++) {
					if (lib.skill[skills[i]].temp) {
						player.removeSkill(skills[i]);
					}
				}
				event.cards = player.getCards("hejsx");
				if (event.cards.length) {
					player.discard(event.cards).forceDie = true;
				}
			}
			("step 3");
			if (event.reserveOut) {
				game.broadcastAll(
					function (player, list) {
						player.classList.add("out");
						if (list.includes(player.name1) || player.name1 == "taffyold_shichangshi") {
							player.smoothAvatar(false);
							player.node.avatar.setBackground(player.name1.slice(9) + "_dead", "character");
						}
						if (list.includes(player.name2) || player.name2 == "taffyold_shichangshi") {
							player.smoothAvatar(true);
							player.node.avatar2.setBackground(player.name2.slice(9) + "_dead", "character");
						}
					},
					player,
					lib.skill.taffyold_mbdanggu.changshi.map(i => i[0])
				);
			}
			if (source && lib.config.border_style == "auto" && (lib.config.autoborder_count == "kill" || lib.config.autoborder_count == "mix")) {
				switch (source.node.framebg.dataset.auto) {
					case "gold":
					case "silver":
						source.node.framebg.dataset.auto = "gold";
						break;
					case "bronze":
						source.node.framebg.dataset.auto = "silver";
						break;
					default:
						source.node.framebg.dataset.auto = lib.config.autoborder_start || "bronze";
				}
				if (lib.config.autoborder_count == "kill") {
					source.node.framebg.dataset.decoration = source.node.framebg.dataset.auto;
				} else {
					var dnum = 0;
					for (var j = 0; j < source.stat.length; j++) {
						if (source.stat[j].damage != undefined) dnum += source.stat[j].damage;
					}
					source.node.framebg.dataset.decoration = "";
					switch (source.node.framebg.dataset.auto) {
						case "bronze":
							if (dnum >= 4) source.node.framebg.dataset.decoration = "bronze";
							break;
						case "silver":
							if (dnum >= 8) source.node.framebg.dataset.decoration = "silver";
							break;
						case "gold":
							if (dnum >= 12) source.node.framebg.dataset.decoration = "gold";
							break;
					}
				}
				source.classList.add("topcount");
			}
		},
		subSkill: {
			die: {
				audio: "taffyold_mbmowang",
				trigger: {
					player: "phaseAfter",
				},
				forced: true,
				forceDie: true,
				content: function () {
					"step 0";
					if (lib.skill.taffyold_mbdanggu.isSingleShichangshi(player)) {
						if (!player.getStorage("taffyold_mbdanggu").length) {
							game.broadcastAll(function (player) {
								player.name1 = player.name;
								player.smoothAvatar(false);
								player.node.avatar.setBackground(player.name.slice(9) + "_dead", "character");
								player.node.name.innerHTML = get.slimName(player.name);
								delete player.name2;
								player.classList.remove("fullskin2");
								player.node.avatar2.classList.add("hidden");
								player.node.name2.innerHTML = "";
								if (player == game.me && ui.fakeme) {
									ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
								}
							}, player);
						}
					}
					if (!player.getStorage("taffyold_mbdanggu").length) {
						game.delay();
					}
					("step 1");
					player.die();
				},
			},
			return: {
				trigger: {
					player: "phaseBefore",
				},
				forced: true,
				charlotte: true,
				silent: true,
				forceDie: true,
				forceOut: true,
				filter: function (event, player) {
					return !event._taffyold_mbmowang_return && event.player.isOut() && _status.taffyold_mbmowang_return[event.player.playerid];
				},
				content: function () {
					"step 0";
					trigger._taffyold_mbmowang_return = true;
					game.broadcastAll(function (player) {
						player.classList.remove("out");
					}, trigger.player);
					game.log(trigger.player, "移回了游戏");
					delete _status.taffyold_mbmowang_return[trigger.player.playerid];
					trigger.player.recover(trigger.player.maxHp - trigger.player.hp);
					game.broadcastAll(function (player) {
						if (player.name1 == "taffyold_shichangshi") {
							player.smoothAvatar(false);
							player.node.avatar.setBackground(player.name1, "character");
						}
						if (player.name2 == "taffyold_shichangshi") {
							player.smoothAvatar(true);
							player.node.avatar2.setBackground(player.name2, "character");
						}
					}, trigger.player);
					("step 1");
					event.trigger("restEnd");
				},
			},
		},
	},
	//张让
	taffyold_scstaoluan: {
		audio: "scstaoluan",
		enable: "phaseUse",
		usable: 1,
		filter: function (event, player) {
			return player.countCards("hes") > 0;
		},
		chooseButton: {
			dialog: function (event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (name == "sha") {
						list.push(["基本", "", "sha"]);
						for (var j of lib.inpile_nature) list.push(["基本", "", "sha", j]);
					} else if (get.type(name) == "trick") list.push(["锦囊", "", name]);
					else if (get.type(name) == "basic") list.push(["基本", "", name]);
				}
				return ui.create.dialog("滔乱", [list, "vcard"]);
			},
			filter: function (button, player) {
				return _status.event.getParent().filterCard(
					{
						name: button.link[2],
					},
					player,
					_status.event.getParent()
				);
			},
			check: function (button) {
				var player = _status.event.player;
				if (player.countCards("hs", button.link[2]) > 0) return 0;
				if (button.link[2] == "wugu") return;
				var effect = player.getUseValue(button.link[2]);
				if (effect > 0) return effect;
				return 0;
			},
			backup: function (links, player) {
				return {
					filterCard: true,
					audio: "taffyold_scstaoluan",
					selectCard: 1,
					popname: true,
					check: function (card) {
						return 6 - get.value(card);
					},
					position: "hes",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
				};
			},
			prompt: function (links, player) {
				return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order: 4,
			result: {
				player: 1,
			},
			threaten: 1.9,
		},
	},
	//赵忠
	taffyold_scschiyan: {
		audio: "scschiyan",
		trigger: {
			player: "useCardToPlayered",
		},
		direct: true,
		filter: function (event, player) {
			return event.card.name == "sha" && event.target.hp > 0 && event.target.countCards("he") > 0;
		},
		content: function () {
			"step 0";
			var next = player.choosePlayerCard(trigger.target, "he", [1, 2], get.prompt("taffyold_scschiyan", trigger.target));
			next.set("ai", function (button) {
				if (!_status.event.goon) return 0;
				var val = get.value(button.link);
				if (button.link == _status.event.target.getEquip(2)) return 2 * (val + 3);
				return val;
			});
			next.set("goon", get.attitude(player, trigger.target) <= 0);
			next.set("forceAuto", true);
			("step 1");
			if (result.bool) {
				var target = trigger.target;
				player.logSkill("taffyold_scschiyan", target);
				target.addSkill("taffyold_scschiyan_get");
				target.addToExpansion("giveAuto", result.cards, target).gaintag.add("taffyold_scschiyan_get");
			}
		},
		ai: {
			unequip_ai: true,
			directHit_ai: true,
			skillTagFilter: function (player, tag, arg) {
				if (get.attitude(player, arg.target) > 0) return false;
				if (tag == "directHit_ai") return arg.target.hp >= Math.max(1, arg.target.countCards("h") - 1);
				if (arg && arg.name == "sha" && arg.target.getEquip(2)) return true;
				return false;
			},
		},
		group: "taffyold_scschiyan_damage",
		subSkill: {
			get: {
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				popup: false,
				charlotte: true,
				filter: function (event, player) {
					return player.getExpansions("taffyold_scschiyan_get").length > 0;
				},
				content: function () {
					"step 0";
					var cards = player.getExpansions("taffyold_scschiyan_get");
					player.gain(cards, "draw");
					game.log(player, "收回了" + get.cnNumber(cards.length) + "张“鸱咽”牌");
					("step 1");
					player.removeSkill("taffyold_scschiyan_get");
				},
				intro: {
					markcount: "expansion",
					mark: function (dialog, storage, player) {
						var cards = player.getExpansions("taffyold_scschiyan_get");
						if (player.isUnderControl(true)) dialog.addAuto(cards);
						else return "共有" + get.cnNumber(cards.length) + "张牌";
					},
				},
			},
			damage: {
				audio: "taffyold_scschiyan",
				trigger: {
					source: "damageBegin1",
				},
				forced: true,
				locked: false,
				logTarget: "player",
				filter: function (event, player) {
					var target = event.player;
					return event.getParent().name == "sha" && player.countCards("h") >= target.countCards("h") && player.countCards("e") >= target.countCards("e");
				},
				content: function () {
					trigger.num++;
				},
			},
		},
	},
	//孙璋
	taffyold_scszimou: {
		audio: "scszimou",
		trigger: {
			player: "useCard",
		},
		forced: true,
		filter: function (event, player) {
			var evt = event.getParent("phaseUse");
			if (!evt || evt.player != player) return false;
			var num = player.getHistory("useCard", evtx => evtx.getParent("phaseUse") == evt).length;
			return num == 2 || num == 4 || num == 6;
		},
		content: function () {
			var evt = trigger.getParent("phaseUse");
			var num = player.getHistory("useCard", evtx => evtx.getParent("phaseUse") == evt).length;
			var cards = [];
			if (num == 2) {
				var card = get.cardPile2(card => {
					return ["jiu", "xionghuangjiu"].includes(card.name);
				});
				if (card) cards.push(card);
			} else if (num == 4) {
				var card = get.cardPile2(card => {
					return card.name == "sha";
				});
				if (card) cards.push(card);
			} else if (num == 6) {
				var card = get.cardPile2(card => {
					return card.name == "juedou";
				});
				if (card) cards.push(card);
			}
			if (cards.length) player.gain(cards, "gain2");
		},
	},
	//毕岚
	taffyold_scspicai: {
		audio: "scspicai",
		enable: "phaseUse",
		usable: 1,
		frequent: true,
		content: function () {
			"step 0";
			event.cards = [];
			event.suits = [];
			("step 1");
			player
				.judge(function (result) {
					var evt = _status.event.getParent("taffyold_scspicai");
					if (evt && evt.suits && evt.suits.includes(get.suit(result))) return 0;
					return 1;
				})
				.set("callback", lib.skill.taffyold_scspicai.callback).judge2 = function (result) {
				return result.bool ? true : false;
			};
			("step 2");
			var cards = cards.filterInD();
			if (cards.length)
				player.chooseTarget("将" + get.translation(cards) + "交给一名角色", true).set("ai", function (target) {
					var player = _status.event.player;
					var att = get.attitude(player, target) / Math.sqrt(1 + target.countCards("h"));
					if (target.hasSkillTag("nogain")) att /= 10;
					return att;
				});
			else event.finish();
			("step 3");
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.line(target, "green");
				target.gain(cards, "gain2").giver = player;
			} else event.finish();
		},
		callback: function () {
			"step 0";
			var evt = event.getParent(2);
			event.getParent().orderingCards.remove(event.judgeResult.card);
			evt.cards.push(event.judgeResult.card);
			if (event.getParent().result.bool) {
				evt.suits.push(event.getParent().result.suit);
				player.chooseBool("是否继续发动【庀材】？").set("frequentSkill", "taffyold_scspicai");
			} else
				event._result = {
					bool: false,
				};
			("step 1");
			if (result.bool) event.getParent(2).redo();
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
		},
	},
	//夏恽
	taffyold_scsyaozhuo: {
		audio: "scsyaozhuo",
		enable: "phaseUse",
		usable: 1,
		filter: function (event, player) {
			return game.hasPlayer(function (current) {
				return player.canCompare(current);
			});
		},
		filterTarget: function (card, player, current) {
			return player.canCompare(current);
		},
		content: function () {
			"step 0";
			player.chooseToCompare(target);
			("step 1");
			if (result.bool) {
				target.skip("phaseDraw");
				target.addTempSkill("taffyold_scsyaozhuo_skip", {
					player: "phaseDrawSkipped",
				});
			} else player.chooseToDiscard(true, "he");
		},
		subSkill: {
			skip: {
				mark: true,
				intro: {
					content: "跳过下一个摸牌阶段",
				},
			},
		},
		ai: {
			order: 1,
			result: {
				target: function (player, target) {
					if (target.skipList.includes("phaseDraw") || target.hasSkill("pingkou")) return 0;
					var hs = player.getCards("h").sort(function (a, b) {
						return b.number - a.number;
					});
					var ts = target.getCards("h").sort(function (a, b) {
						return b.number - a.number;
					});
					if (!hs.length || !ts.length) return 0;
					if (hs[0].number > ts[0].number - 2 && hs[0].number > 5) return -1;
					return 0;
				},
			},
		},
	},
	//韩悝
	taffyold_scsxiaolu: {
		audio: "scsxiaolu",
		enable: "phaseUse",
		usable: 1,
		content: function () {
			"step 0";
			player.draw(3);
			("step 1");
			var num = player.countCards("he");
			if (!num) event.finish();
			else if (num < 3)
				event._result = {
					index: 1,
				};
			else
				player
					.chooseControl()
					.set("choiceList", ["将三张牌交给一名其他角色", "弃置三张牌"])
					.set("ai", function () {
						if (
							game.hasPlayer(function (current) {
								return current != player && get.attitude(player, current) > 0;
							})
						)
							return 0;
						return 1;
					});
			("step 2");
			if (result.index == 0) {
				player.chooseCardTarget({
					position: "he",
					filterCard: true,
					selectCard: 3,
					filterTarget: function (card, player, target) {
						return player != target;
					},
					ai1: function (card) {
						return get.unuseful(card);
					},
					ai2: function (target) {
						var att = get.attitude(_status.event.player, target);
						if (target.hasSkillTag("nogain")) att /= 10;
						if (target.hasJudge("lebu")) att /= 5;
						return att;
					},
					prompt: "选择三张牌，交给一名其他角色",
					forced: true,
				});
			} else {
				player.chooseToDiscard(3, true, "he");
				event.finish();
			}
			("step 3");
			if (result.bool) {
				var target = result.targets[0];
				player.give(result.cards, target);
			}
		},
		ai: {
			order: 9,
			result: {
				player: 2,
			},
		},
	},
	//栗嵩
	taffyold_scskuiji: {
		audio: "scskuiji",
		enable: "phaseUse",
		usable: 1,
		filterTarget: function (card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		content: function () {
			"step 0";
			event.list1 = [];
			event.list2 = [];
			if (player.countCards("h") > 0) {
				var chooseButton = player.chooseButton(4, ["你的手牌", player.getCards("h"), get.translation(target.name) + "的手牌", target.getCards("h")]);
			} else {
				var chooseButton = player.chooseButton(4, [get.translation(target.name) + "的手牌", target.getCards("h")]);
			}
			chooseButton.set("target", target);
			chooseButton.set("ai", function (button) {
				var player = _status.event.player;
				var target = _status.event.target;
				var ps = [];
				var ts = [];
				for (var i = 0; i < ui.selected.buttons.length; i++) {
					var card = ui.selected.buttons[i].link;
					if (target.getCards("h").includes(card)) ts.push(card);
					else ps.push(card);
				}
				var card = button.link;
				var owner = get.owner(card);
				var val = get.value(card) || 1;
				if (owner == target) {
					return 2 * val;
				}
				return 7 - val;
			});
			chooseButton.set("filterButton", function (button) {
				for (var i = 0; i < ui.selected.buttons.length; i++) {
					if (get.suit(button.link) == get.suit(ui.selected.buttons[i].link)) return false;
				}
				return true;
			});
			("step 1");
			if (result.bool) {
				var list = result.links;
				for (var i = 0; i < list.length; i++) {
					if (get.owner(list[i]) == player) {
						event.list1.push(list[i]);
					} else {
						event.list2.push(list[i]);
					}
				}
				if (event.list1.length && event.list2.length) {
					game.loseAsync({
						lose_list: [
							[player, event.list1],
							[target, event.list2],
						],
						discarder: player,
					}).setContent("discardMultiple");
				} else if (event.list2.length) {
					target.discard(event.list2);
				} else player.discard(event.list1);
			}
		},
		ai: {
			order: 13,
			result: {
				target: -1,
			},
		},
	},
	//段珪
	taffyold_scschihe: {
		audio: "scschihe",
		trigger: {
			player: "useCardToPlayered",
		},
		filter: function (event, player) {
			return event.targets.length == 1 && event.card.name == "sha";
		},
		prompt2: function (event, player) {
			var str = "亮出牌堆顶的两张牌并增加伤害；且";
			str += "令" + get.translation(event.target) + "不能使用";
			str += "这两张牌所包含的花色";
			str += "的牌响应" + get.translation(event.card);
			return str;
		},
		logTarget: "target",
		locked: false,
		check: function (event, player) {
			var target = event.target;
			if (get.attitude(player, target) > 0) return false;
			return true;
		},
		content: function () {
			var num = 2;
			var evt = trigger.getParent();
			var suit = get.suit(trigger.card);
			var suits = [];
			if (num > 0) {
				if (typeof evt.baseDamage != "number") evt.baseDamage = 1;
				var cards = get.cards(num);
				player.showCards(cards.slice(0), get.translation(player) + "发动了【叱吓】");
				while (cards.length > 0) {
					var card = cards.pop();
					var suitx = get.suit(card, false);
					suits.add(suitx);
					if (suit == suitx) evt.baseDamage++;
				}
				game.updateRoundNumber();
			}
			evt._taffyold_scschihe_player = player;
			var target = trigger.target;
			target.addTempSkill("taffyold_scschihe_block");
			if (!target.storage.taffyold_scschihe_block) target.storage.taffyold_scschihe_block = [];
			target.storage.taffyold_scschihe_block.push([evt.card, suits]);
			lib.skill.taffyold_scschihe.updateBlocker(target);
		},
		updateBlocker: function (player) {
			var list = [],
				storage = player.storage.taffyold_scschihe_block;
			if (storage && storage.length) {
				for (var i of storage) list.addArray(i[1]);
			}
			player.storage.taffyold_scschihe_blocker = list;
		},
		ai: {
			threaten: 2.5,
		},
		subSkill: {
			block: {
				mod: {
					cardEnabled: function (card, player) {
						if (!player.storage.taffyold_scschihe_blocker) return;
						var suit = get.suit(card);
						if (suit == "none" || suit == "unsure") return;
						var evt = _status.event;
						if (evt.name != "chooseToUse") evt = evt.getParent("chooseToUse");
						if (!evt || !evt.respondTo || evt.respondTo[1].name != "sha") return;
						if (player.storage.taffyold_scschihe_blocker.includes(suit)) return false;
					},
				},
				trigger: {
					player: ["damageBefore", "damageCancelled", "damageZero"],
					target: ["shaMiss", "useCardToExcluded", "useCardToEnd"],
					global: ["useCardEnd"],
				},
				forced: true,
				firstDo: true,
				charlotte: true,
				popup: false,
				onremove: function (player) {
					delete player.storage.taffyold_scschihe_block;
					delete player.storage.taffyold_scschihe_blocker;
				},
				filter: function (event, player) {
					if (!event.card || !player.storage.taffyold_scschihe_block) return false;
					for (var i of player.storage.taffyold_scschihe_block) {
						if (i[0] == event.card) return true;
					}
					return false;
				},
				content: function () {
					var storage = player.storage.taffyold_scschihe_block;
					for (var i = 0; i < storage.length; i++) {
						if (storage[i][0] == trigger.card) {
							storage.splice(i--, 1);
						}
					}
					if (!storage.length) player.removeSkill("taffyold_scschihe_block");
					else lib.skill.taffyold_scschihe.updateBlocker(target);
				},
			},
		},
	},
	//郭胜
	taffyold_scsniqu: {
		audio: "scsniqu",
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		selectTarget: 1,
		content: function () {
			target.damage("fire");
		},
		ai: {
			expose: 0.2,
			order: 5,
			result: {
				target: function (player, target) {
					return get.damageEffect(target, player, target, "fire") / 10;
				},
			},
		},
	},
	//高望
	taffyold_scsanruo: {
		audio: "scsanruo",
		enable: ["chooseToUse", "chooseToRespond"],
		prompt: "将一张♥牌当做桃，♦牌当做火杀，♣牌当做闪，♠牌当做无懈可击使用或打出",
		viewAs: function (cards, player) {
			var name = false;
			var nature = null;
			switch (get.suit(cards[0], player)) {
				case "club":
					name = "shan";
					break;
				case "diamond":
					name = "sha";
					nature = "fire";
					break;
				case "spade":
					name = "wuxie";
					break;
				case "heart":
					name = "tao";
					break;
			}
			if (name)
				return {
					name: name,
					nature: nature,
				};
			return null;
		},
		check: function (card) {
			var player = _status.event.player;
			if (_status.event.type == "phase") {
				var max = 0;
				var name2;
				var list = ["sha", "tao"];
				var map = {
					sha: "diamond",
					tao: "heart",
				};
				for (var i = 0; i < list.length; i++) {
					var name = list[i];
					if (
						player.countCards("hes", function (card) {
							return (name != "sha" || get.value(card) < 5) && get.suit(card, player) == map[name];
						}) > 0 &&
						player.getUseValue({
							name: name,
							nature: name == "sha" ? "fire" : null,
						}) > 0
					) {
						var temp = get.order({
							name: name,
							nature: name == "sha" ? "fire" : null,
						});
						if (temp > max) {
							max = temp;
							name2 = map[name];
						}
					}
				}
				if (name2 == get.suit(card, player)) return name2 == "diamond" ? 5 - get.value(card) : 20 - get.value(card);
				return 0;
			}
			return 1;
		},
		position: "hes",
		filterCard: function (card, player, event) {
			event = event || _status.event;
			var filter = event._backup.filterCard;
			var name = get.suit(card, player);
			if (
				name == "club" &&
				filter(
					{
						name: "shan",
						cards: [card],
					},
					player,
					event
				)
			)
				return true;
			if (
				name == "diamond" &&
				filter(
					{
						name: "sha",
						cards: [card],
						nature: "fire",
					},
					player,
					event
				)
			)
				return true;
			if (
				name == "spade" &&
				filter(
					{
						name: "wuxie",
						cards: [card],
					},
					player,
					event
				)
			)
				return true;
			if (
				name == "heart" &&
				filter(
					{
						name: "tao",
						cards: [card],
					},
					player,
					event
				)
			)
				return true;
			return false;
		},
		filter: function (event, player) {
			var filter = event.filterCard;
			if (
				filter(
					get.autoViewAs(
						{
							name: "sha",
							nature: "fire",
						},
						"unsure"
					),
					player,
					event
				) &&
				player.countCards("hes", {
					suit: "diamond",
				})
			)
				return true;
			if (
				filter(
					get.autoViewAs(
						{
							name: "shan",
						},
						"unsure"
					),
					player,
					event
				) &&
				player.countCards("hes", {
					suit: "club",
				})
			)
				return true;
			if (
				filter(
					get.autoViewAs(
						{
							name: "tao",
						},
						"unsure"
					),
					player,
					event
				) &&
				player.countCards("hes", {
					suit: "heart",
				})
			)
				return true;
			if (
				filter(
					get.autoViewAs(
						{
							name: "wuxie",
						},
						"unsure"
					),
					player,
					event
				) &&
				player.countCards("hes", {
					suit: "spade",
				})
			)
				return true;
			return false;
		},
		precontent: function () {
			"step 0";
			player.addTempSkill("taffyold_scsanruo_effect");
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter: function (player, tag) {
				var name;
				switch (tag) {
					case "respondSha":
						name = "diamond";
						break;
					case "respondShan":
						name = "club";
						break;
					case "save":
						name = "heart";
						break;
				}
				if (
					!player.countCards("hes", {
						suit: name,
					})
				)
					return false;
			},
			order: function (item, player) {
				if (player && _status.event.type == "phase") {
					var max = 0;
					var list = ["sha", "tao"];
					var map = {
						sha: "diamond",
						tao: "heart",
					};
					for (var i = 0; i < list.length; i++) {
						var name = list[i];
						if (
							player.countCards("hes", function (card) {
								return (name != "sha" || get.value(card) < 5) && get.suit(card, player) == map[name];
							}) > 0 &&
							player.getUseValue({
								name: name,
								nature: name == "sha" ? "fire" : null,
							}) > 0
						) {
							var temp = get.order({
								name: name,
								nature: name == "sha" ? "fire" : null,
							});
							if (temp > max) max = temp;
						}
					}
					max /= 1.1;
					return max;
				}
				return 2;
			},
		},
		hiddenCard: function (player, name) {
			if (name == "wuxie" && _status.connectMode && player.countCards("hes") > 0) return true;
			if (name == "wuxie")
				return (
					player.countCards("hes", {
						suit: "spade",
					}) > 0
				);
			if (name == "tao")
				return (
					player.countCards("hes", {
						suit: "heart",
					}) > 0
				);
		},
		subSkill: {
			effect: {
				audio: "taffyold_scsanruo",
				trigger: {
					player: ["useCard", "respond"],
				},
				filter: function (event, player) {
					return event.skill == "taffyold_scsanruo";
				},
				direct: true,
				forced: true,
				charlotte: true,
				content: function () {
					"step 0";
					var name = trigger.card.name;
					var next = game.createEvent("taffyold_scsanruo_" + name);
					next.player = player;
					next.setContent(lib.skill.taffyold_scsanruo_effect[name == "shan" ? "sha" : name] || function () {});
				},
				sha: function () {
					"step 0";
					var trigger = event.getParent().getTrigger();
					if (trigger.name == "useCard") {
						var target = lib.skill.chongzhen.logTarget(trigger, player);
					} else {
						var target = trigger.source;
					}
					event.target = target;
					if (!target || !target.countGainableCards(player, "he"))
						event._result = {
							bool: false,
						};
					else
						player
							.chooseBool(get.prompt("taffyold_scsanruo_effect", target), "获得该角色的一张牌")
							.set("ai", () => {
								return _status.event.goon;
							})
							.set("goon", get.attitude(player, target) < 1);
					("step 1");
					if (result.bool) {
						player.logSkill("taffyold_scsanruo_effect", target);
						player.gainPlayerCard(target, "he", true);
					}
				},
				tao: function () {
					"step 0";
					player
						.chooseTarget(get.prompt("taffyold_scsanruo"), "获得一名其他角色的一张牌", (card, player, target) => {
							return target.countGainableCards(player, "he") && target != player;
						})
						.set("ai", target => {
							return 1 - get.attitude(_status.event.player, target);
						});
					("step 1");
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("taffyold_scsanruo_effect", target);
						player.gainPlayerCard(target, "he", true);
					}
				},
				wuxie: function () {
					"step 0";
					var trigger = event.getParent().getTrigger();
					if (!trigger.respondTo) {
						event.finish();
						return;
					}
					var target = trigger.respondTo[0];
					event.target = target;
					if (!target || !target.countGainableCards(player, player == target ? "e" : "he"))
						event._result = {
							bool: false,
						};
					else
						player
							.chooseBool(get.prompt("taffyold_scsanruo_effect", target), "获得该角色的一张牌")
							.set("ai", () => {
								return _status.event.goon;
							})
							.set("goon", get.attitude(player, target) < 1);
					("step 1");
					if (result.bool) {
						player.logSkill("taffyold_scsanruo_effect", target);
						player.gainPlayerCard(target, player == target ? "e" : "he", true);
					}
				},
			},
		},
	},
	//旧张机
	taffyold_jishi: {
		audio: "jishi",
		trigger: { player: "useCardAfter" },
		forced: true,
		filter: function (event, player) {
			return (
				event.cards.filterInD().length > 0 &&
				!player.getHistory("sourceDamage", function (evt) {
					return evt.card == event.card;
				}).length
			);
		},
		content: function () {
			var cards = trigger.cards.filterInD();
			game.log(player, "将", cards, "置于了仁库");
			game.cardsGotoSpecial(cards, "toRenku");
		},
		init: function (player) {
			player.storage.renku = true;
		},
		group: "taffyold_jishi_draw",
		subSkill: {
			draw: {
				trigger: {
					global: ["gainAfter", "cardsDiscardAfter"],
				},
				forced: true,
				filter: function (event, player) {
					return event.fromRenku == true;
				},
				content: function () {
					player.draw();
				},
			},
		},
		ai: {
			combo: "binglun",
		},
	},
	//旧谋黄忠
	taffyold_sbliegong: {
		audio: "sbliegong",
		mod: {
			targetInRange(card, player, target) {
				if (card.name == "sha" && typeof get.number(card) == "number") {
					if (get.distance(player, target) <= get.number(card)) return true;
				}
			},
		},
		trigger: { player: "useCardToPlayered" },
		filter: function (event, player) {
			return !event.getParent()._taffyold_sbliegong_player && event.targets.length == 1 && event.card.name == "sha" && player.getStorage("taffyold_sbliegong").length > 0;
		},
		prompt2: function (event, player) {
			var str = "",
				storage = player.getStorage("taffyold_sbliegong");
			if (storage.length > 1) {
				str += "亮出牌堆顶的" + get.cnNumber(storage.length - 1) + "张牌并增加伤害；且";
			}
			str += "令" + get.translation(event.target) + "不能使用花色为";
			for (var i = 0; i < storage.length; i++) {
				str += get.translation(storage[i]);
			}
			str += "的牌响应" + get.translation(event.card);
			return str;
		},
		logTarget: "target",
		locked: false,
		check: function (event, player) {
			var target = event.target;
			if (get.attitude(player, target) > 0) return false;
			if (
				target.hasSkillTag("filterDamage", null, {
					player: player,
					card: event.card,
				})
			)
				return false;
			var storage = player.getStorage("taffyold_sbliegong");
			if (storage.length >= 4) return true;
			if (storage.length < 3) return false;
			if (target.hasShan()) return storage.includes("heart") && storage.includes("diamond");
			return true;
		},
		content: function () {
			var storage = player.getStorage("taffyold_sbliegong").slice(0);
			var num = storage.length - 1;
			var evt = trigger.getParent();
			if (num > 0) {
				if (typeof evt.baseDamage != "number") evt.baseDamage = 1;
				var cards = get.cards(num);
				player.showCards(cards.slice(0), get.translation(player) + "发动了【烈弓】");
				while (cards.length > 0) {
					var card = cards.pop();
					if (storage.includes(get.suit(card, false))) evt.baseDamage++;
					//ui.cardPile.insertBefore(card,ui.cardPile.firstChild);
				}
				//game.updateRoundNumber();
			}
			evt._taffyold_sbliegong_player = player;
			player.addTempSkill("taffyold_sbliegong_clear");
			var target = trigger.target;
			target.addTempSkill("taffyold_sbliegong_block");
			if (!target.storage.taffyold_sbliegong_block) target.storage.taffyold_sbliegong_block = [];
			target.storage.taffyold_sbliegong_block.push([evt.card, storage]);
			lib.skill.taffyold_sbliegong.updateBlocker(target);
		},
		updateBlocker: function (player) {
			if (!player) return;
			var list = [],
				storage = player.storage.taffyold_sbliegong_block;
			if (storage && storage.length) {
				for (var i of storage) list.addArray(i[1]);
			}
			player.storage.taffyold_sbliegong_blocker = list;
		},
		ai: {
			threaten: 3.5,
			directHit_ai: true,
			skillTagFilter: function (player, tag, arg) {
				if (arg && arg.card && arg.card.name == "sha") {
					var storage = player.getStorage("taffyold_sbliegong");
					if (storage.length < 3 || !storage.includes("heart") || !storage.includes("diamond")) return false;
					var target = arg.target;
					if (target.hasSkill("bagua_skill") || target.hasSkill("bazhen") || target.hasSkill("rw_bagua_skill")) return false;
					return true;
				}
				return false;
			},
		},
		intro: {
			content: "已记录花色：$",
			onunmark: true,
		},
		group: "taffyold_sbliegong_count",
		subSkill: {
			clear: {
				trigger: { player: "useCardAfter" },
				forced: true,
				charlotte: true,
				popup: false,
				filter: function (event, player) {
					return event._taffyold_sbliegong_player == player;
				},
				content: function () {
					player.unmarkSkill("taffyold_sbliegong");
				},
			},
			block: {
				mod: {
					cardEnabled: function (card, player) {
						if (!player.storage.taffyold_sbliegong_blocker) return;
						var suit = get.suit(card);
						if (suit == "none") return;
						var evt = _status.event;
						if (evt.name != "chooseToUse") evt = evt.getParent("chooseToUse");
						if (!evt || !evt.respondTo || evt.respondTo[1].name != "sha") return;
						if (player.storage.taffyold_sbliegong_blocker.includes(suit)) return false;
					},
				},
				trigger: {
					player: ["damageBefore", "damageCancelled", "damageZero"],
					target: ["shaMiss", "useCardToExcluded", "useCardToEnd"],
					global: ["useCardEnd"],
				},
				forced: true,
				firstDo: true,
				charlotte: true,
				onremove: function (player) {
					delete player.storage.taffyold_sbliegong_block;
					delete player.storage.taffyold_sbliegong_blocker;
				},
				filter: function (event, player) {
					if (!event.card || !player.storage.taffyold_sbliegong_block) return false;
					for (var i of player.storage.taffyold_sbliegong_block) {
						if (i[0] == event.card) return true;
					}
					return false;
				},
				content: function () {
					var storage = player.storage.taffyold_sbliegong_block;
					for (var i = 0; i < storage.length; i++) {
						if (storage[i][0] == trigger.card) {
							storage.splice(i--, 1);
						}
					}
					if (!storage.length) player.removeSkill("taffyold_sbliegong_block");
					else lib.skill.taffyold_sbliegong.updateBlocker(target);
				},
			},
			count: {
				trigger: {
					player: "useCard",
					target: "useCardToTargeted",
				},
				forced: true,
				filter: function (event, player, name) {
					if (name != "useCard" && player == event.player) return false;
					var suit = get.suit(event.card);
					if (!lib.suit.includes(suit)) return false;
					if (player.storage.taffyold_sbliegong && player.storage.taffyold_sbliegong.includes(suit)) return false;
					return true;
				},
				content: function () {
					player.markAuto("taffyold_sbliegong", [get.suit(trigger.card)]);
				},
			},
		},
	},
	//旧应天司马懿！肯定又要修改
	taffyold_jilin: {
		audio: "jilin",
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		locked: false,
		logAudio: () => 1,
		async content(event, trigger, player) {
			const cards = get.cards(3);
			const next = player.addToExpansion(cards, "draw");
			next.gaintag.add(event.name);
			await next;
		},
		marktext: "志",
		intro: {
			markcount: "expansion",
			mark(dialog, content, player) {
				const cards = player.getExpansions("taffyold_jilin"),
					mingzhi = cards.filter(card => card.storage.taffyold_jilin),
					hidden = cards.removeArray(mingzhi);
				if (mingzhi.length) {
					dialog.addText("已明之志");
					dialog.addSmall(mingzhi);
				}
				if (hidden.length) {
					if (player == game.me || player.isUnderControl()) {
						dialog.addText("未明之志");
						dialog.addSmall(hidden);
					} else {
						return "共有" + get.cnNumber(hidden.length) + "张暗“志”";
					}
				}
			},
			content(content, player) {
				const cards = player.getExpansions("taffyold_jilin"),
					mingzhi = cards.filter(card => card.storage.taffyold_jilin),
					hidden = cards.removeArray(mingzhi);
				if (mingzhi.length) {
					dialog.addText("已明之志");
					dialog.addSmall(mingzhi);
				}
				if (hidden.length) {
					if (player == game.me || player.isUnderControl()) {
						dialog.addText("未明之志");
						dialog.addSmall(hidden);
					} else {
						return "共有" + get.cnNumber(hidden.length) + "张暗“志”";
					}
				}
			},
		},
		group: ["taffyold_jilin_kanpo", "taffyold_jilin_change"],
		subSkill: {
			kanpo: {
				audio: "taffyold_jilin",
				logAudio: () => get.rand(2, 3),
				trigger: {
					target: "useCardToTarget",
				},
				filter(event, player) {
					return event.player != player && player.getExpansions("taffyold_jilin").some(card => !card.storage.taffyold_jilin);
				},
				async cost(event, trigger, player) {
					const hidden = player.getExpansions("taffyold_jilin").filter(card => !card.storage.taffyold_jilin);
					const goon = get.effect(player, trigger.card, trigger.player, player) < 0;
					const suits = player
						.getExpansions("taffyold_jilin")
						.filter(card => card.storage.taffyold_jilin)
						.map(card => get.suit(card))
						.toUniqued();
					if (hidden.length == 1) {
						const bool = await player
							.chooseBool("戢鳞：明置一张“志”", `令${get.translation(trigger.card)}对你无效`)
							.set("choice", goon)
							.forResultBool();
						event.result = {
							bool: bool,
							cost_data: hidden,
						};
					} else {
						const {
							result: { bool, links },
						} = await player
							.chooseButton(["戢鳞：明置一张“志”", hidden])
							.set("ai", button => {
								const player = get.player(),
									card = button.link,
									suits = get.event("suits");
								if (!get.event("goon")) return 0;
								if (!suits.includes(get.suit(card))) return 10;
								return 6 - get.value(card);
							})
							.set("suits", suits)
							.set("goon", goon);
						event.result = {
							bool: bool,
							cost_data: links,
						};
					}
				},
				async content(event, trigger, player) {
					event.cost_data[0].storage.taffyold_jilin = true;
					trigger.getParent().excluded.add(player);
				},
			},
			change: {
				audio: "taffyold_jilin",
				logAudio: () => get.rand(4, 5),
				trigger: {
					player: "phaseBegin",
				},
				filter(event, player) {
					return player.countCards("h") && player.getExpansions("taffyold_jilin").some(card => !card.storage.taffyold_jilin);
				},
				async cost(event, trigger, player) {
					const hidden = player.getExpansions("taffyold_jilin").filter(card => !card.storage.taffyold_jilin);
					const next = player.chooseToMove("戢鳞：是否交换“志”和手牌？");
					next.set("list", [
						[get.translation(player) + "（你）的未明之“志”", hidden],
						["手牌区", player.getCards("h")],
					]);
					next.set("filterMove", (from, to) => {
						return typeof to != "number";
					});
					next.set("processAI", list => {
						let player = get.player(),
							cards = list[0][1].concat(list[1][1]).sort(function (a, b) {
								return get.useful(a) - get.useful(b);
							}),
							cards2 = cards.splice(0, player.getExpansions("taffyold_jilin").length);
						return [cards2, cards];
					});
					const {
						result: { bool, moved },
					} = await next;
					event.result = {
						bool: bool,
						cost_data: moved,
					};
				},
				async content(event, trigger, player) {
					const moved = event.cost_data;
					const pushs = moved[0],
						gains = moved[1];
					pushs.removeArray(player.getExpansions("taffyold_jilin"));
					gains.removeArray(player.getCards("h"));
					if (!pushs.length || pushs.length != gains.length) return;
					const next = player.addToExpansion(pushs);
					next.gaintag.add("taffyold_jilin");
					await next;
					await player.gain(gains, "draw");
				},
			},
		},
	},
	taffyold_yingyou: {
		audio: "yingyou",
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return player.countCards("h") && player.getExpansions("taffyold_jilin").some(card => !card.storage.taffyold_jilin);
		},
		async cost(event, trigger, player) {
			const hidden = player.getExpansions("taffyold_jilin").filter(card => !card.storage.taffyold_jilin);
			const suits = player
				.getExpansions("taffyold_jilin")
				.filter(card => card.storage.taffyold_jilin)
				.map(card => get.suit(card))
				.toUniqued();
			const {
				result: { bool, links },
			} = await player
				.chooseButton(["英猷：你可以明志", hidden])
				.set("ai", button => {
					const player = get.player(),
						card = button.link,
						suits = get.event("suits");
					const getNum = player => {
						var list = [];
						for (var i of lib.suit) list.push(player.countCards("h", { suit: i }) + 3);
						return list.sort((a, b) => b - a)[0];
					};
					if (!suits.includes(get.suit(card))) return 10;
					if (get.suit(card) == getNum(player)) return 5;
					return 0;
				})
				.set("suits", suits);
			event.result = {
				bool: bool,
				cost_data: links,
			};
		},
		logAudio: () => get.rand(1, 2),
		async content(event, trigger, player) {
			event.cost_data[0].storage.taffyold_jilin = true;
			const num = player.getExpansions("taffyold_jilin").filter(card => card.storage.taffyold_jilin).length;
			await player.draw(num);
		},
		ai: {
			combo: "taffyold_jilin",
		},
		group: "taffyold_yingyou_draw",
		subSkill: {
			draw: {
				audio: "taffyold_yingyou",
				logAudio: () => get.rand(3, 4),
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					const suits = player
						.getExpansions("taffyold_jilin")
						.filter(card => card.storage.taffyold_jilin)
						.map(card => get.suit(card))
						.toUniqued();
					const evt = event.getl(player);
					if (!evt || !evt.cards2 || !evt.cards2.length) return false;
					return evt.cards2.some(card => {
						return suits.includes(get.suit(card, player));
					});
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const suits = player
						.getExpansions("taffyold_jilin")
						.filter(card => card.storage.taffyold_jilin)
						.map(card => get.suit(card))
						.toUniqued();
					const num = trigger.getl(player).cards2.filter(card => {
						return suits.includes(get.suit(card, player));
					}).length;
					await player.draw(num);
				},
			},
		},
	},
	taffyold_yingtian: {
		audio: "yingtian",
		trigger: {
			global: "dieAfter",
		},
		filter(event, player) {
			return game.countGroup() < 3;
		},
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "gray",
		async content(event, trigger, player) {
			const skill = event.name;
			player.awakenSkill(skill);
			await player.changeSkills(get.info(skill).derivation, ["taffyold_yingyou"]);
			player.addSkill(skill + "_effect");
		},
		derivation: ["reguicai", "rewansha", "lianpo"],
		subSkill: {
			effect: {
				mod: {
					targetInRange: () => true,
				},
			},
		},
	},
	//旧手杀神司马？
	//旧极略神司马！
	taffyold_xinrenjie: {
		audio: "xinrenjie",
		trigger: {
			player: ["chooseToUseAfter", "chooseToRespondAfter"],
			global: "useCardAfter",
		},
		filter(event, player) {
			if (player.getRoundHistory("useSkill", evt => evt.skill == "taffyold_xinrenjie").length >= 4) return false;
			if (event.name == "useCard") {
				//......
				if (get.type(event.card) != "trick") return false;
				const history = game.getGlobalHistory("everything", evt => evt.player == player && ["useCard", "respond"].includes(evt.name));
				return !history.some(evt => Array.isArray(evt.respondTo) && evt.respondTo[1] == event.card && evt.card.name == "wuxie");
			}
			const evt = event.getParent(2);
			if (!evt || evt.name != "useCard") return false;
			return !event.result.bool;
		},
		forced: true,
		async content(event, trigger, player) {
			player.addMark(event.name, 1);
		},
		intro: {
			name2: "忍",
			content: "mark",
		},
		marktext: "忍",
		global: "taffyold_xinrenjie_global",
		subSkill: {
			global: {
				hiddenCard: () => true,
				ai: {
					respondSha: true,
					respondShan: true,
				},
			},
		},
	},
	taffyold_xinbaiyin: {
		audio: "xinbaiyin",
		inherit: "sbaiyin",
		filter(event, player) {
			return player.countMark("taffyold_xinrenjie") >= 4;
		},
		async content(event, trigger, player) {
			player.awakenSkill("taffyold_xinbaiyin");
			await player.loseMaxHp();
			await player.addSkills("taffyold_xinjilve");
		},
		derivation: ["taffyold_xinjilve", "reguicai", "fangzhu", "rejizhi", "rezhiheng", "rewansha"],
		ai: {
			combo: "taffyold_xinrenjie",
		},
	},
	taffyold_xinlianpo: {
		audio: "lianpo",
		trigger: {
			source: "dieAfter",
		},
		async cost(event, trigger, player) {
			const skills = get
				.info("taffyold_xinbaiyin")
				.derivation.removeArray(["taffyold_xinjilve", "reguicai"])
				.filter(skill => !player.hasSkill(skill, null, null, false));
			if (skills.length && player.hasSkill("taffyold_xinjilve", null, null, false)) {
				const next = player.chooseButton(["连破：请选择一项", [skills.map(i => [i, `获得【${get.translation(i)}】`]).concat(["于此回合结束后获得一个额外回合"]), "textbutton"]]);
				next.set("ai", button => {
					const link = button.link,
						skills = get.event("skills");
					if ((skills.length <= 2 || game.countPlayer() <= 2) && !player.hasSkill("taffyold_xinlianpo_mark", null, null, false) && link == "于此回合结束后获得一个额外回合") return 6;
					if (link == "rezhiheng" && player.countCards("h") > 0) return 5;
					if (link == "rejizhi" && (!skills.includes("rezhiheng") || player.countCards("hs", { type: "trick" }))) return 3;
					if (link == "rewansha" && game.hasPlayer(current => get.attitude(player, current) < 0 && current.getHp() < 2 && (player == _status.currentPhase || player.hasSkill("taffyold_xinlianpo_mark", null, null, false)))) return 2;
					return 1;
				});
				next.set("skills", skills);
				const {
					result: { bool, links },
				} = await next;
				event.result = {
					bool: bool,
					cost_data: links,
				};
			} else {
				const bool = await player.chooseBool("连破：于此回合结束后获得一个额外回合？").forResultBool();
				event.result = {
					bool: bool,
				};
			}
		},
		async content(event, trigger, player) {
			const links = event.cost_data;
			if (links && get.info("taffyold_xinbaiyin").derivation.includes(links[0])) await player.addSkills(links[0]);
			else {
				player.addTempSkill("taffyold_xinlianpo_mark");
				player.insertPhase();
			}
		},
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
	taffyold_xinjilve: {
		audio: "xinjilve",
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return player.countMark("taffyold_xinrenjie");
		},
		async cost(event, trigger, player) {
			const limit = Math.min(3, player.countMark("taffyold_xinrenjie"));
			const choices = Array.from({
				length: limit,
			}).map((_, i) => [i, get.cnNumber(i + 1, true)]);
			const history = game.getAllGlobalHistory("everything", evt => evt.name == "taffyold_xinjilve" && evt.player == player && Array.isArray(evt.cost_data) && get.info("taffyold_xinbaiyin").derivation.includes(evt.cost_data[0]));
			const num = history.length + 1;
			const skills = get
				.info("taffyold_xinbaiyin")
				.derivation.removeArray(["taffyold_xinjilve", "reguicai"])
				.filter(skill => !player.hasSkill(skill, null, null, false));
			if (skills.length && limit >= num) {
				const next = player.chooseButton(2, ["连破：请选择你要移去的“忍”标记数和相应操作", '<div class="text center">移去“忍”标记数</div>', [choices, "tdnodes"], '<div class="text center">执行的操作</div>', [skills.map(i => [i, `获得【${get.translation(i)}】`]).concat(["摸牌"]), "tdnodes"]]);
				next.set("filterButton", button => {
					const link = button.link;
					if (!ui.selected.buttons.length && typeof link == "number") return false;
					if (ui.selected.buttons.length) {
						if (typeof link !== "number") return false;
						return ui.selected.buttons[0].link == "摸牌" || link == get.event("num") - 1;
					}
					return true;
				});
				next.set("ai", button => {
					const link = button.link,
						num = get.event("num"),
						skills = get.event("skills");
					if (!ui.selected.buttons.length) {
						if (num > 2 && link == "摸牌") return 10;
						if (link == "rezhiheng" && player.countCards("h") > 0) return 10;
						if (link == "rejizhi" && (!skills.includes("rezhiheng") || player.countCards("hs", { type: "trick" }))) return 8;
						if (player.countMark("taffyold_xinrenjie") <= 2) return 0;
					}
					return ui.selected.buttons.length && ui.selected.buttons[0].link == "摸牌" ? num - 1 : 1;
				});
				next.set("num", num);
				next.set("skills", skills);
				const {
					result: { bool, links },
				} = await next;
				event.result = {
					bool: bool,
					cost_data: links,
				};
			} else {
				const draw = Array.from({
					length: limit,
				}).map((_, i) => get.cnNumber(i + 1, true));
				const { result } = await player
					.chooseControl(draw, "cancel2")
					.set("prompt", get.prompt("taffyold_xinrenjie"))
					.set("prompt2", `你可以摸至多${get.cnNumber(draw.length)}张牌并移去等量枚“忍”标记`)
					.set("ai", () => {
						return get.event("choice");
					})
					.set(
						"choice",
						(function () {
							if (!player.hasSkill("jizhi", null, null, false)) return "cancel2";
							return choices.length - 1;
						})()
					);
				event.result = {
					bool: result.control != "cancel2",
					cost_data: result.index,
				};
			}
		},
		async content(event, trigger, player) {
			const choice = event.cost_data;
			if (typeof choice == "number") {
				player.removeMark("taffyold_xinrenjie", choice + 1);
				await player.draw(choice + 1);
			} else if (get.info("taffyold_xinbaiyin").derivation.includes(choice[0])) {
				const history = game.getAllGlobalHistory("everything", evt => evt.name == "taffyold_xinjilve" && evt.player == player && Array.isArray(evt.cost_data) && get.info("taffyold_xinbaiyin").derivation.includes(evt.cost_data[0]));
				const num = history.length;
				player.removeMark("taffyold_xinrenjie", num);
				await player.addSkills(choice[0]);
			} else {
				player.removeMark("taffyold_xinrenjie", choice[1] + 1);
				await player.draw(choice[1] + 1);
			}
		},
		group: "taffyold_xinjilve_gain",
		subSkill: {
			gain: {
				audio: "xinjilve",
				trigger: {
					player: "changeSkillsAfter",
				},
				filter(event, player) {
					return event.addSkill.includes("taffyold_xinjilve");
				},
				forced: true,
				async content(event, trigger, player) {
					let skills = ["reguicai"];
					const groupList = new Map([
						["wei", "fangzhu"],
						["shu", "rejizhi"],
						["wu", "rezhiheng"],
						["qun", "rewansha"],
						["key", "hiroto_zonglve"],
					]);
					if (Array.from(groupList.keys()).includes(player.group)) skills.push(groupList.get(player.group));
					skills = skills.filter(skill => !player.hasSkill(skill, null, null, false));
					if (skills.length) await player.addSkills(skills);
				},
			},
		},
	},
	// 旧傅佥
	taffyold_jueyong: {
		audio: "jueyong",
		trigger: {
			target: "useCardToTarget",
		},
		forced: true,
		filter: function (event, player) {
			return event.card.name != "jiu" && event.card.name != "tao" && event.targets.length == 1 && event.card.isCard && event.cards.length == 1 && event.getParent(2).name != "taffyold_jueyong_timeout" && get.position(event.cards[0], true) == "o" && event.card.name == event.cards[0].name;
		},
		content: function () {
			trigger.targets.remove(player);
			trigger.getParent().triggeredTargets2.remove(player);
			trigger.untrigger();
			var card = trigger.cards[0];
			player.addToExpansion(card, "gain2").gaintag.add("taffyold_jueyong");
			if (!player.storage.taffyold_jueyong) player.storage.taffyold_jueyong = [[], []];
			player.storage.taffyold_jueyong[0].push(card);
			player.storage.taffyold_jueyong[1].push(trigger.player);
			game.delayx();
		},
		onremove: function (player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
			delete player.storage[skill];
		},
		intro: {
			markcount: function (storage) {
				if (!storage) return 0;
				return storage[0].length;
			},
			mark: function (dialog, storage, player) {
				if (!storage) return;
				dialog.addAuto(storage[0]);
				dialog.addText(get.translation(storage[1]));
			},
			onunmark: function (storage, player) {
				player.storage.taffyold_jueyong = [[], []];
			},
		},
		ai: {
			reverseEquip: true,
			effect: {
				target_use(card, player, target, current) {
					if (get.type(card) == "equip" && !get.tag(card, "gifts") && target.storage.taffyold_jueyong && target.storage.taffyold_jueyong[1].length) {
						var result1 = get.equipResult(player, target, card),
							subtype = get.subtype(card);
						for (var i of target.storage.taffyold_jueyong[0]) {
							if (get.subtype(i, false) == subtype && get.equipResult(target, target, i) >= result1) return "zerotarget";
						}
					}
				},
			},
		},
		group: "taffyold_jueyong_timeout",
		subSkill: {
			timeout: {
				audio: "taffyold_jueyong",
				trigger: {
					player: "phaseJieshuBegin",
				},
				forced: true,
				filter: function (event, player) {
					return player.storage.taffyold_jueyong && player.storage.taffyold_jueyong[0].length >= Math.max(1, player.getDamagedHp());
				},
				content: function () {
					var list = player.storage.taffyold_jueyong,
						card = list[0].shift(),
						source = list[1].shift();
					if (player.getExpansions("taffyold_jueyong").includes(card)) {
						if (source && source.isIn() && source.canUse(card, player, false)) source.useCard(card, player, false);
						else player.loseToDiscardpile(card);
					}
					if (list[0].length) event.redo();
				},
			},
		},
	},
	taffyold_poxiang: {
		audio: "poxiang",
		enable: "phaseUse",
		usable: 1,
		filter: (event, player) => player.countCards("he") > 0,
		filterCard: true,
		filterTarget: function (card, player, target) {
			return player != target;
		},
		position: "he",
		discard: false,
		lose: false,
		delay: false,
		check: function (card) {
			var player = _status.event.player;
			if (
				!player.storage.taffyold_jueyong ||
				!player.storage.taffyold_jueyong[0].length ||
				(player.hp <= 1 &&
					!player.storage.taffyold_jueyong[0].some(function (card) {
						return get.tag(card, "damage") > 0;
					})) ||
				!player.storage.taffyold_jueyong[0].some(function (card) {
					return get.effect(player, card, player.storage.taffyold_jueyong[1][player.storage.taffyold_jueyong[0].indexOf(card)], player) < 0;
				})
			)
				return -1;
			return 20 - get.value(card);
		},
		content: function () {
			"step 0";
			player.give(cards, target);
			player.draw(3);
			("step 1");
			var cards = player.getExpansions("taffyold_jueyong");
			if (cards.length) player.loseToDiscardpile(cards);
			player.unmarkSkill("taffyold_jueyong");
			player.loseHp();
			("step 2");
			player.skip("phaseDiscard");
			game.delayx();
		},
		ai: {
			order: 12,
			result: {
				player: 4,
				target: 1,
			},
		},
	},
	// 旧手杀郭照
	taffyold_yichong: {
		initSkill: function (skill) {
			if (!lib.skill[skill]) {
				lib.skill[skill] = {
					charlotte: true,
					onremove: true,
					mark: true,
					marktext: "雀",
					intro: {
						markcount: function (storage) {
							return (storage || 0).toString();
						},
						content: function (storage) {
							return "已被掠夺" + (storage || 0) + "张牌";
						},
					},
				};
				lib.translate[skill] = "易宠";
				lib.translate[skill + "_bg"] = "雀";
			}
		},
		getLimit: 5,
		audio: "yichong",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		direct: true,
		content: function () {
			"step 0";
			player.chooseTarget(get.prompt("taffyold_yichong"), "选择一名其他角色并选择一个花色，获得其此花色的所有牌并令其获得“雀”标记", lib.filter.notMe).set("ai", function (target) {
				var player = _status.event.player;
				var att = get.attitude(player, target);
				if (att > 0) return 0;
				var getNum = function (player) {
					var list = [];
					for (var i of lib.suit) list.push(player.countCards("he", { suit: i }) + 3);
					return list.sort((a, b) => b - a)[0];
				};
				return getNum(target) + target.countCards("h") / 10;
			});
			("step 1");
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("taffyold_yichong", target);
				event.target = target;
				player
					.chooseControl(lib.suit.slice(0).reverse())
					.set("prompt", "请声明一个花色")
					.set("ai", function () {
						var target = _status.event.target,
							cards = target.getCards("he");
						var suits = lib.suit.slice(0);
						suits.sort(function (a, b) {
							var num = function (suit) {
								return cards.filter(function (card) {
									return get.suit(card) == suit;
								}).length;
							};
							return num(b) - num(a);
						});
						return suits[0];
					})
					.set("target", target);
			} else event.finish();
			("step 2");
			var suit = result.control;
			event.suit = suit;
			player.chat(get.translation(suit + 2));
			game.log(player, "选择了", "#y" + get.translation(suit + 2));
			if (target.countCards("he", { suit: suit })) player.gain(target.getCards("he", { suit: suit }), target, "giveAuto");
			("step 3");
			var suit = event.suit;
			player.storage.taffyold_yichong = suit;
			player.markSkill("taffyold_yichong");
			var skill = "taffyold_yichong_" + player.playerid;
			game.broadcastAll(lib.skill.taffyold_yichong.initSkill, skill);
			game.broadcastAll(
				function (player, suit) {
					if (player.marks.taffyold_yichong) player.marks.taffyold_yichong.firstChild.innerHTML = get.translation(suit);
				},
				player,
				suit
			);
			game.countPlayer(function (current) {
				current.removeSkill("taffyold_yichong_" + player.playerid);
				if (current == target) target.addSkill("taffyold_yichong_" + player.playerid);
			});
			player.addTempSkill("taffyold_yichong_clear", { player: "phaseBegin" });
		},
		onremove: true,
		intro: {
			content: "拥有“雀”标记的角色得到$牌后，你获得之",
		},
		group: "taffyold_yichong_gain",
		subSkill: {
			gain: {
				audio: "taffyold_yichong",
				trigger: {
					global: ["gainAfter", "loseAsyncAfter"],
				},
				filter: function (event, player) {
					if (!player.storage.taffyold_yichong) return false;
					return game.hasPlayer(function (current) {
						if (!event.getg(current).length || !current.hasSkill("taffyold_yichong_" + player.playerid)) return false;
						if (current.countMark("taffyold_yichong_" + player.playerid) >= lib.skill.taffyold_yichong.getLimit) return false;
						return event.getg(current).some(card => get.suit(card, current) == player.storage.taffyold_yichong && lib.filter.canBeGained(card, current, player));
					});
				},
				forced: true,
				content: function () {
					var target = game.findPlayer(function (current) {
						if (!trigger.getg(current).length || !current.hasSkill("taffyold_yichong_" + player.playerid)) return false;
						if (current.countMark("taffyold_yichong_" + player.playerid) >= lib.skill.taffyold_yichong.getLimit) return false;
						return trigger.getg(current).some(card => get.suit(card, current) == player.storage.taffyold_yichong && lib.filter.canBeGained(card, current, player));
					});
					var cards = trigger.getg(target).filter(card => get.suit(card, target) == player.storage.taffyold_yichong && lib.filter.canBeGained(card, target, player));
					var num = lib.skill.taffyold_yichong.getLimit - target.countMark("taffyold_yichong_" + player.playerid);
					cards = cards.randomGets(num);
					player.gain(cards, target, "giveAuto");
					target.addMark("taffyold_yichong_" + player.playerid, cards.length, false);
				},
			},
			clear: {
				charlotte: true,
				onremove: function (player) {
					game.countPlayer(function (current) {
						current.removeSkill("taffyold_yichong_" + player.playerid);
					});
				},
			},
		},
	},
	taffyold_wufei: {
		audio: "wufei",
		trigger: {
			player: ["useCardToPlayered", "damageEnd"],
		},
		filter: function (event, player) {
			var target = game.findPlayer(current => current.hasSkill("taffyold_yichong_" + player.playerid));
			if (!target) return false;
			if (event.name == "damage") return target.hp > 1 && target.hp > player.hp;
			return event.isFirstTarget && (event.card.name == "sha" || (get.type(event.card) == "trick" && get.tag(event.card, "damage")));
		},
		direct: true,
		content: function () {
			"step 0";
			var target = game.findPlayer(current => current.hasSkill("taffyold_yichong_" + player.playerid));
			event.target = target;
			if (trigger.name == "damage") {
				player.chooseBool(get.prompt("taffyold_wufei", target), "令" + get.translation(target) + "受到1点无来源伤害").set("choice", get.damageEffect(target, player, player) > 0);
			} else {
				player.logSkill("taffyold_wufei", target);
				player.addTempSkill("taffyold_wufei_effect");
				player.markAuto("taffyold_wufei_effect", [trigger.card]);
				game.log(target, "成为了", trigger.card, "的伤害来源");
				event.finish();
			}
			("step 1");
			if (result.bool) {
				player.logSkill("taffyold_wufei", target);
				target.damage("nosource");
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: {
					source: "damageBefore",
				},
				filter: function (event, player) {
					if (!event.card) return false;
					return player.getStorage("taffyold_wufei_effect").includes(event.card);
				},
				forced: true,
				popup: false,
				firstDo: true,
				content: function () {
					var target = game.findPlayer(current => current.hasSkill("taffyold_yichong_" + player.playerid));
					if (!target) delete trigger.source;
					else trigger.source = target;
				},
			},
		},
		ai: {
			combo: "taffyold_yichong",
		},
	},
	// 旧手杀文鸯
	taffyold_dbzhuifeng: {
		audio: "dbzhuifeng",
		groupSkill: "wei",
		enable: "chooseToUse",
		filter: function (event, player) {
			return player.group == "wei" && player.hp > 0 && (event.filterCard({ name: "sha", isCard: true }, player, event) || event.filterCard({ name: "juedou", isCard: true }, player, event));
		},
		chooseButton: {
			dialog: function () {
				return ui.create.dialog("椎锋", [["sha", "juedou"], "vcard"]);
			},
			filter: function (button, player) {
				var evt = _status.event.getParent();
				return evt.filterCard({ name: button.link[2], isCard: true }, player, evt);
			},
			check: function (card) {
				return _status.event.player.getUseValue({ name: card.link[2] }) * (card.link[2] == "juedou") ? 2 : 1;
			},
			backup: function (links) {
				return {
					viewAs: { name: links[0][2], isCard: true },
					filterCard: () => false,
					selectCard: -1,
					precontent: function () {
						"step 0";
						player.logSkill("taffyold_dbzhuifeng");
						delete event.result.skill;
						player.loseHp();
						event.forceDie = true;
						("step 1");
						//特殊处理
						if (player.isDead()) {
							player.useResult(event.result, event.getParent()).forceDie = true;
						}
					},
				};
			},
			prompt: function (links) {
				return "请选择【" + get.translation(links[0][2]) + "】的目标";
			},
		},
		ai: {
			respondSha: true,
			skillTagFilter: function (player, tag, arg) {
				return player.group == "wei" && player.hp > 0 && arg == "use";
			},
			order: function () {
				var player = _status.event.player;
				if (player.hasValueTarget({ name: "juedou" })) return get.order({ name: "juedou" }) - 0.5;
				return get.order({ name: "sha" }) - 0.5;
			},
			result: {
				player: function (player) {
					if (player.hp > 1) return 1;
					return -1;
				},
			},
		},
	},
	taffyold_dbchongjian: {
		audio: "dbchongjian",
		groupSkill: "wu",
		hiddenCard: function (player, name) {
			if (
				player.group == "wu" &&
				(name == "sha" || name == "jiu") &&
				player.hasCard(function (card) {
					return get.type(card) == "equip";
				}, "hes")
			)
				return true;
			return false;
		},
		enable: "chooseToUse",
		filter: function (event, player) {
			return (
				player.group == "wu" &&
				player.hasCard(function (card) {
					return get.type(card) == "equip";
				}, "hes") &&
				(event.filterCard({ name: "sha", isCard: true }, player, event) || event.filterCard({ name: "jiu", isCard: true }, player, event))
			);
		},
		chooseButton: {
			dialog: function () {
				return ui.create.dialog("冲坚", [["sha", "jiu"], "vcard"]);
			},
			filter: function (button, player) {
				var evt = _status.event.getParent();
				return evt.filterCard(
					{
						name: button.link[2],
						isCard: true,
					},
					player,
					evt
				);
			},
			check: function (button) {
				if (_status.event.getParent().type != "phase") return 1;
				var player = _status.event.player;
				if (
					button.link[2] == "jiu" &&
					(player.hasCard(function (card) {
						return get.name(card) == "sha";
					}, "hs") ||
						player.countCards("hes", function (card) {
							if (get.type(card) != "equip") return false;
							if (get.position(card) == "e") {
								if (player.hasSkillTag("noe")) return 10 - get.value(card) > 0;
								var sub = get.subtype(card);
								if (
									player.hasCard(function (card) {
										return get.subtype(card) == sub && player.canUse(card, player) && get.effect(player, card, player, player) > 0;
									}, "hs")
								)
									return 10 - get.value(card) > 0;
							}
							return 5 - get.value(card) > 0;
						}) > 1)
				)
					return (
						player.getUseValue({
							name: "jiu",
						}) * 4
					);
				return player.getUseValue({
					name: button.link[2],
				});
			},
			backup: function (links, player) {
				return {
					audio: "dbchongjian",
					viewAs: {
						name: links[0][2],
						isCard: true,
					},
					filterCard: { type: "equip" },
					position: "hes",
					popname: true,
					check: function (card) {
						var player = _status.event.player;
						if (get.position(card) == "e") {
							if (player.hasSkillTag("noe")) return 10 - get.value(card);
							var sub = get.subtype(card);
							if (
								player.hasCard(function (card) {
									return get.subtype(card) == sub && player.canUse(card, player) && get.effect(player, card, player, player) > 0;
								}, "hs")
							)
								return 10 - get.value(card);
						}
						return 5 - get.value(card);
					},
				};
			},
			prompt: function (links) {
				return "将一张装备牌当做【" + get.translation(links[0][2]) + "】使用";
			},
		},
		ai: {
			respondSha: true,
			skillTagFilter: function (player, tag, arg) {
				return (
					player.group == "wu" &&
					arg == "use" &&
					player.hasCard(function (card) {
						return get.type(card) == "equip";
					}, "hes")
				);
			},
			order: function (item, player) {
				if (_status.event.type != "phase") return 1;
				var player = _status.event.player;
				if (
					player.hasCard(function (card) {
						if (get.value(card, player) < 0) return true;
						var sub = get.subtype(card);
						return (
							player.hasCard(function (card) {
								return get.subtype(card) == sub && player.canUse(card, player) && get.effect(player, card, player, player) > 0;
							}, "hs") > 0
						);
					}, "e")
				)
					return 10;
				if (
					player.countCards("hs", "sha") ||
					player.countCards("he", function (card) {
						return get.type(card) == "equip" && get.value(card, player) < 5;
					}) > 1
				)
					return get.order({ name: "jiu" }) - 0.1;
				return get.order({ name: "sha" }) - 0.1;
			},
			result: { player: 1 },
		},
	},
	// 旧神荀彧
	taffyold_tianzuo: {
		audio: "tianzuo",
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && !lib.inpile.includes("qizhengxiangsheng");
		},
		content() {
			game.addGlobalSkill("taffyold_tianzuo_global");
			var cards = [];
			for (var i = 2; i < 10; i++) {
				cards.push(game.createCard2("qizhengxiangsheng", i % 2 ? "club" : "spade", i));
			}
			game.broadcastAll(function () {
				lib.inpile.add("qizhengxiangsheng");
			});
			game.cardsGotoPile(cards, () => {
				return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
			});
		},
		group: "taffyold_tianzuo_rewrite",
		subSkill: {
			global: {
				trigger: { player: "useCardToPlayered" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.card.name == "qizhengxiangsheng";
				},
				content() {
					"step 0";
					var target = trigger.target;
					event.target = target;
					player
						.chooseControl("奇兵", "正兵")
						.set("prompt", "请选择" + get.translation(target) + "的标记")
						.set(
							"choice",
							(function () {
								var e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
								var e2 = 0;
								if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) e2 = -1;
								var es = target.getGainableCards(player, "e");
								if (es.length)
									e2 = Math.min(
										e2,
										(function () {
											var max = 0;
											for (var i of es) max = Math.max(max, get.value(i, target));
											return -max / 4;
										})()
									);
								if (Math.abs(e1 - e2) <= 0.3) return Math.random() < 0.5 ? "奇兵" : "正兵";
								if (e1 < e2) return "奇兵";
								return "正兵";
							})()
						)
						.set("ai", function () {
							return _status.event.choice;
						});
					("step 1");
					var map = trigger.getParent().customArgs,
						id = target.playerid;
					if (!map[id]) map[id] = {};
					map[id].qizheng_name = result.control;
				},
			},
			rewrite: {
				audio: "taffyold_tianzuo",
				trigger: { global: "useCardToTargeted" },
				filter(event, player) {
					return event.card.name == "qizhengxiangsheng";
				},
				logTarget: "target",
				prompt2: "观看其手牌并修改“奇正相生”标记",
				content() {
					"step 0";
					var target = trigger.target;
					event.target = target;
					if (player != target && target.countCards("h") > 0) player.viewHandcards(target);
					player
						.chooseControl("奇兵", "正兵")
						.set("prompt", "请选择" + get.translation(target) + "的标记")
						.set(
							"choice",
							(function () {
								var shas = target.getCards("h", "sha"),
									shans = target.getCards("h", "shan");
								var e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
								var e2 = 0;
								if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) e2 = -1;
								var es = target.getGainableCards(player, "e");
								if (es.length)
									e2 = Math.min(
										e2,
										(function () {
											var max = 0;
											for (var i of es) max = Math.max(max, get.value(i, target));
											return -max / 4;
										})()
									);
								if (get.attitude(player, target) > 0) {
									if (shas.length >= Math.max(1, shans.length)) return "奇兵";
									if (shans.length > shas.length) return "正兵";
									return e1 > e2 ? "奇兵" : "正兵";
								}
								if (shas.length) e1 = -0.5;
								if (shans.length) e2 = -0.7;
								if (Math.abs(e1 - e2) <= 0.3) return Math.random() < 0.5 ? "奇兵" : "正兵";
								var rand = Math.random();
								if (e1 < e2) return rand < 0.1 ? "奇兵" : "正兵";
								return rand < 0.1 ? "正兵" : "奇兵";
							})()
						)
						.set("ai", () => _status.event.choice);
					("step 1");
					var map = trigger.getParent().customArgs,
						id = target.playerid;
					if (!map[id]) map[id] = {};
					map[id].qizheng_name = result.control;
					map[id].qizheng_aibuff = get.attitude(player, target) > 0;
				},
			},
		},
	},
	taffyold_lingce: {
		audio: "lingce",
		init: player => {
			game.addGlobalSkill("taffyold_lingce_global");
		},
		trigger: { global: "useCard" },
		forced: true,
		filter(event, player) {
			return event.card.name == "qizhengxiangsheng" || get.zhinangs().includes(event.card.name) || player.getStorage("taffyold_dinghan").includes(event.card.name);
		},
		content() {
			player.draw();
		},
		subSkill: {
			global: {
				ai: {
					effect: {
						player_use(card, player, target) {
							let num = 0,
								nohave = true;
							game.countPlayer(i => {
								if (i.hasSkill("taffyold_lingce", null, null, false)) {
									nohave = false;
									if (i.isIn() && lib.skill.taffyold_lingce.filter({ card: card }, i)) num += get.sgnAttitude(player, i);
								}
							}, true);
							if (nohave) game.removeGlobalSkill("taffyold_lingce_global");
							else return [1, 0.8 * num];
						},
					},
				},
			},
		},
	},
	taffyold_dinghan: {
		audio: "dinghan",
		trigger: {
			target: "useCardToTarget",
			player: "addJudgeBefore",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (event.name == "useCardToTarget" && get.type(event.card, null, false) != "trick") return false;
			return !player.getStorage("taffyold_dinghan").includes(event.card.name);
		},
		content() {
			player.markAuto("taffyold_dinghan", [trigger.card.name]);
			if (trigger.name == "addJudge") {
				trigger.cancel();
				var owner = get.owner(trigger.card);
				if (owner && owner.getCards("hej").includes(trigger.card)) owner.lose(trigger.card, ui.discardPile);
				else game.cardsDiscard(trigger.card);
				game.log(trigger.card, "进入了弃牌堆");
			} else {
				trigger.targets.remove(player);
				trigger.getParent().triggeredTargets2.remove(player);
				trigger.untrigger();
			}
		},
		onremove: true,
		intro: { content: "已记录牌名：$" },
		group: "taffyold_dinghan_add",
		subSkill: {
			add: {
				trigger: { player: "phaseBegin" },
				direct: true,
				content() {
					"step 0";
					var dialog = [get.prompt("taffyold_dinghan")];
					(list1 = player.getStorage("taffyold_dinghan")),
						(list2 = lib.inpile.filter(function (i) {
							return get.type2(i, false) == "trick" && !list1.includes(i);
						}));
					if (list1.length) {
						dialog.push('<div class="text center">已记录</div>');
						dialog.push([list1, "vcard"]);
					}
					if (list2.length) {
						dialog.push('<div class="text center">未记录</div>');
						dialog.push([list2, "vcard"]);
					}
					player.chooseButton(dialog).set("ai", function (button) {
						var player = _status.event.player,
							name = button.link[2];
						if (player.getStorage("taffyold_dinghan").includes(name)) {
							return -get.effect(player, { name: name }, player, player);
						} else {
							return get.effect(player, { name: name }, player, player) * (1 + player.countCards("hs", name));
						}
					});
					("step 1");
					if (result.bool) {
						player.logSkill("taffyold_dinghan");
						var name = result.links[0][2];
						if (player.getStorage("taffyold_dinghan").includes(name)) {
							player.unmarkAuto("taffyold_dinghan", [name]);
							game.log(player, "从定汉记录中移除了", "#y" + get.translation(name));
						} else {
							player.markAuto("taffyold_dinghan", [name]);
							game.log(player, "向定汉记录中添加了", "#y" + get.translation(name));
						}
						game.delayx();
					}
				},
			},
		},
	},
	// 旧王经
	taffyold_mbjiejian: {
		audio: "mbjiejian",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter: function (event, player) {
			return player.countCards("h");
		},
		async cost(event, trigger, player) {
			if (_status.connectMode)
				game.broadcastAll(function () {
					_status.noclearcountdown = true;
				});
			const give_map = {};
			let used = [];
			do {
				const result = await player
					.chooseCardTarget({
						filterCard: function (card) {
							return get.itemtype(card) == "card" && !card.hasGaintag("taffyold_mbjiejian_tag");
						},
						filterTarget: lib.filter.notMe,
						selectCard: [1, Infinity],
						prompt: used.length ? "是否继续分配手牌？" : get.prompt("taffyold_mbjiejian"),
						prompt2: "请选择要分配的卡牌和目标",
						ai1: function (card) {
							if (!ui.selected.cards.length) return 8 - get.value(card);
							return 0;
						},
						ai2: function (target) {
							let player = _status.event.player,
								card = ui.selected.cards[0];
							let val = get.value(card),
								att = get.attitude(player, target);
							if (val <= 4) {
								if (get.event("used").includes(target)) return 0;
								return 1 / target.getUseValue(card);
							}
							return att * (target.getUseValue(card) + 4);
						},
					})
					.set("used", used)
					.forResult();
				if (result.bool && result.targets.length) {
					const id = result.targets[0].playerid,
						map = give_map;
					if (!map[id]) map[id] = [];
					map[id].addArray(result.cards);
					player.addGaintag(result.cards, "taffyold_mbjiejian_tag");
					used.addArray(result.targets);
				} else break;
			} while (player.countCards("h"));
			if (_status.connectMode) {
				game.broadcastAll(function () {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			const list = [],
				targets = [];
			for (const i in give_map) {
				const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
				player.line(source, "green");
				if (player !== source && (get.mode() !== "identity" || player.identity !== "nei")) player.addExpose(0.2);
				targets.push(source);
				list.push([source, give_map[i]]);
			}
			event.result = {
				bool: list.length > 0,
				targets: targets,
				cost_data: list,
			};
		},
		logAudio: () => "mbjiejian1.mp3",
		async content(event, trigger, player) {
			const list = event.cost_data;
			await game
				.loseAsync({
					gain_list: list,
					player: player,
					cards: list.map(i => i[1]).flat(),
					giver: player,
					animate: "giveAuto",
				})
				.setContent("gaincardMultiple");
			for (let target of event.targets) {
				let num = target.hp - target.countMark("taffyold_mbjiejian_mark");
				target.addMark("taffyold_mbjiejian_mark", num, false);
			}
		},
		group: ["taffyold_mbjiejian_liuli", "taffyold_mbjiejian_remove"],
		subSkill: {
			liuli: {
				audio: "mbjiejian2.mp3",
				trigger: {
					global: "useCardToTarget",
				},
				filter: function (event, player) {
					if (get.type(event.card) == "equip") return false;
					if (!event.targets || event.targets.length != 1) return false;
					if (!event.targets[0].hasMark("taffyold_mbjiejian_mark")) return false;
					return true;
				},
				prompt2: "将此牌转移给自己",
				check: function (event, player) {
					return get.effect(player, event.card, event.player, player) >= get.effect(event.targets[0], event.card, event.player, player);
				},
				logTarget: "target",
				async content(event, trigger, player) {
					const evt = trigger.getParent();
					evt.triggeredTargets2.removeArray(event.targets);
					evt.targets.removeArray(event.targets);
					if (lib.filter.targetEnabled2(trigger.card, trigger.player, player)) evt.targets.push(player);
					await player.draw();
				},
			},
			remove: {
				audio: "mbjiejian3.mp3",
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				filter: function (event, player) {
					return event.player.hasMark("taffyold_mbjiejian_mark");
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const target = event.targets[0],
						num = target.countMark("taffyold_mbjiejian_mark");
					target.removeMark("taffyold_mbjiejian_mark", num, false);
					if (target.hp >= num) await player.draw(2);
				},
			},
			mark: {
				intro: {
					content: "获得“节谏”时的体力值：$",
				},
			},
		},
	},
	//星董卓
	taffyold_xiongjin: {
		mark: true,
		marktext: "☯",
		zhuanhuanji: true,
		intro: {
			content(storage) {
				if (!storage) return "出牌阶段开始时，你可以摸X张牌，然后本回合的弃牌阶段开始时，你弃置所有非基本牌（X为你已损失的体力值，至少为1，至多为3）";
				return "其他角色的出牌阶段开始时，你可以令其摸X张牌，然后本回合的弃牌阶段开始时，其弃置所有基本牌（X为你已损失的体力值，至少为1，至多为3）";
			},
		},
		audio: "xiongjin",
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return (event.player !== player) === Boolean(player.storage.taffyold_xiongjin);
		},
		logTarget: "player",
		prompt2(event, player) {
			const goon = event.player === player;
			return (goon ? "" : "令其") + "摸" + get.cnNumber(Math.min(3, Math.max(1, player.getDamagedHp()))) + "张牌，本回合的弃牌阶段开始时，" + (goon ? "弃置所有非基本牌" : "其弃置所有基本牌");
		},
		content() {
			player.changeZhuanhuanji("taffyold_xiongjin");
			const target = trigger.player;
			target.addTempSkill("taffyold_xiongjin_effect");
			target.markAuto("taffyold_xiongjin_effect", [target === player ? "nobasic" : "basic"]);
			target.draw(Math.min(3, Math.max(1, player.getDamagedHp())));
		},
		subSkill: {
			effect: {
				charlotte: true,
				mark: true,
				intro: {
					markcount: () => 0,
					content(storage) {
						if (storage.length > 1) return "弃牌阶段开始时，弃置所有牌";
						return "弃牌阶段开始时，弃置所有" + (storage[0] === "basic" ? "基本" : "非基本") + "牌";
					},
				},
				trigger: { player: "phaseDiscardBegin" },
				forced: true,
				popup: false,
				content() {
					const storage = player.getStorage("taffyold_xiongjin_effect");
					const cards = player.getCards("he", card => {
						if (!lib.filter.cardDiscardable(card, player)) return false;
						const type = get.type(card);
						return (type === "basic" && storage.includes("basic")) || (type !== "basic" && storage.includes("nobasic"));
					});
					if (cards.length) player.discard(cards);
				},
			},
		},
	},
	taffyold_xiawei: {
		audio: "xiawei",
		trigger: { global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter"] },
		filter(event, player) {
			if (event.name.indexOf("lose") === 0) {
				if (event.getlx === false || event.position !== ui.discardPile) return false;
			} else if (event.getParent()?.relatedEvent?.name == "useCard") return false;
			return event.cards.some(card => !player.getStorage("taffyold_xiawei").includes(get.suit(card, false)));
		},
		forced: true,
		async content(event, trigger, player) {
			player.markAuto(
				"taffyold_xiawei",
				trigger.cards.reduce((list, card) => list.add(get.suit(card, false)), [])
			);
			player.storage.taffyold_xiawei.sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
			player.addTip("taffyold_xiawei", get.translation("taffyold_xiawei") + player.getStorage("taffyold_xiawei").reduce((str, suit) => str + get.translation(suit), ""));
			if (player.getStorage("taffyold_xiawei").length >= 4 && player.maxHp < 9) {
				delete player.storage.taffyold_xiawei;
				player.unmarkSkill("taffyold_xiawei");
				player.removeTip("taffyold_xiawei");
				await player.gainMaxHp();
				await player.draw();
			}
		},
		intro: { content: "已记录花色$" },
		mod: { maxHandcardBase: player => player.maxHp },
		onremove: (player, skill) => player.removeTip(skill),
	},
	taffyold_baoxi: {
		audio: "baoxi",
		trigger: { global: ["loseEnd", "cardsDiscardEnd", "loseAsyncEnd"] },
		filter(event, player) {
			if (player.getStorage("taffyold_baoxi_used").includes("juedou")) return false;
			if (event.name.indexOf("lose") === 0 && (event.getlx === false || event.position !== ui.discardPile)) return false;
			return event.cards.filter(card => get.type(card) === "basic").length > 1 && player.hasUseTarget(new lib.element.VCard({ name: "juedou" }));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt("taffyold_baoxi"), "减1点体力上限，视为对一名角色使用【决斗】", (card, player, target) => {
					return player.canUse(new lib.element.VCard({ name: "juedou" }), target);
				})
				.set("ai", target => {
					const player = get.player();
					if (player.maxHp === 1) return 0;
					return get.effect(target, new lib.element.VCard({ name: "juedou" }), player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.addTempSkill("taffyold_baoxi_used");
			player.markAuto("taffyold_baoxi_used", ["juedou"]);
			await player.loseMaxHp();
			await player.useCard(new lib.element.VCard({ name: "juedou" }), event.targets[0], false);
		},
		group: "taffyold_baoxi_sha",
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			sha: {
				audio: "baoxi",
				trigger: { global: ["loseEnd", "cardsDiscardEnd", "loseAsyncEnd"] },
				filter(event, player) {
					if (player.getStorage("taffyold_baoxi_used").includes("sha")) return false;
					if (event.name.indexOf("lose") === 0 && (event.getlx === false || event.position !== ui.discardPile)) return false;
					return event.cards.filter(card => get.type(card) !== "basic").length > 1 && player.hasUseTarget(new lib.element.VCard({ name: "sha" }));
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt("taffyold_baoxi"), "减1点体力上限，视为对一名角色使用【杀】", (card, player, target) => {
							return player.canUse(new lib.element.VCard({ name: "sha" }), target);
						})
						.set("ai", target => {
							const player = get.player();
							if (player.maxHp === 1) return 0;
							return get.effect(target, new lib.element.VCard({ name: "sha" }), player, player);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					player.addTempSkill("taffyold_baoxi_used");
					player.markAuto("taffyold_baoxi_used", ["sha"]);
					await player.loseMaxHp();
					await player.useCard(new lib.element.VCard({ name: "sha" }), event.targets[0], false);
				},
			},
		},
	},
	//旧势太史慈 --- by 刘巴
	taffyold_potzhanlie: {
		audio: "potzhanlie",
		trigger: { global: "phaseBegin" },
		forced: true,
		locked: false,
		logAudio: () => 2,
		content() {
			const effectMap = new Map([
				["hp", player.getHp()],
				["damagedHp", player.getDamagedHp()],
				["countplayer", game.countPlayer()],
			]);
			const num = effectMap.get(player.storage.taffyold_potzhanlie) || player.getAttackRange();
			player.addTempSkill("taffyold_potzhanlie_addMark");
			if (num > 0) player.addMark("taffyold_potzhanlie_addMark", num, false);
		},
		get limit() {
			return 8;
		},
		group: "taffyold_potzhanlie_lie",
		subSkill: {
			addMark: {
				charlotte: true,
				onremove: true,
				audio: "potzhanlie3.mp3",
				trigger: {
					global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter"],
				},
				getIndex(event, player) {
					return Math.min(
						event.getd().filter(i => i.name === "sha").length,
						get.info("taffyold_potzhanlie").limit - player.countMark("taffyold_potzhanlie_lie"),
						Math.max(
							player.countMark("taffyold_potzhanlie_addMark") -
								game
									.getGlobalHistory(
										"everything",
										evt => {
											if (evt === event) return false;
											return ["lose", "loseAsync", "cardsDiscard"].includes(evt.name) && evt.getd().some(i => i.name === "sha");
										},
										event
									)
									.reduce((sum, evt) => sum + evt.getd().filter(i => i.name === "sha").length, 0),
							0
						)
					);
				},
				forced: true,
				content() {
					player.addMark("taffyold_potzhanlie_lie", 1);
				},
				intro: {
					content: "本回合前#张【杀】进入弃牌堆后，获得等量“烈”标记",
				},
			},
			lie: {
				trigger: { player: "phaseUseEnd" },
				filter: (event, player) => player.hasUseTarget(new lib.element.VCard({ name: "sha" }), false),
				direct: true,
				content() {
					const str = player.hasMark("taffyold_potzhanlie_lie") ? "移去所有“烈”，" : "";
					player.chooseUseTarget("###" + get.prompt("taffyold_potzhanlie") + '###<div class="text center">' + str + "视为使用一张无次数限制的【杀】</div>", new lib.element.VCard({ name: "sha" }), false).set("oncard", () => {
						const event = get.event(),
							{ player } = event,
							num = player.countMark("taffyold_potzhanlie_lie");
						player.addTempSkill("taffyold_potzhanlie_buff");
						player.clearMark("taffyold_potzhanlie_lie");
						event.set("taffyold_potzhanlie", Math.floor(num / 2));
					}).logSkill = "taffyold_potzhanlie";
				},
				marktext: "烈",
				intro: {
					name: "烈",
					content: "mark",
				},
			},
			buff: {
				charlotte: true,
				trigger: { player: "useCard1" },
				filter: event => event?.taffyold_potzhanlie,
				forced: true,
				locked: false,
				popup: false,
				async content(event, trigger, player) {
					const num = trigger.taffyold_potzhanlie,
						str = get.translation(trigger.card);
					const result = await player
						.chooseButton([
							"战烈：是否选择至多" + get.cnNumber(num) + "项执行？",
							[
								[
									["目标+1", "令" + str + "可以额外指定一个目标"],
									["伤害+1", "令" + str + "基础伤害值+1"],
									["弃牌响应", "令" + str + "需额外弃置一张牌方可响应"],
									["摸牌", str + "结算完毕后，你摸两张牌"],
								],
								"textbutton",
							],
						])
						.set("selectButton", [1, num])
						.set("ai", button => {
							const player = get.player(),
								trigger = get.event().getTrigger(),
								choice = button.link;
							switch (choice) {
								case "目标+1":
									return Math.max(
										...game
											.filterPlayer(target => {
												return !trigger.targets?.includes(target) && lib.filter.targetEnabled2(trigger.card, player, target) && lib.filter.targetInRange(trigger.card, player, target);
											})
											.map(target => get.effect(target, trigger.card, player, player))
									);
								case "伤害+1":
									return (trigger.targets || []).reduce((sum, target) => {
										const effect = get.damageEffect(target, player, player);
										return (
											sum +
											effect *
												(target.hasSkillTag("filterDamage", null, {
													player: player,
													card: trigger.card,
												})
													? 1
													: 1 + (trigger.baseDamage || 1) + (trigger.extraDamage || 0))
										);
									}, 0);
								case "弃牌响应":
									return (trigger.targets || []).reduce((sum, target) => {
										const card = get.copy(trigger.card);
										game.setNature(card, "stab");
										return sum + get.effect(target, card, player, player);
									}, 0);
								case "摸牌":
									return get.effect(player, { name: "draw" }, player, player) * 2;
							}
						})
						.forResult();
					if (result.bool) {
						const choices = result.links;
						game.log(player, "选择了", "#g【战烈】", "的", "#y" + choices);
						for (const choice of choices) {
							player.popup(choice);
							switch (choice) {
								case "目标+1":
									player
										.when("useCard2")
										.filter(evt => evt === trigger)
										.then(() => {
											player
												.chooseTarget("是否为" + get.translation(trigger.card) + "增加一个目标？", (card, player, target) => {
													const evt = get.event().getTrigger();
													return !evt.targets.includes(target) && lib.filter.targetEnabled2(evt.card, player, target) && lib.filter.targetInRange(evt.card, player, target);
												})
												.set("ai", target => {
													const player = get.player(),
														evt = get.event().getTrigger();
													return get.effect(target, evt.card, player);
												});
										})
										.then(() => {
											if (result?.bool && result.targets?.length) {
												const [target] = result.targets;
												player.line(target, trigger.card.nature);
												trigger.targets.add(target);
												game.log(target, "成为了", trigger.card, "的额外目标");
											}
										});
									break;
								case "伤害+1":
									trigger.baseDamage++;
									game.log(trigger.card, "造成的伤害", "#y+1");
									break;
								case "弃牌响应":
									player.addTempSkill("taffyold_potzhanlie_guanshi");
									player.markAuto("taffyold_potzhanlie_guanshi", [trigger.card]);
									break;
								case "摸牌":
									player
										.when("useCardAfter")
										.filter(evt => evt === trigger)
										.then(() => player.draw(2));
									break;
							}
						}
					}
				},
			},
			guanshi: {
				charlotte: true,
				onremove: true,
				audio: "potzhanlie",
				trigger: { player: "useCardToBegin" },
				filter(event, player) {
					if (!event.target?.isIn()) return false;
					return !event.getParent().directHit.includes(event.target) && player.getStorage("taffyold_potzhanlie_guanshi").includes(event.card);
				},
				forced: true,
				logTarget: "target",
				async content(event, trigger, player) {
					const { target } = trigger;
					const { result } = await target.chooseToDiscard("战烈：弃置一张牌，否则不可响应" + get.translation(trigger.card)).set("ai", card => {
						const player = get.player(),
							trigger = get.event().getTrigger();
						if (get.effect(player, trigger.card, trigger.player, player) >= 0) return 0;
						const num = player.countCards("hs", { name: "shan" });
						if (num === 0) return 0;
						if (card.name === "shan" && num <= 1) return 0;
						return 8 - get.value(card);
					});
					if (!result?.bool) {
						trigger.set("directHit", true);
						game.log(target, "不可响应", trigger.card);
					}
				},
			},
		},
	},
	taffyold_pothanzhan: {
		audio: "pothanzhan",
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.targets[0];
			for (const drawer of [player, target]) {
				const num = (() => {
					return (
						({
							hp: drawer.getHp(),
							damagedHp: drawer.getDamagedHp(),
							countplayer: game.countPlayer(),
						}[player.storage.taffyold_pothanzhan] ?? drawer.maxHp) - drawer.countCards("h")
					);
				})();
				if (num > 0) await drawer.draw(Math.min(num, 5));
			}
			const juedou = new lib.element.VCard({ name: "juedou" });
			if (player.canUse(juedou, target)) await player.useCard(juedou, target, false);
		},
		ai: {
			order(item, player) {
				if ((player.countCards("h", { name: "sha" }) || player.maxHp - player.countCards("h")) > 1) return 10;
				return 1;
			},
			result: {
				target(player, target) {
					return (
						get.effect(target, new lib.element.VCard({ name: "juedou" }), player, player) -
						Math.max(
							0,
							Math.min(
								5,
								(() => {
									return (
										({
											hp: target.getHp(),
											damagedHp: target.getDamagedHp(),
											countplayer: game.countPlayer(),
										}[player.storage.taffyold_pothanzhan] ?? target.maxHp) - target.countCards("h")
									);
								})()
							)
						) *
							get.effect(target, { name: "draw" }, player, player)
					);
				},
			},
		},
	},
	taffyold_potzhenfeng: {
		limited: true,
		audio: "potzhenfeng",
		enable: "phaseUse",
		filter(event, player) {
			return player.isDamaged() || ["taffyold_pothanzhan", "taffyold_potzhanlie"].some(skill => player.hasSkill(skill, null, null, false));
		},
		skillAnimation: true,
		animationColor: "metal",
		logAudio: index => (typeof index === "number" ? "potzhenfeng" + index + ".mp3" : 2),
		chooseButton: {
			dialog(event, player) {
				const dialog = ui.create.dialog("振锋：你可以选择一项", "hidden");
				dialog.add([
					[
						["recover", "回复2点体力"],
						["cover", "修改〖酣战〗和〖战烈〗描述中的“X”值"],
					],
					"textbutton",
				]);
				return dialog;
			},
			filter(button, player) {
				switch (button.link) {
					case "recover":
						return player.isDamaged();
					case "cover":
						return ["taffyold_pothanzhan", "taffyold_potzhanlie"].some(skill => player.hasSkill(skill, null, null, false));
				}
			},
			check(button) {
				const player = get.player();
				if (button.link == "recover") return player.getHp() + player.countCards("h", { name: "tao" }) < 2;
				if (button.link == "cover") {
					let numbers = [player.getHp(), player.getDamagedHp(), game.countPlayer()];
					if (numbers.some(c => c > player.getAttackRange())) return Math.max(...numbers) * 2;
				}
				return 0.1;
			},
			backup(links) {
				return {
					item: links[0],
					skillAnimation: true,
					animationColor: "metal",
					log: false,
					async content(event, trigger, player) {
						player.awakenSkill("taffyold_potzhenfeng");
						if (get.info(event.name).item === "recover") {
							player.logSkill("taffyold_potzhenfeng", null, null, null, [null]);
							player.changeSkin({ characterName: "taffyold_pot_taishici" }, "pot_taishici_shadow1");
							await player.recover(2);
						} else {
							let dialog = [],
								skills = ["taffyold_pothanzhan", "taffyold_potzhanlie"].filter(skill => player.hasSkill(skill, null, null, false)),
								list = [
									["hp", "当前体力值"],
									["damagedHp", "当前已损失体力值"],
									["countplayer", "场上存活角色数"],
								];
							dialog.push("振锋：修改" + skills.map(skill => "〖" + get.translation(skill) + "〗").join("和") + "描述中的“X”为...");
							for (const skill of skills) {
								dialog.push('<div class="text center">' + get.translation(skill) + "</div>");
								dialog.push([list.map(item => [item[0] + "|" + skill, item[1]]), "tdnodes"]);
							}
							const result = await player
								.chooseButton(dialog, [1, Math.min(2, skills.length)], true)
								.set("filterButton", button => {
									return !ui.selected.buttons.some(but => but.link.split("|")[1] === button.link.split("|")[1]);
								})
								.set("ai", button => {
									const player = get.player();
									switch (button.link.split("|")[0]) {
										case "hp":
											return player.getHp();
										case "damagedHp":
											return player.getDamagedHp();
										case "countplayer":
											return game.countPlayer();
									}
								})
								.forResult();
							if (result?.bool && result.links?.length) {
								player.logSkill("taffyold_potzhenfeng", null, null, null, [get.rand(3, 4)]);
								let changeList = [];
								for (const link of result.links) {
									const [change, skill] = link.split("|");
									if (skill == "taffyold_pothanzhan") changeList.push(change);
									player.storage[skill] = change;
									player.popup(skill);
									game.log(player, "修改", "#g【" + get.translation(skill) + "】", "的", "#yX", "为", "#g" + list.find(item => item[0] === change)[1]);
								}
								if (changeList[0]) {
									switch (changeList[0]) {
										case "hp":
											player.changeSkin({ characterName: "taffyold_pot_taishici" }, "pot_taishici_shadow2");
											break;
										case "damagedHp":
											player.changeSkin({ characterName: "taffyold_pot_taishici" }, "pot_taishici_shadow3");
											break;
										case "countplayer":
											player.changeSkin({ characterName: "taffyold_pot_taishici" }, "pot_taishici_shadow4");
									}
								} else {
									player.changeSkin({ characterName: "taffyold_pot_taishici" }, "pot_taishici_shadow1");
								}
							}
						}
					},
				};
			},
			prompt(links) {
				return `点击“确定”，${links[0] === "recover" ? "回复2点体力" : "修改〖酣战〗和〖战烈〗描述中的“X”值"}`;
			},
		},
		subSkill: {
			backup: {},
		},
		ai: {
			order: 15,
			threaten: 2,
			result: {
				player(player) {
					if ([player.getHp(), player.getDamagedHp(), game.countPlayer()].some(c => c > player.getAttackRange())) return 10;
					return get.recoverEffect(player, player, player);
				},
			},
		},
	},
	//势陈到
	taffyold_potwanglie: {
		audio: "potwanglie",
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.countCards("h");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2("taffyold_potwanglie"), "h")
				.set("ai", card => {
					const player = get.player();
					if (player.hasValueTarget(card, true)) {
						return player.getUseValue(card, false, true) * (get.tag(card, "damage") > 0.5 ? 2 : 1);
					}
					return 0.1 + Math.random();
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const card = event.cards[0];
			player.addGaintag(card, "taffyold_potwanglie");
			player.addTempSkill(event.name + "_effect", "phaseUseAfter");
			await game.delayx();
		},
		locked: false,
		mod: {
			aiOrder(player, card, num) {
				if (!player.isPhaseUsing() || typeof card !== "object" || num <= 0) return;
				if (get.itemtype(card) == "card" && card.hasGaintag("taffyold_potwanglie")) num / 20;
				return num;
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove(player) {
					player.removeGaintag("taffyold_potwanglie");
				},
				mod: {
					targetInRange(card, player, target) {
						if (card.cards?.some(cardx => cardx.hasGaintag("taffyold_potwanglie"))) return true;
					},
				},
				audio: "potwanglie",
				trigger: { player: ["useCard", "useCardAfter"] },
				filter(event, player) {
					return player.hasHistory("lose", evt => {
						if (event !== evt.getParent()) return false;
						return Object.values(evt.gaintag_map).flat().includes("taffyold_potwanglie");
					});
				},
				silent: true,
				content() {
					if (event.triggername == "useCard") {
						player.logSkill(event.name);
						trigger.directHit.addArray(game.players);
						game.log(trigger.card, "不可被响应");
					} else {
						player.addTempSkill("taffyold_potwanglie_debuff", "phaseUseAfter");
					}
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (arg?.card?.cards?.some(card => card.hasGaintag("taffyold_potwanglie"))) return true;
					},
				},
			},
			debuff: {
				mark: true,
				charlotte: true,
				intro: { content: "本阶段不能对其他角色使用牌" },
				mod: {
					playerEnabled(card, player, target) {
						if (player !== target) return false;
					},
				},
			},
		},
	},
	taffyold_pothongyi: {
		audio: "pothongyi",
		locked: true,
		popup: false,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.hasMark("taffyold_pothongyi");
		},
		//提前若为
		maxMark() {
			//if (get.mode() == "doudizhu") return 1;
			return 4;
		},
		logAudio: index => (typeof index === "number" ? "pothongyi" + index + ".mp3" : 2),
		async cost(event, trigger, player) {
			const num = player.countMark("taffyold_pothongyi");
			let list = [`摸${get.cnNumber(num)}张牌`, `移去所有“毅”标记，视为使用${get.cnNumber(num)}张【杀】`];
			const result = await player
				.chooseControl()
				.set("prompt", get.translation(event.skill) + "：请选择一项执行")
				.set("choiceList", list)
				.set("num", num)
				.set("ai", () => {
					const { player, num } = get.event();
					const card = new lib.element.VCard({ name: "sha", isCard: true });
					if (num < get.info("taffyold_pothongyi").maxMark() || !player.hasValueTarget(card)) return 0;
					return 1;
				})
				.forResult();
			event.result = { bool: true, cost_data: result.index };
		},
		async content(event, trigger, player) {
			player.logSkill("taffyold_pothongyi", null, null, null, [get.rand(1, 2)]);
			const control = event.cost_data;
			const num = player.countMark("taffyold_pothongyi");
			if (!num) return;
			if (control === 0) {
				await player.draw(num);
			} else if (control === 1) {
				player.clearMark("taffyold_pothongyi");
				for (let i = 0; i < num; i++) {
					const card = new lib.element.VCard({ name: "sha", isCard: true });
					if (player.hasUseTarget(card)) await player.chooseUseTarget(card, true, false).set("prompt2", `还可以再使用${num - i}张`);
					else break;
				}
			}
		},
		marktext: "毅",
		intro: {
			name2: "毅",
			content: "mark",
		},
		group: "taffyold_pothongyi_mark",
		subSkill: {
			mark: {
				audio: ["pothongyi3.mp3", "pothongyi4.mp3"],
				trigger: {
					global: "phaseBefore",
					source: "damageSource",
					player: ["enterGame", "damageEnd"],
				},
				getIndex: event => (event.name === "damage" ? event.num : 1),
				filter(event, player) {
					if (player.countMark("taffyold_pothongyi") >= get.info("taffyold_pothongyi").maxMark()) return false;
					return event.name != "phase" || game.phaseNumber == 0;
				},
				forced: true,
				async content(event, trigger, player) {
					const num = get.info("taffyold_pothongyi").maxMark() - player.countMark("taffyold_pothongyi");
					player.addMark("taffyold_pothongyi", Math.min(trigger.name === "damage" ? 1 : 2, num));
				},
			},
		},
	},
	//旧势魏延
	taffyold_potzhongao: {
		audio: "potzhongao",
		dutySkill: true,
		derivation: ["potkuanggu", "potkuanggu_pot_weiyan_achieve", "kunfen"],
		group: ["taffyold_potzhongao_start", "taffyold_potzhongao_achieve", "taffyold_potzhongao_fail"],
		subSkill: {
			start: {
				audio: "potzhongao1.mp3",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					await player.addSkills("potkuanggu");
				},
			},
			achieve: {
				audio: ["potzhongao2.mp3", "potzhongao3.mp3"],
				trigger: {
					source: "dieAfter",
				},
				forced: true,
				locked: false,
				skillAnimation: true,
				animationColor: "fire",
				async content(event, trigger, player) {
					player.awakenSkill(event.name.slice(0, -8));
					game.log(player, "成功完成使命");
					player.changeSkin("taffyold_potzhongao", "pot_weiyan_achieve");
					player.setStorage("potkuanggu", 1);
					const num = player.countMark("taffyold_potzhuangshi_limit") + player.countMark("taffyold_potzhuangshi_directHit");
					if (num > 0) {
						if (!player.isDamaged()) {
							await player.draw(num);
						} else {
							await player.recover(num);
						}
						await player.draw(num);
					}
				},
			},
			fail: {
				audio: ["potzhongao4.mp3", "potzhongao5.mp3"],
				trigger: {
					player: ["dying", "phaseUseBegin"],
				},
				filter(event, player) {
					return event.name == "dying" || !event.usedZhuangshi;
				},
				lastDo: true,
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.awakenSkill(event.name.slice(0, -5));
					game.log(player, "使命失败");
					player.changeSkin("taffyold_potzhongao", "pot_weiyan_fail");
					await player.changeSkills(["kunfen"], ["taffyold_potzhuangshi"]);
					await player.recover();
					await player.draw(2);
				},
			},
		},
	},
	taffyold_potzhuangshi: {
		audio: "potzhuangshi",
		audioname: ["pot_weiyan_achieve"],
		trigger: {
			player: "phaseUseBegin",
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseButton(
					[
						get.prompt(event.skill),
						[
							[
								["losehp", "失去任意点体力，令你此阶段使用的前等量张牌不计入次数限制"],
								["discard", "弃置任意张手牌，令你此阶段使用的前等量张牌无距离限制且不可被响应"],
							],
							"textbutton",
						],
					],
					[1, 2]
				)
				.set("filterButton", button => {
					const player = get.player();
					if (button.link == "discard") {
						return player.countCards("h");
					}
					return true;
				})
				.set("ai", button => {
					const player = get.player(),
						num = Math.floor(player.countCards("h") / 2);
					if (button.link == "discard") {
						return num;
					}
					return player.hp > 1;
				})
				.forResult();
			event.result = {
				bool: true,
				cost_data: result.bool ? result.links : "nouse",
			};
		},
		async content(event, trigger, player) {
			const select = event.cost_data;
			if (select == "nouse") {
				await player.gainMaxHp();
				await player.recover();
			} else {
				if (select.includes("losehp")) {
					const { result } = await player
						.chooseNumbers(
							get.translation(event.name),
							[
								{
									prompt: "失去任意点体力值，令你此阶段使用的前等量张牌不计入次数限制",
									min: 1,
									max: player.getHp(),
								},
							],
							true
						)
						.set("processAI", () => {
							const player = get.player();
							let num = Math.floor(player.countCards("h") / 2);
							return [num];
						});
					if (typeof result?.numbers?.[0] != "number") {
						return;
					}
					const number = result.numbers[0];
					await player.loseHp(number);
					player.addTempSkill("taffyold_potzhuangshi_limit", "phaseChange");
					player.addMark("taffyold_potzhuangshi_limit", number, false);
					player.addTip("taffyold_potzhuangshi_limit", `不计次数 ${number}`);
				}
				if (select.includes("discard")) {
					const { result } = await player
						.chooseToDiscard(get.translation(event.name), [1, Infinity], "h", true)
						.set("prompt2", "弃置任意张手牌，令你此阶段使用的前等量张牌无距离限制且不可被响应")
						.set("ai", card => {
							const player = get.player();
							let num = Math.floor(player.countCards("h") / 2);
							if (ui.selected.cards.length < num) {
								return 7 - get.value(card);
							}
							return 0;
						});
					if (!result?.cards?.length) {
						return;
					}
					const number = result.cards.length;
					player.addTempSkill("taffyold_potzhuangshi_directHit", "phaseChange");
					player.addMark("taffyold_potzhuangshi_directHit", number, false);
					player.addTip("taffyold_potzhuangshi_directHit", `不可响应 ${number}`);
				}
				trigger.set("usedZhuangshi", true);
			}
		},
		subSkill: {
			limit: {
				trigger: {
					player: "useCard0",
				},
				charlotte: true,
				filter(event, player) {
					return player.hasMark("taffyold_potzhuangshi_limit");
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						player.getStat("card")[trigger.card.name]--;
					}
					player.removeMark("taffyold_potzhuangshi_limit", 1, false);
					const num = player.countMark("taffyold_potzhuangshi_limit");
					if (num > 0) {
						player.addTip("taffyold_potzhuangshi_limit", `不计次数 ${num}`);
					} else {
						player.removeTip("taffyold_potzhuangshi_limit");
					}
				},
				onremove(player, skill) {
					player.clearMark(skill, false);
					player.removeTip(skill);
				},
			},
			directHit: {
				trigger: {
					player: "useCard0",
				},
				charlotte: true,
				filter(event, player) {
					return player.hasMark("taffyold_potzhuangshi_directHit");
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.players);
					player.removeMark("taffyold_potzhuangshi_directHit", 1, false);
					const num = player.countMark("taffyold_potzhuangshi_directHit");
					if (num > 0) {
						player.addTip("taffyold_potzhuangshi_directHit", `不可响应 ${num}`);
					} else {
						player.removeTip("taffyold_potzhuangshi_directHit");
					}
				},
				onremove(player, skill) {
					player.clearMark(skill, false);
					player.removeTip(skill);
				},
				mod: {
					targetInRange(card, player) {
						if (player.hasMark("taffyold_potzhuangshi_directHit")) {
							return true;
						}
					},
				},
			},
		},
	},
	taffyold_potyinzhan: {
		audio: "potyinzhan",
		audioname: ["pot_weiyan_achieve", "pot_weiyan_fail"],
		trigger: {
			source: "damageBegin1",
		},
		forced: true,
		filter(event, player) {
			if (event.card?.name != "sha") {
				return false;
			}
			const target = event.player;
			if (player.hp <= target.hp || player.countCards("h") <= target.countCards("h")) {
				return true;
			}
			return false;
		},
		logTarget: "player",
		popup: false,
		logAudio: (player, indexedData) => "potyinzhan" + (lib.skill.potyinzhan.audioname.includes(player.skin.name) ? "_" + player.skin.name : "") + (indexedData ? indexedData : get.rand(1, 2)) + ".mp3",
		async content(event, trigger, player) {
			const target = trigger.player,
				bool1 = target.hp >= player.hp,
				bool2 = target.countCards("h") >= player.countCards("h");
			player.logSkill("taffyold_potyinzhan", null, null, null, [player, bool1 && bool2 ? 3 : get.rand(1, 2)]);
			if (bool1) {
				trigger.num++;
			}
			if (bool2) {
				if (bool1) {
					player.popup("乘势", "fire");
					await player.recover();
				}
				player
					.when("useCardAfter")
					.filter(evt => evt == trigger.getParent(2))
					.step(async (event, trigger, player) => {
						if (target.isIn() && target.countCards("he")) {
							const {
								result: { cards },
							} = await player.discardPlayerCard(target, "he", true);
							if (bool1) {
								await player.gain(cards.filterInD("od"), "gain2");
							}
						}
					});
			}
		},
	},
	//旧势于吉
	taffyold_potdaozhuan: {
		audio: "potdaozhuan",
		enable: "chooseToUse",
		filter(event, player) {
			if (event.taffyold_potdaozhuan) return false;
			let num = game
				.getGlobalHistory("useCard")
				.map(evt => get.type2(evt.card))
				.unique().length;
			num -= player.countCards("he");
			if (_status.currentPhase?.isIn() && _status.currentPhase !== player) num -= _status.currentPhase.countCards("he");
			if (num > 0) return false;
			return get
				.inpileVCardList(info => {
					const name = info[2];
					if (get.type(name) !== "basic") return false;
					return !player.getStorage("taffyold_potdaozhuan_used").includes(name);
				})
				.some(card => event.filterCard(new lib.element.VCard({ name: card[2], nature: card[3] }), player, event));
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("道转", [get.inpileVCardList(info => get.type(info[2]) === "basic"), "vcard"]);
			},
			filter(button, player) {
				const event = get.event().getParent();
				if (player.getStorage("taffyold_potdaozhuan_used").includes(button.link[2])) return false;
				return event.filterCard(new lib.element.VCard({ name: button.link[2], nature: button.link[3] }), player, event);
			},
			check(button) {
				const event = get.event().getParent();
				if (event.type !== "phase") return 1;
				return get.player().getUseValue(new lib.element.VCard({ name: button.link[2], nature: button.link[3] }));
			},
			prompt(links, player) {
				const num = game
					.getGlobalHistory("useCard")
					.map(evt => get.type2(evt.card))
					.unique().length;
				let prompt = "";
				if (num > 0) {
					prompt += "将你";
					if (_status.currentPhase?.isIn() && _status.currentPhase !== player) prompt += "与" + get.translation(_status.currentPhase);
					prompt += "的共计" + get.cnNumber(num) + "张牌置入弃牌堆，";
				}
				return '###道转###<div class="text center">' + prompt + "视为使用" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】</div>";
			},
			backup(links) {
				return {
					filterCard: () => false,
					selectCard: -1,
					viewAs: { name: links[0][2], nature: links[0][3] },
					log: false,
					async precontent(event, trigger, player) {
						const num = game
							.getGlobalHistory("useCard")
							.map(evt => get.type2(evt.card))
							.unique().length;
						let result;
						if (num === 0) result = { bool: true };
						else {
							const goon = _status.currentPhase?.isIn() && _status.currentPhase !== player;
							let prompt = "将你";
							if (goon) prompt += "与" + get.translation(_status.currentPhase);
							prompt += "的共计" + get.cnNumber(num) + "张牌置入弃牌堆";
							let dialog = ["道转：" + prompt];
							if (player.countCards("h")) {
								dialog.push('<div class="text center">你的手牌</div>');
								dialog.push(player.getCards("h"));
							}
							if (player.countCards("e")) {
								dialog.push('<div class="text center">你的装备牌</div>');
								dialog.push(player.getCards("e"));
							}
							if (goon) {
								const target = _status.currentPhase;
								if (target.countCards("h")) {
									const cards = target.getCards("h");
									dialog.push('<div class="text center">' + get.translation(target) + "的手牌</div>");
									if (player.hasSkillTag("viewHandcard", null, target, true)) dialog.push(cards);
									else dialog.push([cards.slice().randomSort(), "blank"]);
								}
								if (target.countCards("e")) {
									dialog.push('<div class="text center">' + get.translation(target) + "的装备牌</div>");
									dialog.push(target.getCards("e"));
								}
							}
							result = await player
								.chooseButton(dialog, num, true)
								.set("ai", button => {
									const player = get.player(),
										source = get.owner(button.link);
									return get.value(button.link, get.owner(source)) * Math.sign(-get.attitude(player, source));
								})
								.forResult();
						}
						if (result?.bool) {
							player.logSkill("taffyold_potdaozhuan");
							player.addTempSkill("taffyold_potdaozhuan_used", "roundStart");
							player.markAuto("taffyold_potdaozhuan_used", [event.result.card.name]);
							if (result.links?.length) {
								const target = _status.currentPhase;
								const owners = result.links.map(i => get.owner(i)).unique();
								if (owners.length > 1) {
									const cards = [player.getCards("he", i => result.links.includes(i)), target.getCards("he", i => result.links.includes(i))];
									await game
										.loseAsync({
											lose_list: [
												[player, cards[0]],
												[target, cards[1]],
											],
										})
										.setContent(get.info("mbzengou").loseToDiscardpileMultiple);
								} else {
									await owners[0].loseToDiscardpile(result.links);
									if (owners[0] === target) player.tempBanSkill("taffyold_potdaozhuan");
								}
							}
							return;
						}
						const evt = event.getParent();
						evt.set("taffyold_potdaozhuan", true);
						evt.goto(0);
					},
				};
			},
		},
		hiddenCard(player, name) {
			if (player.isTempBanned("taffyold_potdaozhuan")) return false;
			return get.type(name) === "basic" && !player.getStorage("taffyold_potdaozhuan_used").includes(name);
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (arg === "respond") return false;
				return get.info("taffyold_potdaozhuan").hiddenCard(
					player,
					(() => {
						switch (tag) {
							case "fireAttack":
								return "sha";
							default:
								return tag.slice("respond".length).toLowerCase();
						}
					})()
				);
			},
			order(item, player) {
				if (player && _status.event.type === "phase") {
					let max = 0,
						names = get.inpileVCardList(info => {
							const name = info[2];
							if (get.type(name) !== "basic") return false;
							return !player.getStorage("taffyold_potdaozhuan_used").includes(name);
						});
					names = names.map(namex => new lib.element.VCard({ name: namex[2], nature: namex[3] }));
					names.forEach(card => {
						if (player.getUseValue(card) > 0) {
							let temp = get.order(card);
							if (temp > max) max = temp;
						}
					});
					return max + (max > 0 ? 0.2 : 0);
				}
				return 10;
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
			used: {
				charlotte: true,
				onremove: true,
				intro: { content: "本轮已使用牌名：$" },
			},
		},
	},
	taffyold_potfuji: {
		audio: "potfuji",
		enable: "phaseUse",
		filter(event, player) {
			return game.countPlayer(t => t.countCards("h")) > 0 && game.hasPlayer(target => target !== player);
		},
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				const targets = game.filterPlayer(target => target.countCards("h"));
				return ui.create.dialog(
					"符济",
					...targets
						.map(target => {
							let list = [],
								cards = target.getCards("h");
							list.push('<div class="text center">' + get.translation(target) + "的手牌</div>");
							if (target === player || player.hasSkillTag("viewHandcard", null, target, true)) list.push(cards);
							else list.push([cards.slice().randomSort(), "blank"]);
							return list;
						})
						.flat(),
					"hidden"
				);
			},
			select: () => [1, game.countPlayer(target => target !== get.player())],
			check(button) {
				const player = get.player(),
					owner = get.owner(button.link);
				return get.value(button.link, owner) * Math.sign(-get.attitude(player, owner));
			},
			prompt(links) {
				let prompt = "将" + get.translation(links) + "交给至多等量角色。";
				prompt += "因此获得【杀】的角色使用【杀】造成的伤害+1直到你的下个回合开始；";
				prompt += "因此获得【闪】的角色使用【闪】结算完毕后摸一张牌直到你的下个回合开始。";
				prompt += "然后若你的手牌数为全场最低，则你获得摸两张牌，获得这两项效果直到你的下个回合开始。";
				return '###符济###<div class="text center">' + prompt + "</div>";
			},
			backup(links) {
				return {
					giveCards: links,
					logAudio: () => ["potfuji1.mp3", "potfuji2.mp3", "potfuji3.mp3"],
					filterCard: () => false,
					selectCard: -1,
					filterTarget: true,
					selectTarget: links.length,
					targetprompt() {
						const links = get.info("taffyold_potfuji_backup").giveCards;
						return ["获得", get.translation(links[ui.selected.targets.length - 1])].join("<br>");
					},
					multiline: true,
					multitarget: true,
					complexSelect: true,
					async content(event, trigger, player) {
						const targets = event.targets;
						const links = get.info("taffyold_potfuji_backup").giveCards;
						let map = new Map(),
							lose_list = [];
						for (const link of links) {
							const owner = get.owner(link);
							map.set(owner, (map.get(owner) || []).concat([link]));
						}
						for (const [owner, cards] of Array.from(map.entries())) {
							owner.$throw(cards.length, 500);
							game.log(owner, "将", get.cnNumber(cards.length), "张牌置入了处理区");
							lose_list.push([owner, cards]);
						}
						await game
							.loseAsync({
								lose_list: lose_list,
							})
							.setContent("chooseToCompareLose");
						await game.delayx();
						const gain_list = links.map((link, i) => [targets[i], [link]]);
						await game
							.loseAsync({
								gain_list: gain_list,
								giver: player,
								animate: "gain2",
							})
							.setContent("gaincardMultiple");
						for (const [target, [link]] of gain_list) {
							const name = get.name(link, false);
							if (["sha", "shan"].includes(name)) {
								player.addTempSkill("taffyold_potfuji_clear", { player: "phaseBegin" });
								await target.addAdditionalSkills("taffyold_potfuji_" + player.playerid, "taffyold_potfuji_" + name, true);
							}
						}
						if (player.isMinHandcard()) {
							player.changeSkin({ characterName: "taffyold_pot_yuji" }, "pot_yuji_shadow");
							await player.draw(2);
							player.addTempSkill("taffyold_potfuji_clear", { player: "phaseBegin" });
							await player.addAdditionalSkills("taffyold_potfuji_" + player.playerid, ["taffyold_potfuji_sha", "taffyold_potfuji_shan"], true);
						}
						player.when({ player: "phaseBegin" }).then(() => {
							player.changeSkin({ characterName: "taffyold_pot_yuji" }, "pot_yuji");
						});
					},
					ai: {
						result: {
							player(player, target) {
								const links = get.info("taffyold_potfuji_backup").giveCards;
								return get.value(links[ui.selected.targets.length], target) * get.attitude(player, target);
							},
						},
					},
				};
			},
		},
		ai: {
			order: 10,
			threaten: 4,
			result: { player: 1 },
		},
		subSkill: {
			backup: {},
			clear: {
				charlotte: true,
				onremove(player) {
					game.countPlayer(current => current.removeAdditionalSkills("taffyold_potfuji_" + player.playerid));
				},
			},
			sha: {
				audio: ["potfuji4.mp3", "potfuji5.mp3"],
				charlotte: true,
				mark: true,
				marktext: "杀",
				intro: {
					name: "符济 - 杀",
					content: "使用【杀】造成的伤害+1",
				},
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					return event.card && event.card.name === "sha";
				},
				forced: true,
				logTarget: "player",
				content() {
					trigger.num++;
				},
			},
			shan: {
				audio: ["potfuji4.mp3", "potfuji5.mp3"],
				charlotte: true,
				mark: true,
				marktext: "闪",
				intro: {
					name: "符济 - 闪",
					content: "使用【闪】结算完毕后摸一张牌",
				},
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return event.card.name === "shan";
				},
				forced: true,
				content() {
					player.draw();
				},
			},
		},
	},
};

export default oldMB;
