import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {

    constructor(private readonly prismaService: PrismaService) {}

    async getStats (req) {
        const userId = req.user.sub as string;
        const role = req.user.role as string;

        let res = {};

        const total  = await this.prismaService.shipment.count({
            where: {
                profile: {
                    userId
                }
            }
        });

        if (role === "MANUFACTURER") {
            const activeShipments = await this.prismaService.shipment.count({
                where: {
                    status: "PENDING",
                    profile: {
                        userId
                    }
                }
            });
    
            const compoletedShipments = await this.prismaService.shipment.count({
                where: {
                    status: "DELIVERED"
                }
            });

            res["total"] = total;
            res["activeShipments"] = activeShipments;
            res["compoletedShipments"] = compoletedShipments;
            return res;
        }
    }

}
