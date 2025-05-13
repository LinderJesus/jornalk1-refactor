import React, { useState } from 'react';
import { FaWater, FaWind, FaSun, FaClock, FaMapMarkerAlt, FaChevronRight, FaArrowRight, FaLocationArrow } from 'react-icons/fa';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Interface para tipagem dos dados de previsão
interface PrevisaoProps {
  praia: string;
  estado: string;
  ondas: string;
  vento: string;
  condicao: 'Excelentes' | 'Boas' | 'Médias' | 'Ruins';
  melhorHorario: string;
  temperatura: number;
}

const previsoesPraias: PrevisaoProps[] = [
  { 
    praia: 'Maresias',
    estado: 'SP',
    ondas: '1.0-1.5m',
    vento: 'Fraco 5km/h NE',
    condicao: 'Boas',
    melhorHorario: '10h-13h',
    temperatura: 27
  },
  { 
    praia: 'Joaquina',
    estado: 'SC',
    ondas: '1.5-2.0m',
    vento: 'Moderado 10km/h N',
    condicao: 'Excelentes',
    melhorHorario: '08h-11h', 
    temperatura: 24
  },
  { 
    praia: 'Itamambuca',
    estado: 'SP',
    ondas: '0.8-1.2m',
    vento: 'Moderado 8km/h NE',
    condicao: 'Boas',
    melhorHorario: '07h-11h',
    temperatura: 25
  },
  { 
    praia: 'Praia do Rosa',
    estado: 'SC',
    ondas: '1.2-1.8m',
    vento: 'Fraco 5km/h NE',
    condicao: 'Excelentes',
    melhorHorario: '08h-12h',
    temperatura: 24
  }
];

const PrevisaoOndas: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  return (
    <section className="py-16 surf-gradient-bg relative overflow-hidden">
      {/* Padrão de ondas no fundo */}
      <div className="absolute inset-0 wave-pattern-bg opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white flex items-center justify-center">
            <FaWater className="text-ocean-light mr-3" />
            Previsão de <span className="text-ocean-light ml-2">Ondas</span>
          </h2>
          <p className="text-sand-light/80 max-w-2xl mx-auto">Confira as condições para surf nas principais praias do Brasil</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {previsoesPraias.map((previsao, index) => (
            <motion.div 
              key={previsao.praia}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-dark-card-bg rounded-lg overflow-hidden shadow-surf border border-gray-800/40 hover:shadow-lg transition-all duration-300 hover:border-blue-800/60 group glass"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="px-6 py-4 border-b border-gray-800/40 bg-gradient-to-r from-dark-card-bg to-blue-900/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-start">
                    <FaLocationArrow className="text-ocean-light mt-1 mr-2" />
                    <div>
                      <h3 className="font-bold text-xl text-white group-hover:text-ocean-light transition-colors">{previsao.praia}</h3>
                      <div className="text-sm text-gray-400 flex items-center">
                        <FaMapMarkerAlt className="mr-1 text-xs" /> {previsao.estado}
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium 
                    ${previsao.condicao === 'Excelentes' ? 'bg-green-900/30 text-green-300 border border-green-700/30' : 
                     previsao.condicao === 'Boas' ? 'bg-blue-900/30 text-blue-300 border border-blue-700/30' : 
                     previsao.condicao === 'Médias' ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/30' : 
                     'bg-red-900/30 text-red-300 border border-red-700/30'}`}
                  >
                    {previsao.condicao}
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 flex-shrink-0">
                    <FaWater className="text-blue-400" />
                  </div>
                  <span className="text-gray-300 text-sm">Altura das ondas</span>
                  <span className="ml-auto text-white font-medium">{previsao.ondas}</span>
                </div>
                <div className="flex items-center mb-3">
                  <div className="w-8 flex-shrink-0">
                    <FaWind className="text-blue-400" />
                  </div>
                  <span className="text-gray-300 text-sm">Vento</span>
                  <span className="ml-auto text-white font-medium">{previsao.vento}</span>
                </div>
                <div className="flex items-center mb-3">
                  <div className="w-8 flex-shrink-0">
                    <FaSun className="text-amber-400" />
                  </div>
                  <span className="text-gray-300 text-sm">Temperatura</span>
                  <span className="ml-auto text-white font-medium">{previsao.temperatura}°C</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 flex-shrink-0">
                    <FaClock className="text-blue-400" />
                  </div>
                  <span className="text-gray-300 text-sm">Melhor horário</span>
                  <span className="ml-auto text-white font-medium">{previsao.melhorHorario}</span>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gradient-to-r from-blue-900/40 to-dark-bg-secondary/50 border-t border-gray-800/40">
                <Link 
                  href={`/previsao/${previsao.praia.toLowerCase()}`} 
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center justify-center group-hover:text-blue-300 transition-colors"
                >
                  Ver previsão completa
                  <motion.div
                    animate={{ x: hoveredIndex === index ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaChevronRight className="ml-2 text-xs" />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link 
            href="/previsao" 
            className="inline-flex items-center px-6 py-3 btn-ocean rounded-full shadow-surf font-medium hover-float"
          >
            Ver previsão completa <FaArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PrevisaoOndas;
