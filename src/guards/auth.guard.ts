import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanLoad,
  Route,
  UrlSegment,
} from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';
import { UsersServerService } from 'src/services/users-server.service';
import { UrlAfterLogin } from 'src/shared/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private userServerService: UsersServerService,
    private router: Router,
    private store: Store
  ) {}

  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    return this.canAnything(route.path);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canAnything(state.url);
  }

  canAnything(url: string): boolean | Observable<boolean> {
    if (this.store.selectSnapshot((state) => state.auth.token)) {
      return true;
    }
    return this.store.dispatch(new UrlAfterLogin(url)).pipe(
      tap(() => {
        this.router.navigateByUrl('/login'), mapTo(false);
      })
    );
  }
}
