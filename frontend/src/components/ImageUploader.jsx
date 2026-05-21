import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Upload, Link2, X, Loader2, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const MAX_WIDTH = 1200;
const QUALITY = 0.85;
const MAX_BYTES_BEFORE = 8 * 1024 * 1024; // 8MB raw file limit

/**
 * Resize + compress an image file to a JPEG data URL.
 * Returns a string like: data:image/jpeg;base64,...
 */
const resizeImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image'));
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', QUALITY));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

const ImageUploader = ({ value, onChange, label = 'Image' }) => {
  const [mode, setMode] = useState(() => {
    // If value is base64 data URL, default to upload; otherwise URL
    return value && value.startsWith('data:') ? 'upload' : 'url';
  });
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > MAX_BYTES_BEFORE) {
      toast.error('Image too large (max 8MB)');
      return;
    }
    setProcessing(true);
    try {
      const dataUrl = await resizeImage(file);
      onChange(dataUrl);
      const sizeKB = Math.round((dataUrl.length * 0.75) / 1024);
      toast.success(`Image ready (${sizeKB}KB after compression)`);
    } catch (err) {
      toast.error(err.message || 'Failed to process image');
    } finally {
      setProcessing(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      {label && <Label className="block">{label}</Label>}

      {/* Mode toggle */}
      <div className="inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5">
        <button
          type="button"
          onClick={() => setMode('upload')}
          data-testid="image-mode-upload"
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors inline-flex items-center gap-1.5 ${
            mode === 'upload' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Upload size={14} /> Upload
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          data-testid="image-mode-url"
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors inline-flex items-center gap-1.5 ${
            mode === 'url' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Link2 size={14} /> URL
        </button>
      </div>

      {/* Preview */}
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-32 w-auto rounded border border-gray-200 object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <button
            type="button"
            onClick={clearImage}
            data-testid="clear-image-button"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input area */}
      {mode === 'upload' ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50/30 transition-colors"
          data-testid="image-dropzone"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            data-testid="image-file-input"
          />
          {processing ? (
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              <p className="text-sm">Processing image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <ImageIcon className="w-8 h-8 text-slate-400" />
              <p className="text-sm font-medium text-slate-700">Click to upload or drag &amp; drop</p>
              <p className="text-xs text-slate-400">PNG, JPG, WEBP (auto-resized to 1200px)</p>
            </div>
          )}
        </div>
      ) : (
        <Input
          type="url"
          value={value && value.startsWith('data:') ? '' : (value || '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          data-testid="image-url-input"
        />
      )}
    </div>
  );
};

export default ImageUploader;
