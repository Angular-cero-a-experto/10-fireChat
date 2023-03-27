import { Component } from '@angular/core';
import { ChatService } from '../../providers/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor( private chatServices: ChatService ) {

  }

  ingresar( proveedor: string ) {
    console.log(proveedor);

    this.chatServices.login(proveedor);
  }

}
