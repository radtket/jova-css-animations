function initializeMap(latitude, longitude, mapID) {
	const { google } = window;
	const center = new google.maps.LatLng(latitude, longitude);
	const bounds = {
		zoom: 15,
		center,
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		scrollwheel: false,
		navigationControl: false,
		mapTypeControl: false,
		scaleControl: false,
		styles: [
			{
				stylers: [
					{ gamma: 2.49 },
					{ lightness: -25 },
					{ hue: '#ff9100' },
					{ saturation: 10 },
				],
			},
			{
				featureType: 'water',
				stylers: [{ saturation: -67 }, { lightness: -7 }],
			},
			{
				featureType: 'road',
				stylers: [{ saturation: -65 }],
			},
			{
				featureType: 'landscape',
				stylers: [{ visibility: 'simplified' }],
			},
			{
				featureType: 'poi',
				stylers: [{ visibility: 'simplified' }, { saturation: -55 }],
			},
			{
				featureType: 'transit',
				stylers: [{ visibility: 'off' }],
			},
			{
				featureType: 'road.arterial',
				elementType: 'geometry',
				stylers: [{ lightness: 8 }, { hue: '#ffa200' }, { saturation: 30 }],
			},
			{
				featureType: 'poi.business',
				elementType: 'geometry',
				stylers: [{ visibility: 'off' }],
			},
			{
				featureType: 'poi.park',
				stylers: [
					{ visibility: 'simplified' },
					{ saturation: 6 },
					{ lightness: -11 },
				],
			},
			{
				featureType: 'road',
				elementType: 'labels',
				stylers: [{ visibility: 'on' }, { lightness: 15 }, { saturation: 17 }],
			},
			{
				featureType: 'poi.school',
				stylers: [{ visibility: 'off' }],
			},
			{
				featureType: 'road.local',
				stylers: [{ saturation: 24 }, { lightness: -6 }],
			},
		],
	};
	const map = new google.maps.Map(document.getElementById(mapID), bounds);
	const icon = new google.maps.MarkerImage(
		'assets/images/layout/sizer_contact-map.gif',
		// This marker is 20 pixels wide by 32 pixels tall.
		new google.maps.Size(47, 93),
		// The origin for this image is 0,0.
		new google.maps.Point(0, 0),
		// The anchor for this image is the base of the flagpole at 0,32.
		new google.maps.Point(23, 46)
	);

	const marker = new google.maps.Marker({
		position: new google.maps.LatLng(latitude, longitude),
		map,
		icon,
	});

	google.maps.event.addDomListener(window, 'resize', () => {
		var position = new google.maps.LatLng(latitude, longitude);
		map.setCenter(position);
	});
}

export default initializeMap;
