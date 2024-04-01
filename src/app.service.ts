import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    getHello(): string {
        return "Tai khoan cua ban: 10.000.000$";
    }
}
