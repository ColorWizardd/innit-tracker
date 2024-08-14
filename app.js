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
    
    console.log(`Adding value ${newItem.num} to array`);

    /* TODO: FIGURE OUT HOW TO DO A SORTED INSERT WHILE MAINTAINING INIT ID ORDER */

    
}


async function listSearch(newItem){
    let start = 0;
    let end = innitArr.length - 1;
    let newVal = newItem.num;

    if(start == end){
        return start;
    }

    while(innitArr[start].num < innitArr[end].num){
        let mid = Math.floor((start + end) / 2);
        if(innitArr[mid].num < newVal){
            start = mid + 1;
        }
        else{
            high = mid;
        }
        return start;
    }
}

async function addItem(){
    await sortedInsert();
}