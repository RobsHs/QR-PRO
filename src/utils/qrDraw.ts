/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import qrcode from 'qrcode';
import { QrStyleSettings } from '../types';

// Built-in logo SVG paths (centered in a 24x24 viewport)
export const LOGO_PATHS = {
  none: '',
  whatsapp: 'M12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.27 4.88L2 22l5.3-1.25C8.68 21.46 10.3 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm3.83 14.28c-.2.57-1.02 1.05-1.55 1.13-.5.08-1.15.15-3.32-.75-2.78-1.15-4.52-4.01-4.66-4.2-.14-.19-1.12-1.49-1.12-2.84 0-1.35.7-2.01.95-2.28.25-.27.65-.41.95-.41.1 0 .2 0 .3.01.3 0 .45.02.65.5.25.61.85 2.08.92 2.23.08.15.13.33.03.53-.1.2-.2.33-.35.5-.15.17-.32.38-.45.51-.15.15-.31.32-.13.63.18.31.81 1.34 1.74 2.17.93.83 1.72 1.09 2.03 1.22.31.13.49.1.67-.1.18-.21.78-.91.99-1.22.2-.31.41-.26.68-.16.28.1.1.78 1.48 1.47 1.47.69.69 1.27.76 1.42.79s.42-.08.62-.35c.2-.27.87-1.02 1.1-1.37.23-.35.45-.3.75-.19.3.11 1.91.9 2.24 1.06s.55.24.63.38c.08.14.08.82-.12 1.39z',
  wifi: 'M12 3C7.03 3 2.5 5.03 0 8.5l1.5 1.5C3.5 7.5 7.5 6 12 6s8.5 1.5 10.5 4l1.5-1.5C21.5 5.03 16.97 3 12 3zm0 6c-3.31 0-6.19 1.39-8.19 3.59L12 21.5l8.19-8.91C18.19 10.39 15.31 9 12 9zm0 5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
  google: 'M12.24 10.285V13.4h6.86c-.277 1.56-1.602 4.585-6.86 4.585-4.54 0-8.24-3.765-8.24-8.4s3.7-8.4 8.24-8.4c2.58 0 4.307 1.095 5.298 2.045l2.465-2.37C18.575 1.5 15.69 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.19-1.925H12.24z',
  url: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
  phone: 'M6.62 10.79c1.44 2.82 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
};

// Helper to check if row/col is part of Finder Patterns (Eyes)
export function isEyeCoordinate(row: number, col: number, size: number): 'tl' | 'tr' | 'bl' | null {
  if (row < 7 && col < 7) return 'tl';
  if (row < 7 && col >= size - 7) return 'tr';
  if (row >= size - 7 && col < 7) return 'bl';
  return null;
}

// Generate raw QR code matrix
export function generateQrMatrix(text: string, eccLevel: 'L' | 'M' | 'Q' | 'H' | 'auto'): { size: number; matrix: number[][] } {
  try {
    // Determine ECC level
    const targetEcc = eccLevel === 'auto' ? 'H' : eccLevel;
    const qr = qrcode.create(text, { errorCorrectionLevel: targetEcc });
    const size = qr.modules.size;
    const matrix: number[][] = [];

    for (let r = 0; r < size; r++) {
      const row: number[] = [];
      for (let c = 0; c < size; c++) {
        row.push(qr.modules.get(r, c) ? 1 : 0);
      }
      matrix.push(row);
    }

    return { size, matrix };
  } catch (err) {
    console.error('Error generating QR Matrix:', err);
    throw new Error('QR generation failed due to invalid data format.');
  }
}

