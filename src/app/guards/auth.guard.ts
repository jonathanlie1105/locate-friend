import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AppService } from "../services/app.service";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private appService: AppService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.getAuthState()) {
      return true;
    }
    this.appService.toastNotLoggedInYet();
    this.router.navigate(["signin"]);
    return false;
  }
}
