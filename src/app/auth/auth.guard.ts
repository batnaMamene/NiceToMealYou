import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router){}
  canActivate(): Observable<boolean> {
      const authenticationObservable = this.authService.isAuthenticated();
      let stateToReturn: Subject<boolean> = new Subject<boolean>();
      authenticationObservable.subscribe((isLoggedIn:boolean) => {
        if (isLoggedIn){
          stateToReturn.next(true);
        } else {
          stateToReturn.next(false);
          this.router.navigate(['/login']);
        }
      });
      return stateToReturn;
  }
  
}
