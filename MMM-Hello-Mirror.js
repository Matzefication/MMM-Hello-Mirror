/* Magic Mirror
 * Module: MMM-Hello-Mirror
 * 
 * By Mathias Kaniut
 * MIT Licensed
 */

Module.register("MMM-Hello-Mirror", {

	// Default module config.
    defaults: {
        language: "de",
        voice: "Deutsch Female",
        wakeUp: "Hallo (magischer) Spiegel",
        animationSpeed: 2000,
        debug: true,
        broadcastEvents: true
    },

	// Load required additional scripts
	getScripts: function() {
		return [
			'//cdnjs.cloudflare.com/ajax/libs/annyang/2.6.0/annyang.min.js',     // annyang! SpeechRecognition
			'http://code.responsivevoice.org/responsivevoice.js',                // ResponsiveVoice
			'moment.js'                                                          // Parse, validate, manipulate, and display dates in JavaScript
		];
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
		};
	},

    textMessage: "",

	// Called when all modules are loaded an the system is ready to boot up
	start: function() {
		if (responsiveVoice) {
			responsiveVoice.setDefaultVoice(this.config.voice);
		}

		if (annyang) {
            Log.info("Starting module: " + this.name);

            var self = this;

			// Set language for date object
			moment.locale(this.config.language);
			
			// Set the debug mode
			annyang.debug(this.config.debug);
			
			// Set the language of annyang
			annyang.setLanguage(this.config.language);
			
			// Define the commands ...
            // ... for german language
            if (self.config.language == 'de') {
                var commands = {
                    'Hallo (magischer) Spiegel *command': function(command) {
                        Log.info('Voice command recognized in module ' + self.name + ': ' + command);
                        if (self.config.broadcastEvents) {
                            self.sendNotification("VOICE_COMMAND", command);
                        }
                        if (responsiveVoice) {
                            responsiveVoice.speak( self.translate("VOICE_ACCEPTED") );
                        }
                    }
                };
            // ... for other languages (should be english)
            } else {
                var commands = {
                    'Hi (magic) mirror *command': function(command) {
                        Log.info('Voice command recognized in module ' + self.name + ': ' + command);
                        if (self.config.broadcastEvents) {
                            self.sendNotification("VOICE_COMMAND", command);
                        }
                        if (responsiveVoice) {
                            responsiveVoice.speak( self.translate("VOICE_ACCEPTED") );
                        }
                    }
                };
            }

			// Add the commands to annyang
  			annyang.addCommands(commands);
			
			// Add callback functions for errors
			annyang.addCallback('error', function() {
				Log.error('ERROR in module ' + self.name + ': ' + 'Speech Recognition fails because an undefined error occured');
			});
			annyang.addCallback('errorNetwork', function() {
		    		Log.error('ERROR in module ' + self.name + ': ' + 'Speech Recognition fails because of a network error');
			});
			annyang.addCallback('errorPermissionBlocked', function() {
		    		Log.error('ERROR in module ' + self.name + ': ' + 'Browser blocks the permission request to use Speech Recognition');
			});
			annyang.addCallback('errorPermissionDenied', function() {
		    		Log.error('ERROR in module ' + self.name + ': ' + 'The user blocks the permission request to use Speech Recognition');
			});
			annyang.addCallback('resultNoMatch', function(phrases) {
				Log.error('ERROR in module ' + self.name + ': ' + 'No match for voice command ' + phrases);
			});
			annyang.addCallback('soundstart', function() {
				self.textMessage = self.translate("HEAR_YOU");
  				self.updateDom(self.config.animationSpeed);
			});
			annyang.addCallback('result', function() {
				self.textMessage = "";
  				self.updateDom(self.config.animationSpeed);
			});

			// Start listening
			annyang.start();
		} else {
			Log.error('ERROR in module ' + self.name + ': ' + 'Google Speech Recognizer is down :(');
		}
	},
	
    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "small light";
        wrapper.innerHTML = this.textMessage;
        return wrapper;
    },
});
