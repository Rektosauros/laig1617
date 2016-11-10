
/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */

function Plane(scene, nrDivs, k) {
	CGFobject.call(this,scene);

	// nrDivs = 1 if not provided
	nrDivs = typeof nrDivs !== 'undefined' ? nrDivs : 1;

	this.nrDivs = nrDivs;
	this.patchLength = 1.0 / nrDivs;
	this.ratioConstant = k || 1;
	this.inverseRatioConstant = (1/k) || 1;

	this.initBuffers();
};

Plane.prototype = new CGFnurbsObject(this, func, uDivs, vDivs);
Plane.prototype.constructor = Plane;

Plane.prototype.initBuffers = function() {
	
	var vector = this.getSurfacePoint(uDivs, vDivs);
	
	//this.x = vector.x;
	//this.y = vector.y;
	//this.z = vector.z;
	
	

	this.initGLBuffers();
};

/*
Plane.prototype.display = function() {
	
	this.vector.display(); ????
	
	
}
*/