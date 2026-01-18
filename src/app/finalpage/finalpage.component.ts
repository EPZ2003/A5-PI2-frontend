import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Router, ActivatedRoute } from "@angular/router";
import { FinalpageService } from "../shared/finalpage.service";

@Component({
    selector: 'finalpage',
    templateUrl: 'finalpage.component.html',
    styleUrl: 'finalpage.component.css',
    imports: [
        MatIconModule,
        MatButtonModule,
        CommonModule
    ],
})
export class FinalPageComponent implements OnInit {


    constructor(
        private router: Router,
        private finalpageService: FinalpageService,
        private route: ActivatedRoute
    ) { }

    vulnerabilities = {
        v1GazEmission: '',
        v2WaterConsumption: '',
        v3WasteProduction: '',
        v4HealthSecurityWorkCondition: '',
        v5BioacumulationToxicity: '',
        v6InclusionAndDiversity: '',
        index: 0,
    };


    ngOnInit(): void {
        const data = this.route.snapshot.data['vulnerabilities'];
        if (data) {
            this.vulnerabilities = data;
            this.vulnerabilities.index = Number(this.vulnerabilities.v1GazEmission +
                this.vulnerabilities.v2WaterConsumption +
                this.vulnerabilities.v3WasteProduction +
                this.vulnerabilities.v4HealthSecurityWorkCondition +
                this.vulnerabilities.v5BioacumulationToxicity +
                this.vulnerabilities.v6InclusionAndDiversity) / 6;

            this.roundIndex();
        }

    }

    roundIndex() {
        this.vulnerabilities.index = Math.round(Number(this.vulnerabilities.index) * 10) / 10;
    }

    goTo(path: any) {
        this.router.navigate([path])
    }

}
