import React from 'react';

interface SchoolLogoProps {
  className?: string;
  size?: number | string;
  alt?: string;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  className = 'w-10 h-10',
  size,
  alt = 'JNSD Education Centre Crest',
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <img
      src="/school-logo.png"
      alt={alt}
      className={`${className} object-contain`}
      style={style}
      loading="eager"
    />
  );
};
