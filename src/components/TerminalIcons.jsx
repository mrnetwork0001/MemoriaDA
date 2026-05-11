/**
 * TerminalIcons — Custom SVG/ASCII icons that match the
 * MemoriaDA Terminal CLI design system.
 *
 * All icons use inline SVG or styled spans.
 * Color: #7c3aed (deep purple) by default, inherits currentColor.
 */

import React from 'react';

/* ── Helper: wraps SVG in a consistent size box ─────────── */
const Icon = ({ children, size = 14, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`term-icon ${className}`}
    aria-hidden="true"
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
  >
    {children}
  </svg>
);

/* ── Neural / Brain — 4-node graph ─────────────────────── */
export const IconNeural = ({ size }) => (
  <Icon size={size}>
    <circle cx="3" cy="8" r="1.5" fill="currentColor" />
    <circle cx="8" cy="3" r="1.5" fill="currentColor" />
    <circle cx="13" cy="8" r="1.5" fill="currentColor" />
    <circle cx="8" cy="13" r="1.5" fill="currentColor" />
    <circle cx="8" cy="8" r="1.5" fill="currentColor" opacity="0.7"/>
    <line x1="3" y1="8" x2="8" y2="3" stroke="currentColor" strokeWidth="0.8" />
    <line x1="8" y1="3" x2="13" y2="8" stroke="currentColor" strokeWidth="0.8" />
    <line x1="13" y1="8" x2="8" y2="13" stroke="currentColor" strokeWidth="0.8" />
    <line x1="8" y1="13" x2="3" y2="8" stroke="currentColor" strokeWidth="0.8" />
    <line x1="3" y1="8" x2="8" y2="8" stroke="currentColor" strokeWidth="0.6" strokeDasharray="1.5 1" />
    <line x1="8" y1="3" x2="8" y2="8" stroke="currentColor" strokeWidth="0.6" strokeDasharray="1.5 1" />
  </Icon>
);

/* ── Chain / Link — two square links ──────────────────── */
export const IconChain = ({ size }) => (
  <Icon size={size}>
    <rect x="1" y="5" width="5" height="6" rx="0" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <rect x="10" y="5" width="5" height="6" rx="0" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <line x1="6" y1="8" x2="10" y2="8" stroke="currentColor" strokeWidth="1.2" />
    <line x1="6" y1="6.5" x2="10" y2="6.5" stroke="currentColor" strokeWidth="0.6" />
    <line x1="6" y1="9.5" x2="10" y2="9.5" stroke="currentColor" strokeWidth="0.6" />
  </Icon>
);

/* ── Agent — terminal face ────────────────────────────── */
export const IconAgent = ({ size }) => (
  <Icon size={size}>
    <rect x="2" y="2" width="12" height="12" stroke="currentColor" strokeWidth="1" fill="none" />
    <rect x="4.5" y="5" width="2" height="2" fill="currentColor" />
    <rect x="9.5" y="5" width="2" height="2" fill="currentColor" />
    <line x1="5" y1="10" x2="11" y2="10" stroke="currentColor" strokeWidth="1" />
    <line x1="5" y1="10" x2="5" y2="11" stroke="currentColor" strokeWidth="1" />
    <line x1="11" y1="10" x2="11" y2="11" stroke="currentColor" strokeWidth="1" />
  </Icon>
);

/* ── User — person outline ────────────────────────────── */
export const IconUser = ({ size }) => (
  <Icon size={size}>
    <rect x="5" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M1 15 C1 11 4 9 8 9 C12 9 15 11 15 15" stroke="currentColor" strokeWidth="1" fill="none" />
  </Icon>
);

/* ── Warning / Alert — triangle with ! ───────────────── */
export const IconWarn = ({ size }) => (
  <Icon size={size}>
    <polygon points="8,1 15,14 1,14" stroke="currentColor" strokeWidth="1" fill="none" />
    <line x1="8" y1="6" x2="8" y2="10" stroke="currentColor" strokeWidth="1.2" />
    <rect x="7.2" y="11.5" width="1.6" height="1.6" fill="currentColor" />
  </Icon>
);

/* ── OK / Checkmark — square bracket check ───────────── */
export const IconOK = ({ size }) => (
  <Icon size={size}>
    <polyline points="2,8 6,12 14,3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="square" />
  </Icon>
);

/* ── Error / X ────────────────────────────────────────── */
export const IconErr = ({ size }) => (
  <Icon size={size}>
    <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
  </Icon>
);

/* ── Lightning / Compute — bolt ──────────────────────── */
export const IconBolt = ({ size }) => (
  <Icon size={size}>
    <polyline points="10,1 4,9 8,9 6,15 12,7 8,7" stroke="currentColor" strokeWidth="1" fill="none" />
    <polygon points="10,1 4,9 8,9 6,15 12,7 8,7" fill="currentColor" opacity="0.15" />
  </Icon>
);

