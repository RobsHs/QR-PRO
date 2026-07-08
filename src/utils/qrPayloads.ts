/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  UrlPayload,
  TextPayload,
  EmailPayload,
  PhonePayload,
  SmsPayload,
  WhatsAppPayload,
  WifiPayload,
  LocationPayload,
  VCardPayload,
  EventPayload,
  CryptoPayload,
  UpiPayload,
  CustomPayload,
} from '../types';

// Helper to escape special characters in WIFI credentials (;, :, \, etc.)
function escapeWifiString(str: string): string {
  if (!str) return '';
  return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/:/g, '\\:').replace(/,/g, '\\,');
}

export const qrPayloadBuilders = {
  url: (data: UrlPayload): string => {
    let formatted = data.url.trim();
    if (formatted && !/^https?:\/\//i.test(formatted)) {
      formatted = 'https://' + formatted;
    }
    return formatted;
  },

  text: (data: TextPayload): string => {
    return data.text;
  },

  email: (data: EmailPayload): string => {
    const to = data.email.trim();
    const subject = encodeURIComponent(data.subject);
    const body = encodeURIComponent(data.body);
    return `mailto:${to}?subject=${subject}&body=${body}`;
  },

  phone: (data: PhonePayload): string => {
    const cleanPhone = data.phone.trim().replace(/\s+/g, '');
    return `tel:${cleanPhone}`;
  },

  sms: (data: SmsPayload): string => {
    const cleanPhone = data.phone.trim().replace(/\s+/g, '');
    const body = encodeURIComponent(data.message);
    return `sms:${cleanPhone}?body=${body}`;
  },

  whatsapp: (data: WhatsAppPayload): string => {
    // Format: https://wa.me/PHONE_NUMBER?text=MESSAGE
    // Phone must be digital-only with country code
    const cleanPhone = data.phone.trim().replace(/[^0-9]/g, '');
    const text = encodeURIComponent(data.message);
    return `https://wa.me/${cleanPhone}${text ? `?text=${text}` : ''}`;
  },

  wifi: (data: WifiPayload): string => {
    // Format: WIFI:S:SSID;T:SECURITY;P:PASSWORD;H:HIDDEN;;
    const ssid = escapeWifiString(data.ssid);
    const password = data.password ? escapeWifiString(data.password) : '';
    const security = data.security || 'nopass';
    const hidden = data.hidden ? 'true' : 'false';

    return `WIFI:S:${ssid};T:${security};P:${password};H:${hidden};;`;
  },

  location: (data: LocationPayload): string => {
    // Standard geo:lat,lng can sometimes fail on default Apple cameras.
    // A Google Maps query URL is 100% universal across all iOS, Android, and web platforms!
    return `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`;
  },

  vcard: (data: VCardPayload): string => {
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${data.lastName.trim()};${data.firstName.trim()};;;`,
      `FN:${data.firstName.trim()} ${data.lastName.trim()}`,
    ];

    if (data.organization) {
      lines.push(`ORG:${data.organization.trim()}`);
    }
    if (data.title) {
      lines.push(`TITLE:${data.title.trim()}`);
    }
    if (data.phone) {
      const cleanPhone = data.phone.trim();
      lines.push(`TEL;TYPE=CELL:${cleanPhone}`);
    }
    if (data.email) {
      lines.push(`EMAIL;TYPE=PREF,INTERNET:${data.email.trim()}`);
    }
    if (data.url) {
      let url = data.url.trim();
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
      lines.push(`URL:${url}`);
    }
    if (data.address) {
      lines.push(`ADR;TYPE=WORK:;;${data.address.trim()};;;;`);
    }

    lines.push('END:VCARD');
    return lines.join('\r\n');
  },

  event: (data: EventPayload): string => {
    // Format DTSTART/DTEND to YYYYMMDDTHHMMSSZ (UTC preferred, but we handle standard string sanitization)
    const formatDateTime = (dtStr: string): string => {
      if (!dtStr) return '';
      // Remove symbols to fit iCal format: YYYYMMDDTHHMMSS
      return dtStr.replace(/[-:]/g, '').split('.')[0];
    };

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${data.title.trim()}`,
    ];

    if (data.location) {
      lines.push(`LOCATION:${data.location.trim()}`);
    }
    if (data.description) {
      lines.push(`DESCRIPTION:${data.description.trim()}`);
    }
    if (data.start) {
      lines.push(`DTSTART:${formatDateTime(data.start)}`);
    }
    if (data.end) {
      lines.push(`DTEND:${formatDateTime(data.end)}`);
    }

    lines.push('END:VEVENT');
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  },

  crypto: (data: CryptoPayload): string => {
    const coinScheme = data.coin.toLowerCase().trim();
    const address = data.address.trim();
    const amountStr = data.amount ? `?amount=${data.amount.trim()}` : '';
    return `${coinScheme}:${address}${amountStr}`;
  },

  upi: (data: UpiPayload): string => {
    const vpa = encodeURIComponent(data.vpa.trim());
    const name = encodeURIComponent(data.name.trim());
    const amount = data.amount ? `&am=${encodeURIComponent(data.amount.trim())}` : '';
    const note = data.note ? `&tn=${encodeURIComponent(data.note.trim())}` : '';
    return `upi://pay?pa=${vpa}&pn=${name}${amount}${note}`;
  },

  custom: (data: CustomPayload): string => {
    return data.payload;
  },
};

// Precise and helpful validation helpers
export const qrValidators = {
  url: (url: string): string | null => {
    if (!url || url.trim() === '') return 'URL cannot be empty.';
    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
    if (!pattern.test(url.trim())) {
      return 'Please enter a valid URL (e.g., example.com or https://example.com).';
    }
    return null;
  },

  email: (email: string): string | null => {
    if (!email || email.trim() === '') return 'Email cannot be empty.';
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!pattern.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    return null;
  },

  phone: (phone: string): string | null => {
    if (!phone || phone.trim() === '') return 'Phone number cannot be empty.';
    // Basic global digits check, supports +, spaces, parentheses, dashes
    const pattern = /^\+?[0-9\s\-()]{7,18}$/;
    if (!pattern.test(phone.trim())) {
      return 'Please enter a valid phone number.';
    }
    return null;
  },

  latitude: (lat: number | string): string | null => {
    const val = typeof lat === 'string' ? parseFloat(lat) : lat;
    if (isNaN(val) || val < -90 || val > 90) {
      return 'Latitude must be a valid number between -90 and 90.';
    }
    return null;
  },

  longitude: (lng: number | string): string | null => {
    const val = typeof lng === 'string' ? parseFloat(lng) : lng;
    if (isNaN(val) || val < -180 || val > 180) {
      return 'Longitude must be a valid number between -180 and 180.';
    }
    return null;
  },

  wifi: (ssid: string, security: string, password?: string): string | null => {
    if (!ssid || ssid.trim() === '') return 'SSID/Network Name cannot be empty.';
    if (security !== 'nopass' && (!password || password.trim() === '')) {
      return 'Password is required for secured network.';
    }
    if (security !== 'nopass' && password && password.length < 4) {
      return 'Password must be at least 4 characters.';
    }
    return null;
  },

  upi: (vpa: string, name: string): string | null => {
    if (!vpa || vpa.trim() === '') return 'UPI ID (VPA) cannot be empty.';
    if (!name || name.trim() === '') return 'Recipient Name cannot be empty.';
    // Standard UPI virtual address: name@bank
    if (!vpa.includes('@')) {
      return 'Please enter a valid UPI ID (e.g., recipient@bank).';
    }
    return null;
  },
};
