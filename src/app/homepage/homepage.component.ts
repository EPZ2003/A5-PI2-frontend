import {ChangeDetectionStrategy, Component, signal} from "@angular/core";
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
@Component({
	selector: 'homepage',
	templateUrl: 'homepage.component.html',
	imports: [
		MatButtonModule,MatExpansionModule	
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomepageComponent {
	panelOpenState = signal(false)
	beginSimuStatus = false
	beginSimu(){
		this.beginSimuStatus = this.beginSimuStatus ? false: true
	}
}
