import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Film } from 'src/entities/film';
import { ConfirmDialogComponent } from 'src/modules/users/confirm-dialog/confirm-dialog.component';
import { SnackbarService } from './snackbar.service';
import { UsersServerService } from './users-server.service';

@Injectable({
  providedIn: 'root',
})
export class FilmsServerService {
  url = 'http://localhost:8080/films';

  constructor(
    private http: HttpClient,
    private userServerService: UsersServerService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  get token() {
    return this.userServerService.token;
  }

  private getHeader(): {
    headers?: { 'X-Auth-Token': string };
    params?: HttpParams;
  } {
    return this.token ? { headers: { 'X-Auth-Token': this.token } } : undefined;
  }

  saveFilm(film: Film): Observable<Film> {
    let httpOptions = { headers: { 'X-Auth-Token': this.token } };
    return this.http
      .post<Film>(this.url, film, httpOptions)
      .pipe(catchError((error) => this.httpErrorProcess(error)));
  }

  getFilm(id: number): Observable<Film> {
    const httpOptions = this.getHeader();
    return this.http
      .get<Film>(this.url + '/' + id, httpOptions)
      .pipe(catchError((error) => this.httpErrorProcess(error)));
  }

  private httpErrorProcess(error) {
    if (error instanceof HttpErrorResponse) {
      this.httpErrorToMessage(error);
      return EMPTY;
    }
    return throwError(error);
  }

  private httpErrorToMessage(error: HttpErrorResponse): void {
    if (error.status === 0) {
      this.snackbarService.errorMessage('Server unavailable!');
      return;
    }

    if (error.status >= 400 && error.status < 500) {
      const message = error.error.errorMessage
        ? error.error.errorMessage
        : JSON.parse(error.error).errorMessage;

      if (error.status === 401 && message == 'unknown token') {
        this.snackbarService.errorMessage('Session timeout');
        return;
      }

      if (error.status === 403) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: 'Nemáte právo na upravovanie filmov!',
            message:
              "Prejsť na zoznam userov, kde sa môžete pridať do skupiny 'employee' a získať práva na upravovanie filmov ?",
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.router.navigateByUrl('/users/extended');
          }
        });
      }

      this.snackbarService.errorMessage(message);
      return;
    }

    this.snackbarService.errorMessage('server error: ' + error.message);
  }
  getFilms(
    indexFrom?: number,
    indexTo?: number,
    search?: string,
    orderBy?: string,
    descending?: boolean
  ): Observable<FilmsResponse> {
    let httpOptions = this.getHeader();
    if (indexFrom || indexTo || search || orderBy || descending) {
      httpOptions = { ...(httpOptions || {}), params: new HttpParams() };
    }
    if (indexFrom) {
      httpOptions.params = httpOptions.params.set('indexFrom', '' + indexFrom);
    }
    if (indexTo) {
      httpOptions.params = httpOptions.params.set('indexTo', '' + indexTo);
    }
    if (search) {
      httpOptions.params = httpOptions.params.set('search', search);
    }
    if (orderBy) {
      httpOptions.params = httpOptions.params.set('orderBy', orderBy);
    }
    if (descending) {
      httpOptions.params = httpOptions.params.set(
        'descending',
        '' + descending
      );
    }
    return this.http
      .get<FilmsResponse>(this.url, httpOptions)
      .pipe(tap((resp) => console.log(resp)));
  }
}

export interface FilmsResponse {
  items: Film[];
  totalCount: number;
}
