import scrollContent from './scrollContent';
var $wrapper = $('#wrapper');
var $footer = $('#footer');
var $valign = $('.valign');
var $fullHeight = $('.full-height');
var $imgFit = $('.img-fit');

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
		var bgMain = $(this);
		var wrapper = $(this).parent();
		var wrapperWidth = wrapper.width();
		if ($(this).parents('.section-header').length == 0 && wrapperWidth < 1920)
			wrapperWidth = 1920;
		var wrapperHeight = wrapper.height();

		var bgMainSizes = $(this)
			.attr('data-size')
			.split('|');
		var bgMainRatio = bgMainSizes[0] / bgMainSizes[1];
		var wrapperRatio = wrapperWidth / wrapperHeight;

		if (bgMainRatio > wrapperRatio) {
			bgMain
				.height(wrapperHeight)
				.width(wrapperHeight * bgMainRatio)
				.css('left', wrapperWidth / 2 - (wrapperHeight * bgMainRatio) / 2);
			// .css('top','0');
		} else {
			bgMain
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

export default positionContent;
