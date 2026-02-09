import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";
import {Router} from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import {MatCardModule} from '@angular/material/card';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDividerModule} from "@angular/material/divider";
import {V6InclusionAndDiversityService} from "../shared/v6InclusionAndDiversity.service";
import {HotToastService} from "@ngxpert/hot-toast";
import {AppConstants} from "../app.constant";
import {of, switchMap, tap} from "rxjs";

@Component({
    selector:'v6InclusionAndDiversity',
    templateUrl: 'v6InclusionAndDiversity.component.html',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        ReactiveFormsModule,
        CommonModule,
        MatRadioModule,
        MatSelectModule,
        MatFormField,
        MatLabel,
        MatInputModule,
        MatCheckboxModule,
        MatDividerModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class V6InclusionAndDiversityComponent implements OnInit{

    v6Form = new FormGroup({
        id: new FormControl<number>(0, Validators.min(0)),
        
        // Critère 1 - Composition démographique
        youngEmploymentPercentage: new FormControl<number | null>(null, [Validators.required]),
        seniorEmploymentPercentage: new FormControl<number | null>(null, [Validators.required]),
        womenManagementPercentage: new FormControl<number | null>(null, [Validators.required]),
        
        // Critère 2 - Équité salariale
        menAverageHourlyWage: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
        womenAverageHourlyWage: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
        
        // Critère 3 - Accessibilité et inclusion des personnes en situation de handicap
        disabledEmployeesCount: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
        totalEmployeesCount: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
        
        // Critère 4 - Lutte contre les discriminations
        discriminationOrganizationInPlace: new FormControl<boolean | null>(null, [Validators.required]),
        followUpAlerts: new FormControl<boolean | null>(null)
    })

    // Computed values for intermediate calculations
    demographicCompositionPoints: number | null = null;
    salarialEquityPoints: number | null = null;
    salarialEquityGap: number | null = null;
    accessibilityAndInclusionPoints: number | null = null;
    disabledEmployeesPercentage: number | null = null;
    antidiscriminationPoints: number | null = null;
    
    // store computed vulnerability/points (sum of all)
    vulnerability: number | null = null

    constructor(
        private router: Router,
        private v6Service: V6InclusionAndDiversityService,
        private toastService: HotToastService,
        private cd: ChangeDetectorRef
    ){

    }

    ngOnInit(): void {
        const dmId = localStorage.getItem('id-index-dm-durable');
        if (dmId) {
            this.loadV6Data(Number(dmId));
        }
        
        // Subscribe to form changes to automatically calculate intermediate values
        this.v6Form.valueChanges.subscribe(() => {
            this.calculateAllMetrics();
        });

        // Initial calculation
        this.calculateAllMetrics();
    }

    loadV6Data(dmId: number) {
        this.v6Service.getV6Data(dmId).subscribe({
            next: (data: any) => {
                if (data) {
                    this.v6Form.patchValue(data);
                    this.calculateAllMetrics();
                    this.cd.detectChanges();
                }
            },
            error: (err) => {
                console.log('Aucune donnée V6 trouvée pour cet ID');
            }
        });
    }

    calculateAllMetrics() {
        this.calculateDemographicComposition();
        this.calculateSalarialEquity();
        this.calculateAccessibilityAndInclusion();
        this.calculateAntidiscrimination();
        this.calculateVulnerability();
        this.cd.detectChanges();
    }

    calculateDemographicComposition() {
        const youngPercentage = this.v6Form.value.youngEmploymentPercentage;
        const seniorPercentage = this.v6Form.value.seniorEmploymentPercentage;
        const womenManagementPercentage = this.v6Form.value.womenManagementPercentage;

        let youngPoints = 0;
        let seniorPoints = 0;
        let womenManagementPoints = 0;

        // Tableau 21 - Emploi des jeunes et des seniors
        if (youngPercentage !== null && youngPercentage !== undefined) {
            if (youngPercentage >= 0 && youngPercentage < 10) {
                youngPoints = 1;
            } else if (youngPercentage >= 10 && youngPercentage < 20) {
                youngPoints = 3;
            } else if (youngPercentage >= 20) {
                youngPoints = 5;
            }
        }

        if (seniorPercentage !== null && seniorPercentage !== undefined) {
            if (seniorPercentage >= 0 && seniorPercentage < 10) {
                seniorPoints = 1;
            } else if (seniorPercentage >= 10 && seniorPercentage < 20) {
                seniorPoints = 3;
            } else if (seniorPercentage >= 20) {
                seniorPoints = 5;
            }
        }

        // Tableau 22 - Répartition par sexe dans l'encadrement supérieur
        if (womenManagementPercentage !== null && womenManagementPercentage !== undefined) {
            if (womenManagementPercentage >= 0 && womenManagementPercentage < 30) {
                womenManagementPoints = 2;
            } else if (womenManagementPercentage >= 30 && womenManagementPercentage < 50) {
                womenManagementPoints = 6;
            } else if (womenManagementPercentage >= 50) {
                womenManagementPoints = 10;
            }
        }

        this.demographicCompositionPoints = youngPoints + seniorPoints + womenManagementPoints;
    }

    calculateSalarialEquity() {
        const menWage = this.v6Form.value.menAverageHourlyWage;
        const womenWage = this.v6Form.value.womenAverageHourlyWage;

        if (menWage !== null && menWage !== undefined && womenWage !== null && womenWage !== undefined && menWage > 0) {
            // Écart F/H = (RmoyH - RmoyF) / RmoyH
            this.salarialEquityGap = ((menWage - womenWage) / menWage) * 100;

            // Tableau 23 - Attribution des points selon l'écart
            if (this.salarialEquityGap >= 0 && this.salarialEquityGap < 1) {
                this.salarialEquityPoints = 20;
            } else if (this.salarialEquityGap >= 1 && this.salarialEquityGap < 5) {
                this.salarialEquityPoints = 12;
            } else if (this.salarialEquityGap >= 5 && this.salarialEquityGap < 10) {
                this.salarialEquityPoints = 4;
            } else if (this.salarialEquityGap >= 10) {
                this.salarialEquityPoints = 0;
            }
        } else {
            this.salarialEquityGap = null;
            this.salarialEquityPoints = null;
        }
    }

    calculateAccessibilityAndInclusion() {
        const disabledCount = this.v6Form.value.disabledEmployeesCount;
        const totalCount = this.v6Form.value.totalEmployeesCount;

        if (disabledCount !== null && disabledCount !== undefined && 
            totalCount !== null && totalCount !== undefined && totalCount > 0) {
            // Représentativité = Nbh / Nb * 100
            this.disabledEmployeesPercentage = (disabledCount / totalCount) * 100;

            // Tableau 24 - Attribution des points selon le taux de représentativité
            if (this.disabledEmployeesPercentage >= 0 && this.disabledEmployeesPercentage < 3) {
                this.accessibilityAndInclusionPoints = 4;
            } else if (this.disabledEmployeesPercentage >= 3 && this.disabledEmployeesPercentage < 9) {
                this.accessibilityAndInclusionPoints = 12;
            } else if (this.disabledEmployeesPercentage >= 9) {
                this.accessibilityAndInclusionPoints = 20;
            }
        } else {
            this.disabledEmployeesPercentage = null;
            this.accessibilityAndInclusionPoints = null;
        }
    }

    calculateAntidiscrimination() {
        const organizationInPlace = this.v6Form.value.discriminationOrganizationInPlace;
        const followUpAlerts = this.v6Form.value.followUpAlerts;

        if (organizationInPlace === false) {
            this.antidiscriminationPoints = 0;
        } else if (organizationInPlace === true) {
            if (followUpAlerts === false) {
                this.antidiscriminationPoints = 12;
            } else if (followUpAlerts === true) {
                this.antidiscriminationPoints = 20;
            } else {
                this.antidiscriminationPoints = null;
            }
        } else {
            this.antidiscriminationPoints = null;
        }
    }

    calculateVulnerability() {
        const criterion1 = this.demographicCompositionPoints;
        const criterion2 = this.salarialEquityPoints;
        const criterion3 = this.accessibilityAndInclusionPoints;
        const criterion4 = this.antidiscriminationPoints;

        if (criterion1 !== null && criterion2 !== null && criterion3 !== null && criterion4 !== null) {
            const total = criterion1 + criterion2 + criterion3 + criterion4;
            // Multiplier par 0.25 pour obtenir une note sur 20
            this.vulnerability = total * 0.25;
        } else {
            this.vulnerability = null;
        }
    }

    goTo(path: any) {
        this.router.navigate([path])
    }

    save() {
        const dmId = localStorage.getItem('id-index-dm-durable')
        if (!dmId) {
            this.toastService.error('Aucune simulation en cours. Merci de démarrer depuis l\'accueil.')
            return;
        }

        // Validation spécifique pour totalEmployeesCount (avant la validation générale)
        const totalEmployeesCount = this.v6Form.value.totalEmployeesCount;
        if (totalEmployeesCount !== null && totalEmployeesCount !== undefined && totalEmployeesCount < 1) {
            this.toastService.error('Le nombre total d\'employé doit être supérieur à 0', {
                duration: AppConstants.LONG_TEXT_DURATION,
                dismissible: true
            });
            this.cd.detectChanges();
            return;
        }

        // Validation spécifique pour disabledEmployeesCount
        const disabledEmployeesCount = this.v6Form.value.disabledEmployeesCount;
        if (disabledEmployeesCount !== null && disabledEmployeesCount !== undefined && disabledEmployeesCount < 0) {
            this.toastService.error('Le nombre de personnes en situation de handicap ne peut pas être négatif', {
                duration: AppConstants.LONG_TEXT_DURATION,
                dismissible: true
            });
            this.cd.detectChanges();
            return;
        }

        if (disabledEmployeesCount !== null && disabledEmployeesCount !== undefined && 
            totalEmployeesCount !== null && totalEmployeesCount !== undefined && 
            disabledEmployeesCount > totalEmployeesCount) {
            this.toastService.error('Le nombre de personnes en situation de handicap ne peut pas dépasser le nombre total d\'employés', {
                duration: AppConstants.LONG_TEXT_DURATION,
                dismissible: true
            });
            this.cd.detectChanges();
            return;
        }

        if (!this.v6Form.valid) {
            this.v6Form.markAllAsTouched()
            this.toastService.error('Veuillez compléter tous les champs obligatoires avant d\'enregistrer.')
            this.cd.detectChanges()
            return;
        }

        this.v6Service.save(this.v6Form.value).pipe(
            tap((res: any) => {
                this.toastService.success('Vulnérabilité 6 validé', {
                    duration: AppConstants.LONG_TEXT_DURATION,
                    dismissible: true
                })
                this.v6Form.patchValue({ id: res.id })
            }),
            switchMap((res: any) => {
                if (res && res.id) {
                    return this.v6Service.getVulnerability(res.id)
                }
                return of(null);
            }),
        ).subscribe({
            next: (vulnRes: any) => {
                this.vulnerability = vulnRes
                this.cd.detectChanges()
            },
            error: () => {
                this.toastService.error('Échec de l\'enregistrement de la vulnérabilité 6. Merci de réessayer.')
            }
        })
    }

}
