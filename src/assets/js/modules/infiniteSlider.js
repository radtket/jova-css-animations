import $ from './easing';

function InfiniteSlider(
	wrapperArg,
	speedArg,
	durationArg,
	modeArg,
	easingArg,
	hoverArg,
	animationArg
) {
	const $infiniteSlider = this;

	// If true : running
	this.animated = false;
	// Autorotation
	this.hover = hoverArg;
	this.autorotation = animationArg;
	this.running = true;
	this.t = null;
	// Setting the container and controller
	this.wrapper = $(wrapperArg);
	this.container = $('.slider', this.wrapper);
	this.arrows = $('.slider-arrows', this.wrapper);
	this.count = $('.count', this.arrows);
	this.controls = $('.slider-controls', this.wrapper);
	this.infos = $('.slider-infos', this.wrapper);
	this.speed = speedArg;
	this.duration = durationArg;
	this.mode = modeArg; // slide - slidev - fade - demask
	this.easing = easingArg;
	this.width = this.container.width();
	this.height = this.container.height();
	// Setting index : slide ordered index || indexSlide : slide real index
	this.index = 0;
	this.indexSlide = 0;
	// Number of elements
	this.length = $('li', this.container).length - 1;

	const {
		arrows,
		arrowsClick,
		container,
		controls,
		controlsClick,
		count,
		hover,
		index,
		infos,
		length,
		reset,
		running,
		wrapper,
	} = this;

	// Identify each slide and control with initial order
	$('> ul > li', container).each(function() {
		const i = $(this).index();
		const slideIndex = i + 1;
		const isActive = i === 0 ? 'active' : 'inactive';
		const template = `<li class="${isActive}" data-slide="${slideIndex}"><a href="">Slide ${slideIndex}</a></li>`;
		$(this).attr('data-slide', slideIndex);
		$(this).addClass(isActive);
		$(controls).append(template);
	});

	$('li', controls).each(function() {
		const i = $(this).index();
		const slideIndex = i + 1;
		const isActive = i === 0 ? 'active' : 'inactive';

		$(this).attr('data-slide', slideIndex);
		$(this).addClass(isActive);
	});

	// Fill Count values
	$(count).html(index + 1 + ' / ' + (length + 1));

	// Fill First Infos
	if ($('> ul > li:eq(0)', container).attr('data-infos') != '') {
		$(infos).html($('> ul > li:eq(0)', this.container).attr('data-infos'));
	}

	// Disable if just one slide
	if (length === 0) {
		$(controls).hide();
		this.autorotation = false;
	}

	// Initiate Positioning
	this.reset($infiniteSlider);

	// Bind
	if (hover) {
		$(wrapper).mouseenter(() => {
			$infiniteSlider.stop($infiniteSlider);
		});
		$(wrapper).mouseleave(() => {
			$infiniteSlider.start($infiniteSlider);
		});
	}

	$('li a', controls).click(function(e) {
		e.preventDefault();
		controlsClick($(this), $infiniteSlider);
	});

	$('li a', arrows).click(function(e) {
		e.preventDefault();
		arrowsClick($(this), $infiniteSlider);
	});

	$(window).resize(() => {
		reset($infiniteSlider);
	});

	console.log(this, $infiniteSlider);

	// Start Autorotation
	if (running) {
		this.autoRotation($infiniteSlider);
	}
}

InfiniteSlider.prototype.autoRotation = $infiniteSlider => {
	clearTimeout($infiniteSlider.t);
	const {
		controls,
		autorotation,
		running,
		changeSlide,
		indexSlide,
		duration,
	} = $infiniteSlider;

	if ($('li', controls).length > 1 && autorotation && running) {
		$infiniteSlider.t = setTimeout(() => {
			changeSlide(indexSlide, indexSlide + 1, $infiniteSlider);
		}, duration);
	}
};

InfiniteSlider.prototype.start = $infiniteSlider => {
	$infiniteSlider.running = true;
	$infiniteSlider.autoRotation($infiniteSlider);

	return false;
};

InfiniteSlider.prototype.stop = $infiniteSlider => {
	clearTimeout($infiniteSlider.t);
	$infiniteSlider.running = false;

	return false;
};

