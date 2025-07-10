import { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument, rgb } from 'pdf-lib';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end('Sadece POST desteklenir');
    return;
  }

  const { clientName, serviceDesc, price } = req.body;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 boyut

  const { width, height } = page.getSize();
  const fontSize = 24;

  page.drawText('🧾 Fatura', {
    x: 50,
    y: height - 60,
    size: fontSize,
    color: rgb(0.2, 0.2, 0.8),
  });

  page.drawText(`Müşteri: ${clientName}`, { x: 50, y: height - 120, size: 14 });
  page.drawText(`Hizmet: ${serviceDesc}`, { x: 50, y: height - 140, size: 14 });
  page.drawText(`Fiyat: ${price} €`, { x: 50, y: height - 160, size: 14 });

  const pdfBytes = await pdfDoc.save();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=fatura.pdf');
  res.send(Buffer.from(pdfBytes));
}
