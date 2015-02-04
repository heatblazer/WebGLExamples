var threadIndex =0;

var ThreadPool =  function(max) {
	var threads = [];
	var max_size = (max == null) ? 100 : max;
	var index = 0;
	return {
		"add": function(foo) {
			threads[index++] = foo;
		},
		"remove": function(foo) {
			for (var i; i < threads.length; i++ ) {
				if ( threads[i].toString() === foo ) {
					threads[i].stop();
					delete threads[i];
				}
			}
		}
	}; /* return globals */
	
};

var Thread = function(fx) {
		
		var name = (fx == null) ? "myThread"+(threadIndex++) : fx; 
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
			},
			"toString" : function() {
				return name;
			}
		};
}
