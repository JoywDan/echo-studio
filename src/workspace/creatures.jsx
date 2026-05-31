import React from 'react'
/* creatures.jsx — hand-drawn doodle characters (crayon style) */

const C_INK = "#3a3027";
const csk = { strokeLinecap: "round", strokeLinejoin: "round" };

/* shared face bits */
function eyes(lx, rx, y, r = 1.5) {
  return <><circle cx={lx} cy={y} r={r} fill={C_INK} /><circle cx={rx} cy={y} r={r} fill={C_INK} /></>;
}
function blush(lx, rx, y, col = "#e89b8e", r = 2) {
  return <><circle cx={lx} cy={y} r={r} fill={col} opacity="0.5" /><circle cx={rx} cy={y} r={r} fill={col} opacity="0.5" /></>;
}

/* ===================================================================
   ECHO — abstract black panther (HARD REQUIREMENT: used everywhere)
   =================================================================== */
function Panther({ size = 44, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={style} aria-hidden="true">
      {/* head silhouette, loose ink fill */}
      <path d="M11 20c-2-6 0-12 3-13 1.5 3 1.5 6 1 8 3-2 7-3 9-3s6 1 9 3c-.5-2-.5-5 1-8 3 1 5 7 3 13 1.5 2 2 5 2 8 0 8-6 13-15 13S7 36 7 28c0-3 .5-6 4-8z"
        fill="#2a2521" stroke="#1d1a16" strokeWidth="1.4" {...csk} />
      {/* inner ear hint */}
      <path d="M13 11c0 2 .3 4 .9 5.5M35 11c0 2-.3 4-.9 5.5" stroke="#4a423a" strokeWidth="1.2" fill="none" {...csk} />
      {/* eyes — pale yellow almonds */}
      <path d="M16 25c1.5-2.4 5-2.4 6.5 0-1.5 2.2-5 2.2-6.5 0z" fill="#efe1a6" stroke="#1d1a16" strokeWidth="0.8" />
      <path d="M25.5 25c1.5-2.4 5-2.4 6.5 0-1.5 2.2-5 2.2-6.5 0z" fill="#efe1a6" stroke="#1d1a16" strokeWidth="0.8" />
      <circle cx="19.4" cy="25" r="1.2" fill="#1d1a16" /><circle cx="28.6" cy="25" r="1.2" fill="#1d1a16" />
      {/* nose + mouth */}
      <path d="M22.6 30l1.4 1.2 1.4-1.2z" fill="#caa1a0" stroke="#1d1a16" strokeWidth="0.7" />
      <path d="M24 31.4v2M24 33.4c-1.4 1-3 .6-3.6-.5M24 33.4c1.4 1 3 .6 3.6-.5" stroke="#1d1a16" strokeWidth="1" fill="none" {...csk} />
      {/* whiskers */}
      <path d="M14 29l-6-1M15 31.5l-5 1.5M34 29l6-1M33 31.5l5 1.5" stroke="#7c7268" strokeWidth="1" fill="none" {...csk} />
    </svg>
  );
}
/* Echo avatar = panther inside a pink postmark stamp ring */
function EchoAvatar({ size = 44, online, style }) {
  return (
    <div style={{ position: "relative", width: size, height: size, ...style }}>
      <svg width={size} height={size} viewBox="0 0 48 48" style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="none" stroke="#e6bcb4" strokeWidth="2.2" strokeDasharray="1.5 3" opacity="0.9" />
        <circle cx="24" cy="24" r="20.5" fill="#f3ddd8" opacity="0.45" />
      </svg>
      <Panther size={size * 0.84} style={{ position: "absolute", left: size * 0.08, top: size * 0.08 }} />
      {online && <span style={{ position: "absolute", right: 0, bottom: 2, width: size * 0.2, height: size * 0.2, background: "#6fa86b", borderRadius: "50%", border: "2px solid #f4ecdb" }} />}
    </div>
  );
}

/* ===================================================================
   Header mascots
   =================================================================== */
