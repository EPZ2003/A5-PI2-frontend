import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";
import {Router} from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import {MatCardModule} from '@angular/material/card';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatRadioModule} from "@angular/material/radio";

@Component({
    selector:'v3WasteProduction',
    templateUrl: 'v3WasteProduction.component.html',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        ReactiveFormsModule,
        CommonModule,
        MatRadioModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class V3WasteProductionComponent implements OnInit{

    v3WasteForm = new FormGroup({
        id: new FormControl<number>(0,Validators.min(0)),
        // points associated to proportion of recycled/reused materials (page 39)
        renewabledMaterialProportion: new FormControl<number | null>(null, [Validators.required])
    })

    // store computed vulnerability/points
    vulnerability: number | null = null

    constructor(
        private router: Router,
        private cd: ChangeDetectorRef
    ){

    }

    ngOnInit(): void {

    }

    goTo(path:any){
        this.router.navigate([path])
    }

    save(){
        if (!this.v3WasteForm.valid) return;
        // In this implementation the radio buttons already store the points in `renewabledMaterialProportion`.
        this.vulnerability = this.v3WasteForm.value.renewabledMaterialProportion ?? null;
        this.cd.detectChanges();
    }

}
