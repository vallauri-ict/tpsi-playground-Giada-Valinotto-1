import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutoService } from '../shared/auto.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  id: number;


  constructor(
    private activeRoute: ActivatedRoute,
    public autoService: AutoService
  ) {}

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.id = params.id;
      this.autoService.getDetails(this.id);
    });
  }
}
