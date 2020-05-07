

//Initial canvas parameters
var row=10;
var size=600,start=200,end=start+size,rectSize=size/row;
var headingTextSize=50;
var topOffset=50;


var pressed=false;
var selected=[];
var ships=[];
var shipsLeft=[0,4,3,2,1];

var username1;
var username2;


function component(id,l,t) {
    this.id=id;
    this.selected=false;
    this.left=l;
    this.top=t;
}
class Ship {
    constructor(arr){
        this.components=arr;
        this.hit=false;
    }
    comp(){
        return this.components;
    }
  }
  var images=[];
  

//Add ship images on top of the canvas
function addImage(imgUrl,sz){
    var div = document.createElement("div");

    div.style.z=2;

    //Has to be absolute
    div.style.position="absolute";
    var componentNum=0;
    var first=sh.components[0];
    var last=sh.components[sh.components.length-1];
    var elem;
    var rotated=false;
    if(first.top==last.top){
        if(parseInt(first.left)<parseInt(last.left)){
            elem=first;
            
            div.style.transform = "rotate(180deg)";
        }else{
            elem=last;
        }
    }else{
        if(parseInt(first.top)<parseInt(last.top)){
            elem=first;
            
        div.style.transform = "rotate(270deg)";
        }else{
            elem=last;
            
        div.style.transform = "rotate(90deg)";
        }
        rotated=true;
    }
    div.class="imageScript";
    div.style.backgroundRepeat="no-repeat";
    div.style.width=sz*rectSize;
    div.style.height=rectSize;
    div.style.backgroundSize="105% 90%";
    div.style.backgroundImage="url('"+imgUrl+"')";
    div.onclick=click;
    div.style.backgroundPosition="center";
    div.id=first.id;
    if(elem!=null){
        if(rotated){
             div.style.left=elem.left-(sz-1)/2*rectSize;
            div.style.top=(sz-1)/2*rectSize+parseInt(elem.top);
            console.log(elem.top.length);
        }else{
            div.style.left=elem.left;
            console.log(elem.left);
            div.style.top=parseInt(elem.top);
        }
    }
    document.body.appendChild(div);
    images.push(div);
}

var divs=[];
//Put rectangular divs on top of the canvas
function fillRects(){
    var gridSeparation=0.8;
    for(pp=0;pp<row*row;pp+=1){
        var div = document.createElement("div");
       //TOP
        div.style.top = headingTextSize+topOffset+rectSize*(pp%row)+"px";

        //LEFT
        div.style.left = start+rectSize*Math.floor(pp/row)+"px";

        //Size
        div.style.width=size/row-gridSeparation+"px";
        div.style.height=size/row-gridSeparation+"px";

        div.class="divScript";
        //Margins
        div.style.marginTop="0px";
        div.style.marginBottom="0px";
        div.style.marginLeft="0px";
        div.style.marginRight="0px";
        div.style.backgroundColor="blue";
        div.style.borderWidth="20px";
        div.style.opacity=0;
        div.style.z=2;
        //Has to be absolute
        div.style.position="absolute";
        div.id=pp+"";
        //Functions
        div.onmouseenter=hoverEnter; div.onmouseleave=hoverExit;div.onclick=click;div.onpointerdown=mousePressed;div.onpointerup=mouseReleased;
        document.body.appendChild(div);
        divs.push(div);
    }
}
var cnt=0;

var sh=new Ship([]);
sh.hit=false;


var invalid=false;
function mousePressed(){
    event.preventDefault(); 
    pressed=true;
    
    var elem=findElem(this.id);
    if(elem==undefined){
        cnt++;
        sh.components.push(new component(this.id,this.style.left.slice(0,-2),this.style.top.slice(0,-2)));
    }
    
}

//Check if the current ship's position is valid
function checkValid(){
    for(var k=0;k<sh.components.length;k++){
        var id=sh.components[k].id;
        
        for(var i=0;i<ships.length;i++){
            var ship=ships[i];
            for(var j=0;j<ship.components.length;j++){
                var comp=ship.components[j];
                if((comp.id-1==id&&parseInt(comp.id)%10!=0)||(comp.id==id-1&&parseInt(comp.id)%10!=9)||comp.id==id-10||comp.id-10==id||(comp.id-11==id&&parseInt(comp.id)%10!=0)||(comp.id==id-11&&parseInt(comp.id)%10!=9)||(comp.id-9==id&&parseInt(comp.id)%10!=9)||comp.id==id-9&&parseInt(comp.id)%10!=0){

                    invalid=true;
                    return;
                }
            }
        }
    }
}

