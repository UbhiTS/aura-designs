'use client';

import { useState, useEffect, useMemo } from 'react';
import { Check, X, Trash2, Loader2, Star, MessageSquare, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  message: string;
  rating: number;
  approved: boolean;
  createdAt: string;
}

type FilterType = 'pending' | 'approved' | 'all';
type PageSize = 5 | 10 | 25 | 100 | 'all';

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials?all=true');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string, approved: boolean) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved }),
      });
      
      if (res.ok) {
        setTestimonials(prev => 
          prev.map(t => t.id === id ? { ...t, approved } : t)
        );
      }
    } catch (error) {
      console.error('Failed to update testimonial:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    setActionLoading(id);
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setTestimonials(prev => prev.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Apply search filter first (used for counts)
  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) return testimonials;
    const query = searchQuery.toLowerCase();
    return testimonials.filter(t => 
      t.name.toLowerCase().includes(query) || 
      t.message.toLowerCase().includes(query)
    );
  }, [testimonials, searchQuery]);

  const pendingCount = searchFiltered.filter(t => !t.approved).length;
  const approvedCount = searchFiltered.filter(t => t.approved).length;

  // Filter and search testimonials
  const filteredTestimonials = useMemo(() => {
    let result = searchFiltered;
    
    // Apply status filter
    if (filter === 'pending') {
      result = result.filter(t => !t.approved);
    } else if (filter === 'approved') {
      result = result.filter(t => t.approved);
    }
    
    return result;
  }, [searchFiltered, filter]);

  // Pagination
  const totalPages = pageSize === 'all' ? 1 : Math.ceil(filteredTestimonials.length / pageSize);
  
  const paginatedTestimonials = useMemo(() => {
    if (pageSize === 'all') return filteredTestimonials;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTestimonials.slice(startIndex, startIndex + pageSize);
  }, [filteredTestimonials, currentPage, pageSize]);

  // Reset to page 1 when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery, pageSize]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif text-text-primary">Testimonials</h2>
        <p className="text-text-secondary">
          Review and manage customer testimonials
        </p>
      </div>

      {/* Stats - Clickable Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <button
          onClick={() => setFilter('pending')}
          className={`bg-surface-300 rounded-xl p-4 border transition-all cursor-pointer text-left ${
            filter === 'pending' 
              ? 'border-yellow-500 ring-2 ring-yellow-500/30' 
              : 'border-surface-50/50 hover:border-yellow-500/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{pendingCount}</p>
              <p className="text-text-muted text-sm">Pending Review</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`bg-surface-300 rounded-xl p-4 border transition-all cursor-pointer text-left ${
            filter === 'approved' 
              ? 'border-green-500 ring-2 ring-green-500/30' 
              : 'border-surface-50/50 hover:border-green-500/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{approvedCount}</p>
              <p className="text-text-muted text-sm">Approved</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`bg-surface-300 rounded-xl p-4 border transition-all cursor-pointer text-left ${
            filter === 'all' 
              ? 'border-accent-primary ring-2 ring-accent-primary/30' 
              : 'border-surface-50/50 hover:border-accent-primary/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-accent-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{searchFiltered.length}</p>
              <p className="text-text-muted text-sm">Total</p>
            </div>
          </div>
        </button>
      </div>

      {/* Search and Page Size */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or review..."
            className="w-full pl-10 pr-4 py-2 bg-surface-300 border border-surface-50/50 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-muted text-sm">Show:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value === 'all' ? 'all' : Number(e.target.value) as PageSize)}
            className="px-3 py-2 bg-surface-300 border border-surface-50/50 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      {/* Testimonials List */}
      {filteredTestimonials.length === 0 ? (
        <div className="text-center py-12 bg-surface-300 rounded-xl border border-surface-50/50">
          <MessageSquare className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary">
            {searchQuery ? 'No testimonials match your search' : 
             filter === 'pending' ? 'No pending testimonials' :
             filter === 'approved' ? 'No approved testimonials' : 'No testimonials yet'}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`bg-surface-300 rounded-xl p-4 border ${
                testimonial.approved ? 'border-green-500/30' : 'border-yellow-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-text-primary">{testimonial.name}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= testimonial.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-surface-50'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      testimonial.approved 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {testimonial.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-text-secondary">{testimonial.message}</p>
                  <p className="text-text-muted text-sm mt-2">
                    {new Date(testimonial.createdAt).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {actionLoading === testimonial.id ? (
                    <Loader2 className="w-5 h-5 animate-spin text-accent-primary" />
                  ) : (
                    <>
                      {!testimonial.approved ? (
                        <button
                          onClick={() => handleApprove(testimonial.id, true)}
                          className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                          title="Approve"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApprove(testimonial.id, false)}
                          className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                          title="Unapprove"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>

          {/* Pagination Controls */}
          {pageSize !== 'all' && totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-surface-50/30">
              <p className="text-text-muted text-sm">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredTestimonials.length)} of {filteredTestimonials.length} testimonials
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-surface-50/50 text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
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
                        className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                          currentPage === pageNum
                            ? 'bg-accent-primary text-white'
                            : 'border border-surface-50/50 text-text-secondary hover:border-accent-primary'
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
                  className="p-2 rounded-lg border border-surface-50/50 text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
