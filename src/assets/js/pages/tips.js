import $ from 'jquery';
import { isLoaded } from '../modules/helpers';
import triggerScroll from '../modules/triggerScroll';

const initTips = isMobile => {
	$('#tips').each(() => {
		setTimeout(() => {
			isLoaded($('#block1 .bullet'));
			setTimeout(() => {
				isLoaded($('#block1 .sidebar .card-container'));
				if (isMobile) {
					isLoaded($('.to-load'));
				}
				triggerScroll('#tips');
			}, 100);
		}, 250);
	});
};

export default initTips;
