import { lib, game, ui, get, ai, _status } from "../../../noname.js";
export async function precontent() {
	if (get.mode() === "chess" || get.mode() === "tafang" || get.mode === "hs_hearthstone") return;
	if (lib.config["extension_" + decadeUIName + "_eruda"]) {
		var script = document.createElement("script");
		script.src = decadeUIPath + "js/eruda.js";
		document.body.appendChild(script);
		script.onload = function () {
			eruda.init();
		};
	}
	if (window.require && !window.fs) window.fs = require("fs");
	lib.configMenu.appearence.config.layout.visualMenu = (node, link) => {
		node.className = `button character themebutton ${lib.config.theme}`;
		node.classList.add(link);
		if (node.created) return;
		node.created = true;
		node.style.overflow = "scroll";
		const list = ["re_caocao", "re_liubei", "sp_zhangjiao", "sunquan"];
		while (list.length) {
			ui.create.div(".avatar", ui.create.div(".seat-player.fakeplayer", node)).setBackground(list.randomRemove(), "character");
		}
	};
	window.decadeModule = (function (decadeModule) {
		var version = lib.extensionPack.十周年UI.version;
		if (ui.css.layout) {
			if (!ui.css.layout.href || ui.css.layout.href.indexOf("long2") < 0) ui.css.layout.href = lib.assetURL + "layout/long2/layout.css";
		}
		decadeModule.init = function () {
			// 基础CSS加载
			["css/extension.css", "css/decadeLayout.css", "css/card.css", "css/meihua.css"].forEach(path => this.css(decadeUIPath + path));
			// newDecadeStyle相关CSS加载
			const style = lib.config.extension_十周年UI_newDecadeStyle;
			const styleIndex = ["on", "off", "othersOn", "othersOff", "onlineUI", "babysha"].indexOf(style);
			if (style !== void 0) {
				this.css(decadeUIPath + `css/player${styleIndex + 1}.css`);
			} else {
				this.css(decadeUIPath + "css/player2.css");
			}
			// equip与layout相关CSS加载
			let equipCss = "css/equip_new.css",
				layoutCss = "css/layout.css";
			if (style === "othersOff") {
				equipCss = "css/equip_new_new.css";
				layoutCss = "css/layout_new.css";
			} else if (style === "onlineUI") {
				equipCss = "css/equip_ol.css";
				layoutCss = "css/layout_new.css";
			} else if (style === "babysha") {
				equipCss = "css/equip_baby.css";
				layoutCss = "css/layout_new.css";
			} else if (style === "on") {
				equipCss = "css/equip.css";
			}
			this.css(decadeUIPath + equipCss);
			this.css(decadeUIPath + layoutCss);
			// 其他条件CSS
			if (lib.config.extension_十周年UI_meanPrettify) {
				this.css(decadeUIPath + "css/menu.css");
			}
			if (lib.config["extension_十周年UI_choosecharboder"]) {
				this.css(decadeUIPath + "css/style.css");
			}
			// JS加载
			["js/spine.js", "js/component.js", "js/skill.js", "js/content.js", "js/effect.js", "js/meihua.js", "js/animation.js", "js/dynamicSkin.js"].forEach(path => this.js(decadeUIPath + path));
			// 原手杀UI内容加载
			if (!lib.config.asset_version) game.saveConfig("asset_version", "无");
			const layoutPath = decadeUIPath + "shoushaUI/";
			const listmap =
				{
					on: 2,
					off: 1,
					othersOn: 1,
					othersOff: 3,
					onlineUI: 4,
					babysha: 5,
				}[style] || 2;
			if (!(get.mode() == "chess" || get.mode() == "tafang" || get.mode == "hs_hearthstone")) {
				["character", "lbtn", "skill"].forEach(pack => {
					// css加载
					const cssPath = pack === "character" ? `${layoutPath}${pack}/main${listmap}.css` : `${layoutPath}${pack}/main${listmap}${lib.config.touchscreen ? "" : "_window"}.css`;
					this.css(cssPath);
					// js加载
					this.js(
						`${layoutPath}${pack}/${pack}/main${listmap}.js`,
						null,
						function () {},
						function () {}
					);
				});
			}
			return this;
		};
		decadeModule.js = function (path) {
			if (!path) return console.error("path");
			const script = document.createElement("script");
			script.onload = function () {
				this.remove();
			};
			script.onerror = function () {
				this.remove();
				console.error(`${this.src}not found`);
			};
			script.src = `${path}?v=${version}`;
			document.head.appendChild(script);
			return script;
		};
		decadeModule.css = function (path) {
			if (!path) return console.error("path");
			const link = document.createElement("link");
			link.rel = "stylesheet";
			link.href = `${path}?v=${version}`;
			document.head.appendChild(link);
			return link;
		};
		decadeModule.import = function (module) {
			if (!this.modules) this.modules = [];
			if (typeof module != "function") return console.error("import failed");
			this.modules.push(module);
		};
		return decadeModule.init();
	})({});
	Object.defineProperties(_status, {
		connectMode: {
			configurable: true,
			get() {
				return this._connectMode;
			},
			set(value) {
				this._connectMode = value;
				if (!value || !lib.extensions) return;
				const decadeExtension = lib.extensions.find(value => value[0] == decadeUIName);
				if (!decadeExtension) return;
				const startBeforeFunction = lib.init.startBefore;
				lib.init.startBefore = function () {
					try {
						_status.extension = decadeExtension[0];
						_status.evaluatingExtension = decadeExtension[3];
						decadeExtension[1](decadeExtension[2], decadeExtension[4]);
						delete _status.extension;
						delete _status.evaluatingExtension;
						console.log(`%c${decadeUIName}: 联机成功`, "color:blue");
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
	//手杀UI
	window.app = {
		each(obj, fn, node) {
			if (!obj) return node;
			if (typeof obj.length === "number") {
				for (let i = 0; i < obj.length; i++) {
					if (fn.call(node, obj[i], i) === false) {
						break;
					}
				}
				return node;
			}
			for (const i in obj) {
				if (fn.call(node, obj[i], i) === false) {
					break;
				}
			}
			return node;
		},
		isFunction(fn) {
			return typeof fn === "function";
		},
		event: {
			listens: {},
			on(name, listen, remove) {
				if (!this.listens[name]) {
					this.listens[name] = [];
				}
				this.listens[name].push({
					listen: listen,
					remove: remove,
				});
				return this;
			},
			off(name, listen) {
				return app.each(
					this.listens[name],
					function (item, index) {
						if (listen === item || listen === item.listen) {
							this.listens[name].splice(index, 1);
						}
					},
					this
				);
			},
			emit(name, ...args) {
				return app.each(
					this.listens[name],
					function (item) {
						item.listen.apply(null, args);
						if (item.remove) this.off(name, item);
					},
					this
				);
			},
			once(name, listen) {
				return this.on(name, listen, true);
			},
		},
		create: {},
		listens: {},
		plugins: [],
		pluginsMap: {},
		path: {
			ext(path, ext) {
				ext = ext || app.name;
				return lib.assetURL + "extension/" + ext + "/" + path;
			},
		},
		on(event, listen) {
			if (!app.listens[event]) {
				app.listens[event] = [];
			}
			app.listens[event].push(listen);
		},
		once(event, listen) {
			if (!app.listens[event]) {
				app.listens[event] = [];
			}
			app.listens[event].push({
				listen: listen,
				remove: true,
			});
		},
		off(event, listen) {
			const listens = app.listens[event] || [];
			const filters = listen ? listens.filter(item => item === listen || item.listen === listen) : listens.slice(0);
			filters.forEach(item => {
				const idx = listens.indexOf(item);
				if (idx > -1) listens.splice(idx, 1);
			});
		},
		emit(event, ...args) {
			const listens = app.listens[event] || [];
			listens.forEach(item => {
				if (typeof item === "function") {
					item.apply(null, args);
				} else if (typeof item.listen === "function") {
					item.listen.apply(null, args);
					if (item.remove) {
						const idx = listens.indexOf(item);
						if (idx > -1) listens.splice(idx, 1);
					}
				}
			});
		},
		import(fn) {
			const obj = fn(lib, game, ui, get, ai, _status, app);
			if (obj) {
				if (obj.name) app.pluginsMap[obj.name] = obj;
				if (obj.precontent && (!obj.filter || obj.filter())) obj.precontent();
			}
			app.plugins.push(obj);
		},
		importPlugin(data, setText) {
			if (!window.JSZip) {
				const args = arguments;
				lib.init.js(lib.assetURL + "game", "jszip", function () {
					app.importPlugin.apply(app, args);
				});
				return;
			}
			setText = typeof setText === "function" ? setText : () => {};
			const zip = new JSZip(data);
			const dirList = [],
				fileList = [];
			for (const i in zip.files) {
				if (/\/$/.test(i)) {
					dirList.push("extension/" + app.name + "/" + i);
				} else if (!/^extension\.(js|css)$/.test(i)) {
					fileList.push({
						id: i,
						path: "extension/" + app.name + "/" + i.split("/").reverse().slice(1).reverse().join("/"),
						name: i.split("/").pop(),
						target: zip.files[i],
					});
				}
			}
			const total = dirList.length + fileList.length;
			let finish = 0;
			const isNode = lib.node && lib.node.fs;
			const writeFile = () => {
				const file = fileList.shift();
				if (file) {
					setText(`正在导入(${++finish}/${total})...`);
					game.writeFile(isNode ? file.target.asNodeBuffer() : file.target.asArrayBuffer(), file.path, file.name, writeFile);
				} else {
					alert("导入完成");
					setText("导入插件");
				}
			};
			const ensureDir = () => {
				if (dirList.length) {
					setText(`正在导入(${++finish}/${total})...`);
					game.ensureDirectory(dirList.shift(), ensureDir);
				} else {
					writeFile();
				}
			};
			ensureDir();
		},
		loadPlugins(callback) {
			game.getFileList("extension/" + app.name, floders => {
				const total = floders.length;
				let current = 0;
				if (total === current) {
					callback();
					return;
				}
				const loaded = () => {
					if (++current === total) callback();
				};
				const readAndEval = (dir, file) => {
					game.readFile(
						`extension/${app.name}/${dir}/${file}`,
						data => {
							const binarry = new Uint8Array(data);
							const blob = new Blob([binarry]);
							const reader = new FileReader();
							reader.readAsText(blob);
							reader.onload = () => {
								eval(reader.result);
								loaded();
							};
						},
						e => {
							console.info(e);
							loaded();
						}
					);
				};
				floders.forEach(dir => {
					switch (lib.config.extension_十周年UI_newDecadeStyle) {
						case "on":
							readAndEval(dir, "main1.js");
							break;
						case "othersOff":
							readAndEval(dir, "main3.js");
							break;
						default:
							readAndEval(dir, "main2.js");
							break;
					}
				});
			});
		},
		reWriteFunction(target, name, replace, str) {
			if (name && typeof name === "object") {
				return app.each(name, (item, index) => app.reWriteFunction(target, index, item[0], item[1]), target);
			}
			if ((typeof replace === "string" || replace instanceof RegExp) && (typeof str === "string" || str instanceof RegExp)) {
				const funcStr = target[name].toString().replace(replace, str);
				eval(`target.${name} = ${funcStr}`);
			} else {
				const func = target[name];
				target[name] = function (...args) {
					let result, cancel;
					if (typeof replace === "function") cancel = replace.apply(this, [args].concat(args));
					if (typeof func === "function" && !cancel) result = func.apply(this, args);
					if (typeof str === "function") str.apply(this, [result].concat(args));
					return cancel || result;
				};
			}
			return target[name];
		},
		reWriteFunctionX(target, name, replace, str) {
			if (name && typeof name === "object") {
				return app.each(name, (item, index) => app.reWriteFunction(target, index, item), target);
			}
			if (Array.isArray(replace)) {
				let [item1, item2, item3] = replace;
				if (item3 === "append") {
					item2 = item1 + item2;
				} else if (item3 === "insert") {
					item2 = item2 + item1;
				}
				if (typeof item1 === "string") {
					item1 = RegExp(item1);
				}
				if (item1 instanceof RegExp && typeof item2 === "string") {
					const funcStr = target[name].toString().replace(item1, item2);
					eval(`target.${name} = ${funcStr}`);
				} else {
					const func = target[name];
					target[name] = function (...args) {
						let result;
						if (app.isFunction(item1)) result = item1.apply(this, [args].concat(args));
						if (app.isFunction(func) && !result) result = func.apply(this, args);
						if (app.isFunction(item2)) item2.apply(this, [result].concat(args));
						return result;
					};
				}
			} else {
				console.info(arguments);
			}
			return target[name];
		},
		waitAllFunction(fnList, callback) {
			const list = fnList.slice();
			const runNext = () => {
				const item = list.shift();
				if (typeof item === "function") {
					item(runNext);
				} else if (list.length === 0) {
					callback();
				} else {
					runNext();
				}
			};
			runNext();
		},
		element: {
			runNext: {
				setTip(tip) {
					console.info(tip);
				},
			},
		},
		get: {
			skillInfo(skill, node) {
				const obj = { id: skill };
				if (lib.translate[skill + "_ab"]) {
					obj.name = lib.translate[skill + "_ab"];
					obj.nameSimple = lib.translate[skill + "_ab"];
				} else if (lib.translate[skill]) {
					obj.name = lib.translate[skill];
					obj.nameSimple = lib.translate[skill].slice(0, 2);
				}
				obj.info = lib.skill[skill];
				if (node) {
					if (node.forbiddenSkills[skill]) obj.forbidden = true;
					if (node.disabledSkills[skill]) obj.disabled = true;
					if (obj.info.temp || !node.skills.includes(skill)) obj.temp = true;
					if (obj.info.frequent || obj.info.subfrequent) obj.frequent = true;
					if (obj.info.clickable && node.isIn() && node.isUnderControl(true)) obj.clickable = true;
					if (obj.info.nobracket) obj.nobracket = true;
				}
				obj.translation = get.skillInfoTranslation(skill);
				obj.translationSource = lib.translate[skill + "_info"];
				obj.translationAppend = lib.translate[skill + "_append"];
				obj.type = obj.info && obj.info.enable ? "enable" : "trigger";
				return obj;
			},
		},
		listen(node, func) {
			node.addEventListener(lib.config.touchscreen ? "touchend" : "click", func);
			return () => {
				node.removeEventListener(lib.config.touchscreen ? "touchend" : "click", func);
			};
		},
		mockTouch(node) {
			const event = new Event(lib.config.touchscreen ? "touchend" : "click");
			node.dispatchEvent(event);
			return node;
		},
		nextTick(func, time) {
			const funcs = Array.isArray(func) ? func.slice() : [func];
			const next = () => {
				const item = funcs.shift();
				if (item) {
					setTimeout(() => {
						item();
						next();
					}, time || 0);
				}
			};
			next();
		},
	};
	//避免提示是否下载图片和字体素材
	if (!lib.config.asset_version) game.saveConfig("asset_version", "无");
	//函数加载
	var layoutPath = lib.assetURL + "extension/十周年UI/shoushaUI/";
	var mode = get.mode();
	var styleMap = {
		on: 2,
		off: 1,
		othersOn: 1,
		othersOff: 3,
		onlineUI: 4,
		babysha: 5,
	};
	if (!(mode == "chess" || mode == "tafang" || mode == "hs_hearthstone")) {
		var packs = [/*'card',*/ "character", "lbtn", "skill"];
		var listmap = styleMap[lib.config.extension_十周年UI_newDecadeStyle] || 2;
		packs.forEach(function (pack) {
			lib.init.js(
				layoutPath + pack + "/main" + listmap + ".js",
				null,
				function () {},
				function () {}
			);
			if (pack === "character") {
				lib.init.css(layoutPath + pack + "/main" + listmap + ".css");
			} else {
				lib.init.css(layoutPath + pack + "/main" + listmap + (lib.config.phonelayout ? "" : "_window") + ".css");
			}
		});
	}
	//函数框架
	/*进度条框架*/
	game.Jindutiaoplayer = function () {
		// 清理之前的定时器和元素
		_clearPreviousTimers();
		_removePreviousElement();
		// 创建进度条容器
		var boxContent = _createProgressContainer();
		// 根据配置选择样式
		var styleConfig = _getStyleConfig();
		_applyStyle(boxContent, styleConfig);
		// 创建进度条元素
		var progressElements = _createProgressElements(styleConfig);
		_appendProgressElements(boxContent, progressElements);
		// 添加到页面
		document.body.appendChild(boxContent);
		// 启动主定时器
		_startMainTimer(progressElements.boxTime, boxContent);
		// 启动特殊定时器（如果需要）
		if (window.jindutiaoTeshu === true) {
			_startSpecialTimer(progressElements.boxTime2, progressElements.imgBg3);
		}
		// 辅助函数
		function _clearPreviousTimers() {
			if (window.timer) {
				clearInterval(window.timer);
				delete window.timer;
			}
			if (window.timer2) {
				clearInterval(window.timer2);
				delete window.timer2;
			}
		}
		function _removePreviousElement() {
			var existingElement = document.getElementById("jindutiaopl");
			if (existingElement) {
				existingElement.remove();
			}
		}
		function _createProgressContainer() {
			var container = document.createElement("div");
			container.setAttribute("id", "jindutiaopl");
			return container;
		}
		function _getStyleConfig() {
			var styleType = lib.config.extension_十周年UI_jindutiaoYangshi;
			var configs = {
				1: {
					name: "手杀进度条样式",
					container: {
						backgroundColor: "rgba(0,0,0,0.4)",
						width: "620px",
						height: "12.3px",
						borderRadius: "1000px",
						boxShadow: "0px 0px 9px #2e2b27 inset,0px 0px 2.1px #FFFFD5",
						overflow: "hidden",
						border: "1.2px solid #000000",
						position: "fixed",
						left: "calc(50% - 300px)",
						bottom: parseFloat(lib.config["extension_十周年UI_jindutiaoSet"]) + "%",
					},
					progressBar: {
						data: 620,
						style: "background-image: linear-gradient(#fccc54 15%, #d01424 30%, #cc6953 90%);height:12.8px;",
					},
					clearSpecial: true,
				},
				2: {
					name: "十周年PC端进度条样式",
					container: {
						width: "400px",
						height: "24px",
						display: "block",
						left: "calc(50% - 197px)",
						position: "fixed",
						bottom: parseFloat(lib.config["extension_十周年UI_jindutiaoSet"]) + "%",
					},
					progressBar: {
						data: 300,
						style: "width:280px;height:4.3px;margin:14px 0 0 85px;background-color: #E2E20A;border-right:5px solid #FFF;position: absolute;top: -3.5px;",
					},
					backgroundImage: {
						src: "extension/十周年UI/shoushaUI/lbtn/images/uibutton/jindutiao.png",
						style: "--w:400px;--h:calc(var(--w)*44/759);width: var(--w);height:var(--h);position: absolute;top: 0;",
					},
					clearSpecial: true,
				},
				3: {
					name: "十周年客户端进度条样式",
					container: {
						width: "400px",
						height: "13px",
						display: "block",
						boxShadow: "0 0 4px #000000",
						margin: "0 0 !important",
						position: "fixed",
						left: "calc(50% - 197px)",
						bottom: parseFloat(lib.config["extension_十周年UI_jindutiaoSet"]) + "%",
					},
					progressBar: {
						data: 395,
						style: "z-index:1;width:399px;height:8px;margin:0 0 0 1px;background-color: #F4C336;border-top:3px solid #EBE1A7;border-bottom:2px solid #73640D;border-left:1px solid #73640D;position: absolute;top: 0px;border-radius:3px;",
					},
					secondaryBar: {
						data: 395,
						style: "width:399px;height:0.1px;margin:0 0 0 0.5px;background-color: #fff; opacity:0.8 ;border-top:1px solid #FFF;border-bottom:1px solid #FFF;border-left:1px solid #FFF;position: absolute;top: 17px;border-radius: 2px;",
					},
					backgroundImages: [
						{
							src: "extension/十周年UI/shoushaUI/lbtn/images/uibutton/jindutiao2.1.png",
							style: "width: 400px;height:4px;position: absolute;top: 16px;z-index: -1;",
						},
						{
							src: "extension/十周年UI/shoushaUI/lbtn/images/uibutton/jindutiao2.png",
							style: "width: 400px;height:13px;position: absolute;top: 0;opacity:0;",
						},
						{
							src: "extension/十周年UI/shoushaUI/lbtn/images/uibutton/jindutiao2.1.png",
							style: "width: 400px;height:14px;position: absolute;top: 0;z-index: -1;",
						},
					],
					setSpecial: true,
				},
				4: {
					name: "新样式",
					container: {
						width: "400px",
						height: "13px",
						display: "block",
						margin: "0 0 !important",
						position: "fixed",
						left: "calc(50% - 197px)",
						bottom: parseFloat(lib.config["extension_十周年UI_jindutiaoSet"]) + "%",
						backgroundColor: "#4B3621",
						borderRadius: "6px",
					},
					progressBar: {
						data: 395,
						style: "z-index:1;width:399px;height:12px;margin:0 0 0 0px;background-color:rgb(230, 151, 91);position: absolute;top: 1px;border-radius:6px;",
					},
					clearSpecial: true,
				},
			};
			return configs[styleType] || configs["1"];
		}
		function _applyStyle(container, config) {
			if (config.clearSpecial && window.jindutiaoTeshu) {
				delete window.jindutiaoTeshu;
			}
			if (config.setSpecial && !window.jindutiaoTeshu) {
				window.jindutiaoTeshu = true;
			}
			Object.keys(config.container).forEach(function (key) {
				container.style[key] = config.container[key];
			});
		}
		function _createProgressElements(config) {
			var elements = {};
			elements.boxTime = document.createElement("div");
			elements.boxTime.data = config.progressBar.data;
			elements.boxTime.style.cssText = config.progressBar.style;
			if (config.secondaryBar) {
				elements.boxTime2 = document.createElement("div");
				elements.boxTime2.data = config.secondaryBar.data;
				elements.boxTime2.style.cssText = config.secondaryBar.style;
			}
			if (config.backgroundImage) {
				elements.imgBg = _createImageElement(config.backgroundImage);
			}
			if (config.backgroundImages) {
				elements.backgroundImages = config.backgroundImages.map(function (imgConfig, index) {
					var img = _createImageElement(imgConfig);
					if (index === 0) elements.imgBg3 = img; // 为特殊定时器保存引用
					return img;
				});
			}
			return elements;
		}
		function _createImageElement(imgConfig) {
			var img = document.createElement("img");
			img.src = lib.assetURL + imgConfig.src;
			img.style.cssText = imgConfig.style;
			return img;
		}
		function _appendProgressElements(container, elements) {
			// 添加主进度条
			container.appendChild(elements.boxTime);
			// 添加次要进度条
			if (elements.boxTime2) {
				container.appendChild(elements.boxTime2);
			}
			// 添加单个背景图片
			if (elements.imgBg) {
				container.appendChild(elements.imgBg);
			}
			// 添加多个背景图片
			if (elements.backgroundImages) {
				elements.backgroundImages.forEach(function (img) {
					container.appendChild(img);
				});
			}
		}
		function _startMainTimer(progressBar, container) {
			window.timer = setInterval(function () {
				progressBar.style.width = progressBar.data + "px";
				// 剩余三分之一变红色
				if (progressBar.data <= 395 / 3) {
					progressBar.style.backgroundColor = "rgba(230, 56, 65, 0.88)";
				} else {
					progressBar.style.backgroundColor = "rgb(230, 151, 91)";
				}
				progressBar.data--;
				if (progressBar.data == 0) {
					clearInterval(window.timer);
					delete window.timer;
					container.remove();
					if (lib.config.extension_十周年UI_jindutiaotuoguan == true && _status.auto == false) {
						ui.click.auto();
					}
				}
			}, parseFloat(lib.config["extension_十周年UI_jindutiaoST"]));
		}
		function _startSpecialTimer(secondaryBar, backgroundImg) {
			window.timer2 = setInterval(function () {
				secondaryBar.data--;
				secondaryBar.style.width = secondaryBar.data + "px";
				if (secondaryBar.data == 0) {
					clearInterval(window.timer2);
					delete window.timer2;
					delete window.jindutiaoTeshu;
					secondaryBar.remove();
					backgroundImg.remove();
				}
			}, parseFloat(lib.config["extension_十周年UI_jindutiaoST"]) / 2);
		}
	};
	//-----AI进度条框架----//
	game.JindutiaoAIplayer = function () {
		// 清理已有定时器和进度条
		if (window.timerai) {
			clearInterval(window.timerai);
			delete window.timerai;
		}
		var oldBar = document.getElementById("jindutiaoAI");
		if (oldBar) oldBar.remove();
		// 创建进度条容器和时间条
		window.boxContentAI = document.createElement("div");
		var boxTimeAI = document.createElement("div");
		boxContentAI.id = "jindutiaoAI";
		let isShousha = lib.config.extension_十周年UI_newDecadeStyle != "on" && lib.config.extension_十周年UI_newDecadeStyle != "othersOff";
		// 样式与图片路径
		if (isShousha) {
			boxContentAI.style.cssText = "display:block;position:absolute;z-index:90;--w:122px;--h:calc(var(--w)*4/145);width:var(--w);height:var(--h);left:3.5px;bottom:-6.2px;";
			boxTimeAI.data = 125;
			boxTimeAI.style.cssText = "z-index:92;--w:33px;--h:calc(var(--w)*4/120);width:var(--w);height:var(--h);margin:1px;background-color:#dd9900;position:absolute;top:0px;";
		} else {
			boxContentAI.style.cssText = "display:block;position:absolute;z-index:90;--w:122px;--h:calc(var(--w)*8/162);width:var(--w);height:var(--h);left:1.5px;bottom:-8.2px;";
			boxTimeAI.data = 120;
			boxTimeAI.style.cssText = "z-index:91;width:115px;height:3.3px;margin:1px;background-color:#f2c84b;position:absolute;top:0px;border-radius:3px;";
		}
		boxContentAI.appendChild(boxTimeAI);
		// 背景图片
		var imgBg = document.createElement("img");
		imgBg.src = lib.assetURL + (isShousha ? "extension/十周年UI/shoushaUI/lbtn/images/uibutton/time.png" : "extension/十周年UI/shoushaUI/lbtn/images/uibutton/timeX.png");
		imgBg.style.cssText = isShousha ? "position:absolute;z-index:91;--w:122px;--h:calc(var(--w)*4/145);width:var(--w);height:var(--h);top:0;" : "position:absolute;z-index:90;--w:122px;--h:calc(var(--w)*8/162);width:var(--w);height:var(--h);top:0;";
		boxContentAI.appendChild(imgBg);
		// 添加到页面
		document.body.appendChild(boxContentAI);
		// 进度条动画
		window.timerai = setInterval(function () {
			boxTimeAI.data--;
			boxTimeAI.style.width = boxTimeAI.data + "px";
			if (boxTimeAI.data === 0) {
				clearInterval(window.timerai);
				delete window.timerai;
				boxContentAI.remove();
			}
		}, 150);
	};
	if (!window.chatRecord) window.chatRecord = [];
	game.addChatWord = function (strx) {
		if (window.chatRecord.length > 30) {
			//设置一下上限30条，不设也行，把这个if删除即可
			window.chatRecord.remove(window.chatRecord[0]);
		}
		if (strx) {
			window.chatRecord.push(strx);
		}
		var str = (window.chatRecord[0] || "") + "<br>";
		if (window.chatRecord.length > 1) {
			for (var i = 1; i < window.chatRecord.length; i++) {
				str += "<br>" + window.chatRecord[i] + "<br>";
			}
		}
		if (window.chatBackground2 != undefined) game.updateChatWord(str);
	};
	//这里
	game.showChatWordBackgroundX = function () {
		if (window.chatBg != undefined && window.chatBg.show) {
			//控制面板打开，首次调用此函数时打开面板，再次调用时关闭
			window.chatBg.hide();
			//关闭砸表情
			if (window.jidan.thrownn) window.jidan.thrownn = false;
			if (window.tuoxie.thrownn) window.tuoxie.thrownn = false;
			if (window.xianhua.thrownn) window.xianhua.thrownn = false;
			if (window.meijiu.thrownn) window.meijiu.thrownn = false;
			if (window.cailan.thrownn) window.cailan.thrownn = false;
			if (window.qicai.thrownn) window.qicai.thrownn = false;
			window.chatBg.show = false;
			if (window.dialog_lifesay) {
				if (window.dialog_lifesay.show) window.dialog_lifesay.style.left = "-" + window.dialog_lifesay.style.width;
				setTimeout(function () {
					window.dialog_lifesay.hide();
					window.dialog_lifesay.show = false;
				}, 100);
			}
			if (window.dialog_emoji) {
				if (window.dialog_emoji.show) window.dialog_emoji.style.top = "100%";
				setTimeout(function () {
					window.dialog_emoji.hide();
					window.dialog_emoji.show = false;
				}, 1000);
			}
			if (window.chatBackground) {
				if (window.chatBackground.show) window.chatBackground.style.left = "100%";
				setTimeout(function () {
					window.chatBackground.hide();
					window.chatBackground.show = false;
				}, 1000);
			}
			return;
		}
		var dialogChat = {};
		//聊天框整体
		window.chatBg = ui.create.div("hidden");
		window.chatBg.classList.add("popped");
		window.chatBg.classList.add("static");
		window.chatBg.show = true;
		window.chatBg.style.cssText = "display: block;--w: 420px;--h: calc(var(--w) * 430/911);width: var(--w);height: var(--h);position: fixed;left:30%;bottom:5%;opacity: 1;background-size: 100% 100%;background-color: transparent;z-index:99;";
		window.chatBg.style.transition = "all 1.5s";
		/*window.chatBg.style.height='170px';//调整对话框背景大小，位置
window.chatBg.style.width='550px';
  window.chatBg.style.left='calc(50%-130px)';
window.chatBg.style.top='calc(100% - 470px)';
window.chatBg.style.opacity=1;*/
		window.chatBg.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/chat.png");
		/*window.chatBg.style.backgroundSize="100% 100%";
window.chatBg.style.transition='all 0.5s';
window.chatBg.style['box-shadow']='none';*/
		ui.window.appendChild(window.chatBg);
		var clickFK = function (div) {
			div.style.transition = "opacity 0.5s";
			div.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", function () {
				this.style.transform = "scale(0.95)";
			});
			div.addEventListener(lib.config.touchscreen ? "touchend" : "mouseup", function () {
				this.style.transform = "";
			});
			div.onmouseout = function () {
				this.style.transform = "";
			};
		};
		//--------------------------------//
		game.open_lifesay = function () {
			//打开常用语函数
			if (window.dialog_emoji) {
				if (window.dialog_emoji.show) window.dialog_emoji.style.top = "100%";
				setTimeout(function () {
					window.dialog_emoji.hide();
					window.dialog_emoji.show = false;
				}, 1000);
			}
			if (window.chatBackground) {
				if (window.chatBackground.show) window.chatBackground.style.left = "100%";
				setTimeout(function () {
					window.chatBackground.hide();
					window.chatBackground.show = false;
				}, 1000);
			}
			if (window.dialog_lifesay != undefined && window.dialog_lifesay.show) {
				//控制面板打开，首次调用此函数时打开面板，再次调用时关闭
				window.dialog_lifesay.hide();
				window.dialog_lifesay.show = false;
				return;
			}
			var dialogLife = {};
			window.dialog_lifesay = ui.create.div("hidden");
			window.dialog_lifesay.style["z-index"] = 999999999;
			window.dialog_lifesay.classList.add("popped");
			window.dialog_lifesay.classList.add("static");
			window.dialog_lifesay.show = true;
			window.dialog_lifesay.style.height = "300px"; //整个常用语对话框的宽高
			window.dialog_lifesay.style.width = "600px"; //对话框的宽度，由每一条的内容字数决定，可自行调整，使用固定大小避免手机和电脑像素不同导致冲突
			window.dialog_lifesay.style.left = "-" + window.dialog_lifesay.style.width; //这里弄一个右移的动画
			setTimeout(function () {
				window.dialog_lifesay.style.left = "calc( 50% - 300px)"; //整个对话框的位置
			}, 100);
			window.dialog_lifesay.style.top = "calc( 20% - 100px)"; //整个对话框的位置
			window.dialog_lifesay.style.transition = "all 1s";
			window.dialog_lifesay.style.opacity = 1;
			window.dialog_lifesay.style.borderRadius = "8px";
			window.dialog_lifesay.style.backgroundSize = "100% 100%";
			window.dialog_lifesay.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/nobg.png"); //把背景dialog设置为透明
			window.dialog_lifesay.style["box-shadow"] = "none";
			ui.window.appendChild(window.dialog_lifesay);
			dialogLife.background = window.dialog_lifesay;
			window.dialog_lifesayBgPict = ui.create.div("hidden"); //这是现在的背景颜色的div，外层div
			window.dialog_lifesayBgPict.style.height = "100%";
			window.dialog_lifesayBgPict.style.width = "100%";
			window.dialog_lifesayBgPict.style.left = "0%";
			window.dialog_lifesayBgPict.style.top = "0%";
			window.dialog_lifesayBgPict.style.borderRadius = "8px";
			window.dialog_lifesayBgPict.style.backgroundSize = "100% 100%";
			window.dialog_lifesayBgPict.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/saydiv.png");
			window.dialog_lifesayBgPict.style["box-shadow"] = "none";
			window.dialog_lifesay.appendChild(window.dialog_lifesayBgPict);
			window.dialog_lifesayBgColor = ui.create.div("hidden"); //这是原来的背景颜色的div，内层div
			window.dialog_lifesayBgColor.style.height = "70%";
			window.dialog_lifesayBgColor.style.width = "80%";
			window.dialog_lifesayBgColor.style.left = "10%";
			window.dialog_lifesayBgColor.style.top = "10%";
			window.dialog_lifesayBgColor.style.borderRadius = "8px";
			window.dialog_lifesayBgColor.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/nobg.png"); //把背景设置为透明
			//window.dialog_lifesayBgColor.style.backgroundColor='black';
			window.dialog_lifesayBgColor.style["overflow-y"] = "scroll";
			lib.setScroll(window.dialog_lifesayBgColor);
			window.dialog_lifesay.appendChild(window.dialog_lifesayBgColor);
			window.lifesayWord = ["能不能快点呀，兵贵神速啊", "主公，别开枪，自己人", "小内再不跳，后面还怎么玩啊", "你们怎么忍心就这么让我酱油了", "我，我惹你们了吗", "姑娘，你真是条汉子", "三十六计，走为上，容我去去便回", "人心散了，队伍不好带啊", "昏君，昏君啊", "风吹鸡蛋壳，牌去人安乐", "小内啊，您老悠着点儿", "不好意思，刚才卡了", "你可以打得再烂一点吗", "哥们儿，给力点行吗", "哥，交个朋友吧", "妹子，交个朋友吧"];
			for (var i = 0; i < window.lifesayWord.length; i++) {
				window["dialog_lifesayContent_" + i] = ui.create.div("hidden", "", function () {
					game.me.say(this.content);
					window.dialog_lifesay.delete();
					delete window.dialog_lifesay;
					window.dialog_lifesay = undefined;
					game.playAudio("..", "extension", "十周年UI/shoushaUI/sayplay/audio", this.pos + "_" + game.me.sex);
				});
				window["dialog_lifesayContent_" + i].style.height = "10%"; //每一条内容的高度，可以用px也可以用百分比，由你喜欢
				window["dialog_lifesayContent_" + i].style.width = "100%"; //每一条内容的宽度，默认与整个对话框宽度挂钩以美观，具体百分比可自己调整
				window["dialog_lifesayContent_" + i].style.left = "0%";
				window["dialog_lifesayContent_" + i].style.top = "0%";
				window["dialog_lifesayContent_" + i].style.position = "relative";
				window["dialog_lifesayContent_" + i].pos = i;
				window["dialog_lifesayContent_" + i].content = window.lifesayWord[i];
				window["dialog_lifesayContent_" + i].innerHTML = "<font color=white>" + window.lifesayWord[i] + "</font>"; //显示的字体可以自己改
				window.dialog_lifesayBgColor.appendChild(window["dialog_lifesayContent_" + i]);
				clickFK(window["dialog_lifesayContent_" + i]);
			}
		};
		//常用语按钮
		window.chatButton1 = ui.create.div("hidden", "", game.open_lifesay);
		window.chatButton1.style.cssText = "display: block;--w: 80px;--h: calc(var(--w) * 82/98);width: var(--w);height: var(--h);left:40px;bottom:25px;transition:none;background-size:100% 100%";
		/*window.chatButton1.style.height='70px';
        window.chatButton1.style.width='80px';
        window.chatButton1.style.left='40px';
        window.chatButton1.style.bottom='10px';
        window.chatButton1.style.transition='none';
        window.chatButton1.style.backgroundSize="100% 100%";*/
		window.chatButton1.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/lifesay.png");
		lib.setScroll(window.chatButton1);
		window.chatBg.appendChild(window.chatButton1);
		clickFK(window.chatButton1);
		//-----------------------------------//
		//-----------互动框---------//
		game.open_hudong = function () {
			//打开互动框函数
			if (window.dialog_hudong != undefined && dialog_hudong.show) {
				//控制面板打开，首次调用此函数时打开面板，再次调用时关闭
				window.dialog_hudong.hide();
				window.dialog_hudong.show = false;
				return;
			}
		};
		//------菜篮子框------//
		window.hudongkuang = ui.create.div("hidden", "", game.open_hudong);
		window.hudongkuang.style.cssText = "display: block;--w: 315px;--h: calc(var(--w) * 135/142);width: var(--w);height: var(--h);left:-280px;bottom:-30px;transition:none;background-size:100% 100%;pointer-events:none;";
		window.hudongkuang.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/hudong.png");
		window.chatBg.appendChild(window.hudongkuang);
		//------1--美酒-------//
		game.open_meijiu = function () {
			//打开美酒函数
			//这里
			var list = game.players;
			for (let i = 0; i < game.players.length; i++) {
				list[i].onclick = function () {
					var target = this;
					if (window.meijiu.thrownn == true) {
						for (let i = 0; i < 10; i++) {
							setTimeout(() => {
								if (i <= 8) game.me.throwEmotion(this, "flower");
								else game.me.throwEmotion(this, "wine");
								window.shuliang.innerText = window.shuliang.innerText - 1;
							}, 100 * i);
							setTimeout(() => {
								if (i <= 8) target.throwEmotion(game.me, "flower");
								else target.throwEmotion(game.me, "wine");
							}, 100 * i + 500);
						}
					}
				};
			}
		};
		window.meijiu = ui.create.div("hidden", "", game.open_meijiu);
		window.meijiu.style.cssText = "display: block;--w: 63px;--h: calc(var(--w) * 50/50);width: var(--w);height: var(--h);left:-155px;bottom:173px;transition:none;background-size:100% 100%";
		window.meijiu.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/meijiu.png");
		//这里
		window.meijiu.onclick = function () {
			window.meijiu.thrownn = true;
		};
		window.chatBg.appendChild(window.meijiu);
		lib.setScroll(window.meijiu);
		clickFK(window.meijiu);
		//---2-----鲜花-------//
		game.open_xianhua = function () {
			//打开鲜花函数
			//这里
			var list = game.players;
			for (let i = 0; i < game.players.length; i++) {
				list[i].onclick = function () {
					if (window.xianhua.thrownn == true) game.me.throwEmotion(this, "flower");
					window.shuliang.innerText = window.shuliang.innerText - 1;
				};
			}
		};
		window.xianhua = ui.create.div("hidden", "", game.open_xianhua);
		window.xianhua.style.cssText = "display: block;--w: 63px;--h: calc(var(--w) * 50/50);width: var(--w);height: var(--h);left:-230px;bottom:173px;transition:none;background-size:100% 100%";
		window.xianhua.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/xianhua.png");
		//这里
		window.xianhua.onclick = function () {
			window.xianhua.thrownn = true;
		};
		window.chatBg.appendChild(window.xianhua);
		lib.setScroll(window.xianhua);
		clickFK(window.xianhua);
		//-----3---拖鞋-------//
		game.open_tuoxie = function () {
			//打开拖鞋函数
			//这里
			var list = game.players;
			var num = 10;
			for (let i = 0; i < game.players.length; i++) {
				list[i].onclick = function () {
					var target = this;
					if (window.tuoxie.thrownn == true) {
						for (let i = 0; i < num; i++) {
							setTimeout(() => {
								if (i <= 8) {
									game.me.throwEmotion(this, "egg");
									window.shuliang.innerText = window.shuliang.innerText - 1;
								} else {
									game.me.throwEmotion(this, "shoe");
									window.shuliang.innerText = window.shuliang.innerText - 1;
								}
							}, 100 * i);
							setTimeout(() => {
								if (i <= 8) target.throwEmotion(game.me, "egg");
								else target.throwEmotion(game.me, "shoe");
							}, 100 * i + 1000);
						}
					}
				};
			}
		};
		window.tuoxie = ui.create.div("hidden", "", game.open_tuoxie);
		window.tuoxie.style.cssText = "display: block;--w: 63px;--h: calc(var(--w) * 50/50);width: var(--w);height: var(--h);left:-155px;bottom:105px;transition:none;background-size:100% 100%";
		window.tuoxie.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/tuoxie.png");
		//这里
		window.tuoxie.onclick = function () {
			window.tuoxie.thrownn = true;
		};
		window.chatBg.appendChild(window.tuoxie);
		lib.setScroll(window.tuoxie);
		clickFK(window.tuoxie);
		game.open_jidan = function () {
			//打开鸡蛋函数
			//这里
			var list = game.players;
			for (let i = 0; i < game.players.length; i++) {
				list[i].onclick = function () {
					if (window.jidan.thrownn == true) {
						game.me.throwEmotion(this, "egg");
						window.shuliang.innerText = window.shuliang.innerText - 1;
					}
				};
			}
		};
		window.jidan = ui.create.div("hidden", "", game.open_jidan);
		window.jidan.style.cssText = "display: block;--w: 63px;--h: calc(var(--w) * 50/50);width: var(--w);height: var(--h);left:-230px;bottom:105px;transition:none;background-size:100% 100%";
		window.jidan.onclick = function () {
			window.jidan.thrownn = true;
		};
		//这里
		window.jidan.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/jidan.png");
		window.chatBg.appendChild(window.jidan);
		lib.setScroll(window.jidan);
		clickFK(window.jidan);
		//-----5--菜篮-------//
		game.open_cailan = function () {
			//打开菜篮函数
			var list = game.players;
			for (let i = 0; i < game.players.length; i++) {
				list[i].onclick = function () {
					var target = this;
					if (window.cailan.thrownn == true) {
						for (let i = 0; i < 101; i++) {
							setTimeout(() => {
								if (i <= 99) game.me.throwEmotion(this, "flower");
								else game.me.throwEmotion(this, "wine");
								window.shuliang.innerText = window.shuliang.innerText - 1;
							}, 100 * i);
							setTimeout(() => {
								if (i <= 99) target.throwEmotion(game.me, "flower");
								else target.throwEmotion(game.me, "wine");
							}, 100 * i + 1000);
						}
					}
				};
			}
		};
		window.cailan = ui.create.div("hidden", "", game.open_cailan);
		window.cailan.style.cssText = "display: block;--w: 63px;--h: calc(var(--w) * 50/50);width: var(--w);height: var(--h);left:-80px;bottom:173px;transition:none;background-size:100% 100%";
		window.cailan.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/cailan.png");
		window.cailan.onclick = function () {
			window.cailan.thrownn = true;
		};
		window.chatBg.appendChild(window.cailan);
		lib.setScroll(window.cailan);
		clickFK(window.cailan);
		//------6--七彩-------//
		game.open_qicai = function () {
			//打开七彩函数
			var list = game.players;
			for (let i = 0; i < game.players.length; i++) {
				list[i].onclick = function () {
					var target = this;
					if (window.qicai.thrownn == true) {
						for (let i = 0; i < 101; i++) {
							setTimeout(() => {
								if (i <= 99) game.me.throwEmotion(this, "egg");
								else game.me.throwEmotion(this, "shoe");
								window.shuliang.innerText = window.shuliang.innerText - 1;
							}, 100 * i);
							setTimeout(() => {
								if (i <= 99) target.throwEmotion(game.me, "egg");
								else target.throwEmotion(game.me, "shoe");
							}, 100 * i + 1000);
						}
					}
				};
			}
		};
		window.qicai = ui.create.div("hidden", "", game.open_qicai);
		window.qicai.style.cssText = "display: block;--w: 63px;--h: calc(var(--w) * 50/50);width: var(--w);height: var(--h);left:-80px;bottom:105px;transition:none;background-size:100% 100%";
		window.qicai.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/qicai.png");
		window.qicai.onclick = function () {
			window.qicai.thrownn = true;
		};
		window.chatBg.appendChild(window.qicai);
		lib.setScroll(window.qicai);
		clickFK(window.qicai);
		//-----7---小酒-------//
		game.open_xiaojiu = function () {};
		window.xiaojiu = ui.create.div("hidden", "", game.open_xiaojiu);
		window.xiaojiu.style.cssText = "display: block;--w: 63px;--h: calc(var(--w) * 50/50);width: var(--w);height: var(--h);left:-230px;bottom:36px;transition:none;background-size:100% 100%";
		window.xiaojiu.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/xiaojiu.png");
		window.chatBg.appendChild(window.xiaojiu);
		lib.setScroll(window.xiaojiu);
		clickFK(window.xiaojiu);
		//-----8---雪球------//
		game.open_xueqiu = function () {
			//打开雪球函数
		};
		window.xueqiu = ui.create.div("hidden", "", game.open_xueqiu);
		window.xueqiu.style.cssText = "display: block;--w: 63px;--h: calc(var(--w) * 50/50);width: var(--w);height: var(--h);left:-155px;bottom:36px;transition:none;background-size:100% 100%";
		window.xueqiu.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/xueqiu.png");
		window.chatBg.appendChild(window.xueqiu);
		lib.setScroll(window.xueqiu);
		clickFK(window.xueqiu);
		//-------------------//
		//------9-虚无-------//
		game.open_xuwu = function () {
			//打开虚无函数
		};
		window.xuwu = ui.create.div("hidden", "", game.open_xuwu);
		window.xuwu.style.cssText = "display: block;--w: 63px;--h: calc(var(--w) * 50/50);width: var(--w);height: var(--h);left:-80px;bottom:36px;transition:none;background-size:100% 100%";
		window.xuwu.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/xuwu.png");
		window.chatBg.appendChild(window.xuwu);
		lib.setScroll(window.xuwu);
		clickFK(window.xuwu);
		//-------------------//
		//--------菜篮子-------//
		window.cailanzi = ui.create.div("hidden", "");
		window.cailanzi.style.cssText = "display: block;--w: 100px;--h: calc(var(--w) * 59/150);width: var(--w);height: var(--h);left:-230px;bottom:250px;transition:none;background-size:100% 100%";
		window.cailanzi.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/cailanzi.png");
		window.chatBg.appendChild(window.cailanzi);
		window.shuliang = ui.create.node("div");
		window.shuliang.innerText = Math.floor(Math.random() * (999 - 100 + 1) + 100);
		window.shuliang.style.cssText = "display: block;left:-180px;bottom:260px;font-family:'shousha';color:#97856a;font-weight: 900; text-shadow:none;transition:none;background-size:100% 100%";
		window.chatBg.appendChild(window.shuliang);
		game.open_emoji = function () {
			//打开emoji函数
			if (window.dialog_lifesay) {
				if (window.dialog_lifesay.show) window.dialog_lifesay.style.left = "-" + window.dialog_lifesay.style.width;
				setTimeout(function () {
					window.dialog_lifesay.hide();
					window.dialog_lifesay.show = false;
				}, 1000);
			}
			if (window.chatBackground) {
				if (window.chatBackground.show) window.chatBackground.style.left = "100%";
				setTimeout(function () {
					window.chatBackground.hide();
					window.chatBackground.show = false;
				}, 1000);
			}
			if (window.dialog_emoji != undefined && window.dialog_emoji.show) {
				//控制面板打开，首次调用此函数时打开面板，再次调用时关闭
				window.dialog_emoji.hide();
				window.dialog_emoji.show = false;
				return;
			}
			var dialogEmoji = {};
			window.dialog_emoji = ui.create.div("hidden");
			window.dialog_emoji.style["z-index"] = 999999999;
			window.dialog_emoji.classList.add("popped");
			window.dialog_emoji.classList.add("static");
			window.dialog_emoji.show = true;
			window.dialog_emoji.style.height = "280px"; //整个选择emoji对话框的宽高
			window.dialog_emoji.style.width = "360px";
			window.dialog_emoji.style.left = "calc( 50% - 180px)";
			window.dialog_emoji.style.top = "100%"; //这里弄一个上移的动画
			window.dialog_emoji.style.transition = "all 1s";
			setTimeout(function () {
				window.dialog_emoji.style.top = "calc( 25% - 50px )"; //上移后的位置
			}, 100);
			window.dialog_emoji.style.opacity = 1;
			window.dialog_emoji.style.borderRadius = "8px";
			window.dialog_emoji.style.backgroundSize = "100% 100%";
			window.dialog_emoji.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/nobg.png"); //把背景dialog设置为透明
			window.dialog_emoji.style["box-shadow"] = "none";
			ui.window.appendChild(window.dialog_emoji);
			dialogEmoji.background = window.dialog_emoji;
			window.dialog_emojiBgPict = ui.create.div("hidden"); //这是现在外层div
			window.dialog_emojiBgPict.style.height = "100%";
			window.dialog_emojiBgPict.style.width = "100%";
			window.dialog_emojiBgPict.style.left = "0%";
			window.dialog_emojiBgPict.style.top = "0%";
			window.dialog_emojiBgPict.style.borderRadius = "8px";
			window.dialog_emojiBgPict.style.backgroundSize = "100% 100%";
			window.dialog_emojiBgPict.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/saydiv.png");
			window.dialog_emojiBgPict.style["box-shadow"] = "none";
			window.dialog_emoji.appendChild(window.dialog_emojiBgPict);
			window.dialog_emojiBgColor = ui.create.div("hidden"); //这是内层div
			window.dialog_emojiBgColor.style.height = "70%";
			window.dialog_emojiBgColor.style.width = "80%";
			window.dialog_emojiBgColor.style.left = "10%";
			window.dialog_emojiBgColor.style.top = "10%";
			window.dialog_emojiBgColor.style.borderRadius = "8px";
			window.dialog_emojiBgColor.style.backgroundSize = "100% 100%";
			window.dialog_emojiBgColor.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/nobg.png"); //把背景设置为透明
			window.dialog_emojiBgColor.style["overflow-y"] = "scroll";
			lib.setScroll(window.dialog_emojiBgColor);
			window.dialog_emoji.appendChild(window.dialog_emojiBgColor);
			for (var i = 0; i < 50; i++) {
				window["dialog_emojiContent_" + i] = ui.create.div("hidden", "", function () {
					game.me.say('<img style=width:34px height:34px src="' + lib.assetURL + "extension/十周年UI/shoushaUI/sayplay/emoji/" + this.pos + '.png">');
					window.dialog_emoji.delete();
					delete window.dialog_emoji;
					window.dialog_emoji = undefined;
				});
				window["dialog_emojiContent_" + i].style.height = "34px"; //单个表情的宽高
				window["dialog_emojiContent_" + i].style.width = "34px";
				window["dialog_emojiContent_" + i].style.left = "0px";
				window["dialog_emojiContent_" + i].style.top = "0px";
				window["dialog_emojiContent_" + i].style.position = "relative";
				window["dialog_emojiContent_" + i].pos = i;
				window["dialog_emojiContent_" + i].setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/emoji/" + i + ".png");
				window["dialog_emojiContent_" + i].style.backgroundSize = "100% 100%";
				window.dialog_emojiBgColor.appendChild(window["dialog_emojiContent_" + i]);
				clickFK(window["dialog_emojiContent_" + i]);
			}
		};
		window.chatButton2 = ui.create.div("hidden", "", game.open_emoji);
		window.chatButton2.style.cssText = "display: block;--w: 80px;--h: calc(var(--w) * 82/98);width: var(--w);height: var(--h);left:150px;bottom:25px;transition:none;background-size:100% 100%";
		/*window.chatButton2.style.height='70px';
        window.chatButton2.style.width='80px';
        window.chatButton2.style.left='150px';
        window.chatButton2.style.bottom='10px';
        window.chatButton2.style.transition='none';
        window.chatButton2.style.backgroundSize="100% 100%";*/
		window.chatButton2.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/emoji.png");
		lib.setScroll(window.chatButton2);
		window.chatBg.appendChild(window.chatButton2);
		clickFK(window.chatButton2);
		game.open_jilu = function () {
			//打开记录函数
			game.showChatWord();
		};
		window.chatButton3 = ui.create.div("hidden", "", game.open_jilu);
		window.chatButton3.style.cssText = "display: block;--w: 80px;--h: calc(var(--w) * 82/98);width: var(--w);height: var(--h);left:260px;bottom:25px;transition:none;background-size:100% 100%";
		/*window.chatButton3.style.height='70px';
        window.chatButton3.style.width='80px';
        window.chatButton3.style.left='260px';
        window.chatButton3.style.bottom='10px';
        window.chatButton3.style.transition='none';
        window.chatButton3.style.backgroundSize="100% 100%";*/
		window.chatButton3.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/jilu.png");
		lib.setScroll(window.chatButton3);
		window.chatBg.appendChild(window.chatButton3);
		clickFK(window.chatButton3);
		window.chatSendBottom = ui.create.div("", "", function () {
			//发送按钮
			if (!window.input) return;
			if (window.input.value == undefined) return;
			window.sendInfo(window.input.value);
		});
		window.chatSendBottom.style.cssText = "display: block;--w: 91px;--h: calc(var(--w) * 62/160);width: var(--w);height: var(--h);left:70%;top:33px;transition:none;background-size:100% 100%;text-align:center;border-randius:8px;";
		/*window.chatSendBottom.style.height='50px';
        window.chatSendBottom.style.width='25%';
        window.chatSendBottom.style.left='calc( 60% + 62px )';
        window.chatSendBottom.style.top='23px';
        window.chatSendBottom.style.transition='none';
        window.chatSendBottom.style['text-align']='center';
        window.chatSendBottom.style.borderRadius='8px';
        window.chatSendBottom.style.backgroundSize="100% 100%";*/
		window.chatSendBottom.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/buttonsend.png");
		window.chatSendBottom.innerHTML = '<span style="color:white;font-size:22px;line-height:32px;font-weight:400;font-family:shousha">发送</span>';
		window.chatBg.appendChild(window.chatSendBottom);
		clickFK(window.chatSendBottom);
		game.updateChatWord = function (str) {
			window.chatBackground2.innerHTML = str;
		};
		game.addChatWord();
		window.sendInfo = function (content) {
			game.me.say(content);
			window.input.value = "";
		};
		//房间
		window.chatInputOut = ui.create.div("hidden");
		window.chatInputOut.style.cssText = "display: block;--w: 265px;--h: calc(var(--w) * 50/280);width: var(--w);height: var(--h);left:30px;top:30px;transition:none;background-size:100% 100%;pointer-events:none;z-index:6;";
		/*window.chatInputOut.style.height='22px';
        window.chatInputOut.style.width='60%';
        window.chatInputOut.style.left='40px';
        window.chatInputOut.style.top='40px';
        window.chatInputOut.style.transition='none';
        window.chatInputOut.style.backgroundSize="100% 100%";*/
		window.chatInputOut.style.backgroundImage = "url('" + lib.assetURL + "extension/十周年UI/shoushaUI/sayplay/sayX.png')";
		window.chatBg.appendChild(window.chatInputOut);
		//输入框
		window.chatInput = ui.create.dialog("hidden");
		window.chatInput.style.height = "22px";
		window.chatInput.style.width = "42%"; //设置输入框宽度
		window.chatInput.style.left = "27%";
		window.chatInput.style.top = "42px";
		window.chatInput.style.transition = "none";
		window.chatBg.appendChild(window.chatInput);
		window.ipt = ui.create.div();
		window.ipt.style.height = "22px";
		window.ipt.style.width = "100%";
		window.ipt.style.top = "0px";
		window.ipt.style.left = "0px";
		window.ipt.style.margin = "0px";
		window.ipt.style.borderRadius = "0px";
		window.ipt.style["background-image"] = "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4))";
		//window.ipt.style['box-shadow']='rgba(0, 0, 0, 0.4) 0 0 0 1px, rgba(0, 0, 0, 0.2) 0 3px 10px';
		if (window.input && window.input.value) window.input_value = window.input.value;
		window.ipt.innerHTML = '<input type="text" value=' + (window.input_value || "请输入文字") + ' style="color:white;font-family:shousha;width:calc(100% - 10px);text-align:left;"></input>';
		window.input = window.ipt.querySelector("input");
		window.input.style.backgroundImage = "url('" + lib.assetURL + "extension/十周年UI/shoushaUI/sayplay/say.png')";
		window.input.style.backgroundSize = "120% 120%";
		window.input.style["box-shadow"] = "none";
		window.input.onclick = function (e) {
			e.stopPropagation();
		};
		window.input.onfocus = function () {
			if (this.value == "请输入文字") this.value = "";
		};
		window.input.onkeydown = function (e) {
			e.stopPropagation();
			if (e.keyCode == 13) {
				var value = this.value;
				if (!value) return;
				if (typeof value != "string") value = "" + value;
				window.sendInfo(value);
			}
		};
		window.chatInput.add(window.ipt);
	};
	//聊天记录栏
	game.showChatWord = function () {
		if (window.dialog_lifesay) {
			if (window.dialog_lifesay.show) window.dialog_lifesay.style.left = "-" + window.dialog_lifesay.style.width;
			setTimeout(function () {
				window.dialog_lifesay.hide();
				window.dialog_lifesay.show = false;
			}, 1000);
		}
		if (window.dialog_emoji) {
			if (window.dialog_emoji.show) window.dialog_emoji.style.top = "100%";
			setTimeout(function () {
				window.dialog_emoji.hide();
				window.dialog_emoji.show = false;
			}, 1000);
		}
		if (window.chatBackground != undefined && window.chatBackground.show) {
			//控制面板打开，首次调用此函数时打开面板，再次调用时关闭
			window.chatBackground.hide();
			window.chatBackground.show = false;
			return;
		}
		window.chatBackground = ui.create.div("hidden");
		window.chatBackground.style["z-index"] = 999999999;
		//window.chatBackground.classList.add('popped');
		window.chatBackground.classList.add("static");
		window.chatBackground.show = true;
		window.chatBackground.style.transition = "all 1s";
		window.chatBackground.style.height = "330px"; //调整对话框背景大小，位置
		window.chatBackground.style.width = "600px";
		window.chatBackground.style.top = "calc( 20% - 100px )"; //这里弄一个左移的动画
		window.chatBackground.style.left = "100%"; //这里弄一个左移的动画
		setTimeout(function () {
			window.chatBackground.style.left = "calc( 50% - 300px)"; //左移后的位置
		}, 100);
		window.chatBackground.style.bottom = "calc( " + window.chatBg.style.height + " + " + "5px )";
		window.chatBackground.style.opacity = 1;
		window.chatBackground.style.borderRadius = "10px";
		game.mouseChatDiv = function (div) {
			//查看时显示，不查看时，对话框虚化
			if (lib.device == undefined) {
				div.onmouseover = function () {
					this.style.opacity = 1.0;
				};
				div.onmouseout = function () {
					this.style.opacity = 0.25;
				};
			} else {
				div.onclick = function () {
					if (div.style.opacity == 0.25) this.style.opacity = 0.75;
					else this.style.opacity = 0.25;
				};
			}
		};
		game.mouseChatDiv(window.chatBackground);
		window.chatBackground.style.backgroundSize = "100% 100%";
		window.chatBackground.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/nobg.png"); //把背景dialog设置为透明
		window.chatBackground.style["box-shadow"] = "none";
		ui.window.appendChild(window.chatBackground);
		window.chatBackgroundPict = ui.create.div("hidden"); //外层div
		window.chatBackgroundPict.style.height = "100%";
		window.chatBackgroundPict.style.width = "100%";
		window.chatBackgroundPict.style.left = "0%";
		window.chatBackgroundPict.style.bottom = "0%";
		window.chatBackgroundPict.style.transition = "none";
		window.chatBackgroundPict.style.backgroundColor = "none";
		window.chatBackgroundPict.style.borderRadius = "8px";
		window.chatBackgroundPict.style.backgroundSize = "100% 100%";
		window.chatBackgroundPict.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/saydiv.png");
		window.chatBackgroundPict.style["box-shadow"] = "none";
		window.chatBackground.appendChild(window.chatBackgroundPict);
		window.chatBackgroundColor = ui.create.div("hidden"); //内层div
		window.chatBackgroundColor.style.height = "70%";
		window.chatBackgroundColor.style.width = "80%";
		window.chatBackgroundColor.style.left = "10%";
		window.chatBackgroundColor.style.top = "10%";
		window.chatBackgroundColor.style.transition = "none";
		window.chatBackgroundColor.style.borderRadius = "8px";
		window.chatBackgroundColor.style.backgroundSize = "100% 100%";
		window.chatBackgroundColor.setBackgroundImage("extension/十周年UI/shoushaUI/sayplay/nobg.png"); //把背景设置为透明
		window.chatBackground.appendChild(window.chatBackgroundColor);
		window.chatBackground2 = ui.create.div("hidden");
		window.chatBackground2.style.height = "100%";
		window.chatBackground2.style.width = "100%";
		window.chatBackground2.style.left = "0%";
		window.chatBackground2.style.bottom = "0%";
		window.chatBackground2.style.transition = "none";
		window.chatBackground2.style["text-align"] = "left";
		window.chatBackground2.innerHTML = "";
		window.chatBackground2.style["overflow-y"] = "scroll";
		lib.setScroll(window.chatBackground2);
		window.chatBackgroundColor.appendChild(window.chatBackground2);
		game.addChatWord();
	};
	lib.skill._wmkzSayChange = {
		trigger: {
			global: ["gameStart", "phaseBegin", "phaseAfter", "useCardAfter"],
		},
		forced: true,
		silent: true,
		filter(event, player) {
			return player.change_sayFunction != true;
		},
		content() {
			player.change_sayFunction = true;
			player.sayTextWord = player.say;
			player.say = function (str) {
				//对应上面函数，把其他player的发言记录到框里
				game.addChatWord("<font color=yellow>" + get.translation("" + player.name) + "</font><font color=white>：" + str + "</font>");
				player.sayTextWord(str);
			};
		},
	};
	//阶段提示框架（俺杀）
	//自定义播放图片
	game.as_removeText = function () {
		if (_status.as_showText) {
			_status.as_showText.remove();
			delete _status.as_showText;
		}
		if (_status.as_showImage) {
			_status.as_showImage.show();
		}
	};
	game.as_showText = function (str, pos, time, font, size, color) {
		if (!str) return false;
		if (!pos || !Array.isArray(pos)) {
			pos = [0, 0, 100, 100];
		}
		if (!time || (isNaN(time) && time !== true)) time = 3;
		if (!font) font = "shousha";
		if (!size) size = 16;
		if (!color) color = "#ffffff";
		if (_status.as_showText) {
			_status.as_showText.remove();
			delete _status.as_showText;
		}
		var div = ui.create.div("", str, ui.window);
		div.style.cssText = "z-index:-3; pointer-events:none; font-family:" + font + "; font-size:" + size + "px; color:" + color + "; line-height:" + size * 1.2 + "px; text-align:center; left:" + (pos[0] + pos[2] / 2) + "%; top:" + pos[1] + "%; width:0%; height:" + pos[3] + "%; position:absolute; transition-property:all; transition-duration:1s";
		_status.as_showText = div;
		if (_status.as_showImage) {
			_status.as_showImage.hide();
		}
		setTimeout(function () {
			div.style.left = pos[0] + "%";
			div.style.width = pos[2] + "%";
		}, 1);
		if (time === true) return true;
		setTimeout(function () {
			if (_status.as_showText) {
				_status.as_showText.remove();
				delete _status.as_showText;
			}
			if (_status.as_showImage) {
				_status.as_showImage.show();
			}
		}, time * 1000);
		return true;
	};
	game.as_removeImage = function () {
		if (_status.as_showImage) {
			var outdiv = _status.as_showImage;
			_status.as_showImage.style.animation = "left-to-right-out 1s";
			delete _status.as_showImage;
			setTimeout(function () {
				outdiv.remove();
			}, 1000);
		}
	};
	game.as_showImage = function (url, pos, time) {
		if (!url) return false;
		if (!pos || !Array.isArray(pos)) {
			pos = [0, 0, 100, 100];
		}
		if (!time || (isNaN(time) && time !== true)) time = 3;
		if (_status.as_showImage) {
			var outdiv = _status.as_showImage;
			_status.as_showImage.style.animation = "left-to-right-out 1s";
			delete _status.as_showImage;
			setTimeout(function () {
				outdiv.remove();
			}, 1000);
		}
		var div = ui.create.div("", "", ui.window);
		div.style.cssText = "z-index:-1; pointer-events:none; left:" + pos[0] + "%; top:" + pos[1] + "%; width:8%; height:" + pos[3] + "%; position:absolute; background-size:100% 100%; background-position:center center; background-image:url(" + lib.assetURL + url + "); transition-property:all; transition-duration:1s";
		_status.as_showImage = div;
		if (_status.as_showText) {
			_status.as_showImage.hide();
		}
		if (time === true) return true;
		setTimeout(function () {
			if (_status.as_showImage) {
				_status.as_showImage.remove();
				delete _status.as_showImage;
			}
		}, time * 1000);
		return true;
	};
	if (lib.config.dev) {
		window.app = app;
	}
}
