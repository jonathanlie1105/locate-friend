import { Component, OnInit } from "@angular/core";
import { SafeResourceUrl } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  firstName: string;
  lastName: string;
  photo: SafeResourceUrl;
  email: string;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.getUserDetails().subscribe((data) => {
      const idxFirstName = data.findIndex((d) => d.key === "firstName");
      const idxLastName = data.findIndex((d) => d.key === "lastName");
      const idxPhoto = data.findIndex((d) => d.key === "imageUrl");

      this.firstName = data[idxFirstName].value;
      this.lastName = data[idxLastName].value;
      this.photo = data[idxPhoto].value;
    });
  }

  logout() {
    this.authService.signOut().then(
      () => this.router.navigate(["signin"]),
      (err) => console.log(err)
    );
  }
}
