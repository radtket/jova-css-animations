import $ from 'jquery';
import { isLoaded } from '../modules/helpers';

const initServices = isMobile => {
	const $services = $('#services');
	setTimeout(() => {
		isLoaded($('#block1 .card-container', $services));
		setTimeout(() => {
			isLoaded($('.btn-scroll-down', $services));
			if (isMobile) {
				isLoaded($('.to-load', $services));
			}
		}, 1500);
	}, 750);
};

export default initServices;
