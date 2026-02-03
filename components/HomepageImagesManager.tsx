'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Save, Loader2, ImageIcon, Instagram, Facebook } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { FaPinterest } from 'react-icons/fa';

interface SiteSettings {
  heroImage1: string;
  heroImage2: string;
  heroImage3: string;
  aboutImage: string;
  instagramHandle: string;
  facebookHandle: string;
  pinterestHandle: string;
}

interface ImageSlot {
  key: 'heroImage1' | 'heroImage2' | 'heroImage3' | 'aboutImage';
  label: string;
  description: string;
}

const heroSlots: ImageSlot[] = [
  { key: 'heroImage1', label: 'Hero Image 1', description: 'Top left circular image' },
  { key: 'heroImage2', label: 'Hero Image 2', description: 'Center main large image' },
  { key: 'heroImage3', label: 'Hero Image 3', description: 'Bottom right circular image' },
];

const aboutSlot: ImageSlot = { key: 'aboutImage', label: 'About Page Image', description: 'Main image on the About page' };

export default function HomepageImagesManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const uploadImage = async (file: File, slotKey: keyof SiteSettings) => {
    setUploadingSlot(slotKey);
    setMessage(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok && data.url) {
        setSettings(prev => prev ? { ...prev, [slotKey]: data.url } : null);
        setMessage({ type: 'success', text: 'Image uploaded! Click Save Changes to apply.' });
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setMessage({ type: 'error', text: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setUploadingSlot(null);
    }
  };

  const ImageUploader = ({ slot }: { slot: ImageSlot }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        uploadImage(acceptedFiles[0], slot.key);
      }
    }, [slot.key]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { 'image/*': [] },
      maxFiles: 1,
    });

    const currentImage = settings?.[slot.key];
    const isUploading = uploadingSlot === slot.key;

    return (
      <div className="bg-surface-300 rounded-xl p-4 border border-surface-50/50">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-text-primary font-medium">{slot.label}</h4>
            <p className="text-text-muted text-xs">{slot.description}</p>
          </div>
        </div>
        
        <div
          {...getRootProps()}
          className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 border-dashed transition-colors ${
            isDragActive ? 'border-accent-primary bg-accent-primary/10' : 'border-surface-50 hover:border-accent-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          
          {currentImage ? (
            <>
              <Image
                src={currentImage}
                alt={slot.label}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-dark-300/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-center text-white">
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Click or drop to replace</p>
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-text-muted">
              <div className="text-center">
                <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Drop image or click to upload</p>
              </div>
            </div>
          )}
          
          {isUploading && (
            <div className="absolute inset-0 bg-dark-300/80 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
            </div>
          )}
        </div>

        {/* URL input */}
        <div className="mt-3">
          <input
            type="text"
            value={currentImage || ''}
            onChange={(e) => setSettings(prev => prev ? { ...prev, [slot.key]: e.target.value } : null)}
            placeholder="Or paste image URL..."
            className="w-full px-3 py-2 bg-surface-200 border border-surface-50 rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
          />
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-text-primary">Site Configuration</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {/* Hero Images */}
      <div>
        <h3 className="text-lg font-serif text-text-primary mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary text-sm">1</span>
          Hero Section Images
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {heroSlots.map((slot) => (
            <ImageUploader key={slot.key} slot={slot} />
          ))}
        </div>
      </div>

      {/* About Page Image */}
      <div>
        <h3 className="text-lg font-serif text-text-primary mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary text-sm">2</span>
          About Page Image
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ImageUploader slot={aboutSlot} />
        </div>
      </div>

      {/* Social Media Handles */}
      <div>
        <h3 className="text-lg font-serif text-text-primary mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary text-sm">3</span>
          Social Media Handles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-300 rounded-xl p-4 border border-surface-50/50">
            <div className="flex items-center gap-2 mb-3">
              <Instagram className="w-5 h-5 text-pink-400" />
              <label className="text-text-primary font-medium">Instagram</label>
            </div>
            <input
              type="text"
              value={settings?.instagramHandle || ''}
              onChange={(e) => setSettings(prev => prev ? { ...prev, instagramHandle: e.target.value } : null)}
              placeholder="@yourhandle"
              className="w-full px-3 py-2 bg-surface-200 border border-surface-50 rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
            />
          </div>
          <div className="bg-surface-300 rounded-xl p-4 border border-surface-50/50">
            <div className="flex items-center gap-2 mb-3">
              <Facebook className="w-5 h-5 text-blue-500" />
              <label className="text-text-primary font-medium">Facebook</label>
            </div>
            <input
              type="text"
              value={settings?.facebookHandle || ''}
              onChange={(e) => setSettings(prev => prev ? { ...prev, facebookHandle: e.target.value } : null)}
              placeholder="yourpage"
              className="w-full px-3 py-2 bg-surface-200 border border-surface-50 rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
            />
          </div>
          <div className="bg-surface-300 rounded-xl p-4 border border-surface-50/50">
            <div className="flex items-center gap-2 mb-3">
              <FaPinterest className="w-5 h-5 text-red-500" />
              <label className="text-text-primary font-medium">Pinterest</label>
            </div>
            <input
              type="text"
              value={settings?.pinterestHandle || ''}
              onChange={(e) => setSettings(prev => prev ? { ...prev, pinterestHandle: e.target.value } : null)}
              placeholder="yourprofile"
              className="w-full px-3 py-2 bg-surface-200 border border-surface-50 rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
