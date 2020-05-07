
//Initial canvas parameters
var row=10;
var size=600,start=100,end=start+size,rectSize=size/row;
var headingTextSize=50;
var topOffset=50;

var pressed=false;

var ships1=[];
var ships2=[];
var shipsLeft1=[0,4,3,2,1];
var shipsLeft2=[0,4,3,2,1];

var player1;
var player2;
function ht(id,hit) {
    this.id=id;
    this.hit=hit;
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
  var images1=[];
  var images2=[];

//Place images on load
function addImage(imgUrl,sz,lt,player){
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
  
    div.style.backgroundRepeat="no-repeat";
    div.style.width=sz*rectSize;
    div.style.height=rectSize;
    div.style.backgroundSize="105% 90%";
    div.style.backgroundImage="url('"+imgUrl+"')";
   
    div.style.backgroundPosition="center";
    div.id="ship"+first.id;
    if(elem!=null){
        if(rotated){
             div.style.left=elem.left-(sz-1)/2*rectSize-100+lt;
            div.style.top=(sz-1)/2*rectSize+parseInt(elem.top)+30;
        }else{
            div.style.left=parseInt(elem.left)-100+lt;
            div.style.top=parseInt(elem.top)+30;
        }
    }
    document.body.appendChild(div);
    if(player==player1)
         images1.push(div);
    else{
        images2.push(div);
    }

}

var hit1=[];
var hit2=[];
var divs=[];
function fillRects(op,off,gd){
    var gridSeparation=gd;
    for(pp=0;pp<row*row;pp+=1){
        var div = document.createElement("div");
       //TOP
        div.style.top = headingTextSize+topOffset+rectSize*(pp%row)+gridSeparation/2+"px";

        //LEFT
        div.style.left = off+start+rectSize*Math.floor(pp/row)+gridSeparation/2+"px";

        //Size
        div.style.width=size/row-gridSeparation+"px";
        div.style.height=size/row-gridSeparation+"px";

        //Margins
        div.style.marginTop="0px";
        div.style.marginBottom="0px";
        div.style.marginLeft="0px";
        div.style.marginRight="0px";
        div.style.backgroundColor="grey";
        div.style.borderWidth="20px";
        div.style.opacity=op;
        div.style.zIndex=3;
        
        div.className="overlay";
         
        //Has to be absolute
        div.style.position="absolute";
        div.id=pp+"";
        if(currPlayer==player1){
            var elem=hit2.find(x => x.id == div.id);
            if(elem!=undefined){
                div.style.opacity=0.01;
            }
        }else{
            var elem=hit1.find(x => x.id == div.id);
            if(elem!=undefined){
                div.style.opacity=0.01;
            }
        }
        //Functions
        div.onmouseenter=hoverEnter; div.onmouseleave=hoverExit;div.onclick=click;div.onpointerdown=mousePressed;div.onpointerup=mouseReleased;
        document.body.appendChild(div);
        divs.push(div);
    }
}

function checkIfHit(hitId, shipArr){
    for(var i=0;i<shipArr.length;i++){
        var sh=shipArr[i];
        for(var j=0;j<sh.components.length;j++){
            var div=sh.components[j];
            if(div.id==hitId){
                return true;
            }
        }
    }
    return false;
}

var cnt=0;
var sh=new Ship([]);
sh.hit=false;
var currPlayer;
var invalid=false;
function hit(id,htt){
    if(currPlayer==player1)
        hit2.push(new ht(id,htt));
    else
        hit1.push(new ht(id,htt));

}
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

function updateShipCounter(shipsLeft,sh,num){
    var el=document.getElementById(num+"cnt"+sh.components.length);
    if(el!=null)
        el.innerHTML=""+shipsLeft[sh.components.length]+"";
    if(shipsLeft[sh.components.length]==0&&el!=null){
        el.className="badge badge-danger badge-pill";
    }
}
var waiting=false;
var hitShips1=[];
var hitShips2=[];
var win=false;
//Try to hit a ship on mouse pressed
function mousePressed(){
    if(currBackground==""&&waiting==false){
        var arr=ships1;
        var hitArr=hit1;
        if(currPlayer==player1){
            arr=ships2;
            hitArr=hit2;
        }
        var isHit=checkIfHit(this.id,arr);
        hit(this.id,isHit);

        if(isHit){
            //Place hit image
            this.style.background="url('battleship-assets/img/correct.png')";
            currBackground="url('battleship-assets/img/correct.png')";
            this.style.backgroundSize="contain";
            this.style.opacity=1;

            //Check ships hit
            var shipHit=null;
            console.log(hitArr);
            console.log(this.id);
            for(var i=0;i<arr.length;i++){
                var sh=arr[i];
                var c=true;
                if(sh.hit==false){
                    for(var j=0;j<sh.components.length;j++){
                        var comp=sh.components[j];
                        var elem=hitArr.find(x => x.id == comp.id);
                        if(elem==undefined){
                            c=false;
                            break;
                        }
                    }
                    if(c){
                        shipHit=sh;
                        shipHit.hit=true;
                        break;
                    }
                }
            }

            if(shipHit!=null){
                if(currPlayer==player2){
                    hitShips1.push(shipHit);
                    shipsLeft1[shipHit.components.length]--;
                    updateShipCounter(shipsLeft1,shipHit,2);
                }
                else{
                    hitShips2.push(shipHit);
                    shipsLeft2[shipHit.components.length]--;
                    updateShipCounter(shipsLeft2,shipHit,2);
                }
                for(var j=0;j<shipHit.components.length;j++){
                    var comp=shipHit.components[j];
                    document.getElementById(comp.id).style.opacity=0.8;
                }
                
                 $('.alert').text('You\'ve sunk a boat!');
            }else{
                 $('.alert').text('You hit a boat!');
            }
            if(hitShips1.length==10){
                $('.alert').text('Player 2 has won! Player 1 has sunk'+hitShips2.length+' ships');
                win=true;
            }
            if(hitShips2.length==10){
                $('.alert').text('Player 1 has won! Player 2 has sunk'+hitShips1.length+' ships');
                win=true;
            }
            showHitImages();
            
        }
        else{
            
            this.style.background="url('battleship-assets/img/cross.png')";
            currBackground="url('battleship-assets/img/cross.png')";
            this.style.backgroundSize="contain";
            this.style.opacity=1;

            //Don't allow the player to play while he is waiting
            waiting=true;

            //Wait for a second to switch the players
            sleep(1500).then(() => {
            waiting=false;
             switchPlayers();
            });
            
            $('.alert').text('Oh no! You missed!');
        }

        }
        if(win){
            
            $('.alert').css('z-index','50');
            $('.alert').css('width','100%');
            $('.alert').css('height','100%');
            $('.alert').css('padding-top','25%');
            $('.alert').css('text-align','center');
            $('.alert').css('font-size','50px');
        }
        $('.alert').show();
        sleep(1500).then(() => {
            $('.alert').hide();
            if(win){
                $('.alert').show();

            }
        });
}
function mouseReleased(){
   
}
var currBackground;
var stateChanged=false;
function hideImages(images){
    for(var i=0;i<images.length;i++){
       // if(images[i].id=="ship")
        images[i].style.opacity=0;
    }
}
function showImages(images){
    for(var i=0;i<images.length;i++){
        //if(images[i].id=="ship")
        images[i].style.opacity=1;
    }
    stateChanged=true;
}
function showHitImages(){
    var images=images1;
    var hitShips=hitShips1;
    if(currPlayer==player1){
        images=images2;
        hitShips=hitShips2;
    }
    for(var i=0;i<hitShips.length;i++){
        var hitShip=hitShips[i];
        var x=images.find(x => x.id == "ship"+hitShip.components[0].id);
        if(x!=undefined)
            x.style.opacity=1;
    }
}
//Hover effects
function hoverEnter(){ 
    currBackground=this.style.background;
    if(currBackground==""){
        this.style.background="url('battleship-assets/img/target.png')";
        this.style.backgroundSize="contain";
        this.style.opacity=1;
    }
}
function hoverExit(){
    if(this.style.opacity>0.01&&this.style.opacity!=0.8&&stateChanged==false){
    this.style.background=currBackground;
    this.style.backgroundSize="contain";
        this.style.backgroundColor="transparent";
        this.style.opacity=1;
    }
    stateChanged=false;
}
function click(){
   
}
function createGrid(lt,ct){
    start+=lt;
    end=start+size;
    ct.font = "20px Arial";
    arr=['A','B','C','D','E','F','G','H','I','J','K','L','M','N'];
    
    for (var x = 0; x <row; x +=1){ 
         ct.fillText(x, start-30,x*rectSize+rectSize/2+topOffset+4);
    }
    for (var x = 0; x <row; x +=1){ 
         ct.fillText(arr[x], x*rectSize+rectSize/2+start-4,topOffset-10);
    }

    ct.lineWidth = 3;
    ct.strokeStyle="white";

    //Generate grid
    //Vertical
   for (var x = start; x < end+1; x += (end-start)/row) {
        ct.moveTo(x, topOffset);
        ct.lineTo(x, end-start+topOffset);
    }
    //Horizontal
    for (var x = topOffset; x < end-start+topOffset+1; x += (end-start)/row) {
        ct.moveTo( start,x);
        ct.lineTo( end,x);
    }

    ct.stroke();
    
}
var c=0;
//Fill table with images
function fillTable(user,lt){
    var shs = JSON.parse(localStorage.getItem(user));
    for(var i=0;i<shs.length;i++){
        sh=shs[i];
        if(sh.components.length==4){
            addImage("battleship-assets/img/warship4.png",4,lt,user);
        }
        if(sh.components.length==3){
            addImage("battleship-assets/img/warship3.png",3,lt,user);
        }
        if(sh.components.length==2){
            addImage("battleship-assets/img/warship2.png",2,lt,user);
        }
        if(sh.components.length==1){
            addImage("battleship-assets/img/warship1a.png",1,lt,user);
        }
    }
}
//Move images on next move
function moveImages(){
    var c=702;
    if(currPlayer==player1)
        c=-702;
    for(var i=0;i<images1.length;i++){
        images1[i].style.left=parseInt(images1[i].style.left.slice(0,-2))+c;
    }
    for(var i=0;i<images2.length;i++){
        
        images2[i].style.left=parseInt(images2[i].style.left.slice(0,-2))-c;
    }
}
//Update divs on next move
function updateDivs(){
    for(var i=0;i<divs.length;i++){
        var div=divs[i];
        if(currPlayer==player1){
            var elem=hit2.find(x => x.id == div.id);
            if(elem!=undefined){
                if(elem.hit){
                    div.style.background="url('battleship-assets/img/correct.png')";
                    div.style.backgroundSize="contain";
                    div.style.opacity=1;
                }else{
                    div.style.background="url('battleship-assets/img/cross.png')";
                    div.style.backgroundSize="contain";
                    div.style.opacity=1;
                }
            }else{
                div.style.background="";
                div.style.backgroundColor="transparent";
                div.style.opacity=0.01;
            }
        }else{
            var elem=hit1.find(x => x.id == div.id);
            if(elem!=undefined){
                if(elem.hit){
                    div.style.background="url('battleship-assets/img/correct.png')";
                    div.style.backgroundSize="contain";
                    div.style.opacity=1;
                }else{
                    div.style.background="url('battleship-assets/img/cross.png')";
                    div.style.backgroundSize="contain";
                    div.style.opacity=1;
                }
            }else{
                div.style.background="";
                div.style.backgroundColor="transparent";

                div.style.opacity=0.01;
            }
        }
    }
}
//Find hit ships and set their background
function findHitShips(){
    var hitArr=hit1;
    var arr=ships1;
        var hitArr=hit1;
        if(currPlayer==player1){
            arr=ships2;
            hitArr=hit2;
        }
    //Check ships hit
    var shipHit=null;
    for(var i=0;i<arr.length;i++){
        var sh=arr[i];
        var c=true;
        for(var j=0;j<sh.components.length;j++){
            var comp=sh.components[j];
            var elem=hitArr.find(x => x.id == comp.id);
            if(elem==undefined){
                c=false;
                break;
            }
        }
        if(c){
            shipHit=sh;
            for(var j=0;j<shipHit.components.length;j++){
                var comp=shipHit.components[j];
                document.getElementById(comp.id).style.opacity=0.8;
            }
        }
    }
}
function initPlayerTables(p1,p2){

    fillTable(p1,0);
   fillRects(0.01,704,1.5);
    fillTable(p2,703);
}
/** Initialize players
 * (only called once)
 */
function initPlayers(p1,p2){
    initPlayerTables(p1,p2);
    
    document.getElementById("hd1").innerHTML=p1;
    document.getElementById("hd2").innerHTML=p2;
}
//Called once
function setupGame(){

    start=100;
    headingTextSize=83;
    end=start+size;
    canvas = document.getElementById("myCanvas2");
    canvas3 = document.getElementById("myCanvas3");

    ctx = canvas.getContext("2d");
    ctx3=canvas3.getContext("2d");

    createGrid(0,ctx);
    player1=JSON.parse(localStorage.getItem("player1"));
    player2=JSON.parse(localStorage.getItem("player2"));

    ships1=JSON.parse(localStorage.getItem(player1));
    ships2=JSON.parse(localStorage.getItem(player2));

    currPlayer=player1;

    initPlayers(player1,player2);
    
    createGrid(0,ctx3);
    hideImages(images2);
}
//Switch players on next move
function switchPlayers(){
    if(currPlayer==player1){
        currPlayer=player2;
        hideImages(images1);
        showImages(images2);
        setShipCount(1,2);
        setShipCount(2,1);
        document.getElementById("hd1").innerHTML=player2;
        document.getElementById("hd2").innerHTML=player1;
    }
    else{
        currPlayer=player1;
        hideImages(images2);
        showImages(images1);
        setShipCount(1,1);
        setShipCount(2,2);
        document.getElementById("hd2").innerHTML=player2;
        document.getElementById("hd1").innerHTML=player1;
    }
    moveImages();
    updateDivs();
    findHitShips();
    showHitImages();
    
}
function setShipCount(num1,num2){
    var shipsLeft=shipsLeft2;
    if(num2==1)
        shipsLeft=shipsLeft1;
    for(var i=1;i<5;i++){
        var el=document.getElementById(num1+"cnt"+i)
        el.innerHTML=""+shipsLeft[i]+"";
        if(shipsLeft[i]==0){
            el.className="badge badge-danger badge-pill";
        }else{
            el.className="badge badge-primary badge-pill";
        }

    }
}
$(document).ready(function(){
});
var canvas;
var ctx;
var ctx3;
var canvas3;