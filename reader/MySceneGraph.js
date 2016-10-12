
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
	this.scene=[];
	this.views=[];
	this.default_view;
	this.illumination=[];
	this.omni =[];
	this.spot=[];
	this.textures=[];
	this.materials=[];
	this.transformations=[];
	this.primitives=[];
		
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
	var error = this.parseGlobalsExample(rootElement);

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
	
	scene["root"]=this.reader.getString(elems[0],'root',true);
	scene["axis_length"]=this.reader.getFloat(elems[0],'axis_length',true);
	console.log("Scene read from file: {root=" + scene["root"] + ", axis_length=" + scene["axis_length"]+ "}");


};

MySceneGraph.prototype.parseViews = function(rootElement){
	var elems = rootElement.getElementsByTagName('views');
	if (elems == null) {
		return "views element is missing.";
	}

	this.default_view=this.reader.getString(elems[0],'id',true);
	this.nr_views=elems[0].children.length;
	var ids=[];
	for(var i=0;i<nr_views;i++){
		var view = elems[0].children[i];
		var values=[];
		var id = this.reader.getString(view,'id',true);

		if(idExists(ids,id)==true)
			return "view with ID "+id+" already exists";
		ids.push(id);

		values["near"]=this.reader.getFloat(view,'near',true);
		values["far"]=this.reader.getFloat(view,'far',true);
		values["angle"]=this.reader.getFloat(view,'angle',true);
		console.log("View with id "+ id + " read from file: {near=" + values["near"] + ", far=" + values["far"]+ ", angle=" +values["angle"]  + "}");


		var from=view.children[0];
		values["from"]["x"]=this.reader.getFloat(from,'x',true);
		values["from"]["y"]=this.reader.getFloat(from,'y',true);
		values["from"]["z"]=this.reader.getFloat(from,'z',true);
		console.log("View with id "+ id + " read from file: from {x=" + values["from"]["x"] + ", y=" + values["from"]["y"] + ", z=" +values["from"]["z"]  + "}");

		var to=view.children[0];
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
	this.illumination["doublesided"]=this.reader.getItem(il,'doublesided',[0,1],true);
	this.illumination["local"]=this.reader.getItem(il,'local',[0,1],true);
	console.log("illumination read from file:  {doublesided=" + values["doublesided"] + ", local=" + values["local"]  + "}");

	var amb = il.children[0];
	this.illumination["ambient"]["r"]=this.reader.getFloat(amb,"r",true);
	this.illumination["ambient"]["g"]=this.reader.getFloat(amb,"g",true);
	this.illumination["ambient"]["b"]=this.reader.getFloat(amb,"b",true);
	this.illumination["ambient"]["a"]=this.reader.getFloat(amb,"a",true);
	console.log("illumination read from file: ambient {r=" + values["amb"]["r"] + ", g=" + values["amb"]["g"] + ", b=" +values["amb"]["b"]+ ", a=" +values["amb"]["a"]  + "}");

	var back = il.children[1];
	this.illumination["background"]["r"]=this.reader.getFloat(back,"r",true);
	this.illumination["background"]["g"]=this.reader.getFloat(back,"g",true);
	this.illumination["background"]["b"]=this.reader.getFloat(back,"b",true);
	this.illumination["background"]["a"]=this.reader.getFloat(back,"a",true);
	console.log("illumination read from file: background {r=" + values["back"]["r"] + ", g=" + values["back"]["g"] + ", b=" +values["back"]["b"]+ ", a=" +values["back"]["a"]  + "}");
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
		if(idExists(ids,id)==true)
			return "view with ID "+id+" already exists";
		ids.push(id);

		if(elems[0].children[i].tagName=="omni"){
			var children = elems[0].children[i];
			this.values["enabled"]=this.reader.getItem(children,'enabled',[0,1],true);
			console.log("Omni read from file:  {id=" + id + ", enabled=" + values["enabled"]  + "}");

			var location = children.children[0];
			this.values["location"]["x"]=this.reader.getFloat(location,'x',true);
			this.values["location"]["y"]=this.reader.getFloat(location,'y',true);
			this.values["location"]["z"]=this.reader.getFloat(location,'z',true);
			this.values["location"]["w"]=this.reader.getFloat(location,'w',true);
			console.log("Omni read from file: ambient {r=" + values["amb"]["r"] + ", g=" + values["amb"]["g"] + ", b=" +values["amb"]["b"]+ ", a=" +values["amb"]["a"]  + "}");	

			var amb = children.children[1];
			this.values["ambient"]["r"]=this.reader.getFloat(amb,"r",true);
			this.values["ambient"]["g"]=this.reader.getFloat(amb,"g",true);
			this.values["ambient"]["b"]=this.reader.getFloat(amb,"b",true);
			this.values["ambient"]["a"]=this.reader.getFloat(amb,"a",true);
			console.log("Omni read from file: ambient {r=" + values["amb"]["r"] + ", g=" + values["amb"]["g"] + ", b=" +values["amb"]["b"]+ ", a=" +values["amb"]["a"]  + "}");

			var dif = children.children[2];
			this.values["diffuse"]["r"]=this.reader.getFloat(dif,"r",true);
			this.values["diffuse"]["g"]=this.reader.getFloat(dif,"g",true);
			this.values["diffuse"]["b"]=this.reader.getFloat(dif,"b",true);
			this.values["diffuse"]["a"]=this.reader.getFloat(dif,"a",true);
			console.log("Omni read from file: ambient {r=" + values["diffuse"]["r"] + ", g=" + values["diffuse"]["g"] + ", b=" +values["diffuse"]["b"]+ ", a=" +values["diffuse"]["a"]  + "}");

			var spec = children.children[3];
			this.values["specular"]["r"]=this.reader.getFloat(spec,"r",true);
			this.values["specular"]["g"]=this.reader.getFloat(spec,"g",true);
			this.values["specular"]["b"]=this.reader.getFloat(spec,"b",true);
			this.values["specular"]["a"]=this.reader.getFloat(spec,"a",true);
			console.log("Omni read from file: ambient {r=" + values["specular"]["r"] + ", g=" + values["specular"]["g"] + ", b=" +values["specular"]["b"]+ ", a=" +values["specular"]["a"]  + "}");

			this.omni[id] =values;

		}

		else if(elems.[0].children[i].tagName =="spot"){
			var children = elems[0].children[i];
			this.values["enabled"]=this.reader.getItem(children,'enabled',true);
			this.values["angle"]=this.reader.getFloat(children,'angle',true);
			this.values["exponent"]=this.reader.getFloat(children,'exponent',true);
			console.log("Omni read from file:  {id=" + id + ", enabled=" + values["enabled"]  + ", angle=" + values["angle"]  + ", exponent=" + values["exponent"]  +"}");

			var target = children.children[0];
			this.values["target"]["x"]=this.reader.getFloat(target,'x',true);
			this.values["target"]["y"]=this.reader.getFloat(target,'y',true);
			this.values["target"]["z"]=this.reader.getFloat(target,'z',true);
			console.log("Omni read from file: target {r=" + values["target"]["x"] + ", g=" + values["target"]["y"] + ", b=" +values["target"]["z"]+"}");	

			var location = children.children[1];
			this.values["location"]["x"]=this.reader.getFloat(location,'x',true);
			this.values["location"]["y"]=this.reader.getFloat(location,'y',true);
			this.values["location"]["z"]=this.reader.getFloat(location,'z',true);
			console.log("Omni read from file: location {r=" + values["location"]["x"] + ", g=" + values["location"]["y"] + ", b=" +values["location"]["z"]+"}");	

			var amb = children.children[2];
			this.values["ambient"]["r"]=this.reader.getFloat(amb,"r",true);
			this.values["ambient"]["g"]=this.reader.getFloat(amb,"g",true);
			this.values["ambient"]["b"]=this.reader.getFloat(amb,"b",true);
			this.values["ambient"]["a"]=this.reader.getFloat(amb,"a",true);
			console.log("Omni read from file: ambient {r=" + values["amb"]["r"] + ", g=" + values["amb"]["g"] + ", b=" +values["amb"]["b"]+ ", a=" +values["amb"]["a"]  + "}");

			var dif = children.children[3];
			this.values["diffuse"]["r"]=this.reader.getFloat(dif,"r",true);
			this.values["diffuse"]["g"]=this.reader.getFloat(dif,"g",true);
			this.values["diffuse"]["b"]=this.reader.getFloat(dif,"b",true);
			this.values["diffuse"]["a"]=this.reader.getFloat(dif,"a",true);
			console.log("Omni read from file: diffuse {r=" + values["diffuse"]["r"] + ", g=" + values["diffuse"]["g"] + ", b=" +values["diffuse"]["b"]+ ", a=" +values["diffuse"]["a"]  + "}");

			var spec = children.children[4];
			this.values["specular"]["r"]=this.reader.getFloat(spec,"r",true);
			this.values["specular"]["g"]=this.reader.getFloat(spec,"g",true);
			this.values["specular"]["b"]=this.reader.getFloat(spec,"b",true);
			this.values["specular"]["a"]=this.reader.getFloat(spec,"a",true);
			console.log("Omni read from file: specular {r=" + values["specular"]["r"] + ", g=" + values["specular"]["g"] + ", b=" +values["specular"]["b"]+ ", a=" +values["specular"]["a"]  + "}");

			this.spot[id]=values;
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
		if(idExists(ids,id)==true)
			return "view with ID "+id+" already exists";
		ids.push(id);

		var children = elems[0].children[i];
		values["file"]=this.reader.getString(children,'file',true);
		values["length_s"]=this.reader.getFloat(children,'length_s',true);
		values["length_t"]=this.reader.getFloat(children,'length_t',true);

		this.textures[id]=values;
	}
};

MySceneGraph.prototype.parseMaterials = function(rootElement){
	var elems = rootElement.getElementsByTagName('materials');
	if(elems==null)
		return "materials element is missing";

	this.nr_materials=elems[0].children.length;
	var ids=[];
	for(var i=0;i<nr_materials;i++){
		var mat=elems[0].children[i];
		var values =[];
		var id=this.reader.getString(mat,'id',true);
		if(idExists(ids,id)==true)
			return "view with ID "+id+" already exists";
		ids.push(id);

		var emission=mat.children[0];
		this.values["emission"]["r"]=this.reader.getFloat(emission,"r",true);
		this.values["emission"]["g"]=this.reader.getFloat(emission,"g",true);
		this.values["emission"]["b"]=this.reader.getFloat(emission,"b",true);
		this.values["emission"]["a"]=this.reader.getFloat(emission,"a",true);
		console.log("Material read from file: emission {r=" + values["emission"]["r"] + ", g=" + values["emission"]["g"] + ", b=" +values["emission"]["b"]+ ", a=" +values["emission"]["a"]  + "}");

		var ambient=mat.children[1];
		this.values["ambient"]["r"]=this.reader.getFloat(ambient,"r",true);
		this.values["ambient"]["g"]=this.reader.getFloat(ambient,"g",true);
		this.values["ambient"]["b"]=this.reader.getFloat(ambient,"b",true);
		this.values["ambient"]["a"]=this.reader.getFloat(ambient,"a",true);
		console.log("Material read from file: ambient {r=" + values["ambient"]["r"] + ", g=" + values["ambient"]["g"] + ", b=" +values["ambient"]["b"]+ ", a=" +values["ambient"]["a"]  + "}");

		var diffuse=mat.children[2];
		this.values["diffuse"]["r"]=this.reader.getFloat(diffuse,"r",true);
		this.values["diffuse"]["g"]=this.reader.getFloat(diffuse,"g",true);
		this.values["diffuse"]["b"]=this.reader.getFloat(diffuse,"b",true);
		this.values["diffuse"]["a"]=this.reader.getFloat(diffuse,"a",true);
		console.log("Material read from file: diffuse {r=" + values["diffuse"]["r"] + ", g=" + values["diffuse"]["g"] + ", b=" +values["diffuse"]["b"]+ ", a=" +values["diffuse"]["a"]  + "}");

		var specular=mat.children[3];
		this.values["specular"]["r"]=this.reader.getFloat(specular,"r",true);
		this.values["specular"]["g"]=this.reader.getFloat(specular,"g",true);
		this.values["specular"]["b"]=this.reader.getFloat(specular,"b",true);
		this.values["specular"]["a"]=this.reader.getFloat(specular,"a",true);
		console.log("Material read from file: specular {r=" + values["specular"]["r"] + ", g=" + values["specular"]["g"] + ", b=" +values["specular"]["b"]+ ", a=" +values["specular"]["a"]  + "}");

		var shininess=mat.children[4];
		this.values["shininess"]["value"]=this.reader.getFloat(shininess,'value',true);

		this.materials[id]=values;
	}
};

MySceneGraph.prototype.parseTransformations = function(rootElement){
	var elems = rootElement.getElementsByTagName('transformations');
	if(elems==null)
		return "transformations element is missing";

	this.nr_transf=elems[0].children.length;
	var ids=[];
	for(var i=0;i<nr_transf;i++){
		var transf=elems[0].children[i];
		var all_transf=[];
		var id=this.reader.getString(transf,'id',true);
		if(idExists(ids,id)==true)
			return "view with ID "+id+" already exists";
		ids.push(id);

		var nr_ch=trasnf.children.length;
		for(var k=0;i<nr_ch;i++){

			var values =[];
			switch(transf.children[k].tagName){
				case 'translate':
					var transl = transf.children[k];
					//value["type"]=transl.tagName;
					value["translate"]["x"]=this.reader.getFloat(translate,'x',true);
					value["translate"]["y"]=this.reader.getFloat(translate,'y',true);
					value["translate"]["z"]=this.reader.getFloat(translate,'z',true);
					break;
				case 'rotate':
					var rot = transf.children[k];
					//value["type"]=transl.tagName;
					value["rotate"]["axis"]=this.reader.getItem(rotate,'axis',['x','y','z'],true);
					value["rotate"]["angle"]=this.reader.getFloat(translate,'angle',true);
					break;
				case 'scale':
					var scale = transf.children[k];
					//value["type"]=transl.tagName;
					value["scale"]["x"]=this.reader.getFloat(scale,'x',true);
					value["scale"]["y"]=this.reader.getFloat(scale,'y',true);
					value["scale"]["z"]=this.reader.getFloat(scale,'z',true);
					break;
			}
			all_transf[k]=value;
		}
		this.transformations[id]=all_transf;
	}
};

MySceneGraph.prototype.parsePrimitives=function(rootElement){
	var elems = rootElement.getElementsByTagName('primitives');
	if(elems==null)
		return "primitives element is missing";

	this.nr_prim=elems[0].children.length;
	var ids=[];
	for(var i=0;i<nr_prim;i++){
		var prim=elems[0].children[i];
		var value=[];
		var id=this.reader.getString(prim,'id',true);
		if(idExists(ids,id)==true)
			return "view with ID "+id+" already exists";
		ids.push(id);

		switch(prim.children[k].tagName){
				case 'rectangle':
					var rect = prim.children[i];
					value["type"]=rect.tagName;
					value["x1"]=this.reader.getFloat(rect,'x1',true);
					value["y1"]=this.reader.getFloat(rect,'y1',true);
					value["x2"]=this.reader.getFloat(rect,'x2',true);
					value["y2"]=this.reader.getFloat(rect,'y2',true);
					break;
				case 'triangle':
					var tri = transf.children[i];
					value["type"]=transl.tagName;
					value["x1"]=this.reader.getFloat(tri,'x1',true);
					value["y1"]=this.reader.getFloat(tri,'y1',true);
					value["z1"]=this.reader.getFloat(tri,'z1',true);
					value["x2"]=this.reader.getFloat(tri,'x2',true);
					value["y2"]=this.reader.getFloat(tri,'y2',true);
					value["z2"]=this.reader.getFloat(tri,'z2',true);
					value["x3"]=this.reader.getFloat(tri,'x3',true);
					value["y3"]=this.reader.getFloat(tri,'y3',true);
					value["z3"]=this.reader.getFloat(tri,'z3',true);
					break;
				case 'cylinder':
					var cyl = transf.children[i];
					value["type"]=transl.tagName;
					value["base"]=this.reader.getFloat(cyl,'base',true);
					value["top"]=this.reader.getFloat(cyl,'top',true);
					value["height"]=this.reader.getFloat(cyl,'height',true);
					value["slices"]=this.reader.getInteger(cyl,'slices',true);
					value["stacks"]=this.reader.getInteger(cyl,'stacks',true);
					break;
				case 'sphere':
					var sph=transf.children[i];
					value["type"]=transl.tagName;
					value["radius"]=this.reader.getFloat(sph,'radius',true);
					value["slices"]=this.reader.getInteger(sph,'slices',true);
					value["stacks"]=this.reader.getInteger(sph,'stacks',true);
					break;
				case 'torus':
					var tor=transf.children[i];
					value["type"]=transl.tagName;
					value["inner"]=this.reader.getFloat(tor,'inner',true);
					value["outter"]=this.reader.getFloat(tor,'outter',true);
					value["slices"]=this.reader.getInteger(tor,'slices',true);
					value["loops"]=this.reader.getInteger(tor,'loops',true);
					break;
				default:
					return "primitive with id "+id+" not recognized";
			}
			this.primitive[id]=values;
	}
};

MySceneGraph.prototype.parseComponents = function(rootElement){
	var elems = rootElement.getElementsByTagName('components');
	if(elems==null)
		return "components element is missing";

	this.nr_comp=elems[0].children.length;
	var ids=[];
	for(var i=0;i<nr_comp;i++){
		var comp=elems[0].children[i];
		var value=[];
		var comp_id=this.reader.getString(prim,'id',true);
		if(idExists(ids,comp_id)==true)
			return "view with ID "+comp_id+" already exists";
		ids.push(comp_id);

		var transf=comp.children[0];
		if(transf.children[0].tagName=='transformationref'){
			value["trasformation"]["transformationref"]=this.reader.getString(transf.children[0],'id',true);
		}else{
			value["trasformation"]["transformationref"]=-1; //default value to check if theres a transf_ref
			for(k=0;k<transf.children.length;k++){
				var transf=comp.children[0];
				switch(transf.children[0].tagName){
					case 'translate':
						var transl = transf.children[k];
						//value["type"]=transl.tagName;
						value["trasformation"]["translate"]["x"]=this.reader.getFloat(translate,'x',true);
						value["trasformation"]["translate"]["y"]=this.reader.getFloat(translate,'y',true);
						value["trasformation"]["translate"]["z"]=this.reader.getFloat(translate,'z',true);
						break;
					case 'rotate':
						var rot = transf.children[k];
						//value["type"]=transl.tagName;
						value["trasformation"]["rotate"]["axis"]=this.reader.getItem(rotate,'axis',['x','y','z'],true);
						value["trasformation"]["rotate"]["angle"]=this.reader.getFloat(translate,'angle',true);
						break;
					case 'scale':
						var scale = transf.children[k];
						//value["type"]=transl.tagName;
						value["trasformation"]["scale"]["x"]=this.reader.getFloat(scale,'x',true);
						value["trasformation"]["scale"]["y"]=this.reader.getFloat(scale,'y',true);
						value["trasformation"]["scale"]["z"]=this.reader.getFloat(scale,'z',true);
						break;
					default:
						return "trasnformation on component with id "+comp_id+" not recognized";
				}
			}
		}
		var mats = comp.children[1];
		n_mats=mats.children.length;
		for(K=0;k<n_mats;k++){
			vat mat=mats.children[k];
			value["materials"][k]["id"]=this.reader.getString(mat,'id',true);
		}

		var text=comp.children[2];
		value["texture"]["id"]=this.reader.getString(text,'id',true);

		var chil = comp.children[3];
		var n_ch=chil.children.length;
		for(k=0;k<n_ch;k++){
			switch(chil.children[k].tagName){
				case 'componentref':
					value["children"]["componentref"]["id"]=this.reader.getString(chil.children[k],'id',true);
					break;
				case 'primitiveref':
					value["children"]["primitiveref"]["id"]=this.reader.getString(chil.children[k],'id',true);
					break;
				default:
					return "childrens on component with id "+comp_id+" not recognized";
			}
		}
		this.components[comp_id]=value;
	}
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
   

