import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, filter, find, map, tap } from 'rxjs/operators';
import { OlympicInterface } from '../models/Olympic';

@Injectable({
    providedIn: 'root',
})
export class OlympicService {
    private olympicUrl = './assets/mock/olympic.json';
    private olympics$ = new BehaviorSubject<OlympicInterface[] | undefined | null>(undefined);

    constructor(private http: HttpClient) { }

    loadInitialData() {
        return this.http.get<OlympicInterface[]>(this.olympicUrl).pipe(
            tap((value) => this.olympics$.next(value)),
            catchError((error, caught) => {
                // TODO: improve error handling
                console.error(error);
                // can be useful to end loading state and let the user know something went wrong
                this.olympics$.next(null);
                return caught;
            })
        );
    }

    getOlympics() {
        // return this.olympics$.asObservable();
        return this.http.get<OlympicInterface[]>(this.olympicUrl).pipe(
            tap((value) => this.olympics$.next(value)),
            catchError((error, caught) => {
                // TODO: improve error handling
                console.error(error);
                // can be useful to end loading state and let the user know something went wrong
                this.olympics$.next(null);
                return caught;
            })
        );
    }
    getOlympicById(id: number) {
        return this.http.get<OlympicInterface[]>(this.olympicUrl).pipe(
            map((value) => {
                return value.find((val: OlympicInterface) => val.id === id)
            }),
            catchError((error, caught) => {
                // TODO: improve error handling
                console.error(error);
                // can be useful to end loading state and let the user know something went wrong
                this.olympics$.next(null);
                return caught;
            })
        );
    }

    getOlympicByCountry(country: string) {
        return this.http.get<OlympicInterface[]>(this.olympicUrl).pipe(
            map((value) => value.find((val: OlympicInterface) => val.country == country)),
            catchError((error, caught) => {
                // TODO: improve error handling
                console.error(error);
                // can be useful to end loading state and let the user know something went wrong
                this.olympics$.next(null);
                return caught;
            })
        );
    }



}
