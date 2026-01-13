import { Routes } from '@angular/router';
import HomepageComponent from './homepage/homepage.component';
import { V1GazEmissionComponent } from './v1GazEmission/v1GazEmission.component';
import { V3WasteProductionComponent } from './v3WasteProduction/v3WasteProduction.component';
import { V4HealthSecurityWorkConditionComponent } from './v4HealthSecurityConditionWork/v4HealthSecurityWorkCondition.component';
import { V5BioacumulationToxicity } from './v5BioacumulationToxicity/v5BioacumulationToxicity.component';
import { FinalPageComponent } from './finalpage/finalpage.component';
import { finalPageResolver } from './shared/finalpage.resolver';
import ComparePageComponent from './comparepage/comparepage.component';

export const routes: Routes = [
	{
		path: '',
		component: HomepageComponent
	},
	{
		path: 'compare',
		component: ComparePageComponent
	},
	{
		path: 'v1',
		component: V1GazEmissionComponent
	},
	{
		path:'v3',
		component:V3WasteProductionComponent
	},
	{
		path: 'v4',
		component: V4HealthSecurityWorkConditionComponent
	},
	{
		path: 'v5',
		component: V5BioacumulationToxicity
	},
	{
		path: 'index-dm-durable',
		component: FinalPageComponent,
		resolve: { vulnerabilities: finalPageResolver }
	}
];
