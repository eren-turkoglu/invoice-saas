import { useState } from 'react';

export default function Home() {
  const [clientName, setClientName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientName, serviceDesc, price })
  });

  if (!response.ok) {
    alert('PDF oluşturulamadı.');
    return;
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fatura.pdf';
  a.click();
};


  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🧾 Fatura Oluştur</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <label>Müşteri Adı:</label>
        <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} required style={inputStyle} />

        <label>Hizmet Açıklaması:</label>
        <input type="text" value={serviceDesc} onChange={(e) => setServiceDesc(e.target.value)} required style={inputStyle} />

        <label>Fiyat (€):</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required style={inputStyle} />

        <button type="submit" style={buttonStyle}>Fatura Oluştur</button>
      </form>
    </main>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '0.5rem',
  marginBottom: '1rem',
  fontSize: '1rem'
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#0070f3',
  color: 'white',
  fontSize: '1rem',
  border: 'none',
  cursor: 'pointer'
};
