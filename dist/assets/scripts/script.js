// MASK
const inputsTypeTel = document.querySelectorAll('input[type="tel"]')
if(inputsTypeTel.length > 0) {
	inputsTypeTel.forEach((input) => {
		new Inputmask({
			mask: '+7 999 999 99 99',
			placeholder: '+7 XXX XXX XX XX',
		}).mask(input);
	})
}

// HEADER
const headerBurger = document.querySelector('.header-burger');
const header = document.querySelector('.header');
if(headerBurger) {
	headerBurger.addEventListener('click', () => {
		header.classList.toggle('active');
	})
}

// PARALLAX
if (document.querySelector('.parallax')) {
	window.addEventListener('scroll', () => {
			const parallaxElements = document.querySelectorAll('.parallax');

			parallaxElements.forEach((item) => {
					const rect = item.getBoundingClientRect();
					const windowHeight = window.innerHeight;

					// Проверяем, находится ли элемент в пределах видимой области
					if (rect.top < windowHeight && rect.bottom > 0) {
							const elementHeight = rect.height;
							const scrollY = window.scrollY;
							const offsetTop = item.offsetTop;
							const relativeScroll = scrollY - offsetTop;

							// Рассчитываем ограниченное смещение параллакса
							const maxOffset = elementHeight * 0.5; // Уменьшить максимальное смещение
							const parallaxOffset = Math.max(-maxOffset, Math.min(maxOffset, relativeScroll * 0.3 - elementHeight)); // Сила эффекта уменьшена

							// Добавляем запас по высоте фона
							// const backgroundSize = `${item.clientWidth}px ${elementHeight * 1.5}px`;

							item.style.backgroundPositionY = `${parallaxOffset}px`;
							// item.style.backgroundSize = backgroundSize;
					}
			});
	});
}

// SWIPER
if(document.querySelector('.events-swiper') || document.querySelector('.ecosystem-swiper')) {
	let swiperInstanceEvents = null;
	let swiperInstanceEcosystem = null;

	function handleSwiper() {
			const viewportWidth = window.innerWidth;

			if (viewportWidth <= 768) {

					if (!swiperInstanceEvents) {
							swiperInstanceEvents = new Swiper('.events-swiper', {
									slidesPerView: 1,
									spaceBetween: 24,
									pagination: {
											el: '.swiper-pagination',
											clickable: true,
									},
							});
					}
					if (!swiperInstanceEcosystem) {
							swiperInstanceEcosystem = new Swiper('.ecosystem-swiper', {
									slidesPerView: 1,
									spaceBetween: 24,
									pagination: {
											el: '.swiper-pagination',
											clickable: true,
									},
							});
					}
			} else {

					if (swiperInstanceEvents) {
							swiperInstanceEvents.destroy(true, true);
							swiperInstanceEvents = null;
					}
					if (swiperInstanceEcosystem) {
							swiperInstanceEcosystem.destroy(true, true);
							swiperInstanceEcosystem = null;
					}
			}
	}

	handleSwiper();

	window.addEventListener('resize', handleSwiper);
}

if(document.querySelector('.polls-swiper')) {
	const swiper = new Swiper('.polls-swiper', {
		slidesPerView: 'auto',
		spaceBetween: 24,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		}
	});
}
if(document.querySelector('.policy-swiper')) {
	const swiper = new Swiper('.policy-swiper', {
		slidesPerView: 'auto',
		spaceBetween: 24,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		}
	});
}
if(document.querySelector('.other-news-swiper')) {
	const swiper = new Swiper('.other-news-swiper', {
		slidesPerView: 'auto',
		spaceBetween: 24,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		}
	});
}

// DROPDOWN
if(document.querySelector('.base-select')) {
	const selects = document.querySelectorAll('.base-select');

	selects.forEach((select) => {
		const selectHeader = select.querySelector('.base-select__header');
		const selectValue = selectHeader.querySelector('span');
		const selectInput = select.querySelector('input');
		const selectItems = select.querySelectorAll('.base-select__item');
		selectHeader.addEventListener('click', () => {
			select.classList.toggle('active');
		})

		selectItems.forEach((item) => {
			item.addEventListener('click', () => {
				selectValue.textContent = item.textContent;
				selectInput.value = item.textContent;
				select.classList.remove('active');
			})
		})
	})
}

