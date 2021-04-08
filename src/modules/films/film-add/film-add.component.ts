import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Film } from 'src/entities/film';
import { FilmsServerService } from 'src/services/films-server.service';

@Component({
  selector: 'app-film-add',
  templateUrl: './film-add.component.html',
  styleUrls: ['./film-add.component.css'],
})
export class FilmAddComponent implements OnInit {
  filmToAdd = new Film('', 0);

  constructor(
    private filmServerService: FilmsServerService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  saveFilm(film: Film) {
    this.filmServerService.saveFilm(film).subscribe(() => {
      this.router.navigateByUrl('/films');
    });
  }
}
