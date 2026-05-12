// Premium Sanjish Logo — Brand Identity
const SanjishLogo = ({ size = "md", showTagline = false, className = "" }) => {
  const sizes = {
    sm: { width: 28, height: 28, fontSize: "1rem", tagFont: "0.55rem" },
    md: { width: 36, height: 36, fontSize: "1.3rem", tagFont: "0.6rem" },
    lg: { width: 48, height: 48, fontSize: "1.6rem", tagFont: "0.7rem" },
    xl: { width: 64, height: 64, fontSize: "2rem", tagFont: "0.8rem" },
    hero: { width: 80, height: 80, fontSize: "2.5rem", tagFont: "0.85rem" },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div
      className={`sanjish-logo ${className}`}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: showTagline ? "2px" : "0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {/* Logo Icon - Premium SVG Badge */}
        <svg
          width={s.width}
          height={s.height}
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sjGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff416c" />
              <stop offset="50%" stopColor="#ff4b2b" />
              <stop offset="100%" stopColor="#f7971e" />
            </linearGradient>
            <linearGradient id="sjGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff6b6b" />
              <stop offset="100%" stopColor="#feca57" />
            </linearGradient>
            <linearGradient id="sjGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>

          {/* Shadow layer */}
          <path
            d="M40 6 L72 24 L72 50 C72 62 56 74 40 78 C24 74 8 62 8 50 L8 24 Z"
            fill="rgba(255, 65, 108, 0.15)"
            transform="translate(0, 2)"
          />

          {/* Outer shield */}
          <path
            d="M40 4 L72 22 L72 50 C72 62 56 74 40 78 C24 74 8 62 8 50 L8 22 Z"
            fill="url(#sjGrad1)"
          />

          {/* Inner shape */}
          <path
            d="M40 12 L64 26 L64 48 C64 58 52 67 40 70 C28 67 16 58 16 48 L16 26 Z"
            fill="url(#sjGrad3)"
            opacity="0.85"
          />

          {/* White accent arc */}
          <path
            d="M24 30 Q40 38 56 30"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Letter "S" monogram — crisp, no blur */}
          <text
            x="40"
            y="48"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontFamily="'Playfair Display', Georgia, serif"
            fontWeight="900"
            fontSize="34"
            letterSpacing="0.5"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.15)" }}
          >
            S
          </text>

          {/* Top star accent */}
          <circle cx="40" cy="16" r="2.5" fill="white">
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Side dots */}
          <circle cx="28" cy="32" r="1.5" fill="white" opacity="0.6" />
          <circle cx="52" cy="32" r="1.5" fill="white" opacity="0.6" />
        </svg>

        {/* Brand Name */}
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: s.fontSize,
            fontWeight: "800",
            background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "2px",
            lineHeight: 1,
          }}
        >
          SANJISH
        </span>
      </div>

      {/* Tagline */}
      {showTagline && (
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: s.tagFont,
            fontStyle: "italic",
            color: "var(--gray-400)",
            letterSpacing: "2.5px",
            fontWeight: "400",
            opacity: 0.85,
            marginTop: "-2px",
          }}
        >
          Where Trust Meets Style
        </span>
      )}
    </div>
  );
};

export default SanjishLogo;
