import React from 'react';

interface SchoolLogoProps {
  className?: string;
  size?: number | string;
  alt?: string;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  className = 'h-10 w-auto',
  size,
  alt = 'JNSD Education Centre Crest',
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <img
      src="/school-logo-exact.png"
      alt={alt}
      className={`${className} object-contain`}
      style={style}
      loading="eager"
    />
  );
};
