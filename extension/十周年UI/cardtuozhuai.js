// 十周年UI扩展功能 - 卡牌拖拽交换位置
// 本文件添加了卡牌左右交换移动位置的功能

(function () {
	// 创建命名空间
	window.TenYearUI = window.TenYearUI || {};

	// 初始化公共功能
	TenYearUI.init = function () {
		// 确保decadeUI存在
		if (typeof decadeUI === "undefined") {
			console.error("十周年UI (decadeUI) 未加载，卡牌拖拽功能无法使用");
			return false;
		}

		// 初始化卡牌拖拽功能
		TenYearUI.initCardDragSwap();
		return true;
	};

	// 卡牌拖拽交换位置功能

	// 检测是否为移动设备
	TenYearUI.isMobile = function () {
		return navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad|Mobile)/i);
	};

	// 根据设备类型设置事件类型
	TenYearUI.evts = TenYearUI.isMobile() ? ["touchstart", "touchmove", "touchend"] : ["mousedown", "mousemove", "mouseup"];

	// 设置卡牌间距
	TenYearUI.cardMargin = 8;

	// 获取元素的transform值
	TenYearUI.getTransformValues = function (element) {
		try {
			const style = window.getComputedStyle(element);
			const matrix = new DOMMatrixReadOnly(style.transform);
			return {
				translateX: matrix.m41,
				translateY: matrix.m42,
				scale: matrix.m11,
			};
		} catch (e) {
			console.error("获取transform值失败:", e);
			return { translateX: 0, translateY: 0, scale: 1 };
		}
	};

	// 判断是否为相邻索引
	TenYearUI.isSimple = function (sourceIndex, targetIndex) {
		return Math.abs(sourceIndex - targetIndex) === 1;
	};

	// 卡牌拖动开始
	TenYearUI.dragCardStart = function (e) {
		// 如果已经启用了游戏原生拖拽，则不使用我们的拖拽
		if (typeof lib !== "undefined" && lib && lib.config && lib.config.enable_drag) return;
		if (TenYearUI.sourceNode) return;

		// 确保目标是卡牌
		let target = e.target;
		while (target && !target.classList.contains("card")) {
			target = target.parentNode;
			if (!target || target === document.body) return;
		}

		if (target && target.classList.contains("card")) {
			e.preventDefault(); // 阻止默认行为
			TenYearUI.sourceNode = target;

			let transformValues = TenYearUI.getTransformValues(TenYearUI.sourceNode);
			TenYearUI.sourceNode.initialTranslateX = transformValues.translateX;
			TenYearUI.sourceNode.initialTranslateY = transformValues.translateY;
			TenYearUI.sourceNode.scale = transformValues.scale;

			TenYearUI.sourceNode.startX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
			TenYearUI.sourceNode.startY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
			TenYearUI.sourceNode.originalTransform = TenYearUI.sourceNode.style.transform;
			TenYearUI.originalPointerEvents = TenYearUI.sourceNode.style.pointerEvents;
			TenYearUI.sourceNode.style.zIndex = 2;

			// 保存初始tx和ty值
			if (typeof TenYearUI.sourceNode.tx === "undefined") {
				TenYearUI.sourceNode.tx = TenYearUI.sourceNode.initialTranslateX;
			}
			if (typeof TenYearUI.sourceNode.ty === "undefined") {
				TenYearUI.sourceNode.ty = TenYearUI.sourceNode.initialTranslateY;
			}

			document.addEventListener(TenYearUI.evts[1], TenYearUI.dragCardMove, { passive: false });
			document.addEventListener(TenYearUI.evts[2], TenYearUI.dragCardEnd);
			console.log("开始拖拽卡牌", TenYearUI.sourceNode);
		}
	};

	// 卡牌拖动过程
	TenYearUI.dragCardMove = function (e) {
		if (TenYearUI.sourceNode) {
			e.preventDefault(); // 阻止默认行为

			TenYearUI.sourceNode.style.pointerEvents = "none";
			TenYearUI.sourceNode.style.transition = "none";
			TenYearUI.sourceNode.style.opacity = 0.5;

			// 获取移动的距离
			let dx = (e.clientX ? e.clientX : e.touches && e.touches[0] ? e.touches[0].clientX : 0) - TenYearUI.sourceNode.startX;
			let dy = (e.clientY ? e.clientY : e.touches && e.touches[0] ? e.touches[0].clientY : 0) - TenYearUI.sourceNode.startY;

			// 应用缩放系数
			let zoomFactor = typeof game !== "undefined" && game.documentZoom ? game.documentZoom : 1;
			let newTranslateX = TenYearUI.sourceNode.initialTranslateX + dx / zoomFactor;
			let newTranslateY = TenYearUI.sourceNode.initialTranslateY + dy / zoomFactor;

			TenYearUI.sourceNode.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px) scale(${TenYearUI.sourceNode.scale})`;

			// 获取当前指向的元素
			const x = e.pageX ? e.pageX : e.touches && e.touches[0] ? e.touches[0].pageX : 0;
			const y = e.pageY ? e.pageY : e.touches && e.touches[0] ? e.touches[0].pageY : 0;
			const currentElement = document.elementFromPoint(x, y);

			// 确保ui.handcards1存在
			if (!ui || !ui.handcards1) {
				console.error("ui.handcards1不存在");
				return;
			}

			if (currentElement && currentElement !== ui.handcards1 && ui.handcards1.contains(currentElement)) {
				// 确保当前元素是卡牌
				let targetCard = currentElement;
				while (targetCard && !targetCard.classList.contains("card")) {
					targetCard = targetCard.parentNode;
					if (!targetCard || targetCard === document.body || targetCard === ui.handcards1) return;
				}

				if (!targetCard || targetCard === TenYearUI.sourceNode) return;

				if (TenYearUI.movedNode && TenYearUI.movedNode === targetCard) return;
				TenYearUI.movedNode = targetCard;

				const children = [...ui.handcards1.children];
				const sourceIndex = children.indexOf(TenYearUI.sourceNode);
				const targetIndex = children.indexOf(targetCard);

				// 获取卡牌缩放比例
				let cardScale = 1;
				if (typeof dui !== "undefined" && dui.boundsCaches && dui.boundsCaches.hand) {
					cardScale = dui.boundsCaches.hand.cardScale;
				}

				if (sourceIndex > targetIndex) {
					// 向左移动
					ui.handcards1.insertBefore(TenYearUI.sourceNode, targetCard);
					if (TenYearUI.isSimple(sourceIndex, targetIndex)) {
						// 简单交换位置（相邻卡牌）
						let currentElementX = targetCard.tx;
						targetCard.tx = TenYearUI.sourceNode.tx;
						targetCard.style.transform = "translate(" + targetCard.tx + "px," + targetCard.ty + "px) scale(" + cardScale + ")";
						targetCard._transform = targetCard.style.transform;
						TenYearUI.sourceNode.tx = currentElementX;
						TenYearUI.sourceNode._transform = "translate(" + TenYearUI.sourceNode.tx + "px," + TenYearUI.sourceNode.ty + "px) scale(" + cardScale + ")";
					} else {
						// 多张卡牌位置调整
						let startIndex = targetIndex;
						let endIndex = sourceIndex - 1;
						let targetX = targetCard.tx;
						for (let i = startIndex; i <= endIndex; i++) {
							let card = children[i];
							if (!card || typeof card.tx === "undefined") continue;
							card.tx += TenYearUI.cardMargin;
							card.style.transform = "translate(" + card.tx + "px," + card.ty + "px) scale(" + cardScale + ")";
							card._transform = card.style.transform;
						}
						TenYearUI.sourceNode.tx = targetX;
						TenYearUI.sourceNode._transform = "translate(" + TenYearUI.sourceNode.tx + "px," + TenYearUI.sourceNode.ty + "px) scale(" + cardScale + ")";
					}
				} else if (sourceIndex < targetIndex) {
					// 向右移动
					ui.handcards1.insertBefore(TenYearUI.sourceNode, targetCard.nextSibling);
					if (TenYearUI.isSimple(sourceIndex, targetIndex)) {
						// 简单交换位置（相邻卡牌）
						let tx = targetCard.tx;
						targetCard.tx = TenYearUI.sourceNode.tx;
						targetCard.style.transform = "translate(" + targetCard.tx + "px," + targetCard.ty + "px) scale(" + cardScale + ")";
						targetCard._transform = targetCard.style.transform;
						TenYearUI.sourceNode.tx = tx;
						TenYearUI.sourceNode._transform = "translate(" + TenYearUI.sourceNode.tx + "px," + TenYearUI.sourceNode.ty + "px) scale(" + cardScale + ")";
					} else {
						// 多张卡牌位置调整
						let startIndex = sourceIndex + 1;
						let endIndex = targetIndex;
						let targetX = targetCard.tx;
						for (let i = startIndex; i <= endIndex; i++) {
							let card = children[i];
							if (!card || card === TenYearUI.sourceNode || typeof card.tx === "undefined") continue;
							card.tx -= TenYearUI.cardMargin;
							card.style.transform = "translate(" + card.tx + "px," + card.ty + "px) scale(" + cardScale + ")";
							card._transform = card.style.transform;
						}
						TenYearUI.sourceNode.tx = targetX;
						TenYearUI.sourceNode._transform = "translate(" + TenYearUI.sourceNode.tx + "px," + TenYearUI.sourceNode.ty + "px) scale(" + cardScale + ")";
					}
				}

				console.log("交换位置:", sourceIndex, "=>", targetIndex);
			}
		}
	};

	// 卡牌拖动结束
	TenYearUI.dragCardEnd = function (e) {
		if (!TenYearUI.sourceNode) return;

		function clear() {
			if (!TenYearUI.sourceNode) return;
			TenYearUI.sourceNode.style.transition = null;
			TenYearUI.sourceNode.style.pointerEvents = TenYearUI.originalPointerEvents;
			TenYearUI.sourceNode.style.opacity = 1;
			TenYearUI.sourceNode.style.zIndex = null;
		}

		if (TenYearUI.movedNode) {
			// 获取卡牌缩放比例
			let cardScale = 1;
			if (typeof dui !== "undefined" && dui.boundsCaches && dui.boundsCaches.hand) {
				cardScale = dui.boundsCaches.hand.cardScale;
			}

			TenYearUI.sourceNode.style.transform = "translate(" + TenYearUI.sourceNode.tx + "px," + TenYearUI.sourceNode.initialTranslateY + "px) scale(" + cardScale + ")";
			clear();
			TenYearUI.movedNode = null;
		} else if (TenYearUI.sourceNode) {
			let t = TenYearUI.sourceNode.style.transform;
			const regex = new RegExp(`translateY\\(([^)]+)\\)`);
			let match = t.match(regex);
			if (match) {
				TenYearUI.sourceNode.style.transform = t.replace(regex, `translateY(${match[1]})`);
			} else {
				// 获取卡牌缩放比例
				let cardScale = 1;
				if (typeof dui !== "undefined" && dui.boundsCaches && dui.boundsCaches.hand) {
					cardScale = dui.boundsCaches.hand.cardScale;
				}

				if (typeof TenYearUI.sourceNode.tx !== "undefined") {
					TenYearUI.sourceNode.style.transform = "translate(" + TenYearUI.sourceNode.tx + "px," + TenYearUI.sourceNode.initialTranslateY + "px) scale(" + cardScale + ")";
				}
			}
			clear();
		}

		document.removeEventListener(TenYearUI.evts[1], TenYearUI.dragCardMove);
		document.removeEventListener(TenYearUI.evts[2], TenYearUI.dragCardEnd);

		TenYearUI.sourceNode = null;
		console.log("拖拽结束");
	};

	// 确保卡牌元素有tx和ty属性
	TenYearUI.ensureCardPositions = function () {
		if (!ui || !ui.handcards1) return;

		const cards = ui.handcards1.querySelectorAll(".card");
		cards.forEach((card, index) => {
			if (typeof card.tx === "undefined" || typeof card.ty === "undefined") {
				let transformValues = TenYearUI.getTransformValues(card);
				card.tx = transformValues.translateX;
				card.ty = transformValues.translateY;
			}
		});
	};

	// 初始化卡牌拖拽功能
	TenYearUI.initCardDragSwap = function () {
		// 重置状态变量
		TenYearUI.sourceNode = null;
		TenYearUI.movedNode = null;
		TenYearUI.originalPointerEvents = null;

		// 确保ui.handcards1存在
		if (!ui || !ui.handcards1) {
			console.error("ui.handcards1不存在，延迟初始化");
			setTimeout(TenYearUI.initCardDragSwap, 1000);
			return;
		}

		// 移除可能已存在的事件监听器，防止重复绑定
		ui.handcards1.removeEventListener(TenYearUI.evts[0], TenYearUI.dragCardStart);

		// 确保卡牌有正确的位置属性
		TenYearUI.ensureCardPositions();

		// 为手牌区添加事件监听器
		ui.handcards1.addEventListener(TenYearUI.evts[0], TenYearUI.dragCardStart, { passive: false });

		// 周期性检查和更新卡牌位置
		if (TenYearUI.positionInterval) {
			clearInterval(TenYearUI.positionInterval);
		}
		TenYearUI.positionInterval = setInterval(TenYearUI.ensureCardPositions, 2000);

		console.log("卡牌拖拽交换位置功能已初始化");
	};

	// 游戏加载完成后初始化功能
	if (document.readyState === "complete") {
		// 延迟执行，确保游戏UI已加载
		setTimeout(TenYearUI.init, 1000);
	} else {
		window.addEventListener("load", function () {
			// 延迟执行，确保游戏UI已加载
			setTimeout(TenYearUI.init, 1000);
		});
	}

	// 如果十周年UI加载了，我们需要集成到它的生命周期中
	if (typeof decadeUI !== "undefined") {
		const originalInit = decadeUI.init;
		decadeUI.init = function () {
			const result = originalInit.apply(this, arguments);
			// 初始化卡牌拖拽功能
			setTimeout(TenYearUI.init, 1000);
			return result;
		};
	}

	// 提供接口便于其他模块调用
	window.initCardDragSwap = TenYearUI.initCardDragSwap;

	console.log("十周年UI卡牌拖拽交换位置功能模块已加载");
})();
