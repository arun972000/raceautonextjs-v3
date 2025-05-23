'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { FaClipboardList, FaBolt } from 'react-icons/fa';
import Link from 'next/link';
import "./Header.css"

const Header = () => {
  const [isLogoHover, setLogoHover] = useState(false);
  return (
    <div className="app-header d-flex justify-content-between align-items-center">
      <Link href="/" passHref>
        <motion.div
          className="logo-container"
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
          onClick={() => router.push('/')}
          animate={{
            scale: isLogoHover ? 1.05 : 1,
            filter: isLogoHover
              ? "drop-shadow(0 0 12px var(--accent, #FFDC00)) brightness(1.2) saturate(1.3)"
              : "none"
          }}
          transition={{
            scale: { type: "spring", stiffness: 300, damping: 20 },
            filter: { duration: 0.2 }
          }}
        >
          <Image
            src="/images/rai.png"
            alt="Race Auto India"
            className="app-logo"
            width={250}
            height={80}

          />
          {/* <motion.span
                  className="logo-tooltip"
                  initial={{ opacity: 0, y: -8 }}
                  animate={isLogoHover ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                >
                  <FaPlay style={{ marginRight: 4, color: '#fff', transform: 'rotate(-90deg)'}}/>
                  <span style={{textDecoration:'none'}}>Go Home</span>
                </motion.span> */}
        </motion.div>

      </Link>
      {/* <div className="nav-buttons">
        <button
          className="nav-btn"
          onClick={() => router.push('/score-card')}
        >
          <FaClipboardList className="btn-icon" />
          Build Your Own Tailored Forecast
        </button>

        <button
          className="nav-btn"
          onClick={() => router.push('/reports')}
        >
          <FaBolt className="btn-icon" />
          Flash Reports
        </button>
      </div> */}

    </div>
  )
}

export default Header