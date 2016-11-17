
/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */

function Plane(scene, dimX, dimY, uDivs, vDivs) {

	// nrDivs = 1 if not provided
	uDivs = typeof uDivs !== 'undefined' ? uDivs : 1;
	vDivs = typeof vDivs !== 'undefined' ? vDivs : 1;

	this.uDivs = uDivs;
	this.vDivs = vDivs;
	this.dimX = dimX;
	this.dimY = dimY;
	this.cPoints = []; // need to be initialized, dimX/2 and dimY/2
	
	
	this.plano = new Patch(this.scene, 1, 1, this.uDivs, this.vDivs, this.cPoints);
	
};

Plane.prototype = Object.create(Plane.prototype);
Plane.prototype.constructor = Plane;


Plane.prototype.display = function() 
{
	
	this.plano.display();
	
}
