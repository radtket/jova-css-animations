import $ from 'jquery';
import { isLoaded } from '../modules/helpers';

const initProfile = isMobile => {
	const $portfolio = $('#portfolio');
	setTimeout(() => {
		isLoaded($('#block1 > .centered .framed-block', $portfolio));

		if (isMobile) {
			isLoaded($('.to-load', $portfolio));
		}
	}, 950);
};

export default initProfile;
