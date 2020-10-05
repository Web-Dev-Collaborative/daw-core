"use strict";

DAWCore.History.prototype.nameAction = function( act, msg ) {
	if ( msg ) {
		const [ part, actionName, ...args ] = msg,
			fn = DAWCore.History.actionsToText[ part ][ actionName ],
			[ i, t ] = fn ? fn( ...args ) : [ "close", "undefined" ];

		if ( !fn ) {
			console.error( `DAWCore: description 404 for "${ part }.${ actionName }"` );
		}
		return { i, t };
	}
	return this._nameAction( act );
};

DAWCore.History.actionsToText = {
	cmp: {
		renameComposition: ( old, neww ) => [ "pen", `rename compo "${ old || "untitled" }" to "${ neww }"` ],
		changeTempo: ( bpm, bPM, sPB ) => [ "clock", `new tempo ${ bpm } (${ bPM }/${ sPB })` ],
		changeLoop: ( a, b ) => [ "loop", `change loop ${ a } -> ${ b }` ],
		removeLoop: () => [ "loop", "remove loop" ],
	},
	tracks: {
		renameTrack: ( old, neww ) => [ "pen", `rename track "${ old }" -> "${ neww }"` ],
		toggleTrack: ( tr, b ) => [ b ? "unmute" : "mute", `${ b ? "unmute" : "mute" } track "${ tr }"` ],
		toggleSoloTrack: ( tr, b ) => [ b ? "unmute" : "mute", `${ b ? "unmute all tracks" : `mute all tracks except "${ tr }"` }` ],
	},
	blocks: {
		addBlock: pat => [ "plus", `add a new ${ pat } block` ],
		moveBlocks: len => [ "arrows", `move ${ len } block${ len > 1 ? "s" : "" }` ],
		selectBlocks: len => [ "mouse", `select ${ len } block${ len > 1 ? "s" : "" }` ],
		removeBlocks: len => [ "erase", `remove ${ len } block${ len > 1 ? "s" : "" }` ],
		cropEndBlocks: len => [ "crop", `crop-end ${ len } block${ len > 1 ? "s" : "" }` ],
		cropStartBlocks: len => [ "crop", `crop-start ${ len } block${ len > 1 ? "s" : "" }` ],
		unselectBlock: () => [ "mouse", "unselect 1 block" ],
		unselectAllBlocks: len => [ "mouse", `unselect ${ len } block${ len > 1 ? "s" : "" }` ],
		duplicateSelectedBlocks: len => [ "plus", `duplicate ${ len } block${ len > 1 ? "s" : "" }` ],
	},
	synth: {
		addOscillator: syn => [ "oscillator", `${ syn }: add osc` ],
		removeOscillator: syn => [ "oscillator", `${ syn }: remove osc` ],
		reorderOscillator: syn => [ "sort", `${ syn }: reorder oscs` ],
		changeOscillator: ( syn, prop, val ) => [ "oscillator", `${ syn }: change osc ${ prop } -> ${ val }` ],
		toggleEnv: ( syn, b ) => [ "osc-sine", `${ syn }: ${ b ? "enable" : "disable" } envelope` ],
		changeEnv: ( syn, prop, val ) => [ "osc-sine", `${ syn }: envelope's ${ prop } = ${ val }` ],
		toggleLFO: ( syn, b ) => [ "osc-sine", `${ syn }: ${ b ? "enable" : "disable" } LFO` ],
		changeLFO: ( syn, prop, val ) => [ "osc-sine", `${ syn }: LFO's ${ prop } = ${ val }` ],
	},
	synths: {
		addSynth: syn => [ "oscillator", `add new synth "${ syn }"` ],
		renameSynth: ( old, neww ) => [ "pen", `rename synth "${ old }" -> "${ neww }"` ],
		removeSynth: syn => [ "minus", `remove synth "${ syn }"` ],
		redirectSynth: ( syn, chanDest ) => [ "redirect", `redirect synth "${ syn }" to chan "${ chanDest }"` ],
	},
	channels: {
		addChannel: chan => [ "plus", `mixer: new channel "${ chan }"`, ],
		removeChannel: chan => [ "minus", `mixer: remove "${ chan }"`, ],
		reorderChannel: chan => [ "sort", `mixer: reorder "${ chan }"`, ],
		renameChannel: ( old, neww ) => [ "pen", `mixer: rename "${ old }" -> "${ neww }"` ],
		toggleChannel: ( chan, b ) => [ b ? "unmute" : "mute", `mixer: ${ b ? "unmute" : "mute" } "${ chan }"`, ],
		changeChannel: ( chan, prop, val ) => [ "mixer", `mixer: "${ chan }" ${ prop }: ${ val }`, ],
		redirectChannel: ( chan, chanDest ) => [ "redirect", `mixer: redirect "${ chan }" to "${ chanDest }"`, ],
	},
	patterns: {
		addPattern: ( type, pat ) => [ "plus", `add new ${ type } "${ pat }"` ],
		addPatternKeys: ( pat, syn ) => [ "plus", `add new keys "${ pat }" of synth "${ syn }"` ],
		renamePattern: ( type, old, neww ) => [ "pen", `rename ${ type } "${ old }" -> "${ neww }"` ],
		removePattern: ( type, pat ) => [ "minus", `remove ${ type } "${ pat }"` ],
		reorderPattern: ( type, pat ) => [ "sort", `reorder ${ type } "${ pat }"` ],
		clonePattern: ( type, pat, patSrc ) => [ "clone", `clone ${ type } "${ patSrc }" to "${ pat }"` ],
		redirectPatternBuffer: ( pat, chanDest ) => [ "redirect", `redirect buffer "${ pat }" to chan "${ chanDest }"` ],
		redirectPatternKeys: ( pat, syn ) => [ "redirect", `redirect keys "${ pat }" to synth "${ syn }"` ],
	},
	effects: {
		addEffect: ( dest, type ) => [ "effects", `fx: new ${ type } on ${ dest }`, ],
		toggleEffect: ( dest, type, b ) => [ b ? "unmute" : "mute", `fx: ${ b ? "unmute" : "mute" } ${ type } of ${ dest }`, ],
		removeEffect: ( dest, type ) => [ "minus", `fx: remove ${ type } of ${ dest }`, ],
		changeEffect: ( dest, type, prop ) => [ "effects", `fx: change ${ type }'s ${ prop } of ${ dest }` ],
	},
	drumrows: {
		addDrumrow: row => [ "drums", `drumrows: new "${ row }"` ],
		removeDrumrow: row => [ "drums", `drumrows: remove "${ row }"` ],
		reorderDrumrow: row => [ "drums", `drumrows: reorder "${ row }"` ],
		changeDrumrow: ( row, prop, val ) => [ "drums", `drumrows: "${ row }" ${ prop }: ${ val }` ],
		changeDrumrowPattern: ( row, newPat ) => [ "drums", `drumrows: "${ row }" -> "${ newPat }"` ],
		toggleDrumrow: ( row, b ) => [ "drums", `drumrows: ${ b ? "unmute" : "mute" } "${ row }"` ],
		toggleSoloDrumrow: ( row, b ) => [ "drums", `drumrows: ${ b ? "unmute all" : `mute all except "${ row }"` }` ],
	},
	drums: {
		addDrums: ( pat, row, nb ) => [ "drums", `drums: add ${ nb } "${ row }" in "${ pat }"` ],
		removeDrums: ( pat, row, nb ) => [ "drums", `drums: remove ${ nb } "${ row }" in "${ pat }"` ],
		changeDrumsProps: ( pat, row, prop, nb ) => [ "drums", `drums: set ${ prop } to ${ nb } "${ row }" in "${ pat }"` ],
	},
	keys: {
		moveKeys: len => [ "arrows", `move ${ len } key${ len > 1 ? "s" : "" }` ],
		selectKeys: len => [ "mouse", `select ${ len } key${ len > 1 ? "s" : "" }` ],
		cropEndKeys: len => [ "crop", `crop ${ len } key${ len > 1 ? "s" : "" }` ],
		unselectKey: () => [ "mouse", "unselect 1 key" ],
	},
};