function Crab({ size = 70, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" style={style} aria-hidden="true">
      <g stroke={C_INK} strokeWidth="1.7" {...csk}>
        <path d="M16 44c-5-2-9 0-10 4M56 44c5-2 9 0 10 4M14 38c-5 0-8 3-8 7M58 38c5 0 8 3 8 7" fill="none" />
        {/* body */}
        <ellipse cx="36" cy="42" rx="20" ry="14" fill="#e3794a" />
        {/* claws */}
        <path d="M16 34c-6-2-12 0-13-5 0-4 5-6 9-4M14 30c-4-3-3-7 0-8 2 3 4 4 5 6z" fill="#e3794a" />
        <path d="M56 34c6-2 12 0 13-5 0-4-5-6-9-4M58 30c4-3 3-7 0-8-2 3-4 4-5 6z" fill="#e3794a" />
        {/* eyes on stalks */}
        <path d="M28 30v-9M44 30v-9" fill="none" />
        <circle cx="28" cy="18" r="6" fill="#fff" /><circle cx="44" cy="18" r="6" fill="#fff" />
      </g>
      <circle cx="29" cy="19" r="2.4" fill={C_INK} /><circle cx="45" cy="19" r="2.4" fill={C_INK} />
      <path d="M30 47c2.5 2.5 6 2.5 8.5 0" stroke={C_INK} strokeWidth="1.6" fill="none" {...csk} />
      <path d="M31 43h3M38 43h3" stroke={C_INK} strokeWidth="1.4" {...csk} />
      {blush(27, 45, 44, "#d35f3c", 2.4)}
    </svg>
  );
}
function TreasureChest({ size = 72, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 76 76" style={style} aria-hidden="true">
      <g stroke={C_INK} strokeWidth="1.7" {...csk}>
        <rect x="12" y="38" width="52" height="26" rx="4" fill="#b06a55" />
        <path d="M12 42c0-10 8-16 26-16s26 6 26 16v2H12z" fill="#c17e67" />
        <path d="M12 50h52" fill="none" stroke="#8f5240" />
        {/* gold bands */}
        <path d="M22 26v38M54 26v38" stroke="#d6a83e" strokeWidth="3" fill="none" />
        <rect x="33" y="46" width="10" height="9" rx="2" fill="#d6a83e" />
      </g>
      <circle cx="38" cy="50" r="1.4" fill={C_INK} />
      {/* sparkly cats/papers peeking out */}
      <g stroke={C_INK} strokeWidth="1.3" {...csk}>
        <path d="M30 30c1-4 3-5 4-2 2-2 4-1 3 2z" fill="#f3ece0" />
        <path d="M44 28c1-4 3-5 4-2 2-2 4-1 3 2z" fill="#f3ece0" />
      </g>
      <path d="M37 22l1.2 2.6 2.8.3-2.1 2 .6 2.8L37 30.4 34.5 32l.6-2.8-2.1-2 2.8-.3z" fill="#f4dd9a" stroke="#d6a83e" strokeWidth="1" {...csk} />
    </svg>
  );
}
function WormCrown({ size = 46, style }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 48 34" style={style} aria-hidden="true">
      <g stroke={C_INK} strokeWidth="1.5" {...csk}>
        <circle cx="10" cy="22" r="8" fill="#eeb6b8" />
        <circle cx="20" cy="20" r="6.5" fill="#ecaeb0" />
        <circle cx="29" cy="21" r="5.5" fill="#eeb6b8" />
        <circle cx="37" cy="22" r="4.5" fill="#ecaeb0" />
        <path d="M5 13l2 4 3-4 3 4 2-4z" fill="#e6c45f" />
      </g>
      {eyes(8, 13, 22, 1.3)}
      <path d="M8 25c1.5 1.2 3.5 1.2 5 0" stroke={C_INK} strokeWidth="1.2" fill="none" {...csk} />
      {blush(5, 15, 24, "#e07f72", 1.6)}
    </svg>
  );
}
function Rabbit({ size = 44, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={style} aria-hidden="true">
      <g stroke={C_INK} strokeWidth="1.5" {...csk}>
        <path d="M16 16c-2-7 0-11 2-11s3 5 2 11zM32 16c2-7 0-11-2-11s-3 5-2 11z" fill="#f3ece2" />
        <circle cx="24" cy="28" r="13" fill="#f5efe6" />
        <path d="M38 26c4-1 6 1 6 4s-3 4-6 3" fill="#f5efe6" />
      </g>
      {eyes(19, 29, 27, 1.5)}
      <path d="M23 30h2M24 30v1.5M22.5 32c1 .8 2 .8 3 0" stroke={C_INK} strokeWidth="1.2" fill="none" {...csk} />
      {blush(16.5, 31.5, 30, "#e89b8e", 2)}
    </svg>
  );
}

