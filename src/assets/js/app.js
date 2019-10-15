import whichBrowser from './modules/whichBrowser';
import initializeMap from './modules/initializeMap';
const $wrapper = $('#wrapper');
const $btnHeader = $('#header_btn-menu');
const $header = $('#header');
const $footer = $('#footer');
const $valign = $('.valign');
const $fullHeight = $('.full-height');
const $imgFit = $('.img-fit');
const $toLoad = $('.to-load');
const $parallax = $('.parallax');
const $parallaxIcon = $('.parallax-icon');
let isMobile = false;
let isAnimationRunning = false;
var currentScroll = -1;
var infiniteSliderSquares;
const currentBrowser = whichBrowser();
var aboutTimeout;

$('html,body').scrollTop(0);

function scrollContent() {
	var totalScroll = $(document).height() - $(window).height();
	var newScroll = $(window).scrollTop();

	// Loading
	if (!isMobile) {
		$toLoad.each(function() {
			var object = $(this);

			if (newScroll + $(window).height() * 0.85 > $(this).offset().top) {
				object.removeClass('no-anim');
				object.addClass('loaded');
			} else if (newScroll + $(window).height() < $(this).offset().top) {
				object.addClass('no-anim');
				object.removeClass('loaded');
			}
		});
	}

	// Parallax
	if (!isMobile) {
		$parallax.each(function() {
			let textScroll = $(this).offset().top - newScroll;
			let tempScroll = $(this).offset().top - newScroll;
			const parallaxHeight = $(this).height();
			// Get Percentage
			let percTranslate = tempScroll / parallaxHeight;
			// Set Limits
			if (tempScroll < -parallaxHeight) {
				tempScroll = -parallaxHeight;
			}

			if (tempScroll > parallaxHeight) {
				tempScroll = parallaxHeight;
			}

			// Cards and Images
			$('.card-container.card2', this).css({
				transform: 'translate(0, ' + 150 * -percTranslate + 'px)',
				'-webkit-transform': 'translate(0, ' + 150 * -percTranslate + 'px)',
			});

			$('.img', this).css({
				transform: 'translate(0, ' + 550 * -percTranslate + 'px)',
				'-webkit-transform': 'translate(0, ' + 550 * -percTranslate + 'px)',
			});

			// Text Grid
			$('.text-grid', this).css({
				transform: 'translate(0, ' + -textScroll + 'px)',
				'-webkit-transform': 'translate(0, ' + -textScroll + 'px)',
			});

			// Make Active
			if (
				newScroll + $(window).height() * 0.5 > $(this).offset().top &&
				newScroll + $(window).height() * 0.5 <
					$(this).offset().top + $(this).height() &&
				!$(this).hasClass('active')
			) {
				// Unload
				$parallax.removeClass('active');
				$('.text-grid', $parallax).removeClass('visible');
				$('.text-grid .line', $parallax).removeClass('loaded');

				// Reload
				const object = $(this);
				console.log({ object });
				object.addClass('active');
				clearTimeout(aboutTimeout);
				aboutTimeout = setTimeout(() => {
					$('.text-grid', object).addClass('visible');
					$('.text-grid .line', object).addClass('loaded');
				}, 750);
			}
		});
	}

	// Parallax Icons
	if (!isMobile) {
		$parallaxIcon.each(function() {
			const scrollBase =
				$(this)
					.parent()
					.offset().top -
				(newScroll + $(window).height());

			let textScroll = scrollBase * 0.5;

			if ($(this).hasClass('icon-2')) {
				textScroll = scrollBase * 0.75;
			}

			if ($(this).hasClass('icon-10')) {
				textScroll = scrollBase * 0.25;
			}

			$(this).css({
				transform: 'translate(0, ' + -textScroll + 'px)',
				'-webkit-transform': 'translate(0, ' + -textScroll + 'px)',
			});
		});
	}

	// Scroll Slider Squares
	$('.no-slider').each(function() {
		var sliderPos = 0;
		const windowHeight = $(window).height();
		const fromBottom = $(this).offset().top;

		if (newScroll + windowHeight > fromBottom) {
			sliderPos = fromBottom - (newScroll + windowHeight);
		}

		$('#slider-container-squares').css('top', sliderPos);
		$('#slider-container-squares .slider').css({ top: -sliderPos * 0.75 });
	});

	// Homepage Fake Header
	if (!isMobile) {
		$('#homepage').each(function() {
			var tempHeader = $('#block1 .card-container');

			// Hide Header
			if (newScroll < tempHeader.offset().top + tempHeader.height()) {
				$btnHeader.addClass('no-menu');

				if ($header.hasClass('opened')) {
					$header.trigger('click');
				}
			}

			// Show Header
			else if (!$header.hasClass('opened')) {
				$btnHeader.removeClass('no-menu');
			}
		});
	}

	// Homepage Blur
	$('#slider-container-squares .active .blur').each(function() {
		const tempOpacity = (newScroll * 1.5) / $(window).height();
		$(this).css('opacity', tempOpacity);
	});

	$('#slider-container-squares').each(function() {
		if (newScroll > 10) {
			infiniteSliderSquares.stop(infiniteSliderSquares);
		} else {
			infiniteSliderSquares.start(infiniteSliderSquares);
		}
	});

	// Tips - Sidebar
	$('#tips .sidebar').each(function() {
		var newPos = newScroll;
		if (
			newScroll + $(this).height() + parseInt($(this).css('top')) >
			$('#block1').height() - 210
		)
			newPos =
				newScroll -
				(newScroll +
					$(this).height() +
					parseInt($(this).css('top')) -
					($('#block1').height() - 210));

		$(this).css({
			transform: 'translate(0, ' + newPos + 'px)',
			'-webkit-transform': 'translate(0, ' + newPos + 'px)',
		});
	});

	$('#tips #block1 .listing').each(function() {
		const currentIndex = $('#tips #block1 .sidebar ul li.active').index();
		let newIndex = $('#tips #block1 .sidebar ul li.active').index();

		$('> li', this).each(function() {
			if (newScroll + $(window).height() / 2 > $(this).offset().top) {
				newIndex = $(this).index();
			}
		});

		if (newIndex != currentIndex) {
			$('#tips #block1 .sidebar ul li.active').removeClass('active');
			$('#tips #block1 .sidebar ul li')
				.eq(newIndex)
				.addClass('active');
		}
	});

	// Scroll Buttons
	$('.btn-scroll-down').each(function() {
		if (newScroll > 10) {
			$(this).addClass('hidden');
		} else {
			$(this).removeClass('hidden');
		}
	});

	// Demask Footer
	$footer.each(function() {
		let tempScroll = 220;
		if (newScroll > totalScroll - 220)
			tempScroll = 220 - (newScroll - (totalScroll - 220));

		$('> .centered', $footer).css({
			transform: 'translate(0, ' + tempScroll + 'px)',
			'-webkit-transform': 'translate(0, ' + tempScroll + 'px)',
		});
	});

	currentScroll = newScroll;
}