// Everything below this line has to be removed, sorted and rewrited above.
// .............................................................................

DAWCore.History.prototype._nameAction = function( act ) {
	const cmp = this.daw.get.cmp(),
		r = act.redo,
		u = act.undo;

	return (
		DAWCore.History._nameAction_keys( cmp, r, u ) ||
		{ i: "close", t: "undefined" }
	);
};

DAWCore.History._nameAction_keys = function( cmp, r, u ) {
	for ( const a in r.keys ) {
		const o = r.keys[ a ];

		for ( const b in o ) {
			const arrK = Object.keys( o ),
				msgPat = cmp.patterns[ cmp.patternKeysOpened ].name,
				msgSmp = `${ arrK.length } key${ arrK.length > 1 ? "s" : "" }`,
				oB = o[ b ];

			return (
				( !oB                             && { i: "erase",  t: `${ msgPat }: remove ${       msgSmp }` } ) ||
				( !u.keys[ a ][ b ]               && { i: "keys",   t: `${ msgPat }: add ${          msgSmp }` } ) ||
				( "duration" in oB                && { i: "crop",   t: `${ msgPat }: crop ${         msgSmp }` } ) ||
				( "gain" in oB                    && { i: "keys",   t: `${ msgPat }: edit gain of ${ msgSmp }` } ) ||
				( "pan" in oB                     && { i: "keys",   t: `${ msgPat }: edit pan of ${  msgSmp }` } ) ||
				( ( "when" in oB || "key" in oB ) && { i: "arrows", t: `${ msgPat }: move ${         msgSmp }` } ) ||
				( "selected" in oB && ( oB.selected
					? { i: "mouse", t: `${ msgPat }: select ${ msgSmp }` }
					: { i: "mouse", t: `${ msgPat }: unselect ${ msgSmp }` }
				) )
			);
		}
	}
};
