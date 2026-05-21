import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Plus, Pencil, Trash2, Loader2, FileText, ExternalLink } from 'lucide-react';
import { labApi, adminApi, formatApiErrorDetail } from '../../services/api';
import { toast } from 'sonner';

const empty = { title: '', authors: '', year: new Date().getFullYear(), journal: '', doi: '', pdf: '#' };

const PublicationsTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await labApi.getPublications();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ ...item });
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, year: parseInt(form.year, 10) };
      if (editing) {
        await adminApi.updatePublication(editing.id, payload);
        toast.success('Publication updated');
      } else {
        await adminApi.createPublication(payload);
        toast.success('Publication created');
      }
      setDialogOpen(false);
      await load();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.deletePublication(deleteId);
      toast.success('Publication deleted');
      setDeleteId(null);
      await load();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Publications</h2>
          <p className="text-sm text-slate-500">Manage research publications</p>
        </div>
        <Button onClick={openCreate} data-testid="add-publication-button" className="bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Publication
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((pub) => (
            <Card key={pub.id} className="border-gray-200" data-testid={`pub-admin-card-${pub.id}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="text-teal-600" size={18} />
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => openEdit(pub)} data-testid={`edit-pub-${pub.id}`}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDeleteId(pub.id)} data-testid={`delete-pub-${pub.id}`} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-800 mb-1 leading-tight">{pub.title}</h3>
                <p className="text-sm text-slate-600 mb-1">{pub.authors}</p>
                <p className="text-sm text-slate-500 mb-2">{pub.journal} • {pub.year}</p>
                <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:underline inline-flex items-center gap-1">
                  <ExternalLink size={12} /> DOI: {pub.doi}
                </a>
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && (
            <p className="col-span-full text-center text-slate-500 py-8">No publications yet. Click "Add Publication" to create one.</p>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Publication' : 'Add Publication'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="pub-title" className="mb-2 block">Title</Label>
              <Input id="pub-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required data-testid="pub-title-input" />
            </div>
            <div>
              <Label htmlFor="pub-authors" className="mb-2 block">Authors</Label>
              <Input id="pub-authors" value={form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value })} required placeholder="Dr. Jane Smith, Dr. John Doe" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pub-year" className="mb-2 block">Year</Label>
                <Input id="pub-year" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required min="1900" max="2100" />
              </div>
              <div>
                <Label htmlFor="pub-journal" className="mb-2 block">Journal</Label>
                <Input id="pub-journal" value={form.journal} onChange={(e) => setForm({ ...form, journal: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pub-doi" className="mb-2 block">DOI</Label>
                <Input id="pub-doi" value={form.doi} onChange={(e) => setForm({ ...form, doi: e.target.value })} required placeholder="10.1016/j.example.2024.01.001" />
              </div>
              <div>
                <Label htmlFor="pub-pdf" className="mb-2 block">PDF URL (optional)</Label>
                <Input id="pub-pdf" value={form.pdf} onChange={(e) => setForm({ ...form, pdf: e.target.value })} placeholder="#" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving} data-testid="save-pub-button" className="bg-teal-600 hover:bg-teal-700 text-white">
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this publication?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PublicationsTab;
