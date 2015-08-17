var MemoryGUI = (function() { // begin IIFE

  // Ctor for master gui object:
  function GUI(container,game,boardChoice) {
    // ensure that a string container begins with '#'
      if (typeof container === 'string')
          if (container[0] !== '#')
              container = '#'+container;

    // Generate all views:
    var mainview = 
    this.mainview = new MainViewQuotes({ /* boardChoice */
        el:container,
        // Pass a reference to game downward to all views:
        game:game
    });

    function findCardView(where) {
        return mainview.gridview.cardviews[where]; // var mainview
    }
    function hideAt(where) {
        findCardView(where).hide();
    }
    function removeAt(where) {
        findCardView(where).remove();
    }

    function doSoon(locs,fn) {/* locs is an array of #s; methodName is 'hide' or 'remove'. Call the hide() or remove() method for each card subview in locs. (use two separate methods (hideSoon, removeSoon)*/

        var cards=this.cards; //retain this.cards as variable so that it's available to forEach callback below
        window.setTimeout(function () {
            locs.forEach(function(loc) {
                // forEach doesn't set 'this'
                // loop needs var 'cards' from closure:
                fn(loc);// use appropriate method of appropriate card view
            });
        }, 800);
    }

    game.collection.on({
      'change:status':function(model,value,details) {
        // This function will be triggered whenever any model 
        //  changes its status (including at reset)
        var loc = details.where;
        if (loc === undefined) return;
        if (value === 'faceup') {
            findCardView(details.where).show(details.faceValue);
        } else if (value === 'facedown') {
            doSoon([loc],hideAt);
        } else if (value === 'matched')
            doSoon([loc],removeAt);
      }
    });
  } // end gui constructor


  var MainView = Backbone.View.extend({
    events: { 
      'click .resetButton': 'resetAll' // define click on reset button
    },
    className: 'memoryboard',

    initialize: function(options) {
      this.game = options.game;
      this.gridview = new GridView({
          //pass some options downward:
          game:options.game
      });
      this.buildHeader();
      this.gridview.$el.appendTo(this.$el);
    },
    
    resetAll: function() {
      this.game.reset();
      this.gridview.reset();
    }
  }); // end mainview


  var MainViewQuotes = MainView.extend({
    buildHeader: function() {
      $('<img src="images/targaryen-sigil.png" class="sigil">')
            // .addClass('sigil')
                .prependTo('#header');
      $('<div>').addClass('pageTitle')
                .appendTo('#header');
      $('<h1>').html('Wisdom of Westeros')
                .appendTo('.pageTitle');
      $('<h2>').html('Match <em>Game of Thrones</em> characters with their words!')
                .appendTo('.pageTitle');
      $('<button>').html('Play Again')
                  .addClass('resetButton')
                  .appendTo(this.gridview.$el);
      $('<p>').html('Design by Ondine Gallatin')
              .appendTo('#footer');
      }
  });

  var GridView = Backbone.View.extend({
    tagName: 'div',
    className: 'memoryboard',

    initialize: function(options) {
      this.game = options.game;
      this.cardviews = []; // grid's subviews

      var len = this.game.size();
      for (var i=0; i<len; ++i) {
          // generate each subview:
          var card = new CardView({
              //pass some options downward:
              game: options.game,
              where: i
          });
          this.cardviews.push(card);
          // connect card's element to DOM
          this.$el.append(card.el);
      }
    },

    reset: function() {
      this.cardviews.forEach(function(view){
          view.reset();
      });
    }
    
  }); // end gridview

  var CardView = Backbone.View.extend({
    tagName: 'div',
    className: 'facedown',
    events: {
        'click': 'lift'
    },
    initialize: function(options) {
      this.game = options.game;
      this.where = options.where;
    },
    // Each view should respond to a click:
    lift: function() {
      this.game.lift(this.where);
    },
    // Each view can re-render its own card in these four ways:
    show: function(clicked) {
      this.$el.removeClass('facedown');
      var regexp = /(\.+jpg)/i;
      if (clicked.match(regexp)) {
          this.$el.html('<img src="images/' + clicked + '"/>')
              .addClass('cardImage');
      } else {
          this.$el.addClass('cardQuote')
              .html('<p class="quote">' + clicked + '</p>');
      }
    },
    remove: function() { //remove as matched
      this.$el.addClass('matched');
    },
    hide: function() { //turn face-down
      this.$el.removeClass('cardQuote')
              .html('')
              .removeClass('cardImage')
              .addClass('facedown');
    },
    reset: function() { //return to starting state
      this.$el.removeClass('cardQuote')
            .html('')
            .removeClass('cardImage')
            .removeClass('matched')
            .addClass('facedown');
    }
  }); // end cardview

return GUI;

})(); //end GUI IIFE
