Array.prototype.swap = function(a, b) {
		//use with calling swap by indexes
		// ex.: array.swap(1, 2) --> array[1] and array[2] as called from C swap(int*, int*);
		var temp = this[a];
		this[a] = this[b];
		this[b] = temp;
};

Array.prototype.vec3_normalize = function() {
	/* use with caution this will overwrite the vector 
	 * for safety use the plain vec3_normalize([...])
	 * */
	if ( this.length != 3 ) {
		return;
	} else {
		var len = Math.sqrt( (this[0]*this[0]) +
							(this[1] * this[1]) +
							(this[2] * this[2] ) );
		this[0] /= len;
		this[1] /= len;
		this[2] /= len;
	}
}


function dotProduct(vec1, vec2, angle) {
	var l1 = vec3_length(vec1);
	var l2 = vec3_length(vec2);
	var res1 = vec3_multiply(vec1, vec2);
	var cosine = Math.cos(angle * (Math.PI/180) ).toFixed(4);
	return res1 * cosine;
	
}

function vec3_multiply(vec1,vec2) {
	if ( vec1.length != 3 || vec2.length != 3 ) {
		return null;
	} else {
		var product = (vec1[0]*vec2[0]) +
					(vec1[1]*vec2[1]) +
					(vec1[2] * vec2[2]) ;
		console.log(product);
		return product;
	}
}

function vec3_length(vec) {
	if ( vec.length != 3 ) return null;
	return Math.sqrt( (vec[0]*vec[0]) +
						(vec[1]*vec[1])+
						(vec[2]*vec[2] ) );
}


function vec3_normalize(vec) {
	if ( vec.length != 3 ) {
		return null;
	} else {
		var len = Math.sqrt( (vec[0]* vec[0]) +
								(vec[1] * vec[1]) +
								(vec[2] * vec[2] ) );
		return [ (vec[0]/len),
				 (vec[1]/len),
				 (vec[2]/len) ];
	}
}


function degToRad(degrees) {
	return degrees * Math.PI /  180.0;
}
