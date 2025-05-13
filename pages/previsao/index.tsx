import React from 'react';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import { FaWater, FaWind, FaSun, FaThermometerHalf, FaClock, FaInfoCircle, FaMapMarkerAlt } from 'react-icons/fa';

// Previsão de ondas mais detalhada
const previsaoOndas = [
  {
    praia: 'Maresias',
    estado: 'SP',
    regiao: 'Litoral Norte de São Paulo',
    tamanhoOndas: '1.5-2.0m',
    vento: '10km/h NE',
    temperatura: '27°C',
    temperaturaAgua: '24°C',
    condicao: 'Boas',
    melhorHorario: '7h-10h',
    visibilidade: 'Alta',
    correnteMarinha: 'Fraca',
    risco: 'Baixo',
    descricao: 'Ondas de tamanho médio com boas formações. Indicado para surfistas de todos os níveis.',
    latitude: '-23.7904',
    longitude: '-45.5585'
  },
  {
    praia: 'Joaquina',
    estado: 'SC',
    regiao: 'Florianópolis',
    tamanhoOndas: '1.8-2.2m',
    vento: '15km/h SE',
    temperatura: '24°C',
    temperaturaAgua: '22°C',
    condicao: 'Ótimas',
    melhorHorario: '6h-9h',
    visibilidade: 'Alta',
    correnteMarinha: 'Moderada',
    risco: 'Médio',
    descricao: 'Ondulação consistente com boas formações de tubos. Recomendado para surfistas de nível intermediário a avançado.',
    latitude: '-27.6297',
    longitude: '-48.4439'
  },
  {
    praia: 'Itamambuca',
    estado: 'SP',
    regiao: 'Ubatuba',
    tamanhoOndas: '1.2-1.8m',
    vento: '8km/h NE',
    temperatura: '26°C',
    temperaturaAgua: '23°C',
    condicao: 'Boas',
    melhorHorario: '7h-11h',
    visibilidade: 'Alta',
    correnteMarinha: 'Fraca',
    risco: 'Baixo',
    descricao: 'Mar relativamente calmo, com ondas regulares. Bom para iniciantes e intermediários.',
    latitude: '-23.4004',
    longitude: '-45.0096'
  },
  {
    praia: 'Praia do Rosa',
    estado: 'SC',
    regiao: 'Imbituba',
    tamanhoOndas: '2.0-2.5m',
    vento: '12km/h S',
    temperatura: '23°C',
    temperaturaAgua: '20°C',
    condicao: 'Excelentes',
    melhorHorario: '6h-10h',
    visibilidade: 'Alta',
    correnteMarinha: 'Moderada',
    risco: 'Médio',
    descricao: 'Ondas potentes com boas formações. Ideal para surfistas experientes. Presença de correntes laterais.',
    latitude: '-28.1275',
    longitude: '-48.6407'
  },
  {
    praia: 'Arpoador',
    estado: 'RJ',
    regiao: 'Rio de Janeiro',
    tamanhoOndas: '1.0-1.5m',
    vento: '6km/h E',
    temperatura: '29°C',
    temperaturaAgua: '25°C',
    condicao: 'Médias',
    melhorHorario: '6h-8h',
    visibilidade: 'Média',
    correnteMarinha: 'Fraca',
    risco: 'Baixo',
    descricao: 'Ondas menores, ideal para iniciantes e longboards. Pico urbano com fácil acesso.',
    latitude: '-22.9885',
    longitude: '-43.1954'
  },
  {
    praia: 'Fernando de Noronha',
    estado: 'PE',
    regiao: 'Ilha de Fernando de Noronha',
    tamanhoOndas: '2.5-3.0m',
    vento: '20km/h NE',
    temperatura: '31°C',
    temperaturaAgua: '28°C',
    condicao: 'Excelentes',
    melhorHorario: '8h-11h',
    visibilidade: 'Excelente',
    correnteMarinha: 'Forte',
    risco: 'Alto',
    descricao: 'Ondas potentes em águas cristalinas. Recomendado para surfistas avançados devido às correntes e recifes.',
    latitude: '-3.8544',
    longitude: '-32.4241'
  },
  {
    praia: 'Jericoacoara',
    estado: 'CE',
    regiao: 'Jijoca de Jericoacoara',
    tamanhoOndas: '1.5-2.0m',
    vento: '25km/h NE',
    temperatura: '32°C',
    temperaturaAgua: '28°C',
    condicao: 'Boas',
    melhorHorario: '9h-14h',
    visibilidade: 'Alta',
    correnteMarinha: 'Moderada',
    risco: 'Médio',
    descricao: 'Condições excelentes para windsurf e kitesurf. Surf melhor nas primeiras horas da manhã antes do vento forte.',
    latitude: '-2.7964',
    longitude: '-40.5114'
  },
  {
    praia: 'Pipa',
    estado: 'RN',
    regiao: 'Tibau do Sul',
    tamanhoOndas: '1.6-2.2m',
    vento: '18km/h NE',
    temperatura: '30°C',
    temperaturaAgua: '27°C',
    condicao: 'Boas',
    melhorHorario: '7h-11h',
    visibilidade: 'Alta',
    correnteMarinha: 'Moderada',
    risco: 'Médio',
    descricao: 'Ondas regulares, com formação de tubos na maré baixa. Ideal para surfistas intermediários.',
    latitude: '-6.2308',
    longitude: '-35.0438'
  }
];

