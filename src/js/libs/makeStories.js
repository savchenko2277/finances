/*
* Логика блока "истории" (modal-stories).
*
* Что делает:
* - генерирует спаны пагинации из количества элементов историй;
* - переключает истории кнопками, свайпом и автопереходом по окончании видео;
* - лениво загружает видео через data-src (показывает спиннер);
* - показывает прогресс активной истории (по времени видео или по таймеру);
* - останавливает/ставит на паузу видео при переключении и закрытии;
* - при паузе показывает значок воспроизведения по центру видео.
*
* Разметка:
* <div class="modal-stories">
*   <button class="modal-stories__close"></button>
*   <div class="modal-stories__navigation">
*     <button class="custom-navigation__btn custom-navigation__btn_prev"></button>
*     <button class="custom-navigation__btn custom-navigation__btn_next"></button>
*   </div>
*   <div class="modal-stories__items">
*     <div class="modal-stories__top">
*       <div class="modal-stories__pagination"></div>
*       <p class="modal-stories__name">Отзыв от <span>Имя</span></p>
*     </div>
*     <div class="modal-stories__wrapper">
*       <div class="modal-stories__item active" data-stories-name="Марии">
*         <video preload="none" muted playsinline data-src="./video.webm"></video>
*       </div>
*       <span class="modal-stories__play"></span>
*       <span class="modal-stories__spinner"></span>
*     </div>
*   </div>
* </div>
*
* @вызов:
* import { makeStories } from "../../js/libs/makeStories";
* const stories = makeStories();
* stories.open(0);
*/

