import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Trash2, Loader2, Mail, Inbox } from 'lucide-react';
import { adminApi, formatApiErrorDetail } from '../../services/api';
import { toast } from 'sonner';

const SubmissionsTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await adminApi.getContactSubmissions());
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    try {
      await adminApi.deleteContactSubmission(deleteId);
      toast.success('Submission deleted');
      setDeleteId(null);
      await load();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || 'Failed to delete');
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Contact Submissions</h2>
        <p className="text-sm text-slate-500">View messages from the public contact form ({items.length} total)</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>
      ) : items.length === 0 ? (
        <Card className="border-gray-200">
          <CardContent className="py-12 text-center">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No contact submissions yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((s) => (
            <Card key={s.id} className="border-gray-200" data-testid={`submission-card-${s.id}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-800">{s.name}</h3>
                      <a href={`mailto:${s.email}`} className="text-xs text-teal-600 hover:underline inline-flex items-center gap-1">
                        <Mail size={12} /> {s.email}
                      </a>
                    </div>
                    <p className="text-sm font-medium text-slate-700">{s.subject}</p>
                    <p className="text-xs text-slate-500 mt-1">{formatDate(s.submitted_at)}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setDeleteId(s.id)} data-testid={`delete-submission-${s.id}`} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 flex-shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <p className="text-sm text-slate-600 whitespace-pre-wrap bg-gray-50 p-3 rounded border border-gray-100">
                  {s.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this submission?</AlertDialogTitle>
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

export default SubmissionsTab;
