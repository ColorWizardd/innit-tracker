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
    let innitNum = parseInt(initBox.value);
    let isHidden = hiddenCheck.checked;
    let itemId = 0;

    if(!innitName){
        innitName = "New Character";
    }
    if(isNaN(innitNum)){
        innitNum = 0;
    }
    if(!innitArr){
        itemId = 0;
    }
    else{
        itemId = innitArr.length;
    }

    const newItem = {
            "name" : innitName,
            "num" : innitNum,
            "hidden" : isHidden,
            "id" : itemId
    }

    let newVal = newItem.num;
    
    console.log(`Adding value ${newVal} to array for character ${newItem.name}`);

    let newIndex = await listSearch(newVal);
    innitArr.splice(newIndex, 0, newItem);
    let newLi = document.createElement("li");
    newLi.className = "list-innit-item";
    newLi.innerHTML = 
        `<img class="li-dice-img" src="/assets/innitd20list.png" id="item-${newItem.id}">
        <span class="list-num">${newVal}</span><span class="list-name">${newItem.name}</span>`
    let listItems = document.getElementsByTagName("li");
    console.log("List items length before: ", listItems.length);
    if(innitArr.length <= 1){
        innitList.appendChild(newLi);
    }
    else{
        innitList.insertBefore(newLi, listItems[newIndex]);
    }

    console.log("Innit Array is now: ", innitArr);

}


async function listSearch(newVal){
    let start = 0;
    let end = innitArr.length;

    console.log(`Length before insert: `, end);

    if(start == end){
        console.log(`Inserting value ${newVal} at index START`);
        return 0;
    }
    for(i = start; i < end; i++){
        if(innitArr[i].num <= newVal){
            console.log(`${newVal} is bigger than ${innitArr[i].num}`)
            console.log(`Inserting value ${newVal} at index ${i}`);
            return i;
        }
    }
    console.log(`Inserting value ${newVal} at index END`);
    return end;

    
}

async function addItem(){
    await sortedInsert();
    refreshId();
}

function refreshId(){
    const elems = document.getElementById("list-container").getElementsByTagName("li");
    for(i=0; i < elems.length; i++){
        innitArr[i].id = i;
        elems[i].id = `item-${i}`;
    }

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

function editItem(e){
    const target = e.target.id;
    /* Replaces all non-numbers with whitespace */
    const parsedTarget = target.replace(/^\D+/g, '');
    
    /* TODO: USE HTML ID TO TARGET AND PRE-CONFIG EDITOR */
}