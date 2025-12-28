/**
 * Segment Component
 * Represents a single colored liquid segment in a tube
 */

import type { Segment as SegmentType } from '../core/types';

interface SegmentProps {
  segment: SegmentType;
  position: number; // 0 = bottom, 3 = top (reserved for future animations)
}

export const Segment = ({ segment }: SegmentProps) => {
  return (
    <div
      className="h-12 w-full relative rounded-md overflow-hidden"
      style={{
        backgroundColor: segment.color,
        boxShadow: `
          inset 0 2px 6px rgba(255, 255, 255, 0.4),
          inset 0 -2px 6px rgba(0, 0, 0, 0.25),
          0 2px 4px rgba(0, 0, 0, 0.15)
        `,
        minHeight: '48px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
      }}
    >
      {/* Glossy liquid shine effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.3) 0%,
              rgba(255, 255, 255, 0.15) 20%,
              transparent 50%,
              rgba(0, 0, 0, 0.05) 80%,
              rgba(0, 0, 0, 0.1) 100%
            )
          `,
        }}
      />

      {/* Highlight spot for extra glossiness */}
      <div
        className="absolute top-1 left-2 w-6 h-3 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent)',
          filter: 'blur(2px)',
        }}
      />
    </div>
  );
};
