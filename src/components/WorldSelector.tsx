'use client';

import { motion } from 'framer-motion';
import { WORLDS, WORLD_ORDER, type WorldId } from '@/data/worlds';

interface WorldSelectorProps {
  currentWorld: WorldId;
  onSelectWorld: (worldId: WorldId) => void;
  isTransitioning: boolean;
}

export default function WorldSelector({ currentWorld, onSelectWorld, isTransitioning }: WorldSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
      {WORLD_ORDER.map((worldId) => {
        const world = WORLDS[worldId];
        const isActive = currentWorld === worldId;

        return (
          <button
            key={worldId}
            onClick={() => !isTransitioning && onSelectWorld(worldId)}
            disabled={isTransitioning}
            className={`relative px-4 py-2.5 md:px-6 md:py-3 rounded-full transition-all duration-500 ${
              isTransitioning ? 'cursor-wait' : 'cursor-pointer'
            } ${
              isActive
                ? 'bg-white/10 backdrop-blur-sm'
                : 'bg-white/[0.03] hover:bg-white/[0.07] backdrop-blur-sm'
            }`}
            style={{
              border: isActive ? `1px solid ${world.accentColor}50` : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center gap-2.5">
              {/* Active indicator */}
              <span
                className={`inline-block w-2 h-2 rounded-full transition-all duration-500 ${
                  isActive ? 'scale-100' : 'scale-50 opacity-40'
                }`}
                style={{ backgroundColor: world.accentColor }}
              />

              {/* World name */}
              <span
                className={`text-[11px] md:text-[12px] tracking-[0.15em] uppercase transition-colors duration-500 ${
                  isActive ? 'text-foreground' : 'text-ash'
                }`}
                style={{ fontFamily: 'var(--font-heading)', fontWeight: isActive ? 600 : 400 }}
              >
                {world.name}
              </span>
            </div>

            {/* Active underline */}
            {isActive && (
              <motion.div
                layoutId="worldIndicator"
                className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full"
                style={{ backgroundColor: world.accentColor }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
