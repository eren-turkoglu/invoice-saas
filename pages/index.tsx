import { useState } from 'react';

type Service = {
  name: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
};

type ServiceField = 'name' | 'quantity' | 'unitPrice' | 'taxRate';

export default function Home() {
  const [company, setCompany] = useState({ name: '', address: '', city: '', country: '' });
  const [client, setClient] = useState({ name: '', email: '', phone: '', address: '' });
  const [services, setServices] = useState<Service[]>([
    { name: '', quantity: 1, unitPrice: 0, taxRate: 0 },
  ]);

  const handleServiceChange = (index: number, field: ServiceField, value: string | number) => {
    const newServices = [...services];
    if (field === 'name') {
      newServices[index][field] = value as string;
    } else {
      newServices[index][field] = Number(value) as number;
    }
    setServices(newServices);
  };

  const addService = () => {
    setServices([...services, { name: '', quantity: 1, unitPrice: 0, taxRate: 0 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, client, services }),
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
    } catch (err) {
      alert('An error occurred while generating the PDF.');
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🧾 Create Invoice</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        <h2>Company Info</h2>
        <input placeholder="Company Name" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} style={inputStyle} />
        <input placeholder="Address" value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} style={inputStyle} />
        <input placeholder="City" value={company.city} onChange={(e) => setCompany({ ...company, city: e.target.value })} style={inputStyle} />
        <input placeholder="Country" value={company.country} onChange={(e) => setCompany({ ...company, country: e.target.value })} style={inputStyle} />

        <h2>Client Info</h2>
        <input placeholder="Full Name" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} style={inputStyle} />
        <input placeholder="Email" value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} style={inputStyle} />
        <input placeholder="Phone" value={client.phone} onChange={(e) => setClient({ ...client, phone: e.target.value })} style={inputStyle} />
        <input placeholder="Address" value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} style={inputStyle} />

        <h2>Services</h2>
        {services.map((service, index) => (
          <div key={index} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
            <input placeholder="Service Name" value={service.name} onChange={(e) => handleServiceChange(index, 'name', e.target.value)} style={inputStyle} />
            <input type="number" placeholder="Quantity" value={service.quantity} onChange={(e) => handleServiceChange(index, 'quantity', e.target.value)} style={inputStyle} />
            <input type="number" placeholder="Unit Price (€)" value={service.unitPrice} onChange={(e) => handleServiceChange(index, 'unitPrice', e.target.value)} style={inputStyle} />
            <input type="number" placeholder="Tax Rate (%)" value={service.taxRate} onChange={(e) => handleServiceChange(index, 'taxRate', e.target.value)} style={inputStyle} />
          </div>
        ))}
        <button type="button" onClick={addService} style={{ marginBottom: '1rem' }}>+ Add Another Service</button>

        <button type="submit" style={buttonStyle}>Generate Invoice</button>
      </form>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '0.5rem',
  marginBottom: '0.5rem',
  fontSize: '1rem',
};

const buttonStyle: React.CSSProperties = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#0070f3',
  color: 'white',
  fontSize: '1rem',
  border: 'none',
  cursor: 'pointer',
};
