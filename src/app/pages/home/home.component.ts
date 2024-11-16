import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartOptions } from 'chart.js';
import { map, Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    private destroyRef = inject(DestroyRef)
    private router = inject(Router)

    public olympics$: Observable<any> = of(null);
    public countriesCount: number = 0
    public joCount: number = 0
    // Pie
    public pieChartOptions: ChartOptions<'pie'> = { responsive: true };
    public pieChartLabels: any[] = []
    public pieChartDatasets: [{ data: number[] }] = [{ data: [0, 0, 0, 0, 0] }];

    constructor(private olympicService: OlympicService) { }

    ngOnInit(): void {
        const subscription = this.olympicService.getOlympics().subscribe({
            next: (data: any[]) => {
                this.countriesCount = data.length
                console.log(data)
                for (let item of data) {
                    const participationsLength = item.participations.length
                    if (this.joCount < participationsLength) this.joCount = participationsLength

                    this.pieChartLabels = [... this.pieChartLabels, item.country]
                    const totalMedalsCount = item.participations.reduce(
                        (acc: any, current: any) => {
                            return acc + current.medalsCount
                        }, 0)
                    this.pieChartDatasets[0].data.unshift(totalMedalsCount)
                }
                this.pieChartDatasets[0].data = this.pieChartDatasets[0].data.filter(val => val !== 0)
            }
        })

        this.destroyRef.onDestroy(() => subscription.unsubscribe())
    }

    onChartClick = (e: any) => {
        window.console.log('onChartClick', e);
        if (e.active.length > 0) {
            const country = this.pieChartLabels[e.active[0].index];
            const subscription = this.olympicService.getOlympicByCountry(country).subscribe({
                next: (data: any) => {
                    this.router.navigateByUrl(`details/${data.id}`)
                }
            })
            this.destroyRef.onDestroy(() => subscription.unsubscribe())
        }
    };
}
