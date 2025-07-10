import { useState } from 'react';

export default function Home() {
  const [clientName, setClientName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(false);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName, serviceDesc, price })
      });

      if (!response.ok) throw new Error('Network error');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoice.pdf';
      a.click();
      setSuccess(true);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🧾 Create an Invoice</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <label>Client Name:</label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
          placeholder="e.g. John Smith"
          style={inputStyle}
        />

        <label>Service Description:</label>
        <input
          type="text"
          value={serviceDesc}
          onChange={(e) => setServiceDesc(e.target.value)}
          required
          placeholder="e.g. Web design"
          style={inputStyle}
        />

        <label>Price (€):</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          placeholder="e.g. 500"
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>Create Invoice</button>

        {loading && <p>Generating PDF...</p>}
        {success && <p style={{ color: 'green' }}>Invoice created successfully ✅</p>}
        {error && <p style={{ color: 'red' }}>Something went wrong ❌</p>}
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
