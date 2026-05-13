# Analisis de multitenancy

## Resumen

El sistema ya tiene una base conceptual para multitenancy: los usuarios se relacionan con `suscritos`, y las consultas de informacion de usuario usan `usuarios.id_suscrito`. Sin embargo, varias tablas operativas y de configuracion del negocio aun no estan segmentadas por tenant, lo que puede mezclar datos entre negocios si existen varios suscritos en la misma base de datos.

La recomendacion es usar `id_suscrito` como llave de tenant. No conviene usar `id_cliente`, porque `cliente` representa al comprador o tercero de una orden, no al negocio propietario de los datos.

## Estado actual observado

Ya existe nocion de tenant en:

- `usuarios`, mediante relacion con `suscritos`.
- Consultas como `GetInfoUser`, que unen `usuarios`, `suscritos`, `rol`, `rol_modulo` y `modulo`.

Pero no se observa segmentacion por tenant en tablas como:

- `producto`
- `categoriaproducto`
- `proveedores`
- `stock`
- `cliente`
- `mesa`
- `compras`
- `detallecompra`
- `orden`
- `detalleorden`

Esto implica que productos, categorias, proveedores, stock, clientes finales, mesas, compras y ventas podrian compartirse accidentalmente entre negocios.

## Recomendacion de modelo

Agregar `id_suscrito` directamente a las tablas que pertenecen a la configuracion u operacion de un negocio:

- `producto`
- `categoriaproducto`
- `proveedores`
- `stock`
- `cliente`
- `mesa`
- `compras`
- `orden`

Las tablas detalle pueden depender de su cabecera:

- `detallecompra` puede heredar el tenant desde `compras`.
- `detalleorden` puede heredar el tenant desde `orden`.

Tambien se podria agregar `id_suscrito` a los detalles para facilitar reportes y filtros directos, pero eso requiere reglas de consistencia mas estrictas.

## Tablas globales

Algunas tablas pueden mantenerse globales si aplican para todos los negocios:

- `estado`
- `rol`
- `modulo`
- `rol_modulo`
- `tipopago`
- `subtipopago`

Si en el futuro cada negocio debe tener configuraciones propias de roles, modulos o medios de pago, esas tablas tambien podrian pasar a ser tenantizadas o tener tablas puente por `id_suscrito`.

## Reglas de backend sugeridas

El backend deberia resolver el tenant desde el usuario autenticado, no desde el body enviado por el frontend.

Reglas recomendadas:

- En cada `GET`, filtrar por `id_suscrito`.
- En cada `POST`, asignar `id_suscrito` desde el token o usuario autenticado.
- En cada `PUT` y `DELETE`, validar que el registro pertenece al mismo `id_suscrito`.
- Evitar aceptar `id_suscrito` libremente desde el frontend.
- Centralizar la obtencion del tenant en un middleware o helper reutilizable.

## Indices y unicidad

Las reglas unicas deben dejar de ser globales cuando los datos pertenecen a un negocio.

Ejemplos:

- Producto: unico por `(id_suscrito, referencia)`.
- Proveedor: unico por `(id_suscrito, nit)`.
- Stock: unico por `(id_suscrito, id_producto)`.
- Mesa: unico por `(id_suscrito, numero)` si aplica.
- Cliente final: podria ser unico por `(id_suscrito, nit)` si cada negocio administra su propia cartera.

## Impacto en inventario

Inventario es uno de los modulos donde multitenancy es mas importante.

La tabla `stock` deberia tener `id_suscrito` porque la existencia de un producto pertenece a un negocio especifico. Sin ese campo, el inventario puede mezclarse entre suscritos, especialmente cuando compras y ventas empiecen a modificar cantidades automaticamente.

La regla recomendada para stock seria:

- `stock.id_suscrito`
- `stock.id_producto`
- `stock.cantidad`
- indice unico `(id_suscrito, id_producto)`

## Estrategia de migracion recomendada

1. Agregar `id_suscrito` nullable a tablas objetivo.
2. Poblar `id_suscrito` con datos existentes usando relaciones actuales, empezando por usuarios/ordenes si hay suficiente trazabilidad.
3. Revisar registros que no puedan asociarse automaticamente.
4. Cambiar endpoints para filtrar y escribir por tenant.
5. Convertir `id_suscrito` a `NOT NULL` cuando los datos esten completos.
6. Crear indices compuestos por tenant.
7. Ajustar unicidades globales a unicidades por tenant.

## Conclusion

Si el sistema va a soportar multiples negocios o suscritos, conviene hacer esta refactorizacion antes de seguir creciendo modulos. La base ya apunta hacia multitenancy con `suscritos`, pero falta aplicar esa llave de forma consistente en productos, categorias, proveedores, clientes finales, mesas, compras, ordenes y stock.

La llave recomendada es `id_suscrito`, no `id_cliente`.
