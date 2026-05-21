import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Plus, Pencil, Trash2, Loader2, Youtube } from 'lucide-react';
import { labApi, adminApi, formatApiErrorDetail } from '../../services/api';
import { getYoutubeEmbedUrl } from '../../lib/youtube';
import { toast } from 'sonner';

const empty = { title: '', description: '', youtube_url: '', sort_order: 0 };

const VideosTab = () => {
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
      setItems(await labApi.getYoutubeVideos());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
    if (!getYoutubeEmbedUrl(form.youtube_url)) {
      toast.error('Invalid YouTube URL. Use a link like https://www.youtube.com/watch?v=...');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        sort_order: Number(form.sort_order) || 0,
      };
      if (editing) {
        await adminApi.updateYoutubeVideo(editing.id, payload);
        toast.success('Video updated');
      } else {
        await adminApi.createYoutubeVideo(payload);
        toast.success('Video added');
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
      await adminApi.deleteYoutubeVideo(deleteId);
      toast.success('Video deleted');
      setDeleteId(null);
      await load();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || 'Failed to delete');
    }
  };

  const previewEmbed = getYoutubeEmbedUrl(form.youtube_url);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">YouTube Videos</h2>
          <p className="text-sm text-slate-500">Manage video previews on the homepage</p>
        </div>
        <Button onClick={openCreate} data-testid="add-video-button" className="bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Video
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((v) => {
            const embed = getYoutubeEmbedUrl(v.youtube_url);
            return (
              <Card key={v.id} className="border-gray-200 overflow-hidden" data-testid={`video-admin-card-${v.id}`}>
                <div className="aspect-video bg-slate-900">
                  {embed ? (
                    <iframe src={embed} title={v.title} className="w-full h-full" allowFullScreen />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">Invalid URL</div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-800">{v.title}</h3>
                  <p className="text-xs text-slate-500 mb-2">Order: {v.sort_order}</p>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{v.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(v)} className="flex-1">
                      <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteId(v.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {items.length === 0 && (
            <p className="col-span-full text-center text-slate-500 py-8">No videos yet.</p>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-600" />
              {editing ? 'Edit Video' : 'Add Video'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="mb-2 block">Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label className="mb-2 block">YouTube URL</Label>
              <Input
                value={form.youtube_url}
                onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
                required
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            {previewEmbed && (
              <div className="aspect-video rounded-md overflow-hidden border border-gray-200">
                <iframe src={previewEmbed} title="Preview" className="w-full h-full" allowFullScreen />
              </div>
            )}
            <div>
              <Label className="mb-2 block">Description (optional)</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label className="mb-2 block">Display order (lower = first)</Label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                min={0}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-teal-600 hover:bg-teal-700 text-white">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this video?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VideosTab;
