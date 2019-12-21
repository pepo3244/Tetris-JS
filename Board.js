const STATE_NONE = -1;
const STATE_SET = 0;
const STATE_ERASING = 1;

function BoardData()
{
	this.mFlag = false;
	this.mType = -1;
	this.mState = STATE_NONE;
	this.mCount = 0;

	this.set = function( num ){
		this.mFlag = true;
		this.mType = num;
		this.mState = STATE_SET;
		this.mCount = 0;
	}
}

function Board()
{
	this.set = function(  x, y, width, height, blockSize ){

		this.mSizeX = width;
		this.mSizeY = height;

		this.mX = x;
		this.mY = y;

		this.mData = 0;

		this.mBlockSize = blockSize;

		this.mData = new Array( this.mSizeX * this.mSizeY );
		var i;
		for( i = 0; i < this.mSizeX * this.mSizeY; i++ ){
			this.mData[ i ] = new BoardData();
		}

		this.mData[ this.mSizeX * 0 ].mFlag = true;
	}

	this.getHalfPosition = function( block ){
		var b = { x : 0, y : 0, w : 0, h : 0 };
		block.getSize( b );
		block.setPosition( Math.floor( this.mSizeX / 2 - b.w / 2 ), 0 );
	}

	this.update = function(){
		var i;
		var x, y;
		var y2;

		for( i = 0; i < this.mSizeX * this.mSizeY; i++ ){
			if( this.mData[ i ].mState == STATE_ERASING ){
				this.mData[ i ].mCount++;
			}
		}
		for( y = this.mSizeY - 1; y >= 0; y-- ){
			for( x = 0; x < this.mSizeX; x++ ){

				//BoardData &t = mData[ mSizeX * y + x ];
				var t = this.mData[ this.mSizeX * y + x ];

				if( t.mState == STATE_ERASING ){
					if( t.mCount > this.mBlockSize ){
						t.mCount = 0;
						for( y2 = y; y2 > 0; y2-- ){
							this.mData[ this.mSizeX * y2 + x ]  = this.mData[ this.mSizeX * ( y2 - 1 ) + x ];
						}
						x--;
					}
				}
			}
		}
	}

	this.drawBoard = function( ctx, blockImage ){
		var x = this.mX;
		var y = this.mY;
		var w = this.mSizeX * this.mBlockSize;
		var h = this.mSizeY * this.mBlockSize;
		ctx.strokeStyle = "rgb( 200, 200, 200 )";
		ctx.strokeRect( x, y, w, h );

		for( x = 0; x < this.mSizeX; x++ ){

			var offsetY = 0;

			for( y = this.mSizeY - 1; y >= 0; y-- ){
					
				var index = this.mSizeX * y + x;
				var tx = this.mX + x * this.mBlockSize;
				var ty = this.mY + y * this.mBlockSize + offsetY;

				if( this.mData[ index ].mFlag ){
					if( this.mData[ index ].mState == STATE_ERASING ){
						offsetY += this.mData[ index ].mCount;
					}
					var s = this.mBlockSize;
					var i = s * this.mData[ index ].mType;
					ctx.drawImage( blockImage, 0, i, s, s, tx, ty, s, s );
				}

			}
		}
	}

	this.drawBlock = function( ctx, blockImage, block ){
		var x, y;
		var b = { x : 0, y : 0, w : 0, h : 0 };
		block.getSize( b );
		if( block.getFlag() == FLAG_MOVE ){
			var x, y;
			for( y = 0; y < b.h; y++ ){
				for( x = 0; x < b.w; x++ ){
					var index = b.w * y + x;
					if( block.mData[ index ] != 0 ){
						var tx = this.mX + ( b.x + x ) * this.mBlockSize;
						var ty = this.mY + ( b.y + y ) * this.mBlockSize;
						var s = this.mBlockSize;
						var i = s * block.mType;
						ctx.drawImage( blockImage, 0, i, s, s, tx, ty, s, s );
					}
				}
			}
		}

	}

	this.getNextBlockRand = function( max ){
		var rand = 1 + Math.floor( Math.random() * ( max - 2 ) );
		return rand;
	}

	this.checkBlock = function( block ){
		var index;
		var x, y, tx, ty;
		var b = { x : 0, y : 0, w : 0, h : 0 };
		block.getSize( b );

		for( y = 0; y < b.h; y++ ){
			for( x = 0; x < b.w; x++ ){
				index = b.w * y + x;
				if( block.mData[ index ] != 0 ){
					tx = b.x + x;
					ty = b.y + y;
					if( this.mSizeY <= ty ){
						return false;
					}
					if( ( tx < 0 ) || ( this.mSizeX <= tx ) ){
						return false;
					}

					index = this.mSizeX * ty + tx;
					if( index >= this.mSizeX * this.mSizeY ){
						return false;
					}
					if( this.mData[ index ].mFlag != 0 ){
						return false;
					}
				}
			}
		}
		return true;
	}

	this.checkDownBlock = function( block ){
		var index;
		var x, y, tx, ty;
		var b = { x : 0, y : 0, w : 0, h : 0 };
		block.getSize( b );

		b.y++;

		for( y = 0; y < b.h; y++ ){
			for( x = 0; x < b.w; x++ ){
				index = b.w * y + x;
				if( block.mData[ index ] != 0 ){
					tx = b.x + x;
					ty = b.y + y;
					if( this.mSizeY <= ty ){
						return false;
					}
					if( ( tx < 0 ) || ( this.mSizeX <= tx ) ){
						return false;
					}

					index = this.mSizeX * ty + tx;
					if( index >= this.mSizeX * this.mSizeY ){
						return false;
					}
					if( this.mData[ index ].mFlag != 0 ){
						return false;
					}
				}
			}
		}
		return true;
	}

	this.setBlock = function( block ){
		var index, index2;
		var x, y;
		var b = { x : 0, y : 0, w : 0, h : 0 };
		block.getSize( b );

		for( y = 0; y < b.h; y++ ){
			for( x = 0; x < b.w; x++ ){
				index = b.w * y + x;
				if( block.mData[ index ] != 0 ){
					var tx = b.x + x;
					var ty = b.y + y;
					if( ( ty < 0 ) || ( ty >= this.mSizeY ) ){
						ty = 0;
					}
					if( ( tx < 0 ) || ( tx >= this.mSizeX ) ){
						tx = 0;
					}

					index2 = this.mSizeX * ty + tx;
					if( index2 >= this.mSizeX * this.mSizeY ){
						alert( "setBlock error" );
						return -1;
					}
					this.mData[ index2 ].set( block.mType );
				}
			}
		}

		for( y = 0; y < this.mSizeY; y++ ){
			var blockCount = 0;
			for( x = 0; x < this.mSizeX; x++ ){
				if( this.mData[ this.mSizeX * y + x ].mFlag != 0 ){
					blockCount++;
				}
			}
			if( blockCount == this.mSizeX ){
				for( x = 0; x < this.mSizeX; x++ ){
					this.mData[ this.mSizeX * y + x ].mState = STATE_ERASING;
				}
			}
		}
	}
}