function positionContent() {
	// Full Height
	$fullHeight.height($(window).height());
	$('.divided-block').each(function() {
		$('.centered > div', this).css('min-height', $(window).height());
	});

	// Centered Vertically
	$valign.each(function() {
		$(this).css(
			'padding-top',
			$(this)
				.parent()
				.height() /
				2 -
				$(this).height() / 2
		);
	});

	// Fit Images
	$imgFit.each(function() {
		let backgroundMain = $(this);
		let wrapper = $(this).parent();
		let wrapperWidth = wrapper.width();
		let wrapperHeight = wrapper.height();
		let bgMainSizes = $(this)
			.attr('data-size')
			.split('|');
		let bgMainRatio = bgMainSizes[0] / bgMainSizes[1];
		let wrapperRatio = wrapperWidth / wrapperHeight;

		if ($(this).parents('.section-header').length == 0 && wrapperWidth < 1920) {
			wrapperWidth = 1920;
		}

		if (bgMainRatio > wrapperRatio) {
			backgroundMain
				.height(wrapperHeight)
				.width(wrapperHeight * bgMainRatio)
				.css('left', wrapperWidth / 2 - (wrapperHeight * bgMainRatio) / 2);
			// .css('top','0');
		} else {
			backgroundMain
				.width(wrapperWidth)
				.height(wrapperWidth / bgMainRatio)
				.css('left', '0');
			// .css('top',(wrapperHeight/2 - (wrapperWidth / bgMainRatio)/2));
		}
	});

	// Adjust Text Grids
	$('.text-grid').each(function() {
		var model = $('.line:eq(0) > div:eq(0)', this).width();

		$('.line > div', this).height(model);
		$(this).css('margin-top', -model / 2);
	});

	// Portfolio
	$(
		'#wrapper #portfolio > #block1 > .centered .framed-block .content > .left-block .intro'
	).each(function() {
		$(this).height(
			$(
				'#wrapper #portfolio > #block1 > .centered .framed-block .content > .right-block .intro'
			).height()
		);
	});

	// About - Button Scroll
	$('.btn-scroll-down.about').each(function() {
		$(this).css('left', $('#about #block1 > .centered').offset().left);
	});

	// Contact
	$('#contact > #block1 > .centered .framed-block .content > .left-block').each(
		function() {
			$('ul', this).height(
				$(
					'#contact > #block1 > .centered .framed-block .content > .right-block ul'
				).height()
			);
			$('.sectors', this).height(
				$(
					'#contact > #block1 > .centered .framed-block .content > .right-block .sectors'
				).height()
			);
		}
	);

	// Services Adjust Columns Height
	$('#services').each(function() {
		$('#block3 .left-block > div').height(
			$('#block3 .right-block > div').height()
		);
	});

	// Tips
	$('#tips').each(function() {
		$('.slider-container > .slider > ul > li > div > div', this).width(
			$('.slider-container > .slider > ul > li > div > div img').width() - 1
		);
	});

	// Resize Footer
	$wrapper.css('padding-bottom', $footer.height());

	scrollContent();
}

