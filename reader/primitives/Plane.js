
/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */

function Plane(scene, uDivs, vDivs) {

	// nrDivs = 1 if not provided
	uDivs = typeof uDivs !== 'undefined' ? uDivs : 1;
	vDivs = typeof vDivs !== 'undefined' ? vDivs : 1;

	this.uDivs = uDivs;
	this.vDivs = vDivs;
	//this.patchLength = 1.0 / nrDivs; - need to end patch.
};

Plane.prototype = new CGFnurbsObject(this, func, uDivs, vDivs);
Plane.prototype.constructor = Plane;



/*
Plane.prototype.display = function() {
	
	this.vector.display(); ????
	
	
}
*/