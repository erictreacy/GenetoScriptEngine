'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

export default function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create portal root if it doesn't exist
    let root = document.getElementById('portal-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'portal-root';
      document.body.appendChild(root);
    }
    setPortalRoot(root);
    setMounted(true);

    // Prevent scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
      if (root && root.childNodes.length === 0) {
        document.body.removeChild(root);
      }
    };
  }, []);

  if (!mounted || !portalRoot) return null;

  return createPortal(children, portalRoot);
}
