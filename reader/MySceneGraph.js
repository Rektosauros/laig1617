
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;

	this.scene2=[];
	this.views=[];
	this.default_view;
	this.illumination=[];
	this.lights=[];
	this.textures=[];
	this.txt_ampfac=[];
	this.materials=[];
	this.transformations=[];
	this.primitive=[];
	this.components=[];
	//this.updates=[];

		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	// var error = this.parseGlobalsExample(rootElement);

	// if (error != null) {
	// 	this.onXMLError(error);
	// 	return;
	// }	

	var error = this.parseScene(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseViews(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseIllumination(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseLights(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseTextures(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseMaterials(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseTransformations(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parsePrimitives(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseComponents(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};



/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {
	
	var elems =  rootElement.getElementsByTagName('globals');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}
	
	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};
};

MySceneGraph.prototype.parseScene = function(rootElement){
	var elems = rootElement.getElementsByTagName('scene');
	if (elems == null) {
		return "scene element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'scene' element found.";	
	}
 //NOT SURE THIS WORKS THIS WAY
	
	this.scene2["root"]=this.reader.getString(elems[0],'root',true);
	this.scene2["axis_length"]=this.reader.getFloat(elems[0],'axis_length',true);
	console.log("Scene read from file: {root=" + this.scene2["root"] + ", axis_length=" + this.scene2["axis_length"]+ "}");
};

MySceneGraph.prototype.parseViews = function(rootElement){
	var elems = rootElement.getElementsByTagName('views');
	if (elems == null) {
		return "views element is missing.";
	}

	this.default_view=this.reader.getString(elems[0],'default',true);
	this.nr_views=elems[0].children.length;
	var ids=[];
	for(var i=0;i<this.nr_views;i++){
		var view = elems[0].children[i];
		var values=[];
		var id = this.reader.getString(view,'id',true);

		if(this.idExists(ids,id)==true)
			return "view with ID "+id+" already exists";
		ids.push(id);

		values["near"]=this.reader.getFloat(view,'near',true);
		values["far"]=this.reader.getFloat(view,'far',true);
		values["angle"]=this.reader.getFloat(view,'angle',true);
		console.log("View with id "+ id + " read from file: {near=" + values["near"] + ", far=" + values["far"]+ ", angle=" +values["angle"]  + "}");


		var from=view.children[0];
		values["from"]=[];
		values["from"]["x"]=this.reader.getFloat(from,'x',true);
		values["from"]["y"]=this.reader.getFloat(from,'y',true);
		values["from"]["z"]=this.reader.getFloat(from,'z',true);
		console.log("View with id "+ id + " read from file: from {x=" + values["from"]["x"] + ", y=" + values["from"]["y"] + ", z=" +values["from"]["z"]  + "}");

		var to=view.children[1];
		values["to"]=[];
		values["to"]["x"]=this.reader.getFloat(to,'x',true);
		values["to"]["y"]=this.reader.getFloat(to,'y',true);
		values["to"]["z"]=this.reader.getFloat(to,'z',true);
		console.log("View with id "+ id + " read from file: to {x=" + values["to"]["x"] + ", y=" + values["to"]["y"] + ", z=" +values["to"]["z"]  + "}");
		
		this.views[id]=values;
	}
};

MySceneGraph.prototype.parseIllumination = function(rootElement){
	var elems = rootElement.getElementsByTagName("illumination");
	if (elems == null) {
		return "scene element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'scene' element found.";	
	}

	var il=elems[0];
	var values;
	this.illumination["doublesided"]=this.reader.getItem(il,'doublesided',['0','1'],true);
	this.illumination["local"]=this.reader.getItem(il,'local',['0','1'],true);
	console.log("illumination read from file:  {doublesided=" + this.illumination["doublesided"] + ", local=" + this.illumination["local"]  + "}");

	var amb = il.children[0];
	this.illumination["ambient"]=[];
	this.illumination["ambient"]["r"]=this.reader.getFloat(amb,"r",true);
	this.illumination["ambient"]["g"]=this.reader.getFloat(amb,"g",true);
	this.illumination["ambient"]["b"]=this.reader.getFloat(amb,"b",true);
	this.illumination["ambient"]["a"]=this.reader.getFloat(amb,"a",true);
	console.log("illumination read from file: ambient {r=" + this.illumination["ambient"]["r"] + ", g=" + this.illumination["ambient"]["g"] + ", b=" +this.illumination["ambient"]["b"]+ ", a=" +this.illumination["ambient"]["a"]  + "}");

	var back = il.children[1];
	this.illumination["background"]=[];
	this.illumination["background"]["r"]=this.reader.getFloat(back,"r",true);
	this.illumination["background"]["g"]=this.reader.getFloat(back,"g",true);
	this.illumination["background"]["b"]=this.reader.getFloat(back,"b",true);
	this.illumination["background"]["a"]=this.reader.getFloat(back,"a",true);
	console.log("illumination read from file: background {r=" + this.illumination["background"]["r"] + ", g=" + this.illumination["background"]["g"] + ", b=" +this.illumination["background"]["b"]+ ", a=" +this.illumination["background"]["a"]  + "}");
};

MySceneGraph.prototype.parseLights = function(rootElement){
	var elems = rootElement.getElementsByTagName('lights');
	if(elems==null)
		return "lights element is missing";

	var ids =[];
	var nrChildrens= elems[0].children.length;
	for(var i=0;i<nrChildrens;i++){
		var values=[];
		var id = this.reader.getString(elems[0].children[i],'id',true);
		if(this.idExists(ids,id)==true)
			return "view with ID "+id+" already exists";
		ids.push(id);
		values["id"]=id;

		if(elems[0].children[i].tagName=="omni"){
			var children = elems[0].children[i];
			values["enabled"]=this.reader.getItem(children,'enabled',['0','1'],true);
			values["type"]="omni";
			console.log("Omni read from file:  {id=" + id + ", enabled=" + values["enabled"]  + "}");

			var location = children.children[0];
			values["location"]=[];
			values["location"]["x"]=this.reader.getFloat(location,'x',true);
			values["location"]["y"]=this.reader.getFloat(location,'y',true);
			values["location"]["z"]=this.reader.getFloat(location,'z',true);
			values["location"]["w"]=this.reader.getFloat(location,'w',true);
			console.log("Omni read from file: ambient {r=" + values["location"]["x"] + ", g=" + values["location"]["y"] + ", b=" +values["location"]["z"]+ ", a=" +values["location"]["w"]  + "}");	

			var amb = children.children[1];
			values["ambient"]=[];
			values["ambient"]["r"]=this.reader.getFloat(amb,"r",true);
			values["ambient"]["g"]=this.reader.getFloat(amb,"g",true);
			values["ambient"]["b"]=this.reader.getFloat(amb,"b",true);
			values["ambient"]["a"]=this.reader.getFloat(amb,"a",true);
			console.log("Omni read from file: ambient {r=" + values["ambient"]["r"] + ", g=" + values["ambient"]["g"] + ", b=" +values["ambient"]["b"]+ ", a=" +values["ambient"]["a"]  + "}");

			var dif = children.children[2];
			values["diffuse"]=[];
			values["diffuse"]["r"]=this.reader.getFloat(dif,"r",true);
			values["diffuse"]["g"]=this.reader.getFloat(dif,"g",true);
			values["diffuse"]["b"]=this.reader.getFloat(dif,"b",true);
			values["diffuse"]["a"]=this.reader.getFloat(dif,"a",true);
			console.log("Omni read from file: ambient {r=" + values["diffuse"]["r"] + ", g=" + values["diffuse"]["g"] + ", b=" +values["diffuse"]["b"]+ ", a=" +values["diffuse"]["a"]  + "}");

			var spec = children.children[3];
			values["specular"]=[];
			values["specular"]["r"]=this.reader.getFloat(spec,"r",true);
			values["specular"]["g"]=this.reader.getFloat(spec,"g",true);
			values["specular"]["b"]=this.reader.getFloat(spec,"b",true);
			values["specular"]["a"]=this.reader.getFloat(spec,"a",true);
			console.log("Omni read from file: ambient {r=" + values["specular"]["r"] + ", g=" + values["specular"]["g"] + ", b=" +values["specular"]["b"]+ ", a=" +values["specular"]["a"]  + "}");

			this.lights[i] =values;

		}

		else if(elems[0].children[i].tagName =="spot"){
			var children = elems[0].children[i];
			values["enabled"]=this.reader.getItem(children,'enabled',['0','1'],true);
			values["angle"]=this.reader.getFloat(children,'angle',true);
			values["exponent"]=this.reader.getFloat(children,'exponent',true);
			values["type"]="spot";
			console.log("spot read from file:  {id=" + id + ", enabled=" + values["enabled"]  + ", angle=" + values["angle"]  + ", exponent=" + values["exponent"]  +"}");

			var target = children.children[0];
			values["target"]=[];
			values["target"]["x"]=this.reader.getFloat(target,'x',true);
			values["target"]["y"]=this.reader.getFloat(target,'y',true);
			values["target"]["z"]=this.reader.getFloat(target,'z',true);
			console.log("spot read from file: target {r=" + values["target"]["x"] + ", g=" + values["target"]["y"] + ", b=" +values["target"]["z"]+"}");	

			var location = children.children[1];
			values["location"]=[];
			values["location"]["x"]=this.reader.getFloat(location,'x',true);
			values["location"]["y"]=this.reader.getFloat(location,'y',true);
			values["location"]["z"]=this.reader.getFloat(location,'z',true);
			console.log("spot read from file: location {r=" + values["location"]["x"] + ", g=" + values["location"]["y"] + ", b=" +values["location"]["z"]+"}");	

			var amb = children.children[2];
			values["ambient"]=[];
			values["ambient"]["r"]=this.reader.getFloat(amb,"r",true);
			values["ambient"]["g"]=this.reader.getFloat(amb,"g",true);
			values["ambient"]["b"]=this.reader.getFloat(amb,"b",true);
			values["ambient"]["a"]=this.reader.getFloat(amb,"a",true);
			console.log("spot read from file: ambient {r=" + values["ambient"]["r"] + ", g=" + values["ambient"]["g"] + ", b=" +values["ambient"]["b"]+ ", a=" +values["ambient"]["a"]  + "}");

			var dif = children.children[3];
			values["diffuse"]=[];
			values["diffuse"]["r"]=this.reader.getFloat(dif,"r",true);
			values["diffuse"]["g"]=this.reader.getFloat(dif,"g",true);
			values["diffuse"]["b"]=this.reader.getFloat(dif,"b",true);
			values["diffuse"]["a"]=this.reader.getFloat(dif,"a",true);
			console.log("spot read from file: diffuse {r=" + values["diffuse"]["r"] + ", g=" + values["diffuse"]["g"] + ", b=" +values["diffuse"]["b"]+ ", a=" +values["diffuse"]["a"]  + "}");

			var spec = children.children[4];
			values["specular"]=[];
			values["specular"]["r"]=this.reader.getFloat(spec,"r",true);
			values["specular"]["g"]=this.reader.getFloat(spec,"g",true);
			values["specular"]["b"]=this.reader.getFloat(spec,"b",true);
			values["specular"]["a"]=this.reader.getFloat(spec,"a",true);
			console.log("spot read from file: specular {r=" + values["specular"]["r"] + ", g=" + values["specular"]["g"] + ", b=" +values["specular"]["b"]+ ", a=" +values["specular"]["a"]  + "}");

			this.lights[i]=values;
		}
		else
			return "wrong tag introduced on lights (must be <omni> or <spot>)";

	}
};

MySceneGraph.prototype.parseTextures = function(rootElement){
	var elems = rootElement.getElementsByTagName('textures');
	if(elems==null)
		return "textures element is missing";

	var ids =[];
	var nrChildrens= elems[0].children.length;
	for(var i=0;i<nrChildrens;i++){
		var values=[];
		var id = this.reader.getString(elems[0].children[i],'id',true);
		values["id"]=id;
		if(this.idExists(ids,id)==true)
			return "view with ID "+id+" already exists";
		ids.push(id);

		var children = elems[0].children[i];
		values["file"]=this.reader.getString(children,'file',true);
		values["length_s"]=this.reader.getFloat(children,'length_s',true);
		values["length_t"]=this.reader.getFloat(children,'length_t',true);

		
		this.textures[i]=values;
	}
};

MySceneGraph.prototype.parseMaterials = function(rootElement){
	var elems = rootElement.getElementsByTagName('materials');
	console.log("HELLO");
	if(elems==null)
		return "materials element is missing";
	console.log(elems);
	var nr_materials=elems[0].children.length;

	var ids=[];
	for(var i=0;i<nr_materials;i++){
		var mat=elems[0].children[i];
		var values =[];
		var id=this.reader.getString(mat,'id',true);
		if(this.idExists(ids,id)==true)
			return "view with ID "+id+" already exists";
		ids.push(id);
		values["id"]=id

		var emission=mat.children[0];
		values["emission"]=[];
		values["emission"]["r"]=this.reader.getFloat(emission,"r",true);
		values["emission"]["g"]=this.reader.getFloat(emission,"g",true);
		values["emission"]["b"]=this.reader.getFloat(emission,"b",true);
		values["emission"]["a"]=this.reader.getFloat(emission,"a",true);
		console.log("Material read from file: emission {r=" + values["emission"]["r"] + ", g=" + values["emission"]["g"] + ", b=" +values["emission"]["b"]+ ", a=" +values["emission"]["a"]  + "}");

		var ambient=mat.children[1];
		values["ambient"]=[];
		values["ambient"]["r"]=this.reader.getFloat(ambient,"r",true);
		values["ambient"]["g"]=this.reader.getFloat(ambient,"g",true);
		values["ambient"]["b"]=this.reader.getFloat(ambient,"b",true);
		values["ambient"]["a"]=this.reader.getFloat(ambient,"a",true);
		console.log("Material read from file: ambient {r=" + values["ambient"]["r"] + ", g=" + values["ambient"]["g"] + ", b=" +values["ambient"]["b"]+ ", a=" +values["ambient"]["a"]  + "}");

		var diffuse=mat.children[2];
		values["diffuse"]=[];
		values["diffuse"]["r"]=this.reader.getFloat(diffuse,"r",true);
		values["diffuse"]["g"]=this.reader.getFloat(diffuse,"g",true);
		values["diffuse"]["b"]=this.reader.getFloat(diffuse,"b",true);
		values["diffuse"]["a"]=this.reader.getFloat(diffuse,"a",true);
		console.log("Material read from file: diffuse {r=" + values["diffuse"]["r"] + ", g=" + values["diffuse"]["g"] + ", b=" +values["diffuse"]["b"]+ ", a=" +values["diffuse"]["a"]  + "}");

		var specular=mat.children[3];
		values["specular"]=[];
		values["specular"]["r"]=this.reader.getFloat(specular,"r",true);
		values["specular"]["g"]=this.reader.getFloat(specular,"g",true);
		values["specular"]["b"]=this.reader.getFloat(specular,"b",true);
		values["specular"]["a"]=this.reader.getFloat(specular,"a",true);
		console.log("Material read from file: specular {r=" + values["specular"]["r"] + ", g=" + values["specular"]["g"] + ", b=" +values["specular"]["b"]+ ", a=" +values["specular"]["a"]  + "}");

		var shininess=mat.children[4];
		values["shininess"]=[];
		values["shininess"]["value"]=this.reader.getFloat(shininess,'value',true);

		this.materials[id]=values;
		console.log(values);
	}
	console.log(this.materials);
};

MySceneGraph.prototype.parseTransformations = function(rootElement){
	var elems = rootElement.getElementsByTagName('transformations');
	if(elems==null)
		return "transformations element is missing";

	var nr_transf=elems[0].children.length;
	var ids=[];
	console.log(nr_transf)
	for(var i=0;i<nr_transf;i++){
		var transf=elems[0].children[i];
		var all_transf=[];
		var id=this.reader.getString(transf,'id',true);
		console.log(id);

		if(this.idExists(ids,id)==true)
			return "trasnformation with ID "+id+" already exists";
		ids.push(id);

		var m= mat4.create();
		var nr_ch=transf.children.length;
		for(var k=0;k<nr_ch;k++){

			var values =[];
			console.log(transf.children[k].tagName)
			switch(transf.children[k].tagName){
				case 'translate':
					var transl = transf.children[k];
					//value["type"]=transl.tagName;
					var x=this.reader.getFloat(transl,'x',true);
					var y=this.reader.getFloat(transl,'y',true);
					var z=this.reader.getFloat(transl,'z',true);
					mat4.translate(m,m,[x,y,z]);
					break;
				case 'rotate':
					var rot = transf.children[k];
					//value["type"]=transl.tagName;
					switch (this.reader.getItem(rot,'axis',['x','y','z'],true)) {
						case "x":
							axis = [1, 0, 0];
							break;
						case "y":
							axis = [0, 1, 0];
							break;
						case "z":
							axis = [0, 0, 1];
							break;
					}
					var angle=this.reader.getFloat(rot,'angle',true);
					mat4.rotate(m,m, (Math.PI *angle) / 180, axis);
					break;
				case 'scale':
					var scale = transf.children[k];
					//value["type"]=transl.tagName;
					var sx=this.reader.getFloat(scale,'x',true);
					var sy=this.reader.getFloat(scale,'y',true);
					var sz=this.reader.getFloat(scale,'z',true);
					mat4.scale(m,m,[sx,sy,sz]);
					break;
			}
			// all_transf[k]=value;
		}
		this.transformations[id]=m;
	}
};

MySceneGraph.prototype.parsePrimitives=function(rootElement){
	var elems = rootElement.getElementsByTagName('primitives');
	if(elems==null)
		return "primitives element is missing";

	var nr_prim=elems[0].children.length;
	var ids=[];
	for(var i=0;i<nr_prim;i++){
		var prim=elems[0].children[i];
		var value=[];
		var id=this.reader.getString(prim,'id',true);
		if(this.idExists(ids,id)==true)
			return "view with ID "+id+" already exists";
		ids.push(id);
		value["id"]=id

		// console.log(i);
		// console.log(prim.children[0].tagName);
		console.log(prim.children[0]);
		switch(prim.children[0].tagName){
				case 'rectangle':
					var rect = prim.children[0];
					value["type"]=rect.tagName;
					var args=[];
					args.push(this.reader.getFloat(rect,'x1',true));
					args.push(this.reader.getFloat(rect,'y1',true));
					args.push(this.reader.getFloat(rect,'x2',true));
					args.push(this.reader.getFloat(rect,'y2',true));
					value["args"]=args;
					console.log("Primitive with id "+ id +" read from file: "+ value["type"]+ " {x1=" + args[0] + ", y1=" + args[1] + ", x2=" +args[2]+ ", y2=" +args[3]  + "}");
					break;
				case 'triangle':
					var tri = prim.children[0];
					value["type"]=tri.tagName;
					var args=[];
					args.push(this.reader.getFloat(tri,'x1',true));
					args.push(this.reader.getFloat(tri,'y1',true));
					args.push(this.reader.getFloat(tri,'z1',true));
					args.push(this.reader.getFloat(tri,'x2',true));
					args.push(this.reader.getFloat(tri,'y2',true));
					args.push(this.reader.getFloat(tri,'z2',true));
					args.push(this.reader.getFloat(tri,'x3',true));
					args.push(this.reader.getFloat(tri,'y3',true));
					args.push(this.reader.getFloat(tri,'z3',true));
					value["args"]=args;
					console.log("Primitive with id "+ id +" read from file: "+ value["type"]+ " {x1=" + args[0] + ", y1=" + args[1] + ", z1=" +args[2]+ ", x2=" +args[3]  + ", y2=" +args[4]  + ", z2=" +args[5] + ", x3=" +args[6]  +", y3=" +args[7]  +", z3=" +args[8]  +"}");
					break;
				case 'cylinder':
					var cyl = prim.children[0];
					value["type"]=cyl.tagName;
					var args=[];
					args.push(this.reader.getFloat(cyl,'base',true));
					args.push(this.reader.getFloat(cyl,'top',true));
					args.push(this.reader.getFloat(cyl,'height',true));
					args.push(this.reader.getInteger(cyl,'slices',true));
					args.push(this.reader.getInteger(cyl,'stacks',true));
					value["args"]=args;
					console.log("Primitive with id "+ id +" read from file: "+ value["type"]+ " {base=" + args[0] + ", top=" + args[1] + ", height=" +args[2]+ ", slices=" +args[3]  + ", stacks=" +args[4]  +"}");
					break;
				case 'sphere':
					var sph=prim.children[0];
					value["type"]=sph.tagName;
					var args=[];
					args.push(this.reader.getFloat(sph,'radius',true));
					args.push(this.reader.getInteger(sph,'slices',true));
					args.push(this.reader.getInteger(sph,'stacks',true));
					value["args"]=args;
					console.log("Primitive with id "+ id +" read from file: "+ value["type"]+ " {radius=" + args[0] + ", slices=" + args[1] + ", stacks=" +args[2]+  "}");
					break;
				case 'torus':
					var tor=prim.children[0];
					value["type"]=tor.tagName;
					var args=[];
					args.push(this.reader.getFloat(tor,'inner',true));
					args.push(this.reader.getFloat(tor,'outer',true));
					args.push(this.reader.getInteger(tor,'slices',true));
					args.push(this.reader.getInteger(tor,'loops',true));
					value["args"]=args;
					console.log("Primitive with id "+ id +" read from file: "+ value["type"]+ " {inner=" + args[0]+ ", outer=" + args[1] + ", slices=" +args[2]+ ", loops=" +args[3]  + "}");
					break;
				default:
					return "primitive with id "+id+" not recognized";
			}
			// console.log(value);
			this.primitive[i]=value; 
	}
	console.log(this.primitive);
};

MySceneGraph.prototype.parseComponents = function(rootElement){
	var elems = rootElement.getElementsByTagName('components');
	if(elems==null)
		return "components element is missing";

	var nr_comp=elems[0].children.length;
	var ids=[];
	for(var i=0;i<nr_comp;i++){
		var comp=elems[0].children[i];
		var value=[];
		var comp_id=this.reader.getString(comp,'id',true);
		if(this.idExists(ids,comp_id)==true)
			return "Component with ID "+comp_id+" already exists";
		ids.push(comp_id);
		var node = new Node();
		node.setId(comp_id);
		var m = mat4.create();

		var transf=comp.children[0];
		console.log(comp);
		if(transf.children[0]!=null){
			if(transf.children[0].tagName=='transformationref'){
				var transf_id=this.reader.getString(transf.children[0],'id',true);
				console.log(transf_id);
				console.log(this.transformations)
				node.setMatrix(this.transformations[transf_id]);
			}else{
				// value["trasformation"]["transformationref"]=-1; //default value to check if theres a transf_ref
				for(k=0;k<transf.children.length;k++){
					switch(transf.children[k].tagName){
						case 'translate':
							var transl = transf.children[k];
							//value["type"]=transl.tagName;
							var x=this.reader.getFloat(transl,'x',true);
							var y=this.reader.getFloat(transl,'y',true);
							var z=this.reader.getFloat(transl,'z',true);
							mat4.translate(m,m,[x,y,z]);
							node.setMatrix(m);
							console.log("translation of component "+comp_id+" with the values: x:"+x+", y:"+y+", z:"+z);
							break;
						case 'rotate':
							var rot = transf.children[k];
							//value["type"]=transl.tagName;
							switch (this.reader.getItem(rot,'axis',['x','y','z'],true)) {
							case "x":
								axis = [1, 0, 0];
								var ax="x";
								break;
							case "y":
								axis = [0, 1, 0];
								var ax="y";
								break;
							case "z":
								axis = [0, 0, 1];
								var ax="z";
								break;
						}
							var angle=this.reader.getFloat(rot,'angle',true);
							mat4.rotate(m,m, (Math.PI *angle) / 180, axis);
							node.setMatrix(m);
							console.log("Rotation of component "+comp_id+" with the values: axis:"+ax+", angle:"+angle);
							break;
						case 'scale':
							var scale = transf.children[k];
							//value["type"]=transl.tagName;
							var sx=this.reader.getFloat(scale,'x',true);
							var sy=this.reader.getFloat(scale,'y',true);
							var sz=this.reader.getFloat(scale,'z',true);
							mat4.scale(m,m,[sx,sy,sz]);
							node.setMatrix(m);
							console.log("Scale of component "+comp_id+" with the values: sx:"+sx+", sy:"+sy+", sz:"+sz);
							break;
						default:
							return "trasnformation on component with id "+comp_id+" not recognized";
					}

				}
				
			}
		}else
			node.setMatrix(m);
		
		var mats = comp.children[1];
		n_mats=mats.children.length;
		for(k=0;k<n_mats;k++){
			var mat=mats.children[k];
			mat_id=this.reader.getString(mat,'id',true);
			node.pushMaterial(mat_id);
			if(k==0)
				node.setDefMat(mat_id);
		}

		var text=comp.children[2];
		var text_id=this.reader.getString(text,'id',true);
		node.setTexture(text_id);

		var chil = comp.children[3];
		var n_ch=chil.children.length;
		for(k=0;k<n_ch;k++){
			switch(chil.children[k].tagName){
				case 'componentref':
					var comp_ref=this.reader.getString(chil.children[k],'id',true);
					node.pushComponents(comp_ref);
					break;
				case 'primitiveref':
					var prim_ref=this.reader.getString(chil.children[k],'id',true);
					node.pushPrimitives(prim_ref);
					break;
				default:
					return "childrens on component with id "+comp_id+" not recognized";
			}
		}
		this.components[node.id]=node;
	}
	console.log(this.components);
};
MySceneGraph.prototype.idExists = function(IDs, id) {
	var exists = false;
	for (var i = 0; i < IDs.length; i++) {
		if (IDs[i] == id)
			exists = true;
	}
	if (exists)
		return true;
	else false;
};
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;
};

/*
MySceneGraph.prototype.update = function(deltaTime) {
	
	for (var i = 0; i < this.updates.length(); i++)
		{
		
		this.updates[i];
		
		}
	
}
*/
