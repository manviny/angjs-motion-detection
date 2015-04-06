var motionArray = [];		// contains array of objects {position:'NW', time:'37'}
var lastMotion = {};		// contains last movement so it doesn't repeat same point many times



$( document ).ready(function() {
    $('#muestra').click(function(){
    	// alert("h")
    	console.debug("motionArray", motionArray)

		var res;

		res = motionArray.every(function(element, index, array) {
		    console.log("element:", element);
		    if (element.t <= 1) {
		        return false;
		    }

		    return true;
		});
		console.log("res:", res);

    })
});

$( "#motion" ).append( '<video id="monitor" autoplay style="display: none; width: 320px; height: 240px;"></video>');
$( "#motion" ).append( '<div id="canvasLayers"  width="320" height="240"  style="position: relative; left: 0px; top: 0px;">');
$( "#motion" ).append( '<canvas id="videoCanvas" width="320" height="240" style="z-index: 1; position: absolute; left:0px; top:0px;"></canvas>');
$( "#motion" ).append( '<canvas id="layer2"     width="320" height="240" style="z-index: 2; position: absolute; left:0px; top:0px; opacity:0.5;"></canvas>');
$( "#motion" ).append( '</div>');
$( "#motion" ).append( '<canvas id="blendCanvas" style="display: none; position: relative; left: 320px; top: 240px; width: 320px; height: 240px;"></canvas>');

$( "#motion" ).append( '<div id="messageError"></div>');
$( "#motion" ).append( '<div id="messageArea">Messages will be displayed here.</div>');
$( "#motion" ).append( '<div id="messageArea2">');


// $("#videoCanvas").css('display','none');
// $("#layer2").css('display','none');


	/**
	 * Provides requestAnimationFrame in a cross browser way.
	 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	 */

	if ( !window.requestAnimationFrame ) {

		window.requestAnimationFrame = ( function() {

			return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

				window.setTimeout( callback, 1000 / 60 );

			};

		} )();

	}	




	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	window.URL = window.URL || window.webkitURL;

	var camvideo = document.getElementById('monitor');

		if (!navigator.getUserMedia) 
		{
			document.getElementById('messageError').innerHTML = 
				'Sorry. <code>navigator.getUserMedia()</code> is not available.';
		}
		navigator.getUserMedia({video: true}, gotStream, noStream);

	function gotStream(stream) 
	{
		if (window.URL) 
		{   camvideo.src = window.URL.createObjectURL(stream);   } 
		else // Opera
		{   camvideo.src = stream;   }

		camvideo.onerror = function(e) 
		{   stream.stop();   };

		stream.onended = noStream;
	}

	function noStream(e) 
	{
		var msg = 'No camera available.';
		if (e.code == 1) 
		{   msg = 'User denied access to use camera.';   }
		document.getElementById('errorMessage').textContent = msg;
	}







//  The code below contains a loop to draw the contents of the video tag
// 	 onto the canvas tag, enabling us to do cool things with the image. 
// Based on http://www.adobe.com/devnet/html5/articles/javascript-motion-detection.html


// assign global variables to HTML elements
var video = document.getElementById( 'monitor' );
var videoCanvas = document.getElementById( 'videoCanvas' );
var videoContext = videoCanvas.getContext( '2d' );

var layer2Canvas = document.getElementById( 'layer2' );
var layer2Context = layer2Canvas.getContext( '2d' );

var blendCanvas  = document.getElementById( "blendCanvas" );
var blendContext = blendCanvas.getContext('2d');

var messageArea = document.getElementById( "messageArea" );

// these changes are permanent
videoContext.translate(320, 0);
videoContext.scale(-1, 1);
		
// background color if no video present
videoContext.fillStyle = '#005337';
videoContext.fillRect( 0, 0, videoCanvas.width, videoCanvas.height );				

var buttons = [];

		var width = videoCanvas.width;
		var height = videoCanvas.height;
		var ancho = 52;
		var alto = 82;

		/**
		*      NW   N    NE
		*      SW   S    SE
		*/

		
		var NW = new Image();
		NW.src ="images/SquareGreen.png";
		var NWData = { name:"NW", image:NW, x:1, y:1, w:ancho, h:alto };
		buttons.push( NWData );
		
		// var NC = new Image();
		// NC.src ="images/SquareGreen.png";
		// var NCData = { name:"NC", image:NC, x:parseInt(width/2), y:1, w:ancho, h:alto };
		// buttons.push( NCData );
		
		var NE = new Image();
		NE.src ="images/SquareGreen.png";
		var NEData = { name:"NE", image:NE, x:parseInt(width)-ancho-10, y:1, w:ancho, h:alto };
		buttons.push( NEData );

		// var SE = new Image();
		// SE.src ="images/SquareGreen.png";
		// var SEData = { name:"SE", image:SE, x:width-ancho-10, y:parseInt(height/2), w:ancho, h:alto };
		// buttons.push( SEData );

		// var SC = new Image();
		// SC.src ="images/SquareGreen.png";
		// var SCData = { name:"SC", image:SC, x:parseInt(width/2), y:parseInt(height/2), w:ancho, h:alto };
		// buttons.push( SCData );

		// var SW = new Image();
		// SW.src ="images/SquareGreen.png";
		// var SWData = { name:"SW", image:SW, x:1, y:parseInt(height/2), w:ancho, h:alto };
		// buttons.push( SWData );

