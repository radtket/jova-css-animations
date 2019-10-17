import $ from 'jquery';
import { isLoaded } from '../modules/helpers';
const $homepage = $('#homepage');

const initHome = isMobile =>
	setTimeout(() => {
		isLoaded($('#block1 .card-container', $homepage));
		setTimeout(() => {
			isLoaded($('.btn-scroll-down', $homepage));
			if (isMobile) {
				isLoaded($('.to-load', $homepage));
			}
		}, 1500);
	}, 750);

export default initHome;
