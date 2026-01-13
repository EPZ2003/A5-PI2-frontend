import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FinalpageService } from './finalpage.service';

export const finalPageResolver: ResolveFn<any> = (route, state) => {
    const finalPageService = inject(FinalpageService);
    return finalPageService.getAllVulnerability();
};
