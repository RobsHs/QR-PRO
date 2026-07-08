/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
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
  AlertCircle,
} from 'lucide-react';
import { QrType } from '../types';
import { qrPayloadBuilders, qrValidators } from '../utils/qrPayloads';

interface PayloadFormsProps {
  activeType: QrType;
  setActiveType: (type: QrType) => void;
  onChange: (payload: string, isValid: boolean, title: string) => void;
}

const QR_TYPE_CONFIGS = [
  { type: 'url', label: 'URL / Link', icon: Link, desc: 'Redirect scanners to any website URL.' },
  { type: 'text', label: 'Plain Text', icon: FileText, desc: 'Display a plain text message to scanners.' },
  { type: 'email', label: 'Email', icon: Mail, desc: 'Send an email with subject and body.' },
  { type: 'phone', label: 'Phone', icon: Phone, desc: 'Prompt to dial a telephone number.' },
  { type: 'sms', label: 'SMS', icon: MessageSquare, desc: 'Send a pre-filled SMS message.' },
  { type: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, desc: 'Open a chat with pre-filled message.' },
  { type: 'wifi', label: 'WiFi Network', icon: Wifi, desc: 'Connect to a secure WiFi network instantly.' },
  { type: 'location', label: 'Location', icon: MapPin, desc: 'Open coordinates on Google Maps.' },
  { type: 'vcard', label: 'vCard Contact', icon: Contact, desc: 'Add a professional contact card to phones.' },
  { type: 'event', label: 'Calendar Event', icon: Calendar, desc: 'Add scheduled events to digital calendars.' },
  { type: 'crypto', label: 'Cryptocurrency', icon: Coins, desc: 'Request Bitcoin, Ethereum, Sol, etc. payments.' },
  { type: 'upi', label: 'UPI Payment', icon: CreditCard, desc: 'Request zero-fee UPI payments (India).' },
  { type: 'custom', label: 'Custom Text', icon: Code, desc: 'Write raw formats or developer strings.' },
] as const;

