import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { Horaires } from '../model/horaires';
import { DataService } from '../services/data.service';
import { PlacesService } from '../services/places.service';

@Component({
  selector: 'app-bars-page',
  templateUrl: './bars-page.component.html',
  styleUrls: ['./bars-page.component.scss']
})
export class BarsPageComponent implements OnInit {

  constructor(private data: DataService,
    private route: ActivatedRoute,
    private placeService: PlacesService, private changeDetectorRef: ChangeDetectorRef) { }
  bars: any;
  allBars: any;
  ambiances:string[] = [];
  ambiancesSelect:string[] = [];
  arrondissements: string[] = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"];
  lignes: string[] = ["1","2","3","3bis","4","5","6","7","7bis","8","9","10","11","12","13","14","A","B"];
  selectAll: boolean = false;
  station: string = "Aucun";
  openedOptions: string[] = ["Ouvert","Fermé"];

  radius: number = 0;
  strokeWidth: number = 1;
  titleFontSize: string = "";
  subtitleFontSize: string = "";

  allCocktails: any[] = [];
  randomPosition: any[] = [];

  @ViewChild('allAmbiance') allAmbiance: MatSelect | undefined;
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

    this.bars = [];
    this.ambiances = [];
    this.bars = this.data.getBars();
    this.bars.forEach((element:any) => {
      element.cocktails.forEach((e:any) => {
        if(e.length > 0){
          this.allCocktails.push(e);
        }
      });
    });
    this.ambiancesSelect = [];
    this.bars.forEach((element: {horaires: Horaires;isOpened: boolean; ambiance: string;}) => {
      let push = true;
      this.ambiances.forEach(ambiance => {
        if(ambiance === element.ambiance) push = false;
      });
      if(push)  this.ambiances.push(element.ambiance);
      element.isOpened = this.placeService.isOpened(element.horaires);
    });
    this.allBars = this.bars.slice();
    this.setLignes();
  }

  setRandomPosition(){
    this.allCocktails.forEach((element:any) => {
      this.randomPosition.push(Math.floor(Math.random() * 100));
    });
  }

  setLignes(){
    const metros = this.data.getMetro();
    this.bars.forEach((element: { stations: any[]; lignes: Map<any, any>; allLignes: any[]; }) => {
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
      const ambiance = params.get('ambiance')!;
      this.ambiancesSelect.push(ambiance);
      this.sort();
    });
    this.changeDetectorRef.detectChanges();
  }

  toggleAllAmbiance() {
    if(this.allAmbiance != null){
      if (!this.selectAll) {
        this.allAmbiance.options.forEach(element => element.select());
      } else {
        this.allAmbiance.options.forEach(element => element.deselect());
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
    this.bars = this.allBars.slice();

    let arr: any[] = [];
    let ambiances: any[] = [];
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

    this.allAmbiance?.options.forEach(element => {
      if(element.value !== "0" && element.selected){
        ambiances.push(element.value);
      }
    });

    this.opened?.options.forEach(element => {
      if(element.value !== "0" && element.selected){
        op.push(element.value);
      }
    });
    if(op.length == 0)  op = ["Ouvert","Fermé"];

    let idxToSuppress: any[] = [];
    this.bars.forEach((element: {
      isOpened: any;
      lignes: any; arrondissement: any; type: any; },index: any) => {
      let pushArr = false;
      let pushAmbiance = false;
      let pushLine = false;
      let pushOp = false;
      if(arr.length === 0)  pushArr = true;
      if(ambiances.length === 0)  pushAmbiance = true;
      if(lignes.length === 0) pushLine = true;
      if(op.length === 0) pushLine = true;
      arr.forEach(a => {
        if(element.arrondissement === a)  pushArr = true;
      });
      ambiances.forEach(t => {
        if(element.type === t)  pushAmbiance = true;
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
      if(!pushLine || !pushArr || !pushAmbiance || !pushOp) idxToSuppress.push(index);
    });

    idxToSuppress.forEach((idx,index) => {
      this.bars.splice(idx-index,1);
    });
  }

  sortByOrder(){
    this.allBars.sort(this.compareOrder);
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
    this.allBars.sort(this.compareNote);
    this.allBars.sort(this.comparePriority);
    this.sort();
  }

  changeToolTip(ligne: any,restaurant: any){
    if(restaurant.lignes.get(ligne) != undefined)  this.station = restaurant.lignes.get(ligne)!;
    else this.station = "Aucun";
  }

}
