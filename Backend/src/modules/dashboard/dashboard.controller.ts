import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@/common/guards/jwtAuthGuard';

@Controller('dashboard')
export class DashboardController {

    constructor(private readonly dashboardService: DashboardService) {};

    @Get("stats")
    @UseGuards(AuthGuard)
    getStats(@Req() req) {
        return this.dashboardService.getStats(req);
    } 

}
