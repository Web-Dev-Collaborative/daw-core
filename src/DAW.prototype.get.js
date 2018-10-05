"use strict";

Object.assign( DAW.prototype, {
	_getInit() {
		const listnames = [ "synth", "pattern", "block", "track", "keys" ],
			cmp = () => this.cmp,
			getList = list => cmp() && cmp()[ list ],
			getObject = ( list, id ) => cmp() && cmp()[ list ][ id ],
			obj = listnames.reduce( ( obj, w ) => {
				if ( w.endsWith( "s" ) ) {
					obj[ w ] = this._getListOrObj.bind( this, w );
				} else {
					const list = w + "s";

					obj[ w ] = getObject.bind( this, list );
					obj[ list ] = getList.bind( this, list );
				}
				return obj;
			}, {} );

		this.get = obj;
		this._getList = getList;
		obj.composition = cmp;
		obj.id = () => cmp() && cmp().id;
		obj.bpm = () => cmp() && cmp().bpm;
		obj.name = () => cmp() && cmp().name;
		obj.loopA = () => cmp() && cmp().loopA;
		obj.loopB = () => cmp() && cmp().loopB;
		obj.synthOpened = () => cmp() && cmp().synthOpened;
		obj.patternOpened = () => cmp() && cmp().patternOpened;
		obj.beatsPerMeasure = () => cmp() && cmp().beatsPerMeasure;
		obj.stepsPerBeat = () => cmp() && cmp().stepsPerBeat;
		obj.ctx = () => this.ctx;
		obj.currentTime = () => this.composition.currentTime;
		obj.destination = () => obj.ctx().destination; //wa.destination.get();
	},
	_getListOrObj( listname, id ) {
		const list = this._getList( listname );

		return list && arguments.length === 2 ? list[ id ] : list;
	},
} );
