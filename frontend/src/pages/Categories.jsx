import { Link } from 'react-router-dom'

const Categories = () => {
  // Gold subcategories with high-quality images
  const goldCategories = [
    { 
      name: 'Rings', 
      image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop', 
      link: '/products?metal=Gold&category=Rings',
      description: 'Elegant gold rings for every occasion'
    },
    { 
      name: 'Earrings', 
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop', 
      link: '/products?metal=Gold&category=Earrings',
      description: 'Stunning gold earrings to enhance your beauty'
    },
    { 
      name: 'Pendants', 
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop', 
      link: '/products?metal=Gold&category=Pendants',
      description: 'Beautiful gold pendants with intricate designs'
    },
    { 
      name: 'Chains', 
      image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop', 
      link: '/products?metal=Gold&category=Chains',
      description: 'Premium gold chains in various styles'
    },
    { 
      name: 'Bangles', 
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop', 
      link: '/products?metal=Gold&category=Bangles',
      description: 'Traditional and modern gold bangles'
    },
    { 
      name: 'Bracelets', 
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop', 
      link: '/products?metal=Gold&category=Bracelets',
      description: 'Elegant gold bracelets for daily wear'
    },
    { 
      name: 'Necklaces', 
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop', 
      link: '/products?metal=Gold&category=Necklaces',
      description: 'Luxurious gold necklaces and sets'
    },
    { 
      name: 'Sets', 
      image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=800&fit=crop', 
      link: '/products?metal=Gold&category=Sets',
      description: 'Complete gold jewelry sets for special occasions'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-[#7f1d4a]/60 mb-3">Gold Collection</p>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#7f1d4a] mb-4">Shop Gold by Category</h1>
        <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
        <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
          Explore our exquisite collection of premium gold jewelry. Each piece is crafted with precision and care, 
          reflecting timeless elegance and traditional craftsmanship.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {goldCategories.map((category, index) => (
          <Link 
            key={index} 
            to={category.link} 
            className="card group overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            <div className="aspect-square overflow-hidden relative bg-gray-100">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-gold-500 text-white rounded-full p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white">
              <h3 className="font-bold text-xl text-[#7f1d4a] mb-2 group-hover:text-gold-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-gray-600 text-sm">{category.description}</p>
              <div className="mt-4 flex items-center text-gold-600 font-medium text-sm group-hover:text-gold-700">
                <span>Explore Collection</span>
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Collections Section */}
      <section className="mt-16">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.25em] text-[#7f1d4a]/60 mb-3">Explore More</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#7f1d4a] mb-4">Our Collections</h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Link to="/collections" className="card group overflow-hidden hover:shadow-xl transition-all">
            <div className="aspect-square overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop"
                alt="Bridal Collection"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold text-lg">Bridal</h3>
              </div>
            </div>
          </Link>
          <Link to="/collections" className="card group overflow-hidden hover:shadow-xl transition-all">
            <div className="aspect-square overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop"
                alt="Traditional Collection"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold text-lg">Traditional</h3>
              </div>
            </div>
          </Link>
          <Link to="/collections" className="card group overflow-hidden hover:shadow-xl transition-all">
            <div className="aspect-square overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop"
                alt="Modern Collection"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold text-lg">Modern</h3>
              </div>
            </div>
          </Link>
          <Link to="/collections" className="card group overflow-hidden hover:shadow-xl transition-all">
            <div className="aspect-square overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop"
                alt="Diamond Collection"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold text-lg">Diamond</h3>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center">
          <Link to="/collections" className="btn-primary">
            View All Collections
          </Link>
        </div>
      </section>

      {/* Additional Info Section */}
      <div className="mt-16 bg-gradient-to-br from-gold-50 to-premium-light rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-serif font-bold text-[#7f1d4a] mb-4">Why Choose Sudha Jewelry?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div>
            <div className="text-3xl mb-2">✓</div>
            <h3 className="font-semibold text-[#7f1d4a] mb-2">BIS Hallmark Certified</h3>
            <p className="text-gray-600 text-sm">All our gold jewelry is certified for purity and quality</p>
          </div>
          <div>
            <div className="text-3xl mb-2">✓</div>
            <h3 className="font-semibold text-[#7f1d4a] mb-2">Expert Craftsmanship</h3>
            <p className="text-gray-600 text-sm">Handcrafted by skilled artisans with decades of experience</p>
          </div>
          <div>
            <div className="text-3xl mb-2">✓</div>
            <h3 className="font-semibold text-[#7f1d4a] mb-2">Transparent Pricing</h3>
            <p className="text-gray-600 text-sm">Real-time gold rates with clear making charges</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Categories

