import { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument, rgb } from 'pdf-lib';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end('Only POST requests are allowed');
    return;
  }

  const { clientName, serviceDesc, price } = req.body;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size

  const { height } = page.getSize();

  page.drawText('INVOICE', {
    x: 50,
    y: height - 60,
    size: 24,
    color: rgb(0.2, 0.2, 0.8),
  });

  page.drawText(`Client: ${clientName}`, { x: 50, y: height - 120, size: 14 });
  page.drawText(`Service: ${serviceDesc}`, { x: 50, y: height - 140, size: 14 });
  page.drawText(`Total: €${price}`, { x: 50, y: height - 160, size: 14 });

  const pdfBytes = await pdfDoc.save();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
  res.send(Buffer.from(pdfBytes));
}
