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
			
			mat4.translate(matrix, matrix, this.cPoints[this.cPoints.length - 1]);
			mat4.rotate(matrix,matrix,Math.atan2(this.cPoints[this.cPoints.length - 2][0] - this.cPoints[this.cPoints.length - 1][0],this.cPoints[this.cPoints.length - 2][2] - this.cPoints[this.cPoints.length - 2][2] ), 
			return matrix;
			
		}
		
		var speed = this.distance * t / time;
		var currentDist = 0;
		var dist;
		var counter;
		
		for (counter = 1; counter < this.cPoints.length; counter++)
			{
				
				 dist = //distance between points
				
			}
		
		
	}