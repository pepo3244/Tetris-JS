const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_TURN = 32;
const KEY_DEBUG = 27;
const KEY_DOWN = 40;

var gKeyBuffer = new Array();//ここに押されていればtrueが入る
var gKeyCount = new Array();

function checkKeyDown( event )
{
	gKeyBuffer[ event.keyCode ] = true;
}

function checkKeyUp( event )
{
	gKeyBuffer[ event.keyCode ] = false;
}

function checkKey()
{
	var i = 0;
	for( i = 0; i < 256; i++ ){
		if( gKeyBuffer[ i ] ){
			gKeyCount[ i ]++;
		} else {
			gKeyCount[ i ] = 0;
		}
	}
}

function getKey( code )
{
	/*
	if( ( gKeyCount[ code ] == 1 ) || ( gKeyCount[ code ] % 8 == 1 ) ){
		return true;
	}
	*/
	//return gKeyBuffer[ code ];
	return gKeyCount[ code ];
}
