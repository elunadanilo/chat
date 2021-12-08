import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  public hubConnection!: signalR.HubConnection;

  constructor() {
    this.buildConnection();
    this.startConnection();
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

  public startConnection = () => {
    this.hubConnection
      .start()
      .then(() => {
        console.log("Connection Started...");
      })
      .catch(err => {
        console.log("Error while starting connection: " + err);
        /*setTimeout(() => {
          this.startConnection();
        }, 3000);*/
      });
  };
}
