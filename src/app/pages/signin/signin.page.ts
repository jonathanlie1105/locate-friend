import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  validations_form: FormGroup;

  validation_messages = {
    email: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Enter a valid email." },
    ],
    password: [
      { type: "required", message: "Password is required." },
      {
        type: "minlength",
        message: "Password must be at least 5 characters long.",
      },
    ],
  };

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      password: new FormControl(
        null,
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
    });
  }

  tryLogin(value){
    this.appService.showLoadingIndicator();
    const result = { email: value.email, password: value.password };
    this.authService.signIn(result).then(
      (res) => {
        console.log(res);
        this.appService.toastSignIn();
        this.appService.dismissLoadingIndicator();
      },
      (err) => {
        this.appService.dismissLoadingIndicator();
        console.log(err);
      }
    );
  }

}
