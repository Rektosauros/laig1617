function Patch(scene, deg1, deg2, uDivs, vDivs, cPoints) 
{
		CGFobject.call(this,scene);
		
		var knots1 = [];
		var knots2 = [];
		var cVerts = [];
		var vert = 0;

		knots1 = this.getKnotsVector(deg1);
		knots2 = this.getKnotsVector(deg2);
		
		for (var i = 0; i < deg+1; i++)
			
			{
				var temp = [];
				
				for(var j = 0; j < deg+1; j++)
					{
					cPoints[vert].push(1);
					temp.push(cPoints[vert++]);
					}
				cVerts.push(temp);
				
			}
		
	this.surface = new CGFnurbsSurface(deg1, deg2, knots1, knots2, cVerts);
	
	var surface = this.surface;
	
	getSurfacePoint = function(u,v)
		{
		
			return surface.getPoint(u,v);
		
		}
	
	
	this.obj = new CGFnurbsObject(scene, getSurfacePoint, uDivs, vDivs);
		
}

Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor = Patch;


Patch.prototype.getKnotsVector = function(degree)
{
	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;	
}


Patch.prototype.display = function ()
{
	
	this.obj.display();
	
}


