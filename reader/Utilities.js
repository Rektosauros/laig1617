function Stack(item){
  this.stack = [];
  if(item != null){
    this.stack.push(item);
  }
};

Stack.prototype.push = function(item){
  this.stack.push(item);
};

Stack.prototype.pop = function(){
  this.stack.pop();
};

Stack.prototype.top = function(){
  return this.stack[this.stack.length - 1];
};