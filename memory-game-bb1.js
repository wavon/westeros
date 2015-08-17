var MemoryGame = (function() {

	var CardModel = Backbone.Model.extend({
	    defaults: {status:'facedown'}
	});

	var CardCollection = Backbone.Collection.extend({
		model:CardModel
	});

	function GameCtor(cardset) {
		// slots array is now replaced with...
		var collection = this.collection = new CardCollection();
		cardset.values().forEach(function(cardval) {
			collection.add({value:cardval});
		});

		var length,//total slots, including gaps
			picked, //position of face-up card if any, or false
			_gui = null;

		// Helper functions which need access to closure vars;
		//  some fns will be made public as instance methods:
		var reset = function() {
			//slots = cardset.values();
			collection.reset(collection.shuffle());
			collection.models.forEach(function(model,pos) {
				model.set(model.defaults);
				model.set({'position':pos});
			});
			length = collection.models.length;
			picked = false;
			// shuffle(slots);
		}
		reset(); // reset now as part of init'ing

		var gui = function() {// accessor fn
			if (arguments.length === 0) 
				return _gui; // getter
			_gui = arguments[0]; // setter
		}

		var size = function() {
			return length;
		};

		var remainsAt = function(where) {//--> boolean
			var status = collection.at(where).get('status');
			return (status === 'faceup' || 'facedown');
		};
		var valueAt = function(where) {//--> card val
			return collection.at(where).attributes.value;
		};
		var removeAt = function(where) {
			collection.at(where).set({status:'matched'});
		};
		var faceupValue = function() {//--> card val
			return valueAt(picked);
		};
		var faceupWhere = function() {//--> integer
			return picked;
		};
		var remaining = function() {//--> array of integers
			return collection.where({status:'facedown'})
					.map(function(model){
						return model.attributes.position;
					});
		};

		var lift = function(pick) {//--> display string
			if (!isValid(pick,length)) return false;
			if (!remainsAt(pick)) return false;
			if (picked===pick) return false;

			// must be a face-down card here; proceed...
			var valPick = valueAt(pick);
				displayPick = cardset.display(valPick);
			if (picked === false) {
				// no current face-up
				picked = pick; //turn pick face-up
			} else {
				// check match with face-up
				if (cardset.match(valPick,valueAt(picked))) {
					// match; remove both:
					removeAt(pick);
					removeAt(picked);
					if (_gui)
						_gui.removeSoon([pick,picked]);
					//optional: report match
				} else {
					if (_gui)
						_gui.hideSoon([pick,picked]);
				}
				//either way, turn face-up to face-down:
				picked = false;
			}
			if (_gui)
				_gui.show(pick,displayPick);
			return displayPick; 
		};

		// Make some functions public as instance methods:
		this.reset = reset;
		this.lift = lift;
		this.faceupValue = faceupValue;
		this.faceupWhere = faceupWhere;
		this.remaining = remaining;
		this.gui = gui;
		this.size = size;
	} // end constructor

	// Private Functions shared by all boards:
	// these could be placed inside ctor,
	// but then they would be rebuilt for each instance
	function isValid(where,length) {
			return (typeof where === 'number')
				&& (where%1 === 0)
				&& (where>=0)
				&& (where<length);
		}
/*
	function shuffle(array) {
	// Knuth-Fisher-Yates, modified from http://bost.ocks.org/mike/shuffle/
		var end = array.length, temp, i;
  			// While picked remain elements to shuffle…
		while (end>1) {
   			// Pick a remaining element…
   			i = Math.floor(Math.random() * end--);
   			// And swap it with the current element.
   			temp = array[end];
   			array[end] = array[i];
		    array[i] = temp;
 		}
	}
*/
	return GameCtor;
})();