$(window).load(() => {
	if ($('body').hasClass('layout-mobile')) {
		isMobile = true;
	}

	//
	// General
	//

	// Anchor Buttons
	$('.btn-anchor').on('click', function() {
		if (!isAnimationRunning && !$(this).hasClass('active')) {
			const $target = $('#' + $(this).attr('data-anchor'));
			const scroll = Math.abs(currentScroll - $target.offset().top);
			const scrollTop = $target.offset().top;
			const scrollTime = scroll * 0.5;

			$('html,body').animate(
				{ scrollTop },
				scrollTime < 1250 ? 1250 : scrollTime,
				'easeInOutQuad'
			);
		}

		return false;
	});

	// Slider Squares
	$('#slider-container-squares').each(function() {
		if (currentBrowser == 'Safari' || isMobile) $(this).addClass('t-scale');
		else $(this).addClass('t-translate');

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
	$btnHeader.on('click', function() {
		$(this).addClass('hidden');
		$header.addClass('opened').fadeIn(450, function() {
			$('.card-container', this)
				.removeClass('no-anim')
				.addClass('loaded');
		});

		return false;
	});

	$header.on('click', function(event) {
		if (event.target.tagName == 'HEADER') {
			$header.removeClass('opened').fadeOut(450, function() {
				$btnHeader.removeClass('hidden');
				$('.card-container', this)
					.addClass('no-anim')
					.removeClass('loaded');
			});
		}
	});

	//
	// Home
	//

	// Slider Arrows in Header
	$('.card-container.home .btn-previous, .card-container.home .btn-next').on(
		'click',
		function() {
			var object = $(this);
			var delay = 1;
			if (currentScroll > 0) {
				delay = 750;
				$('html,body').animate({ scrollTop: 0 }, 750, 'easeInOutQuad');
			}

			setTimeout(function() {
				switch (object.attr('class')) {
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

	// Portfolio
	$('#portfolio .card-container > div > div').each(function() {
		var fixWidth = $('h2', this).outerWidth() + $('h3', this).outerWidth() + 1;
		$(this).width(fixWidth);
	});

	// Gallery

	// Change Image
	$(
		'#slider-container-squares .card-container .btn-previous, #slider-container-squares .card-container .btn-next'
	).on('click', function() {
		var object = $(this);

		switch (object.attr('class')) {
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
	$('#slider-container-squares .card-container .btn-menu a').on(
		'click',
		function() {
			$('#header_btn-menu').trigger('click');

			return false;
		}
	);

	// Open Infos
	$('#slider-container-squares .card-container .btn-infos a').on(
		'click',
		function() {
			var container = $(this).parents('.card-container');

			if (!isAnimationRunning) {
				isAnimationRunning = true;
				$(this)
					.parent()
					.fadeOut(450, function() {
						$(
							'#slider-container-squares .card-container .btn-infos-close'
						).fadeIn(450);
					});

				$('> div > div', container).width('auto');
				container.animate({ width: 585 }, 450, 'easeInOutQuad', function() {
					$('.infos', container).animate(
						{ height: $('.infos > .text', container).outerHeight() },
						550,
						'easeInOutQuad',
						function() {
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
			const container = $(this).parents('.card-container');

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

	//
	// Tips
	//

	var slidersArray = [];
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

	//
	// Contact
	//

	// Init Maps
	$('#contact .map > div').each(function() {
		var latitude = parseFloat($(this).attr('data-latitude'));
		var longitude = parseFloat($(this).attr('data-longitude'));
		var mapID = $(this).attr('id');

		initializeMap(latitude, longitude, mapID);
	});

	//
	// Init
	//

	positionContent();

	$('#loading-mask').fadeOut(750, function() {
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
					if (isMobile) $('.to-load').addClass('loaded');
				}, 1500);
			}, 750);
		});

		// Init About
		$('#about').each(function() {
			$('#block1').addClass('active');
			$('#block1 .text-grid').addClass('visible');
			$('#block1 .text-grid .line').addClass('loaded');
			setTimeout(function() {
				$('.img').addClass('loaded');
			}, 250);
			setTimeout(function() {
				$('#block1 .card-container').addClass('loaded');
				setTimeout(function() {
					$('.btn-scroll-down').addClass('loaded');
					if (isMobile) $('.to-load').addClass('loaded');
				}, 1500);
				if (window.location.hash != '') {
					var anchor = window.location.hash.replace('#', '');
					var $target = $('#block' + anchor);
					var scroll = Math.abs(currentScroll - $target.offset().top);
					var scrollVal = $target.offset().top;

					var scrollTime = scroll * 0.5;
					if (scrollTime < 1250) scrollTime = 1250;

					$('html,body').animate(
						{ scrollTop: scrollVal },
						scrollTime,
						'easeInOutQuad'
					);
				}
			}, 750);
		});

		// Init Services
		$('#services').each(function() {
			setTimeout(function() {
				$('#block1 .card-container').addClass('loaded');
				setTimeout(function() {
					$('.btn-scroll-down').addClass('loaded');
					if (isMobile) $('.to-load').addClass('loaded');
				}, 1500);
			}, 750);
		});

		// Init Portfolio
		$('#portfolio').each(function() {
			setTimeout(function() {
				$('#block1 > .centered .framed-block').addClass('loaded');
				if (isMobile) $('.to-load').addClass('loaded');
			}, 950);
		});

		// Init Gallery
		$('#gallery').each(function() {
			setTimeout(function() {
				$('#slider-container-squares .card-container').addClass('loaded');
				if (isMobile) $('.to-load').addClass('loaded');
			}, 750);
		});

		// Init Contact
		$('#contact').each(() => {
			setTimeout(() => {
				$('#block1 > .centered .framed-block').addClass('loaded');
				if (isMobile) $('.to-load').addClass('loaded');
			}, 950);
		});

		// Init Tips
		$('#tips').each(function() {
			setTimeout(function() {
				$('#block1 .bullet').addClass('loaded');
				setTimeout(function() {
					$('#block1 .sidebar .card-container').addClass('loaded');
					if (isMobile) $('.to-load').addClass('loaded');
					if (window.location.hash != '') {
						var anchor = window.location.hash.replace('#', '');
						var $target = $('#tips' + anchor);
						var scroll = Math.abs(currentScroll - $target.offset().top);
						var scrollVal = $target.offset().top;

						var scrollTime = scroll * 0.5;
						if (scrollTime < 1250) scrollTime = 1250;

						$('html,body').animate(
							{ scrollTop: scrollVal },
							scrollTime,
							'easeInOutQuad'
						);
					}
				}, 100);
			}, 250);
		});
	});
});

//
// Window Functions
//

$(window).resize(() => {
	positionContent();
});

$(window).scroll(() => {
	scrollContent();
});
