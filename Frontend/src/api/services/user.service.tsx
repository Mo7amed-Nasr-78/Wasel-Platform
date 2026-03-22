import { httpClient } from "../client/HttpClient";

class UserService {

    logout () {
        return httpClient.post("/auth/signout");
    }

}

export const userService = new UserService();