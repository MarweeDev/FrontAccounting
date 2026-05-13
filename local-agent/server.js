const express = require('express');
const cors = require('cors');

const app = express();
const port = Number(process.env.LOCAL_AGENT_PORT || 8765);
const payments = new Map();
const printJobs = [];

app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

const devices = [
  {
    id: 'printer-sim-58',
    type: 'printer',
    name: 'Impresora POS simulada 58mm',
    connection: 'simulation',
    status: 'online',
    capabilities: ['print']
  },
  {
    id: 'pinpad-sim-wireless',
    type: 'payment-terminal',
    name: 'Datáfono inalámbrico simulado',
    connection: 'wifi',
    status: 'online',
    capabilities: ['payment-terminal']
  },
  {
    id: 'pinpad-sim-usb',
    type: 'payment-terminal',
    name: 'Datáfono alámbrico simulado USB',
    connection: 'usb',
    status: 'standby',
    capabilities: ['payment-terminal', 'usb']
  }
];

app.get('/health', (req, res) => {
  res.json({
    service: 'FrontAccounting Local Agent',
    version: '0.1.0',
    mode: 'simulation',
    status: 'online',
    capabilities: ['print', 'payment-terminal', 'usb', 'bluetooth']
  });
});

app.get('/devices', (req, res) => {
  res.json({ result: devices });
});

app.post('/print', (req, res) => {
  const job = req.body || {};
  const createdAt = new Date().toISOString();
  const printJob = {
    id: `print-${Date.now()}`,
    createdAt,
    status: 'printed',
    documentType: job.documentType,
    title: job.title,
    reference: job.reference,
    lines: Array.isArray(job.lines) ? job.lines.length : 0
  };

  printJobs.unshift(printJob);
  res.json({
    message: `Comprobante ${job.reference || ''} recibido por impresora simulada.`,
    result: printJob
  });
});

app.get('/print/jobs', (req, res) => {
  res.json({ result: printJobs.slice(0, 20) });
});

app.post('/payment/start', (req, res) => {
  const body = req.body || {};
  const id = `pay-${Date.now()}`;
  const payment = {
    id,
    orderCode: body.orderCode || body.codigo || 'SIM-ORDER',
    amount: Number(body.amount || body.total || 0),
    currency: body.currency || 'COP',
    terminalId: body.terminalId || 'pinpad-sim-wireless',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  payments.set(id, payment);
  res.json({
    message: 'Pago enviado al datáfono simulado.',
    result: payment
  });
});

app.get('/payment/:id', (req, res) => {
  const payment = payments.get(req.params.id);
  if (!payment) {
    return res.status(404).json({ message: 'Pago simulado no encontrado.' });
  }

  res.json({ result: payment });
});

app.post('/payment/:id/approve', (req, res) => {
  updatePayment(req, res, 'approved', 'Pago aprobado en datáfono simulado.');
});

app.post('/payment/:id/reject', (req, res) => {
  updatePayment(req, res, 'rejected', 'Pago rechazado en datáfono simulado.');
});

app.post('/payment/:id/cancel', (req, res) => {
  updatePayment(req, res, 'cancelled', 'Pago cancelado en datáfono simulado.');
});

function updatePayment(req, res, status, message) {
  const payment = payments.get(req.params.id);
  if (!payment) {
    return res.status(404).json({ message: 'Pago simulado no encontrado.' });
  }

  payment.status = status;
  payment.updatedAt = new Date().toISOString();
  payments.set(payment.id, payment);
  res.json({ message, result: payment });
}

app.listen(port, () => {
  console.log(`Local agent simulado en http://localhost:${port}`);
});
