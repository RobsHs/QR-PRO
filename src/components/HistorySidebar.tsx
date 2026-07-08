/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import {
  Search,
  Trash2,
  Star,
  Download,
  Upload,
  Link,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  Wifi,
  MapPin,
  Contact,
  Calendar,
  Coins,
  CreditCard,
  Code,
  CalendarDays,
  FileJson,
} from 'lucide-react';
import { HistoryItem, QrType } from '../types';

interface HistorySidebarProps {
  history: HistoryItem[];
  filteredHistory: HistoryItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  typeFilter: QrType | 'all';
  setTypeFilter: (filter: QrType | 'all') => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (favOnly: boolean) => void;
  onSelectHistoryItem: (item: HistoryItem) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
  onExportHistory: () => void;
  onImportHistory: (json: string) => void;
  onShowToast: (text: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const QR_TYPE_ICONS: Record<QrType, React.ComponentType<{ className?: string }>> = {
  url: Link,
  text: FileText,
  email: Mail,
  phone: Phone,
  sms: MessageSquare,
  whatsapp: MessageCircle,
  wifi: Wifi,
  location: MapPin,
  vcard: Contact,
  event: Calendar,
  crypto: Coins,
  upi: CreditCard,
  custom: Code,
};

export function HistorySidebar({
  history,
  filteredHistory,
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  favoritesOnly,
  setFavoritesOnly,
  onSelectHistoryItem,
  onToggleFavorite,
  onDeleteItem,
  onClearHistory,
  onExportHistory,
  onImportHistory,
  onShowToast,
}: HistorySidebarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const contents = event.target?.result as string;
      if (contents) {
        onImportHistory(contents);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = ''; // Clear value
  };

  const formatShortDate = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground border border-border rounded-3xl p-5 shadow-sm transition-all duration-300">
      {/* Sidebar Header with controls */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Generation History ({history.length})
          </h3>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
              title="Clear all local history"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Database backup JSON actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onExportHistory}
            disabled={history.length === 0}
            className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-border hover:bg-secondary text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Backup JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-border hover:bg-secondary text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            Restore
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>

        {/* Search input field */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search payload or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-secondary border border-border rounded-xl text-xs font-semibold text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        {/* Filters bar */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Type Filter
            </span>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={favoritesOnly}
                onChange={(e) => setFavoritesOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-secondary border-border text-primary focus:ring-primary"
              />
              <span className="text-[10px] font-bold text-muted-foreground hover:text-foreground">
                Favorites Only
              </span>
            </label>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="w-full px-3 py-1.5 bg-secondary text-foreground border border-border rounded-lg text-[11px] font-bold outline-none cursor-pointer focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="all" className="bg-card">All content types</option>
            <option value="url" className="bg-card">URLs / Links</option>
            <option value="text" className="bg-card">Plain Texts</option>
            <option value="email" className="bg-card">Emails</option>
            <option value="phone" className="bg-card">Phones</option>
            <option value="sms" className="bg-card">SMS</option>
            <option value="whatsapp" className="bg-card">WhatsApp</option>
            <option value="wifi" className="bg-card">WiFi Networks</option>
            <option value="location" className="bg-card">Locations</option>
            <option value="vcard" className="bg-card">vCards</option>
            <option value="event" className="bg-card">Calendar Events</option>
            <option value="crypto" className="bg-card">Cryptocurrencies</option>
            <option value="upi" className="bg-card">UPI Payments</option>
            <option value="custom" className="bg-card">Custom Data</option>
          </select>
        </div>
      </div>

      <div className="h-px bg-border my-4" />

      {/* History scroll list */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => {
            const Icon = QR_TYPE_ICONS[item.type] || Code;
            return (
              <div
                key={item.id}
                className="group flex items-center justify-between p-3 rounded-2xl border border-border/50 bg-secondary/20 hover:bg-secondary/70 hover:border-border transition-all cursor-pointer relative"
                onClick={() => onSelectHistoryItem(item)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all shrink-0">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1 mt-0.5">
                      <CalendarDays className="w-3 h-3 text-muted-foreground/60" />
                      {formatShortDate(item.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Interactive log controls */}
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className={`p-1.5 rounded-lg transition-all ${
                      item.isFavorite
                        ? 'text-amber-500 bg-amber-500/10'
                        : 'text-muted-foreground/60 hover:text-amber-500 hover:bg-amber-500/10'
                    }`}
                    title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 rounded-lg text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-all"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-2 p-4">
            <FileJson className="w-8 h-8 text-muted-foreground/40 stroke-[1.5]" />
            <p className="text-xs font-bold text-muted-foreground">
              {history.length === 0 ? 'History is empty.' : 'No search results match filters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
