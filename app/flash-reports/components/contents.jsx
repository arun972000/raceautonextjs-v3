'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './styles/chart.css'; // Custom CSS file for hover style

const Contents = () => {
    const pathname = usePathname();

    const links = [
        { label: 'Overall Automotive Industry', href: '/flash-reports' },
        { label: 'Two wheeler', href: '/flash-reports/two-wheeler' },
        { label: 'Three wheeler', href: '/flash-reports/three-wheeler' },
        { label: 'Commercial Vehicles', href: '/flash-reports/commercial-vehicle' },
        { label: 'Passenger Vehicles', href: '/flash-reports/passenger-vehicle' },
        { label: 'Tractor', href: '/flash-reports/tractor' },
    ];

    return (
        <div className="text-center text-lg-start">
            <h1>CONTENTS</h1>
            <ul className="list-unstyled">
                {links.map(({ label, href }) => {
                    const isActive = pathname === href;
                    return (
                        <li key={href} className="py-2 fs-4">
                            <Link
                                href={href}
                                className={`text-decoration-none fw-${isActive ? 'bold' : 'normal'} ${isActive ? 'text-primary' : 'text-white'} custom-hover`}
                            >
                                {label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Contents;
