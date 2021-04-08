import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilmAddComponent } from './film-add/film-add.component';
import { FilmDetailComponent } from './film-detail/film-detail.component';
import { FilmEditComponent } from './film-edit/film-edit.component';
import { FilmsListComponent } from './films-list/films-list.component';
import { FilmsMenuComponent } from './films-menu/films-menu.component';

const routes: Routes = [
  { path: "", component: FilmsMenuComponent,
    children: [
      { path: "edit/:id",component: FilmEditComponent},
      { path: "add", component: FilmAddComponent},
      { path: "", component: FilmsListComponent,
        children: [
        { path: ":id", component: FilmDetailComponent}
        ]
      },
       
    ]
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmsRoutingModule { }
