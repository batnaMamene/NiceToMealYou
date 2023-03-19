import { Injectable } from '@angular/core';
import { AngularFireAuth }  from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { initializeApp } from "firebase/app";
import { Auth, getAuth, onAuthStateChanged, User, UserCredential } from "firebase/auth";
import { environment } from '../../environments/environment';
import { FirebaseApp } from '@angular/fire/app';



@Injectable({
  providedIn: 'root'
})

export class AuthService{

  user!: User | null;
  auth!: Auth;


  constructor(private fireauth: AngularFireAuth, private route: Router) {
    // Initialize Firebase
    const app: FirebaseApp = initializeApp(environment.firebaseConfig);


    // Initialize Firebase Authentication and get a reference to the service
    const auth: Auth = getAuth(app);
    this.auth = auth;
    onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        this.user = user;
      }
    });
  }

  isAuthenticated(){
    let toReturn: Subject<boolean> = new Subject<boolean>();
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this.user = user;
        toReturn.next(true);
      } else {
        toReturn.next(false);
      }
    });
    return toReturn.asObservable();
  }

  getUser(){
    return this.user;
  }

  verifyAdmin(user: User | null): boolean{
    if(user?.email === "antoine@gmail.com") return true;
    return false;
  }

  login(email: string, password: string){
    this.fireauth.signInWithEmailAndPassword(email,password).then((userCredential: firebase.default.auth.UserCredential) => {
      console.log(typeof userCredential.user);
      const user: firebase.default.User | null = userCredential.user;
      this.route.navigate(['/home']);
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  register(email: string, password: string){
    this.fireauth.createUserWithEmailAndPassword(email,password).then(() => {
      alert("Utilisateur ajouté avec succès");
      this.route.navigate(['/login']);
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
  }

  logout(){
    this.fireauth.signOut().then(() => {
      this.route.navigate(['/login']);
    }, err => {
      alert(err.message);
    })
  }


}
