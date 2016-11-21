function Vehicle(scene, reader) 
{
		CGFobject.call(this,scene);
		this.scene = scene;
		this.reader = reader;
	
	
	var points = [[-1, 0, 1, 1], [-2, 1, 0.8, 1], [-2, 1, -0.8, 1], [-1, 2, -0.8, 1], [-1, 4, -0.8, 1],
        [0, 0, 1, 1], [0, 1, 0.8, 1], [0, 1, -0.8, 1], [0, 2, -0.8, 1], [0, 4, -0.8, 1],
        [1, 0, 1, 1], [1, 1, 0.8, 1], [1, 1, -0.8, 1], [1, 2, -0.8, 1], [1, 4, -0.8, 1],
        [1, 0, 1, 1], [2, 1, 0.8, 1], [2, 1, -0.8, 1], [1, 2, -0.8, 1], [1, 4, -0.8, 1]];

    var points2 = [[1.5, 0, 1, 1], [2, 1, 0.8, 1], [2, 1, -0.8, 1], [1.5, 2, -0.8, 1], [1.5, 4, -0.8, 1],
        [1.5, 0, -1, 1], [1.5, 0.8, -1, 1], [1.5, 1, -1, 1], [1.5, 2, -1, 1], [1.5, 4, -1, 1],
        [1.5, 0, -1, 1], [1.5, 0.8, -1, 1], [1.5, 1, -1, 1], [1.5, 2, -1, 1], [1.5, 4, -1, 1]];

    var points3 = [[1.5, 0, -1, 1], [1.5, 0.8, -1, 1], [1.5, 1, -1, 1], [1.5, 2, -1, 1], [1.5, 4, -1, 1],
        [1.5, 0, -1, 1], [1.5, 0.8, -1, 1], [1.5, 1, -1, 1], [1.5, 2, -1, 1], [1.5, 4, -1, 1],
        [1.5, 0, 1, 1], [2, 1, 0.8, 1], [2, 1, -0.8, 1], [1.5, 2, -0.8, 1], [1.5, 4, -0.8, 1]];

    var points4 = [[-1.5, 4, -0.8, 1], [-1.8, 4.2, -2.05, 1], [-1.8, 4.4, -3.3, 1], [-1.8, 4, -4.6, 1], [-1.5, 4, -4.8, 1],
        [-1.3, 4, -0.8, 1], [-1.3, 4.2, -2.05, 1], [-1.3, 4.4, -3.3, 1], [-1.3, 4, -4.6, 1], [-1.3, 4, -4.8, 1],
        [1.5, 4, -0.8, 1], [1.5, 4.2, -2.05, 1], [1.5, 4.4, -3.3, 1], [1.5, 4, -4.6, 1], [1.5, 4, -4.8, 1]];

    var points5 = [[1.5, 4, -0.8, 1], [1.5, 4.2, -2.05, 1], [1.5, 4.4, -3.3, 1], [1.5, 4, -4.6, 1], [1.5, 4, -4.8, 1],
        [1.5, 4, -0.8, 1], [1.5, 4, -2.05, 1], [1.5, 4, -3.3, 1], [1.5, 4, -4.6, 1], [1.5, 4, -4.8, 1],
				[1.5, 0, -0.8, 1],[1.5, 0, -1.8, 1],[1.5, 0, -2.8, 1],[1.5, 0, -3.8, 1],[1.5, 0, -4.8, 1]];

	var points7 = [[1.5, 0, -0.8, 1],[1.5, 0, -1.8, 1],[1.5, 0, -2.8, 1],[1.5, 0, -3.8, 1],[1.5, 0, -4.8, 1],
				[1.5, 4, -0.8, 1], [1.5, 4.2, -2.05, 1], [1.5, 4.4, -3.3, 1], [1.5, 4, -4.6, 1], [1.5, 4, -4.8, 1],
			  [1.5, 4, -0.8, 1], [1.5, 4, -2.05, 1], [1.5, 4, -3.3, 1], [1.5, 4, -4.6, 1], [1.5, 4, -4.8, 1]];

    var points6 = [[1.5, 0.25, -0.9, 1], [1.5, 0.5, -1, 1], [1.5, 0.75, -1.25, 1], [1.5, 1, -1.5, 1], [1.5, 0.75, -1.75, 1], [1.5, 0.5, -2, 1], [1.5, 0.25, -2.1, 1],
        [1.75, 0.25, -0.9, 1], [1.75, 0.5, -1, 1], [1.75, 0.95, -1.25, 1], [1.75, 1.2, -1.5, 1], [1.75, 0.95, -1.75, 1], [1.75, 0.5, -2, 1], [1.75, 0.25, -2.1, 1],
        [2, 0.25, -0.9, 1], [2, 0.45, -1, 1], [2, 0.7, -1.25, 1], [2, 0.95, -1.5, 1], [2, 0.7, -1.75, 1], [2, 0.45, -2, 1], [2, 0.25, -2.1, 1],
        [2, 0.25, -0.9, 1], [2, 0.3, -1, 1], [2, 0.55, -1.25, 1], [2, 0.8, -1.5, 1], [2, 0.55, -1.75, 1], [2, 0.3, -2, 1], [2, 0.25, -2.1, 1]
    ];

	var points8 = [[1.5, 4, -4.8, 1],[-1.5, 4, -4.8, 1],
									[1.5, 0, -4.8, 1],[-1.5, 0, -4.8, 1]];


    this.front = new Patch(this.scene, 3, 4, 20, 20, points);
    this.leftDoor = new Patch(this.scene, 2, 4, 20, 20, points2);
    this.rightDoor = new Patch(this.scene, 2, 4, 20, 20, points3);
    this.top = new Patch(this.scene, 2, 4, 20, 20, points4);
    this.left = new Patch(this.scene, 2, 4, 20, 20, points5);
	this.right = new Patch(this.scene, 2, 4, 20, 20, points7);
    this.hood = new Patch(this.scene, 3, 6, 20, 20, points6);
    this.wheel = new Cylinder(this.scene, 0.5, 0.5, 0.4, 50, 50);
	this.back = new Patch(this.scene,1,1,20,20,points8);
	this.quad = new Rectangle(this.scene,0.5,0.5,-0.5,-0.5);



	this.wheelApp = new CGFappearance(this.scene);
	//texture


};

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Vehicle;

