import React, { useState, useEffect } from 'react';

const getRandomPastelColor = () => {
  const r = Math.floor(Math.random() * 127 + 127);
  const g = Math.floor(Math.random() * 127 + 127);
  const b = Math.floor(Math.random() * 127 + 127);
  return `rgb(${r}, ${g}, ${b})`;
};

const getRandomPastelGradient = () => {
  const color1 = getRandomPastelColor();
  const color2 = getRandomPastelColor();
  return `linear-gradient(45deg, ${color1}, ${color2})`;
};

const DEFAULT_SIZE = 3;

const TokenImage = ({
  tokenImage,
  size = DEFAULT_SIZE,
}: {
  tokenImage?: string | null;
  size?: number;
}) => {
  const sizeString = `${size}rem`;

  // Use useState to store the gradient and generate it only once
  const [gradientStyle] = useState(() => ({
    background: getRandomPastelGradient(),
    width: sizeString, // equivalent to w-12 in Tailwind CSS
    height: sizeString, // equivalent to h-12 in Tailwind CSS
    borderRadius: '50%', // equivalent to rounded-full in Tailwind CSS
    objectFit: 'cover' as const, // equivalent to object-cover in Tailwind CSS
  }));

  useEffect(() => {
    // No need to update the gradient on re-renders
  }, []);

  return (
    <>
      {tokenImage ? (
        <img
          className="rounded-full object-cover"
          src={tokenImage}
          style={{
            width: sizeString,
            height: sizeString,
          }}
          alt="Token"
        />
      ) : (
        <div style={gradientStyle}></div>
      )}
    </>
  );
};

export default TokenImage;
