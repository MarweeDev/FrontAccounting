import { OrderDTO } from "./order";
import { MesaDTO } from "./mesa";
import { ProductDTO } from "./product";
import { EstadoDTO } from "./estado";
import { CategoriaProductoDTO } from "./categoriaProducto";

export class  GlobalModels {
    public order : OrderDTO = new OrderDTO();
    public mesa : MesaDTO = new MesaDTO();
    public product : ProductDTO = new ProductDTO();
    public estado : EstadoDTO = new EstadoDTO();
    public categoriaProduct : CategoriaProductoDTO = new CategoriaProductoDTO();
}