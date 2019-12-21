const PHASE_READY = 0;
const PHASE_PLAY = 1;
const PHASE_GAMEOVER = 2;

const BLOCK_DOWN_TIME = 32;
const KEY_INTERVAL = 12;

function State(){

	this.initialize = function(){
		
		this.mFrame = 0;
		this.mPhase = PHASE_READY;

		this.mBoardWidth = 10;
		this.mBoardHeight = 20;
		this.mBlockSize = 480 / this.mBoardHeight;
		this.mBlockKindMax = 8;

		//	initialize
		this.mBoard = new Board();
		this.mBlock = new Block();
		//this.mNext = new Block();
		this.mBoard.set( 320 - this.mBlockSize * this.mBoardWidth / 2, 0, this.mBoardWidth, this.mBoardHeight, this.mBlockSize );

		//	set block
		var next = this.mBoard.getNextBlockRand( this.mBlockKindMax );
		this.mBlock.set( next );
		this.mBoard.getHalfPosition( this.mBlock );
	}

	this.loadingGame = function( blockImage ){
		this.mBlockImage = blockImage;
	}

	this.update = function(){
		this.mBoard.update();
		this.mBlock.update();
		this.mFrame++;
	}
	this.move = function(){

		var m = MOVE_NONE;

		if( this.mBlock.getFlag() == FLAG_INIT ){
			var next = this.mBoard.getNextBlockRand( this.mBlockKindMax );
			this.mBlock.set( next );
			this.mBoard.getHalfPosition( this.mBlock );
		}

		var block = new Block();
		this.mBlock.copy( block );

		if( this.mBlock.getFlag() == FLAG_MOVE ){
			if( getKey( KEY_DOWN ) ){
				if( this.mBoard.checkDownBlock( block ) ){
					block.move( MOVE_DOWN );
				}
			}
			if( block.mLastDownCount >= BLOCK_DOWN_TIME ){
				block.move( MOVE_DOWN );
			}

			var block2 = new Block();
			block.copy( block2 );
			if( getKey( KEY_TURN ) % KEY_INTERVAL == 1 ){
				m = MOVE_TURN;
			} else if( getKey( KEY_LEFT ) % KEY_INTERVAL == 1 ){
				m = MOVE_LEFT;
			} else if( getKey( KEY_RIGHT ) % KEY_INTERVAL == 1 ){
				m = MOVE_RIGHT;
			}
			if( m != MOVE_NONE ){
				block2.move( m );
				if( this.mBoard.checkBlock( block2 ) ){
					block2.copy( block );
				}
			}
			delete block2;
		}

		if( this.mBoard.checkBlock( block ) ){
			//this.mBlock = block;
			block.copy( this.mBlock );
		} else {
			this.mBoard.setBlock( this.mBlock );
			this.mBlock.setFlag( FLAG_INIT );
		}
		delete block;
	}
	this.draw = function( ctx ){
		this.mBoard.drawBoard( ctx, this.mBlockImage );
		this.mBoard.drawBlock( ctx, this.mBlockImage, this.mBlock );
	}

	this.mX = 0;
	this.mY = 0;

	this.mFrame = 0;
	this.mPhase = 0;

	this.mBoardWidth = 0;
	this.mBoardHeight = 0;
	this.mBlockSize = 0;
	this.mBlockKindMax = 0;

	this.mBlockImage;
	this.mGameImage;

	this.mBoard = 0;
	this.mBlock = 0;
	this.mNextBlock = 0;
}