// QUIZ
if(document.querySelector('.quiz')) {
	let step = 1;

	const quizContent = document.querySelector('.quiz-content');
	const quizMain = document.querySelector('.quiz__main');
	const quizStart = document.querySelector('#quizStart');

	const quizStepsContainer = document.querySelector('.quiz__steps');
	const currentStep = document.querySelector('#currentStep');
	const maxSteps = document.querySelector('#maxSteps');
	const quizSteps = document.querySelectorAll('.quiz-form__step');
	const quizConfirm = document.querySelector('.quiz-form__confirm');

	const quizPrev = document.querySelector('#quizPrev');
	const quizNext = document.querySelector('#quizNext');
	const quizSubmit = document.querySelector('#quizSubmit');
	const quizBack = document.querySelector('#quizBack');

	maxSteps.textContent = quizSteps.length;
	function setCurrentStep(step) {
		quizSteps.forEach((stepEl) => {
			stepEl.classList.remove('quiz-form__step--active');
		})
		quizSteps[step - 1].classList.add('quiz-form__step--active');
		currentStep.textContent = step;
	}

	function onPrev() {
		if(step > 1) step--
		if(step === 0) {
			quizPrev.classList.remove('quiz__button--active');
		}
		if(step < quizSteps.length) {
			quizNext.classList.add('quiz__button--active');
		}
		if(step !== quizSteps.length) {
			quizSubmit.classList.remove('quiz__button--active');
		}
		setCurrentStep(step);

	}

	function onNext() {
		const activeStep = quizSteps[step-1]
		const requiredInputs = activeStep.querySelectorAll('input[required]');
		let isValid = true;
		requiredInputs.forEach((input) => {
			if(!input.checkValidity()) {
				console.log(input)
				isValid = false
			}
		})

		if(!isValid) return


		if(step < quizSteps.length) step++
		if(step > 0) quizPrev.classList.add('quiz__button--active');
		if(step === quizSteps.length) {
			quizNext.classList.remove('quiz__button--active');
			quizSubmit.classList.add('quiz__button--active');
		}

		setCurrentStep(step);
	}

	quizSubmit.addEventListener('click', (e) => {
		e.preventDefault();
		quizSteps.forEach((stepEl) => {
			stepEl.classList.remove('quiz-form__step--active');
		})
		quizConfirm.classList.add('quiz-form__confirm--active');
		quizBack.classList.add('quiz__button--active');
		quizPrev.classList.remove('quiz__button--active');
		quizNext.classList.remove('quiz__button--active');
		quizSubmit.classList.remove('quiz__button--active');
	})

	quizPrev.addEventListener('click', onPrev);
	quizNext.addEventListener('click', onNext);

	quizStart.addEventListener('click', () => {
		quizContent.classList.remove('quiz-content--active');
		quizMain.classList.add('quiz__main--active');
	})


}

// MODAL
const modal = document.querySelectorAll('.modal');
const modalWrapper = document.querySelector('.modal-wrapper');
if(modal.length > 0) {
	const openers = document.querySelectorAll('[data-modal-open]');
	const closers = document.querySelectorAll('[data-modal-close]');

	window.addEventListener('click', (e) => {
		if(e.composedPath()[0].classList.contains('modal-wrapper') || e.composedPath()[0].classList.contains('modal-wrapper__content')) {
			modal.forEach((modal) => {
				modal.classList.remove('active');
			})
			modalWrapper.classList.remove('active');
		}
	})

	openers.forEach((opener) => {
		opener.addEventListener('click', () => {
			const modalId = opener.getAttribute('data-modal-open');
			const modal = document.getElementById(modalId);
			modal.classList.add('active');
			modalWrapper.classList.add('active');
		})
	})

	closers.forEach((closer) => {
		closer.addEventListener('click', () => {
			const modalId = closer.getAttribute('data-modal-close');
			const modal = document.getElementById(modalId);
			modal.classList.remove('active');
			modalWrapper.classList.remove('active');
		})
	})
}
