import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { FirebaseService } from "./firebase.service";

@Injectable({
  providedIn: "root",
})
export class LocationService {
  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService
  ) {}

  createLocation(uid) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const data = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            time: pos.timestamp,
          };
          this.firebaseService.pushLocation(uid, data);
        },
        (err) => console.log(err)
      );
    }
  }

  getLocation() {
    const uid = this.authService.getUid();
    const pos = this.firebaseService.getUserLocation(uid);

    return pos
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.key, value: c.payload.val() }))
        )
      );
  }

  getLocationFriend(f_uid) {
    const pos = this.firebaseService.getUserLocation(f_uid);

    return pos
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.key, value: c.payload.val() }))
        )
      );
  }

  updateLocation(pos) {
    const uid = this.authService.getUid();
    this.firebaseService.updateLocation(uid, pos);
  }
}
