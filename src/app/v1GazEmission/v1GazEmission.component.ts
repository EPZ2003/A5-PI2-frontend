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
import {MatDividerModule} from "@angular/material/divider";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import {of, switchMap,tap} from "rxjs";


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
	CommonModule,
	MatDividerModule,
	MatCheckboxModule,
	MatRadioModule
	],
})
export class V1GazEmissionComponent implements OnInit{

	v1GazEmissionForm = new FormGroup({
		id: new FormControl<Number>(0,Validators.min(0)),
		weightPrimaryMaterialCarbonneEmission : new FormControl(null,[Validators.required,Validators.min(0)]),
		primaryMaterialCarbonneEmission : new FormControl(null,[Validators.required,Validators.min(0)]),
		weightFirstMaterialCarbonneEmission: new FormControl(0,Validators.min(0)),
		firstMaterialCarbonneEmission : new FormControl(0,Validators.min(0)),
		weightSecondMaterialCarbonneEmission: new FormControl(0,Validators.min(0)),
		secondMaterialCarbonneEmission : new FormControl(0,Validators.min(0)),
		containsRareMaterial: new FormControl(false),
		totalElectrictyMix:  new FormControl(null,[Validators.required,Validators.min(0)]),
		greenConsomation: new FormControl(false),
		greenProductionSite: new FormControl(false),
		productionSiteFrench: new FormControl(false),
		transportCoef1: new FormControl(0,Validators.required),
		distanceMode1:  new FormControl(0,[Validators.required,Validators.min(0)]),
		transportCoef2: new FormControl(0),
		distanceMode2: new FormControl(0,[Validators.min(0)]),
		fabricationMultisite: new FormControl(null,[Validators.required,Validators.min(0)])
	})
	firstMaterialStatus=false;
	secondMaterialStatus=false;
	txtInfo=''
	electrictyMixInfo=''
	element1Status=false;
	resultElement1=0;
	addTransportStatement=false;
	//Vulnerability 1 - Emission and Gaz
	vulnerability=null;
	rareMaterialsList: string[] = [
		'Cerium',
		'Neodymium',
		'Dysprosium',
		'Praseodymium',
		'Erbium',
		'Samarium',
		'Europium',
		'Scandium',
		'Gadolinium',
		'SmCo magnet (Aimant Samarium Cobalt)',
		'Lanthanum',
		'Terbium',
		'Mischmetal',
		'Ytterbium',
		'Neodym',
		'Yttrium'
	];
	//Refer tab-6 page 31
	transportMode = [
		{
			"mode":"Aerien",
			"coef":1.6995
		},
		{
			"mode":"Ferroviaire",
			"coef":0.0277
		},
		{
			"mode":"Fluvial",
			"coef":0.0258
		},
		{
			"mode":"Maritime",
			"coef":0.0104
		},
		{
			"mode":"Routier",
			"coef":0.1666
		}
	]
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
	showElectricityMixInfo(){
		this.electrictyMixInfo = this.electrictyMixInfo ? '' : 'Ce lien renvoie vers le site qui vous permmetra de remplir ce champ en mettant le pays de production principal du dispositif médical'
	}

	goTo(path:any){
		this.router.navigate([path])
	}

	showMaterials(firstMaterial:boolean,secondMaterial:boolean){
		this.firstMaterialStatus = firstMaterial;
		this.secondMaterialStatus = secondMaterial;
		//Clear inputs in different cases
		if (!this.firstMaterialStatus && !this.secondMaterialStatus){
			this.v1GazEmissionForm.patchValue({weightFirstMaterialCarbonneEmission:0})
			this.v1GazEmissionForm.patchValue({firstMaterialCarbonneEmission:0})
			this.v1GazEmissionForm.patchValue({weightSecondMaterialCarbonneEmission:0})
			this.v1GazEmissionForm.patchValue({secondMaterialCarbonneEmission:0})
		} else if(!this.firstMaterialStatus){	
			this.v1GazEmissionForm.patchValue({weightFirstMaterialCarbonneEmission:0})
			this.v1GazEmissionForm.patchValue({firstMaterialCarbonneEmission:0})
		} else if(!this.secondMaterialStatus){	
			this.v1GazEmissionForm.patchValue({weightSecondMaterialCarbonneEmission:0})
			this.v1GazEmissionForm.patchValue({secondMaterialCarbonneEmission:0})
		}
	}

	containsRareMaterialStatus(value:boolean){
		this.v1GazEmissionForm.patchValue({containsRareMaterial:value})
	}

	setValueTransport(key:any,value:any) {
		if (key ==1){	
		this.v1GazEmissionForm.patchValue({transportCoef1 :value})
		} else if (key == 2) {
			this.v1GazEmissionForm.patchValue({transportCoef2:value})
		}
	}

	addTransport(){
		this.addTransportStatement = this.addTransportStatement ? false : true
		if(!this.addTransportStatement){
			this.v1GazEmissionForm.patchValue({transportCoef2:0})
			this.v1GazEmissionForm.patchValue({distanceMode2:0})
		}
	}	

	save(){ 
		if (!this.v1GazEmissionForm.valid) {
			return;
		}
		if(this.v1GazEmissionForm.value.productionSiteFrench){
			this.v1GazEmissionForm.patchValue({transportCoef1:0})
			this.v1GazEmissionForm.patchValue({distanceMode1:0})
		}
		//It's like the pipe is a huge request instead of 2 separates requests 
		this.v1GazEmissionService.save(this.v1GazEmissionForm.value).pipe(
			//From the first request do actions with the first return 
			tap((res:any) => {
				this.toastService.success('Vulnérabilité 1 validé',{
						duration:AppConstants.LONG_TEXT_DURATION,
						dismissible:true
						})
				this.v1GazEmissionForm.patchValue({id:res.id})
				this.element1Status = true;
			}),
			//When you want to call the second request and using res items from the first item without update the html page 
			switchMap((res:any) => {
				if(res && res.id){
					return this.v1GazEmissionService.getVulnerability(res.id)
				}
				return of(null); //Handle case where save fails / returns
			}),
		//Then bring data from the second request with the next item and finally update the html page	
		).subscribe({
			next:(vulnRes: any) => {
				this.vulnerability = vulnRes
				this.cd.detectChanges()
			}
		})
	}
}
