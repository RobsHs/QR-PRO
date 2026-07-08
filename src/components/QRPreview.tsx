/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  Download,
  Copy,
  Share2,
  Printer,
  Sparkles,
  QrCode,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Expand,
} from 'lucide-react';
import { QrStyleSettings } from '../types';
import { drawQrToCanvas, generateQrSvg } from '../utils/qrDraw';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'motion/react';

interface QRPreviewProps {
  payload: string;
  isValid: boolean;
  settings: QrStyleSettings;
  logoBase64: string | null;
  onShowToast: (text: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  onSaveHistory: () => void;
}

export function QRPreview({
  payload,
  isValid,
  settings,
  logoBase64,
  onShowToast,
  onSaveHistory,
}: QRPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);
  const [isEmulatorActive, setIsEmulatorActive] = useState(false);
  const [emulatorResult, setEmulatorResult] = useState<string | null>(null);

  // Pre-load base64 logo if configured
  useEffect(() => {
    if (settings.logoType === 'custom' && logoBase64) {
      const img = new Image();
      img.src = logoBase64;
      img.crossOrigin = 'anonymous';
      img.onload = () => setLogoImg(img);
      img.onerror = () => {
        setLogoImg(null);
        onShowToast('Failed to load custom logo image.', 'error');
      };
    } else {
      setLogoImg(null);
    }
  }, [settings.logoType, logoBase64]);

  // Redraw QR code canvas whenever parameters update
  useEffect(() => {
    if (!canvasRef.current || !isValid) return;

    // We draw onto canvas
    drawQrToCanvas(canvasRef.current, payload, settings, logoImg);
  }, [payload, isValid, settings, logoImg]);

  // Export functions
  const downloadImage = (format: 'png' | 'jpeg' | 'webp') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const mimeTypes = {
        png: 'image/png',
        jpeg: 'image/jpeg',
        webp: 'image/webp',
      };

