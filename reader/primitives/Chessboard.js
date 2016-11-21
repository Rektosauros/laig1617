
/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */

function Chessboard(scene, dU, dV, text, sU, sV, c1, c2, cs) 
{

	this.scene = scene;
	
	this.dU = dU;
	this.dV = dV;
	
	this.text = text;
	
	this.sU = sU;
	this.sV = sV;
	
	this.c1 = c1;
	this.c2 = c2;
	this.c3 = c3;
	
	
	this.board = new Plane(this.scene, 1, 1, 100, 100);
	
	this.shader = new CGFshader(this.scene.gl, 'Shader/Chessboard.vert');
	
	this.mat = new CGFappearance(this.scene);
	
	this.mat.setTexture(this.text);
	this.mat.setTextureWrap('REPEAT', 'REPEAT');

	
};

Chessboard.prototype = Object.create(Chessboard.prototype);
Chessboard.prototype.constructor = Chessboard;


Chessboard.prototype.display = function() 
{
	
	this.mat.apply();
	this.board.display();
	
}
