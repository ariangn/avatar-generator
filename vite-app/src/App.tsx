import { useState, useEffect } from 'react';
import Identicon from './components/Identicon';

function randomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue},70%,50%)`;
}

function App() {
  const [grid, setGrid] = useState<number>(5);
  const [color, setColor] = useState<string>(randomColor());
  const [downloadSize, setDownloadSize] = useState<number>(250);

  const regenerate = () => {
    setColor(randomColor());
  };

  useEffect(() => {
    if (downloadSize < grid) {
      setDownloadSize(grid);
    }
  }, [grid]);

  const download = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    // create an offscreen canvas at the user’s desired size
    const dst = document.createElement('canvas');
    dst.width = downloadSize;
    dst.height = downloadSize;
    const dctx = dst.getContext('2d');
    if (!dctx) return;
    dctx.drawImage(
      canvas as HTMLCanvasElement,
      0, 0, canvas.width, canvas.height,
      0, 0, dst.width, dst.height
    );

    // export the offscreen canvas
     dst.toBlob(blob => {
      if (!blob) return;
      const link = document.createElement('a');
      link.download = `identicon-${downloadSize}px.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-start p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">avatar generator</h1>

      <div className="w-full flex justify-center">
        <Identicon size={250} grid={grid} color={color} />
      </div>

      <div className="mt-6 w-full flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-xl px-4">
          <label className="flex items-center gap-2">
            Grid size:
            <input
              type="number"
              min={3}
              max={20}
              value={grid}
              onChange={e => {
                const v = Math.max(3, Math.min(20, +e.target.value));
                setGrid(v);
              }}
              className="w-20 border p-1 rounded"
            />
          </label>

          <label className="flex items-center gap-2">
            PNG export size:
            <input
              type="number"
              min={grid}
              max={1000}
              value={downloadSize}
              onChange={e => {
                const value = +e.target.value;
                setDownloadSize(Math.max(grid, value));
              }}
              className="w-24 border p-1 rounded"
            />
            px
          </label>
        </div>

        <div className="flex justify-center gap-4 w-full max-w-xl px-4">
          <button
            onClick={regenerate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full sm:w-auto"
          >
            Generate
          </button>

          <button
            onClick={download}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full sm:w-auto"
          >
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );

}

export default App;
