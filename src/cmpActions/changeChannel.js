"use strict";

DAWCore.actions.changeChannel = ( id, prop, val, get ) => {
	return [
		{ channels: { [ id ]: { [ prop ]: val } } },
		[ "mixer", "changeChannel", get.channel( id ).name, prop, val ],
	];
};