//Check current ship's shape
function checkShape(){
    var curr=0;
    var rB=true,cB=true;

    //Check rows
    for(var k=0;k<sh.components.length;k++){
        var id=sh.components[k].id;
        var rw=id%10;
        if(curr==0)
            curr=rw;
        if(curr!=rw){
            rB=false;
            break;
        }
    }
    curr=0;
    //Check columns
    for(var k=0;k<sh.components.length;k++){
        var id=sh.components[k].id;
        var col=Math.floor(id/10);
        if(curr==0)
           curr=col;
        if(curr!=col){
            cB=false;
            break;
        }
    }
    if(rB==false&&cB==false)
        invalid=true;   
}

function checkShipsLeft(){
    if(shipsLeft[sh.components.length]==0){
        invalid=true;
    }
}
var toDelete=null;

function deleteShip(elem){
    for(var i=0;i<toDelete.components.length;i++){
        var comp=toDelete.components[i]; 
        document.getElementById(comp.id).style.opacity=0;
    }
    var index=ships.indexOf(toDelete);
    ships.splice(index, 1);
    localStorage.setItem(username,JSON.stringify(ships));
}
function findElem(id){
    for(var i=0;i<ships.length;i++){
        var ship=ships[i];
         var elem=ship.components.find(x => x.id == id);
         if(elem!=undefined){
             toDelete=ship;
             return elem;
         }
    }
    return undefined;
}


function mouseReleased(){
    checkValid();
   
    if(invalid==false){
        checkShape();
    }
    if(invalid==false){
        checkShipsLeft();
    }
    if(invalid==true){
        //Not valid -> anull
        
        for(var i=0;i<sh.components.length;i++){
            var id=sh.components[i].id;
            var el=document.getElementById(id);
            el.style.opacity=0;
        }
        
    }else{
        
        //Add image for the ship
        if(sh.components.length==4){
            addImage("battleship-assets/img/warship4.png",4);
        }
        if(sh.components.length==3){
            addImage("battleship-assets/img/warship3.png",3);
        }
        if(sh.components.length==2){
            addImage("battleship-assets/img/warship2.png",2);
        }
        if(sh.components.length==1){
            addImage("battleship-assets/img/warship1a.png",1);
        }
        ships.push(sh);

        //Update shipsLeft
        shipsLeft[sh.components.length]-=1;
        var el=document.getElementById("cnt"+sh.components.length);
        if(el!=null)
            el.innerHTML=""+shipsLeft[sh.components.length]+"";
        if(shipsLeft[sh.components.length]==0&&el!=null){
            el.className="badge badge-danger badge-pill";
        }
        
        localStorage.setItem(username,JSON.stringify(ships));
    }
    sh=new Ship([]);
    sh.hit=false;
    cnt=0;
    invalid=false;
    pressed=false;
}

//Hover effects
function hoverEnter(){ 
    this.style.backgroundColor='lightblue';
    this.style.opacity=0.8;
    var elem=findElem(this.id);
    if(cnt>3){
        var ele=sh.components.find(x => x.id == this.id);
        if(ele!=undefined)
            invalid=true;
    }

    if(pressed==true&&elem==undefined){
        cnt++;      
        var ele=sh.components.find(x => x.id == this.id);
        if(ele!=undefined)
            invalid=true;
        sh.components.push(new component(this.id,this.style.left.slice(0,-2),this.style.top.slice(0,-2)));
  
    }
    if(cnt>3)pressed=false;
}
function hoverExit(){
    var elem=findElem(this.id);
    if(pressed==true||elem!=undefined){
        this.style.backgroundColor='lightblue';
        this.style.opacity=0.7;
    }else{
        this.style.backgroundColor='lightblue';
        this.style.opacity=0;
    }
}

