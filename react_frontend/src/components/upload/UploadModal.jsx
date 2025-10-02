import React, { useMemo, useRef, useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import supabase from '../../lib/supabaseClient';
import { createNote } from '../../lib/notesService';
import { useAuth } from '../../hooks/useAuth';

/**
 * PUBLIC_INTERFACE
 * UploadModal
 * A modal dialog that lets users select a PDF file, enter title/description, category, and tags,
 * validates input, uploads the file to Supabase Storage, then inserts a row in 'notes' via notesService.
 * Props:
 *  - open: boolean, controls visibility
 *  - onClose: function, called when modal is dismissed
 *  - onSuccess: function(note), called after successful upload and DB insert
 */
export default function UploadModal({ open, onClose, onSuccess }) {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successNote, setSuccessNote] = useState(null);

  const inputRef = useRef(null);

  const categories = useMemo(
    () => [
      { value: '', label: 'Select a category' },
      { value: 'math', label: 'Mathematics' },
      { value: 'cs', label: 'Computer Science' },
      { value: 'history', label: 'History' },
      { value: 'biology', label: 'Biology' },
      { value: 'physics', label: 'Physics' },
      { value: 'chemistry', label: 'Chemistry' },
      { value: 'economics', label: 'Economics' },
    ],
    []
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && !busy) {
        e.stopPropagation();
        onDismiss();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, busy]);

  if (!open) return null;

  const resetState = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setCategory('');
    setTags('');
    setError('');
    setUploadError('');
    setProgress(0);
    setBusy(false);
    setSuccessNote(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const onDismiss = () => {
    resetState();
    onClose?.();
  };

  const validate = () => {
    setError('');
    setUploadError('');
    if (!user) {
      setError('You must be logged in to upload.');
      return false;
    }
    if (!file) {
      setError('Please select a PDF file to upload.');
      return false;
    }
    const extOk = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!extOk) {
      setError('Only PDF files are allowed.');
      return false;
    }
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      setError('File is too large. Maximum size is 25MB.');
      return false;
    }
    if (!title.trim()) {
      setError('Please enter a title.');
      return false;
    }
    if (!category.trim()) {
      setError('Please select a category.');
      return false;
    }
    return true;
  };

  // Helper: upload file to Supabase storage with simple progress approximation.
  const uploadFile = async () => {
    // We cannot get granular progress from Supabase upload API; use a simulated progress ramp while awaiting.
    setProgress(5);
    const bucket = 'notes'; // Ensure this bucket exists and has proper RLS/storage policies
    const userId = user?.id;
    const fileNameSafe = file.name.replace(/\s+/g, '_').toLowerCase();
    const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${fileNameSafe}`;
    const path = `${userId}/${unique}`;

    // Simulate progress while waiting (best-effort visual feedback).
    let prog = 5;
    const timer = setInterval(() => {
      prog = Math.min(90, prog + Math.round(Math.random() * 8));
      setProgress(prog);
    }, 200);

    const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: false,
      contentType: 'application/pdf',
    });

    clearInterval(timer);
    if (upErr) {
      setProgress(0);
      return { error: upErr.message, path: null, bucket };
    }
    setProgress(95);
    return { error: null, path, bucket };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setBusy(true);
      setUploadError('');
      setError('');

      const { error: upError, path, bucket } = await uploadFile();
      if (upError) {
        setUploadError(upError);
        setBusy(false);
        return;
      }

      // Insert DB record
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        tags: tags,
        file_path: `${bucket}/${path}`, // store as 'bucket/path' for clarity
        file_size: file.size,
      };

      const { data: note, error: dbErr } = await createNote(payload);
      if (dbErr) {
        setUploadError(dbErr);
        setBusy(false);
        return;
      }

      setProgress(100);
      setSuccessNote(note);
      setBusy(false);
      onSuccess?.(note);
    } catch (ex) {
      setUploadError(ex?.message || 'Upload failed. Please try again.');
      setBusy(false);
    }
  };

  const SuccessView = () => (
    <div className="surface" style={{ padding: 14, borderColor: 'rgba(16,185,129,0.35)' }}>
      <h3 style={{ marginTop: 0 }}>Upload complete</h3>
      <p style={{ color: 'var(--color-text-muted)' }}>
        Your note has been uploaded successfully.
      </p>
      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
        <Button variant="primary" onClick={onDismiss}>Done</Button>
        <Button variant="outline" onClick={() => resetState()}>Upload another</Button>
      </div>
    </div>
  );

  const titleId = 'upload-modal-title';
  const descId = 'upload-modal-desc';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(2,6,23,0.45)',
        zIndex: 50,
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onDismiss();
      }}
    >
      <div
        className="surface surface-animate"
        style={{
          width: 'min(720px, 96vw)',
          padding: 18,
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          background: 'var(--color-surface)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 id={titleId} style={{ margin: 0 }}>Upload a note (PDF)</h3>
          <button
            className="icon-btn"
            aria-label="Close"
            onClick={onDismiss}
            title="Close"
            disabled={busy}
          >
            ✕
          </button>
        </div>

        {!user ? (
          <div className="surface" style={{ padding: 14 }}>
            <p id={descId} style={{ color: 'var(--color-text-muted)' }}>
              You must be logged in to upload notes.
            </p>
            <div>
              <Button variant="outline" onClick={onDismiss}>Close</Button>
            </div>
          </div>
        ) : successNote ? (
          <SuccessView />
        ) : (
          <form onSubmit={handleSubmit} aria-describedby={descId} style={{ display: 'grid', gap: 12, marginTop: 8 }}>
            <p id={descId} style={{ color: 'var(--color-text-muted)', margin: 0 }}>
              Choose a PDF file, enter details, and upload.
            </p>
            <div className="surface" style={{ padding: 14 }}>
              <label htmlFor="upload-file" style={{ display: 'block', fontSize: 'var(--font-sm)', marginBottom: 6, color: 'var(--color-text)' }}>
                Select PDF
              </label>
              <input
                id="upload-file"
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setFile(f);
                  setError('');
                }}
                disabled={busy}
              />
              <div style={{ marginTop: 6, fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
                Only PDF files up to 25MB are allowed.
              </div>
              {file ? (
                <div style={{ marginTop: 8, fontSize: 'var(--font-sm)' }}>
                  Selected: <strong>{file.name}</strong> ({Math.round(file.size / 1024)} KB)
                </div>
              ) : null}
            </div>

            <div className="grid grid-2">
              <Input
                id="upload-title"
                label="Title"
                placeholder="e.g., Linear Algebra - Lecture Notes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Select
                id="upload-category"
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </Select>
            </div>

            <Input
              id="upload-description"
              label="Description"
              placeholder="Brief summary of the content"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Input
              id="upload-tags"
              label="Tags"
              placeholder="Comma-separated tags, e.g., algebra, matrices, proofs"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              helpText="Use commas to separate tags."
            />

            {(error || uploadError) ? (
              <div role="alert" className="surface" style={{ padding: 10, borderColor: 'rgba(239,68,68,0.35)', color: 'var(--color-error)' }}>
                {error || uploadError}
              </div>
            ) : null}

            {busy ? (
              <div className="surface" style={{ padding: 10 }}>
                <div style={{ marginBottom: 6, fontSize: 'var(--font-sm)', color: 'var(--color-text-muted)' }}>
                  Uploading... {progress}%
                </div>
                <div style={{ height: 8, background: 'rgba(59,130,246,0.12)', borderRadius: 999 }}>
                  <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                    style={{
                      width: `${progress}%`,
                      height: '100%',
                      borderRadius: 999,
                      background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                      transition: 'width 180ms ease',
                    }}
                  />
                </div>
              </div>
            ) : null}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
              <Button type="button" variant="outline" onClick={onDismiss} disabled={busy}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={busy}>
                {busy ? 'Uploading…' : 'Upload'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