// Helper to draw rounded rectangle
export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (r < 0.1) {
    ctx.fillRect(x, y, w, h);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

// Draw individual eye to canvas
function drawEyeCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cellSize: number,
  outerStyle: 'square' | 'rounded' | 'circle' | 'leaf',
  innerStyle: 'square' | 'rounded' | 'circle' | 'leaf',
  outerColor: string,
  innerColor: string,
  eyeType: 'tl' | 'tr' | 'bl',
  backgroundColor: string
) {
  const outerWidth = 7 * cellSize;
  const innerWidth = 3 * cellSize;
  const innerOffset = 2 * cellSize;

  ctx.save();

  // 1. Draw Outer Frame (size 7x7 cells)
  ctx.fillStyle = outerColor;
  ctx.beginPath();

  if (outerStyle === 'square') {
    ctx.rect(x, y, outerWidth, outerWidth);
  } else if (outerStyle === 'rounded') {
    const r = 1.75 * cellSize;
    ctx.roundRect ? ctx.roundRect(x, y, outerWidth, outerWidth, r) : drawRoundedRect(ctx, x, y, outerWidth, outerWidth, r);
  } else if (outerStyle === 'circle') {
    const r = 3.5 * cellSize;
    ctx.arc(x + r, y + r, r, 0, Math.PI * 2);
  } else if (outerStyle === 'leaf') {
    // Leaf style corner rounding depends on position to point outward
    const r = 3.5 * cellSize;
    ctx.moveTo(x + r, y);
    // Customize corner radius based on which corner it points to
    if (eyeType === 'tl') {
      // Top-left is round, bottom-right is round, others are sharp
      ctx.roundRect ? ctx.roundRect(x, y, outerWidth, outerWidth, [r, 0, r, 0]) : ctx.rect(x, y, outerWidth, outerWidth);
    } else if (eyeType === 'tr') {
      ctx.roundRect ? ctx.roundRect(x, y, outerWidth, outerWidth, [0, r, 0, r]) : ctx.rect(x, y, outerWidth, outerWidth);
    } else {
      ctx.roundRect ? ctx.roundRect(x, y, outerWidth, outerWidth, [0, 0, r, r]) : ctx.rect(x, y, outerWidth, outerWidth);
    }
  }
  ctx.closePath();
  ctx.fill();

  // 2. Punch hole (draw inner gap of size 5x5 cells filled with background/transparent)
  if (backgroundColor && backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor;
    ctx.globalCompositeOperation = 'source-over';
  } else {
    // If background is transparent, punch out the outer frame
    ctx.globalCompositeOperation = 'destination-out';
  }

  ctx.beginPath();
  const gapX = x + cellSize;
  const gapY = y + cellSize;
  const gapWidth = 5 * cellSize;

  if (outerStyle === 'square') {
    ctx.rect(gapX, gapY, gapWidth, gapWidth);
  } else if (outerStyle === 'rounded') {
    const r = 1.25 * cellSize;
    ctx.roundRect ? ctx.roundRect(gapX, gapY, gapWidth, gapWidth, r) : drawRoundedRect(ctx, gapX, gapY, gapWidth, gapWidth, r);
  } else if (outerStyle === 'circle') {
    const r = 2.5 * cellSize;
    ctx.arc(gapX + r, gapY + r, r, 0, Math.PI * 2);
  } else if (outerStyle === 'leaf') {
    const r = 2.5 * cellSize;
    if (eyeType === 'tl') {
      ctx.roundRect ? ctx.roundRect(gapX, gapY, gapWidth, gapWidth, [r, 0, r, 0]) : ctx.rect(gapX, gapY, gapWidth, gapWidth);
    } else if (eyeType === 'tr') {
      ctx.roundRect ? ctx.roundRect(gapX, gapY, gapWidth, gapWidth, [0, r, 0, r]) : ctx.rect(gapX, gapY, gapWidth, gapWidth);
    } else {
      ctx.roundRect ? ctx.roundRect(gapX, gapY, gapWidth, gapWidth, [0, 0, r, r]) : ctx.rect(gapX, gapY, gapWidth, gapWidth);
    }
  }
  ctx.closePath();
  ctx.fill();

  // Reset composition operation
  ctx.globalCompositeOperation = 'source-over';

  // 3. Draw Inner Dot (size 3x3 cells)
  ctx.fillStyle = innerColor;
  ctx.beginPath();
  const dotX = x + innerOffset;
  const dotY = y + innerOffset;

  if (innerStyle === 'square') {
    ctx.rect(dotX, dotY, innerWidth, innerWidth);
  } else if (innerStyle === 'rounded') {
    const r = 0.75 * cellSize;
    ctx.roundRect ? ctx.roundRect(dotX, dotY, innerWidth, innerWidth, r) : drawRoundedRect(ctx, dotX, dotY, innerWidth, innerWidth, r);
  } else if (innerStyle === 'circle') {
    const r = 1.5 * cellSize;
    ctx.arc(dotX + r, dotY + r, r, 0, Math.PI * 2);
  } else if (innerStyle === 'leaf') {
    const r = 1.5 * cellSize;
    if (eyeType === 'tl') {
      ctx.roundRect ? ctx.roundRect(dotX, dotY, innerWidth, innerWidth, [r, 0, r, 0]) : ctx.rect(dotX, dotY, innerWidth, innerWidth);
    } else if (eyeType === 'tr') {
      ctx.roundRect ? ctx.roundRect(dotX, dotY, innerWidth, innerWidth, [0, r, 0, r]) : ctx.rect(dotX, dotY, innerWidth, innerWidth);
    } else {
      ctx.roundRect ? ctx.roundRect(dotX, dotY, innerWidth, innerWidth, [0, 0, r, r]) : ctx.rect(dotX, dotY, innerWidth, innerWidth);
    }
  }
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// Master Canvas drawing function
export async function drawQrToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  settings: QrStyleSettings,
  logoImageElement?: HTMLImageElement | null
) {
  const { size, matrix } = generateQrMatrix(text, settings.errorCorrection);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  const res = settings.resolution;
  canvas.width = res;
  canvas.height = res;

  // Clear canvas completely
  ctx.clearRect(0, 0, res, res);

  // Background color / transparency
  if (settings.backgroundColor && settings.backgroundColor !== 'transparent') {
    ctx.fillStyle = settings.backgroundColor;
    ctx.fillRect(0, 0, res, res);
  }

  // Calculate layout constraints
  let qrAreaY = res;
  let qrAreaHeight = res;

  // If frameStyle is 'scan-me', bottom 16% of canvas is for the banner
  const hasFrameBanner = settings.frameStyle === 'scan-me';
  if (hasFrameBanner) {
    qrAreaHeight = Math.floor(res * 0.83);
  }

  // Find cell size based on grid and padding margins
  const marginCells = settings.margin;
  const totalCells = size + 2 * marginCells;
  const cellSize = Math.floor(qrAreaHeight / totalCells);

  // Center the QR Grid inside the allocated space
  const qrActualSize = cellSize * size;
  const startX = Math.floor((res - qrActualSize) / 2);
  const startY = Math.floor((qrAreaHeight - qrActualSize) / 2);

  // Body Fill Color/Gradient Configuration
  let bodyFill: string | CanvasGradient = settings.primaryColor;
  if (settings.colorType === 'gradient') {
    // Translate angle into gradient coordinates
    const angleRad = (settings.gradientAngle * Math.PI) / 180;
    const gradX1 = startX + qrActualSize / 2 - (Math.cos(angleRad) * qrActualSize) / 2;
    const gradY1 = startY + qrActualSize / 2 - (Math.sin(angleRad) * qrActualSize) / 2;
    const gradX2 = startX + qrActualSize / 2 + (Math.cos(angleRad) * qrActualSize) / 2;
    const gradY2 = startY + qrActualSize / 2 + (Math.sin(angleRad) * qrActualSize) / 2;

    const grad = ctx.createLinearGradient(gradX1, gradY1, gradX2, gradY2);
    grad.addColorStop(0, settings.primaryColor);
    grad.addColorStop(1, settings.secondaryColor);
    bodyFill = grad;
  }

  // Prepare custom logo bounding box
  const hasLogo = settings.logoType !== 'none';
  let logoStartModule = -1;
  let logoEndModule = -1;

  if (hasLogo) {
    // Calculate how many cells should be cleared. Limit to 15%-20% grid cells
    const clearedModules = Math.max(5, Math.floor(size * settings.logoScale));
    // Center alignment
    logoStartModule = Math.floor((size - clearedModules) / 2);
    logoEndModule = logoStartModule + clearedModules;
  }

  // 1. Draw QR Body Modules
  ctx.fillStyle = bodyFill;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip drawing if empty (0)
      if (matrix[r][c] === 0) continue;

      // Skip drawing if coordinate belongs to any of the 3 Finder Patterns
      if (isEyeCoordinate(r, c, size)) continue;

      // Skip drawing if coordinate lies in the cleared center logo area
      if (hasLogo && r >= logoStartModule && r < logoEndModule && c >= logoStartModule && c < logoEndModule) {
        continue;
      }

      // Draw module
      const x = startX + c * cellSize;
      const y = startY + r * cellSize;

      ctx.beginPath();
      if (settings.moduleStyle === 'square') {
        ctx.fillRect(x, y, cellSize, cellSize);
      } else if (settings.moduleStyle === 'circle') {
        const rad = (cellSize / 2) * 0.9;
        ctx.arc(x + cellSize / 2, y + cellSize / 2, rad, 0, Math.PI * 2);
        ctx.fill();
      } else if (settings.moduleStyle === 'dots') {
        const rad = (cellSize / 2) * settings.moduleRoundness * 0.9;
        ctx.arc(x + cellSize / 2, y + cellSize / 2, Math.max(1, rad), 0, Math.PI * 2);
        ctx.fill();
      } else if (settings.moduleStyle === 'rounded') {
        const rad = Math.floor(cellSize * 0.45 * settings.moduleRoundness);
        ctx.roundRect ? ctx.roundRect(x, y, cellSize, cellSize, rad) : drawRoundedRect(ctx, x, y, cellSize, cellSize, rad);
        ctx.fill();
      }
    }
  }

  // 2. Draw standard/custom styled Finder Patterns (Eyes)
  const outerEyeColor = settings.useCustomEyeColors ? settings.eyeOuterColor : settings.primaryColor;
  const innerEyeColor = settings.useCustomEyeColors ? settings.eyeInnerColor : settings.primaryColor;

  // Top-Left Eye
  drawEyeCanvas(
    ctx,
    startX,
    startY,
    cellSize,
    settings.eyeOuterStyle,
    settings.eyeInnerStyle,
    outerEyeColor,
    innerEyeColor,
    'tl',
    settings.backgroundColor
  );

  // Top-Right Eye
  drawEyeCanvas(
    ctx,
    startX + (size - 7) * cellSize,
    startY,
    cellSize,
    settings.eyeOuterStyle,
    settings.eyeInnerStyle,
    outerEyeColor,
    innerEyeColor,
    'tr',
    settings.backgroundColor
  );

  // Bottom-Left Eye
  drawEyeCanvas(
    ctx,
    startX,
    startY + (size - 7) * cellSize,
    cellSize,
    settings.eyeOuterStyle,
    settings.eyeInnerStyle,
    outerEyeColor,
    innerEyeColor,
    'bl',
    settings.backgroundColor
  );

  // 3. Draw Logo (if configured)
  if (hasLogo) {
    const logoAreaSize = Math.floor(qrActualSize * settings.logoScale);
    const logoX = startX + Math.floor((qrActualSize - logoAreaSize) / 2);
    const logoY = startY + Math.floor((qrActualSize - logoAreaSize) / 2);

    // Draw logo background card
    const cardPadding = settings.logoPadding;
    const cardSize = logoAreaSize + cardPadding * 2;
    const cardX = logoX - cardPadding;
    const cardY = logoY - cardPadding;

    ctx.fillStyle = settings.logoBgColor || '#FFFFFF';
    ctx.beginPath();
    const rad = Math.floor(cardSize * 0.25);
    ctx.roundRect
      ? ctx.roundRect(cardX, cardY, cardSize, cardSize, rad)
      : drawRoundedRect(ctx, cardX, cardY, cardSize, cardSize, rad);
    ctx.fill();

    // Draw central icon
    if (settings.logoType === 'custom' && logoImageElement) {
      try {
        ctx.drawImage(logoImageElement, logoX, logoY, logoAreaSize, logoAreaSize);
      } catch (e) {
        console.error('Error rendering custom logo image onto canvas:', e);
      }
    } else if (settings.logoType !== 'custom' && LOGO_PATHS[settings.logoType]) {
      // Draw pre-compiled vector logos directly on canvas vector path!
      ctx.save();
      ctx.fillStyle = settings.primaryColor || '#000000';
      const pathStr = LOGO_PATHS[settings.logoType];
      const path2D = new Path2D(pathStr);

      // Translate and scale to match logoAreaSize (the design path is on a 24x24 box)
      ctx.translate(logoX, logoY);
      const scale = logoAreaSize / 24;
      ctx.scale(scale, scale);
      ctx.fill(path2D);
      ctx.restore();
    }
  }

  // 4. Draw Frames if configured
  if (settings.frameStyle === 'card') {
    // Simple modern thin card border around the QR
    ctx.strokeStyle = settings.frameColor || '#E2E8F0';
    ctx.lineWidth = Math.max(2, Math.floor(res * 0.01));
    ctx.beginPath();
    const cardGap = Math.floor(res * 0.03);
    const rad = Math.floor(res * 0.04);
    ctx.roundRect
      ? ctx.roundRect(cardGap, cardGap, res - 2 * cardGap, res - 2 * cardGap, rad)
      : drawRoundedRect(ctx, cardGap, cardGap, res - 2 * cardGap, res - 2 * cardGap, rad);
    ctx.stroke();
  } else if (hasFrameBanner) {
    // Beautiful full-width rounded bottom banner (Linear/Stripe style)
    const bannerHeight = res - qrAreaHeight;
    const bannerY = qrAreaHeight;

    ctx.fillStyle = settings.frameColor || '#0F172A';
    ctx.fillRect(0, bannerY, res, bannerHeight);

    // Draw Frame Text
    ctx.fillStyle = settings.frameTextColor || '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${Math.floor(bannerHeight * 0.35)}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(settings.frameText || 'SCAN ME', res / 2, bannerY + bannerHeight / 2);
  }
}

