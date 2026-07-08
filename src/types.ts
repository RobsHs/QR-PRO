/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type QrType =
  | 'url'
  | 'text'
  | 'email'
  | 'phone'
  | 'sms'
  | 'whatsapp'
  | 'wifi'
  | 'location'
  | 'vcard'
  | 'event'
  | 'crypto'
  | 'upi'
  | 'custom';

export interface UrlPayload {
  url: string;
}

export interface TextPayload {
  text: string;
}

export interface EmailPayload {
  email: string;
  subject: string;
  body: string;
}

export interface PhonePayload {
  phone: string;
}

export interface SmsPayload {
  phone: string;
  message: string;
}

export interface WhatsAppPayload {
  phone: string;
  message: string;
}

export interface WifiPayload {
  ssid: string;
  password?: string;
  security: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface LocationPayload {
  latitude: number;
  longitude: number;
}

export interface VCardPayload {
  firstName: string;
  lastName: string;
  organization?: string;
  phone?: string;
  email?: string;
  url?: string;
  address?: string;
  title?: string;
}

export interface EventPayload {
  title: string;
  location?: string;
  description?: string;
  start: string;
  end: string;
}

export interface CryptoPayload {
  coin: string;
  address: string;
  amount?: string;
}

export interface UpiPayload {
  vpa: string; // Virtual Payment Address
  name: string;
  amount?: string;
  note?: string;
}

export interface CustomPayload {
  payload: string;
}

export interface QrStyleSettings {
  moduleStyle: 'square' | 'rounded' | 'dots' | 'circle';
  moduleRoundness: number; // 0 = square, 1 = round circle
  eyeOuterStyle: 'square' | 'rounded' | 'circle' | 'leaf';
  eyeInnerStyle: 'square' | 'rounded' | 'circle' | 'leaf';
  colorType: 'solid' | 'gradient';
  primaryColor: string;
  secondaryColor: string;
  gradientAngle: number;
  backgroundColor: string; // supports hex, transparent
  useCustomEyeColors: boolean;
  eyeOuterColor: string;
  eyeInnerColor: string;
  logoType: 'none' | 'whatsapp' | 'wifi' | 'google' | 'url' | 'phone' | 'custom';
  customLogoUrl?: string;
  logoScale: number; // 0.1 to 0.25
  logoPadding: number; // in pixels
  logoBgColor: string;
  margin: number; // cell size padding units
  resolution: number; // 512, 1024, 2048, 4096
  errorCorrection: 'L' | 'M' | 'Q' | 'H' | 'auto';
  frameStyle: 'none' | 'card' | 'scan-me';
  frameText: string;
  frameColor: string;
  frameTextColor: string;
}

export interface HistoryItem {
  id: string;
  type: QrType;
  title: string;
  payload: string;
  createdAt: string;
  isFavorite: boolean;
  style: QrStyleSettings;
}
