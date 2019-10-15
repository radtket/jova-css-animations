import scrollContent from './scrollContent';

function positionContent(
	isMobile,
	aboutTimeout,
	infiniteSliderSquares,
	currentScroll
) {
	// Full Height
	const wrapper = document.querySelector('#wrapper');
	const footer = document.querySelector('#footer');
	const fullHeight = document.querySelector('.full-height');

	const windowHeight = `${window.innerHeight}px`;
	fullHeight.style.height = windowHeight;

	// ! Can't Find
	// $('.divided-block').each(function() {
	// 	$('.centered > div', this).css('min-height', windowHeight);
	// });

	// Centered Vertically
	// ! only on services-offered.htnl
	// $('.valign').each(function() {
	// 	$(this).css(
	// 		'padding-top',
	// 		$(this)
	// 			.parent()
	// 			.height() /
	// 			2 -
	// 			$(this).height() / 2
	// 	);
	// });

	// Fit Images
	// $('.img-fit').each(function() {
	// 	var bgMain = $(this);
	// 	var wrapper = $(this).parent();
	// 	var wrapperWidth = wrapper.width();
	// 	if ($(this).parents('.section-header').length == 0 && wrapperWidth < 1920)
	// 		wrapperWidth = 1920;
	// 	var wrapperHeight = wrapper.height();

	// 	var bgMainSizes = $(this)
	// 		.attr('data-size')
	// 		.split('|');
	// 	var bgMainRatio = bgMainSizes[0] / bgMainSizes[1];
	// 	var wrapperRatio = wrapperWidth / wrapperHeight;

	// 	if (bgMainRatio > wrapperRatio) {
	// 		bgMain
	// 			.height(wrapperHeight)
	// 			.width(wrapperHeight * bgMainRatio)
	// 			.css('left', wrapperWidth / 2 - (wrapperHeight * bgMainRatio) / 2);
	// 		// .css('top','0');
	// 	} else {
	// 		bgMain
	// 			.width(wrapperWidth)
	// 			.height(wrapperWidth / bgMainRatio)
	// 			.css('left', '0');
	// 		// .css('top',(wrapperHeight/2 - (wrapperWidth / bgMainRatio)/2));
	// 	}
	// });

	// Adjust Text Grids

	Array.from(document.querySelectorAll('.text-grid')).forEach(item => {
		const model = item.querySelector('.line:first-child > div:first-child')
			.offsetWidth;

		Array.from(item.querySelectorAll('.line > div')).forEach(line => {
			const { style } = line;
			style.height = `${model}px`;
		});

		const { style } = item;
		style.marginTop = `${-model / 2}px`;
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

	const { offsetHeight: footerHeight } = footer;
	wrapper.style.paddingBottom = `${footerHeight}px`;

	scrollContent(isMobile, aboutTimeout, infiniteSliderSquares, currentScroll);
}

export default positionContent;
