import { Injectable } from "@angular/core";
import { AppConstants } from "../app.constant";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class FinalpageService {
    private url = AppConstants.PRIVATE_URL + "index-dm-durable"

    constructor(
        private httClient: HttpClient
    ) {
    }

    newIndexDmDurable(nameOfMedicalDevice: string) {
        return this.httClient.get(this.url + '/newDmDurable/' + nameOfMedicalDevice)
    }

    getAllVulnerability(id?: string) {
        const targetId = id ? id : localStorage.getItem('id-index-dm-durable');
        return this.httClient.get(this.url + "/all-vulnerabilities/" + targetId)
    }

    getDataFromIndexDMDurable(id: string) {
        return this.httClient.get(this.url + "/data/" + id)
    }

    getAllIndexDMDurable() {
        return this.httClient.get(this.url + "/all-index-dm-durable")
    }

}
