import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SlowBuffer } from 'buffer';
import { elementAt, Observable, Subject } from 'rxjs';
import { Bar } from '../model/bar';
import { Horaires } from '../model/horaires';
import { Restaurant } from '../model/restaurant';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs: AngularFirestore) {}

  allBars: any;
  allRestaurants: any;
  allHoraires: any;
  allMetro: any;

  addRestaurant(restaurant: Restaurant, horaire: Horaires){
    const id = this.afs.createId();
    restaurant.id = id;
    horaire.id = id;
    this.afs.collection('/Restaurants').add(restaurant);
    this.afs.collection('/Horaires').add(horaire);
  }

  addBar(bar: Bar, horaire: Horaires){
    const id = this.afs.createId();
    bar.id = id;
    horaire.id = id;
    this.afs.collection('/Bars').add(bar);
    this.afs.collection('/Horaires').add(horaire);
  }

  private getAllHorairesDatabase(){
    return this.afs.collection('/Horaires').snapshotChanges();
  }

  getAllBars(): Observable<any>{
    let subject = new Subject<any>();
    let allBars: unknown[] = [];
    this.afs.collection('/Bars').snapshotChanges().subscribe(bar => {
      bar.forEach(e => {
        let toPush: any = e.payload.doc.data();
        if(toPush.img != null)  toPush.img = this.dataURItoBlob(toPush.img);
        const find = allBars.find((element: any) => element.id === toPush.id);
        if(find == null)  allBars.push(e.payload.doc.data());
      });
      subject.next(allBars);
    });
    return subject.asObservable();
  }

  deleteRestaurant(restaurant: Restaurant){
    return this.afs.doc('/Restaurants/'+restaurant.id).delete();
  }

  updateRestaurant(restaurant: Restaurant){
    this.afs.collection('/Restaurants').snapshotChanges().subscribe(res => {
      res.forEach(element => {
        const r: any = element.payload.doc.data();
        const id = r.id;
        if(id === restaurant.id)  this.afs.doc('/Restaurants/'+element.payload.doc.id).update(restaurant);
      });
    })
  }

  updateHoraire(horaires: Horaires){
    this.afs.collection('/Horaires').snapshotChanges().subscribe(hor => {
      hor.forEach(element => {
        const r: any = element.payload.doc.data();
        const id = r.id;
        if(id === horaires.id)  this.afs.doc('/Horaires/'+element.payload.doc.id).update(horaires);
      });
    });
  }

  getAllRestaurants(): Observable<any>{
    let subject = new Subject<any>();
    let allRestaurants: unknown[] = [];
    this.afs.collection('/Restaurants').snapshotChanges().subscribe(res => {
      res.forEach(e => {
        let toPush: any = e.payload.doc.data();
        toPush.img = this.dataURItoBlob(toPush.img);
        const find = allRestaurants.find((element: any) => element.id === toPush.id);
        if(find == null)  allRestaurants.push(e.payload.doc.data());
      });
      subject.next(allRestaurants);
    });
    return subject.asObservable();
  }

  getAllMetro(): Observable<any>{
    let subject = new Subject<any>();
    let allMetros: unknown[] = [];
    this.afs.collection('/Metro').snapshotChanges().subscribe(met => {
      met.forEach(e => {
        allMetros.push(e.payload.doc.data());
      });
    subject.next(allMetros);
    });
    return subject.asObservable();
  }

  getAllHoraires(): Observable<any>{
    let subject = new Subject<any>();
    let allHoraires: unknown[] = [];
    this.getAllHorairesDatabase().subscribe(hor => {
      hor.forEach(e => {
          allHoraires.push(e.payload.doc.data());
      });
      subject.next(allHoraires);
    });
    return subject.asObservable();
  }

  dataURItoBlob(dataURI: string) {
      let binary = dataURI.substring(22,dataURI.length);
      let array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
    return new Blob([new Uint8Array(array)], {
        type: 'image/jpg'
    });
  }

  setData(bar: undefined, restaurant: undefined,horaire: undefined, metro: undefined){
    this.allBars = bar;
    this.allRestaurants = restaurant;
    this.allHoraires = horaire;
    this.allMetro = metro;
  }

  getBars(){
    this.allBars.forEach((bar: {
      allLignes: any[];
      lignes: Map<any, any>;
      stations: any;ambiance: string;typeIcon: string;typeFacade: string;horaires: { id: any; }; id: any;
    }) => {
      const horaires = this.allHoraires.find((element: { id: any; }) => element.id === bar.id);
      bar.horaires = horaires;
      let lignes = new Map();
      let allLignes: any[] = [];
      if(bar.stations != null){
        bar.stations.forEach((station: any) => {
          this.allMetro.forEach((metro: { Stations: any[]; ligne: any; }) => {
            const sta = metro.Stations.find((element: any) => element === station);
            if(sta != null){
              lignes.set(metro.ligne,sta);
              allLignes.push(metro.ligne);
            }
          });
        });
      }
      bar.lignes = lignes;
      bar.allLignes = allLignes.filter((item,index) => allLignes.indexOf(item) === index);;
      if(bar.ambiance === "Café"){
        bar.typeIcon = "cafe.jpg";
        bar.typeFacade = "../../assets/cafe_facade.jpg";
      }
      else if(bar.ambiance === "Coworking"){
        bar.typeIcon = "coworking.jpg";
        bar.typeFacade = "../../assets/coworking_facade.jpg";
      }
      else if(bar.ambiance === "Cocktails"){
        bar.typeIcon = "cocktails.jpg";
        bar.typeFacade = "../../assets/cocktails_facade.jpg";
      }
      else if(bar.ambiance === "Kebab"){
        bar.typeIcon = "kebab.png";
        bar.typeFacade = "../../assets/kebab_facade.jpg";
      }
      else if(bar.ambiance === "Gastronomique"){
        bar.typeIcon = "gastronomique.png";
        bar.typeFacade = "../../assets/gastronomique_facade.jpg";
      }
      else if(bar.ambiance === "American Sandwich"){
        bar.typeIcon = "american_sandwich_icon.png";
        bar.typeFacade = "../../assets/american_sandwich_facade.jpg";
      }
      else if(bar.ambiance === "Banh mi"){
        bar.typeIcon = "banh_mi.jpg";
        bar.typeFacade = "../../assets/banh_mi_facade.jpg";
      }
      else if(bar.ambiance === "Glace"){
        bar.typeIcon = "glace.jpg";
        bar.typeFacade = "../../assets/glace_facade.jpg";
      }
      else if(bar.ambiance === "Asiatique"){
        bar.typeIcon = "asian.png";
        bar.typeFacade = "../../assets/asian_facade.jpg";
      }
      else if(bar.ambiance === "Ramen"){
        bar.typeIcon = "ramen.jpg";
        bar.typeFacade = "../../assets/ramen_facade.jpg";
      }
      else if(bar.ambiance === "Bistrot"){
        bar.typeIcon = "bistrot.jpg";
        bar.typeFacade = "../../assets/bistrot_facade.jpg";
      }
      else if(bar.ambiance === "Autre"){
        bar.typeIcon = "autre.png";
        bar.typeFacade = "../../assets/autre_facade.jpg";
      }
      else if(bar.ambiance === "Pizza"){
        bar.typeIcon = "pizza.jpg";
        bar.typeFacade = "../../assets/pizza_facade.jpg";
      }
      else if(bar.ambiance === "Brunch"){
        bar.typeIcon = "brunch.jpg";
        bar.typeFacade = "../../assets/brunch_facade.jpg";
      }
      else if(bar.ambiance === "Indien"){
        bar.typeIcon = "indian.jpg";
        bar.typeFacade = "../../assets/indian_facade.jpg";
      }
      else if(bar.ambiance === "Soul"){
        bar.typeIcon = "soul.jpg";
        bar.typeFacade = "../../assets/soul_facade.jpg";
      }
      else if(bar.ambiance === "Savoyard"){
        bar.typeIcon = "savoyard_icon.png";
        bar.typeFacade = "../../assets/savoyard_facade.jpg";
      }
      else if(bar.ambiance === "Japonais"){
        bar.typeIcon = "japonais.png";
        bar.typeFacade = "../../assets/japonais_facade.jpg";
      }
    });

    return this.allBars;
  }

  getRestaurants(){
    this.allRestaurants.forEach((restaurant: {
      allLignes: any[];
      lignes: Map<any, any>;
      stations: any;type: string;typeIcon: string;typeFacade: string;horaires: { id: any; }; id: any;
    }) => {
      const horaires = this.allHoraires.find((element: { id: any; }) => element.id === restaurant.id);
      restaurant.horaires = horaires;
      let lignes = new Map();
      let allLignes: any[] = [];
      restaurant.stations.forEach((station: any) => {
        this.allMetro.forEach((metro: { Stations: any[]; ligne: any; }) => {
          const sta = metro.Stations.find((element: any) => element === station);
          if(sta != null){
            lignes.set(metro.ligne,sta);
            allLignes.push(metro.ligne);
          }
        });
      });
      restaurant.lignes = lignes;
      restaurant.allLignes = allLignes.filter((item,index) => allLignes.indexOf(item) === index);;
      if(restaurant.type === "Burger"){
        restaurant.typeIcon = "burger.jpg";
        restaurant.typeFacade = "../../assets/burger_facade.jpg";
      }
      else if(restaurant.type === "Pâtes"){
        restaurant.typeIcon = "pate.jpg";
        restaurant.typeFacade = "../../assets/pate_facade.jpg";
      }
      else if(restaurant.type === "Sushi"){
        restaurant.typeIcon = "sushi.png";
        restaurant.typeFacade = "../../assets/sushi_facade.jpg";
      }
      else if(restaurant.type === "Kebab"){
        restaurant.typeIcon = "kebab.png";
        restaurant.typeFacade = "../../assets/kebab_facade.jpg";
      }
      else if(restaurant.type === "Gastronomique"){
        restaurant.typeIcon = "gastronomique.png";
        restaurant.typeFacade = "../../assets/gastronomique_facade.jpg";
      }
      else if(restaurant.type === "American Sandwich"){
        restaurant.typeIcon = "american_sandwich_icon.png";
        restaurant.typeFacade = "../../assets/american_sandwich_facade.jpg";
      }
      else if(restaurant.type === "Banh mi"){
        restaurant.typeIcon = "banh_mi.jpg";
        restaurant.typeFacade = "../../assets/banh_mi_facade.jpg";
      }
      else if(restaurant.type === "Glace"){
        restaurant.typeIcon = "glace.jpg";
        restaurant.typeFacade = "../../assets/glace_facade.jpg";
      }
      else if(restaurant.type === "Asiatique"){
        restaurant.typeIcon = "asian.png";
        restaurant.typeFacade = "../../assets/asian_facade.jpg";
      }
      else if(restaurant.type === "Ramen"){
        restaurant.typeIcon = "ramen.jpg";
        restaurant.typeFacade = "../../assets/ramen_facade.jpg";
      }
      else if(restaurant.type === "Bistrot"){
        restaurant.typeIcon = "bistrot.jpg";
        restaurant.typeFacade = "../../assets/bistrot_facade.jpg";
      }
      else if(restaurant.type === "Autre"){
        restaurant.typeIcon = "autre.png";
        restaurant.typeFacade = "../../assets/autre_facade.jpg";
      }
      else if(restaurant.type === "Pizza"){
        restaurant.typeIcon = "pizza.jpg";
        restaurant.typeFacade = "../../assets/pizza_facade.jpg";
      }
      else if(restaurant.type === "Brunch"){
        restaurant.typeIcon = "brunch.jpg";
        restaurant.typeFacade = "../../assets/brunch_facade.jpg";
      }
      else if(restaurant.type === "Indien"){
        restaurant.typeIcon = "indian.jpg";
        restaurant.typeFacade = "../../assets/indian_facade.jpg";
      }
      else if(restaurant.type === "Soul"){
        restaurant.typeIcon = "soul.jpg";
        restaurant.typeFacade = "../../assets/soul_facade.jpg";
      }
      else if(restaurant.type === "Savoyard"){
        restaurant.typeIcon = "savoyard_icon.png";
        restaurant.typeFacade = "../../assets/savoyard_facade.jpg";
      }
      else if(restaurant.type === "Japonais"){
        restaurant.typeIcon = "japonais.png";
        restaurant.typeFacade = "../../assets/japonais_facade.jpg";
      }
      else if(restaurant.type === "Caribéen"){
        restaurant.typeIcon = "caribean.png";
        restaurant.typeFacade = "../../assets/caribean_facade.jpg";
      }
      else if(restaurant.type === "Coréen"){
        restaurant.typeIcon = "coree.jpg";
        restaurant.typeFacade = "../../assets/coree_facade.jpg";
      }
      else if(restaurant.type === "Chinois"){
        restaurant.typeIcon = "chinois.jpg";
        restaurant.typeFacade = "../../assets/chinois_facade.jpg";
      }
      else if(restaurant.type === "Vegan"){
        restaurant.typeIcon = "vegan.jpg";
        restaurant.typeFacade = "../../assets/vegan_facade.jpg";
      }
    });
    return this.allRestaurants;
  }
  getHoraires(){return this.allHoraires;}
  getMetro(){return this.allMetro;}
}
