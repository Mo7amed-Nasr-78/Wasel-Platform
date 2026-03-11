import type { Shipment } from "@/shared/interfaces/Interfaces";
import axios from "axios";

class HttpClient {

    private instance;
    public accessToken: string | null = null;
    public accessTokenExp: number = 0;
    public refreshPromise = null;
    // private accessToken

    constructor() {
        this.instance = axios.create({
            baseURL: import.meta.env.VITE_BACKEND_URL,
            withCredentials: true
        });

        this.setupInterceptors();
    }

    setAccessToken(token: string) {
        this.accessToken = token;

        try {
            const { exp }: { exp: number } = JSON.parse(atob(this.accessToken.split('.')[1]));
            this.accessTokenExp = exp;
        } catch (err) {
            console.log(err);
            this.accessTokenExp = 0;
        }
    }

    private isExpired() {
        return Date.now() >= this.accessTokenExp - 10000
    }

    private async refreshAccessToken() {
        if (!this.refreshPromise) {
            this.refreshPromise = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
                {},
                {
                    withCredentials: true
                }
            ).then((res) => {
                this.setAccessToken(res.data);
                return res.data;
            }).finally(() => {
                this.refreshPromise = null;
            })
        }

        return this.refreshAccessToken;
    }

    private setupInterceptors() {
        // On Req
        this.instance.interceptors.request.use(
            async (config) => {
                if (this.accessToken && this.isExpired()) {
                    await this.refreshAccessToken();
                }

                if (this.accessToken) {
                    config.headers.Authorization = `Bearer ${this.accessToken}`
                }

                return config;
            }, 
            (err) => err
        );

        // On Res
        this.instance.interceptors.response.use(
            (res) => res,
            async (err) => {
                const original = err.config;

                if (err.response?.status === 401 && !original._retry) {
                    original._retry = true;

                    try {
                        await this.refreshAccessToken();
                        original.headers.Authorization = `Bearer ${this.accessToken}`
                        this.instance(original);
                    } catch (err) {
                        console.log("Failed to refresh, Logging out...");
                        return Promise.reject(err);
                    }
                }

                return Promise.reject(err);
            }
        )
    }

    get(url: string) {
        return this.instance.get(url);
    }

    post(url: string, data?: Shipment) {
        return this.instance.post(url, data);
    }

}

export const httpClient = new HttpClient();