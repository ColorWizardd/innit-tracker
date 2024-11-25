const WebSocket = require("ws");

const server = new WebSocket.Server({
  port: 30000
});

console.log("Server ready!");

server.on('connection', (ws) => {
  
  while(ws.readyState == 0){setTimeout(50);}
  console.log("Client Connected!");
  ws.send("YOU IN MY HOUSE NOW, BIYATCH!");

  ws.on('message', function(message) {
    try{
      console.log(`Client Message: ${message}`)
    }catch(error){console.error(error)};
  });
  
});

server.on('open', function open() {
  
  });

server.on('close', () =>{
  console.log("Client Disconnected!")
})