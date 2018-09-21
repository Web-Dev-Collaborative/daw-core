"use strict";

DAW.time = {

	// mixtes:
	beatToMin( beat, bpm ) {
		return ~~( beat / bpm );
	},
	beatToSec( beat, bpm ) {
		return DAW.time._padZero( beat * 60 / bpm % 60 );
	},

	// beats:
	beatToBeat( beat ) {
		return "" + ~~( beat + 1 );
	},
	beatToStep( beat, stepsPerBeat ) {
		return DAW.time._padZero( beat % 1 * stepsPerBeat + 1 );
	},
	beatToMStep( beat, stepsPerBeat ) {
		return DAW.time._getMil( beat % 1 * stepsPerBeat );
	},

	// seconds:
	secToMin( sec ) {
		return "" + ~~( sec / 60 );
	},
	secToSec( sec ) {
		return DAW.time._padZero( sec % 60 );
	},
	secToMs( sec ) {
		return DAW.time._getMil( sec );
	},

	// private:
	_getMil( val ) {
		val = ~~( val * 1000 % 1000 );
		return ( val < 10 ? "00" : val < 100 ? "0" : "" ) + val;
	},
	_padZero( val ) {
		return ( val < 10 ? "0" : "" ) + ~~val;
	}
};