export const makeStories = (options = {}) => {
	const config = {
		cls: 'modal-stories',
		activeClass: 'active',
		doneClass: 'done',
		spinnerClass: 'active',
		duration: 5000,
		...options
	};

	const root = document.querySelector(`.${config.cls}`);
	if (!root) return;

	const pagination = root.querySelector(`.${config.cls}__pagination`);
	const wrapper = root.querySelector(`.${config.cls}__wrapper`);
	const items = [...root.querySelectorAll(`.${config.cls}__item`)];
	const name = root.querySelector(`.${config.cls}__name span`);
	const spinner = root.querySelector(`.${config.cls}__spinner`);
	const playIcon = root.querySelector(`.${config.cls}__play`);
	const prevBtn = root.querySelector('.custom-navigation__btn_prev');
	const nextBtn = root.querySelector('.custom-navigation__btn_next');
	const closeBtn = root.querySelector(`.${config.cls}__close`);

	let progress = [];
	let current = 0;
	let timer = null;
	let raf = null;
	let soundOn = true;
	let playId = 0;

	/* ---------- спиннер ---------- */
	const setSpinner = (state) => spinner?.classList.toggle(config.spinnerClass, state);

	/* ---------- значок воспроизведения при паузе ---------- */
	const setPlayIcon = (state) => playIcon?.classList.toggle(config.activeClass, state);

	/* ---------- пагинация ---------- */
	const buildPagination = () => {
		pagination.innerHTML = '';

		items.forEach(() => {
			const span = document.createElement('span');
			const bar = document.createElement('i');
			span.appendChild(bar);
			pagination.appendChild(span);
		});

		progress = [...pagination.querySelectorAll('span')];
	};

	/* ---------- загрузка видео ---------- */
	const loadVideo = (video) => new Promise((resolve) => {
		if (!video?.dataset?.src) {
			resolve(false);
			return;
		}

		if (video.src !== video.dataset.src) {
			video.src = video.dataset.src;
		}

		if (video.readyState >= 3) {
			resolve(true);
			return;
		}

		const done = (ok) => {
			video.removeEventListener('canplay', onCanPlay);
			video.removeEventListener('error', onError);
			resolve(ok);
		};
		const onCanPlay = () => done(true);
		const onError = () => done(false);

		video.addEventListener('canplay', onCanPlay, { once: true });
		video.addEventListener('error', onError, { once: true });
		video.load();
	});

	/* ---------- предзагрузка соседней истории ---------- */
	const preloadNext = () => {
		const next = items[(current + 1) % items.length];
		const video = next?.querySelector('video');

		if (video?.dataset?.src && !video.src) {
			video.src = video.dataset.src;
			video.load();
		}
	};

	/* ---------- анимация прогресса ---------- */
	const clearLoop = () => {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}

		if (raf) {
			cancelAnimationFrame(raf);
			raf = null;
		}
	};

	const loop = () => {
		const item = items[current];
		const video = item?.querySelector('video');
		const bar = progress[current]?.querySelector('i');

		// Если это видео — прогресс привязан к его времени
		if (video?.duration && !video.ended && !video.paused) {
			bar && (bar.style.width = `${(video.currentTime / video.duration) * 100}%`);

			if (video.ended) {
				next();
				return;
			}
		}

		raf = requestAnimationFrame(loop);
	};

	const animateByTimer = (video) => {
		const bar = progress[current]?.querySelector('i');
		if (!bar) return;

		bar.style.transition = `width ${config.duration}ms linear`;
		bar.style.width = '100%';

		timer = setTimeout(() => {
			bar.style.transition = '';
			next();
		}, config.duration);

		video && setSpinner(false);
	};

	/* ---------- пауза истории ---------- */
	const pauseStory = (index) => {
		const video = items[index]?.querySelector('video');
		if (!video) return;

		video.pause();
		setSpinner(false);
		setPlayIcon(true);
	};

	/* ---------- остановить все видео ---------- */
	const pauseAll = () => {
		items.forEach((item) => {
			const video = item.querySelector('video');
			if (video) video.pause();
		});
		setSpinner(false);
	};

	/* ---------- принудительный выход из PiP ---------- */
	const forceInline = (video) => {
		try {
			if (video.webkitSetPresentationMode) {
				video.webkitSetPresentationMode('inline');
			}
		} catch (e) {}

		if (document.pictureInPictureElement === video && document.exitPictureInPicture) {
			document.exitPictureInPicture().catch(() => {});
		}

		video.pause();
	};

	/* ---------- сброс пагинационной полосы ---------- */
	const resetBar = (bar) => {
		if (!bar) return;
		bar.style.transition = 'none';
		bar.style.width = '0';
	};

	const resetAllBars = () => {
		progress.forEach((bar) => {
			bar.classList.remove(config.doneClass);
			resetBar(bar.querySelector('i'));
		});
	};

	/* ---------- переключение ---------- */
	const setActive = (index, direction = 1) => {
		const old = current;

		index = (index + items.length) % items.length;
		if (old === index) return;

		clearLoop();
		pauseStory(old);

		const oldBar = progress[old]?.querySelector('i');
		progress[old]?.classList.remove(config.activeClass);
		items[old]?.classList.remove(config.activeClass);

		if (direction > 0) {
			if (index <= old) {
				// зацикливание вперёд с последнего на первый — начинаем новый круг
				resetAllBars();
			} else {
				progress[old]?.classList.add(config.doneClass);
				if (oldBar) {
					oldBar.style.transition = 'none';
					oldBar.style.width = '100%';
				}
			}
		} else {
			progress[old]?.classList.remove(config.doneClass);
			resetBar(oldBar);
		}

		current = index;

		const currentBar = progress[current]?.querySelector('i');
		progress[current]?.classList.remove(config.doneClass);
		resetBar(currentBar);

		progress[current]?.classList.add(config.activeClass);
		items[current]?.classList.add(config.activeClass);

		name && (name.textContent = items[current]?.dataset.storiesName || '');

		play();
	};

	const play = async () => {
		clearLoop();

		const id = ++playId;
		const item = items[current];
		const video = item?.querySelector('video');

		if (video?.dataset?.src) {
			setSpinner(true);
			const ok = await loadVideo(video);

			// устаревший вызов — не запускаем видео
			if (id !== playId) return;

			setSpinner(false);

			if (!ok) {
				animateByTimer(video);
				return;
			}

			// гарантируем, что играет только текущее видео
			items.forEach((it) => {
				const other = it.querySelector('video');
				if (other && other !== video) other.pause();
			});

			video.muted = !soundOn;
			video.playsInline = true;
			video.play().catch(() => {});
			setPlayIcon(false);

			loop();
			preloadNext();
		} else {
			animateByTimer();
		}
	};

	const next = () => setActive(current + 1, 1);
	const prev = () => setActive(current - 1, -1);

	/* ---------- клик по видео — пауза/воспроизведение ---------- */
	const onItemClick = (item) => {
		// в режиме миниатюры клик открывает полноэкранные истории
		if (!root.classList.contains('is-open')) return;

		const video = item?.querySelector('video');
		if (!video) return;

		if (video.paused) {
			video.play().catch(() => {});
			setPlayIcon(false);
			loop();
		} else {
			video.pause();
			setPlayIcon(true);
			clearLoop();
		}
	};

	/* ---------- события видео (буферизация/пауза) ---------- */
	const bindVideoEvents = () => {
		items.forEach((item) => {
			const video = item.querySelector('video');
			if (!video) return;

			// запрет вывода видео в режиме "картинка в картинке" (macOS PiP)
			video.disablePictureInPicture = true;
			video.setAttribute('disablepictureinpicture', '');
			video.setAttribute('controlslist', 'nodownload noremoteplayback noplaybackrate');

			// Safari может проигнорировать disablepictureinpicture, поэтому
			// дополнительно выходим из PiP, как только он активируется.
			video.addEventListener('enterpictureinpicture', () => forceInline(video));
			video.addEventListener('webkitpresentationmodechanged', () => {
				if (video.webkitPresentationMode === 'picture-in-picture') {
					forceInline(video);
				}
			});

			video.addEventListener('waiting', () => {
				if (items[current] === item) setSpinner(true);
			});

			video.addEventListener('playing', () => {
				if (items[current] === item) {
					setSpinner(false);
					setPlayIcon(false);
				}
			});

			video.addEventListener('pause', () => {
				if (items[current] === item) setPlayIcon(true);
			});

			video.addEventListener('ended', () => {
				if (items[current] === item) setPlayIcon(false);
			});

			video.addEventListener('canplay', () => {
				if (items[current] === item) setSpinner(false);
			});
		});
	};

	/* ---------- свайпы (как в drag-логике встроенной галереи) ---------- */
	const bindSwipe = () => {
		const threshold = 40;
		let startX = 0;
		let startY = 0;
		let isDragging = false;

		const onStart = (e) => {
			// свайпы работают только в полноэкранном режиме
			if (!root.classList.contains('is-open')) return;

			isDragging = true;
			startX = e.clientX;
			startY = e.clientY;
		};

		const onEnd = (e) => {
			if (!isDragging) return;
			isDragging = false;

			const dx = e.clientX - startX;
			const dy = e.clientY - startY;

			if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
				dx < 0 ? next() : prev();
			}
		};

		wrapper.addEventListener('pointerdown', onStart);
		window.addEventListener('pointerup', onEnd);
		window.addEventListener('pointercancel', onEnd);
	};

	/* ---------- открытие/закрытие ---------- */
	const resetStories = (index = 0, { sound = true, lock = true, restart = false } = {}) => {
		soundOn = !!sound;

		root.classList.add(config.activeClass);
		root.classList.toggle('is-open', lock);

		if (lock) {
			document.body.classList.add('scroll-lock');
		}

		if (restart) {
			pauseAll();
			items.forEach((item) => {
				const video = item.querySelector('video');
				if (video && video.currentSrc) {
					try { video.currentTime = 0; } catch (e) {}
				}
			});
		}

		clearLoop();

		progress.forEach((bar) => {
			bar.classList.remove(config.doneClass);
			resetBar(bar.querySelector('i'));
		});

		current = (index + items.length) % items.length;

		setPlayIcon(false);

		items.forEach((item, i) => item.classList.toggle(config.activeClass, i === current));
		progress.forEach((bar, i) => bar.classList.toggle(config.activeClass, i === current));

		name && (name.textContent = items[current]?.dataset.storiesName || '');

		play();
	};

	// появление миниатюры без блокировки скролла и без звука
	const openThumbnail = () => resetStories(0, { sound: false, lock: false, restart: false });

	// полноэкранные истории: со звуком, блокировкой скролла и с первой истории заново
	const openStories = (index = 0) => resetStories(index, { sound: true, lock: true, restart: true });

	const open = (index = 0) => openStories(index);

	const close = () => {
		clearLoop();
		pauseAll();
		setSpinner(false);
		setPlayIcon(false);
		root.classList.remove(config.activeClass);
		root.classList.remove('is-open');
		document.body.classList.remove('scroll-lock');
	};

	/* ---------- слушатели ---------- */
	const bindControls = () => {
		prevBtn?.addEventListener('click', prev);
		nextBtn?.addEventListener('click', next);

		closeBtn?.addEventListener('click', close);

		root.addEventListener('click', (e) => {
			// игнорируем клики по элементам управления
			if (
				e.target.closest('.custom-navigation') ||
				e.target.closest(`.${config.cls}__close`) ||
				e.target.closest(`.${config.cls}__link`)
			) {
				return;
			}

			// клик по подложке закрывает
			if (e.target === root) {
				close();
				return;
			}

			// клик по миниатюре открывает полноэкранные истории
			if (!root.classList.contains('is-open')) {
				openStories(0);
			}
		});

		items.forEach((item) => {
			item.addEventListener('click', () => onItemClick(item));
		});

		document.addEventListener('keydown', (e) => {
			if (!root.classList.contains(config.activeClass)) return;

			if (e.key === 'Escape' || e.key === 'Esc') close();
			if (e.key === 'ArrowLeft') prev();
			if (e.key === 'ArrowRight') next();
		});
	};

	/* ---------- пауза при скрытии вкладки / потере фокуса ---------- */
	const bindPageHide = () => {
		const onHide = () => {
			clearLoop();
			pauseAll();
		};

		document.addEventListener('visibilitychange', () => {
			if (document.hidden) onHide();
		});

		window.addEventListener('blur', onHide);
		window.addEventListener('pagehide', onHide);
	};

	/* ---------- авто-открытие по data-stories-delay ---------- */
	const preloadFirstVideo = () => {
		const firstVideo = items[0]?.querySelector('video');

		if (!firstVideo?.dataset?.src) {
			return Promise.resolve(false);
		}

		return loadVideo(firstVideo).catch(() => false);
	};

	const initAutoOpen = () => {
		const delay = parseInt(root.dataset.storiesDelay, 10);

		if (!Number.isNaN(delay) && delay >= 0) {
			const ready = preloadFirstVideo();
			const timer = new Promise((resolve) => setTimeout(resolve, delay));

			// показываем миниатюру только когда прошёл таймер И первое видео прогрузилось
			Promise.all([ready, timer]).then(openThumbnail);
			return;
		}

		// если элемент уже активен в разметке — открываем истории сразу
		if (root.classList.contains(config.activeClass)) {
			root.classList.remove(config.activeClass);
			openStories(0);
		}
	};

	/* ---------- init ---------- */
	buildPagination();
	bindControls();
	bindVideoEvents();
	bindSwipe();
	bindPageHide();
	initAutoOpen();

	return { open, close, next, prev };
};