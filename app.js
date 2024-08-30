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
            "id" : itemId,
            "hp" : 0,
            "hpMax" : 0
    }

    let newVal = newItem.num;
    
    console.log(`Adding value ${newVal} to array for character ${newItem.name}`);

    let newIndex = await listSearch(newVal);
    innitArr.splice(newIndex, 0, newItem);
    let newLi = document.createElement("li");
    newLi.className = "list-innit-item";
    newLi.innerHTML = 
        `<img class="li-dice-img" src="/assets/innitd20list.png" id="item-${newItem.id}" onclick="editItem(event)">
        <span class="list-num">${newVal}</span><span class="list-name">${newItem.name}</span>
        <div class="hp-cont" id="hp-${newItem.id}">
        <div class="hp-back"></div>
        <div class="hp-val">
        <input type="number" class="hp-curr" value="${newItem.hp}" onchange="hpUpdate(event)">
        </input>/<input type="number" class="hp-max" value="${newItem.hpMax}" onchange="hpUpdate(event)"></input>
        </div>
        </div>
        `
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
    const imgs = document.getElementsByClassName("li-dice-img");
    for(i=0; i < elems.length; i++){
        innitArr[i].id = i;
        elems[i].id, imgs[i].id = `item-${i}`;
    }

}

function sortList(){
    const elems = document.getElementById("list-container").getElementsByTagName("li");
    console.log("Sorting array...");
    try{
        innitArr.sort((a, b) => b.num - a.num);
        for(item in elems){
            let diceImg = elems[item].firstChild, innitNum = diceImg.nextElementSibling,
            innitName = innitNum.nextElementSibling;
            let hpBar = elems[item].children[3].children[1];
            console.log("HP BAR: ", hpBar);
            let hpCurr = hpBar.firstElementChild;
            let hpMax = hpBar.children[1];
            diceImg.id = `item-${item}`;
            innitNum.textContent = innitArr[item].num;
            innitName.textContent = innitArr[item].name;
            hpCurr.value = innitArr[item].hp;
            hpMax.value = innitArr[item].hpMax;
            console.log({
                "HP ID" : item,
                "HP CURR: " : hpCurr.value,
                "HP MAX: " : hpMax.value
            })

            hpScale(item, hpCurr.value, hpMax.value);
        }
    }
    catch(error){
        return new Error(error);
    }
}

function hpUpdate(event){

    /* GRAB ID FOR EACH UPDATE AND CHANGE INNITARR HP */

    let eventTarget = event.target;
    let parent = eventTarget.parentElement;
    let hpId = parent.parentElement.id;
    let parsedId = hpId.replace(/^\D+/g, '');
    let childrenArr = parent.children;
    let currHp = parseInt(childrenArr[0].value);
    let maxHp = parseInt(childrenArr[1].value);

    if(currHp > maxHp){
        console.error("ERROR: Current HP cannot be bigger than max.")
        currHp = maxHp;
        childrenArr[0].value = `${currHp}`;
    }

    innitArr[parsedId].hp = currHp;
    innitArr[parsedId].hpMax = maxHp;

    hpScale(parsedId, currHp, maxHp);
}

function hpScale(targetId, currHp, maxHp){

    let hpBar = document.getElementById(`hp-${targetId}`);
    let hpBack = hpBar.firstElementChild.style;

    hpRatio = 100 - ((currHp/maxHp).toFixed(2)*100);

    if(hpRatio <= 0){
        hpRatio = 0.1
    }

    hpBack.width = `${hpRatio}%`;

}

function resizeRound(){
    const roundContainer = document.getElementById("round-display");
    const button = document.getElementById("round-resize");
    const upperHeight = 350;
    const lowerHeight = 125;
    let isFlipped = (button.className == "flipped") ? true : false;
    let height = roundContainer.offsetHeight;
    console.log(`Round Counter Height: `, height);
    height >= upperHeight ? height = lowerHeight : height = upperHeight;
    roundContainer.style.height = (height + "px");
    isFlipped ? button.className = "unFlipped" : button.className = "flipped";
}

/* -- Item Editor -- */



function editItem(event){
    const screenPanel = document.getElementById("fade-panel");
    const docBody = document.body;
        let eventTarget = event.target;
        console.log("Event Target:", eventTarget);
        const targetId = eventTarget.id;
        /* Replaces all non-numbers with whitespace */
        const parsedId = targetId.replace(/^\D+/g, '');
        const targetItem = innitArr[parsedId]; 
        console.log(`Editing item ${parsedId}...`);
        screenPanel.className = "fade-active";
    
    const editorHtml = 
    `
        <h3>Edit Character Options</h3>
        <div class="panel-option">
            <label for="name-edit">Character Name</label>
            <input type="text" id="name-edit" placeholder="New Character" value="${targetItem.name}">
        </div>
        <div class="panel-option">
            <label for="num-edit">Initative Value</label><br>
            <input type="number" id="num-edit" placeholder="0" value="${targetItem.num}">
        </div>
        <div id="options-button-panel">
            <button id="cancel" onclick="editCancel()">Cancel</button>
            <button id="confirm" onclick="editConfirm(${parsedId})">Confirm</button>
        </div>    
    `

    const optionsPanel = document.createElement("div");
    optionsPanel.id = "options-panel";
    docBody.className = "popup";
    optionsPanel.innerHTML = editorHtml;
    document.body.insertBefore(optionsPanel, screenPanel);

    /* SORT USING BUILT-IN FUNC WITH item.num, THEN REFRESH IDs
    AND RE-INSERT INTO LIST BY ID
    */

}

function editCancel(){
    const optionsPanel = document.getElementById("options-panel");
    const screenPanel = document.getElementById("fade-panel");
    const docBody = document.body;
    if(!optionsPanel){
        return new Error("Editor panel is not currently active");
    }
    screenPanel.className = "";
    docBody.className = "";
    optionsPanel.remove();
}

function editConfirm(innitId){
    const newName = document.getElementById("name-edit").value;
    const newNum = parseInt(document.getElementById("num-edit").value);
    const innitItem = innitArr[innitId];
    innitItem.name = newName, innitItem.num = newNum;
    try{
        sortList();
        editCancel();
    }
    catch(error){
        return new Error(error);
    }
}