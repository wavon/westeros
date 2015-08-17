var MemoryCards = (function() {

	function Ctor() {

		var gameOfWeapons = [ 
									{name: 'daenerys', cardface: 'daenerys.jpg', person: 'Daenerys Targaryen'},
									{name: 'daenerys', cardface: 'Dragons'},
									{name: 'cersei', cardface: 'cersei.jpg', person: 'Cersei Lannister'},
									{name: 'cersei', cardface: 'Lies'},
									{name: 'arya', cardface: 'arya.jpg', person: 'Arya Stark'},
									{name: 'arya', cardface: 'Fencing sword: Needle'},
									{name: 'sansa', cardface: 'sansa.jpg', person: 'Sansa Stark'},
									{name: 'sansa', cardface: 'Alliance'},
									{name: 'brienne', cardface: 'brienne.jpg', person: 'Brienne of Tarth'},
									{name: 'brienne', cardface: 'Valyrian steel sword: Oathkeeper'},
									{name: 'ygritte', cardface: 'ygritte.jpg', person: 'Ygritte'},
									{name: 'ygritte', cardface: 'Longbow'},
									{name: 'margaery', cardface: 'margaery.jpg', person: 'Margaery Tyrell'},
									{name: 'margaery', cardface: 'Public Relations'},
									{name: 'melisandre', cardface: 'melisandre.jpg', person: 'Melisandre'},
									{name: 'melisandre', cardface: 'Fire'},
									{name: 'olenna', cardface: 'olenna.jpg', person: 'Olenna Tyrell'},
									{name: 'olenna', cardface: 'Poison'},
									{name: 'jaime', cardface: 'jaime.jpg', person: 'Jaime Lannister'},
									{name: 'jaime', cardface: 'Valyrian steel sword: reforged from Ice'},
									{name: 'tywin', cardface: 'tywin.jpg', person: 'Tywin Lannister'},
									{name: 'tywin', cardface: 'Gold'},
									{name: 'tyrion', cardface: 'tyrion.jpg', person: 'Tyrion Lannister'},
									{name: 'tyrion', cardface: 'Crossbow'},
									{name: 'jon', cardface: 'jon.jpg', person: 'Jon Snow'},
									{name: 'jon', cardface: 'Valyrian steel sword: Longclaw'},
									{name: 'joffrey', cardface: 'joffrey.jpg', person: 'Joffrey Baratheon'},
									{name: 'joffrey', cardface: 'Torture'},
									{name: 'oberyn', cardface: 'oberyn.jpg', person: 'Oberyn Martell'},
									{name: 'oberyn', cardface: 'Poisoned weapons'}
					 ];

		this.values = function() {
			return gameOfWeapons.slice();
		};
		this.match = function(pair1,pair2) { 
			return (pair1.name===pair2.name);
		};
		this.display = function(val) {
			return val.cardface;
		};

	}

	return Ctor;

})();
