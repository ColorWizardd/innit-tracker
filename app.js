const connection = new WebSocket("ws://localhost:30000");
connection.addEventListener("open", () => {
    console.log("Connected!");
    connection.send(JSON.stringify({msg: "Test Line"}));
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

const localConfig = fetch("./settings.json");
const innitArr = [];
const listImg = "assets/innitd20list.png";

// Setting Session ID on load
const sessionCookie = getSessionId();

// ONLOAD FUNCTIONS
window.onload = () =>{
    fetchSavedLists();

    const submitButton = document.getElementById("submit-button");
    submitButton.addEventListener("click", function(e){
        addInputItem();
    });
    const roundSizeButton = document.getElementById("round-resize");
    roundSizeButton.addEventListener("click", function(e){
        resizeRound();
    });

    const startButton = document.getElementById("start-encounter");
    startButton.addEventListener("click", function(e){
        launchEncounter();
    });
    const roundPrev = document.getElementById("round-prev");
    roundPrev.addEventListener("click", function(e){
        moveTurn(false);
    });
    const roundNext = document.getElementById("round-next");
    roundNext.addEventListener("click", function(e){
        moveTurn(true);
    });
}


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
    newLi.className = `list-innit-item hidden-${newItem.hidden}`;
    newLi.innerHTML = 
        `<img class="li-dice-img" src="${listImg}" id="item-${newItem.id}">
        <span class="list-num">${newVal}</span><span class="list-name">${newItem.name}</span>
        <div class="hp-cont" id="hp-${newItem.id}">
            <div class="hp-back"></div>
            <div class="hp-val">
                <input type="number" class="hp-curr" value="${newItem.hp}">
            </input>/<input type="number" class="hp-max" value="${newItem.hpMax}"></input>
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

    // ADDING LISTENER TO EACH ICON FOR EDITING

    const itemIcon = document.getElementById(`item-${newItem.id}`);
    itemIcon.addEventListener("click", function(e){
        editItem(e);
    });

    // ADDING LISTENERS FOR HPCURR AND HPMAX FOR UPDATES

    const hpCurr = newLi.getElementsByClassName("hp-curr")[0];
    hpCurr.addEventListener("change", function(e){
        hpUpdate(e);
    });

    const hpMax = newLi.getElementsByClassName("hp-max")[0];
    hpMax.addEventListener("change", function(e){
        hpUpdate(e);
    });

    scaleAllHp();
}


async function listSearch(newVal){
    let start = 0;
    let end = innitArr.length;

    console.log(`Length before insert: `, end);

    if(start == end){
        return 0;
    }
    for(i = start; i < end; i++){
        if(innitArr[i].num <= newVal){
            return i;
        }
    }
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
    try{
        innitArr.sort((a, b) => b.num - a.num);
        for(item in elems){
            if(isNaN(item)){
                break;
            }
            let diceImg = elems[item].firstChild;
            let innitNum = diceImg.nextElementSibling;
            let innitName = innitNum.nextElementSibling;
            diceImg.id = `item-${item}`;
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
    for(item in elems){
        if(isNaN(item)){
            break;
        }
        let hpParent = elems[item].children[3];
        let hpBar = hpParent.children[1];
        let hpCurr = hpBar.firstElementChild;
        let hpMax = hpBar.children[1];

        hpParent.id = `hp-${item}`;

        let newHp = innitArr[item].hp;
        let newHpMax = innitArr[item].hpMax;

        hpCurr.value = newHp;
        hpMax.value = newHpMax;
        await hpScale(item, newHp, newHpMax);

    }
}

async function refreshHidden(){
    const elems = document.getElementById("list-container").getElementsByTagName("li");
    console.log(elems.length);
    console.log(innitArr);
    
    for(let item = 0; item < elems.length; item++){
        console.log(innitArr[item]);
        if(innitArr[item].hidden == true && elems[item].classList.contains("hidden-false")){
            elems[item].classList.replace("hidden-false", "hidden-true");
        }
        else if(innitArr[item].hidden == false && elems[item].classList.contains("hidden-true")){
            elems[item].classList.replace("hidden-true", "hidden-false");
        }
    }
}

/* -- Round Settings -- */

let roundCount = 0;
let turnCount = 0;

/* -- Encounter Dialog Launch -- */

function storeCookie(name, value, days){
    let expireTime = "";
    if(days){
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expireTime = `; expires=${date.toUTCString()}`
    }
    document.cookie = `${name}=${value || ""}; expires=${expireTime}; SameSite=Lax`
}
// Cookies will last 1 day by default

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

// TODO: ENSURE DELETION OF EXPIRED COOKIES
async function storeSessionId(){
    let idArr = new Uint8Array(3);
    crypto.getRandomValues(idArr);
    let randChar = String.fromCharCode(97+Math.floor(Math.random() * 26));
    let newId = String(randChar + idArr.join(''));
    storeCookie("Innit-Session-ID", newId, 1);
}

async function getSessionId(){
    let idCookie;
    try{
        idCookie = getCookie("Innit-Session-ID");
        if(idCookie === undefined){
            throw new ReferenceError;
        }
    }
    catch(error){
        console.error("Session ID does not exist or is undefined.\nAttempting to create new id...");
        await storeSessionId();
        idCookie = getCookie("Innit-Session-ID");
    }
    finally{return idCookie;}
}

// Window Launch Handling

async function newDialog(sessionId, innitArr) {
    let dialogUrl = `./dialog.html?session=${encodeURIComponent(sessionId)}`;
    window.open(`${dialogUrl}`);
}

async function launchEncounter(){
    try{
       let id = await getSessionId();
        await newDialog(id, innitArr);
    }
    catch(error){
        console.error(error);
        return new Error(error);
    }
}

/* -- "Legacy" Encounter Turn Manips -- */



async function initialTurn(){
    const deadSkip = document.getElementById("deadSkip").checked;
    const hiddenSkip = document.getElementById("hiddenSkip").checked;
    const turnList = document.getElementById("list-container");
    let startingTurn;

    if(await infRoundLoopCheck()){return new Error("HUH???");}

    startingTurn = turnList.children[0];

    if((deadSkip && innitArr[0].hp <= 0) || (hiddenSkip && innitArr[0].hidden)){
        moveTurn(true);
        startingTurn = turnList.children[turnCount];
    }

    setCurrStyle(startingTurn);
}

async function getCurrTurn(){
    return document.getElementsByClassName("round-curr")[0];
}

/* Move the turn counter forwards/backwards */

/* TODO: Check hidden elements ahead/behind, then skip if option is selected */
async function moveTurn(isForwards){

    if(await infRoundLoopCheck()){return;}

    if(!isForwards){
        isForwards = false;
    }

    const turnElems = document.getElementById("list-container").children;
    const currTurn = await getCurrTurn();

    const deadSkip = document.getElementById("deadSkip").checked;
    const hiddenSkip = document.getElementById("hiddenSkip").checked;

    let checkedTurnCount;
    let nextTurn;

    // On forward movement, skip hidden elems and cycle back to start if final elem is hidden

    if(isForwards){
        turnCount++;
        checkedTurnCount = await roundCountCheck(turnCount);
        nextTurn = currTurn.nextElementSibling;
            while(hiddenSkip && innitArr[turnCount].hidden){
                ++turnCount;
                checkedTurnCount = await roundCountCheck(turnCount);
                nextTurn = turnElems[checkedTurnCount];
            }
           if(deadSkip){
                while(innitArr[turnCount].hp <= 0){
                    ++turnCount;
                    checkedTurnCount = await roundCountCheck(turnCount);
                    nextTurn = turnElems[checkedTurnCount];
                }
            } 
    }
    else{
        turnCount--;
        checkedTurnCount = await roundCountCheck(turnCount);
        nextTurn = currTurn.previousElementSibling;
            while(hiddenSkip && innitArr[turnCount].hidden){
                --turnCount;
                checkedTurnCount = await roundCountCheck(turnCount);
                nextTurn = turnElems[checkedTurnCount];
            }
            if(deadSkip){
                while(innitArr[turnCount].hp <= 0){
                    --turnCount;
                    checkedTurnCount = await roundCountCheck(turnCount);
                    nextTurn = turnElems[checkedTurnCount]; 
                }
            }
    }

    clearCurrStyle(currTurn);
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


/* Check if the initative order will loop infinitely because of only hidden or dead turns */

async function infRoundLoopCheck() {
    const deadSkip = document.getElementById("deadSkip").checked;
    const hiddenSkip = document.getElementById("hiddenSkip").checked;
    
    if(!hiddenSkip && !deadSkip){
        return false;
    }

    if(hiddenSkip && innitArr.find((item) => item.hidden == false) != undefined){
        return false;
    }

    if(deadSkip && innitArr.find((item) => item.hp > 0) != undefined){
        return false;
    }

    window.alert("ERROR: Current initiative configuration will lead to infinite loop.\n Check config settings for issue.");

    return true;
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
    const lowerHeight = 175;
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
        let checkedHtml ="";
        if(targetItem.hidden){
            checkedHtml = "checked";
        }
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
            <input type="number" id="num-edit" placeholder="0" pattern="[0-9]" value="${targetItem.num}">
            <input type="checkbox" id="hide-edit" ${checkedHtml}>
            <label for="innitHide">Hide Initiative</label>
        </div>
        <div id="options-button-panel">
            <button id="cancel">Cancel</button>
            <button id="delete">Delete</button>
            <button id="confirm">Confirm</button>
        </div>    
    `

    const optionsPanel = document.createElement("div");
    optionsPanel.id = "options-panel";
    docBody.className = "popup";
    optionsPanel.innerHTML = editorHtml;

    document.body.insertBefore(optionsPanel, screenPanel);

    // BUTTON LISTENERS FOR EDIT, DELETE, CANCEL
    const cancelButton = document.getElementById("cancel");
    cancelButton.addEventListener("click", function(e){
        editCancel();
    });

    const deleteButton = document.getElementById("delete");
    deleteButton.addEventListener("click", function(e){
        editDelete(parsedId);
    });

    const confirmButton = document.getElementById("confirm");
    confirmButton.addEventListener("click", function(e){
        editConfirm(parsedId);
    });

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

async function editConfirm(innitId){
    const newName = document.getElementById("name-edit").value;
    const newNum = parseInt(document.getElementById("num-edit").value);
    const isHidden = document.getElementById("hide-edit").checked;
    const item = innitArr[innitId];
    item.name = newName, item.num = newNum, item.hidden = isHidden;
    try{
       await sortList();
       await refreshHidden();
    }
    catch(error){
        console.error(error);
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

/* -- DATA INTERACTING WITH SERVER / LOCAL STORAGE -- */

async function saveInnitArr(arr, listName){
    let checkedListName = listName || `List-${saveList.length}`;
    let newList = 
        {
            "listId" : saveList.length,
            "listName" : checkedListName,
            "listItems" : arr
        };
    
    try {
        saveList.push(newList);
        let packagedList = JSON.stringify(saveList);
        localStorage.setItem("Saved-Lists", packagedList);
    } catch (error) {
        console.error(error);
    }

}

async function saveActiveArr(name){
    await saveInnitArr(innitArr, name);
}

async function fetchSavedLists(){
    const data = localStorage.getItem("Saved-Lists");
    const savedLists = JSON.parse(data);
    saveList = savedLists;
}

function clearSavedLists(){
    localStorage.removeItem("Saved-Lists");
    saveList = [];
}

/*  TODO: Add framework to sync updates from config to display */

function sendList(listId, command){
    let itemData = saveList[listId].listItems;
    let data = {
        items : itemData,
        type : command
    }
    connection.send(JSON.stringify(data));
}


/* -- CLIENT LIST MANAGEMENT -- */

async function clearActiveList(){
    const itemList = document.getElementById("list-container");
    itemList.innerHTML = "";
    innitArr.length = 0;
}

async function loadSavedList(listId){
    const newList = saveList[listId].listItems;
    for(item in newList){
        innitArr.push(newList[item]);
    }

    for(item in innitArr){
        sortedInsert(innitArr[item]);
    }
}

