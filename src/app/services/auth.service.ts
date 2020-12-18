import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthSignIn, AuthSignUp } from "../types/User";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  isLoggedIn: boolean = false;
  uid: string;
  email: string;
  constructor(private fireAuth: AngularFireAuth) {}

  getAuthState() {
    return this.isLoggedIn;
  }

  getUid() {
    return this.uid;
  }

  getEmail() {
    return this.email;
  }

  signUp(value: AuthSignIn) {
    const { email, password } = value;
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.createUserWithEmailAndPassword(email, password).then(
        (res) => resolve(res),
        (err) => reject(err)
      );
    });
  }

  signIn(value: AuthSignIn) {
    const { email, password } = value;
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.signInWithEmailAndPassword(email, password).then(
        (res) => {
          resolve(res),
            (this.isLoggedIn = true),
            (this.uid = res.user.uid),
            (this.email = res.user.email);
        },
        (err) => reject(err)
      );
    });
  }

  signOut() {
    return new Promise<any>((resolve, reject) => {
      if (this.fireAuth.currentUser) {
        this.fireAuth.signOut().then(
          (res) => {
            resolve(res),
              (this.isLoggedIn = false),
              (this.uid = ""),
              (this.email = "");
          },
          (err) => reject(err)
        );
      }
    });
  }
}
