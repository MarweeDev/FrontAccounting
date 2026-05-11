export enum HttpMethod {
    GET = '/get',
    GETGLOBAL = '/global/get/',
    GETID = '/get/',
    POST = '/post',
    PUT = '/put/',
    PUT2 = '/put',
    STATUS = '/status/',
    DELETE = '/delete/'
}

export enum ServicesMethod {
    ServicesAuth = 'Auth',
    ServicesMesa = 'Mesa',
    ServicesCategory = 'Category',
    ServicesProduct = 'Product',
    ServicesOrder = 'Order',
    ServicesModule = 'Module',
    ServicesTypePay = 'TypePay',
    ServicesUsers = 'Users',
    ServicesClient = 'Client',
    ServicesShopping = 'shopping',
    ServicesSupplier = 'supplier',
    ServicesStock = 'stock',
    ServicesSettingParameter = 'setting/parameter',
    ServicesDevelopmentResource = 'development/resource',
    ServicesDevelopmentPermission = 'development/permission',
    ServicesAccessControl = 'access-control',
    ServicesRole = 'role',
    ServicesPeripheralConfig = 'peripheral/config',
    ServicesPeripheralEvent = 'peripheral/event',
    ServicesPaymentMethod = 'payment/method',
    ServicesPaymentTransactionDetail = 'payment/transaction/detail',
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
