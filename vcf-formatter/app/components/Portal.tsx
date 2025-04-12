'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

export default function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, []);

  if (!mounted || typeof window === 'undefined') return null;

  return createPortal(
    children,
    document.body
  );
}
