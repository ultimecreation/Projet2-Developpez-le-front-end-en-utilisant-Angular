import { Component, DestroyRef, EventEmitter, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartEvent, ChartOptions } from 'chart.js';
import { Observable, of } from 'rxjs';
import { OlympicInterface } from 'src/app/core/models/Olympic';
import { ParticipationInterface } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    private destroyRef = inject(DestroyRef)
    private router = inject(Router)

    public errorMsg: string = '';

    public olympics$: Observable<OlympicInterface[] | null> = of(null);
    public countriesCount: number = 0
    public joCount: number = 0
    // Pie
    public pieChartOptions: ChartOptions<'pie'> = { responsive: true };
    public pieChartLabels: string[] = []
    public pieChartDatasets: [{ data: number[] }] = [{ data: [0, 0, 0, 0, 0] }];

    constructor(private olympicService: OlympicService) { }

    ngOnInit(): void {
        const subscription = this.olympicService.getOlympics().subscribe({
            next: (data: OlympicInterface[]) => {
                this.countriesCount = data.length
                for (let item of data) {
                    const participationsLength = item.participations.length
                    if (this.joCount < participationsLength) this.joCount = participationsLength

                    this.pieChartLabels = [... this.pieChartLabels, item.country]
                    const totalMedalsCount = item.participations.reduce(
                        (acc: number, current: ParticipationInterface) => {
                            return acc + current.medalsCount
                        }, 0)
                    this.pieChartDatasets[0].data.unshift(totalMedalsCount)
                }
                this.pieChartDatasets[0].data = this.pieChartDatasets[0].data.filter(val => val !== 0)
            }
        })

        this.destroyRef.onDestroy(() => subscription.unsubscribe())
    }

    onChartClick($event: {
        event?: ChartEvent;
        active?: object[] | any;
    }) {
        console.log($event.active)
        if ($event.active && $event.active.length > 0) {
            const country = this.pieChartLabels[$event.active[0].index];

            const subscription = this.olympicService.getOlympicByCountry(country).subscribe({
                next: (data: OlympicInterface | undefined) => {
                    // data = undefined
                    if (!data) {
                        return this.errorMsg = 'An error occured while retriving data'
                    }
                    // return
                    return this.router.navigateByUrl(`details/${data?.id}`)
                },
                error: (error) => console.log("TEST33", error)
            })
            this.destroyRef.onDestroy(() => subscription.unsubscribe())
        }
    };
}
