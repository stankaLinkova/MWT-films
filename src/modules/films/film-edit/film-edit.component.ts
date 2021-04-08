import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Film } from 'src/entities/film';
import { FilmsServerService } from 'src/services/films-server.service';

@Component({
  selector: 'app-film-edit',
  templateUrl: './film-edit.component.html',
  styleUrls: ['./film-edit.component.css'],
})
export class FilmEditComponent implements OnInit {
  film: Film;
  filmToSave = false;

  constructor(
    private filmServerService: FilmsServerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let url = this.router.url;
    const len = url.split("/").length;
    let urlA = url.split("/");
    let id = +urlA[len-1];

    this.filmServerService.getFilm(id).subscribe((film) => {
      this.film = film;
    });
  }

  saveFilm(film: Film) {
    this.filmServerService.saveFilm(film).subscribe((film1) => {
      this.router.navigateByUrl("/films");
    })
  }

}
