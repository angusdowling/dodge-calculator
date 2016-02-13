
(function($){
		// Variables
		app.vars = {
		},

		app.init = function(){
			// Debug
			console.log("DEBUG: app/init: executed");

			app.listeners();
			app.pvecalc.init();
		},

		app.listeners = function(){
			// Debug
			console.log("DEBUG: app/listeners: executed");

			// Add event listener for PVE Calculator
			$('.c-dodge-calc .submit').on('click', function(){
				app.pvecalc.result();
			})
		}

	// Fire script
	$(document).ready(function(){
		app.init();
	});
})(jQuery)

