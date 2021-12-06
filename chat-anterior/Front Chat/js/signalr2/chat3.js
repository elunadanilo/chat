"use strict";

const connection = new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.Information)
    .withUrl("https://localhost:44352/chatHub",{
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })   
    .build();

    

    //evento para enviar mensajes
    document.getElementById("sendButton").addEventListener("click", function (event) {
        var room = document.getElementById("groupInput").value;
        var user = document.getElementById("userInput").value;
        var message = document.getElementById("messageInput").value;
        connection.invoke("SendMessageGroup",room, user, message,0).catch(function (err) {
            return console.error(err.toString());
        });

        event.preventDefault();
    });

    //evento para agregar usuario a una sala
    document.getElementById("GroupButton").addEventListener("click", function (event) {
        var room = document.getElementById("groupInput").value;
        connection.start().then(function () {
            connection.invoke("AddToGroup",room)
        }).catch(function (err) {
            return console.error(err.toString());
        });

        event.preventDefault();
    });

    //evento que muestra los mensajes
    connection.on("ReceiveMessageGroup", function (user, message) {
        var li = document.createElement("li");
        document.getElementById("messagesList").appendChild(li);
        // We can assign user-supplied strings to an element's textContent because it
        // is not interpreted as markup. If you're assigning in any other way, you 
        // should be aware of possible script injection concerns.
        li.textContent = `${user} says ${message}`;
    });

     //evento que muestra los mensajes
     connection.on("ShowWho", function (message) {
        var li = document.createElement("li");
        document.getElementById("messagesList").appendChild(li);
        // We can assign user-supplied strings to an element's textContent because it
        // is not interpreted as markup. If you're assigning in any other way, you 
        // should be aware of possible script injection concerns.
        li.textContent = `${message}`;
    });

    //obtenemos el id de la conexion
    connection.on("ReceiveConnID", function (connid) {
        console.log("ConnID: " + connid);
    });

    
        
    var form = document.getElementById("uploadForm");
    
        form.addEventListener('submit', function(ev) {
       
        console.log(form);
        $.ajax({
            type: "POST",
            url: 'https://localhost:44352/UploadImages',
            data: new FormData(form),
            contentType: false,
            processData: false,
            success: function () {
                $("#UploadedFile").val("");
            },
            error: function (error) {
                alert('Error: ' + error.responseText);
            }
        });

        event.preventDefault();

    }, false);
  
