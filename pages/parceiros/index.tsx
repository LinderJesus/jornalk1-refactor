import { useState } from 'react';
import Image from 'next/image';
import { FaEnvelope, FaPhone } from 'react-icons/fa';

// Definir interface para parceiros
interface Partner {
  id: number;
  name: string;
  logo: string;
  description: string;
  website: string;
  category: string;
}

// Mock data for partners
const partners: Partner[] = [
  {
    id: 1,
    name: 'TechNews Brasil',
    logo: '/images/partner-1.jpg',
    description: 'Portal de notícias especializado em tecnologia e inovação.',
    website: 'https://technewsbrasil.com.br',
    category: 'Mídia Digital',
  },
  {
    id: 2,
    name: 'Revista Esportes',
    logo: '/images/partner-2.jpg',
    description: 'Revista mensal com cobertura completa do mundo esportivo nacional e internacional.',
    website: 'https://revistaesportes.com.br',
    category: 'Mídia Impressa',
  },
  {
    id: 3,
    name: 'Rádio Notícias 24h',
    logo: '/images/partner-3.jpg',
    description: 'Estação de rádio com programação jornalística 24 horas por dia.',
    website: 'https://radio24h.com.br',
    category: 'Rádio',
  },
  {
    id: 4,
    name: 'TV Esporte',
    logo: '/images/partner-4.jpg',
    description: 'Canal de televisão dedicado à cobertura esportiva nacional.',
    website: 'https://tvesporte.com.br',
    category: 'Televisão',
  },
  {
    id: 5,
    name: 'Agência de Notícias Central',
    logo: '/images/partner-5.jpg',
    description: 'Agência de notícias com correspondentes em todo o Brasil.',
    website: 'https://agenciacentral.com.br',
    category: 'Agência de Notícias',
  },
  {
    id: 6,
    name: 'Jornal da Cidade',
    logo: '/images/partner-6.jpg',
    description: 'Jornal diário com foco em notícias locais e regionais.',
    website: 'https://jornaldacidade.com.br',
    category: 'Jornal Impresso',
  },
];

const PartnersPage = () => {
  const [filter, setFilter] = useState('');
  
  const filteredPartners = filter 
    ? partners.filter(partner => partner.category === filter)
    : partners;
  
  const categories = Array.from(new Set(partners.map(partner => partner.category)));
  
  return (
    <div className="bg-gray-50 py-12">
      <div className="container">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Nossos Parceiros</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conheça as empresas e organizações que colaboram com o JornalK1 para trazer as melhores notícias e conteúdos para você.
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setFilter('')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === '' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todos
          </button>
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === category 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPartners.map(partner => (
            <div key={partner.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="relative h-48 w-full bg-gray-100">
                <Image 
                  src={partner.logo}
                  alt={partner.name}
                  width={200}
                  height={100}
                  className="object-contain p-4"
                />
              </div>
              <div className="p-6">
                <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded mb-3">
                  {partner.category}
                </span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{partner.name}</h3>
                <p className="text-gray-600 mb-4">{partner.description}</p>
                <a 
                  href={partner.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary font-medium hover:underline"
                >
                  Visitar website
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {/* Become a Partner Section */}
        <div className="mt-16 bg-primary text-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-bold mb-4">Torne-se um Parceiro</h2>
              <p className="mb-6">
                Está interessado em se tornar um parceiro do JornalK1? Entre em contato conosco para discutir oportunidades de colaboração e parcerias estratégicas.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaEnvelope className="mr-3" />
                  <span>parcerias@jornalk1.com.br</span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="mr-3" />
                  <span>+55 (99) 9999-9999</span>
                </div>
              </div>
            </div>
            <div className="bg-primary-dark p-8 md:p-12">
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Nome</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Seu nome ou empresa"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Mensagem</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Descreva sua proposta de parceria"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-primary font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Enviar Proposta
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersPage;
