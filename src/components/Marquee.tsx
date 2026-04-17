'use client';

import { ReactNode } from 'react';

export default function Marquee({
  children,
  reverse = false,
  speed = 50,
  className = '',
}: {
  children: ReactNode;
  reverse?: boolean;
  speed?: number;
  className?: string;
}) {
  return (
    <div className={`marquee ${className}`}>
      <div
        className="marquee-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
