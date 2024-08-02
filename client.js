const socket = new WebSocket('ws://localhost:21000');

socket.onopen = function(event){
    console.log(`Client connected!`);
}

socket.onclose = function(event){
    console.log(`Client disconnected`);
}

function ping(){
    console.log('Test worked!');
    socket.send('Test worked!');
}