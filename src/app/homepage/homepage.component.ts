import { ChangeDetectionStrategy, ChangeDetectorRef, Component, signal } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from "@angular/router";
import { FinalpageService } from "../shared/finalpage.service";
import { HotToastService } from "@ngxpert/hot-toast";
import { AppConstants } from "../app.constant";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
@Component({
	selector: 'homepage',
	templateUrl: 'homepage.component.html',
	imports: [
		MatButtonModule, MatExpansionModule, MatFormFieldModule, MatInputModule, FormsModule
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomepageComponent {
	panelOpenState = signal(false)
	beginSimuStatus = false
	nameOfMedicalDevice: string | null = null;
	indexDmDurableStatus = false;
	lastSimuStatus = false;
	constructor(
		private router: Router,
		private finalpageService: FinalpageService,
		private toastService: HotToastService,
		private cd: ChangeDetectorRef,
	) {
	}

	openPanel() {
		this.beginSimuStatus = this.beginSimuStatus ? false : true
		this.indexDmDurableStatus = this.indexDmDurableStatus ? false : true
		this.nameOfMedicalDevice = ''
	}

	beginSimu() {
		if (!this.nameOfMedicalDevice) {
			console.log("No name of medical device")
			return
		}
		this.finalpageService.newIndexDmDurable(this.nameOfMedicalDevice).subscribe({
			next: (id) => {
				this.toastService.success("Début d'une simulation", {
					duration: AppConstants.LONG_TEXT_DURATION,
					dismissible: true
				})
				localStorage.setItem('name-of-medical-device', this.nameOfMedicalDevice!)
				localStorage.setItem('id-index-dm-durable', id.toString())
				this.indexDmDurableStatus = true
				this.cd.detectChanges()
			}, error: (err) => {
				console.log(err)
			}
		})
	}

	comapreDM() {
		//Handle in ticket :ComparaisonPage-Be_able_to_compare_2_items
	}

	openLastSimu() {
		this.beginSimuStatus = this.beginSimuStatus ? false : true
		this.lastSimuStatus = this.lastSimuStatus ? false : true
		this.nameOfMedicalDevice = localStorage.getItem('name-of-medical-device') ?? null
		this.indexDmDurableStatus = this.indexDmDurableStatus ? false : true
	}

	goTo(path: any) {
		this.router.navigate([path])
	}
}
