import { lib, game, ui, get, ai, _status } from "../extension/noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	// 评世雕龙
	taffyboss_pingjian: {
		derivation: "taffyboss_pingjian_faq",
		initList: function () {
			var list = [];
			if (_status.connectMode) var list = get.charactersOL();
			else {
				var list = [];
				for (var i in lib.character) {
					if (!lib.filter.characterDisabled2(i) && !lib.filter.characterDisabled(i)) list.push(i);
				}
			}
			game.countPlayer2(function (current) {
				list.remove(current.name);
				list.remove(current.name1);
				list.remove(current.name2);
			});
			_status.characterlist = list;
		},
		audio: 4,
		trigger: {
			player: ["damageBefore", "phaseJieshuBefore", "phaseBefore"],
		},
		frequent: true,
		content: function () {
			"step 0";
			var skills = player.getSkills(null, false, false).filter(skill => {
				var info = get.info(skill);
				if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
				const tempSkills = Object.keys(player.tempSkills);
				if (tempSkills.includes(skill)) {
					return false;
				}
				const additionalSkills = Object.keys(player.additionalSkills);
				for (let i = 0; i < additionalSkills.length; i++) {
					if (player.additionalSkills[additionalSkills[i]].includes(skill)) {
						return false;
					}
				}
				return true;
			});
			var next = player.chooseButton(true, ["评荐：选择失去任意个技能", [skills.map(i => [i, '<div class="popup text" style="width:calc(100% - 25px);display:inline-block"><div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player) + "</div></div>"]), "textbutton"]]);
			next.set("selectButton", [0, skills.length]);
			next.set("ai", function (button) {
				if (button.link == "taffyboss_pingjian") return -1;
				return Math.random();
			});
			("step 1");
			if (result.bool) {
				let rSkillInfo;
				for (let i = 0; i < result.links.length; i++) {
					rSkillInfo = get.info(result.links[i]);
					if (rSkillInfo.limited || rSkillInfo.juexingji || rSkillInfo.dutySkill) {
						player.restoreSkill(result.links[i]);
					}
					player.removeSkill(result.links[i]);
					game.log(player, "失去了技能", "#g【" + get.translation(result.links[i]) + "】");
				}
				if (!_status.characterlist || !_status.pingjianInitialized) {
					_status.pingjianInitialized = true;
					lib.skill.taffyboss_pingjian.initList();
				}
				var allList = _status.characterlist.slice(0);
				game.countPlayer(function (current) {
					if (current.name && lib.character[current.name] && current.name.indexOf("gz_shibing") != 0 && current.name.indexOf("gz_jun_") != 0) allList.add(current.name);
					if (current.name1 && lib.character[current.name1] && current.name1.indexOf("gz_shibing") != 0 && current.name1.indexOf("gz_jun_") != 0) allList.add(current.name1);
					if (current.name2 && lib.character[current.name2] && current.name2.indexOf("gz_shibing") != 0 && current.name2.indexOf("gz_jun_") != 0) allList.add(current.name2);
				});
				var list = [];
				var skills = [];
				var map = [];
				allList.randomSort();
				var name2 = event.triggername;

				function hasCommonElement(array1, array2) {
					for (let i = 0; i < array1.length; i++) {
						if (array2.includes(array1[i])) {
							return true;
						}
					}
					return false;
				}
				for (var i = 0; i < allList.length; i++) {
					var name = allList[i];
					if (name.indexOf("xushao") != -1 || name.indexOf("taffyboss_xushao") != -1 || name.indexOf("taffydc_xushao") != -1 || name.indexOf("taffyhuiwan_xushao") != -1 || name.indexOf("taffyre_xushao") != -1 || name.indexOf("taffyshen_xushao") != -1) continue;
					var skills2 = lib.character[name][3];
					for (var j = 0; j < skills2.length; j++) {
						var playerSkills = player.getSkills(null, false, false).filter(skill => {
							var info = get.info(skill);
							if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
							return true;
						});
						if (playerSkills.includes(skills2[j])) continue;
						if (skills.includes(skills2[j])) {
							list.add(name);
							if (!map[name]) map[name] = [];
							map[name].add(skills2[j]);
							skills.add(skills2[j]);
							continue;
						}
						var list2 = [skills2[j]];
						game.expandSkills(list2);
						for (var k = 0; k < list2.length; k++) {
							var info = lib.skill[list2[k]];
							if (!info || !info.trigger) continue;
							if (name2 === "phaseBefore") {
								name2 = ["phaseBeforeStart", "phaseBefore", "phaseBeforeEnd", "phaseBeginStart", "phaseBegin", "phaseChange", "phaseZhunbeiBefore", "phaseZhunbeiBegin", "phaseZhunbei", "phaseZhunbeiEnd", "phaseZhunbeiAfter", "phaseJudgeBefore", "phaseJudgeBegin", "phaseJudge", "phaseJudgeEnd", "phaseJudgeAfter", "phaseDrawBefore", "phaseDrawBegin", "phaseDrawBegin1", "phaseDrawBegin2", "phaseDraw", "phaseDrawEnd", "phaseDrawAfter", "phaseUseBefore", "phaseUseBegin"];
							} else if (name2 === "damageBefore") {
								name2 = ["damageBefore", "damageBegin", "damageBegin2", "damageBegin3", "damageBegin4", "damage", "damageSource", "damageEnd", "damageAfter"];
							} else if (name2 === "phaseJieshuBefore") {
								name2 = ["phaseJieshuBefore", "phaseJieshuBegin", "phaseJieshu", "phaseJieshuEnd", "phaseJieshuAfter", "phaseEnd", "phaseAfter"];
							}
							if (info.trigger.player) {
								if (name2.includes(info.trigger.player) || (Array.isArray(info.trigger.player) && hasCommonElement(info.trigger.player, name2))) {
									if (info.filter) {
										try {
											var bool = info.filter(trigger, player);
											if (!bool) continue;
										} catch (e) {
											continue;
										}
									}
									list.add(name);
									if (!map[name]) map[name] = [];
									map[name].add(skills2[j]);
									skills.add(skills2[j]);
									break;
								}
							}
							if (info.trigger.global) {
								if ((name2.includes(info.trigger.global) || (Array.isArray(info.trigger.global) && hasCommonElement(info.trigger.global, name2))) && (!info.trigger.player || info.trigger.player !== "enterGame" || (Array.isArray(info.trigger.player) && !info.trigger.player.includes("enterGame")))) {
									if (info.filter) {
										try {
											var bool = info.filter(trigger, player);
											if (!bool) continue;
										} catch (e) {
											continue;
										}
									}
									list.add(name);
									if (!map[name]) map[name] = [];
									map[name].add(skills2[j]);
									skills.add(skills2[j]);
									break;
								}
							}
						}
					}
					if (list.length >= 2 * result.links.length + 3) break;
				}
				if (skills.length) {
					event.list = list;
					if (player.isUnderControl()) {
						game.swapPlayerAuto(player);
					}
					var switchToAuto = function () {
						_status.imchoosing = false;
						event._result = {
							bool: true,
							skills: skills.randomGets(result.links.length + 1),
						};
						if (event.dialog) event.dialog.close();
						if (event.control) event.control.close();
					};
					var chooseButton = function (list, skills, result, player) {
						var event = _status.event;
						if (!event._result) event._result = {};
						event._result.skills = [];
						var rSkill = event._result.skills;
						var dialog = ui.create.dialog("评荐：选择获得至多" + get.cnNumber(result.links.length + 1) + "个技能", [list, "character"], "hidden");
						event.dialog = dialog;
						var table = document.createElement("div");
						table.classList.add("add-setting");
						table.style.margin = "0";
						table.style.width = "100%";
						table.style.position = "relative";
						for (var i = 0; i < skills.length; i++) {
							var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
							td.link = skills[i];
							table.appendChild(td);
							td.innerHTML = "<span>" + get.translation(skills[i]) + "</span>";
							td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
								if (_status.dragged) return;
								if (_status.justdragged) return;
								_status.tempNoButton = true;
								setTimeout(function () {
									_status.tempNoButton = false;
								}, 500);
								var link = this.link;
								if (!this.classList.contains("bluebg")) {
									if (rSkill.length >= result.links.length + 1) return;
									rSkill.add(link);
									this.classList.add("bluebg");
								} else {
									this.classList.remove("bluebg");
									rSkill.remove(link);
								}
							});
						}
						dialog.content.appendChild(table);
						dialog.add("　　");
						dialog.open();
						event.switchToAuto = function () {
							event.dialog.close();
							event.control.close();
							game.resume();
							_status.imchoosing = false;
						};
						event.control = ui.create.control("ok", function (link) {
							event.dialog.close();
							event.control.close();
							game.resume();
							_status.imchoosing = false;
						});
						for (var i = 0; i < event.dialog.buttons.length; i++) {
							event.dialog.buttons[i].classList.add("selectable");
						}
						game.pause();
						game.countChoose();
					};
					if (event.isMine()) {
						chooseButton(list, skills, result, player);
					} else if (event.isOnline()) {
						event.player.send(chooseButton, list, skills, result, player);
						event.player.wait();
						game.pause();
					} else {
						switchToAuto();
					}
				} else {
					event.finish();
				}
			}
			("step 2");
			var map = event.result || result;
			if (map && map.skills && map.skills.length) {
				for (var i of map.skills) {
					player.addSkill(i);
					game.log(player, "获得了技能", "#g【" + get.translation(i) + "】");
					var name = event.list.find(name => lib.character[name][3].includes(i));
					if (name) game.broadcastAll((player, name) => player.tempname.add(name), player, name);
				}
			}
		},
		group: "taffyboss_pingjian_use",
		phaseUse_special: [],
		ai: {
			threaten: 100,
		},
	},
	taffyboss_pingjian_use: {
		audio: "taffyboss_pingjian",
		enable: "phaseUse",
		usable: 1,
		prompt: () => lib.translate.taffyboss_pingjian_info,
		chooseButton: {
			dialog: function (event, player) {
				var dialog = ui.create.dialog("评荐：请选择一项", "hidden");
				dialog.add([
					[
						["character", '<div class="popup text" style="width:calc(100% - 25px);display:inline-block">失去X个非Charlotte技能并令系统随机检索出2X+1张武将牌，然后你选择其中至多X张并获得其所有技能</div>'],
						["skill", '<div class="popup text" style="width:calc(100% - 25px);display:inline-block">失去X个非Charlotte技能并令系统随机检索出2X+3张武将牌，然后你获得其中至多X+1个技能</div>'],
					],
					"textbutton",
				]);
				return dialog;
			},
			check: function (button) {
				if (button.link == "character") return 1;
			},
			backup: function (links) {
				return get.copy(lib.skill["taffyboss_pingjian_use_" + links[0]]);
			},
			prompt: function (links) {
				if (links[0] == "character") return "失去X个非Charlotte技能并令系统随机检索出2X+1张武将牌，然后你选择其中至多X张并获得其所有技能";
				return "失去X个非Charlotte技能并令系统随机检索出2X+3张武将牌，然后你获得其中至多X+1个技能";
			},
		},
		subSkill: {
			backup: {
				audio: "taffyboss_pingjian",
			},
			character: {
				audio: "taffyboss_pingjian",
				content: function () {
					"step 0";
					var skills = player.getSkills(null, false, false).filter(skill => {
						var info = get.info(skill);
						if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
						const tempSkills = Object.keys(player.tempSkills);
						if (tempSkills.includes(skill)) {
							return false;
						}
						const additionalSkills = Object.keys(player.additionalSkills);
						for (let i = 0; i < additionalSkills.length; i++) {
							if (player.additionalSkills[additionalSkills[i]].includes(skill)) {
								return false;
							}
						}
						return true;
					});
					var next = player.chooseButton(true, ["评荐：选择失去任意个技能", [skills.map(i => [i, '<div class="popup text" style="width:calc(100% - 25px);display:inline-block"><div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player) + "</div></div>"]), "textbutton"]]);
					next.set("selectButton", [0, skills.length]);
					next.set("ai", function (button) {
						if (button.link == "taffyboss_pingjian") return -1;
						return Math.random();
					});
					("step 1");
					if (result.bool) {
						if (result.links.length === 0) {
							event.finish();
						} else {
							let rSkillInfo;
							for (let i = 0; i < result.links.length; i++) {
								rSkillInfo = get.info(result.links[i]);
								if (rSkillInfo.limited || rSkillInfo.juexingji || rSkillInfo.dutySkill) {
									player.restoreSkill(result.links[i]);
								}
								player.removeSkill(result.links[i]);
								game.log(player, "失去了技能", "#g【" + get.translation(result.links[i]) + "】");
							}
							if (!_status.characterlist || !_status.pingjianInitialized) {
								_status.pingjianInitialized = true;
								lib.skill.taffyboss_pingjian.initList();
							}
							var list = [];
							var allList = _status.characterlist.slice(0);
							game.countPlayer(function (current) {
								if (current.name && lib.character[current.name] && current.name.indexOf("gz_shibing") != 0 && current.name.indexOf("gz_jun_") != 0) allList.add(current.name);
								if (current.name1 && lib.character[current.name1] && current.name1.indexOf("gz_shibing") != 0 && current.name1.indexOf("gz_jun_") != 0) allList.add(current.name1);
								if (current.name2 && lib.character[current.name2] && current.name2.indexOf("gz_shibing") != 0 && current.name2.indexOf("gz_jun_") != 0) allList.add(current.name2);
							});
							allList.randomSort();
							for (var i = 0; i < allList.length; i++) {
								var name = allList[i];
								if (name.indexOf("xushao") != -1 || name.indexOf("taffyboss_xushao") != -1 || name.indexOf("taffydc_xushao") != -1 || name.indexOf("taffyhuiwan_xushao") != -1 || name.indexOf("taffyre_xushao") != -1 || name.indexOf("taffyshen_xushao") != -1) continue;
								list.add(name);
								if (list.length >= 2 * result.links.length + 1) break;
							}
							if (!list.length) event.finish();
							else {
								event.list = list;
								player.chooseButton(["评荐：请选择至多" + get.cnNumber(result.links.length) + "张武将牌并获得其所有技能", [list, "character"]], [0, result.links.length], true);
							}
						}
					}
					("step 2");
					if (result.links.length !== 0) {
						for (let i = 0; i < result.links.length; i++) {
							var skills = lib.character[result.links[i]][3];
							for (let j = 0; j < skills.length; j++) {
								player.addSkill(skills[j]);
								game.log(player, "获得了技能", "#g【" + get.translation(skills[j]) + "】");
								var name = event.list.find(name => lib.character[name][3].includes(skills[j]));
								if (name) game.broadcastAll((player, name) => player.tempname.add(name), player, name);
							}
						}
					}
				},
			},
			skill: {
				audio: "taffyboss_pingjian",
				content: function () {
					"step 0";
					var skills = player.getSkills(null, false, false).filter(skill => {
						var info = get.info(skill);
						if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
						const tempSkills = Object.keys(player.tempSkills);
						if (tempSkills.includes(skill)) {
							return false;
						}
						const additionalSkills = Object.keys(player.additionalSkills);
						for (let i = 0; i < additionalSkills.length; i++) {
							if (player.additionalSkills[additionalSkills[i]].includes(skill)) {
								return false;
							}
						}
						return true;
					});
					var next = player.chooseButton(true, ["评荐：选择失去任意个技能", [skills.map(i => [i, '<div class="popup text" style="width:calc(100% - 25px);display:inline-block"><div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player) + "</div></div>"]), "textbutton"]]);
					next.set("selectButton", [0, skills.length]);
					next.set("ai", function (button) {
						if (button.link == "taffyboss_pingjian") return -1;
						return Math.random();
					});
					("step 1");
					if (result.bool) {
						let rSkillInfo;
						for (let i = 0; i < result.links.length; i++) {
							rSkillInfo = get.info(result.links[i]);
							if (rSkillInfo.limited || rSkillInfo.juexingji || rSkillInfo.dutySkill) {
								player.restoreSkill(result.links[i]);
							}
							player.removeSkill(result.links[i]);
							game.log(player, "失去了技能", "#g【" + get.translation(result.links[i]) + "】");
						}
						var list = [];
						var skills = [];
						var map = [];
						if (!_status.characterlist || !_status.pingjianInitialized) {
							_status.pingjianInitialized = true;
							lib.skill.taffyboss_pingjian.initList();
						}
						var allList = _status.characterlist.slice(0);
						game.countPlayer(function (current) {
							if (current.name && lib.character[current.name] && current.name.indexOf("gz_shibing") != 0 && current.name.indexOf("gz_jun_") != 0) allList.add(current.name);
							if (current.name1 && lib.character[current.name1] && current.name1.indexOf("gz_shibing") != 0 && current.name1.indexOf("gz_jun_") != 0) allList.add(current.name1);
							if (current.name2 && lib.character[current.name2] && current.name2.indexOf("gz_shibing") != 0 && current.name2.indexOf("gz_jun_") != 0) allList.add(current.name2);
						});
						allList.randomSort();
						for (var i = 0; i < allList.length; i++) {
							var name = allList[i];
							if (name.indexOf("xushao") != -1 || name.indexOf("taffyboss_xushao") != -1 || name.indexOf("taffydc_xushao") != -1 || name.indexOf("taffyhuiwan_xushao") != -1 || name.indexOf("taffyre_xushao") != -1 || name.indexOf("taffyshen_xushao") != -1) continue;
							var skills2 = lib.character[name][3];
							for (var j = 0; j < skills2.length; j++) {
								var playerSkills = player.getSkills(null, false, false).filter(skill => {
									var info = get.info(skill);
									if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
									return true;
								});
								if (playerSkills.includes(skills2[j])) continue;
								if (skills.includes(skills2[j]) || lib.skill.taffyboss_pingjian.phaseUse_special.includes(skills2[j])) {
									list.add(name);
									if (!map[name]) map[name] = [];
									map[name].add(skills2[j]);
									skills.add(skills2[j]);
									continue;
								}
								var list2 = [skills2[j]];
								game.expandSkills(list2);
								for (var k = 0; k < list2.length; k++) {
									var info = lib.skill[list2[k]];
									if (!info) continue;
									list.add(name);
									if (!map[name]) map[name] = [];
									map[name].add(skills2[j]);
									skills.add(skills2[j]);
									break;
								}
							}
							if (list.length >= 2 * result.links.length + 3) break;
						}
						if (skills.length) {
							event.list = list;
							if (player.isUnderControl()) {
								game.swapPlayerAuto(player);
							}
							var switchToAuto = function () {
								_status.imchoosing = false;
								event._result = {
									bool: true,
									skills: skills.randomGets(result.links.length + 1),
								};
								if (event.dialog) event.dialog.close();
								if (event.control) event.control.close();
							};
							var chooseButton = function (list, skills, result, player) {
								var event = _status.event;
								if (!event._result) event._result = {};
								event._result.skills = [];
								var rSkill = event._result.skills;
								var dialog = ui.create.dialog("评荐：选择获得至多" + get.cnNumber(result.links.length + 1) + "个技能", [list, "character"], "hidden");
								event.dialog = dialog;
								var table = document.createElement("div");
								table.classList.add("add-setting");
								table.style.margin = "0";
								table.style.width = "100%";
								table.style.position = "relative";
								for (var i = 0; i < skills.length; i++) {
									var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
									td.link = skills[i];
									table.appendChild(td);
									td.innerHTML = "<span>" + get.translation(skills[i]) + "</span>";
									td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
										if (_status.dragged) return;
										if (_status.justdragged) return;
										_status.tempNoButton = true;
										setTimeout(function () {
											_status.tempNoButton = false;
										}, 500);
										var link = this.link;
										if (!this.classList.contains("bluebg")) {
											if (rSkill.length >= result.links.length + 1) return;
											rSkill.add(link);
											this.classList.add("bluebg");
										} else {
											this.classList.remove("bluebg");
											rSkill.remove(link);
										}
									});
								}
								dialog.content.appendChild(table);
								dialog.add("　　");
								dialog.open();
								event.switchToAuto = function () {
									event.dialog.close();
									event.control.close();
									game.resume();
									_status.imchoosing = false;
								};
								event.control = ui.create.control("ok", function (link) {
									event.dialog.close();
									event.control.close();
									game.resume();
									_status.imchoosing = false;
								});
								for (var i = 0; i < event.dialog.buttons.length; i++) {
									event.dialog.buttons[i].classList.add("selectable");
								}
								game.pause();
								game.countChoose();
							};
							if (event.isMine()) {
								chooseButton(list, skills, result, player);
							} else if (event.isOnline()) {
								event.player.send(chooseButton, list, skills, result, player);
								event.player.wait();
								game.pause();
							} else {
								switchToAuto();
							}
						} else {
							event.finish();
						}
					}
					("step 2");
					var map = event.result || result;
					if (map && map.skills && map.skills.length) {
						for (var i of map.skills) {
							player.addSkill(i);
							game.log(player, "获得了技能", "#g【" + get.translation(i) + "】");
							var name = event.list.find(name => lib.character[name][3].includes(i));
							if (name) game.broadcastAll((player, name) => player.tempname.add(name), player, name);
						}
					}
				},
			},
		},
		ai: {
			order: 12,
			result: {
				player: 1,
			},
		},
	},
	//旧武诸葛
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
	// 新杀管宁
	taffydc_dunshi: {
		audio: 2,
		enable: ["chooseToUse", "chooseToRespond"],
		usable: 1,
		init: function (player, skill) {
			if (!player.storage[skill]) player.storage[skill] = [["sha", "shan", "tao", "jiu"], 0];
		},
		hiddenCard: function (player, name) {
			if (player.storage.taffydc_dunshi && player.storage.taffydc_dunshi[0].includes(name) && !player.getStat("skill").taffydc_dunshi) return true;
			return false;
		},
		marktext: "席",
		mark: true,
		intro: {
			markcount: function (storage) {
				return storage[1];
			},
			content: function (storage, player) {
				if (!storage) return;
				var str = "<li>";
				if (!storage[0].length) {
					str += "已无可用牌";
				} else {
					str += "剩余可用牌：";
					str += get.translation(storage[0]);
				}
				str += "<br><li>“席”标记数量：";
				str += storage[1];
				return str;
			},
		},
		filter: function (event, player) {
			if (event.type == "wuxie") return false;
			var storage = player.storage.taffydc_dunshi;
			if (!storage || !storage[0].length) return false;
			for (var i of storage[0]) {
				var card = {
					name: i,
					isCard: true,
				};
				if (event.filterCard(card, player, event)) return true;
			}
			return false;
		},
		chooseButton: {
			dialog: function (event, player) {
				var list = [];
				var storage = player.storage.taffydc_dunshi;
				for (var i of storage[0]) list.push(["基本", "", i]);
				return ui.create.dialog("遁世", [list, "vcard"], "hidden");
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
				var card = {
						name: button.link[2],
					},
					player = _status.event.player;
				if (_status.event.getParent().type != "phase") return 1;
				if (card.name == "jiu") return 0;
				if (card.name == "sha" && player.hasSkill("jiu")) return 0;
				return player.getUseValue(card, null, true);
			},
			backup: function (links, player) {
				return {
					audio: "taffydc_dunshi",
					filterCard: function () {
						return false;
					},
					popname: true,
					viewAs: {
						name: links[0][2],
						isCard: true,
					},
					selectCard: -1,
					precontent: function () {
						player.addTempSkill("taffydc_dunshi_damage");
						player.storage.taffydc_dunshi_damage = event.result.card.name;
					},
				};
			},
			prompt: function (links, player) {
				return "选择【" + get.translation(links[0][2]) + "】的目标";
			},
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter: function (player, tag, arg) {
				var storage = player.storage.taffydc_dunshi;
				if (!storage || !storage[0].length) return false;
				if (player.getStat("skill").taffydc_dunshi) return false;
				switch (tag) {
					case "respondSha":
						return (_status.event.type != "phase" || player == game.me || player.isUnderControl() || player.isOnline()) && storage[0].includes("sha");
					case "respondShan":
						return storage[0].includes("shan");
					case "save":
						if (arg == player && storage[0].includes("jiu")) return true;
						return storage[0].includes("tao");
				}
			},
			order: 2,
			result: {
				player: function (player) {
					if (_status.event.type == "dying") {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
		},
		initList: function () {
			var skills = [];
			skills = ["rerende", "renxin", "renzheng", "juyi", "yicong", "new_yijue", "yishe", "reyixiang", "tianyi", "dcchongyi", "tongli", "relixia", "cslilu", "nzry_yili", "zhiyu", "zhichi", "rejizhi", "xinfu_qianxin"];
			_status.taffydc_dunshi_list = skills;
		},
		subSkill: {
			backup: {
				audio: "taffydc_dunshi",
			},
			damage: {
				audio: "taffydc_dunshi",
				trigger: {
					global: "damageBegin2",
				},
				forced: true,
				charlotte: true,
				filter: function (event, player) {
					return event.source == _status.currentPhase;
				},
				onremove: true,
				logTarget: "source",
				content: function () {
					"step 0";
					event.cardname = player.storage.taffydc_dunshi_damage;
					player.removeSkill("taffydc_dunshi_damage");
					event.target = trigger.source;
					var card = get.translation(trigger.source),
						card2 = get.translation(event.cardname),
						card3 = get.translation(trigger.player);
					var list = ["防止即将对" + card3 + "造成的伤害，并令" + card + "获得一个技能名中包含“仁/义/礼/智/信”的技能", "从〖遁世〗中删除【" + card2 + "】并获得一枚“席”", "减1点体力上限，然后摸等同于“席”数的牌"];
					var next = player.chooseButton([
						"遁世：请选择两项",
						[
							list.map((item, i) => {
								return [i, item];
							}),
							"textbutton",
						],
					]);
					next.set("forced", true);
					next.set("selectButton", 2);
					next.set("ai", function (button) {
						var player = _status.event.player;
						switch (button.link) {
							case 0:
								if (get.attitude(player, _status.currentPhase) > 0) return 3;
								return 0;
							case 1:
								return 1;
							case 2:
								var num = player.storage.taffydc_dunshi[1];
								for (var i of ui.selected.buttons) {
									if (i.link == 1) num++;
								}
								if (num > 0 && player.isDamaged()) return 2;
								return 0;
						}
					});
					("step 1");
					event.links = result.links.sort();
					for (var i of event.links) {
						game.log(player, "选择了", "#g【遁世】", "的", "#y选项" + get.cnNumber(i + 1, true));
					}
					if (event.links.includes(0)) {
						trigger.cancel();
						if (!_status.taffydc_dunshi_list) lib.skill.taffydc_dunshi.initList();
						var list = _status.taffydc_dunshi_list
							.filter(function (i) {
								return !target.hasSkill(i, null, null, false);
							})
							.randomGets(3);
						if (list.length == 0) event.goto(3);
						else {
							event.videoId = lib.status.videoId++;
							var func = function (skills, id, target) {
								var dialog = ui.create.dialog("forcebutton");
								dialog.videoId = id;
								dialog.add("令" + get.translation(target) + "获得一个技能");
								for (var i = 0; i < skills.length; i++) {
									dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + get.translation(skills[i]) + "】</div><div>" + lib.translate[skills[i] + "_info"] + "</div></div>");
								}
								dialog.addText(" <br> ");
							};
							if (player.isOnline()) player.send(func, list, event.videoId, target);
							else if (player == game.me) func(list, event.videoId, target);
							player.chooseControl(list).set("ai", function () {
								var controls = _status.event.controls;
								if (controls.includes("cslilu")) return "cslilu";
								return controls[0];
							});
						}
					} else event.goto(3);
					("step 2");
					game.broadcastAll("closeDialog", event.videoId);
					target.addSkillLog(result.control);
					("step 3");
					var storage = player.storage.taffydc_dunshi;
					if (event.links.includes(1)) {
						storage[0].remove(event.cardname);
						storage[1]++;
						player.markSkill("taffydc_dunshi");
					}
					if (event.links.includes(2)) {
						player.loseMaxHp();
						if (storage[1] > 0) player.draw(storage[1]);
					}
				},
			},
		},
	},
	// 永雏塔菲
	taffybaomi: {
		audio: 2,
		trigger: {
			source: "damageBefore",
		},
		logTarget: "player",
		check: function (event, player) {
			var target = event.player;
			if (get.damageEffect(target, player, player) > 0 && get.attitude(player, target) >= 0) {
				return 1;
			}
			return false;
		},
		content: function () {
			"step 0";
			var he = trigger.player.getCards("he");
			if (he.length > 0) {
				if (he.length > 1) trigger.player.chooseCard("he", true, [1, Infinity], "选择交给" + get.translation(player) + "至少一张牌").set("ai", card => -get.value(card));
				else
					event._result = {
						bool: true,
						cards: he,
					};
			} else {
				trigger.cancel();
				event.finish();
			}
			("step 1");
			if (result.bool) {
				event.source = player;
				player.markAuto("taffybaomi", [trigger.player]);
				trigger.player.give(result.cards, player);
				event.num = result.cards.length;
			}
			player.line(trigger.player, "green");
			trigger.cancel();
		},
		ai: {
			jueqing: true,
			skillTagFilter: function (player, tag, arg) {
				if (!arg) return false;
				if (get.attitude(player, arg) <= 0) return false;
				var evt = _status.event.getParent("phaseUse");
				if (evt && evt.player == player) return true;
				return false;
			},
			effect: {
				player: function (card, player, target) {
					if (get.tag(card, "damage") && get.attitude(player, target) >= 0) {
						return 1;
					}
				},
			},
		},
		group: "taffybaomi_beg",
		subSkill: {
			beg: {
				audio: "taffybaomi",
				trigger: { global: "phaseUseBegin" },
				filter: function (event, player) {
					return event.player != player && event.player.countCards("he");
				},
				prompt2: "令其交给你至少一张牌。",
				check: function (event, player) {
					if (get.attitude(player, event.player) > 0 && event.player.countCards("h") <= event.player.hp) return false;
					return true;
				},
				content: function () {
					"step 0";
					var target = trigger.player;
					event.target = target;
					target.chooseCard("he", true, [1, Infinity], "交给" + get.translation(player) + "至少一张牌").set("ai", card => -get.value(card));
					("step 1");
					if (result.bool) {
						player.markAuto("taffybaomi", [target]);
						target.give(result.cards, player);
					}
				},
				ai: {
					threaten: 1.1,
				},
			},
		},
	},
	taffyfeizhu: {
		audio: 2,
		trigger: {
			player: "damageBegin4",
		},
		forced: true,
		filter: function (event, player) {
			return player.isTurnedOver();
		},
		content: function () {
			trigger.num = Math.floor(trigger.num * 2);
		},
	},
	taffyzuoai: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		selectCard: [1, Infinity],
		position: "he",
		filter: function (event, player) {
			return player.countCards("he") > 0;
		},
		discard: false,
		lose: false,
		delay: 0,
		filterTarget: function (card, player, target) {
			return player != target && get.distance(player, target) <= 1 && player.getStorage("taffybaomi").includes(target) && target.isIn();
		},
		check: function (card) {
			return 0;
		},
		content: () => {
			player.give(cards, target);
			if (!player.isTurnedOver()) {
				player.turnOver();
			}
			if (!target.isTurnedOver()) {
				target.turnOver();
			}
			var evt2 = event.getParent(3);
			target.loseHp();
			target.addMark("taffyzuoai", 1);
			if (!target.storage["taffyzuoai_times"]) target.storage["taffyzuoai_times"] = 0;
			player.recover();
		},
		marktext: "💘",
		intro: {
			name: "卓艾",
			content: (storage, player) => {
				return `你已经跟Taffy卓艾了${player.countMark("taffyzuoai")}次喵❤~`;
			},
		},
		group: "taffyzuoai_control",
		ai: {
			expose: 0.2,
			order: 7,
			result: {
				target: function (player, target) {
					return get.damageEffect(target, player, target, "fire") / 10;
				},
			},
		},
	},
	taffyzuoai_control: {
		audio: "taffyzuoai",
		forced: true,
		trigger: {
			global: "phaseBeginStart",
		},
		filter: function (event, player) {
			return player != event.player && !event.player._trueMe && event.player.countMark("taffyzuoai") > 0 && event.player.countMark("taffyzuoai") > event.player.storage["taffyzuoai_times"];
		},
		logTarget: "player",
		skillAnimation: true,
		animationColor: "key",
		content: function () {
			trigger.player._trueMe = player;
			game.addGlobalSkill("autoswap");
			if (trigger.player == game.me) {
				game.notMe = true;
				if (!_status.auto) ui.click.auto();
			}
			trigger.player.addSkill("taffyzuoai2");
		},
	},
	taffyzuoai2: {
		trigger: {
			player: ["phaseAfter", "dieAfter"],
			global: "phaseBefore",
		},
		lastDo: true,
		charlotte: true,
		forceDie: true,
		forced: true,
		silent: true,
		content: function () {
			player.removeSkill("taffyzuoai2");
		},
		onremove: function (player) {
			player.storage["taffyzuoai_times"]++;
			if (player.countCards("h") > 0) {
				player.give(player.getCards("h"), player._trueMe);
			}
			if (player == game.me) {
				if (!game.notMe) game.swapPlayerAuto(player._trueMe);
				else delete game.notMe;
				if (_status.auto) ui.click.auto();
			}
			delete player._trueMe;
		},
	},
	taffychusheng: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		// limited:true,
		// skillAnimation:true,
		// animationColor:'fire',
		filter: function (event, player) {
			game.hasPlayer(current => {
				return current.hasSex("male") && current.countMark("taffyzuoai") > 2;
			});
		},
		filterTarget: function (card, player, current) {
			return current != player && current.hasSex("male") && current.countMark("taffyzuoai") > 2;
		},
		onremove: true,
		prompt: "选择一名“❤”标记数不小于3的其他男性角色将其武将牌替换为“小菲”",
		content: function () {
			"step 0";
			player.loseMaxHp();
			event.target = target;
			player.line(target, "fire");
			if (target.name2 != undefined) {
				target.chooseControl(target.name1, target.name2).set("prompt", "请选择要更换的武将牌");
			} else
				event._result = {
					control: target.name1,
				};
			("step 1");
			target.reinit(result.control, "minitaffy");
			if (target.name == "minitaffy" && target.group != "qun") target.changeGroup("qun");
			if (_status.characterlist) {
				_status.characterlist.add(result.control);
				_status.characterlist.remove("minitaffy");
			}
		},
		ai: {},
	},
	// 小菲
	taffytangshi: {
		audio: 6,
		enable: "phaseUse",
		content: () => {},
		ai: {
			order: 7,
			result: {
				player: player => {
					if (!player.storage.taffytangshicount) {
						player.storage.taffytangshicount = {
							count: 2,
							isEnd: false,
						};
					}
					if (player.storage.taffytangshicount.isEnd) {
						player.storage.taffytangshicount.count = 2;
						player.storage.taffytangshicount.isEnd = false;
					}
					player.storage.taffytangshicount.count--;
					if (player.storage.taffytangshicount.count === 0) {
						player.storage.taffytangshicount.isEnd = true;
					}
					return player.storage.taffytangshicount.count;
				},
			},
		},
	},
	taffyzisha: {
		audio: 1,
		enable: "phaseUse",
		usable: 1,
		content: () => {
			player.die();
		},
	},
	// 新杀许劭
	taffydc_pingjian: {
		initList: function () {
			var list = [];
			if (_status.connectMode) list = get.charactersOL();
			else {
				var list = [];
				for (var i in lib.character) {
					if (!lib.filter.characterDisabled2(i) && !lib.filter.characterDisabled(i)) list.push(i);
				}
			}
			game.countPlayer2(function (current) {
				list.remove(current.name);
				list.remove(current.name1);
				list.remove(current.name2);
			});
			_status.characterlist = list;
		},
		init: function (player) {
			player.addSkill("taffydc_pingjian_check");
			if (!player.storage.taffydc_pingjian_check) player.storage.taffydc_pingjian_check = {};
		},
		onremove: function (player) {
			player.removeSkill("taffydc_pingjian_check");
		},
		audio: 2,
		trigger: {
			player: ["damageEnd", "phaseJieshuBegin"],
		},
		frequent: true,
		content: function () {
			"step 0";
			if (!_status.characterlist || !_status.pingjianInitialized) {
				_status.pingjianInitialized = true;
				lib.skill.taffydc_pingjian.initList();
			}
			var allList = [
				// 结束阶段
				"simalang",
				"xin_yufan",
				"sp_liuqi",
				"re_diaochan",
				"re_guohuai",
				"zhanggong", // 镇行只有结束阶段
				"sp_caiwenji",
				"zhugezhan",
				"caoying",
				"sp_jiangwei",
				"caoren",
				"haozhao",
				"re_guyong",
				"re_wangyi",
				"xin_liru",
				"caojie",
				"zhoufang",
				"re_kanze",
				"hanfu",
				"zhangxun",
				"yujin_yujin",
				"xin_xushu",
				"wuxian",
				"zhugeruoxue",
				"dc_huanghao",
				// 受到伤害
				"re_quancong",
				"guohuanghou",
				"shen_caocao",
				"chengyu",
				"re_simayi",
				"re_xiahoudun",
				"re_guojia",
				"re_caocao",
				"re_fazheng",
				"wangrong",
				"xizhicai",
				"xunyu",
				"caopi",
				"caozhi",
				"re_caochong",
				"caorui",
				// 'gz_re_lidian',
				"re_lidian",
				"manchong",
				"re_chengong",
				"re_xunyou",
				"heyan",
				"huaxin",
				"caomao",
				"ol_yangyi", // 结束阶段没有狷狭
				"dukui",
			];
			var list = [];
			var skills = [];
			var map = [];
			allList.randomSort();
			var name2 = event.triggername;
			for (var i = 0; i < allList.length; i++) {
				var name = allList[i];
				if (name.indexOf("zuoci") != -1 || name.indexOf("xushao") != -1 || name.indexOf("taffyhuiwan_xushao") != -1 || name.indexOf("taffyre_xushao") != -1 || name.indexOf("taffyshen_xushao") != -1) continue;
				var skills2;
				if (name === "old_re_lidian") {
					skills2 = ["wangxi"];
				} else {
					skills2 = lib.character[name][3];
				}
				for (var j = 0; j < skills2.length; j++) {
					if (player.getStorage("taffydc_pingjian").includes(skills2[j])) continue;
					if (skills.includes(skills2[j])) {
						list.add(name);
						if (!map[name]) map[name] = [];
						map[name].add(skills2[j]);
						skills.add(skills2[j]);
						continue;
					}
					if (name2 === "damageEnd") {
						if (skills2[j] === "xinyaoming") {
							list.add(name);
							if (!map[name]) map[name] = [];
							map[name].add(skills2[j]);
							skills.add(skills2[j]);
							continue;
						} else if (skills2[j] === "xinfu_zhenxing") {
							continue;
						}
					} else if (name2 === "phaseJieshuBegin") {
						if (skills2[j] === "daiyan") {
							list.add(name);
							if (!map[name]) map[name] = [];
							map[name].add(skills2[j]);
							skills.add(skills2[j]);
							continue;
						} else if (skills2[j] === "junbing") {
							list.add(name);
							if (!map[name]) map[name] = [];
							map[name].add(skills2[j]);
							skills.add(skills2[j]);
							continue;
						} else if (skills2[j] === "oljuanxia") {
							continue;
						}
					}
					var list2 = [skills2[j]];
					game.expandSkills(list2);
					for (var k = 0; k < list2.length; k++) {
						var info = lib.skill[list2[k]];
						if (!info || !info.trigger || !info.trigger.player || info.silent || info.limited || info.juexingji || info.zhuanhuanji || info.hiddenSkill || info.dutySkill) continue;
						if (info.trigger.player == name2 || (Array.isArray(info.trigger.player) && info.trigger.player.includes(name2))) {
							if (info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) continue;
							if (info.init) continue;
							if (info.filter) {
								try {
									var bool = info.filter(trigger, player, name2);
									if (!bool) continue;
								} catch (e) {
									continue;
								}
							}
							list.add(name);
							if (!map[name]) map[name] = [];
							map[name].add(skills2[j]);
							skills.add(skills2[j]);
							break;
						}
					}
				}
				if (list.length > 2) break;
			}
			if (skills.length) {
				event.list = list;
				player.chooseControl(skills).set("dialog", ["评荐：请选择尝试发动的技能", [list, "character"]]);
			} else event.finish();
			("step 1");
			player.markAuto("taffydc_pingjian", [result.control]);
			player.addTempSkill(result.control);
			player.storage.taffydc_pingjian_check[result.control] = trigger.name == "damage" ? trigger : "phaseJieshu";
			var name = event.list.find(name => lib.character[name][3].includes(result.control));
			// if(name) lib.skill.rehuashen.createAudio(name,result.control,'xushao');
			if (name) game.broadcastAll((player, name) => player.tempname.add(name), player, name);
		},
		group: "taffydc_pingjian_use",
		phaseUse_special: [],
		ai: {
			threaten: 5,
		},
	},
	taffydc_pingjian_use: {
		audio: "taffydc_pingjian",
		enable: "phaseUse",
		usable: 1,
		prompt: () => lib.translate.taffydc_pingjian_info,
		content: function () {
			"step 0";
			var list = [];
			var skills = [];
			var map = [];
			var evt = event.getParent(2);
			if (!_status.characterlist || !_status.pingjianInitialized) {
				_status.pingjianInitialized = true;
				lib.skill.taffydc_pingjian.initList();
			}
			var allList = [
				// "caoying", // 凌人被删，想你了牢婴
				"zhangxingcai",
				"dianwei",
				"re_yuanshao",
				"re_masu",
				"guanyinping",
				"huangfusong",
				"re_guanyu",
				"jianggan",
				"xin_gaoshun",
				"taishici",
				"liuchen",
				"huaman",
				"dc_wangyun", // 技能描述好像有点不对，但是无名杀暂时没有完全一致的
				"re_zhangyi",
				"dingfeng", // 桶面的原画师国战版本的，但是无名杀没有找到国战版本的丁奉
				"pangtong",
				"dongzhuo",
				"re_sunluban",
				"zhugeke",
				"re_dongcheng",
				"huanggai",
				"re_xushu", // 衍生技：荐言（'jianyan'）
				"dc_liru",
				"re_sunquan",
				"re_daqiao",
				"re_guyong",
				"chenlin",
				"re_jsp_pangtong",
				"liyan",
				"shen_lvmeng",
				"zhangji",
				"xf_yiji",
				"guanlu",
				"wangrong",
				"re_dongbai",
				"re_zhouyu",
				"guosi",
				"re_zoushi",
				"zhaoyan",
				"zongyu",
				"re_dengzhi",
				"zhangwen",
				"shen_ganning",
				"xin_wuguotai",
				"re_ganning",
				"re_panfeng",
				"xunyou",
				"xin_handang",
				"re_gongsunyuan",
				"buzhi",
				"heqi",
				"zhanghu",
				"jiangwei",
				"re_huatuo",
				"simalang",
				"re_zhuzhi",
				"liuyan",
				"re_sunshangxiang",
				"dc_bulianshi",
				"re_chengong",
				"mizhu",
				"re_diaochan",
				"caorui",
				"re_liubei",
				"liuxie",
				"zhangchangpu",
				"re_lusu",
				"zhangzhang",
				"xunyu",
				"lvkai",
				"dc_jsp_guanyu", // 衍生技：怒嗔（'dcnuchen'）
				"xianglang",
				"re_xuhuang",
				"sp_zhugeliang",
				"wangping",
				"dc_chenqun",
				"tongyuan",
				"re_chendeng",
				"zhugeruoxue",
				"dc_sunchen",
				"re_hansui",
				"gaoxiang",
			];
			allList.randomSort();
			for (var i = 0; i < allList.length; i++) {
				var name = allList[i];
				if (name.indexOf("zuoci") != -1 || name.indexOf("xushao") != -1 || name.indexOf("taffyhuiwan_xushao") != -1 || name.indexOf("taffyre_xushao") != -1 || name.indexOf("taffyshen_xushao") != -1) continue;
				var skills2 = lib.character[name][3];
				for (var j = 0; j < skills2.length; j++) {
					if (player.getStorage("taffydc_pingjian").includes(skills2[j])) continue;
					if (skills2[j] === "qianxin") {
						list.add(name);
						if (!map[name]) map[name] = [];
						map[name].add("jianyan");
						skills.add("jianyan");
						continue;
					}
					if (skills2[j] === "nzry_feijun") {
						list.add(name);
						if (!map[name]) map[name] = [];
						map[name].add("nzry_feijun");
						skills.add("nzry_feijun");
						continue;
					}
					if (["rejijiang", "kanpo", "jijiu", "spniluan", "qinwang", "aocai"].includes(skills2[j])) {
						continue;
					}
					if (get.is.locked(skills2[j], player)) continue;
					var info = lib.translate[skills2[j] + "_info"];
					if (skills.includes(skills2[j]) || (info && info.indexOf("当你于出牌阶段") != -1 && info.indexOf("当你于出牌阶段外") == -1) || skills2[j] === "lijian" || skills2[j] === "xinmieji" || skills2[j] === "songci" || skills2[j] === "quji" || skills2[j] === "rechanhui" || skills2[j] === "xinkuangfu" || skills2[j] === "zhijian" || skills2[j] === "chaofeng" || skills2[j] === "quhu" || skills2[j] === "xinfu_lveming") {
						list.add(name);
						if (!map[name]) map[name] = [];
						map[name].add(skills2[j]);
						skills.add(skills2[j]);
						continue;
					}
					if (skills2[j] === "olshanxi") {
						list.add(name);
						if (!map[name]) map[name] = [];
						map[name].add("shanxi");
						skills.add("shanxi");
						continue;
					}
					if (skills2[j] === "new_rewusheng") {
						if (name === "dc_jsp_guanyu") {
							list.add(name);
							if (!map[name]) map[name] = [];
							map[name].add("dcnuchen");
							skills.add("dcnuchen");
							continue;
						} else {
							continue;
						}
					}
					var list2 = [skills2[j]];
					game.expandSkills(list2);
					for (var k = 0; k < list2.length; k++) {
						var info = lib.skill[list2[k]];
						if (!info || !info.enable || info.charlotte || info.limited || info.juexingji || info.zhuanhuanji || info.hiddenSkill || info.dutySkill) continue;
						if (info.enable == "phaseUse" || (Array.isArray(info.enable) && info.enable.includes("phaseUse")) || info.enable == "chooseToUse" || (Array.isArray(info.enable) && info.enable.includes("chooseToUse"))) {
							if (info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) continue;
							if (info.init || info.onChooseToUse) continue;
							if (info.filter) {
								try {
									var bool = info.filter(evt, player);
									if (!bool) continue;
								} catch (e) {
									continue;
								}
							} else if (info.viewAs && typeof info.viewAs != "function") {
								try {
									if (evt.filterCard && !evt.filterCard(info.viewAs, player, evt)) continue;
									if (info.viewAsFilter && info.viewAsFilter(player) == false) continue;
								} catch (e) {
									continue;
								}
							}
							list.add(name);
							if (!map[name]) map[name] = [];
							map[name].add(skills2[j]);
							skills.add(skills2[j]);
							break;
						}
					}
				}
				if (list.length > 2) break;
			}
			if (skills.length) {
				event.list = list;
				player.chooseControl(skills).set("dialog", ["评荐：请选择尝试发动的技能", [list, "character"]]);
			} else event.finish();
			("step 1");
			player.markAuto("taffydc_pingjian", [result.control]);
			player.addTempSkill(result.control);
			player.storage.taffydc_pingjian_check[result.control] = "phaseUse";
			var name = event.list.find(name => lib.character[name][3].includes(result.control));
			// if(name) lib.skill.rehuashen.createAudio(name,result.control,'xushao');
			if (name) game.broadcastAll((player, name) => player.tempname.add(name), player, name);
		},
		ai: {
			order: 12,
			result: {
				player: 1,
			},
		},
	},
	taffydc_pingjian_check: {
		charlotte: true,
		trigger: {
			player: ["useSkill", "logSkillBegin"],
		},
		filter: function (event, player) {
			var info = get.info(event.skill);
			if (info && info.charlotte) return false;
			var skill = event.sourceSkill || event.skill;
			return player.storage.taffydc_pingjian_check[skill];
		},
		direct: true,
		firstDo: true,
		priority: Infinity,
		content: function () {
			var skill = trigger.sourceSkill || trigger.skill;
			player.removeSkill(skill);
			const names = player.tempname && player.tempname.filter(i => lib.character[i][3].includes(skill));
			if (names) game.broadcastAll((player, names) => player.tempname.removeArray(names), player, names);
			delete player.storage.taffydc_pingjian_check[skill];
		},
		group: "taffydc_pingjian_check2",
	},
	taffydc_pingjian_check2: {
		charlotte: true,
		trigger: {
			player: ["phaseUseEnd", "damageEnd", "phaseJieshuBegin"],
		},
		filter: function (event, player) {
			return Object.keys(player.storage.taffydc_pingjian_check).find(function (skill) {
				if (event.name != "damage") return player.storage.taffydc_pingjian_check[skill] == event.name;
				return player.storage.taffydc_pingjian_check[skill] == event;
			});
		},
		direct: true,
		lastDo: true,
		priority: -Infinity,
		content: function () {
			var skills = Object.keys(player.storage.taffydc_pingjian_check).filter(function (skill) {
				if (trigger.name != "damage") return player.storage.taffydc_pingjian_check[skill] == trigger.name;
				return player.storage.taffydc_pingjian_check[skill] == trigger;
			});
			player.removeSkill(skills);
			const names = player.tempname && player.tempname.filter(i => skills.some(skill => lib.character[i][3].includes(skill)));
			if (names) game.broadcastAll((player, names) => player.tempname.removeArray(names), player, names);
			for (var skill of skills) delete player.storage.taffydc_pingjian_check[skill];
		},
	},
	// 会玩的许劭
	taffyhuiwan_pingjian: {
		derivation: "taffyhuiwan_pingjian_faq",
		initList: function () {
			var list = [];
			if (_status.connectMode) var list = get.charactersOL();
			else {
				var list = [];
				for (var i in lib.character) {
					if (!lib.filter.characterDisabled2(i) && !lib.filter.characterDisabled(i)) list.push(i);
				}
			}
			game.countPlayer2(function (current) {
				list.remove(current.name);
				list.remove(current.name1);
				list.remove(current.name2);
			});
			_status.characterlist = list;
		},
		hasCommonElement: function (array1, array2) {
			for (let i = 0; i < array1.length; i++) {
				if (array2.includes(array1[i])) {
					return true;
				}
			}
			return false;
		},
		getTriggerTranlation: function (triggerName) {
			let result;
			switch (triggerName) {
				// 评荐：回合开始前
				case "phaseBefore":
					result = '<div class="skill" style="width:115px!important;">【回合开始前】</div><div style="width:calc(100% - 115px);">翻面状态下可触发的时机 如:卑弥呼〖纵傀〗（特殊技能除外）</div>';
					break;
				case "phaseBegin":
					result = '<div class="skill" style="width:115px!important;">【回合开始时】</div><div style="width:calc(100% - 115px);">翻面状态下无法触发的时机 如:周宣〖寤寐〗（特殊技能除外）</div>';
					break;
				case "phaseChange":
					result = '<div class="skill" style="width:115px!important;">【阶段改变前】</div><div style="width:calc(100% - 115px);">任意两个阶段之间的时机 如:族吴苋〖贵相〗（特殊技能除外）</div>';
					break;
				case "phaseZhunbei":
					result = '<div class="skill" style="width:100px!important;">【准备阶段】</div><div style="width:calc(100% - 100px);">准备阶段开始前至准备阶段结束后的时机 如:手杀杨彪〖昭汉〗（特殊技能除外）</div>';
					break;
				case "phaseJudge":
					result = '<div class="skill" style="width:100px!important;">【判定阶段】</div><div style="width:calc(100% - 100px);">判定阶段开始前至判定阶段结束后的时机 如:合诸葛亮〖问天〗（特殊技能除外）</div>';
					break;
				case "phaseDraw":
					result = '<div class="skill" style="width:100px!important;">【摸牌阶段】</div><div style="width:calc(100% - 100px);">摸牌阶段开始前至摸牌阶段结束后的时机 如:高达一号〖绝境〗（特殊技能除外）</div>';
					break;
				case "phaseUseBegin":
					result = '<div class="skill" style="width:130px!important;">【出牌阶段开始】</div><div style="width:calc(100% - 130px);">出牌阶段开始前至出牌阶段开始时的时机 如:谋关羽〖武圣〗（特殊技能除外）</div>';
					break;
				// 评荐：结束阶段开始前
				case "phaseJieshu":
					result = '<div class="skill" style="width:100px!important;">【结束阶段】</div><div style="width:calc(100% - 100px);">结束阶段开始前至结束阶段结束后的时机<br/>如:曹华〖彩翼〗（特殊技能除外）</div>';
					break;
				case "phaseEnd":
					result = '<div class="skill" style="width:100px!important;">【回合结束】</div><div style="width:calc(100% - 100px);">回合结束时至回合结束后的时机<br/>如:神司马懿〖连破〗（特殊技能除外）</div>';
					break;
				// 评荐：当你即将受到伤害前
				case "damageBegin":
					result = '<div class="skill" style="width:110px!important;">【受到伤害前】</div><div style="width:calc(100% - 110px);">当你即将受到伤害前至当你受到伤害时的时机<br/>如:司马徽〖隐士〗（特殊技能除外）</div>';
					break;
				case "damageEnd":
					result = '<div class="skill" style="width:110px!important;">【受到伤害后】</div><div style="width:calc(100% - 110px);">当你受到伤害的点数确定时至当你受到伤害后的时机<br/>如:曹丕〖放逐〗（特殊技能除外）</div>';
					break;
				// 评荐：共用选项
				default:
					result = '<div class="skill">【以上所有时机范围】</div>';
					break;
			}
			return result;
		},
		getRelatedTriggers: function (triggerName, parentTriggerName) {
			let result;
			switch (triggerName) {
				// 评荐：回合开始前
				case "phaseBefore":
					result = ["phaseBeforeStart", "phaseBefore", "phaseBeforeEnd"];
					break;
				case "phaseBegin":
					result = ["phaseBeginStart", "phaseBegin"];
					break;
				case "phaseChange":
					result = ["phaseChange"];
					break;
				case "phaseZhunbei":
					result = ["phaseZhunbeiBefore", "phaseZhunbeiBegin", "phaseZhunbei", "phaseZhunbeiEnd", "phaseZhunbeiAfter"];
					break;
				case "phaseJudge":
					result = ["phaseJudgeBefore", "phaseJudgeBegin", "phaseJudge", "phaseJudgeEnd", "phaseJudgeAfter"];
					break;
				case "phaseDraw":
					result = ["phaseDrawBefore", "phaseDrawBegin", "phaseDrawBegin1", "phaseDrawBegin2", "phaseDraw", "phaseDrawEnd", "phaseDrawAfter"];
					break;
				case "phaseUseBegin":
					result = ["phaseUseBefore", "phaseUseBegin"];
					break;
				// 评荐：结束阶段开始前
				case "phaseJieshu":
					result = ["phaseJieshuBefore", "phaseJieshuBegin", "phaseJieshu", "phaseJieshuEnd", "phaseJieshuAfter"];
					break;
				case "phaseEnd":
					result = ["phaseEnd", "phaseAfter"];
					break;
				// 评荐：当你即将受到伤害前
				case "damageBegin":
					result = ["damageBefore", "damageBegin", "damageBegin2", "damageBegin3", "damageBegin4"];
					break;
				case "damageEnd":
					result = ["damage", "damageSource", "damageEnd", "damageAfter"];
					break;
				// 评荐：默认选项
				default:
					switch (parentTriggerName) {
						case "phaseBefore":
							result = ["phaseBeforeStart", "phaseBefore", "phaseBeforeEnd", "phaseBeginStart", "phaseBegin", "phaseChange", "phaseZhunbeiBefore", "phaseZhunbeiBegin", "phaseZhunbei", "phaseZhunbeiEnd", "phaseZhunbeiAfter", "phaseJudgeBefore", "phaseJudgeBegin", "phaseJudge", "phaseJudgeEnd", "phaseJudgeAfter", "phaseDrawBefore", "phaseDrawBegin", "phaseDrawBegin1", "phaseDrawBegin2", "phaseDraw", "phaseDrawEnd", "phaseDrawAfter", "phaseUseBefore", "phaseUseBegin"];
							break;
						case "phaseJieshuBefore":
							result = ["phaseJieshuBefore", "phaseJieshuBegin", "phaseJieshu", "phaseJieshuEnd", "phaseJieshuAfter", "phaseEnd", "phaseAfter"];
							break;
						case "damageBefore":
							result = ["damageBefore", "damageBegin", "damageBegin2", "damageBegin3", "damageBegin4", "damage", "damageSource", "damageEnd", "damageAfter"];
							break;
						default:
							result = [];
							break;
					}
					break;
			}
			return result;
		},
		audio: "taffyboss_pingjian",
		trigger: {
			player: ["damageBefore", "phaseJieshuBefore", "phaseBefore"],
		},
		frequent: true,
		content: function () {
			"step 0";
			if (!player.storage.taffyhuiwan_pingjianX && player.storage.taffyhuiwan_pingjianX !== 0) player.storage.taffyhuiwan_pingjianX = 0;
			var skills = player.getSkills(null, false, false).filter(skill => {
				var info = get.info(skill);
				if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
				const tempSkills = Object.keys(player.tempSkills);
				if (tempSkills.includes(skill)) {
					return false;
				}
				const additionalSkills = Object.keys(player.additionalSkills);
				for (let i = 0; i < additionalSkills.length; i++) {
					if (player.additionalSkills[additionalSkills[i]].includes(skill)) {
						return false;
					}
				}
				return true;
			});
			if (skills.length < 2) player.storage.taffyhuiwan_pingjianX = 1;
			var next = player.chooseButton(true, ["评荐：选择失去任意个技能", [skills.map(i => [i, '<div class="popup text" style="width:calc(100% - 25px);display:inline-block"><div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player) + "</div></div>"]), "textbutton"]]);
			next.set("selectButton", [0, skills.length]);
			next.set("ai", function (button) {
				if (button.link == "taffyhuiwan_pingjian") return -1;
				return Math.random();
			});
			("step 1");
			if (result.bool) {
				if (result.links.length === 0 && player.storage.taffyhuiwan_pingjianX === 0) {
					event.finish();
				} else {
					let rSkillInfo;
					for (let i = 0; i < result.links.length; i++) {
						rSkillInfo = get.info(result.links[i]);
						if (rSkillInfo.limited || rSkillInfo.juexingji || rSkillInfo.dutySkill) {
							player.restoreSkill(result.links[i]);
						}
						player.removeSkill(result.links[i]);
						game.log(player, "失去了技能", "#g【" + get.translation(result.links[i]) + "】");
					}
					event.taffyLostSkillNum = result.links.length;
					// 玩家可主动选择具体时机
					let triggerOptions = [];
					if (event.triggername === "phaseBefore") {
						triggerOptions = ["phaseBefore", "phaseBegin", "phaseChange", "phaseZhunbei", "phaseJudge", "phaseDraw", "phaseUseBegin"];
					} else if (event.triggername === "phaseJieshuBefore") {
						triggerOptions = ["phaseJieshu", "phaseEnd"];
					} else if (event.triggername === "damageBefore") {
						triggerOptions = ["damageBegin", "damageEnd"];
					}
					var next = player.chooseButton(true, ["评荐：选择任意个要检索的时机范围", [triggerOptions.map(i => [i, '<div class="popup text" style="width:calc(100% - 25px);display:inline-block">' + lib.skill.taffyhuiwan_pingjian.getTriggerTranlation(i) + "</div>"]), "textbutton"]]);
					next.set("selectButton", [0, triggerOptions.length]);
					next.set("ai", function (button) {
						var player = _status.event.player;
						switch (button.link) {
							case "damageBegin":
								return player.hp + player.hujia > 2 ? -1 : 1;
							case "damageEnd":
								return player.hp + player.hujia > 2 ? 1 : -1;
							default:
								return Math.random();
						}
					});
				}
			}
			("step 2");
			if (result.bool) {
				var name2 = event.triggername;
				if (result.links.length === 0) {
					name2 = lib.skill.taffyhuiwan_pingjian.getRelatedTriggers("all", event.triggername);
				} else {
					let triggerList = [];
					for (let i = 0; i < result.links.length; i++) {
						triggerList.push(...lib.skill.taffyhuiwan_pingjian.getRelatedTriggers(result.links[i], event.triggername));
					}
					name2 = triggerList;
				}
				if (!_status.characterlist || !_status.pingjianInitialized) {
					_status.pingjianInitialized = true;
					lib.skill.taffyhuiwan_pingjian.initList();
				}
				var allList = _status.characterlist.slice(0);
				game.countPlayer(function (current) {
					if (current.name && lib.character[current.name] && current.name.indexOf("gz_shibing") != 0 && current.name.indexOf("gz_jun_") != 0) allList.add(current.name);
					if (current.name1 && lib.character[current.name1] && current.name1.indexOf("gz_shibing") != 0 && current.name1.indexOf("gz_jun_") != 0) allList.add(current.name1);
					if (current.name2 && lib.character[current.name2] && current.name2.indexOf("gz_shibing") != 0 && current.name2.indexOf("gz_jun_") != 0) allList.add(current.name2);
				});
				var list = [];
				var skills = [];
				var map = [];
				let name3 = [];
				allList.randomSort();
				for (let i = 0; i < allList.length; i++) {
					var name = allList[i];
					if (name.indexOf("xushao") != -1 || name.indexOf("taffyboss_xushao") != -1 || name.indexOf("taffydc_xushao") != -1 || name.indexOf("taffyhuiwan_xushao") != -1 || name.indexOf("taffyre_xushao") != -1 || name.indexOf("taffyshen_xushao") != -1) continue;
					var skills2 = lib.character[name][3];
					for (let j = 0; j < skills2.length; j++) {
						var playerSkills = player.getSkills(null, false, false).filter(skill => {
							var info = get.info(skill);
							if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
							return true;
						});
						if (playerSkills.includes(skills2[j])) continue;
						if (skills.includes(skills2[j])) {
							list.add(name);
							if (!map[name]) map[name] = [];
							map[name].add(skills2[j]);
							skills.add(skills2[j]);
							continue;
						}
						var list2 = [skills2[j]];
						game.expandSkills(list2);
						for (let k = 0; k < list2.length; k++) {
							var info = lib.skill[list2[k]];
							if (!info || !info.trigger || info.charlotte || info.limited || info.juexingji || info.hiddenSkill || info.dutySkill || info.zhuSkill) {
								if (k === 0) break;
								else continue;
							}
							if (info.trigger.player) {
								if ((name3.length === 0 ? name2.includes(info.trigger.player) : name3.includes(info.trigger.player)) || (Array.isArray(info.trigger.player) && lib.skill.taffyhuiwan_pingjian.hasCommonElement(info.trigger.player, name3.length === 0 ? name2 : name3))) {
									if (info.filter) {
										try {
											var bool = info.filter(trigger, player);
											if (!bool) continue;
										} catch (e) {
											continue;
										}
									}
									list.add(name);
									if (!map[name]) map[name] = [];
									map[name].add(skills2[j]);
									skills.add(skills2[j]);
									break;
								}
							}
							if (info.trigger.global) {
								if ((name3.length === 0 ? name2.includes(info.trigger.global) : name3.includes(info.trigger.global)) || (Array.isArray(info.trigger.global) && lib.skill.taffyhuiwan_pingjian.hasCommonElement(info.trigger.global, name3.length === 0 ? name2 : name3))) {
									if (info.filter) {
										try {
											var bool = info.filter(trigger, player);
											if (!bool) continue;
										} catch (e) {
											continue;
										}
									}
									list.add(name);
									if (!map[name]) map[name] = [];
									map[name].add(skills2[j]);
									skills.add(skills2[j]);
									break;
								}
							}
						}
					}
					// 如果有抽到该武将牌，则将时机改为以上所有时机再重新遍历一次
					if (list.includes(name) && name2.length !== lib.skill.taffyhuiwan_pingjian.getRelatedTriggers("all", event.triggername).length && name3.length === 0) {
						name3 = lib.skill.taffyhuiwan_pingjian.getRelatedTriggers("all", event.triggername);
						i--;
						continue;
					} else {
						name3 = [];
					}
					if (list.length >= 2 * (event.taffyLostSkillNum + player.storage.taffyhuiwan_pingjianX) + 1) break;
				}
				if (list.length < 2 * (event.taffyLostSkillNum + player.storage.taffyhuiwan_pingjianX) + 1) {
					name2 = lib.skill.taffyhuiwan_pingjian.getRelatedTriggers("all", event.triggername);
					for (let i = 0; i < allList.length; i++) {
						var name = allList[i];
						if (name.indexOf("xushao") != -1 || name.indexOf("taffyboss_xushao") != -1 || name.indexOf("taffydc_xushao") != -1 || name.indexOf("taffyhuiwan_xushao") != -1 || name.indexOf("taffyre_xushao") != -1 || name.indexOf("taffyshen_xushao") != -1) continue;
						var skills2 = lib.character[name][3];
						for (let j = 0; j < skills2.length; j++) {
							var playerSkills = player.getSkills(null, false, false).filter(skill => {
								var info = get.info(skill);
								if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
								return true;
							});
							if (playerSkills.includes(skills2[j])) continue;
							if (skills.includes(skills2[j])) {
								list.add(name);
								if (!map[name]) map[name] = [];
								map[name].add(skills2[j]);
								skills.add(skills2[j]);
								continue;
							}
							var list2 = [skills2[j]];
							game.expandSkills(list2);
							for (let k = 0; k < list2.length; k++) {
								var info = lib.skill[list2[k]];
								if (!info || !info.trigger || info.charlotte || info.limited || info.juexingji || info.hiddenSkill || info.dutySkill || info.zhuSkill) {
									if (k === 0) break;
									else continue;
								}
								if (info.trigger.player) {
									if (name2.includes(info.trigger.player) || (Array.isArray(info.trigger.player) && lib.skill.taffyhuiwan_pingjian.hasCommonElement(info.trigger.player, name2))) {
										if (info.filter) {
											try {
												var bool = info.filter(trigger, player);
												if (!bool) continue;
											} catch (e) {
												continue;
											}
										}
										list.add(name);
										if (!map[name]) map[name] = [];
										map[name].add(skills2[j]);
										skills.add(skills2[j]);
										break;
									}
								}
								if (info.trigger.global) {
									if (name2.includes(info.trigger.global) || (Array.isArray(info.trigger.global) && lib.skill.taffyhuiwan_pingjian.hasCommonElement(info.trigger.global, name2))) {
										if (info.filter) {
											try {
												var bool = info.filter(trigger, player);
												if (!bool) continue;
											} catch (e) {
												continue;
											}
										}
										list.add(name);
										if (!map[name]) map[name] = [];
										map[name].add(skills2[j]);
										skills.add(skills2[j]);
										break;
									}
								}
							}
						}
						if (list.length >= 2 * (event.taffyLostSkillNum + player.storage.taffyhuiwan_pingjianX) + 1) break;
					}
				}
				if (skills.length) {
					event.list = list;
					if (player.isUnderControl()) {
						game.swapPlayerAuto(player);
					}
					var switchToAuto = function () {
						_status.imchoosing = false;
						event._result = {
							bool: true,
							skills: skills.randomGets(event.taffyLostSkillNum + player.storage.taffyhuiwan_pingjianX),
						};
						if (event.dialog) event.dialog.close();
						if (event.control) event.control.close();
					};
					var chooseButton = function (list, skills, result, player) {
						var event = _status.event;
						if (!event._result) event._result = {};
						event._result.skills = [];
						var rSkill = event._result.skills;
						var dialog = ui.create.dialog("评荐：选择获得至多" + get.cnNumber(event.taffyLostSkillNum + player.storage.taffyhuiwan_pingjianX) + "个技能", [list, "character"], "hidden");
						event.dialog = dialog;
						var table = document.createElement("div");
						table.classList.add("add-setting");
						table.style.margin = "0";
						table.style.width = "100%";
						table.style.position = "relative";
						for (var i = 0; i < skills.length; i++) {
							var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
							td.link = skills[i];
							table.appendChild(td);
							td.innerHTML = "<span>" + get.translation(skills[i]) + "</span>";
							td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
								if (_status.dragged) return;
								if (_status.justdragged) return;
								_status.tempNoButton = true;
								setTimeout(function () {
									_status.tempNoButton = false;
								}, 500);
								var link = this.link;
								if (!this.classList.contains("bluebg")) {
									if (rSkill.length >= event.taffyLostSkillNum + player.storage.taffyhuiwan_pingjianX) return;
									rSkill.add(link);
									this.classList.add("bluebg");
								} else {
									this.classList.remove("bluebg");
									rSkill.remove(link);
								}
							});
						}
						dialog.content.appendChild(table);
						dialog.add("　　");
						dialog.open();
						event.switchToAuto = function () {
							event.dialog.close();
							event.control.close();
							game.resume();
							_status.imchoosing = false;
						};
						event.control = ui.create.control("ok", function (link) {
							event.dialog.close();
							event.control.close();
							game.resume();
							_status.imchoosing = false;
						});
						for (var i = 0; i < event.dialog.buttons.length; i++) {
							event.dialog.buttons[i].classList.add("selectable");
						}
						game.pause();
						game.countChoose();
					};
					if (event.isMine()) {
						chooseButton(list, skills, result, player);
					} else if (event.isOnline()) {
						event.player.send(chooseButton, list, skills, result, player);
						event.player.wait();
						game.pause();
					} else {
						switchToAuto();
					}
				} else {
					event.finish();
				}
			}
			("step 3");
			var map = event.result || result;
			if (map && map.skills && map.skills.length) {
				for (var i of map.skills) {
					player.addSkill(i);
					game.log(player, "获得了技能", "#g【" + get.translation(i) + "】");
					var name = event.list.find(name => lib.character[name][3].includes(i));
					if (name) game.broadcastAll((player, name) => player.tempname.add(name), player, name);
				}
				player.storage.taffyhuiwan_pingjianX = 0;
			}
		},
		group: ["taffyhuiwan_pingjian_use"],
		phaseUse_special: [],
		ai: {
			threaten: 99,
		},
	},
	taffyhuiwan_pingjian_use: {
		audio: "taffyboss_pingjian",
		enable: "phaseUse",
		usable: 1,
		prompt: () => lib.translate.taffyhuiwan_pingjian_info,
		getTriggerTranlation: function (triggerName) {
			let result;
			switch (triggerName) {
				case "phaseUse":
					result = '<div class="skill" style="width:100px!important;">【出牌阶段】</div><div style="width:calc(100% - 100px);">出牌阶段至出牌阶段结束后的时机 如:经典刘备〖仁德〗（特殊技能除外）</div>';
					break;
				case "phaseChange":
					result = '<div class="skill" style="width:115px!important;">【阶段改变前】</div><div style="width:calc(100% - 115px);">任意两个阶段之间的时机 如:族吴苋〖贵相〗（特殊技能除外）</div>';
					break;
				case "phaseDiscard":
					result = '<div class="skill" style="width:100px!important;">【弃牌阶段】</div><div style="width:calc(100% - 100px);">弃牌阶段开始前至弃牌阶段结束后的时机 如:滕芳兰〖哀尘〗（特殊技能除外）</div>';
					break;
				case "random":
					result = '<div class="skill" style="width:100px!important;">【任意时机】</div><div style="width:calc(100% - 100px);">随机检索任意技能（可检索主公技，限定技，觉醒技，隐匿技、使命技等特殊技能）</div>';
					break;
				// 评荐：共用选项
				default:
					result = '<div class="skill">【以上所有时机范围】</div>';
					break;
			}
			return result;
		},
		getRelatedTriggers: function (triggerName, parentTriggerName) {
			let result;
			switch (triggerName) {
				case "phaseUse":
					result = ["phaseUseEnd", "phaseUseAfter"];
					break;
				case "phaseChange":
					result = ["phaseChange"];
					break;
				case "phaseDiscard":
					result = ["phaseDiscardBefore", "phaseDiscardBegin", "phaseDiscard", "phaseDiscardEnd", "phaseDiscardAfter"];
					break;
				case "random":
					result = ["random"];
					break;
				// 评荐：默认选项
				default:
					result = ["phaseUseEnd", "phaseUseAfter", "phaseChange", "phaseDiscardBefore", "phaseDiscardBegin", "phaseDiscard", "phaseDiscardEnd", "phaseDiscardAfter"];
					break;
			}
			return result;
		},
		content: function () {
			"step 0";
			if (!player.storage.taffyhuiwan_pingjianX && player.storage.taffyhuiwan_pingjianX !== 0) player.storage.taffyhuiwan_pingjianX = 0;
			var skills = player.getSkills(null, false, false).filter(skill => {
				var info = get.info(skill);
				if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
				const tempSkills = Object.keys(player.tempSkills);
				if (tempSkills.includes(skill)) {
					return false;
				}
				const additionalSkills = Object.keys(player.additionalSkills);
				for (let i = 0; i < additionalSkills.length; i++) {
					if (player.additionalSkills[additionalSkills[i]].includes(skill)) {
						return false;
					}
				}
				return true;
			});
			if (skills.length < 2) player.storage.taffyhuiwan_pingjianX = 1;
			var next = player.chooseButton(true, ["评荐：选择失去任意个技能", [skills.map(i => [i, '<div class="popup text" style="width:calc(100% - 25px);display:inline-block"><div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player) + "</div></div>"]), "textbutton"]]);
			next.set("selectButton", [0, skills.length]);
			next.set("ai", function (button) {
				if (button.link == "taffyhuiwan_pingjian") return -1;
				return Math.random();
			});
			("step 1");
			if (result.bool) {
				if (result.links.length === 0 && player.storage.taffyhuiwan_pingjianX === 0) {
					event.finish();
				} else {
					let rSkillInfo;
					for (let i = 0; i < result.links.length; i++) {
						rSkillInfo = get.info(result.links[i]);
						if (rSkillInfo.limited || rSkillInfo.juexingji || rSkillInfo.dutySkill) {
							player.restoreSkill(result.links[i]);
						}
						player.removeSkill(result.links[i]);
						game.log(player, "失去了技能", "#g【" + get.translation(result.links[i]) + "】");
					}
					event.taffyLostSkillNum = result.links.length;
					// 玩家可主动选择具体时机
					let triggerOptions = ["phaseUse", "phaseChange", "phaseDiscard", "random"];
					var next = player.chooseButton(true, ["评荐：选择任意个要检索的时机范围", [triggerOptions.map(i => [i, '<div class="popup text" style="width:calc(100% - 25px);display:inline-block">' + lib.skill.taffyhuiwan_pingjian_use.getTriggerTranlation(i) + "</div>"]), "textbutton"]]);
					next.set("selectButton", [0, triggerOptions.length]);
					next.set("ai", function (button) {
						return Math.random();
					});
				}
			}
			("step 2");
			if (result.bool) {
				var name2;
				if (result.links.length === 0) {
					name2 = lib.skill.taffyhuiwan_pingjian_use.getRelatedTriggers("all");
				} else {
					let triggerList = [];
					for (let i = 0; i < result.links.length; i++) {
						triggerList.push(...lib.skill.taffyhuiwan_pingjian_use.getRelatedTriggers(result.links[i]));
					}
					name2 = triggerList;
				}
				if (!_status.characterlist || !_status.pingjianInitialized) {
					_status.pingjianInitialized = true;
					lib.skill.taffyhuiwan_pingjian.initList();
				}
				var allList = _status.characterlist.slice(0);
				game.countPlayer(function (current) {
					if (current.name && lib.character[current.name] && current.name.indexOf("gz_shibing") != 0 && current.name.indexOf("gz_jun_") != 0) allList.add(current.name);
					if (current.name1 && lib.character[current.name1] && current.name1.indexOf("gz_shibing") != 0 && current.name1.indexOf("gz_jun_") != 0) allList.add(current.name1);
					if (current.name2 && lib.character[current.name2] && current.name2.indexOf("gz_shibing") != 0 && current.name2.indexOf("gz_jun_") != 0) allList.add(current.name2);
				});
				var list = [];
				var skills = [];
				var map = [];
				var evt = event.getParent(2);
				let name3 = [];
				allList.randomSort();
				for (let i = 0; i < allList.length; i++) {
					var name = allList[i];
					if (name.indexOf("xushao") != -1 || name.indexOf("taffyboss_xushao") != -1 || name.indexOf("taffydc_xushao") != -1 || name.indexOf("taffyhuiwan_xushao") != -1 || name.indexOf("taffyre_xushao") != -1 || name.indexOf("taffyshen_xushao") != -1) continue;
					var skills2 = lib.character[name][3];
					for (let j = 0; j < skills2.length; j++) {
						var playerSkills = player.getSkills(null, false, false).filter(skill => {
							var info = get.info(skill);
							if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
							return true;
						});
						if (playerSkills.includes(skills2[j])) continue;
						if (name3.length !== 0) {
							list.add(name);
							if (!map[name]) map[name] = [];
							map[name].add(skills2[j]);
							skills.add(skills2[j]);
							continue;
						}
						var info = lib.translate[skills2[j] + "_info"];
						if (skills.includes(skills2[j]) || ((name2.includes("phaseUseEnd") || name3.includes("phaseUseEnd")) && info && info.indexOf("当你于出牌阶段") != -1 && info.indexOf("当你于出牌阶段外") == -1)) {
							list.add(name);
							if (!map[name]) map[name] = [];
							map[name].add(skills2[j]);
							skills.add(skills2[j]);
							continue;
						}
						var list2 = [skills2[j]];
						game.expandSkills(list2);
						for (let k = 0; k < list2.length; k++) {
							var info = lib.skill[list2[k]];
							if (name2.includes("random")) {
								if (!info) continue;
								list.add(name);
								if (!map[name]) map[name] = [];
								map[name].add(skills2[j]);
								skills.add(skills2[j]);
								break;
							}
							if (!info || (!info.trigger && !info.enable) || info.charlotte || info.limited || info.juexingji || info.hiddenSkill || info.dutySkill || info.zhuSkill) {
								if (k === 0) break;
								else continue;
							}
							if (info.enable && (name2.includes("phaseUseEnd") || name3.includes("phaseUseEnd"))) {
								if (info.enable == "phaseUse" || (Array.isArray(info.enable) && info.enable.includes("phaseUse")) || info.enable == "chooseToUse" || (Array.isArray(info.enable) && info.enable.includes("chooseToUse"))) {
									if (info.filter) {
										try {
											var bool = info.filter(evt, player);
											if (!bool) continue;
										} catch (e) {
											continue;
										}
									} else if (info.viewAs && typeof info.viewAs != "function") {
										try {
											if (evt.filterCard && !evt.filterCard(info.viewAs, player, evt)) continue;
											if (info.viewAsFilter && info.viewAsFilter(player) == false) continue;
										} catch (e) {
											continue;
										}
									}
									list.add(name);
									if (!map[name]) map[name] = [];
									map[name].add(skills2[j]);
									skills.add(skills2[j]);
									break;
								}
							} else if (info.trigger) {
								if (info.trigger.player) {
									if ((name3.length === 0 ? name2.includes(info.trigger.player) : name3.includes(info.trigger.player)) || (Array.isArray(info.trigger.player) && lib.skill.taffyhuiwan_pingjian.hasCommonElement(info.trigger.player, name3.length === 0 ? name2 : name3))) {
										if (info.filter && !name2.includes("phaseDiscard") && !name2.includes("phaseChange")) {
											try {
												var bool = info.filter(trigger, player);
												if (!bool) continue;
											} catch (e) {
												continue;
											}
										}
										list.add(name);
										if (!map[name]) map[name] = [];
										map[name].add(skills2[j]);
										skills.add(skills2[j]);
										break;
									}
								}
								if (info.trigger.global) {
									if (((name3.length === 0 ? name2.includes(info.trigger.global) : name3.includes(info.trigger.global)) || (Array.isArray(info.trigger.global) && lib.skill.taffyhuiwan_pingjian.hasCommonElement(info.trigger.global, name3.length === 0 ? name2 : name3))) && (!info.trigger.player || info.trigger.player !== "enterGame" || (Array.isArray(info.trigger.player) && !info.trigger.player.includes("enterGame")))) {
										if (info.filter && !name2.includes("phaseDiscard") && !name2.includes("phaseChange")) {
											try {
												var bool = info.filter(trigger, player);
												if (!bool) continue;
											} catch (e) {
												continue;
											}
										}
										list.add(name);
										if (!map[name]) map[name] = [];
										map[name].add(skills2[j]);
										skills.add(skills2[j]);
										break;
									}
								}
							}
						}
					}
					// 如果有抽到该武将牌，则将时机改为以上所有时机再重新遍历一次
					if (list.includes(name) && name3.length === 0) {
						name3 = lib.skill.taffyhuiwan_pingjian_use.getRelatedTriggers("all");
						i--;
						continue;
					} else {
						name3 = [];
					}
					if (list.length >= 2 * (event.taffyLostSkillNum + player.storage.taffyhuiwan_pingjianX) + 1) break;
				}
				if (list.length < 2 * (event.taffyLostSkillNum + player.storage.taffyhuiwan_pingjianX) + 1) {
					name2 = lib.skill.taffyhuiwan_pingjian_use.getRelatedTriggers("all");
					name3 = [];
					for (let i = 0; i < allList.length; i++) {
						var name = allList[i];
						if (name.indexOf("xushao") != -1 || name.indexOf("taffyboss_xushao") != -1 || name.indexOf("taffydc_xushao") != -1 || name.indexOf("taffyhuiwan_xushao") != -1 || name.indexOf("taffyre_xushao") != -1 || name.indexOf("taffyshen_xushao") != -1) continue;
						var skills2 = lib.character[name][3];
						for (let j = 0; j < skills2.length; j++) {
							var playerSkills = player.getSkills(null, false, false).filter(skill => {
								var info = get.info(skill);
								if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
								return true;
							});
							if (playerSkills.includes(skills2[j])) continue;
							if (name3.length !== 0) {
								list.add(name);
								if (!map[name]) map[name] = [];
								map[name].add(skills2[j]);
								skills.add(skills2[j]);
								continue;
							}
							var info = lib.translate[skills2[j] + "_info"];
							if (skills.includes(skills2[j]) || ((name2.includes("phaseUseEnd") || name3.includes("phaseUseEnd")) && info && info.indexOf("当你于出牌阶段") != -1 && info.indexOf("当你于出牌阶段外") == -1)) {
								list.add(name);
								if (!map[name]) map[name] = [];
								map[name].add(skills2[j]);
								skills.add(skills2[j]);
								continue;
							}
							var list2 = [skills2[j]];
							game.expandSkills(list2);
							for (let k = 0; k < list2.length; k++) {
								var info = lib.skill[list2[k]];
								if (!info || (!info.trigger && !info.enable) || info.charlotte || info.limited || info.juexingji || info.hiddenSkill || info.dutySkill || info.zhuSkill) {
									if (k === 0) break;
									else continue;
								}
								if (info.enable && (name2.includes("phaseUseEnd") || name3.includes("phaseUseEnd"))) {
									if (info.enable == "phaseUse" || (Array.isArray(info.enable) && info.enable.includes("phaseUse")) || info.enable == "chooseToUse" || (Array.isArray(info.enable) && info.enable.includes("chooseToUse"))) {
										if (info.filter) {
											try {
												var bool = info.filter(evt, player);
												if (!bool) continue;
											} catch (e) {
												continue;
											}
										} else if (info.viewAs && typeof info.viewAs != "function") {
											try {
												if (evt.filterCard && !evt.filterCard(info.viewAs, player, evt)) continue;
												if (info.viewAsFilter && info.viewAsFilter(player) == false) continue;
											} catch (e) {
												continue;
											}
										}
										list.add(name);
										if (!map[name]) map[name] = [];
										map[name].add(skills2[j]);
										skills.add(skills2[j]);
										break;
									}
								} else if (info.trigger) {
									if (info.trigger.player) {
										if ((name3.length === 0 ? name2.includes(info.trigger.player) : name3.includes(info.trigger.player)) || (Array.isArray(info.trigger.player) && lib.skill.taffyhuiwan_pingjian.hasCommonElement(info.trigger.player, name3.length === 0 ? name2 : name3))) {
											if (info.filter) {
												try {
													var bool = info.filter(trigger, player);
													if (!bool) continue;
												} catch (e) {
													continue;
												}
											}
											list.add(name);
											if (!map[name]) map[name] = [];
											map[name].add(skills2[j]);
											skills.add(skills2[j]);
											break;
										}
									}
									if (info.trigger.global) {
										if (((name3.length === 0 ? name2.includes(info.trigger.global) : name3.includes(info.trigger.global)) || (Array.isArray(info.trigger.global) && lib.skill.taffyhuiwan_pingjian.hasCommonElement(info.trigger.global, name3.length === 0 ? name2 : name3))) && (!info.trigger.player || info.trigger.player !== "enterGame" || (Array.isArray(info.trigger.player) && !info.trigger.player.includes("enterGame")))) {
											if (info.filter) {
												try {
													var bool = info.filter(trigger, player);
													if (!bool) continue;
												} catch (e) {
													continue;
												}
											}
											list.add(name);
											if (!map[name]) map[name] = [];
											map[name].add(skills2[j]);
											skills.add(skills2[j]);
											break;
										}
									}
								}
							}
						}
						// 如果有抽到该武将牌，则将时机改为以上所有时机再重新遍历一次
						if (list.includes(name) && name3.length === 0) {
							name3 = lib.skill.taffyhuiwan_pingjian_use.getRelatedTriggers("all");
							i--;
							continue;
						} else {
							name3 = [];
						}
						if (list.length >= 2 * (event.taffyLostSkillNum + player.storage.taffyhuiwan_pingjianX) + 1) break;
					}
				}
				if (skills.length) {
					event.list = list;
					if (player.isUnderControl()) {
						game.swapPlayerAuto(player);
					}
					var switchToAuto = function () {
						_status.imchoosing = false;
						event._result = {
							bool: true,
							skills: skills.randomGets(event.taffyLostSkillNum + player.storage.taffyhuiwan_pingjianX),
						};
						if (event.dialog) event.dialog.close();
						if (event.control) event.control.close();
					};
					var chooseButton = function (list, skills, result, player) {
						var event = _status.event;
						if (!event._result) event._result = {};
						event._result.skills = [];
						var rSkill = event._result.skills;
						var dialog = ui.create.dialog("评荐：选择获得至多" + get.cnNumber(event.taffyLostSkillNum + player.storage.taffyhuiwan_pingjianX) + "个技能", [list, "character"], "hidden");
						event.dialog = dialog;
						var table = document.createElement("div");
						table.classList.add("add-setting");
						table.style.margin = "0";
						table.style.width = "100%";
						table.style.position = "relative";
						for (var i = 0; i < skills.length; i++) {
							var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
							td.link = skills[i];
							table.appendChild(td);
							td.innerHTML = "<span>" + get.translation(skills[i]) + "</span>";
							td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
								if (_status.dragged) return;
								if (_status.justdragged) return;
								_status.tempNoButton = true;
								setTimeout(function () {
									_status.tempNoButton = false;
								}, 500);
								var link = this.link;
								if (!this.classList.contains("bluebg")) {
									if (rSkill.length >= event.taffyLostSkillNum + player.storage.taffyhuiwan_pingjianX) return;
									rSkill.add(link);
									this.classList.add("bluebg");
								} else {
									this.classList.remove("bluebg");
									rSkill.remove(link);
								}
							});
						}
						dialog.content.appendChild(table);
						dialog.add("　　");
						dialog.open();
						event.switchToAuto = function () {
							event.dialog.close();
							event.control.close();
							game.resume();
							_status.imchoosing = false;
						};
						event.control = ui.create.control("ok", function (link) {
							event.dialog.close();
							event.control.close();
							game.resume();
							_status.imchoosing = false;
						});
						for (var i = 0; i < event.dialog.buttons.length; i++) {
							event.dialog.buttons[i].classList.add("selectable");
						}
						game.pause();
						game.countChoose();
					};
					if (event.isMine()) {
						chooseButton(list, skills, result, player);
					} else if (event.isOnline()) {
						event.player.send(chooseButton, list, skills, result, player);
						event.player.wait();
						game.pause();
					} else {
						switchToAuto();
					}
				} else {
					event.finish();
				}
			}
			("step 3");
			var map = event.result || result;
			if (map && map.skills && map.skills.length) {
				for (var i of map.skills) {
					player.addSkill(i);
					game.log(player, "获得了技能", "#g【" + get.translation(i) + "】");
					var name = event.list.find(name => lib.character[name][3].includes(i));
					if (name) game.broadcastAll((player, name) => player.tempname.add(name), player, name);
				}
				player.storage.taffyhuiwan_pingjianX = 0;
			}
		},
		ai: {
			order: 12,
			result: {
				player: 1,
			},
		},
	},
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
	// 神于吉
	taffyshen_guhuo: {
		audio: "old_guhuo",
		group: ["taffyshen_guhuo_guess"],
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard: function (player, name) {
			return lib.inpile.includes(name) && player.countCards("hs") > 0;
		},
		filter: function (event, player) {
			if (!player.countCards("hs")) return false;
			for (var i of lib.inpile) {
				var type = get.type2(i);
				if (
					(type == "basic" || type == "trick") &&
					event.filterCard(
						{
							name: i,
						},
						player,
						event
					)
				)
					return true;
				if (i == "sha") {
					for (var j of lib.inpile_nature) {
						if (
							event.filterCard(
								{
									name: i,
									nature: j,
								},
								player,
								event
							)
						)
							return true;
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog: function (event, player) {
				var list = [];
				for (var i of lib.inpile) {
					if (event.type != "phase")
						if (
							!event.filterCard(
								{
									name: i,
								},
								player,
								event
							)
						)
							continue;
					var type = get.type2(i);
					if (type == "basic" || type == "trick") list.push([type, "", i]);
					if (i == "sha") {
						if (event.type != "phase")
							if (
								!event.filterCard(
									{
										name: i,
										nature: j,
									},
									player,
									event
								)
							)
								continue;
						for (var j of lib.inpile_nature) list.push(["基本", "", "sha", j]);
					}
				}
				return ui.create.dialog("蛊惑", [list, "vcard"]);
			},
			filter: function (button, player) {
				var evt = _status.event.getParent();
				return evt.filterCard(
					{
						name: button.link[2],
						nature: button.link[3],
					},
					player,
					evt
				);
			},
			check: function (button) {
				var player = _status.event.player;
				var order = Math.max(0, get.order(card) + 1);
				var enemyNum = game.countPlayer(function (current) {
					return current != player && (get.realAttitude || get.attitude)(current, player) < 0 && current.hp > 0;
				});
				var card = {
					name: button.link[2],
					nature: button.link[3],
				};
				if (
					player.isDying() &&
					!player.hasCard(function (cardx) {
						// if(get.suit(cardx)!='heart') return false;
						var mod2 = game.checkMod(cardx, player, "unchanged", "cardEnabled2", player);
						if (mod2 != "unchanged") return mod2;
						var mod = game.checkMod(cardx, player, player, "unchanged", "cardSavable", player);
						if (mod != "unchanged") return mod;
						var savable = get.info(cardx).savable;
						if (typeof savable == "function") savable = savable(card, player, player);
						return savable;
					}, "hs")
				) {
					if (!player.getStorage("taffyshen_guhuo_cheated").includes(card.name + card.nature) && Math.random() < 0.4) return 1;
					return 0;
				}
				var val = _status.event.getParent().type == "phase" ? player.getUseValue(card) : 1;
				if (
					player.getStorage("taffyshen_guhuo_cheated").includes(card.name + card.nature) &&
					!player.hasCard(function (cardx) {
						if (card.name == cardx.name) {
							if (card.name != "sha") return true;
							return get.is.sameNature(card, cardx);
						}
						return false;
					}, "hs") &&
					Math.random() < 0.7
				)
					return 0;
				if (val <= 0) return 0;
				if (enemyNum) {
					if (
						!player.hasCard(function (cardx) {
							if (card.name == cardx.name) {
								if (card.name != "sha") return true;
								return get.is.sameNature(card, cardx);
							}
							return false;
						}, "hs")
					) {
						if (get.value(card, player, "raw") < 6) return Math.sqrt(val) * (0.25 + Math.random() / 1.5);
						if (enemyNum <= 2) return Math.sqrt(val) / 1.5 + order * 10;
						return 0;
					}
					return 3 * val + order * 10;
				}
				return val + order * 10;
			},
			backup: function (links, player) {
				return {
					filterCard: function (card, player, target) {
						var result = true;
						var suit = card.suit,
							number = card.number;
						card.suit = "none";
						card.number = null;
						var mod = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
						if (mod != "unchanged") result = mod;
						card.suit = suit;
						card.number = number;
						return result;
					},
					selectCard: 1,
					position: "hs",
					ignoreMod: true,
					aiUse: Math.random(),
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						suit: "none",
						number: null,
					},
					ai1: function (card) {
						var player = _status.event.player;
						var enemyNum = game.countPlayer(function (current) {
							return current != player && (get.realAttitude || get.attitude)(current, player) < 0 && current.hp > 0;
						});
						var cardx = lib.skill.taffyshen_guhuo_backup.viewAs;
						if (enemyNum) {
							if ((card.name == cardx.name && (card.name != "sha" || get.is.sameNature(card, cardx))) || player.getStorage("taffyshen_guhuo_cheated").includes(card.name + card.nature)) return 8 + Math.random() * 3;
							else if (lib.skill.taffyshen_guhuo_backup.aiUse < 0.5 && !player.isDying()) return 0;
						}
						return get.value(cardx) - get.value(card);
					},
					precontent: function () {
						player.logSkill("taffyshen_guhuo");
						var card = event.result.cards[0];
						event.result.card.suit = get.suit(card);
						event.result.card.number = get.number(card);
					},
				};
			},
			prompt: function (links, player) {
				return "将一张手牌当做" + (links[0][3] ? get.translation(links[0][3]) : "") + "【" + get.translation(links[0][2]) + "】" + (_status.event.name == "chooseToRespond" ? "打出" : "使用");
			},
		},
		ai: {
			save: true,
			respondSha: true,
			respondShan: true,
			fireAttack: true,
			skillTagFilter: function (player) {
				if (!player.countCards("hs")) return false;
			},
			threaten: 1.2,
			order: 10,
			result: {
				player: 1,
			},
		},
		subSkill: {
			cheated: {
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				charlotte: true,
				forced: true,
				silent: true,
				popup: false,
				firstDo: true,
				onremove: true,
				filter: function (event, player) {
					if (event.getParent().name == "draw") return true;
					var cards = event.getg(player);
					if (!cards.length) return false;
					return game.hasPlayer(current => {
						if (current == player) return false;
						var evt = event.getl(current);
						if (evt && evt.cards && evt.cards.length) return true;
						return false;
					});
				},
				content: function () {
					player.removeSkill("taffyshen_guhuo_cheated");
				},
			},
		},
	},
	taffyshen_guhuo_guess: {
		audio: "old_guhuo",
		trigger: {
			player: ["useCardBefore", "respondBefore"],
		},
		forced: true,
		silent: true,
		popup: false,
		firstDo: true,
		charlotte: true,
		filter: function (event, player) {
			return event.skill && event.skill.indexOf("taffyshen_guhuo_") == 0;
		},
		content: function () {
			"step 0";
			event.fake = false;
			event.goon = true;
			event.betrayers = [];
			event.taffyshen_guhuoShouldChoose = false;
			var card = trigger.cards[0];
			if (card.name != trigger.card.name || (card.name == "sha" && get.is.differentNature(trigger.card, card))) event.fake = true;
			if (event.fake) {
				player.addSkill("taffyshen_guhuo_cheated");
				player.markAuto("taffyshen_guhuo_cheated", [trigger.card.name + trigger.card.nature]);
			}
			player.popup(trigger.card.name, "metal");
			player.lose(card, ui.ordering).relatedEvent = trigger;
			trigger.throw = false;
			trigger.skill = "taffyshen_guhuo_backup";
			game.log(player, "声明", trigger.targets && trigger.targets.length ? "对" : "", trigger.targets || "", trigger.name == "useCard" ? "使用" : "打出", trigger.card);
			event.prompt = get.translation(player) + "声明" + (trigger.targets && trigger.targets.length ? "对" + get.translation(trigger.targets) : "") + (trigger.name == "useCard" ? "使用" : "打出") + (get.translation(trigger.card.nature) || "") + get.translation(trigger.card.name) + "，是否质疑？";
			event.targets = game.filterPlayer(i => i != player && i.hp > 0).sortBySeat(_status.currentPhase);

			game.broadcastAll(
				function (card, player) {
					_status.taffyshen_guhuoNode = card.copy("thrown");
					if (lib.config.cardback_style != "default") {
						_status.taffyshen_guhuoNode.style.transitionProperty = "none";
						ui.refresh(_status.taffyshen_guhuoNode);
						_status.taffyshen_guhuoNode.classList.add("infohidden");
						ui.refresh(_status.taffyshen_guhuoNode);
						_status.taffyshen_guhuoNode.style.transitionProperty = "";
					} else {
						_status.taffyshen_guhuoNode.classList.add("infohidden");
					}
					_status.taffyshen_guhuoNode.style.transform = "perspective(600px) rotateY(180deg) translateX(0)";
					player.$throwordered2(_status.taffyshen_guhuoNode);
				},
				trigger.cards[0],
				player
			);
			event.onEnd01 = function () {
				_status.taffyshen_guhuoNode.removeEventListener("webkitTransitionEnd", _status.event.onEnd01);
				setTimeout(function () {
					_status.taffyshen_guhuoNode.style.transition = "all ease-in 0.3s";
					_status.taffyshen_guhuoNode.style.transform = "perspective(600px) rotateY(270deg)";
					var onEnd = function () {
						_status.taffyshen_guhuoNode.classList.remove("infohidden");
						_status.taffyshen_guhuoNode.style.transition = "all 0s";
						ui.refresh(_status.taffyshen_guhuoNode);
						_status.taffyshen_guhuoNode.style.transform = "perspective(600px) rotateY(-90deg)";
						ui.refresh(_status.taffyshen_guhuoNode);
						_status.taffyshen_guhuoNode.style.transition = "";
						ui.refresh(_status.taffyshen_guhuoNode);
						_status.taffyshen_guhuoNode.style.transform = "";
						_status.taffyshen_guhuoNode.removeEventListener("webkitTransitionEnd", onEnd);
					};
					_status.taffyshen_guhuoNode.listenTransition(onEnd);
				}, 300);
			};
			if (!event.targets.length) event.goto(3);
			("step 1");
			event.target = event.targets.shift();
			event.target.chooseButton([event.prompt, [["reguhuo_ally", "reguhuo_betray"], "vcard"]], true).set("ai", function (button) {
				var player = _status.event.player;
				var evt = _status.event.getParent("taffyshen_guhuo_guess"),
					evtx = evt.getTrigger();
				if (!evt) return Math.random();
				var card = {
					name: evtx.card.name,
					nature: evtx.card.nature,
					isCard: true,
				};
				var ally = button.link[2] == "reguhuo_ally";
				if (ally && (player.hp <= 1 || get.attitude(player, evt.player) >= 0)) return 1.1;
				if (
					!ally &&
					get.effect(
						player,
						{
							name: "losehp",
						},
						player,
						player
					) >= 0
				)
					return 10;
				if (!ally && get.attitude(player, evt.player) < 0) {
					if (evtx.name == "useCard") {
						var eff = 0;
						var targetsx = evtx.targets || [];
						for (var target of targetsx) {
							var isMe = target == evt.player;
							eff += get.effect(target, card, evt.player, player) / (isMe ? 1.35 : 1);
						}
						eff /= 1.5 * targetsx.length || 1;
						if (eff > 0) return 0;
						if (eff < -7) return (Math.random() + Math.pow(-(eff + 7) / 8, 2)) / Math.sqrt(evt.betrayers.length + 1) + (player.hp - 3) * 0.05 + Math.max(0, 4 - evt.player.hp) * 0.05 - (player.hp == 1 && !get.tag(card, "damage") ? 0.2 : 0);
						return Math.pow((get.value(card, evt.player, "raw") - 4) / (eff == 0 ? 3.1 : 10), 2) / Math.sqrt(evt.betrayers.length || 1) + (player.hp - 3) * 0.05 + Math.max(0, 4 - evt.player.hp) * 0.05;
					}
					if (evt.player.getStorage("taffyshen_guhuo_cheated").includes(card.name + card.nature)) return Math.random() + 0.3;
				}
				return Math.random();
			});
			("step 2");
			if (result.links[0][2] == "reguhuo_betray") {
				target.addExpose(0.2);
				game.log(target, "#y质疑");
				target.popup("质疑！", "fire");
				event.betrayers.push(target);
			} else {
				game.log(target, "#g不质疑");
				target.popup("不质疑", "wood");
			}
			if (targets.length) event.goto(1);
			("step 3");
			game.delayx();
			game.broadcastAll(function (onEnd) {
				_status.event.onEnd01 = onEnd;
				if (_status.taffyshen_guhuoNode) _status.taffyshen_guhuoNode.listenTransition(onEnd, 300);
			}, event.onEnd01);
			("step 4");
			game.delay(2);
			("step 5");
			if (!event.betrayers.length) {
				event.goto(7);
			}
			("step 6");
			if (event.fake) {
				for (var target of event.betrayers) {
					target.popup("质疑正确", "wood");
				}
				event.goon = false;
			} else {
				for (var target of event.betrayers) {
					target.popup("质疑错误", "fire");
					target.loseHp();
				}
				// if(get.suit(trigger.cards[0],player)!='heart'){
				// 	event.goon=false;
				// }
				event.taffyshen_guhuoShouldChoose = true;
			}
			("step 7");
			if (!event.goon) {
				game.log(player, "声明的", trigger.card, "作废了");
				trigger.cancel();
				trigger.getParent().goto(0);
				trigger.line = false;
			}
			("step 8");
			game.delay();
			("step 9");
			if (!event.goon) {
				if (event.fake) {
					const drawer = event.betrayers;
					drawer.push(player);
					game.asyncDraw(event.betrayers);
				}
				game.broadcastAll(ui.clear);
				event.taffyshen_guhuoShouldChoose = false;
			}
			("step 10");
			if (event.taffyshen_guhuoShouldChoose) {
				player.chooseBool("蛊惑：是否作废此牌，然后摸一张牌？").ai = () => {
					return 0;
				};
			}
			("step 11");
			if (result.bool) {
				if (event.taffyshen_guhuoShouldChoose) {
					game.log(player, "声明的", trigger.card, "作废了");
					trigger.cancel();
					trigger.getParent().goto(0);
					trigger.line = false;
					player.draw();
					event.taffyshen_guhuoShouldChoose = false;
				}
			}
		},
	},
	// 纯狐
	junkochunhua: {
		audio: 2,
		trigger: {
			global: "damageEnd",
		},
		forced: true,
		logTarget: "player",
		filter: function (event, player) {
			return event.player != player && event.player.isIn();
		},
		content: function () {
			trigger.player.addMark("junkochunhua", trigger.num, false);
		},
		group: ["junkochunhua_lose"],
		marktext: "秽",
		intro: {
			name: "纯化(秽)",
			name2: "秽",
		},
		subSkill: {
			lose: {
				audio: "junkochunhua",
				trigger: {
					source: "damageAfter",
				},
				check: function (event, player) {
					var target = _status.event.getTrigger().player;
					return get.attitude(player, target) < -2;
				},
				filter: function (event, player) {
					return event.player.hasMark("junkochunhua") && event.player.countMark("junkochunhua") >= event.player.maxHp && event.player.isIn();
				},
				content: function (event, player) {
					trigger.player.loseHp(trigger.player.hp);
				},
			},
		},
	},
	junkokuangqi: {
		audio: 2,
		trigger: {
			player: "useCard2",
		},
		check: function (event, player) {
			return event.card.name !== "wuzhong" && event.card.name !== "tao" && event.card.name !== "jiu" && event.card.name !== "wugu" && event.card.name !== "taoyuan";
		},
		filter: function (event, player) {
			return get.type(event.card) !== "delay" && get.type(event.card) !== "equip" && event.card.storage && event.targets.length && game.filterPlayer(current => current != player).length;
		},
		content: function () {
			"step 0";
			var trigger = _status.event.getTrigger();
			trigger.targets.removeArray(trigger.targets);
			var targets = game.filterPlayer(current => current != player);
			if (targets.length) trigger.targets.addArray(targets);
		},
	},
	junkowuming: {
		forced: true,
		mod: {
			suit: function (card) {
				return "none";
			},
			targetInRange: function (card) {
				if (get.color(card) == "none") return true;
			},
			targetEnabled: function (card) {
				if (card.cards) {
					for (var i of card.cards) {
						if (get.color(i) !== "none") return false;
					}
				} else if (get.itemtype(card) == "card") {
					if (get.color(card) !== "none") return false;
				}
			},
		},
	},
	// 会玩的孙权
	huiwan: {
		trigger: {
			player: "drawBefore",
		},
		frequent: true,
		content: function () {
			"step 0";
			var num = trigger.num;
			var chooseWashAfter = false;
			event.chooseWashAfter = chooseWashAfter;
			if (ui.cardPile.childElementCount === 0) {
				game.washCard();
			}
			var source = ui["cardPile"].childNodes;
			var list = [];
			if (num > source.length) {
				chooseWashAfter = true;
				event.chooseWashAfter = chooseWashAfter;
			}
			for (let i = 0; i < source.length; i++) list.push(source[i]);
			player.chooseButton([`会玩：选择获得${get.cnNumber(num > source.length ? source.length : num)}张牌`, list], [num > source.length ? source.length : num, num], true).set("ai", function (button) {
				var target = player;
				var card = {
					name: button.link[2],
				};
				return get.attitude(_status.event.player, target) * (target.getUseValue(card) - 0.1);
			});
			("step 1");
			if (result.links.length !== 0) {
				player.gain(result.links, "draw");
			}
			("step 2");
			if (event.chooseWashAfter) {
				game.washCard();
				var num = trigger.num - result.links.length;
				var source = ui["cardPile"].childNodes;
				var list = [];
				for (let i = 0; i < source.length; i++) list.push(source[i]);
				player.chooseButton([`会玩：选择获得${get.cnNumber(num > source.length ? source.length : num)}张牌`, list], [num > source.length ? source.length : num, num], true).set("ai", function (button) {
					var target = player;
					var card = {
						name: button.link[2],
					};
					return get.attitude(_status.event.player, target) * (target.getUseValue(card) - 0.1);
				});
			}
			("step 3");
			if (event.chooseWashAfter) {
				if (result.links.length !== 0) {
					player.gain(result.links, "draw");
				}
			}
			("step 4");
			trigger.cancel();
		},
	},
	// 超会玩的孙权
	huiwanplus: {
		trigger: {
			global: "drawBefore",
		},
		forced: true,
		content: function () {
			"step 0";
			var num = trigger.num;
			var chooseWashAfter = false;
			event.chooseWashAfter = chooseWashAfter;
			if (ui.cardPile.childElementCount === 0) {
				game.washCard();
			}
			var source = ui["cardPile"].childNodes;
			var list = [];
			if (num > source.length) {
				chooseWashAfter = true;
				event.chooseWashAfter = chooseWashAfter;
			}
			for (let i = 0; i < source.length; i++) list.push(source[i]);
			player.chooseButton([`超玩：选择令${get.translation(trigger.player)}获得${get.cnNumber(num > source.length ? source.length : num)}张牌`, list], [num > source.length ? source.length : num, num], true).set("ai", function (button) {
				var target = trigger.player;
				var card = {
					name: button.link[2],
				};
				return get.attitude(player, target) * (target.getUseValue(card) - 0.1);
			});
			("step 1");
			if (result.links.length !== 0) {
				trigger.player.gain(result.links, "draw");
			}
			("step 2");
			if (event.chooseWashAfter) {
				game.washCard();
				var num = trigger.num - result.links.length;
				var source = ui["cardPile"].childNodes;
				var list = [];
				for (let i = 0; i < source.length; i++) list.push(source[i]);
				player.chooseButton([`超玩：选择令${get.translation(trigger.player)}获得${get.cnNumber(num > source.length ? source.length : num)}张牌`, list], [num > source.length ? source.length : num, num], true).set("ai", function (button) {
					var target = trigger.player;
					var card = {
						name: button.link[2],
					};
					return get.attitude(player, target) * (target.getUseValue(card) - 0.1);
				});
			}
			("step 3");
			if (event.chooseWashAfter) {
				if (result.links.length !== 0) {
					trigger.player.gain(result.links, "draw");
				}
			}
			("step 4");
			trigger.cancel();
		},
		group: ["huiwanplus_judge", "huiwanplus_gamedraw", "dcjinjing"],
	},
	huiwanplus_judge: {
		trigger: {
			global: "judgeBefore",
		},
		forced: true,
		priority: 1,
		unique: true,
		content: function () {
			"step 0";
			if (ui.cardPile.childElementCount === 0) {
				game.washCard();
			}
			var source = ui["cardPile"].childNodes;
			event.cards = [];
			for (let i = 0; i < source.length; i++) event.cards.push(source[i]);
			player.chooseCardButton(true, event.cards, "超玩：选择一张牌作为" + get.translation(trigger.player) + "的" + trigger.judgestr + "判定结果").ai = function (button) {
				if (get.attitude(player, trigger.player) > 0) {
					return 1 + trigger.judge(button.link);
				}
				if (get.attitude(player, trigger.player) < 0) {
					return 1 - trigger.judge(button.link);
				}
				return 0;
			};
			("step 1");
			if (!result.bool) {
				event.finish();
				return;
			}
			player.logSkill("huiwanplus_judge", trigger.player);
			var card = result.links[0];
			event.cards.remove(card);
			var judgestr = get.translation(trigger.player) + "的" + trigger.judgestr + "判定";
			event.videoId = lib.status.videoId++;
			event.dialog = ui.create.dialog(judgestr);
			event.dialog.classList.add("center");
			event.dialog.videoId = event.videoId;

			game.addVideo("judge1", player, [get.cardInfo(card), judgestr, event.videoId]);
			// for(var i=0;i<event.cards.length;i++) event.cards[i].discard();
			result.links[0].discard();
			// var node=card.copy('thrown','center',ui.arena).animate('start');
			var node;
			if (game.chess) {
				node = card.copy("thrown", "center", ui.arena).animate("start");
			} else {
				node = player.$throwordered(card.copy(), true);
			}
			node.classList.add("thrownhighlight");
			ui.arena.classList.add("thrownhighlight");
			if (card) {
				trigger.cancel();
				trigger.result = {
					card: card,
					judge: trigger.judge(card),
					node: node,
					number: get.number(card),
					suit: get.suit(card),
					color: get.color(card),
				};
				if (trigger.result.judge > 0) {
					trigger.result.bool = true;
					trigger.player.popup("洗具");
				}
				if (trigger.result.judge < 0) {
					trigger.result.bool = false;
					trigger.player.popup("杯具");
				}
				game.log(trigger.player, "的判定结果为", card);
				trigger.direct = true;
				trigger.position.appendChild(card);
				game.delay(2);
			} else {
				event.finish();
			}
			("step 2");
			ui.arena.classList.remove("thrownhighlight");
			event.dialog.close();
			game.addVideo("judge2", null, event.videoId);
			ui.clear();
			var card = trigger.result.card;
			trigger.position.appendChild(card);
			trigger.result.node.delete();
			game.delay();
		},
	},
	huiwanplus_gamedraw: {
		trigger: {
			global: "gameDrawBefore",
		},
		forced: true,
		content: function () {
			for (var i = 0; i < game.players.length; i++) {
				game.players[i].draw(4);
			}
			trigger.cancel();
		},
	},
	// 最强神话
	taffyboss_baonuwash: {
		trigger: {
			player: "phaseAfter",
		},
		forced: true,
		content: function () {
			game.over(game.me == game.boss);
		},
		temp: true,
	},
	taffyboss_baonu: {
		unique: true,
		trigger: {
			player: "changeHp",
			global: "boss_baonuwash",
		},
		forced: true,
		priority: 100,
		fixed: true,
		audio: "shenji",
		// mode:['identity','guozhan','boss','stone'],
		init: function (player) {
			if (get.mode() == "boss" && player == game.boss) {
				lib.onwash.push(function () {
					if (!_status.boss_baonuwash) {
						_status.boss_baonuwash = true;
						_status.event.parent.trigger("taffyboss_baonuwash");
					} else {
						_status.event.player.addSkill("taffyboss_baonuwash");
					}
				});
				for (var i in lib.card) {
					if (lib.card[i].subtype == "equip1") lib.card[i].recastable = true;
				}
			}
		},
		filter: function (event, player) {
			let isBoss = false;
			let list = Object.keys(lib.character);
			if (list.includes("boss_lvbu3")) {
				isBoss = true;
			}
			return (player.hp <= 4 || _status.taffyboss_baonuwash) && isBoss;
		},
		content: function () {
			"step 0";
			if (player.hp > 6) {
				game.delay();
			}
			("step 1");
			player
				.chooseControl("暴怒战神", "神鬼无前", function () {
					if (Math.random() < 0.8) return "神鬼无前";
					return "暴怒战神";
				})
				.set("prompt", "选择一个形态");
			("step 2");
			var hp = player.hp;
			player.removeSkill("taffyboss_baonu", true);
			if (result.control == "暴怒战神") {
				player.init("boss_lvbu2");
			} else {
				player.init("boss_lvbu3");
			}
			if (hp > 6) {
				player.maxHp = hp;
				player.hp = hp;
			}
			player.update();
			ui.clear();
			if (player.isLinked()) player.link();
			if (player.isTurnedOver()) player.turnOver();
			player.discard(player.getCards("j"));
			("step 3");
			while (_status.event.name != "phaseLoop") {
				_status.event = _status.event.parent;
			}
			game.resetSkills();
			_status.paused = false;
			_status.event.player = player;
			_status.event.step = 0;
			if (game.bossinfo) {
				game.bossinfo.loopType = 1;
				_status.roundStart = game.boss;
			}
		},
		ai: {
			effect: {
				target: function (card, player, target) {
					if (get.tag(card, "damage") || get.tag(card, "loseHp")) {
						if (player.hp == 5) {
							if (game.players.length < 4) return [0, 5];
							var num = 0;
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i] != game.boss && game.players[i].hp == 1) {
									num++;
								}
							}
							if (num > 1) return [0, 2];
							if (num && Math.random() < 0.7) return [0, 1];
						}
					}
				},
			},
		},
	},
	taffyboss_jingjia: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter: function (event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		content: function () {
			"step 0";
			lib.inpile.addArray(["wushuangfangtianji", "shufazijinguan", "hongmianbaihuapao", "linglongshimandai", "lianjunshengyan"]);
			ui.cardPile.insertBefore(game.createCard2("linglongshimandai", "club", 2), ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
			ui.cardPile.insertBefore(game.createCard2("linglongshimandai", "spade", 2), ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
			ui.cardPile.insertBefore(game.createCard2("hongmianbaihuapao", "club", 2), ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
			ui.cardPile.insertBefore(game.createCard2("hongmianbaihuapao", "spade", 2), ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
			ui.cardPile.insertBefore(game.createCard2("wushuangfangtianji", "diamond", 12), ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
			ui.cardPile.insertBefore(game.createCard2("shufazijinguan", "diamond", 5), ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
			ui.cardPile.insertBefore(game.createCard2("lianjunshengyan", "heart", 1), ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
			ui.cardPile.insertBefore(game.createCard2("lianjunshengyan", "heart", 3), ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
			ui.cardPile.insertBefore(game.createCard2("lianjunshengyan", "heart", 4), ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
			var next = game.createEvent("taffyboss_jingjia_equip");
			next.player = game.boss || player;
			next.setContent(function () {
				"step 0";
				event.cards = 6;
				if (event.cards === 0) {
					event.finish();
					return;
				}
				player.logSkill("taffyboss_jingjia_equip");
				event.num = 1.5;
				("step 1");
				var card = get.cardPile2(function (card) {
					if (card.name == "linglongshimandai") {
						return true;
					} else if (card.name == "hongmianbaihuapao") {
						return true;
					} else if (card.name == "wushuangfangtianji") {
						return true;
					} else if (card.name == "shufazijinguan") {
						return true;
					}
				});
				event.cards--;
				if (player.canEquip(card) && Math.random() < event.num) {
					player.equip(card);
					event.num = 0.5;
				}
				if (event.cards !== 0) event.redo();
			});
		},
	},
	// 欢杀神司马懿
	taffybaby_renjie: {
		audio: "renjie2",
		trigger: {
			player: ["damageEnd", "loseAfter"],
			global: "loseAsyncAfter",
		},
		forced: true,
		group: "taffybaby_renjie_begin",
		filter: function (event, player) {
			if (event.name == "damage") return event.num > 0;
			if (event.type != "discard" || event.getlx === false) return false;
			var evt = event.getParent("phaseDiscard"),
				evt2 = event.getl(player);
			return evt && evt2 && evt.name == "phaseDiscard" && evt.player == player && evt2.cards2 && evt2.cards2.length > 0;
		},
		content: function () {
			player.addMark("taffybaby_renjie", trigger.name == "damage" ? trigger.num : trigger.getl(player).cards2.length);
		},
		intro: {
			name2: "忍",
			content: "mark",
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			combo: "taffybaby_jilue",
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
				audio: "taffybaby_jilue",
				forced: true,
				unique: true,
				content: function () {
					player.addMark("taffybaby_renjie", 1);
				},
			},
		},
	},
	taffybaby_jilue: {
		audio: "sbaiyin",
		group: ["taffybaby_jilue_guicai", "taffybaby_jilue_fangzhu", "taffybaby_jilue_wansha", "taffybaby_jilue_jizhi", "taffybaby_jilue_qixi", "taffybaby_jilue_draw"],
		derivation: ["taffybaby_jilue_guicai", "taffybaby_jilue_fangzhu", "taffybaby_jilue_jizhi", "taffybaby_jilue_qixi", "taffybaby_jilue_wansha"],
		subfrequent: ["draw"],
		subSkill: {
			guicai: {
				audio: "jilue_guicai",
				trigger: {
					global: "judge",
				},
				direct: true,
				filter: function (event, player) {
					return player.countCards("hes") > 0 && player.hasMark("taffybaby_renjie");
				},
				content: function () {
					"step 0";
					player.chooseCard("是否弃置一枚“忍”，并发动〖鬼才〗？", get.skillInfoTranslation("taffybaby_jilue_guicai"), "he", function (card) {
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
						player.respond(result.cards, "highlight", "taffybaby_jilue_guicai", "noOrdering");
					} else {
						event.finish();
					}
					("step 2");
					if (result.bool) {
						player.removeMark("taffybaby_renjie", 1);
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
					return player.hasMark("taffybaby_renjie");
				},
				content: function () {
					"step 0";
					player.chooseTarget("是否弃置一枚“忍”，并发动【放逐】？", get.skillInfoTranslation("taffybaby_jilue_fangzhu"), function (card, player, target) {
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
						player.removeMark("taffybaby_renjie", 1);
						player.logSkill("taffybaby_jilue_fangzhu", result.targets);
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
				global: "taffybaby_jilue_wansha_global",
				trigger: {
					global: "dyingBegin",
				},
				// logTarget: 'player',
				prompt: "是否弃一枚“忍”，本回合获得【完杀】？",
				prompt2: () => get.skillInfoTranslation("taffybaby_jilue_wansha"),
				filter: function (event, player) {
					if (!player.hasMark("taffybaby_renjie")) return false;
					if (player.hasSkill("taffybaby_jilue_wansha_clear")) return false;
					return player == _status.currentPhase;
				},
				content: function () {
					player.removeMark("taffybaby_renjie", 1);
					player.addTempSkill("taffybaby_jilue_wansha_clear");
				},
			},
			wansha_global: {
				mod: {
					cardEnabled: function (card, player) {
						var source = _status.currentPhase;
						if (card.name == "tao" && source && source != player && source.hasSkill("taffybaby_jilue_wansha_clear")) return false;
					},
					cardSavable: function (card, player) {
						var source = _status.currentPhase;
						if (card.name == "tao" && source && source != player && source.hasSkill("taffybaby_jilue_wansha_clear")) return false;
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
				prompt2: () => get.skillInfoTranslation("taffybaby_jilue_jizhi"),
				filter: function (event, player) {
					return get.type(event.card) == "trick" && event.card.isCard && player.hasMark("taffybaby_renjie");
				},
				content: function () {
					player.removeMark("taffybaby_renjie", 1);
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
					return player.hasMark("taffybaby_renjie");
				},
				direct: true,
				content: function () {
					"step 0";
					player.chooseTarget("是否弃置一枚“忍”，并发动【奇袭】？", get.skillInfoTranslation("taffybaby_jilue_qixi"), function (card, player, target) {
						return player != target && target.countCards("he") > 0;
					}).ai = function (target) {
						return -get.attitude(player, target);
					};
					("step 1");
					if (result.bool && result.targets && result.targets.length) {
						player.removeMark("taffybaby_renjie", 1);
						player.logSkill("taffybaby_jilue_qixi", result.targets);
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
					return event.skill.indexOf("taffybaby_jilue_") == 0 && player.getHistory("useSkill", evt => evt.skill.indexOf("taffybaby_jilue_") == 0).length == 1;
				},
				content: function () {
					player.draw();
				},
			},
		},
	},
	taffybaby_lianpo: {
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
	taffyshen_miewu: {
		audio: "spmiewu",
		enable: ["chooseToUse", "chooseToRespond"],
		group: "taffyshen_miewu_taffyshen_pkmiewu",
		filter: function (event, player) {
			if (!player.countCards("hse") || player.hasSkill("taffyshen_miewu2")) return false;
			for (var i of lib.inpile) {
				var type = get.type2(i);
				if (
					(type == "basic" || type == "trick") &&
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
		chooseButton: {
			dialog: function (event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (name == "sha") {
						if (
							event.filterCard(
								{
									name: name,
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
										name: name,
										nature: j,
									},
									player,
									event
								)
							)
								list.push(["基本", "", "sha", j]);
						}
					} else if (
						get.type2(name) == "trick" &&
						event.filterCard(
							{
								name: name,
							},
							player,
							event
						)
					)
						list.push(["锦囊", "", name]);
					else if (
						get.type(name) == "basic" &&
						event.filterCard(
							{
								name: name,
							},
							player,
							event
						)
					)
						list.push(["基本", "", name]);
				}
				return ui.create.dialog("灭吴", [list, "vcard"]);
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
				if (_status.event.getParent().type != "phase") return 1;
				var player = _status.event.player;
				if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) return 0;
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup: function (links, player) {
				return {
					filterCard: true,
					audio: "taffyshen_miewu",
					popname: true,
					check: function (card) {
						return 8 - get.value(card);
					},
					position: "hse",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					precontent: function () {
						player.addTempSkill("taffyshen_miewu2");
					},
				};
			},
			prompt: function (links, player) {
				return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		hiddenCard: function (player, name) {
			if (!lib.inpile.includes(name)) return false;
			var type = get.type2(name);
			return (type == "basic" || type == "trick") && player.countCards("she") > 0 && !player.hasSkill("taffyshen_miewu2");
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter: function (player) {
				if (!player.countCards("hse") || player.hasSkill("taffyshen_miewu2")) return false;
			},
			order: 1,
			result: {
				player: function (player) {
					if (_status.event.dying) return get.attitude(player, _status.event.dying);
					return 1;
				},
			},
		},
		subSkill: {
			taffyshen_pkmiewu: {
				audio: "spmiewu",
				enable: ["chooseToUse", "chooseToRespond"],
				filter: function (event, player) {
					if (player.hasSkill("taffyshen_miewu2") || !!player.countCards("hse")) return false;
					for (var i of lib.inpile) {
						var type = get.type(i);
						if (
							(type == "basic" || type == "trick") &&
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
				chooseButton: {
					dialog: function (event, player) {
						var list = [];
						for (var i = 0; i < lib.inpile.length; i++) {
							var name = lib.inpile[i];
							if (name == "sha") {
								if (
									event.filterCard(
										{
											name: name,
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
												name: name,
												nature: j,
											},
											player,
											event
										)
									)
										list.push(["基本", "", "sha", j]);
								}
							} else if (
								get.type(name) == "trick" &&
								event.filterCard(
									{
										name: name,
									},
									player,
									event
								)
							)
								list.push(["锦囊", "", name]);
							else if (
								get.type(name) == "basic" &&
								event.filterCard(
									{
										name: name,
									},
									player,
									event
								)
							)
								list.push(["基本", "", name]);
						}
						return ui.create.dialog("灭吴", [list, "vcard"]);
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
						if (_status.event.getParent().type != "phase") return 1;
						var player = _status.event.player;
						if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) return 0;
						return player.getUseValue({
							name: button.link[2],
							nature: button.link[3],
						});
					},
					backup: function (links, player) {
						return {
							audio: "spmiewu",
							filterCard: () => false,
							selectCard: -1,
							popname: true,
							viewAs: {
								name: links[0][2],
								nature: links[0][3],
							},
							precontent: function () {
								player.addTempSkill("taffyshen_miewu2");
							},
						};
					},
					prompt: function (links, player) {
						return "视为使用" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "并摸一张牌";
					},
				},
				hiddenCard: function (player, name) {
					if (!lib.inpile.includes(name)) return false;
					var type = get.type(name);
					return (type == "basic" || type == "trick") && player.countCards("she") === 0 && !player.hasSkill("taffyshen_miewu2");
				},
				ai: {
					fireAttack: true,
					respondSha: true,
					respondShan: true,
					skillTagFilter: function (player) {
						if (!!player.countCards("hse") || player.hasSkill("taffyshen_miewu2")) return false;
					},
					order: 1,
					result: {
						player: function (player) {
							if (_status.event.dying) return get.attitude(player, _status.event.dying);
							return 1;
						},
					},
				},
			},
		},
	},
	taffyshen_miewu2: {
		trigger: {
			player: ["useCardAfter", "respondAfter"],
		},
		forced: true,
		charlotte: true,
		popup: false,
		filter: function (event, player) {
			return event.skill == "taffyshen_miewu_backup" || event.skill == "taffyshen_miewu_taffyshen_pkmiewu_backup";
		},
		content: function () {
			player.draw();
		},
	},
	taffyshen_miewu_backup: {
		audio: "taffyshen_miewu",
	},
	//神陈珪
	taffyshen_dcyingtu: {
		audio: 2,
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		usable: 1,
		filter: function (event, player) {
			var evt = event.getParent("phaseDraw");
			if (event.player == player) return false;
			if (evt && event.player == evt.player) return false;
			return (
				event.getg(event.player).length > 0 &&
				event.player.hasCard(function (card) {
					return lib.filter.canBeGained(card, event.player, player);
				}, "he")
			);
		},
		logTarget: "player",
		direct: true,
		checkx: function (player, source) {
			return Math.min(0, get.attitude(player, source)) >= get.attitude(player, source);
		},
		content: function () {
			"step 0";
			player
				.chooseBool(get.prompt("taffyshen_dcyingtu", trigger.player), "获得该角色的一张牌，然后将一张牌交给一名其他角色。若你给出的是装备牌，则其使用其得到的牌。")
				.set("goon", lib.skill.taffyshen_dcyingtu.checkx(player, trigger.player))
				.set("ai", function () {
					return _status.event.goon;
				});
			("step 1");
			if (result.bool) {
				player.logSkill("taffyshen_dcyingtu", trigger.player);
				var next = game.createEvent("taffyshen_dcyingtu_insert");
				next.player = player;
				next.target = trigger.player;
				next.setContent(lib.skill.taffyshen_dcyingtu.contentx);
				event.finish();
			} else player.storage.counttrigger.taffyshen_dcyingtu--;
		},
		contentx: function () {
			"step 0";
			player.gainPlayerCard(target, true, "he");
			player.chooseCardTarget({
				prompt: "请选择要交出的牌和目标",
				prompt2: "将一张牌交给一名其他角色，若你给出的是装备牌，则其使用其得到的牌",
				position: "he",
				filterCard: true,
				forced: true,
				filterTarget: lib.filter.notMe,
				ai1: function (card) {
					if (
						!game.hasPlayer(function (current) {
							return get.attitude(current, player) > 0 && !current.hasSkillTag("nogain");
						})
					)
						return 0;
					return 1 / Math.max(0.1, get.value(card));
				},
				ai2: function (target) {
					var player = _status.event.player,
						att = get.attitude(player, target);
					if (target.hasSkillTag("nogain")) att /= 9;
					return 4 + att;
				},
			});
			("step 1");
			if (result.bool) {
				var target = result.targets[0];
				var card = result.cards[0];
				event.target = target;
				event.card = card;
				player.line(target);
				player.give(card, target);
			} else event.finish();
			("step 2");
			if (target.getCards("h").includes(card) && get.type(card, null, target) == "equip" && target.canUse(card, target)) target.chooseUseTarget(card, true, "nopopup");
		},
	},
	taffyshen_dccongshi: {
		audio: 2,
		trigger: {
			global: "useCardAfter",
		},
		forced: true,
		locked: false,
		filter: function (event, player) {
			return get.type(event.card, null, false) == "equip";
		},
		content: function () {
			player.draw();
		},
	},
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
	// 新杀神管宁
	taffyshendc_dunshi: {
		audio: 2,
		enable: ["chooseToUse", "chooseToRespond"],
		usable: 1,
		init: function (player, skill) {
			if (!player.storage[skill]) player.storage[skill] = [["sha", "shan", "tao", "jiu"], 0];
		},
		hiddenCard: function (player, name) {
			if (player.storage.taffyshendc_dunshi && player.storage.taffyshendc_dunshi[0].includes(name) && !player.getStat("skill").taffyshendc_dunshi) return true;
			return false;
		},
		filter: function (event, player) {
			if (event.type == "wuxie") return false;
			var storage = player.storage.taffyshendc_dunshi;
			if (!storage || !storage[0].length) return false;
			for (var i of storage[0]) {
				var card = {
					name: i,
					isCard: true,
				};
				if (event.filterCard(card, player, event)) return true;
			}
			return false;
		},
		chooseButton: {
			dialog: function (event, player) {
				var list = [];
				var storage = player.storage.taffyshendc_dunshi;
				for (var i of storage[0]) list.push(["基本", "", i]);
				return ui.create.dialog("遁世", [list, "vcard"], "hidden");
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
				var card = {
						name: button.link[2],
					},
					player = _status.event.player;
				if (_status.event.getParent().type != "phase") return 1;
				if (card.name == "jiu") return 0;
				if (card.name == "sha" && player.hasSkill("jiu")) return 0;
				return player.getUseValue(card, null, true);
			},
			backup: function (links, player) {
				return {
					audio: "taffyshendc_dunshi",
					filterCard: function () {
						return false;
					},
					popname: true,
					viewAs: {
						name: links[0][2],
						isCard: true,
					},
					selectCard: -1,
					precontent: function () {
						player.addTempSkill("taffyshendc_dunshi_damage");
						player.storage.taffyshendc_dunshi_damage = event.result.card.name;
					},
				};
			},
			prompt: function (links, player) {
				return "选择【" + get.translation(links[0][2]) + "】的目标";
			},
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter: function (player, tag, arg) {
				var storage = player.storage.taffyshendc_dunshi;
				if (!storage || !storage[0].length) return false;
				if (player.getStat("skill").taffyshendc_dunshi) return false;
				switch (tag) {
					case "respondSha":
						return (_status.event.type != "phase" || player == game.me || player.isUnderControl() || player.isOnline()) && storage[0].includes("sha");
					case "respondShan":
						return storage[0].includes("shan");
					case "save":
						if (arg == player && storage[0].includes("jiu")) return true;
						return storage[0].includes("tao");
				}
			},
			order: 2,
			result: {
				player: function (player) {
					if (_status.event.type == "dying") {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
		},
		initList: function () {
			var skills = [];
			skills = ["rerende", "renxin", "renzheng", "juyi", "yicong", "new_yijue", "yishe", "reyixiang", "tianyi", "dcchongyi", "tongli", "relixia", "cslilu", "nzry_yili", "zhiyu", "zhichi", "rejizhi", "xinfu_qianxin"];
			_status.taffyshendc_dunshi_list = skills;
		},
		subSkill: {
			backup: {
				audio: "taffyshendc_dunshi",
			},
			damage: {
				audio: "taffyshendc_dunshi",
				trigger: {
					global: "damageBegin2",
				},
				forced: true,
				charlotte: true,
				filter: function (event, player) {
					return event.source == _status.currentPhase;
				},
				onremove: true,
				logTarget: "source",
				content: function () {
					"step 0";
					event.cardname = player.storage.taffyshendc_dunshi_damage;
					player.removeSkill("taffyshendc_dunshi_damage");
					event.target = trigger.source;
					var card = get.translation(trigger.source),
						card2 = get.translation(event.cardname),
						card3 = get.translation(trigger.player);
					player.chooseBool("遁世：是否防止即将对" + card3 + "造成的伤害，并令一名角色获得一个技能名中包含“仁/义/礼/智/信”的技能").ai = () => {
						return true;
					};
					("step 1");
					if (result.bool) {
						trigger.cancel();
						if (!_status.taffyshendc_dunshi_list) lib.skill.taffyshendc_dunshi.initList();
						var list = _status.taffyshendc_dunshi_list.randomGets(3);
						if (list.length == 0) event.finish();
						else {
							event.videoId = lib.status.videoId++;
							var func = function (skills, id, target) {
								var dialog = ui.create.dialog("forcebutton");
								dialog.videoId = id;
								dialog.add("令一名角色获得一个技能");
								for (var i = 0; i < skills.length; i++) {
									dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + get.translation(skills[i]) + "】</div><div>" + lib.translate[skills[i] + "_info"] + "</div></div>");
								}
								dialog.addText(" <br> ");
							};
							if (player.isOnline()) player.send(func, list, event.videoId, target);
							else if (player == game.me) func(list, event.videoId, target);
							player.chooseControl(list).set("ai", function () {
								var controls = _status.event.controls;
								if (controls.includes("cslilu")) return "cslilu";
								return controls[0];
							});
						}
					} else {
						event.finish();
					}
					("step 2");
					game.broadcastAll("closeDialog", event.videoId);
					event.resultControl = result.control;
					player.chooseTarget(true, `令一名角色获得技能〖${get.translation(result.control)}〗`).set("ai", function (target) {
						return get.attitude(_status.event.player, target);
					});
					("step 3");
					if (result.bool) {
						let target = result.targets[0];
						player.line(target, "green");
						target.addSkillLog(event.resultControl);
					}
				},
			},
		},
	},
	// 界许劭
	taffyre_pingjian: {
		derivation: "taffyre_pingjian_faq",
		initList: function () {
			var list = [];
			if (_status.connectMode) var list = get.charactersOL();
			else {
				var list = [];
				for (var i in lib.character) {
					if (!lib.filter.characterDisabled2(i) && !lib.filter.characterDisabled(i)) list.push(i);
				}
			}
			game.countPlayer2(function (current) {
				list.remove(current.name);
				list.remove(current.name1);
				list.remove(current.name2);
			});
			_status.characterlist = list;
		},
		hasCommonElement: function (array1, array2) {
			for (let i = 0; i < array1.length; i++) {
				if (array2.includes(array1[i])) {
					return true;
				}
			}
			return false;
		},
		audio: "taffyboss_pingjian",
		trigger: {
			player: ["damageBefore", "phaseJieshuBefore", "phaseBefore"],
		},
		filter: function (event, player) {
			if (event.name !== "damage") {
				if (player.storage.taffyre_pingjianCounts > 1) {
					return false;
				}
			}
			return true;
		},
		frequent: true,
		content: function () {
			"step 0";
			if (!player.storage.taffyre_pingjianX && player.storage.taffyre_pingjianX !== 0) player.storage.taffyre_pingjianX = 0;
			if (!player.storage.taffyre_pingjianCounts) player.storage.taffyre_pingjianCounts = 0;
			var skills = player.getSkills(null, false, false).filter(skill => {
				var info = get.info(skill);
				if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
				const tempSkills = Object.keys(player.tempSkills);
				if (tempSkills.includes(skill)) {
					return false;
				}
				const additionalSkills = Object.keys(player.additionalSkills);
				for (let i = 0; i < additionalSkills.length; i++) {
					if (player.additionalSkills[additionalSkills[i]].includes(skill)) {
						return false;
					}
				}
				return true;
			});
			if (skills.length < 2) player.storage.taffyre_pingjianX = 1;
			var next = player.chooseButton(true, ["评荐：选择失去任意个技能", [skills.map(i => [i, '<div class="popup text" style="width:calc(100% - 25px);display:inline-block"><div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player) + "</div></div>"]), "textbutton"]]);
			next.set("selectButton", [0, 1]);
			next.set("ai", function (button) {
				if (button.link == "taffyre_pingjian") return -1;
				return Math.random();
			});
			("step 1");
			if (result.bool) {
				if (result.links.length === 0 && player.storage.taffyre_pingjianX === 0) {
					event.finish();
				} else {
					let rSkillInfo;
					for (let i = 0; i < result.links.length; i++) {
						rSkillInfo = get.info(result.links[i]);
						if (rSkillInfo.limited || rSkillInfo.juexingji || rSkillInfo.dutySkill) {
							player.restoreSkill(result.links[i]);
						}
						player.removeSkill(result.links[i]);
						game.log(player, "失去了技能", "#g【" + get.translation(result.links[i]) + "】");
					}
					if (!_status.characterlist || !_status.pingjianInitialized) {
						_status.pingjianInitialized = true;
						lib.skill.taffyre_pingjian.initList();
					}
					var allList = _status.characterlist.slice(0);
					game.countPlayer(function (current) {
						if (current.name && lib.character[current.name] && current.name.indexOf("gz_shibing") != 0 && current.name.indexOf("gz_jun_") != 0) allList.add(current.name);
						if (current.name1 && lib.character[current.name1] && current.name1.indexOf("gz_shibing") != 0 && current.name1.indexOf("gz_jun_") != 0) allList.add(current.name1);
						if (current.name2 && lib.character[current.name2] && current.name2.indexOf("gz_shibing") != 0 && current.name2.indexOf("gz_jun_") != 0) allList.add(current.name2);
					});
					var list = [];
					var skills = [];
					var map = [];
					allList.randomSort();
					var name2 = event.triggername;
					if (name2 === "phaseBefore") {
						name2 = ["phaseBeforeStart", "phaseBefore", "phaseBeforeEnd", "phaseBeginStart", "phaseBegin", "phaseChange", "phaseZhunbeiBefore", "phaseZhunbeiBegin", "phaseZhunbei", "phaseZhunbeiEnd", "phaseZhunbeiAfter", "phaseJudgeBefore", "phaseJudgeBegin", "phaseJudge", "phaseJudgeEnd", "phaseJudgeAfter", "phaseDrawBefore", "phaseDrawBegin", "phaseDrawBegin1", "phaseDrawBegin2", "phaseDraw", "phaseDrawEnd", "phaseDrawAfter", "phaseUseBefore", "phaseUseBegin"];
						player.storage.taffyre_pingjianCounts++;
					} else if (name2 === "damageBefore") {
						name2 = ["damageBefore", "damageBegin", "damageBegin2", "damageBegin3", "damageBegin4", "damage", "damageSource", "damageEnd", "damageAfter"];
					} else if (name2 === "phaseJieshuBefore") {
						name2 = ["phaseJieshuBefore", "phaseJieshuBegin", "phaseJieshu", "phaseJieshuEnd", "phaseJieshuAfter", "phaseEnd", "phaseAfter"];
						player.storage.taffyre_pingjianCounts++;
					}
					for (let i = 0; i < allList.length; i++) {
						var name = allList[i];
						if (name.indexOf("xushao") != -1 || name.indexOf("taffyboss_xushao") != -1 || name.indexOf("taffydc_xushao") != -1 || name.indexOf("taffyhuiwan_xushao") != -1 || name.indexOf("taffyre_xushao") != -1 || name.indexOf("taffyshen_xushao") != -1) continue;
						var skills2 = lib.character[name][3];
						for (let j = 0; j < skills2.length; j++) {
							var playerSkills = player.getSkills(null, false, false).filter(skill => {
								var info = get.info(skill);
								if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
								return true;
							});
							if (playerSkills.includes(skills2[j])) continue;
							if (skills.includes(skills2[j])) {
								list.add(name);
								if (!map[name]) map[name] = [];
								map[name].add(skills2[j]);
								skills.add(skills2[j]);
								continue;
							}
							var list2 = [skills2[j]];
							game.expandSkills(list2);
							for (let k = 0; k < list2.length; k++) {
								var info = lib.skill[list2[k]];
								if (!info || !info.trigger || info.charlotte || info.limited || info.juexingji || info.hiddenSkill || info.dutySkill || info.zhuSkill) {
									if (k === 0) break;
									else continue;
								}
								if (info.trigger.player) {
									if (name2.includes(info.trigger.player) || (Array.isArray(info.trigger.player) && lib.skill.taffyre_pingjian.hasCommonElement(info.trigger.player, name2))) {
										if (info.filter) {
											try {
												var bool = info.filter(trigger, player);
												if (!bool) continue;
											} catch (e) {
												continue;
											}
										}
										list.add(name);
										if (!map[name]) map[name] = [];
										map[name].add(skills2[j]);
										skills.add(skills2[j]);
										break;
									}
								}
								if (info.trigger.global) {
									if (name2.includes(info.trigger.global) || (Array.isArray(info.trigger.global) && lib.skill.taffyre_pingjian.hasCommonElement(info.trigger.global, name2))) {
										if (info.filter) {
											try {
												var bool = info.filter(trigger, player);
												if (!bool) continue;
											} catch (e) {
												continue;
											}
										}
										list.add(name);
										if (!map[name]) map[name] = [];
										map[name].add(skills2[j]);
										skills.add(skills2[j]);
										break;
									}
								}
							}
						}
						if (list.length >= 2 * (result.links.length + player.storage.taffyre_pingjianX) + 1) break;
					}
					if (skills.length) {
						event.list = list;
						if (player.isUnderControl()) {
							game.swapPlayerAuto(player);
						}
						var switchToAuto = function () {
							_status.imchoosing = false;
							event._result = {
								bool: true,
								skills: skills.randomGets(result.links.length + player.storage.taffyre_pingjianX),
							};
							if (event.dialog) event.dialog.close();
							if (event.control) event.control.close();
						};
						var chooseButton = function (list, skills, result, player) {
							var event = _status.event;
							if (!event._result) event._result = {};
							event._result.skills = [];
							var rSkill = event._result.skills;
							var dialog = ui.create.dialog("评荐：选择获得至多" + get.cnNumber(result.links.length + player.storage.taffyre_pingjianX) + "个技能", [list, "character"], "hidden");
							event.dialog = dialog;
							var table = document.createElement("div");
							table.classList.add("add-setting");
							table.style.margin = "0";
							table.style.width = "100%";
							table.style.position = "relative";
							for (var i = 0; i < skills.length; i++) {
								var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
								td.link = skills[i];
								table.appendChild(td);
								td.innerHTML = "<span>" + get.translation(skills[i]) + "</span>";
								td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
									if (_status.dragged) return;
									if (_status.justdragged) return;
									_status.tempNoButton = true;
									setTimeout(function () {
										_status.tempNoButton = false;
									}, 500);
									var link = this.link;
									if (!this.classList.contains("bluebg")) {
										if (rSkill.length >= result.links.length + player.storage.taffyre_pingjianX) return;
										rSkill.add(link);
										this.classList.add("bluebg");
									} else {
										this.classList.remove("bluebg");
										rSkill.remove(link);
									}
								});
							}
							dialog.content.appendChild(table);
							dialog.add("　　");
							dialog.open();
							event.switchToAuto = function () {
								event.dialog.close();
								event.control.close();
								game.resume();
								_status.imchoosing = false;
							};
							event.control = ui.create.control("ok", function (link) {
								event.dialog.close();
								event.control.close();
								game.resume();
								_status.imchoosing = false;
							});
							for (var i = 0; i < event.dialog.buttons.length; i++) {
								event.dialog.buttons[i].classList.add("selectable");
							}
							game.pause();
							game.countChoose();
						};
						if (event.isMine()) {
							chooseButton(list, skills, result, player);
						} else if (event.isOnline()) {
							event.player.send(chooseButton, list, skills, result, player);
							event.player.wait();
							game.pause();
						} else {
							switchToAuto();
						}
					} else {
						event.finish();
					}
				}
			}
			("step 2");
			var map = event.result || result;
			if (map && map.skills && map.skills.length) {
				for (var i of map.skills) {
					player.addSkill(i);
					game.log(player, "获得了技能", "#g【" + get.translation(i) + "】");
					var name = event.list.find(name => lib.character[name][3].includes(i));
					if (name) game.broadcastAll((player, name) => player.tempname.add(name), player, name);
				}
				player.storage.taffyre_pingjianX = 0;
			}
		},
		group: ["taffyre_pingjian_use", "taffyre_pingjian_counts"],
		phaseUse_special: [],
		ai: {
			threaten: 50,
		},
	},
	taffyre_pingjian_use: {
		audio: "taffyboss_pingjian",
		enable: "phaseUse",
		usable: 1,
		prompt: () => lib.translate.taffyre_pingjian_info,
		filter: function (event, player) {
			if (player.storage.taffyre_pingjianCounts > 1) {
				return false;
			}
			return true;
		},
		content: function () {
			"step 0";
			if (!player.storage.taffyre_pingjianX && player.storage.taffyre_pingjianX !== 0) player.storage.taffyre_pingjianX = 0;
			if (!player.storage.taffyre_pingjianCounts) player.storage.taffyre_pingjianCounts = 0;
			var skills = player.getSkills(null, false, false).filter(skill => {
				var info = get.info(skill);
				if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
				const tempSkills = Object.keys(player.tempSkills);
				if (tempSkills.includes(skill)) {
					return false;
				}
				const additionalSkills = Object.keys(player.additionalSkills);
				for (let i = 0; i < additionalSkills.length; i++) {
					if (player.additionalSkills[additionalSkills[i]].includes(skill)) {
						return false;
					}
				}
				return true;
			});
			if (skills.length < 2) player.storage.taffyre_pingjianX = 1;
			var next = player.chooseButton(true, ["评荐：选择失去任意个技能", [skills.map(i => [i, '<div class="popup text" style="width:calc(100% - 25px);display:inline-block"><div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player) + "</div></div>"]), "textbutton"]]);
			next.set("selectButton", [0, 1]);
			next.set("ai", function (button) {
				if (button.link == "taffyre_pingjian") return -1;
				return Math.random();
			});
			("step 1");
			if (result.bool) {
				if (result.links.length === 0 && player.storage.taffyre_pingjianX === 0) {
					event.finish();
				} else {
					let rSkillInfo;
					for (let i = 0; i < result.links.length; i++) {
						rSkillInfo = get.info(result.links[i]);
						if (rSkillInfo.limited || rSkillInfo.juexingji || rSkillInfo.dutySkill) {
							player.restoreSkill(result.links[i]);
						}
						player.removeSkill(result.links[i]);
						game.log(player, "失去了技能", "#g【" + get.translation(result.links[i]) + "】");
					}
					if (!_status.characterlist || !_status.pingjianInitialized) {
						_status.pingjianInitialized = true;
						lib.skill.taffyre_pingjian.initList();
					}
					var allList = _status.characterlist.slice(0);
					game.countPlayer(function (current) {
						if (current.name && lib.character[current.name] && current.name.indexOf("gz_shibing") != 0 && current.name.indexOf("gz_jun_") != 0) allList.add(current.name);
						if (current.name1 && lib.character[current.name1] && current.name1.indexOf("gz_shibing") != 0 && current.name1.indexOf("gz_jun_") != 0) allList.add(current.name1);
						if (current.name2 && lib.character[current.name2] && current.name2.indexOf("gz_shibing") != 0 && current.name2.indexOf("gz_jun_") != 0) allList.add(current.name2);
					});
					var list = [];
					var skills = [];
					var map = [];
					let guaranteeList = [];
					let set = [];
					player.storage.taffyre_pingjianCounts++;
					allList.randomSort();
					for (let i = 0; i < allList.length; i++) {
						var name = allList[i];
						if (name.indexOf("xushao") != -1 || name.indexOf("taffyboss_xushao") != -1 || name.indexOf("taffydc_xushao") != -1 || name.indexOf("taffyhuiwan_xushao") != -1 || name.indexOf("taffyre_xushao") != -1 || name.indexOf("taffyshen_xushao") != -1) continue;
						var skills2 = lib.character[name][3];
						for (let j = 0; j < skills2.length; j++) {
							var playerSkills = player.getSkills(null, false, false).filter(skill => {
								var info = get.info(skill);
								if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
								return true;
							});
							if (playerSkills.includes(skills2[j])) continue;
							if (skills.includes(skills2[j]) || lib.skill.taffyre_pingjian.phaseUse_special.includes(skills2[j])) {
								list.add(name);
								if (!map[name]) map[name] = [];
								map[name].add(skills2[j]);
								skills.add(skills2[j]);
								continue;
							}
							var info = lib.translate[skills2[j] + "_info"];
							if (info && info.indexOf("当你于出牌阶段") != -1 && info.indexOf("当你于出牌阶段外") == -1) {
								list.add(name);
								if (!map[name]) map[name] = [];
								map[name].add(skills2[j]);
								skills.add(skills2[j]);
								guaranteeList.add(name);
								continue;
							}
							var list2 = [skills2[j]];
							game.expandSkills(list2);
							for (let k = 0; k < list2.length; k++) {
								var info = lib.skill[list2[k]];
								// 先把所有技能都加到list里面
								if (!info) continue;
								list.add(name);
								if (!map[name]) map[name] = [];
								map[name].add(skills2[j]);
								skills.add(skills2[j]);
								// 再进行保底武将牌名的添加
								if (info.enable) {
									if (info.enable == "phaseUse" || (Array.isArray(info.enable) && info.enable.includes("phaseUse")) || info.enable == "chooseToUse" || (Array.isArray(info.enable) && info.enable.includes("chooseToUse"))) {
										if (info.filter) {
											try {
												var bool = info.filter(evt, player);
												if (!bool) continue;
											} catch (e) {
												continue;
											}
										} else if (info.viewAs && typeof info.viewAs != "function") {
											try {
												if (evt.filterCard && !evt.filterCard(info.viewAs, player, evt)) continue;
												if (info.viewAsFilter && info.viewAsFilter(player) == false) continue;
											} catch (e) {
												continue;
											}
										}
										guaranteeList.add(name);
									}
								}
								break;
							}
						}
						if (list.length >= 2 * (result.links.length + player.storage.taffyre_pingjianX) + 1 && guaranteeList.length >= 1) {
							set = new Set([...guaranteeList.randomGets(1)]);
							break;
						}
					}
					// 遍历完后对抽到的武将牌与技能进行排序处理
					for (let i of list) {
						if (set.size >= 2 * (result.links.length + player.storage.taffyre_pingjianX) + 1) {
							break;
						}
						set.add(i);
					}
					list = [...set];
					skills = [];
					for (let i of list) {
						skills.push(...map[i]);
					}
					if (skills.length) {
						event.list = list;
						if (player.isUnderControl()) {
							game.swapPlayerAuto(player);
						}
						var switchToAuto = function () {
							_status.imchoosing = false;
							event._result = {
								bool: true,
								skills: skills.randomGets(result.links.length + player.storage.taffyre_pingjianX),
							};
							if (event.dialog) event.dialog.close();
							if (event.control) event.control.close();
						};
						var chooseButton = function (list, skills, result, player) {
							var event = _status.event;
							if (!event._result) event._result = {};
							event._result.skills = [];
							var rSkill = event._result.skills;
							var dialog = ui.create.dialog("评荐：选择获得至多" + get.cnNumber(result.links.length + player.storage.taffyre_pingjianX) + "个技能", [list, "character"], "hidden");
							event.dialog = dialog;
							var table = document.createElement("div");
							table.classList.add("add-setting");
							table.style.margin = "0";
							table.style.width = "100%";
							table.style.position = "relative";
							for (var i = 0; i < skills.length; i++) {
								var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
								td.link = skills[i];
								table.appendChild(td);
								td.innerHTML = "<span>" + get.translation(skills[i]) + "</span>";
								td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
									if (_status.dragged) return;
									if (_status.justdragged) return;
									_status.tempNoButton = true;
									setTimeout(function () {
										_status.tempNoButton = false;
									}, 500);
									var link = this.link;
									if (!this.classList.contains("bluebg")) {
										if (rSkill.length >= result.links.length + player.storage.taffyre_pingjianX) return;
										rSkill.add(link);
										this.classList.add("bluebg");
									} else {
										this.classList.remove("bluebg");
										rSkill.remove(link);
									}
								});
							}
							dialog.content.appendChild(table);
							dialog.add("　　");
							dialog.open();
							event.switchToAuto = function () {
								event.dialog.close();
								event.control.close();
								game.resume();
								_status.imchoosing = false;
							};
							event.control = ui.create.control("ok", function (link) {
								event.dialog.close();
								event.control.close();
								game.resume();
								_status.imchoosing = false;
							});
							for (var i = 0; i < event.dialog.buttons.length; i++) {
								event.dialog.buttons[i].classList.add("selectable");
							}
							game.pause();
							game.countChoose();
						};
						if (event.isMine()) {
							chooseButton(list, skills, result, player);
						} else if (event.isOnline()) {
							event.player.send(chooseButton, list, skills, result, player);
							event.player.wait();
							game.pause();
						} else {
							switchToAuto();
						}
					} else {
						event.finish();
					}
				}
			}
			("step 2");
			var map = event.result || result;
			if (map && map.skills && map.skills.length) {
				for (var i of map.skills) {
					player.addSkill(i);
					game.log(player, "获得了技能", "#g【" + get.translation(i) + "】");
					var name = event.list.find(name => lib.character[name][3].includes(i));
					if (name) game.broadcastAll((player, name) => player.tempname.add(name), player, name);
				}
				player.storage.taffyre_pingjianX = 0;
			}
		},
		ai: {
			order: 12,
			result: {
				player: 1,
			},
		},
	},
	taffyre_pingjian_counts: {
		charlotte: true,
		forced: true,
		trigger: { global: ["phaseAfter", "phaseBefore"] },
		content: function () {
			player.storage.taffyre_pingjianCounts = 0;
		},
	},
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
	//旧谋诸葛亮
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
	// 旧十周年神华佗
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
	// 神许劭
	taffyshen_pingjian: {
		derivation: "taffyshen_pingjian_faq",
		initList: function () {
			var list = [];
			if (_status.connectMode) var list = get.charactersOL();
			else {
				var list = [];
				for (var i in lib.character) {
					if (!lib.filter.characterDisabled2(i) && !lib.filter.characterDisabled(i)) list.push(i);
				}
			}
			game.countPlayer2(function (current) {
				list.remove(current.name);
				list.remove(current.name1);
				list.remove(current.name2);
			});
			_status.characterlist = list;
		},
		hasCommonElement: function (array1, array2) {
			for (let i = 0; i < array1.length; i++) {
				if (array2.includes(array1[i])) {
					return true;
				}
			}
			return false;
		},
		audio: "taffyboss_pingjian",
		trigger: {
			player: ["damageBefore", "phaseJieshuBefore", "phaseBefore"],
		},
		frequent: true,
		content: function () {
			"step 0";
			if (!player.storage.taffyshen_pingjianX && player.storage.taffyshen_pingjianX !== 0) player.storage.taffyshen_pingjianX = 0;
			var skills = player.getSkills(null, false, false).filter(skill => {
				var info = get.info(skill);
				if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
				const tempSkills = Object.keys(player.tempSkills);
				if (tempSkills.includes(skill)) {
					return false;
				}
				const additionalSkills = Object.keys(player.additionalSkills);
				for (let i = 0; i < additionalSkills.length; i++) {
					if (player.additionalSkills[additionalSkills[i]].includes(skill)) {
						return false;
					}
				}
				return true;
			});
			if (skills.length < 2) player.storage.taffyshen_pingjianX = 1;
			var next = player.chooseButton(true, ["评荐：选择失去任意个技能", [skills.map(i => [i, '<div class="popup text" style="width:calc(100% - 25px);display:inline-block"><div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player) + "</div></div>"]), "textbutton"]]);
			next.set("selectButton", [0, skills.length]);
			next.set("ai", function (button) {
				if (button.link == "taffyshen_pingjian") return -1;
				return Math.random();
			});
			("step 1");
			if (result.bool) {
				if (result.links.length === 0 && player.storage.taffyshen_pingjianX === 0) {
					event.finish();
				} else {
					let rSkillInfo;
					for (let i = 0; i < result.links.length; i++) {
						rSkillInfo = get.info(result.links[i]);
						if (rSkillInfo.limited || rSkillInfo.juexingji || rSkillInfo.dutySkill) {
							player.restoreSkill(result.links[i]);
						}
						player.removeSkill(result.links[i]);
						game.log(player, "失去了技能", "#g【" + get.translation(result.links[i]) + "】");
					}
					if (!_status.characterlist || !_status.pingjianInitialized) {
						_status.pingjianInitialized = true;
						lib.skill.taffyshen_pingjian.initList();
					}
					var allList = _status.characterlist.slice(0);
					game.countPlayer(function (current) {
						if (current.name && lib.character[current.name] && current.name.indexOf("gz_shibing") != 0 && current.name.indexOf("gz_jun_") != 0) allList.add(current.name);
						if (current.name1 && lib.character[current.name1] && current.name1.indexOf("gz_shibing") != 0 && current.name1.indexOf("gz_jun_") != 0) allList.add(current.name1);
						if (current.name2 && lib.character[current.name2] && current.name2.indexOf("gz_shibing") != 0 && current.name2.indexOf("gz_jun_") != 0) allList.add(current.name2);
					});
					var list = [];
					var skills = [];
					var map = [];
					allList.randomSort();
					var name2 = event.triggername;
					if (name2 === "phaseBefore") {
						name2 = ["phaseBeforeStart", "phaseBefore", "phaseBeforeEnd", "phaseBeginStart", "phaseBegin", "phaseChange", "phaseZhunbeiBefore", "phaseZhunbeiBegin", "phaseZhunbei", "phaseZhunbeiEnd", "phaseZhunbeiAfter", "phaseJudgeBefore", "phaseJudgeBegin", "phaseJudge", "phaseJudgeEnd", "phaseJudgeAfter", "phaseDrawBefore", "phaseDrawBegin", "phaseDrawBegin1", "phaseDrawBegin2", "phaseDraw", "phaseDrawEnd", "phaseDrawAfter", "phaseUseBefore", "phaseUseBegin"];
					} else if (name2 === "damageBefore") {
						name2 = ["damageBefore", "damageBegin", "damageBegin2", "damageBegin3", "damageBegin4", "damage", "damageSource", "damageEnd", "damageAfter"];
					} else if (name2 === "phaseJieshuBefore") {
						name2 = ["phaseJieshuBefore", "phaseJieshuBegin", "phaseJieshu", "phaseJieshuEnd", "phaseJieshuAfter", "phaseEnd", "phaseAfter"];
					}
					for (let i = 0; i < allList.length; i++) {
						var name = allList[i];
						if (name.indexOf("xushao") != -1 || name.indexOf("taffyboss_xushao") != -1 || name.indexOf("taffydc_xushao") != -1 || name.indexOf("taffyhuiwan_xushao") != -1 || name.indexOf("taffyre_xushao") != -1 || name.indexOf("taffyshen_xushao") != -1) continue;
						var skills2 = lib.character[name][3];
						for (let j = 0; j < skills2.length; j++) {
							var playerSkills = player.getSkills(null, false, false).filter(skill => {
								var info = get.info(skill);
								if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
								return true;
							});
							if (playerSkills.includes(skills2[j])) continue;
							if (skills.includes(skills2[j])) {
								list.add(name);
								if (!map[name]) map[name] = [];
								map[name].add(skills2[j]);
								skills.add(skills2[j]);
								continue;
							}
							var list2 = [skills2[j]];
							game.expandSkills(list2);
							for (let k = 0; k < list2.length; k++) {
								var info = lib.skill[list2[k]];
								if (!info || !info.trigger || info.charlotte || info.limited || info.juexingji || info.hiddenSkill || info.dutySkill || info.zhuSkill) {
									if (k === 0) break;
									else continue;
								}
								if (info.trigger.player) {
									if (name2.includes(info.trigger.player) || (Array.isArray(info.trigger.player) && lib.skill.taffyshen_pingjian.hasCommonElement(info.trigger.player, name2))) {
										if (info.filter) {
											try {
												var bool = info.filter(trigger, player);
												if (!bool) continue;
											} catch (e) {
												continue;
											}
										}
										list.add(name);
										if (!map[name]) map[name] = [];
										map[name].add(skills2[j]);
										skills.add(skills2[j]);
										break;
									}
								}
								if (info.trigger.global) {
									if (name2.includes(info.trigger.global) || (Array.isArray(info.trigger.global) && lib.skill.taffyshen_pingjian.hasCommonElement(info.trigger.global, name2))) {
										if (info.filter) {
											try {
												var bool = info.filter(trigger, player);
												if (!bool) continue;
											} catch (e) {
												continue;
											}
										}
										list.add(name);
										if (!map[name]) map[name] = [];
										map[name].add(skills2[j]);
										skills.add(skills2[j]);
										break;
									}
								}
							}
						}
						if (list.length >= 2 * (result.links.length + player.storage.taffyshen_pingjianX) + 1) break;
					}
					if (skills.length) {
						event.list = list;
						if (player.isUnderControl()) {
							game.swapPlayerAuto(player);
						}
						var switchToAuto = function () {
							_status.imchoosing = false;
							event._result = {
								bool: true,
								skills: skills.randomGets(result.links.length + player.storage.taffyshen_pingjianX),
							};
							if (event.dialog) event.dialog.close();
							if (event.control) event.control.close();
						};
						var chooseButton = function (list, skills, result, player) {
							var event = _status.event;
							if (!event._result) event._result = {};
							event._result.skills = [];
							var rSkill = event._result.skills;
							var dialog = ui.create.dialog("评荐：选择获得至多" + get.cnNumber(result.links.length + player.storage.taffyshen_pingjianX) + "个技能", [list, "character"], "hidden");
							event.dialog = dialog;
							var table = document.createElement("div");
							table.classList.add("add-setting");
							table.style.margin = "0";
							table.style.width = "100%";
							table.style.position = "relative";
							for (var i = 0; i < skills.length; i++) {
								var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
								td.link = skills[i];
								table.appendChild(td);
								td.innerHTML = "<span>" + get.translation(skills[i]) + "</span>";
								td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
									if (_status.dragged) return;
									if (_status.justdragged) return;
									_status.tempNoButton = true;
									setTimeout(function () {
										_status.tempNoButton = false;
									}, 500);
									var link = this.link;
									if (!this.classList.contains("bluebg")) {
										if (rSkill.length >= result.links.length + player.storage.taffyshen_pingjianX) return;
										rSkill.add(link);
										this.classList.add("bluebg");
									} else {
										this.classList.remove("bluebg");
										rSkill.remove(link);
									}
								});
							}
							dialog.content.appendChild(table);
							dialog.add("　　");
							dialog.open();
							event.switchToAuto = function () {
								event.dialog.close();
								event.control.close();
								game.resume();
								_status.imchoosing = false;
							};
							event.control = ui.create.control("ok", function (link) {
								event.dialog.close();
								event.control.close();
								game.resume();
								_status.imchoosing = false;
							});
							for (var i = 0; i < event.dialog.buttons.length; i++) {
								event.dialog.buttons[i].classList.add("selectable");
							}
							game.pause();
							game.countChoose();
						};
						if (event.isMine()) {
							chooseButton(list, skills, result, player);
						} else if (event.isOnline()) {
							event.player.send(chooseButton, list, skills, result, player);
							event.player.wait();
							game.pause();
						} else {
							switchToAuto();
						}
					} else {
						event.finish();
					}
				}
			}
			("step 2");
			var map = event.result || result;
			if (map && map.skills && map.skills.length) {
				for (var i of map.skills) {
					player.addSkill(i);
					game.log(player, "获得了技能", "#g【" + get.translation(i) + "】");
					var name = event.list.find(name => lib.character[name][3].includes(i));
					if (name) game.broadcastAll((player, name) => player.tempname.add(name), player, name);
				}
				player.storage.taffyshen_pingjianX = 0;
			}
		},
		group: ["taffyshen_pingjian_use"],
		phaseUse_special: [],
		ai: {
			threaten: 80,
		},
	},
	taffyshen_pingjian_use: {
		audio: "taffyboss_pingjian",
		enable: "phaseUse",
		usable: 1,
		prompt: () => lib.translate.taffyshen_pingjian_info,
		content: function () {
			"step 0";
			if (!player.storage.taffyshen_pingjianX && player.storage.taffyshen_pingjianX !== 0) player.storage.taffyshen_pingjianX = 0;
			var skills = player.getSkills(null, false, false).filter(skill => {
				var info = get.info(skill);
				if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
				const tempSkills = Object.keys(player.tempSkills);
				if (tempSkills.includes(skill)) {
					return false;
				}
				const additionalSkills = Object.keys(player.additionalSkills);
				for (let i = 0; i < additionalSkills.length; i++) {
					if (player.additionalSkills[additionalSkills[i]].includes(skill)) {
						return false;
					}
				}
				return true;
			});
			if (skills.length < 2) player.storage.taffyshen_pingjianX = 1;
			var next = player.chooseButton(true, ["评荐：选择失去任意个技能", [skills.map(i => [i, '<div class="popup text" style="width:calc(100% - 25px);display:inline-block"><div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player) + "</div></div>"]), "textbutton"]]);
			next.set("selectButton", [0, skills.length]);
			next.set("ai", function (button) {
				if (button.link == "taffyshen_pingjian") return -1;
				return Math.random();
			});
			("step 1");
			if (result.bool) {
				if (result.links.length === 0 && player.storage.taffyshen_pingjianX === 0) {
					event.finish();
				} else {
					let rSkillInfo;
					for (let i = 0; i < result.links.length; i++) {
						rSkillInfo = get.info(result.links[i]);
						if (rSkillInfo.limited || rSkillInfo.juexingji || rSkillInfo.dutySkill) {
							player.restoreSkill(result.links[i]);
						}
						player.removeSkill(result.links[i]);
						game.log(player, "失去了技能", "#g【" + get.translation(result.links[i]) + "】");
					}
					if (!_status.characterlist || !_status.pingjianInitialized) {
						_status.pingjianInitialized = true;
						lib.skill.taffyshen_pingjian.initList();
					}
					var allList = _status.characterlist.slice(0);
					game.countPlayer(function (current) {
						if (current.name && lib.character[current.name] && current.name.indexOf("gz_shibing") != 0 && current.name.indexOf("gz_jun_") != 0) allList.add(current.name);
						if (current.name1 && lib.character[current.name1] && current.name1.indexOf("gz_shibing") != 0 && current.name1.indexOf("gz_jun_") != 0) allList.add(current.name1);
						if (current.name2 && lib.character[current.name2] && current.name2.indexOf("gz_shibing") != 0 && current.name2.indexOf("gz_jun_") != 0) allList.add(current.name2);
					});
					var list = [];
					var skills = [];
					var map = [];
					let guaranteeList = [];
					let set = [];
					allList.randomSort();
					for (let i = 0; i < allList.length; i++) {
						var name = allList[i];
						if (name.indexOf("xushao") != -1 || name.indexOf("taffyboss_xushao") != -1 || name.indexOf("taffydc_xushao") != -1 || name.indexOf("taffyhuiwan_xushao") != -1 || name.indexOf("taffyre_xushao") != -1 || name.indexOf("taffyshen_xushao") != -1) continue;
						var skills2 = lib.character[name][3];
						for (let j = 0; j < skills2.length; j++) {
							var playerSkills = player.getSkills(null, false, false).filter(skill => {
								var info = get.info(skill);
								if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
								return true;
							});
							if (playerSkills.includes(skills2[j])) continue;
							if (skills.includes(skills2[j]) || lib.skill.taffyshen_pingjian.phaseUse_special.includes(skills2[j])) {
								list.add(name);
								if (!map[name]) map[name] = [];
								map[name].add(skills2[j]);
								skills.add(skills2[j]);
								continue;
							}
							var info = lib.translate[skills2[j] + "_info"];
							if (info && info.indexOf("当你于出牌阶段") != -1 && info.indexOf("当你于出牌阶段外") == -1) {
								list.add(name);
								if (!map[name]) map[name] = [];
								map[name].add(skills2[j]);
								skills.add(skills2[j]);
								guaranteeList.add(name);
								continue;
							}
							var list2 = [skills2[j]];
							game.expandSkills(list2);
							for (let k = 0; k < list2.length; k++) {
								var info = lib.skill[list2[k]];
								// 先把所有技能都加到list里面
								if (!info) continue;
								list.add(name);
								if (!map[name]) map[name] = [];
								map[name].add(skills2[j]);
								skills.add(skills2[j]);
								// 再进行保底武将牌名的添加
								if (info.enable) {
									if (info.enable == "phaseUse" || (Array.isArray(info.enable) && info.enable.includes("phaseUse")) || info.enable == "chooseToUse" || (Array.isArray(info.enable) && info.enable.includes("chooseToUse"))) {
										if (info.filter) {
											try {
												var bool = info.filter(evt, player);
												if (!bool) continue;
											} catch (e) {
												continue;
											}
										} else if (info.viewAs && typeof info.viewAs != "function") {
											try {
												if (evt.filterCard && !evt.filterCard(info.viewAs, player, evt)) continue;
												if (info.viewAsFilter && info.viewAsFilter(player) == false) continue;
											} catch (e) {
												continue;
											}
										}
										guaranteeList.add(name);
									}
								}
								break;
							}
						}
						if (list.length >= 2 * (result.links.length + player.storage.taffyshen_pingjianX) + 1 && guaranteeList.length >= 1) {
							set = new Set([...guaranteeList.randomGets(1)]);
							break;
						}
					}
					// 遍历完后对抽到的武将牌与技能进行排序处理
					for (let i of list) {
						if (set.size >= 2 * (result.links.length + player.storage.taffyshen_pingjianX) + 1) {
							break;
						}
						set.add(i);
					}
					list = [...set];
					skills = [];
					for (let i of list) {
						skills.push(...map[i]);
					}
					if (skills.length) {
						event.list = list;
						if (player.isUnderControl()) {
							game.swapPlayerAuto(player);
						}
						var switchToAuto = function () {
							_status.imchoosing = false;
							event._result = {
								bool: true,
								skills: skills.randomGets(result.links.length + player.storage.taffyshen_pingjianX),
							};
							if (event.dialog) event.dialog.close();
							if (event.control) event.control.close();
						};
						var chooseButton = function (list, skills, result, player) {
							var event = _status.event;
							if (!event._result) event._result = {};
							event._result.skills = [];
							var rSkill = event._result.skills;
							var dialog = ui.create.dialog("评荐：选择获得至多" + get.cnNumber(result.links.length + player.storage.taffyshen_pingjianX) + "个技能", [list, "character"], "hidden");
							event.dialog = dialog;
							var table = document.createElement("div");
							table.classList.add("add-setting");
							table.style.margin = "0";
							table.style.width = "100%";
							table.style.position = "relative";
							for (var i = 0; i < skills.length; i++) {
								var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
								td.link = skills[i];
								table.appendChild(td);
								td.innerHTML = "<span>" + get.translation(skills[i]) + "</span>";
								td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
									if (_status.dragged) return;
									if (_status.justdragged) return;
									_status.tempNoButton = true;
									setTimeout(function () {
										_status.tempNoButton = false;
									}, 500);
									var link = this.link;
									if (!this.classList.contains("bluebg")) {
										if (rSkill.length >= result.links.length + player.storage.taffyshen_pingjianX) return;
										rSkill.add(link);
										this.classList.add("bluebg");
									} else {
										this.classList.remove("bluebg");
										rSkill.remove(link);
									}
								});
							}
							dialog.content.appendChild(table);
							dialog.add("　　");
							dialog.open();
							event.switchToAuto = function () {
								event.dialog.close();
								event.control.close();
								game.resume();
								_status.imchoosing = false;
							};
							event.control = ui.create.control("ok", function (link) {
								event.dialog.close();
								event.control.close();
								game.resume();
								_status.imchoosing = false;
							});
							for (var i = 0; i < event.dialog.buttons.length; i++) {
								event.dialog.buttons[i].classList.add("selectable");
							}
							game.pause();
							game.countChoose();
						};
						if (event.isMine()) {
							chooseButton(list, skills, result, player);
						} else if (event.isOnline()) {
							event.player.send(chooseButton, list, skills, result, player);
							event.player.wait();
							game.pause();
						} else {
							switchToAuto();
						}
					} else {
						event.finish();
					}
				}
			}
			("step 2");
			var map = event.result || result;
			if (map && map.skills && map.skills.length) {
				for (var i of map.skills) {
					player.addSkill(i);
					game.log(player, "获得了技能", "#g【" + get.translation(i) + "】");
					var name = event.list.find(name => lib.character[name][3].includes(i));
					if (name) game.broadcastAll((player, name) => player.tempname.add(name), player, name);
				}
				player.storage.taffyshen_pingjianX = 0;
			}
		},
		ai: {
			order: 12,
			result: {
				player: 1,
			},
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
	// 水大叔
	hoshino_shuiyuan: {
		audio: 3,
		trigger: { player: "phaseUseBegin" },
		frequent: true,
		chargeSkill: true,
		init: function (player) {
			player.addSkill("hoshino_shuiyuan_charge");
			player.addSkill("hoshino_shuiyuan_die");
		},
		onremove: function (player) {
			player.removeSkill("hoshino_shuiyuan_charge");
			player.removeSkill("hoshino_shuiyuan_die");
		},
		filter: function (event, player) {
			if (player.countMark("charge") < 5) return false;
			return true;
		},
		content: () => {
			"step 0";
			player
				.chooseTarget(`水援：移除场上所有“水”标记，并令任意名与你距离小于2的角色获得5个“水”标记`, [0, Infinity], function (card, player, target) {
					return get.distance(player, target) <= 2;
				})
				.set("ai", target => {
					if (get.attitude(player, target) > 0) {
						return 1;
					}
					return false;
				});
			("step 1");
			if (!result.bool) return event.finish();
			player.removeMark("charge", 5);
			var clearTargets = game.filterPlayer(current => {
				return current.countMark("hoshino_shuiyuan_effect") > 0;
			});
			player.line(clearTargets);
			clearTargets.forEach(current => {
				current.removeSkill("hoshino_shuiyuan_effect");
				current.removeSkill("hoshino_shuiyuan_remove");
				current.removeMark("hoshino_shuiyuan_effect", current.countMark("hoshino_shuiyuan_effect"));
			});
			const targets = result.targets.slice().sortBySeat();
			player.line(targets);
			while (targets.length) {
				const target = targets.shift();
				if (!target.isIn()) continue;
				target.addMark("hoshino_shuiyuan_effect", 5, false);
				target.addSkill("hoshino_shuiyuan_effect");
				target.addSkill("hoshino_shuiyuan_remove");
			}
		},
		subSkill: {
			charge: {
				charlotte: true,
				trigger: {
					global: ["phaseBefore", "phaseEnd"],
					player: "enterGame",
				},
				forced: true,
				priority: 1000,
				filter: function (event, player, name) {
					if (player.countMark("charge") > 9) return false;
					return name != "phaseBefore" || game.phaseNumber == 0;
				},
				content: function () {
					const name = event.triggername;
					if (name == "phaseBefore") {
						player.addMark("charge", 5 + player.countMark("charge") > 10 ? 10 - player.countMark("charge") : 5);
					} else {
						player.addMark("charge", 1);
					}
				},
			},
			remove: {
				charlotte: true,
				trigger: { global: "phaseEnd" },
				forced: true,
				content: () => {
					player.removeMark("hoshino_shuiyuan_effect", 1);
					if (player.countMark("hoshino_shuiyuan_effect") === 0) {
						player.removeSkill("hoshino_shuiyuan_effect");
						player.removeSkill("hoshino_shuiyuan_remove");
					}
				},
			},
			effect: {
				charlotte: true,
				audio: "hoshino_shuiyuan",
				forced: true,
				trigger: { source: "damageBegin1" },
				filter: function (event) {
					return event.hasNature("fire");
				},
				content: function () {
					trigger.num = trigger.num * 2;
				},
				intro: { content: "造成的火焰伤害翻倍" },
			},
			die: {
				trigger: { player: "die" },
				filter(event, player) {
					return game.hasPlayer(current => current.countMark("hoshino_shuiyuan_effect") > 0);
				},
				forced: true,
				locked: false,
				forceDie: true,
				content() {
					var targets = game.filterPlayer(current => {
						return current.countMark("hoshino_shuiyuan_effect") > 0;
					});
					player.line(targets);
					targets.forEach(current => {
						current.removeSkill("hoshino_shuiyuan_effect");
						current.removeSkill("hoshino_shuiyuan_remove");
						current.removeMark("hoshino_shuiyuan_effect", current.countMark("hoshino_shuiyuan_effect"));
					});
				},
			},
		},
	},
	hoshino_shuiji: {
		audio: 3,
		enable: "phaseUse",
		usable: 1,
		filterTarget: function (card, player, current) {
			return current != player && player.canUse("shuiyanqijuny", current);
		},
		selectTarget: [0, 1],
		filterCard: () => false,
		selectCard: -1,
		prompt: "恢复一点体力并视为对至多一名其他角色使用【水淹七军】",
		content() {
			player.recover();
			if (target) {
				player.useCard(
					{
						name: "shuiyanqijuny",
						isCard: true,
					},
					target,
					false
				);
			}
		},
		group: "hoshino_shuiji_effect",
		ai: {
			order: 4,
			result: {
				player: 1,
				target: -1,
			},
		},
		subSkill: {
			effect: {
				trigger: { source: "damageBegin1" },
				forced: true,
				silent: true,
				filter: function (event) {
					return event.card && event.card.name == "shuiyanqijuny";
				},
				content: function () {
					game.setNature(trigger, "fire");
				},
			},
		},
	},
	hoshino_naishu: {
		trigger: { player: "damageBegin4" },
		forced: true,
		audio: 2,
		filter: function (event, player) {
			return event.num > 1 && event.hasNature("fire");
		},
		content: function () {
			trigger.num--;
		},
	},
	hoshino_haile: {
		audio: 3,
		trigger: { global: "phaseEnd" },
		priority: 999,
		forced: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.hasMark("hoshino_shuiyuan_effect") && !current.hasSkill("hoshino_haile_ban");
			});
		},
		content: function () {
			var targets = game.filterPlayer(current => current.hasMark("hoshino_shuiyuan_effect") && !current.hasSkill("hoshino_haile_ban")).sortBySeat();
			for (let target of targets) {
				target.addTempSkill("hoshino_haile_ban");
			}
			player.line(targets, "green");
			game.asyncDraw(targets);
		},
		subSkill: {
			ban: {
				charlotte: true,
			},
		},
	},
	// 利姆露
	limulu_baoshi: {
		audio: 3,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		check: () => true,
		onremove: function (player) {
			delete player.storage.limulu_baoshi;
			delete player.storage.limulu_baoshi_draw;
			player.removeSkill("limulu_baoshi_check");
			player.removeSkill("limulu_baoshi_draw");
		},
		init: function (player) {
			if (!player.storage.limulu_baoshi) player.storage.limulu_baoshi = [];
		},
		filter: function (event, player) {
			if (!player.storage.limulu_baoshi_draw) player.storage.limulu_baoshi_draw = 0;
			if (player.storage.limulu_baoshi_draw > game.filterPlayer().length) {
				return false;
			}
			if (event.player && event.source && event.player !== event.source) {
				return true;
			}
			return false;
		},
		frequent: true,
		content: function () {
			"step 0";
			if (!player.storage.limulu_baoshi) player.storage.limulu_baoshi = [];
			if (!player.storage.limulu_baoshi_draw) player.storage.limulu_baoshi_draw = 0;
			var triggerTraget;
			if (event.triggername === "damageEnd") {
				triggerTraget = trigger.source;
			} else {
				triggerTraget = trigger.player;
			}
			var list = [];
			var listm = [];
			var listv = [];
			if (triggerTraget.name1 != undefined) listm = lib.character[triggerTraget.name1][3];
			else listm = lib.character[triggerTraget.name][3];
			if (triggerTraget.name2 != undefined) listv = lib.character[triggerTraget.name2][3];
			listm = listm.concat(listv);
			var func = function (skill) {
				var info = get.info(skill);
				if (!info || info.charlotte || info.persevereSkill) return false;
				return true;
			};
			for (var i = 0; i < listm.length; i++) {
				if (func(listm[i]) && !player.storage.limulu_baoshi.includes(listm[i])) list.add(listm[i]);
			}
			if (list.length) {
				player.chooseControl(list).set("prompt", "选择获得" + get.translation(triggerTraget) + "武将牌上的一个技能");
			} else {
				player.draw(2);
				player.storage.limulu_baoshi_draw += 2;
				event.finish();
			}
			("step 1");
			player.markAuto("limulu_baoshi", [result.control]);
			player.addSkill(result.control);
		},
		group: ["limulu_baoshi_check", "limulu_baoshi_draw"],
		ai: {
			maixie: true,
			maixie_hp: true,
			threaten: 0.9,
		},
	},
	limulu_baoshi_check: {
		charlotte: true,
		trigger: { player: ["logSkillBegin", "useSkill"] },
		filter: function (event, player) {
			var info = get.info(event.skill);
			if (info && info.charlotte) return false;
			var skill = event.sourceSkill || event.skill;
			if (!player.storage.limulu_baoshi) player.storage.limulu_baoshi = [];
			return player.storage.limulu_baoshi.includes(skill);
		},
		direct: true,
		firstDo: true,
		priority: Infinity,
		content: function () {
			var skill = trigger.sourceSkill || trigger.skill;
			player.removeSkill(skill);
		},
	},
	limulu_baoshi_draw: {
		trigger: {
			global: "roundStart",
		},
		forced: true,
		locked: false,
		marktext: "食",
		intro: { content: "本轮已通过〖暴食〗获得#张牌" },
		init: function (player) {
			player.markSkill("limulu_baoshi_draw");
			if (!player.storage.limulu_baoshi_draw) {
				player.storage.limulu_baoshi_draw = 0;
			}
		},
		content: function () {
			player.storage.limulu_baoshi_draw = 0;
		},
	},
	limulu_zhihui: {
		audio: 2,
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard: function (player, name) {
			if (player.countMark("limulu_zhihui_round") >= player.maxHp) return false;
			if (!lib.inpile.includes(name)) return false;
			var level = player.countMark("limulu_zhihui");
			var type = get.type(name);
			return level === 0 ? type == "basic" : type == "basic" || type == "trick";
		},
		onremove: true,
		derivation: ["limulu_zhihui1"],
		filter: function (event, player) {
			if (player.countMark("limulu_zhihui_round") >= player.maxHp || player.hasSkill("limulu_zhihui_ban")) return false;
			var level = player.countMark("limulu_zhihui");
			for (var i of lib.inpile) {
				var type = get.type(i);
				if ((level === 0 ? type == "basic" : type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) return true;
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var level = player.countMark("limulu_zhihui");
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (name == "sha") {
						if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["基本", "", "sha"]);
						for (var nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) list.push(["基本", "", "sha", nature]);
						}
					} else if (level > 0 && get.type(name) == "trick" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["锦囊", "", name]);
					else if (get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["基本", "", name]);
				}
				return ui.create.dialog("智慧", [list, "vcard"]);
			},
			check(button, player) {
				if (_status.event.getParent().type != "phase") return 1;
				var player = _status.event.player;
				if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) return 0;
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					chooseButton: {
						dialog: function (event, player) {
							var level = player.countMark("limulu_zhihui");
							const dialogContent =
								level === 0
									? [["skill", `失去一个技能，视为使用一张${(get.translation(links[0][3]) || "") + get.translation(links[0][2])}，此牌无法被响应。`]]
									: [
											["skill", `失去一个技能，视为使用一张${(get.translation(links[0][3]) || "") + get.translation(links[0][2])}，此牌无法被响应。`],
											["card", `弃置2张牌，视为使用一张${(get.translation(links[0][3]) || "") + get.translation(links[0][2])}，此牌无法被响应。`],
									  ];
							var dialog = ui.create.dialog("智慧：请选择一项", "hidden");
							dialog.add([[...dialogContent], "textbutton"]);
							return dialog;
						},
						backup: function (result) {
							if (result[0] === "skill") {
								return {
									audio: "limulu_zhihui",
									filterCard: () => false,
									selectCard: -1,
									popname: true,
									viewAs: { name: links[0][2], nature: links[0][3] },
									precontent() {
										"step 0";
										var skills = player.getSkills(null, false, false).filter(skill => {
											var info = get.info(skill);
											if (!info || info.charlotte || get.is.empty(info) || get.skillInfoTranslation(skill, player) === "") return false;
											const tempSkills = Object.keys(player.tempSkills);
											if (tempSkills.includes(skill)) {
												return false;
											}
											const additionalSkills = Object.keys(player.additionalSkills);
											for (let i = 0; i < additionalSkills.length; i++) {
												if (player.additionalSkills[additionalSkills[i]].includes(skill)) {
													return false;
												}
											}
											return true;
										});
										var next = player.chooseButton(true, ["智慧：选择失去1个技能", [skills.map(i => [i, '<div class="popup text" style="width:calc(100% - 25px);display:inline-block"><div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player) + "</div></div>"]), "textbutton"]]);
										next.set("selectButton", [1, 1]);
										next.set("ai", function (button) {
											if (["limulu_baoshi", "limulu_zhihui", "limullu_mowang"].includes(button.link)) return -1;
											return Math.random();
										});
										("step 1");
										if (result.bool) {
											let rSkillInfo;
											for (let i = 0; i < result.links.length; i++) {
												rSkillInfo = get.info(result.links[i]);
												if (rSkillInfo.limited || rSkillInfo.juexingji || rSkillInfo.dutySkill) {
													player.restoreSkill(result.links[i]);
												}
												player.removeSkill(result.links[i]);
												if (result.links[i] === "limulu_baoshi") {
													player.gainMaxHp();
													var list = [];
													while (list.length < 5) {
														var card = get.cardPile(function (card) {
															return !list.includes(card) && get.type(card) == "basic";
														});
														if (!card) break;
														list.push(card);
													}
													if (list.length) player.gain(list, "gain2", "log");
												}
												game.log(player, "失去了技能", "#g【" + get.translation(result.links[i]) + "】");
												player.addTempSkill("limulu_zhihui_round", "roundStart");
												player.addMark("limulu_zhihui_round", 1, false);
											}
										}
									},
									prompt: function (links, player) {
										return "选择" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "的目标";
									},
								};
							} else {
								return {
									audio: "limulu_zhihui",
									selectCard: 2,
									filterCard: true,
									position: "hse",
									popname: true,
									viewAs: {
										name: links[0][2],
										nature: links[0][3],
										suit: "none",
										number: null,
										isCard: true,
									},
									ignoreMod: true,
									precontent: function () {
										player.logSkill("limulu_zhihui");
										player.addTempSkill("limulu_zhihui_round", "roundStart");
										player.addMark("limulu_zhihui_round", 1, false);
										var cards = event.result.cards;
										player.discard(cards);
										event.result.card = {
											name: event.result.card.name,
											nature: event.result.card.nature,
											isCard: true,
										};
										event.result.cards = [];
									},
								};
							}
						},
					},
				};
			},
		},
		group: ["limulu_zhihui_direct", "limulu_zhihui_damage"],
		subSkill: {
			round: { charlotte: true, onremove: true },
			damage: {
				trigger: { source: "damageSource" },
				silent: true,
				charlotte: true,
				popup: false,
				filter: function (event, player) {
					return event.getParent().skill == "limulu_zhihui_backup_backup";
				},
				content: function () {
					player.addTempSkill("limulu_zhihui_ban");
				},
			},
			ban: { charlotte: true },
			direct: {
				trigger: { player: "useCard" },
				forced: true,
				popup: false,
				filter(event) {
					return event.skill == "limulu_zhihui_backup_backup";
				},
				content() {
					trigger.directHit.addArray(game.players);
				},
			},
		},
	},
	limulu_mowang: {
		audio: 2,
		trigger: { source: "dieAfter" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "gray",
		content: function () {
			"step 0";
			player.awakenSkill("limulu_mowang");
			player.gainMaxHp();
			("step 1");
			if (player.maxHp > player.hp) player.recover(player.maxHp - player.hp);
			("step 2");
			player.addMark("limulu_zhihui", 1, false);
			game.log(player, "修改了技能", "#g【智慧】");
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
	//旧张曼成
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
	taffyre_nzry_cunmu: {
		audio: "nzry_cunmu",
		trigger: {
			player: "drawBegin",
		},
		forced: true,
		zhuanhuanji: true,
		async content(event, trigger, player) {
			if (player.storage.taffyre_nzry_cunmu) {
				trigger.bottom = true;
			}
			player.changeZhuanhuanji("taffyre_nzry_cunmu");
		},
		onremove(player) {
			delete player.storage.taffyre_nzry_cunmu;
		},
		mark: true,
		marktext: "☯",
		intro: {
			content(storage, player, skill) {
				return player.storage.taffyre_nzry_cunmu ? "当你摸牌时，改为从牌堆底摸牌" : "当你摸牌时，改为从牌堆顶摸牌";
			},
		},
		group: "taffyre_nzry_cunmu_change",
		subSkill: {
			change: {
				audio: "nzry_cunmu",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				prompt2(event, player) {
					//无名杀先阳后阴，不要问为什么
					return "切换【寸目】为状态" + (player.storage.taffyre_nzry_cunmu ? "阳" : "阴");
				},
				check: () => Math.random() > 0.5,
				content() {
					player.changeZhuanhuanji("taffyre_nzry_cunmu");
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
	// 旧神孙策
	taffyold_yingba: {
		audio: "yingba",
		enable: "phaseUse",
		usable: 1,
		filter: (event, player) => game.hasPlayer(current => current != player && current.maxHp > 1),
		filterTarget: (card, player, target) => target != player && target.maxHp > 1,
		content: function () {
			"step 0";
			target.loseMaxHp();
			("step 1");
			if (target.isIn()) target.addMark("taffyold_yingba_mark", 1);
			player.loseMaxHp();
		},
		locked: false,
		mod: {
			cardUsableTarget: function (card, player, target) {
				if (target.hasMark("taffyold_yingba_mark")) return true;
			},
		},
		ai: {
			combo: "taffyold_scfuhai",
			threaten: 3,
			order: 2,
			result: {
				target: function (player, target) {
					if (target.isHealthy()) return -2;
					return -1;
				},
			},
		},
		subSkill: {
			mark: {
				marktext: "定",
				intro: {
					name: "平定",
					content: "mark",
					onunmark: true,
				},
			},
		},
	},
	taffyold_scfuhai: {
		audio: "scfuhai",
		trigger: { player: "useCardToPlayered" },
		forced: true,
		filter: function (event, player) {
			return event.target && event.target.hasMark("taffyold_yingba_mark");
		},
		logTarget: "target",
		content: function () {
			trigger.directHit.add(trigger.target);
		},
		group: ["taffyold_scfuhai_die", "taffyold_scfuhai_usea"],
		ai: {
			directHit_ai: true,
			skillTagFilter: function (player, tag, arg) {
				return arg && arg.target && arg.target.hasMark("taffyold_yingba_mark");
			},
		},
		subSkill: {
			usea: {
				trigger: { player: "useCardAfter" },
				forced: true,
				filter: function (event, player) {
					return lib.skill.taffyold_scfuhai_usea.logTarget(event, player).length > 0;
				},
				logTarget: function (event, player) {
					return event.targets.filter(function (i) {
						return i.hasMark("taffyold_yingba_mark");
					});
				},
				content: function () {
					var num = 0;
					for (var i of trigger.targets) {
						var numx = i.countMark("taffyold_yingba_mark");
						if (numx) {
							num += numx;
							i.removeMark("taffyold_yingba_mark", numx);
						}
					}
					if (num) player.gainMaxHp(num);
				},
			},
			die: {
				trigger: { global: "die" },
				forced: true,
				filter: function (event, player) {
					return event.player.countMark("taffyold_yingba_mark") > 0;
				},
				content: function () {
					player.gainMaxHp(trigger.player.countMark("taffyold_yingba_mark"));
					player.draw(trigger.player.countMark("taffyold_yingba_mark"));
				},
			},
		},
	},
	taffyold_pinghe: {
		audio: "pinghe",
		mod: {
			maxHandcardBase: function (player) {
				return player.getDamagedHp();
			},
		},
		locked: false,
		trigger: { player: "damageBegin2" },
		direct: true,
		filter: function (event, player) {
			return event.source && event.source != player && event.num < player.countCards("h");
		},
		content: function () {
			"step 0";
			player.chooseCardTarget({
				prompt: get.prompt("taffyold_pinghe"),
				prompt2: "将" + get.cnNumber(trigger.num) + "张手牌交给一名其他角色并防止伤害" + (player.hasSkill("taffyold_yingba") ? "，然后令伤害来源获得等量“平定”标记" : ""),
				selectCard: trigger.num,
				filterCard: true,
				filterTarget: lib.filter.notMe,
				ai1: function (card) {
					if (
						get.tag(card, "recover") &&
						!game.hasPlayer(function (current) {
							return get.attitude(current, player) > 0 && !current.hasSkillTag("nogain");
						})
					)
						return 0;
					return 1 / Math.max(0.1, get.value(card));
				},
				ai2: function (target) {
					var player = _status.event.player,
						att = get.attitude(player, target);
					if (target.hasSkillTag("nogain")) att /= 9;
					return 4 + att;
				},
			});
			("step 1");
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("taffyold_pinghe", target);
				target.gain(result.cards, player, "giveAuto");
				trigger.cancel();
				player.loseMaxHp(trigger.num);
				if (player.hasSkill("taffyold_yingba")) {
					trigger.source.addMark("taffyold_yingba_mark", trigger.num);
				}
			}
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
	//旧神黄忠
	//丁真神将，赤矢神将，爆头神将，吃人神将
	"taffyold_1！5！": {
		audio: "1！5！",
		trigger: { source: "damageSource" },
		filter(event, player) {
			return event.player.isIn() && event.source != event.player;
		},
		logTarget: "player",
		prompt2: (event, player) => "击伤其一个部位",
		async cost(event, trigger, player) {
			const target = trigger.player;
			const places = lib.skill["taffyold_1！5！"].derivation.slice().filter(i => {
				let storage = target.getStorage("taffyold_1！5！_injury");
				if (!storage.length && i == "taffyold_1！5！_place1") {
					return false;
				}
				return true;
			});
			if (!places.length) return;
			//射击部位-by 鸽子
			//牢萌负责精修断后
			//一个团队要有XX的X，YY的Y，ZZ的Z...
			await Promise.all(event.next);
			event.videoId = lib.status.videoId++;
			if (player.isUnderControl()) game.swapPlayerAuto(player);
			const switchToAuto = function () {
				_status.imchoosing = false;
				if (event.dialog) event.dialog.close();
				if (event.control) event.control.close();
				if (event.control2) event.control2.close();
				game.resume();
				return Promise.resolve({
					bool: true,
					hurt: places.includes("taffyold_1！5！_place1") ? "taffyold_1！5！_place1" : "taffyold_1！5！_place7",
				});
			};
			const chooseButton = (places, target) => {
				const { promise, resolve } = Promise.withResolvers();
				const event = _status.event;
				event.switchToAuto = function () {
					_status.imchoosing = false;
					resolve({
						bool: true,
						hurt: places.includes("taffyold_1！5！_place1") ? "taffyold_1！5！_place1" : "taffyold_1！5！_place7",
					});
					if (event.dialog) event.dialog.close();
					if (event.control) event.control.close();
					if (event.control2) event.control2.close();
				};
				event.control = ui.create.control("cancel2", function (link) {
					event.dialog.close();
					event.control.close();
					if (event.control2) event.control2.close();
					game.resume();
					_status.imchoosing = false;
					event._result = { bool: false };
					resolve(event._result);
				});
				event.control2 = ui.create.control("ok", function (link) {
					event.dialog.close();
					event.control.close();
					event.control2.close();
					game.resume();
					_status.imchoosing = false;
					resolve(event._result);
				});
				event.control2.close();
				const dialog = ui.create.dialog("forcebutton", "hidden");
				event.dialog = dialog;
				//白底大图不加textPrompt了
				dialog.textPrompt = dialog.add('<div class="text center">毅武：是否击伤' + get.translation(target) + "的一个部位？</div>");
				dialog.style.display = "flex";
				dialog.style.justifyContent = "center";
				dialog.style.alignItems = "center";
				dialog.style.position = "relative";
				dialog.style.width = "100%";
				dialog.style.height = "100%";
				dialog.id = "taffyold_1！5！";
				dialog.classList.add("fixed");
				dialog.classList.add("scroll1");
				dialog.classList.add("scroll2");
				dialog.classList.add("center");
				dialog.classList.add("scroll3");
				dialog.classList.add("fullwidth");
				dialog.classList.add("fullheight");
				const target_img = document.createElement("div");
				const position = lib.skill["taffyold_1！5！"].derivation;
				target_img.style.width = "50%";
				target_img.style.height = "100%";
				target_img.style.position = "relative";
				target_img.style.overflow = "visible";
				target_img.style.boxSizing = "border-box";
				target_img.style.border = "1px solid black";
				target_img.style.backgroundColor = "rgb(255,178,102,0.5)";
				dialog.appendChild(target_img);
				target_img.style.backgroundImage = "url(" + lib.assetURL + "image/card/yiwu_" + (target.hasSex("male") ? "male" : "female") + ".png)";
				target_img.style.backgroundSize = "cover";
				target_img.style.backgroundRepeat = "no-repeat";
				target_img.style.backgroundSize = "contain";
				target_img.style.backgroundRepeat = "no-repeat";
				target_img.style.backgroundPosition = "center center";
				const number = target.hasSex("male")
					? [
							["7", "1"],
							//["5", "3"],
							//["4", "7"],
							["9", "5"],
							["9", "13"],
							["7", "3"],
							["7", "6"],
					  ]
					: [
							["7", "1"],
							//["8", "3"],
							//["4", "7"],
							["9", "5"],
							["9", "13"],
							["6", "3"],
							["6", "6"],
					  ];
				let list = [];
				for (let i = 0; i < position.length; i++) {
					const num_px = document.createElement("div");
					num_px.style.width = "15%";
					num_px.style.height = "15%";
					num_px.id = position[i];
					num_px.style.position = "absolute";
					num_px.style.left = `${number[i][0] * 6}%`;
					num_px.style.top = `${number[i][1] * 6}%`;
					num_px.style.boxSizing = "border-box";
					num_px.style.backgroundImage = "url(" + lib.assetURL + "image/card/yiwu_click.png)";
					num_px.style.backgroundSize = "cover";
					num_px.style.backgroundRepeat = "no-repeat";
					num_px.style.backgroundSize = "contain";
					num_px.style.backgroundRepeat = "no-repeat";
					num_px.style.backgroundPosition = "center center";
					num_px.addEventListener(lib.config.touchscreen ? "touchend" : "click", a => {
						let hurt = event._result?.position;
						event._result = {
							bool: true,
							hurt: a.target.id,
							position: a.target,
						};
						let bool = true;
						if (hurt) {
							hurt.style.backgroundImage = "url(" + lib.assetURL + "image/card/yiwu_click.png)";
							if (hurt == a.target) {
								event._result = { bool: false };
								if (event.control2) event.control2.close();
								if (event.control) event.control.open();
								bool = false;
							}
						}
						if (bool) {
							a.target.style.backgroundImage = "url(" + lib.assetURL + "image/card/yiwu_click_chosen.png)";
							if (event.control) event.control.close();
							if (event.control2) event.control2.open();
						}
					});
					list.push(num_px);
				}
				const selectedList = list.filter(i => places.includes(i.id));
				for (const i of selectedList) target_img.appendChild(i);
				dialog.open();
				game.pause();
				game.countChoose();
				return promise;
			};
			let next;
			if (event.isMine()) {
				next = chooseButton(places, target);
			} else if (event.isOnline()) {
				const { promise, resolve } = Promise.withResolvers();
				event.player.send(chooseButton, places, target);
				event.player.wait(async result => {
					if (result == "ai") result = await switchToAuto();
					resolve(result);
				});
				game.pause();
				next = promise;
			} else {
				next = switchToAuto();
			}
			const result = await next;
			game.resume();
			event.result = {
				bool: result.bool,
				targets: [target],
				cost_data: result.hurt,
			};
			event.result.targets = [target];
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const place = event.cost_data;
			player.popup(place, "fire");
			game.log(player, "击伤了", target, "的", "#y" + get.translation(place));
			target.addSkill("taffyold_1！5！_injury");
			target.markAuto("taffyold_1！5！_injury", [place]);
			switch (parseInt(place.slice("taffyold_1！5！_place".length))) {
				case 1:
					if (target.getHp() > 0) {
						await target.loseHp(target.getHp());
						if (
							game.getGlobalHistory("everything", evt => {
								if (evt.name != "die" || evt.player != target) return false;
								return evt.reason?.getParent() == event;
							}).length > 0
						) {
							await player.gainMaxHp();
						}
					}
					break;
				case 2:
					const cards = target
						.getEquips(1)
						.slice()
						.concat(target.getEquips("equip3_4"))
						.filter(card => lib.filter.canBeDiscarded(card, player, target));
					if (cards.length) await target.discard(cards).set("discarder", player);
					break;
				case 3:
					target.addTempSkill("taffyold_1！5！_maxhand", { player: "phaseEnd" });
					break;
				case 4:
					const cardx = target.getDiscardableCards(target, "h");
					const num = Math.floor(cardx.length / 2);
					if (cardx.length) await target.discard(cardx.randomGets(num));
					break;
				case 5:
					target.addTempSkill("taffyold_1！5！_damage", { player: "phaseEnd" });
					break;
				case 6:
					target.addTempSkill("taffyold_1！5！_use", { player: "phaseEnd" });
					break;
				case 7:
					target.addTempSkill("taffyold_1！5！_respond", { player: "phaseEnd" });
					break;
			}
		},
		marktext: "赤",
		intro: { content: "mark" },
		frequent: true,
		derivation: ["taffyold_1！5！_place1", "taffyold_1！5！_place4", "taffyold_1！5！_place5", "taffyold_1！5！_place6", "taffyold_1！5！_place7"],
		subSkill: {
			injury: {
				charlotte: true,
			},
			maxhand: {
				charlotte: true,
				mark: true,
				marktext: "伤",
				intro: {
					name: "中伤 - 手部",
					content: "手牌上限变为原来的一半（向下取整）",
				},
				mod: {
					maxHandcard(player, num) {
						if (_status["taffyold_1！5！_maxhand"]) return;
						_status["taffyold_1！5！_maxhand"] = true;
						const numx = player.getHandcardLimit();
						delete _status["taffyold_1！5！_maxhand"];
						return num - Math.ceil(numx);
					},
				},
			},
			damage: {
				charlotte: true,
				mark: true,
				marktext: "伤",
				intro: {
					name: "中伤 - 下肢",
					content: "体力值大于1时，受到的伤害+1",
				},
				trigger: { player: "damageBegin2" },
				filter(event, player) {
					return player.getHp() > 1;
				},
				forced: true,
				popup: false,
				content() {
					trigger.num++;
				},
			},
			use: {
				charlotte: true,
				forced: true,
				mark: true,
				marktext: "伤",
				intro: {
					name: "中伤 - 胸部",
					content: (_, player) => (_status.currentPhase === player ? "" : "下回合") + "使用伤害牌造成的伤害-1",
				},
				trigger: {
					source: "damageBegin2",
				},
				filter(event, player) {
					if (get.tag(event.card, "damage")) return true;
				},
				async content(event, trigger, player) {
					trigger.num -= 1;
				},
			},
			respond: {
				charlotte: true,
				mark: true,
				marktext: "伤",
				intro: {
					name: "中伤 - 腹部",
					content: (_, player) => "不能使用【闪】和【桃】",
				},
				mod: {
					cardEnabled(card) {
						if (card.name == "shan" || card.name == "tao") return false;
					},
					cardSavable(card) {
						if (card.name == "tao") return false;
					},
				},
			},
		},
	},
	taffyold_chiren: {
		audio: "chiren",
		trigger: {
			player: "phaseUseBegin",
		},
		async cost(event, trigger, player) {
			let list = ["摸体力值张牌，此阶段【杀】无距离限制且不能被响应。", "摸已损失体力值张牌，此阶段造成伤害后，回复1点体力。"];
			let result = await player
				.chooseControlList(list)
				.set("ai", function () {
					//等157优化）
					if (player.hp < player.maxHp - player.hp) return 1;
					return 0;
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
				player.addTempSkill("taffyold_chiren_directHit", { player: "phaseUseEnd" });
			} else {
				player.draw(player.getDamagedHp());
				player.addTempSkill("taffyold_chiren_recover", { player: "phaseUseEnd" });
			}
		},
		subSkill: {
			directHit: {
				charlotte: true,
				forced: true,
				mod: {
					targetInRange: function (card) {
						if (card.name == "sha") return true;
					},
				},
				trigger: {
					player: "useCard",
				},
				filter: function (event, player) {
					return event.card.name == "sha";
				},
				content: async function (event, trigger, player) {
					trigger.directHit.addArray(game.players);
					game.log(trigger.card, "不可被响应");
				},
			},
			recover: {
				trigger: {
					source: "damageSource",
				},
				forced: true,
				charlotte: true,
				filter: function (event, player) {
					return player.isDamaged();
				},
				content: async function (event, trigger, player) {
					player.recover();
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
		audio: "renjie2",
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
		audio: "sbaiyin",
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
		audio: "jilue",
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
	// 旧杨阜
	taffyold_jiebing: {
		audio: "jiebing",
		trigger: {
			player: "damageEnd",
		},
		direct: true,
		forced: true,
		filter: function (event, player) {
			return game.hasPlayer(current => {
				return current != event.source && current != player && current.countGainableCards(player, "he");
			});
		},
		content: function () {
			"step 0";
			player
				.chooseTarget("借兵：选择一名其他角色", get.skillInfoTranslation("taffyold_jiebing"), true, (card, player, target) => {
					return player != target && target != _status.event.getTrigger().source && target.countGainableCards(player, "he");
				})
				.set("ai", target => get.effect(target, { name: "shunshou_copy2" }, player, player) /** (target.countCards('he')>1?1.5:1)*/);
			("step 1");
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("taffyold_jiebing", target);
				if (target.ai.shown > 0) player.addExpose(0.15);
				var cards = target.getGainableCards(player, "he").randomGets(2);
				event.cards = cards;
				player.gain(target, cards, "give", "bySelf");
				player.showCards(cards, "借兵");
			} else event.finish();
			("step 2");
			for (var card of cards) {
				if (get.type(card) == "equip" && player.hasUseTarget(card) && get.owner(card) == player) {
					player.chooseUseTarget(card, true);
				}
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target: function (card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
						if (player != target && !player.getFriends().length) return;
						if (
							game.hasPlayer(current => {
								return current != player && get.attitude(player, current) > 0 && current.countGainableCards(target, "he") > 0;
							})
						)
							return [1, 1];
					}
				},
			},
		},
	},
	taffyold_hannan: {
		audio: "hannan",
		enable: "phaseUse",
		usable: 1,
		filter: function (event, player) {
			return !player.hasSkillTag("noCompareSource");
		},
		filterTarget: function (card, player, target) {
			return player.canCompare(target);
		},
		content: function () {
			"step 0";
			player.chooseToCompare(target);
			("step 1");
			if (!result.tie) {
				var players = [player, target];
				if (result.bool) players.reverse();
				players[1].line(players[0], "thunder");
				players[0].damage(players[1], 2);
			}
		},
		ai: {
			order: 7,
			result: {
				target: function (player, target) {
					var hs = player.getCards("h").sort(function (a, b) {
						return get.number(b) - get.number(a);
					});
					var ts = target.getCards("h").sort(function (a, b) {
						return get.number(b) - get.number(a);
					});
					if (!hs.length || !ts.length) return 0;
					if (get.number(hs[0]) > get.number(ts[0]) || get.number(hs[0]) - ts.length >= 9 + Math.min(2, player.hp / 2)) return get.sgnAttitude(player, target) * get.damageEffect(target, player, player);
					return 0;
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
	// 帅！otto！
	himari_jianshi: {
		audio: 3,
		trigger: { global: ["phaseBegin", "phaseUseBegin"] },
		chargeSkill: true,
		init: function (player) {
			player.addSkill("himari_jianshi_charge");
		},
		onremove: function (player) {
			player.removeSkill("himari_jianshi_charge");
			delete player.storage.himari_jianshi_modified;
		},
		derivation: ["himari_jianshi_modified"],
		filter: function (event, player, name) {
			if (player.storage.himari_jianshi_modified) {
				return event.player != player && name != "phaseUseBegin" && player.countMark("charge") >= 3;
			}
			return event.player != player && name != "phaseBegin" && player.countMark("charge") >= 3;
		},
		prompt2: "消耗3点蓄力值，令其造成的伤害翻倍直到出牌阶段结束。",
		check: function (event, player) {
			if (get.attitude(player, event.player) > 0) return true;
			return false;
		},
		content: function () {
			player.removeMark("charge", 3);
			var target = trigger.player;
			player.line(target, "green");
			target.addTempSkill("himari_jianshi_effect", { player: player.storage.himari_jianshi_modified ? "phaseEnd" : "phaseUseEnd" });
		},
		ai: {
			threaten: 1.1,
		},
		subSkill: {
			charge: {
				charlotte: true,
				trigger: {
					global: ["phaseBefore", "phaseEnd"],
					player: "enterGame",
				},
				forced: true,
				priority: 1000,
				filter: function (event, player, name) {
					if (player.countMark("charge") > 9) return false;
					return name != "phaseBefore" || game.phaseNumber == 0;
				},
				content: function () {
					const name = event.triggername;
					if (name == "phaseBefore") {
						player.addMark("charge", 3 + player.countMark("charge") > 10 ? 10 - player.countMark("charge") : 3);
					} else {
						player.addMark("charge", 1);
					}
				},
			},
			effect: {
				audio: "himari_jianshi",
				charlotte: true,
				mark: true,
				marktext: "🤬",
				forced: true,
				trigger: { source: "damageBegin1" },
				content: function () {
					trigger.num = trigger.num * 2;
				},
				intro: {
					name: "爽骂鞠姐",
					content: "造成的伤害翻倍",
				},
			},
		},
	},
	himari_yiwai: {
		audio: 3,
		enable: "phaseUse",
		usable: 1,
		filterTarget: function (card, player, current) {
			return current != player;
		},
		selectTarget: 1,
		prompt: "令一名其他角色无法使用【闪】直到其回合结束",
		content() {
			if (target) {
				target.addTempSkill("himari_yiwai_effect", { player: "phaseEnd" });
			}
		},
		ai: {
			order: 12,
			result: {
				player: 1,
				target: -1,
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				mark: true,
				marktext: "😱",
				intro: {
					name: "鞠姐の攻击性令白字意外",
					content: (_, player) => "不能使用【闪】",
				},
				mod: {
					cardEnabled(card) {
						if (card.name == "shan") return false;
					},
				},
			},
		},
	},
	himari_linghua: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		derivation: ["himari_jianshi"],
		async content(event, trigger, player) {
			player.awakenSkill("himari_linghua");
			player.addTempSkill("himari_linghua_effect", { player: "phaseEnd" });
			player.storage.himari_jianshi_modified = true;
		},
		ai: {
			order: 14,
			result: {
				player: 1,
			},
		},
		subSkill: {
			effect: {
				audio: "himari_linghua",
				charlotte: true,
				mark: true,
				marktext: "😡",
				forced: true,
				trigger: { source: "damageBegin1" },
				content: function () {
					trigger.num = trigger.num + 1;
				},
				intro: {
					name: "爽骂鞠姐",
					content: "造成的伤害+1",
				},
			},
		},
	},
	himari_zhensui: {
		audio: 3,
		trigger: { global: "phaseEnd" },
		frequent: true,
		content: function () {
			"step 0";
			player.chooseTarget(`真髄：令任意名角色摸一张牌`, [0, Infinity]).set("ai", target => {
				if (get.attitude(player, target) > 0) {
					return 1;
				}
				return false;
			});
			("step 1");
			if (!result.bool) return event.finish();
			const targets = result.targets.slice().sortBySeat();
			player.line(targets, "green");
			game.asyncDraw(targets);
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
				}
				else player.flashAvatar("taffyold_zhinang", map[type][skill])
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
			"锁定技": async function () {
				let player = _status.event.player;
				if (player.isDamaged()) await player.recover();
			},
			"觉醒技": async function () {
				let player = _status.event.player;
				let card = get.cardPile(card => get.type(card) == "basic");
				if (card) await player.gain(card, "gain2");
			},
			"限定技": async function () {
				let player = _status.event.player;
				let target = game.filterPlayer(current => current != player).randomGet();
				if (target) {
					player.line(target, "green");
					await target.damage(player);
				}
			},
			"转换技": async function () {
				let player = _status.event.player;
				player.addMark("taffyold_gouzhu", 1, false);
				game.log(player, '手牌上限+1');
				await game.asyncDelay();
			},
			"主公技": async function () {
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
					"step 1";
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
			"step 1";
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
			"step 2";
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
			"step 3";
			if (
				event.num ==
				target.getCards("h").reduce(function (arr, card) {
					return arr.add(get.suit(card, player)), arr;
				}, []).length
			)
				event.finish();
			"step 4";
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
			"step 5";
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
};

export default skills;
