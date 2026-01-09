import { Injectable } from "@angular/core";
import { AppConstants } from "../app.constant";
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: 'root'
})
export class V1GazEmissionService {
	private url = AppConstants.PRIVATE_URL + "v1"

	constructor(
		private httClient: HttpClient
	) {
	}

	save(fmData: any) {
		return this.httClient.post(this.url + '/' + localStorage.getItem('id-index-dm-durable'), fmData)
	}

	getVulnerability(id: number) {
		return this.httClient.get(this.url + '/getV1/' + id)
	}
}

