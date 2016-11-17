function LinearAnimation (id, time, cPoints)
{
	this.id = id;
	this.time = time;
	this.cPoints = cPoints;
	
	//this.distance = ???
	
	
}
	
	LinearAnimation.prototype = Object.create(Animation.prototype);
	LinearAnimation.prototype.constructor = LinearAnimation;
	
	LinearAnimation.prototype.getPosition = function(t)
	{
		var matrix = mat4.create();
		
		if(t > this.time)
		{
			
			
		}
		
		
	}