/* ===================================================================
   Conversation avatars
   =================================================================== */
function PinkBlobCrown({ size = 46, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={style} aria-hidden="true">
      <path d="M11 30c-3-1-4-5-1-7-2-4 1-8 5-7 0-4 4-6 7-4 2-3 7-3 9 1 4-1 7 3 5 7 3 1 4 6 0 8 1 4-3 7-7 6 0 3-5 4-7 1-3 2-8 0-7-4-2 1-6 0-6-2z"
        fill="#ecaeb0" stroke={C_INK} strokeWidth="1.5" {...csk} />
      <path d="M17 11l2.5 5 4.5-5 4.5 5 2.5-5z" fill="#e6c45f" stroke={C_INK} strokeWidth="1.3" {...csk} />
      {eyes(20, 28, 27, 2)}
      <path d="M22 31c1.2 1.5 3.8 1.5 5 0" stroke={C_INK} strokeWidth="1.4" fill="none" {...csk} />
      <path d="M18 37c2-2 4-2 6 0 2-2 4-2 6 0" stroke="#8ec5cf" strokeWidth="2.4" fill="none" {...csk} />
      {blush(17, 31, 31, "#e07f72", 2.4)}
    </svg>
  );
}
function FuzzGreen({ size = 46, style }) {
  const spikes = [];
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; spikes.push([24 + Math.cos(a) * 15, 25 + Math.sin(a) * 15, 24 + Math.cos(a) * 19, 25 + Math.sin(a) * 19]); }
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={style} aria-hidden="true">
      <g stroke={C_INK} strokeWidth="1.3" {...csk}>
        {spikes.map((s, i) => <path key={i} d={`M${s[0]} ${s[1]}L${s[2]} ${s[3]}`} fill="none" />)}
        <circle cx="24" cy="25" r="14" fill="#aebd86" />
        <path d="M16 12l3 6 4-6z" fill="#e6a3a0" />
        <path d="M13 33l-5 5M35 33l5 5M19 39v6M29 39v6" fill="none" />
      </g>
      {eyes(20, 29, 23, 2)}
      <path d="M21 28c1 2 4 2 6 0l-1 4c-1 1.5-3 1.5-4 0z" fill="#d96a6a" stroke={C_INK} strokeWidth="1.2" {...csk} />
      {blush(17, 31, 28, "#7f9a52", 2)}
    </svg>
  );
}
function CupcakeCyclops({ size = 46, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={style} aria-hidden="true">
      <g stroke={C_INK} strokeWidth="1.5" {...csk}>
        <path d="M10 26c0-9 6-15 14-15s14 6 14 15c0 2-2 3-4 2-1 3-5 4-7 1-2 3-6 2-7-1-2 1-4 0-4-2z" fill="#f3e4c6" />
        <path d="M11 27c3 2 6 2 8.5 0 2.5 2 5.5 2 8.5 0 2.5 2 5.5 2 8 0" fill="none" stroke="#d8b98a" />
        <circle cx="24" cy="9" r="3.4" fill="#d35c5c" />
        <path d="M24 9c0-3-3-4-3-6" fill="none" />
      </g>
      <circle cx="24" cy="22" r="4.4" fill="#fff" stroke={C_INK} strokeWidth="1.3" />
      <circle cx="24" cy="22.5" r="2.2" fill={C_INK} />
      <path d="M21 28c1.5 1.5 4.5 1.5 6 0" stroke={C_INK} strokeWidth="1.3" fill="none" {...csk} />
      {blush(16, 32, 26, "#e8a08c", 2.6)}
    </svg>
  );
}

