import { Injectable } from "@angular/core";
import { AppConstants } from "../app.constant";
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: 'root'
})
export class V6InclusionAndDiversityService {
	private url = AppConstants.PRIVATE_URL + "v6"

	constructor(
		private httClient: HttpClient
	) {
	}

	save(fmData: any) {
		return this.httClient.post(this.url + '/' + localStorage.getItem('id-index-dm-durable'), fmData)
	}

	getV6Data(dmId: number) {
		return this.httClient.get(this.url + '/' + dmId)
	}

	getVulnerability(id: number) {
		return this.httClient.get(this.url + '/getV6/' + id)
	}
}
