import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { key: 'all',     label: 'All',          emoji: '✨' },
  { key: 'drinks',  label: 'Bobba Drinks', emoji: '🧋' },
  { key: 'bingsu',  label: 'Bingsu',       emoji: '🍧' },
  { key: 'food',    label: 'Food',         emoji: '🥟' },
  { key: 'cafe',    label: 'Cafe Vibes',   emoji: '☕' },
];

const IMAGES = [
  ...Array.from({ length: 8 },  (_, i) => ({ id: `d${i}`,  cat: 'drinks', seed: `bobba-drink-${i}` })),
  ...Array.from({ length: 6 },  (_, i) => ({ id: `b${i}`,  cat: 'bingsu', seed: `bobba-bingsu-${i}` })),
  ...Array.from({ length: 7 },  (_, i) => ({ id: `f${i}`,  cat: 'food',   seed: `bobba-food-${i}` })),
  ...Array.from({ length: 5 },  (_, i) => ({ id: `c${i}`,  cat: 'cafe',   seed: `bobba-cafe-${i}` })),
];

const GalleryPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightbox, setLightbox]         = useState<number | null>(null);

  const filtered = useMemo(() =>
    activeFilter === 'all' ? IMAGES : IMAGES.filter(img => img.cat === activeFilter),
  [activeFilter]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox(i => (i === null ? null : Math.max(0, i - 1)));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox(i => (i === null ? null : Math.min(filtered.length - 1, i + 1)));
  };

  return (
    <div className="min-h-screen pt-24 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">
            Our{' '}
            <span className="bg-bubble-gradient bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          <p className="text-text-secondary text-lg">
            A visual feast of everything we craft 📸
          </p>
        </motion.div>

        {/* Filter pills */}
        <div className="flex gap-2 justify-center flex-wrap mb-10">
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold border
                transition-all duration-200
                ${activeFilter === cat.key
                  ? 'bg-primary text-white border-primary shadow-brand'
                  : 'bg-card text-text-secondary border-white/10 hover:border-primary/40 hover:text-white'
                }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Masonry grid */}
        <motion.div
          layout
          className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3"
        >
          <AnimatePresence>
            {filtered.map((img, i) => (
              <motion.button
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className="w-full overflow-hidden rounded-2xl block break-inside-avoid cursor-zoom-in
                  border border-white/10 hover:border-primary/40 transition-colors group"
                onClick={() => setLightbox(i)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${img.seed}/600/600`}
                    alt={`Gallery ${i + 1}`}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                    transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-3xl">🔍</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Count */}
        <p className="text-center text-text-secondary text-sm mt-8">
          Showing {filtered.length} photos
        </p>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center
                justify-center text-white text-xl hover:bg-white/20 transition-colors z-10"
              onClick={() => setLightbox(null)}
            >
              ×
            </button>

            {/* Prev */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10
                flex items-center justify-center text-white text-2xl hover:bg-white/20 transition-colors
                disabled:opacity-30 z-10"
              onClick={handlePrev}
              disabled={lightbox === 0}
            >
              ‹
            </button>

            {/* Image */}
            <motion.img
              key={lightbox}
              src={`https://picsum.photos/seed/${filtered[lightbox]?.seed}/1200/900`}
              alt="Gallery"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={e => e.stopPropagation()}
            />

            {/* Next */}
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10
                flex items-center justify-center text-white text-2xl hover:bg-white/20 transition-colors
                disabled:opacity-30 z-10"
              onClick={handleNext}
              disabled={lightbox === filtered.length - 1}
            >
              ›
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm
              rounded-full px-4 py-1.5 text-white text-sm font-semibold">
              {lightbox + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;