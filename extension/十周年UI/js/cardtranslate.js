// 十周年UI扩展功能 - 卡牌拖拽交换位置
// 本文件添加了卡牌左右交换移动位置的功能

(function () {
	// 创建命名空间
	window.TenYearUI = window.TenYearUI || {};

	// --- 配置与状态管理 ---
	TenYearUI.dragThreshold = 5; // 拖拽阈值 (像素)
	TenYearUI.cardMargin = 8; // 卡牌间距
	TenYearUI.isDragging = false;
	TenYearUI.sourceNode = null;
	TenYearUI.movedNode = null;
	TenYearUI.originalPointerEvents = null;
	TenYearUI.isMobileDevice = navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad|Mobile)/i);
	TenYearUI.evts = TenYearUI.isMobileDevice ? ["touchstart", "touchmove", "touchend"] : ["mousedown", "mousemove", "mouseup"];

	// --- 初始化 ---
	TenYearUI.init = function () {
		if (typeof decadeUI === "undefined") {
			console.error("十周年UI (decadeUI) 未加载，卡牌拖拽功能无法使用");
			return false;
		}
		TenYearUI.initCardDragSwap();
		return true;
	};

	// --- 辅助函数 ---

	/**
	 * 获取元素的transform值
	 * @param {HTMLElement} element
	 * @returns {{translateX: number, translateY: number, scale: number}}
	 */
	TenYearUI.getTransformValues = function (element) {
		try {
			const style = window.getComputedStyle(element);
			const matrix = new DOMMatrixReadOnly(style.transform);
			return { translateX: matrix.m41, translateY: matrix.m42, scale: matrix.m11 };
		} catch (e) {
			console.error("获取transform值失败:", e);
			return { translateX: 0, translateY: 0, scale: 1 };
		}
	};

	/**
	 * 更新手牌布局，以触发展开/折叠效果
	 */
	TenYearUI.updateHandLayout = function () {
		if (window.dui && dui.layout && typeof dui.layout.updateHand === "function") {
			dui.layout.updateHand();
		}
	};

	/**
	 * 从事件对象中获取父级卡牌元素
	 * @param {EventTarget} target
	 * @returns {HTMLElement|null}
	 */
	TenYearUI.getCardElement = function (target) {
		return target ? target.closest(".card") : null;
	};

	/**
	 * 设置卡牌的 transform 样式并缓存
	 * @param {HTMLElement} card - 卡牌元素
	 * @param {number} tx - X轴偏移
	 * @param {number} ty - Y轴偏移
	 * @param {number} scale - 缩放比例
	 */
	TenYearUI.setCardTransform = function (card, tx, ty, scale) {
		if (!card || typeof tx !== "number" || typeof ty !== "number") return;
		card.tx = tx;
		card.ty = ty;
		const transformValue = `translate(${tx}px, ${ty}px) scale(${scale})`;
		card.style.transform = transformValue;
		card._transform = transformValue; // 缓存transform值，供其他逻辑使用
	};

	// --- 核心拖拽逻辑 ---

	/**
	 * 卡牌拖拽开始
	 * @param {MouseEvent|TouchEvent} e
	 */
	TenYearUI.dragCardStart = function (e) {
		if (e.button === 2) return; // 忽略右键

		const cardElement = TenYearUI.getCardElement(e.target);
		if (!cardElement) return;

		const touch = e.touches ? e.touches[0] : e;
		const startX = touch.clientX;
		const startY = touch.clientY;

		const transformValues = TenYearUI.getTransformValues(cardElement);

		TenYearUI.sourceNode = cardElement;
		Object.assign(cardElement, {
			startX: startX,
			startY: startY,
			initialTranslateX: transformValues.translateX,
			initialTranslateY: transformValues.translateY,
			scale: transformValues.scale,
		});

		TenYearUI.isDragging = false;
		TenYearUI.originalPointerEvents = getComputedStyle(cardElement).pointerEvents;

		document.addEventListener(TenYearUI.evts[1], TenYearUI.dragCardMove, { passive: false });
		document.addEventListener(TenYearUI.evts[2], TenYearUI.dragCardEnd, { passive: false });
	};

	/**
	 * 卡牌拖动过程
	 * @param {MouseEvent|TouchEvent} e
	 */
	TenYearUI.dragCardMove = function (e) {
		const sourceCard = TenYearUI.sourceNode;
		if (!sourceCard) return;

		const touch = e.touches ? e.touches[0] : e;
		const currentX = touch.clientX;
		const currentY = touch.clientY;

		const dx = currentX - sourceCard.startX;
		const dy = currentY - sourceCard.startY;

		if (!TenYearUI.isDragging) {
			const distance = Math.sqrt(dx * dx + dy * dy);
			if (distance > TenYearUI.dragThreshold) {
				TenYearUI.isDragging = true;
				e.preventDefault();
				e.stopPropagation();

				Object.assign(sourceCard.style, {
					pointerEvents: "none",
					transition: "none",
					opacity: "0.5",
					zIndex: "99",
				});
			}
		}

		if (TenYearUI.isDragging) {
			const zoomFactor = (window.game && game.documentZoom) || 1;
			const newTranslateX = sourceCard.initialTranslateX + dx / zoomFactor;
			// 保持Y轴位置不变，仅水平拖动
			sourceCard.style.transform = `translate(${newTranslateX}px, ${sourceCard.initialTranslateY}px) scale(${sourceCard.scale})`;

			const pointElement = document.elementFromPoint(touch.pageX, touch.pageY);
			const targetCard = TenYearUI.getCardElement(pointElement);

			if (targetCard && targetCard !== sourceCard && targetCard.parentNode === ui.handcards1 && TenYearUI.movedNode !== targetCard) {
				TenYearUI.movedNode = targetCard;
				TenYearUI.swapCardPosition(sourceCard, targetCard);
			}
		}
	};

	/**
	 * 交换两张卡牌的位置
	 * @param {HTMLElement} sourceCard - 被拖拽的卡牌
	 * @param {HTMLElement} targetCard - 目标位置的卡牌
	 */
	TenYearUI.swapCardPosition = function (sourceCard, targetCard) {
		const handContainer = ui.handcards1;
		const children = Array.from(handContainer.childNodes);
		const sourceIndex = children.indexOf(sourceCard);
		const targetIndex = children.indexOf(targetCard);

		if (sourceIndex === -1 || targetIndex === -1) return;

		const cardScale = (window.dui && dui.boundsCaches && dui.boundsCaches.hand && dui.boundsCaches.hand.cardScale) || 1;
		const isMovingLeft = sourceIndex > targetIndex;

		// 在DOM中移动节点
		handContainer.insertBefore(sourceCard, isMovingLeft ? targetCard : targetCard.nextSibling);

		// 更新卡牌的逻辑位置 (tx, ty) 和样式
		const sourceTx = sourceCard.tx;
		TenYearUI.setCardTransform(sourceCard, targetCard.tx, sourceCard.initialTranslateY, cardScale);
		TenYearUI.setCardTransform(targetCard, sourceTx, targetCard.ty, cardScale);

		// 更新中间卡牌的位置
		const start = isMovingLeft ? targetIndex + 1 : sourceIndex;
		const end = isMovingLeft ? sourceIndex : targetIndex - 1;
		const updatedChildren = Array.from(handContainer.childNodes);

		for (let i = start; i <= end; i++) {
			const card = updatedChildren[i];
			if (card && card !== sourceCard && typeof card.tx !== "undefined") {
				// 找到它在原始数组中的位置以获取正确的相邻卡牌
				const originalIdx = children.indexOf(card);
				const neighborIdx = isMovingLeft ? originalIdx - 1 : originalIdx + 1;
				const neighborCard = children[neighborIdx];
				if (neighborCard) {
					TenYearUI.setCardTransform(card, neighborCard.tx, card.ty, cardScale);
				}
			}
		}

		console.log("交换位置:", sourceIndex, "=>", targetIndex);
		TenYearUI.updateHandLayout();
	};

	/**
	 * 卡牌拖动结束
	 * @param {MouseEvent|TouchEvent} e
	 */
	TenYearUI.dragCardEnd = function (e) {
		const sourceCard = TenYearUI.sourceNode;
		if (!sourceCard) return;

		if (TenYearUI.isDragging) {
			e.preventDefault();
			e.stopPropagation();

			// 如果没有移动到新的位置，则恢复原始位置
			if (!TenYearUI.movedNode) {
				sourceCard.style.transform = `translate(${sourceCard.initialTranslateX}px, ${sourceCard.initialTranslateY}px) scale(${sourceCard.scale})`;
			}
		}

		// 清理状态和样式
		Object.assign(sourceCard.style, {
			transition: "",
			pointerEvents: TenYearUI.originalPointerEvents || "",
			opacity: "1",
			zIndex: "",
		});

		document.removeEventListener(TenYearUI.evts[1], TenYearUI.dragCardMove);
		document.removeEventListener(TenYearUI.evts[2], TenYearUI.dragCardEnd);

		TenYearUI.sourceNode = null;
		TenYearUI.movedNode = null;
		TenYearUI.isDragging = false;

		// 拖拽结束后更新手牌布局
		TenYearUI.updateHandLayout();
	};

	/**
	 * 确保所有卡牌都具有初始的 tx 和 ty 位置属性
	 */
	TenYearUI.ensureCardPositions = function () {
		if (!ui || !ui.handcards1) return;
		ui.handcards1.querySelectorAll(".card").forEach(card => {
			if (typeof card.tx === "undefined" || typeof card.ty === "undefined") {
				const { translateX, translateY } = TenYearUI.getTransformValues(card);
				card.tx = translateX;
				card.ty = translateY;
			}
		});
	};

	/**
	 * 初始化卡牌拖拽交换功能
	 */
	TenYearUI.initCardDragSwap = function () {
		if (!ui || !ui.handcards1) {
			console.error("ui.handcards1不存在，1秒后重试");
			setTimeout(TenYearUI.initCardDragSwap, 1000);
			return;
		}

		// 为手牌区容器添加事件监听器 (事件委托)
		const handContainer = ui.handcards1;
		handContainer.removeEventListener(TenYearUI.evts[0], TenYearUI.dragCardStart);
		handContainer.addEventListener(TenYearUI.evts[0], TenYearUI.dragCardStart, { passive: false });

		TenYearUI.ensureCardPositions();
		console.log("卡牌拖拽交换位置功能已初始化（仅限水平移动）");
	};

	// --- 启动与集成 ---

	function onReady() {
		// 延迟执行，确保游戏UI和其他脚本已完全加载
		setTimeout(TenYearUI.init, 1000);
	}

	if (document.readyState === "complete") {
		onReady();
	} else {
		window.addEventListener("load", onReady);
	}

	// 如果十周年UI存在，则集成到其初始化流程中
	if (typeof decadeUI !== "undefined" && decadeUI.init) {
		const originalInit = decadeUI.init;
		decadeUI.init = function (...args) {
			const result = originalInit.apply(this, args);
			onReady(); // 在十周年UI初始化后再次确保我们的功能被初始化
			return result;
		};
	}

	// 提供全局接口，便于其他模块调用
	window.initCardDragSwap = TenYearUI.initCardDragSwap;

	console.log("十周年UI卡牌拖拽交换位置功能模块已加载");
})();