// start the loop				
animate();

function animate() 
{
    requestAnimationFrame( animate );
	
	render();	
	blend();	
	checkAreas();
}

function render() 
{	
	if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
	{
		// mirror video
		videoContext.drawImage( video, 0, 0, videoCanvas.width, videoCanvas.height );
		for ( var i = 0; i < buttons.length; i++ )
			layer2Context.drawImage( buttons[i].image, buttons[i].x, buttons[i].y, buttons[i].w, buttons[i].h );		
	}
}

var lastImageData;

function blend() 
{
	var width  = videoCanvas.width;
	var height = videoCanvas.height;
	// get current webcam image data
	var sourceData = videoContext.getImageData(0, 0, width, height);
	// create an image if the previous image doesn�t exist
	if (!lastImageData) lastImageData = videoContext.getImageData(0, 0, width, height);
	// create a ImageData instance to receive the blended result
	var blendedData = videoContext.createImageData(width, height);
	// blend the 2 images
	differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
	// draw the result in a canvas
	blendContext.putImageData(blendedData, 0, 0);
	// store the current webcam image
	lastImageData = sourceData;
}
function differenceAccuracy(target, data1, data2) 
{
	if (data1.length != data2.length) return null;
	var i = 0;
	while (i < (data1.length * 0.25)) 
	{
		var average1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3;
		var average2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
		var diff = threshold(fastAbs(average1 - average2));
		target[4*i]   = diff;
		target[4*i+1] = diff;
		target[4*i+2] = diff;
		target[4*i+3] = 0xFF;
		++i;
	}
}
function fastAbs(value) 
{
	return (value ^ (value >> 31)) - (value >> 31);
}
function threshold(value) 
{
	return (value > 0x15) ? 0xFF : 0;
}

// check if white region from blend overlaps area of interest (e.g. triggers)
function checkAreas() 
{
	for (var b = 0; b < buttons.length; b++)
	{
		// get the pixels in a note area from the blended image
		var blendedData = blendContext.getImageData( buttons[b].x, buttons[b].y, buttons[b].w, buttons[b].h );
			
		// calculate the average lightness of the blended data
		var i = 0;
		var sum = 0;
		var countPixels = blendedData.data.length * 0.25;
		while (i < countPixels) 
		{
			sum += (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]);
			++i;
		}
		// calculate an average between of the color values of the note area [0-255]
		var average = Math.round(sum / (3 * countPixels));
		if (average > 50) // more than 20% movement detected
		{
			// evita guardar la misma posicion varias veces seguidas
			if (buttons[b].name !=  lastMotion.p ) {
				
				// var d = new Date();
				// var diferenciaTiempo = parseFloat(d.getTime())-parseFloat(lastMotion.t);
				
				// borra movimientos antiguos ( de mas de 1000 milemesimas)
				// if(diferenciaTiempo>800) {
				// 	motionArray=[];
				// 	motionArray.push(lastMotion);
				// } 
				// else {
				// 	console.debug("motionArray", motionArray);
				// 	// primer y ulimo posiciones
				// 	var posIni = motionArray[0];
				// 	var posFin = motionArray[motionArray.length-1];
				// 	console.debug(posIni, posFin)
				// }
				
				// imprime direccion SE => SW y tiempo 123
				console.debug(lastMotion.p)
				if( lastMotion.p=='NE' && buttons[b].name=='NW' 
					) { console.log("izquierda"); }
				else if( lastMotion.p=='NW' && buttons[b].name=='NE'  
				    ) { console.log("derecha"); }	

					lastMotion = {'p':buttons[b].name};

				//inserta posicion y tiempo en array
				// motionArray.push(lastMotion);

				// console.log( "Button " + buttons[b].name + " triggered." ); // do stuff
				// messageArea.innerHTML = "<font size='+4' color=" + buttons[b].name + "><b>Button " + buttons[b].name + " triggered.</b></font>";		
			}

		}
	}
}
