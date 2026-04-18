const initHeroSlider = ( root ) => {
	const track = root.querySelector( '.cb-hero-slider__track' );
	const slides = Array.from(
		root.querySelectorAll( '.cb-hero-slider__slide' )
	);
	const prevButton = root.querySelector(
		'.cb-hero-slider__arrow--prev'
	);
	const nextButton = root.querySelector(
		'.cb-hero-slider__arrow--next'
	);
	const dots = Array.from(
		root.querySelectorAll( '.cb-hero-slider__dot' )
	);

	if ( ! track || slides.length === 0 ) {
		return;
	}

	let currentIndex = 0;
	let autoplayTimer = null;

	const autoplay = root.getAttribute( 'data-autoplay' ) === 'true';
	const loop = root.getAttribute( 'data-loop' ) === 'true';
	const pauseOnHover =
		root.getAttribute( 'data-pause-on-hover' ) === 'true';
	const autoplaySpeed = parseInt(
		root.getAttribute( 'data-autoplay-speed' ) || '5000',
		10
	);

	const goTo = ( index ) => {
		const lastIndex = slides.length - 1;
		let target = index;

		if ( loop ) {
			if ( target < 0 ) {
				target = lastIndex;
			} else if ( target > lastIndex ) {
				target = 0;
			}
		} else {
			target = Math.max( 0, Math.min( lastIndex, target ) );
		}

		const previousIndex = currentIndex;
		currentIndex = target;

		// Fade out previous slide.
		if (
			typeof previousIndex === 'number' &&
			previousIndex !== target &&
			slides[ previousIndex ]
		) {
			const prevSlide = slides[ previousIndex ];
			prevSlide.classList.add( 'cb-hero-slider__slide--is-exiting' );
			window.setTimeout( () => {
				prevSlide.classList.remove(
					'cb-hero-slider__slide--is-exiting'
				);
			}, 600 );
		}

		// Activate target slide and reset others.
		slides.forEach( ( slide, slideIndex ) => {
			const isActive = slideIndex === target;
			slide.classList.toggle(
				'cb-hero-slider__slide--is-active',
				isActive
			);

			const content = slide.querySelector(
				'.cb-hero-slider__content'
			);

			if ( content ) {
				if ( isActive ) {
					content.classList.remove(
						'cb-hero-slider__content--enter'
					);
					// Trigger reflow so animation restarts on each change.
					// eslint-disable-next-line no-unused-expressions
					content.offsetHeight;
					content.classList.add(
						'cb-hero-slider__content--enter'
					);
				} else {
					content.classList.remove(
						'cb-hero-slider__content--enter'
					);
				}
			}
		} );

		dots.forEach( ( dot, dotIndex ) => {
			const isActive = dotIndex === target;
			dot.classList.toggle(
				'cb-hero-slider__dot--is-active',
				isActive
			);
			dot.setAttribute( 'aria-selected', isActive ? 'true' : 'false' );
		} );

		if ( ! loop ) {
			if ( prevButton ) {
				prevButton.disabled = target === 0;
			}
			if ( nextButton ) {
				nextButton.disabled = target === lastIndex;
			}
		}
	};

	const next = () => goTo( currentIndex + 1 );
	const prev = () => goTo( currentIndex - 1 );

	if ( prevButton ) {
		prevButton.addEventListener( 'click', prev );
	}

	if ( nextButton ) {
		nextButton.addEventListener( 'click', next );
	}

	if ( dots.length > 0 ) {
		dots.forEach( ( dot, index ) => {
			dot.addEventListener( 'click', () => goTo( index ) );
		} );
	}

	const startAutoplay = () => {
		if ( ! autoplay || slides.length <= 1 ) {
			return;
		}

		stopAutoplay();

		autoplayTimer = window.setInterval( () => {
			next();
		}, Number.isFinite( autoplaySpeed ) ? autoplaySpeed : 5000 );
	};

	const stopAutoplay = () => {
		if ( autoplayTimer ) {
			window.clearInterval( autoplayTimer );
			autoplayTimer = null;
		}
	};

	if ( pauseOnHover ) {
		root.addEventListener( 'mouseenter', stopAutoplay );
		root.addEventListener( 'mouseleave', startAutoplay );
	}

	goTo( 0 );
	startAutoplay();
};

const initAllHeroSliders = () => {
	const sliders = document.querySelectorAll( '.cb-hero-slider' );

	if ( ! sliders.length ) {
		return;
	}

	sliders.forEach( ( slider ) => {
		initHeroSlider( slider );
	} );
};

if (
	document.readyState === 'interactive' ||
	document.readyState === 'complete'
) {
	initAllHeroSliders();
} else {
	document.addEventListener( 'DOMContentLoaded', initAllHeroSliders );
}

if ( window.wp && window.wp.domReady ) {
	window.wp.domReady( initAllHeroSliders );
}

