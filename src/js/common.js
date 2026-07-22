// Service Imports
import "./polyfills.js";
import "./blocks.js";

// Throttle Function
import { throttle } from "./libs/utils";

// Swiper
import Swiper from "swiper";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";

// Tabs
import { driveTabs } from "../js/libs/driveTabs";

// Inputmask
import Inputmask from "inputmask";

// Functions
const setScrollbarWidth = () => {
	document.documentElement.style.setProperty('--sw', `${window.innerWidth - document.documentElement.clientWidth}px`);
}

const initSwiper = () => {
	const buttonsClient = document.querySelectorAll(".client__tab-btn");
	const buttonsReviews = document.querySelectorAll(".reviews__button");
	const buttonsArticles = document.querySelectorAll(".articles__button");
	const isMobile = window.innerWidth <= 992;

	let servicesSwiper = null;
	let accountSwiper = null;
	let choosesSwiper = null;

	// Если мобилка И слайдер еще не создан
	if (isMobile && !servicesSwiper && !accountSwiper && !choosesSwiper) {
		servicesSwiper = new Swiper(".services-section__grid", {
			slidesPerView: "auto",
			spaceBetween: 15,
			centeredSlides: false,
			grabCursor: true
		});
		accountSwiper = new Swiper(".account__swiper", {
			modules: [Pagination],
			loop: true,
			slidesPerView: 1,
			spaceBetween: 16,

			pagination: {
				el: ".account__pagination",
			},
		});
		accountSwiper = new Swiper(".chooses__swiper", {
			modules: [Pagination],
			loop: true,
			slidesPerView: 1,
			spaceBetween: 16,

			pagination: {
				el: ".chooses__pagination",
			},
		});
	}

	else if (!isMobile && servicesSwiper && choosesSwiper && accountSwiper) {

		servicesSwiper.destroy(true, true);
		servicesSwiper = null;

		accountSwiper.destroy(true, true);
		accountSwiper = null;

		choosesSwiper.destroy(true, true);
		choosesSwiper = null;
	}

	const programsSwiper = new Swiper(".programs__swiper", {
		modules: [Navigation],
		loop: true,
		spaceBetween: 32,
		navigation: {
			prevEl: document.querySelector(".programs .custom-navigation__btn_prev"),
			nextEl: document.querySelector(".programs .custom-navigation__btn_next"),
		},
		breakpoints: {
			0: {
				slidesPerView: 1.3,
				slidesPerGroup: 1,
				spaceBetween: 16
			},
			480: {
				slidesPerView: 2,
				slidesPerGroup: 2,
			},
			768: {
				slidesPerView: 3,
				slidesPerGroup: 2,
			},
			1024: {
				slidesPerView: 4,
				slidesPerGroup: 2,
			},
		},
	});


	new Swiper(".articles__swiper", {
		modules: [Navigation],
		loop: false,
		spaceBetween: 32,
		navigation: {
			prevEl: buttonsArticles[0],
			nextEl: buttonsArticles[1],
		},
		breakpoints: {
			0: {
				slidesPerView: 1.65,
				slidesPerGroup: 1,
				spaceBetween: 16
			},
			480: {
				slidesPerView: 2,
				slidesPerGroup: 2,
			},
			768: {
				slidesPerView: 3,
				slidesPerGroup: 2,
			},
			1024: {
				slidesPerView: 4,
				slidesPerGroup: 2,
			},
		},
	});

	new Swiper(".swiper-reviews", {
		modules: [Navigation],
		loop: false,
		spaceBetween: 32,
		navigation: {
			prevEl: buttonsReviews[0],
			nextEl: buttonsReviews[1],
		},
		breakpoints: {
			0: {
				slidesPerView: 1.25,
				slidesPerGroup: 1,
				spaceBetween: 16
			},
			480: {
				slidesPerView: 2,
				slidesPerGroup: 2,
			},
			768: {
				slidesPerView: 3,
				slidesPerGroup: 2,
				spaceBetween: 32,
			},
			1024: {
				slidesPerView: 4,
				slidesPerGroup: 2,
			},
		},
	});


	new Swiper(".client__swiper", {
		modules: [Navigation],
		loop: false,
		spaceBetween: 32,
		navigation: {
			prevEl: document.querySelector(".client .custom-navigation__btn_prev"),
			nextEl: document.querySelector(".client .custom-navigation__btn_next"),
		},
		breakpoints: {
			0: {
				slidesPerView: 1.25,
				slidesPerGroup: 1,
				spaceBetween: 16
			},
			480: {
				slidesPerView: 2,
				slidesPerGroup: 2,
				paceBetween: 16
			},
			768: {
				slidesPerView: 3,
				spaceBetween: 32,
			},
			1024: {
				slidesPerView: 4,
			},
		},
	});

	new Swiper(".hero__swiper", {
		modules: [Navigation, Pagination, EffectFade, Autoplay],
		loop: true,
		effect: "fade",
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},
		pagination: {
			el: ".hero__pagination",
		},
		navigation: {
			nextEl: ".custom-navigation__btn_next",
			prevEl: ".custom-navigation__btn_prev",
		},
	});

	new Swiper(".about-hero__swiper", {
		modules: [Navigation, Pagination],
		loop: true,
		spaceBetween: 16,
		pagination: {
			el: ".about-hero__pagination",
		},
		navigation: {
			nextEl: ".custom-navigation__btn_next",
			prevEl: ".custom-navigation__btn_prev",
		},
	});

	new Swiper(".insurance .loan-card__swiper", {
		modules: [Navigation, Pagination],
		loop: true,
		spaceBetween: 16,
		autoHeight: true,
		pagination: {
			el: ".loan-card__pagination",
		},
		navigation: {
			nextEl: ".custom-navigation__btn_next",
			prevEl: ".custom-navigation__btn_prev",
		},
		breakpoints: {
			640: {
				autoHeight: false
			}
		}
	});

	new Swiper(".loanreq_swiper .loan-card__swiper", {
		modules: [Navigation, Pagination],
		loop: true,
		spaceBetween: 16,
		autoHeight: true,
		pagination: {
			el: ".loan-card__pagination",
		},
		navigation: {
			nextEl: ".custom-navigation__btn_next",
			prevEl: ".custom-navigation__btn_prev",
		},
		breakpoints: {
			640: {
				autoHeight: false
			}
		}
	});

	new Swiper(".loanreq_swiper-autoheight .loan-card__swiper", {
		modules: [Navigation, Pagination],
		loop: true,
		spaceBetween: 16,
		autoHeight: true,
		pagination: {
			el: ".loan-card__pagination",
		},
		navigation: {
			nextEl: ".custom-navigation__btn_next",
			prevEl: ".custom-navigation__btn_prev",
		}
	});
}

