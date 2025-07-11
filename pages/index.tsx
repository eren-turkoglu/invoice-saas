import { useState } from 'react';

export default function Home() {
  const [company, setCompany] = useState({ name: '', address: '', city: '', country: '' });
  const [client, setClient] = useState({ name: '', email: '', phone: '', address: '' });
  const [services, setServices] = useState([{ name: '', quantity: 1, unitPrice: 0, taxRate: 20 }]);

  const handleServiceChange = (index: number, field: string, value: string | number) => {
    const newServices = [...services];
    newServices[index][field] = field === 'name' ? value : Number(value);
    setServices(newServices);
  };

  const addService = () => {
    setServices([...services, { name: '', quantity: 1, unitPrice: 0, taxRate: 20 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, client, services })
      });

      if (!response.ok) {
        alert('Failed to generate PDF.');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoice.pdf';
      a.click();
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Invoice Generator</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 700 }}>

        <h3>Company Info</h3>
        <input placeholder="Company Name" value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} required />
        <input placeholder="Address" value={company.address} onChange={e => setCompany({ ...company, address: e.target.value })} required />
        <input placeholder="City" value={company.city} onChange={e => setCompany({ ...company, city: e.target.value })} required />
        <input placeholder="Country" value={company.country} onChange={e => setCompany({ ...company, country: e.target.value })} required />

        <h3>Client Info</h3>
        <input placeholder="Client Name" value={client.name} onChange={e => setClient({ ...client, name: e.target.value })} required />
        <input placeholder="Email" value={client.email} onChange={e => setClient({ ...client, email: e.target.value })} />
        <input placeholder="Phone" value={client.phone} onChange={e => setClient({ ...client, phone: e.target.value })} />
        <input placeholder="Address" value={client.address} onChange={e => setClient({ ...client, address: e.target.value })} />

        <h3>Services</h3>
        {services.map((service, index) => (
          <div key={index} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
            <input placeholder="Service Name" value={service.name} onChange={e => handleServiceChange(index, 'name', e.target.value)} required />
            <input type="number" placeholder="Quantity" value={service.quantity} onChange={e => handleServiceChange(index, 'quantity', e.target.value)} required />
            <input type="number" placeholder="Unit Price (€)" value={service.unitPrice} onChange={e => handleServiceChange(index, 'unitPrice', e.target.value)} required />
            <input type="number" placeholder="Tax Rate (%)" value={service.taxRate} onChange={e => handleServiceChange(index, 'taxRate', e.target.value)} required />
          </div>
        ))}
        <button type="button" onClick={addService}>+ Add Another Service</button>

        <br /><br />
        <button type="submit">Generate Invoice</button>
      </form>
    </main>
  );
}
