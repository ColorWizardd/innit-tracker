const connection = new WebSocket("ws://localhost:30000");
connection.addEventListener("open", () => {
    console.log("Connected!");
    connection.send("Test Line");
     });
connection.addEventListener("message", (message) =>{
    console.log(`Message Received: ${message.data}`);
});
            

/* --  Innit List Functionality -- */

class InnitItem{
    constructor(name, num, hidden, id, hp, hpMax){
        this.name = name;
        this.num = num;
        this.hidden = hidden;
        this.id = id;
        this.hp = hp;
        this.hpMax = hpMax
    }
}

const innitArr = [];
const listImg = "assets/innitd20list.png"

let saveList = []; // SAVED ARRAYS


async function sortedInsert(item){

    const innitList = document.getElementById("list-container");

    if(!item){
        return new ReferenceError("No item could be retrieved.");
    }

    const newItem = item;

    let newVal = newItem.num;
    
    console.log(`Adding value ${newVal} to array for character ${newItem.name}`);

    let newIndex = await listSearch(newVal);
    innitArr.splice(newIndex, 0, newItem);
    let newLi = document.createElement("li");
    newLi.className = "list-innit-item";
    newLi.innerHTML = 
        `<img class="li-dice-img" src="${listImg}" id="item-${newItem.id}" onclick="editItem(event)">
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
    scaleAllHp();
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

async function fetchItemInput(){
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

    let hp = 0;
    let hpMax = 0;

    return new InnitItem(innitName, innitNum, isHidden, itemId, hp, hpMax);
}

async function addInputItem(){
    const newItem = await fetchItemInput();
    await sortedInsert(newItem);
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

async function sortList(){
    const elems = document.getElementById("list-container").getElementsByTagName("li");
    console.log("Sorting array...");
    try{
        innitArr.sort((a, b) => b.num - a.num);
        for(item in elems){
            if(isNaN(item)){
                console.log("No more elements left!");
                break;
            }
            console.log(`Currently on item ${item}`);
            let diceImg = elems[item].firstChild;
            let innitNum = diceImg.nextElementSibling;
            let innitName = innitNum.nextElementSibling;
            diceImg.id = `item-${item}`;
            console.log(`Item: ${item}, Name: ${innitArr[item].name}, Num: ${innitArr[item].num}`);
            innitNum.textContent = innitArr[item].num;
            innitName.textContent = innitArr[item].name;
        }
        await scaleAllHp();
    }
    catch(error){
        return new Error(error);
    }
}

function hpUpdate(event){

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

async function hpScale(targetId, currHp, maxHp){

    let hpBar = document.getElementById(`hp-${targetId}`);
    let hpBack = hpBar.firstElementChild.style;

    hpRatio = 100 - ((currHp/maxHp).toFixed(2)*100);

    if(isNaN(hpRatio) || hpRatio <= 0){
        hpRatio = 0.1
    }

    hpBack.width = `${hpRatio}%`;

}

async function scaleAllHp(){
    const elems = document.getElementById("list-container").getElementsByTagName("li");
    console.log("HP Elems Count: ", elems.length);
    for(item in elems){
        if(isNaN(item)){
            console.log("Scaled all HP bars!");
            break;
        }
        let hpParent = elems[item].children[3];
        let hpBar = hpParent.children[1];
        console.log("HP BAR: ", hpBar);
        let hpCurr = hpBar.firstElementChild;
        let hpMax = hpBar.children[1];

        hpParent.id = `hp-${item}`;

        let newHp = innitArr[item].hp;
        let newHpMax = innitArr[item].hpMax;

        console.log("Curr Bar: ", hpCurr);
        console.log("Curr Bar Max: ", hpMax);
        hpCurr.value = newHp;
        hpMax.value = newHpMax;
        console.log({
            "HP ID" : item,
            "HP CURR: " : newHp,
            "HP MAX: " : newHpMax
        })
        await hpScale(item, newHp, newHpMax);
    }
}

/* -- Round Settings -- */

let roundCount = 0;
let turnCount = 0;

function initialTurn(){
    const turnList = document.getElementById("list-container");
    const startingTurn = turnList.children[0];
    setCurrStyle(startingTurn);
}

async function getCurrTurn(){
    return document.getElementsByClassName("round-curr")[0];
}

/* Move the turn counter forwards/backwards */
async function moveTurn(isForwards){

    if(!isForwards){
        isForwards = false;
    }

    const turnElems = document.getElementById("list-container").children;
    const currTurn = await getCurrTurn();
    let nextTurn;
    let checkedTurnCount;
    if(isForwards){
        checkedTurnCount = await roundCountCheck(++turnCount);
        nextTurn = currTurn.nextElementSibling;
    }
    else{
        checkedTurnCount = await roundCountCheck(--turnCount);
        nextTurn = currTurn.previousElementSibling;
    }
    console.log("Curr Turn Position: ", checkedTurnCount);
    clearCurrStyle(currTurn);
    console.log("Turn elements: ", turnElems);
    console.log("New Turn Count: ", checkedTurnCount);
    if(!nextTurn){
        setCurrStyle(turnElems[checkedTurnCount]);
    }
    else{
        setCurrStyle(nextTurn);
    }
}

/* Every time the turn moves, check if index is greater than total items or less than 0, cycling if true*/

async function roundCountCheck(turn){
    if(turn >= innitArr.length){
        roundCount++;
        turnCount = 0;
        await roundCountUpdate(roundCount);
    }
    else if(turn < 0){
        roundCount--;
        turnCount = innitArr.length - 1;
        await roundCountUpdate(roundCount);
    }
    return turnCount;

}

/* If the round count needs to change, fire the update function to change the count */
async function roundCountUpdate(newRoundCount){
    const roundCountDisplay = document.getElementById("curr-round");
    roundCountDisplay.innerText = newRoundCount;
}

function setCurrStyle(item){
    item.classList.add("round-curr");
}

function clearCurrStyle(item){
    item.classList.remove("round-curr");
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
            <button id="delete" onclick="editDelete(${parsedId})">Delete</button>
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
    const item = innitArr[innitId];
    item.name = newName, item.num = newNum;
    try{
        sortList();
    }
    catch(error){
        return new Error(error);
    }
    editCancel();
}

function editDelete(innitId){
    const itemList = document.getElementById("list-container");
    try{
        innitArr.splice(innitId, 1);
        itemList.removeChild(itemList.children[innitId]);
        sortList();
    }
    catch(error){
        return new Error(error);
    }
    editCancel();
}

/* -- DATA INTERACTING WITH SERVER -- */

async function sendInnitArr(arr, listName){
    const execTime = Date.now().valueOf();
    execTime.toString().concat("-", saveList.length);
    let checkedListName = listName || `List ${saveList.length}`;
    let newList = 
        {
            "listName" : checkedListName,
            "listItems" : [arr]
        };
    let packagedList = JSON.stringify(newList);
    
    try {
        saveList.push(newList);
        localStorage.setItem(`list-${saveList.length}`, packagedList);
    } catch (error) {
        console.error(error);
    }

}

async function sendActiveArr(name){
    await sendInnitArr(innitArr, name);
}