<template>
  <div class="hello">
    <canvas id="myTreeView"></canvas>
    <div class="chooseOne" v-if="visibleDiag">
      <div class="description">
        Select to element to add:
      </div>
      <div class="row">
        <div class="col-xs-6" v-on:click="addNode(2)">
          <button class="btn btn-condition"><i class="icon-condition"/>Condition</button>
        </div>
        <div  class="col-xs-6" v-on:click="addNode(1)">
          <button class="btn btn-action">Action</button>
        </div>
      </div>    
    </div>
  </div>
</template>

<script>
import treeData from './data.json'
export default {
  name: 'MyTree',
  data () {
    return {
      treeData: null,
      treeWidth: 1,
      treeDepth: 1,
      margin: 10,
      nodeWidth: 200,
      nodeHeight: 50,
      plusWidth: 30,
      paddingHeight: 70,
      node: null,
      visibleDiag:false,
      selectedPath:""
     }
  },
  mounted() {
    this.load();
  },
  methods: {
    load:function(){
      console.log(treeData);
      this.treeData = treeData;
      this.getTree();
    },
    addNode:function (kindOfNode){
      var terms =[{},{a:[{}]}, {c:[{},{}]}];
      if (Object.keys(this.treeData).length == 0 ){
        this.treeData = terms[kindOfNode] ; 
      }else{
        this.updateObject(this.treeData, terms[kindOfNode], this.selectedPath);
      }
      
    
      this.getTree();
      this.visibleDiag=false;
      this.getResult();
    },
    getTreeSize:function(obj, depth, left, jPath){
      var ptr = this;
      var nChild = -1; 
      
      Object.keys(obj).forEach(function(k) {
        if(k === "a") {
          ptr.node.push({'kind':1, 'left':left, 'top':depth});
          nChild = ptr.getTreeSize(obj['a'][0], depth + 1, left ,jPath+">a>0");
          return;
        }
        else if (k === "c") {
          ptr.node.push({'kind':2, 'left':left, 'top':depth});
          nChild = ptr.getTreeSize(obj['c'][0], depth + 1, left - 1.0/(depth*depth) ,jPath+">c>0" ) + ptr.getTreeSize(obj['c'][1], depth + 1, left + 1.0/(depth*depth) ,jPath+">c>1" ) + 1
          return;
        }
      });
      if (this.treeDepth < depth) this.treeDepth = depth;
      if (nChild<0){
        ptr.node.push({'kind':0, 'left':left, 'top':depth, 'jPath':jPath});
      }
      return Math.abs(nChild);
    },
    
    getTree: function () {
 
      this.node = new Array();
      this.treeDepth = 1;
      this.treeWidth = this.getTreeSize(this.treeData, this.treeDepth,0,"");

      // get distict Array of LeftValue
      var distictLeft = new Array();
      for (var i=0;i<this.node.length;i++){
        var flag = true;
        for (var j=0;j<i;j++){
          if (this.node[i].left==this.node[j].left) { flag = false; break; }
        }
        if (flag){
          distictLeft.push(this.node[i].left);
        }
      }

      //roundRect (action)
      function roundRect( context, x, y, w, h, radius, color)
      {
        var r = x + w;
        var b = y + h;
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(x+radius, y);
        context.lineTo(r-radius, y);
        context.quadraticCurveTo(r, y, r, y+radius);
        context.lineTo(r, y+h-radius);
        context.quadraticCurveTo(r, b, r-radius, b);
        context.lineTo(x+radius, b);
        context.quadraticCurveTo(x, b, x, b-radius);
        context.lineTo(x, y+radius);
        context.quadraticCurveTo(x, y, x+radius, y);
        context.fill();
      }

      //hexigon (condition)
      function hexigon( context, x, y, w, h, r,color)
      {
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(x , y+h/2);
        context.lineTo(x+r, y);
        context.lineTo(x+w-r, y);
        context.lineTo(x+w, y+h/2);
        context.lineTo(x+w-r, y+h);
        context.lineTo(x+r, y+h);
        context.fill();
      }

      //addText
      function addText(context,x,y,w,h,text,size,color){
        context.font = size+'pt Georgia';
        context.textAlign = 'center';
        context.fillStyle = color;
        context.fillText(text, x+w/2, y+h/2+size/2-3);
      }


      //drawLine
      function drawArrow( context, x, y, w, h, radius, color)
      {
        var r = x + w;
        var b = y + h;
        if (w<0) radius=-radius;
        //line
        context.strokeStyle = color ;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(r-radius, y);
        if (w<0) radius=-radius;
        context.quadraticCurveTo(r, y, r, y+radius);
        context.lineTo(r,b-8);
        context.lineWidth = 2;
        context.stroke();
        //arrow
        context.fillStyle = color
        context.beginPath();
        context.moveTo(r,b);
        context.lineTo(r+5,b-8);
        context.lineTo(r-5,b-8);
        context.fill();

      }

      //get offset from left as integer
      function getLeftOffset(cLeft){
        var offset = 0;
        for (var j=0;j<distictLeft.length;j++){
          if (distictLeft[j]<cLeft){
            offset++;
          }
        }
        return offset;
      }

      // draw nodes
      var canvas = document.getElementById("myTreeView");
      canvas.width = this.treeWidth*this.nodeWidth+this.margin*2;
      canvas.height = this.treeDepth*(this.nodeHeight+this.paddingHeight)+this.margin*2;

      for (var i=0;i<this.node.length;i++){
        var left,top,kind;
        left = getLeftOffset(this.node[i].left);
        top = this.node[i].top;
        kind = this.node[i].kind;
 
        
        
        
        var ctx = canvas.getContext("2d");
        var sX,sY,eX,eY;

        sX=left*this.nodeWidth + this.margin  ;
        sY=top*(this.nodeHeight + this.paddingHeight) + this.margin - this.paddingHeight  ;
        eX=this.nodeWidth;
        eY=this.nodeHeight;

        if (this.node[i].kind==1){
          drawArrow(ctx,sX+eX/2,sY+eY/2,0,this.paddingHeight+eY/2  ,15,"#ADB5BD");
          roundRect(ctx,sX,sY,eX,eY,28,"#D252E0");
          addText(ctx,sX,sY,eX,eY,"Action",15,"#ffffff");
          
        }else if (this.node[i].kind==2){

          var leftDown = -1;
          var rightDown = -1;
          for (var j=0;j<this.node.length;j++){
            if (this.node[j].top-1==top){
              if (this.node[j].left<this.node[i].left) {
                if (leftDown<0) leftDown = j;
                if (this.node[j].left>this.node[leftDown].left){
                  leftDown = j;
                }
              }else{
                if (rightDown<0) rightDown = j;
                if (this.node[j].left<this.node[rightDown].left){
                  rightDown = j;
                }
              }
               
            }
          }
          
          var leftChild = left - getLeftOffset(this.node[leftDown].left);
          var rightChild = getLeftOffset(this.node[rightDown].left)-left;
          
          drawArrow(ctx,sX + eX / 2,sY + eY / 2, -leftChild*this.nodeWidth,this.paddingHeight+eY/2  ,15,"#ADB5BD");
          drawArrow(ctx,sX+eX/2,sY+eY/2,rightChild*this.nodeWidth,this.paddingHeight+eY/2  ,15,"#ADB5BD");
          hexigon(ctx,sX,sY,eX,eY,15,"#388AE0");
          addText(ctx,sX,sY,eX,eY,"Condition",15,"#ffffff");
        }else{
          roundRect(ctx,sX+eX/2-this.plusWidth/2 ,sY+eY/2-this.plusWidth*1.5,this.plusWidth,this.plusWidth,3,"#388AE0");
          addText(ctx,sX+eX/2-this.plusWidth/2 ,sY+eY/2-this.plusWidth*1.5,this.plusWidth,this.plusWidth,"+",24,"#ffffff");
          
        }
   
      }
      var ptr = this;
      canvas.addEventListener('click', (e) => {

        var posx;
        var posy;
        if (!e) var e = window.event;
        if (e.pageX || e.pageY) {
          posx = e.pageX;
          posy = e.pageY;
        }
        else if (e.clientX || e.clientY) {
          posx = e.clientX + document.body.scrollLeft + document.getElementById("canvas").scrollLeft;
          posy = e.clientY + document.body.scrollTop  + document.getElementById("canvas").scrollTop;
        }
        const mousePos = {
          x: posx,
          y: posy
        };



        for (var i=0;i<ptr.node.length;i++){
          var left,top,kind;
          kind = ptr.node[i].kind;
          if (kind) continue;
          left = getLeftOffset(ptr.node[i].left);
          top = ptr.node[i].top;
          var sX,sY,eX,eY;
          //var ctx = canvas.getContext("2d");
          //roundRect(ctx,mousePos.x,mousePos.y,3,3,0,'#ff0000');
          sX=left*ptr.nodeWidth + ptr.margin + ptr.nodeWidth/2-this.plusWidth/2  ;
          sY=top*(ptr.nodeHeight + ptr.paddingHeight) + ptr.margin - ptr.paddingHeight + ptr.nodeHeight/2-this.plusWidth*1.5 ;
          eX=ptr.plusWidth;
          eY=ptr.plusWidth;
 

          if (mousePos.x>sX && mousePos.x<sX+eX){
            if (mousePos.y>sY && mousePos.y<sY+eY){
              ptr.visibleDiag=true;
              ptr.selectedPath=ptr.node[i].jPath.slice(1);
            }
          }

        }
         
      }); 


    },
    updateObject:function(object, newValue, path){
      
      var stack = path.split('>');

      while(stack.length>1){
        object = object[stack.shift()];
      }

      object[stack.shift()] = newValue;
     },
     getResult:function(){
       console.log(this.treeData);
     }

 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#myTreeView{
  position:absolute;
  top:0px;
  left:0px;
}
.chooseOne{
  position: fixed;
  transform: translateY(-50%);
  transform: translateX(-50%);
  top:30%;
  left: 50%;
  min-width: 350px;
  height: 200px;
  padding: 20px;
  background-color:#d3d3d3;
  border-radius: 6px;
}
.description{
  padding:40px;
}
.btn-condition{
  background-color: #388AE0 !important;
  color:white;
  width:120px !important;
}
.btn-action{
  background-color: #D252E0 !important;
  color:white;
  width:120px !important;
}
.icon-condition{
  background-image:url("../assets/condition.svg");
  min-width:30px;
  min-height:30px;
}
</style>
