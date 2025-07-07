app.import((lib, game, ui, get, ai, _status, app) => {
	const plugin = {
		name: "character",
		filter() {
			return !["chess", "tafang"].includes(get.mode());
		},
		content(next) {},
		precontent() {
			app.reWriteFunction(lib, {
				setIntro: [
					function (args, node) {
						if (get.itemtype(node) === "player") {
							if (lib.config.touchscreen) {
								lib.setLongPress(node, plugin.click.playerIntro);
							} else if (lib.config.right_info) {
								node.oncontextmenu = plugin.click.playerIntro;
							}
							return node;
						}
					},
				],
			});
		},
		click: {
			identity(e) {
				e.stopPropagation();
				const player = this.parentNode;
				if (!game.getIdentityList) return;
				if (player.node.guessDialog) {
					player.node.guessDialog.classList.toggle("hidden");
				} else {
					const list = game.getIdentityList(player);
					if (!list) return;
					const guessDialog = ui.create.div(".guessDialog", player);
					const container = ui.create.div(guessDialog);
					lib.setScroll(guessDialog);
					player.node.guessDialog = guessDialog;
				}
			},
			playerIntro(e) {
				// taffy: 修复浏览器右键会默认冒出选项喵
				e.preventDefault();
				/* taffy分界线 */
				e.stopPropagation();
				if (plugin.playerDialog) {
					return plugin.playerDialog.show(this);
				}
				const container = ui.create.div(".popup-container.hidden", ui.window, function (e) {
					if (e.target === container) {
						container.hide();
						game.resume2();
					}
				});
				const dialog = ui.create.div(".character-dialog.popped", container);
				const blackBg1 = ui.create.div(".blackBg.one", dialog);
				const blackBg2 = ui.create.div(".blackBg.two", dialog);
				const basicInfo = ui.create.div(".basicInfo", blackBg1);
				const officalMap = {
					offical_icon_1: "士兵",
					offical_icon_2: "十夫长",
					offical_icon_3: "百夫长",
					offical_icon_4: "千夫长",
					offical_icon_5: "校尉",
					offical_icon_6: "先锋",
					offical_icon_7: "中军将军",
					offical_icon_8: "领军将军",
					offical_icon_9: "骠骑将军",
					offical_icon_10: "大将军",
					offical_icon_11: "大元帅",
				};
				const officalbg = ui.create.div(".offical-bg", blackBg1);
				const officalIcon = ui.create.div(".offical-icon", officalbg);
				const randomOffical = Object.keys(officalMap).randomGet();
				officalIcon.setBackgroundImage(`extension/十周年UI/shoushaUI/character/images/shousha/${randomOffical}.png`);
				ui.create.div(".offical-text", officalMap[randomOffical], officalbg);
				const fightbg = ui.create.div(".fight-bg", blackBg1);
				const rightPane = ui.create.div(".right", blackBg2);
				const mingcheng = ui.create.div(".mingcheng", basicInfo);
				const dengji = ui.create.div(".dengji", basicInfo);
				const shenglv = ui.create.div(".shenglv", fightbg);
				const taolv = ui.create.div(".shenglv", fightbg);
				const viewBusinessCard = ui.create.div(".viewBusinessCard", "查看名片", blackBg1);
				const createButton = (name, parent) => {
					if (!name || !lib.character[name]) return;
					ui.create.button(name, "character", parent, true);
				};
				container.show = function (player) {
					let name = player.name1 || player.name;
					let name2 = player.name2;
					if (player.classList.contains("unseen") && player !== game.me) {
						name = "unknown";
					}
					if (player.classList.contains("unseen2") && player !== game.me) {
						name2 = "unknown";
					}
					let biankuang;
					if (lib.config.extension_十周年UI_ZLLT) {
						biankuang = ui.create.div(".biankuang", blackBg2);
					} else {
						biankuang = ui.create.div(".biankuang2", blackBg2);
					}
					biankuang.setBackgroundImage(`extension/十周年UI/shoushaUI/character/images/shousha/name2_${player.group}.png`);
					let leftPane;
					if (lib.config.extension_十周年UI_ZLLT) {
						leftPane = ui.create.div(".left", biankuang);
					} else {
						leftPane = ui.create.div(".left2", biankuang);
					}
					leftPane.style.backgroundImage = player.node.avatar.style.backgroundImage;
					createButton(name, leftPane.firstChild);
					createButton(name2, leftPane.firstChild);
					const biankuangname = ui.create.div(".biankuangname", biankuang);
					const xing = ui.create.div(".xing", biankuang);
					let num = 1;
					const rarity = game.getRarity(player.name);
					switch (rarity) {
						case "legend":
							num = 5;
							break;
						case "epic":
							num = 4;
							break;
						case "rare":
							num = 3;
							break;
						case "junk":
							num = 2;
							break;
						default:
							num = 1;
							break;
					}
					for (let i = 0; i < num; i++) ui.create.div(".item", xing);
					biankuangname.innerText = get.translation(player.name);
					mingcheng.innerText = get.translation(player.name);
					dengji.innerText = `Lv：${Math.floor(Math.random() * 200 + 1)}`;
					shenglv.innerHTML = `<span style="font-size: 20px;">胜率：</span>${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 100)}%`;
					taolv.innerHTML = `<span style="font-size: 20px;">逃率：</span>${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 100)}%`;
					dialog.classList.add("single");
					viewBusinessCard.onclick = function () {
						const popuperContainer = ui.create.div(".popup-container", { background: "rgb(0,0,0,0)" }, ui.window);
						popuperContainer.addEventListener("click", event => {
							event.stopPropagation();
							popuperContainer.delete(200);
						});
						const bigdialog = ui.create.div(".bigdialog", popuperContainer);
						[1, 2, 3, 4].forEach(i => ui.create.div(`.kuangkuang${i}`, bigdialog));
						const shanchangArr = [1, 2, 3, 4].map(i => ui.create.div(`.shanchang${i}`, bigdialog));
						const minixingxiang = ui.create.div(".minixingxiang", bigdialog);
						const jingji = ui.create.div(".jingji", bigdialog);
						const xingbie = ui.create.div(".xingbie", bigdialog);
						const useless = ui.create.div(".useless", bigdialog);
						const useless2 = ui.create.div(".useless2", bigdialog);
						const wanjiaming = ui.create.div(
							".wanjiaming",
							bigdialog,
							player === game.me
								? lib.config.connect_nickname
								: get.translation(
										[
											"氪金抽66",
											"卡宝真可爱",
											"蒸蒸日上",
											"√卡视我如父",
											"麒麟弓免疫枸杞",
											"坏可宣（老坏批）",
											"六千大败而归",
											"开局酒古锭",
											"遇事不决刷个乐",
											"见面两刀喜相逢",
											"改名出66",
											"时代的六万五",
											"韩旭",
											"司马长衫",
											"ogx",
											"狗卡不如无名杀",
											"王八万",
											"一拳兀突骨",
											"开局送神将",
											"丈八二桃",
											"装甲车车",
											"等我喝口酒",
											"Samuri",
											"马",
											"Log-Frunki",
											"aoe银钱豹",
											"没有丈八就托管",
											"无中yyds",
											"给咸鱼鸽鸽打call",
											"小零二哟～",
											"长歌最帅了",
											"大猫有侠者之风",
											"布灵布灵❤️",
											"我爱～摸鱼🐠～",
											"小寻寻真棒",
											"呲牙哥超爱笑",
											"是俺杀哒",
											"阿七阿七",
											"祖安·灰晖是龙王",
											"吃颗桃桃好遗计",
											"好可宣✓良民",
											"藏海表锅好",
											"金乎？木乎？水乎！！",
											"无法也无天",
											"西风不识相",
											"神秘喵酱",
											"星城在干嘛？",
											"子鱼今天摸鱼了吗？",
											"阳光苞里有阳光",
											"诗笺的小裙裙",
											"轮回中的消逝",
											"乱踢jb的云野",
											"小一是不是...是不是...",
											"美羊羊爱瑟瑟",
											"化梦的星辰",
											"杰哥带你登dua郎",
											"世中君子人",
											"叹年华未央",
											"短咕咕",
											"洛天依？！",
											"黄老板是好人～",
											"来点瑟瑟文和",
											"鲨鱼配辣椒",
											"萝卜～好萝卜",
											"废城君",
											"E佬细节鬼才",
											"感到棘手要怀念谁？",
											"半价小薯片",
											"JK欧拉欧拉欧拉",
											"新年快乐",
											"乔姐带你飞",
											"12345678？",
											"缘之空",
											"小小恐龙",
											"教主：杀我！",
											"才思泉涌的司马",
											"我是好人",
											"喜怒无常的大宝",
											"黄赌毒",
											"阴间杀～秋",
											"敢于劈瓜的关羽",
											"暮暮子",
										].randomGet(1)
								  )
						);
						ui.create.div(".gonghui", bigdialog, get.translation(`(${["无名杀会员", "手机三国杀会员", "三国杀ol会员", "三国杀十周年会员", "怒焰三国杀会员", "欢乐三国杀会员", "阵面对决会员"].randomGet(1)})`));
						ui.create.div(".xianhua", bigdialog, get.translation(`鲜花${Math.floor(Math.random() * 999 + 1)}`));
						ui.create.div(".jidan", bigdialog, get.translation(`鸡蛋${Math.floor(Math.random() * 999 + 1)}`));
						ui.create.div(".fenxiang", bigdialog, get.translation("分享"));
						ui.create.div(".zhanshi", bigdialog, get.translation("展示(诏令－1)"));
						const list = Object.keys(lib.character).filter(i => !lib.filter.characterDisabled(i));
						_status.characterlist = list;
						event.filterChoice = function (name1, name2) {
							const info1 = lib.character[name1];
							const info2 = lib.character[name2];
							if (!info1 || !info2) return;
							let num = 0;
							if (info1[0] == info2[0]) num++;
							if (get.infoMaxHp(info1[2]) == get.infoMaxHp(info2[2])) num++;
							if (info1[3].length == info2[3].length) num++;
							return num > 1;
						};
						let shanchang = list.randomGets(4);
						shanchangArr.forEach((element, i) => {
							const value = shanchang[i % shanchang.length];
							element.setBackground(value, "character");
						});
						const jingjitu = ["jingji1", "jingji2", "jingji3", "jingji4"];
						const xingbietu = ["xingbie1", "xingbie2"];
						useless.setBackgroundImage("extension/十周年UI/shoushaUI/character/images/shousha/useless.png");
						useless2.setBackgroundImage("extension/十周年UI/shoushaUI/character/images/shousha/useless2.png");
						minixingxiang.style.backgroundImage = player.node.avatar.style.backgroundImage;
						jingji.setBackgroundImage(`extension/十周年UI/shoushaUI/character/images/shousha/${jingjitu.randomGet()}.png`);
						xingbie.setBackgroundImage(`extension/十周年UI/shoushaUI/character/images/shousha/${xingbietu.randomGet()}.png`);
					};
					rightPane.innerHTML = "<div></div>";
					lib.setScroll(rightPane.firstChild);
					let oSkills = player.getSkills(null, false, false).slice(0);
					oSkills = oSkills.filter(skill => lib.skill[skill] && skill !== "jiu" && !lib.skill[skill].nopop && !lib.skill[skill].equipSkill && lib.translate[skill + "_info"] && lib.translate[skill + "_info"] !== "");
					if (player == game.me && player.hiddenSkills.length) oSkills.addArray(player.hiddenSkills);
					const allShown = player.isUnderControl() || (!game.observe && game.me && game.me.hasSkillTag("viewHandcard", null, player, true));
					const shownHs = player.getShownCards();
					if (shownHs.length) {
						ui.create.div(".xcaption", player.hasCard(card => !shownHs.includes(card), "h") ? "明置的手牌" : "手牌区域", rightPane.firstChild);
						shownHs.forEach(item => {
							const card = game.createCard(get.name(item, false), get.suit(item, false), get.number(item, false), get.nature(item, false));
							card.style.zoom = "0.6";
							rightPane.firstChild.appendChild(card);
						});
						if (allShown) {
							const hs = player.getCards("h");
							hs.removeArray(shownHs);
							if (hs.length) {
								ui.create.div(".xcaption", "其他手牌", rightPane.firstChild);
								hs.forEach(item => {
									const card = game.createCard(get.name(item, false), get.suit(item, false), get.number(item, false), get.nature(item, false));
									card.style.zoom = "0.6";
									rightPane.firstChild.appendChild(card);
								});
							}
						}
					} else if (allShown) {
						const hs = player.getCards("h");
						if (hs.length) {
							ui.create.div(".xcaption", "手牌区域", rightPane.firstChild);
							hs.forEach(item => {
								const card = game.createCard(get.name(item, false), get.suit(item, false), get.number(item, false), get.nature(item, false));
								card.style.zoom = "0.6";
								rightPane.firstChild.appendChild(card);
							});
						}
					}
					if (oSkills.length) {
						ui.create.div(".xcaption", "武将技能", rightPane.firstChild);
						oSkills.forEach(name => {
							if (player.forbiddenSkills[name]) {
								if (player.forbiddenSkills[name].length) ui.create.div(".xskill", `<div data-color><span style="opacity:0.5">【${lib.translate[name]}】</span></div><div><span style="opacity:0.5">（与${get.translation(player.forbiddenSkills[name])}冲突）${get.skillInfoTranslation(name, player)}</span></div>`, rightPane.firstChild);
								else ui.create.div(".xskill", `<div data-color><span style="opacity:0.5">【${lib.translate[name]}】</span></div><div><span style="opacity:0.5">（双将禁用）${get.skillInfoTranslation(name, player)}</span></div>`, rightPane.firstChild);
							} else if (player.hiddenSkills.includes(name)) {
								if (lib.skill[name].preHidden && get.mode() == "guozhan") {
									const id = ui.create.div(".xskill", `<div data-color><span style="opacity:0.5">【${lib.translate[name]}】</span></div><div><span style="opacity:0.5">${get.skillInfoTranslation(name, player)}</span><br><div class="underlinenode on gray" style="position:relative;padding-left:0;padding-top:7px">预亮技能</div></div>`, rightPane.firstChild);
									const underlinenode = id.querySelector(".underlinenode");
									if (_status.prehidden_skills.includes(name)) underlinenode.classList.remove("on");
									underlinenode.link = name;
									underlinenode.listen(ui.click.hiddenskill);
								} else {
									ui.create.div(".xskill", `<div data-color><span style="opacity:0.5">【${lib.translate[name]}】</span></div><div><span style="opacity:0.5">${get.skillInfoTranslation(name, player)}</span></div>`, rightPane.firstChild);
								}
							} else if (!player.getSkills().includes(name) || player.awakenedSkills.includes(name)) {
								ui.create.div(".xskill", `<div data-color><span style="opacity:0.5">【${lib.translate[name]}】</span></div><div><span style="opacity:0.5">${get.skillInfoTranslation(name, player)}</span></div>`, rightPane.firstChild);
							} else if (lib.skill[name].frequent || lib.skill[name].subfrequent) {
								const id = ui.create.div(".xskill", `<div data-color>【${lib.translate[name]}】</div><div>${get.skillInfoTranslation(name, player)}<br><div class="underlinenode on gray" style="position:relative;padding-left:0;padding-top:7px">自动发动</div></div>`, rightPane.firstChild);
								const underlinenode = id.querySelector(".underlinenode");
								if (lib.skill[name].frequent) {
									if (lib.config.autoskilllist.includes(name)) {
										underlinenode.classList.remove("on");
									}
								}
								if (lib.skill[name].subfrequent) {
									for (let j = 0; j < lib.skill[name].subfrequent.length; j++) {
										if (lib.config.autoskilllist.includes(name + "_" + lib.skill[name].subfrequent[j])) {
											underlinenode.classList.remove("on");
										}
									}
								}
								if (lib.config.autoskilllist.includes(name)) underlinenode.classList.remove("on");
								underlinenode.link = name;
								underlinenode.listen(ui.click.autoskill2);
							} else if (lib.skill[name].clickable && player.isIn() && player.isUnderControl(true)) {
								const id = ui.create.div(".xskill", `<div data-color>【${lib.translate[name]}】</div><div>${get.skillInfoTranslation(name, player)}<br><div class="menubutton skillbutton" style="position:relative;margin-top:5px">点击发动</div></div>`, rightPane.firstChild);
								const intronode = id.querySelector(".skillbutton");
								if (!_status.gameStarted || (lib.skill[name].clickableFilter && !lib.skill[name].clickableFilter(player))) {
									intronode.classList.add("disabled");
									intronode.style.opacity = 0.5;
								} else {
									intronode.link = player;
									intronode.func = lib.skill[name].clickable;
									intronode.classList.add("pointerdiv");
									intronode.listen(ui.click.skillbutton);
								}
							} else {
								ui.create.div(".xskill", `<div data-color>【${lib.translate[name]}】</div><div>${get.skillInfoTranslation(name, player)}</div>`, rightPane.firstChild);
							}
						});
					}
					const eSkills = player.getCards("e");
					if (eSkills.length) {
						ui.create.div(".xcaption", "装备区域", rightPane.firstChild);
						eSkills.forEach(card => {
							const cards = card.cards;
							let str = [get.translation(card), get.translation(card.name + "_info")];
							if (Array.isArray(cards) && cards.length) str[0] += `（${get.translation(card.cards)}）`;
							if (lib.card[card.name]?.cardPrompt) str[1] = lib.card[card.name].cardPrompt(card, player);
							ui.create.div(".xskill", `<div data-color>${str[0]}</div><div>${str[1]}</div>`, rightPane.firstChild);
						});
					}
					const judges = player.getCards("j");
					if (judges.length) {
						ui.create.div(".xcaption", "判定区域", rightPane.firstChild);
						judges.forEach(card => {
							const cards = card.cards;
							let str = [get.translation(card), get.translation(card.name + "_info")];
							if ((Array.isArray(cards) && cards.length && !lib.card[card]?.blankCard) || player.isUnderControl(true)) str[0] += `（${get.translation(cards)}）`;
							ui.create.div(".xskill", `<div data-color>${str[0]}</div><div>${str[1]}</div>`, rightPane.firstChild);
						});
					}
					container.classList.remove("hidden");
					if (!lib.config["extension_十周年UI_viewInformationPause"]) game.pause2();
				};
				plugin.characterDialog = container;
				container.show(this);
			},
		},
	};
	return plugin;
});
