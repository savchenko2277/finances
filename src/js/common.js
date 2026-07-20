import { throttle } from "./libs/utils";
import "./polyfills.js";
import "./blocks.js";

// Swiper
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";

import { driveTabs } from "../js/libs/driveTabs";

// Функции

// Анимация slideUp / slideDown для аккордеона
const _slide = {
	up(element, duration = 300) {
		element.style.display = "block";
		element.style.overflow = "hidden";
		const height = element.scrollHeight;
		element.style.transition = `height ${duration}ms ease`;
		element.style.height = height + "px";
		element.getBoundingClientRect();
		element.style.height = "0px";
		element.addEventListener("transitionend", function handler() {
			element.removeEventListener("transitionend", handler);
			element.style.display = "none";
			element.style.height = "";
			element.style.overflow = "";
			element.style.transition = "";
		});
	},
	down(element, duration = 300) {
		element.style.display = "block";
		element.style.overflow = "hidden";
		element.style.height = "0px";
		element.getBoundingClientRect();
		const height = element.scrollHeight;
		element.style.transition = `height ${duration}ms ease`;
		element.style.height = height + "px";
		element.addEventListener("transitionend", function handler() {
			element.removeEventListener("transitionend", handler);
			element.style.height = "";
			element.style.overflow = "";
			element.style.transition = "";
		});
	},
};

const setScrollbarWidth = () => {
	document.documentElement.style.setProperty('--sw', `${window.innerWidth - document.documentElement.clientWidth}px`);
}

function initSwiper() {
	const buttonsClient = document.querySelectorAll(".client__tab-btn");
	const buttonsReviews = document.querySelectorAll(".reviews__button");
	const buttonsArticles = document.querySelectorAll(".articles__button");
	const isMobile = window.innerWidth <= 992;

	let servicesSwiper = null;
	let accountSwiper = null;

	// Если мобилка И слайдер еще не создан
	if (isMobile && !servicesSwiper && !accountSwiper) {
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
	}

	else if (!isMobile && servicesSwiper) {

		servicesSwiper.destroy(true, true);
		servicesSwiper = null;

		accountSwiper.destroy(true, true);
		accountSwiper = null;
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


	new Swiper(".swiper-client", {
		modules: [Navigation],
		loop: false,
		spaceBetween: 32,
		navigation: {
			prevEl: buttonsClient[0],
			nextEl: buttonsClient[1],
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
		modules: [Navigation, Pagination],
		loop: true,
		pagination: {
			el: ".hero__pagination",
		},
		navigation: {
			nextEl: ".custom-navigation__btn_next",
			prevEl: ".custom-navigation__btn_prev",
		},
	});
}

const setHeader = () => {
	const header = document.querySelector(".header");
	if (!header) return;

	const burger = header.querySelector(".header__burger");
	const mobileMenu = header.querySelector(".mobile-menu");

	burger.addEventListener("click", () => {
		header.classList.toggle("is-active");
		burger.classList.toggle("is-active");
		mobileMenu.classList.toggle("is-active");
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
			cls: 'active',
			onInit() {
				console.log(this);
			},
			onClick(i) {
				console.log(this, i);
			},
			onTab(set, i) {
				console.log(this, set, i);
			},
			onTick(i) {
				console.log(this, i);
			},
		});
	})
}

const setTextMore = () => {
	const containers = document.querySelectorAll(".text-more")

	containers.forEach(el => {
		const button = el.querySelector(".text-more__button");
		if (!button) return;

		button.addEventListener("click", () => {
			el.classList.toggle("active");
		})
	})
}

document.addEventListener("DOMContentLoaded", () => {
	setScrollbarWidth();
	initSwiper();
	setHeader();
	initTabs();
	setTextMore();

	document
		.querySelectorAll(".faq-spoilers__item")
		.forEach((item) => (item.lastElementChild.style.display = "none"));

	addEventListener("click", (event) => {
		const item = event.target.closest(".faq-spoilers__item");
		if (!item) return;

		const button = item.firstElementChild;
		const content = item.lastElementChild;

		if (content.classList.contains("slide")) return;

		if (item.classList.contains("faq-spoilers__item_active")) {
			item.parentElement._openedSpoiler = null;
			item.classList.remove("faq-spoilers__item_active");
			_slide.up(content);
		} else {
			if (item.parentElement._openedSpoiler) {
				item.parentElement._openedSpoiler.classList.remove(
					"faq-spoilers__item_active",
				);
				_slide.up(item.parentElement._openedSpoiler.lastElementChild);
			}

			item.classList.add("faq-spoilers__item_active");
			item.parentElement._openedSpoiler = item;
			_slide.down(content);
		}
	});
})