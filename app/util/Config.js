define(["jquery"], function($){

	var GUI = window.location.hash === "#GUI";

	var HD = screen.width >= 1280;

	var noVis = window.location.hash !== "#NOVIS";

	var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

	isMobile = (window.location.hash === "#MOBILE") || isMobile;

	return {
		GUI : GUI,
		MOBILE : isMobile,
		PRESET_UPDATE : false,
		STATS : false,
		PASSWORD : false,
		SPLASH : isMobile,
		VISUALS : noVis,
		ANALYTICS : true,
		PAUSE_ON_BLUR : false,
		HD : false,
		SLOW_UPDATE : isMobile ? 0.8: 0.5
	};
});