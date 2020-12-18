import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingController, ToastController } from "@ionic/angular";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AppService {
  loading: HTMLIonLoadingElement = undefined;

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  async showLoadingIndicator() {
    this.loading = await this.loadingController.create({
      message: "Loading",
    });
    await this.loading.present();
  }

  async dismissLoadingIndicator() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = undefined;
    }
  }

  async toastSignUp() {
    const toast = await this.toastController.create({
      header: "Success!",
      message: "Your account have been created",
      color: 'success',
      duration: 2000,
      buttons: [
        {
          text: "Login",
          handler: () => {
            this.router.navigate(["signin"]);
          },
        },
        {
          text: "Dismiss",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    toast.present();
  }

  async toastSignIn() {
    const toast = await this.toastController.create({
      header: "Success!",
      message: "You've been successfull Sign In",
      color: 'success',
      duration: 2000,
    });
    toast.present();
    this.router.navigate(['tabs', 'home']);
  }

  async toastNotLoggedInYet() {
    const toast = await this.toastController.create({
      header: "Sorry!",
      message: "Your need to Sign In first!",
      color: 'danger',
      duration: 2000,
    });
    toast.present();
  }
}
