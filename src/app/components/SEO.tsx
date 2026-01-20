import { useEffect } from 'react';
import { Product } from '../types';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  product?: Product;
  noindex?: boolean;
  imageUrl?: string;
}

export function SEO({
  title = 'NŪRA Collection - Luxury Modest Fashion | Premium Hijabs & Abayas',
  description = 'Discover elegant and luxurious hijabs, abayas, and modest fashion at NŪRA Collection. Premium quality materials, beautiful designs, and exceptional craftsmanship. Free shipping on orders over $150.',
  keywords = 'hijab, abaya, modest fashion, luxury hijabs, silk hijab, chiffon hijab, muslim fashion, islamic clothing, premium hijabs, elegant abayas',
  image = 'https://images.unsplash.com/photo-1762605135012-56a59a059e60',
  url = typeof window !== 'undefined' ? window.location.href : 'https://nura-collection.com',
  type = 'website',
  product,
  noindex = false,
  imageUrl, // Added for flexibility if needed, but primary source is product.imageUrl
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'NŪRA Collection');
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', image || product?.imageUrl || '', 'property');
    updateMetaTag('og:url', url, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:site_name', 'NŪRA Collection', 'property');
    updateMetaTag('og:locale', 'en_US', 'property');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image || product?.imageUrl || '');
    updateMetaTag('twitter:site', '@nura_collection');

    // Product-specific tags
    if (product) {
      updateMetaTag('product:price:amount', product.price.toString(), 'property');
      updateMetaTag('product:price:currency', product?.currency || 'DJF', 'property');
      updateMetaTag('product:availability', 'in stock', 'property');
      updateMetaTag('product:condition', 'new', 'property');
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Structured Data (JSON-LD)
    const existingScript = document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';

    let structuredData: any;

    if (product) {
      // Product structured data
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.imageUrl,
        brand: {
          '@type': 'Brand',
          name: 'NŪRA Collection',
        },
        offers: {
          '@type': 'Offer',
          url: url,
          priceCurrency: product?.currency || 'DJF',
          price: product.price,
          availability: 'https://schema.org/InStock',
          priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '127',
        },
      };
    } else {
      // Organization and Website structured data
      structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://nura-collection.com/#organization',
            name: 'NŪRA Collection',
            url: 'https://nura-collection.com',
            logo: {
              '@type': 'ImageObject',
              url: 'https://nura-collection.com/logo.png',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+1-555-123-4567',
              contactType: 'Customer Service',
              email: 'info@nura-collection.com',
            },
            sameAs: [
              'https://www.facebook.com/nuracollection',
              'https://www.instagram.com/nuracollection',
              'https://www.twitter.com/nura_collection',
            ],
          },
          {
            '@type': 'WebSite',
            '@id': 'https://nura-collection.com/#website',
            url: 'https://nura-collection.com',
            name: 'NŪRA Collection',
            description: description,
            publisher: {
              '@id': 'https://nura-collection.com/#organization',
            },
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://nura-collection.com/search?q={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@type': 'WebPage',
            '@id': url + '#webpage',
            url: url,
            name: title,
            description: description,
            isPartOf: {
              '@id': 'https://nura-collection.com/#website',
            },
            about: {
              '@id': 'https://nura-collection.com/#organization',
            },
          },
        ],
      };
    }

    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, [title, description, keywords, image, url, type, product, noindex]);

  return null;
}
