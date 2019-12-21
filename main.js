//	define class
function Parent()
{
	this.loadImage = function( image ){
		this.mBlockImage = image;
	}
	
	this.loadingGame = function(){
		this.mState.initialize();
		this.mState.loadingGame( this.mBlockImage );
	}

	this.update = function(){
		this.mState.move();
		this.mState.update();
	}

	this.draw = function( ctx ){
		this.mState.draw( ctx );
	}

	this.mX = 0;
	this.mY = 0;
	this.mBlockImage = 0;

	this.mState = new State();
}

//	global vars
var gParent = 0;

var gCanvas = 0;
var gContext = 0;

function initialize()
{
	var canvas = document.getElementById( "client" );
	if( ( !canvas ) || ( !canvas.getContext ) ){
		alert( "canvas error" );
		return false;
	}

	//	initialize game
	gParent = new Parent;

	var context = canvas.getContext( "2d" );

	gCanvas = canvas;
	gContext = context;

	//	init system
	window.addEventListener( "keydown", checkKeyDown, true );
	window.addEventListener( "keyup", checkKeyUp, true );
}

function loadImage()
{
	var blockImage = new Image();
	blockImage.src = "Data/block.png";
	blockImage.onload = function(){
		gParent.loadImage( blockImage );
		checkLoadedImage();
	}
	blockImage.onerror = function(){
		alert( "load image error" );
		return ;
	};
	gImg = blockImage;
}


function checkLoadedImage()
{
	gParent.loadingGame();

	main();
}

//	ここからメイン
onload = function()
{
	initialize();
	loadImage();
};

function main()
{
	//	clear canvas
	gContext.fillStyle = "rgb( 0, 0, 0 )";
	gContext.fillRect( 0, 0, 640, 480 );

	checkKey();

	gParent.update();
	gParent.draw( gContext );

	requestAnimationFrame( main );
}
