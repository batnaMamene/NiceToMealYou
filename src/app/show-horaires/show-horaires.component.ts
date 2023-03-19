import { Component, Input, OnInit } from '@angular/core';
import { Horaires } from '../model/horaires';

@Component({
  selector: 'show-horaires',
  templateUrl: './show-horaires.component.html',
  styleUrls: ['./show-horaires.component.scss']
})
export class ShowHorairesComponent implements OnInit {

  @Input() horaires!: Horaires;
  @Input() color: string = "";
  constructor() { }
  horairesTab: any[] = [{},{},{},{},{},{},{}];

  ngOnInit(): void {
    const properties = Object.getOwnPropertyNames(this.horaires);
    properties.forEach((element:string) => {
      if(element !== "id"){
        const prop = element.charAt(0).toUpperCase() + element.substring(1) ;
        const obj = {
          day: prop,
          horaires: (this.horaires as any)[element],
        }
        switch(element){
          case "lundi": this.horairesTab[0] = obj;
          break;
          case "mardi": this.horairesTab[1] = obj;
          break;
          case "mercredi": this.horairesTab[2] = obj;
          break;
          case "jeudi": this.horairesTab[3] = obj;
          break;
          case "vendredi": this.horairesTab[4] = obj;
          break;
          case "samedi": this.horairesTab[5] = obj;
          break;
          case "dimanche": this.horairesTab[6] = obj;
          break;
        }
        
      }
    });

  }

}
