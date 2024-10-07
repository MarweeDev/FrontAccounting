export enum HttpMethod {
    GET = '/get',
    GETGLOBAL = '/global/get/',
    GETID = '/get/',
    POST = '/post',
    PUT = '/put/',
    STATUS = '/status/',
    DELETE = '/delete/'
}

export enum ServicesMethod {
    ServicesMesa = 'Mesa',
    ServicesCategory = 'Category',
    ServicesProduct = 'Product',
    ServicesOrder = 'Order',
    ServicesModule = 'Module',
    ServicesTypePay = 'TypePay',
    ServicesUsers = 'Users',
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