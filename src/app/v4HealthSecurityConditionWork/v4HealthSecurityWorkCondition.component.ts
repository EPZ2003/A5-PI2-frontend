import {CommonModule} from "@angular/common";
import {Component} from "@angular/core";
import {FormControl, FormGroup, ReactiveFormsModule, Validators, ValueChangeEvent} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormField} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {Router} from "@angular/router"
import {V4HealthSecurityWorkCondtionService} from "../shared/v4HealthSecurityWorkCondition.service";
import {HotToastService} from "@ngxpert/hot-toast";
import {AppConstants} from "../app.constant";
import {tap} from "rxjs";
@Component({
	selector: 'v4HealthSecurityWorkCondition',
	templateUrl :'v4HealthSecurityWorkCondition.component.html',
	imports: [
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		MatFormField,
		MatInputModule,
		ReactiveFormsModule,
		CommonModule,
		MatDividerModule,
	]
})
export class V4HealthSecurityWorkConditionComponent {
	
	
	v4HealthSecurityWorkConditionForm = new FormGroup({
		id: new FormControl<Number>(0,Validators.min(0)),
		averageHealthInvest : new FormControl<Number>(0,[Validators.required,Validators.min(0)]),
		totalHealhInvest : new FormControl<Number>(0,[Validators.required,Validators.min(0)]),
		budgetWorkHealthSecurity: new FormControl<Number>(0,[Validators.required,Validators.min(0)]),
		totalWorkerNumber: new FormControl<Number>(0,[Validators.required,Validators.min(0)])	
	})
	showInvestStatement=false;
	showBudgetStatement=false;
	showBudgetDangerStatement=false;
	showInvestDangerStatement=false;

	constructor(
		private router:Router,
		private v4HealthSecurityWorkConditionService: V4HealthSecurityWorkCondtionService,
		private toastService : HotToastService
	){

	}	
	goTo(path:any){
		this.router.navigate([path])
	}

	showInvestInfo(){
		this.showInvestStatement = this.showInvestStatement ? false: true
	}

	showBudgetInfo(){
		this.showBudgetStatement = this.showBudgetStatement ? false : true
	}
	
	showInvestDanger(){
		this.showInvestDangerStatement = this.showInvestDangerStatement ? false : true
	}

	showBudgetDanger(){
		this.showBudgetDangerStatement= this.showBudgetDangerStatement ? false : true
	}

	save(){
		if (!this.v4HealthSecurityWorkConditionForm.valid){
			return;
		}
		this.v4HealthSecurityWorkConditionService.save(this.v4HealthSecurityWorkConditionForm.value).pipe(
			//Step 1 before calling step 2 request
			tap((res:any) => {
				this.toastService.success('Vulnérabilité 4 validé', {
					duration: AppConstants.LONG_TEXT_DURATION,
					dismissible:true
				})
				this.v4HealthSecurityWorkConditionForm.patchValue({id:res.id})
			})
			//switchMap((res:any) => {
				
			//})
		).subscribe({
			
			})
	}
}
