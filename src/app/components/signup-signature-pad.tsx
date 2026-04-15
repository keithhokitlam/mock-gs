"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export type SignupSignaturePadHandle = {
  clear: () => void;
  /** PNG data URL, or null if empty */
  toDataURL: () => string | null;
};

type Props = {
  /** Called when the pad transitions between empty and drawn */
  onHasDrawingChange: (hasDrawing: boolean) => void;
};

const STROKE = "#171717";
const BG = "#ffffff";

const SignupSignaturePad = forwardRef<SignupSignaturePadHandle, Props>(
  function SignupSignaturePad({ onHasDrawingChange }, ref) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const drawingRef = useRef(false);
    const hasInkRef = useRef(false);

    const notifyInk = useCallback(() => {
      if (!hasInkRef.current) {
        hasInkRef.current = true;
        onHasDrawingChange(true);
      }
    }, [onHasDrawingChange]);

    const setupCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.strokeStyle = STROKE;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      hasInkRef.current = false;
      onHasDrawingChange(false);
    }, [onHasDrawingChange]);

    useEffect(() => {
      setupCanvas();
    }, [setupCanvas]);

    useImperativeHandle(ref, () => ({
      clear: () => {
        setupCanvas();
      },
      toDataURL: () => {
        const canvas = canvasRef.current;
        if (!canvas || !hasInkRef.current) return null;
        try {
          return canvas.toDataURL("image/png");
        } catch {
          return null;
        }
      },
    }));

    const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current!;
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      drawingRef.current = true;
      const { x, y } = pos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawingRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const { x, y } = pos(e);
      ctx.lineTo(x, y);
      ctx.stroke();
      notifyInk();
    };

    const endStroke = () => {
      drawingRef.current = false;
    };

    return (
      <div className="space-y-2">
        <canvas
          ref={canvasRef}
          className="h-36 w-full touch-none cursor-crosshair rounded-lg border border-zinc-300 bg-white"
          style={{ touchAction: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
          onPointerLeave={endStroke}
          aria-label="Sign with your mouse or finger"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setupCanvas()}
            className="text-xs font-medium text-[#2B6B4A] underline hover:no-underline"
          >
            Clear signature
          </button>
        </div>
      </div>
    );
  }
);

export default SignupSignaturePad;
