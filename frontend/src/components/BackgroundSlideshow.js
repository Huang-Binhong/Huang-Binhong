import React, { useEffect, useMemo, useRef, useState } from 'react';
import './BackgroundSlideshow.css';

function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ ok: true, url });
    img.onerror = () => resolve({ ok: false, url });
    img.src = url;
  });
}

function normalizeImages(images) {
  const list = Array.isArray(images) ? images.filter(Boolean) : [];
  return list.length ? list : [];
}

function BackgroundSlideshow({ images, intervalMs = 5000, fadeMs = 1200 }) {
  const normalized = useMemo(() => normalizeImages(images), [images]);
  const cacheRef = useRef(new Set());
  const timerRef = useRef(null);
  const visibleLayerRef = useRef(0);
  const activeIndexRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [visibleLayer, setVisibleLayer] = useState(0); // 0 or 1
  const [layerUrls, setLayerUrls] = useState(['', '']);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      if (timerRef.current) clearInterval(timerRef.current);

      if (!normalized.length) {
        setReady(false);
        setLayerUrls(['', '']);
        return;
      }

      const urlsToLoad = normalized.filter((u) => !cacheRef.current.has(u));
      const results = await Promise.all(urlsToLoad.map(loadImage));
      results.forEach(({ ok, url }) => {
        if (ok) cacheRef.current.add(url);
      });
      if (cancelled) return;

      const first = normalized[0];
      const nextLayer = 1 - visibleLayerRef.current;
      setLayerUrls((prevUrls) => {
        const updated = [...prevUrls];
        updated[nextLayer] = first;
        return updated;
      });
      requestAnimationFrame(() => {
        visibleLayerRef.current = nextLayer;
        setVisibleLayer(nextLayer);
      });

      activeIndexRef.current = 0;
      setReady(true);
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [normalized]);

  useEffect(() => {
    if (!ready) return;
    if (!normalized.length) return;
    if (normalized.length === 1) return;

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const nextIndex = (activeIndexRef.current + 1) % normalized.length;
      const nextUrl = normalized[nextIndex];
      const nextLayer = 1 - visibleLayerRef.current;

      setLayerUrls((prevUrls) => {
        const updated = [...prevUrls];
        updated[nextLayer] = nextUrl;
        return updated;
      });

      requestAnimationFrame(() => {
        visibleLayerRef.current = nextLayer;
        setVisibleLayer(nextLayer);
      });

      activeIndexRef.current = nextIndex;
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [ready, normalized, intervalMs]);

  const styleVars = {
    '--bg-fade-ms': `${fadeMs}ms`,
  };

  return (
    <div className="bg-slideshow" style={styleVars} aria-hidden="true">
      <div
        className={`bg-slideshow__layer ${visibleLayer === 0 ? 'is-visible' : ''}`}
        style={{ backgroundImage: layerUrls[0] ? `url(${layerUrls[0]})` : undefined }}
      />
      <div
        className={`bg-slideshow__layer ${visibleLayer === 1 ? 'is-visible' : ''}`}
        style={{ backgroundImage: layerUrls[1] ? `url(${layerUrls[1]})` : undefined }}
      />
      <div className="bg-slideshow__wash" />
    </div>
  );
}

export default BackgroundSlideshow;
