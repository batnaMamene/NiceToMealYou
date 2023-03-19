import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { DataService } from '../services/data.service';
import { StorageService } from '../services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { EditComponent } from '../edit/edit.component';
import { AuthService } from '../services/auth.service';
import { PlacesService } from '../services/places.service';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';


@Component({
  selector: 'app-showed',
  templateUrl: './showed.component.html',
  styleUrls: ['./showed.component.scss']
})
export class ShowedComponent implements OnInit, OnDestroy {

  place: any = {};
  allPlaces: any[] = [];
  similarPlaces : any[] = [];
  sameMetro: any[] = [];
  sameArrondissement: any[] = [];

  positionResult : number = 0;
  positionMetro : number = 0;
  positionArrondissement : number = 0;

  user!: User | null;
  colorNote: string = "";
  percent: number = 0;
  horaires: string = "";

  isOpened: boolean = false;
  openUntil: string | null = "";
  metros: any[] = [];
  lignes: Map<string,string> = new Map<string,string>();
  allLignes: string[] = [];
  station: string = "Aucun";
  urlArrondissement: string = "";
  darkenMetroBackground: boolean = false;
  darkenArrondissementBackground: boolean = true;
  colorArrondissementTitle: string = "#ffffff";
  colorMetroTitle: string = "#ffffff";

  radius: number = 0;
  bigRadius: number = 0;
  strokeWidth: number = 1;
  titleFontSize: string = "";
  subtitleFontSize: string = "";
  bigTitleFontSize: string = "";
  bigSubtitleFontSize: string = "";
  randomPosition: any[] = [];
  randomAnimation: any[] = [];

  constructor(
    private storageService: StorageService, 
    private dataService: DataService,
    private route: ActivatedRoute,
    private dialogRef: MatDialog,
    private authService: AuthService,
    private placeService: PlacesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    if(windowHeight > windowWidth){
      this.bigRadius = 50;
      this.radius = 15;
      this.bigTitleFontSize = (windowWidth/15).toString();
      this.bigSubtitleFontSize = (windowWidth/25).toString();  
      this.titleFontSize = (windowWidth/45).toString();
      this.subtitleFontSize = (windowWidth/60).toString();  
      this.strokeWidth = 0.5
    } else{
      this.bigRadius = 70;
      this.radius = 25;
      this.bigTitleFontSize = (windowWidth/25).toString();
      this.bigSubtitleFontSize = (windowWidth/50).toString();
      this.titleFontSize = (windowWidth/60).toString();
      this.subtitleFontSize = (windowWidth/100).toString();  
    }

    this.similarPlaces = [];
    this.allPlaces = [];
    this.allLignes = [];
    this.lignes = new Map<string,string>();
    this.metros = this.dataService.getMetro();
    if(this.allPlaces.length === 0){
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        this.allPlaces = this.dataService.getRestaurants();
        this.place = this.allPlaces.find(element => element.id === id);
        if(this.place == null){
          this.allPlaces = this.dataService.getBars();
          this.place = this.allPlaces.find(element => element.id === id);
        }
        this.urlArrondissement = "assets/arrondissement_" + this.place.arrondissement +".jpg";
        this.setHoraires();
        this.setColorNote(Number(this.place.note));
        if(this.place.tested) this.percent = Number(this.place.note) * 10;
        else this.percent = this.place.priority * 20;
        this.isOpened = this.placeService.isOpened(this.place.horaires);
        this.allPlaces.forEach(element => {
          if(element.type === this.place.type && element.id !== this.place.id)  this.similarPlaces.push(element);
          if(element.arrondissement === this.place.arrondissement && element.id !== this.place.id)  this.sameArrondissement.push(element);
          let push = false;
          element.stations.forEach((station: string) => {
            if(station === this.place.station && element.id !== this.place.id)  push === true;
          });
          if(push)  this.sameMetro.push(element);
        });
        this.setRandomPosition();
        this.storageService.setSession(this.storageService.keys.PLACEDETAILS,this.place.id);
      });

      if(this.similarPlaces.length === 0){
        this.darkenMetroBackground = true;
        this.darkenArrondissementBackground = true;
        if(this.sameMetro.length !== 0) this.darkenArrondissementBackground = false;
      } else{
        if(this.sameMetro.length === 0) this.darkenArrondissementBackground = false;
      }