/**
 * Adds the base and the top of the Car. Updates Car's height
 */
Vehicle.prototype.display = function () {

    this.scene.pushMatrix();
    this.front.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.leftDoor.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-3,0,0);
	this.rightDoor.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.top.display();
    this.scene.popMatrix();

	this.scene.pushMatrix();
    this.back.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.left.display();
    this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(-3,0,0);
	this.right.display();
	this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,0,0.25);
    this.hood.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,0,-2.5);
    this.hood.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, 0, -5.5);
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.hood.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, 0, -2.75);
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.hood.display();
    this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0,0.5,-9);
	this.cable.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(-1.5, 0.2, -4);
	this.scene.rotate(3*Math.PI / 2, 0, 1, 0);
	this.wheel.display();
	this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-1.5, 0.2, -7.5);
    this.scene.rotate(3*Math.PI / 2, 0, 1, 0);
    this.wheel.display();
    this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(-1.5, 0.2, -1.25);
	this.scene.rotate(3*Math.PI / 2, 0, 1, 0);
	this.wheel.display();
	this.scene.popMatrix();

    this.scene.pushMatrix();
	this.scene.translate(-1.5, 0.2, -10.25);
	this.scene.rotate(3*Math.PI / 2, 0, 1, 0);
	this.wheel.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
    this.scene.translate(1.5, 0.2, -4);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.wheel.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(1.5, 0.2, -7.5);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.wheel.display();
    this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(1.5, 0.2, -1.25);
	this.scene.rotate(Math.PI / 2, 0, 1, 0);
	this.wheel.display();
	this.scene.popMatrix();

    this.scene.pushMatrix();
	this.scene.translate(1.5, 0.2, -10.25);
	this.scene.rotate(Math.PI / 2, 0, 1, 0);
	this.wheel.display();
	this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, 2.2, -0.7);
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.scale(2.5,3,2);
    this.quad.display();
    this.scene.popMatrix();

}

Vehicle.prototype.updateTexCoords = function (s, t) {

}