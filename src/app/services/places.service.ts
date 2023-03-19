import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Horaires } from '../model/horaires';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor() {}

  isOpened(horaires: Horaires){
    const day = this.convertDayTimeToDay(new Date().getDay());
    const horaireOjd = horaires[day as keyof typeof horaires];

    if(horaireOjd.length === 4){
      let ouvertureMid = new Date();
      ouvertureMid.setHours(this.getHour(horaireOjd[0]));
      ouvertureMid.setMinutes(this.getMinute(horaireOjd[0]));

      let fermetureMid = new Date();
      fermetureMid.setHours(this.getHour(horaireOjd[1]));
      fermetureMid.setMinutes(this.getMinute(horaireOjd[1]));

      let ouvertureSoir = new Date();
      ouvertureSoir.setHours(this.getHour(horaireOjd[2]));
      ouvertureSoir.setMinutes(this.getMinute(horaireOjd[2]));

      let fermetureSoir = new Date();
      if(horaireOjd[3][0] === '0')  fermetureSoir.setDate(fermetureSoir.getDate() + 1);
      fermetureSoir.setHours(this.getHour(horaireOjd[3]));
      fermetureSoir.setMinutes(this.getMinute(horaireOjd[3]));

      if(ouvertureMid < new Date() && fermetureMid > new Date()){
        return true;
      } else if(ouvertureSoir < new Date() && fermetureSoir > new Date()){
        return true;
      } else{
        return false;
      }
    }

    else{
      let ouverture = new Date();
      ouverture.setHours(this.getHour(horaireOjd[0]));
      ouverture.setMinutes(this.getMinute(horaireOjd[0]));

      let fermeture = new Date();
      if(horaireOjd[1][0] === '0')  fermeture.setDate(fermeture.getDate() + 1);
      fermeture.setHours(this.getHour(horaireOjd[1]));
      fermeture.setMinutes(this.getMinute(horaireOjd[1]));

      if(ouverture < new Date() && fermeture > new Date()){
        return true;
      } else{
        return false;
      }
    }


  }

  getHour(dateInString: string){
    if(dateInString.length > 0){
      const hour = dateInString.substring(0,2);
      return Number(hour);
    }
    else return 0;
  }

  getMinute(dateInString: string){
    if(dateInString.length > 0){
      const minute = dateInString.substring(dateInString.length-2,dateInString.length);
      return Number(minute);
    }
    else return 0;
  }

  convertDayTimeToDay(dayTime: number){
    let day = "dimanche";
    if(dayTime === 1) day = "lundi";
    else if(dayTime === 2) day = "mardi";
    else if(dayTime === 3) day = "mercredi";
    else if(dayTime === 4) day = "jeudi";
    else if(dayTime === 5) day = "vendredi";
    else if(dayTime === 6) day = "samedi";

    return day;
  }
}
