import { Filter, Download, ArrowLeft, MoreHorizontal, Edit2 } from 'lucide-react';

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold tracking-wide text-zinc-100 font-sans" style={{ letterSpacing: '0.03em' }}>{title}</h2>
        {subtitle && (
          <p className="text-xs mt-1 text-zinc-400 font-mono tracking-wide uppercase opacity-70">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {actions}
      </div>
    </div>
  );
}

export function Card({ children, className = '', noPadding = false }) {
  return (
    <div
      className={`cyber-notched-card ${noPadding ? '' : 'p-5'} ${className}`}
    >
      {children}
    </div>
  );
}

export function TableToolbar({ title, onAdd }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#22202a]">
      <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">{title}</h3>
      <div className="flex items-center gap-2">
        <button type="button" className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors" aria-label="Filter">
          <Filter className="w-3.5 h-3.5" />
        </button>
        <button type="button" className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors" aria-label="Export">
          <Download className="w-3.5 h-3.5" />
        </button>
        {onAdd && (
          <button 
            onClick={onAdd}
            type="button" 
            className="ml-2 px-3 py-1.5 rounded bg-[#ff7a45] text-zinc-950 text-xs font-bold font-mono tracking-wider uppercase hover:bg-[#ff8b5a] transition-all cyber-notched-btn"
          >
            + ADD NEW SKU
          </button>
        )}
      </div>
    </div>
  );
}

export function StatusPill({ label, variant }) {
  let baseStyle = "px-2.5 py-0.5 border text-[9px] font-bold tracking-widest rounded-sm font-mono uppercase inline-block shrink-0";
  let statusStyle = "";
  
  if (variant === 'ok' || variant === 'done' || variant === 'validated' || variant === 'received') {
    statusStyle = "bg-[#182a20] text-[#58c38a] border-[#224430]";
  } else if (variant === 'warning' || variant === 'ready' || variant === 'confirmed' || variant === 'in_transit') {
    statusStyle = "bg-[#2c201a] text-[#ffa07a] border-[#443026]";
  } else if (variant === 'alert' || variant === 'cancelled' || variant === 'critical' || variant === 'out') {
    statusStyle = "bg-[#251616] text-[#e85a5a] border-[#421d1d]";
  } else {
    statusStyle = "bg-zinc-900/80 text-zinc-400 border-zinc-800";
  }

  let cleanLabel = label;
  if (variant === 'ok') cleanLabel = "IN STOCK";
  if (variant === 'warning') cleanLabel = "LOW STOCK";
  if (variant === 'alert') cleanLabel = "OUT OF STOCK";

  return (
    <span className={`${baseStyle} ${statusStyle}`}>
      {cleanLabel}
    </span>
  );
}

export function SegmentedStockBar({ stock, maxStock, unit = '', status }) {
  const totalSegments = 10;
  // Compute filled segments
  const filledCount = Math.max(0, Math.min(totalSegments, Math.round((stock / maxStock) * totalSegments)));
  
  let activeClass = 'segmented-bar__segment--active';
  if (status === 'alert' || stock === 0) {
    activeClass = 'segmented-bar__segment--active-red';
  } else if (status === 'warning') {
    activeClass = 'segmented-bar__segment--active'; // warning is glowing orange
  } else {
    activeClass = 'segmented-bar__segment--active'; // ok is glowing orange
  }

  return (
    <div className="flex items-center gap-3 w-full max-w-[220px]">
      <div className="segmented-bar flex-1">
        {Array.from({ length: totalSegments }).map((_, i) => {
          const isFilled = i < filledCount && stock > 0;
          return (
            <span
              key={i}
              className={`segmented-bar__segment ${isFilled ? activeClass : ''}`}
              style={{ height: '4px' }}
            />
          );
        })}
      </div>
      <span className="font-mono text-[10px] text-zinc-400 shrink-0 min-w-[75px] text-right">
        {stock.toLocaleString()}{unit} <span className="opacity-30">/</span> {maxStock.toLocaleString()}{unit}
      </span>
    </div>
  );
}

export function DataTable({ columns, rows, rowKey, onRowClick, selectedKey }) {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-sm min-w-[640px] border-collapse">
        <thead>
          <tr
            className="border-b border-[#22202a] text-xs font-mono tracking-wider font-bold"
            style={{ color: 'var(--text-muted)' }}
          >
            {columns.map((col) => (
              <th key={col.key} className="text-left py-3 px-5 uppercase text-[10px] tracking-widest text-[#ff9e7d]/70">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isSelected = selectedKey && row[rowKey] === selectedKey;
            return (
              <tr
                key={row[rowKey]}
                onClick={() => onRowClick && onRowClick(row)}
                className={`border-b border-[#1b1a20] last:border-0 transition-colors cursor-pointer ${
                  isSelected ? 'bg-zinc-900' : 'hover:bg-zinc-900/40'
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-5 text-zinc-300 font-sans align-middle" style={col.style}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
