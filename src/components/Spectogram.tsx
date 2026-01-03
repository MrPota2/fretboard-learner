import { useRef } from "react";

export function Spectogram({
  stream,
  audioCtx,
}: {
  stream: MediaStream;
  audioCtx: AudioContext;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = canvasRef.current;

  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();

  analyser.fftSize = 2048;

  const bufferLength = analyser.frequencyBinCount;

  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);

  function draw() {
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    const imageData = ctx.getImageData(1, 0, canvas.width - 1, canvas.height);

    ctx.putImageData(imageData, 0, 0); // shift left

    for (let i = 0; i < bufferLength; i++) {
      const value = dataArray[i];

      const percent = value / 255;

      const hue = Math.floor(255 - percent * 255);

      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

      ctx.fillRect(canvas.width - 1, canvas.height - i, 1, 1);
    }
  }

  draw();

  return (
    <div>
      ædda
      <canvas
        id={"spectrogram"}
        ref={canvasRef}
        style={{ maxHeight: "256px", backgroundColor: "antiquewhite" }}
        width={800}
        height={256}
      ></canvas>
    </div>
  );
}
