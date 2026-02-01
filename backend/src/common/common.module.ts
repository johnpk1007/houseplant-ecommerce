import { Module } from "@nestjs/common";
import { RolesGuard } from "./guard";
import { JwtStrategy } from "./strategy";

@Module({
    providers: [RolesGuard, JwtStrategy]
})
export class CommonModule { }