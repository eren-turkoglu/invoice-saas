import { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end('Only POST method is allowed');
    return;
  }

  const { company, client, services } = req.body;
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { height } = page.getSize();
  const fontSize = 12;

  let y = height - 40;
  const left = 50;

  page.drawText('INVOICE', { x: left, y, size: 20, color: rgb(0.2, 0.2, 0.7) });
  y -= 30;

  // Company Info
  page.drawText(`From: ${company.name}`, { x: left, y, size: fontSize }); y -= 15;
  page.drawText(`${company.address}, ${company.city}, ${company.country}`, { x: left, y, size: fontSize }); y -= 25;

  // Client Info
  page.drawText(`To: ${client.name}`, { x: left, y, size: fontSize }); y -= 15;
  if (client.address) {
    page.drawText(`${client.address}`, { x: left, y, size: fontSize }); y -= 15;
  }
  if (client.email) {
    page.drawText(`Email: ${client.email}`, { x: left, y, size: fontSize }); y -= 15;
  }
  if (client.phone) {
    page.drawText(`Phone: ${client.phone}`, { x: left, y, size: fontSize }); y -= 15;
  }
  y -= 20;

  // Table Header
  const headers = ['Service', 'Qty', 'Unit (€)', 'Tax %', 'Total (€)'];
  const colWidths = [200, 50, 80, 60, 80];
  let x = left;
  headers.forEach((h, i) => {
    page.drawText(h, { x, y, size: fontSize, color: rgb(0, 0, 0) });
    x += colWidths[i];
  });
  y -= 15;

  // Table Rows
  let subtotal = 0;
  services.forEach((s: any) => {
    const lineTotal = s.quantity * s.unitPrice * (1 + s.taxRate / 100);
    subtotal += lineTotal;
    x = left;
    [s.name, s.quantity, s.unitPrice.toFixed(2), s.taxRate + '%', lineTotal.toFixed(2)].forEach((val: any, i) => {
      page.drawText(String(val), { x, y, size: fontSize });
      x += colWidths[i];
    });
    y -= 15;
  });

  y -= 25;

  // Summary
  const taxTotal = subtotal - services.reduce((sum: number, s: any) => sum + s.quantity * s.unitPrice, 0);
  page.drawText(`Subtotal: € ${subtotal - taxTotal}`, { x: left + 300, y, size: fontSize }); y -= 15;
  page.drawText(`Tax Total: € ${taxTotal.toFixed(2)}`, { x: left + 300, y, size: fontSize }); y -= 15;
  page.drawText(`Total: € ${subtotal.toFixed(2)}`, { x: left + 300, y, size: fontSize + 1, color: rgb(0, 0.2, 0.6) });

  const pdfBytes = await pdfDoc.save();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
  res.send(Buffer.from(pdfBytes));
}
