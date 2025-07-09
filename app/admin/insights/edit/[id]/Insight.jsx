'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Container, Row, Col, Form, Spinner } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-quill/dist/quill.snow.css';

import {
  ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, Tooltip, Legend
} from 'recharts';

const Font = ReactQuill.Quill.import('formats/font');
Font.whitelist = ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'lucida'];
ReactQuill.Quill.register(Font, true);

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00c49f'];
const defaultChartData = [{ name: 'Jan', value: 30 }, { name: 'Feb', value: 50 }];

const quillModules = {
  toolbar: [
    [{ font: Font.whitelist }],
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean']
  ]
};

export default function EditInsightForm() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [quotes, setQuotes] = useState('');
  const [notes, setNotes] = useState('');
  const [charts, setCharts] = useState([]);
  const [useChart1, setUseChart1] = useState(false);
  const [useChart2, setUseChart2] = useState(false);

  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (!id) return;
    fetchInsight(id);
  }, [id]);

  const fetchInsight = async (id) => {
    try {
      const res = await axios.get(`/api/admin/insights/${id}`);
      const insight = res.data;
      setTitle(insight.title);
      setContent(insight.content);
      setQuotes(insight.quotes);
      setNotes(insight.notes);
      setExistingImages(insight.images || []);

      const chartList = insight.charts || [];
      setCharts([
        chartList[0] || { type: 'bar', heading: '', data: [...defaultChartData] },
        chartList[1] || { type: 'line', heading: '', data: [...defaultChartData] }
      ]);
      setUseChart1(!!chartList[0]);
      setUseChart2(!!chartList[1]);
    } catch (err) {
      console.error('Failed to load insight', err);
      toast.error('Error loading insight');
    } finally {
      setLoading(false);
    }
  };

  const handleChartChange = (index, key, value) => {
    const updated = [...charts];
    updated[index][key] = value;
    setCharts(updated);
  };

  const handleDataInput = (chartIndex, dataIndex, key, value) => {
    const updated = [...charts];
    updated[chartIndex].data[dataIndex][key] = key === 'value' ? Number(value) : value;
    setCharts(updated);
  };

  const addRowToChart = (chartIndex) => {
    const updated = [...charts];
    updated[chartIndex].data.push({ name: '', value: 0 });
    setCharts(updated);
  };

  const toggleDeleteImage = (key) => {
    setImagesToDelete(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleNewImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => f.size < 5000 * 1024);
    if (validFiles.length < files.length) {
      alert("Some files exceeded 5mb and were ignored.");
    }
    setNewImages(prev => [...prev, ...validFiles]);
  };

  const renderChartDataInputs = (chartIndex) => (
    <>
      {charts[chartIndex]?.data.map((point, idx) => (
        <Row key={idx} className="mb-2">
          <Col>
            <Form.Control
              type="text"
              value={point.name}
              onChange={e => handleDataInput(chartIndex, idx, 'name', e.target.value)}
              placeholder="Label (e.g. Jan)"
            />
          </Col>
          <Col>
            <Form.Control
              type="number"
              value={point.value}
              onChange={e => handleDataInput(chartIndex, idx, 'value', e.target.value)}
              placeholder="Value"
            />
          </Col>
        </Row>
      ))}
      <Button size="sm" variant="outline-primary" onClick={() => addRowToChart(chartIndex)}>
        + Add Row
      </Button>
    </>
  );

  const renderGraph = (index) => {
    const chart = charts[index];
    if (!chart?.data || !Array.isArray(chart.data)) return null;

    switch (chart.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chart.data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chart.data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chart.data} dataKey="value" nameKey="name" outerRadius={100} label>
                {chart.data.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("quotes", quotes);
    formData.append("notes", notes);
    formData.append("charts", JSON.stringify([
      ...(useChart1 ? [charts[0]] : []),
      ...(useChart2 ? [charts[1]] : [])
    ]));

    imagesToDelete.forEach(img => {
      formData.append("delete_images", img);
    });

    newImages.forEach(img => {
      formData.append("new_images", img);
    });

    try {
      const res = await axios.put(`/api/admin/insights/${id}`, formData);
      if (res.data.success) {
        toast.success("Insight updated!");
        router.push("/admin/insights");
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Server error while updating");
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h3>Edit Insight</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <ReactQuill value={title} onChange={setTitle} theme="snow" modules={quillModules} />
        </div>

        <div className="mb-3">
          <label className="form-label">Content</label>
          <ReactQuill value={content} onChange={setContent} theme="snow" modules={quillModules} />
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mb-4">
            <h6>Existing Images</h6>
            <Row>
              {existingImages.map((img, i) => (
                <Col key={i} xs={6} md={4}>
                  <div className="border p-2 mb-2">
                    <img
                      src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${img}`}
                      className="img-fluid rounded"
                      alt={`img-${i}`}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Delete"
                      checked={imagesToDelete.includes(img)}
                      onChange={() => toggleDeleteImage(img)}
                      className="mt-1"
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* New Image Upload */}
        <Form.Group className="mb-4">
          <Form.Label>Upload New Images (Max 300KB each)</Form.Label>
          <Form.Control type="file" multiple onChange={handleNewImageUpload} />
          {newImages.length > 0 && (
            <ul className="mt-2" style={{ fontSize: "0.9rem" }}>
              {newImages.map((f, i) => <li key={i}>{f.name}</li>)}
            </ul>
          )}
        </Form.Group>

        {/* Charts */}
        <div className="mb-3 p-3 border rounded bg-light">
          <strong>Charts</strong>
          <Form.Check label="Use Chart 1" checked={useChart1} onChange={(e) => setUseChart1(e.target.checked)} />
          <Form.Check label="Use Chart 2" checked={useChart2} onChange={(e) => setUseChart2(e.target.checked)} />
        </div>

        <Row>
          {useChart1 && charts[0] && (
            <Col md={6}>{renderGraphEditor(0)}</Col>
          )}
          {useChart2 && charts[1] && (
            <Col md={6}>{renderGraphEditor(1)}</Col>
          )}
        </Row>

        <div className="mb-3">
          <label className="form-label">Quotes</label>
          <ReactQuill value={quotes} onChange={setQuotes} theme="snow" modules={quillModules} />
        </div>

        <div className="mb-3">
          <label className="form-label">Final Notes</label>
          <ReactQuill value={notes} onChange={setNotes} theme="snow" modules={quillModules} />
        </div>

        <Button variant="primary" type="submit">Update Insight</Button>
      </form>
    </Container>
  );

  function renderGraphEditor(index) {
    return (
      <div className="border p-3 mb-3 rounded">
        <h6>Chart {index + 1}</h6>
        <Form.Select
          className="mb-2"
          value={charts[index].type}
          onChange={(e) => handleChartChange(index, 'type', e.target.value)}
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </Form.Select>
        <Form.Control
          className="mb-2"
          placeholder="Chart heading"
          value={charts[index].heading}
          onChange={(e) => handleChartChange(index, 'heading', e.target.value)}
        />
        {renderChartDataInputs(index)}
        <div className="mt-2">{renderGraph(index)}</div>
      </div>
    );
  }
}
