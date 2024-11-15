import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
    selector: 'app-details',
    standalone: true,
    imports: [HeaderComponent],
    templateUrl: './details.component.html',
    styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
    private route = inject(ActivatedRoute)
    public countryId!: string | null

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.countryId = params.get('id')
        })
    }
}
