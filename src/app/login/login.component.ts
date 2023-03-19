import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup: UntypedFormGroup = new UntypedFormGroup({});

  constructor(private _formBuilder: UntypedFormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      login : ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  connect(){
    this.auth.login(this.formGroup.value.login, this.formGroup.value.password);
  }

}
