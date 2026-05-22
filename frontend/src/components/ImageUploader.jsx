import React, { useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Upload, Link2, X, Loader2, ImageIcon, Crop, ZoomIn } from 'lucide-react';
import { toast } from 'sonner';

const MAX_WIDTH = 1200;
const QUALITY = 0.85;
const MAX_BYTES_BEFORE = 8 * 1024 * 1024;

/* ---------- helpers ---------- */

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onerror = () => reject(new Error('Invalid image'));
    img.onload = () => resolve(img);
    img.src = url;
  });

/**
 * Crop, resize, and compress the image.
 * @param {string} imageSrc - data URL or http URL of the source image
 * @param {object} pixelCrop - { x, y, width, height } in pixel coordinates
 * @returns {string} JPEG data URL
 */
const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');

  // Determine final dimensions (respect MAX_WIDTH)
  let outW = pixelCrop.width;
  let outH = pixelCrop.height;
  if (outW > MAX_WIDTH) {
    outH = Math.round((outH * MAX_WIDTH) / outW);
    outW = MAX_WIDTH;
  }

  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, outW, outH);
  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, outW, outH,
  );
  return canvas.toDataURL('image/jpeg', QUALITY);
};

/* ---------- Component ---------- */

const ImageUploader = ({ value, onChange, label = 'Image', aspect = 4 / 3 }) => {
  const [mode, setMode] = useState(() =>
    value && value.startsWith('data:') ? 'upload' : 'url',
  );
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImage, setRawImage] = useState(null);      // source image for cropper
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_area, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  /* --- Open cropper for a file --- */
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
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setRawImage(dataUrl);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropModalOpen(true);
    } catch (err) {
      toast.error(err.message || 'Failed to read image');
    }
  };

  /* --- Open cropper for current value (re-crop) --- */
  const openCropForExisting = () => {
    if (!value) return;
    setRawImage(value);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropModalOpen(true);
  };

  /* --- Confirm crop --- */
  const handleCropConfirm = async () => {
    if (!rawImage || !croppedAreaPixels) return;
    setProcessing(true);
    try {
      const croppedDataUrl = await getCroppedImg(rawImage, croppedAreaPixels);
      onChange(croppedDataUrl);
      const sizeKB = Math.round((croppedDataUrl.length * 0.75) / 1024);
      toast.success(`Image cropped & saved (${sizeKB}KB)`);
      setCropModalOpen(false);
      setRawImage(null);
    } catch (err) {
      toast.error(err.message || 'Failed to crop image');
    } finally {
      setProcessing(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (e.target) e.target.value = '';
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

      {/* Preview + crop button */}
      {value && (
        <div className="relative inline-block group">
          <img
            src={value}
            alt="Preview"
            className="h-32 w-auto rounded border border-gray-200 object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded flex items-center justify-center gap-2 transition-opacity duration-200">
            <button
              type="button"
              onClick={openCropForExisting}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow"
              title="Crop image"
            >
              <Crop size={16} />
            </button>
            <button
              type="button"
              onClick={clearImage}
              data-testid="clear-image-button"
              className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow"
              title="Remove image"
            >
              <X size={14} />
            </button>
          </div>
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
              <p className="text-xs text-slate-400">PNG, JPG, WEBP — you can crop after uploading</p>
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

      {/* ===== Crop Modal ===== */}
      <Dialog open={cropModalOpen} onOpenChange={(open) => { if (!open) { setCropModalOpen(false); setRawImage(null); } }}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <Crop size={20} className="text-teal-600" /> Crop Image
            </DialogTitle>
          </DialogHeader>

          <div className="relative w-full bg-slate-900" style={{ height: '400px' }}>
            {rawImage && (
              <Cropper
                image={rawImage}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>

          {/* Zoom slider */}
          <div className="px-6 py-3 flex items-center gap-3 bg-slate-50 border-t border-slate-200">
            <ZoomIn size={16} className="text-slate-500" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <span className="text-xs text-slate-500 w-10 text-right">{Math.round(zoom * 100)}%</span>
          </div>

          <DialogFooter className="px-6 pb-6 pt-2">
            <Button type="button" variant="outline" onClick={() => { setCropModalOpen(false); setRawImage(null); }}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCropConfirm}
              disabled={processing}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Cropping...</> : 'Confirm Crop'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUploader;
