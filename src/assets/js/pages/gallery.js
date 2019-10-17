import $ from 'jquery';
import { isLoaded } from '../modules/helpers';

const initGallery = isMobile => {
	// $('#gallery').each(() => {
	setTimeout(() => {
		isLoaded($('#slider-container-squares .card-container'));

		if (isMobile) {
			isLoaded($('.to-load'));
		}
	}, 750);
	// });
};

export default initGallery;
