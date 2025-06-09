'use client';

import Link from 'next/link';
import './reports.css'; // optional for cleaner separation of styles

const ReportsDropdown = () => {
  return (
    <div className="dropdown me-3">
      <button
        className="btn custom-dropdown-btn dropdown-toggle"
        type="button"
        id="reportsDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Reports
      </button>
      <ul className="dropdown-menu custom-dropdown-menu" aria-labelledby="reportsDropdown">
        <li>
          <Link className="dropdown-item custom-dropdown-item" href="https://raceautoanalytics.com/">
            ⚡ Flash Reports
          </Link>
        </li>
        <li>
          <Link className="dropdown-item custom-dropdown-item" href="/forecast-preview">
            🔮 Forecast
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default ReportsDropdown;
