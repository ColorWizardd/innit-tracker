const connection = new WebSocket(`ws://localhost:30000/joinlobby`);


connection.addEventListener("message", function(msg){
    let parsedMessage = JSON.parse(msg.data);
    console.log(parsedMessage);
    let msgType = parsedMessage.type;
    let newUrl = parsedMessage.items;
    if(newUrl == -1){
        console.error("NOT A VALID LOBBY ID");
    }
    else if(msgType = "lobbyConnect" && newUrl != undefined){
        window.open(newUrl, "_self");
    }
});


window.onload = function(){
    const submitButton = document.getElementById("codeSend"); 
    const codeBox = document.getElementById("joinCode");
    submitButton.addEventListener("click", function(e){
        let joinCode = parseInt(codeBox.value);
        if(joinCode == NaN){
            throw new TypeError("NOT A VALID NUMBER");
        }
        else{
            sendCode(joinCode);
        }
    });

}

function sendCode(code){
    const msgData = ({
        msg : `Sending join code ${code}`,
        type : "joinSession",
        items : code
    })
    connection.send(JSON.stringify(msgData));
}