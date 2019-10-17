import $ from 'jquery';
import InfiniteSliderHome from './modules/infiniteSliderHome';
import whichBrowser from './modules/whichBrowser';
import InfiniteSlider from './modules/infiniteSlider';
import initializeMap from './modules/initializeMap';

// Pages
import initAbout from './pages/about';
import initContact from './pages/contact';
import initGallery from './pages/gallery';
import initHome from './pages/home';
import initProfile from './pages/portfolio';
import initServices from './pages/services';
import initTips from './pages/tips';

// Components
const $btnHeader = $('#header_btn-menu');
const $header = $('#header');
const $footer = $('#footer');
const $toLoad = $('.to-load');
const $parallax = $('.parallax');

let isMobile = false;
let isAnimationRunning = false;

const isLoaded = qs => qs.addClass('loaded');
const currentBrowser = whichBrowser();
let currentScroll = -1;
let aboutTimeout;

const infiniteSliderSquares = new InfiniteSliderHome(
	$('#slider-container-squares'),
	2000,
	6000,
	'css',
	'easeOutQuad',
	false,
	true
);

function scrollContent() {
	const windowHeight = $(window).height();
	const totalScroll = $(document).height() - windowHeight;
	const newScroll = $(window).scrollTop();
	const scrollHeight = newScroll + windowHeight;

	if (!isMobile) {
		// Loading
		$toLoad.each(function() {
			const object = $(this);
			const offset = object.offset().top;

			if (scrollHeight * 0.85 > offset) {
				object.removeClass('no-anim');
				isLoaded(object);
			} else if (scrollHeight < offset) {
				object.addClass('no-anim');
				object.removeClass('loaded');
			}
		});

		// Parallax
		$parallax.each(function() {
			const parallaxHeight = $(this).height();
			const parallaxOffset = $(this).offset().top;
			const textScroll = parallaxOffset - newScroll;
			let tempScroll = textScroll;
			const percTranslate = tempScroll / parallaxHeight;
			const scollHalfWay = newScroll + windowHeight * 0.5;

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
				scollHalfWay > parallaxOffset &&
				scollHalfWay < parallaxOffset + parallaxHeight &&
				!$(this).hasClass('active')
			) {
				// Unload
				$parallax.removeClass('active');
				$('.text-grid', $parallax).removeClass('visible');
				$('.text-grid .line', $parallax).removeClass('loaded');

				// Reload
				const object = $(this);
				object.addClass('active');
				clearTimeout(aboutTimeout);
				aboutTimeout = setTimeout(() => {
					$('.text-grid', object).addClass('visible');
					isLoaded($('.text-grid .line', object));
				}, 750);
			}
		});

		// Parallax Icons
		$('.parallax-icon').each(function() {
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

		// Homepage
		$('#homepage').each(() => {
			const tempHeader = $('#block1 .card-container');
			const isHeaderInViewport =
				newScroll < tempHeader.offset().top + tempHeader.height();

			// Hide Header
			if (isHeaderInViewport) {
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

	// Scroll Slider Squares
	$('.no-slider').each(function() {
		const fromBottom = $(this).offset().top;
		const sliderPos =
			newScroll + windowHeight > fromBottom ? fromBottom - scrollHeight : 0;

		$('#slider-container-squares').css('top', sliderPos);
		$('#slider-container-squares .slider').css({ top: -sliderPos * 0.75 });
	});

	// Homepage Blur
	$('#slider-container-squares .active .blur').each(function() {
		$(this).css('opacity', (newScroll * 1.5) / windowHeight);
	});

	if (infiniteSliderSquares.running !== undefined) {
		if (newScroll > 10) {
			infiniteSliderSquares.running = false;
		} else {
			infiniteSliderSquares.running = true;
		}
	}

	// Tips - Sidebar
	const sidebar = $('#tips .sidebar');
	const sidebarHeight = sidebar.height();
	const sidebarOffset = parseInt(sidebar.css('top'), 10);

	const one = newScroll + sidebarHeight + sidebarOffset;
	const two = $('#tips #block1').height() - 210;

	const sidebarTransform =
		one > two
			? newScroll - (newScroll + sidebarHeight + sidebarOffset - two)
			: newScroll;

	sidebar.css({
		transform: 'translate(0, ' + sidebarTransform + 'px)',
		'-webkit-transform': 'translate(0, ' + sidebarTransform + 'px)',
	});

	const tipsListing = $('#tips #block1 .listing');
	const sidebarNav = $('#tips #block1 .sidebar ul');
	const activeNavItem = $('> li.active', sidebarNav);
	const currentIndex = activeNavItem.index();
	let newIndex = currentIndex;

	$('> li', tipsListing).each(function() {
		if (newScroll + windowHeight / 2 > $(this).offset().top) {
			newIndex = $(this).index();
		}
	});

	if (newIndex !== currentIndex) {
		activeNavItem.removeClass('active');
		$('> li', sidebarNav)
			.eq(newIndex)
			.addClass('active');
	}

	// Scroll Buttons
	if (newScroll > 10) {
		$('.btn-scroll-down').addClass('hidden');
	} else {
		$('.btn-scroll-down').removeClass('hidden');
	}

	// Demask Footer
	const footerScroll =
		newScroll > totalScroll - 220
			? 220 - (newScroll - (totalScroll - 220))
			: 220;
	$('> .centered', $footer).css({
		transform: 'translate(0, ' + footerScroll + 'px)',
		'-webkit-transform': 'translate(0, ' + footerScroll + 'px)',
	});

	currentScroll = newScroll;
}

function positionContent() {
	// Full Height
	$('.full-height').height($(window).height());

	// Centered Vertically
	$('.valign').css(
		'padding-top',
		$('.valign')
			.parent()
			.height() /
			2 -
			$('.valign').height() / 2
	);

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
	// !NOTE: weird but on portfolio page if this isnt in loop
	$('.btn-scroll-down.about').each(function() {
		$(this).css('left', $('#about #block1 > .centered').offset().left);
	});

	// Contact
	const contactBlock = $(
		'#wrapper #contact > #block1 > .centered .framed-block .content'
	);
	contactBlock.each(function() {
		$('ul', this).height($(' > .right-block ul', contactBlock).height());
		$('.sectors', this).height(
			$(' > .right-block .sectors', contactBlock).height()
		);
	});

	// Services Adjust Columns Height
	$('#services #block3 .left-block > div').height(
		$('#services #block3 .right-block > div').height()
	);

	// Tips
	$('#tips .slider-container > .slider > ul > li > div > div').width(
		$('#tips .slider-container > .slider > ul > li > div > div img').width() - 1
	);

	// Resize Footer
	$('#wrapper').css('padding-bottom', $footer.height());

	scrollContent();
}

$(window).load(() => {
	if ($('body').hasClass('layout-mobile')) {
		isMobile = true;
	}

	// Anchor Buttons
	$('.btn-anchor').on('click', function(e) {
		e.preventDefault();
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
	});

	// Slider Squares
	if (currentBrowser === 'Safari' || isMobile) {
		$('#slider-container-squares').addClass('t-scale');
	} else {
		$('#slider-container-squares').addClass('t-translate');
	}

	// Header
	$btnHeader.on('click', function(e) {
		e.preventDefault();
		$(this).addClass('hidden');
		$header.addClass('opened').fadeIn(450, function() {
			$('.card-container', this)
				.removeClass('no-anim')
				.addClass('loaded');
		});
	});

	$header.on('click', function({ target }) {
		if (target.tagName === 'HEADER') {
			$header.removeClass('opened').fadeOut(450, function() {
				$btnHeader.removeClass('hidden');
				$('.card-container', this)
					.addClass('no-anim')
					.removeClass('loaded');
			});
		}
	});

	const handleHomeSliderArrows = btn => {
		const delay = currentScroll > 0 ? 750 : 1;
		console.log({ delay });
		if (currentScroll > 0) {
			$('html,body').animate({ scrollTop: 0 }, delay, 'easeInOutQuad');
		}

		setTimeout(() => {
			$(btn).trigger('click');
		}, delay);
	};

	// Slider Arrows in Header
	$('.card-container.home .btn-previous').on('click', e => {
		e.preventDefault();
		handleHomeSliderArrows(
			'#slider-container-squares .slider-arrows .previous a'
		);
	});

	// Portfolio
	$('#portfolio .card-container > div > div').each(function() {
		const fixWidth =
			$('h2', this).outerWidth() + $('h3', this).outerWidth() + 1;
		$(this).width(fixWidth);
	});

	// Gallery

	// Change Image
	$('.card-container.home .btn-next').on('click', e => {
		e.preventDefault();
		handleHomeSliderArrows('#slider-container-squares .slider-arrows .next a');
	});

	const cardContainer = $('#slider-container-squares .card-container');

	// Open Menu
	$('.btn-menu a', cardContainer).on('click', e => {
		e.preventDefault();
		$btnHeader.trigger('click');
	});

	// Open Infos
	$('.btn-infos a', cardContainer).on('click', function(e) {
		e.preventDefault();
		const container = $(this).parents('.card-container');

		if (!isAnimationRunning) {
			isAnimationRunning = true;

			$(this)
				.parent()
				.fadeOut(450, () => $('.btn-infos-close', cardContainer).fadeIn(450));
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
	});

	// Close Infos
	$('.btn-infos-close a', cardContainer).on('click', function(e) {
		e.preventDefault();
		const container = $(this).parents('.card-container');

		if (!isAnimationRunning) {
			isAnimationRunning = true;
			$(this)
				.parent()
				.fadeOut(450, () => {
					$('.btn-infos', cardContainer).fadeIn(450);
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
	});

	// Tips
	$('#tips .slider-container').each(function() {
		const sliderListItem = $('.slider > ul > li', this);
		if (sliderListItem.length > 1) {
			new InfiniteSlider(
				$(this),
				1500,
				4000,
				'slide',
				'easeInOutQuint',
				false,
				false
			);
		} else {
			$(this).addClass('disabled');
		}

		$('> div', sliderListItem).on('click', function() {
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

		if (window.google) {
			initializeMap(latitude, longitude, mapID);
		}
	});

	// Init
	positionContent();

	// Loading Mask
	$('#loading-mask').fadeOut(750, () => {
		// Init Header
		setTimeout(() => {
			isLoaded($btnHeader);
		}, 450);

		// Init Pages
		initAbout(isMobile, currentScroll);
		initContact(isMobile);
		initGallery(isMobile);
		initHome(isMobile);
		initProfile(isMobile);
		initServices(isMobile);
		initTips(isMobile);
	});
});

$(window).resize(() => {
	positionContent();
});

$(window).scroll(() => {
	scrollContent();
});

$(document).ready(() => {
	$('html,body').scrollTop(0);
});