const initHeader = () => {
	const header = document.querySelector(".header");
	if (!header) return;

	const burger = header.querySelector(".header__burger");
	const mobileMenu = header.querySelector(".mobile-menu");

	burger.addEventListener("click", () => {
		header.classList.toggle("is-active");
		burger.classList.toggle("is-active");
		mobileMenu.classList.toggle("is-active");

		if(header.classList.contains("is-active")) {
			document.body.classList.add("scroll-lock");
		} else {
			document.body.classList.remove("scroll-lock");
		}
	})
}

const initTabs = () => {
	const containers = document.querySelectorAll(".tabs");
	if (!containers) return;

	containers.forEach(el => {
		const tabs = driveTabs({
			container: el,
			controls: ".tabs__navigation .tabs-navigation__button",
			selects: ".tabs__tab",
			cls: 'active'
		});
	})
}

const initTextMore = () => {
	const containers = document.querySelectorAll(".text-more")

	containers.forEach(el => {
		const button = el.querySelector(".text-more__button");
		if (!button) return;

		button.addEventListener("click", () => {
			el.classList.toggle("active");
		})
	})
}

const initAccordeons = () => {
	const containers = document.querySelectorAll(".accordeons")

	containers.forEach(container => {
		const items = container.querySelectorAll(".accordeons__item")

		items.forEach(item => {
			const button = item.querySelector(".accordeons__item-button")
			if (!button) return

			button.addEventListener("click", () => {
				if (item.classList.contains("active")) {
					item.classList.remove("active")
					return
				}

				items.forEach(el => el.classList.remove("active"))
				item.classList.add("active")
			})
		})
	})
}

const initPhoneMask = (container = document) => {
	Inputmask({
		mask: "+7 (999) 999-99-99",
		showMaskOnHover: false,
	}).mask(container.querySelectorAll('input[type="tel"]'));
};

const initModals = () => {
	const modals = document.querySelectorAll('.modal');

	document.addEventListener('click', (e) => {
		const trigger = e.target.closest('[data-modal-open]');
		if (!trigger) return;

		const modalClass = trigger.dataset.modalOpen;
		const modal = document.querySelector(`.modal.${modalClass}`);
		if (modal) {
			modal.classList.add('active');
			document.body.classList.add("scroll-lock");
			initPhoneMask(modal);
		}
	});

	modals.forEach((modal) => {
		modal.addEventListener('click', (e) => {

			if (e.target.closest('.modal__close')) {
				modal.classList.remove('active');
				document.body.classList.remove("scroll-lock");
				return;
			}

			if (!e.target.closest('.modal__container')) {
				modal.classList.remove('active');
				document.body.classList.remove("scroll-lock");
			}
		});
	});
};

// Init functions
document.addEventListener("DOMContentLoaded", () => {
	setScrollbarWidth();
	initSwiper();
	initHeader();
	initTabs();
	initTextMore();
	initAccordeons();
	initModals();
	initPhoneMask();

	console.log("Cайт разработан командой onespace.team");
	console.log("Developed by 16th team");
})