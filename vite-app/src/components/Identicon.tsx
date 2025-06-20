import { useRef, useEffect } from 'react';

interface IdenticonProps {
  size?: number;    // size of the canvas, e.g. 250  
  grid?: number;    // number of squares per side, e.g. 5
  color?: string;   // fill color, e.g. 'hsl(123,70%,50%)'
}

export default function Identicon({
  size = 250,
  grid = 5,
  color = `hsl(${Math.random() * 360},70%,50%)`,
}: IdenticonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const cell = size / grid;
    ctx.clearRect(0, 0, size, size);

    // build half-mask and mirror
    const half = Math.ceil(grid / 2);
    const mask: boolean[][] = Array.from({ length: grid }, () =>
      Array(grid).fill(false)
    );

    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < half; x++) {
        const bit = Math.random() < 0.5;
        mask[y][x] = bit;
        mask[y][grid - 1 - x] = bit;
      }
    }

    // draw squares
    ctx.fillStyle = color;
    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid; x++) {
        if (mask[y][x]) {
          ctx.fillRect(x * cell, y * cell, cell, cell);
        }
      }
    }
  }, [size, grid, color]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
    />
  );
}
