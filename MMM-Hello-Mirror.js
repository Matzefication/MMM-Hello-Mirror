/* Magic Mirror
 * Module: MMM-Hello-Mirror
 * 
 * By Mathias Kaniut
 * MIT Licensed
 */

Module.register("MMM-Hello-Mirror",{
	// Default module config.
    	defaults: {
        	language: "de",
		text: "Hello World!"
    	},

	// Called when all modules are loaded an the system is ready to boot up
	start: function() {
		if (annyang) {
			// Set language for date object
			moment.locale(config.language);
			
			// Set the language of annyang
			annyang.setLanguage(config.language);
			
			// Define the commands
			var commands = {
				'hey (magic) mirror *command': function() {
      					
    				}
			};
			
			// Add the commands to annyang
  			annyang.addCommands(commands);
			
			// Add callback functions for errors
			annyang.addCallback('error', function() {
				logError('Speech Recognition fails because of a network error');
			});
			annyang.addCallback('errorNetwork', function() {
		    		logError('Speech Recognition fails because of a network error');
			});
			annyang.addCallback('errorPermissionBlocked', function() {
		    		logError('Browser blocks the permission request to use Speech Recognition');
			});
			annyang.addCallback('errorPermissionDenied', function() {
		    		logError('The user blocks the permission request to use Speech Recognition');
			});			

			// Start listening
			annyang.start();
			
			Log.log(this.name + ' is started!');
		} else {
			logError('Google Speech Recognizer is down :(');
		}
	},	

	// Load required additional scripts
	getScripts: function() {
		return [
			'//cdnjs.cloudflare.com/ajax/libs/annyang/2.6.0/annyang.min.js',  // annyang! SpeechRecognition
			'moment.js' // Parse, validate, manipulate, and display dates in JavaScript
		]
	},
	
	// Define additional styles
	getStyles: function() {
		return [
			this.file('css/MMM-Hello-Mirror.css')
		];
	},
	
	// Request translation files
	getTranslations: function() {
	    	return {
		    	en: "translations/en.json",
		    	de: "translations/de.json"
		}
	},
	
    	// Override dom generator.
    	getDom: function() {
        	var wrapper = document.createElement("div");
		wrapper.className = "small light";
        	wrapper.innerHTML = this.config.text;
        	return wrapper;
    	},
	
	logError: function(errorText) {
		Log.error('ERROR in module ' + this.name + ': ' + errorText);
	}
});
