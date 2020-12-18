import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { AngularFireStorage } from "@angular/fire/storage";
import { path } from "../constants/path";
import { User } from "../types/User";
import { Location } from "../types/Location";

@Injectable({
  providedIn: "root",
})
export class FirebaseService {
  constructor(
    private fireDatabase: AngularFireDatabase,
    private fireStorage: AngularFireStorage
  ) {}

  getRef(path): AngularFireList<any> {
    return this.fireDatabase.list(path);
  }

  pushUser(uid, value) {
    const userRef = this.getRef(path.users);
    userRef.set(uid, value);
  }

  getAllUser() {
    const userRef = this.getRef(path.users);
    return userRef;
  }

  getUserDetails(uid) {
    const userRef = this.getRef(path.users + `/${uid}`);
    return userRef;
  } 

  pushLocation(uid, value) {
    const locationRef = this.getRef(path.locations);
    locationRef.set(uid, value);
  }

  getUserLocation(uid): AngularFireList<Location> {
    const locationRef = this.getRef(path.locations + `/${uid}`);
    return locationRef;
  }

  updateLocation(uid, value) {
    const locationRef = this.getRef(path.locations);
    locationRef.update(uid, value);
  }

  getFriends(uid) {
    const friendRef = this.getRef(path.friends + `/${uid}`);
    return friendRef;
  }

  addFriend(uid, f_uid, friend) {
    const friendRef = this.getRef(path.friends + `/${uid}`);
    friendRef.set(f_uid, friend);
  }

  deleteFriend(uid, f_uid) {
    const friendRef = this.getRef(path.friends + `/${uid}`);
    friendRef.remove(f_uid);
  }

  uploadImage(uid, photo) {
    const file = this.dataURLtoFile(photo, "file");
    console.log("file:", file);
    const storageRef = this.fireStorage.storage.ref();
    const fileRef = storageRef.child(`profile/${uid}.jpg`);

    fileRef.put(file).then(() => {
      fileRef.getDownloadURL().then((url) => {
        const userRef = this.getRef("/users");
        userRef.update(uid, { imageUrl: url });
      });
    });
  }

  dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
}