InfiniteSlider.prototype.arrowsClick = (object, $infiniteSlider) => {
	const { animated, changeSlide, indexSlide } = $infiniteSlider;
	if (!animated) {
		$infiniteSlider.autorotation = false;
		// Stop timer
		clearTimeout($infiniteSlider.t);
		const clicked = $(object)
			.parent()
			.hasClass('next')
			? indexSlide + 1
			: indexSlide - 1;

		changeSlide(indexSlide, clicked, $infiniteSlider);
	}

	return false;
};

InfiniteSlider.prototype.controlsClick = (object, $infiniteSlider) => {
	const { animated, changeSlide, indexSlide, container } = $infiniteSlider;
	const listItem = $(object).parent();
	if (!animated && listItem.hasClass('active') === false) {
		$infiniteSlider.autorotation = false;
		// Stop timer
		clearTimeout($infiniteSlider.t);

		const clicked = listItem.index();

		$('> ul > li', container).each(function() {
			const listItemIndex = parseInt($(this).attr('data-slide'), 10);
			if (listItemIndex === clicked + 1) {
				changeSlide(indexSlide, $(this).index(), $infiniteSlider);
			}
		});
	}

	return false;
};

InfiniteSlider.prototype.reset = $infiniteSlider => {
	const { animated, mode, container, infos, start } = $infiniteSlider;
	if (!animated) {
		$infiniteSlider.stop($infiniteSlider);
		$infiniteSlider.width = container.width();
		$infiniteSlider.height = container.height();
		$('> ul > li', container).width($infiniteSlider.width);

		// Demask Specific
		if (mode === 'demask') {
			$('> ul > li.inactive', $infiniteSlider.container).width(0);
			$('> ul > li > img', $infiniteSlider.container).width(
				$infiniteSlider.width
			);
		}

		// Columns Specific
		if (mode === 'columns') {
			$('> ul > li > img', $infiniteSlider.container).each(function() {
				const backgroundNain = $(this);
				const wrapper = $(this).parent();
				const wrapperWidth = wrapper.width();
				const wrapperHeight = wrapper.height();
				const colWidth = parseInt(
					$(this)
						.parent()
						.attr('data-col-width'),
					10
				);
				let nbCols;
				let columnsContent = '';

				// Background Image
				const bgMainRatio = 1920 / 1080;
				const wrapperRatio = wrapperWidth / wrapperHeight;

				// Background Main
				if (bgMainRatio > wrapperRatio) {
					// Calculate Width depending on ColWidth
					let imgWidth = wrapperHeight * bgMainRatio;

					nbCols = Math.ceil(imgWidth / colWidth);

					if (nbCols % 2 != 1) {
						nbCols += 1;
					}

					imgWidth = nbCols * colWidth;

					// Resize Containers
					backgroundNain
						.width(imgWidth)
						.height(imgWidth / bgMainRatio)
						.css(
							'left',
							-(backgroundNain.width() / 2 - wrapperWidth / 2) + 'px'
						)
						.css(
							'top',
							-(backgroundNain.height() / 2 - wrapperHeight / 2) + 'px'
						);

					backgroundNain
						.siblings('.columns')
						.width(imgWidth)
						.height(imgWidth / bgMainRatio)
						.css(
							'left',
							-(backgroundNain.width() / 2 - wrapperWidth / 2) + 'px'
						)
						.css(
							'top',
							-(backgroundNain.height() / 2 - wrapperHeight / 2) + 'px'
						);
				} else {
					// Calculate Width depending on ColWidth
					let imgWidth = wrapperWidth;

					nbCols = Math.ceil(imgWidth / colWidth);

					if (nbCols % 2 != 1) {
						nbCols += 1;
					}

					imgWidth = nbCols * colWidth;

					const applyBgStyles = element =>
						element
							.width(imgWidth)
							.height(imgWidth / bgMainRatio)
							.css(
								'left',
								-(backgroundNain.width() / 2 - wrapperWidth / 2) + 'px'
							)
							.css(
								'top',
								-(backgroundNain.height() / 2 - wrapperHeight / 2) + 'px'
							);

					// Resize Containers
					applyBgStyles(backgroundNain);
					applyBgStyles(backgroundNain.siblings('.columns'));
				}

				// Fill Columns
				for (let i = 0; i < nbCols; i += 1) {
					const imgSrc = $(this)
						.parent()
						.attr('data-img-src');
					columnsContent += `<li><div><img src="${imgSrc} alt="" style="left: ${-i *
						colWidth}px; width: ${backgroundNain.width()}px; height: ${backgroundNain.height()}px"/></div></li>`;
				}

				backgroundNain.siblings('.columns').html(columnsContent);
			});
		}

		$(infos).css(
			'top',
			$(container).height() / 2 - $(infos).height() / 2 + 'px'
		);

		start($infiniteSlider);
	}
};

