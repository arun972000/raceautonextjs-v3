"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Pagination } from "react-bootstrap";
import Link from "next/link";

const imageBase = process.env.NEXT_PUBLIC_S3_BUCKET_URL;
const ITEMS_PER_PAGE = 8;

export default function InsightsListPage() {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("/api/admin/insights")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInsights(data.insights);
        }
      })
      .catch((err) => console.error("Error fetching insights:", err))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(insights.length / ITEMS_PER_PAGE);
  const paginatedData = insights.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h3 className="mb-4">All Insights</h3>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {paginatedData.map((insight) => {
          const firstImage = insight.images?.[0];
          const imageUrl = firstImage ? `${imageBase}${firstImage}` : "/no-image.jpg";

          return (
            <Col key={insight.id}>
              <Card className="h-100 shadow-sm">
                <Link
                  href={`/insights/${insight.id}`}
                  className="text-decoration-none text-dark"
                >
                  <Card.Img
                    variant="top"
                    src={imageUrl}
                    style={{ height: "180px", objectFit: "cover" }}
                    alt="Insight image"
                  />
                  <Card.Body>
                    <Card.Title
                      dangerouslySetInnerHTML={{ __html: insight.title }}
                      style={{ fontSize: "1rem" }}
                    />
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Pagination.Item>
          ))}

          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      )}
    </Container>
  );
}
