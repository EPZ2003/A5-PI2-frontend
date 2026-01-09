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
        return this.httClient.get(this.url + '/' + nameOfMedicalDevice)
    }

    getAllVulnerability() {
        return this.httClient.get(this.url + "/all-vulnerabilities/" + localStorage.getItem('id-index-dm-durable'))
    }

}
