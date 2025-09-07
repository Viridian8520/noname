import { lib, game, ui, get, ai, _status } from "../../extension/noname.js";

/** @type { importCharacterConfig['skill'] } */
const diy = {
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
			skills = ["rerende", "renxin", "renzheng", "juyi", "yicong", "new_yijue", "yishe", "reyixiang", "tianyi", "dcchongyi", "tongli", "relixia", "cslilu", "nzry_yili", "zhiyu", "zhichi", "rejizhi", "xinfu_qianxin", "lirang", "dcsbhaoyi"];
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
			return game.hasPlayer(current => {
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
				"caohong",
				"jiangfei",
				"chentai",
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
				"zangba",
				"liuchongluojun",
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
				"dc_wangyun",
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
				"malingli",
				"kuaiqi",
				"yj_sufei",
				"star_yuanshao",
				"dc_liuli",
				"star_zhangchunhua",
				"gongsunxiu",
				"liqueguosi",
				"dc_shen_huatuo",
				"sp_zhenji",
				"dc_jiachong",
				"zhugemengxue",
				"dc_wangjun",
				"chentai",
				"xizheng",
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
					if (["rejijiang", "kanpo", "jijiu", "spniluan", "qinwang", "aocai", "dcshizong"].includes(skills2[j])) {
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
	// 神杜预
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
			skills = ["rerende", "renxin", "renzheng", "juyi", "yicong", "new_yijue", "yishe", "reyixiang", "tianyi", "dcchongyi", "tongli", "relixia", "cslilu", "nzry_yili", "zhiyu", "zhichi", "rejizhi", "xinfu_qianxin", "lirang", "dcsbhaoyi"];
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
				if (event.triggername !== "damageBefore") {
					player.storage.taffyre_pingjianCounts++;
				}
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
				player.storage.taffyre_pingjianCounts++;
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
	// 水大叔
	hoshino_shuiyuan: {
		audio: 3,
		trigger: { player: "phaseUseBegin" },
		frequent: true,
		chargeSkill: 10,
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
	// 界许攸
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
	// 帅！otto！
	himari_jianshi: {
		audio: 3,
		trigger: { global: ["phaseBegin", "phaseUseBegin"] },
		chargeSkill: 10,
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
	//界沮授大人
	taffyred_xinjianying: {
		audio: 2,
		subfrequent: ["draw"],
		enable: "phaseUse",
		usable: 1,
		filter: function (event, player) {
			if (!player.countCards("he")) return false;
			for (var i of lib.inpile) {
				if (i != "du" && get.type(i, null, false) == "basic") {
					if (event.filterCard({ name: i }, player, event)) return true;
					if (i == "sha") {
						for (var j of lib.inpile_nature) {
							if (event.filterCard({ name: i, nature: j }, player, event)) return true;
						}
					}
				}
			}
			return false;
		},
		onChooseToUse: function (event) {
			if (event.type == "phase" && !game.online) {
				var last = event.player.getLastUsed();
				if (last && last.getParent("phaseUse") == event.getParent()) {
					var suit = get.suit(last.card, false);
					if (suit != "none") event.set("taffyred_xinjianying_suit", suit);
				}
			}
		},
		chooseButton: {
			dialog: function (event, player) {
				var list = [];
				var suit = event.taffyred_xinjianying_suit || "",
					str = get.translation(suit);
				for (var i of lib.inpile) {
					if (i != "du" && get.type(i, null, false) == "basic") {
						if (event.filterCard({ name: i }, player, event)) list.push(["基本", str, i]);
						if (i == "sha") {
							for (var j of lib.inpile_nature) {
								if (event.filterCard({ name: i, nature: j }, player, event)) list.push(["基本", str, i, j]);
							}
						}
					}
				}
				return ui.create.dialog("渐营", [list, "vcard"]);
			},
			check: function (button) {
				if (button.link[2] == "jiu") return 0;
				return _status.event.player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup: function (links, player) {
				var next = {
					audio: "taffyred_xinjianying",
					filterCard: true,
					popname: true,
					position: "he",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					ai1: function (card) {
						return 7 - _status.event.player.getUseValue(card, null, true);
					},
				};
				if (_status.event.taffyred_xinjianying_suit) next.viewAs.suit = _status.event.taffyred_xinjianying_suit;
				return next;
			},
			prompt: function (links) {
				return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + (_status.event.taffyred_xinjianying_suit ? "(" + get.translation(_status.event.taffyred_xinjianying_suit) + ")" : "") + "使用";
			},
		},
		ai: {
			order: function (item, player) {
				if (_status.event.taffyred_xinjianying_suit) return 16;
				return 3;
			},
			result: { player: 7 },
		},
		group: ["taffyred_xinjianying_draw", "jianying_mark"],
		init: function (player) {
			if (player.isPhaseUsing()) {
				var evt = _status.event.getParent("phaseUse");
				var history = player.getHistory("useCard", function (evt2) {
					return evt2.getParent("phaseUse") == evt;
				});
				if (history.length) {
					var trigger = history[history.length - 1];
					player.storage.jianying_mark = trigger.card;
					player.markSkill("jianying_mark");
					game.broadcastAll(
						function (player, suit) {
							if (player.marks.jianying_mark) player.marks.jianying_mark.firstChild.innerHTML = get.translation(suit);
						},
						player,
						get.suit(trigger.card, player)
					);
					player.when("phaseUseAfter").then(() => {
						player.unmarkSkill("jianying_mark");
						delete player.storage.jianying_mark;
					});
				}
			}
		},
		onremove: function (player) {
			player.unmarkSkill("jianying_mark");
			delete player.storage.jianying_mark;
		},
		subSkill: {
			draw: {
				inherit: "jianying",
				audio: "taffyred_xinjianying",
				content: function () {
					const cards = [];
					const hs = player.getCards("h");
					const list = [...hs, player.storage.jianying_mark];
					const card1 = get.cardPile2(function (card) {
						return get.number(card, false) == get.number(list.randomGet(), player);
					});
					if (card1) cards.push(card1);
					const card2 = get.cardPile(function (card) {
						return get.suit(card, false) == get.suit(list.randomGet(), player);
					});
					if (card2) cards.push(card2);
					const card3 = get.cardPile2(function (card) {
						return card.name === "zhuge";
					});
					if (card3) cards.push(card3);
					if (cards.length) player.gain(cards.randomGet(), "draw");
					else player.draw();
				},
			},
		},
	},
	taffyred_shibei: {
		inherit: "shibei",
		audio: 2,
	},
	// 六边形战士
	taffy_shelie: {
		// audio: "shelie",
		persevereSkill: true,
		group: ["taffy_shelie_feiyang", "taffy_shelie_bahu", "taffy_shelie_zhaowen", "taffy_shelie_liegong", "taffy_shelie_fupan", "taffy_shelie_biyue"],
		subSkill: {
			feiyang: {
				inherit: "jsrgfeiyang",
				// audio: "taffy_shelie",
			},
			bahu: {
				inherit: "jsrgbahu",
				// audio: "taffy_shelie",
			},
			zhaowen: {
				audio: "dczhaowen",
				enable: "phaseUse",
				usable: 1,
				prompt2: function (event, player) {
					return "弃置" + get.translation(player.getEquip("diqi")) + "并防止即将受到的" + get.cnNumber(event.num) + "点伤害";
				},
				filter(event, player) {
					if (player.countCards("h") <= 0) return false;
					for (var i of lib.inpile) {
						if (get.type(i) == "trick" && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) return true;
					}
					return false;
				},
				chooseButton: {
					dialog(event, player) {
						var list = [];
						for (var i of lib.inpile) {
							if (get.type(i) == "trick" && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
								list.push(["锦囊", "", i]);
							}
						}
						return ui.create.dialog("涉猎", [list, "vcard"], "hidden");
					},
					check(button) {
						var player = _status.event.player;
						return player.getUseValue({ name: button.link[2] }) + 1;
					},
					backup(links, player) {
						return {
							audio: "dczhaowen",
							popname: true,
							filterCard(card, player) {
								return true;
							},
							selectCard: 1,
							position: "h",
							viewAs: {
								name: links[0][2],
							},
						};
					},
					prompt(links, player) {
						return "将一张手牌当做" + get.translation(links[0][2]) + "使用";
					},
				},
				ai: {
					order: 12,
					result: {
						player: 1,
					},
				},
			},
			liegong: {
				audio: "liegong",
				trigger: { player: "useCardToTargeted" },
				logTarget: "target",
				locked: false,
				prompt2: function (event, player) {
					return "每回合限一次，当你使用【杀】指定唯一目标后，你可以令此【杀】不可被响应且伤害+1。";
				},
				check(event, player) {
					return get.attitude(player, event.target) <= 0;
				},
				filter(event, player) {
					if (event.card.name != "sha") return false;
					if (player.hasSkill("taffy_shelie_liegong_used")) return false;
					return true;
				},
				async content(event, trigger, player) {
					trigger.getParent().directHit.push(trigger.target);
					const id = trigger.target.playerid;
					const map = trigger.getParent().customArgs;
					if (!map[id]) map[id] = {};
					if (typeof map[id].extraDamage != "number") {
						map[id].extraDamage = 0;
					}
					map[id].extraDamage++;
					player.addTempSkill("taffy_shelie_liegong_used");
				},
				ai: {
					threaten: 0.5,
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (get.attitude(player, arg.target) <= 0 && arg.card.name == "sha") return true;
						return false;
					},
				},
			},
			liegong_used: {
				charlotte: true,
			},
			fupan: {
				audio: "twfupan",
				trigger: {
					player: "damageEnd",
					source: "damageSource",
				},
				frequent: true,
				prompt2: function (event, player) {
					return "当你造成或受到伤害后，你可以摸一张牌";
				},
				check: () => true,
				content() {
					player.draw(1);
				},
				ai: {
					maixie: true,
					maixie_hp: false,
					threaten: 0.9,
				},
			},
			biyue: {
				audio: "biyue",
				trigger: { global: "phaseJieshuBegin" },
				frequent: true,
				preHidden: true,
				prompt2: function (event, player) {
					return "一名角色的结束阶段，你可以摸一张牌";
				},
				async content(event, trigger, player) {
					player.draw();
				},
			},
		},
	},
	// 若叶睦
	mutsumi_songyue: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		selectCard() {
			if (ui.selected.targets.length) return [ui.selected.targets.length, 5];
			return [1, 5];
		},
		filterCard(card) {
			return get.type(card.name) == "basic" || get.type(card.name) == "trick";
		},
		position: "h",
		complexCard: true,
		discard: false,
		lose: false,
		delay: false,
		content() {
			"step 0";
			player.showCards(cards, get.translation(player) + "发动了【颂乐】");
			("step 1");
			player.chooseToPlayBeatmap(lib.skill.mutsumi_songyue.beatmaps.randomGet());
			("step 2");
			var score = Math.floor(Math.min(5, result.accuracy / 17));
			event.score = score;
			game.log(player, "的演奏评级为", "#y" + result.rank[0], "，获得积分点数", "#y" + score, "分");
			if (score === 0) {
				event.finish();
				return;
			} else if (score > 1) {
				player.chooseTarget(`颂乐：令至多${get.cnNumber(Math.ceil(score / 2))}名角色摸一张牌（一名角色消耗2分，当前总共${score}分，剩余分数用于视为使用展示的牌）`, [1, Math.ceil(score / 2)]).set("ai", target => {
					if (get.attitude(player, target) > 0) {
						return 1;
					}
					return false;
				});
			} else event.goto(4);
			("step 3");
			if (!result.bool || !result.targets.length) {
				event.goto(4);
			} else {
				const targets = result.targets.sortBySeat();
				event.score -= targets.length * 2;
				player.line(targets, "green");
				game.asyncDraw(targets);
				targets.forEach(target => target.recover());
				if (event.score < 1) {
					event.finish();
					return;
				}
			}
			("step 4");
			player.chooseButton([`颂乐：视为使用一张牌（还可使用${get.cnNumber(event.score)}张）`, cards], [1, 1], false).set("ai", function (button) {
				return player.hasValueTarget(button.link[2]);
			});
			("step 5");
			if (result.bool && result.links.length !== 0) {
				let card = result.links.pop();
				let vCard = new lib.element.VCard(card);
				cards.splice(cards.indexOf(card), 1);
				event.score--;
				player.chooseUseTarget(vCard, false);
			} else {
				event.finish();
				return;
			}
			("step 6");
			if (event.score > 0 && cards.length) event.goto(4);
			else {
				event.finish();
				return;
			}
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
		beatmaps: [
			{
				name: "春日影",
				filename: "../../extension/永雏塔菲/audio/effect/haru_hi_kage_crychic.mp3",
				timeleap: [505, 1130, 1442.5, 2067.5, 2380, 3005, 3317.5, 4155, 4780, 5092.5, 5717.5, 6030, 6655, 6967.5, 7855, 8480, 8792.5, 9417.5, 9730, 10355, 10667.5, 11585, 12210, 12522.5, 13147.5, 13460, 14085, 14397.5],
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(135deg, rgb(255, 255, 130), rgb(171, 255, 171))",
				judgebar_color: "linear-gradient(135deg, rgb(127, 214, 255), rgb(255, 158, 255))",
			},
			{
				name: "春日影 (MyGO!!!!! ver.)",
				filename: "../../extension/永雏塔菲/audio/effect/haru_hi_kage_mygo.mp3",
				timeleap: [735, 1360, 1672.5, 2297.5, 2610, 3235, 3547.5, 4435, 5060, 5372.5, 5997.5, 6310, 6935, 7247.5, 8135, 8760, 9072.5, 9697.5, 10010, 10635, 10947.5, 11835, 12460, 12772.5, 13397.5, 13710, 14335, 14647.5],
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(135deg, rgb(245, 157, 170), rgb(247, 255, 154))",
				judgebar_color: "linear-gradient(135deg, rgb(169, 255, 205), rgb(100, 238, 255))",
			},
			{
				//歌曲名称
				name: "鳥の詩",
				//歌曲文件名（默认在audio/effect文件夹下 若要重定向到扩展 请写为'ext:扩展名称/文件名'的格式）
				filename: "tori_no_uta",
				//每个音符的开始时间点（毫秒，相对未偏移的开始播放时间）
				timeleap: [1047, 3012, 4978, 5469, 5961, 6452, 6698, 7435, 8909, 10875, 12840],
				//开始播放时间的偏移量（毫秒）
				current: -110,
				//判定栏高度（相对整个对话框高度比例）
				judgebar_height: 0.16,
				//Good/Great/Prefect的位置判定范围（百分比，相对于整个对话框。以滑条的底部作为判定基准）
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				//滑条每相对于整个对话框下落1%所需的时间（毫秒）
				speed: 25,
			},
			{
				name: "竹取飛翔　～ Lunatic Princess",
				filename: "taketori_hishou",
				timeleap: [1021, 1490, 1959, 2896, 3834, 4537, 4771, 5709, 6646, 7585, 8039, 8494, 9403, 10291, 11180, 11832, 12049, 12920, 13345, 13771, 14196],
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(rgba(250, 170, 190, 1), rgba(240, 160, 180, 1))",
				judgebar_color: "linear-gradient(rgba(240, 120, 243, 1), rgba(245, 106, 230, 1))",
			},
			{
				name: "ignotus",
				filename: "ignotus",
				//Number of tracks
				//轨道数量
				number_of_tracks: 4,
				//Customize the track to generate for every note (0 is the first track)
				//自定义每个音符生成的轨道（0是第一个轨道）
				mapping: [0, 2, 3, 1, 1, 0, 3, 0, 0, 3, 0, 0, 2, 1, 2],
				//Convert from beats (0 is the first beat) to timeleap
				//将节拍（0是第一拍）转换为开始时间点
				timeleap: game.generateBeatmapTimeleap(170, [0, 4, 8, 12, 14, 16, 16.5, 23.5, 24, 31, 32, 40, 45, 46, 47]),
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(rgba(240, 250, 240, 1), rgba(230, 240, 230, 1))",
				judgebar_color: "linear-gradient(rgba(161, 59, 150, 1), rgba(58, 43, 74, 1))",
			},
			{
				name: "Super Mario 3D World Theme",
				filename: "sm3dw_overworld",
				//Random (Randomly choose tracks to generate notes each play)
				//随机（每次演奏时音符会随机选择轨道生成）
				mapping: "random",
				timeleap: [0, 1071, 1518, 2054, 4018, 4286, 5357, 6429, 7500, 8571, 9643, 10714, 11786, 12321, 12589, 12857, 13929, 15000, 16071, 17143, 18214, 18482, 18750, 19018, 19286, 20357],
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(rgba(120, 130, 240, 1), rgba(100, 100, 230, 1))",
				judgebar_color: "linear-gradient(rgba(230, 40, 30, 1), rgba(220, 30, 10, 1))",
			},
			{
				name: "只因你太美",
				filename: "chicken_you_are_so_beautiful",
				number_of_tracks: 7,
				mapping: [3, 6, 4, 5, 6, 2, 3, 2, 1, 2, 0, 4, 3, 6, 5, 4, 3, 6, 3, 2, 3, 1, 0, 1, 2, 3, 4, 5, 6],
				timeleap: game.generateBeatmapTimeleap(107, [2, 3.5, 4.5, 5.5, 6.5, 8.5, 10, 11.5, 12.5, 13.5, 14.5, 15.5, 18, 19.5, 20.5, 21.5, 22.5, 24.5, 26, 27.5, 28.5, 29.5, 30.5, 31, 31.5, 32, 32.5, 33, 33.5]),
				//Hitsound file name (By default in the audio/effect folder. To redirect to the extension, please write in the format of 'ext:extension_name')
				//打击音文件名（默认在audio/effect文件夹下 若要重定向到扩展 请写为'ext:扩展名称'的格式）
				hitsound: "chickun.wav",
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(#99f, #66c)",
				judgebar_color: "linear-gradient(#ccf, #99c)",
			},
			{
				name: "Croatian Rhapsody",
				filename: "croatian_rhapsody",
				mapping: [4, 1, 2, 1, 0, 0, 4, 5, 1, 3, 2, 1, 0, 0],
				timeleap: game.generateBeatmapTimeleap(96, [4, 6, 8, 9, 10, 11, 12, 13.5, 14, 15.5, 16, 17, 18, 19]),
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(#fff, #ccc)",
				judgebar_color: "linear-gradient(#fff, #ccc)",
			},
			{
				name: "罗刹海市",
				filename: "rakshasa_sea_city",
				number_of_tracks: 7,
				mapping: "random",
				timeleap: game.generateBeatmapTimeleap(150, [0, 2, 4, 6, 7, 9, 11, 13, 14, 16, 18, 20, 21, 23, 25, 27]),
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(#333, #000)",
				judgebar_color: "linear-gradient(#c66, #933)",
			},
			{
				name: "Pigstep (Stereo Mix)",
				filename: "pigstep",
				number_of_tracks: 16,
				timeleap: game.generateBeatmapTimeleap(170, [3, 4, 6, 6.5, 7.5, 11, 12, 14, 14.5, 15.5, 19, 20, 22, 22.5, 23.5, 27, 28, 30, 30.5, 31.5, 35, 36, 38, 38.5, 39.5, 43, 44, 46, 46.5, 47.5, 51, 52, 54, 54.5, 55.5, 59, 60, 62, 62.5]),
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(#066, #033)",
				judgebar_color: "linear-gradient(#633, #300)",
			},
		],
		derivation: "mutsumi_songyue_faq",
	},
	mutsumi_wuyan: {
		audio: 2,
		trigger: {
			global: "phaseBeginStart",
		},
		forced: true,
		filter: () => true,
		content() {
			player.addTempSkill("mutsumi_wuyan_limit");
			player.addMark("mutsumi_wuyan_limit", 2, false);
		},
		group: ["mutsumi_wuyan_target", "mutsumi_wuyan_discard"],
		subSkill: {
			limit: {
				mark: true,
				intro: {
					markcount(storage) {
						return (storage || 0).toString();
					},
					content(storage) {
						return "还可使用" + (storage || 0).toString() + "张牌";
					},
				},
				charlotte: true,
				onremove: true,
				trigger: { player: "useCard0" },
				filter(event, player) {
					return player.hasMark("mutsumi_wuyan_limit");
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					player.removeMark("mutsumi_wuyan_limit", 1, false);
				},
				mod: {
					cardEnabled(card, player) {
						if (player.hasMark("mutsumi_wuyan_limit")) return;
						if (get.itemtype(card) == "card" && get.position(card) == "h") return false;
						if (card.cards && (card.cards || []).some(i => get.position(i) == "h")) return false;
					},
					cardSavable() {
						return lib.skill.mutsumi_wuyan.subSkill.limit.mod.cardEnabled.apply(this, arguments);
					},
				},
			},
			target: {
				trigger: { target: "useCardToTarget" },
				logTarget: "player",
				forced: true,
				filter(event, player) {
					return player != event.player;
				},
				content() {
					player.addToExpansion(trigger.cards, "gain2").gaintag.add("mutsumi_wuyan_target");
				},
				marktext: "言",
				intro: {
					content: "expansion",
					markcount: "expansion",
				},
			},
			discard: {
				trigger: {
					player: "phaseDiscardBefore",
				},
				forced: true,
				audio: 2,
				content() {
					trigger.cancel();
					game.log(player, "跳过了", "弃牌阶段");
				},
			},
		},
	},
	mutsumi_huge: {
		audio: 2,
		trigger: {
			player: "dying",
		},
		unique: true,
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "gray",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.gainMaxHp();
			await player.recoverTo(player.maxHp);
			var hs = player.getCards("h");
			player.storage.isInHuan = true;
			if (hs.length) player.discard(hs);
			player.changeSkin({ characterName: "mutsumi" }, "mortis");
			player.changeSkin({ characterName: "mortis" }, "mortis");
			player.changeSkills(get.info("mutsumi_huge").derivation, ["mutsumi_songyue", "mutsumi_wuyan", "mutsumi_huge"]);
			game.broadcastAll(
				(player, name, list) => {
					if (player.name == "mutsumi" || player.name1 == "mutsumi" || player.name == "mortis" || player.name1 == "mortis") player.node.name.innerHTML = name;
					if (player.name2 == "mutsumi" || player.name2 == "mortis") player.node.name2.innerHTML = name;
					player.tempname.push("mortis");
				},
				player,
				"Mortis"
			);
			if (!_status.currentPhase) return;
			player.when({ global: "phaseAfter" }).then(() => {
				player.insertPhase();
			});
		},
		derivation: ["mortis_renou", "mortis_yanyi", "mortis_shige"],
	},
	// Mortis
	mortis_renou: {
		audio: 2,
		trigger: { global: "gameDrawBegin" },
		forced: true,
		async content(event, trigger, player) {
			var me = player;
			var numx = trigger.num;
			trigger.num =
				typeof numx == "function"
					? function (player) {
							if (player == me) {
								player.storage.isInHuan = true;
								return 0;
							}
							return numx(player);
					  }
					: function (player) {
							if (player == me) {
								player.storage.isInHuan = true;
								return 0;
							}
							return numx;
					  };
		},
		group: ["mortis_renou_discard", "mortis_renou_target"],
		subSkill: {
			discard: {
				trigger: {
					player: "gainAfter",
				},
				forced: true,
				filter(event, player) {
					return player.countCards("h") > 0;
				},
				content() {
					player.discard("h", true, player.getCards("h"));
				},
			},
			target: {
				trigger: { target: "useCardToTarget" },
				logTarget: "player",
				forced: true,
				filter(event, player) {
					return player != event.player;
				},
				content() {
					player.addToExpansion(trigger.cards, "gain2").gaintag.add("mutsumi_wuyan_target");
				},
				marktext: "言",
				intro: {
					content: "expansion",
					markcount: "expansion",
				},
			},
		},
	},
	mortis_yanyi: {
		audio: 2,
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			if (!player.getStorage("mortis_yanyi_used").includes(name)) return false;
			var cards = player.getExpansions("mutsumi_wuyan_target");
			var cardnames = new Set(cards.map(i => i.name));
			if (!cardnames.includes(name)) return false;
			var type = get.type(name);
			return type == "basic" || type == "trick";
		},
		filter(event, player) {
			var cards = player.getExpansions("mutsumi_wuyan_target");
			var cardnames = new Set(cards.map(i => i.name));
			for (let name of cardnames) {
				if (player.getStorage("mortis_yanyi_used").includes(name)) continue;
				var type = get.type(name);
				if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: name }, "unsure"), player, event)) return true;
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				var cards = player.getExpansions("mutsumi_wuyan_target");
				var cardnames = new Set(
					cards.map(i => {
						let name = i.name;
						if (i.name == "sha") {
							switch (i.nature) {
								case "fire":
									name = "huosha";
									break;
								case "thunder":
									name = "leisha";
									break;
								case "kami":
									name = "kamisha";
									break;
								case "ice":
									name = "icesha";
									break;
							}
						}
						return name;
					})
				);
				for (let name of cardnames) {
					if (player.getStorage("mortis_yanyi_used").includes(name)) continue;
					else if (["huosha", "leisha", "kamisha", "icesha"].includes(name)) {
						var nature;
						switch (name) {
							case "huosha":
								nature = "fire";
								break;
							case "leisha":
								nature = "thunder";
								break;
							case "kamisha":
								nature = "kami";
								break;
							case "icesha":
								nature = "ice";
								break;
						}
						if (event.filterCard(get.autoViewAs({ name: "sha", nature }, "unsure"), player, event)) list.push(["基本", "", "sha", nature]);
					} else if (get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["基本", "", name]);
					else if (get.type(name) == "trick" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["锦囊", "", name]);
				}
				return ui.create.dialog("演绎", [list, "vcard"]);
			},
			//これ  要らない（そよりん声线）
			//filter:function(button,player){
			//	return _status.event.getParent().filterCard({name:button.link[2]},player,_status.event.getParent());
			//},
			check(button) {
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
					audio: "mortis_yanyi",
					filterCard: () => false,
					selectCard: -1,
					popname: true,
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent() {
						if (!player.storage.mortis_yanyi_used) {
							player.when({ global: "phaseAfter" }).then(() => {
								player.unmarkSkill("mortis_yanyi_used");
								delete player.storage.mortis_yanyi_used;
							});
						}
						let name = event.result.card.name;
						if (event.result.card.name === "sha") {
							switch (event.result.card.nature) {
								case "fire":
									name = "huosha";
									break;
								case "thunder":
									name = "leisha";
									break;
								case "kami":
									name = "kamisha";
									break;
								case "ice":
									name = "icesha";
									break;
							}
						}
						player.markAuto("mortis_yanyi_used", name);
					},
				};
			},
			prompt(links, player) {
				return "视为使用" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]);
			},
		},
		ai: {
			combo: "mortis_renou",
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			order: 1,
			result: {
				player(player) {
					if (_status.event.dying) return get.attitude(player, _status.event.dying);
					return 1;
				},
			},
		},
	},
	mortis_shige: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		logTarget: "player",
		filter(event, player) {
			return event.card.name == "tao" && player != event.player;
		},
		unique: true,
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "gray",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.loseMaxHp();
			await player.recoverTo(player.maxHp);
			delete player.storage.isInHuan;
			player.changeSkin({ characterName: "mutsumi" }, "mutsumi");
			player.changeSkin({ characterName: "mortis" }, "mutsumi");
			player.changeSkills(get.info("mortis_shige").derivation, ["mortis_renou", "mortis_yanyi", "mortis_shige"]);
			player.drawTo(4);
			game.broadcastAll(
				(player, name, list) => {
					if (player.name == "mortis" || player.name1 == "mortis" || player.name == "mutsumi" || player.name1 == "mutsumi") player.node.name.innerHTML = name;
					if (player.name2 == "mortis" || player.name2 == "mutsumi") player.node.name2.innerHTML = name;
					player.tempname.push("mutsumi");
				},
				player,
				"若叶睦"
			);
		},
		derivation: ["mutsumi_songyue", "mutsumi_wuyan", "mutsumi_huge"],
	},
	// 神姜维
	taffyps_jiufa: {
		audio: "jiufa",
		onremove: function (player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
			delete player.storage[skill];
		},
		trigger: {
			player: ["useCardAfter", "respondAfter"],
		},
		filter: function (event, player) {
			if (!event.cards || !event.cards.filterInD("oej").length) return false;
			return !player
				.getExpansions("taffyps_jiufa")
				.map(i => i.name)
				.includes(event.card.name);
		},
		check: function (event, player) {
			if (get.type(event.card) == "equip" && get.value(event.cards[0], player) > 7) return 0;
			return 1;
		},
		marktext: "伐",
		intro: {
			markcount: "expansion",
			content: "expansion",
		},
		content: function () {
			"step 0";
			if (trigger.cards.filterInD("ej").length) var next = player.addToExpansion(trigger.cards.filterInD("oej"), get.owner(trigger.cards.filterInD("oej")[0]), "giveAuto");
			else var next = player.addToExpansion(trigger.cards.filterInD("oej"), "gain2");
			next.gaintag.add("taffyps_jiufa");
			("step 1");
			if (
				player
					.getExpansions("taffyps_jiufa")
					.map(i => i.name)
					.reduce((p, c) => (!p.includes(c) ? p.add(c) : p), []).length >= 9
			) {
				game.delayx();
				player.loseToDiscardpile(player.getExpansions("taffyps_jiufa"));
			} else event.finish();
			("step 2");
			event.cards = get.cards(9);
			game.cardsGotoOrdering(event.cards);
			event.videoId = lib.status.videoId++;
			game.broadcastAll(
				function (player, id, cards) {
					var str = "九伐";
					if (player == game.me && !_status.auto) {
						str += "：选择并获得其中点数相同的牌各一张";
					}
					var dialog = ui.create.dialog(str, cards);
					dialog.videoId = id;
				},
				player,
				event.videoId,
				event.cards
			);
			event.time = get.utc();
			game.addVideo("showCards", player, ["九伐", get.cardsInfo(event.cards)]);
			game.addVideo("delay", null, 2);
			("step 3");
			var canChoose = event.cards.filter(i => event.cards.filter(j => i != j && get.number(i) == get.number(j)).length).map(i => get.number(i));
			var next = player.chooseButton([0, 4], true);
			next.set("dialog", event.videoId);
			next.set("canChoose", canChoose);
			next.set("filterButton", function (button) {
				if (!_status.event.canChoose.includes(get.number(button.link))) return false;
				for (var i = 0; i < ui.selected.buttons.length; i++) {
					if (get.number(ui.selected.buttons[i].link) == get.number(button.link)) return false;
				}
				return true;
			});
			next.set("ai", function (button) {
				return get.value(button.link, _status.event.player);
			});
			("step 4");
			if (result.bool && result.links) {
				event.cards2 = result.links;
			} else {
				event.finish();
			}
			var time = 1000 - (get.utc() - event.time);
			if (time > 0) {
				game.delay(0, time);
			}
			("step 5");
			game.broadcastAll("closeDialog", event.videoId);
			var cards2 = event.cards2;
			player.gain(cards2, "gain2");
			player.markSkill("taffyps_jiufa");
		},
		ai: {
			effect: {
				player: function (card, player, target) {
					if (
						!player
							.getExpansions("taffyps_jiufa")
							.map(i => i.name)
							.includes(card.name) &&
						get.type(card) == "equip" &&
						!get.cardtag(card, "gifts")
					)
						return [1, 3];
				},
			},
		},
	},
	taffyps_tianren: {
		audio: "tianren",
		trigger: {
			global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter"],
		},
		marktext: "任",
		intro: { content: "mark" },
		forced: true,
		filter: function (event, player) {
			if (event.name.indexOf("lose") == 0) {
				if (event.getlx === false || event.position != ui.discardPile) return false;
			} else {
				var evt = event.getParent();
				if (evt.relatedEvent && evt.relatedEvent.name == "useCard") return false;
			}
			return event.cards.some(i => ["basic", "trick"].includes(get.type(i, null, event.hs && event.hs.includes(i) ? event.player : false)));
		},
		content: function () {
			"step 0";
			var num = trigger.cards.filter(i => ["basic", "trick"].includes(get.type(i, null, trigger.hs && trigger.hs.includes(i) ? trigger.player : false))).length;
			event.num = num;
			("step 1");
			player.addMark("taffyps_tianren", 1);
			if (player.countMark("taffyps_tianren") >= player.maxHp) {
				player.removeMark("taffyps_tianren", player.countMark("taffyps_tianren"));
			} else event.goto(3);
			("step 2");
			player.gainMaxHp();
			player.draw(2);
			game.delayx();
			("step 3");
			if (--event.num) {
				event.goto(1);
			}
		},
	},
	taffyps_pingxiang: {
		audio: "pingxiang",
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "ice",
		filter(event, player) {
			return player.maxHp > 9;
		},
		content() {
			"step 0";
			player.awakenSkill("taffyps_pingxiang");
			player.loseMaxHp(9);
			event.num = 0;
			("step 1");
			event.num++;
			player.chooseUseTarget(
				{
					name: "sha",
					nature: "fire",
					isCard: true,
				},
				"请选择火【杀】的目标（" + (event.num == 9 ? "⑨" : event.num) + "/9）",
				false
			);
			("step 2");
			if (result.bool && event.num < 9) event.goto(1);
			else player.removeSkills("taffyps_jiufa");
			("step 3");
			player.addSkill("taffyps_pingxiang_effect");
		},
		ai: {
			order() {
				return get.order({
					name: "sha",
					nature: "fire",
					isCard: true,
				});
			},
			result: {
				player(player) {
					if (
						player.hasValueTarget({
							name: "sha",
							nature: "fire",
							isCard: true,
						})
					)
						return 1;
					return 0;
				},
			},
			combo: "taffyps_tianren",
		},
		subSkill: {
			effect: {
				marktext: "襄",
				intro: { content: "手牌上限基数改为体力上限" },
				mod: {
					maxHandcardBase(player) {
						return player.maxHp;
					},
				},
			},
		},
	},
	//郭照
	taffype_pianchong: {
		audio: "pianchong",
		trigger: { player: "phaseDrawBegin1" },
		filter: function (event, player) {
			return !event.numFixed;
		},
		content: function () {
			"step 0";
			trigger.changeToZero();
			var cards = get.bottomCards();
			if (cards.length) {
				var next = player.gain(cards, "gain2");
				next.delay = false;
				next.gaintag.add("taffype_pianchong");
			}
			player.draw();
			player.addTempSkill("taffype_pianchong_effect", { player: "phaseBegin" });
		},
		ai: {
			threaten: 4.8,
		},
		subSkill: {
			effect: {
				audio: "pianchong",
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				forced: true,
				charlotte: true,
				onremove: true,
				filter: function (event, player) {
					return event.getl(player).hs.length;
				},
				content: function () {
					"step 0";
					var evt = trigger.getl(player);
					var map = evt.gaintag_map;
					var num = evt.hs.filter(card => {
						return map[card.cardid] && map[card.cardid].includes("taffype_pianchong");
					}).length;
					if (num > 0) player.draw(num);
					var num2 = evt.hs.length - num;
					if (num2 > 0) {
						var cards = get.bottomCards(num2);
						if (cards.length) player.gain(cards, "gain2").gaintag.add("taffype_pianchong");
					}
				},
				mark: true,
				intro: {
					content: "当你失去一张“偏宠”牌后，你摸一张牌；当你失去一张非“偏宠”的手牌后，你获得牌堆底的牌并标记为“偏宠”。",
				},
			},
		},
	},
	taffype_zunwei: {
		audio: "zunwei",
		enable: "phaseUse",
		usable: 1,
		filter: function (event, player) {
			return !player.getStorage("taffype_zunwei").length < 3;
		},
		onremove: true,
		chooseButton: {
			dialog: function (event, player) {
				var list = ["将手牌摸至场上最多", "依次使用牌堆中的装备牌直到装备区牌数最多", "将体力回复至场上最大"];
				var choiceList = ui.create.dialog("尊位：请选择一项", "forcebutton", "hidden");
				choiceList.add([
					list.map((item, i) => {
						return [i, item];
					}),
					"textbutton",
				]);
				return choiceList;
			},
			filter: function (button) {
				const player = get.player();
				if (player.getStorage("taffype_zunwei").includes(button.link)) return false;
				if (button.link == 0) {
					return game.hasPlayer(current => {
						return current.countCards("h") > player.countCards("h");
					});
				}
				if (button.link == 1) {
					return game.hasPlayer(current => {
						return current.countCards("e") > player.countCards("e");
					});
				}
				if (button.link == 2) {
					if (!player.isDamaged()) return false;
					return game.hasPlayer(current => {
						return current.getHp() > player.getHp();
					});
				}
			},
			backup: function (links) {
				var next = {
					audio: "zunwei",
					filterCard: () => false,
					selectCard: -1,
				};
				next.content = lib.skill.taffype_zunwei.contents[links[0]];
				return next;
			},
			check: function (button) {
				var player = _status.event.player;
				switch (button.link) {
					case 0: {
						var target = game.findPlayer(function (current) {
							return current.isMaxHandcard();
						});
						return (target.countCards("h") - player.countCards("h")) * 0.8;
					}
					case 1: {
						var target = game.findPlayer(function (current) {
							return current.isMaxEquip();
						});
						return (target.countCards("e") - player.countCards("e")) * 1.4;
					}
					case 2: {
						var target = game.findPlayer(function (current) {
							return current.isMaxHp();
						});
						return (Math.min(target.hp, player.maxHp) - player.hp) * 2;
					}
				}
			},
			prompt: () => "请点击“确定”",
		},
		contents: [
			function () {
				var maxNum = 0;
				game.countPlayer(current => {
					if (current.countCards("h") > maxNum) maxNum = current.countCards("h");
				});
				player.drawTo(maxNum);
				player.markAuto("taffype_zunwei", [0]);
			},
			function () {
				"step 0";
				player.markAuto("taffype_zunwei", [1]);
				("step 1");
				var card = get.cardPile(card => {
					return get.type(card) == "equip";
				});
				if (card && player.hasUseTarget(card)) {
					player.chooseUseTarget(card, true).nopopup = true;
				} else event.finish();
				("step 2");
				if (game.hasPlayer(current => current.countCards("e") > player.countCards("e"))) event.goto(1);
			},
			function () {
				var maxNum = 0;
				game.countPlayer(current => {
					if (current.getHp() > maxNum) maxNum = current.getHp();
				});
				player.recover(maxNum - player.getHp(true));
				player.markAuto("taffype_zunwei", [2]);
			},
		],
		subSkill: {
			backup: {},
		},
		ai: {
			order: 0.5,
			result: {
				player: 1,
			},
		},
	},
	// 神沙摩柯
	taffyshen_gzjili: {
		audio: "gzjili",
		trigger: { player: ["useCard", "respond"] },
		frequent: true,
		locked: false,
		preHidden: true,
		filter: () => true,
		prompt2(event, player) {
			const num = player.getAttackRange() - player.countMark("taffyshen_gzjili");
			let info = "摸" + get.cnNumber(num) + "张牌";
			if (num === 1) info += "，然后重置【蒺藜】摸牌数";
			else if (num > 1) info += "，然后令你下次以此法摸的牌数-1";
			return info;
		},
		async content(event, trigger, player) {
			const { name: mark } = event;
			let num = player.getAttackRange() - player.countMark(mark);
			if (num > 1) {
				player.addMark(mark, 1, false);
				await player.draw(num);
			} else if (num === 1) {
				await player.draw(num);
				player.clearMark(mark, false);
			} else {
				player.clearMark(mark, false);
				num = player.getAttackRange() - player.countMark(mark);
				await player.draw(num);
			}
		},
		onremove: true,
		mark: true,
		intro: {
			markcount: (storage, player) => player.getAttackRange() - player.countMark("taffyshen_gzjili"),
			content: (storage, player) => `下次【蒺藜】摸牌数：${player.getAttackRange() - player.countMark("taffyshen_gzjili")}`,
		},
		group: ["taffyshen_gzjili_equip"],
		subSkill: {
			equip: {
				audio: "taffyshen_gzjili",
				trigger: {
					player: "useCardAfter",
				},
				silent: true,
				filter: function (event, player) {
					if (get.type(event.card) != "equip") return false;
					if (get.subtype(event.card) != "equip1") return false;
					return true;
				},
				content: function () {
					player.clearMark("taffyshen_gzjili", false);
				},
			},
		},
	},
	// 界沙摩柯
	taffyre_gzjili: {
		mod: {
			aiOrder(player, card, num) {
				if (player.isPhaseUsing() && get.subtype(card) == "equip1" && !get.cardtag(card, "gifts")) {
					var range0 = player.getAttackRange();
					var range = 0;
					var info = get.info(card);
					if (info && info.distance && info.distance.attackFrom) {
						range -= info.distance.attackFrom;
					}
					if (player.getEquip(1)) {
						var num = 0;
						var info = get.info(player.getEquip(1));
						if (info && info.distance && info.distance.attackFrom) {
							num -= info.distance.attackFrom;
						}
						range0 -= num;
					}
					range0 += range;
					if (
						(player.getHistory("useCard").length + player.getHistory("respond").length + 2) % range0 === 0 &&
						player.countCards("h", function (cardx) {
							return get.subtype(cardx) != "equip1" && player.getUseValue(cardx) > 0;
						})
					)
						return num + 10;
				}
			},
		},
		trigger: { player: ["useCard", "respond"] },
		frequent: true,
		locked: false,
		preHidden: true,
		onremove(player) {
			player.removeTip("taffyre_gzjili");
			player.clearMark("taffyre_gzjili", false);
		},
		filter(event, player) {
			let count = player.getHistory("useCard").length + player.getHistory("respond").length;
			player.addTip("taffyre_gzjili", "蒺藜 " + count, true);
			player.storage.taffyre_gzjili = count;
			return count % player.getAttackRange() === 0;
		},
		audio: "gzjili",
		content() {
			player.draw(player.getAttackRange());
		},
		ai: {
			threaten: 1.8,
			effect: {
				target_use(card, player, target, current) {
					let used = target.getHistory("useCard").length + target.getHistory("respond").length;
					if (get.subtype(card) == "equip1" && !get.cardtag(card, "gifts")) {
						if (player != target || !player.isPhaseUsing()) return;
						let range0 = player.getAttackRange();
						let range = 0;
						let info = get.info(card);
						if (info && info.distance && info.distance.attackFrom) {
							range -= info.distance.attackFrom;
						}
						if (player.getEquip(1)) {
							let num = 0;
							let info = get.info(player.getEquip(1));
							if (info && info.distance && info.distance.attackFrom) {
								num -= info.distance.attackFrom;
							}
							range0 -= num;
						}
						range0 += range;
						let delta = range0 - used;
						if (delta < 0) return;
						let num = player.countCards("h", function (card) {
							return (get.cardtag(card, "gifts") || get.subtype(card) != "equip1") && player.getUseValue(card) > 0;
						});
						if (delta == 2 && num > 0) return [1, 3];
						if (num >= delta) return "zeroplayertarget";
					} else if (get.tag(card, "respondShan") > 0) {
						if (current < 0 && used % (target.getAttackRange() - 1) === 0) {
							if (card.name === "sha") {
								if (
									!target.mayHaveShan(
										player,
										"use",
										target.getCards("h", i => {
											return i.hasGaintag("sha_notshan");
										})
									)
								)
									return;
							} else if (!target.mayHaveShan(player)) return 0.9;
							return [1, (used + 1) / 2];
						}
					} else if (get.tag(card, "respondSha") > 0) {
						if (current < 0 && used % (target.getAttackRange() - 1) === 0 && target.mayHaveSha(player)) return [1, (used + 1) / 2];
					}
				},
			},
		},
		group: "taffyre_gzjili_count",
		intro: {
			content: (storage, player) => `总次数：${storage}`,
		},
	},
	taffyre_gzjili_count: {
		trigger: { player: ["useCard1", "respond"] },
		silent: true,
		firstDo: true,
		noHidden: true,
		sourceSkill: "taffyre_gzjili",
		content() {
			player.storage.taffyre_gzjili = player.getHistory("useCard").length + player.getHistory("respond").length;
			player.markSkill("taffyre_gzjili");
		},
	},
	//夏侯玄
	taffyzunxiang_olhuanfu: {
		audio: "olhuanfu",
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			if (player == event.player && !event.isFirstTarget) {
				return false;
			}
			return player.maxHp > 0 && player.countCards("he") > 0;
		},
		direct: true,
		content() {
			"step 0";
			player.chooseToDiscard("he", [1, player.maxHp], get.prompt("taffyzunxiang_olhuanfu")).set("ai", function (card) {
				return 6 + num - get.value(card);
			}).logSkill = "taffyzunxiang_olhuanfu";
			("step 1");
			if (result.bool) {
				player.draw(2 * result.cards.length);
				var evt = trigger.getParent();
				evt.baseDamage = result.cards.length;
			}
		},
		ai: {
			effect: {
				target_use(card, player, target, current) {
					if (card.name == "sha" && target.hp > 0 && current < 0 && target.countCards("he") > 0) {
						return 0.7;
					}
				},
			},
		},
	},
	taffyzunxiang_olzeyue: {
		audio: "olzeyue",
		trigger: { player: "phaseZhunbeiBegin" },
		limited: true,
		skillAnimation: true,
		animationColor: "water",
		direct: true,
		filter(event, player) {
			var sources = [],
				history = player.actionHistory;
			for (var i = history.length - 1; i >= 0; i--) {
				if (i < history.length - 1 && history[i].isMe) {
					break;
				}
				for (var evt of history[i].damage) {
					if (evt.source && evt.source != player && evt.source.isIn()) {
						sources.add(evt.source);
					}
				}
			}
			for (var source of sources) {
				var skills = source.getStockSkills("一！", "五！");
				for (var skill of skills) {
					var info = get.info(skill);
					if (info && !info.persevereSkill && !info.charlotte && source.hasSkill(skill, null, null, false)) {
						return true;
					}
				}
			}
			return false;
		},
		content() {
			"step 0";
			var sources = [],
				history = player.actionHistory;
			for (var i = history.length - 1; i >= 0; i--) {
				if (i < history.length - 1 && history[i].isMe) {
					break;
				}
				for (var evt of history[i].damage) {
					if (evt.source && evt.source != player && evt.source.isIn()) {
						sources.add(evt.source);
					}
				}
			}
			sources = sources.filter(function (source) {
				var skills = source.getStockSkills("一！", "五！");
				for (var skill of skills) {
					var info = get.info(skill);
					if (info && !info.persevereSkill && !info.charlotte && source.hasSkill(skill, null, null, false)) {
						return true;
					}
				}
				return false;
			});
			player
				.chooseTarget(get.prompt("taffyzunxiang_olzeyue"), "令一名可选角色的一个技能失效", function (card, player, target) {
					return _status.event.sources.includes(target);
				})
				.set("sources", sources)
				.set("ai", function (target) {
					var player = _status.event.player,
						att = get.attitude(player, target);
					if (att >= 0) {
						return 0;
					}
					return get.threaten(target, player);
				});
			("step 1");
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("taffyzunxiang_olzeyue", target);
				player.awakenSkill(event.name);
				event.target = target;
				var skills = target.getStockSkills("一！", "五！");
				skills = skills.filter(function (skill) {
					var info = get.info(skill);
					if (info && !info.charlotte && target.hasSkill(skill, null, null, false)) {
						return true;
					}
				});
				if (skills.length == 1) {
					event._result = { control: skills[0] };
				} else {
					player.chooseControl(skills).set("prompt", "令" + get.translation(target) + "的一个技能失效");
				}
			} else {
				event.finish();
			}
			("step 2");
			var skill = result.control;
			target.disableSkill("taffyzunxiang_olzeyue_" + player.playerid, skill);
			target.storage["taffyzunxiang_olzeyue_" + player.playerid] = true;
			target.addSkill("taffyzunxiang_olzeyue_round");
			target.markAuto("taffyzunxiang_olzeyue_round", [player]);
			if (!target.storage.taffyzunxiang_olzeyue_map) {
				target.storage.taffyzunxiang_olzeyue_map = {};
			}
			target.storage.taffyzunxiang_olzeyue_map[player.playerid] = 0;
			game.log(target, "的技能", "#g【" + get.translation(skill) + "】", "被失效了");
		},
		ai: { threaten: 3 },
		subSkill: {
			round: {
				charlotte: true,
				marktext: "逆",
				intro: {
					name: "逆节",
					name2: "逆",
					content: "每轮结束时，你视为对令你获得“逆节”标记的角色依次使用X张无距离限制的【杀】，若此【杀】对其造成过伤害，所有结算完成后，你移去“逆节（X为你获得该标记的轮数）。",
					onunmark: true,
				},
				trigger: { global: "roundEnd" },
				filter(event, player) {
					var storage = player.getStorage("taffyzunxiang_olzeyue_round");
					for (var source of storage) {
						if (player.isIn() && player.canUse("sha", source, false)) {
							return true;
						}
					}
					return false;
				},
				forced: true,
				popup: false,
				content() {
					"step 0";
					event.targets = player.storage.taffyzunxiang_olzeyue_round.slice(0).sortBySeat();
					event.target = event.targets.shift();
					event.forceDie = true;
					("step 1");
					var map = player.storage.taffyzunxiang_olzeyue_map;
					console.log("taffy storage", player.storage, player.storage["taffyzunxiang_olzeyue_" + target.playerid], target.playerid);

					if (player.storage["taffyzunxiang_olzeyue_" + target.playerid]) {
						map[target.playerid]++;
					}
					event.num = map[target.playerid] - 1;
					if (event.num <= 0) {
						event.finish();
					}
					("step 2");
					event.num--;
					player.useCard(target, { name: "sha", isCard: true }, false, "taffyzunxiang_olzeyue_round");
					("step 3");
					var key = "taffyzunxiang_olzeyue_" + target.playerid;
					if (
						player.storage[key] &&
						target.hasHistory("damage", function (evt) {
							return evt.card.name == "sha" && evt.getParent().type == "card" && evt.getParent(3) == event;
						})
					) {
						for (var skill in player.disabledSkills) {
							if (player.disabledSkills[skill].includes(key)) {
								game.log(target, "恢复了技能", "#g【" + get.translation(skill) + "】");
							}
						}
						delete player.storage[key];
						player.enableSkill(key);
						player.removeSkill("taffyzunxiang_olzeyue_round");
					}
					if (event.num > 0 && target.isIn() && player.isIn() && player.canUse("sha", target, false)) {
						event.goto(2);
					} else if (event.targets.length > 0) {
						event.target = event.targets.shift();
						event.goto(1);
					}
				},
			},
		},
	},
};

export default diy;
