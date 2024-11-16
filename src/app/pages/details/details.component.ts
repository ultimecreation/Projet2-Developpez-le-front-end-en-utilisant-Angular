import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'app-details',
    standalone: true,
    imports: [HeaderComponent, BaseChartDirective, RouterLink],
    templateUrl: './details.component.html',
    styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
    private route = inject(ActivatedRoute)
    private olympicService = inject(OlympicService)
    private destroyRef = inject(DestroyRef)


    public details$: any;

    public countryName: string = ''
    public totalParticipationsCount: number = 0
    public totalMedalsCount: number = 0
    public totalAtheletesCount: number = 0

    public countryId!: string | null
    public barChartData: ChartConfiguration<'bar'>['data'] = {
        datasets: [{ data: [] }]
    };
    public barChartOptions: ChartOptions<'bar'> = {
        responsive: true,
    };

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.countryId = params.get('id')
        })

        const subscription = this.olympicService.getOlympicById(this.countryId as string).subscribe((data: any) => {
            this.details$ = data
            this.countryName = this.details$.country
            this.totalParticipationsCount = this.details$.participations.length
            for (let participation of this.details$.participations) {

                this.barChartData.datasets[0].data.push(participation.medalsCount)
                this.barChartData.datasets[0].label = 'Medals'
                this.barChartData.labels?.push(participation.year)

                this.totalMedalsCount += participation.medalsCount
                this.totalAtheletesCount += participation.athleteCount
            }
        })

        this.destroyRef.onDestroy(() => subscription.unsubscribe())
    }
}
