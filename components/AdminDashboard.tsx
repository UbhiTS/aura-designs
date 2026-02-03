'use client';

import { useState, useCallback, useMemo } from 'react';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  Edit3,
  LogOut,
  Upload,
  X,
  Save,
  Sparkles,
  Package,
  Link as LinkIcon,
  Star,
  Eye,
  EyeOff,
  GripVertical,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import HomepageImagesManager from './HomepageImagesManager';
import TestimonialsManager from './TestimonialsManager';

interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price?: number | null;
  category: string;
  images: ProductImage[];
  featured: boolean;
  available: boolean;
  createdAt: Date;
}

interface AdminDashboardProps {
  initialProducts: Product[];
  session: Session;
}

type UploadedImage = {
  url: string;
  alt?: string | null;
  file?: File;
  preview?: string;
};

export default function AdminDashboardClient({ initialProducts, session }: AdminDashboardProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'homepage' | 'testimonials'>('products');

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAvailable, setFilterAvailable] = useState<string>('all');
  const [filterFeatured, setFilterFeatured] = useState<string>('all');
  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | 'all'>(10);

  // Custom category state
  const [customCategory, setCustomCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Get unique categories from products
  const allCategories = useMemo(() => {
    const categories = new Set(products.map(p => p.category));
    return Array.from(categories).sort();
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query) || false;
        if (!matchesName && !matchesDesc) return false;
      }

      // Category filter
      if (filterCategory !== 'all' && product.category !== filterCategory) return false;

      // Available filter
      if (filterAvailable === 'yes' && !product.available) return false;
      if (filterAvailable === 'no' && product.available) return false;

      // Featured filter
      if (filterFeatured === 'yes' && !product.featured) return false;
      if (filterFeatured === 'no' && product.featured) return false;

      // Price filter
      const price = product.price ?? 0;
      if (filterPriceMin && price < parseFloat(filterPriceMin)) return false;
      if (filterPriceMax && price > parseFloat(filterPriceMax)) return false;

      return true;
    });
  }, [products, searchQuery, filterCategory, filterAvailable, filterFeatured, filterPriceMin, filterPriceMax]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    if (pageSize === 'all') return filteredProducts;
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Total pages
  const totalPages = useMemo(() => {
    if (pageSize === 'all') return 1;
    return Math.ceil(filteredProducts.length / pageSize);
  }, [filteredProducts.length, pageSize]);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'gifts',
    featured: false,
    available: true,
  });
  const [images, setImages] = useState<UploadedImage[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadingImages(true);
    
    const newImages: UploadedImage[] = [];
    
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const data = await response.json();
          newImages.push({
            url: data.url,
            alt: file.name.replace(/\.[^/.]+$/, ''),
          });
        }
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
    
    setImages((prev) => [...prev, ...newImages]);
    setUploadingImages(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category,
        featured: product.featured,
        available: product.available,
      });
      setImages(product.images.map((img) => ({ url: img.url, alt: img.alt })));
    } else {
      setEditingProduct(null);
      // Use first available category or default to 'candles'
      const defaultCategory = allCategories[0] || 'candles';
      setFormData({
        name: '',
        description: '',
        price: '',
        category: defaultCategory,
        featured: false,
        available: true,
      });
      setImages([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'gifts',
      featured: false,
      available: true,
    });
    setImages([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        images: images.map((img) => ({ url: img.url, alt: img.alt })),
      };

      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const savedProduct = await response.json();
        
        if (editingProduct) {
          setProducts((prev) =>
            prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
          );
        } else {
          setProducts((prev) => [savedProduct, ...prev]);
        }
        
        closeModal();
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const copyLink = (productSlug: string) => {
    const url = `${window.location.origin}/product/${productSlug}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-dark-100 pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl text-text-primary mb-2 font-bold">
              Welcome back, {session.user?.name?.split(' ')[0]}
            </h1>
            <p className="text-text-secondary">
              Manage your products and customize your website
            </p>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === 'products' && (
              <button
                onClick={() => openModal()}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="btn-secondary flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-surface-50/50">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'products'
                ? 'text-accent-primary border-accent-primary'
                : 'text-text-secondary border-transparent hover:text-text-primary'
            }`}
          >
            <Package className="w-5 h-5" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('homepage')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'homepage'
                ? 'text-accent-primary border-accent-primary'
                : 'text-text-secondary border-transparent hover:text-text-primary'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            Site Configuration
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'testimonials'
                ? 'text-accent-primary border-accent-primary'
                : 'text-text-secondary border-transparent hover:text-text-primary'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Testimonials
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'homepage' ? (
          <HomepageImagesManager />
        ) : activeTab === 'testimonials' ? (
          <TestimonialsManager />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface-200 rounded-2xl p-6 border border-surface-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-serif text-text-primary font-bold">
                  {products.length}
                </p>
                <p className="text-text-muted text-sm">Total Products</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-200 rounded-2xl p-6 border border-surface-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-primary/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-accent-primary" />
              </div>
              <div>
                <p className="text-2xl font-serif text-text-primary font-bold">
                  {products.filter((p) => p.featured).length}
                </p>
                <p className="text-text-muted text-sm">Featured</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-200 rounded-2xl p-6 border border-surface-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-secondary/20 flex items-center justify-center">
                <Eye className="w-6 h-6 text-accent-secondary" />
              </div>
              <div>
                <p className="text-2xl font-serif text-text-primary font-bold">
                  {products.filter((p) => p.available).length}
                </p>
                <p className="text-text-muted text-sm">Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-surface-200 rounded-2xl p-6 border border-surface-50/50 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-accent-primary" />
            <h3 className="font-medium text-text-primary">Filters</h3>
            <span className="text-sm text-text-muted ml-2">
              Showing {filteredProducts.length} of {products.length} products
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); handleFilterChange(); }}
                  placeholder="Search name or description..."
                  className="input-elegant pl-10 w-full"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filterCategory}
                onChange={(e) => { setFilterCategory(e.target.value); handleFilterChange(); }}
                className="input-elegant w-full"
              >
                <option value="all">All Categories</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Available Filter */}
            <div>
              <select
                value={filterAvailable}
                onChange={(e) => { setFilterAvailable(e.target.value); handleFilterChange(); }}
                className="input-elegant w-full"
              >
                <option value="all">All Availability</option>
                <option value="yes">Available</option>
                <option value="no">Not Available</option>
              </select>
            </div>

            {/* Featured Filter */}
            <div>
              <select
                value={filterFeatured}
                onChange={(e) => { setFilterFeatured(e.target.value); handleFilterChange(); }}
                className="input-elegant w-full"
              >
                <option value="all">All Products</option>
                <option value="yes">Featured Only</option>
                <option value="no">Not Featured</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="flex gap-2">
              <input
                type="number"
                value={filterPriceMin}
                onChange={(e) => { setFilterPriceMin(e.target.value); handleFilterChange(); }}
                placeholder="Min $"
                className="input-elegant w-full"
                min="0"
              />
              <input
                type="number"
                value={filterPriceMax}
                onChange={(e) => { setFilterPriceMax(e.target.value); handleFilterChange(); }}
                placeholder="Max $"
                className="input-elegant w-full"
                min="0"
              />
            </div>

            {/* Page Size */}
            <div>
              <select
                value={pageSize === 'all' ? 'all' : pageSize.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  setPageSize(value === 'all' ? 'all' : parseInt(value, 10));
                  setCurrentPage(1);
                }}
                className="input-elegant w-full"
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="100">100 per page</option>
                <option value="all">Show All</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchQuery || filterCategory !== 'all' || filterAvailable !== 'all' || filterFeatured !== 'all' || filterPriceMin || filterPriceMax) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('all');
                setFilterAvailable('all');
                setFilterFeatured('all');
                setFilterPriceMin('');
                setFilterPriceMax('');
                setCurrentPage(1);
              }}
              className="mt-4 text-sm text-accent-primary hover:text-accent-primary/80 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-surface-200 rounded-2xl p-12 text-center border border-surface-50/50">
            {products.length === 0 ? (
              <>
                <Sparkles className="w-16 h-16 text-accent-primary mx-auto mb-4" />
                <h2 className="font-serif text-2xl text-text-primary mb-2 font-bold">
                  No products yet
                </h2>
                <p className="text-text-muted mb-6">
                  Start by adding your first beautiful creation!
                </p>
                <button
                  onClick={() => openModal()}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Product
                </button>
              </>
            ) : (
              <>
                <Search className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <h2 className="font-serif text-2xl text-text-primary mb-2 font-bold">
                  No matching products
                </h2>
                <p className="text-text-muted mb-6">
                  Try adjusting your filters to find what you&apos;re looking for.
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-surface-200 rounded-2xl overflow-hidden border border-surface-50/50 hover:border-accent-primary/30 transition-all"
              >
                {/* Image */}
                <div className="relative aspect-square bg-surface-300">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="w-16 h-16 text-surface-50" />
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {product.featured && (
                      <span className="px-2 py-1 bg-accent-primary text-white text-xs rounded-lg flex items-center gap-1">
                        <Star className="w-3 h-3" /> Featured
                      </span>
                    )}
                    {!product.available && (
                      <span className="px-2 py-1 bg-surface-100 text-text-muted text-xs rounded-lg flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Hidden
                      </span>
                    )}
                  </div>

                  {/* Image count */}
                  {product.images.length > 1 && (
                    <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded-lg">
                      +{product.images.length - 1} more
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-serif text-lg text-text-primary font-semibold">
                      {product.name}
                    </h3>
                    <span className="text-xs uppercase tracking-wider text-text-muted bg-surface-300 px-2 py-1 rounded-lg">
                      {product.category}
                    </span>
                  </div>
                  
                  {product.price && (
                    <p className="text-accent-primary font-semibold mb-3">
                      ${product.price.toFixed(2)}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-surface-50/50">
                    <button
                      onClick={() => openModal(product)}
                      className="flex-1 py-2 text-sm text-text-secondary hover:text-accent-primary transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit3 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => copyLink(product.slug)}
                      className="flex-1 py-2 text-sm text-text-secondary hover:text-accent-primary transition-colors flex items-center justify-center gap-1"
                    >
                      <LinkIcon className="w-4 h-4" /> Copy Link
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-text-muted hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pageSize !== 'all' && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4 bg-surface-200 rounded-2xl p-4 border border-surface-50/50">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-surface-300 text-text-secondary hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-accent-primary text-white'
                          : 'bg-surface-300 text-text-secondary hover:bg-surface-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-surface-300 text-text-secondary hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <span className="text-sm text-text-muted ml-4">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
          </>
        )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-surface-50/50"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-surface-200 border-b border-surface-50/50 px-8 py-5 flex items-center justify-between">
                <h2 className="font-serif text-2xl text-text-primary font-bold">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-8">
                {/* Images Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-text-secondary mb-3">
                    Product Images
                  </label>
                  
                  {/* Uploaded Images */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {images.map((img, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-xl overflow-hidden group"
                        >
                          <Image
                            src={img.url}
                            alt={img.alt || ''}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-accent-primary text-white text-xs rounded">
                              Main
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dropzone */}
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      isDragActive
                        ? 'border-accent-primary bg-accent-primary/10'
                        : 'border-surface-50 hover:border-accent-primary/50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    {uploadingImages ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full" />
                        <span className="text-text-secondary">Uploading...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-text-muted mx-auto mb-3" />
                        <p className="text-text-secondary mb-1">
                          Drag & drop images here, or click to browse
                        </p>
                        <p className="text-text-muted text-sm">
                          JPEG, PNG, GIF, WebP (max 10MB each)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input-elegant"
                    placeholder="e.g., Lavender Dreams Candle"
                  />
                </div>

                {/* Description */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="textarea-elegant h-24"
                    placeholder="Describe your beautiful creation..."
                  />
                </div>

                {/* Price & Category Row */}
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Price (optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="input-elegant pl-8"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Category
                    </label>
                    {isAddingCategory ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          className="input-elegant flex-1"
                          placeholder="Enter new category..."
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customCategory.trim()) {
                              setFormData({ ...formData, category: customCategory.trim().toLowerCase() });
                            }
                            setIsAddingCategory(false);
                            setCustomCategory('');
                          }}
                          className="btn-primary px-4"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingCategory(false);
                            setCustomCategory('');
                          }}
                          className="btn-secondary px-4"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                          }
                          className="input-elegant flex-1"
                        >
                          {allCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                          ))}
                          {!allCategories.includes(formData.category) && formData.category && (
                            <option value={formData.category}>
                              {formData.category.charAt(0).toUpperCase() + formData.category.slice(1)}
                            </option>
                          )}
                        </select>
                        <button
                          type="button"
                          onClick={() => setIsAddingCategory(true)}
                          className="btn-secondary px-4 flex items-center gap-2"
                          title="Add new category"
                        >
                          <Plus className="w-4 h-4" />
                          New
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-6 mb-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-surface-50 text-accent-primary focus:ring-accent-primary bg-surface-300"
                    />
                    <span className="text-text-secondary">Featured product</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) =>
                        setFormData({ ...formData, available: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-surface-50 text-accent-primary focus:ring-accent-primary bg-surface-300"
                    />
                    <span className="text-text-secondary">Available for sale</span>
                  </label>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !formData.name}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {editingProduct ? 'Save Changes' : 'Add Product'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </>
        )}
      </div>
    </div>
  );
}