/* ===================================================================
   Note creatures
   =================================================================== */
function RunCloudGreen({ size = 40, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 40" style={style} aria-hidden="true">
      <g stroke={C_INK} strokeWidth="1.5" {...csk}>
        <path d="M10 22c-4 0-6-3-5-6 0-3 3-5 6-4 1-4 5-6 9-4 3-1 7 1 7 5 3 0 5 3 4 6-1 3-4 4-7 3z" fill="#aebd86" />
        <path d="M12 26l-4 5M20 27v6M27 26l4 5M16 28v6" fill="none" />
      </g>
      {eyes(15, 23, 16, 1.6)}
      <path d="M16 19c1.5 1.5 4 1.5 5.5 0" stroke={C_INK} strokeWidth="1.3" fill="none" {...csk} />
      {blush(12, 26, 18, "#7f9a52", 2)}
    </svg>
  );
}
function GreenAlien({ size = 36, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={style} aria-hidden="true">
      <g stroke={C_INK} strokeWidth="1.5" {...csk}>
        <path d="M10 16c-1-4 0-6 1-6M30 16c1-4 0-6-1-6" fill="none" />
        <circle cx="11" cy="9" r="2" fill="#a9bd84" /><circle cx="29" cy="9" r="2" fill="#a9bd84" />
        <path d="M8 30c0-9 5-14 12-14s12 5 12 14z" fill="#a9bd84" />
        <path d="M8 30h24" fill="none" />
      </g>
      {eyes(16, 24, 24, 1.8)}
      <path d="M18 28c1 1 3 1 4 0" stroke={C_INK} strokeWidth="1.2" fill="none" {...csk} />
      {blush(13, 27, 27, "#7f9a52", 2)}
    </svg>
  );
}

/* ===================================================================
   Studio mini-illustrations (compact)
   =================================================================== */
