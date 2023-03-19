import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('openCloseDiv', [
      state('hidden', style({
        opacity: '0',
        width:"0%"
      })),
      state('hiddenFast', style({
        opacity: '1',
        width:"100%"
      })),
      state('showed', style({
        width:"100%",
        opacity: '1'
      })),
      transition('* => showed', [
        animate('1s ease-in')
      ]),
      transition('* => hidden', [
        animate('1s ease-in')
      ]),
      transition('* => hiddenFast', [
        animate('0s')
      ]),
    ]),
    trigger('openCloseResult', [
      state('hidden', style({
        opacity: '0',
        transform: 'scaleX(0)',
        width:"0%",
        height:"100%",
      })),
      state('half-showed', style({
        width:"80%",
        height:"100%",
        opacity: '1'
      })),
      state('showed', style({
        transform: 'scaleX(1)',
        opacity: '1'
      })),
      transition('* => showed', [
        animate('1s ease-in')
      ]),
      transition('* => hidden', [
        animate('1s ease-in')
      ]),
      transition('* => half-showed', [
        animate('1s ease-in')
      ]),
    ]),
    trigger('showTitle', [
      state('show', style({
        opacity: '1'
      })),
      transition('* => show', [
        animate('2s ease')
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService,
    private data: DataService, 
  ) {}

  user!: User |null;
  searchTerm: string = "";
  allPlaces: any[] = [];
  best: any[] = [];
  priority: any[] = [];
  bestBar: any[] = [];
  priorityBar: any[] = [];

  titleFontSize: string = "";
  subtitleFontSize: string = "";
  radius: number = 0;
  strokeWidth: number = 1;

  dataSource = new MatTableDataSource<any>();
  filteredData : any[] = [];
  position : number = 0;
  station: string = "Aucun";
  animationFilterDiv: string = "hidden";
  animationFilterResult: string = "hidden";
  enable: boolean = true;


  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren('title')  title!: any;
  titlesAnimation: string[] = ['','','',''];
  allPlates: any[] = [];
  randomPosition: any[] = [];


  ngOnInit(): void {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    if(windowHeight > windowWidth){
      this.radius = 15;
      this.titleFontSize = (windowWidth/35).toString();
      this.subtitleFontSize = (windowWidth/45).toString();  
      this.strokeWidth = 0.5
    } else{
      this.radius = 30;
      this.titleFontSize = (windowWidth/60).toString();
      this.subtitleFontSize = (windowWidth/100).toString();  
    }

    this.allPlaces = [];
    this.data.getRestaurants().forEach((element:any) => {
      this.allPlaces.push(element);
      if(element.plat.length > 0){
        this.allPlates.push(element.plat);
      }
    });
    this.setRandomPosition();

    this.data.getBars().forEach((element:any) => {
      this.allPlaces.push(element);
    });
    this.setBest();
    this.setPriority();
    this.setBestBar();
    this.setPriorityBar();
    this.dataSource = new MatTableDataSource<any>(this.allPlaces);
    this.user = this.authService.getUser();
    this.dataSource.filterPredicate = function customFilter(data , filter:string ): boolean {
      return (data.name.trim().toLocaleLowerCase().startsWith(filter));
    }
  }

  
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.setAnimation();
  }

  setAnimation(): void {
      if(this.title != null){
        window.addEventListener("scroll", (event)=>{
          let positionBotton = window.pageYOffset + window.innerHeight;
          this.title.forEach((element:any) => {
            let index = 0;
            switch(element.nativeElement.id){
              case 'title1': index = 0;
              break;
              case 'title2': index = 1;
              break;
              case 'title3': index = 2;
              break;
              case 'title4': index = 3;
              break;
            }
            if(positionBotton > element.nativeElement.offsetTop + window.innerHeight * 0.07){
              this.titlesAnimation[index] = "show";
            }
          });
        });
      }    
  }

  setRandomPosition(){
    this.allPlates.forEach((element:any) => {
      this.randomPosition.push(Math.floor(Math.random() * 100));
    });
  }

  setBestBar(){
    this.bestBar = this.data.getBars().slice();

    this.bestBar.sort((a, b) => {
      if(Number(a.note) > Number(b.note)) return -1;
      else return 1;
    });

    if(this.bestBar.length > 5) this.bestBar.splice(5,this.bestBar.length-5);

    const bestBarCopy = this.bestBar.slice();

    bestBarCopy.forEach((element:any) => {
      this.bestBar.push(element);
    });
  }

  setPriorityBar(){
    this.priorityBar = this.data.getBars().slice();

    this.priorityBar.sort((a, b) => {
      if(Number(a.priority) > Number(b.priority)) return -1;
      else return 1;
    });

    if(this.priorityBar.length > 5) this.priorityBar.splice(5, this.priorityBar.length-5);

    const priorityBarCopy = this.priorityBar.slice();

    priorityBarCopy.forEach((element:any) => {
      this.priorityBar.push(element);
    });
  }

  setBest(){
    this.best = this.data.getRestaurants().slice();

    this.best.sort((a, b) => {
      if(Number(a.note) > Number(b.note)) return -1;
      else return 1;
    });

    this.best.splice(5,this.best.length-5);

    const bestCopy = this.best.slice();

    bestCopy.forEach((element:any) => {
      this.best.push(element);
    });
  }

  setPriority(){
    this.priority = this.data.getRestaurants().slice();

    this.priority.sort((a, b) => {
      if(Number(a.priority) > Number(b.priority)) return -1;
      else return 1;
    });

    this.priority.splice(5, this.priority.length-5);

    const priorityCopy = this.priority.slice();

    priorityCopy.forEach((element:any) => {
      this.priority.push(element);
    });
  }

  filter(searchTerm: string) {
    this.enable = false;
    this.position = 0;
    const results = document.getElementById('results')!;
    results.scrollBy({
      left: -results.scrollWidth
    });
    this.animationFilterResult = "hidden";
    const beforeLength = this.filteredData.slice().length;
    this.dataSource.filter = searchTerm.trim().toLocaleLowerCase();
    const filterValue = searchTerm;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    const afterLength = this.dataSource.filteredData.length;

    if(beforeLength >= 1){
      setTimeout(() => {
        this.filteredData = this.dataSource.filteredData;

        if(afterLength >= 2) this.animationFilterResult = "showed";
        else if(afterLength === 1){
          this.filteredData = this.dataSource.filteredData;
          this.animationFilterResult = "half-showed";
        }
        else{
          this.animationFilterDiv = "hidden";
        }
        this.enable = true;
      }, 1000)
    }
    else{
      if(afterLength === 1){
        this.animationFilterDiv = "hiddenFast";
        setTimeout(() => {
          this.filteredData = this.dataSource.filteredData;
          this.animationFilterResult = "half-showed";
          this.enable = true;
        },100)
      }

      else if(afterLength >= 2){
        this.animationFilterDiv = "hiddenFast";
        this.filteredData = this.dataSource.filteredData;
        this.animationFilterDiv = "showed";
        this.animationFilterResult = "showed";
        this.enable = true;
      }
      else {
        this.filteredData = this.dataSource.filteredData;
        setTimeout(() => {
          this.animationFilterDiv = "hidden";
          this.enable = true;
        },1000);
      }
    }
  }

  onMatSortChange() {
    this.dataSource.sort = this.sort;
  }

  scrollRight(element: string) {
    let nbElement = 0;
    if(element === "bestCard" || element === "priorityCard")  nbElement = 5;
    else if(element === "results") nbElement = this.dataSource.data.length;
    const results = document.getElementById(element);
    if(results){
      const distance = Math.trunc(results.scrollWidth/nbElement);
      if(this.position + 2*distance <= results.scrollWidth){
        this.position += distance;
        results.scrollBy({
          left: distance,
          behavior: 'smooth'        
        });
      }
    }
  }

  scrollLeft(element: string) {
    let nbElement = 0;
    if(element === "bestCard" || element === "priorityCard")  nbElement = 5;
    else if(element === "results") nbElement = this.dataSource.data.length;
    const results = document.getElementById(element);
    if(results){
      const distance = Math.trunc(results.scrollWidth/nbElement);
      if(this.position - distance >= 0){
        this.position -= distance;
        results.scrollBy({
          left: -distance,
          behavior: 'smooth'
        });
      }
    }
  }

}