// Generate pixel-perfect, infinitely scalable Vector SVG Code
export function generateQrSvg(
  text: string,
  settings: QrStyleSettings,
  logoBase64?: string | null
): string {
  const { size, matrix } = generateQrMatrix(text, settings.errorCorrection);
  const res = settings.resolution;

  // Layout params
  let qrAreaHeight = res;
  const hasFrameBanner = settings.frameStyle === 'scan-me';
  if (hasFrameBanner) {
    qrAreaHeight = Math.floor(res * 0.83);
  }

  const marginCells = settings.margin;
  const totalCells = size + 2 * marginCells;
  const cellSize = Math.floor(qrAreaHeight / totalCells);

  const qrActualSize = cellSize * size;
  const startX = Math.floor((res - qrActualSize) / 2);
  const startY = Math.floor((qrAreaHeight - qrActualSize) / 2);

  // Logo config
  const hasLogo = settings.logoType !== 'none';
  let logoStartModule = -1;
  let logoEndModule = -1;

  if (hasLogo) {
    const clearedModules = Math.max(5, Math.floor(size * settings.logoScale));
    logoStartModule = Math.floor((size - clearedModules) / 2);
    logoEndModule = logoStartModule + clearedModules;
  }

  let svgContent = '';

  // Gradient Definition
  let fillAttribute = `fill="${settings.primaryColor}"`;
  if (settings.colorType === 'gradient') {
    const angleRad = (settings.gradientAngle * Math.PI) / 180;
    const x1 = 50 - Math.cos(angleRad) * 50;
    const y1 = 50 - Math.sin(angleRad) * 50;
    const x2 = 50 + Math.cos(angleRad) * 50;
    const y2 = 50 + Math.sin(angleRad) * 50;

    svgContent += `
    <defs>
      <linearGradient id="bodyGrad" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
        <stop offset="0%" stop-color="${settings.primaryColor}" />
        <stop offset="100%" stop-color="${settings.secondaryColor}" />
      </linearGradient>
    </defs>`;
    fillAttribute = 'fill="url(#bodyGrad)"';
  }

  // Background rect
  const bgFill = settings.backgroundColor === 'transparent' ? 'none' : settings.backgroundColor;
  svgContent += `<rect width="${res}" height="${res}" fill="${bgFill}" />`;

  // Draw Body Modules
  let pathD = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c] === 0) continue;
      if (isEyeCoordinate(r, c, size)) continue;
      if (hasLogo && r >= logoStartModule && r < logoEndModule && c >= logoStartModule && c < logoEndModule) {
        continue;
      }

      const x = startX + c * cellSize;
      const y = startY + r * cellSize;

      if (settings.moduleStyle === 'square') {
        pathD += ` M${x},${y} h${cellSize} v${cellSize} h-${cellSize} z`;
      } else if (settings.moduleStyle === 'circle') {
        const rad = (cellSize / 2) * 0.9;
        const cx = x + cellSize / 2;
        const cy = y + cellSize / 2;
        pathD += ` M${cx},${cy - rad} a${rad},${rad} 0 1,1 0,${rad * 2} a${rad},${rad} 0 1,1 0,-${rad * 2}`;
      } else if (settings.moduleStyle === 'dots') {
        const rad = (cellSize / 2) * settings.moduleRoundness * 0.9;
        const cx = x + cellSize / 2;
        const cy = y + cellSize / 2;
        pathD += ` M${cx},${cy - rad} a${rad},${rad} 0 1,1 0,${rad * 2} a${rad},${rad} 0 1,1 0,-${rad * 2}`;
      } else if (settings.moduleStyle === 'rounded') {
        const rad = Math.floor(cellSize * 0.45 * settings.moduleRoundness);
        pathD += ` M${x + rad},${y} h${cellSize - 2 * rad} a${rad},${rad} 0 0,1 ${rad},${rad} v${cellSize - 2 * rad} a${rad},${rad} 0 0,1 -${rad},${rad} h-${cellSize - 2 * rad} a${rad},${rad} 0 0,1 -${rad},-${rad} v-${cellSize - 2 * rad} a${rad},${rad} 0 0,1 ${rad},-${rad} z`;
      }
    }
  }

  if (pathD) {
    svgContent += `<path d="${pathD}" ${fillAttribute} />`;
  }

  // Draw Eyes (SVG vectors)
  const outerEyeColor = settings.useCustomEyeColors ? settings.eyeOuterColor : settings.primaryColor;
  const innerEyeColor = settings.useCustomEyeColors ? settings.eyeInnerColor : settings.primaryColor;

  const eyes = [
    { name: 'tl', x: startX, y: startY },
    { name: 'tr', x: startX + (size - 7) * cellSize, y: startY },
    { name: 'bl', x: startX, y: startY + (size - 7) * cellSize },
  ];

  eyes.forEach((eye) => {
    const eyeOuterWidth = 7 * cellSize;
    const eyeInnerWidth = 3 * cellSize;
    const eyeOffset = 2 * cellSize;

    // Outer Eye Path
    let outerD = '';
    const x = eye.x;
    const y = eye.y;

    if (settings.eyeOuterStyle === 'square') {
      outerD = `M${x},${y} h${eyeOuterWidth} v${eyeOuterWidth} h-${eyeOuterWidth} z`;
    } else if (settings.eyeOuterStyle === 'rounded') {
      const r = 1.75 * cellSize;
      outerD = `M${x + r},${y} h${eyeOuterWidth - 2 * r} a${r},${r} 0 0,1 ${r},${r} v${eyeOuterWidth - 2 * r} a${r},${r} 0 0,1 -${r},${r} h-${eyeOuterWidth - 2 * r} a${r},${r} 0 0,1 -${r},-${r} v-${eyeOuterWidth - 2 * r} a${r},${r} 0 0,1 ${r},-${r} z`;
    } else if (settings.eyeOuterStyle === 'circle') {
      const r = 3.5 * cellSize;
      const cx = x + r;
      const cy = y + r;
      outerD = `M${cx},${cy - r} a${r},${r} 0 1,1 0,${r * 2} a${r},${r} 0 1,1 0,-${r * 2}`;
    } else if (settings.eyeOuterStyle === 'leaf') {
      const r = 3.5 * cellSize;
      if (eye.name === 'tl') {
        outerD = `M${x + r},${y} h${eyeOuterWidth - r} v${eyeOuterWidth - r} a${r},${r} 0 0,1 -${r},${r} h-${eyeOuterWidth - r} v-${eyeOuterWidth - r} a${r},${r} 0 0,1 ${r},-${r} z`;
      } else if (eye.name === 'tr') {
        outerD = `M${x},${y} h${eyeOuterWidth - r} a${r},${r} 0 0,1 ${r},${r} v${eyeOuterWidth - r} h-${eyeOuterWidth - r} a${r},${r} 0 0,1 -${r},-${r} v-${eyeOuterWidth - r} z`;
      } else {
        outerD = `M${x},${y} h${eyeOuterWidth} v${eyeOuterWidth} z`; // fallback simple standard outer eye for bottoms
      }
    }

    svgContent += `<path d="${outerD}" fill="${outerEyeColor}" />`;

    // Inner Hole (Punch Gap in background color or blank if transparent)
    if (settings.backgroundColor && settings.backgroundColor !== 'transparent') {
      let gapD = '';
      const gx = x + cellSize;
      const gy = y + cellSize;
      const gw = 5 * cellSize;

      if (settings.eyeOuterStyle === 'square') {
        gapD = `M${gx},${gy} h${gw} v${gw} h-${gw} z`;
      } else if (settings.eyeOuterStyle === 'rounded') {
        const r = 1.25 * cellSize;
        gapD = `M${gx + r},${gy} h${gw - 2 * r} a${r},${r} 0 0,1 ${r},${r} v${gw - 2 * r} a${r},${r} 0 0,1 -${r},${r} h-${gw - 2 * r} a${r},${r} 0 0,1 -${r},-${r} v-${gw - 2 * r} a${r},${r} 0 0,1 ${r},-${r} z`;
      } else if (settings.eyeOuterStyle === 'circle') {
        const r = 2.5 * cellSize;
        const cx = gx + r;
        const cy = gy + r;
        gapD = `M${cx},${cy - r} a${r},${r} 0 1,1 0,${r * 2} a${r},${r} 0 1,1 0,-${r * 2}`;
      } else if (settings.eyeOuterStyle === 'leaf') {
        const r = 2.5 * cellSize;
        if (eye.name === 'tl') {
          gapD = `M${gx + r},${gy} h${gw - r} v${gw - r} a${r},${r} 0 0,1 -${r},${r} h-${gw - r} v-${gw - r} a${r},${r} 0 0,1 ${r},-${r} z`;
        } else {
          gapD = `M${gx},${gy} h${gw} v${gw} h-${gw} z`;
        }
      }

      svgContent += `<path d="${gapD}" fill="${settings.backgroundColor}" />`;
    }

    // Inner Dot Path
    let dotD = '';
    const dx = x + eyeOffset;
    const dy = y + eyeOffset;

    if (settings.eyeInnerStyle === 'square') {
      dotD = `M${dx},${dy} h${eyeInnerWidth} v${eyeInnerWidth} h-${eyeInnerWidth} z`;
    } else if (settings.eyeInnerStyle === 'rounded') {
      const r = 0.75 * cellSize;
      dotD = `M${dx + r},${dy} h${eyeInnerWidth - 2 * r} a${r},${r} 0 0,1 ${r},${r} v${eyeInnerWidth - 2 * r} a${r},${r} 0 0,1 -${r},${r} h-${eyeInnerWidth - 2 * r} a${r},${r} 0 0,1 -${r},-${r} v-${eyeInnerWidth - 2 * r} a${r},${r} 0 0,1 ${r},-${r} z`;
    } else if (settings.eyeInnerStyle === 'circle') {
      const r = 1.5 * cellSize;
      const cx = dx + r;
      const cy = dy + r;
      dotD = `M${cx},${cy - r} a${r},${r} 0 1,1 0,${r * 2} a${r},${r} 0 1,1 0,-${r * 2}`;
    } else if (settings.eyeInnerStyle === 'leaf') {
      const r = 1.5 * cellSize;
      if (eye.name === 'tl') {
        dotD = `M${dx + r},${dy} h${eyeInnerWidth - r} v${eyeInnerWidth - r} a${r},${r} 0 0,1 -${r},${r} h-${eyeInnerWidth - r} v-${eyeInnerWidth - r} a${r},${r} 0 0,1 ${r},-${r} z`;
      } else {
        dotD = `M${dx},${dy} h${eyeInnerWidth} v${eyeInnerWidth} h-${eyeInnerWidth} z`;
      }
    }

    svgContent += `<path d="${dotD}" fill="${innerEyeColor}" />`;
  });

  // Draw Logo in SVG
  if (hasLogo) {
    const logoAreaSize = Math.floor(qrActualSize * settings.logoScale);
    const logoX = startX + Math.floor((qrActualSize - logoAreaSize) / 2);
    const logoY = startY + Math.floor((qrActualSize - logoAreaSize) / 2);

    const cardPadding = settings.logoPadding;
    const cardSize = logoAreaSize + cardPadding * 2;
    const cardX = logoX - cardPadding;
    const cardY = logoY - cardPadding;
    const rad = Math.floor(cardSize * 0.25);

    // Card background
    svgContent += `<rect x="${cardX}" y="${cardY}" width="${cardSize}" height="${cardSize}" rx="${rad}" ry="${rad}" fill="${settings.logoBgColor || '#FFFFFF'}" />`;

    if (settings.logoType === 'custom' && logoBase64) {
      svgContent += `<image x="${logoX}" y="${logoY}" width="${logoAreaSize}" height="${logoAreaSize}" href="${logoBase64}" />`;
    } else if (settings.logoType !== 'custom' && LOGO_PATHS[settings.logoType]) {
      const pathStr = LOGO_PATHS[settings.logoType];
      const scale = logoAreaSize / 24;
      // In SVG, we can group, translate, scale and draw
      svgContent += `
      <g transform="translate(${logoX}, ${logoY}) scale(${scale})">
        <path d="${pathStr}" fill="${settings.primaryColor || '#000000'}" />
      </g>`;
    }
  }

  // Draw Frames if configured
  if (settings.frameStyle === 'card') {
    const cardGap = Math.floor(res * 0.03);
    const rad = Math.floor(res * 0.04);
    const strokeW = Math.max(2, Math.floor(res * 0.01));
    svgContent += `<rect x="${cardGap}" y="${cardGap}" width="${res - 2 * cardGap}" height="${res - 2 * cardGap}" rx="${rad}" ry="${rad}" fill="none" stroke="${settings.frameColor || '#E2E8F0'}" stroke-width="${strokeW}" />`;
  } else if (hasFrameBanner) {
    const bannerHeight = res - qrAreaHeight;
    const bannerY = qrAreaHeight;

    // Full banner rect
    svgContent += `<rect x="0" y="${bannerY}" width="${res}" height="${bannerHeight}" fill="${settings.frameColor || '#0F172A'}" />`;

    // TEXT element
    const fontSize = Math.floor(bannerHeight * 0.35);
    svgContent += `<text x="${res / 2}" y="${bannerY + bannerHeight / 2}" fill="${settings.frameTextColor || '#FFFFFF'}" font-family="system-ui, -apple-system, sans-serif" font-weight="bold" font-size="${fontSize}" text-anchor="middle" dominant-baseline="central">${settings.frameText || 'SCAN ME'}</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${res} ${res}" width="100%" height="100%">${svgContent}</svg>`;
}
