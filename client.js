/* WEBSOCKET FUNCTIONALITY */

const socket = new WebSocket('ws://localhost:21000');

socket.onopen = function(event){
    console.log(`Client connected!`);
}

socket.onclose = function(event){
    console.log(`Client disconnected`);
}

/* SCROLLING INNIT LIST */

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
        innitIndex = 0;
        innitList.style.transform = "translate(-50%, " + listOffset + "px)";
        innitCurr = innitElems[innitIndex];
        innitCurr.id = "curr";
        innitCurr.className = "innit-group";
        innitNext = innitElems[innitIndex+1];
        innitNext.id = "next";
        innitNext.className = "innit-group";
        innitPrev = undefined;
        innitElems[2].id = null;
        for(i = 2; i < innitElems.length; i++){
            innitElems[i].className += " hidden";
        }
        roundCount++;
    }
    else{
        innitList.style.transform = "translate(-50%, -" + (300 * innitIndex - listOffset) + "px)";
        console.log(innitCurr.offsetHeight);
        innitCurr.id = "prev";
        innitNext.id = "curr";

        if(!innitPrev){
            innitPrev = innitElems[innitIndex-1];
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
        }
        
    }
}

function scrollNext(){
    innitIndex++;
    rotateList();
}
