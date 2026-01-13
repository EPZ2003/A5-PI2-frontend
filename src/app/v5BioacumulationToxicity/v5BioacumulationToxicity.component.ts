import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormField } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { Router } from "@angular/router";
import { V5BioacumulationToxicityService } from "../shared/v5BioacumulationToxicity.service";
import { HotToastService } from "@ngxpert/hot-toast";
import { AppConstants } from "../app.constant";
import { of, switchMap, tap } from "rxjs";

@Component({
	selector: 'v5BioacumulationToxicity',
	templateUrl: 'v5BioacumulationToxicity.component.html',
	imports: [
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		MatFormField,
		MatInputModule,
		ReactiveFormsModule,
		CommonModule,
		MatDividerModule,
		MatRadioModule
	]
})
export class V5BioacumulationToxicity implements OnInit {

	V5BioacumulationToxicityForm = new FormGroup({
		id: new FormControl<Number>(0, Validators.min(0)),
		// Logic schema 1 page 55 Figure 1
		makingProcessRisk: new FormControl(false),
		makingProcessProtectionMeasure: new FormControl(false),
		// Logic schema 2 page 57 Figure 2 
		finalProductRiskMatter: new FormControl(false),
		finalProductConcentration: new FormControl(false),
		finalProductContactAbsence: new FormControl(false),
		// Logic schema 3 page 59
		labelWeitherClear: new FormControl(false),
		labelPresencePicto: new FormControl(false),
		labelTauxInferior: new FormControl(false),
		//Logic schema 4 page 60
		informationReadablity: new FormControl(false),
		informationWithFds: new FormControl(false),
		informationPresence: new FormControl(false),
	})

	finalProductInfoStatement = false;
	vulnerability = null;

	constructor(
		private router: Router,
		private v5BioacumulationToxicityService: V5BioacumulationToxicityService,
		private toastService: HotToastService,
		private cd: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		if (localStorage.getItem('all-vs')) {
			this.refresh()
		}
	}

	refresh() {
		//Need to be re-work
		const allVs = JSON.parse(localStorage.getItem('all-vs')!)
		this.V5BioacumulationToxicityForm.patchValue({ makingProcessRisk: allVs.v5BioacumulationToxicity.makingProcessRisk })
		this.V5BioacumulationToxicityForm.patchValue({ makingProcessProtectionMeasure: allVs.v5BioacumulationToxicity.makingProcessProtectionMeasure })
		this.V5BioacumulationToxicityForm.patchValue({ finalProductRiskMatter: allVs.v5BioacumulationToxicity.finalProductRiskMatter })
		this.V5BioacumulationToxicityForm.patchValue({ finalProductConcentration: allVs.v5BioacumulationToxicity.finalProductConcentration })
		this.V5BioacumulationToxicityForm.patchValue({ finalProductContactAbsence: allVs.v5BioacumulationToxicity.finalProductContactAbsence })
		this.V5BioacumulationToxicityForm.patchValue({ labelWeitherClear: allVs.v5BioacumulationToxicity.labelWeitherClear })
		this.V5BioacumulationToxicityForm.patchValue({ labelPresencePicto: allVs.v5BioacumulationToxicity.labelPresencePicto })
		this.V5BioacumulationToxicityForm.patchValue({ labelTauxInferior: allVs.v5BioacumulationToxicity.labelTauxInferior })
		this.V5BioacumulationToxicityForm.patchValue({ informationReadablity: allVs.v5BioacumulationToxicity.informationReadablity })
		this.V5BioacumulationToxicityForm.patchValue({ informationWithFds: allVs.v5BioacumulationToxicity.informationWithFds })
		this.V5BioacumulationToxicityForm.patchValue({ informationPresence: allVs.v5BioacumulationToxicity.informationPresence })
		this.cd.detectChanges()
	}

	goTo(path: any) {
		this.router.navigate([path])
	}

	openInfoFinishProduct() {
		this.finalProductInfoStatement = this.finalProductInfoStatement ? false : true
	}

	save() {

		if (!this.V5BioacumulationToxicityForm.valid) {
			return;
		}
		//In case the user changes its radio buttons choice's 
		if (!this.V5BioacumulationToxicityForm.get('makingProcessRisk')?.value) {
			this.V5BioacumulationToxicityForm.patchValue({ makingProcessProtectionMeasure: false })
		}
		this.v5BioacumulationToxicityService.save(this.V5BioacumulationToxicityForm.value).pipe(
			//Step 1 before calling step 2 request
			tap((res: any) => {
				this.toastService.success('Vulnérabilité 5 validé', {
					duration: AppConstants.LONG_TEXT_DURATION,
					dismissible: true
				})
				this.V5BioacumulationToxicityForm.patchValue({ id: res.id })
			}),
			//After getting the id form the first step you can call the second request
			switchMap((res: any) => {
				if (res && res.id) {
					return this.v5BioacumulationToxicityService.getVulnerability(res.id)
				}
				return of(null);
			})
			// Then finally get the data from the second request and after that reload the html page 
		).subscribe({
			next: (vulnRes: any) => {
				this.vulnerability = vulnRes
				//To force to update the page
				this.cd.detectChanges()
			}
		})
	}

}