const regioesBrasil = [
  'Litoral Norte de São Paulo',
  'Florianópolis',
  'Ubatuba',
  'Rio de Janeiro',
  'Nordeste',
  'Ilha de Fernando de Noronha',
  'Tibau do Sul',
  'Jijoca de Jericoacoara',
  'Imbituba'
];

const PrevisaoPage = () => {
  const [regiaoSelecionada, setRegiaoSelecionada] = React.useState('Todas');
  const [diaFiltro, setDiaFiltro] = React.useState(0); // 0 = hoje, 1 = amanhã, etc.
  
  const getCondicaoClass = (condicao: string): string => {
    switch(condicao) {
      case 'Excelentes':
        return 'bg-green-500/20 text-green-100';
      case 'Ótimas':
        return 'bg-green-400/20 text-green-100';
      case 'Boas':
        return 'bg-blue-400/20 text-blue-100';
      case 'Médias':
        return 'bg-yellow-400/20 text-yellow-100';
      default:
        return 'bg-red-400/20 text-red-100';
    }
  };
  
  // Filtrar praias por região selecionada (ou exibir todas)
  const praiasFiltradas = regiaoSelecionada === 'Todas' 
    ? previsaoOndas 
    : previsaoOndas.filter(praia => praia.regiao === regiaoSelecionada);

  return (
    <Layout>
      <NextSeo
        title="Previsão de Ondas | JornalK1 Surf"
        description="Confira a previsão de ondas atualizada para as melhores praias do Brasil. Planeje sua próxima sessão de surf com dados precisos sobre condições do mar."
        canonical="https://jornalk1surf.com.br/previsao"
        openGraph={{
          url: 'https://jornalk1surf.com.br/previsao',
          title: 'Previsão de Ondas | JornalK1 Surf',
          description: 'Confira a previsão de ondas atualizada para as melhores praias do Brasil.',
          images: [
            {
              url: 'https://jornalk1surf.com.br/images/og-previsao.jpg',
              width: 1200,
              height: 630,
              alt: 'Previsão de Ondas JornalK1 Surf',
            },
          ],
          site_name: 'JornalK1 Surf',
        }}
      />
      
      {/* Header */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-r from-blue-900 to-teal-800 text-white">
        {/* Ondas decorativas */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg className="absolute bottom-0 w-full h-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#ffffff" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="#ffffff" opacity=".5"></path>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Previsão de Ondas</h1>
            <p className="text-xl text-blue-100">Planeje sua sessão de surf com dados atualizados sobre as condições do mar</p>
          </motion.div>
        </div>
      </section>
      
      {/* Filtros */}
      <section className="py-8 bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 justify-between items-center">
            <div className="w-full md:w-auto">
              <label htmlFor="regiao-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Região</label>
              <select 
                id="regiao-input"
                className="select select-bordered w-full md:w-52"
                value={regiaoSelecionada}
                onChange={(e) => setRegiaoSelecionada(e.target.value)}
              >
                <option value="Todas">Todas as regiões</option>
                {regioesBrasil.map(regiao => (
                  <option key={regiao} value={regiao}>{regiao}</option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:w-auto">
              <label htmlFor="dia-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dia</label>
              <div className="flex space-x-2">
                {['Hoje', 'Amanhã', '2 dias', '3 dias'].map((dia, index) => (
                  <button
                    key={dia}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      diaFiltro === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                    }`}
                    onClick={() => setDiaFiltro(index)}
                  >
                    {dia}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Previsão */}
      <section className="py-12 bg-gray-50 dark:bg-dark-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {praiasFiltradas.map((previsao, index) => (
              <motion.div 
                key={`${previsao.praia}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card card-hover overflow-hidden"
              >
                <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-teal-600 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-xl">{previsao.praia}</h3>
                      <div className="flex items-center text-sm text-blue-100">
                        <FaMapMarkerAlt className="mr-1" />
                        <span>{previsao.estado} - {previsao.regiao}</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCondicaoClass(previsao.condicao)}`}>
                      {previsao.condicao}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-white dark:bg-dark-900">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-400">
                        <FaWater />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Ondas</div>
                        <div className="font-bold">{previsao.tamanhoOndas}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-400">
                        <FaWind />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Vento</div>
                        <div className="font-bold">{previsao.vento}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3 text-yellow-600 dark:text-yellow-400">
                        <FaSun />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Temperatura</div>
                        <div className="font-bold">{previsao.temperatura}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-400">
                        <FaThermometerHalf />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Água</div>
                        <div className="font-bold">{previsao.temperaturaAgua}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4 px-3 py-2 bg-gray-50 dark:bg-dark-800 rounded-lg">
                    <FaClock className="text-blue-600 dark:text-blue-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Melhor horário</div>
                      <div className="font-medium">{previsao.melhorHorario}</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {previsao.descricao}
                  </p>
                  
                  <div className="flex items-center text-sm">
                    <FaInfoCircle className="text-blue-600 dark:text-blue-400 mr-2" />
                    <div className="text-gray-600 dark:text-gray-400">
                      Risco: <span className={`font-medium ${
                        previsao.risco === 'Baixo' ? 'text-green-600 dark:text-green-400' :
                        previsao.risco === 'Médio' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>{previsao.risco}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {praiasFiltradas.length === 0 && (
            <div className="text-center py-16">
              <FaInfoCircle className="text-4xl text-blue-600 dark:text-blue-400 mb-4 mx-auto" />
              <h3 className="text-xl font-bold mb-2">Nenhuma praia encontrada</h3>
              <p className="text-gray-600 dark:text-gray-400">Não encontramos praias na região selecionada. Tente outra região.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Legenda */}
      <section className="py-8 bg-white dark:bg-dark-900">
        <div className="container mx-auto px-4">
          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700">
            <div className="bg-gray-50 dark:bg-dark-800 px-6 py-4 border-b border-gray-200 dark:border-dark-700">
              <h3 className="font-bold text-lg">Legenda e Terminologia</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Condições</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="inline-block w-16 px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-300 rounded-full text-xs font-medium text-center mr-2">Excelentes</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Condições perfeitas para surf</span>
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-16 px-2 py-1 bg-green-400/20 text-green-700 dark:text-green-300 rounded-full text-xs font-medium text-center mr-2">Ótimas</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Muito boas condições</span>
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-16 px-2 py-1 bg-blue-400/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium text-center mr-2">Boas</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Condições adequadas para surf</span>
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-16 px-2 py-1 bg-yellow-400/20 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium text-center mr-2">Médias</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Condições aceitáveis</span>
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-16 px-2 py-1 bg-red-400/20 text-red-700 dark:text-red-300 rounded-full text-xs font-medium text-center mr-2">Ruins</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Não recomendado para surf</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Medições</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="font-medium text-gray-700 dark:text-gray-200 w-32">Tamanho Ondas:</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Altura medida em metros (da base ao topo)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-gray-700 dark:text-gray-200 w-32">Vento:</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Velocidade em km/h e direção (N, S, E, W)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-gray-700 dark:text-gray-200 w-32">Temperatura:</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Temperatura do ar em graus Celsius</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-gray-700 dark:text-gray-200 w-32">Água:</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Temperatura da água em graus Celsius</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-gray-700 dark:text-gray-200 w-32">Risco:</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Nível de risco para surfistas (considera correntes, recifes, crowd)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Última atualização */}
      <section className="py-6 bg-gray-50 dark:bg-dark-800 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Última atualização: {new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Os dados são atualizados a cada 6 horas. As condições podem mudar rapidamente.
        </p>
      </section>
    </Layout>
  );
};

export default PrevisaoPage;
