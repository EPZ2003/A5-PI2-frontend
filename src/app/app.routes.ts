import { Routes } from '@angular/router';
import HomepageComponent from './homepage/homepage.component';
import {V1GazEmissionComponent} from './v1GazEmission/v1GazEmission.component';
import {V4HealthSecurityWorkConditionComponent} from './v4HealthSecurityConditionWork/v4HealthSecurityWorkCondition.component';

export const routes: Routes = [
	{
		path:'',
		component:HomepageComponent
	},
	{
		path:'v1',
		component:V1GazEmissionComponent
	},
	{
		path: 'v4',
		component: V4HealthSecurityWorkConditionComponent
	}
];
