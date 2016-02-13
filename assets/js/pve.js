(function($){
	"use strict";

	// Player vs Environment (Monster) Calculator
	app.pvecalc = {

		// @Desc: Variables
		vars: {
			m_nTotalRate: 0,
			m_fAttSklUnit: 0,
			m_cLevel: 0,
			m_cDefSkill: 0,
			m_cAvoidRate: 0,
			m_cIsMoving: false
		},

		// @Desc: Initialize the PVE Calculator
		init: function(){
			// Debug
			console.log("DEBUG: app/pvecalc/init: executed");

			app.pvecalc.autocomplete();
		},

		// @Desc: Determine attack probability.
		getAttackProb: function(){
			// Debug
			console.log("DEBUG: app/pvecalc/getAttackProb: executed");

			// Variables
			app.pvecalc.vars.m_fAttSklUnit 	=	parseInt($('#monsters').attr('data-accuracy'), 10);		// Monster Accuracy
			app.pvecalc.vars.m_cLevel 		=   parseInt($('#m_cLevel').val(), 10);						// Player level
			app.pvecalc.vars.m_cDefSkill 	=	parseInt($('#m_cDefSkill').val(), 10);					// Player defense PT
			app.pvecalc.vars.m_cAvoidRate 	=	parseInt($('#m_cAvoidRate').val(), 10);					// Player dodge
			app.pvecalc.vars.m_cIsMoving 	=   $('#m_cMoving').is(":checked");							// Player is moving boolean (true/false)

		    app.pvecalc.vars.m_nTotalRate = Math.floor((app.pvecalc.vars.m_fAttSklUnit - (app.pvecalc.vars.m_cLevel + app.pvecalc.vars.m_cDefSkill)) / 4 + 95);        
		    app.pvecalc.vars.m_nTotalRate -= app.pvecalc.vars.m_cAvoidRate;

		    // Check if NaN

		    if(isNaN(app.pvecalc.vars.m_cLevel))
	    	{
	    		console.log('DEBUG: app/pvecalc/getAttackProb: No Level')
	    		return false;
	    	}

	    	if(isNaN(app.pvecalc.vars.m_cDefSkill))
    		{
    			console.log('DEBUG: app/pvecalc/getAttackProb: No Defense')
    			return false;
    		}

    		if(isNaN(app.pvecalc.vars.m_cAvoidRate)){
				console.log('DEBUG: app/pvecalc/getAttackProb: No Avoid')
				return false;
			}

		    if(isNaN(app.pvecalc.vars.m_fAttSklUnit))
		    {
		    	console.log('DEBUG: app/pvecalc/getAttackProb: No Attack Skill Unit')
		    	return false;
		    }

		    // If character is moving
		    if ( app.pvecalc.vars.m_cIsMoving )
		    {	
		    	app.pvecalc.vars.m_nTotalRate = Math.floor(app.pvecalc.vars.m_nTotalRate * 0.5);
		    }

		    // Round m_nTotalRate to 95 if above
		    if ( app.pvecalc.vars.m_nTotalRate >= 5 )
		    {
		    	if ( app.pvecalc.vars.m_nTotalRate > 95 )
		    	{
		    		app.pvecalc.vars.m_nTotalRate = 95;
		    	} 
		    }

		    // Round m_nTotalRate to 5 if below
		    else
		    {
		    	app.pvecalc.vars.m_nTotalRate = 5;
		    }

		    app.pvecalc.vars.m_nTotalRate = Math.abs(app.pvecalc.vars.m_nTotalRate - 100);

		    // Return result
			return app.pvecalc.vars.m_nTotalRate;
		},

		// @Desc: simulate attack probability vs random generator.
		// NOT CURRENTLY IN USE.
		attack: function(){
			// Debug
			console.log("DEBUG: app/pvecalc/attack: executed");

			// Get attack probability
			var atp		=	app.pvecalc.GetAttackProb();

			// Get random generator
			var ratp	=	Math.random() * 100;

			// If random number is above attack probability, then the player misses.
			if (ratp >= atp)
			{
				mMissAmount++;		
			}

			// If random number is below attack probability, then player hits.
			else
			{
				mHitAmount++;
			}
		},

		autocomplete: function(){
			// Debug
			console.log("DEBUG: app/pvecalc/autocomplete: executed");

			var monsters;
			var mInput = $("#monsters");

			// Fetch monster data
			$.getJSON( "../assets/data/monsters.json", function( data ) {
				monsters = data;
			})

			// When JSON is correctly fetched
			.done(function() {
				$( "#monsters" ).autocomplete({
			    	source: function (request, response) {
				        $.getJSON("../assets/data/monsters.json", function (data) {
				            response($.map(data, function (value, key) {

				            	// key = key.toLowerCase();
				            	// term = request.term.toLowerCase();

				            	if(key.toLowerCase().indexOf(request.term.toLowerCase()) >= 0 )
				            	{
				            		return {
					                    label: key,
					                    value: value
					                };
				            	}
				            }));
				        });
				    },

				    select: function( event, ui ){
				    	event.preventDefault();

			    		mInput.val(ui.item.label);
			    		mInput.attr('data-accuracy', ui.item.value);
				    },

				    focus: function( event, ui ){
				    	event.preventDefault();

				    	mInput.val(ui.item.label);
				    	mInput.attr('data-accuracy', ui.item.value);
				    }
			    });
			})

			// When fails to fetch JSON data properly
			.fail(function() {
				console.log( "error" );
			})

			// Always fires error or not.
			.always(function() {
				console.log( "complete" );
			});
		},

		// @Desc: Display result
		result: function(){
			// Debug
			console.log("DEBUG: app/pvecalc/result: executed");

			// Variables
			var result = app.pvecalc.getAttackProb();
			var container = $('.c-dodge-calc .header');
			var errorContainer = $('.error.container');
			var formRow = $('.form-row.text-input');
			var formRowInput = $('.form-row.text-input input');

			// If the form hasn't been filled out correctly
			// Show error container
			// Set form inputs to error state if unfilled
			if(result === false)
			{
				errorContainer.addClass('show');

				setTimeout(function(){
					errorContainer.removeClass('show');
				}, 1300);

				for (var i = 0; i < formRowInput.length; i++)
				{
					var input = formRowInput.eq(i);

					if(input.val() === ""){
						input.closest('.form-row.text-input').addClass('error');
					}

					else
					{
						input.closest('.form-row.text-input').removeClass('error');
					}
				}
			}

			// If form has been filled out correctly, display result
			else
			{
				formRow.removeClass('error');
				container.attr('data-content', result);
			}		
		}
	}
})(jQuery)