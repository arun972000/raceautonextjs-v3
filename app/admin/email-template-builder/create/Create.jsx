'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactEmailEditor from 'react-email-editor';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function EmailCreatePage() {
  const editorRef = useRef(null);
  const [designName, setDesignName] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  const saveDesign = () => {
    editorRef.current?.editor.exportHtml(async (data) => {
      const { design, html } = data;

      const body = {
        name: designName || 'Untitled Design',
        design_json: JSON.stringify(design),
        html,
      };

      try {
        // Save to backend
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/email-template-builder`,
          body,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // Trigger file download of HTML
        const blob = new Blob([html], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${designName || 'email-design'}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Success toast
        toast.success('Design saved and HTML downloaded!', {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });

        router.push('/admin/email-template-builder');
      } catch (error) {
        toast.error('Failed to save file. Please try again.', {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        console.error('Save error:', error);
      }
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create New Email Design</h2>

      <input
        type="text"
        value={designName}
        onChange={(e) => setDesignName(e.target.value)}
        placeholder="Design Name"
        className="form-control my-2"
      />

      <ReactEmailEditor ref={editorRef} onLoad={() => setIsLoaded(true)} />

      <button className="btn btn-primary mt-3" onClick={saveDesign} disabled={!isLoaded}>
        Save Design
      </button>
    </div>
  );
}
