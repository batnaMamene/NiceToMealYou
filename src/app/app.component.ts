import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  menuOpened : boolean = false;
  token: String = "";
  getToken: any;
  getRestos: boolean = false;

  constructor(private auth: AuthService, private dataService: DataService){
    auth.isAuthenticated().subscribe(authenticationState => {
      if(authenticationState) this.menuOpened = true;
      else  this.menuOpened = false;
    });
  }

  ngOnInit(){
    this.dataService.getAllRestaurants().subscribe(res => {
      this.dataService.getAllBars().subscribe(bar => {
        this.dataService.getAllHoraires().subscribe(hor => {
          this.dataService.getAllMetro().subscribe(met => {
            this.dataService.setData(bar,res,hor,met);
            this.getRestos = true;
          });
        });
      });
    });
  }
}
