import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
    hero: 'w-20 h-20 md:w-24 md:h-24',
  }[size];

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    hero: 'text-4xl md:text-5xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* BinSync Icon: Bin outline with looped pin & checkmark */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconDimensions}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Bin top handle */}
          <path
            d="M38 18C38 15.7909 39.7909 14 42 14H58C60.2091 14 62 15.7909 62 18V22H38V18Z"
            stroke="#059669"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Bin lid rim */}
          <rect
            x="24"
            y="22"
            width="52"
            height="8"
            rx="4"
            fill="#059669"
          />
          {/* Bin can body */}
          <path
            d="M28 32L32.5 82C32.9 86.4 36.5 89.8 40.9 89.8H59.1C63.5 89.8 67.1 86.4 67.5 82L72 32"
            stroke="#059669"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Infinity / Sync Loop Front Overlay */}
          {/* Left loop: Green with Location Pin */}
          <path
            d="M50 56C42 43 24 44 24 58C24 70 42 71 50 58C58 45 76 46 76 58C76 70 58 71 50 58Z"
            stroke="url(#binsync-gradient)"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Left pin icon */}
          <circle cx="36" cy="56" r="3.5" fill="#047857" />
          <path
            d="M36 50C33.8 50 32 51.8 32 54C32 57 36 62 36 62C36 62 40 57 40 54C40 51.8 38.2 50 36 50Z"
            fill="#059669"
          />
          <circle cx="36" cy="54" r="1.5" fill="#FFFFFF" />

          {/* Right checkmark */}
          <path
            d="M60 57L64 61L71 52"
            stroke="#0284C7"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <defs>
            <linearGradient
              id="binsync-gradient"
              x1="22"
              y1="46"
              x2="78"
              y2="68"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#059669" />
              <stop offset="0.5" stopColor="#0D9488" />
              <stop offset="1" stopColor="#0284C7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex items-baseline font-bold tracking-tight">
          <span className={`text-[#059669] ${textSizes}`}>Bin</span>
          <span className={`text-[#0284C7] ${textSizes}`}>Sync</span>
        </div>
      )}
    </div>
  );
};
