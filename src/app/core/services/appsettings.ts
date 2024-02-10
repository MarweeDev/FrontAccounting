export enum ServicesMethod {
    ServicesMesa = 'Mesa'
}

export enum HttpMethod {
    GET = '/get',
    GETID = '/get/',
    POST = '/post',
    PUT = '/put/',
    DELETE = '/delete/'
}

export class ApiConfig {
    private static baseApiUrl = 'http://localhost:3000';
    private static baseApi = '/appdomain/api/';

    static setBaseApiUrl(url: string): void {
        ApiConfig.baseApiUrl = url;
    }

    static getUrl(endpoint: string): string {
        return `${ApiConfig.baseApiUrl}${ApiConfig.baseApi}${endpoint}`;
    }
}