'use client';

import React, { useState } from 'react';

const DownloadAllButton = () => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/generate-pdf');
      if (!res.ok) throw new Error('Failed to fetch PDF');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'all-reports.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error downloading file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        padding: '10px 20px',
        backgroundColor: loading ? '#6c757d' : '#007bff',
        color: '#fff',
        fontWeight: '600',
        border: 'none',
        borderRadius: '8px',
        boxShadow: loading ? 'none' : '0 4px 10px rgba(0, 0, 0, 0.2)',
        cursor: loading ? 'not-allowed' : 'pointer',
        zIndex: 1000,
        transition: 'background-color 0.3s ease',
      }}
      onMouseOver={(e) => {
        if (!loading) e.currentTarget.style.backgroundColor = '#0056b3';
      }}
      onMouseOut={(e) => {
        if (!loading) e.currentTarget.style.backgroundColor = '#007bff';
      }}
    >
      {loading ? '⏳ Downloading...' : '📄 Download All Reports'}
    </button>
  );
};

export default DownloadAllButton;
