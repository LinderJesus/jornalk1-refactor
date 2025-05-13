import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';

interface FeaturedVideoProps {
  videoId: string;
  title: string;
  description?: string;
}

const FeaturedVideo = ({ videoId, title, description }: FeaturedVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlay = () => {
    setIsPlaying(true);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-dark-700 p-6 rounded-xl shadow-md transition-colors duration-200"
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Vídeo em Destaque</h3>
      
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-md">
        {!isPlaying ? (
          <div className="absolute inset-0 bg-black">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <motion.button
                  onClick={handlePlay}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-primary-600 hover:bg-primary-700 text-white rounded-full w-16 h-16 flex items-center justify-center transition-colors"
                >
                  <FaPlay className="ml-1" size={24} />
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      
      <div className="mt-4">
        <h4 className="font-medium text-gray-800 dark:text-white">{title}</h4>
        {description && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
        )}
      </div>
    </motion.div>
  );
};

export default FeaturedVideo;
