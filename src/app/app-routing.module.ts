import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { SelectingPreloadingStrategyService } from 'src/guards/selecting-preloading-strategy.service';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: 'films',
    loadChildren: () =>
      import('../modules/films/films.module').then((mod) => mod.FilmsModule),
    canLoad: [AuthGuard],
    data: {preloading: false},
  },
  {path: "users",
    loadChildren: ()=>
      import("../modules/users/users.module").then(mod => mod.UsersModule),
    data: { preloading: true}
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: SelectingPreloadingStrategyService})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
