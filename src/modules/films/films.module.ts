import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilmsRoutingModule } from './films-routing.module';
import { FilmsMenuComponent } from './films-menu/films-menu.component';
import { FilmEditComponent } from './film-edit/film-edit.component';
import { FilmsListComponent } from './films-list/films-list.component';
import { FilmDetailComponent } from './film-detail/film-detail.component';
import { MaterialModule } from 'src/app/material.module';
import { FilmAddComponent } from './film-add/film-add.component';
import { FilmEditChildComponent } from './film-edit-child/film-edit-child.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FilmsMenuComponent,
    FilmEditComponent,
    FilmsListComponent,
    FilmDetailComponent,
    FilmAddComponent,
    FilmEditChildComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FilmsRoutingModule,
  ],
})
export class FilmsModule {}