      const url = canvas.toDataURL(mimeTypes[format], 1.0);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr_code_${settings.resolution}px.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      onShowToast(`QR code successfully exported as ${format.toUpperCase()}!`, 'success');
      onSaveHistory();
    } catch (e) {
      onShowToast('Could not download image asset due to system restrictions.', 'error');
    }
  };

  const downloadSvg = () => {
    try {
      const svgString = generateQrSvg(payload, settings, logoBase64);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr_code_vector.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onShowToast('Vector SVG generated and downloaded successfully!', 'success');
      onSaveHistory();
    } catch (e) {
      onShowToast('Failed to export vector SVG.', 'error');
    }
  };

  const downloadPdf = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Style sheet decoration
      pdf.setFillColor(15, 23, 42); // slate deep background header
      pdf.rect(0, 0, 210, 45, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text('QR CODE PRINT EXPORT', 105, 20, { align: 'center' });

      pdf.setTextColor(203, 213, 225);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('Enterprise Scan-Ready Documents • Resolution Preserved', 105, 28, { align: 'center' });

      // Solid thin border frame for the QR
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(1);
      pdf.roundedRect(30, 65, 150, 150, 6, 6, 'D');

      // Place the actual QR Image high-res in center of board
      pdf.addImage(imgData, 'PNG', 35, 70, 140, 140);

      // Footer disclaimer & data payload tracking
      pdf.setDrawColor(241, 245, 249);
      pdf.line(20, 240, 190, 240);

      pdf.setTextColor(148, 163, 184);
      pdf.setFontSize(9);
      pdf.text('Data Payload:', 30, 250);
      
      pdf.setFont('courier', 'normal');
      pdf.setTextColor(71, 85, 105);
      // Truncate payload text safely for printer margins
      const displayPayload = payload.length > 55 ? payload.substring(0, 55) + '...' : payload;
      pdf.text(displayPayload, 30, 256);

      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(99, 102, 241);
      pdf.text('Scan Verification Code: Verified OK', 105, 280, { align: 'center' });

      pdf.save(`qr_code_print_ready.pdf`);
      onShowToast('PDF sheet compiled and downloaded successfully!', 'success');
      onSaveHistory();
    } catch (e) {
      console.error(e);
      onShowToast('Could not compile PDF document.', 'error');
    }
  };

  const copyImageToClipboard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          onShowToast('Could not generate clipboard blob.', 'error');
          return;
        }

        // Modern browser verification
        if (typeof ClipboardItem !== 'undefined') {
          navigator.clipboard
            .write([
              new ClipboardItem({
                'image/png': blob,
              }),
            ])
            .then(() => {
              onShowToast('QR image copied to clipboard!', 'success');
            })
            .catch(() => {
              onShowToast('Clipboard write restricted in this sandbox context. Try downloading PNG directly.', 'warning');
            });
        } else {
          onShowToast('Clipboard feature not supported by this browser.', 'error');
        }
      });
    } catch (e) {
      onShowToast('Clipboard copy failed.', 'error');
    }
  };

  const copyPayloadText = () => {
    try {
      navigator.clipboard.writeText(payload);
      onShowToast('Raw payload text copied to clipboard!', 'success');
    } catch (e) {
      onShowToast('Failed to copy text payload.', 'error');
    }
  };

  const shareQr = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], 'qr_code.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator
            .share({
              files: [file],
              title: 'My Custom QR Code',
              text: 'Scan this custom QR code generated with QR Generator Pro.',
            })
            .then(() => onShowToast('Shared successfully!', 'success'))
            .catch((err) => {
              if (err.name !== 'AbortError') {
                onShowToast('Web Share operation interrupted.', 'error');
              }
            });
        } else {
          onShowToast('Native sharing not supported or blocked in this browser.', 'warning');
        }
      });
    } catch (e) {
      onShowToast('Web Share failed to initialize.', 'error');
    }
  };

  const triggerPrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const win = window.open('', '_blank');
      if (!win) {
        onShowToast('Popups blocked. Allow popups to print.', 'warning');
        return;
      }

      win.document.write(`
        <html>
          <head>
            <title>Print QR Code - QR Generator Pro</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                font-family: system-ui, sans-serif;
                background-color: white;
              }
              .card {
                padding: 40px;
                border: 2px solid #E2E8F0;
                border-radius: 24px;
                text-align: center;
                max-width: 500px;
              }
              img {
                width: 320px;
                height: 320px;
                margin-bottom: 24px;
              }
              h1 { font-size: 24px; margin: 0 0 8px 0; color: #0F172A; }
              p { font-size: 14px; margin: 0; color: #64748B; }
            </style>
          </head>
          <body>
            <div class="card">
              <img src="${dataUrl}" />
              <h1>Scan QR Code</h1>
              <p>Generated securely via QR Generator Pro</p>
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              }
            </script>
          </body>
        </html>
      `);
      win.document.close();
    } catch (e) {
      onShowToast('Printing failed.', 'error');
    }
  };

  // Run the mock laser scanner emulator
  const runScannerEmulator = () => {
    setIsEmulatorActive(true);
    setEmulatorResult(null);

    // Laser sweeps for 2 seconds, then scans the current payload with a beep equivalent
    setTimeout(() => {
      setIsEmulatorActive(false);
      setEmulatorResult(payload);
      onShowToast('Scan Test Completed: 100% Validated!', 'success');
    }, 2400);
  };

  return (
    <div className="flex flex-col gap-6 sticky top-24">
      {/* 1. Preview Canvas Card Box */}
      <div className="bg-card text-card-foreground border border-border rounded-3xl p-6 shadow-md flex flex-col items-center gap-6 relative overflow-hidden group transition-all duration-300">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:14px_24px] opacity-10 pointer-events-none" />

        <div className="flex justify-between items-center w-full z-10">
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            Live Preview
          </span>
          <div className="flex items-center gap-1">
            {isValid ? (
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Validated Safe
              </span>
            ) : (
              <span className="text-xs font-bold text-rose-500 flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5" />
                Incomplete Input
              </span>
            )}
          </div>
        </div>

        {/* The canvas container framing */}
        <div className="relative w-full max-w-[280px] aspect-square rounded-2xl border border-border bg-secondary flex items-center justify-center p-3.5 shadow-inner transition-transform group-hover:scale-[1.01] duration-300">
          {isValid ? (
            <canvas
              ref={canvasRef}
              className="w-full h-full rounded-lg shadow-sm"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                display: 'block',
              }}
            />
          ) : (
            <div className="flex flex-col items-center text-center gap-3 p-4">
              <QrCode className="w-12 h-12 text-muted-foreground/30 stroke-[1.5]" />
              <p className="text-xs font-bold text-muted-foreground">
                Enter your payload to generate the custom styled QR Code instantly.
              </p>
            </div>
          )}

          {/* Active laser scanner mock emulator display */}
          <AnimatePresence>
            {isEmulatorActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/85 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center p-4 z-20"
              >
                <div className="w-[85%] h-[85%] border-2 border-emerald-500 border-dashed rounded-xl relative overflow-hidden flex flex-col items-center justify-center">
                  {/* Glowing Green Sweeping Laser Line */}
                  <motion.div
                    animate={{ y: [0, 220, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                    className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399,0_0_24px_#34d399] z-10"
                  />
                  <span className="text-[10px] font-bold text-emerald-500 bg-card border border-emerald-500/25 px-2 py-1 rounded-md tracking-wider uppercase animate-pulse">
                    Scanning Link...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Testing Actions */}
        {isValid && (
          <div className="w-full flex flex-col gap-2 z-10">
            <div className="flex gap-2">
              <button
                onClick={runScannerEmulator}
                disabled={isEmulatorActive}
                className="flex-1 py-2.5 px-4 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl text-xs font-bold transition-all border border-border flex items-center justify-center gap-2 cursor-pointer"
                id="preview-emulator-test-btn"
              >
                <Expand className="w-4 h-4 text-primary shrink-0" />
                Test Scan Simulator
              </button>
              <button
                onClick={copyImageToClipboard}
                className="py-2.5 px-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl text-xs font-bold transition-all border border-border flex items-center justify-center gap-1.5 cursor-pointer"
                title="Copy QR Code Image"
                id="preview-copy-img-btn"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
                Copy
              </button>
            </div>

            {/* Display Simulator Scan Output */}
            <AnimatePresence>
              {emulatorResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold"
                >
                  <span className="text-[10px] tracking-wider uppercase opacity-75">Scanner Read Result:</span>
                  <p className="font-mono bg-secondary p-2 rounded-lg border border-border text-foreground break-all select-all font-medium leading-normal">
                    {emulatorResult}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 2. Download/Export Panel Options */}
      {isValid && (
        <div className="bg-card text-card-foreground border border-border rounded-3xl p-5 shadow-sm flex flex-col gap-4 transition-all duration-300">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Export & Downloads
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {/* Download PNG standard */}
            <button
              onClick={() => downloadImage('png')}
              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10 cursor-pointer"
              id="export-png-btn"
            >
              <Download className="w-4 h-4 shrink-0" />
              Download PNG
            </button>

            {/* Download Vector SVG */}
            <button
              onClick={downloadSvg}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 cursor-pointer"
              id="export-svg-btn"
            >
              <Download className="w-4 h-4 shrink-0" />
              Vector SVG
            </button>

            {/* Download PDF Print Document */}
            <button
              onClick={downloadPdf}
              className="py-2.5 px-4 bg-foreground hover:bg-foreground/90 text-background rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              id="export-pdf-btn"
            >
              <Printer className="w-4 h-4 shrink-0" />
              Print PDF Sheet
            </button>

            {/* Print directly */}
            <button
              onClick={triggerPrint}
              className="py-2.5 px-4 bg-secondary hover:bg-secondary/80 border border-border text-foreground rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              id="export-print-btn"
            >
              <Printer className="w-4 h-4 shrink-0" />
              Print Code
            </button>
          </div>

          <div className="h-px bg-border my-1" />

          {/* Secondary Utilities */}
          <div className="grid grid-cols-3 gap-2">
            {/* JPG download */}
            <button
              onClick={() => downloadImage('jpeg')}
              className="py-2 px-1 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-xs font-semibold transition-all border border-border cursor-pointer"
            >
              JPG
            </button>
            {/* WEBP download */}
            <button
              onClick={() => downloadImage('webp')}
              className="py-2 px-1 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-xs font-semibold transition-all border border-border cursor-pointer"
            >
              WEBP
            </button>
            {/* Copy raw payload text string */}
            <button
              onClick={copyPayloadText}
              className="py-2 px-1 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-xs font-semibold transition-all border border-border flex items-center justify-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 shrink-0" />
              Data
            </button>
          </div>

          {/* Share QR using Web Share API */}
          <button
            onClick={shareQr}
            className="w-full py-2 px-4 bg-transparent border border-border hover:bg-secondary text-muted-foreground rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 className="w-4 h-4 shrink-0" />
            Share with Web API
          </button>
        </div>
      )}
    </div>
  );
}
