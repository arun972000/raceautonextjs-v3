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

      <button className="btn btn-primary mt-3" onClick={saveDesign} disabled={!isLoaded}>
        Update Design
      </button>
    </div>
  );
}
