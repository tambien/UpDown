define(["jquery"], function($){

	var GUI = window.location.hash === "#GUI";

	var noVis = window.location.hash !== "#NOVIS";

	var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

	isMobile = (window.location.hash === "#MOBILE") || isMobile;

	return {
		GUI : GUI,
		MOBILE : isMobile,
		PRESET_UPDATE : false,
		STATS : false,
		PASSWORD : false,
		SPLASH : false,
		VISUALS : noVis,
		ANALYTICS : true,
		PAUSE_ON_BLUR : false,
		SLOW_UPDATE : isMobile ? 0.8: 0.5
	};
});