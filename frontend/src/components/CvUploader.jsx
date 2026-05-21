import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Upload, Link2, X, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const MAX_BYTES = 3 * 1024 * 1024;

const CvUploader = ({ value, onChange, label = 'CV (PDF)' }) => {
  const [mode, setMode] = useState(() => (value && value.startsWith('data:') ? 'upload' : 'url'));
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('PDF too large (max 3MB)');
      return;
    }
    setProcessing(true);
    const reader = new FileReader();
    reader.onerror = () => {
      toast.error('Failed to read file');
      setProcessing(false);
    };
    reader.onload = (e) => {
      onChange(e.target.result);
      toast.success('CV uploaded');
      setProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const clearCv = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const hasCv = Boolean(value && value.trim());

  return (
    <div className="space-y-2">
      {label && <Label className="block">{label}</Label>}

      <div className="inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors inline-flex items-center gap-1.5 ${
            mode === 'url' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Link2 size={14} /> URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors inline-flex items-center gap-1.5 ${
            mode === 'upload' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Upload size={14} /> Upload PDF
        </button>
      </div>

      {hasCv && (
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
          <FileText size={16} className="text-teal-600 shrink-0" />
          <span className="truncate flex-1">
            {value.startsWith('data:') ? 'PDF uploaded' : value}
          </span>
          <button
            type="button"
            onClick={clearCv}
            className="text-red-600 hover:text-red-700 shrink-0"
            aria-label="Remove CV"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {mode === 'url' ? (
        <Input
          type="url"
          value={value && value.startsWith('data:') ? '' : (value || '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/cv.pdf or Google Drive link"
        />
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50/30 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {processing ? (
            <Loader2 className="w-6 h-6 animate-spin text-teal-600 mx-auto" />
          ) : (
            <p className="text-sm text-slate-600">Click to upload PDF (max 3MB)</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CvUploader;
