import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component } from "@angular/core";
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
export class V5BioacumulationToxicity {

	V5BioacumulationToxicityForm = new FormGroup({
		id: new FormControl<Number>(0, Validators.min(0)),
		// Logic schema page 55 Figure 1
		makingProcessRisk: new FormControl(false),
		makingProcessProtectionMeasure: new FormControl(false),
		// Logic schema  page 57 Figure 2 
		finalProductRiskMatter: new FormControl(false),
		finalProductConcentration: new FormControl(false),
		finalProductContactAbsence: new FormControl(false),
	})

	finalProductInfoStatement = false;
	vulnerability = null;

	constructor(
		private router: Router,
		private v5BioacumulationToxicityService: V5BioacumulationToxicityService,
		private toastService: HotToastService,
		private cd: ChangeDetectorRef
	) { }


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
