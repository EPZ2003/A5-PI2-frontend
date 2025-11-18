import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";
import {Router} from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormField} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {V1GazEmissionService} from "../shared/v1GazEmission.service";
import {HotToastService} from "@ngxpert/hot-toast";
import {AppConstants} from "../app.constant";
import {CommonModule} from "@angular/common";


@Component({
	selector:'v1GazEmission',
	templateUrl: 'v1GazEmission.component.html',
	imports: [
	MatButtonModule,
	MatIconModule,
	MatCardModule,
	MatChipsModule,
	MatProgressBarModule,
	MatFormField,
	MatInputModule,
	MatSelectModule,
	ReactiveFormsModule,
	CommonModule
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class V1GazEmissionComponent implements OnInit{

	v1GazEmissionForm = new FormGroup({
		id: new FormControl<Number>(0,Validators.min(0)),
		weightPrimaryMaterialCarbonneEmission : new FormControl(null,[Validators.required,Validators.min(0)]),
		primaryMaterialCarbonneEmission : new FormControl(null,[Validators.required,Validators.min(0)]),
		weightFirstMaterialCarbonneEmission: new FormControl(0,Validators.min(0)),
		firstMaterialCarbonneEmission : new FormControl(0,Validators.min(0)),
		weightSecondMaterialCarbonneEmission: new FormControl(0,Validators.min(0)),
		secondMaterialCarbonneEmission : new FormControl(0,Validators.min(0))
		
	})
	firstMaterialStatus=false;
	secondMaterialStatus=false;
	txtInfo=''
	element1Status=false;
	resultElement1=0
	constructor(
		private router:Router,
		private v1GazEmissionService: V1GazEmissionService,
		private toastService: HotToastService,
		private cd: ChangeDetectorRef,
	){

	}

	ngOnInit(): void {
		
	}
	showInfos(){
		this.txtInfo = this.txtInfo ? '' : 'Si vous ne savez pas répondre à un des champs demandé veuillez cliquer sur ce bouton ci-dessous qui vous permmetra de chercher vers le site officiel prévue à cet effet'
	}

	goTo(path:any){
		this.router.navigate([path])
	}

	showMaterials(firstMaterial:boolean,secondMaterial:boolean){
		this.firstMaterialStatus = firstMaterial;
		this.secondMaterialStatus = secondMaterial;
	}

	save(){
		if (!this.v1GazEmissionForm.valid){
			return;
		}
		this.v1GazEmissionService.save(this.v1GazEmissionForm.value).subscribe({
			next:(res:any)=>{
				if (res){
					this.toastService.success('Critère 1 validé',{
						duration:AppConstants.LONG_TEXT_DURATION,
						dismissible:true
						})
				}
				this.v1GazEmissionForm.patchValue({id:res.id})
				this.element1Status = true;
				this.resultElement1 = res.resultElement1;
				this.cd.detectChanges()
			},error:(err:any) => {
				console.log(err)
			}
		})
	}
}
