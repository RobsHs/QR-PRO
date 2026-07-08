/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { PayloadForms } from './components/PayloadForms';
import { StyleCustomizer } from './components/StyleCustomizer';
import { QRPreview } from './components/QRPreview';
import { HistorySidebar } from './components/HistorySidebar';
import { ToastContainer, ToastMessage } from './components/Toast';
import { useQrHistory } from './hooks/useQrHistory';
import { QrType, QrStyleSettings, HistoryItem } from './types';
import { motion } from 'motion/react';

const DEFAULT_SETTINGS: QrStyleSettings = {
  moduleStyle: 'square',
  moduleRoundness: 0.6,
  eyeOuterStyle: 'square',
  eyeInnerStyle: 'square',
  colorType: 'solid',
  primaryColor: '#0F172A', // Slate-900 (Ultra sleek Vercel style)
  secondaryColor: '#4F46E5', // Indigo-600
  gradientAngle: 45,
  backgroundColor: '#FFFFFF',
  useCustomEyeColors: false,
  eyeOuterColor: '#4F46E5',
  eyeInnerColor: '#312E81',
  logoType: 'none',
  customLogoUrl: undefined,
  logoScale: 0.18,
  logoPadding: 6,
  logoBgColor: '#FFFFFF',
  margin: 4,
  resolution: 1024,
  errorCorrection: 'auto',
  frameStyle: 'none',
  frameText: 'SCAN ME',
  frameColor: '#0F172A',
  frameTextColor: '#FFFFFF',
};

export default function App() {
  const [activeType, setActiveType] = useState<QrType>('url');
  const [payload, setPayload] = useState('https://google.com');
  const [isValid, setIsValid] = useState(true);
  const [title, setTitle] = useState('Link: google.com');
  const [settings, setSettings] = useState<QrStyleSettings>(DEFAULT_SETTINGS);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  // Custom Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'error' | 'warning' | 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Custom History Hook usage
  const {
    history,
    filteredHistory,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    favoritesOnly,
    setFavoritesOnly,
    addToHistory,
    toggleFavorite,
    deleteItem,
    clearAllHistory,
    exportHistoryToJson,
    importHistoryFromJson,
  } = useQrHistory();

  // Handle saving of active QR to History (only on use/export to avoid spam)
  const handleSaveActiveToHistory = () => {
    if (!isValid || !payload) return;

    // Check if the exact same payload and type already exists as the very last item
    const lastItem = history[0];
    if (lastItem && lastItem.payload === payload && lastItem.type === activeType) {
      return; // Skip duplicate history logging
    }

    addToHistory(activeType, title, payload, settings);
  };

  // Triggered when history item is selected
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setActiveType(item.type);
    setPayload(item.payload);
    setIsValid(true);
    setSettings(item.style);
    
    // Custom logo base64 recovering
    if (item.style.logoType === 'custom' && item.style.customLogoUrl) {
      setLogoBase64(item.style.customLogoUrl);
    } else {
      setLogoBase64(null);
    }

    addToast(`Restored design template for: "${item.title}"`, 'info');
  };

  // Handle logo upload storage
  const handleLogoUpload = (base64: string | null) => {
    setLogoBase64(base64);
    if (base64) {
      // Temporarily store inside style config structure
      setSettings((prev) => ({ ...prev, customLogoUrl: base64 }));
      addToast('Custom logo uploaded successfully!', 'success');
    } else {
      setSettings((prev) => ({ ...prev, customLogoUrl: undefined }));
    }
  };

  // Handle input changes from the payload forms
  const handlePayloadChange = (formattedPayload: string, validity: boolean, computedTitle: string) => {
    setPayload(formattedPayload);
    setIsValid(validity);
    setTitle(computedTitle);
  };

  // Export history handler
  const handleExportHistory = () => {
    try {
      const dataStr = exportHistoryToJson();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr_history_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast('History backup exported successfully!', 'success');
    } catch {
      addToast('Failed to export history file.', 'error');
    }
  };

  // Import history handler
  const handleImportHistory = (jsonString: string) => {
    const res = importHistoryFromJson(jsonString);
    if (res.success) {
      addToast(`Restored ${res.count} items from history backup!`, 'success');
    } else {
      addToast(res.error || 'Import failed due to invalid file.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dynamic Entry Animation Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* LEFT PANEL: Inputs and Style Customization (8 columns in desktop) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Input payload formats cards */}
            <div className="bg-card text-card-foreground border border-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6 transition-all duration-300">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                Configure Content Data
              </h2>
              <PayloadForms
                activeType={activeType}
                setActiveType={setActiveType}
                onChange={handlePayloadChange}
              />
            </div>

            {/* Design customization accordion segment */}
            <div className="bg-card text-card-foreground border border-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6 transition-all duration-300">
              <StyleCustomizer
                settings={settings}
                setSettings={setSettings}
                onLogoUpload={handleLogoUpload}
              />
            </div>
          </div>

          {/* RIGHT PANEL: Sticky Previews & Actions (4 columns in desktop) */}
          <div className="lg:col-span-4 flex flex-col gap-8 lg:sticky lg:top-24">
            <QRPreview
              payload={payload}
              isValid={isValid}
              settings={settings}
              logoBase64={logoBase64}
              onShowToast={addToast}
              onSaveHistory={handleSaveActiveToHistory}
            />

            <HistorySidebar
              history={history}
              filteredHistory={filteredHistory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              favoritesOnly={favoritesOnly}
              setFavoritesOnly={setFavoritesOnly}
              onSelectHistoryItem={handleSelectHistoryItem}
              onToggleFavorite={toggleFavorite}
              onDeleteItem={deleteItem}
              onClearHistory={clearAllHistory}
              onExportHistory={handleExportHistory}
              onImportHistory={handleImportHistory}
              onShowToast={addToast}
            />
          </div>
        </motion.div>
      </main>

      {/* Floating global Toast notification container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
