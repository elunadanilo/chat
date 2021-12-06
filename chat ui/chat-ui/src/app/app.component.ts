import { Component, OnInit } from '@angular/core';
import { FormBuilder ,FormGroup , Validators } from '@angular/forms';
import { SignalrService } from './signalr.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chat-ui';
  listMensajes : any[]=[];
  messages: string[] = [];
  message: string = "";
  usuario: string = "";

  
  constructor(public signalrService: SignalrService){

  }
  
  ngOnInit(): void {   
    this.signalrService.startConnection();

    this.signalrService.hubConnection.on("ReceiveConnID", function (connid) {
      console.log("ConnID: " + connid);
    });

    this.signalrService.hubConnection.on("ReceiveMessageGroup",  (user, message) => {    
    console.log(`${user} says ${message}`)
     this.listMensajes.push({mensaje: message, user: user})
     console.log(this.listMensajes);
    });  

     
   
  }

  agregarSala(){
    console.log('Entro a sala');
    this.signalrService.hubConnection.invoke("AddToGroup","1");
  }

  sendMessage(){
    console.log("mensaje" + this.message);
      this.signalrService.hubConnection.invoke("SendMessageGroup","1", this.usuario,this.message,0)
      .catch(function (err) {
        return console.error(err.toString());
      });      
  }

  listadoMensajes(){

  }


}