function BearWave({ size = 40, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" style={style} aria-hidden="true">
      <g stroke={C_INK} strokeWidth="1.4" {...csk}>
        <circle cx="12" cy="13" r="4" fill="#f0e2cc" /><circle cx="32" cy="13" r="4" fill="#f0e2cc" />
        <circle cx="22" cy="24" r="13" fill="#f3e7d3" />
        <path d="M8 16l-3-5" fill="none" />
      </g>
      {eyes(18, 26, 23, 1.6)}
      <ellipse cx="22" cy="27" rx="3" ry="2.2" fill="#e7d2b0" stroke={C_INK} strokeWidth="1" />
      <circle cx="22" cy="26" r="1" fill={C_INK} />
      <path d="M5 11c2-2 5-1 5 2" stroke={C_INK} strokeWidth="1.4" fill="none" {...csk} />
      <path d="M16 36c2-2 4-3 7-1" stroke="#c98a7c" strokeWidth="2" fill="none" {...csk} />
      {blush(15, 29, 26, "#e8a98e", 2)}
    </svg>
  );
}
function PainterBlob({ size = 40, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" style={style} aria-hidden="true">
      <g stroke={C_INK} strokeWidth="1.4" {...csk}>
        <path d="M8 18c-2-4 2-8 7-8 1-3 8-3 9 0 5 0 8 4 6 8 2 3-1 7-5 6 0 0-13 0-13 0-4 1-6-3-4-6z" fill="#f3e0d0" />
        <path d="M6 14c5-3 12-3 17 0" fill="none" stroke="#9a7d6a" />
        <ellipse cx="14.5" cy="11" rx="9" ry="2.5" fill="#caa18c" />
        <path d="M30 16l5-5M35 11l1-2" fill="none" />
      </g>
      {eyes(14, 22, 17, 1.5)}
      <path d="M15 20c1.5 1.5 4 1.5 5.5 0" stroke={C_INK} strokeWidth="1.2" fill="none" {...csk} />
      <circle cx="35" cy="9" r="1.6" fill="#d36a6a" />
      {blush(11, 25, 19, "#e8a98e", 1.8)}
    </svg>
  );
}
function WriterPink({ size = 42, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 46 40" style={style} aria-hidden="true">
      <g stroke={C_INK} strokeWidth="1.4" {...csk}>
        <path d="M4 34c4-4 14-5 20-2" fill="none" stroke="#c9a98c" />
        <path d="M6 30c2-9 16-9 18 0z" fill="#f3ece0" />
        <circle cx="13" cy="16" r="9" fill="#f1ddd6" />
        <path d="M5 14c0-5 5-8 8-7M21 14c0-5-5-8-8-7" fill="#eeb6b8" />
        <path d="M22 30l8-4 2 3-8 4z" fill="#d8b98a" />
      </g>
      {eyes(10, 16, 16, 1.5)}
      <path d="M11 19c1 1 3 1 4 0" stroke={C_INK} strokeWidth="1.2" fill="none" {...csk} />
      {blush(7, 19, 18, "#e8a98e", 1.8)}
    </svg>
  );
}
function CatCamera({ size = 42, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 46 40" style={style} aria-hidden="true">
      <g stroke={C_INK} strokeWidth="1.4" {...csk}>
        <path d="M8 12l2-5 3 4zM18 11l3-4 1 5z" fill="#f3ece2" />
        <circle cx="15" cy="18" r="10" fill="#f5efe6" />
        <rect x="22" y="16" width="16" height="12" rx="2.5" fill="#cdbfa8" />
        <circle cx="30" cy="22" r="3.6" fill="#e6ddca" />
      </g>
      {eyes(12, 18, 18, 1.5)}
      <path d="M13.5 21c.8.8 2.2.8 3 0" stroke={C_INK} strokeWidth="1.1" fill="none" {...csk} />
      <path d="M6 19l-3 .5M7 21l-3 1.5M24 16l3-3h6l3 3" fill="none" stroke={C_INK} strokeWidth="1.2" {...csk} />
      {blush(10, 20, 20, "#e8a98e", 1.7)}
    </svg>
  );
}
function BlobTrio({ size = 56, style }) {
  const cfg = [[12, 22, "#eeb6b8"], [27, 20, "#aebd86"], [42, 22, "#e8c98c"]];
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 56 34" style={style} aria-hidden="true">
      {cfg.map(([x, y, c], i) => (
        <g key={i} stroke={C_INK} strokeWidth="1.3" {...csk}>
          <circle cx={x} cy={y} r="8" fill={c} />
          <circle cx={x - 2.5} cy={y - 1} r="1.2" fill={C_INK} /><circle cx={x + 2.5} cy={y - 1} r="1.2" fill={C_INK} />
          <path d={`M${x - 2} ${y + 2.5}c1.3 1.2 2.7 1.2 4 0`} fill="none" />
        </g>
      ))}
    </svg>
  );
}
function SleepCloud({ size = 50, style }) {
  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 52 32" style={style} aria-hidden="true">
      <ellipse cx="26" cy="27" rx="22" ry="4.5" fill="#bcd0d6" stroke={C_INK} strokeWidth="1.2" />
      <path d="M12 22c-4 0-6-3-5-6 0-3 4-5 7-3 1-4 6-5 9-2 3-1 7 1 6 5 3 0 4 4 1 6z" fill="#cdd6b8" stroke={C_INK} strokeWidth="1.4" {...csk} />
      <path d="M15 17c1.2 1 3 1 4 0M22 17c1.2 1 3 1 4 0" stroke={C_INK} strokeWidth="1.2" fill="none" {...csk} />
      {blush(14, 27, 19, "#e8a98e", 1.8)}
    </svg>
  );
}

export { Panther, EchoAvatar, Crab, TreasureChest, WormCrown, Rabbit, PinkBlobCrown, FuzzGreen, CupcakeCyclops, RunCloudGreen, GreenAlien, BearWave, PainterBlob, WriterPink, CatCamera, BlobTrio, SleepCloud };
