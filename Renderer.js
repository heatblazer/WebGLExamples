/* renderer */
function includeJs(src) {
	var h = document.getElementById("head");
	var js = document.createElement("script");
	js.type = "text/javascript";
	js.src = src;
	h.appendChild(js);
}


var Renderer = function(canvasName) {
	/*private*/
	includeJs("Thread.js");

	var gl = null;
	var canvas = null;
	var sceneWidth = 0;
	var sceneHeight = 0;
	
	/*test code*/
	var testColor = [0.0,0.0,0.0,1.0];
	function colorTest() {
		var tf = Math.floor(Math.random() *2+1) > 1 ? true : false;
		var ind = Math.floor(Math.random() * 3)+1;
		if ( tf ) {
			testColor[ind] = 1.0;
		} else {
			testColor[ind] = 0.0;
		}
		console.log(tf+":"+ind+":"+testColor[ind]);
	}
	
	/* DELETEME */
	function forThread() {
		start();
		colorTest();
	}
	
	function start() {
		canvas = document.getElementById(canvasName);
		if ( canvas ) {
			sceneWidth = canvas.width;
			sceneHeight = canvas.height;
		} else {
			throw "Unable to init HTML5 canvas";
		}
		gl = initWebGL(canvas);
		if ( gl ) {
			gl.clearColor(testColor[0], testColor[1], testColor[2], testColor[3]);
			gl.enable(gl.DEPTH_TEST);
			gl.depthFunc(gl.LEQUAL);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
		} else {
			throw "Unable to init WebGL!";
		}
		gl.viewport(0,0, sceneWidth, sceneHeight);
	}
	
	function initWebGL(canvas) {
		try {
			gl = canvas.getContext("webgl") || canvas.getContext("experimental-webg");
		} catch (e) { }
		
		if ( !gl ) {
			console.log("Unable to init WebGL. Browser may not support it");
			gl = null;
		} 
		return gl;
	}
	
	/*public*/
	
	return {
		"init": function() {
			var t = new Thread("TEST");
			t.set(30);
			t.add(forThread);
			t.start();
		}
	};
};
