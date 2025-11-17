import {Injectable} from "@angular/core";
import {AppConstants} from "../app.constant";
import {HttpClient} from "@angular/common/http";

@Injectable({
	providedIn:'root'
})
export class V1GazEmissionService {
	private url = AppConstants.PRIVATE_URL+"v1"

	constructor(
		private httClient:HttpClient
	){
	}

	save(fmData:any){
		return this.httClient.post(this.url,fmData)
	}
}

