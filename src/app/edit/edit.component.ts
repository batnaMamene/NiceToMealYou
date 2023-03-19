import { Time } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddComponent } from '../add/add.component';
import { Horaires } from '../model/horaires';
import { Restaurant } from '../model/restaurant';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  isLinear = false;
  firstFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  secondFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  thirdFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  fourthFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  fifthFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  sixthFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  seventhFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  eighthFormGroup: UntypedFormGroup = new UntypedFormGroup({});

  options: string[] = ['Restaurant', 'Bar', 'Sortie'];

  stationOptions: number[] = [1, 2, 3];
  nbStation: number = 1;
  stations: String[] = [""];

  ligneOptions: String[] = ["1","2","3","3bis","4","5","6","7","7bis","8","9","10","11","12","13","14","A","B"];

  filteredOptions: Observable<string[]> | undefined;

  facadeFile: String = "";
  facadeName: String = "N/O";
  platFile: String = "";
  platName: String = "N/O";

  startMid!: Time;
  tested: String[] = ["Oui", "Non"];
  testedValue: boolean = false;

  displayHoraire = {
    lundi: false,
    mardi: false,
    mercredi: false,
    jeudi: false,
    vendredi: false,
    samedi: false,
    dimanche: false,
  }
  
  constructor(private _formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<EditComponent>, 
    private dataService: DataService, 
    @Inject(MAT_DIALOG_DATA) private data: any) {
      let test = "";
      if(data.tested) test = "Oui";
      else  test = "Non"; 
      this.firstFormGroup = this._formBuilder.group({
        name: [data.name, Validators.required],
        address: [data.address, Validators.required],
        arrondissement: [data.arrondissement, Validators.required]
      });
      this.secondFormGroup = this._formBuilder.group({
        note: [data.note],
        price: [data.price, Validators.required],
        img: [data.img],
        plat: [data.plat],
        theFork: [data.theFork],
        type: [data.type, Validators.required],
        tested: [test, Validators.required],
        note_deco: [data.note_deco],
        priority: [data.priority]
      });
      this.thirdFormGroup = this._formBuilder.group({
        comment: [data.comment],
        ambiance: [data.ambiance],
        startMidLun: [data.horaires.lundi[0]],
        endMidLun: [data.horaires.lundi[1]],
        startSoirLun: [data.horaires.lundi[2]],
        endSoirLun: [data.horaires.lundi[3]],
      });
      this.fourthFormGroup = this._formBuilder.group({
        startMidMar: [data.horaires.mardi[0]],
        endMidMar: [data.horaires.mardi[1]],
        startSoirMar: [data.horaires.mardi[2]],
        endSoirMar: [data.horaires.mardi[3]],
        startMidMer: [data.horaires.mercredi[0]],
        endMidMer: [data.horaires.mercredi[1]],
        startSoirMer: [data.horaires.mercredi[2]],
        endSoirMer: [data.horaires.mercredi[3]],
      });
      this.fifthFormGroup = this._formBuilder.group({
        startMidJeu: [data.horaires.jeudi[0]],
        endMidJeu: [data.horaires.jeudi[1]],
        startSoirJeu: [data.horaires.jeudi[2]],
        endSoirJeu: [data.horaires.jeudi[3]],
        startMidVen: [data.horaires.vendredi[0]],
        endMidVen: [data.horaires.vendredi[1]],
        startSoirVen: [data.horaires.vendredi[2]],
        endSoirVen: [data.horaires.vendredi[3]],
      });
      this.sixthFormGroup = this._formBuilder.group({
        startMidSam: [data.horaires.samedi[0]],
        endMidSam: [data.horaires.samedi[1]],
        startSoirSam: [data.horaires.samedi[2]],
        endSoirSam: [data.horaires.samedi[3]],
        startMidDim: [data.horaires.dimanche[0]],
        endMidDim: [data.horaires.dimanche[1]],
        startSoirDim: [data.horaires.dimanche[2]],
        endSoirDim: [data.horaires.dimanche[3]],
      });
      this.seventhFormGroup = this._formBuilder.group({
        firstPositif: [data.positif[0]],
        secondPositif: [data.positif[1]],
        thirdPositif: [data.positif[2]],
        fourthPositif: [data.positif[3]],
        fifthPositif: [data.positif[4]],
        sixthPositif: [data.positif[5]],
        seventhPositif: [data.positif[6]],
        eighthPositif: [data.positif[7]],
      });
      this.eighthFormGroup = this._formBuilder.group({
        firstNegatif: [data.negatif[0]],
        secondNegatif: [data.negatif[1]],
        thirdNegatif: [data.negatif[2]],
        fourthNegatif: [data.negatif[3]],
        fifthNegatif: [data.negatif[4]],
        sixthNegatif: [data.negatif[5]],
        seventhNegatif: [data.negatif[6]],
        eighthNegatif: [data.negatif[7]],
      });
      this.nbStation = data.stations.length;
      this.stations = data.stations;

      if(data.plat != null) this.platName = "Image";
      if(data.img != null)  this.facadeName = "Image";

  }

  ngOnInit() {
    this.facadeFile = this.data.img;
    this.platFile = this.data.plat;
    this.setDisplayHoraire();
  }

  setDisplayHoraire(){
    const horaires = this.data.horaires;

    if(horaires.lundi.length === 4) this.displayHoraire.lundi = true;
    if(horaires.mardi.length === 4) this.displayHoraire.mardi = true;
    if(horaires.mercredi.length === 4) this.displayHoraire.mercredi = true;
    if(horaires.jeudi.length === 4) this.displayHoraire.jeudi = true;
    if(horaires.vendredi.length === 4) this.displayHoraire.vendredi = true;
    if(horaires.samedi.length === 4) this.displayHoraire.samedi = true;
    if(horaires.dimanche.length === 4) this.displayHoraire.dimanche = true;
  }

  setStationValue(){
    if(this.stations.length < this.nbStation){
      do{
        this.stations.push("");
      }while(this.stations.length < this.nbStation)
    } else{
      this.stations.splice(0,this.stations.length-this.nbStation);
    }
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

  edit(){
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
      mardi = [this.fourthFormGroup.value.startMidMar,
        this.fourthFormGroup.value.endMidMar
      ]
    } else{
      mardi = [
        this.fourthFormGroup.value.startMidMar,
        this.fourthFormGroup.value.endMidMar,
        this.fourthFormGroup.value.startSoirMar,
        this.fourthFormGroup.value.endSoirMar
      ];
    }

    if(!this.displayHoraire.mercredi){
      mercredi = [this.fourthFormGroup.value.startMidMer,
        this.fourthFormGroup.value.endMidMer
      ]
    } else{
      mercredi = [
        this.fourthFormGroup.value.startMidMer,
        this.fourthFormGroup.value.endMidMer,
        this.fourthFormGroup.value.startSoirMer,
        this.fourthFormGroup.value.endSoirMer
      ]
    }

    if(!this.displayHoraire.jeudi){
      jeudi = [this.fifthFormGroup.value.startMidJeu,
        this.fifthFormGroup.value.endMidJeu
      ]
    } else{
      jeudi = [
        this.fifthFormGroup.value.startMidJeu,
        this.fifthFormGroup.value.endMidJeu,
        this.fifthFormGroup.value.startSoirJeu,
        this.fifthFormGroup.value.endSoirJeu
      ]
    }

    if(!this.displayHoraire.vendredi){
      vendredi = [this.fifthFormGroup.value.startMidVen,
        this.fifthFormGroup.value.endMidVen
      ]
    } else{
      vendredi = [
        this.fifthFormGroup.value.startMidVen,
        this.fifthFormGroup.value.endMidVen,
        this.fifthFormGroup.value.startSoirVen,
        this.fifthFormGroup.value.endSoirVen
      ]
    }

    if(!this.displayHoraire.samedi){
      samedi = [this.sixthFormGroup.value.startMidSam,
        this.sixthFormGroup.value.endMidSam
      ]
    } else{
      samedi = [
        this.sixthFormGroup.value.startMidSam,
        this.sixthFormGroup.value.endMidSam,
        this.sixthFormGroup.value.startSoirSam,
        this.sixthFormGroup.value.endSoirSam
      ]
    }

    if(!this.displayHoraire.dimanche){
      dimanche = [this.sixthFormGroup.value.startMidDim,
        this.sixthFormGroup.value.endMidDim
      ]
    } else{
      dimanche = [
        this.sixthFormGroup.value.startMidDim,
        this.sixthFormGroup.value.endMidDim,
        this.sixthFormGroup.value.startSoirDim,
        this.sixthFormGroup.value.endSoirDim
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
      id: this.data.id
    }

    const positif = [
      this.seventhFormGroup.value.firstPositif,
      this.seventhFormGroup.value.secondPositif,
      this.seventhFormGroup.value.thirdPositif,
      this.seventhFormGroup.value.fourthPositif,
      this.seventhFormGroup.value.fifthPositif,
      this.seventhFormGroup.value.sixthPositif,
      this.seventhFormGroup.value.seventhPositif,
      this.seventhFormGroup.value.eighthPositif,
    ]

    const negatif = [
      this.eighthFormGroup.value.firstNegatif,
      this.eighthFormGroup.value.secondNegatif,
      this.eighthFormGroup.value.thirdNegatif,
      this.eighthFormGroup.value.fourthNegatif,
      this.eighthFormGroup.value.fifthNegatif,
      this.eighthFormGroup.value.sixthNegatif,
      this.eighthFormGroup.value.seventhNegatif,
      this.eighthFormGroup.value.eighthNegatif,
    ]

    const restaurant: Restaurant = {
      id: this.data.id,
      name: this.firstFormGroup.value.name,
      address: this.firstFormGroup.value.address,
      stations: this.stations,
      arrondissement: this.firstFormGroup.value.arrondissement,
      note: this.secondFormGroup.value.note,
      price: this.secondFormGroup.value.price,
      type: this.secondFormGroup.value.type,
      img: this.facadeFile,
      plat: this.platFile,
      tested: this.testedValue,
      theFork: this.secondFormGroup.value.theFork,
      comment: this.thirdFormGroup.value.comment,
      ambiance: this.thirdFormGroup.value.ambiance,
      positif: positif,
      negatif: negatif,
      note_deco: Number(this.secondFormGroup.value.note_deco),
      priority: Number(this.secondFormGroup.value.priority),
      like: false,
    };

    this.dataService.updateRestaurant(restaurant);
    this.dataService.updateHoraire(horaires);
    this.dialogRef.close();

    setTimeout(() => {
      window.location.reload();
    }, 1000);
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

  date(){
    console.log(this.startMid);
  }

}
