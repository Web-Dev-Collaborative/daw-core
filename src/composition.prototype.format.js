"use strict";

DAW.Composition.prototype.format = function( cmp ) {
	const blcsEntries = Object.entries( cmp.blocks ),
		blcsObj = {},
		sortWhen = ( a, b ) => {
			const c = a[ 1 ].when,
				d = b[ 1 ].when;

			return c < d ? -1 : c > d ? 1 : 0;
		};
	let blcId = 0;

	// loopA/B
	// ..........................................
	cmp.loopA = Number.isFinite( cmp.loopA ) ? Math.max( 0, cmp.loopA ) : false;
	cmp.loopB = Number.isFinite( cmp.loopB ) ? Math.max( 0, cmp.loopB ) : false;
	if ( cmp.loopA === cmp.loopB ) {
		cmp.loopA =
		cmp.loopB = false;
	}

	// ..........................................
	if ( !cmp.synths ) {
		const synthId = 0;

		Object.values( cmp.patterns ).forEach( pat => pat.synth = 0 );
		cmp.synthOpened = 0;
		cmp.synths = { "0": {
			name: "synth",
			oscillators: { "0": { type: "sine", detune: 0, pan: 0, gain: 1 } },
		} };
	}
	Object.values( cmp.synths ).forEach( syn => {
		delete syn.envelopes;
	} );
	Object.values( cmp.tracks ).forEach( tr => {
		tr.name = tr.name || "";
		tr.toggle = typeof tr.toggle === "boolean" ? tr.toggle : true;
	} );
	cmp.blocks = blcsObj;
	blcsEntries.sort( sortWhen );
	blcsEntries.forEach( ( [ id, blc ] ) => {
		blcsObj[ blcId++ ] = blc;
		blc.offset = blc.offset || 0;
		blc.selected = !!blc.selected;
		blc.durationEdited = !!blc.durationEdited;
	} );
	Object.entries( cmp.keys ).forEach( ( [ id, keys ] ) => {
		const keysEntries = Object.entries( keys ),
			keysObj = {};
		let keyId = 0;

		cmp.keys[ id ] = keysObj;
		keysEntries.sort( sortWhen );
		keysEntries.forEach( ( [ id, k ] ) => {
			keysObj[ keyId++ ] = k;
			k.pan = +castToNumber( -1, 1, 0, k.pan ).toFixed( 2 );
			k.gain = +castToNumber( 0, 1, .8, k.gain ).toFixed( 2 );
			k.selected = !!k.selected;
			k.prev = k.prev || false;
			k.next = k.next || false;
			delete k.durationEdited;
			if ( typeof k.key === "string" ) {
				if ( gsuiKeys ) {
					k.key = gsuiKeys.keyStrToMidi( k.key );
				} else {
					console.warn( "DAW.composition.format: gsuiKeys is needed to convert an old midi notation" );
					return false;
				}
			}
		} )
	} );
	return true;
};
