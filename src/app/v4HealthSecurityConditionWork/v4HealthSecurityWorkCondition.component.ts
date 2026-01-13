import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ValueChangeEvent } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormField } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router"
import { V4HealthSecurityWorkCondtionService } from "../shared/v4HealthSecurityWorkCondition.service";
import { HotToastService } from "@ngxpert/hot-toast";
import { AppConstants } from "../app.constant";
import { of, switchMap, tap } from "rxjs";
import { MatCheckboxModule } from "@angular/material/checkbox";
@Component({
	selector: 'v4HealthSecurityWorkCondition',
	templateUrl: 'v4HealthSecurityWorkCondition.component.html',
	imports: [
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		MatFormField,
		MatInputModule,
		ReactiveFormsModule,
		CommonModule,
		MatDividerModule,
		MatCheckboxModule
	]
})
export class V4HealthSecurityWorkConditionComponent implements OnInit {


	v4HealthSecurityWorkConditionForm = new FormGroup({
		id: new FormControl<Number>(0, Validators.min(0)),
		averageHealthInvest: new FormControl<Number>(0, [Validators.required, Validators.min(0)]),
		totalHealhInvest: new FormControl<Number>(0, [Validators.required, Validators.min(0)]),
		budgetWorkHealthSecurity: new FormControl<Number>(0, [Validators.required, Validators.min(0)]),
		totalWorkerNumber: new FormControl<Number>(0, [Validators.required, Validators.min(0)]),
		scoreSPI: new FormControl<Number>(0, [Validators.required, Validators.max(100), Validators.min(0)]),
		healthSecurityPrevention: new FormControl<Number>(0, [Validators.required, Validators.min(0), Validators.max(100)]),
		workDeath: new FormControl(false),
		workAccidentNumber: new FormControl<Number>(0, [Validators.required, Validators.min(0)]),
		totalWorkHour: new FormControl<Number>(0, [Validators.required, Validators.min(0)])
	})
	showInvestStatement = false;
	showBudgetStatement = false;
	showWorkAccidentStatement = false;
	showBudgetDangerStatement = false;
	showInvestDangerStatement = false;
	vulnerability = null;

	constructor(
		private router: Router,
		private v4HealthSecurityWorkConditionService: V4HealthSecurityWorkCondtionService,
		private toastService: HotToastService,
		private cd: ChangeDetectorRef
	) {

	}
	ngOnInit(): void {
		if (localStorage.getItem('all-vs')) {
			this.refresh()
		}
	}

	refresh() {
		const allVs = JSON.parse(localStorage.getItem('all-vs')!)
		this.v4HealthSecurityWorkConditionForm.patchValue({ averageHealthInvest: allVs.v4HealthSecurityWorkCondition.averageHealthInvest })
		this.v4HealthSecurityWorkConditionForm.patchValue({ totalHealhInvest: allVs.v4HealthSecurityWorkCondition.totalHealhInvest })
		this.v4HealthSecurityWorkConditionForm.patchValue({ budgetWorkHealthSecurity: allVs.v4HealthSecurityWorkCondition.budgetWorkHealthSecurity })
		this.v4HealthSecurityWorkConditionForm.patchValue({ totalWorkerNumber: allVs.v4HealthSecurityWorkCondition.totalWorkerNumber })
		this.v4HealthSecurityWorkConditionForm.patchValue({ scoreSPI: allVs.v4HealthSecurityWorkCondition.scoreSPI })
		this.v4HealthSecurityWorkConditionForm.patchValue({ healthSecurityPrevention: allVs.v4HealthSecurityWorkCondition.healthSecurityPrevention })
		this.v4HealthSecurityWorkConditionForm.patchValue({ workDeath: allVs.v4HealthSecurityWorkCondition.workDeath })
		this.v4HealthSecurityWorkConditionForm.patchValue({ workAccidentNumber: allVs.v4HealthSecurityWorkCondition.workAccidentNumber })
		this.v4HealthSecurityWorkConditionForm.patchValue({ totalWorkHour: allVs.v4HealthSecurityWorkCondition.totalWorkHour })
		this.cd.detectChanges()
	}

	goTo(path: any) {
		this.router.navigate([path])
	}

	showInvestInfo() {
		this.showInvestStatement = this.showInvestStatement ? false : true
	}

	showBudgetInfo() {
		this.showBudgetStatement = this.showBudgetStatement ? false : true
	}

	showWorkAccidentInfo() {
		this.showWorkAccidentStatement = this.showWorkAccidentStatement ? false : true
	}

	showInvestDanger() {
		this.showInvestDangerStatement = this.showInvestDangerStatement ? false : true
	}

	showBudgetDanger() {
		this.showBudgetDangerStatement = this.showBudgetDangerStatement ? false : true
	}

	save() {
		if (!this.v4HealthSecurityWorkConditionForm.valid) {
			return;
		}
		this.v4HealthSecurityWorkConditionService.save(this.v4HealthSecurityWorkConditionForm.value).pipe(
			//Step 1 before calling step 2 request
			tap((res: any) => {
				this.toastService.success('Vulnérabilité 4 validé', {
					duration: AppConstants.LONG_TEXT_DURATION,
					dismissible: true
				})
				this.v4HealthSecurityWorkConditionForm.patchValue({ id: res.id })
			}),
			//After getting the id form the first step you can call the second request
			switchMap((res: any) => {
				if (res && res.id) {
					return this.v4HealthSecurityWorkConditionService.getVulnerability(res.id)
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