      if(this.darkenArrondissementBackground) this.colorArrondissementTitle = "000";
      if(this.darkenMetroBackground)  this.colorMetroTitle = "000";
    }
    this.user = this.authService.getUser();
  }


  changeToolTip(ligne: any,restaurant: any){
    if(restaurant.lignes.get(ligne) != undefined)  this.station = restaurant.lignes.get(ligne)!;
    else this.station = "Aucun";
  }

  setHoraires(){
    const day = this.placeService.convertDayTimeToDay(new Date().getDay());
    this.horaires = this.place.horaires[day as keyof typeof this.place.horaires];
  }

  setColorNote(note: Number){
    if(note >= 8) this.colorNote = "#38761D";
    else if(note < 8 && note >= 7) this.colorNote = "black";
    else if(note < 7 && note >= 5.5) this.colorNote = "#eba75f";
    else if(note < 5.5) this.colorNote = "#9a0000";
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem(this.storageService.keys.PLACEDETAILS);
  }

  scrollRight(element: string) {
    let nbElement = 0;
    let position = 0;
    if(element === "results"){
      nbElement = this.similarPlaces.length;
      position = this.positionResult; 
    }
    else if(element === "metro"){
      nbElement = this.sameMetro.length;
      position = this.positionMetro;
    }
    else if(element === "arrondissement"){
      nbElement = this.sameArrondissement.length;
      position = this.positionArrondissement;
    }
    const results = document.getElementById(element);
    if(results){
      const distance = Math.trunc(results.scrollWidth/nbElement);
      if(position + 2*distance <= results.scrollWidth){
        position += distance;
        results.scrollBy({
          left: distance,
          behavior: 'smooth'        
        });
      }
    }
    if(element === "results"){
      this.positionResult = position; 
    }
    else if(element === "metro"){
      this.positionMetro = position;
    }
    else if(element === "arrondissement"){
      this.positionArrondissement = position;
    }
  }

  scrollLeft(element: string) {
    let nbElement = 0;
    let position = 0;
    if(element === "results"){
      nbElement = this.similarPlaces.length;
      position = this.positionResult; 
    }
    else if(element === "metro"){
      nbElement = this.sameMetro.length;
      position = this.positionMetro;
    }
    else if(element === "arrondissement"){
      nbElement = this.sameArrondissement.length;
      position = this.positionArrondissement;
    }    const results = document.getElementById(element);
    if(results){
      const distance = Math.trunc(results.scrollWidth/nbElement);
      if(position - distance >= 0){
        position -= distance;
        results.scrollBy({
          left: -distance,
          behavior: 'smooth'
        });
      }
    }
    if(element === "results"){
      this.positionResult = position; 
    }
    else if(element === "metro"){
      this.positionMetro = position;
    }
    else if(element === "arrondissement"){
      this.positionArrondissement = position;
    }
  }

  editPlace(){
    this.dialogRef.open(EditComponent, {
      height: '50%',
      width: '50%',
      data : this.place
    });
  }

  setRandomPosition(){
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    if(windowHeight > windowWidth){
      this.place.allLignes.forEach((element:any) => {
        let itsOkay: boolean = true;
        let top = 0;
        let left = 0;
        let x = 0;
        let y = 0;
        do{
          itsOkay = true;
          left = Math.floor(Math.random() * (70 - 40)) + 40;
          top = Math.floor(Math.random() * (30 - 3)) + 3;
          x = Math.floor(Math.random() * (3 - (-3))) + (-3);
          y = Math.floor(Math.random() * (3 - (-3))) + (-3);
          this.randomPosition.forEach((e: any) => {
            if((e.left - 21 < left && left < e.left + 21) && (e.top - 3 < top && top < e.top + 3)) itsOkay = false;
          });
        }while(!itsOkay)
        this.randomPosition.push({
          left: left,
          top: top
        });
        this.randomAnimation.push({
          x: x,
          y: y
        })
      });
    } else{
      this.place.allLignes.forEach((element:any) => {
        let itsOkay: boolean = true;
        let top = 0;
        let left = 0;
        let x = 0;
        let y = 0;
        do{
          itsOkay = true;
          left = Math.floor(Math.random() * (80 - 40)) + 40;
          top = Math.floor(Math.random() * (30 - 3)) + 3;
          x = Math.floor(Math.random() * (3 - (-3))) + (-3);
          y = Math.floor(Math.random() * (3 - (-3))) + (-3);
          this.randomPosition.forEach((e: any) => {
            if((e.left - 18 < left && left < e.left + 18) && (e.top - 9 < top && top < e.top + 9)) itsOkay = false;
          });
        }while(!itsOkay)
        this.randomPosition.push({
          left: left,
          top: top
        });
        this.randomAnimation.push({
          x: x,
          y: y
        })
      });
    }
    
  }
  
  reload(restaurant: any){
    this.similarPlaces = [];
    this.allPlaces = [];
    this.allLignes = [];
    this.lignes = new Map<string,string>();
    this.router.navigate([`/showed/${restaurant.id}`]);
  }

  openMaps(){
    const url = "https://www.google.com/maps/search/?api=1&query=" + encodeURI(this.place.address + ", Paris");
    console.log(url)
    window.open(url);
  }

  cast(value: unknown){
    let toReturn = value as string;
    return toReturn;
  }

}
