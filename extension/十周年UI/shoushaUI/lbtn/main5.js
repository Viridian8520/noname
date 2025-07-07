app.import(function (lib, game, ui, get, ai, _status, app) {
	lib.arenaReady.push(function () {
		initializePlayerNames();
		overrideUpdateRoundNumber();
		createUIElements();
	});

	// 玩家昵称列表
	const PLAYER_NICKNAMES = ["缘之空", "小小恐龙", "自然萌", "海边的ebao", "小云云", "点点", "猫猫虫", "小爱莉", "冰佬", "鹿鹿", "黎佬", "浮牢师", "U佬", "蓝宝", "影宝", "柳下跖", "无语", "小曦", "墨渊", "k9", "扶苏", "皇叔"];

	// 初始化玩家昵称
	function initializePlayerNames() {
		setInterval(function () {
			game.countPlayer(current => {
				// 添加确定每个玩家的名字
				if (!current.nickname) {
					const namex = current === game.me ? lib.config.connect_nickname : PLAYER_NICKNAMES.randomGet();
					current.nickname = namex;
				}
			});
		}, 1000);
	}

	// 重写轮次更新函数
	function overrideUpdateRoundNumber() {
		const originUpdateRoundNumber = game.updateRoundNumber;
		game.updateRoundNumber = function () {
			originUpdateRoundNumber.apply(this, arguments);
			if (ui.cardRoundTime) {
				ui.cardRoundTime.updateRoundCard();
			}
		};
	}

	// 创建UI元素
	function createUIElements() {
		createBackgroundShadow();
		createNewButton();
		createConfigButton();
		createSortButton();
	}

	// 创建背景阴影
	function createBackgroundShadow() {
		const shadow = ui.create.node("img");
		shadow.src = lib.assetURL + "extension/十周年UI/shoushaUI/lbtn/images/uibutton/yinying.png";
		shadow.style.cssText = `
			display: block;
			width: 100%;
			height: 30%;
			position: absolute;
			bottom: 0px;
			background-color: transparent;
			z-index: -1;
		`;
		document.body.appendChild(shadow);
	}

	// 创建新按钮
	function createNewButton() {
		const newButton = ui.create.node("img");
		newButton.src = lib.assetURL + "extension/十周年UI/shoushaUI/lbtn/images/CD/new_buttonhs3.png";
		newButton.style.cssText = `
			display: block;
			--w: 53px;
			--h: calc(var(--w) * 74/71);
			width: var(--w);
			height: var(--h);
			position: absolute;
			bottom: 13%;
			left: 80px;
			right: auto;
			background-color: transparent;
			z-index: 1;
		`;
		newButton.onclick = function () {
			newButton.style.transform = "scale(0.95)";
		};
		document.body.appendChild(newButton);
	}

	// 创建配置按钮
	function createConfigButton() {
		const configButton = ui.create.node("div");
		configButton.style.cssText = `
			display: block;
			--w: 56px;
			--h: calc(var(--w) * 74/71);
			width: var(--w);
			height: var(--h);
			position: absolute;
			bottom: 13%;
			left: 53px;
			right: auto;
			background-color: transparent;
			z-index: 1;
		`;
		configButton.onclick = function () {
			game.playAudio("../extension/十周年UI/shoushaUI/lbtn/images/CD/button.mp3");

			if (!ui.click.configMenu) return;

			game.closePopped();
			game.pause2();
			ui.click.configMenu();
			ui.system1.classList.remove("shown");
			ui.system2.classList.remove("shown");
		};
		document.body.appendChild(configButton);
	}

	// 创建整理手牌按钮
	function createSortButton() {
		const sortButton = ui.create.node("img");
		sortButton.src = lib.assetURL + "extension/十周年UI/shoushaUI/lbtn/images/uibutton/zhenglihs.png";

		// 根据布局设置按钮位置
		if (lib.config["extension_十周年UI_rightLayout"] == "on") {
			sortButton.style.cssText = `
				display: block;
				--w: 100px;
				--h: calc(var(--w) * 81/347);
				width: var(--w);
				height: var(--h);
				position: absolute;
				top: calc(100% - 31px);
				left: calc(100% - 373px);
				background-color: transparent;
				z-index: 2;
			`;
		} else {
			sortButton.style.cssText = `
				display: block;
				--w: 88px;
				--h: calc(var(--w) * 81/247);
				width: var(--w);
				height: var(--h);
				position: absolute;
				top: calc(100% - 33px);
				right: calc(100% - 367.2px);
				background-color: transparent;
				z-index: 2;
			`;
		}

		sortButton.onclick = function () {
			if (!game.me || game.me.hasSkillTag("noSortCard")) return;

			const cards = game.me.getCards("hs");
			const sortFunction = function (b, a) {
				if (a.name != b.name) return lib.sort.card(a.name, b.name);
				else if (a.suit != b.suit) return lib.suit.indexOf(a) - lib.suit.indexOf(b);
				else return a.number - b.number;
			};

			if (cards.length > 1) {
				cards.sort(sortFunction);
				cards.forEach(function (i, j) {
					game.me.node.handcards1.insertBefore(cards[j], game.me.node.handcards1.firstChild);
				});
				dui.queueNextFrameTick(dui.layoutHand, dui);
			}
		};
		document.body.appendChild(sortButton);
	}

	// 插件主体
	const plugin = {
		name: "lbtn",

		// 过滤器
		filter() {
			return !["chess", "tafang"].includes(get.mode());
		},

		// 内容初始化
		content(next) {
			// 创建UI卡牌更新技能
			lib.skill._uicardupdate = {
				trigger: {
					player: "phaseJieshuBegin",
				},
				forced: true,
				unique: true,
				popup: false,
				silent: true,
				noLose: true,
				noGain: true,
				noDeprive: true,
				priority: -Infinity,
				filter(event, player) {
					return player == game.me;
				},
				content() {
					if (ui.updateSkillControl) {
						ui.updateSkillControl(game.me, true);
					}
				},
			};
		},

		// 预内容初始化
		precontent() {
			initializeVideoContent();
			overrideCreateFunctions();
			overrideConfigMenu();
			overrideConfirmFunction();
		},

		// 创建器
		create: {
			// 控制创建
			control() {},

			// 确认对话框创建
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

				// 重写关闭函数
				app.reWriteFunction(confirm, {
					close: [
						function () {
							this.classList.add("closing");
						},
					],
				});

				// 绑定事件监听器
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

				// 更新函数
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

			// 手牌数量显示创建
			handcardNumber() {
				const settingButton = ui.create.div(".settingButton", ui.arena, plugin.click.setting);
				let huanfuButton, jiluButton, meiguiButton, xiaolianButton;

				// 根据布局创建按钮
				if (lib.config["extension_十周年UI_rightLayout"] == "on") {
					huanfuButton = ui.create.div(".huanfuButton_new", ui.arena, plugin.click.huanfu);
					jiluButton = ui.create.div(".jiluButton_new", ui.arena, ui.click.pause);
					meiguiButton = ui.create.div(".meiguiButton_new", ui.arena);
					xiaolianButton = ui.create.div(".xiaolianButton_new", ui.arena);
				} else {
					huanfuButton = ui.create.div(".huanfuButton_new1", ui.arena, plugin.click.huanfu);
					jiluButton = ui.create.div(".jiluButton_new1", ui.arena, ui.click.pause);
					meiguiButton = ui.create.div(".meiguiButton_new1", ui.arena, plugin.click.meigui);
					xiaolianButton = ui.create.div(".xiaolianButton_new1", ui.arena, plugin.click.xiaolian);
				}

				const tuoguanButton = ui.create.div(".tuoguanButton", ui.arena, ui.click.auto);

				// 创建手牌数量显示节点
				const nodeClass = lib.config["extension_十周年UI_rightLayout"] == "on" ? ".handcardNumber" : ".handcardNumber1";
				const node = ui.create.div(nodeClass, ui.arena).hide();

				const cardPictureClass = lib.config["extension_十周年UI_rightLayout"] == "on" ? ".cardPicture" : ".cardPicture1";
				const cardNumberClass = lib.config["extension_十周年UI_rightLayout"] == "on" ? ".cardNumber" : ".cardNumber1";

				node.node = {
					cardPicture: ui.create.div(cardPictureClass, node),
					cardNumber: ui.create.div(cardNumberClass, node),
				};

				// 更新手牌数量函数
				node.updateCardnumber = function () {
					if (!game.me) return;

					const currentCards = game.me.countCards("h") || 0;
					const cardLimit = game.me.getHandcardLimit() || 0;
					let numberColor = "white";

					if (currentCards > cardLimit) {
						numberColor = "red";
					}

					const displayLimit = cardLimit == Infinity ? "∞" : cardLimit;

					this.node.cardNumber.innerHTML = `
						<span>
							<font color="${numberColor}">${currentCards}</font>
							<sp style="font-size:20px; font-family:yuanli; color:#FFFCF5;"> / </sp>
							${displayLimit}
						</span>
					`;

					this.show();

					game.addVideo("updateCardnumber", null, {
						cardNumber: cardLimit,
					});
				};

				// 设置定时更新
				node.node.cardNumber.interval = setInterval(function () {
					ui.handcardNumber.updateCardnumber();
				}, 1000);

				game.addVideo("createhandcardNumber");
				return node;
			},

			// 卡牌轮次时间创建
			cardRoundTime() {
				const node = ui.create.div(".cardRoundNumber", ui.arena).hide();
				node.node = {
					cardPileNumber: ui.create.div(".cardPileNumber", node),
					roundNumber: ui.create.div(".roundNumber", node),
					time: ui.create.div(".time", node),
				};

				// 更新轮次卡牌函数
				node.updateRoundCard = function () {
					const cardNumber = ui.cardPile.childNodes.length || 0;
					const roundNumber = Math.max(1, game.roundNumber || 1);

					this.node.roundNumber.innerHTML = `<span>${roundNumber}轮</span>`;
					this.setNumberAnimation(cardNumber);
					this.show();

					game.addVideo("updateCardRoundTime", null, {
						cardNumber: cardNumber,
						roundNumber: roundNumber,
					});
				};

				// 数字动画函数
				node.setNumberAnimation = function (num, step) {
					const item = this.node.cardPileNumber;
					clearTimeout(item.interval);

					if (!item._num) {
						item.innerHTML = `<span>${num}</span>`;
						item._num = num;
					} else {
						if (item._num !== num) {
							if (!step) {
								step = 500 / Math.abs(item._num - num);
							}

							if (item._num > num) {
								item._num--;
							} else {
								item._num++;
							}

							item.innerHTML = `<span>${item._num}</span>`;

							if (item._num !== num) {
								item.interval = setTimeout(function () {
									node.setNumberAnimation(num, step);
								}, step);
							}
						}
					}
				};

				// 时间显示
				ui.time4 = node.node.time;
				ui.time4.starttime = get.utc();
				ui.time4.interval = setInterval(function () {
					const totalSeconds = Math.round((get.utc() - ui.time4.starttime) / 1000);

					if (totalSeconds >= 3600) {
						// 显示小时:分钟:秒
						const hours = Math.floor(totalSeconds / 3600);
						const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
						const seconds = totalSeconds - hours * 3600 - minutes * 60;

						const formattedHours = hours < 10 ? "0" + hours : hours.toString();
						const formattedMinutes = minutes < 10 ? "0" + minutes : minutes.toString();
						const formattedSeconds = seconds < 10 ? "0" + seconds : seconds.toString();

						ui.time4.innerHTML = `<span>${formattedHours}:${formattedMinutes}:${formattedSeconds}</span>`;
					} else {
						// 显示分钟:秒
						const minutes = Math.floor(totalSeconds / 60);
						const seconds = totalSeconds - minutes * 60;

						const formattedMinutes = minutes < 10 ? "0" + minutes : minutes.toString();
						const formattedSeconds = seconds < 10 ? "0" + seconds : seconds.toString();

						ui.time4.innerHTML = `<span>${formattedMinutes}:${formattedSeconds}</span>`;
					}
				}, 1000);

				game.addVideo("createCardRoundTime");
				return node;
			},
		},

		// 点击事件处理
		click: {
			// 换肤按钮
			huanfu() {
				game.playAudio("../extension/十周年UI/shoushaUI/lbtn/images/CD/huanfu.mp3");
				if (window.zyile_charactercard) {
					window.zyile_charactercard(player, false);
				} else {
					ui.click.charactercard(game.me.name, game.zhu, lib.config.mode == "mode_guozhan" ? "guozhan" : true);
				}
			},

			// 确认按钮
			confirm(link, target) {
				if (link === "ok") {
					ui.click.ok(target);
				} else if (link === "cancel") {
					ui.click.cancel(target);
				} else if (target.custom) {
					target.custom(link);
				}
			},
		},

		// 比较函数
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

	// 初始化视频内容
	function initializeVideoContent() {
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
				// ui.handcardNumber.setNumberAnimation(opts.cardNumber);
			},
		});
	}

	// 重写创建函数
	function overrideCreateFunctions() {
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
					if (ui.cardPileNumber) {
						ui.cardPileNumber.delete();
					}
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
	}

	// 重写配置菜单
	function overrideConfigMenu() {
		app.reWriteFunction(lib.configMenu.appearence.config, {
			update: [
				null,
				function (res, config, map) {
					map.control_style.hide();
					map.custom_button.hide();
					map.custom_button_system_top.hide();
					map.custom_button_system_bottom.hide();
					map.custom_button_control_top.hide();
					map.custom_button_control_bottom.hide();
					map.radius_size.hide();
				},
			],
		});
	}

	// 重写确认函数
	function overrideConfirmFunction() {
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
	}

	return plugin;
});
