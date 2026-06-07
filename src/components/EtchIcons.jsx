import React from 'react';

/**
 * ═══════════════════════════════════════════
 * OMEGA CUSTOM "ETCH" STENCIL ICON LIBRARY 🌌✨
 * ═══════════════════════════════════════════
 * 
 * Chào ní! Đây là bộ Icon "Etch-Style" được thiết kế hoàn toàn thủ công,
 * mô phỏng hoàn hảo ngôn ngữ thiết kế của bộ Font Awesome Etch Pro+
 * (đường nét siêu đậm, góc sắc bén, các rãnh cắt CNC laser rỗng stenciled).
 * 
 * Bộ icon này giúp ní sử dụng ngay lập tức mà không lo bị chặn 403 CDN hay
 * phải mua gói Pro+ đắt đỏ của Font Awesome!
 */

// 1. Lightning / Energy Icon (Thay thế Zap)
export function EtchZap({ className = "w-5 h-5", ...props }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="square" 
      strokeLinejoin="miter" 
      className={className} 
      {...props}
    >
      {/* Sét CNC sắc nhọn stenciled */}
      <path d="M13 2 L3 13 H11 L10 22 L20 11 H12 Z" />
      <path d="M7.5 11 H14.5" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
    </svg>
  );
}

// 2. Navigation / Compass Icon (Thay thế Navigation)
export function EtchNavigation({ className = "w-5 h-5", ...props }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="square" 
      strokeLinejoin="miter" 
      className={className} 
      {...props}
    >
      {/* Mũi tên định vị phong cách laser-cut */}
      <path d="M12 2 L22 22 L12 17 L2 22 Z" />
      {/* Rãnh cắt stencil ở giữa */}
      <line x1="12" y1="9" x2="12" y2="14" strokeWidth="1.8" />
    </svg>
  );
}

// 3. Command Line Console Icon (Thay thế Terminal)
export function EtchTerminal({ className = "w-5 h-5", ...props }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="square" 
      strokeLinejoin="miter" 
      className={className} 
      {...props}
    >
      {/* Dấu nhắc dòng lệnh sắc lẹm */}
      <path d="M6 6 L13 12 L6 18" />
      {/* Con trỏ nhấp nháy stenciled dày */}
      <line x1="14" y1="18" x2="20" y2="18" strokeWidth="3" />
    </svg>
  );
}

// 4. Global Network Icon (Thay thế Globe)
export function EtchGlobe({ className = "w-5 h-5", ...props }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="square" 
      className={className} 
      {...props}
    >
      {/* Khung cầu viền đôi */}
      <circle cx="12" cy="12" r="9.5" strokeWidth="2.8" />
      {/* Rãnh cắt ngang và dọc stenciled */}
      <path d="M2.5 12 H21.5" strokeWidth="2" />
      <path d="M12 2.5 Q 16 12 12 21.5 Q 8 12 12 2.5 Z" strokeWidth="1.8" />
    </svg>
  );
}

// 5. System CPU/Node Icon (Thay thế Cpu)
export function EtchCpu({ className = "w-5 h-5", ...props }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="square" 
      className={className} 
      {...props}
    >
      <rect x="4" y="4" width="16" height="16" strokeWidth="2.8" />
      <rect x="9" y="9" width="6" height="6" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
      {/* Chân chip stenciled */}
      <path d="M9 1v3 M12 1v3 M15 1v3 M9 20v3 M12 20v3 M15 20v3 M1 9h3 M1 12h3 M1 15h3 M20 9h3 M20 12h3 M20 15h3" strokeWidth="1.8" />
    </svg>
  );
}

// 6. Security Shield Icon (Thay thế Shield)
export function EtchShield({ className = "w-5 h-5", ...props }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="square" 
      strokeLinejoin="miter" 
      className={className} 
      {...props}
    >
      <path d="M12 2 L20 5 V11 C20 16.5 16.5 21 12 22 C7.5 21 4 16.5 4 11 V5 Z" />
      {/* Tâm lá chắn dạng tâm ngắm quân sự stenciled */}
      <path d="M12 7 V17 M7 12 H17" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
    </svg>
  );
}

// 7. Telemetry Activity Pulse Icon (Thay thế Activity)
export function EtchActivity({ className = "w-5 h-5", ...props }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="square" 
      strokeLinejoin="miter" 
      className={className} 
      {...props}
    >
      <path d="M2 12 H6 L9 5 L13 19 L16 9 L18 12 H22" />
    </svg>
  );
}

// 8. Sparkles Stars Icon (Thay thế Sparkles)
export function EtchSparkles({ className = "w-5 h-5", ...props }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className} 
      {...props}
    >
      {/* Ngôi sao 4 cánh dạng stencil phát sáng */}
      <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
    </svg>
  );
}

// 9. Arrow Right Directional Icon (Thay thế ArrowRight)
export function EtchArrowRight({ className = "w-5 h-5", ...props }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="square" 
      strokeLinejoin="miter" 
      className={className} 
      {...props}
    >
      {/* Mũi tên chỉ dẫn nét siêu đậm CNC */}
      <path d="M4 12 H20 M14 6 L20 12 L14 18" />
    </svg>
  );
}

// 10. Search Scope Tracking Icon (Thay thế Search)
export function EtchSearch({ className = "w-5 h-5", ...props }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="square" 
      strokeLinejoin="miter" 
      className={className} 
      {...props}
    >
      {/* Thấu kính định vị trinh sát */}
      <circle cx="10.5" cy="10.5" r="6.5" strokeWidth="2.8" />
      {/* Tay cầm laser stencil */}
      <path d="M16 16 L21.5 21.5" strokeWidth="3" />
    </svg>
  );
}
