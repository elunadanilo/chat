
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignalrService } from '../services/signalr.service';
import { HttpClient } from '@angular/common/http';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('myinputfile') myinputfile: any;

  title = 'chat-ui';
  listMessages: any[] = [];
  messages: string[] = [];
  message: string = "";
  user: string = "";
  ticket: string = "";
  currentFiles: any = [];
  myimg: any = "";

  constructor(public signalrService: SignalrService, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.signalrService.startConnection((message: any) => {
      console.log('recibiendo ' + message.mensaje);
      this.listMessages.push({ mensaje: message.mensaje, user: message.user, tipo: "texto" });
    }, (imageMessage: any) => {
      this.listMessages.push(imageMessage);
    }, (incomingConnection: any) => {
      console.log(incomingConnection);
    }, (error:any) => {
      console.log(error);
    });
  }

  addRoom() {
    this.signalrService.addTogroup(this.ticket, this.user);
  }

  leaveRoom(){
    this.signalrService.leaveTogroup(this.ticket);
  }

  async sendMessage() {
    if (this.myinputfile.nativeElement.files.length > 0) {
      let formData = new FormData();

      formData.append("RoomId", this.ticket);
      formData.append("IdUsuario", this.user);
      formData.append("IdTipoRemitente", "1");
      formData.append("Asunto", "Asunto");
      formData.append("Mensaje", this.message);
      formData.append("CodIdioma", "ES");
      formData.append("File", this.myinputfile.nativeElement.files[0]);

      await this.signalrService.sendImagesMessage(formData, (response: any) => {
        this.myimg = response;
      }, (error: any) => {
        console.log(error);
      });

      this.myinputfile.nativeElement.value = "";
    } else {
      this.signalrService.sendMessageGroup(this.ticket, this.user, this.message);
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

  openImages(src: any) {
    let data = src;
    let w = window.open('about:blank');
    let image = new Image();
    image.src = data;

    if (w !== null) {
      w.document.write(image.outerHTML);
    }
  }

}

