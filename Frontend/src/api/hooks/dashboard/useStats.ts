import { dashoardSerivce } from "@/api/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";

export function useStats() {
    return useQuery({
        queryKey: ['stats'],
        queryFn: () => dashoardSerivce.getStat(),
    })
}