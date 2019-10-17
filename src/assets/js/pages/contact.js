import $ from 'jquery';
import { isLoaded } from '../modules/helpers';

const initContact = isMobile => {
	$('#contact').each(() => {
		setTimeout(() => {
			isLoaded($('#block1 > .centered .framed-block'));
			if (isMobile) {
				isLoaded($('.to-load'));
			}
		}, 950);
	});
};

export default initContact;
