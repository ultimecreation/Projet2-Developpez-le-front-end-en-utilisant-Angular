import { Component, Input } from '@angular/core';
import { HeaderDataInterface } from 'src/app/core/models/HeaderData';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})

export class HeaderComponent {

    @Input() title: string = ''
    @Input() headerData!: HeaderDataInterface[]
}
