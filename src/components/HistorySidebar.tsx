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
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm">
      {/* Sidebar Header with controls */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
            Generation History ({history.length})
          </h3>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
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
            className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-semibold text-zinc-600 dark:text-zinc-300 disabled:opacity-40 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Backup JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-semibold text-zinc-600 dark:text-zinc-300 transition-colors"
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
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search payload or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-900 dark:text-white outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filters bar */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Type Filter
            </span>
            <label className="flex items-center gap-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={favoritesOnly}
                onChange={(e) => setFavoritesOnly(e.target.checked)}
                className="w-3.5 h-3.5 text-indigo-600 rounded bg-transparent border-zinc-300 dark:border-zinc-800 focus:ring-0"
              />
              <span className="text-[10px] font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
                Favorites Only
              </span>
            </label>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[11px] font-bold outline-none"
          >
            <option value="all">All content types</option>
            <option value="url">URLs / Links</option>
            <option value="text">Plain Texts</option>
            <option value="email">Emails</option>
            <option value="phone">Phones</option>
            <option value="sms">SMS</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="wifi">WiFi Networks</option>
            <option value="location">Locations</option>
            <option value="vcard">vCards</option>
            <option value="event">Calendar Events</option>
            <option value="crypto">Cryptocurrencies</option>
            <option value="upi">UPI Payments</option>
            <option value="custom">Custom Data</option>
          </select>
        </div>
      </div>

      <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-4" />

      {/* History scroll list */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => {
            const Icon = QR_TYPE_ICONS[item.type] || Code;
            return (
              <div
                key={item.id}
                className="group flex items-center justify-between p-3 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/10 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer relative"
                onClick={() => onSelectHistoryItem(item)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-500 group-hover:bg-indigo-500/10 transition-colors shrink-0">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-medium text-zinc-400 flex items-center gap-1 mt-0.5">
                      <CalendarDays className="w-3 h-3 text-zinc-300 dark:text-zinc-700" />
                      {formatShortDate(item.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Interactive log controls */}
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      item.isFavorite
                        ? 'text-amber-500 bg-amber-500/10'
                        : 'text-zinc-300 dark:text-zinc-700 hover:text-amber-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                    }`}
                    title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 rounded-lg text-zinc-300 dark:text-zinc-700 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
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
            <FileJson className="w-8 h-8 text-zinc-300 dark:text-zinc-800 stroke-[1.5]" />
            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600">
              {history.length === 0 ? 'History is empty.' : 'No search results match filters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
