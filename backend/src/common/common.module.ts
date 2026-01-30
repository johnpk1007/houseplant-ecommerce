import { Module } from "@nestjs/common";
import { RolesGuard } from "./guard/role.guard";

@Module({
    providers: [RolesGuard]
})
export class CommonModule { }