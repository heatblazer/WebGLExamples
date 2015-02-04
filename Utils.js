	Array.prototype.swap = function(a, b) {
		//use with calling swap by indexes
		// ex.: array.swap(1, 2) --> array[1] and array[2] as called from C swap(int*, int*);
		var temp = this[a];
		this[a] = this[b];
		this[b] = temp;
	};
var Thread = function(fx) {
		//"use asm";
		//run foo with fixed interval of times
		var INTERVAL = 10;
		var runner = null;
		var id = null;
		var foo = null;
		return {
			"add": function(f) {
				console.log(f+" added");
				foo = f;
			}, 
			"start": function() {
				runner = true;
				if ( foo != undefined ) {
				id = setInterval(function() { foo(); }, INTERVAL);
				}
			},
			"stop": function() {
				runner = false;
				clearInterval(id);
			},
			"set": function(time) {
				INTERVAL = time;
			}
		};
}
