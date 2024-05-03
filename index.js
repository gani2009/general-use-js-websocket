// How to do WebSockets in NodeJS with Express

// Server-side:

// your-code
var expressWs = require('express-ws')(app);
const WebSocket = require('ws');
const clientsByURL = {};

// Define WebSocket route
app.ws('/websocket/:url', (ws, req) => {
  const urlParam = req.params.url;

  // Store WebSocket client in the object based on URL
  if (!clientsByURL[urlParam]) {
    clientsByURL[urlParam] = [];
  };
  clientsByURL[urlParam].push(ws);


  ws.on('message', (msg) => {
    // Broadcast received message to all clients connected to the same URL
    if (clientsByURL[urlParam]) {
      clientsByURL[urlParam].forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(msg);
        }
      });
    }
  });

  ws.on('close', () => {
    // Remove WebSocket client from the object when connection is closed
    if (clientsByURL[urlParam]) {
      clientsByURL[urlParam] = clientsByURL[urlParam].filter((client) => client !== ws);
      if (clientsByURL[urlParam].length === 0) {
        delete clientsByURL[urlParam];
      }
    };
  });
});
// your-code


// _________________________________________________________________________________________________

// Note: the URL part doesn't work, so you must implement it yourself. 
// This code sends the message received to all the other clients. 

// Client-side:


// your-code
const socket = new WebSocket('wss://YOUR-URL-HERE/roomnumber');
// your-code

// To receive: 
socket.addEventListener("message", msg => {
  console.log(msg);
  // Stuff you want to do with the message(msg)
});

// your-code

// To send: 
socket.send("Message to the server and all other clients. ");

// your-code
