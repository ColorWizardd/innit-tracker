const WebSocket = require("ws");

const server = new WebSocket.Server({
  port: 30000
});

const lobbyList = new Map();

// PLACEHOLDER URL FOR JOINING
const joinUrl = "./display-updated.html";

function pushClient(clientId, client){
  lobbyList.set(clientId, client);
  console.log("Lobby added: ", clientId);
  console.log("Lobby users: ", client.connections);
}

function idExistCheck(id){
  console.log(`ID CHECK: ${lobbyList.has(id)}`);
  return lobbyList.has(id);
}

console.log("Server ready!");

server.on('connection', (ws, request, client) => {
  setTimeout(() => {}, 500);
  ws.send(JSON.stringify({msg: "Server Connected!"}));
  console.log("Client Connected!");
  console.log(request.url);

  ws.on('close', () =>{
    console.log("Client disconnected!");
  })
  

  ws.on('message', function(message, isBinary) {
    let parsedData = JSON.parse(message) || message;
    try{
      console.log(`Client Message: \n`, parsedData);
      ws.send(`DATA SENT: \n${message}`);

      let commandType = parsedData.type || "newList";
      switch(commandType){

        // Session management

        case "newSession" : 
        let id = String(parsedData.items[0]);
        console.log("New session ID: ", id);
          if(!idExistCheck(id)){
            pushClient(id, {
              timeCreated: Date.now(),
              connections: [{
                user : parsedData.items[1],
                role : "host"
              }]
            });
            console.log();
          }
          else{
            throw new ReferenceError("Session ID already exists.");
          }
        break;

        case "joinSession" :
          let joinId = String(parsedData.items);
          if(idExistCheck((joinId))){
            console.log(`New user joining lobby ${joinId}`);
            let linkMsg = ({
              msg : `Returning join link for lobby ${joinId}`,
              type : "lobbyConnect",
              items : `${joinUrl}?session=${joinId}`
            });
            ws.send(JSON.stringify(linkMsg));
          }
          else{
            let linkMsg = ({
              msg : `Returning join link for lobby ${joinId}`,
              type : "lobbyConnect",
              items : -1
            })
            ws.send(JSON.stringify(linkMsg));
          }

        break;

        case "closeSession" :
          let sessionId = String(parsedData.items);
          if(idExistCheck(sessionId)){
            console.log(`Terminating session ${sessionId}`);
          }
          if(!lobbyList.delete(sessionId)){
            console.log("LOBBY NOT DELETED: ", lobbyList);
          }
        break;

        // Encounter List Changes

        case "newList" :
        server.clients.forEach(function each(client){
          if(client != ws && client.readyState === WebSocket.OPEN){
            client.send(message, {binary: isBinary});
          }
        })
        break;

        case "editItem" :

        case "addItem" :

        case "deleteItem" :

        case "turnForward" :

        case "turnBackward" :

        default :
        
      }

    }catch(error){console.error(error)};

  });
  
});

server.on('open', function open() {
  
  });



/*

-- SERVER METHODOLOGIES --

Launching an Encounter:
- Session ID generated from encounter config screen (DONE)
- Encounter ID is processed into a join link
- Encounter config pings the server with the session ID
- The encounter window opens up on the host end
  - The window lasts until the host closes it, ending the session.
  - The host maintains the session ID until the cookie expires and resets.
- A room is generated on the server end and is pushed into an array
- Players can join the room through the url and data is handled through the websocket server
- Players should not be able to enter data or control the encounter
*/
