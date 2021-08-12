import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  constructor(public auth: AngularFireAuth, private router: Router) {
    this.auth.authState.subscribe((user) => {
      this.user.next(user);
      if (user) {
        localStorage.uid = user.uid;
      } else {
        localStorage.removeItem('uid');
        router.navigate(['signin']);
      }
    });
  }

  signIn() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  signOut() {
    this.auth.signOut();
  }
}
