import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Clovek } from 'src/entities/clovek';
import { Film } from 'src/entities/film';
import { Postava } from 'src/entities/postava';
import { FilmsServerService } from 'src/services/films-server.service';

@Component({
  selector: 'app-film-edit-child',
  templateUrl: './film-edit-child.component.html',
  styleUrls: ['./film-edit-child.component.css'],
})
export class FilmEditChildComponent implements OnChanges {
  @Input() film: Film;
  @Output() changed = new EventEmitter<Film>();

  public postavyArray: Array<Postava> = [];
  public newAttribute: Postava;
  public postavs: Array<Postava> = [];
  public reziseri: Array<Clovek> = [];

  filmEditForm = this.formBuilder.group({
    nazov: '',
    rok: 0,
    imdbID: '',
    slovenskyNazov: '',
    poradieVRebricku1998: '',
    poradieVRebricku2007: '',
    reziser: this.formBuilder.array([]),
    postava: this.formBuilder.array([]),
  });

  createPostavu(): FormGroup {
    return this.formBuilder.group({
      postava: '',
      dolezitost: '',
      krstneMeno: '',
      stredneMeno: '',
      priezvisko: '',
    });
  }

  createReziser(): FormGroup {
    return this.formBuilder.group({
      krstneMenoR: '',
      stredneMenoR: '',
      priezviskoR: '',
    });
  }

  constructor(
    private filmServerService: FilmsServerService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnChanges(): void {
    if (!this.filmServerService.token) {
      this.router.navigateByUrl('/login');
    }

    if (this.film?.poradieVRebricku) {
      this.nazov.setValue(this.film.nazov);
      this.rok.setValue(this.film.rok);
      this.imdbID.setValue(this.film.imdbID);
      this.slovenskyNazov.setValue(this.film.slovenskyNazov);

      this.poradieVRebricku1998.setValue(
        this.film.poradieVRebricku['AFI 1998']
      );
      this.poradieVRebricku2007.setValue(
        this.film.poradieVRebricku['AFI 2007']
      );

      this.reziseri = this.film.reziser;
      this.reziseri.forEach((reziser) => {
        this.reziser.push(
          new FormGroup(
            {
              krstneMenoR: new FormControl(reziser.krstneMeno),
              stredneMenoR: new FormControl(reziser.stredneMeno),
              priezviskoR: new FormControl(reziser.priezvisko),
            },
            []
          )
        );
      });

      this.postavyArray = this.film.postava;
      this.postavs = this.film.postava;
      this.postavs.forEach((postav) => {
        this.postava.push(
          new FormGroup(
            {
              postava: new FormControl(postav.postava),
              dolezitost: new FormControl(postav.dolezitost),
              krstneMeno: new FormControl(postav.herec.krstneMeno),
              stredneMeno: new FormControl(postav.herec.stredneMeno),
              priezvisko: new FormControl(postav.herec.priezvisko),
            },
            []
          )
        );
      });
    }
  }

  get nazov() {
    return this.filmEditForm.get('nazov') as FormControl;
  }

  get rok() {
    return this.filmEditForm.get('rok') as FormControl;
  }

  get imdbID() {
    return this.filmEditForm.get('imdbID') as FormControl;
  }

  get slovenskyNazov() {
    return this.filmEditForm.get('slovenskyNazov') as FormControl;
  }

  get poradieVRebricku1998() {
    return this.filmEditForm.get('poradieVRebricku1998') as FormControl;
  }

  get poradieVRebricku2007() {
    return this.filmEditForm.get('poradieVRebricku2007') as FormControl;
  }

  get reziser() {
    return this.filmEditForm.get('reziser') as FormArray;
  }

  get postava() {
    return this.filmEditForm.get('postava') as FormArray;
  }

  addItem(): void {
    this.postava.push(this.createPostavu());
  }

  deleteItem(index) {
    this.postava.removeAt(index);
  }

  addReziser(): void {
    this.reziser.push(this.createReziser());
  }

  deleteReziser(index) {
    this.reziser.removeAt(index);
  }

  formSubmit() {
    const poradieVRebricku: { [title: string]: number } = {
      'AFI 1998': this.poradieVRebricku1998.value,
      'AFI 2007': this.poradieVRebricku2007.value,
    };

    let postavy = this.postava.value;
    postavy = postavy.map((postava) => {
      return new Postava(
        postava.postava,
        postava.dolezitost,
        new Clovek(postava.priezvisko, postava.krstneMeno, postava.stredneMeno)
      );
    });

    let reziseri = this.reziser.value;
    reziseri = reziseri.map((rezis) => {
      return new Clovek(
        rezis.priezviskoR,
        rezis.krstneMenoR,
        rezis.stredneMenoR
      );
    });

    const film = new Film(
      this.nazov.value,
      this.rok.value,
      this.film.id,
      this.imdbID.value,
      this.slovenskyNazov.value,
      poradieVRebricku,
      reziseri,
      postavy
    );
    this.changed.next(film);
  }
}
