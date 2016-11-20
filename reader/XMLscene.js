function XMLscene(myInterface) {
    CGFscene.call(this);
	this.interface= myInterface
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();
    var graphRootId;

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.stacktexture= new Stack(null);   
    this.stackmaterial= new Stack(null);
	this.materialsIndex = 0;
	this.viewsIndex = 0;
	
	this.axis=new CGFaxis(this);
};

XMLscene.prototype.initLights = function () {

	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.gl.clearColor(this.graph.illumination["background"]["r"],this.graph.illumination["background"]["g"],this.graph.illumination["background"]["b"],this.graph.illumination["background"]["a"]);
	this.setGlobalAmbientLight(this.graph.illumination["ambient"]["r"],this.graph.illumination["ambient"]["g"],this.graph.illumination["ambient"]["b"],this.graph.illumination["ambient"]["a"]);
	// this.lights[0].setVisible(true);
 //    this.lights[0].enable();

 	graphRootId=this.graph.scene2["root"];

 	//create and enable lights
 	this.allLightsIds =[];
    for(var i=0;i<this.graph.lights.length;i++){
    	var temp_light=this.graph.lights[i];
    	var id=temp_light["id"];
        console.log(i+" "+id);
    	this.allLightsIds[i]=id;
    	if(temp_light["type"]=="omni"){
    		if(temp_light["enabled"]==1){
    			this.lights[i].setVisible(true);
    			this.lights[i].enable();
    		}
    		this.lights[i].setPosition(temp_light["location"]["x"], temp_light["location"]["y"], temp_light["location"]["z"], temp_light["location"]["w"]);
    		this.lights[i].setAmbient(temp_light["ambient"]["r"], temp_light["ambient"]["g"], temp_light["ambient"]["b"], temp_light["ambient"]["a"]);
    		this.lights[i].setDiffuse(temp_light["diffuse"]["r"], temp_light["diffuse"]["g"], temp_light["diffuse"]["b"], temp_light["diffuse"]["a"]);
    		this.lights[i].setSpecular(temp_light["specular"]["r"], temp_light["specular"]["g"], temp_light["specular"]["b"], temp_light["specular"]["a"]);
    	   console.log("created omni light with id:"+id);
        }
    	else if(temp_light["type"]=="spot"){
    		if(temp_light["enabled"]==1){
    			this.lights[i].setVisible(true);
    			this.lights[i].enable();
    		}
    		//not sure about these 2
    		this.lights[i].setSpotExponent(temp_light["exponent"]);
    		this.lights[i].setSpotDirection(temp_light["target"]["x"], temp_light["target"]["y"], temp_light["target"]["z"]);
    		this.lights[i].setPosition(temp_light["location"]["x"], temp_light["location"]["y"], temp_light["location"]["z"], temp_light["location"]["w"]);
    		this.lights[i].setAmbient(temp_light["ambient"]["r"], temp_light["ambient"]["g"], temp_light["ambient"]["b"], temp_light["ambient"]["a"]);
    		this.lights[i].setDiffuse(temp_light["diffuse"]["r"], temp_light["diffuse"]["g"], temp_light["diffuse"]["b"], temp_light["diffuse"]["a"]);
    		this.lights[i].setSpecular(temp_light["specular"]["r"], temp_light["specular"]["g"], temp_light["specular"]["b"], temp_light["specular"]["a"]);
    	   console.log("created spot light with id:"+id);
        }
    }


    //CREATE MATERIALS
    this.mats=[];
    this.allMatsIds =[];
    for(var i=0;i<this.graph.materials.length;i++){
        var temp_mat=this.graph.materials[i];
        var id=temp_mat["id"];
        this.allMatsIds[i]=id;

        var mat = new CGFappearance(this);
        mat.setEmission(temp_mat["emission"]["r"],temp_mat["emission"]["g"],temp_mat["emission"]["b"],temp_mat["emission"]["a"]);
        mat.setAmbient(temp_mat["ambient"]["r"],temp_mat["ambient"]["g"],temp_mat["ambient"]["b"],temp_mat["ambient"]["a"])
        mat.setDiffuse(temp_mat["diffuse"]["r"],temp_mat["diffuse"]["g"],temp_mat["diffuse"]["b"],temp_mat["diffuse"]["a"])
        mat.setSpecular(temp_mat["specular"]["r"],temp_mat["specular"]["g"],temp_mat["specular"]["b"],temp_mat["specular"]["a"])
        mat.setShininess(temp_mat["shininess"]["value"]);
        this.mats[id]=mat;
    }

    //CREATE TEXTURES
    this.txts=[];
    this.allTextsIds =[];
    this.amp_fact=[];
    for(var i=0;i<this.graph.textures.length;i++){
        var temp_txt=this.graph.textures[i];
        var id=temp_txt["id"];
        this.allMatsIds[i]=id;

        var text = new CGFappearance(this);
        text.loadTexture(temp_txt["file"]);

        this.amp_fact[i]=[];
        this.amp_fact[i]["s"]=this.graph.textures["length_s"];
        this.amp_fact[i]["t"]=this.graph.textures["length_t"];

        this.txts[id]=temp_txt["file"];
    }

    this.prims=[];
    console.log(this.graph.primitive);
    for(var i=0;i<this.graph.primitive.length;i++){
        var temp_prim=this.graph.primitive[i];
        var id=temp_prim["id"];
        console.log(temp_prim["type"]);
        this.prims[id]= new Element(this, temp_prim['type'], temp_prim['args']);
    }
    console.log(this.prims);
    // var teste2=teste.pop();

    
   // console.log(teste[teste.length-1]);

    
    //console.log(this.txts[this.graph.components["floor"].texture]);
	
	
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

     this.enableTextures(true);

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();



	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
        for(var i=0;i<this.lights.length;i++){
            this.lights[i].update();
        }
       // var t = new Element(this,"torus",[0.2,0.7,8,20]);
       // t.display();
         this.SceneDisplay(this.graph.scene2["root"]);
    //      var t= new Element(this,"cylinder",[0.5,0.1,2,8,20]);
    //      var a= new CGFappearance(this);
    //      a.setTexture("scenes\\grass.png");
    //      this.pushMatrix();
    //      a.apply();
    //      t.display();
	   // this.popMatrix();
    };	
};

