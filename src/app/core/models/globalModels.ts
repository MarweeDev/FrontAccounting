import { OrderDTO } from "./order";
import { DetailOrderDTO } from "./detailOrder";
import { MesaDTO } from "./mesa";
import { ProductDTO } from "./product";
import { EstadoDTO } from "./estado";
import { CategoriaProductoDTO } from "./categoriaProducto";
import { ModuleDTO } from "./module";

export class  GlobalModels {
    public order : OrderDTO = new OrderDTO();
    public detailOrder : DetailOrderDTO = new DetailOrderDTO();
    public mesa : MesaDTO = new MesaDTO();
    public product : ProductDTO = new ProductDTO();
    public estado : EstadoDTO = new EstadoDTO();
    public categoriaProduct : CategoriaProductoDTO = new CategoriaProductoDTO();
    public module : ModuleDTO = new ModuleDTO();
}