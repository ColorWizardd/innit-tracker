/* WEBSOCKET FUNCTIONALITY */

const connection = new WebSocket("ws://localhost:30000");
connection.addEventListener("open", () => {
    console.log("Connected!");
    connection.send(JSON.stringify({msg: "Test Line"}));
     });
connection.addEventListener("message", (message) =>{
    console.log(`Message Received: ${message.data}`);
});

/* MESSAGE HANDLING */



/* LIST GENERATION */

/* SCROLLING INNIT LIST */

/*

Okay, reeeeallly need to revamp the code.
    - Currently needs to be able to move forwards and backwards,
    - Use data from the innitArr to display each item's info,
    - Add space for displaying the current round,

*/

let innitIndex = 0;
let roundCount = 1;
const innitList = document.getElementById("flex-col");
const listOffset = 100;
let innitElems = document.getElementsByClassName("innit-group");
let innitCurr = innitElems[0];
let innitNext;
if(innitElems.length > 1){
    innitNext = innitElems[1];
}
let innitPrev;

function rotateList(){
    if(innitElems.length === innitIndex){
        innitCurr.id, innitCurr.firstElementChild.id = undefined;
        innitIndex = 0;
        innitList.style.transform = "translate(-50%, " + listOffset + "px)";
        innitCurr = innitElems[innitIndex];
        innitCurr.id = "curr";
        innitCurr.className = "innit-group";
        innitCurr.firstElementChild.id= "curr-name";
        innitNext = innitElems[innitIndex+1];
        innitNext.id = "next";
        innitNext.className = "innit-group";
        innitNext.firstElementChild = "next-name";
        innitPrev = undefined;
        innitElems[2].id = undefined;
        for(i = 2; i < innitElems.length; i++){
            innitElems[i].className += " hidden";
        }
        roundCount++;
    }
    else{
        innitList.style.transform = "translate(-50%, -" + (330 * innitIndex - listOffset) + "px)";
        console.log(innitCurr.offsetHeight);
        innitCurr.id = "prev";
        innitCurr.firstElementChild.id = "prev-name";
        innitNext.id = "curr";
        innitNext.firstElementChild.id = "curr-name"

        if(!innitPrev){
            innitPrev = innitElems[innitIndex-1];
            innitPrev.id = "prev";
            innitPrev.firstElementChild.id = "prev-name";
        }
        else{
            innitPrev.id = "";
            innitPrev.className += " hidden";
            innitPrev = innitElems[innitIndex-1];
        }

        innitCurr =  innitElems[innitIndex];
        innitNext = innitElems[innitIndex+1];
        if(innitNext != undefined){
            innitNext.className = "innit-group";
            innitNext.id = "next";
            innitNext.firstElementChild.id = "next";
        }
        
    }
}

function scrollNext(){
    innitIndex++;
    rotateList();
}
