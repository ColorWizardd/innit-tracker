const WebSocket = require("ws");

const server = new WebSocket.Server({
  port: 30000
});

console.log("Server ready!");

server.on('connection', (ws) => {
  setTimeout(() => {}, 500);
  ws.send("YOU IN MY HOUSE NOW, BIYATCH!");
  console.log("Client Connected!");
  

  ws.on('message', function(message, isBinary) {
    let parsedData = JSON.parse(message) || message;
    try{
      console.log(`Client Message: \n`, parsedData);
      ws.send(`DATA SENT: \n${message}`);

      let commandType = parsedData.type || "newList";
      switch(commandType){

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

server.on('close', () =>{
  console.log("Client Disconnected!")
})