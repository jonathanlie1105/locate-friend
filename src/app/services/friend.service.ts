import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { FirebaseService } from "./firebase.service";

@Injectable({
  providedIn: "root",
})
export class FriendService {
  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {}

  getAllFriends() {
    const uid = this.authService.getUid();

    return this.firebaseService
      .getFriends(uid)
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ uid: c.key, value: c.payload.val() }))
        )
      );
  }

  addFriend(f_uid, friend) {
    const uid = this.authService.getUid();
    const { firstName, lastName, imageUrl } = friend;
    const data = {
      firstName,
      lastName,
      imageUrl,
    };

    this.firebaseService.addFriend(uid, f_uid, data);
  }

  deleteFriend(f_uid) {
    const uid = this.authService.getUid();
    this.firebaseService.deleteFriend(uid, f_uid);
  }
}
