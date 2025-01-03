const sessionId = (() =>{
    getSessionId();
})

function displaySessionId(){
    const elemSpace = document.getElementById("session-id");
    elemSpace.innerText = sessionId;
}