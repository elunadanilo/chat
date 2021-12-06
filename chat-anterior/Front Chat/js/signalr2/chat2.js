"use strict";

const connection = new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.Information)
    .withUrl("https://localhost:44352/chatHub",{
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })   
    .build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${user} says ${message}`;
});

//obtenemos el id de la conexion
connection.on("ReceiveConnID", function (connid) {
    console.log("ConnID: " + connid);
});

//Listado de rooms, son los tickets abiertos
connection.on("GetRooms",function () {
    console.log(result);    
    for (var i = 0; i < result.length; i++) {       
        var li = document.createElement("li");
        var text = document.createTextNode("Sala de Ticket: "  + result[i].idTicket);
        document.getElementById("room-list").appendChild(li);
        li.appendChild(text);
        console.log(result[i].idTicket);
    }
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});



//evento para enviar mensajes
document.getElementById("sendButton").addEventListener("click", function (event) {
var user = document.getElementById("userInput").value;
var message = document.getElementById("messageInput").value;
connection.invoke("SendMessage", user, message).catch(function (err) {
    return console.error(err.toString());
});




   

event.preventDefault();
});
