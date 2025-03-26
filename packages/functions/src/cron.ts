import axios from 'axios';
import { parseString } from 'xml2js';

interface SitemapUrl {
  loc: string[];
  lastmod?: string[];
  changefreq?: string[];
  priority?: string[];
}

interface SitemapResult {
  urlset: {
    url: SitemapUrl[];
  };
}

export const handler = async () => {
  try {
    const sitemapUrl = 'https://www.immobilien-pees.de/sw_immo_expose-sitemap.xml';
    
    // Fetch the sitemap
    const response = await axios.get(sitemapUrl);
    
    // Parse the XML
    const result = await new Promise<SitemapResult>((resolve, reject) => {
      parseString(response.data, (err: Error | null, result: SitemapResult) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    // Extract URLs from the sitemap
    const urls = result.urlset.url.map((item: SitemapUrl) => item.loc[0]);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Sitemap URLs retrieved successfully',
        urls: urls
      })
    };
  } catch (error) {
    console.error('Error scraping sitemap:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error scraping sitemap',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
}; 