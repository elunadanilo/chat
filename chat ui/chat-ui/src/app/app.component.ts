import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder ,FormGroup , Validators } from '@angular/forms';
import { SignalrService } from './signalr.service';
import { HttpClient } from '@angular/common/http';


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
    if(this.myinputfile.nativeElement.files.length>0){
      let formData=new FormData();

      formData.append("RoomId","1");
      formData.append("File",this.myinputfile.nativeElement.files[0]);

      this.http.post("http://localhost:54631/api/test",formData).subscribe((response)=>{
        this.myimg=response;
      },(error)=>{
        console.log(error);
      });

    }else{
      console.log("mensaje" + this.message);
        this.signalrService.hubConnection.invoke("SendMessageGroup","1", this.usuario,this.message,0)
        .catch(function (err) {
          return console.error(err.toString());
        });      
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
