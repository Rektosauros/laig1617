
function CircularAnimation(id, time, center, radius, sAng, rAng) {
	

		this.id = id;
		this.time = time;
		this.center = center;
		this.radius = radius;
		this.sAng = sAng;
		this.rAng = rAng;
	
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.getPosition = function(t)
{
	var matrix = mat4.create();
	
	if(t > this.time) 
		{
			this.time = t;
		}
	
	mat4.translate(matrix,matrix,this.center);
	mat4.rotate(matrix,matrix,this.sAng + (t/this.time) * this.rAng, [0,1,0]);
	mat4.translate(matrix,matrix,[this.radius, 0, 0]);
	
	if(this.rAng > 0)
		{
			mat4.rotate(matrix,matrix,Math.PI, [0,1,0]);
		}
		
	return matrix;
	
}