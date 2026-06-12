"use client";

import React, { useState, useEffect, useRef } from "react";
import { RotateCw, Play, Pause, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import productsData from "../data/products.json";

interface Viewer360Props {
  productId: string;
  productName: string;
  isModal?: boolean;
}

export const Viewer360: React.FC<Viewer360Props> = ({ productId, productName, isModal = false }) => {
  const { t } = useApp();

  // Find product configurations
  const product = productsData.find((p) => p.id === productId);
  const images360 = product?.images360;
  const totalFrames = images360?.count ?? 8;

  const [currentFrame, setCurrentFrame] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const startX = useRef(0);
  const playInterval = useRef<NodeJS.Timeout | null>(null);
  const dragThreshold = 15; // Pixels required to switch to the next frame

  // Handle auto-rotation play/pause
  useEffect(() => {
    if (isPlaying) {
      playInterval.current = setInterval(() => {
        setCurrentFrame((prev) => (prev % totalFrames) + 1);
      }, 180);
    } else {
      if (playInterval.current) {
        clearInterval(playInterval.current);
      }
    }

    return () => {
      if (playInterval.current) {
        clearInterval(playInterval.current);
      }
    };
  }, [isPlaying, totalFrames]);

  // Drag start
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setIsPlaying(false); // Stop auto-play on interaction
    startX.current = clientX;
  };

  // Drag moving
  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;

    const diffX = clientX - startX.current;

    if (Math.abs(diffX) > dragThreshold) {
      if (diffX > 0) {
        // Dragged right -> Rotate counter-clockwise (previous frame)
        setCurrentFrame((prev) => (prev === 1 ? totalFrames : prev - 1));
      } else {
        // Dragged left -> Rotate clockwise (next frame)
        setCurrentFrame((prev) => (prev === totalFrames ? 1 : prev + 1));
      }
      startX.current = clientX; // Reset start point for relative continuous dragging
    }
  };

  // Drag end
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Mouse event handlers
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    handleDragMove(e.clientX);
  };

  // Touch event handlers for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleDragStart(e.touches[0].clientX);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleDragMove(e.touches[0].clientX);
    }
  };

  // Manual step buttons
  const stepPrev = () => {
    setIsPlaying(false);
    setCurrentFrame((prev) => (prev === 1 ? totalFrames : prev - 1));
  };

  const stepNext = () => {
    setIsPlaying(false);
    setCurrentFrame((prev) => (prev === totalFrames ? 1 : prev + 1));
  };

  // Image source path
  const isZeroIndexed = images360?.zeroIndexed ?? false;
  const frameIndex = isZeroIndexed ? currentFrame - 1 : currentFrame;
  const frameStr = images360?.padZeroes
    ? frameIndex.toString().padStart(images360.padZeroes, "0")
    : frameIndex.toString();
  const imageSrc = images360?.path
    ? `${images360.path}${frameStr}.${images360.ext || "jpg"}`
    : `/images/product-${productId}-360-${currentFrame}.svg`;

  return (
    <div className={`flex flex-col items-center w-full ${isModal ? "mt-6 md:mt-8" : ""}`}>
      {/* 360 Viewer Canvas Container */}
      <div
        className={`relative w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center select-none ${
          isModal 
            ? "max-h-[60vh] sm:max-h-[65vh] aspect-square w-auto h-auto max-w-full" 
            : "aspect-square max-w-lg"
        } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={handleDragEnd}
      >
        {/* The 360 view frame image */}
        <img
          src={imageSrc}
          alt={`${productName} 360 view - frame ${currentFrame}`}
          className="w-full h-full object-contain pointer-events-none"
        />

        {/* 360 Badge Overlay */}
        {!isModal && (
          <div className="absolute top-4 left-4 bg-slate-900/75 dark:bg-slate-950/75 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider py-1.5 px-3 rounded-full flex items-center gap-1.5 pointer-events-none">
            <RotateCw className="h-3 w-3 animate-spin-slow" />
            <span>360° INTERACTIVE</span>
          </div>
        )}

        {/* Help tooltip overlay */}
        {!isModal && (
          <div className="absolute bottom-4 right-4 bg-slate-950/40 hover:bg-slate-950/70 text-white rounded-full p-1.5 transition-colors pointer-events-none">
            <HelpCircle className="h-4 w-4" />
          </div>
        )}

        {/* Manual Arrow Buttons Overlay */}
        {!isModal && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                stepPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md text-slate-800 dark:text-slate-100 hover:scale-105 transition-all"
              aria-label="Frame anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                stepNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md text-slate-800 dark:text-slate-100 hover:scale-105 transition-all"
              aria-label="Próximo frame"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Control Panel / Play Button */}
      {isModal ? (
        <div className="mt-4 md:mt-6 flex justify-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-650 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/20 active:scale-95 hover:scale-105 transition-all cursor-pointer border-2 border-white dark:border-slate-900"
            title={isPlaying ? "Pausar" : "Iniciar Rotação"}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 fill-current" />
            ) : (
              <Play className="h-6 w-6 fill-current ml-1" />
            )}
          </button>
        </div>
      ) : (
        <>
          <div className="mt-4 flex items-center space-x-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-full shadow-sm">
            <button
              onClick={stepPrev}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Girar para a Esquerda"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isPlaying
                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-current" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>AUTO PLAY</span>
                </>
              )}
            </button>

            <button
              onClick={stepNext}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Girar para a Direita"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 border-l border-slate-200 dark:border-slate-800 pl-3">
              FRAME {currentFrame}/{totalFrames}
            </span>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-center">
            {t("view360")}
          </p>
        </>
      )}
    </div>
  );
};
