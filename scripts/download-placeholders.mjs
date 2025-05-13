import fs from 'fs';
import path from 'path';
import https from 'https';

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// List of placeholder images to download
const images = [
  {
    url: 'https://placehold.co/800x500/0066cc/FFFFFF/png?text=Featured+News',
    filename: 'featured-news.jpg'
  },
  {
    url: 'https://placehold.co/800x500/0066cc/FFFFFF/png?text=News+1',
    filename: 'news-1.jpg'
  },
  {
    url: 'https://placehold.co/800x500/0066cc/FFFFFF/png?text=News+2',
    filename: 'news-2.jpg'
  },
  {
    url: 'https://placehold.co/800x500/0066cc/FFFFFF/png?text=Category+1',
    filename: 'category-1.jpg'
  },
  {
    url: 'https://placehold.co/800x500/0066cc/FFFFFF/png?text=Category+2',
    filename: 'category-2.jpg'
  },
  {
    url: 'https://placehold.co/800x500/0066cc/FFFFFF/png?text=Category+3',
    filename: 'category-3.jpg'
  },
  {
    url: 'https://placehold.co/800x500/0066cc/FFFFFF/png?text=Partner+1',
    filename: 'partner-1.jpg'
  },
  {
    url: 'https://placehold.co/800x500/0066cc/FFFFFF/png?text=Partner+2',
    filename: 'partner-2.jpg'
  },
  {
    url: 'https://placehold.co/800x500/0066cc/FFFFFF/png?text=Partner+3',
    filename: 'partner-3.jpg'
  },
  {
    url: 'https://placehold.co/800x500/0066cc/FFFFFF/png?text=Partner+4',
    filename: 'partner-4.jpg'
  },
  {
    url: 'https://placehold.co/800x500/0066cc/FFFFFF/png?text=Partner+5',
    filename: 'partner-5.jpg'
  },
  {
    url: 'https://placehold.co/800x500/0066cc/FFFFFF/png?text=Partner+6',
    filename: 'partner-6.jpg'
  },
];

// Download function
const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, filename);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`File ${filename} already exists, skipping...`);
      return resolve();
    }
    
    console.log(`Downloading ${filename}...`);
    
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there's an error
      console.error(`Error downloading ${filename}: ${err.message}`);
      reject(err);
    });
  });
};

// Download all images
const downloadAll = async () => {
  try {
    for (const image of images) {
      await downloadImage(image.url, image.filename);
    }
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
};

downloadAll();
