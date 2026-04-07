import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {

    constructor(private readonly prismaService: PrismaService) {}

    async getStats (req) {
        const userId = req.user.sub as string;
        const role = req.user.role as string;

        let res = {};

        const profile = await this.prismaService.profile.findUnique({
            where: {
                userId
            }
        })


        const shipments  = await this.prismaService.shipment.count({
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

            res["shipments"] = shipments;
            res["activeShipments"] = activeShipments;
            res["completedShipments"] = compoletedShipments;
            res["balance"] = profile.balance;
            res["totalSpent"] = profile.totalSpent;
            return res;
        }
    }

}
