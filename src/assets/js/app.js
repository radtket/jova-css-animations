// Elements
import whichBrowser from './modules/whichBrowser';
import initializeMap from './modules/initializeMap';
import scrollContent from './modules/scrollContent';
import positionContent from './modules/positionContent';

let isMobile = false;
const $btnHeader = $('#header_btn-menu');
var isAnimationRunning = false;
var currentScroll = -1;
var infiniteSliderSquares;
var aboutTimeout;

const defaultAnimationTime = 1250;

const currentBrowser = whichBrowser();

const toLoad = () => {
	if (isMobile) {
		$('.to-load').addClass('loaded');
	}
};

const runBodyScroll = $target => {
	const scrollTop = $target.offset().top;
	const scrollTime = Math.abs(currentScroll - $target.offset().top) * 0.5;

	$('html,body').animate(
		{ scrollTop },
		scrollTime < defaultAnimationTime ? defaultAnimationTime : scrollTime,
		'easeInOutQuad'
	);
};

// Detect Mobile
if ($('body').hasClass('layout-mobile')) {
	isMobile = true;
}

$('html,body').scrollTop(0);

$(window).load(() => {
	// Anchor Buttons
	// eslint-disable-next-line func-names
	$('.btn-anchor').on('click', function() {
		if (!isAnimationRunning && !$(this).hasClass('active')) {
			const $target = $('#' + $(this).attr('data-anchor'));
			runBodyScroll($target);
		}

		return false;
	});

	// Slider Squares
	// eslint-disable-next-line func-names
	$('#slider-container-squares').each(function() {
		if (currentBrowser === 'Safari' || isMobile) {
			$(this).addClass('t-scale');
		} else {
			$(this).addClass('t-translate');
		}

		infiniteSliderSquares = new InfiniteSliderHome(
			$(this),
			2000,
			6000,
			'css',
			'easeOutQuad',
			false,
			true
		);
	});

	// Header
	$btnHeader.on('click', () => {
		$btnHeader.addClass('hidden');
		$('#header')
			.addClass('opened')
			.fadeIn(450, function() {
				$('.card-container', this)
					.removeClass('no-anim')
					.addClass('loaded');
			});

		return false;
	});

	$('#header').on('click', event => {
		if (event.target.tagName == 'HEADER') {
			$('#header')
				.removeClass('opened')
				.fadeOut(450, function() {
					$btnHeader.removeClass('hidden');
					$('.card-container', this)
						.addClass('no-anim')
						.removeClass('loaded');
				});
		}
	});

	// Slider Arrows in Header
	$('.card-container.home .btn-previous, .card-container.home .btn-next').on(
		'click',
		function() {
			const button = $(this);
			let delay = 1;

			if (currentScroll > 0) {
				delay = 750;
				$('html,body').animate({ scrollTop: 0 }, 750, 'easeInOutQuad');
			}

			setTimeout(() => {
				switch (button.attr('class')) {
					case 'btn-previous':
						$('#slider-container-squares .slider-arrows .previous a').trigger(
							'click'
						);
						break;

					case 'btn-next':
						$('#slider-container-squares .slider-arrows .next a').trigger(
							'click'
						);
						break;
				}
			}, delay);

			return false;
		}
	);

	// Init

	/* ////////////////////////////////////////
	//
	// Portfolio
	//
	/////////////////////////////////////// */

	$('#portfolio .card-container > div > div').each(function() {
		var fixWidth = $('h2', this).outerWidth() + $('h3', this).outerWidth() + 1;
		$(this).width(fixWidth);
	});

	// Change Image
	$(
		'#slider-container-squares .card-container .btn-previous, #slider-container-squares .card-container .btn-next'
	).on('click', function() {
		const button = $(this);

		switch (button.attr('class')) {
			case 'btn-previous':
				$('#slider-container-squares .slider-arrows .previous a').trigger(
					'click'
				);
				break;

			case 'btn-next':
				$('#slider-container-squares .slider-arrows .next a').trigger('click');
				break;
		}

		return false;
	});

	// Open Menu
	$('#slider-container-squares .card-container .btn-menu a').on('click', () => {
		$('#header_btn-menu').trigger('click');

		return false;
	});

	// Open Infos
	$('#slider-container-squares .card-container .btn-infos a').on(
		'click',
		function() {
			var container = $(this).parents('.card-container');

			if (!isAnimationRunning) {
				isAnimationRunning = true;
				$(this)
					.parent()
					.fadeOut(450, () => {
						$(
							'#slider-container-squares .card-container .btn-infos-close'
						).fadeIn(450);
					});

				$('> div > div', container).width('auto');
				container.animate({ width: 585 }, 450, 'easeInOutQuad', () => {
					$('.infos', container).animate(
						{ height: $('.infos > .text', container).outerHeight() },
						550,
						'easeInOutQuad',
						() => {
							isAnimationRunning = false;
						}
					);
				});
			}

			return false;
		}
	);

	// Close Infos
	$('#slider-container-squares .card-container .btn-infos-close a').on(
		'click',
		function() {
			var container = $(this).parents('.card-container');

			if (!isAnimationRunning) {
				isAnimationRunning = true;
				$(this)
					.parent()
					.fadeOut(450, () => {
						$('#slider-container-squares .card-container .btn-infos').fadeIn(
							450
						);
					});

				$('.infos', container).animate(
					{ height: 0 },
					550,
					'easeInOutQuad',
					() => {
						container.animate({ width: 480 }, 450, 'easeInOutQuad', () => {
							$('> div > div', container).width(432);
							isAnimationRunning = false;
						});
					}
				);
			}

			return false;
		}
	);

	/* ////////////////////////////////////////
	//
	// Tips
	//
	/////////////////////////////////////// */

	const slidersArray = [];
	$('#tips .slider-container').each(function() {
		if ($('.slider > ul > li', this).length > 1) {
			slidersArray.push(
				new InfiniteSlider(
					$(this),
					1500,
					4000,
					'slide',
					'easeInOutQuint',
					false,
					false
				)
			);
		} else {
			$(this).addClass('disabled');
		}

		$('.slider > ul > li > div', this).on('click', function() {
			$(this)
				.parents('.slider-container')
				.find('.slider-arrows .next a')
				.trigger('click');
		});
	});

	// Init Maps
	$('#contact .map > div').each(function() {
		const latitude = parseFloat($(this).attr('data-latitude'));
		const longitude = parseFloat($(this).attr('data-longitude'));
		const mapID = $(this).attr('id');

		initializeMap(latitude, longitude, mapID);
	});

	positionContent(isMobile, aboutTimeout, infiniteSliderSquares, currentScroll);

	$('#loading-mask').fadeOut(750, () => {
		// Init Header
		setTimeout(() => {
			$btnHeader.addClass('loaded');
		}, 450);

		// Init Homepage
		$('#homepage').each(() => {
			setTimeout(() => {
				$('#block1 .card-container').addClass('loaded');
				setTimeout(() => {
					$('.btn-scroll-down').addClass('loaded');
					toLoad();
				}, 1500);
			}, 750);
		});

		// Init About
		$('#about').each(() => {
			$('#block1').addClass('active');
			$('#block1 .text-grid').addClass('visible');
			$('#block1 .text-grid .line').addClass('loaded');
			setTimeout(() => {
				$('.img').addClass('loaded');
			}, 250);
			setTimeout(() => {
				$('#block1 .card-container').addClass('loaded');
				setTimeout(() => {
					$('.btn-scroll-down').addClass('loaded');
					toLoad();
				}, 1500);
				if (window.location.hash != '') {
					const $target = $('#block' + window.location.hash.replace('#', ''));
					runBodyScroll($target);
				}
			}, 750);
		});

		// Init Services
		$('#services').each(() => {
			setTimeout(() => {
				$('#block1 .card-container').addClass('loaded');
				setTimeout(() => {
					$('.btn-scroll-down').addClass('loaded');
					toLoad();
				}, 1500);
			}, 750);
		});

		// Init Portfolio
		$('#portfolio').each(() => {
			setTimeout(() => {
				$('#block1 > .centered .framed-block').addClass('loaded');
				toLoad();
			}, 950);
		});

		// Init Gallery
		$('#gallery').each(() => {
			setTimeout(() => {
				$('#slider-container-squares .card-container').addClass('loaded');
				toLoad();
			}, 750);
		});

		// Init Contact
		$('#contact').each(() => {
			setTimeout(() => {
				$('#block1 > .centered .framed-block').addClass('loaded');
				toLoad();
			}, 950);
		});

		// Init Tips
		$('#tips').each(() => {
			setTimeout(() => {
				$('#block1 .bullet').addClass('loaded');
				setTimeout(() => {
					$('#block1 .sidebar .card-container').addClass('loaded');
					toLoad();
					if (window.location.hash != '') {
						const $target = $('#tips' + window.location.hash.replace('#', ''));
						runBodyScroll($target);
					}
				}, 100);
			}, 250);
		});
	});
});

$(window).resize(() => {
	positionContent(isMobile, aboutTimeout, infiniteSliderSquares, currentScroll);
});

$(window).scroll(() => {
	scrollContent(isMobile, aboutTimeout, infiniteSliderSquares, currentScroll);
});
