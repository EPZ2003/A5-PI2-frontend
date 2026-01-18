import { Injectable } from "@angular/core";
import { AppConstants } from "../app.constant";
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: 'root'
})
export class V3WasteProductionService {
	private url = AppConstants.PRIVATE_URL + "v3"

	constructor(
		private httClient: HttpClient
	) {
	}

	save(fmData: any) {
		return this.httClient.post(this.url + '/' + localStorage.getItem('id-index-dm-durable'), fmData)
	}

	getV3Data(dmId: number) {
		return this.httClient.get(this.url + '/' + dmId)
	}

	getVulnerability(id: number) {
		return this.httClient.get(this.url + '/getV3/' + id)
	}
}
