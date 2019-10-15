const whichBrowser = () => {
	const { userAgent } = navigator;
	var agt = userAgent.toLowerCase();
	const brwsrString = brwsr => agt.indexOf(brwsr) !== -1;

	if (brwsrString('opera')) {
		return 'Opera';
	}
	if (brwsrString('staroffice')) {
		return 'Star Office';
	}

	if (brwsrString('webtv')) {
		return 'WebTV';
	}

	if (brwsrString('beonex')) {
		return 'Beonex';
	}

	if (brwsrString('chimera')) {
		return 'Chimera';
	}

	if (brwsrString('netpositive')) {
		return 'NetPositive';
	}

	if (brwsrString('phoenix')) {
		return 'Phoenix';
	}

	if (brwsrString('firefox')) {
		return 'Firefox';
	}

	if (brwsrString('chrome')) {
		return 'Chrome';
	}

	if (brwsrString('safari')) {
		return 'Safari';
	}

	if (brwsrString('skipstone')) {
		return 'SkipStone';
	}

	if (brwsrString('msie')) {
		return 'Internet Explorer';
	}

	if (brwsrString('netscape')) {
		return 'Netscape';
	}

	if (brwsrString('mozilla/5.0')) {
		return 'Mozilla';
	}

	if (brwsrString('/')) {
		if (agt.substr(0, brwsrString('/')) !== 'mozilla') {
			return userAgent.substr(0, agt.indexOf('/'));
		}

		return 'Netscape';
	}

	if (brwsrString(' ')) {
		return userAgent.substr(0, agt.indexOf(' '));
	}

	return userAgent;
};

export default whichBrowser;
