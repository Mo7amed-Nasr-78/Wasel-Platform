import { useQuery } from "@tanstack/react-query";
import { userService } from "@/api/services/user.service";

export function useUsers() {
	return useQuery({
		queryKey: ["users"],
		queryFn: () => userService.getUsers(),
		retry: false,
	});
}
