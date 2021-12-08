
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignalrService } from './signalr.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('myinputfile') myinputfile: any;

  title = 'chat-ui';
  listMensajes: any[] = [];
  messages: string[] = [];
  message: string = "";
  usuario: string = "";
  ticket: string = "";
  currentFiles: any = [];
  myimg: any = "";

  constructor(public signalrService: SignalrService, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.signalrService.startConnection();

    this.signalrService.hubConnection.on("ReceiveConnID", function (connid) {
      console.log("ConnID: " + connid);
    });

    this.signalrService.hubConnection.on("ReceiveMessageGroup", (user, message) => {
      console.log(`${user} says ${message}`)
      this.listMensajes.push({ mensaje: message, user: user, tipo: "texto" })
      console.log(this.listMensajes);
    });

    this.signalrService.hubConnection.on("ReceiveImageMessageGroup", (user, image) => {
      console.log(image);
      console.log(image.idUsuario);
      console.log(image.idCliente);
      //this.myimg = image;
      this.listMensajes.push({ mensaje: image, user: user, tipo: "imagen" })
    });

    this.signalrService.hubConnection.keepAliveIntervalInMilliseconds.toPrecision()
  }

  agregarSala() {
    console.log('Entro a sala');
    this.signalrService.hubConnection.invoke("AddToGroup", this.ticket);
  }

  sendMessage() {
    if (this.myinputfile.nativeElement.files.length > 0) {
      let formData = new FormData();

      formData.append("RoomId", "1");
      formData.append("IdUsuario", this.usuario);
      formData.append("IdCliente", "1");
      formData.append("File", this.myinputfile.nativeElement.files[0]);

      this.http.post("https://localhost:44352/UploadImages", formData).subscribe((response) => {
        //this.myimg=response;
      }, (error) => {
        console.log(error);
      });

    } else {
      //console.log("mensaje" + this.message);
      this.signalrService.hubConnection.invoke("SendMessageGroup", "1", this.usuario, this.message, 0)
        .catch(function (err) {
          return console.error(err.toString());
        });
    }
  }

  onaddremoveFiles() {
    if (this.myinputfile.nativeElement.files.length == 0) {
      this.myinputfile.nativeElement.click();
    } else {
      this.myinputfile.nativeElement.value = "";
    }
  }

  onfilesSelected(files: any) { return files.length > 0; }

}

