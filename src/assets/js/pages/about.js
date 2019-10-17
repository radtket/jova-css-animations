import $ from 'jquery';
import { isLoaded } from '../modules/helpers';
import triggerScroll from '../modules/triggerScroll';

const initAbout = (isMobile, currentScroll) => {
	const $aboutpage = $('#about');
	$('#block1', $aboutpage).addClass('active');
	$('#block1 .text-grid', $aboutpage).addClass('visible');
	isLoaded($('#block1 .text-grid .line', $aboutpage));

	setTimeout(() => {
		isLoaded($('.img', $aboutpage));
	}, 250);

	setTimeout(() => {
		isLoaded($('#block1 .card-container', $aboutpage));

		setTimeout(() => {
			isLoaded($('.btn-scroll-down', $aboutpage));

			if (isMobile) {
				isLoaded($('.to-load', $aboutpage));
			}
		}, 1500);

		triggerScroll('#block', currentScroll);
	}, 750);
};

export default initAbout;
