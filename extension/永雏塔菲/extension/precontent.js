import { lib, get, _status, ui, game, ai } from "./noname.js";
import { characterPackFunc } from "../character/index.js";

export const PRECONTENT = function (config) {
	if (config.enable) {
		const link = document.createElement("link");
		link.rel = "icon";
		link.href = `${lib.assetURL}extension/永雏塔菲/image/icon.png`;
		document.head.appendChild(link);
		// 引入css
		lib.init.css(lib.assetURL + "extension/永雏塔菲/style", "index");
		// 联机模式导入所有扩展喵
		const retryOverride = function (times, timer) {
			if (times < 0) return;
			if (_status.connectMode === undefined) {
				console.log(`%c替换联机函数：第${times}次尝试`, "color:pink");
				const ti = setTimeout(() => {
					retryOverride(times - 1, ti);
					clearTimeout(ti);
				}, 10);
			} else {
				Object.defineProperties(_status, {
					connectMode: {
						configurable: true,
						get: function () {
							return this._connectMode;
						},
						set: function (value) {
							this._connectMode = value;
							if (!value || !lib.extensions) return;
							const extensions = lib.extensions;
							const startBeforeFunction = lib.init.startBefore;
							lib.init.startBefore = function () {
								try {
									extensions.forEach(ext => {
										_status.extension = ext[0];
										_status.evaluatingExtension = ext[3];
										ext[1](ext[2], ext[4]);
										delete _status.extension;
										delete _status.evaluatingExtension;
										console.log(`%c${ext[0]}: 联机成功喵~`, "color:pink");
									});
								} catch (e) {
									console.log(e);
								}
								if (startBeforeFunction) startBeforeFunction.apply(this, arguments);
							};
						},
					},
					_connectMode: {
						value: false,
						writable: true,
					},
				});
				console.log("%c替换十周年UI联机函数成功喵~", "color:pink");
				if (timer) {
					clearTimeout(timer);
				}
			}
		};
		retryOverride(20);
		// 一些prefix样式补充
		const prefixList = [
			[
				"旧武",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("武")}`,
				},
			],
			[
				"旧TW",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("TW")}`,
				},
			],
			[
				"欢杀",
				{
					color: "#ff6a6a",
					nature: "MXpink",
					showName: "欢",
				},
			],
			[
				"欢杀神",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("欢杀")}${get.prefixSpan("神")}`,
				},
			],
			[
				"旧欢杀神",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("欢杀")}${get.prefixSpan("神")}`,
				},
			],
			[
				"旧OL",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("OL")}`,
				},
			],
			[
				"新杀神",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("新杀")}${get.prefixSpan("神")}`,
				},
			],
			[
				"旧族",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("族")}`,
				},
			],
			[
				"泳装",
				{
					color: "#6affe2",
					nature: "watermm",
					showName: "水",
				},
			],
			[
				"旧手杀神",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("手杀")}${get.prefixSpan("神")}`,
				},
			],
			[
				"旧OL谋",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("OL")}${get.prefixSpan("谋")}`,
				},
			],
			[
				"旧乐",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("乐")}`,
				},
			],
			[
				"旧手杀",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("手杀")}`,
				},
			],
			[
				"旧TW神",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("TW")}${get.prefixSpan("神")}`,
				},
			],
			[
				"旧幻",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("幻")}`,
				},
			],
			[
				"旧☆",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("☆")}`,
				},
			],
			[
				"红利期",
				{
					color: "#fd8359",
					nature: "soilmm",
					showName: "红",
				},
			],
			[
				"红利期手杀界",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("红利期")}${get.prefixSpan("手杀")}${get.prefixSpan("界")}`,
				},
			],
			[
				"旧威",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("威")}`,
				},
			],
			[
				"S系列",
				{
					color: "#c3f9ff",
					nature: "thundermm",
					showName: "Ｓ",
				},
			],
			[
				"S系列神",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("S系列")}${get.prefixSpan("神")}`,
				},
			],
			[
				"E系列",
				{
					color: "#c3f9ff",
					nature: "thundermm",
					showName: "Ｅ",
				},
			],
			[
				"极",
				{
					color: "#fdd559",
					nature: "soilmm",
				},
			],
			[
				"旧极",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("极")}`,
				},
			],
			[
				"旧势",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("势")}`,
				},
			],
			[
				"旧新杀SP",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("新杀")}${get.prefixSpan("SP")}`,
				},
			],
			[
				"旧新杀",
				{
					/**
					 * @returns {string}
					 */
					getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("新杀")}`,
				},
			],
			[
				"尊享版",
				{
					color: "#c3f9ff",
					nature: "thundermm",
					showName: "尊",
				},
			],
		];
		prefixList.forEach(i => {
			lib.namePrefix.set(i[0], i[1]);
		});
		characterPackFunc();
		lib.config.all.characters.splice(21, 0, "taffy_character");
		if (!lib.config.characters.includes("taffy_character")) {
			lib.config.characters.splice(21, 0, "taffy_character");
		}
		lib.translate["taffy_character" + "_character_config"] = "永雏塔菲";
		// 乱斗模式引入轮回七阴
		if (!lib.brawl) {
			lib.brawl = {};
		}
		const lunhuiqiyin = {
			name: "轮回七阴",
			mode: "identity",
			showcase: function (init) {
				var node = this;
				var getList = function () {
					let list = [];
					for (var i in lib.character) {
						if (lib.filter.characterDisabled(i)) continue;
						list.push(i);
					}
					list.randomSort();
					node.list = list;
				};
				var func = function () {
					getList();
					var card = ui.create.player(null, true);
					card.init(node.list.shift());
					card.node.marks.remove();
					card.node.count.remove();
					card.node.hp.remove();
					node.nodes.push(card);
					card.style.position = "absolute";
					var rand1 = Math.round(Math.random() * 100);
					var rand2 = Math.round(Math.random() * 100);
					var rand3 = Math.round(Math.random() * 40) - 20;
					card.style.left = "calc(" + rand1 + "% - " + rand1 + "px)";
					card.style.top = "calc(" + rand2 + "% - " + rand2 + "px)";
					card.style.transform = "scale(0.8) rotate(" + rand3 + "deg)";
					card.style.opacity = 0;
					node.appendChild(card);
					ui.refresh(card);
					card.style.opacity = 1;
					card.style.transform = "scale(1) rotate(" + rand3 + "deg)";
					if (node.nodes.length > 7) {
						setTimeout(function () {
							while (node.nodes.length > 7) {
								node.nodes.shift().delete();
							}
						}, 500);
					}
				};
				if (init) {
					node.nodes = [];
					for (var i = 0; i < 7; i++) {
						func();
					}
				}
				node.showcaseinterval = setInterval(func, 1000);
			},
			intro: ["无尽而漫长的1v7试炼", lib.config.lunhuiqiyin_level ? "你的最高纪录是连续击败" + lib.config.lunhuiqiyin_level + "位阴间，是否能够突破这一记录呢？" : "你能否击败所有阴间，把此处变为阳间呢？"],
			init: function () {
				if (!_status.lunhuiqiyin)
					_status.lunhuiqiyin = {
						completeNumber: 0,
						used: [],
						initResult: [],
						characterList: [],
						replace_character: function () {
							"step 0";
							_status.lunhuiqiyin.completeNumber++;
							if (!lib.config.lunhuiqiyin_level || lib.config.lunhuiqiyin_level < _status.lunhuiqiyin.completeNumber) {
								lib.config.lunhuiqiyin_level = _status.lunhuiqiyin.completeNumber;
								game.saveConfig("lunhuiqiyin_level", lib.config.lunhuiqiyin_level);
							}
							("step 1");
							var list = [];
							var list2 = [];
							list.push("我还想继续薄纱七阴！");
							list2.push(function () {});
							list.push("我不想再打了，直接在这里结束吧！");
							list2.push(function () {
								game.over(true);
							});
							event.list = list2;
							game.zhu
								.chooseControl()
								.set("choiceList", list)
								.set("prompt", "当前已击败" + _status.lunhuiqiyin.completeNumber + "位阴间，是否继续？");
							("step 2");
							if (result.index == 1) {
								game.over(true);
								return;
							}
							if (!_status.lunhuiqiyin.characterList.length) {
								return;
							}
							_status.lunhuiqiyin.characterList.removeArray(_status.lunhuiqiyin.used);
							var nameResult = {
								links: _status.lunhuiqiyin.characterList.randomGets(1),
							};
							game.uncheck();
							var source = event.parent.player;
							var name = nameResult.links[0];
							source.revive(null, false);
							_status.lunhuiqiyin.characterList.remove(name);
							_status.lunhuiqiyin.used.push(name);
							source.uninit();
							source.init(name);
							game.log(source, "出场");
							game.addVideo("reinit", source, [name]);
							source.lose(source.getCards("hej"))._triggered = null;
							var gain = 4;
							var add = 0;
							source.hp += add;
							source.maxHp += add;
							source.update();
							source.gain(get.cards(gain))._triggered = null;
							var cards = Array.from(ui.ordering.childNodes);
							while (cards.length) {
								cards.shift().discard();
							}
							var evt = event.getParent("dying");
							if (evt && evt.parent) {
								evt = evt.parent;
								evt.untrigger(false, source);
								for (var i = 0; i < 100; i++) {
									evt = evt.parent;
									if (evt.player == source) {
										evt.finish();
									}
									if (evt.name == "phase") {
										break;
									}
								}
							}
							game.triggerEnter(source);
						},
					};
				_status.lunhuiqiyin.player_number = get.config("player_number");
				game.saveConfig("player_number", "8", "identity");
			},
			content: {
				submode: "normal",
				chooseCharacterBefore: function () {
					game.identityVideoName = "轮回七阴";
					game.saveConfig("player_number", _status.lunhuiqiyin.player_number, "identity");
					game.chooseCharacter = function () {
						var next = game.createEvent("chooseCharacter", false);
						next.showConfig = true;
						next.setContent(function () {
							"step 0";
							ui.arena.classList.add("choose-character");
							game.me.identity = "zhu";
							game.zhu = game.me;
							game.fan = [];
							for (let i = 0; i < 7; i++) {
								if (i === 0) {
									game.fan.push(game.me.next);
								} else {
									game.fan.push(game.fan[i - 1].next);
								}
								game.fan[i].identity = "fan";
							}
							game.zhu.setIdentity();
							game.zhu.identityShown = true;
							game.zhu.node.identity.classList.remove("guessing");
							for (let i = 0; i < 7; i++) {
								game.fan[i].setIdentity();
								game.fan[i].identityShown = true;
								game.fan[i].node.identity.classList.remove("guessing");
							}
							event.list = [];
							for (var i in lib.character) {
								if (lib.filter.characterDisabled(i)) continue;
								event.list.push(i);
							}
							event.list.randomSort();
							_status.lunhuiqiyin.characterList = event.list.slice(0);
							var list = event.list.slice(0, 5);
							delete event.swapnochoose;
							var dialog;
							if (event.swapnodialog) {
								dialog = ui.dialog;
								event.swapnodialog(dialog, list);
								delete event.swapnodialog;
							} else {
								var str = "选择角色";
								dialog = ui.create.dialog(str, "hidden", [list, "character"]);
							}
							dialog.setCaption("选择角色");
							game.me.chooseButton(dialog, true).set("onfree", true);

							ui.create.cheat = function () {
								_status.createControl = ui.cheat2;
								ui.cheat = ui.create.control("更换", function () {
									if (ui.cheat2 && ui.cheat2.dialog == _status.event.dialog) {
										return;
									}
									if (game.changeCoin) {
										game.changeCoin(-3);
									}

									event.list.randomSort();
									list = event.list.slice(0, 5);

									var buttons = ui.create.div(".buttons");
									var node = _status.event.dialog.buttons[0].parentNode;
									_status.event.dialog.buttons = ui.create.buttons(list, "character", buttons);
									_status.event.dialog.content.insertBefore(buttons, node);
									buttons.animate("start");
									node.remove();
									game.uncheck();
									game.check();
								});
								delete _status.createControl;
							};
							if (lib.onfree) {
								lib.onfree.push(function () {
									event.dialogxx = ui.create.characterDialog("heightset");
									if (ui.cheat2) {
										ui.cheat2.animate("controlpressdownx", 500);
										ui.cheat2.classList.remove("disabled");
									}
								});
							} else {
								event.dialogxx = ui.create.characterDialog("heightset");
							}

							ui.create.cheat2 = function () {
								ui.cheat2 = ui.create.control("自由选将", function () {
									if (this.dialog == _status.event.dialog) {
										if (game.changeCoin) {
											game.changeCoin(50);
										}
										this.dialog.close();
										_status.event.dialog = this.backup;
										this.backup.open();
										delete this.backup;
										game.uncheck();
										game.check();
										if (ui.cheat) {
											ui.cheat.animate("controlpressdownx", 500);
											ui.cheat.classList.remove("disabled");
										}
									} else {
										if (game.changeCoin) {
											game.changeCoin(-10);
										}
										this.backup = _status.event.dialog;
										_status.event.dialog.close();
										_status.event.dialog = _status.event.parent.dialogxx;
										this.dialog = _status.event.dialog;
										this.dialog.open();
										game.uncheck();
										game.check();
										if (ui.cheat) {
											ui.cheat.classList.add("disabled");
										}
									}
								});
								if (lib.onfree) {
									ui.cheat2.classList.add("disabled");
								}
							};
							if (!_status.brawl || !_status.brawl.chooseCharacterFixed) {
								if (!ui.cheat && get.config("change_choice")) ui.create.cheat();
								if (!ui.cheat2 && get.config("free_choose")) ui.create.cheat2();
							}
							("step 1");
							if (ui.cheat) {
								ui.cheat.close();
								delete ui.cheat;
							}
							if (ui.cheat2) {
								ui.cheat2.close();
								delete ui.cheat2;
							}
							game.addRecentCharacter(result.buttons[0].link);
							game.zhu.init(result.buttons[0].link);
							_status.lunhuiqiyin.characterList.remove(result.buttons[0].link);
							_status.lunhuiqiyin.used.add(result.buttons[0].link);
							("step 2");
							for (let i = 0; i < 7; i++) {
								_status.lunhuiqiyin.initResult.push({
									links: _status.lunhuiqiyin.characterList.randomGets(1),
								});
								_status.lunhuiqiyin.characterList.remove(_status.lunhuiqiyin.initResult[i].links[0]);
							}
							("step 3");
							for (let i = 0; i < 7; i++) {
								game.fan[i].init(_status.lunhuiqiyin.initResult[i].links[0]);
								_status.lunhuiqiyin.used.add(_status.lunhuiqiyin.initResult[i].links[0]);
							}
							if (event.draw) {
								game.zhu.directgain(get.cards(event.draw));
							}
							setTimeout(function () {
								ui.arena.classList.remove("choose-character");
							}, 500);
							game.addOverDialog = function (dialog) {
								dialog.addText("共计击败" + _status.lunhuiqiyin.completeNumber + "位阴间");
							};
							lib.element.player.dieAfter = function () {
								_status.lunhuiqiyin.characterList.removeArray(_status.lunhuiqiyin.used);
								if (game.zhu == this) {
									var bool = false;
									game.over(bool);
								} else if (get.population("fan") == 0) {
									_status.lunhuiqiyin.completeNumber++;
									if (!lib.config.lunhuiqiyin_level || lib.config.lunhuiqiyin_level < _status.lunhuiqiyin.completeNumber) {
										lib.config.lunhuiqiyin_level = _status.lunhuiqiyin.completeNumber;
										game.saveConfig("lunhuiqiyin_level", lib.config.lunhuiqiyin_level);
									}
									var bool = true;
									game.over(bool);
								} else {
									var next = game.createEvent("lunhuiqiyin_replace", false, _status.event.getParent());
									next.source = player;
									next.setContent(_status.lunhuiqiyin.replace_character);
								}
							};
							lib.element.player.dieAfter2 = function () {
								_status.lunhuiqiyin.characterList.removeArray(_status.lunhuiqiyin.used);
							};
							game.zhu.dieAfter = lib.element.player.dieAfter;
							for (let i = 0; i < 7; i++) {
								game.fan[i].dieAfter = lib.element.player.dieAfter;
							}
							game.zhu.dieAfter2 = lib.element.player.dieAfter2;
							for (let i = 0; i < 7; i++) {
								game.fan[i].dieAfter2 = lib.element.player.dieAfter2;
							}
						});
					};
				},
			},
		};
		lib.brawl.lunhuiqiyin = lunhuiqiyin;
		lib.mode.brawl.config.lunhuiqiyin = {
			name: "轮回七阴",
			init: true,
			frequent: true,
		};
	}
};