/* ── Globe / Network ─────────────────────────────────── */
export const IconGlobe = ({ size }) => (
  <Icon size={size}>
    <rect x="1" y="1" width="14" height="14" stroke="currentColor" strokeWidth="1" fill="none" />
    <line x1="8" y1="1" x2="8" y2="15" stroke="currentColor" strokeWidth="0.8" />
    <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="0.8" />
    <path d="M8 1 C5 4 5 12 8 15" stroke="currentColor" strokeWidth="0.8" fill="none" />
    <path d="M8 1 C11 4 11 12 8 15" stroke="currentColor" strokeWidth="0.8" fill="none" />
  </Icon>
);

/* ── Lock ─────────────────────────────────────────────── */
export const IconLock = ({ size }) => (
  <Icon size={size}>
    <rect x="3" y="7" width="10" height="8" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M5 7 V5 C5 2.8 11 2.8 11 5 V7" stroke="currentColor" strokeWidth="1" fill="none" />
    <rect x="7" y="10" width="2" height="2" fill="currentColor" />
  </Icon>
);

/* ── Package / Storage box ────────────────────────────── */
export const IconBox = ({ size }) => (
  <Icon size={size}>
    <rect x="2" y="5" width="12" height="10" stroke="currentColor" strokeWidth="1" fill="none" />
    <polyline points="2,5 8,2 14,5" stroke="currentColor" strokeWidth="1" fill="none" />
    <line x1="8" y1="2" x2="8" y2="15" stroke="currentColor" strokeWidth="0.8" />
    <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
  </Icon>
);

/* ── Hourglass / Saving ───────────────────────────────── */
export const IconHourglass = ({ size }) => (
  <Icon size={size}>
    <polygon points="2,1 14,1 10,8 14,15 2,15 6,8" stroke="currentColor" strokeWidth="1" fill="none" />
    <line x1="5" y1="1" x2="11" y2="1" stroke="currentColor" strokeWidth="1.5" />
    <line x1="5" y1="15" x2="11" y2="15" stroke="currentColor" strokeWidth="1.5" />
    <line x1="6" y1="8" x2="10" y2="8" stroke="currentColor" strokeWidth="0.8" />
  </Icon>
);

/* ── Camera / Snapshot ────────────────────────────────── */
export const IconSnapshot = ({ size }) => (
  <Icon size={size}>
    <rect x="1" y="4" width="14" height="11" stroke="currentColor" strokeWidth="1" fill="none" />
    <rect x="5" y="1" width="6" height="3" stroke="currentColor" strokeWidth="1" fill="none" />
    <circle cx="8" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1" fill="none" />
    <circle cx="8" cy="9.5" r="1" fill="currentColor" />
  </Icon>
);

/* ── Link / 0G Storage ────────────────────────────────── */
export const IconLink = ({ size }) => (
  <Icon size={size}>
    <path d="M6 8 C6 5 10 5 10 8" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M6 8 C6 11 2 11 2 8 C2 5 6 5 6 8" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M10 8 C10 11 14 11 14 8 C14 5 10 5 10 8" stroke="currentColor" strokeWidth="1" fill="none" />
  </Icon>
);

/* ── Dot status — online (green) ─────────────────────── */
export const IconDotGreen = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <rect x="2" y="2" width="6" height="6" fill="#7c3aed" />
  </svg>
);

/* ── Dot status — warning (yellow) ──────────────────────*/
export const IconDotYellow = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <rect x="2" y="2" width="6" height="6" fill="#b08a00" />
  </svg>
);

/* ── Rocket / Speed (MAX) — upward arrow ─────────────── */
export const IconRocket = ({ size }) => (
  <Icon size={size}>
    <polygon points="8,1 11,7 9,7 9,13 7,13 7,7 5,7" fill="currentColor" opacity="0.85" />
    <line x1="5" y1="13" x2="4" y2="15" stroke="currentColor" strokeWidth="1" />
    <line x1="11" y1="13" x2="12" y2="15" stroke="currentColor" strokeWidth="1" />
  </Icon>
);

/* ── Memory recall badge icon ─────────────────────────── */
export const IconMemory = ({ size }) => (
  <Icon size={size}>
    <rect x="2" y="4" width="12" height="8" stroke="currentColor" strokeWidth="1" fill="none" />
    <line x1="5" y1="7" x2="11" y2="7" stroke="currentColor" strokeWidth="1" />
    <line x1="5" y1="9" x2="9" y2="9" stroke="currentColor" strokeWidth="1" />
    <rect x="10" y="1" width="3" height="3" fill="currentColor" opacity="0.5" />
  </Icon>
);

export default {
  IconNeural,
  IconChain,
  IconAgent,
  IconUser,
  IconWarn,
  IconOK,
  IconErr,
  IconBolt,
  IconGlobe,
  IconLock,
  IconBox,
  IconHourglass,
  IconSnapshot,
  IconLink,
  IconDotGreen,
  IconDotYellow,
  IconRocket,
  IconMemory,
};
