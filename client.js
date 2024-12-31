/* WEBSOCKET FUNCTIONALITY */

const connection = new WebSocket("ws://localhost:30000");
connection.addEventListener("open", () => {
    console.log("Connected!");
    connection.send(JSON.stringify({msg: "Test Line"}));
     });
connection.addEventListener("message", async (message) =>{
    let dataInput = message.data;
    console.log(`Message Received: ${dataInput}`);
    await commandParse(dataInput);
});

/* MESSAGE HANDLING */

const listData = [];

async function commandParse(data){
    let newCommand = JSON.parse(data) || undefined;
    console.log("Message JSON:", newCommand);
    if(newCommand.msg){console.log(newCommand.msg);}
    let commandType = newCommand.type;

    switch(commandType){
        case "newList" :
        listData.length = 0;

        await generateList(newCommand);
        
        case "editItem" :
        
        case "addItem" :
        
        case "deleteItem" :
        
        case "turnForward" :
        
        case "turnBackward" :
        
        default :
        console.log("no command detected.");
        break;
    }
}



/* LIST GENERATION */

const listContainer = document.getElementById("list-card-cont");
let delayVal = 850;
let widthVal = 40;
let cardOffset = widthVal*2
 function dealDelay(itemCount){
    return new Promise(resolve => setTimeout(resolve, (delayVal / itemCount)));
};

async function generateList(itemList){
    const items = itemList.items;
    for(obj in items){
        listContainer.appendChild(await addItem(items[obj]));
        cardHpScale(obj, items[obj].hp, items[obj].hpMax);
    }

    for(let i = (items.length-1); i >= 0; i--){
        await dealDelay(items.length);
        listContainer.children[i].classList.remove("paused")
        console.log(`Currently on item ${i}`)
    }

    const firstElem = listContainer.children[0];

    await dealDelay(items.length);

    firstElem.addEventListener("animationend", () =>{
        initialCurr();
    })
}

function clearCurrList(){

}

/* 

-- ITEM STRUCTURE --
(Order of priority)
- Innit value
- Item name
- Item curr/max hp (Optional?)
    - Use a two-color fill or changing shade to indicate relative hp?

*/

async function addItem(item){

    console.log("item data:", item);
    let newItem = document.createElement("div");
    newItem.classList.add("card-cont","paused");
    newItem.id = `item-${item.id}`;
    newItem.innerHTML =
     `
        <article class="item-card">
            <section class="name-cont">
                <span class="card-name">${item.name}</span>
            </section>
            <section class="card-image-cont">
                <img class="card-image" alt="Card Image" src="./assets/TestIcon.png">
            </section>
            <section class="card-stats">
                <section class="innit-cont">
                    <span class="innit-val">${item.num}</span>
                </section>
            </section>
            <section class="card-hp">
                <span class="hp-curr">${item.hp}</span>
                <div class="hp-cont"><div class="hp-back"></div></div>
                <span class="hp-max">${item.hpMax}</span>
            </section>
        </article>
    `
    return newItem;
        
}

function initialCurr(){
    let firstItem = listContainer.children[0];
    firstItem.classList.add("curr");
}

/* CARD ANIMATIONS */

function cardHpScale(itemIndex, newCurrHp, newMaxHp){
    let hpCont = listContainer.getElementsByClassName("card-hp")[itemIndex];
    let currHp = hpCont.children[0];
    let maxHp = hpCont.children[2];
    let hpBar = listContainer.getElementsByClassName("hp-back")[itemIndex];

    currHp.innerHTML = `${newCurrHp}`;
    maxHp.innerHTML = `${newMaxHp}`;

    hpBar.style.width = `${((newCurrHp/newMaxHp).toFixed(2)*100)}%`
}

/* SCROLLING INNIT LIST */

function scrollNext(isForwards){

}


/*

Okay, reeeeallly need to revamp the code.
    - Currently needs to be able to move forwards and backwards,
    - Use data from the innitArr to display each item's info,
    - Add space for displaying the current round,
    - (IN CSS) Restyle the display for smoother, simpler feel
    - (IN CSS) Tweak list movement
    

*/

/*

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
*/