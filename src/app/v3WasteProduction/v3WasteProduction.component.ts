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
import {V3WasteProductionService} from "../shared/v3WasteProduction.service";
import {HotToastService} from "@ngxpert/hot-toast";
import {AppConstants} from "../app.constant";
import {of, switchMap, tap} from "rxjs";

@Component({
    selector:'v3WasteProduction',
    templateUrl: 'v3WasteProduction.component.html',
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
export class V3WasteProductionComponent implements OnInit{

    v3WasteForm = new FormGroup({
        id: new FormControl<number>(0,Validators.min(0)),
        
        // Critère 1 - Élément 1: Proportion de matériaux recyclés (page 39-40)
        containsRecycledMaterial: new FormControl<boolean | null>(null, [Validators.required]),
        technicalConstraintsPreventRecycled: new FormControl<boolean>(false),
        
        // Critère 1 - Élément 2: Séparabilité des parties du dispositif (page 40)
        separabilitySituation: new FormControl<string | null>(null, [Validators.required]),
        hasSeparationProcedure: new FormControl<boolean>(false),
        
        // Critère 2 - Élément 1: Proportion de matériau recyclable (page 41)
        packagingRecyclableMass: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
        packagingTotalMass: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
        hasNationalRecyclingChannel: new FormControl<boolean>(true),
        
        // Critère 2 - Élément 2: Matériaux recyclés utilisés pour l'emballage (page 42)
        packagingRecycledMass: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
        packagingTotalMassForRecycled: new FormControl<number | null>(null, [Validators.required, Validators.min(0)])
    })

    // store computed vulnerability/points (sum of all)
    vulnerability: number | null = null

    constructor(
        private router: Router,
        private v3WasteProductionService: V3WasteProductionService,
        private toastService: HotToastService,
        private cd: ChangeDetectorRef
    ){

    }

    ngOnInit(): void {
        const dmId = localStorage.getItem('id-index-dm-durable');
        if (dmId) {
            this.loadV3Data(Number(dmId));
        }
    }

    loadV3Data(dmId: number) {
        this.v3WasteProductionService.getV3Data(dmId).subscribe({
            next: (data: any) => {
                if (data) {
                    this.v3WasteForm.patchValue(data);
                    this.cd.detectChanges();
                }
            },
            error: (err) => {
                console.log('Aucune donnée V3 trouvée pour cet ID');
            }
        });
    }

    goTo(path:any){
        this.router.navigate([path])
    }

    save(){
        if (!this.v3WasteForm.valid) {
            return;
        }
        
        // It's like the pipe is a huge request instead of 2 separates requests 
        this.v3WasteProductionService.save(this.v3WasteForm.value).pipe(
            // From the first request do actions with the first return 
            tap((res: any) => {
                this.toastService.success('Vulnérabilité 3 validé', {
                    duration: AppConstants.LONG_TEXT_DURATION,
                    dismissible: true
                })
                this.v3WasteForm.patchValue({ id: res.id })
            }),
            // When you want to call the second request and using res items from the first item without update the html page 
            switchMap((res: any) => {
                if (res && res.id) {
                    return this.v3WasteProductionService.getVulnerability(res.id)
                }
                return of(null); // Handle case where save fails / returns
            }),
            // Then bring data from the second request with the next item and finally update the html page	
        ).subscribe({
            next: (vulnRes: any) => {
                this.vulnerability = vulnRes
                this.cd.detectChanges()
            }
        })
    }

}
