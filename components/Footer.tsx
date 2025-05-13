import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaTiktok, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowUp, FaWater } from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-dark-bg-primary text-white border-t border-gray-800">
      

      {/* Newsletter Section */}
      <div className="relative pt-20 pb-8 border-b border-white/10">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-col md:flex-row items-center justify-between rounded-xl glass p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 md:mb-0 md:mr-8 max-w-xl">
              <h3 className="text-2xl font-bold mb-2">Fique por dentro do mundo do surf</h3>
              <p className="text-blue-100">
                Receba as últimas notícias, previsões de ondas e dicas exclusivas diretamente no seu email.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Seu melhor email"
                  className="px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 min-w-[250px]"
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary rounded-full"
                >
                  Inscrever-se
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Conteúdo do Footer */}
      <div className="container mx-auto px-4 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <FaWater className="text-3xl text-blue-accent mr-2" />
              <span className="text-2xl font-bold">JornalK1 <span className="text-blue-accent">Surf</span></span>
            </Link>
            <p className="text-gray-400 mb-4">
              Seu portal definitivo para o mundo do surf. Acompanhe as últimas notícias, competições, equipamentos, previsões de ondas e muito mais.
            </p>
            <div className="flex space-x-4 mt-2">
              <a href="https://facebook.com/jornalk1surf" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <FaFacebook className="text-xl" />
              </a>
              <a href="https://instagram.com/jornalk1surf" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <FaInstagram className="text-xl" />
              </a>
              <a href="https://twitter.com/jornalk1surf" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <FaTwitter className="text-xl" />
              </a>
              <a href="https://youtube.com/jornalk1surf" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube">
                <FaYoutube className="text-xl" />
              </a>
              <a href="https://tiktok.com/@jornalk1surf" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="TikTok">
                <FaTiktok className="text-xl" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/noticias" className="text-gray-400 hover:text-white transition-colors">Notícias</Link></li>
              <li><Link href="/previsao" className="text-gray-400 hover:text-white transition-colors">Previsão de Ondas</Link></li>
              <li><Link href="/dicas" className="text-gray-400 hover:text-white transition-colors">Dicas</Link></li>
              <li><Link href="/sobre" className="text-gray-400 hover:text-white transition-colors">Sobre Nós</Link></li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Categorias</h4>
            <ul className="space-y-2">
              <li><Link href="/categorias/competicoes" className="text-gray-400 hover:text-white transition-colors">Competições</Link></li>
              <li><Link href="/categorias/equipamentos" className="text-gray-400 hover:text-white transition-colors">Equipamentos</Link></li>
              <li><Link href="/categorias/destinos" className="text-gray-400 hover:text-white transition-colors">Destinos</Link></li>
              <li><Link href="/categorias/tecnicas" className="text-gray-400 hover:text-white transition-colors">Técnicas</Link></li>
              <li><Link href="/categorias/sustentabilidade" className="text-gray-400 hover:text-white transition-colors">Sustentabilidade</Link></li>
              <li><Link href="/categorias/cultura" className="text-gray-400 hover:text-white transition-colors">Cultura</Link></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-blue-accent mt-1 mr-3" />
                <span className="text-gray-400">Avenida do Surf, 1234<br/>Florianópolis, SC - Brasil</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-blue-accent mr-3" />
                <span className="text-gray-400">(48) 99999-9999</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-blue-accent mr-3" />
                <a href="mailto:contato@jornalk1surf.com.br" className="text-gray-400 hover:text-white transition-colors">contato@jornalk1surf.com.br</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Termos de Uso e Política de Privacidade */}
        <div className="container mx-auto px-4 pt-8 pb-8 border-t border-gray-800 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} JornalK1 Surf. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6">
              <Link href="/termos" className="text-gray-400 hover:text-white text-sm transition-colors">Termos de Uso</Link>
              <Link href="/privacidade" className="text-gray-400 hover:text-white text-sm transition-colors">Política de Privacidade</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</Link>
            </div>
          </div>
        </div>

        {/* Botão de voltar ao topo */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-accent text-white shadow-lg hover:bg-blue-600 transition-colors"
          aria-label="Voltar ao topo"
        >
          <FaArrowUp />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
