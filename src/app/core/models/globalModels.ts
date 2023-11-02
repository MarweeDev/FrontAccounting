import { OrderDTO } from "./order";
import { MesaDTO } from "./mesa";
import { ProductDTO } from "./product";

export class  GlobalModels {
    public order : OrderDTO = new OrderDTO();
    public mesa : MesaDTO = new MesaDTO();
    public product : ProductDTO = new ProductDTO();
}