const { WebSocketServer } = require('ws');
const wss = new WebSocketServer( {port: 21000} );

wss.on('connection', function connection(ws){
    console.log(`New client connected!`);

    ws.addEventListener('message', (event) =>{
        console.log("New server message: ", event.data);
    })

    ws.on('close', function(){

    });
});