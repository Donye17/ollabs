import React, { useState, useCallback } from 'react';
import { Editor } from './components/Editor';
import { FrameSelector } from './components/FrameSelector';
import { FrameCustomizer } from './components/FrameCustomizer';
import { ContactPreview } from './components/ContactPreview';
import { NavBar } from './components/NavBar';
import { AVAILABLE_FRAMES } from './constants';
import { FrameConfig } from './types';
import { UserCircle2, Sparkles, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  // History State Management
  const [history, setHistory] = useState<FrameConfig[]>([AVAILABLE_FRAMES[2]]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const selectedFrame = history[historyIndex];

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  // Updated to accept File object directly for DnD support
  const handleImageSelect = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setImageSrc(null);
    setPreviewDataUrl(null);
  };

  // Add new state to history
  const addToHistory = (newFrame: FrameConfig) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newFrame);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  // When a preset is selected, overwrite history path
  const handlePresetSelect = (frame: FrameConfig) => {
    addToHistory(frame);
  };

  // When customizing, update specific fields and add to history
  const handleFrameUpdate = (updatedFrame: FrameConfig) => {
    addToHistory(updatedFrame);
  };

  // Update the preview image data
  const handlePreviewUpdate = useCallback((dataUrl: string) => {
    setPreviewDataUrl(dataUrl);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-blue-500/30">
      <NavBar />

      <main className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

          {/* Left Column: Editor & Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <Editor
              imageSrc={imageSrc}
              onImageSelect={handleImageSelect}
              selectedFrame={selectedFrame}
              onReset={handleReset}
              onPreviewUpdate={handlePreviewUpdate}
            />

            <div className="mt-8 p-4 bg-slate-800/30 rounded-lg border border-slate-800 text-sm text-slate-400 max-w-md">
              <div className="flex gap-3">
                <AlertCircle className="shrink-0 text-blue-400" size={20} />
                <p>
                  Drag & Drop a photo or use the upload button. Pinch to zoom. The final image will be a high-resolution square.
                </p>
              </div>
            </div>

            {/* Mobile Preview (Hidden on Desktop, shown on Mobile below editor) */}
            <div className="lg:hidden w-full mt-12 border-t border-slate-800 pt-8">
              <ContactPreview previewSrc={previewDataUrl} />
            </div>
          </div>

          {/* Right Column: Controls & Desktop Preview */}
          <div className="lg:col-span-5 space-y-8">

            {/* 1. Desktop Preview (Only visible on large screens) */}
            <div className="hidden lg:block">
              <ContactPreview previewSrc={previewDataUrl} />
            </div>

            {/* 2. Controls */}
            <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50 backdrop-blur-sm sticky top-24">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full bg-blue-500 block"></span>
                  Frame Presets
                </h2>
                <p className="text-slate-400 text-sm">Select a base style then customize it below.</p>
              </div>

              <FrameSelector
                selectedFrameId={selectedFrame.id}
                onSelect={handlePresetSelect}
              />

              <div className="my-6 border-t border-slate-700/50"></div>

              <FrameCustomizer
                frame={selectedFrame}
                onChange={handleFrameUpdate}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
              />

              {!imageSrc && (
                <div className="mt-6 p-4 bg-blue-500/10 rounded-xl text-center border border-blue-500/20">
                  <p className="text-blue-200 text-sm">Upload a photo to see the live preview.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <footer className="py-8 text-center text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Ollabs. All processing happens locally on your device.</p>
      </footer>
    </div>
  );
};

export default App;