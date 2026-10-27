import React from 'react';

interface SchoolLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'full' | 'shield-only';
  alt?: string;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  className = 'w-10 h-10',
  size,
  variant = 'full',
  alt = 'JNSD Education Centre Crest',
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={className}
      style={style}
      role="img"
      aria-label={alt}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="crestShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0b2847" />
          <stop offset="50%" stopColor="#06243e" />
          <stop offset="100%" stopColor="#031627" />
        </linearGradient>

        <linearGradient id="crestGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fce79a" />
          <stop offset="45%" stopColor="#e5b95a" />
          <stop offset="100%" stopColor="#c99732" />
        </linearGradient>

        <linearGradient id="crestFlameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="35%" stopColor="#f59e0b" />
          <stop offset="70%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#fffbeb" />
        </linearGradient>

        <linearGradient id="crestFlameCore" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>

        <linearGradient id="crestLaurelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="50%" stopColor="#d99b26" />
          <stop offset="100%" stopColor="#92620f" />
        </linearGradient>

        <filter id="crestShadowFilter" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Left Laurel Wreath */}
      <g id="left-laurel" filter="url(#crestShadowFilter)">
        <path d="M 125,410 C 95,350 75,260 92,160" fill="none" stroke="url(#crestLaurelGrad)" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 88,160 C 70,150 60,135 68,125 C 80,128 88,142 88,160 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 94,165 C 105,150 115,142 122,148 C 120,160 110,168 94,165 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 82,198 C 62,190 52,175 60,165 C 72,168 82,180 82,198 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 87,204 C 100,188 112,180 118,188 C 115,200 102,208 87,204 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 78,240 C 56,234 46,220 54,208 C 66,212 76,224 78,240 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 84,248 C 98,230 110,222 116,230 C 112,242 100,250 84,248 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 78,285 C 54,280 44,265 52,252 C 64,256 76,268 78,285 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 84,292 C 100,275 112,268 118,276 C 114,288 100,296 84,292 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 83,330 C 60,328 50,312 58,300 C 70,304 80,315 83,330 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 90,338 C 106,322 118,315 124,324 C 118,335 106,342 90,338 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 95,372 C 72,372 62,358 70,345 C 82,348 92,360 95,372 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 103,378 C 118,364 130,358 136,368 C 128,378 116,384 103,378 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 112,410 C 90,412 80,400 88,388 C 100,390 108,400 112,410 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 122,414 C 136,402 148,398 152,408 C 144,418 134,422 122,414 Z" fill="url(#crestLaurelGrad)" />
      </g>

      {/* Right Laurel Wreath */}
      <g id="right-laurel" filter="url(#crestShadowFilter)">
        <path d="M 387,410 C 417,350 437,260 420,160" fill="none" stroke="url(#crestLaurelGrad)" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 424,160 C 442,150 452,135 444,125 C 432,128 424,142 424,160 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 418,165 C 407,150 397,142 390,148 C 392,160 402,168 418,165 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 430,198 C 450,190 460,175 452,165 C 440,168 430,180 430,198 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 425,204 C 412,188 400,180 394,188 C 397,200 410,208 425,204 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 434,240 C 456,234 466,220 458,208 C 446,212 436,224 434,240 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 428,248 C 414,230 402,222 396,230 C 400,242 412,250 428,248 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 434,285 C 458,280 468,265 460,252 C 448,256 436,268 434,285 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 428,292 C 412,275 400,268 394,276 C 398,288 412,296 428,292 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 429,330 C 452,328 462,312 454,300 C 442,304 432,315 429,330 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 422,338 C 406,322 394,315 388,324 C 394,335 406,342 422,338 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 417,372 C 440,372 450,358 442,345 C 430,348 420,360 417,372 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 409,378 C 394,364 382,358 376,368 C 384,378 396,384 409,378 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 400,410 C 422,412 432,400 424,388 C 412,390 404,400 400,410 Z" fill="url(#crestLaurelGrad)" />
        <path d="M 390,414 C 376,402 364,398 360,408 C 368,418 378,422 390,414 Z" fill="url(#crestLaurelGrad)" />
      </g>

      {/* Main Shield */}
      <g id="shield-body" filter="url(#crestShadowFilter)">
        {/* Outer Shield Outline */}
        <path
          d="M 256,54 C 334,54 394,68 394,124 C 394,272 342,382 256,432 C 170,382 118,272 118,124 C 118,68 178,54 256,54 Z"
          fill="url(#crestShieldGrad)"
          stroke="url(#crestGoldGrad)"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Inner Shield Accent Inset */}
        <path
          d="M 256,68 C 324,68 378,80 378,130 C 378,262 330,364 256,412 C 182,364 134,262 134,130 C 134,80 188,68 256,68 Z"
          fill="none"
          stroke="url(#crestGoldGrad)"
          strokeWidth="2.5"
          strokeDasharray="8 4"
          opacity="0.85"
        />

        {/* Sacred Flame (Akhand Jyoti) */}
        <path
          d="M 256,104 C 278,142 302,176 290,208 C 280,232 262,242 256,242 C 250,242 232,232 222,208 C 210,176 234,142 256,104 Z"
          fill="url(#crestFlameGrad)"
        />
        <path
          d="M 256,138 C 268,166 280,188 274,212 C 268,228 258,234 256,234 C 254,234 244,228 238,212 C 232,188 244,166 256,138 Z"
          fill="url(#crestFlameCore)"
        />

        {/* Open Book of Knowledge (Vidya) */}
        <g id="book-element" transform="translate(0, 10)">
          <path d="M 256,334 L 256,366" stroke="#c99732" strokeWidth="4" strokeLinecap="round" />

          {/* Book 3D Stack */}
          <path
            d="M 166,334 C 196,324 232,326 256,338 C 280,326 316,324 346,334 L 346,344 C 316,334 280,336 256,348 C 232,336 196,334 166,344 Z"
            fill="#a1751d"
            opacity="0.9"
          />

          {/* Left Page */}
          <path
            d="M 256,252 C 226,240 184,242 162,254 L 162,328 C 188,316 228,316 256,330 Z"
            fill="#fffbeb"
            stroke="url(#crestGoldGrad)"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Right Page */}
          <path
            d="M 256,252 C 286,240 328,242 350,254 L 350,328 C 324,316 284,316 256,330 Z"
            fill="#fffbeb"
            stroke="url(#crestGoldGrad)"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Page Lines */}
          <line x1="178" y1="270" x2="242" y2="264" stroke="#c99732" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
          <line x1="178" y1="284" x2="242" y2="278" stroke="#c99732" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
          <line x1="178" y1="298" x2="242" y2="292" stroke="#c99732" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
          <line x1="190" y1="312" x2="242" y2="306" stroke="#c99732" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />

          <line x1="270" y1="264" x2="334" y2="270" stroke="#c99732" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
          <line x1="270" y1="278" x2="334" y2="284" stroke="#c99732" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
          <line x1="270" y1="292" x2="334" y2="298" stroke="#c99732" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
          <line x1="270" y1="306" x2="322" y2="312" stroke="#c99732" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />

          {/* Spine */}
          <line x1="256" y1="250" x2="256" y2="332" stroke="#855b0a" strokeWidth="2.5" />
        </g>

        {/* Star */}
        <path
          d="M 256,386 L 260,396 L 271,397 L 262,404 L 265,414 L 256,408 L 247,414 L 250,404 L 241,397 L 252,396 Z"
          fill="url(#crestGoldGrad)"
          stroke="#855b0a"
          strokeWidth="0.8"
        />
      </g>

      {/* Bottom Classical Ribbon Banner */}
      {variant === 'full' && (
        <g id="ribbon" filter="url(#crestShadowFilter)">
          <path d="M 95,444 L 140,432 L 140,464 L 95,476 L 115,460 Z" fill="#031627" stroke="url(#crestGoldGrad)" strokeWidth="2" />
          <path d="M 417,444 L 372,432 L 372,464 L 417,476 L 397,460 Z" fill="#031627" stroke="url(#crestGoldGrad)" strokeWidth="2" />

          <path d="M 125,448 L 145,434 L 145,462 Z" fill="#020e1a" />
          <path d="M 387,448 L 367,434 L 367,462 Z" fill="#020e1a" />

          <path
            d="M 132,442 C 192,428 320,428 380,442 L 374,476 C 316,462 196,462 138,476 Z"
            fill="url(#crestShieldGrad)"
            stroke="url(#crestGoldGrad)"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          <path d="M 142,448 C 198,436 314,436 370,448" fill="none" stroke="url(#crestGoldGrad)" strokeWidth="1.2" opacity="0.8" />
          <path d="M 146,470 C 200,458 312,458 366,470" fill="none" stroke="url(#crestGoldGrad)" strokeWidth="1.2" opacity="0.8" />

          <text
            x="256"
            y="460"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="'Cinzel', 'Trajan Pro', 'Georgia', 'Times New Roman', serif"
            fontSize="14.5"
            fontWeight="800"
            letterSpacing="2.8"
            fill="url(#crestGoldGrad)"
          >
            JNSD EDUCATION CENTRE
          </text>
        </g>
      )}
    </svg>
  );
};
