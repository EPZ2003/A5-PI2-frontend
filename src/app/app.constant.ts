import { HttpHeaders } from "@angular/common/http";
export class AppConstants{
    public static DIALOG_CONFIG = <any>{
        SMALL: {
            height: 'auto',
            maxHeight: '80%',
            width: '450px'
        },
        AVERAGE: {
            height: 'auto',
            maxHeight: '80%',
            width: '500px'
        },
        BIG: {
            height: 'auto',
            maxHeight: '80%',
            width: '800px'
        },
        LARGE: {
            height: 'auto',
            maxHeight: '80%',
            width: '80%'
        }
    };
    public static PRIVATE_URL = "api/backend-durablinator/"

    public static HTTP_OPTIONS = <any>{
        headers:new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8'
        }),
        params: {'_v':new Date().getTime().toString()}
    }

    public static SUCCESS_DIALOG = 'SUCCESS'
    public static SHORT_TEXT_DURATION = 3000;
    public static LONG_TEXT_DURATION = 5000;
}
