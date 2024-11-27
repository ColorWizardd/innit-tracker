const WebSocket = require("ws");

const server = new WebSocket.Server({
  port: 30000
});

console.log("Server ready!");

server.on('connection', (ws) => {
  setTimeout(() => {}, 500);
  ws.send("YOU IN MY HOUSE NOW, BIYATCH!");
  console.log("Client Connected!");
  

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