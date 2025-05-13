import React, { useState } from 'react';

const NewsletterSubscribe = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Por favor, informe seu e-mail.');
      setMessageType('error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This would be replaced with an actual API call
      // const response = await fetch('/api/newsletter', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmail('');
      setMessage('Obrigado por se inscrever em nossa newsletter!');
      setMessageType('success');
    } catch {
      // Removendo o parâmetro error completamente já que não o utilizamos
      setMessage('Ocorreu um erro. Por favor, tente novamente.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">Assine nossa newsletter</h3>
      <p className="text-gray-600 mb-4">
        Receba as últimas notícias do mundo diretamente no seu e-mail.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail"
            className="flex-grow px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white px-6 py-2 rounded font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? 'Enviando...' : 'Assinar'}
          </button>
        </div>
      </form>
      
      {message && (
        <p className={`mt-2 text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default NewsletterSubscribe;
