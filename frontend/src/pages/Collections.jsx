import { Link } from 'react-router-dom'

const Collections = () => {
  // Gold collections with images and descriptions
  const collections = [
    {
      name: 'Bridal Collection',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
      description: 'Exquisite bridal jewelry sets for your special day',
      link: '/products?occasion=Bridal&metal=Gold',
      items: ['Necklace Sets', 'Earrings', 'Bangles', 'Rings']
    },
    {
      name: 'Traditional Collection',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
      description: 'Classic designs inspired by Indian heritage',
      link: '/products?style=Traditional&metal=Gold',
      items: ['Kundan Sets', 'Polki Jewelry', 'Antique Designs']
    },
    {
      name: 'Modern Collection',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
      description: 'Contemporary designs for the modern woman',
      link: '/products?style=Contemporary&metal=Gold',
      items: ['Minimalist Pieces', 'Geometric Designs', 'Stackable Jewelry']
    },
    {
      name: 'Daily Wear Collection',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
      description: 'Lightweight and comfortable jewelry for everyday',
      link: '/products?occasion=Daily Wear&metal=Gold',
      items: ['Lightweight Chains', 'Small Earrings', 'Delicate Rings']
    },
    {
      name: 'Festive Collection',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
      description: 'Statement pieces for festivals and celebrations',
      link: '/products?occasion=Festive&metal=Gold',
      items: ['Heavy Necklaces', 'Jhumkas', 'Bracelet Sets']
    },
    {
      name: 'Diamond Collection',
      image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=800&fit=crop',
      description: 'Gold jewelry adorned with premium diamonds',
      link: '/products?metal=Diamond',
      items: ['Diamond Rings', 'Diamond Necklaces', 'Diamond Earrings']
    },
    {
      name: 'Temple Collection',
      image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop',
      description: 'Spiritual and divine designs with temple motifs',
      link: '/products?style=Heritage&metal=Gold',
      items: ['Temple Jewelry', 'God Idols', 'Religious Pendants']
    },
    {
      name: 'Antique Collection',
      image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop',
      description: 'Vintage-inspired pieces with old-world charm',
      link: '/products?style=Heritage&metal=Gold',
      items: ['Antique Sets', 'Vintage Designs', 'Classic Pieces']
    },
    {
      name: 'Kids Collection',
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
      description: 'Delicate and safe jewelry for children',
      link: '/products?metal=Gold',
      items: ['Baby Bangles', 'Kids Earrings', 'Small Pendants']
    },
    {
      name: 'Men\'s Collection',
      image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=800&fit=crop',
      description: 'Bold and elegant jewelry for men',
      link: '/products?metal=Gold',
      items: ['Men\'s Rings', 'Chains', 'Bracelets']
    },
    {
      name: 'Custom Collection',
      image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=800&fit=crop',
      description: 'Made-to-order pieces designed just for you',
      link: '/products?badges=Made to order&metal=Gold',
      items: ['Custom Designs', 'Personalized Pieces', 'Bespoke Jewelry']
    },
    {
      name: 'Luxury Collection',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
      description: 'Premium high-end jewelry for special occasions',
      link: '/products?metal=Gold',
      items: ['Heavy Sets', 'Premium Diamonds', 'Exclusive Designs']
    }
  ]

  // Category-specific collections
  const categoryCollections = {
    Rings: [
      { name: 'Solitaire Rings', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop', link: '/products?category=Rings&metal=Gold' },
      { name: 'Wedding Rings', image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop', link: '/products?category=Rings&occasion=Bridal&metal=Gold' },
      { name: 'Cocktail Rings', image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop', link: '/products?category=Rings&metal=Gold' },
      { name: 'Eternity Rings', image: 'https://images.unsplash.com/photo-1611955167811-4711904a8c67?w=400&h=400&fit=crop', link: '/products?category=Rings&metal=Gold' }
    ],
    Earrings: [
      { name: 'Jhumkas', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop', link: '/products?category=Earrings&metal=Gold' },
      { name: 'Stud Earrings', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop', link: '/products?category=Earrings&metal=Gold' },
      { name: 'Hoops', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop', link: '/products?category=Earrings&metal=Gold' },
      { name: 'Danglers', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop', link: '/products?category=Earrings&metal=Gold' }
    ],
    Necklaces: [
      { name: 'Choker Necklaces', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop', link: '/products?category=Necklaces&metal=Gold' },
      { name: 'Long Chains', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop', link: '/products?category=Necklaces&metal=Gold' },
      { name: 'Statement Necklaces', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', link: '/products?category=Necklaces&metal=Gold' },
      { name: 'Mangalsutras', image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop', link: '/products?category=Mangalsutra&metal=Gold' }
    ]
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-[#7f1d4a]/60 mb-3">Our Collections</p>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#7f1d4a] mb-4">Gold Jewelry Collections</h1>
        <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
        <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
          Explore our diverse range of gold jewelry collections, each crafted with precision and designed to suit every occasion and style.
        </p>
      </div>

      {/* Main Collections */}
      <section className="mb-16">
        <h2 className="text-2xl font-serif font-bold text-[#7f1d4a] mb-8 text-center">Featured Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <Link
              key={index}
              to={collection.link}
              className="card group overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden relative bg-gray-100">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-bold text-xl mb-2">{collection.name}</h3>
                  <p className="text-sm text-gray-200 mb-3">{collection.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {collection.items.map((item, idx) => (
                      <span key={idx} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-gold-500 text-white rounded-full p-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Category-Specific Collections */}
      <section className="mt-20">
        <h2 className="text-2xl font-serif font-bold text-[#7f1d4a] mb-8 text-center">Shop by Category Collections</h2>

        {/* Rings Collections */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-[#7f1d4a] mb-6 flex items-center">
            <span className="w-1 h-8 bg-gold-500 mr-3"></span>
            Rings Collections
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categoryCollections.Rings.map((item, idx) => (
              <Link key={idx} to={item.link} className="card group overflow-hidden">
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-4 text-center bg-white">
                  <h4 className="font-semibold text-[#7f1d4a] group-hover:text-gold-600 transition-colors">
                    {item.name}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Earrings Collections */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-[#7f1d4a] mb-6 flex items-center">
            <span className="w-1 h-8 bg-gold-500 mr-3"></span>
            Earrings Collections
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categoryCollections.Earrings.map((item, idx) => (
              <Link key={idx} to={item.link} className="card group overflow-hidden">
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-4 text-center bg-white">
                  <h4 className="font-semibold text-[#7f1d4a] group-hover:text-gold-600 transition-colors">
                    {item.name}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Necklaces Collections */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-[#7f1d4a] mb-6 flex items-center">
            <span className="w-1 h-8 bg-gold-500 mr-3"></span>
            Necklaces Collections
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categoryCollections.Necklaces.map((item, idx) => (
              <Link key={idx} to={item.link} className="card group overflow-hidden">
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-4 text-center bg-white">
                  <h4 className="font-semibold text-[#7f1d4a] group-hover:text-gold-600 transition-colors">
                    {item.name}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-br from-gold-50 to-premium-light rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-serif font-bold text-[#7f1d4a] mb-4">Can't Find What You're Looking For?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          We offer custom jewelry design services. Contact us to create a unique piece tailored to your preferences.
        </p>
        <Link to="/products" className="btn-primary">
          Explore All Products
        </Link>
      </div>
    </div>
  )
}

export default Collections

