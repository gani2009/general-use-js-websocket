require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
var expressWs = require('express-ws')(app);
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

let messageHistory = [];

app.ws('/chat', function(ws, req) {
  ws.on('message', function(msg) {
    expressWs.getWss().clients.forEach(client => {
      client.send(msg);
    });
    messageHistory.push(msg);
  });
});

app.use((req, res) => {
  //render page not found
  res.redirect('/');
});

//Start Server
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
