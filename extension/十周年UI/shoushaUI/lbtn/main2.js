app.import(function (lib, game, ui, get, ai, _status, app) {
	// 常量定义
	const MODES = {
		IDENTITY: "identity",
		DOUDIZHU: "doudizhu",
		GUOZHAN: "guozhan",
		VERSUS: "versus",
		SINGLE: "single",
		MARTIAL: "martial",
	};
	const IDENTITIES = {
		ZHU: "zhu",
		ZHONG: "zhong",
		FAN: "fan",
		NEI: "nei",
	};
	const GROUPS = {
		UNKNOWN: "unknown",
		UNDEFINED: "undefined",
		WEI: "wei",
		SHU: "shu",
		WU: "wu",
		QUN: "qun",
		JIN: "jin",
		YE: "ye",
	};
	const BACKGROUNDS = ["人间安乐", "兵临城下", "兵荒马乱", "三国开黑节", "华灯初上", "天书乱斗", "朝堂之上", "校园行", "桃园风格", "汉室当兴", "游卡桌游", "十周年"];
	// 工具函数
	const utils = {
		playAudio(path) {
			game.playAudio(path);
		},
		createImage(src, style) {
			const img = ui.create.node("img");
			img.src = lib.assetURL + src;
			img.style.cssText = style;
			return img;
		},
		createDiv(className, container, clickHandler) {
			const div = ui.create.div(className, container);
			if (clickHandler) {
				div.addEventListener("click", clickHandler);
			}
			return div;
		},
		getButtonStyle(width, height, top, left, zIndex = 1) {
			return `display: block;--w: ${width}px;--h: calc(var(--w) * ${height});width: var(--w);height: var(--h);position: absolute;top: ${top};left: ${left};background-color: transparent;z-index:${zIndex}`;
		},
	};
	// 身份提示映射
	const identityTips = {
		[IDENTITIES.ZHU]: ".Tipzhugong",
		[IDENTITIES.ZHONG]: ".Tipzhongchen",
		[IDENTITIES.FAN]: ".Tipfanzei",
		[IDENTITIES.NEI]: ".Tipneijian",
	};
	// 斗地主身份提示映射
	const doudizhuTips = {
		[IDENTITIES.ZHU]: ".Tipdizhu",
		[IDENTITIES.FAN]: ".Tipnongmin",
	};
	// 国战势力提示映射
	const groupTips = {
		[GROUPS.UNKNOWN]: ".Tipundefined",
		[GROUPS.UNDEFINED]: ".Tipundefined",
		[GROUPS.WEI]: ".Tipweiguo",
		[GROUPS.SHU]: ".Tipshuguo",
		[GROUPS.WU]: ".Tipwuguo",
		[GROUPS.QUN]: ".Tipqunxiong",
		[GROUPS.JIN]: ".Tipjinguo",
		[GROUPS.YE]: ".Tipyexinjia",
	};
	// 创建问号按钮
	function createQuestionButton() {
		const isTouch = lib.config.phonelayout;
		const bottomOffset = isTouch ? "calc(100% - 55px)" : "calc(100% - 105px)"; // 非触屏布局往下移动20px
		const questionBtn = utils.createImage("extension/十周年UI/shoushaUI/lbtn/images/CD/wenhao.png", `display: block;width: 40px;height: 29px;position: absolute;bottom: ${bottomOffset};left: calc(100% - 159.5px);background-color: transparent;z-index:3`);
		questionBtn.onclick = function () {
			const popupContainer = ui.create.div(".popup-container", ui.window);
			utils.playAudio("../extension/十周年UI/shoushaUI/lbtn/images/SSCD/label.mp3");
			// 根据游戏模式显示不同提示
			if (lib.config.mode === MODES.IDENTITY) {
				const tipClass = identityTips[game.me.identity];
				if (tipClass) {
					ui.create.div(tipClass, popupContainer);
				}
			} else if (lib.config.mode === MODES.DOUDIZHU) {
				const tipClass = doudizhuTips[game.me.identity];
				if (tipClass) {
					ui.create.div(tipClass, popupContainer);
				}
			} else if (lib.config.mode === MODES.VERSUS) {
				ui.create.div(".Tiphu", popupContainer);
			} else if (lib.config.mode === MODES.GUOZHAN) {
				const tipClass = groupTips[game.me.group] || ".Tipweizhi";
				ui.create.div(tipClass, popupContainer);
			}
			popupContainer.addEventListener("click", event => {
				utils.playAudio("../extension/十周年UI/shoushaUI/lbtn/images/SSCD/caidan.mp3");
				popupContainer.delete(200);
			});
		};
		document.body.appendChild(questionBtn);
	}
	// 创建手牌整理按钮
	function createSortButton() {
		const isRightLayout = lib.config["extension_十周年UI_rightLayout"] === "on";
		const isTouch = lib.config.phonelayout;
		const sortImg = isTouch ? "zhengli.png" : "zhenglix.png";
		let sortBtnStyle;
		if (isTouch) {
			sortBtnStyle = isRightLayout ? utils.getButtonStyle(88, "81/247", "calc(100% - 35px)", "calc(100% - 380px)", 7) : utils.getButtonStyle(88, "81/247", "calc(100% - 35px)", "calc(100% - 1260px)", 7);
		} else {
			sortBtnStyle = isRightLayout ? utils.getButtonStyle(45, "110/170", "calc(100% - 45px)", "calc(100% - 290px)", 7) : utils.getButtonStyle(88, "81/247", "calc(100% - 33px)", "right: calc(100% - 367.2px)", 4);
		}
		const sortBtn = utils.createImage(`extension/十周年UI/shoushaUI/lbtn/images/uibutton/${sortImg}`, sortBtnStyle);
		sortBtn.onclick = function () {
			if (!game.me || game.me.hasSkillTag("noSortCard")) return;
			const cards = game.me.getCards("hs");
			const sortFunction = function (b, a) {
				if (a.name !== b.name) return lib.sort.card(a.name, b.name);
				if (a.suit !== b.suit) return lib.suit.indexOf(a) - lib.suit.indexOf(b);
				return a.number - b.number;
			};
			if (cards.length > 1) {
				cards.sort(sortFunction);
				cards.forEach(function (card, index) {
					game.me.node.handcards1.insertBefore(cards[index], game.me.node.handcards1.firstChild);
				});
				dui.queueNextFrameTick(dui.layoutHand, dui);
			}
		};
		// 定时检测手牌数，动态显示/隐藏整理按钮
		sortBtn.style.display = "none";
		document.body.appendChild(sortBtn);
		function updateSortButtonVisibility() {
			sortBtn.style.display = game.me && game.me.getCards("hs").length >= 4 ? "block" : "none";
		}
		setInterval(updateSortButtonVisibility, 1000);
		updateSortButtonVisibility();
	}
			// 创建右上角菜单
		function createTopRightMenu() {
			const isTouch = lib.config.phonelayout;
			const topOffset = isTouch ? "10px" : "60px"; // 非触屏布局往下移动50px
			// 背景阴影
			const shadow = utils.createImage("extension/十周年UI/shoushaUI/lbtn/images/uibutton/yinying.png", "display: block;width: 100%;height: 30%;position: absolute;bottom: 0px;background-color: transparent;z-index:-4");
			document.body.appendChild(shadow);
			// 菜单按钮
			const menuBtn = utils.createImage("extension/十周年UI/shoushaUI/lbtn/images/CD/button3.png", `display: block;--w: 56px;--h: calc(var(--w) * 74/71);width: var(--w);height: var(--h);position: absolute;top: ${topOffset};right: 55px;background-color: transparent;z-index:5`);
			document.body.appendChild(menuBtn);
			let menuPopup = null;
			function openMenu() {
				if (menuPopup) return;
				utils.playAudio("../extension/十周年UI/shoushaUI/lbtn/images/CD/click.mp3");
				menuPopup = ui.create.div(".popup-container", { background: "rgb(0,0,0,0)" }, ui.window);
				menuPopup.addEventListener("click", event => {
					utils.playAudio("../extension/十周年UI/shoushaUI/lbtn/images/CD/back.mp3");
					event.stopPropagation();
					closeMenu();
				});
				// 创建菜单项
				const home = ui.create.div(".HOME", menuPopup);
				const settingsBtn = ui.create.div(".SZ", menuPopup);
				settingsBtn.addEventListener("click", event => {
					utils.playAudio("../extension/十周年UI/shoushaUI/lbtn/images/CD/button.mp3");
					if (!ui.click.configMenu) return;
					game.closePopped();
					game.pause2();
					ui.click.configMenu();
					ui.system1.classList.remove("shown");
					ui.system2.classList.remove("shown");
					closeMenu();
				});
				const leaveBtn = ui.create.div(".LK", menuPopup);
				leaveBtn.addEventListener("click", event => {
					utils.playAudio("../extension/十周年UI/shoushaUI/lbtn/images/CD/button.mp3");
					window.location.reload();
				});
				const bgBtn = ui.create.div(".BJ", menuPopup);
				bgBtn.addEventListener("click", event => {
					utils.playAudio("../extension/十周年UI/shoushaUI/lbtn/images/CD/button.mp3");
					openBackgroundSelector();
				});
				const surrenderBtn = ui.create.div(".TX", menuPopup);
				surrenderBtn.addEventListener("click", event => {
					utils.playAudio("../extension/十周年UI/shoushaUI/lbtn/images/CD/button.mp3");
					game.over();
				});
				const autoBtn = ui.create.div(".TG", menuPopup);
				autoBtn.addEventListener("click", event => {
					utils.playAudio("../extension/十周年UI/shoushaUI/lbtn/images/CD/button.mp3");
					ui.click.auto();
				});
			}
			function openBackgroundSelector() {
				var popuperContainer = ui.create.div(
					".popup-container",
					{
						background: "rgba(0, 0, 0, 0.8)",
					},
					ui.window
				);
				var guanbi = ui.create.div(".bgback", popuperContainer, function (e) {
					utils.playAudio("../extension/十周年UI/shoushaUI/lbtn/images/SSCD/caidan.mp3");
					popuperContainer.hide();
					game.resume2();
				});
				var bigdialog = ui.create.div(".bgdialog", popuperContainer);
				var bgbg = ui.create.div(".backgroundsbg", bigdialog);
				loadBackgroundImages(bgbg);
			}
			function loadBackgroundImages(container) {
				let path = "image/background/";
				game.getFileList(path, function (folders, files) {
					let systemFiles = [];
					let customFiles = [];
					// 获取隐藏的系统背景列表
					let hiddenBgs = lib.config.extension_十周年UI_hiddenSystemBackgrounds || [];
					for (let tempbackground of files) {
						let fileName = tempbackground.replace(/\.[^/.]+$/, "");
						let fileExtension = tempbackground.split(".").pop();
						if (!fileExtension || fileName.startsWith("oltianhou_")) continue;
						// 检查系统背景是否被隐藏
						if (fileName.startsWith("cdv_bg_") || fileName.startsWith("custom_bg_")) {
							customFiles.push(tempbackground);
						} else {
							// 系统背景：检查是否在隐藏列表中
							if (!hiddenBgs.includes(fileName)) {
								systemFiles.push(tempbackground);
							}
						}
					}
					let orderedFiles = systemFiles.concat(customFiles);
					for (let tempbackground of orderedFiles) {
						let fileName = tempbackground.replace(/\.[^/.]+$/, "");
						let img = ui.create.div(".backgrounds", container);
						img.dataset.name = fileName;
						img.setBackgroundImage(path + tempbackground);
						if (fileName == lib.config.image_background) ui.create.div(".bgxuanzhong", img);
						img.addEventListener("click", function () {
							let allSelectedElements = document.querySelectorAll(".bgxuanzhong");
							allSelectedElements.forEach(function (selectedElement) {
								selectedElement.parentNode.removeChild(selectedElement);
							});
							ui.create.div(".bgxuanzhong", img);
							game.saveConfig("image_background", fileName);
							lib.init.background();
							game.updateBackground();
						});
						let customNameMap = lib.config.extension_十周年UI_customBackgroundNames || {};
						let backgroundName = lib.configMenu.appearence.config.image_background.item[fileName] ? lib.configMenu.appearence.config.image_background.item[fileName] : (customNameMap[fileName] || fileName);
						ui.create.div(".buttontext", backgroundName, img);
					}
					// 添加 "添加背景" 项（放在末尾）
					(function(container){
						var addItem = ui.create.div(".backgrounds", container);
						ui.create.div(".buttontext", "添加背景", addItem);
						var input = document.createElement("input");
						input.type = "file";
						input.accept = "image/*";
						input.multiple = true; // 支持多选
						input.style.display = "none";
						document.body.appendChild(input);
						var write = (data, dir, name) => (game.promises && game.promises.writeFile) ? game.promises.writeFile(data, dir, name) : new Promise(resolve => game.writeFile(data, dir, name, resolve));
						addItem.addEventListener("click", function(){
							utils.playAudio("../extension/十周年UI/shoushaUI/lbtn/images/CD/button.mp3");
							input.click();
						});
						input.onchange = function(e){
							var files = e.target.files;
							if(!files || files.length === 0) return;
							var processFiles = async function() {
								var nameMap = lib.config.extension_十周年UI_customBackgroundNames || {};
								for(var i = 0; i < files.length; i++) {
									var file = files[i];
									if(!file) continue;
									var base = (game.writeFile ? "cdv_" : "custom_") + "bg_" + Date.now() + "_" + i;
									var targetName = base + ".jpg";
									var originName = (file.name || "").replace(/\.[^/.]+$/, "");
									nameMap[base] = originName || base;
									try {
										await write(file, "image/background", targetName);
										if(i === 0) {
											game.saveConfig("image_background", base);
											lib.init.background();
											game.updateBackground();
										}
									} catch(err) {
										console && console.error && console.error("导入背景失败:", err);
									}
								}
								lib.config.extension_十周年UI_customBackgroundNames = nameMap;
								game.saveConfig("extension_十周年UI_customBackgroundNames", nameMap);
								while(container.firstChild){ container.removeChild(container.firstChild); }
								loadBackgroundImages(container);
							};
							processFiles();
						};
						// 删除背景（紧随添加背景后）
						var delItem = ui.create.div(".backgrounds", container);
						ui.create.div(".buttontext", "删除背景", delItem);
						delItem.addEventListener("click", function(){
							utils.playAudio("../extension/十周年UI/shoushaUI/lbtn/images/CD/button.mp3");
							var tips = ui.create.div(".buttontext", "点击要删除的自定义背景或隐藏系统背景", delItem);
							var onClickToDelete = function(ev){
								var target = ev.currentTarget;
								var fname = target && target.dataset && target.dataset.name;
								if(!fname){ return; }
								// 检查是否为系统背景
								if(!(fname.startsWith("cdv_bg_") || fname.startsWith("custom_bg_"))){
									// 系统背景：隐藏而不是删除
									if(confirm("是否隐藏此系统背景？")){
										// 获取隐藏背景列表
										var hiddenBgs = lib.config.extension_十周年UI_hiddenSystemBackgrounds || [];
										if(!hiddenBgs.includes(fname)){
											hiddenBgs.push(fname);
											lib.config.extension_十周年UI_hiddenSystemBackgrounds = hiddenBgs;
											game.saveConfig("extension_十周年UI_hiddenSystemBackgrounds", hiddenBgs);
										}
										// 如果当前背景被隐藏，切换到默认背景
										if(lib.config.image_background == fname){
											game.saveConfig("image_background", "default");
											lib.init.background();
											game.updateBackground();
										}
										// 重新加载背景列表
										while(container.firstChild){ container.removeChild(container.firstChild); }
										loadBackgroundImages(container);
									}
									cleanup();
									return;
								}
								// 自定义背景：删除
								if(confirm("是否删除此背景？（此操作不可撤销）")){
									var nameMap2 = lib.config.extension_十周年UI_customBackgroundNames || {};
									if(nameMap2[fname]){
										delete nameMap2[fname];
										lib.config.extension_十周年UI_customBackgroundNames = nameMap2;
										game.saveConfig("extension_十周年UI_customBackgroundNames", nameMap2);
									}
									if(fname.startsWith("cdv_bg_")){
										game.removeFile("image/background/" + fname + ".jpg");
									}else{
										game.deleteDB("image", fname);
									}
									if(lib.config.image_background == fname){
										game.saveConfig("image_background", "default");
										lib.init.background();
										game.updateBackground();
									}
									while(container.firstChild){ container.removeChild(container.firstChild); }
									loadBackgroundImages(container);
								}
								cleanup();
							};
							var items = Array.from(container.querySelectorAll('.backgrounds'));
							items.slice(0, Math.max(0, items.length - 2)).forEach(function(n){
								n.addEventListener('click', onClickToDelete, { once: true });
							});
							function cleanup(){ if(tips && tips.remove) tips.remove(); }
						});
					})(container);
				});
			}
		function closeMenu() {
			if (menuPopup) {
				menuPopup.delete(200);
				menuPopup = null;
			}
		}
		menuBtn.onclick = function () {
			if (menuPopup) {
				closeMenu();
			} else {
				openMenu();
			}
		};
	}
	// 初始化
	lib.arenaReady.push(function () {
		// 更新轮次
		const originUpdateRoundNumber = game.updateRoundNumber;
		game.updateRoundNumber = function () {
			originUpdateRoundNumber.apply(this, arguments);
			if (ui.cardRoundTime) {
				ui.cardRoundTime.updateRoundCard();
			}
		};
		// 创建UI元素
		const supportedModes = [MODES.IDENTITY, MODES.DOUDIZHU, MODES.GUOZHAN, MODES.VERSUS, MODES.SINGLE, MODES.MARTIAL];
		if (supportedModes.includes(lib.config.mode)) {
			createQuestionButton();
		}
		createSortButton();
		createTopRightMenu();
	});
	// 插件定义
	const plugin = {
		name: "lbtn",
		filter() {
			return !["chess", "tafang"].includes(get.mode());
		},
		content(next) {
			lib.skill._uicardupdate = {
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				unique: true,
				popup: false,
				silent: true,
				noLose: true,
				noGain: true,
				noDeprive: true,
				priority: -Infinity,
				filter(event, player) {
					return player === game.me;
				},
				content() {
					if (ui.updateSkillControl) {
						ui.updateSkillControl(game.me, true);
					}
				},
			};
		},
		precontent() {
			// 扩展视频内容
			Object.assign(game.videoContent, {
				createCardRoundTime() {
					ui.cardRoundTime = plugin.create.cardRoundTime();
				},
				createhandcardNumber() {
					ui.handcardNumber = plugin.create.handcardNumber();
				},
				updateCardRoundTime(opts) {
					if (!ui.cardRoundTime) return;
					const roundNumber = Math.max(1, game.roundNumber || 1);
					ui.cardRoundTime.node.roundNumber.innerHTML = `<span>第${roundNumber}轮</span>`;
					ui.cardRoundTime.setNumberAnimation(opts.cardNumber);
				},
				updateCardnumber(opts) {
					if (!ui.handcardNumber) return;
				},
			});
			// 重写UI创建函数
			app.reWriteFunction(ui.create, {
				me: [
					function () {
						plugin.create.control();
					},
					null,
				],
				arena: [
					null,
					function () {
						if (ui.time3) {
							clearInterval(ui.time3.interval);
							ui.time3.delete();
						}
						if (ui.cardPileNumber) ui.cardPileNumber.delete();
						ui.cardRoundTime = plugin.create.cardRoundTime();
						ui.handcardNumber = plugin.create.handcardNumber();
					},
				],
				cards: [
					null,
					function () {
						if (ui.cardRoundTime) {
							ui.cardRoundTime.updateRoundCard();
						}
					},
				],
			});
			// 重写配置菜单
			app.reWriteFunction(lib.configMenu.appearence.config, {
				update: [
					null,
					function (res, config, map) {
						const hiddenItems = ["control_style", "custom_button", "custom_button_system_top", "custom_button_system_bottom", "custom_button_control_top", "custom_button_control_bottom", "radius_size"];
						hiddenItems.forEach(item => map[item].hide());
					},
				],
			});
			// 重写确认对话框
			ui.create.confirm = function (str, func) {
				let confirm = ui.confirm;
				if (!confirm) {
					confirm = ui.confirm = plugin.create.confirm();
				}
				confirm.node.ok.classList.add("disabled");
				confirm.node.cancel.classList.add("disabled");
				if (_status.event.endButton) {
					ui.confirm.node.cancel.classList.remove("disabled");
				}
				if (str) {
					if (str.indexOf("o") !== -1) {
						confirm.node.ok.classList.remove("disabled");
					}
					if (str.indexOf("c") !== -1) {
						confirm.node.cancel.classList.remove("disabled");
					}
					confirm.str = str;
				}
				if (func) {
					confirm.custom = func;
				}
				ui.updatec();
				confirm.update();
			};
		},
		create: {
			control() {},
			confirm() {
				const confirm = ui.create.control("<span>确定</span>", "cancel");
				confirm.classList.add("lbtn-confirm");
				confirm.node = {
					ok: confirm.firstChild,
					cancel: confirm.lastChild,
				};
				if (_status.event.endButton) {
					_status.event.endButton.close();
				}
				confirm.node.ok.link = "ok";
				confirm.node.ok.classList.add("primary");
				confirm.node.cancel.classList.add("primary2");
				confirm.custom = plugin.click.confirm;
				app.reWriteFunction(confirm, {
					close: [
						function () {
							this.classList.add("closing");
						},
					],
				});
				// 绑定事件
				for (const key in confirm.node) {
					const node = confirm.node[key];
					node.classList.add("disabled");
					node.removeEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.control);
					node.addEventListener(lib.config.touchscreen ? "touchend" : "click", function (e) {
						e.stopPropagation();
						if (this.classList.contains("disabled")) {
							if (this.link === "cancel" && this.dataset.type === "endButton" && _status.event.endButton) {
								_status.event.endButton.custom();
								ui.confirm.close();
							}
							return;
						}
						if (this.parentNode.custom) {
							this.parentNode.custom(this.link, this);
						}
					});
				}
				// 处理技能按钮
				if (ui.skills2 && ui.skills2.skills.length) {
					const skills = ui.skills2.skills;
					confirm.skills2 = [];
					for (let i = 0; i < skills.length; i++) {
						const item = document.createElement("div");
						item.link = skills[i];
						item.innerHTML = get.translation(skills[i]);
						item.addEventListener(lib.config.touchscreen ? "touchend" : "click", function (e) {
							e.stopPropagation();
							ui.click.skill(this.link);
						});
						item.dataset.type = "skill2";
						if (ui.updateSkillControl) {
							ui.updateSkillControl(game.me, true);
						}
					}
				}
				confirm.update = function () {
					if (confirm.skills2) {
						if (_status.event.skill && _status.event.skill !== confirm.dataset.skill) {
							confirm.dataset.skill = _status.event.skill;
							confirm.skills2.forEach(function (item) {
								item.remove();
							});
							ui.updatec();
						} else if (!_status.event.skill && confirm.dataset.skill) {
							delete confirm.dataset.skill;
							confirm.skills2.forEach(function (item) {
								confirm.insertBefore(item, confirm.firstChild);
							});
							ui.updatec();
						}
					}
					if (ui.updateSkillControl) {
						ui.updateSkillControl(game.me, true);
					}
				};
				return confirm;
			},
			handcardNumber() {
				const isRightLayout = lib.config["extension_十周年UI_rightLayout"] === "on";
				const isXPJ = lib.config.extension_十周年UI_XPJ === "on";
				const isTouch = lib.config.phonelayout;
				// 创建设置按钮
				ui.create.div(".settingButton", ui.arena, plugin.click.setting);
				// 仅触屏布局下加载功能按钮
				if (isTouch) {
					if (isRightLayout) {
						if (isXPJ) {
							ui.create.div(".huanfuButton", ui.arena, plugin.click.huanfu);
							ui.create.div(".jiluButton", ui.arena, ui.click.pause);
						} else {
							ui.create.div(".huanfuButton_new", ui.arena, plugin.click.huanfu);
							ui.create.div(".jiluButton_new", ui.arena, ui.click.pause);
							ui.create.div(".meiguiButton_new", ui.arena);
							ui.create.div(".xiaolianButton_new", ui.arena);
						}
					} else {
						if (isXPJ) {
							ui.create.div(".huanfuButton1", ui.arena, plugin.click.huanfu);
							ui.create.div(".jiluButton1", ui.arena, ui.click.pause);
						} else {
							ui.create.div(".huanfuButton_new1", ui.arena, plugin.click.huanfu);
							ui.create.div(".jiluButton_new1", ui.arena, ui.click.pause);
							ui.create.div(".meiguiButton_new1", ui.arena, plugin.click.meigui);
							ui.create.div(".xiaolianButton_new1", ui.arena, plugin.click.xiaolian);
						}
					}
				}
				// 创建托管按钮
				ui.create.div(".tuoguanButton", ui.arena, ui.click.auto);
				// 创建手牌数量显示
				const className = isRightLayout ? ".handcardNumber" : ".handcardNumber1";
				const node = ui.create.div(className, ui.arena).hide();
				node.node = {
					cardPicture: ui.create.div(".cardPicture", node),
					cardNumber: ui.create.div(".cardNumber", node),
				};
				node.updateCardnumber = function () {
					if (!game.me) return;
					const currentCards = game.me.countCards("h") || 0;
					const cardLimit = game.me.getHandcardLimit() || 0;
					const numberColor = currentCards > cardLimit ? "red" : "white";
					const displayLimit = cardLimit === Infinity ? "∞" : cardLimit;
					this.node.cardNumber.innerHTML = `<span><font color="${numberColor}">${currentCards}</font>` + `<sp style="font-size:20px; font-family:yuanli; color:#FFFCF5;"> / </sp>${displayLimit}</span>`;
					this.show();
					game.addVideo("updateCardnumber", null, {
						cardNumber: cardLimit,
					});
				};
				node.node.cardNumber.interval = setInterval(function () {
					ui.handcardNumber.updateCardnumber();
				}, 1000);
				game.addVideo("createhandcardNumber");
				return node;
			},
			cardRoundTime() {
				const node = ui.create.div(".cardRoundNumber", ui.arena).hide();
				node.node = {
					cardPileNumber: ui.create.div(".cardPileNumber", node),
					roundNumber: ui.create.div(".roundNumber", node),
					time: ui.create.div(".time", node),
				};
				node.updateRoundCard = function () {
					const cardNumber = ui.cardPile.childNodes.length || 0;
					const roundNumber = Math.max(1, game.roundNumber || 1);
					this.node.roundNumber.innerHTML = `<span>第${roundNumber}轮</span>`;
					this.setNumberAnimation(cardNumber);
					this.show();
					game.addVideo("updateCardRoundTime", null, {
						cardNumber: cardNumber,
						roundNumber: roundNumber,
					});
				};
				node.setNumberAnimation = function (num, step) {
					const item = this.node.cardPileNumber;
					clearTimeout(item.interval);
					if (!item._num) {
						item.innerHTML = `<span>${num}</span>`;
						item._num = num;
					} else if (item._num !== num) {
						if (!step) step = 500 / Math.abs(item._num - num);
						if (item._num > num) item._num--;
						else item._num++;
						item.innerHTML = `<span>${item._num}</span>`;
						if (item._num !== num) {
							item.interval = setTimeout(() => {
								node.setNumberAnimation(num, step);
							}, step);
						}
					}
				};
				// 时间显示
				ui.time4 = node.node.time;
				ui.time4.starttime = get.utc();
				ui.time4.interval = setInterval(function () {
					const totalSeconds = Math.round((get.utc() - ui.time4.starttime) / 1000);
					if (totalSeconds >= 3600) {
						const hours = Math.floor(totalSeconds / 3600);
						const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
						const seconds = totalSeconds - hours * 3600 - minutes * 60;
						const formatTime = num => (num < 10 ? `0${num}` : num.toString());
						ui.time4.innerHTML = `<span>${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}</span>`;
					} else {
						const minutes = Math.floor(totalSeconds / 60);
						const seconds = totalSeconds - minutes * 60;
						const formatTime = num => (num < 10 ? `0${num}` : num.toString());
						ui.time4.innerHTML = `<span>${formatTime(minutes)}:${formatTime(seconds)}</span>`;
					}
				}, 1000);
				game.addVideo("createCardRoundTime");
				return node;
			},
		},
		click: {
			huanfu() {
				utils.playAudio("../extension/十周年UI/shoushaUI/lbtn/images/CD/huanfu.mp3");
				window.zyile_charactercard ? window.zyile_charactercard(player, false) : ui.click.charactercard(game.me.name, game.zhu, lib.config.mode === "mode_guozhan" ? "guozhan" : true);
			},
			confirm(link, target) {
				if (link === "ok") {
					ui.click.ok(target);
				} else if (link === "cancel") {
					ui.click.cancel(target);
				} else if (target.custom) {
					target.custom(link);
				}
			},
			meigui() {
				// 玫瑰按钮点击处理
			},
			xiaolian() {
				// 笑脸按钮点击处理
			},
			setting() {
				// 设置按钮点击处理
			},
		},
		compare: {
			type(a, b) {
				if (a === b) return 0;
				const types = ["basic", "trick", "delay", "equip"].addArray([a, b]);
				return types.indexOf(a) - types.indexOf(b);
			},
			name(a, b) {
				if (a === b) return 0;
				return a > b ? 1 : -1;
			},
			nature(a, b) {
				if (a === b) return 0;
				const nature = [undefined, "fire", "thunder"].addArray([a, b]);
				return nature.indexOf(a) - nature.indexOf(b);
			},
			suit(a, b) {
				if (a === b) return 0;
				const suit = ["diamond", "heart", "club", "spade"].addArray([a, b]);
				return suit.indexOf(a) - suit.indexOf(b);
			},
			number(a, b) {
				return a - b;
			},
		},
	};
	return plugin;
});
