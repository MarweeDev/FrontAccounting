# Agente local simulado

Este servicio permite probar periféricos sin impresora ni datáfono físico.

## Ejecutar

```powershell
cd C:\Users\Dobby\SourceVSCode\FrontAccounting\local-agent
npm install
npm start
```

La app Angular detectará el agente en:

```txt
http://localhost:8765
```

## Endpoints

- `GET /health`: estado y capacidades.
- `GET /devices`: impresora y datáfonos simulados.
- `POST /print`: recibe comprobantes internos.
- `GET /print/jobs`: últimos trabajos de impresión.
- `POST /payment/start`: inicia pago simulado.
- `GET /payment/:id`: consulta estado.
- `POST /payment/:id/approve`: aprueba pago.
- `POST /payment/:id/reject`: rechaza pago.
- `POST /payment/:id/cancel`: cancela pago.

Este agente no procesa pagos reales ni imprime en hardware físico. Es el contrato base para conectar adaptadores reales después.
