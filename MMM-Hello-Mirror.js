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
			var commands = {
				'say hello (to my little) friend': greeting
			};

			Log.log(this.name + ' is started!');
		} else {
			Log.error('ERROR in module ' + this.name + ': Google Speech Recognizer is down :(');
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
    	}	
});