InfiniteSlider.prototype.changeSlide = (current, clicked, $infiniteSlider) => {
	const {
		autoRotation,
		container,
		controls,
		count,
		easing,
		infos,
		mode,
		running,
		speed,
		reset,
	} = $infiniteSlider;

	$infiniteSlider.animated = true;

	let direction = 'next';
	const listItem = $('> ul > li', container);

	if (clicked < current) {
		direction = 'previous';
	}

	// Check limits
	if (clicked > $infiniteSlider.length) {
		clicked = 0;
	} else if (clicked < 0) {
		clicked = $infiniteSlider.length;
	}

	// Redefine active slide
	listItem.removeClass('active').addClass('inactive');

	const listItemClicked = listItem.eq(clicked);

	listItemClicked.removeClass('inactive').addClass('active');

	$infiniteSlider.index =
		parseInt($('> ul > li.active', container).attr('data-slide'), 10) - 1;

	$infiniteSlider.indexSlide = $('> ul > li.active', container).index();

	// Redefine active control
	$('li', controls).removeClass('active');
	$('li', controls)
		.eq($infiniteSlider.index)
		.addClass('active');

	// Change Count
	$(count).html(
		$('> ul > li.active', container).attr('data-slide') +
			' / ' +
			($infiniteSlider.length + 1)
	);

	// Animate Infos
	$(infos).fadeOut(speed / 2, function() {
		$('> li', infos).hide();
		$('> li', infos)
			.eq(clicked)
			.show();
		$(this)
			.show()
			.css('opacity', '0');
		reset($infiniteSlider);
		$(this).animate({ opacity: 1 }, speed / 2);
	});

	const options = {
		duration: speed,
		easing,
		complete() {
			$infiniteSlider.animated = false;
			$('> ul > li.inactive', container).hide();
			if (running) {
				autoRotation($infiniteSlider);
			}
		},
	};

	const animateIt = (pos, widthOrHeight, dir) => {
		const opperator = dir === 'next' ? '-=' : '+=';
		const size = dir !== 'next' ? '-' : '';

		listItemClicked.css(pos, $infiniteSlider[widthOrHeight] + 'px').show();

		// Animate slides
		listItem.animate(
			{ [pos]: opperator + `${size}${$infiniteSlider[widthOrHeight]}` },
			options
		);
	};

	const activeListItem = $('> ul > li.active', container);

	const stopAnumation = () => {
		$infiniteSlider.animated = false;

		if (running) {
			autoRotation($infiniteSlider);
		}
	};

	// Animate Slides
	if (mode === 'slide') {
		animateIt('left', 'width', direction);
	} else if (mode === 'slidev') {
		animateIt('top', 'height', direction);
	} else if (mode === 'fade') {
		// Animate Slides
		activeListItem.fadeIn(speed, () => {
			listItem.eq(current).hide();
			stopAnumation();
		});
	} else if (mode === 'demask') {
		activeListItem.animate(
			{ width: $infiniteSlider.width },
			speed,
			easing,
			() => {
				$('> ul > li.inactive', container).width(0);
				stopAnumation();
			}
		);
	} else if (mode === 'columns') {
		const currentColumn = listItem.eq(current).find('.columns > li > div');
		listItemClicked.css('left', '0');

		currentColumn.animate({ width: 0 }, speed, easing, () => {
			listItem.eq(current).css('left', '100%');
			currentColumn.width('100%');
			stopAnumation();
		});
	}
};

export default InfiniteSlider;
