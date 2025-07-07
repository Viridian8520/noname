"use strict";
decadeModule.import(function (lib, game, ui, get, ai, _status) {
	decadeUI.content = {
		chooseGuanXing(player, cards1, movable1, cards2, movable2, infohide) {
			if (!player || get.itemtype(player) !== "player") {
				console.error("Invalid player parameter");
				return;
			}
			if (!cards1 && !cards2) {
				console.error("No cards provided");
				return;
			}
			const guanXing = decadeUI.dialog.create("confirm-box guan-xing");
			const originalLongpressInfo = lib.config.longpress_info;
			const playButtonAudio = () => {
				game.playAudio("../extension/十周年UI/audio/gxbtn");
			};
			const createHideButton = () => {
				const hideBtn = ui.create.div(".closeDialog", document.body, () => {
					playButtonAudio();
					const isActive = guanXing.classList.contains("active");

					if (isActive) {
						guanXing.classList.remove("active");
						guanXing.style.transform = "scale(1)";
						hideBtn.style.backgroundImage = `url("${lib.assetURL}extension/十周年UI/assets/image/yincangck.png")`;
					} else {
						guanXing.classList.add("active");
						guanXing.style.transform = "scale(0)";
						hideBtn.style.backgroundImage = `url("${lib.assetURL}extension/十周年UI/assets/image/xianshick.png")`;
					}
				});
				hideBtn.style.cssText = `
					background-image: url("${lib.assetURL}extension/十周年UI/assets/image/yincangck.png");
					background-size: 100% 100%;
					height: 4%;
					width: 7%;
					z-index: 114514;
					left: 10%;
					right: auto;
					top: 75%;
				`;

				return hideBtn;
			};

			const hideBtn = createHideButton();
			const cleanupCard = card => {
				card.removeEventListener("click", guanXing._click);
				card.classList.remove("infohidden", "infoflip");
				card.style.cssText = card.rawCssText;
				delete card.rawCssText;
			};
			const cleanupDragStyles = () => {
				document.querySelectorAll(".card.drag-over").forEach(card => {
					card.classList.remove("drag-over");
				});
			};

			const properties = {
				caption: undefined,
				tip: undefined,
				header1: undefined,
				header2: undefined,
				cards: [[], []],
				movables: [movable1 || 0, movable2 || 0],
				selected: undefined,
				callback: undefined,
				infohide: undefined,
				confirmed: undefined,
				doubleSwitch: undefined,
				orderCardsList: [[], []],
				finishing: undefined,
				finished: undefined,
				originalLongpressInfo,
				draggedCard: null,
				finishTime(time) {
					if (this.finishing || this.finished) return;
					if (typeof time !== "number") throw time;

					this.finishing = true;
					setTimeout(() => {
						this.finishing = false;
						this.finish();
					}, time);
				},
				finish() {
					if (this.finishing || this.finished) return;
					this.finishing = true;

					if (this.callback) {
						this.confirmed = this.callback.call(this);
					}
					if (hideBtn?.parentNode) {
						document.body.removeChild(hideBtn);
					}

					lib.config.longpress_info = this.originalLongpressInfo;

					[0, 1].forEach(arrayIndex => {
						let cards = this.cards[arrayIndex];
						if (arrayIndex === 0) cards.reverse();
						cards.forEach(card => {
							cleanupCard(card);
							if (!this.callback) {
								if (arrayIndex === 0) {
									ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
								} else {
									ui.cardPile.appendChild(card);
								}
							}
						});
					});
					game.updateRoundNumber();
					_status.event.cards1 = this.cards[0];
					_status.event.cards2 = this.cards[1];
					_status.event.num1 = this.cards[0].length;
					_status.event.num2 = this.cards[1].length;
					if (_status.event.result) {
						_status.event.result.bool = this.confirmed === true;
					} else {
						_status.event.result = { bool: this.confirmed === true };
					}
					game.broadcastAll(() => {
						if (!window.decadeUI && decadeUI.eventDialog) return;
						decadeUI.eventDialog.close();
						decadeUI.eventDialog.finished = true;
						decadeUI.eventDialog.finishing = false;
						decadeUI.eventDialog = undefined;
					});
					decadeUI.game.resume();
				},
				update() {
					[0, 1].forEach(arrayIndex => {
						const cards = this.cards[arrayIndex];
						if (this.orderCardsList[arrayIndex].length) {
							cards.sort((a, b) => {
								const aIndex = this.orderCardsList[arrayIndex].indexOf(a);
								const bIndex = this.orderCardsList[arrayIndex].indexOf(b);
								const fallbackIndex = this.orderCardsList[arrayIndex].length;

								return (aIndex >= 0 ? aIndex : fallbackIndex) - (bIndex >= 0 ? bIndex : fallbackIndex);
							});
						}
						const y = `calc(${arrayIndex * 100}% + ${arrayIndex * 10}px)`;
						cards.forEach((card, cardIndex) => {
							const x = `calc(${cardIndex * 100}% + ${cardIndex * 10}px)`;
							card.style.cssText += `;transform:translate(${x}, ${y}); z-index:${arrayIndex * 10 + cardIndex + 1};`;
						});
					});
				},

				swap(source, target) {
					game.broadcast(
						(source, target) => {
							if (!window.decadeUI && decadeUI.eventDialog) return;
							decadeUI.eventDialog.swap(source, target);
						},
						source,
						target
					);
					const sourceIndex0 = this.cardToIndex(source, 0);
					const targetIndex1 = this.cardToIndex(target, 1);
					const sourceIndex1 = this.cardToIndex(source, 1);
					const targetIndex0 = this.cardToIndex(target, 0);

					if (sourceIndex0 >= 0 && targetIndex1 >= 0) {
						[this.cards[0][sourceIndex0], this.cards[1][targetIndex1]] = [target, source];
					} else if (sourceIndex1 >= 0 && targetIndex0 >= 0) {
						[this.cards[1][sourceIndex1], this.cards[0][targetIndex0]] = [target, source];
					} else if (sourceIndex0 >= 0) {
						const targetIndex = this.cardToIndex(target, 0);
						if (targetIndex < 0) {
							console.error("card not found");
							return;
						}
						[this.cards[0][sourceIndex0], this.cards[0][targetIndex]] = [target, source];
					} else if (sourceIndex1 >= 0) {
						const targetIndex = this.cardToIndex(target, 1);
						if (targetIndex < 0) {
							console.error("card not found");
							return;
						}
						[this.cards[1][sourceIndex1], this.cards[1][targetIndex]] = [target, source];
					}
					this.update();
					this.onMoved();
				},

				switch(card) {
					game.broadcast(card => {
						if (!window.decadeUI && decadeUI.eventDialog) return;
						decadeUI.eventDialog.switch(card);
					}, card);
					const index0 = this.cardToIndex(card, 0);
					if (index0 >= 0) {
						if (this.cards[1].length >= this.movables[1]) return;

						const movedCard = this.cards[0][index0];
						this.cards[0].remove(movedCard);
						this.cards[1].push(movedCard);
					} else {
						const index1 = this.cardToIndex(card, 1);
						if (index1 < 0) {
							console.error("card not found");
							return;
						}
						if (this.cards[0].length >= this.movables[0]) return;
						const movedCard = this.cards[1][index1];
						this.cards[1].remove(movedCard);
						this.cards[0].push(movedCard);
					}
					this.update();
					this.onMoved();
				},

				move(card, indexTo, moveDown) {
					const dim = moveDown ? 1 : 0;
					let index = this.cardToIndex(card, dim);
					indexTo = Math.max(indexTo, 0);
					if (index < 0) {
						const dim2 = dim === 1 ? 0 : 1;
						index = this.cardToIndex(card, dim2);
						if (index < 0) {
							console.error("card not found");
							return;
						}
						if (this.cards[dim].length >= this.movables[dim]) return;
						this.cards[dim2].splice(index, 1);
						this.cards[dim].splice(indexTo, 0, card);
					} else {
						this.cards[dim].splice(index, 1);
						this.cards[dim].splice(indexTo, 0, card);
					}
					this.onMoved();
					this.update();
				},
				cardToIndex(card, cardArrayIndex) {
					if (!card?.cardid) return -1;

					const id = card.cardid;
					const cards = this.cards[cardArrayIndex ?? 0];
					return cards.findIndex(c => c.cardid === id);
				},
				lockCardsOrder(isBottom) {
					const arrayIndex = isBottom ? 1 : 0;
					const cards = this.cards[arrayIndex];
					this.orderCardsList[arrayIndex] = [...cards];
				},
				unlockCardsOrder(isBottom) {
					this.orderCardsList[isBottom ? 1 : 0] = [];
				},
				getCardArrayIndex(card) {
					if (this.cards[0].includes(card)) return 0;
					if (this.cards[1].includes(card)) return 1;
					return -1;
				},
				onMoved() {
					if (typeof this.callback === "function") {
						const ok = this.callback.call(this);
						if (!ok) {
							this.classList.add("ok-disable");
							return;
						}
					}
					this.classList.remove("ok-disable");
				},
				_click(e) {
					if (this.finishing || this.finished) return;

					switch (this.objectType) {
						case "content":
							guanXing.selected = null;
							break;
						case "card":
							guanXing.switch(this);
							guanXing.selected = null;
							break;
						case "button ok":
							if (guanXing.classList.contains("ok-disable")) return;
							guanXing.confirmed = true;
							guanXing.finish();
							break;
						default:
							guanXing.classList.remove("selecting");
							guanXing.selected = null;
							break;
					}
					e.stopPropagation();
				},

				_dragStart(e) {
					if (this.finishing || this.finished || game.me !== player) return;

					this.draggedCard = e.target;
					this.draggedCard.classList.add("dragging");
					e.dataTransfer.effectAllowed = "move";
					e.dataTransfer.setData("text/plain", e.target.cardid);
				},

				_dragOver(e) {
					e.preventDefault();
					e.dataTransfer.dropEffect = "move";
				},

				_dragEnter(e) {
					e.preventDefault();
					if (e.target.classList.contains("card")) {
						e.target.classList.add("drag-over");
					}
				},

				_dragLeave(e) {
					if (e.target.classList.contains("card")) {
						e.target.classList.remove("drag-over");
					}
				},

				_drop(e) {
					e.preventDefault();
					if (this.finishing || this.finished || game.me !== player) return;
					const draggedCard = this.draggedCard;
					const targetCard = e.target;
					if (!draggedCard) return;
					if (targetCard?.classList.contains("card") && draggedCard !== targetCard) {
						this.swap(draggedCard, targetCard);
					} else {
						const fromIndex = this.getCardArrayIndex(draggedCard);
						const toIndex = fromIndex === 0 ? 1 : 0;

						if (this.cards[toIndex].length < this.movables[toIndex]) {
							this.cards[fromIndex].remove(draggedCard);
							this.cards[toIndex].push(draggedCard);
							this.update();
							this.onMoved();
						}
					}
					draggedCard.classList.remove("dragging");
					if (targetCard?.classList.contains("card")) {
						targetCard.classList.remove("drag-over");
					}
					this.draggedCard = null;
				},

				_dragEnd(e) {
					if (this.draggedCard) {
						this.draggedCard.classList.remove("dragging");
					}
					cleanupDragStyles();
					this.draggedCard = null;
				},

				_selected: undefined,
				_caption: decadeUI.dialog.create("caption", guanXing),
				_content: decadeUI.dialog.create("content buttons", guanXing),
				_tip: decadeUI.dialog.create("tip", guanXing),
				_header1: undefined,
				_header2: undefined,
				_infohide: undefined,
				_callback: undefined,
			};

			Object.assign(guanXing, properties);
			Object.defineProperties(guanXing, {
				selected: {
					configurable: true,
					get() {
						return this._selected;
					},
					set(value) {
						if (this._selected === value) return;
						if (this._selected) this._selected.classList.remove("selected");

						this._selected = value;
						if (value) {
							value.classList.add("selected");
							this.classList.add("selecting");
						} else {
							this.classList.remove("selecting");
						}
					},
				},
				caption: {
					configurable: true,
					get() {
						return this._caption.innerHTML;
					},
					set(value) {
						if (this._caption.innerHTML === value) return;
						this._caption.innerHTML = value;
					},
				},
				tip: {
					configurable: true,
					get() {
						return this._tip.innerHTML;
					},
					set(value) {
						if (this._tip.innerHTML === value) return;
						this._tip.innerHTML = value;
					},
				},
				header1: {
					configurable: true,
					get() {
						return this._header1?.innerHTML || "";
					},
					set(value) {
						if (!this._header1 || this._header1.innerHTML === value) return;
						this._header1.innerHTML = value;
					},
				},
				header2: {
					configurable: true,
					get() {
						return this._header2?.innerHTML || "";
					},
					set(value) {
						if (!this._header2 || this._header2.innerHTML === value) return;
						this._header2.innerHTML = value;
					},
				},
				infohide: {
					configurable: true,
					get() {
						return this._infohide;
					},
					set(value) {
						if (this._infohide === value) return;
						this._infohide = value;

						this.cards.forEach(cardArray => {
							cardArray.forEach(card => {
								if (value) {
									card.classList.add("infohidden", "infoflip");
									card.style.backgroundImage = "";
								} else {
									card.classList.remove("infohidden", "infoflip");
									card.style.cssText = card.rawCssText;
								}
							});
						});
					},
				},
				callback: {
					configurable: true,
					get() {
						return this._callback;
					},
					set(value) {
						if (this._callback === value) return;
						this._callback = value;
						this.onMoved();
					},
				},
			});

			// 设置事件监听器
			const content = guanXing._content;
			guanXing.addEventListener("click", guanXing._click, false);
			if (game.me === player) {
				content.objectType = "content";
				content.addEventListener("click", guanXing._click, false);
				const button = decadeUI.dialog.create("button ok", guanXing);
				button.innerHTML = "确认";
				button.objectType = "button ok";
				button.addEventListener("click", guanXing._click, false);
			} else {
				guanXing.addEventListener("remove", () => {
					if (hideBtn?.parentNode) {
						document.body.removeChild(hideBtn);
					}
					lib.config.longpress_info = originalLongpressInfo;
				});
			}

			// 初始化卡牌
			const size = decadeUI.getHandCardSize();
			let height = 0;
			if (cards1) {
				guanXing.cards[0] = cards1;
				guanXing.movables[0] = Math.max(cards1.length, guanXing.movables[0]);
			}
			if (cards2) {
				guanXing.cards[1] = cards2;
				guanXing.movables[1] = Math.max(cards2.length, guanXing.movables[1]);
			}
			if (guanXing.movables[0] > 0) {
				height = size.height;
				guanXing._header1 = decadeUI.dialog.create("header", content);
				guanXing._header1.style.top = "0";
				guanXing._header1.innerHTML = "牌堆顶";
			}
			if (guanXing.movables[1] > 0) {
				height += height + (height > 0 ? 10 : 0);
				guanXing._header2 = decadeUI.dialog.create("header", content);
				guanXing._header2.style.bottom = "0";
				guanXing._header2.innerHTML = "牌堆底";
			}
			content.style.height = `${height}px`;
			guanXing.cards.forEach((cardArray, arrayIndex) => {
				cardArray.forEach(card => {
					if (game.me === player) {
						card.objectType = "card";
						card.removeEventListener("click", ui.click.intro);
						card.addEventListener("click", guanXing._click, false);
						// 拖拽事件
						card.setAttribute("draggable", "true");
						card.addEventListener("dragstart", guanXing._dragStart.bind(guanXing));
						card.addEventListener("dragend", guanXing._dragEnd.bind(guanXing));
					}

					card.rawCssText = card.style.cssText;
					card.fix();
					content.appendChild(card);
				});
			});

			content.addEventListener("dragover", guanXing._dragOver.bind(guanXing));
			content.addEventListener("dragenter", guanXing._dragEnter.bind(guanXing));
			content.addEventListener("dragleave", guanXing._dragLeave.bind(guanXing));
			content.addEventListener("drop", guanXing._drop.bind(guanXing));
			decadeUI.game.wait();
			guanXing.infohide = infohide ?? (game.me === player ? false : true);
			guanXing.caption = `${get.translation(player)}正在发动【观星】`;
			guanXing.tip = "单击卡牌可直接在牌堆顶和牌堆底之间切换位置，也可以拖拽卡牌交换位置";

			// 禁用长按信息
			lib.config.longpress_info = false;

			// 添加CSS样式
			const style = document.createElement("style");
			style.textContent = `
				.card.dragging {
					opacity: 0.5;
					cursor: move;
				}
				.card.drag-over {
					border: 2px dashed #ff0;
					box-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
				}
				.card {
					cursor: pointer;
				}
				.card:hover {
					transform: translateY(-5px);
				}
			`;
			document.head.appendChild(style);
			guanXing.update();
			ui.arena.appendChild(guanXing);
			decadeUI.eventDialog = guanXing;
			guanXing.addEventListener("remove", () => {
				if (hideBtn?.parentNode) {
					document.body.removeChild(hideBtn);
				}
				lib.config.longpress_info = originalLongpressInfo;
			});
			return guanXing;
		},
	};
});
