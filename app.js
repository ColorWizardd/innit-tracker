/*
const { WebSocketServer } = require('ws');
const wss = new WebSocketServer( {port: 21000} );

 -- Websocket Functionality -- 

wss.on('connection', function connection(ws){
    console.log(`New client connected!`);

    ws.addEventListener('message', (event) =>{
        console.log("New server message: ", event.data);
    })

    ws.on('close', function(){

    });
});
*/


/* --  Innit List Functionality -- */

const innitArr = [];


async function sortedInsert(){
    const innitList = document.getElementById("list-container");
    let nameBox = document.getElementById("innitName");
    let initBox = document.getElementById("innitNum");
    let hiddenCheck = document.getElementById("innitHide");
    let innitName = nameBox.value;
    let innitNum = initBox.value;
    let isHidden = hiddenCheck.checked;
    const newItem = {
            "name" : innitName,
            "num" : innitNum,
            "hidden" : isHidden
    }

    let newVal = newItem.num;
    
    console.log(`Adding value ${newVal} to array for character ${newItem.name}`);

    let newIndex = await listSearch(newVal);
    innitArr.splice(newIndex, 0, newItem);
    let newLi = document.createElement("li");

    /* 
    Need to append newLi to innitList in order. 
    SOLUTION: innitList and li elements share the same index,
    so use "li[newIndex].parentNode.insertBefore(li[newIndex+1], li[newIndex]"
    */

}


async function listSearch(newVal){
    let start = 0;
    let end = innitArr.length;

    for(i = start; i < end; i++){
        if(innitArr[i] > newVal){
            return i-1;
        }
        return end;
    }
}

async function addItem(){
    await sortedInsert();
}

function resizeRound(){
    const roundContainer = document.getElementById("round-display");
    const button = document.getElementById("round-resize");
    const upperHeight = 350;
    const lowerHeight = 125;
    let isFlipped = (button.className == "flipped") ? true : false;
    let height = roundContainer.offsetHeight;
    console.log(`Round Counter Height: `, height);
    if(height >= upperHeight){
        height = lowerHeight;
    }
    else{
        height = upperHeight;
    }
    roundContainer.style.height = (height + "px");
    isFlipped ? button.className = "unFlipped" : button.className = "flipped";
}