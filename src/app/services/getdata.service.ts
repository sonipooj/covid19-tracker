import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Country } from '../models/country';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

HttpClient
@Injectable({
  providedIn: 'root'
})
export class GetdataService {
 api= "http://ec2-13-127-10-27.ap-south-1.compute.amazonaws.com:4502/bin/getCovidCasesDetails";
 indStateApi="https://api.covid19india.org/state_district_wise.json";
  constructor(private _http: HttpClient) { }
  private host = "https://api.coronastatistics.live"

   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Basic ' + btoa('admin:admin')
    })
  };

  // getAll(type): Observable<Country>{
  //   return this._http.get<Country>(`${this.api}?sort=${type}`,this.httpOptions).pipe(
  //     retry(1),
  //     catchError(this.handleError)
  //   );
  // }
  getUser(){
    return this._http.get(this.api, this.httpOptions);
  console.log("this.getUser()",this.getUser())
  }
  getSates(){
    //  return this._http.get('https://covid19-india-adhikansh.herokuapp.com/states');
    return this._http.get(`${this.indStateApi}`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getAll(type): Observable<Country>{
    return this._http.get<Country>(`${this.host}/countries?sort=${type}`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getCountry(name): Observable<Country>{
    return this._http.get<Country>(`${this.api}/country/${name}`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getTimeline(){
    return this._http.get(`${this.host}/timeline`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getTimelineCountry(country){
    return this._http.get(`${this.host}/timeline/${country}`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getTimelineGlobal(){
    return this._http.get(`${this.host}/timeline/global`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert("Please check your internet connection!.");
    return throwError(errorMessage);
 }
}
