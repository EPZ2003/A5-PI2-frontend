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
import {V2WaterConsumptionService} from "../shared/v2WaterConsumption.service";
import {HotToastService} from "@ngxpert/hot-toast";
import {AppConstants} from "../app.constant";
import {of, switchMap, tap} from "rxjs";

@Component({
    selector:'v2WaterConsumption',
    templateUrl: 'v2WaterConsumption.component.html',
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
export class V2WaterConsumptionComponent implements OnInit{

    v2WaterForm = new FormGroup({
        id: new FormControl<number>(0,Validators.min(0)),
        
        // Critère 1 - Élément 1: Consommation en eau pour la fabrication (Tableau 9 - page 36)
        waterMadeQuantity: new FormControl<number | null>(null, [Validators.required]),
        
        // Critère 1 - Élément 2: Consommation en eau à l'usage (Tableau 10 - page 36)
        waterConsommationQuantity: new FormControl<number | null>(null, [Validators.required]),
        
        // Critère 2: Réutilisabilité de l'eau (page 37)
        noWaterNeed: new FormControl<boolean>(false, [Validators.required]),
        totalReusedWater: new FormControl<number | null>(null, [Validators.min(0)]),
        totalConsumedWater: new FormControl<number | null>(null, [Validators.min(0)])
    })

    // store computed vulnerability/points (sum of all)
    vulnerability: number | null = null
    
    // Variables pour afficher les calculs intermédiaires
    reusabilityWaterPercentage: number | null = null
    reusabilityWaterPoints: number | null = null

    constructor(
        private router: Router,
        private v2WaterConsumptionService: V2WaterConsumptionService,
        private toastService: HotToastService,
        private cd: ChangeDetectorRef
    ){

    }

    ngOnInit(): void {
        const dmId = localStorage.getItem('id-index-dm-durable');
        if (dmId) {
            this.loadV2Data(Number(dmId));
        }
        
        // S'abonner aux changements pour calculer automatiquement la réutilisabilité
        this.v2WaterForm.valueChanges.subscribe(() => {
            this.calculateReusability();
        });
    }

    loadV2Data(dmId: number) {
        this.v2WaterConsumptionService.getV2Data(dmId).subscribe({
            next: (data: any) => {
                if (data) {
                    this.v2WaterForm.patchValue(data);
                    this.calculateReusability();
                    this.cd.detectChanges();
                }
            },
            error: (err) => {
                console.log('Aucune donnée V2 trouvée pour cet ID');
            }
        });
    }
    
    calculateReusability() {
        const noWaterNeed = this.v2WaterForm.value.noWaterNeed;
        const totalReused = this.v2WaterForm.value.totalReusedWater;
        const totalConsumed = this.v2WaterForm.value.totalConsumedWater;
        
        // Si pas besoin d'eau, on attribue directement 5 points
        if (noWaterNeed) {
            this.reusabilityWaterPercentage = null;
            this.reusabilityWaterPoints = 5;
        } else if (!noWaterNeed && totalReused !== null && totalReused !== undefined && totalConsumed !== null && totalConsumed !== undefined && totalConsumed > 0) {
            // Calcul du pourcentage: (Qté totale d'eau réutilisée / Qté totale d'eau consommée) × 100
            this.reusabilityWaterPercentage = (totalReused / totalConsumed) * 100;
            
            // Attribution des points selon le Tableau 11
            if (this.reusabilityWaterPercentage >= 0 && this.reusabilityWaterPercentage < 1) {
                this.reusabilityWaterPoints = 0;
            } else if (this.reusabilityWaterPercentage >= 1 && this.reusabilityWaterPercentage < 30) {
                this.reusabilityWaterPoints = 1;
            } else if (this.reusabilityWaterPercentage >= 30 && this.reusabilityWaterPercentage < 60) {
                this.reusabilityWaterPoints = 3;
            } else if (this.reusabilityWaterPercentage >= 60 && this.reusabilityWaterPercentage <= 100) {
                this.reusabilityWaterPoints = 5;
            }
        } else {
            this.reusabilityWaterPercentage = null;
            this.reusabilityWaterPoints = null;
        }
        
        this.cd.detectChanges();
    }

    goTo(path:any){
        this.router.navigate([path])
    }

    save(){
        const dmId = localStorage.getItem('id-index-dm-durable')
        if (!dmId) {
            this.toastService.error('Aucune simulation en cours. Merci de démarrer depuis l\'accueil.')
            return;
        }

        // Validation conditionnelle selon noWaterNeed
        const noWaterNeed = this.v2WaterForm.value.noWaterNeed;
        if (!noWaterNeed) {
            // Si besoin d'eau, les champs totalReusedWater et totalConsumedWater sont requis
            if ((this.v2WaterForm.value.totalReusedWater === null || this.v2WaterForm.value.totalReusedWater === undefined) ||
                (this.v2WaterForm.value.totalConsumedWater === null || this.v2WaterForm.value.totalConsumedWater === undefined)) {
                this.v2WaterForm.markAllAsTouched()
                this.toastService.error('Veuillez compléter les quantités d\'eau pour la réutilisabilité.')
                this.cd.detectChanges()
                return;
            }
        }

        if ((this.v2WaterForm.value.waterMadeQuantity === null || this.v2WaterForm.value.waterMadeQuantity === undefined) ||
            (this.v2WaterForm.value.waterConsommationQuantity === null || this.v2WaterForm.value.waterConsommationQuantity === undefined)) {
            this.v2WaterForm.markAllAsTouched()
            this.toastService.error('Veuillez compléter tous les champs obligatoires avant d\'enregistrer.')
            this.cd.detectChanges()
            return;
        }
        
        // Préparer les données à envoyer
        const dataToSend = {
            ...this.v2WaterForm.value,
            // Si noWaterNeed est true, on force les valeurs à null pour que le backend comprenne
            totalReusedWater: this.v2WaterForm.value.noWaterNeed ? null : this.v2WaterForm.value.totalReusedWater,
            totalConsumedWater: this.v2WaterForm.value.noWaterNeed ? null : this.v2WaterForm.value.totalConsumedWater
        };
        
        // It's like the pipe is a huge request instead of 2 separates requests 
        this.v2WaterConsumptionService.save(dataToSend).pipe(
            // From the first request do actions with the first return 
            tap((res: any) => {
                this.toastService.success('Vulnérabilité 2 validé', {
                    duration: AppConstants.LONG_TEXT_DURATION,
                    dismissible: true
                })
                this.v2WaterForm.patchValue({ id: res.id })
            }),
            // When you want to call the second request and using res items from the first item without update the html page 
            switchMap((res: any) => {
                if (res && res.id) {
                    return this.v2WaterConsumptionService.getVulnerability(res.id)
                }
                return of(null); // Handle case where save fails / returns
            }),
            // Then bring data from the second request with the next item and finally update the html page	
        ).subscribe({
            next: (vulnRes: any) => {
                this.vulnerability = vulnRes
                this.cd.detectChanges()
            },
            error: () => {
                this.toastService.error('Échec de l\'enregistrement de la vulnérabilité 2. Merci de réessayer.')
            }
        })
    }

}
