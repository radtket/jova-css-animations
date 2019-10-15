function scrollContent(
	isMobile,
	aboutTimeout,
	infiniteSliderSquares,
	currentScroll
) {
	var totalScroll = $(document).height() - $(window).height();

	let newScroll = $(window).scrollTop();

	// Loading
	if (!isMobile) {
		$('.to-load').each(function() {
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
		$('.parallax').each(function() {
			var textScroll = $(this).offset().top - newScroll;
			var tempScroll = $(this).offset().top - newScroll;
			var percTranslate = tempScroll / $(this).height();

			// Set Limits
			if (tempScroll < -$(this).height()) {
				tempScroll = -$(this).height();
			}

			if (tempScroll > $(this).height()) {
				tempScroll = $(this).height();
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
				$('.parallax').removeClass('active');
				$('.text-grid', $('.parallax')).removeClass('visible');
				$('.text-grid .line', $('.parallax')).removeClass('loaded');
				// Reload
				var object = $(this);
				object.addClass('active');
				clearTimeout(aboutTimeout);
				aboutTimeout = setTimeout(function() {
					$('.text-grid', object).addClass('visible');
					$('.text-grid .line', object).addClass('loaded');
				}, 750);
			}
		});
	}

	// Parallax Icons
	if (!isMobile) {
		$('.parallax-icon').each(function() {
			var textScroll =
				($(this)
					.parent()
					.offset().top -
					(newScroll + $(window).height())) *
				0.5;
			if ($(this).hasClass('icon-2'))
				textScroll =
					($(this)
						.parent()
						.offset().top -
						(newScroll + $(window).height())) *
					0.75;
			if ($(this).hasClass('icon-10'))
				textScroll =
					($(this)
						.parent()
						.offset().top -
						(newScroll + $(window).height())) *
					0.25;
			$(this).css({
				transform: 'translate(0, ' + -textScroll + 'px)',
				'-webkit-transform': 'translate(0, ' + -textScroll + 'px)',
			});
		});
	}

	// Scroll Slider Squares
	$('.no-slider').each(function() {
		var sliderPos = 0;
		if (newScroll + $(window).height() > $(this).offset().top)
			sliderPos = $(this).offset().top - (newScroll + $(window).height());

		$('#slider-container-squares').css('top', sliderPos);
		$('#slider-container-squares .slider').css({ top: -sliderPos * 0.75 });
	});

	// Homepage Fake Header
	if (!isMobile) {
		$('#homepage').each(function() {
			var tempHeader = $('#block1 .card-container');

			// Hide Header
			if (newScroll < tempHeader.offset().top + tempHeader.height()) {
				$('#header_btn-menu').addClass('no-menu');
				if ($('#header').hasClass('opened')) $('#header').trigger('click');
			}
			// Show Header
			else if (!$('#header').hasClass('opened'))
				$('#header_btn-menu').removeClass('no-menu');
		});
	}

	// Homepage Blur
	$('#slider-container-squares .active .blur').each(function() {
		var tempOpacity = (newScroll * 1.5) / $(window).height();
		$(this).css('opacity', tempOpacity);
	});

	$('#slider-container-squares').each(function() {
		if (newScroll > 10) infiniteSliderSquares.stop(infiniteSliderSquares);
		else infiniteSliderSquares.start(infiniteSliderSquares);
	});

	// Tips - Sidebar
	$('#tips .sidebar').each(function() {
		var newPos = newScroll;
		if (
			newScroll + $(this).height() + parseInt($(this).css('top'), 10) >
			$('#block1').height() - 210
		)
			newPos =
				newScroll -
				(newScroll +
					$(this).height() +
					parseInt($(this).css('top'), 10) -
					($('#block1').height() - 210));

		$(this).css({
			transform: 'translate(0, ' + newPos + 'px)',
			'-webkit-transform': 'translate(0, ' + newPos + 'px)',
		});
	});

	$('#tips #block1 .listing').each(function() {
		var currentIndex = $('#tips #block1 .sidebar ul li.active').index();
		var newIndex = $('#tips #block1 .sidebar ul li.active').index();

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
	$('#footer').each(() => {
		var tempScroll = 220;
		if (newScroll > totalScroll - 220)
			tempScroll = 220 - (newScroll - (totalScroll - 220));

		$('> .centered', $('#footer')).css({
			transform: 'translate(0, ' + tempScroll + 'px)',
			'-webkit-transform': 'translate(0, ' + tempScroll + 'px)',
		});
	});

	currentScroll = newScroll;
}

export default scrollContent;
