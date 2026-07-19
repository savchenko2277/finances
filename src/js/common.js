import { throttle } from "./libs/utils";
import "./polyfills.js";
import "./blocks.js";

// Swiper
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";

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

	// Если мобилка И слайдер еще не создан
	if (isMobile && !servicesSwiper) {
		servicesSwiper = new Swiper(".services-section__grid", {
			slidesPerView:
				"auto" /* Карточки займут столько места, сколько указано в их CSS (например, 240px) */,
			spaceBetween: 15 /* Отступ между слайдами на мобилке */,
			centeredSlides: false /* Слайды прижаты к левому краю */,
			grabCursor: true /* Курсор-ручка при наведении */,
		});
	}
	// Если десктоп И слайдер сейчас запущен — уничтожаем его
	else if (!isMobile && servicesSwiper) {
		// Передаем (true, true), чтобы Swiper удалил все свои инлайн-стили и служебные классы
		servicesSwiper.destroy(true, true);
		servicesSwiper = null;
	}

	new Swiper(".swiper-articles", {
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

	new Swiper(".swiper-hero", {
		loop: true,
		pagination: {
			el: ".swiper-pagination",
		},
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
	});
}

// Запуск функций
document.addEventListener("DOMContentLoaded", () => {
	setScrollbarWidth();
	initSwiper();
})

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