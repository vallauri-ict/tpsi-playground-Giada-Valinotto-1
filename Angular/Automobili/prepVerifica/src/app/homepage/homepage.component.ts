import { Component, OnInit } from '@angular/core';
import { AutoService } from '../shared/auto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  public selectedMarca: string;
  public selectedModello;

  constructor(public autoService: AutoService, private router: Router) {}

  ngOnInit(): void {
    this.autoService.getMarche();
  }

  getModels = () => {
    this.autoService.getModelli(this.selectedMarca);
  };

  getCars = () => {
    console.log(this.selectedModello);
    this.autoService.getCars(this.selectedModello.id);
  };

  getNome = () => {
    // console.log(this.autoService.modelli.filter((modello)=>
    //   modello.id===this.selectedModello))
  };

  details = (id) => {
    this.router.navigateByUrl('details/' + id);
  };

  deleteAuto = (id) => {
    this.autoService.deleteAuto(id).subscribe(
      () => {
        this.autoService.getCars(this.selectedModello.id);
      },
      (err) => console.error(err)
    );
  };
}
