"use strict";

DAW.Composition = class {
	constructor( daw ) {
		const sch = new gswaScheduler();

		this.daw = daw;
		this.cmp = null;
		this.loaded =
		this.playing =
		this.needSave = false;
		this.currentTime = 0;
		this._sched = sch;
		this._synths = new Map();
		this._startedSched = new Map();
		this._startedKeys = new Map();
		sch.currentTime = () => this.ctx.currentTime;
		sch.ondatastart = this._onstartBlock.bind( this );
		sch.ondatastop = this._onstopBlock.bind( this );
		sch.onended = this._onendedBlocks.bind( this );
	}

	// un/load, change, save
	// ........................................................................
	setCtx( ctx ) {
		this.ctx = ctx;
		this._synths.forEach( syn => {
			syn.setContext( ctx );
			syn.connect( this.get.destination() );
		} );
	}
	load( cmpOri ) {
		return new Promise( ( res, rej ) => {
			const cmp = DAW.objectDeepCopy( cmpOri );

			if ( DAW.Composition.format( cmp ) ) {
				this.unload();
				res( cmp );
			} else {
				rej();
			}
		} ).then( cmp => {
			this.cmp = cmp;
			this.loaded = true;
			this.needSave = false;
			this.change( cmp, {
				keys: {},
				synths: {},
				patterns: {},
				blocks: {},
			} );
			return cmp;
		} );
	}
	unload() {
		if ( this.loaded ) {
			const d = this._sched.data;

			this.loaded =
			this.needSave = false;
			Object.keys( d ).forEach( id => delete d[ id ] );
			this.daw._call( "compositionClosed", this.cmp );
			this.cmp = null;
			this._synths.clear();
		}
	}
	save() {
		if ( this.cmp && this.needSave ) {
			this.needSave = false;
			return true;
		}
	}

	// controls
	// ........................................................................
	getCurrentTime() {
		return this._sched.getCurrentOffsetBeat();
	}
	setCurrentTime( t ) {
		this.currentTime = t;
		this._sched.setCurrentOffsetBeat( t );
	}
	play() {
		if ( !this.playing ) {
			this.playing = true;
			this._start( this.currentTime );
		}
	}
	pause() {
		if ( this.playing ) {
			this.playing = false;
			this.currentTime = this.getCurrentTime();
			this._sched.stop();
		}
	}
	stop() {
		if ( this.playing ) {
			this.pause();
		} else {
			this.currentTime = 0;
		}
	}

	// ........................................................................
	_setLoop( a, b ) {
		if ( !Number.isFinite( a ) ) {
			this._sched.setLoopBeat( 0, this.cmp.duration || this.cmp.beatsPerMeasure );
		} else {
			this._sched.setLoopBeat( a, b );
		}
	}
	_start( offset ) {
		const sch = this._sched;

		// if ( wa.render.isOn ) {
		// 	sch.clearLoop();
		// 	sch.enableStreaming( false );
		// 	sch.startBeat( 0 );
		// } else {
			this._setLoop( this.cmp.loopA, this.cmp.loopB );
			sch.enableStreaming( true );
			sch.startBeat( 0, offset );
		// }
	}

	// ........................................................................
	assignBlocksChange( data ) {
		const cmp = this.cmp;

		DAW.objectDeepAssign( this._sched.data, data );
		if ( cmp.loopA === false ) {
			this._sched.setLoopBeat( 0, cmp.duration || cmp.beatsPerMeasure );
		}
	}
	assignPatternChange( pat, keys ) {
		this._startedSched.forEach( sch => {
			if ( sch.pattern === pat ) {
				DAW.objectDeepAssign( sch.data, keys );
			}
		} );
	}

	// ........................................................................
	_onstartBlock( startedId, blc, when, off, dur ) {
		if ( this.cmp.tracks[ blc.track ].toggle ) {
			const cmp = this.cmp,
				pat = cmp.patterns[ blc.pattern ],
				sch = new gswaScheduler();

			this._startedSched.set( startedId, sch );
			sch.pattern = pat;
			sch.currentTime = this._sched.currentTime;
			sch.ondatastart = this._onstartKey.bind( this, pat.synth );
			sch.ondatastop = this._onstopKey.bind( this, pat.synth );
			sch.setBPM( cmp.bpm );
			Object.assign( sch.data, cmp.keys[ pat.keys ] );
			// if ( wa.render.isOn ) {
			// 	sch.enableStreaming( false );
			// }
			sch.start( when, off, dur );
		}
	}
	_onstopBlock( startedId, blc ) {
		const sch = this._startedSched.get( startedId );

		if ( sch ) {
			sch.stop();
			this._startedSched.delete( startedId );
		}
	}
	_onendedBlocks( data ) {
		// gs.controls.stop();
	}
	_onstartKey( synthId, startedId, blc, when, off, dur ) {
		this._startedKeys.set( startedId,
			this._synths.get( synthId ).startKey(
				blc.key, when, off, dur,
				blc.gain,
				blc.pan ) );
	}
	_onstopKey( synthId, startedId, blc ) {
		this._synths.get( synthId ).stopKey( this._startedKeys.get( startedId ) );
		this._startedKeys.delete( startedId );
	}
};
