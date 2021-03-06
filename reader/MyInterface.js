/**
 * MyInterface
 * @constructor
 */

function MyInterface() {
	//call CGFinterface constructor
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);

	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui

	this.gui = new dat.GUI();

	// add a button:
	// the first parameter is the object that is being controlled (in this case the scene)
	// the identifier 'doSomething' must be a function declared as part of that object (i.e. a member of the scene class)
	// e.g. LightingScene.prototype.doSomething = function () { console.log("Doing something..."); };

	// add a group of controls (and open/expand by defult)

	this.omnilights = this.gui.addFolder("Omnilights");
	this.omnilights.open();
	this.spotlights = this.gui.addFolder("Spotlights");
	this.spotlights.open();

	// add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
	// e.g. this.option1=true; this.option2=false;

	// add a slider
	// must be a numeric variable of the scene, initialized in scene.init e.g.
	// this.speed=3;
	// min and max values can be specified as parameters

	return true;
};

MyInterface.prototype.addLight = function(type, index, name){
	if(type == "omni")
  	this.omnilights.add(this.scene.lightStatus, index, this.scene.lightStatus[index]).name(name);
	else
		this.spotlights.add(this.scene.lightStatus, index, this.scene.lightStatus[index]).name(name);
}

/**
 * processKeyboard
 * @param event {Event}
 */
MyInterface.prototype.processKeyboard = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyboard.call(this,event);

	// Check key codes e.g. here: http://www.asciitable.com/
	// or use String.fromCharCode(event.keyCode) to compare chars
	// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
	if	(event.keyCode == 77)		//'m' ascii code
	{
			this.scene.updateMaterial();
	}
	if	(event.keyCode == 86)		// 'v' and 'V' ascii code
	{
			this.scene.updateViews();
	}
}
