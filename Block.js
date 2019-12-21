const FLAG_NONE = 0;
const FLAG_INIT = 1;
const FLAG_MOVE = 2;
const FLAG_WAIT = 3;

const TYPE_NONE = 0;
const TYPE_I = 1;
const TYPE_O = 2;
const TYPE_S = 3;
const TYPE_Z = 4;
const TYPE_J = 5;
const TYPE_L = 6;
const TYPE_T = 7;

const MOVE_NONE = 0;
const MOVE_DOWN = 1;
const MOVE_LEFT = 2;
const MOVE_RIGHT = 4;
const MOVE_TURN = 8;

const BLOCK_KIND_MAX = 8;

function Block()
{
	this.mX = 0;
	this.mY = 0;
	this.mSizeX = 0;
	this.mSizeY = 0;
	this.mData = 0;
	this.mType = TYPE_NONE;
	this.mFlag = false;
	this.mLastDownCount = 0;

	this.copy = function( b ){
		delete b;

		b.mX = this.mX;
		b.mY = this.mY;
		b.mSizeX = this.mSizeX;
		b.mSizeY = this.mSizeY;
		b.mType = this.mType;
		b.mFlag = this.mFlag;
		b.mLastDownCount = this.mLastDownCount;
		
		if( b.mData != 0 ){
			delete b.mData;
		}

		var i;
		b.mData = new Array( b.mSizeX * b.mSizeY );
		for( i = 0; i < this.mSizeX * this.mSizeY; i++ ){
			b.mData[ i ] = this.mData[ i ];
		}
	}

	this.set = function( type ){
		this.mX = 0;
		this.mY = 0;
		this.mType = type;
		this.mFlag = FLAG_MOVE;
		this.mLastDownCount = 0;

		const blockI = new Array(
			0, 0, 1, 0, 0,
			0, 0, 1, 0, 0,
			0, 0, 1, 0, 0,
			0, 0, 1, 0, 0
		);

		const blockO = new Array(
			1, 1,
			1, 1
		);

		const blockS = new Array(
			0, 1, 1,
			1, 1, 0
		);

		const blockZ = new Array( 
			1, 1, 0,
			0, 1, 1
		);

		const blockJ = new Array(
			1, 0, 0,
			1, 1, 1
		);

		const blockL = new Array(
			0, 0, 1,
			1, 1, 1
		);

		const blockT = new Array(
			0, 1, 0,
			1, 1, 1,
			0, 0, 0
		);

		const blockNum = [
			[ 0, 0 ],
			[ 5, 4 ],
			[ 2, 2 ],
			[ 3, 2 ],
			[ 3, 2 ],
			[ 3, 2 ],
			[ 3, 2 ],
			[ 3, 3 ]
		];

		const blocks = new Array(
			0, 
			blockI, blockO,
			blockS, blockZ,
			blockJ, blockL,
			blockT
		);

		this.mSizeX = blockNum[ this.mType ][ 0 ];
		this.mSizeY = blockNum[ this.mType ][ 1 ];

		if( this.mData != 0 ){
			delete this.mData;
		}

		this.mData = blocks[ this.mType ];

		delete blockI;
		delete blockO;
		delete blockS;
		delete blockZ;
		delete blockJ;
		delete blockL;
		delete blockT;
	}

	this.setPosition = function( x, y ){
		this.mX = x;
		this.mY = y;
	}

	this.getSize = function( b ){
		b.x = this.mX;
		b.y = this.mY;
		b.w = this.mSizeX;
		b.h = this.mSizeY;
	}

	this.getFlag = function(){
		return this.mFlag;
	}

	this.update = function(){
		if( this.mFlag == FLAG_MOVE ){
			this.mLastDownCount++;
		}
	}

	this.move = function( m ){
		if( this.mFlag == FLAG_MOVE ){
			switch( m ){
				case MOVE_DOWN:
					this.mLastDownCount = 0;
					this.mY++;
					break;
				case MOVE_LEFT:
					this.mX--;
					break;
				case MOVE_RIGHT:
					this.mX++;
					break;
			}
		}
		if( m == MOVE_TURN ){
			var t = new Block();
			this.copy( t );
			t.mSizeX = this.mSizeY;
			t.mSizeY = this.mSizeX;
			/*
			t.mSizeX = this.mSizeX;
			t.mSizeY = this.mSizeY;
			t.mData = new Array( t.mSizeX * t.mSizeY );
			*/
			var i;
			for( i = 0; i < t.mSizeX * t.mSizeY; i++ ){
				t.mData[ i ] = 0;
			}
			var x, y;
			for( y = 0; y < this.mSizeY; y++ ){
				for( x = 0; x < this.mSizeX; x++ ){
					var index = this.mSizeX * y + x;
					var hx = x - this.mSizeX / 2.0 + 0.5;
					var hy = y - this.mSizeY / 2.0 + 0.5;

					var tx = -hy;
					var ty = hx;

					tx += t.mSizeX / 2.0 - 0.5;
					ty += t.mSizeY / 2.0 - 0.5;

					//alert( x + " " + y + " " + tx + " " + ty );

					//t.mData[ index ] = 0;
					t.mData[ t.mSizeX * Math.floor( ty ) + Math.floor( tx ) ] = this.mData[ index ];
				}
			}

			t.copy( this );

			delete t;
		}
	}

	this.setFlag = function( flag ){
		this.mFlag = flag;
	}
}
