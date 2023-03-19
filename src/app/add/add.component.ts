import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Bar } from '../model/bar';
import { Horaires } from '../model/horaires';
import { Restaurant } from '../model/restaurant';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  isLinear = false;
  firstFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  secondFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  thirdFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  fourthFormGroup: UntypedFormGroup = new UntypedFormGroup({});


  options: string[] = ['Restaurant', 'Bar', 'Sortie'];

  filteredOptions: Observable<string[]> | undefined;

  facadeFile: String = "";
  facadeName: String = "Façade";
  platFile: String = "";
  platName: String = "Plat";

  metros: any[] = [];
  stations: string[] = [];
  searchTerm: string = "";
  dataSource = new MatTableDataSource<any>();
  filteredData : any[] = [];
  displayedColumns: string[] = ['station'];

  displayHoraire = {
    lundi: false,
    mardi: false,
    mercredi: false,
    jeudi: false,
    vendredi: false,
    samedi: false,
    dimanche: false,
  }
  tested: String[] = ["Oui", "Non"];
  testedValue: boolean = false;
  selected: string[] = [];

  constructor(private _formBuilder: UntypedFormBuilder,private dialogRef: MatDialogRef<AddComponent>, private data: DataService) { }

  ngOnInit() {
    this.metros = this.data.getMetro();
    let all: string[] = [];
    this.metros.forEach(element => {
      element.Stations.forEach((station: string) => {
        all.push(station);
      });
    });
    this.stations = all.filter((item,index) => all.indexOf(item) === index);
    this.dataSource = new MatTableDataSource<any>(this.stations);
    this.firstFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      place: ['', Validators.required],
      address: ['', Validators.required],
      arrondissement: ['', Validators.required],
      theFork: [''],
      type: ['', Validators.required],
      note: [''],
      price: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      img: [''],
      plat: [''],
      tested: ['', Validators.required],
      note_deco: [''],
      priority: [''],
      comment: [''],
      ambiance: [''],
    });
    this.thirdFormGroup = this._formBuilder.group({
      startMidLun: [''],
      endMidLun: [''],
      startSoirLun: [''],
      endSoirLun: [''],
      startMidMar: [''],
      endMidMar: [''],
      startSoirMar: [''],
      endSoirMar: [''],
      startMidMer: [''],
      endMidMer: [''],
      startSoirMer: [''],
      endSoirMer: [''],
      startMidJeu: [''],
      endMidJeu: [''],
      startSoirJeu: [''],
      endSoirJeu: [''],
      startMidVen: [''],
      endMidVen: [''],
      startSoirVen: [''],
      endSoirVen: [''],
      startMidSam: [''],
      endMidSam: [''],
      startSoirSam: [''],
      endSoirSam: [''],
      startMidDim: [''],
      endMidDim: [''],
      startSoirDim: [''],
      endSoirDim: [''],
    });
    this.fourthFormGroup = this._formBuilder.group({
      firstPositif: [''],
      secondPositif: [''],
      thirdPositif: [''],
      fourthPositif: [''],
      fifthPositif: [''],
      sixthPositif: [''],
      seventhPositif: [''],
      eighthPositif: [''],
      firstNegatif: [''],
      secondNegatif: [''],
      thirdNegatif: [''],
      fourthNegatif: [''],
      fifthNegatif: [''],
      sixthNegatif: [''],
      seventhNegatif: [''],
      eighthNegatif: [''],
    });
  }

  facadeImage(event: any) {
    if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();

        reader.onload = (_event: any) => {
            this.facadeFile =  _event.target.result;
            this.facadeName = event.target.files[0].name;
        };
        reader.readAsDataURL(event.target.files[0]);
    }
  }

  platImage(event: any) {
    if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();

        reader.onload = (_event: any) => {
            this.platFile = _event.target.result;
            this.platName = event.target.files[0].name;
        };
        reader.readAsDataURL(event.target.files[0]);
    }
  }

  test(event: any){
    if(event.value === "Oui") this.testedValue = true;
    else  this.testedValue = false;
  }

  changeDisplay(day: String){
    if(day === "lundi") this.displayHoraire.lundi = !this.displayHoraire.lundi;
    else if(day === "mardi") this.displayHoraire.mardi = !this.displayHoraire.mardi;
    else if(day === "mercredi") this.displayHoraire.mercredi = !this.displayHoraire.mercredi;
    else if(day === "jeudi") this.displayHoraire.jeudi = !this.displayHoraire.jeudi;
    else if(day === "vendredi") this.displayHoraire.vendredi = !this.displayHoraire.vendredi;
    else if(day === "samedi") this.displayHoraire.samedi = !this.displayHoraire.samedi;
    else if(day === "dimanche") this.displayHoraire.dimanche = !this.displayHoraire.dimanche;
  }

  fillHoraires(event:any){
    if(event.checked){
      if(this.displayHoraire.lundi){
        this.displayHoraire.mardi = true;
        this.displayHoraire.mercredi = true;
        this.displayHoraire.jeudi = true;
        this.displayHoraire.vendredi = true;
        this.displayHoraire.samedi = true;
        this.displayHoraire.dimanche = true;
      } else{
        this.displayHoraire.mardi = false;
        this.displayHoraire.mercredi = false;
        this.displayHoraire.jeudi = false;
        this.displayHoraire.vendredi = false;
        this.displayHoraire.samedi = false;
        this.displayHoraire.dimanche = false;
      }
      

      this.thirdFormGroup.get("startMidMar")?.setValue(this.thirdFormGroup.value.startMidLun);
      this.thirdFormGroup.get("endMidMar")?.setValue(this.thirdFormGroup.value.endMidLun);
      this.thirdFormGroup.get("startSoirMar")?.setValue(this.thirdFormGroup.value.startSoirLun);
      this.thirdFormGroup.get("endSoirMar")?.setValue(this.thirdFormGroup.value.endSoirLun);

      this.thirdFormGroup.get("startMidMer")?.setValue(this.thirdFormGroup.value.startMidLun);
      this.thirdFormGroup.get("endMidMer")?.setValue(this.thirdFormGroup.value.endMidLun);
      this.thirdFormGroup.get("startSoirMer")?.setValue(this.thirdFormGroup.value.startSoirLun);
      this.thirdFormGroup.get("endSoirMer")?.setValue(this.thirdFormGroup.value.endSoirLun);

      this.thirdFormGroup.get("startMidJeu")?.setValue(this.thirdFormGroup.value.startMidLun);
      this.thirdFormGroup.get("endMidJeu")?.setValue(this.thirdFormGroup.value.endMidLun);
      this.thirdFormGroup.get("startSoirJeu")?.setValue(this.thirdFormGroup.value.startSoirLun);
      this.thirdFormGroup.get("endSoirJeu")?.setValue(this.thirdFormGroup.value.endSoirLun);

      this.thirdFormGroup.get("startMidVen")?.setValue(this.thirdFormGroup.value.startMidLun);
      this.thirdFormGroup.get("endMidVen")?.setValue(this.thirdFormGroup.value.endMidLun);
      this.thirdFormGroup.get("startSoirVen")?.setValue(this.thirdFormGroup.value.startSoirLun);
      this.thirdFormGroup.get("endSoirVen")?.setValue(this.thirdFormGroup.value.endSoirLun);

      this.thirdFormGroup.get("startMidSam")?.setValue(this.thirdFormGroup.value.startMidLun);
      this.thirdFormGroup.get("endMidSam")?.setValue(this.thirdFormGroup.value.endMidLun);
      this.thirdFormGroup.get("startSoirSam")?.setValue(this.thirdFormGroup.value.startSoirLun);
      this.thirdFormGroup.get("endSoirSam")?.setValue(this.thirdFormGroup.value.endSoirLun);

      this.thirdFormGroup.get("startMidDim")?.setValue(this.thirdFormGroup.value.startMidLun);
      this.thirdFormGroup.get("endMidDim")?.setValue(this.thirdFormGroup.value.endMidLun);
      this.thirdFormGroup.get("startSoirDim")?.setValue(this.thirdFormGroup.value.startSoirLun);
      this.thirdFormGroup.get("endSoirDim")?.setValue(this.thirdFormGroup.value.endSoirLun);
    } 
  }

  add(){
    let lundi,mardi,mercredi,jeudi,vendredi,samedi,dimanche;

    if(!this.displayHoraire.lundi){
      lundi = [this.thirdFormGroup.value.startMidLun,
        this.thirdFormGroup.value.endMidLun
      ];
    } else{
      lundi = [
        this.thirdFormGroup.value.startMidLun,
        this.thirdFormGroup.value.endMidLun,
        this.thirdFormGroup.value.startSoirLun,
        this.thirdFormGroup.value.endSoirLun
      ];
    }

    if(!this.displayHoraire.mardi){
      mardi = [this.thirdFormGroup.value.startMidMar,
        this.thirdFormGroup.value.endMidMar
      ]
    } else{
      mardi = [
        this.thirdFormGroup.value.startMidMar,
        this.thirdFormGroup.value.endMidMar,
        this.thirdFormGroup.value.startSoirMar,
        this.thirdFormGroup.value.endSoirMar
      ];
    }

    if(!this.displayHoraire.mercredi){
      mercredi = [this.thirdFormGroup.value.startMidMer,
        this.thirdFormGroup.value.endMidMer
      ]
    } else{
      mercredi = [
        this.thirdFormGroup.value.startMidMer,
        this.thirdFormGroup.value.endMidMer,
        this.thirdFormGroup.value.startSoirMer,
        this.thirdFormGroup.value.endSoirMer
      ]
    }

    if(!this.displayHoraire.jeudi){
      jeudi = [this.thirdFormGroup.value.startMidJeu,
        this.thirdFormGroup.value.endMidJeu
      ]
    } else{
      jeudi = [
        this.thirdFormGroup.value.startMidJeu,
        this.thirdFormGroup.value.endMidJeu,
        this.thirdFormGroup.value.startSoirJeu,
        this.thirdFormGroup.value.endSoirJeu
      ]
    }

    if(!this.displayHoraire.vendredi){
      vendredi = [this.thirdFormGroup.value.startMidVen,
        this.thirdFormGroup.value.endMidVen
      ]
    } else{
      vendredi = [
        this.thirdFormGroup.value.startMidVen,
        this.thirdFormGroup.value.endMidVen,
        this.thirdFormGroup.value.startSoirVen,
        this.thirdFormGroup.value.endSoirVen
      ]
    }

    if(!this.displayHoraire.samedi){
      samedi = [this.thirdFormGroup.value.startMidSam,
        this.thirdFormGroup.value.endMidSam
      ]
    } else{
      samedi = [
        this.thirdFormGroup.value.startMidSam,
        this.thirdFormGroup.value.endMidSam,
        this.thirdFormGroup.value.startSoirSam,
        this.thirdFormGroup.value.endSoirSam
      ]
    }

    if(!this.displayHoraire.dimanche){
      dimanche = [this.thirdFormGroup.value.startMidDim,
        this.thirdFormGroup.value.endMidDim
      ]
    } else{
      dimanche = [
        this.thirdFormGroup.value.startMidDim,
        this.thirdFormGroup.value.endMidDim,
        this.thirdFormGroup.value.startSoirDim,
        this.thirdFormGroup.value.endSoirDim
      ]
    }

    const horaires: Horaires = {
      lundi : lundi,
      mardi : mardi,
      mercredi : mercredi,
      jeudi : jeudi,
      vendredi : vendredi,
      samedi : samedi,
      dimanche : dimanche,
      id: ""
    }

    const positif = [
      this.fourthFormGroup.value.firstPositif,
      this.fourthFormGroup.value.secondPositif,
      this.fourthFormGroup.value.thirdPositif,
      this.fourthFormGroup.value.fourthPositif,
      this.fourthFormGroup.value.fifthPositif,
      this.fourthFormGroup.value.sixthPositif,
      this.fourthFormGroup.value.seventhPositif,
      this.fourthFormGroup.value.eighthPositif,
    ]

    const negatif = [
      this.fourthFormGroup.value.firstNegatif,
      this.fourthFormGroup.value.secondNegatif,
      this.fourthFormGroup.value.thirdNegatif,
      this.fourthFormGroup.value.fourthNegatif,
      this.fourthFormGroup.value.fifthNegatif,
      this.fourthFormGroup.value.sixthNegatif,
      this.fourthFormGroup.value.seventhNegatif,
      this.fourthFormGroup.value.eighthNegatif,
    ]

    let note_deco = "0";
    if(this.secondFormGroup.value.note_deco.length > 0) note_deco = this.secondFormGroup.value.note_deco;

    let priority = "0";
    if(this.secondFormGroup.value.priority.length > 0) priority = this.secondFormGroup.value.priority;
      

    if(this.firstFormGroup.value.place === "Restaurant"){
      let restaurant: Restaurant = {
        id: "",
        name: this.firstFormGroup.value.name,
        address: this.firstFormGroup.value.address,
        stations: this.selected,
        arrondissement: this.firstFormGroup.value.arrondissement,
        note: this.firstFormGroup.value.note,
        price: this.firstFormGroup.value.price,
        type: this.firstFormGroup.value.type,
        img: this.facadeFile,
        plat: this.platFile,
        theFork: this.firstFormGroup.value.theFork,
        tested: this.testedValue,
        comment: this.thirdFormGroup.value.comment,
        ambiance: this.thirdFormGroup.value.ambiance,
        positif: positif,
        negatif: negatif,
        note_deco: Number(note_deco),
        priority: Number(priority),
        like: false
      };

      this.data.addRestaurant(restaurant,horaires);
      this.dialogRef.close();
    }
    else if(this.firstFormGroup.value.place === "Bar"){
      let bar: Bar = {
        id: "",
        name: this.firstFormGroup.value.name,
        address: [this.firstFormGroup.value.address],
        stations: this.selected,
        arrondissement: this.firstFormGroup.value.arrondissement,
        note: this.firstFormGroup.value.note,
        price: this.firstFormGroup.value.price,
        img: this.facadeFile,
        cocktails: [this.platFile],
        tested: this.testedValue,
        comment: this.thirdFormGroup.value.comment,
        ambiance: this.thirdFormGroup.value.ambiance,
        positif: positif,
        negatif: negatif,
        note_deco: Number(note_deco),
        priority: Number(priority),
        like: false
      };

      this.data.addBar(bar,horaires);
      this.dialogRef.close();
    }
  }

  select(element: any){
    let indexToSuppress = null;
    this.selected.forEach((station,index) => {
      if(station === element) indexToSuppress = index;
    });
    if(indexToSuppress != null) this.selected.splice(indexToSuppress,1);
    else  this.selected.push(element);
  }

  filter(searchTerm: string) {
    if(searchTerm.length === 0) this.filteredData = [];
    else this.filteredData = this.dataSource.data.filter((station: string | string[]) => station.includes(searchTerm));
  }
  
}
