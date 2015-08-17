var MemoryGame = (function() {

  var CardModel = Backbone.Model.extend({
    defaults: {status:'facedown'}
  });

  var CardCollection = Backbone.Collection.extend({
    model:CardModel
  });

  function GameCtor(cardset) {
    var collection = this.collection = new CardCollection();
    cardset.values().forEach(function(cardval) {
      collection.add({value:cardval});
    });

    var length,//total slots, including gaps
      picked; //position of face-up card if any, or false

    // Helper functions which need access to closure vars;
    //  some fns will be made public as instance methods:
    var reset = function() {
      collection.reset(collection.shuffle()); /* BB shuffle() proxie is found in Backbone > Collection > Underscore Methods (28) > Collections > shuffle */
      collection.models.forEach(function(model,pos) {
        model.set(model.defaults);
        model.set({'position':pos});
      });
      length = collection.models.length;
      picked = false;
    };

    reset(); // reset now as part of init'ing

    var size = function() {
      return length;
    };
    this.cardset = function() {
      return cardset;
    };
    var remainsAt = function(where) { //--> boolean
      var status = collection.at(where).get('status');
      return (status === 'faceup' || status === 'facedown');
    };
    var valueAt = function(where) { //--> card val
      return collection.at(where).attributes.value;
    };
    var showAt = function(where,faceValue) {
      collection.at(where).set({status:'faceup'},{where:where, faceValue:faceValue});
    };
    var removeAt = function(where) {
      collection.at(where).set({status:'matched'},{where:where});
    };
    var hideAt = function(where) {
      collection.at(where).set({status:'facedown'},{where:where});
    };
    var faceupValue = function() {
      return valueAt(picked);
    };
    var faceupWhere = function() { //--> integer
      return picked;
    };
    var remaining = function() { //--> array of integers
      return collection.where({status:'facedown'})
          .map(function(model){
            return model.attributes.position;
          });
    };

    var lift = function(pick) { //--> display cardface
      if (!isValid(pick,length)) return false;
      if (!remainsAt(pick)) return false;
      if (picked===pick) return false;

      // must be a face-down card here
      var valPick = valueAt(pick),
        displayPick = cardset.display(valPick);

      showAt(pick, displayPick);  
      if (picked === false) {
        // no current face-up
        picked = pick; //turn pick face-up
      } else {
        // check match with face-up
        if (cardset.match(valPick,valueAt(picked))) {
          // match; remove both:
          removeAt(pick);
          removeAt(picked);
        } else {
          hideAt(pick);
          hideAt(picked);
        }
        // either way, turn face-up to face-down:
        picked = false;
      }
      return displayPick; 
    };

    // Make some functions public as instance methods:
    this.reset = reset;
    this.lift = lift;
    this.faceupValue = faceupValue;
    this.faceupWhere = faceupWhere;
    this.remaining = remaining;
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

  return GameCtor;
})();
