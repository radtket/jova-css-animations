import $ from 'jquery';
import { isLoaded } from '../modules/helpers';
import triggerScroll from '../modules/triggerScroll';

const initTips = isMobile => {
	const $tips = $('#tips');
	setTimeout(() => {
		isLoaded($('#block1 .bullet', $tips));
		setTimeout(() => {
			isLoaded($('#block1 .sidebar .card-container', $tips));
			if (isMobile) {
				isLoaded($('.to-load', $tips));
			}
			triggerScroll('#tips', $tips);
		}, 100);
	}, 250);
};

export default initTips;
