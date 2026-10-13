import { useState } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import {
    Shield,
    Camera,
    Bell,
    Lock,
    Palette,
    Globe,
    Save,
    RotateCcw,
} from 'lucide-react';

const sections = [
  { id: 'general', label: 'General', icon: Globe },
  // { id: 'proctoring', label: 'Proctoring Rules', icon: Shield },
  // { id: 'camera', label: 'Camera & Media', icon: Camera },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'appearance', label: 'Appearance', icon: Palette },
]

export default function Settings() {
  const {darkMode, setDarkMode} = useTheme();
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    institutionName: 'University of Technology',
    timezone: 'UTC-5 (Eastern)',
    language: 'English',
    // faceDetection: true,
    // tabSwitchDetection: true,
    // phoneDetection: true,
    // noiseDetection: true,
    // copyPasteBlock: true,
    // screenShareBlock: true,
    // maxViolations: 5,
    // autoTerminate: true,
    // riskThreshold: 70,
    // cameraRequired: true,
    // microphoneRequired: true,
    // screenRecording: true,
    // photoCapture: true,
    // captureInterval: 30,
    emailNotifications: true,
    pushNotifications: true,
    // violationAlerts: true,
    examReminders: true,
    dailyReports: false,
    twoFactorAuth: false,
    sessionTimeout: 30,
    // ipWhitelist: false,
    darkMode: false,
    // compactView: false,
  });

  //here we make handle save & handle reset functions for the settings, which will be used in the save and reset buttons
  // for temporary bases we make handlesave and reset functions for just dark and light mode
  const handleSave = () => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }

  const handleReset = () => {
    localStorage.removeItem('darkMode');
    setDarkMode(false);
  }

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-indigo-600' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-56 shrink-0">
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-indigo-400/60 p-2 sticky top-20">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSection === section.id
                    ? 'bg-indigo-50 dark:bg-[#334155] text-indigo-700 dark:text-[#F8FAFC]'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6">
        {activeSection === 'general' && (
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-indigo-400/60 p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-[#F8FAFC] mb-1">General Settings</h3>
            <p className="text-sm text-slate-500 dark:text-[#94A3B8] mb-6">Manage your institution and system preferences</p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-[#CBD5E1] mb-1.5">Enter Institute Name</label>
                <input
                  type="text"
                  value={settings.institutionName}
                  onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-indigo-500/70 dark:text-[#F8FAFC] rounded-xl text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-[#CBD5E1] mb-1.5">Your Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 bg-white dark:bg-[#1E293B] dark:border-indigo-500/70 dark:text-[#F8FAFC]"
                >
                  <option>UTC-5 (Eastern)</option>
                  <option>UTC-6 (Central)</option>
                  <option>UTC-7 (Mountain)</option>
                  <option>UTC-8 (Pacific)</option>
                  <option>UTC+0 (GMT)</option>
                  <option>UTC+5:30 (IST)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-[#CBD5E1] mb-1.5">Select Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 bg-white dark:bg-[#1E293B] dark:border-indigo-500/70 dark:text-[#F8FAFC]"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Hindi</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-indigo-400/60 p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-[#F8FAFC] mb-1">Manage Notification</h3>
            <p className="text-sm text-slate-500 dark:text-[#94A3B8] mb-6">Manage how you receive alerts and updates</p>
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
                { key: 'examReminders', label: 'Exam Reminders', desc: 'Reminders before exam start' },
                { key: 'dailyReports', label: 'Daily Reports', desc: 'Receive daily summary reports' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-[#F8FAFC]">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5 dark:text-[#94A3B8]">{item.desc}</p>
                  </div>
                  <Toggle
                    enabled={settings[item.key]}
                    onChange={() => toggleSetting(item.key)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'security' && (
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-indigo-400/60 p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-[#F8FAFC] mb-1">Security Settings</h3>
            <p className="text-sm text-slate-500 dark:text-[#94A3B8] mb-6">Configure security and access control</p>
            <div className="space-y-4">
              {[
                { key: 'twoFactorAuth', label: 'Two-Factor Authentication', desc: 'Require 2FA for login' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-[#F8FAFC]">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5 dark:text-[#94A3B8]">{item.desc}</p>
                  </div>
                  <Toggle
                    enabled={settings[item.key]}
                    onChange={() => toggleSetting(item.key)}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-[#F8FAFC] mb-1.5">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                  className="w-32 px-4 py-2.5 border border-slate-200 dark:border-indigo-400/60 dark:bg-[#1E293B] dark:text-[#F8FAFC] rounded-xl text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'appearance' && (
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-indigo-400/60 p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-[#F8FAFC] mb-1">Appearance</h3>
            <p className="text-sm text-slate-500 dark:text-[#94A3B8] mb-6">Customize the look and feel</p>
            <div className="space-y-4">
              {[
                { key: 'darkMode', label: 'Dark Mode', desc: 'Switch to dark theme' },
                // { key: 'compactView', label: 'Compact View', desc: 'Use a more compact layout' }, we use in future
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-[#F8FAFC]">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5 dark:text-[#94A3B8]">{item.desc}</p>
                  </div>
                  <Toggle
                    enabled={darkMode}
                    onChange={() => setDarkMode((prev) => !prev)}
                  />
                </div>
              ))}
              <div>
                {/* <label className="block text-sm font-medium text-slate-700 dark:text-[#F8FAFC] mb-3">Theme Color</label>
                <div className="flex items-center gap-3">
                  {['#6366f1', '#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'].map(
                    (color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-transparent hover:ring-slate-300 transition-all"
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                </div> */}
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 dark:bg-white dark:text-indigo-500 dark:hover:bg-white/90 border border-slate-200 dark:border-indigo-400/60 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <RotateCcw className="w-4 h-4" />
            Reset Defaults
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none dark:transition-all dark:hover:from-indigo-700 dark:hover:to-purple-700 dark:duration-150" >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
