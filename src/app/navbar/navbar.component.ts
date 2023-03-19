import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { AddComponent } from '../add/add.component';
import { LogoutComponent } from '../logout/logout.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private route: Router,
    private dialogRef: MatDialog,
    private authService: AuthService
  ) {}

  user!: User | null;
  verifyAdmin: boolean = false;
  types: String[] = [];

  position : number = 0;
  test: boolean = true;

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.verifyAdmin = this.authService.verifyAdmin(this.user);
  }

  navigate(url: string){
    this.route.navigate([url]);
  }
  
  addPlace(){
    this.dialogRef.open(AddComponent);
  }

  deconnect(){
    this.dialogRef.open(LogoutComponent, {
      height: '50%',
      width: '50%'
    })
  }

}