//On click delete
function click(){
    var elem=findElem(this.id);
    if(elem!=undefined&&this.class=="imageScript"){
        this.style.display='none';
        shipsLeft[toDelete.components.length]+=1;
        var el=document.getElementById("cnt"+toDelete.components.length);
        if(el!=null)
            el.innerHTML=""+shipsLeft[toDelete.components.length]+"";
        if(shipsLeft[toDelete.components.length]>0&&el!=null){
            el.className="badge badge-primary badge-pill";
        }
        //Delete ship from ships array
        deleteShip(elem);
    }
   
}
var username=username1;
function createGrid(){
    
    ctx.font = "20px Arial";
    if(document.getElementById("hd")!=null)
     document.getElementById("hd").innerHTML="Setup: "+username;
    arr=['A','B','C','D','E','F','G','H','I','J','K','L','M','N'];

    for (var x = 0; x <row; x +=1){ 
         ctx.fillText(x, start-30,x*rectSize+rectSize/2+topOffset+4);
    }
    for (var x = 0; x <row; x +=1){ 
         ctx.fillText(arr[x], x*rectSize+rectSize/2+start-4,topOffset-10);
    }

    ctx.lineWidth = 3;
    ctx.strokeStyle="white";
    //Generate grid
    //Vertical
   for (var x = start; x < end+1; x += (end-start)/row) {
        ctx.moveTo(x, topOffset);
        ctx.lineTo(x, end-start+topOffset);
    }
    //Horizontal
    for (var x = topOffset; x < end-start+topOffset+1; x += (end-start)/row) {
        ctx.moveTo( start,x);
        ctx.lineTo( end,x);
    }

    ctx.stroke();
    
    
    fillRects();
}
var c=0;
function fillTable(user,lt){
    var shs = JSON.parse(localStorage.getItem(user));
    
    for(var i=0;i<shs.length;i++){
        sh=shs[i];
        console.log(sh);
        shipsLeft[sh.components.length]-=1;

        var el=document.getElementById("cnt"+sh.components.length);
        if(el!=null){
            el.innerHTML=shipsLeft[sh.components.length];
            
            if(shipsLeft[sh.components.length]==0)
            el.className="badge badge-danger badge-pill";
        }
        if(sh.components.length==4){
            addImage("battleship-assets/img/warship4.png",4,lt);
        }
        if(sh.components.length==3){
            addImage("battleship-assets/img/warship3.png",3,lt);
        }
        if(sh.components.length==2){
            addImage("battleship-assets/img/warship2.png",2,lt);
        }
        if(sh.components.length==1){
            addImage("battleship-assets/img/warship1a.png",1,lt);
        }
        for(var j=0;j<sh.components.length;j++){
            var id=sh.components[j].id;
            var elem=document.getElementById(id);
            if(elem!=null){
                
                elem.style.backgroundColor='lightblue';
                elem.style.opacity=0.7;
            }
        }
    }
    sh=new Ship([]);
    sh.hit=false;
    ships=shs;
}

//Switch to second player or to the next phase
function reset(){
    if(shipsLeft[1]==0&&shipsLeft[2]==0&&shipsLeft[3]==0&&shipsLeft[4]==0){
        if(c==1){
            window.location = "battleship-game.html";
        }
        for(var i=0;i<images.length;i++){
            images[i].parentNode.removeChild(images[i]);
        }
        for(var i=0;i<divs.length;i++){
            divs[i].style.opacity=0;
        }
        localStorage.setItem(username,JSON.stringify(ships));
        ships=[];
        selected=[];
        images=[];
        shipsLeft=[0,4,3,2,1];
        for(var i=1;i<=4;i++){
            var el=document.getElementById("cnt"+i);
            if(el!=null){
                el.innerHTML=shipsLeft[i];
                el.className="badge badge-primary badge-pill";
            }

        }
        username=username2;
        localStorage.setItem("user",JSON.stringify("2"));
    document.getElementById("hd").innerHTML="Setup: "+username;
        c++;
    }
}
function setup(){
    canvas = document.getElementById("myCanvas1");
    ctx = canvas.getContext("2d");
    createGrid();
    username1=JSON.parse(localStorage.getItem("player1"));
    username2=JSON.parse(localStorage.getItem("player2"));
    
    usr=JSON.parse(localStorage.getItem("user"));
    if(usr=="1")
        username=username1;
    else{
        username=username2;
        c=1;
    }
    document.getElementById("hd").innerHTML="Setup: "+username;
    fillTable(username,0);
}
var canvas;
var ctx;


