"use strict";
decadeModule.import(function(lib, game, ui, get, ai, _status) {
	//OL随机框 by柳下跖
	if (lib.config.extension_十周年UI_newDecadeStyle && lib.config.extension_十周年UI_newDecadeStyle == "onlineUI") {
		//给龙头添加OL等阶框
		lib.skill._longLevel = {
			trigger: {
				global: "gameStart"
			},
			silent: true,
			forced: true,
			filter: function(event, player) {
				return (lib.config.extension_十周年UI_longLevel == 'ten') || (lib.config
					.extension_十周年UI_longLevel == 'eleven');
			},
			content: function() {
				if (lib.config.extension_十周年UI_longLevel == 'ten') {
					var rarity = ['silver', 'gold', 'yu', 'bing', 'yan'];
					switch (game.getRarity(player.name)) {
						case 'junk':
							rarity = rarity[0];
							break;
						case 'common':
							rarity = rarity[1];
							break;
						case 'rare':
							rarity = rarity[2];
							break;
						case 'epic':
							rarity = rarity[3];
							break;
						case 'legend':
							rarity = rarity[4];
							break;
						default:
							break;
					};
				}
				if (lib.config.extension_十周年UI_longLevel == 'eleven') {
					var rarity = ['silver', 'gold', 'yu', 'bing', 'yan'].randomGet();
				};
				if (rarity === 'yan') {
					var longtou = document.createElement("img");
					longtou.src = decadeUIPath + "/assets/image/OL等阶露头框/k2.png";
					longtou.style.cssText = "pointer-events:none";
					longtou.style.position = "absolute";
					longtou.style.display = "block";
					longtou.style.top = "-20.5px";
					longtou.style.right = "-5px";
					longtou.style.height = "115%";
					longtou.style.width = "139.5%";
					longtou.style.zIndex = "60";
					player.appendChild(longtou)
					var longwei = document.createElement("img");
					longwei.src = decadeUIPath + "/assets/image/OL等阶露头框/border_campOL5.png";
					longwei.style.cssText = "pointer-events:none";
					longwei.style.position = "absolute";
					longwei.style.display = "block";
					longwei.style.top = "-20.5px";
					longwei.style.right = "-5px";
					longwei.style.height = "115%";
					longwei.style.width = "139.5%";
					longwei.style.zIndex = "72";
					player.appendChild(longwei)
				};
				if (rarity === 'bing') {
					var longtou = document.createElement("img");
					longtou.src = decadeUIPath + "/assets/image/OL等阶露头框/k8.png";
					longtou.style.cssText = "pointer-events:none";
					longtou.style.position = "absolute";
					longtou.style.display = "block";
					longtou.style.top = "-6px";
					longtou.style.right = "-5.5px";
					longtou.style.height = "109%";
					longtou.style.width = "131.5%";
					longtou.style.zIndex = "60";
					player.appendChild(longtou)
					var longwei = document.createElement("img");
					longwei.src = decadeUIPath + "/assets/image/OL等阶露头框/border_campOL4.png";
					longwei.style.cssText = "pointer-events:none";
					longwei.style.position = "absolute";
					longwei.style.display = "block";
					longwei.style.top = "-6px";
					longwei.style.right = "-5.5px";
					longwei.style.height = "107%";
					longwei.style.width = "131.5%";
					longwei.style.zIndex = "72";
					player.appendChild(longwei)
				};
				if (rarity === 'yu') {
					var longtou = document.createElement("img");
					longtou.src = decadeUIPath + "/assets/image/OL等阶露头框/k6.png";
					longtou.style.cssText = "pointer-events:none";
					longtou.style.position = "absolute";
					longtou.style.display = "block";
					longtou.style.top = "-3px";
					longtou.style.right = "-3px";
					longtou.style.height = "107.5%";
					longtou.style.width = "123.5%";
					longtou.style.zIndex = "60";
					player.appendChild(longtou)
					var longwei = document.createElement("img");
					longwei.src = decadeUIPath + "/assets/image/OL等阶露头框/border_campOL3.png";
					longwei.style.cssText = "pointer-events:none";
					longwei.style.position = "absolute";
					longwei.style.display = "block";
					longwei.style.top = "-3px";
					longwei.style.right = "-3px";
					longwei.style.height = "105.5%";
					longwei.style.width = "123.5%";
					longwei.style.zIndex = "72";
					player.appendChild(longwei)
				};
				if (rarity === 'gold') {
					var longtou = document.createElement("img");
					longtou.src = decadeUIPath + "/assets/image/OL等阶露头框/k4.png";
					longtou.style.cssText = "pointer-events:none";
					longtou.style.position = "absolute";
					longtou.style.display = "block";
					longtou.style.top = "-5px";
					longtou.style.right = "-3px";
					longtou.style.height = "107.5%";
					longtou.style.width = "123.5%";
					longtou.style.zIndex = "60";
					player.appendChild(longtou)
					var longwei = document.createElement("img");
					longwei.src = decadeUIPath + "/assets/image/OL等阶露头框/border_campOL2.png";
					longwei.style.cssText = "pointer-events:none";
					longwei.style.position = "absolute";
					longwei.style.display = "block";
					longwei.style.top = "-5px";
					longwei.style.right = "-3px";
					longwei.style.height = "107.5%";
					longwei.style.width = "123.5%";
					longwei.style.zIndex = "72";
					player.appendChild(longwei)
				};
				if (rarity === 'silver') {
					var longtou = document.createElement("img");
					longtou.src = decadeUIPath + "/assets/image/OL等阶露头框/k2.png";
					longtou.style.cssText = "pointer-events:none";
					longtou.style.position = "absolute";
					longtou.style.display = "block";
					longtou.style.top = "-20.5px";
					longtou.style.right = "-5px";
					longtou.style.height = "115%";
					longtou.style.width = "139.5%";
					longtou.style.zIndex = "60";
					player.appendChild(longtou)
					var longwei = document.createElement("img");
					longwei.src = decadeUIPath + "/assets/image/OL等阶露头框/border_campOL5.png";
					longwei.style.cssText = "pointer-events:none";
					longwei.style.position = "absolute";
					longwei.style.display = "block";
					longwei.style.top = "-20.5px";
					longwei.style.right = "-5px";
					longwei.style.height = "115%";
					longwei.style.width = "139.5%";
					longwei.style.zIndex = "72";
					player.appendChild(longwei)
				};
			}
		}
	};

	//势力选择
	if (lib.config["extension_十周年UI_shiliyouhua"]) {
		Object.defineProperty(lib, "group", {
			get: () => ["wei", "shu", "wu", "qun", "jin"],
			set: () => {},
		});
		lib.skill._slyh = {
			trigger: {
				global: "gameStart",
				player: "enterGame",
			},
			forced: true,
			popup: false,
			silent: true,
			priority: Infinity,
			filter: (_, player) => player.group && !lib.group.includes(player.group),
			async content(event, trigger, player) {
				const list = lib.group.slice(0, 5);
				const result = await player
					.chooseControl(list)
					.set("ai", () => get.event().controls.randomGet())
					.set("prompt", "请选择你的势力")
					.forResult();
				if (result?.control) {
					player.group = result.control;
					player.node.name.dataset.nature = get.groupnature(result.control);
				}
			},
		};
	}

	//武将背景
	if (lib.config["extension_十周年UI_wujiangbeijing"]) {
		lib.skill._wjBackground = {
			charlotte: true,
			forced: true,
			popup: false,
			trigger: {
				global: ["gameStart", "modeSwitch"],
				player: ["enterGame", "showCharacterEnd"],
			},
			priority: 100,
			content() {
				const setBackground = player => {
					if (!player) return;
					// 检查游戏模式和双将设置
					const mode = get.mode();
					const isDoubleCharacter = lib.config.mode_config[mode] && lib.config.mode_config[
						mode].double_character;
					if (mode === "guozhan" || isDoubleCharacter) {
						// 国战模式或开启双将时使用bj2
						player.setAttribute("data-mode", "guozhan");
					} else {
						// 其他情况使用bj1
						player.setAttribute("data-mode", "normal");
					}
				};
				// 为所有玩家设置背景
				game.players.forEach(setBackground);
				game.dead.forEach(setBackground);
			},
		};
		// 添加全局技能
		if (!_status.connectMode) {
			game.addGlobalSkill("_wjBackground");
		}
		// 在游戏开始时检查并设置背景
		lib.arenaReady.push(function() {
			const mode = get.mode();
			const isDoubleCharacter = lib.config.mode_config[mode] && lib.config.mode_config[mode]
				.double_character;
			if (mode === "guozhan" || isDoubleCharacter) {
				document.body.setAttribute("data-mode", "guozhan");
			} else {
				document.body.setAttribute("data-mode", "normal");
			}
		});
	}

	// 全选按钮功能 by奇妙工具做修改
	lib.hooks.checkBegin.add("Selectall", () => {
		const event = get.event();
		if (!event?.isMine) return;
		const needMultiSelect = event.selectCard?.[1] > 1;
		if (needMultiSelect && !ui.Selectall) {
			ui.Selectall = ui.create.control("全选", () => {
				ai.basic.chooseCard(card => (get.position(card) === "h" ? 114514 : 0));
				event.custom?.add?.card?.();
				ui.selected.cards?.forEach(card => card.updateTransform(true));
			});
		} else if (!needMultiSelect) {
			if (ui.Selectall) {
				ui.Selectall.remove();
				delete ui.Selectall;
			}
		}
	});
	lib.hooks.uncheckBegin.add("Selectall", () => {
		if (get.event().result?.bool) {
			if (ui.Selectall) {
				ui.Selectall.remove();
				delete ui.Selectall;
			}
		}
	});

	// 局内交互优化
	if (lib.config["extension_十周年UI_jiaohuyinxiao"]) {
		lib.skill._useCardAudio = {
			trigger: {
				player: "useCard",
			},
			forced: true,
			popup: false,
			priority: -10,
			content() {
				let card = trigger.card;
				let cardType = get.type(card);
				let cardName = get.name(card);
				let cardNature = get.nature(card);
				if (cardType == "basic") {
					switch (cardName) {
						case "sha":
							if (cardNature == "fire") {
								game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
							} else if (cardNature == "thunder") {
								game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
							} else {
								game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
							}
							break;
						case "shan":
							game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
							break;
						case "tao":
							game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
							break;
						case "jiu":
							game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
							break;
						default:
							game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
					}
				} else if (cardType == "trick") {
					if (get.tag(card, "damage")) {
						game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
					} else if (get.tag(card, "recover")) {
						game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
					} else {
						game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
					}
				} else if (cardType == "equip") {
					let equipType = get.subtype(card);
					switch (equipType) {
						case "equip1": // 武器
							game.playAudio("..", "extension", "十周年UI", "audio/weapon_equip");
							break;
						case "equip2": // 防具
							game.playAudio("..", "extension", "十周年UI", "audio/horse_equip");
							break;
						case "equip3": // -1马
							game.playAudio("..", "extension", "十周年UI", "audio/armor_equip");
							break;
						case "equip4": // +1马
							game.playAudio("..", "extension", "十周年UI", "audio/armor_equip");
							break;
						case "equip5": // 宝物
							game.playAudio("..", "extension", "十周年UI", "audio/horse_equip");
							break;
					}
				}
			},
		};
		if (!_status.connectMode) {
			game.addGlobalSkill("_useCardAudio");
		}
		if (!_status.connectMode) {
			game.addGlobalSkill("_phaseStartAudio");
		}
		// 处理按钮点击音效
		document.body.addEventListener("mousedown", function(e) {
			const target = e.target;
			if (target.closest("#dui-controls")) {
				if (target.classList.contains("control") || target.parentElement.classList.contains(
						"control")) {
					game.playAudio("..", "extension", "十周年UI", "audio/BtnSure");
				}
			}
			if (target.classList.contains("menubutton") || target.classList.contains("button")) {
				game.playAudio("..", "extension", "十周年UI", "audio/card_click");
			}
			if (target.classList.contains("card")) {
				game.playAudio("..", "extension", "十周年UI", "audio/card_click");
			}
		});
		// 处理按钮缩放效果
		document.body.addEventListener("mousedown", function(e) {
			const control = e.target.closest(".control");
			if (control && !control.classList.contains("disabled")) {
				control.style.transform = "scale(0.95)";
				control.style.filter = "brightness(0.9)";
				setTimeout(() => {
					control.style.transform = "";
					control.style.filter = "";
				}, 100);
			}
		});
	}
});