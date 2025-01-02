//This line imports the express library, meant to simplify building webservers and API's 
const express = require('express');

//This line initializses the express application 
const app = express();

//This line sets the port for the server to listen on, Default is 3000
const PORT = process.env.PORT || 3000;

//This line is middleware: It parses incoming JSON Payloads in request
app.use(express.json());

//This line defines a GET route for the root URL ('/') that responds with a welcome message 
app.get('/', (req,res) => {
    res.send('Welcome to Shepard.AI'); //Sends a simple Text Response to the the client
});

//This Line Starts the server and listens on the specified port
app.listen(PORT, () => {
    //Logging a message to the console to Alert Server running
    console.log(`Server running on http://localhost:${PORT}`);
}); 