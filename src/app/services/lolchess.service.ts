import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http'
import { HttpErrorResponse, HttpResponse } from '@angular/common/http'

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LolchessService {

  constructor(private http: HttpClient) {
    this.getItemsTrend()
  }

  getItemsTrend() {
    return this.http.get<any>(
      'https://lolchess.gg/statistics/items',
      {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
          'XSRF-TOKEN': 'eyJpdiI6IjJyYmZoYzBGVGt0Z05IRWd0UTRCdmc9PSIsInZhbHVlIjoidE91Mk9GaGx5OGRzMlFGV244S0RZTU1mZjZEdUJkaVRoMjVjODlkNTNFbUJyUUdJSGUvSUlncW13V2xJcXgzdSswTTZ4Y1hWbERtd1doOEFNUlQvQ3dsWmVyVDRGL05wWWJicnllMTFITytUcDFTdjQwN01ubGs2a3p2Wnc2cFQiLCJtYWMiOiJjMzU4M2RlYTQ4OTcxYjI0NTgwNGVkY2ZhYTBlMGYyMmM3MzUwYzJhZTQ2OTQ2MjUxNjE0NjZmMDhjN2ZiMDAxIiwidGFnIjoiIn0%3D; lolchessgg_session=eyJpdiI6Ikw3U3NjSVZ4Z2N3cVZlUHRUOTNJbkE9PSIsInZhbHVlIjoiQmVWMDVDTUZ5aDZGZVprMUNiNlB1WDdsU1doc096TzZCSDZ6ZXloaDNzeENkakQ1SEZ3SmFHdkZJWTBuTEZLeEQ4WFA3bnkzZTFkdkF1TkJ4bWhGV0hIbkdzTUllYVI2MzlaWENocS9XaWdKMDF1c1ZhWGdpZlFvM0NNcUtJVjkiLCJtYWMiOiIwNGJiY2UxNjkwMTQwZTYzYmY4NWI0NDM0Y2Q5ZWM5YTZhNTdhNjFmODIzODRiZWEyYzVmMTgyNTgzOGEwNjY5IiwidGFnIjoiIn0%3D',
          referer: 'https://lolchess.gg/profile/euw/jiash'
        })
      }
    )
      .subscribe(data => {
        console.log(data)
      })
      /*
      .pipe(
        catchError(this.handleError)
      )
      */
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      )
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
}
