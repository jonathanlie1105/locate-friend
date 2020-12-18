import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { DEFAULT_PROFILE_IMG } from "../constants/default-image";
import { AuthService } from "./auth.service";
import { FirebaseService } from "./firebase.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {}

  createUser(uid, value) {
    const { imageUrl } = value;
    this.firebaseService.pushUser(uid, value);
    if (imageUrl !== DEFAULT_PROFILE_IMG) {
      this.firebaseService.uploadImage(uid, imageUrl);
    }
  }

  getAllUsers() {
    return this.firebaseService
      .getAllUser()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ uid: c.key, value: c.payload.val() }))
        )
      );
  }

  getUserDetails() {
    const uid = this.authService.getUid();
    const user = this.firebaseService.getUserDetails(uid);

    return user
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.key, value: c.payload.val() }))
        )
      );
  }
}
