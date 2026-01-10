import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FinalpageService } from "../shared/finalpage.service";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'compare',
    templateUrl: 'comparepage.component.html',
    styleUrl: 'comparepage.component.css',
    imports: [
        MatIconModule,
        MatButtonModule,
        CommonModule,
        MatCardModule, // Retaining these just in case, but probably won't use mat-card for the inner custom dashboard
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule,
        FormsModule,
    ],
    standalone: true
})
export default class ComparePageComponent implements OnInit {

    constructor(private router: Router,
        private finalpageService: FinalpageService
    ) { }

    listIndexDMDurable: any[] = [];
    selectedIndexDMDurable: number = -1;
    selectedIndexDMDurable2: number = -1;

    // Initialize with default structure
    vulnerabilities1: any = {
        v1GazEmission: '',
        v2: '',
        v3: '',
        v4HealthSecurityWorkCondition: '',
        v5BioacumulationToxicity: '',
        v6: '',
        index: 0
    };

    vulnerabilities2: any = {
        v1GazEmission: '',
        v2: '',
        v3: '',
        v4HealthSecurityWorkCondition: '',
        v5BioacumulationToxicity: '',
        v6: '',
        index: 0
    };

    ngOnInit(): void {
        this.getAllIndexDMDurable()
    }

    getAllIndexDMDurable() {
        this.finalpageService.getAllIndexDMDurable().subscribe((data: any) => {
            this.listIndexDMDurable = [];
            data.forEach((element: any) => {
                this.listIndexDMDurable.push({ id: element.id, nameOfMedicalName: element.nameOfMedicalName })
            })
        })
    }

    goTo(path: any) {
        this.router.navigate([path])
    }

    onDevice1Change() {
        if (this.selectedIndexDMDurable) {
            this.finalpageService.getAllVulnerability(this.selectedIndexDMDurable.toString()).subscribe((data: any) => {
                this.vulnerabilities1 = data;
                this.calculateIndex(this.vulnerabilities1);
            });
        }
    }

    onDevice2Change() {
        if (this.selectedIndexDMDurable2) {
            this.finalpageService.getAllVulnerability(this.selectedIndexDMDurable2.toString()).subscribe((data: any) => {
                this.vulnerabilities2 = data;
                this.calculateIndex(this.vulnerabilities2);
            });
        }
    }

    calculateIndex(vulnerabilities: any) {
        vulnerabilities.index = Number(vulnerabilities.v1GazEmission +
            vulnerabilities.v2 +
            vulnerabilities.v3 +
            vulnerabilities.v4HealthSecurityWorkCondition +
            vulnerabilities.v5BioacumulationToxicity +
            vulnerabilities.v6) / 6;

        vulnerabilities.index = Math.round(Number(vulnerabilities.index) * 10) / 10;
    }

}
