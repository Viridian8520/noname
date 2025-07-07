"use strict";
decadeModule.import(function (lib, game, ui, get, ai, _status) {
	// 常量定义
	const CONSTANTS = {
		// 动画相关
		ANIMATION: {
			SPEED: 0.07,
			FRAME_RATE: 17,
			LINE_COLOR: "rgb(250,220,140)",
			LINE_WIDTH: 2.6,
		},

		// 特效持续时间
		DURATION: {
			EFFECT: 2180,
			KILL_DELAY: 2000,
			KILL_CLOSE: 3000,
		},

		// 击杀特效
		KILL: {
			LIGHT_COUNT: 10,
			SCALE_FACTOR: 1.2,
			MAX_SCALE: 1.0,
			MIN_SCALE: 0.1,
		},

		// 技能特效
		SKILL: {
			MAX_WIDTH: 288,
			MAX_HEIGHT: 378,
			NAME_OFFSET_Y: 165,
			GENERAL_OFFSET_X: 200,
			GENERAL_OFFSET_Y: 160,
		},

		// 样式相关
		STYLES: {
			EFFECT_WINDOW: {
				backgroundColor: "rgba(0,0,0,0.7)",
				transition: "all 4s",
				zIndex: 7,
			},
			GENERAL_NAME: {
				position: "absolute",
				writingMode: "vertical-lr",
				textOrientation: "upright",
				fontFamily: "yuanli",
				color: "rgb(215, 234, 67)",
				fontSize: "25px",
				textShadow: "0 0 5px black, 0 0 10px black",
				pointerEvents: "none",
				letterSpacing: "5px",
				zIndex: 17,
			},
		},
	};

	// 工具函数
	const utils = {
		// 获取玩家头像元素
		getPlayerAvatar(player, isUnseen = false) {
			return isUnseen ? player.node.avatar2 : player.node.avatar;
		},

		// 解析CSS URL字符串
		parseCssUrl(url) {
			if (url.indexOf('url("') === 0) {
				return url.slice(5, url.indexOf('")'));
			} else if (url.indexOf("url('") === 0) {
				return url.slice(5, url.indexOf("')"));
			}
			return url;
		},

		// 创建DOM元素并设置样式
		createElement(className, parent = null, styles = {}) {
			const element = decadeUI.dialog.create(className, parent);
			Object.assign(element.style, styles);
			return element;
		},

		// 安全地移除子元素
		removeChildSafely(parent, child) {
			if (parent && child && parent.contains(child)) {
				parent.removeChild(child);
			}
		},

		// 验证玩家对象
		validatePlayer(player, paramName = "player") {
			if (get.itemtype(player) !== "player") {
				console.error(`Invalid ${paramName}: expected player object`);
				return false;
			}
			return true;
		},

		// 检查图片是否存在
		async checkImageExists(url) {
			return new Promise(resolve => {
				const img = new Image();
				img.onload = () => resolve(true);
				img.onerror = () => resolve(false);
				img.src = url;
			});
		},

		// 获取最优图片路径
		async getOptimalImagePath(originalUrl, player) {
			const parsedUrl = this.parseCssUrl(originalUrl);

			if (parsedUrl.includes("image/lihui")) {
				return parsedUrl;
			}

			if (parsedUrl.includes("image/character")) {
				const lihuiPath = parsedUrl.replace(/image\/character/, "image/lihui");
				const lihuiExists = await this.checkImageExists(lihuiPath);
				if (lihuiExists) {
					return lihuiPath;
				}
			}

			return parsedUrl;
		},

		// 获取默认头像路径
		getDefaultAvatarPath(player) {
			const gender = player.sex === "female" ? "female" : "male";
			return lib.assetURL + "image/character/default_silhouette_" + gender + ".jpg";
		},

		// 生成随机位置和缩放
		generateRandomPosition(height) {
			const x = (decadeUI.getRandom(0, 1) === 1 ? "" : "-") + decadeUI.getRandom(0, 100) + "px";
			const y = (decadeUI.getRandom(0, 1) === 1 ? "" : "-") + decadeUI.getRandom(0, height / 4) + "px";
			const scale = decadeUI.getRandom(1, 10) / 10;

			return { x, y, scale };
		},
	};

	// 主模块定义
	decadeUI.effect = {
		// 对话框相关
		dialog: {
			// 创建对话框
			create(titleText) {
				return decadeUI.dialog.create("effect-dialog dui-dialog");
			},

			// 创建比较对话框
			compare(source, target) {
				const dialog = this.create();

				// 创建角色容器
				dialog.characters = [utils.createElement("player1 character", dialog), utils.createElement("player2 character", dialog)];

				// 为每个角色添加背景
				dialog.characters.forEach(char => {
					utils.createElement("back", char);
				});

				// 创建内容和按钮容器
				dialog.content = utils.createElement("content", dialog);
				dialog.buttons = utils.createElement("buttons", dialog.content);

				// 创建卡片和名称容器
				dialog.cards = [utils.createElement("player1 card", dialog.buttons), utils.createElement("player2 card", dialog.buttons)];

				dialog.names = [utils.createElement("player1 name", dialog.buttons), utils.createElement("player2 name", dialog.buttons)];

				// 创建VS标识
				dialog.buttons.vs = utils.createElement("vs", dialog.buttons);

				// 设置初始名称
				dialog.names[0].innerHTML = get.translation(source) + "发起";
				dialog.names[1].innerHTML = get.translation(target);

				// 设置方法
				dialog.set = function (attr, value) {
					const playerIndex = attr === "player1" || attr === "source" ? 0 : 1;
					const isSource = playerIndex === 0;
					const suffix = isSource ? "发起" : "";

					switch (attr) {
						case "player1":
						case "source":
						case "player2":
						case "target":
							if (get.itemtype(value) !== "player" || value.isUnseen()) {
								dialog.characters[playerIndex].firstChild.style.backgroundImage = "";
								dialog.names[playerIndex].innerHTML = get.translation(value) + suffix;
								return false;
							}

							const avatar = utils.getPlayerAvatar(value, value.isUnseen(0));
							dialog.characters[playerIndex].firstChild.style.backgroundImage = avatar.style.backgroundImage;
							dialog.names[playerIndex].innerHTML = get.translation(value) + suffix;
							break;

						case "card1":
						case "sourceCard":
						case "card2":
						case "targetCard":
							const cardIndex = attr === "card1" || attr === "sourceCard" ? 0 : 1;
							utils.removeChildSafely(dialog.cards[cardIndex], dialog.cards[cardIndex].firstChild);
							dialog.cards[cardIndex].appendChild(value);
							break;

						default:
							return false;
					}
					return true;
				};

				// 初始化设置
				dialog.set("source", source);
				dialog.set("target", target);
				return dialog;
			},
		},

		// 线条动画
		line(dots) {
			decadeUI.animate.add(
				function (source, target, e) {
					const ctx = e.context;
					ctx.shadowColor = "yellow";
					ctx.shadowBlur = 1;

					// 初始化动画状态
					if (!this.head) this.head = 0;
					if (!this.tail) this.tail = -1;

					// 更新动画进度
					const speed = CONSTANTS.ANIMATION.SPEED * (e.deltaTime / CONSTANTS.ANIMATION.FRAME_RATE);
					this.head += speed;

					if (this.head >= 1) {
						this.head = 1;
						this.tail += speed;
					}

					const tail = this.tail < 0 ? 0 : this.tail;
					const head = this.head;

					if (this.tail <= 1) {
						const x1 = decadeUI.get.lerp(source.x, target.x, tail);
						const y1 = decadeUI.get.lerp(source.y, target.y, tail);
						const x2 = decadeUI.get.lerp(source.x, target.x, head);
						const y2 = decadeUI.get.lerp(source.y, target.y, head);

						e.drawLine(x1, y1, x2, y2, CONSTANTS.ANIMATION.LINE_COLOR, CONSTANTS.ANIMATION.LINE_WIDTH);
						return false;
					}

					return true;
				},
				true,
				{ x: dots[0], y: dots[1] },
				{ x: dots[2], y: dots[3] }
			);
		},

		// 击杀特效
		kill(source, target) {
			// 参数验证
			if (!utils.validatePlayer(source, "source") || !utils.validatePlayer(target, "target")) {
				throw new Error("Invalid arguments: source and target must be valid players");
			}

			if (source === target) return;
			if (source.isUnseen() || target.isUnseen()) return;

			// 获取头像
			const sourceAvatar = utils.getPlayerAvatar(source, source.isUnseen(0));
			const targetAvatar = utils.getPlayerAvatar(target, target.isUnseen(0));

			// 创建效果窗口
			const effect = utils.createElement("effect-window", null, CONSTANTS.STYLES.EFFECT_WINDOW);

			// 创建击杀者元素
			const killerWrapper = utils.createElement("killer-warpper", effect);
			killerWrapper.killer = utils.createElement("killer", killerWrapper);
			killerWrapper.killer.style.backgroundImage = sourceAvatar.style.backgroundImage;

			// 创建受害者元素
			const victim = utils.createElement("victim", effect);
			victim.back = utils.createElement("back", victim);
			victim.back.part1 = utils.createElement("part1", victim.back);
			victim.back.part2 = utils.createElement("part2", victim.back);

			const victimImage = targetAvatar.style.backgroundImage;
			victim.back.part1.style.backgroundImage = victimImage;
			victim.back.part2.style.backgroundImage = victimImage;

			// 播放音效
			game.playAudio("../extension", decadeUI.extensionName, "audio/kill_effect_sound.mp3");

			// 检查是否有Spine动画
			const anim = decadeUI.animation;
			const bounds = anim.getSpineBounds("effect_jisha1");

			if (bounds === undefined) {
				this._createFallbackKillEffect(effect, victim);
			} else {
				this._createSpineKillEffect(anim, bounds, effect);
			}

			// 延迟清理
			decadeUI.delay(CONSTANTS.DURATION.KILL_DELAY);
			effect.style.backgroundColor = "rgba(0,0,0,0)";
			effect.close(CONSTANTS.DURATION.KILL_CLOSE);
		},

		// 技能特效
		skill(player, skillName, vice) {
			if (!utils.validatePlayer(player)) return;

			const animation = decadeUI.animation;
			const asset = animation.spine.assets["effect_xianding"];

			if (!asset) {
				console.error("[effect_xianding]特效未加载");
				return;
			}

			if (!asset.ready) {
				animation.prepSpine("effect_xianding");
			}

			// 获取玩家信息
			const camp = player.group;
			const playerName = vice === "vice" ? get.translation(player.name2) : get.translation(player.name);
			const playerAvatar = utils.getPlayerAvatar(player, vice === "vice");

			// 异步加载图片
			this._loadSkillImages(playerAvatar, camp, player, skillName, playerName).catch(error => {
				console.error("技能特效图片加载失败:", error);
			});
		},

		// 私有方法

		// 创建备用击杀效果
		_createFallbackKillEffect(effect, victim) {
			utils.createElement("li-big", effect);

			// 创建"破敌"文字
			victim.rout = utils.createElement("rout", victim);
			victim.rout2 = utils.createElement("rout", victim);
			victim.rout.innerHTML = "破敌";
			victim.rout2.innerHTML = "破敌";
			victim.rout2.classList.add("shadow");

			ui.window.appendChild(effect);

			// 创建随机光效
			const height = ui.window.offsetHeight;
			for (let i = 0; i < CONSTANTS.KILL.LIGHT_COUNT; i++) {
				const { x, y, scale } = utils.generateRandomPosition(height);

				setTimeout(
					(mx, my, mscale, meffect) => {
						const light = utils.createElement("li", meffect);
						light.style.transform = `translate(${mx}, ${my}) scale(${mscale})`;
					},
					decadeUI.getRandom(50, 300),
					x,
					y,
					scale,
					effect
				);
			}
		},

		// 创建Spine击杀效果
		_createSpineKillEffect(anim, bounds, effect) {
			const size = bounds.size;
			const scale = (anim.canvas.width / size.x) * CONSTANTS.KILL.SCALE_FACTOR;

			anim.playSpine("effect_jisha1", { scale });
			ui.window.appendChild(effect);
			ui.refresh(effect);
		},

		// 加载技能图片
		async _loadSkillImages(playerAvatar, camp, player, skillName, playerName) {
			const url = getComputedStyle(playerAvatar).backgroundImage;
			const image = new Image();
			const bgImage = new Image();

			// 设置图片加载成功回调
			image.onload = () => {
				bgImage.onload = () => {
					this._createSkillEffect(image, bgImage, camp, skillName, playerName);
				};

				bgImage.onerror = () => {
					bgImage.onerror = undefined;
					bgImage.src = decadeUIPath + "assets/image/bg_xianding_qun.png";
				};

				bgImage.src = decadeUIPath + "assets/image/bg_xianding_" + camp + ".png";
			};

			// 设置图片加载失败回调
			image.onerror = () => {
				image.onerror = undefined;
				this._handleImageError(image, url, player);
			};

			// 异步获取最优图片路径并设置
			try {
				const optimalPath = await utils.getOptimalImagePath(url, player);
				image.src = optimalPath;
			} catch (error) {
				console.warn("获取图片路径失败，使用默认路径:", error);
				image.src = utils.getDefaultAvatarPath(player);
			}
		},

		// 创建技能效果
		_createSkillEffect(image, bgImage, camp, skillName, playerName) {
			const animation = decadeUI.animation;
			const sprite = animation.playSpine("effect_xianding");
			if (!sprite || !sprite.skeleton) {
				console.error("Spine动画未正确加载，sprite或skeleton为undefined");
				return;
			}
			const skeleton = sprite.skeleton;

			// 设置背景
			this._setupBackgroundAttachment(skeleton, bgImage, camp, animation);

			// 设置武将头像
			this._setupGeneralAttachment(skeleton, image, animation);

			// 计算缩放
			const size = skeleton.bounds.size;
			sprite.scale = Math.max(animation.canvas.width / size.x, animation.canvas.height / size.y);

			// 创建UI元素
			this._createSkillUI(skillName, playerName, sprite.scale);
		},

		// 设置背景附件
		_setupBackgroundAttachment(skeleton, bgImage, camp, animation) {
			const slot = skeleton.findSlot("shilidipan");
			const attachment = slot.getAttachment();

			if (attachment.camp !== camp) {
				if (!attachment.cached) attachment.cached = {};

				if (!attachment.cached[camp]) {
					const region = animation.createTextureRegion(bgImage);
					attachment.cached[camp] = region;
				}

				const region = attachment.cached[camp];
				attachment.width = region.width;
				attachment.height = region.height;
				attachment.setRegion(region);
				attachment.updateOffset();
				attachment.camp = camp;
			}
		},

		// 设置武将附件
		_setupGeneralAttachment(skeleton, image, animation) {
			const slot = skeleton.findSlot("wujiang");
			const attachment = slot.getAttachment();
			const region = animation.createTextureRegion(image);

			const scale = Math.min(CONSTANTS.SKILL.MAX_WIDTH / region.width, CONSTANTS.SKILL.MAX_HEIGHT / region.height);
			attachment.width = region.width * scale;
			attachment.height = region.height * scale;
			attachment.setRegion(region);
			attachment.updateOffset();
		},

		// 创建技能UI
		_createSkillUI(skillName, playerName, spriteScale) {
			// 创建技能名称效果
			const effect = decadeUI.element.create("skill-name");
			effect.innerHTML = skillName;
			effect.style.top = `calc(50% + ${CONSTANTS.SKILL.NAME_OFFSET_Y * spriteScale}px)`;

			// 创建武将名称效果
			const nameEffect = decadeUI.element.create("general-name");
			nameEffect.innerHTML = playerName;

			// 设置武将名称样式
			const generalStyles = {
				...CONSTANTS.STYLES.GENERAL_NAME,
				right: `calc(50% - ${CONSTANTS.SKILL.GENERAL_OFFSET_X * spriteScale}px)`,
				top: `calc(50% - ${CONSTANTS.SKILL.GENERAL_OFFSET_Y * spriteScale}px)`,
			};

			nameEffect.style.cssText = Object.entries(generalStyles)
				.map(([key, value]) => {
					const kebabKey = key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
					return `${kebabKey}: ${value}`;
				})
				.join("; ");

			// 添加到界面并设置自动移除
			ui.arena.appendChild(effect);
			ui.arena.appendChild(nameEffect);
			effect.removeSelf(CONSTANTS.DURATION.EFFECT);
			nameEffect.removeSelf(CONSTANTS.DURATION.EFFECT);
		},

		// 处理图片加载错误
		async _handleImageError(image, url, player) {
			// 如果当前已经是lihui路径但加载失败，尝试原始character路径
			if (image.src.includes("image/lihui")) {
				const originalUrl = utils.parseCssUrl(url);
				if (originalUrl !== image.src) {
					image.src = originalUrl;
					return;
				}
			}

			// 如果当前是character路径但加载失败，尝试lihui路径
			if (image.src.includes("image/character")) {
				const lihuiPath = image.src.replace(/image\/character/, "image/lihui");
				const lihuiExists = await utils.checkImageExists(lihuiPath);
				if (lihuiExists) {
					image.src = lihuiPath;
					return;
				}
			}

			// 最后回退到默认头像
			image.src = utils.getDefaultAvatarPath(player);
		},
	};
});
