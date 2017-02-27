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
		voice: "Deutsch Female"
    	},

	// Called when all modules are loaded an the system is ready to boot up
	start: function() {
		if (responsiveVoice) {
			responsiveVoice.setDefaultVoice(config.voice);
		}
		if (annyang) {
			// Set language for date object
			moment.locale(config.language);
			
			// Set the language of annyang
			annyang.setLanguage(config.language);
			
			// Define the commands
			var commands = {
				'hey (magic) mirror *command': function(command) {
					Log.info('Voice command recognized in module ' + this.name + ': ' + command);
      					this.sendNotification('VOICE_COMMAND', command);
					if (responsiveVoice) {
						responsiveVoice.speak(this.translate("VOICE_ACCEPTED"));
					}
    				}
			};
			
			// Add the commands to annyang
  			annyang.addCommands(commands);
			
			// Add callback functions for errors
			annyang.addCallback('error', function() {
				Log.error('ERROR in module ' + this.name + ': ' + 'Speech Recognition fails because an undefined error occured');
			});
			annyang.addCallback('errorNetwork', function() {
		    		Log.error('ERROR in module ' + this.name + ': ' + 'Speech Recognition fails because of a network error');
			});
			annyang.addCallback('errorPermissionBlocked', function() {
		    		Log.error('ERROR in module ' + this.name + ': ' + 'Browser blocks the permission request to use Speech Recognition');
			});
			annyang.addCallback('errorPermissionDenied', function() {
		    		Log.error('ERROR in module ' + this.name + ': ' + 'The user blocks the permission request to use Speech Recognition');
			});
			annyang.addCallback('resultNoMatch', function(phrases) {
				Log.error('ERROR in module ' + this.name + ': ' + 'No match for voice command');
			});

			// Start listening
			annyang.start();
			
			Log.log(this.name + ' is started!');
		} else {
			Log.error('ERROR in module ' + this.name + ': ' + 'Google Speech Recognizer is down :(');
		}
	},	

	// Load required additional scripts
	getScripts: function() {
		return [
			'//cdnjs.cloudflare.com/ajax/libs/annyang/2.6.0/annyang.min.js',  // annyang! SpeechRecognition
			'http://code.responsivevoice.org/responsivevoice.js', // ResponsiveVoice
			'moment.js' // Parse, validate, manipulate, and display dates in JavaScript
		]
	},
	
	// Define additional styles
	getStyles: function() {
		return [
			"font-awesome.css",
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
    	}
});
