import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  formGroup: UntypedFormGroup = new UntypedFormGroup({});

  constructor(private _formBuilder: UntypedFormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      login : ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  create(){
    this.auth.register(this.formGroup.value.login, this.formGroup.value.password);
  }

}
