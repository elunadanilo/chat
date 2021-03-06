import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  public hubConnection!: signalR.HubConnection;

  constructor(private http: HttpClient) {
    this.buildConnection();
    //this.startConnection();
  }

  public buildConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl("https://localhost:44352/chatHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      //.withAutomaticReconnect([0,1000,5000,6000,7000,8000,10000,15000])
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          if (retryContext.elapsedMilliseconds < 60000) {
            // If we've been reconnecting for less than 60 seconds so far,
            // wait between 0 and 10 seconds before the next reconnect attempt.

            return Math.random() * 10000;
          } else {
            // If we've been reconnecting for more than 60 seconds so far, stop reconnecting.
            return null;
          }
        }
      })
      .build();
  };

  public startConnection = (
    onMessageCallback: Function,
    onMessageImageCallback: Function,
    onIncomingConnectionCallback: Function,
    onErrorCallback: Function) => {
    this.hubConnection
      .start()
      .then(() => {
        console.log("Connection Started...");
        this.ListeningConnections();
        this.ListeningIncomeMessages(onMessageCallback);
        this.ListeningIncomeImagesMessages(onMessageImageCallback);
        this.ListeningIncomingConnection(onIncomingConnectionCallback);
        this.ListeningError(onErrorCallback);
      })
      .catch(err => {
      });
  };

  private ListeningConnections() {
    this.hubConnection.on("ReceiveConnID", function (connid) {
      console.log("ConnID: " + connid);
    });
  }

  public addTogroup(room: any, user: any) {
    this.hubConnection.invoke("AddToGroup", room, user);
  }

  public leaveTogroup(room: any) {
    this.hubConnection.invoke("Leave", room);
  }

  public sendMessageGroup(room: any, user: any, message: any) {
    this.hubConnection.invoke("SendMessageGroup", room, user,"asunto", message, 1)
      .catch(function (err) {
        return console.error(err.toString());
      });
  }

  public ListeningIncomeMessages(onMessageCallback: Function) {
    this.hubConnection.on("ReceiveMessageGroup", (user, message) => {
      console.log(user + message);
      onMessageCallback({ mensaje: message, user: user });
    });
  }

  public ListeningIncomingConnection(onIncomingConnectionCallback: Function) {
    this.hubConnection.on("IncomingConnection", (message) => {
      onIncomingConnectionCallback({ mensaje: message });
    });
  }

  public ListeningUserConnected(onMessageCallback: Function) {
    this.hubConnection.on("ReceiveMessageUserConnected", (user, message) => {
      onMessageCallback({ mensaje: message, user: user });
    });
  }

  public ListeningError(onErrorCallback: Function) {
    this.hubConnection.on("onError", (retcode,message) => {
      onErrorCallback({ mensaje: message + retcode });
    });
  }

  public ListeningIncomeImagesMessages(onImageMessageCallback: Function) {
    this.hubConnection.on("ReceiveImageMessageGroup", (user, image) => {
      console.log(image);
      console.log(image.idUsuario);
      console.log(image.idCliente);
      onImageMessageCallback({ mensaje: image, user: user, tipo: "imagen" });
    });
  }

  public async sendImagesMessage(formData: FormData, onOkCallback: Function, onErroCallback: Function) {
    console.log(formData);
    await this.http.post("https://localhost:44352/UploadImages", formData).toPromise().then((response) => {
      console.log('RESPONSE DE IMAGEN', response)
      onOkCallback(response);
    }).catch((error)=>{
      onErroCallback(error);
      console.log(error);
    });
  }  
}
