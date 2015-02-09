/* renderer */

function include(src, ID, callback) {
	/* move it later to main.js file */
	var h = document.getElementById("head");
	var js = document.createElement("script");
	js.type = "text/javascript";
	js.id = ID;
	js.src = src;
	js.onreadystatechange = callback;
	js.onload = callback;
	h.appendChild(js);
}

function add_shader(ID, id, type, srcmaker) {
	var h = document.getElementById(ID);
	var shader = document.createElement("script");
	shader.type = type;
	shader.id = id;
	shader.innerHTML = srcmaker();
	h.appendChild(shader);
}
/********************B U F F E R *****************************************/
var VBufferObject = function(gl, name) {
	var vbo = null;
	if ( ! gl ) {
		return null;
	}
	function createBuffer(type, array, glDrawType) {
		vbo = gl.createBuffer();
		gl.bindBuffer(type, vbo);
		gl.bufferData(type, new Float32Array(array), glDrawType);
		console.log("OK"+vbo+";"+gl+"!");
	};
	
	return {
		"createVBO": function(type, array, glDrawType) {
			createBuffer(type, array, glDrawType);
			return vbo;
		}
	};
};

/********************R E N D E R E R**************************************/

var Renderer = function(canvasName) {
	/* includes */
	include("Thread.js", "Thread", function(){});
	include("glMatrix.min.js", "Matrix", function(){});
	
	/*private*/
	var gl = null;
	var canvas = null;
	var sceneWidth = 0;
	var sceneHeight = 0;
	
	var fragmentShader = null;
	var vertexShader = null;
	var shaderProgram = null;
	/*test code*/
	var t = new Thread("render thread");
	
	function start() {
		canvas = document.getElementById(canvasName);
		if ( canvas ) {
			sceneWidth = canvas.width;
			sceneHeight = canvas.height;
		} else {
			alert("Unable to init HTML5 canvas");
		}
		gl = initWebGL(canvas);
		if ( gl ) {
			gl.clearColor(1.0, 0.0, 1.0, 1.0);
			gl.clearDepth(1.0);
			gl.enable(gl.DEPTH_TEST);
			gl.depthFunc(gl.LEQUAL);
			initShaders();
			initBuffers();
			
			t.set(100);
			t.add(drawScene);
			t.start();
			
		} else {
			alert("Unable to init WebGL!");
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
	
	
	function initShaders() {
		fragmentShader = getShader(gl, "shader-fs");
		vertexShader = getShader(gl, "shader-vs");
		/* create shader program */
		shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, fragmentShader);
		gl.attachShader(shaderProgram, vertexShader);
		gl.linkProgram(shaderProgram);
		
		if ( !gl.getProgramParameter(shaderProgram, gl.LINK_STATUS) ) {
			alert("Failed to load shaders");
		}
		gl.useProgram(shaderProgram);
		shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
		gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
		
		shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
		shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
		
				
	}
	
	/* for test */
	var horizontAspect = 480.0/640.0;
	var vertAspect = 640.0/480.0;
	
	var squareBuffer =null;
	var perespectiveMatrix = null;
	var mvMatrix 	= null;	
	
	function initBuffers() {
		
		squareBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
		
		var vertices = [
			1.0, 1.0, 0.0,
			-1.0, 1.0, 0.0,
			1.0, -1.0, 0.0,
			-1.0, -1.0, 0.0
			];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	}
	
	function setMatrixUniforms() {
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, perespectiveMatrix);
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
	}

	function drawScene() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
		perespectiveMatrix = mat4.create();
		mvMatrix = mat4.create();
		
		mat4.perspective(45, 640.0/480.0, 0.1, 100, perespectiveMatrix);
		
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, [0.0, 0.0, -6.0]);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
		
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0,0);
		setMatrixUniforms();
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}
	function getShader(gl, id) {
		var shaderScript, theSource, currentChild, shader;
		shaderScript = document.getElementById(id);
		if ( !shaderScript ) {
			return null;
		}
		theSource = "";
		/*
		currentChild = shaderScript.firstChild;
		while ( currentChild ) {
			if ( currentChild.nodeType == currentChild.TEXT_NODE ) {
				theSource += currentChild.textContent;
			}
			currentChild = currentChild.nextSibling;
		}
		* */
		theSource = shaderScript.innerHTML;
		console.log("SHADER: "+shaderScript.innerHTML);
		if ( shaderScript.type == "x-shader/x-fragment" ) {
			shader = gl.createShader(gl.FRAGMENT_SHADER);
		} else if ( shaderScript.type == "x-shader/x-vertex" ) {
			shader = gl.createShader(gl.VERTEX_SHADER );
		} else {
			return null;
		}
		gl.shaderSource(shader, theSource);
		gl.compileShader(shader);
		
		if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
			window.alert("Error compiling the shader");
			return null;
		}
		return shader;
	}
	
	/*public*/
	return {
		"init": function() {
			start();
			var v = new VBufferObject(gl, "buffer1");
			var vertice=[0.0, 1.0,0.0, 1.0,
						-1.0, -1.0,1.0, 1.0,
						-1.0, 1.0,0.0, 1.0,
						1.0, 1.0,0.0, 1.0];
			v.createVBO(gl.ARRAY_BUFFER,vertice,gl.STATIC_DRAW)
		}
	};
};







