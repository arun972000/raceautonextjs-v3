'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactEmailEditor from 'react-email-editor';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function EmailEditPage() {
  const editorRef = useRef(null);
  const [designName, setDesignName] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/email-template-builder/${id}`)
        .then((res) => {
          const data = res.data;
          setDesignName(data.name);
          if (data.design_json) {
            editorRef.current?.editor.loadDesign(JSON.parse(data.design_json));
          }
        })
        .catch((err) => {
          toast.error('Failed to load design.', {
            position: 'top-right',
            autoClose: 4000,
            theme: 'light',
          });
          console.error('Fetch error:', err);
        });
    }
  }, [id]);

  const saveDesign = () => {
    editorRef.current?.editor.exportHtml(async (data) => {
      const { design, html } = data;
      const body = {
        name: designName || 'Untitled Design',
        design_json: JSON.stringify(design),
        html,
      };

      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/email-template-builder/${id}`,
          body,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        toast.success('Design updated successfully!', {
          position: 'top-right',
          autoClose: 4000,
          theme: 'light',
        });

        router.push('/admin/email-template-builder');
      } catch (error) {
        toast.error('Failed to update design.', {
          position: 'top-right',
          autoClose: 4000,
          theme: 'light',
        });
        console.error('Update error:', error);
      }
    });
  };

  const exportAsHTML = () => {
    editorRef.current?.editor.exportHtml((data) => {
      const { html } = data;
      const blob = new Blob([html], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${designName || 'design'}.html`;
      link.click();
    });
  };

  const exportAsTXT = () => {
    editorRef.current?.editor.exportHtml((data) => {
      const { html } = data;
      const txtContent = html.replace(/<[^>]*>/g, ''); // Simple regex to remove HTML tags
      const blob = new Blob([txtContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${designName || 'design'}.txt`;
      link.click();
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Email Design</h2>
      <input
        type="text"
        value={designName}
        onChange={(e) => setDesignName(e.target.value)}
        placeholder="Design Name"
        className="form-control my-2"
      />

      <ReactEmailEditor ref={editorRef} onLoad={() => setIsLoaded(true)} />

      <div className="mt-3">
        <button className="btn btn-primary" onClick={saveDesign} disabled={!isLoaded}>
          Update Design
        </button>

        {/* Export Buttons */}
        <button className="btn btn-secondary ms-2" onClick={exportAsHTML} disabled={!isLoaded}>
          Export as HTML
        </button>
        <button className="btn btn-secondary ms-2" onClick={exportAsTXT} disabled={!isLoaded}>
          Export as TXT
        </button>
      </div>
    </div>
  );
}
