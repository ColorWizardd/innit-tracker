const sessionId = fetchSessionId();
const userId = fetchUserId();

const connection = new WebSocket(`ws://localhost:30000/dialog?session=${sessionId}`);

window.addEventListener("beforeunload", (e) =>{
    connection.send(JSON.stringify({
        type: "closeSession",
        msg: "Session terminated...",
        items: sessionId
    }));
    connection.close();
  });

connection.addEventListener("open", () => {
    console.log("Connected!");
    connection.send(JSON.stringify({
        type: "newSession",
        msg: "Control Dialog is connected!",
        items: [sessionId, userId]
    }));
});
connection.addEventListener("message", (message) =>{
    console.log(`Message Received: ${message.data}`);
    if(message.data.type != undefined){
        
    }
}); 
connection.addEventListener("close", () =>{
    
});

function getCookie(name){
    let nameFixed = name += "=";
    let cookieArr = document.cookie.split(";");
    for(cookie of cookieArr){
        let currCookie = String(cookie.trim());
        if (currCookie.indexOf(nameFixed) == 0){
            return currCookie.substring(nameFixed.length,currCookie.length);
        }
    }
    return undefined;
}

function fetchSessionId(){
    return getCookie("Innit-Session-ID");
}

function fetchUserId(){
    return getCookie("Innit-User-ID");
}

function displaySessionId(){
    const id = fetchSessionId();
    const elemSpace = document.getElementById("session-id");
    elemSpace.innerText = id;
}