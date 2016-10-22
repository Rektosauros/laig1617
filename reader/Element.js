 /**
  * Elemets
  * @constructor
  */
 function Element(scene, type, args,s,t) {
     CGFobject.call(this, scene);

     /*this.texture = new CGFappearance(scene);
    this.texture.loadTexture(tex);
    this.texture.setAmbient(1,1,1.3,1);
    this.texture.setDiffuse(0.1,0.1,0.1,1);
    this.texture.setSpecular(0.9,0.9,0.9,1);
    this.texture.setShininess(100);*/
    this.s=s || 1;
    this.t=t || 1;

     switch (type) {
         
                 
         case "rectangle":
             var xt = parseFloat(args[0]);
             var yt = parseFloat(args[1]);
             var xb = parseFloat(args[2]);
             var yb = parseFloat(args[3]);
                this.elementV = new MyQuad(this.scene,xt,yt,xb,yb);
             break;
         case "cylinder":
             //falta alterar os argumentos do climdro
             var bottom_radius= parseFloat(args[0]);
             var top_radius = parseFloat(args[1]);
             var height= parseFloat(args[2]);
             var slices= parseInt(args[3]);
             var stacks= parseInt(args[4]);
             this.elementV = new Cylinder(scene, bottom_radius, top_radius, height, slices, stacks);
             break;
         case "sphere":
             var sfa = parseFloat(args[0]);
             var sia = parseInt(args[1]);
             var sib = parseInt(args[2]);
             //falta alterar os argumentos do climdro
             this.elementV = new Sphere(scene, sfa, sia, sib);
             break;
          case "triangle":
         //falta alterar os argumentos do climdro
             var x1= parseFloat(args[0]);
             var y1= parseFloat(args[1]);
             var z1= parseFloat(args[2]);
             var x2= parseFloat(args[3]);
             var y2= parseFloat(args[4]);
             var z2= parseFloat(args[5]);
             var x3= parseFloat(args[6]);
             var y3= parseFloat(args[7]);
             var z3= parseFloat(args[8]);
            // this.elementV = new Triangle(scene,x1,y1,z1,x2,y2,z2,x3,y3,z3,s,t);
           // console.log(args);
           // console.log("here");
             this.elementV = new MyTriangle(scene,x1,y1,z1,x2,y2,z2,x3,y3,z3);
             break;
          case "torus":
            var inner = parseFloat(args[0]);
            var outer = parseFloat(args[1]);
            var slices = parseFloat(args[2]);
            var loops = parseFloat(args[3]);
            this.elementV = new Torus(scene, inner, outer, slices, loops);
         default:
             console.log("Identificao de elemento nao identificada");
             break;
     }
 };
 Element.prototype = Object.create(CGFobject.prototype);
 Element.prototype.constructor = Element;

 Element.prototype.display = function() {
     this.elementV.display();

 };
 Element.prototype.setAmplif = function(ampS, ampT) {
this.elementV.setAmplif(ampS,ampT);
};