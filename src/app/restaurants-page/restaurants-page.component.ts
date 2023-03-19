import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { Horaires } from '../model/horaires';
import { DataService } from '../services/data.service';
import { PlacesService } from '../services/places.service';

@Component({
  selector: 'app-restaurants-page',
  templateUrl: './restaurants-page.component.html',
  styleUrls: ['./restaurants-page.component.scss']
})
export class RestaurantsPageComponent implements OnInit {

  constructor(private data: DataService,
    private route: ActivatedRoute,
    private placeService: PlacesService, private changeDetectorRef: ChangeDetectorRef) { }
  restaurants: any;
  allRestaurants: any;
  allPlates: any[] = [];
  randomPosition: any[] = [];

  types:string[] = [];
  typesSelect:string[] = [];
  arrondissements: string[] = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"];
  lignes: string[] = ["1","2","3","3bis","4","5","6","7","7bis","8","9","10","11","12","13","14","A","B"];
  selectAll: boolean = false;
  station: string = "Aucun";
  openedOptions: string[] = ["Ouvert","Fermé"];

  radius: number = 0;
  strokeWidth: number = 1;
  titleFontSize: string = "";
  subtitleFontSize: string = "";

  @ViewChild('allType') allType: MatSelect | undefined;
  @ViewChild('allLigne') allLigne: MatSelect | undefined;
  @ViewChild('allArrondissement') allArrondissement: MatSelect | undefined;
  @ViewChild('opened') opened: MatSelect | undefined;



  ngOnInit(): void {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    if(windowHeight > windowWidth){
      this.radius = 20;
      this.titleFontSize = (windowWidth/30).toString();
      this.subtitleFontSize = (windowWidth/40).toString();  
      this.strokeWidth = 0.5
    } else{
      this.radius = 30;
      this.titleFontSize = (windowWidth/60).toString();
      this.subtitleFontSize = (windowWidth/100).toString();  
    }

    this.restaurants = [];
    this.types = [];
    this.restaurants = this.data.getRestaurants();
    this.restaurants.forEach((element:any) => {
      if(element.plat.length > 0){
        this.allPlates.push(element.plat);
      }
    });
    this.setRandomPosition();
    this.typesSelect = [];
    this.restaurants.forEach((element: {horaires: Horaires;isOpened: boolean; type: string;}) => {
      let push = true;
      this.types.forEach(type => {
        if(type === element.type) push = false;
      });
      if(push)  this.types.push(element.type);
      element.isOpened = this.placeService.isOpened(element.horaires);
    });
    this.allRestaurants = this.restaurants.slice();
    this.setLignes();
  }

  setRandomPosition(){
    this.allPlates.forEach((element:any) => {
      this.randomPosition.push(Math.floor(Math.random() * 100));
    });
  }

  setLignes(){
    const metros = this.data.getMetro();
    this.restaurants.forEach((element: { stations: any[]; lignes: Map<any, any>; allLignes: any[]; }) => {
      let lignes = new Map();
      metros.forEach((metro: any) => {
        metro.Stations.forEach((station: any) => {
          element.stations.forEach((sta: any) => {
            if(station === sta) lignes.set(metro.ligne,sta);
          });
        });
      });
      element.lignes = lignes;
      element.allLignes = Array.from(lignes.keys()).filter((item,index) => Array.from(lignes.keys()).indexOf(item) === index);
    });
  }

  ngAfterViewChecked(){
    this.route.paramMap.subscribe(params => {
      const type = params.get('type')!;
      this.typesSelect.push(type);
      this.sort();
    });
    this.changeDetectorRef.detectChanges();
  }

  toggleAllType() {
    if(this.allType != null){
      if (!this.selectAll) {
        this.allType.options.forEach(element => element.select());
      } else {
        this.allType.options.forEach(element => element.deselect());
      }
    }
    this.selectAll = !this.selectAll;
  }

  toggleAllLigne() {
    if(this.allLigne != null){
      if (!this.selectAll) {
        this.allLigne.options.forEach(element => element.select());
      } else {
        this.allLigne.options.forEach(element => element.deselect());
      }
    }
    this.selectAll = !this.selectAll;
  }

  toggleAllArrondissement() {
    if(this.allArrondissement != null){
      if (!this.selectAll) {
        this.allArrondissement.options.forEach(element => element.select());
      } else {
        this.allArrondissement.options.forEach(element => element.deselect());
      }
    }
    this.selectAll = !this.selectAll;
  }

  sort(){
    this.restaurants = this.allRestaurants.slice();

    let arr: any[] = [];
    let types: any[] = [];
    let lignes: any[] = [];
    let op: any[] = [];

    this.allLigne?.options.forEach(element => {
      if(element.value !== "0" && element.selected){
        lignes.push(element.value);
      }
    })
    this.allArrondissement?.options.forEach(element => {
      if(element.value !== "0" && element.selected){
        arr.push(element.value);
      }
    });

    this.allType?.options.forEach(element => {
      if(element.value !== "0" && element.selected){
        types.push(element.value);
      }
    });

    this.opened?.options.forEach(element => {
      if(element.value !== "0" && element.selected){
        op.push(element.value);
      }
    });
    if(op.length == 0)  op = ["Ouvert","Fermé"];

    let idxToSuppress: any[] = [];
    this.restaurants.forEach((element: {
      isOpened: any;
      lignes: any; arrondissement: any; type: any; },index: any) => {
      let pushArr = false;
      let pushType = false;
      let pushLine = false;
      let pushOp = false;
      if(arr.length === 0)  pushArr = true;
      if(types.length === 0)  pushType = true;
      if(lignes.length === 0) pushLine = true;
      if(op.length === 0) pushLine = true;
      arr.forEach(a => {
        if(element.arrondissement === a)  pushArr = true;
      });
      types.forEach(t => {
        if(element.type === t)  pushType = true;
      });
      lignes.forEach(l => {
        element.lignes.forEach((sta: string,lig: string) => {
          if(lig === l) pushLine = true;
        });
      });
      op.forEach(o => {
        let bool = true;
        if(o === "Fermé") bool = false;
        if(element.isOpened === bool) pushOp = true;
      });
      if(!pushLine || !pushArr || !pushType || !pushOp) idxToSuppress.push(index);
    });

    idxToSuppress.forEach((idx,index) => {
      this.restaurants.splice(idx-index,1);
    });
  }

  sortByOrder(){
    this.allRestaurants.sort(this.compareOrder);
    this.sort();
  }

  comparePriority(a: {note: any; priority: number;},b: {note: any; priority: number;}){
    let comparison = 0;
    if(a.note === '' && b.note === ''){
      if(a.priority > b.priority) comparison = -1;
      else  comparison = 1;
      return comparison;
    }
    return comparison;
  }

  compareNote(a: { note: number; },b: { note: number; }){
    let comparison = 0;
    if(a.note > b.note) comparison = -1;
    else  comparison = 1;

    return comparison;
  }

  compareOrder(a: { name: String; },b: { name: String; }){
    let comparison = 0;
    if(a.name.toUpperCase() > b.name.toUpperCase()) comparison = 1;
    else  comparison = -1;

    return comparison;
  }

  sortByNote(){
    this.allRestaurants.sort(this.compareNote);
    this.allRestaurants.sort(this.comparePriority);
    this.sort();
  }

  changeToolTip(ligne: any,restaurant: any){
    if(restaurant.lignes.get(ligne) != undefined)  this.station = restaurant.lignes.get(ligne)!;
    else this.station = "Aucun";
  }

}