XMLscene.prototype.SceneDisplay = function(id){
    
   
    var texture = new CGFappearance(this);
    var mat;
	console.log('leave this here \n');
   /* if(this.graph.components[id].default_mat=="inherit"){
        this.stackmaterial.push(this.stackmaterial.top());
        // console.log(mat);
    }else{
        this.stackmaterial.push(this.graph.components[id].default_mat);
        var mat = this.stackmaterial.top();
        // console.log(mat);
        this.stackmaterial.pop()
        // mat.apply();
    }*/

    if(mat!=null){
        var temp_mat=this.graph.materials[mat];
        // console.log(temp_mat);
        
        texture.setEmission(temp_mat["emission"]["r"],temp_mat["emission"]["g"],temp_mat["emission"]["b"],temp_mat["emission"]["a"]);
        texture.setAmbient(temp_mat["ambient"]["r"],temp_mat["ambient"]["g"],temp_mat["ambient"]["b"],temp_mat["ambient"]["a"])
        texture.setDiffuse(temp_mat["diffuse"]["r"],temp_mat["diffuse"]["g"],temp_mat["diffuse"]["b"],temp_mat["diffuse"]["a"])
        texture.setSpecular(temp_mat["specular"]["r"],temp_mat["specular"]["g"],temp_mat["specular"]["b"],temp_mat["specular"]["a"])
        texture.setShininess(temp_mat["shininess"]["value"]);
    }

    
    // var tex = this.txts[this.graph.components[id].texture];
    /*if(this.graph.components[id].textures=="inherit"){
        this.stacktexture.push(this.stacktexture.top());
        
    }else if(this.graph.components[id].textures != "none"){
        this.stacktexture.push(this.txts[this.graph.components[id].textures]);
        console.log(this.stacktexture.top());
        textures.setTexture(this.stacktexture.top());
         //texture.apply();
    }
    this.stacktexture.pop();
    */



    //mut de matrizes
    this.multMatrix(this.graph.components[id].m);
    if(this.graph.components[id].comp_descendents.length>0){
        for(var i=0;i<this.graph.components[id].comp_descendents.length;i++){
            this.pushMatrix();
            this.SceneDisplay(this.graph.components[id].comp_descendents[i]);
            this.popMatrix();
        }
    }else{
        for(var k=0;k<this.graph.components[id].prim_descendents.length;k++){
            var prim_id=this.graph.components[id].prim_descendents[k];
            console.log(this.prims);
            this.pushMatrix();
            this.prims[prim_id].display();
            this.popMatrix();
        }
	}


        
    


    // if(this.graph.components[id].texture!="inherit" && this.graph.components[id].texture!="none"){
    //     //remove o material da stack 
    //     this.stacktexture.pop();
    // }

    
};

XMLscene.prototype.updateViews = function(){
  this.camera = this.graph.views[this.viewsIndex];
  this.interface.setActiveCamera(this.camera);

  this.viewsIndex++;
  if (this.viewsIndex >= this.graph.views.length)
    this.viewsIndex = 0;
}

XMLscene.prototype.updateMaterial = function(){
  if (this.materialIndex < this.graph.materials.length)
    this.materialIndex++;
  else {
    this.materialIndex = 0;
  }
  console.log(this.materialIndex);
}
/*
XMLscene.prototype.update = function(currTime){
	
	var lastTime = this.lastTime || currTime;
	this.lastTime = currTime;
	
	var deltaTime = currTime-lastTime;

	console.log('Im updating... \n');
	
	this.graph.update(deltaTime);
}
*/