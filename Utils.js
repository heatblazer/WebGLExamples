Array.prototype.swap = function(a, b) {
		//use with calling swap by indexes
		// ex.: array.swap(1, 2) --> array[1] and array[2] as called from C swap(int*, int*);
		var temp = this[a];
		this[a] = this[b];
		this[b] = temp;
};
