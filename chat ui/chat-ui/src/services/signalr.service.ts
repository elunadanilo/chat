import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  public hubConnection!: signalR.HubConnection;

  constructor(private http:HttpClient) {
    this.buildConnection();
    //this.startConnection();
   }

  public buildConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl("https://localhost:44352/chatHub",{
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();
  };

  public startConnection = (onMessageCallback:Function,onMessageImageCallback:Function) => {
    this.hubConnection
      .start()
      .then(() => {
        console.log("Connection Started...");
        this.ListeningConnections();
        this.ListeningIncomeMessages(onMessageCallback);
        this.ListeningIncomeImagesMessages(onMessageImageCallback);
      })
      .catch(err => {
        /*console.log("Error while starting connection: " + err);
        setTimeout(() => {
          this.startConnection();
        }, 3000);*/
      });
  };

  private ListeningConnections(){
    this.hubConnection.on("ReceiveConnID", function (connid) {
      console.log("ConnID: " + connid);
    });


  }

  public sendMessageGroup(user:any,message:any){
    this.hubConnection.invoke("SendMessageGroup","1", user,message,0)
    .catch(function (err) {
      return console.error(err.toString());
    });     
  }

  public ListeningIncomeMessages(onMessageCallback:Function){
    this.hubConnection.on("ReceiveMessageGroup",  (user, message) => {    
      console.log(`${user} says ${message}`)
      onMessageCallback({mensaje: message, user: user});
    });  
  }

  public ListeningIncomeImagesMessages(onImageMessageCallback:Function){
    this.hubConnection.on("ReceiveImageMessageGroup", (user, image) => {
      console.log(image);
      console.log(image.idUsuario);
      console.log(image.idCliente);

      onImageMessageCallback({ mensaje: image, user: user, tipo: "imagen" });
    });
  }

  public async sendImagesMessage(formData:FormData,onOkCallback:Function,onErroCallback:Function){
    await this.http.post("http://localhost:54631/api/test",formData).toPromise().then((response)=>{
      onOkCallback(response);
    }).catch((error)=>{
      onErroCallback(error);
      console.log(error);
    });
  }
}