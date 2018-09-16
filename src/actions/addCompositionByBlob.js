"use strict";

DAW.prototype.addCompositionByBlob = function( blob ) {
	return new Promise( ( res, rej ) => {
		const rd = new FileReader();

		rd.onload = () => {
			this.addCompositionByJSON( rd.result ).then( res, rej );
		};
		rd.readAsText( blob );
	} );
};
