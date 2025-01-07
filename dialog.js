const connection = new WebSocket("ws://localhost:30000");
connection.addEventListener("open", () => {
    console.log("Connected!");
    connection.send(JSON.stringify({msg: "Control Dialog is connected!"}));
     });
connection.addEventListener("message", (message) =>{
    console.log(`Message Received: ${message.data}`);
    if(message.data.type != undefined){
        
    }
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

async function fetchSessionId(){
    return getCookie("Innit-Session-ID");
}

async function displaySessionId(){
    const id = await fetchSessionId();
    const elemSpace = document.getElementById("session-id");
    elemSpace.innerText = id;
}