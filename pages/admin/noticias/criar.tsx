import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaImage } from 'react-icons/fa';

// Mock categories for the form
const categories = [
  { id: 1, name: 'Campeonatos' },
  { id: 2, name: 'Tecnologia' },
  { id: 3, name: 'Equipamentos' },
  { id: 4, name: 'Entrevistas' },
  { id: 5, name: 'Dicas & Técnicas' },
];

const CreateNewsPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    excerpt: '',
    content: '',
    status: 'draft',
    featuredImage: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      setFormData({
        ...formData,
        title: value,
        slug,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setFormData({
        ...formData,
        featuredImage: file,
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to admin dashboard
      router.push('/admin');
    } catch (error) {
      console.error('Error creating news:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <Link href="/admin" className="mr-4 text-gray-500 hover:text-primary">
              <FaArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Criar Nova Notícia</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main content - 2/3 width */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Digite o título da notícia"
                />
              </div>
              
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="titulo-da-noticia"
                />
                <p className="mt-1 text-sm text-gray-500">
                  URL amigável para a notícia (gerada automaticamente do título)
                </p>
              </div>
              
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                  Resumo
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Breve resumo da notícia (será exibido nos cards e listagens)"
                />
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Conteúdo
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Conteúdo completo da notícia"
                />
              </div>
            </div>
            
            {/* Sidebar - 1/3 width */}
            <div className="space-y-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagem Destacada
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  {previewUrl ? (
                    <div className="space-y-2 text-center">
                      <img src={previewUrl} alt="Preview" className="mx-auto h-40 w-auto object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, featuredImage: null });
                          setPreviewUrl('');
                        }}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remover imagem
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none"
                        >
                          <span>Fazer upload de imagem</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF até 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-2 px-4 rounded-md font-medium hover:bg-primary-dark transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Salvar Notícia
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewsPage;
