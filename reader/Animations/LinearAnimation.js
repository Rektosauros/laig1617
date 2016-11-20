function LinearAnimation (id, time, cPoints)
{
	this.id = id;
	this.time = time;
	this.cPoints = cPoints;
	
	this.distance = 0;
	
	for (var i = 1; i < cPoints.length; i++)
		{
			
			this.distance += Math.sqrt(Math.pow(cPoints[i][0] - cPoints[i-1][0], 2) + Math.pow(cPoints[i][1] - cPoints[i-1][1], 2) + Math.pow(cPoints[i][2] - cPoints[i-1][2], 2));
			
		}
	
	
}
	
	LinearAnimation.prototype = Object.create(Animation.prototype);
	LinearAnimation.prototype.constructor = LinearAnimation;
	
	LinearAnimation.prototype.getPosition = function(t)
	{
		var matrix = mat4.create();
		
		if(t > this.time)
		{
			
			mat4.translate(matrix, matrix, this.cPoints[this.cPoints.length - 1]);
			mat4.rotate(matrix,matrix,Math.atan2(this.cPoints[this.cPoints.length - 2][0] - this.cPoints[this.cPoints.length - 1][0],this.cPoints[this.cPoints.length - 2][2] - this.cPoints[this.cPoints.length - 2][2] ); 
			return matrix;
			
		}
		
		var speed = this.distance * t / time;
		var currentDist = 0;
		var dist;
		var counter;
		
		for (counter = 1; counter < this.cPoints.length; counter++)
			{
				
				dist = Math.sqrt(Math.pow(cPoints[counter][0] - cPoints[counter-1][0], 2) + Math.pow(cPoints[counter][1] - cPoints[counter-1][1], 2) + Math.pow(cPoints[counter][2] - cPoints[counter-1][2], 2));
				if(currentDist + dist < this.distance)
					{
						currentDist += dist;
					}
				else 
					break;
						
			}
			
		var diff = this.distance - currentDist;
		var interpol = [];
		
		for (var i = 0; i < cPoints[counter].length; i++)
		{
			
			interpol[i] = cPoints[counter - 1][i] * (1.0 - diff/dist) + (cPoints[counter][i] * (diff/dist);
			
		}
		
		mat4.translate(matrix,matrix, interpol);
		mat4.rotate(matrix, matrix, Math.atan2(this.cPoints[counter][0] - this.cPoints[counter - 1][0],this.cPoints[counter][2] - this.cPoints[this.cPoints[counter - 1][2]), [0, 1, 0]);
		
		return matrix;
		
	}