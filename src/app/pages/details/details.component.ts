import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicInterface } from 'src/app/core/models/Olympic';
import { ErrorComponent } from "../../components/error/error.component";

@Component({
    selector: 'app-details',
    standalone: true,
    imports: [HeaderComponent, BaseChartDirective, RouterLink, ErrorComponent],
    templateUrl: './details.component.html',
    styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
    private route = inject(ActivatedRoute)
    private olympicService = inject(OlympicService)
    private destroyRef = inject(DestroyRef)


    public details$: OlympicInterface | undefined;
    public errorMsg: string = '';
    public countryName: string | undefined
    public totalParticipationsCount: number = 0
    public totalMedalsCount: number = 0
    public totalAtheletesCount: number = 0

    public countryId!: number
    public barChartData: ChartConfiguration<'bar'>['data'] = {
        datasets: [{ data: [] }]
    };
    public barChartOptions: ChartOptions<'bar'> = {
        responsive: true,
    };

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id')
            this.countryId = Number(id)
        })

        const subscription = this.olympicService.getOlympicById(this.countryId).subscribe((data: OlympicInterface | undefined) => {
            this.details$ = data
            // this.details$ = undefined

            if (!this.details$) {
                return this.errorMsg = 'An error occured while retriving data'
            }

            this.countryName = this.details$?.country
            this.totalParticipationsCount = this.details$?.participations.length
            for (let participation of this.details$?.participations) {

                this.barChartData.datasets[0].data.push(participation.medalsCount)
                this.barChartData.datasets[0].label = 'Medals'
                this.barChartData.labels?.push(participation.year)

                this.totalMedalsCount += participation.medalsCount
                this.totalAtheletesCount += participation.athleteCount
            }
            return
        })

        this.destroyRef.onDestroy(() => subscription.unsubscribe())
    }
}
