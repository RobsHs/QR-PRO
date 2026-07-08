/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Palette,
  Image as ImageIcon,
  Layout,
  Upload,
  ChevronDown,
  Info,
} from 'lucide-react';
import { QrStyleSettings } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface StyleCustomizerProps {
  settings: QrStyleSettings;
  setSettings: React.Dispatch<React.SetStateAction<QrStyleSettings>>;
  onLogoUpload: (base64: string | null) => void;
}

export function StyleCustomizer({ settings, setSettings, onLogoUpload }: StyleCustomizerProps) {
  const [activeSection, setActiveSection] = useState<'shapes' | 'colors' | 'logo' | 'frame' | null>('shapes');

  const toggleSection = (section: 'shapes' | 'colors' | 'logo' | 'frame') => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Helper to update specific setting properties
  const updateSetting = <K extends keyof QrStyleSettings>(key: K, value: QrStyleSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Process custom logo uploads securely and convert to Base64
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file must be smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        updateSetting('logoType', 'custom');
        onLogoUpload(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider mb-2">
        Customize QR Design Style
      </h2>

      {/* SECTION 1: Shapes & Modules */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection('shapes')}
          className="w-full flex items-center justify-between p-4 font-semibold text-sm text-zinc-800 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          id="customizer-shapes-header"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
            <span>Modules & Eye Shapes</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
              activeSection === 'shapes' ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {activeSection === 'shapes' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 flex flex-col gap-5 border-t border-zinc-100 dark:border-zinc-900">
                {/* Module Style Choice */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    Body Module Style
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['square', 'rounded', 'dots', 'circle'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateSetting('moduleStyle', style)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                          settings.moduleStyle === style
                            ? 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                        id={`module-style-${style}`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Module Roundness Multiplier Slider */}
                {(settings.moduleStyle === 'rounded' || settings.moduleStyle === 'dots') && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                      <span>Module Scale / Roundness</span>
                      <span>{Math.round(settings.moduleRoundness * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={settings.moduleRoundness}
                      onChange={(e) => updateSetting('moduleRoundness', parseFloat(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                )}

                {/* Eye Outer Frame Style */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    Eye Outer Frame Style
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['square', 'rounded', 'circle', 'leaf'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateSetting('eyeOuterStyle', style)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                          settings.eyeOuterStyle === style
                            ? 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Eye Inner Dot Style */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    Eye Inner Center Style
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['square', 'rounded', 'circle', 'leaf'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateSetting('eyeInnerStyle', style)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                          settings.eyeInnerStyle === style
                            ? 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION 2: Colors & Gradients */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection('colors')}
          className="w-full flex items-center justify-between p-4 font-semibold text-sm text-zinc-800 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          id="customizer-colors-header"
        >
          <div className="flex items-center gap-2.5">
            <Palette className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
            <span>Colors & Gradients</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
              activeSection === 'colors' ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {activeSection === 'colors' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 flex flex-col gap-5 border-t border-zinc-100 dark:border-zinc-900">
                {/* Color Type Choice */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    Body Fill Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateSetting('colorType', 'solid')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        settings.colorType === 'solid'
                          ? 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                          : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      Solid Color
                    </button>
                    <button
                      onClick={() => updateSetting('colorType', 'gradient')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        settings.colorType === 'gradient'
                          ? 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                          : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      Linear Gradient
                    </button>
                  </div>
                </div>

                {/* Primary & Secondary Color Pickers */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="primary-color" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                      {settings.colorType === 'gradient' ? 'Start Color' : 'Body Color'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="primary-color"
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => updateSetting('primaryColor', e.target.value)}
                        className="w-10 h-10 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer bg-transparent shrink-0"
                      />
                      <input
                        type="text"
                        value={settings.primaryColor.toUpperCase()}
                        onChange={(e) => updateSetting('primaryColor', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-mono font-medium outline-none"
                      />
                    </div>
                  </div>

                  {settings.colorType === 'gradient' && (
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="secondary-color" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                        End Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="secondary-color"
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                          className="w-10 h-10 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer bg-transparent shrink-0"
                        />
                        <input
                          type="text"
                          value={settings.secondaryColor.toUpperCase()}
                          onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-mono font-medium outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Gradient Angle Slider */}
                {settings.colorType === 'gradient' && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                      <span>Gradient Angle</span>
                      <span>{settings.gradientAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="5"
                      value={settings.gradientAngle}
                      onChange={(e) => updateSetting('gradientAngle', parseInt(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                )}

                {/* Background Selector */}
                <div className="flex flex-col gap-2 border-t border-zinc-100 dark:border-zinc-900 pt-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="bg-transparent" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                      Transparent Background
                    </label>
                    <input
                      id="bg-transparent"
                      type="checkbox"
                      checked={settings.backgroundColor === 'transparent'}
                      onChange={(e) =>
                        updateSetting('backgroundColor', e.target.checked ? 'transparent' : '#FFFFFF')
                      }
                      className="w-4.5 h-4.5 rounded text-indigo-600 focus:ring-indigo-500 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800"
                    />
                  </div>

                  {settings.backgroundColor !== 'transparent' && (
                    <div className="flex flex-col gap-1.5 mt-2">
                      <label htmlFor="bg-color" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                        Background Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="bg-color"
                          type="color"
                          value={settings.backgroundColor}
                          onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                          className="w-10 h-10 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer bg-transparent shrink-0"
                        />
                        <input
                          type="text"
                          value={settings.backgroundColor.toUpperCase()}
                          onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-mono font-medium outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Independent Custom Eye Colors */}
                <div className="flex flex-col gap-2 border-t border-zinc-100 dark:border-zinc-900 pt-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="custom-eyes" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                      Independent Eye Colors
                    </label>
                    <input
                      id="custom-eyes"
                      type="checkbox"
                      checked={settings.useCustomEyeColors}
                      onChange={(e) => updateSetting('useCustomEyeColors', e.target.checked)}
                      className="w-4.5 h-4.5 rounded text-indigo-600 focus:ring-indigo-500 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800"
                    />
                  </div>

                  {settings.useCustomEyeColors && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="eye-outer-color" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                          Outer Eye Frame
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            id="eye-outer-color"
                            type="color"
                            value={settings.eyeOuterColor}
                            onChange={(e) => updateSetting('eyeOuterColor', e.target.value)}
                            className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer bg-transparent shrink-0"
                          />
                          <input
                            type="text"
                            value={settings.eyeOuterColor.toUpperCase()}
                            onChange={(e) => updateSetting('eyeOuterColor', e.target.value)}
                            className="w-full px-2 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[10px] font-mono font-semibold outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="eye-inner-color" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                          Inner Eye Dot
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            id="eye-inner-color"
                            type="color"
                            value={settings.eyeInnerColor}
                            onChange={(e) => updateSetting('eyeInnerColor', e.target.value)}
                            className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer bg-transparent shrink-0"
                          />
                          <input
                            type="text"
                            value={settings.eyeInnerColor.toUpperCase()}
                            onChange={(e) => updateSetting('eyeInnerColor', e.target.value)}
                            className="w-full px-2 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[10px] font-mono font-semibold outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION 3: Central Logo branding */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection('logo')}
          className="w-full flex items-center justify-between p-4 font-semibold text-sm text-zinc-800 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          id="customizer-logo-header"
        >
          <div className="flex items-center gap-2.5">
            <ImageIcon className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
            <span>Center Logo Branding</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
              activeSection === 'logo' ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {activeSection === 'logo' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 flex flex-col gap-5 border-t border-zinc-100 dark:border-zinc-900">
                {/* Built-in Logo Grid Choice */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    Select Logo Preset
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { type: 'none', label: 'None' },
                      { type: 'whatsapp', label: 'WhatsApp' },
                      { type: 'wifi', label: 'WiFi' },
                      { type: 'google', label: 'Google' },
                      { type: 'url', label: 'Link' },
                      { type: 'phone', label: 'Phone' },
                    ] as { type: QrStyleSettings['logoType']; label: string }[]).map((logo) => (
                      <button
                        key={logo.type}
                        onClick={() => {
                          updateSetting('logoType', logo.type);
                          if (logo.type !== 'custom') onLogoUpload(null);
                        }}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                          settings.logoType === logo.type
                            ? 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        {logo.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom File Upload Button */}
                <div className="flex flex-col gap-2 pt-2">
                  <label htmlFor="logo-file-upload" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    Or Upload Custom Logo Image
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-zinc-300 dark:border-zinc-800 hover:border-indigo-500 rounded-xl cursor-pointer transition-colors bg-zinc-50/50 dark:bg-zinc-950/50">
                      <Upload className="w-4 h-4 text-zinc-400 shrink-0" />
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        {settings.logoType === 'custom' ? 'Custom Image Selected' : 'Choose PNG/JPG (Max 2MB)'}
                      </span>
                      <input
                        id="logo-file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileChange}
                        className="hidden"
                      />
                    </label>
                    {settings.logoType === 'custom' && (
                      <button
                        onClick={() => {
                          updateSetting('logoType', 'none');
                          onLogoUpload(null);
                        }}
                        className="px-3 py-3 border border-zinc-200 dark:border-zinc-800 hover:border-rose-500 hover:bg-rose-500/10 rounded-xl text-xs font-bold text-zinc-500 hover:text-rose-600 transition-colors shrink-0"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Logo Customizer Controls */}
                {settings.logoType !== 'none' && (
                  <div className="flex flex-col gap-4 border-t border-zinc-100 dark:border-zinc-900 pt-4">
                    {/* Size scaling */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                        <span>Logo Size</span>
                        <span>{Math.round(settings.logoScale * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.10"
                        max="0.25"
                        step="0.01"
                        value={settings.logoScale}
                        onChange={(e) => updateSetting('logoScale', parseFloat(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    {/* Padding margin */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                        <span>Logo Card Padding</span>
                        <span>{settings.logoPadding}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="24"
                        step="2"
                        value={settings.logoPadding}
                        onChange={(e) => updateSetting('logoPadding', parseInt(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    {/* Card background card color */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="logo-bg" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                        Logo Card Background
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="logo-bg"
                          type="color"
                          value={settings.logoBgColor}
                          onChange={(e) => updateSetting('logoBgColor', e.target.value)}
                          className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer bg-transparent shrink-0"
                        />
                        <input
                          type="text"
                          value={settings.logoBgColor.toUpperCase()}
                          onChange={(e) => updateSetting('logoBgColor', e.target.value)}
                          className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-mono font-medium outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION 4: Frames, Padding, Resolution presets */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection('frame')}
          className="w-full flex items-center justify-between p-4 font-semibold text-sm text-zinc-800 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          id="customizer-frames-header"
        >
          <div className="flex items-center gap-2.5">
            <Layout className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
            <span>Layout, Resolution & Banners</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
              activeSection === 'frame' ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {activeSection === 'frame' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 flex flex-col gap-5 border-t border-zinc-100 dark:border-zinc-900">
                {/* Frame Style */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    Print Frame Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { type: 'none', label: 'No Frame' },
                      { type: 'card', label: 'Border Card' },
                      { type: 'scan-me', label: 'Scan Banner' },
                    ] as const).map((frame) => (
                      <button
                        key={frame.type}
                        onClick={() => updateSetting('frameStyle', frame.type)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          settings.frameStyle === frame.type
                            ? 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        {frame.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Banner custom options */}
                {settings.frameStyle === 'scan-me' && (
                  <div className="flex flex-col gap-3 border border-zinc-100 dark:border-zinc-900 p-3.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="frame-txt" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                        Banner Text Message
                      </label>
                      <input
                        id="frame-txt"
                        type="text"
                        placeholder="SCAN ME"
                        value={settings.frameText}
                        onChange={(e) => updateSetting('frameText', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="frame-col" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                          Banner Fill Color
                        </label>
                        <input
                          id="frame-col"
                          type="color"
                          value={settings.frameColor}
                          onChange={(e) => updateSetting('frameColor', e.target.value)}
                          className="w-full h-8 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer bg-transparent"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="frame-txt-col" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                          Text Color
                        </label>
                        <input
                          id="frame-txt-col"
                          type="color"
                          value={settings.frameTextColor}
                          onChange={(e) => updateSetting('frameTextColor', e.target.value)}
                          className="w-full h-8 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Padding Margin Cells slider */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    <span>Quiet Zone Margin Cells</span>
                    <span>{settings.margin} cells</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="1"
                    value={settings.margin}
                    onChange={(e) => updateSetting('margin', parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                {/* Resolution Presets Selector */}
                <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
                  <label htmlFor="resolution-select" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    Export Resolution Preset
                  </label>
                  <select
                    id="resolution-select"
                    value={settings.resolution}
                    onChange={(e) => updateSetting('resolution', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value={512}>512 x 512 px (Fast preview, mobile standard)</option>
                    <option value={1024}>1024 x 1024 px (High resolution HD)</option>
                    <option value={2048}>2048 x 2048 px (Super Sharp Ultra HD)</option>
                    <option value={4096}>4096 x 4096 px (Billboard Vector scale crispness)</option>
                  </select>
                </div>

                {/* Error Correction Selection */}
                <div className="flex flex-col gap-2 pt-2">
                  <label htmlFor="ecc-select" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 flex items-center gap-1">
                    Error Correction Level
                    <span className="tooltip-container relative cursor-help text-zinc-400 hover:text-zinc-100">
                      <Info className="w-3 h-3" />
                    </span>
                  </label>
                  <select
                    id="ecc-select"
                    value={settings.errorCorrection}
                    onChange={(e) => updateSetting('errorCorrection', e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="auto">Auto-Managed (Highly Recommended)</option>
                    <option value="L">L (7% recovery capability - smallest cells)</option>
                    <option value="M">M (15% recovery capability)</option>
                    <option value="Q">Q (25% recovery capability)</option>
                    <option value="H">H (30% recovery capability - maximum logo resilience)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
