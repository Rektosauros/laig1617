function Node(){
	this.id=null;
	this.materials=[];
	this.default_mat=null;
	this.texture=null;
	this.m=null;
	this.prim_descendents=[];
	this.comp_descendents=[];
}

Node.prototype.pushPrimitives=function(nodeName){
	this.prim_descendents.push(nodeName);
};

Node.prototype.pushComponents=function(nodeName){
	this.comp_descendents.push(nodeName);
};

Node.prototype.pushMaterial=function(materialId){
	this.materials.push(materialId);
};

Node.prototype.setId=function(id){
	this.id=id;
};

Node.prototype.setDefmat=function(id){
	this.default_mat=id;
};

Node.prototype.setTexture=function(id){
	this.texture=id;
};

Node.prototype.setMatrix=function(m){
	this.m=mat4.clone(m);
	console.log(this.m);
};