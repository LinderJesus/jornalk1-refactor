import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaNewspaper, FaEdit, FaTrash, FaPlus, FaEye, FaFilter, FaWater, FaTrophy, FaUsers, FaComments, FaChartLine } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';

// Mock data for the admin dashboard - Atualizado com conteúdo de surf
const mockNews = [
  {
    id: 1,
    title: 'Gabriel Medina vence o Tahiti Pro 2025 em ondas gigantes',
    category: 'Competições',
    status: 'Publicado',
    date: '10/05/2025',
    views: 8452,
  },
  {
    id: 2,
    title: 'Novo sistema de monitoramento reduz ataques de tubarão em 40%',
    category: 'Tecnologia',
    status: 'Publicado',
    date: '08/05/2025',
    views: 5231,
  },
  {
    id: 3,
    title: 'Tendências 2025: As pranchas que estão dominando as ondas',
    category: 'Equipamentos',
    status: 'Publicado',
    date: '05/05/2025',
    views: 4128,
  },
  {
    id: 4,
    title: 'Entrevista exclusiva com Italo Ferreira após conquista do título',
    category: 'Entrevistas',
    status: 'Rascunho',
    date: '03/05/2025',
    views: 0,
  },
];

const AdminDashboard = () => {
  const [news, setNews] = useState(mockNews);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('todos');

  useEffect(() => {
    // Simulate loading data from API
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta notícia?')) {
      setNews(news.filter(item => item.id !== id));
    }
  };

  // Filtrar notícias
  const filteredNews = filter === 'todos' 
    ? news 
    : news.filter(item => item.status.toLowerCase() === filter.toLowerCase());

  return (
    <AdminLayout title="Dashboard">
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <FaWater className="text-blue-600 mr-2" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Dashboard JornalK1 Surf</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 hover-float text-white">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-white/20 text-white">
                <FaNewspaper size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-white/80 text-sm font-medium">Total de Notícias</h3>
                <p className="text-2xl font-semibold">{news.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow p-6 hover-float text-white">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-white/20 text-white">
                <FaEye size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-white/80 text-sm font-medium">Visualizações</h3>
                <p className="text-2xl font-semibold">{news.reduce((total, item) => total + (item.views || 0), 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow p-6 hover-float text-white">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-white/20 text-white">
                <FaEdit size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-white/80 text-sm font-medium">Rascunhos</h3>
                <p className="text-2xl font-semibold">{news.filter(item => item.status === 'Rascunho').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow p-6 hover-float text-white">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-white/20 text-white">
                <FaTrophy size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-white/80 text-sm font-medium">Competições</h3>
                <p className="text-2xl font-semibold">{news.filter(item => item.category === 'Competições').length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-700 flex items-center">
              <FaNewspaper className="mr-2" /> Gerenciar Notícias
            </h2>
            <p className="text-sm text-gray-500 mt-1">Gerencie todas as notícias do portal</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <select 
                className="appearance-none px-4 py-2 pr-8 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="publicado">Publicados</option>
                <option value="rascunho">Rascunhos</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaFilter size={12} />
              </div>
            </div>
            
            <Link href="/admin/noticias/criar" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors">
              <FaPlus className="mr-2" /> Nova Notícia
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Carregando...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNews.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'Publicado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/noticias/${item.id}`} className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-50">
                          <FaEye size={18} />
                        </Link>
                        <Link href={`/admin/noticias/editar/${item.id}`} className="text-green-500 hover:text-green-700 transition-colors p-1 rounded-full hover:bg-green-50">
                          <FaEdit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminLayout>
  );
};

export default AdminDashboard;
