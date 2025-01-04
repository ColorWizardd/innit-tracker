const sessionId = getSessionId();

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

function getSessionId(){
    return getCookie("Innit-Session-ID");
}

function displaySessionId(){
    const elemSpace = document.getElementById("session-id");
    elemSpace.innerText = sessionId;
}