export function PayloadForms({ activeType, setActiveType, onChange }: PayloadFormsProps) {
  // State for each payload form type
  const [urlData, setUrlData] = useState({ url: 'https://google.com' });
  const [textData, setTextData] = useState({ text: 'Hello from QR Generator Pro!' });
  const [emailData, setEmailData] = useState({ email: 'recipient@domain.com', subject: 'Inquiry', body: 'Hello there,' });
  const [phoneData, setPhoneData] = useState({ phone: '+628123456789' });
  const [smsData, setSmsData] = useState({ phone: '+628123456789', message: 'Hi, please call me back.' });
  const [whatsappData, setWhatsappData] = useState({ phone: '628123456789', message: 'Hello! I would like to inquire about your services.' });
  const [wifiData, setWifiData] = useState({ ssid: 'Home_WiFi_5G', password: 'SecretPassword123', security: 'WPA' as const, hidden: false });
  const [locationData, setLocationData] = useState({ latitude: '-6.200000', longitude: '106.816666' });
  const [vcardData, setVcardData] = useState({ firstName: 'Alex', lastName: 'Morgan', organization: 'Acme Corp', phone: '+628123456789', email: 'alex@acme.com', url: 'acme.com', address: '123 Main St, Jakarta', title: 'Director' });
  const [eventData, setEventData] = useState({ title: 'Product Launch Showcase', location: 'Grand Ballroom & Virtual', description: 'Join us live for the grand reveal!', start: '2026-07-15T10:00', end: '2026-07-15T12:00' });
  const [cryptoData, setCryptoData] = useState({ coin: 'bitcoin', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', amount: '0.005' });
  const [upiData, setUpiData] = useState({ vpa: 'merchant@upi', name: 'Acme Store', amount: '150.00', note: 'Order #908' });
  const [customData, setCustomData] = useState({ payload: '{ "app_id": "qr_gen_400" }' });

  // Error messaging states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Trigger QR generation whenever inputs change
  useEffect(() => {
    let payload = '';
    let isValid = true;
    let title = '';
    let currentErr: string | null = null;

    try {
      switch (activeType) {
        case 'url':
          currentErr = qrValidators.url(urlData.url);
          payload = qrPayloadBuilders.url(urlData);
          title = `Link: ${urlData.url.substring(0, 30)}${urlData.url.length > 30 ? '...' : ''}`;
          break;
        case 'text':
          isValid = textData.text.trim().length > 0;
          if (!isValid) currentErr = 'Text cannot be empty.';
          payload = qrPayloadBuilders.text(textData);
          title = `Text: ${textData.text.substring(0, 25)}${textData.text.length > 25 ? '...' : ''}`;
          break;
        case 'email':
          currentErr = qrValidators.email(emailData.email);
          payload = qrPayloadBuilders.email(emailData);
          title = `Mail to: ${emailData.email}`;
          break;
        case 'phone':
          currentErr = qrValidators.phone(phoneData.phone);
          payload = qrPayloadBuilders.phone(phoneData);
          title = `Phone: ${phoneData.phone}`;
          break;
        case 'sms':
          currentErr = qrValidators.phone(smsData.phone);
          payload = qrPayloadBuilders.sms(smsData);
          title = `SMS to: ${smsData.phone}`;
          break;
        case 'whatsapp':
          // Must have numbers only
          const purePhone = whatsappData.phone.replace(/[^0-9]/g, '');
          if (purePhone.length < 8) currentErr = 'WhatsApp phone must contain a valid country code and digit prefix.';
          payload = qrPayloadBuilders.whatsapp(whatsappData);
          title = `WhatsApp: ${whatsappData.phone}`;
          break;
        case 'wifi':
          currentErr = qrValidators.wifi(wifiData.ssid, wifiData.security, wifiData.password);
          payload = qrPayloadBuilders.wifi(wifiData);
          title = `WiFi: ${wifiData.ssid}`;
          break;
        case 'location':
          currentErr = qrValidators.latitude(locationData.latitude) || qrValidators.longitude(locationData.longitude);
          payload = qrPayloadBuilders.location({
            latitude: parseFloat(locationData.latitude) || 0,
            longitude: parseFloat(locationData.longitude) || 0,
          });
          title = `Location: ${locationData.latitude}, ${locationData.longitude}`;
          break;
        case 'vcard':
          isValid = vcardData.firstName.trim().length > 0 || vcardData.lastName.trim().length > 0;
          if (!isValid) currentErr = 'First name or Last name is required for vCard.';
          payload = qrPayloadBuilders.vcard(vcardData);
          title = `vCard: ${vcardData.firstName} ${vcardData.lastName}`;
          break;
        case 'event':
          isValid = eventData.title.trim().length > 0;
          if (!isValid) currentErr = 'Event Title cannot be empty.';
          payload = qrPayloadBuilders.event(eventData);
          title = `Event: ${eventData.title}`;
          break;
        case 'crypto':
          isValid = cryptoData.address.trim().length > 10;
          if (!isValid) currentErr = 'Please enter a valid wallet address.';
          payload = qrPayloadBuilders.crypto(cryptoData);
          title = `${cryptoData.coin.toUpperCase()}: ${cryptoData.address.substring(0, 12)}...`;
          break;
        case 'upi':
          currentErr = qrValidators.upi(upiData.vpa, upiData.name);
          payload = qrPayloadBuilders.upi(upiData);
          title = `UPI: ${upiData.name} (${upiData.amount ? `₹${upiData.amount}` : 'Open Amount'})`;
          break;
        case 'custom':
          isValid = customData.payload.trim().length > 0;
          if (!isValid) currentErr = 'Custom payload cannot be empty.';
          payload = qrPayloadBuilders.custom(customData);
          title = `Raw Payload: ${customData.payload.substring(0, 25)}...`;
          break;
      }
    } catch (e) {
      isValid = false;
      currentErr = 'Error structuring payload.';
    }

    setErrorMsg(currentErr);
    onChange(payload, isValid && !currentErr, title);
  }, [activeType, urlData, textData, emailData, phoneData, smsData, whatsappData, wifiData, locationData, vcardData, eventData, cryptoData, upiData, customData]);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Horizontal Scrollable Tabs */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
          Select QR Content Type
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x mask-gradient">
          {QR_TYPE_CONFIGS.map((cfg) => {
            const Icon = cfg.icon;
            const isSelected = activeType === cfg.type;
            return (
              <button
                key={cfg.type}
                onClick={() => setActiveType(cfg.type)}
                className={`snap-start flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-xs whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
                id={`payload-tab-${cfg.type}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Payload Settings Grid Cards */}
      <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-5 md:p-6 shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5 font-semibold tracking-wide uppercase">
          {QR_TYPE_CONFIGS.find((c) => c.type === activeType)?.desc}
        </p>

        {/* URL Form */}
        {activeType === 'url' && (
          <div className="flex flex-col gap-2">
            <label htmlFor="url-input" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Destination URL
            </label>
            <input
              id="url-input"
              type="text"
              placeholder="e.g., example.com"
              value={urlData.url}
              onChange={(e) => setUrlData({ url: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
            />
          </div>
        )}

        {/* Plain Text Form */}
        {activeType === 'text' && (
          <div className="flex flex-col gap-2">
            <label htmlFor="text-input" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Text Message
            </label>
            <textarea
              id="text-input"
              placeholder="Type your message here..."
              value={textData.text}
              onChange={(e) => setTextData({ text: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium resize-none"
            />
          </div>
        )}

        {/* Email Form */}
        {activeType === 'email' && (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email-to" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Recipient Email
              </label>
              <input
                id="email-to"
                type="email"
                placeholder="recipient@domain.com"
                value={emailData.email}
                onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email-subject" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Subject Line
              </label>
              <input
                id="email-subject"
                type="text"
                placeholder="Inquiry or Hello"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email-body" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Email Body
              </label>
              <textarea
                id="email-body"
                placeholder="Type the pre-filled email body message..."
                value={emailData.body}
                onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium resize-none"
              />
            </div>
          </div>
        )}

        {/* Phone Form */}
        {activeType === 'phone' && (
          <div className="flex flex-col gap-2">
            <label htmlFor="phone-input" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Phone Number
            </label>
            <input
              id="phone-input"
              type="tel"
              placeholder="+628123456789"
              value={phoneData.phone}
              onChange={(e) => setPhoneData({ phone: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
            />
          </div>
        )}

        {/* SMS Form */}
        {activeType === 'sms' && (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="sms-phone" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Phone Number
              </label>
              <input
                id="sms-phone"
                type="tel"
                placeholder="+628123456789"
                value={smsData.phone}
                onChange={(e) => setSmsData({ ...smsData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sms-msg" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Default Message
              </label>
              <textarea
                id="sms-msg"
                placeholder="Message body..."
                value={smsData.message}
                onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium resize-none"
              />
            </div>
          </div>
        )}

        {/* WhatsApp Form */}
        {activeType === 'whatsapp' && (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="wa-phone" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Phone with Country Code (numbers only, e.g., 628123456789)
              </label>
              <input
                id="wa-phone"
                type="text"
                placeholder="628123456789"
                value={whatsappData.phone}
                onChange={(e) => setWhatsappData({ ...whatsappData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="wa-msg" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Default WhatsApp Message
              </label>
              <textarea
                id="wa-msg"
                placeholder="Enter pre-filled WhatsApp chat text..."
                value={whatsappData.message}
                onChange={(e) => setWhatsappData({ ...whatsappData, message: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium resize-none"
              />
            </div>
          </div>
        )}

        {/* WiFi Form */}
        {activeType === 'wifi' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
              <label htmlFor="wifi-ssid" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                WiFi Network Name (SSID)
              </label>
              <input
                id="wifi-ssid"
                type="text"
                placeholder="Home_WiFi_5G"
                value={wifiData.ssid}
                onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="wifi-security" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Security Protocol
              </label>
              <select
                id="wifi-security"
                value={wifiData.security}
                onChange={(e) => setWifiData({ ...wifiData, security: e.target.value as any })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (Unsecured)</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="wifi-pass" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Network Password
              </label>
              <input
                id="wifi-pass"
                type="password"
                placeholder="Network password"
                value={wifiData.password}
                disabled={wifiData.security === 'nopass'}
                onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium disabled:opacity-50"
              />
            </div>
            <div className="flex items-center gap-2 col-span-1 md:col-span-2 pt-2">
              <input
                id="wifi-hidden"
                type="checkbox"
                checked={wifiData.hidden}
                onChange={(e) => setWifiData({ ...wifiData, hidden: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800"
              />
              <label htmlFor="wifi-hidden" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 select-none">
                Hidden SSID Network
              </label>
            </div>
          </div>
        )}

        {/* Location Form */}
        {activeType === 'location' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="loc-lat" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Latitude (-90 to 90)
              </label>
              <input
                id="loc-lat"
                type="number"
                step="any"
                placeholder="-6.200000"
                value={locationData.latitude}
                onChange={(e) => setLocationData({ ...locationData, latitude: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="loc-lng" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Longitude (-180 to 180)
              </label>
              <input
                id="loc-lng"
                type="number"
                step="any"
                placeholder="106.816666"
                value={locationData.longitude}
                onChange={(e) => setLocationData({ ...locationData, longitude: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
          </div>
        )}

        {/* vCard Form */}
        {activeType === 'vcard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="vc-first" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                First Name
              </label>
              <input
                id="vc-first"
                type="text"
                placeholder="Alex"
                value={vcardData.firstName}
                onChange={(e) => setVcardData({ ...vcardData, firstName: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="vc-last" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Last Name
              </label>
              <input
                id="vc-last"
                type="text"
                placeholder="Morgan"
                value={vcardData.lastName}
                onChange={(e) => setVcardData({ ...vcardData, lastName: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="vc-phone" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Phone
              </label>
              <input
                id="vc-phone"
                type="tel"
                placeholder="+628123456789"
                value={vcardData.phone}
                onChange={(e) => setVcardData({ ...vcardData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="vc-email" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <input
                id="vc-email"
                type="email"
                placeholder="alex@acme.com"
                value={vcardData.email}
                onChange={(e) => setVcardData({ ...vcardData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="vc-org" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Organization
              </label>
              <input
                id="vc-org"
                type="text"
                placeholder="Acme Corp"
                value={vcardData.organization}
                onChange={(e) => setVcardData({ ...vcardData, organization: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="vc-title" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Title
              </label>
              <input
                id="vc-title"
                type="text"
                placeholder="Director"
                value={vcardData.title}
                onChange={(e) => setVcardData({ ...vcardData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="vc-url" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Website
              </label>
              <input
                id="vc-url"
                type="text"
                placeholder="acme.com"
                value={vcardData.url}
                onChange={(e) => setVcardData({ ...vcardData, url: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="vc-address" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Full Address
              </label>
              <input
                id="vc-address"
                type="text"
                placeholder="123 Main St, Jakarta"
                value={vcardData.address}
                onChange={(e) => setVcardData({ ...vcardData, address: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
          </div>
        )}

        {/* Calendar Event Form */}
        {activeType === 'event' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
              <label htmlFor="evt-title" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Event Title
              </label>
              <input
                id="evt-title"
                type="text"
                placeholder="Product Launch Showcase"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="evt-start" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Start Date & Time
              </label>
              <input
                id="evt-start"
                type="datetime-local"
                value={eventData.start}
                onChange={(e) => setEventData({ ...eventData, start: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="evt-end" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                End Date & Time
              </label>
              <input
                id="evt-end"
                type="datetime-local"
                value={eventData.end}
                onChange={(e) => setEventData({ ...eventData, end: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
              <label htmlFor="evt-loc" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Location (Physical or Link)
              </label>
              <input
                id="evt-loc"
                type="text"
                placeholder="Grand Ballroom & Virtual"
                value={eventData.location}
                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
              <label htmlFor="evt-desc" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Description
              </label>
              <textarea
                id="evt-desc"
                placeholder="Add session details, conference codes, etc."
                value={eventData.description}
                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium resize-none"
              />
            </div>
          </div>
        )}

        {/* Crypto Address Form */}
        {activeType === 'crypto' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="crypt-coin" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Cryptocurrency
              </label>
              <select
                id="crypt-coin"
                value={cryptoData.coin}
                onChange={(e) => setCryptoData({ ...cryptoData, coin: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              >
                <option value="bitcoin">Bitcoin (BTC)</option>
                <option value="ethereum">Ethereum (ETH)</option>
                <option value="solana">Solana (SOL)</option>
                <option value="litecoin">Litecoin (LTC)</option>
                <option value="dogecoin">Dogecoin (DOGE)</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
              <label htmlFor="crypt-addr" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Wallet Address
              </label>
              <input
                id="crypt-addr"
                type="text"
                placeholder="Enter public address"
                value={cryptoData.address}
                onChange={(e) => setCryptoData({ ...cryptoData, address: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium font-mono text-xs"
              />
            </div>
            <div className="flex flex-col gap-2 col-span-1 md:col-span-3">
              <label htmlFor="crypt-amt" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Requested Amount (Optional)
              </label>
              <input
                id="crypt-amt"
                type="text"
                placeholder="0.005"
                value={cryptoData.amount}
                onChange={(e) => setCryptoData({ ...cryptoData, amount: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
          </div>
        )}

        {/* UPI Payment Form */}
        {activeType === 'upi' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="upi-vpa" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                UPI ID (VPA)
              </label>
              <input
                id="upi-vpa"
                type="text"
                placeholder="merchant@upi"
                value={upiData.vpa}
                onChange={(e) => setUpiData({ ...upiData, vpa: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="upi-name" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Recipient Name
              </label>
              <input
                id="upi-name"
                type="text"
                placeholder="Acme Store"
                value={upiData.name}
                onChange={(e) => setUpiData({ ...upiData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="upi-amt" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Amount (₹ - Optional)
              </label>
              <input
                id="upi-amt"
                type="number"
                step="any"
                placeholder="150.00"
                value={upiData.amount}
                onChange={(e) => setUpiData({ ...upiData, amount: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="upi-note" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Transaction Note (Optional)
              </label>
              <input
                id="upi-note"
                type="text"
                placeholder="Order #908"
                value={upiData.note}
                onChange={(e) => setUpiData({ ...upiData, note: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
              />
            </div>
          </div>
        )}

        {/* Custom Developer Payload Form */}
        {activeType === 'custom' && (
          <div className="flex flex-col gap-2">
            <label htmlFor="custom-input" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Custom QR Raw Data Payload
            </label>
            <textarea
              id="custom-input"
              placeholder="Enter any raw string payload..."
              value={customData.payload}
              onChange={(e) => setCustomData({ payload: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white transition-all font-mono text-xs resize-none"
            />
          </div>
        )}

        {/* Inline Input Error/Alert Messaging */}
        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
