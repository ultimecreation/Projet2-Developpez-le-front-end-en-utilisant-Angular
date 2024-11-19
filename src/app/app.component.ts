import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Observable, Subscription, take } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

    offlineEvent: Observable<Event> | undefined;
    onlineEvent: Observable<Event> | undefined;
    subscriptions: Subscription[] = [];
    connectionStatus: string | undefined;

    constructor(private olympicService: OlympicService) { }

    ngOnInit(): void {
        this.checkInternetConnection()
        this.olympicService.loadInitialData().pipe(take(1)).subscribe();
    }


    checkInternetConnection() {
        this.onlineEvent = fromEvent(window, 'online');
        this.offlineEvent = fromEvent(window, 'offline');

        this.subscriptions.push(this.onlineEvent.subscribe(e => {
            this.connectionStatus = 'online';
            console.log('Online...');
        }));

        this.subscriptions.push(this.offlineEvent.subscribe(e => {
            this.connectionStatus = 'offline';
            console.log('Offline...');
            return
        }));

    }
    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
