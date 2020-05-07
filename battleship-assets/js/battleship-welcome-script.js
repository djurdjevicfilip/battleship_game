function check() {
    
    localStorage.setItem("user",JSON.stringify("1"));
    let regularExpression=/\w{3,15}/;
    console.log("WW");
    if((!regularExpression.test(document.getElementById("player1").value))
    ||(!regularExpression.test(document.getElementById("player2").value)))
    {
        alert("Not good enough!");
    }
    else
    {
        localStorage.setItem("player1",JSON.stringify(document.getElementById("player1").value));
        localStorage.setItem("player2",JSON.stringify(document.getElementById("player2").value));
        window.location.href="battleship-setup.html";
    }
   
}