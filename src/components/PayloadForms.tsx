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
          let waPhone = whatsappData.phone.trim();
          if (waPhone.startsWith('+')) {
            waPhone = waPhone.substring(1);
          }
          if (waPhone.startsWith('0')) {
            waPhone = '62' + waPhone.substring(1);
          }
          const purePhone = waPhone.replace(/[^0-9]/g, '');
          if (purePhone.length < 8) {
            currentErr = 'Nomor WhatsApp tidak valid. Pastikan nomor benar (minimal 8 digit). / WhatsApp phone must contain a valid country code (min 8 digits).';
          }
          payload = qrPayloadBuilders.whatsapp(whatsappData);
          title = `WhatsApp: ${waPhone}`;
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
  }, [activeType, urlData, textData, emailData, phoneData, smsData, whatsappData, wifiData, locationData, vcardData, eventData, cryptoData, upiData, customData]);  return (
    <div className="flex flex-col gap-6">
      {/* 1. Horizontal Scrollable Tabs */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-foreground">
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
                className={`snap-start flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-xs whitespace-nowrap cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/10'
                    : 'bg-card border-border text-muted-foreground hover:bg-secondary hover:border-border-hover hover:text-foreground'
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
      <div className="bg-card rounded-2xl border border-border p-5 md:p-6 shadow-sm transition-all duration-300">
        <p className="text-xs text-muted-foreground mb-5 font-bold tracking-wide uppercase">
          {QR_TYPE_CONFIGS.find((c) => c.type === activeType)?.desc}
        </p>

        {/* URL Form */}
        {activeType === 'url' && (
          <div className="flex flex-col gap-2">
            <label htmlFor="url-input" className="text-xs font-bold text-muted-foreground">
              Destination URL
            </label>
            <input
              id="url-input"
              type="text"
              placeholder="e.g., example.com"
              value={urlData.url}
              onChange={(e) => setUrlData({ url: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
            />
          </div>
        )}

        {/* Plain Text Form */}
        {activeType === 'text' && (
          <div className="flex flex-col gap-2">
            <label htmlFor="text-input" className="text-xs font-bold text-muted-foreground">
              Text Message
            </label>
            <textarea
              id="text-input"
              placeholder="Type your message here..."
              value={textData.text}
              onChange={(e) => setTextData({ text: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold resize-none"
            />
          </div>
        )}

        {/* Email Form */}
        {activeType === 'email' && (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email-to" className="text-xs font-bold text-muted-foreground">
                Recipient Email
              </label>
              <input
                id="email-to"
                type="email"
                placeholder="recipient@domain.com"
                value={emailData.email}
                onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email-subject" className="text-xs font-bold text-muted-foreground">
                Subject Line
              </label>
              <input
                id="email-subject"
                type="text"
                placeholder="Inquiry or Hello"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email-body" className="text-xs font-bold text-muted-foreground">
                Email Body
              </label>
              <textarea
                id="email-body"
                placeholder="Type the pre-filled email body message..."
                value={emailData.body}
                onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold resize-none"
              />
            </div>
          </div>
        )}

        {/* Phone Form */}
        {activeType === 'phone' && (
          <div className="flex flex-col gap-2">
            <label htmlFor="phone-input" className="text-xs font-bold text-muted-foreground">
              Phone Number
            </label>
            <input
              id="phone-input"
              type="tel"
              placeholder="+628123456789"
              value={phoneData.phone}
              onChange={(e) => setPhoneData({ phone: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
            />
          </div>
        )}

        {/* SMS Form */}
        {activeType === 'sms' && (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="sms-phone" className="text-xs font-bold text-muted-foreground">
                Phone Number
              </label>
              <input
                id="sms-phone"
                type="tel"
                placeholder="+628123456789"
                value={smsData.phone}
                onChange={(e) => setSmsData({ ...smsData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sms-msg" className="text-xs font-bold text-muted-foreground">
                Default Message
              </label>
              <textarea
                id="sms-msg"
                placeholder="Message body..."
                value={smsData.message}
                onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold resize-none"
              />
            </div>
          </div>
        )}

        {/* WhatsApp Form */}
        {activeType === 'whatsapp' && (
          <div className="grid grid-cols-1 gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center gap-2">
                <label htmlFor="wa-phone" className="text-xs font-bold text-muted-foreground">
                  Nomor WhatsApp / WhatsApp Number
                </label>
                <span className="text-[10px] text-muted-foreground font-semibold text-right">
                  Mendukung format lokal (08...) & internasional (+62...)
                </span>
              </div>
              <input
                id="wa-phone"
                type="text"
                placeholder="Contoh: 08123456789 atau 628123456789"
                value={whatsappData.phone}
                onChange={(e) => setWhatsappData({ ...whatsappData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />

              {/* Real-time normalization helper display */}
              {whatsappData.phone.trim() && (
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    Format yang dikodekan: <strong>
                      {(() => {
                        let phone = whatsappData.phone.trim();
                        if (phone.startsWith('+')) phone = phone.substring(1);
                        if (phone.startsWith('0')) phone = '62' + phone.substring(1);
                        return phone.replace(/[^0-9]/g, '');
                      })()}
                    </strong> (Aman untuk kirim pesan langsung)
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center gap-2">
                <label htmlFor="wa-msg" className="text-xs font-bold text-muted-foreground">
                  Isi Pesan Otomatis / Default Message
                </label>
                <span className="text-[10px] text-muted-foreground font-semibold text-right">
                  Pesan yang langsung terisi di chat WhatsApp
                </span>
              </div>
              <textarea
                id="wa-msg"
                placeholder="Tulis pesan otomatis di sini..."
                value={whatsappData.message}
                onChange={(e) => setWhatsappData({ ...whatsappData, message: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold resize-none"
              />

              {/* Message Templates / Preset Chips */}
              <div className="flex flex-col gap-1.5 mt-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Gunakan Template Pesan Cepat:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Tanya Produk', text: 'Halo Admin, saya tertarik dengan produk Anda dan ingin bertanya lebih lanjut.' },
                    { label: 'Tanya Promo', text: 'Halo! Apakah ada promo atau diskon menarik yang sedang berlangsung saat ini?' },
                    { label: 'Daftar Acara', text: 'Halo, saya ingin melakukan konfirmasi pendaftaran untuk acara Anda.' },
                    { label: 'Layanan Pelanggan', text: 'Halo Tim Support, saya membutuhkan bantuan terkait layanan Anda.' },
                  ].map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setWhatsappData({ ...whatsappData, message: preset.text })}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-secondary hover:bg-secondary-hover text-foreground border border-border cursor-pointer transition-all"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WiFi Form */}
        {activeType === 'wifi' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
              <label htmlFor="wifi-ssid" className="text-xs font-bold text-muted-foreground">
                WiFi Network Name (SSID)
              </label>
              <input
                id="wifi-ssid"
                type="text"
                placeholder="Home_WiFi_5G"
                value={wifiData.ssid}
                onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="wifi-security" className="text-xs font-bold text-muted-foreground">
                Security Protocol
              </label>
              <select
                id="wifi-security"
                value={wifiData.security}
                onChange={(e) => setWifiData({ ...wifiData, security: e.target.value as any })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold cursor-pointer"
              >
                <option value="WPA" className="bg-card">WPA/WPA2</option>
                <option value="WEP" className="bg-card">WEP</option>
                <option value="nopass" className="bg-card">None (Unsecured)</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="wifi-pass" className="text-xs font-bold text-muted-foreground">
                Network Password
              </label>
              <input
                id="wifi-pass"
                type="password"
                placeholder="Network password"
                value={wifiData.password}
                disabled={wifiData.security === 'nopass'}
                onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold disabled:opacity-50"
              />
            </div>
            <div className="flex items-center gap-2 col-span-1 md:col-span-2 pt-2">
              <input
                id="wifi-hidden"
                type="checkbox"
                checked={wifiData.hidden}
                onChange={(e) => setWifiData({ ...wifiData, hidden: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary bg-secondary border-border"
              />
              <label htmlFor="wifi-hidden" className="text-xs font-bold text-muted-foreground select-none cursor-pointer">
                Hidden SSID Network
              </label>
            </div>
          </div>
        )}

        {/* Location Form */}
        {activeType === 'location' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="loc-lat" className="text-xs font-bold text-muted-foreground">
                Latitude (-90 to 90)
              </label>
              <input
                id="loc-lat"
                type="number"
                step="any"
                placeholder="-6.200000"
                value={locationData.latitude}
                onChange={(e) => setLocationData({ ...locationData, latitude: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="loc-lng" className="text-xs font-bold text-muted-foreground">
                Longitude (-180 to 180)
              </label>
              <input
                id="loc-lng"
                type="number"
                step="any"
                placeholder="106.816666"
                value={locationData.longitude}
                onChange={(e) => setLocationData({ ...locationData, longitude: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
          </div>
        )}

        {/* vCard Form */}
        {activeType === 'vcard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="vc-first" className="text-xs font-bold text-muted-foreground">
                First Name
              </label>
              <input
                id="vc-first"
                type="text"
                placeholder="Alex"
                value={vcardData.firstName}
                onChange={(e) => setVcardData({ ...vcardData, firstName: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="vc-last" className="text-xs font-bold text-muted-foreground">
                Last Name
              </label>
              <input
                id="vc-last"
                type="text"
                placeholder="Morgan"
                value={vcardData.lastName}
                onChange={(e) => setVcardData({ ...vcardData, lastName: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="vc-phone" className="text-xs font-bold text-muted-foreground">
                Phone
              </label>
              <input
                id="vc-phone"
                type="tel"
                placeholder="+628123456789"
                value={vcardData.phone}
                onChange={(e) => setVcardData({ ...vcardData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="vc-email" className="text-xs font-bold text-muted-foreground">
                Email
              </label>
              <input
                id="vc-email"
                type="email"
                placeholder="alex@acme.com"
                value={vcardData.email}
                onChange={(e) => setVcardData({ ...vcardData, email: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="vc-org" className="text-xs font-bold text-muted-foreground">
                Organization
              </label>
              <input
                id="vc-org"
                type="text"
                placeholder="Acme Corp"
                value={vcardData.organization}
                onChange={(e) => setVcardData({ ...vcardData, organization: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="vc-title" className="text-xs font-bold text-muted-foreground">
                Title
              </label>
              <input
                id="vc-title"
                type="text"
                placeholder="Director"
                value={vcardData.title}
                onChange={(e) => setVcardData({ ...vcardData, title: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="vc-url" className="text-xs font-bold text-muted-foreground">
                Website
              </label>
              <input
                id="vc-url"
                type="text"
                placeholder="acme.com"
                value={vcardData.url}
                onChange={(e) => setVcardData({ ...vcardData, url: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="vc-address" className="text-xs font-bold text-muted-foreground">
                Full Address
              </label>
              <input
                id="vc-address"
                type="text"
                placeholder="123 Main St, Jakarta"
                value={vcardData.address}
                onChange={(e) => setVcardData({ ...vcardData, address: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
          </div>
        )}

        {/* Calendar Event Form */}
        {activeType === 'event' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
              <label htmlFor="evt-title" className="text-xs font-bold text-muted-foreground">
                Event Title
              </label>
              <input
                id="evt-title"
                type="text"
                placeholder="Product Launch Showcase"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="evt-start" className="text-xs font-bold text-muted-foreground">
                Start Date & Time
              </label>
              <input
                id="evt-start"
                type="datetime-local"
                value={eventData.start}
                onChange={(e) => setEventData({ ...eventData, start: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="evt-end" className="text-xs font-bold text-muted-foreground">
                End Date & Time
              </label>
              <input
                id="evt-end"
                type="datetime-local"
                value={eventData.end}
                onChange={(e) => setEventData({ ...eventData, end: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
              <label htmlFor="evt-loc" className="text-xs font-bold text-muted-foreground">
                Location (Physical or Link)
              </label>
              <input
                id="evt-loc"
                type="text"
                placeholder="Grand Ballroom & Virtual"
                value={eventData.location}
                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
              <label htmlFor="evt-desc" className="text-xs font-bold text-muted-foreground">
                Description
              </label>
              <textarea
                id="evt-desc"
                placeholder="Add session details, conference codes, etc."
                value={eventData.description}
                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold resize-none"
              />
            </div>
          </div>
        )}

        {/* Crypto Address Form */}
        {activeType === 'crypto' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="crypt-coin" className="text-xs font-bold text-muted-foreground">
                Cryptocurrency
              </label>
              <select
                id="crypt-coin"
                value={cryptoData.coin}
                onChange={(e) => setCryptoData({ ...cryptoData, coin: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold cursor-pointer"
              >
                <option value="bitcoin" className="bg-card">Bitcoin (BTC)</option>
                <option value="ethereum" className="bg-card">Ethereum (ETH)</option>
                <option value="solana" className="bg-card">Solana (SOL)</option>
                <option value="litecoin" className="bg-card">Litecoin (LTC)</option>
                <option value="dogecoin" className="bg-card">Dogecoin (DOGE)</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
              <label htmlFor="crypt-addr" className="text-xs font-bold text-muted-foreground">
                Wallet Address
              </label>
              <input
                id="crypt-addr"
                type="text"
                placeholder="Enter public address"
                value={cryptoData.address}
                onChange={(e) => setCryptoData({ ...cryptoData, address: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-mono text-xs"
              />
            </div>
            <div className="flex flex-col gap-2 col-span-1 md:col-span-3">
              <label htmlFor="crypt-amt" className="text-xs font-bold text-muted-foreground">
                Requested Amount (Optional)
              </label>
              <input
                id="crypt-amt"
                type="text"
                placeholder="0.005"
                value={cryptoData.amount}
                onChange={(e) => setCryptoData({ ...cryptoData, amount: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
          </div>
        )}

        {/* UPI Payment Form */}
        {activeType === 'upi' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="upi-vpa" className="text-xs font-bold text-muted-foreground">
                UPI ID (VPA)
              </label>
              <input
                id="upi-vpa"
                type="text"
                placeholder="merchant@upi"
                value={upiData.vpa}
                onChange={(e) => setUpiData({ ...upiData, vpa: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="upi-name" className="text-xs font-bold text-muted-foreground">
                Recipient Name
              </label>
              <input
                id="upi-name"
                type="text"
                placeholder="Acme Store"
                value={upiData.name}
                onChange={(e) => setUpiData({ ...upiData, name: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="upi-amt" className="text-xs font-bold text-muted-foreground">
                Amount (₹ - Optional)
              </label>
              <input
                id="upi-amt"
                type="number"
                step="any"
                placeholder="150.00"
                value={upiData.amount}
                onChange={(e) => setUpiData({ ...upiData, amount: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="upi-note" className="text-xs font-bold text-muted-foreground">
                Transaction Note (Optional)
              </label>
              <input
                id="upi-note"
                type="text"
                placeholder="Order #908"
                value={upiData.note}
                onChange={(e) => setUpiData({ ...upiData, note: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-semibold"
              />
            </div>
          </div>
        )}

        {/* Custom Developer Payload Form */}
        {activeType === 'custom' && (
          <div className="flex flex-col gap-2">
            <label htmlFor="custom-input" className="text-xs font-bold text-muted-foreground">
              Custom QR Raw Data Payload
            </label>
            <textarea
              id="custom-input"
              placeholder="Enter any raw string payload..."
              value={customData.payload}
              onChange={(e) => setCustomData({ payload: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:border-primary outline-none text-foreground transition-all font-mono text-xs resize-none animate-none"
            />
          </div>
        )}

        {/* Inline Input Error/Alert Messaging */}
        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
