import { Routes } from '@angular/router';
import HomepageComponent from './homepage/homepage.component';
import {V1GazEmissionComponent} from './v1GazEmission/v1GazEmission.component';

export const routes: Routes = [
	{
		path:'',
		component:HomepageComponent
	},
	{
		path:'v1',
		component:V1GazEmissionComponent
	}
];
