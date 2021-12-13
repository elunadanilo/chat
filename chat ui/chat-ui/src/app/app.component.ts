import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder ,FormGroup , Validators } from '@angular/forms';
import { SignalrService } from '../services/signalr.service';
import { HttpClient } from '@angular/common/http';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('myinputfile')myinputfile:any;

  title = 'chat-ui';
  listMensajes : any[]=[];
  messages: string[] = [];
  message: string = "";
  usuario: string = "";
  currentFiles:any=[];
  myimg:any="";
  
  constructor(public signalrService: SignalrService,private http:HttpClient){

  }
  
  ngOnInit(): void {   
    this.signalrService.startConnection((message:any)=>{
      this.listMensajes.push(message);
    },(imageMessage:any)=>{
      this.listMensajes.push(imageMessage);
    }); 
  }

  agregarSala(){
    console.log('Entro a sala');
    this.signalrService.hubConnection.invoke("AddToGroup","1");
  }

  async sendMessage(){
    if(this.myinputfile.nativeElement.files.length>0){
      let formData=new FormData();

      formData.append("RoomId","1");
      formData.append("File",this.myinputfile.nativeElement.files[0]);

      await this.signalrService.sendImagesMessage(formData,(response:any)=>{
        this.myimg=response;
      },(error:any)=>{
        console.log(error);
      });

      this.myinputfile.nativeElement.value="";
    }else{
      console.log("mensaje" + this.message);
      this.signalrService.sendMessageGroup(this.usuario,this.message);
    }
  }

  listadoMensajes(){

  }

  onaddremoveFiles(){
    if(this.myinputfile.nativeElement.files.length==0){
      this.myinputfile.nativeElement.click();
    }else{
      this.myinputfile.nativeElement.value="";
    }
  }

  onfilesSelected(files:any){return files.length>0;}

}
