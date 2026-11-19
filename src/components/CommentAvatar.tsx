import React, {useMemo} from 'react';
import {AvatarConfig, generateUniqueAvatar} from '../utils/avatarGenerator';

interface CommentAvatarProps {
  avatar?: AvatarConfig;
  fallbackSeed: string;
  size?: number;
}

export const CommentAvatar: React.FC<CommentAvatarProps> = ({
  avatar,
  fallbackSeed,
  size = 32,
}) => {
  const cfg = useMemo(
    () => avatar ?? generateUniqueAvatar(fallbackSeed),
    [avatar, fallbackSeed],
  );

  return (
    <div
      style={{width: size, height: size}}
      aria-label="Avatar anónimo"
      title="Usuario anónimo"
      className="rounded-full overflow-hidden shrink-0 ring-1 ring-white/10 shadow-sm"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" fill={cfg.bgColor} />

        {cfg.pattern === 'bauhaus' && (
          <g transform={`rotate(${cfg.rotation} 20 20)`}>
            <circle
              cx={14 + cfg.shiftX * 0.5}
              cy={15 + cfg.shiftY * 0.5}
              r="11"
              fill={cfg.primaryColor}
              fillOpacity="0.9"
            />
            <rect
              x={16 + cfg.shiftX * 0.3}
              y={16 + cfg.shiftY * 0.3}
              width="16"
              height="16"
              rx="3"
              fill={cfg.secondaryColor}
              fillOpacity="0.85"
            />
            <circle cx="28" cy="11" r="4.5" fill={cfg.accentColor} />
          </g>
        )}

        {cfg.pattern === 'rings' && (
          <g transform={`translate(${cfg.shiftX * 0.4}, ${cfg.shiftY * 0.4})`}>
            <circle cx="20" cy="20" r="14" stroke={cfg.primaryColor} strokeWidth="5" />
            <circle
              cx="26"
              cy="14"
              r="7"
              fill={cfg.secondaryColor}
              fillOpacity="0.88"
            />
            <circle cx="14" cy="26" r="4" fill={cfg.accentColor} />
          </g>
        )}

        {cfg.pattern === 'prism' && (
          <g transform={`rotate(${cfg.rotation} 20 20)`}>
            <polygon
              points="20,4 36,33 4,33"
              fill={cfg.primaryColor}
              fillOpacity="0.9"
            />
            <polygon
              points={`20,12 ${32 + cfg.shiftX * 0.3},36 10,30`}
              fill={cfg.secondaryColor}
              fillOpacity="0.8"
            />
            <circle cx="20" cy="22" r="4.5" fill={cfg.accentColor} />
          </g>
        )}

        {cfg.pattern === 'split' && (
          <g transform={`rotate(${cfg.rotation} 20 20)`}>
            <path d="M0 0 H20 V40 H0 Z" fill={cfg.primaryColor} fillOpacity="0.85" />
            <circle
              cx={24 + cfg.shiftX * 0.3}
              cy={20 + cfg.shiftY * 0.3}
              r="11"
              fill={cfg.secondaryColor}
            />
            <rect x="6" y="15" width="10" height="10" rx="5" fill={cfg.accentColor} />
          </g>
        )}

        {cfg.pattern === 'orbit' && (
          <g transform={`rotate(${cfg.rotation} 20 20)`}>
            <ellipse
              cx="20"
              cy="20"
              rx="15"
              ry="7"
              stroke={cfg.primaryColor}
              strokeWidth="3.5"
            />
            <circle cx="20" cy="20" r="7" fill={cfg.secondaryColor} />
            <circle
              cx={31 + cfg.shiftX * 0.2}
              cy={15 + cfg.shiftY * 0.2}
              r="3.5"
              fill={cfg.accentColor}
            />
          </g>
        )}
      </svg>
    </div>
  );
};
