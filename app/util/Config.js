define(["jquery"], function($){

	var GUI = window.location.hash === "#GUI";

	return {
		GUI : GUI,
		MOBILE : /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		PRESET_UPDATE : false,
		STATS : false,
		PASSWORD : false,
		SPLASH : false,
		ANALYTICS : true,
		PAUSE_ON_BLUR : false,
	};
});