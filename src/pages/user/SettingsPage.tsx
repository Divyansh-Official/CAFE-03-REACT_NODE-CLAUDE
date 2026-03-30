import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { user, updateUser, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const [whatsapp,  setWhatsapp]  = useState(user?.isWhatsAppEnabled ?? true);
  const [language,  setLanguage]  = useState('en');
  const [darkMode,  setDarkMode]  = useState(true);
  const [staffOpen, setStaffOpen] = useState(false);

  const handleSave = () => {
    updateUser({ isWhatsAppEnabled: whatsapp });
    toast.success('Settings saved!');
  };

  const sections = [
    {
      title: 'Notifications',
      icon: '🔔',
      items: [
        {
          label: 'WhatsApp Order Updates',
          description: 'Get order status updates via WhatsApp',
          control: (
            <button
              onClick={() => setWhatsapp(v => !v)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200
                ${whatsapp ? 'bg-success' : 'bg-white/20'}`}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow"
                animate={{ left: whatsapp ? '26px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          ),
        },
      ],
    },
    {
      title: 'Appearance',
      icon: '🎨',
      items: [
        {
          label: 'Dark Mode',
          description: 'Always on — the way it should be 🌑',
          control: (
            <button
              onClick={() => setDarkMode(v => !v)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200
                ${darkMode ? 'bg-primary' : 'bg-white/20'}`}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow"
                animate={{ left: darkMode ? '26px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          ),
        },
      ],
    },
    {
      title: 'Language',
      icon: '🌐',
      items: [
        {
          label: 'App Language',
          description: 'Choose your preferred language',
          control: (
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white
                text-sm outline-none focus:border-primary/60 cursor-pointer"
            >
              <option value="en">🇬🇧 English</option>
              <option value="hi">🇮🇳 हिंदी</option>
              <option value="pa">🇮🇳 ਪੰਜਾਬੀ</option>
            </select>
          ),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-28 max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-bold text-white mb-8">Settings</h1>

        <div className="space-y-5">
          {sections.map(section => (
            <div key={section.title} className="bg-card rounded-2xl border border-white/10 overflow-hidden">
              {/* Section header */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
                <span className="text-lg">{section.icon}</span>
                <h2 className="text-white font-bold text-sm">{section.title}</h2>
              </div>
              {/* Items */}
              {section.items.map(item => (
                <div key={item.label}
                  className="flex items-center justify-between gap-4 px-5 py-4
                    border-b border-white/5 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm">{item.label}</p>
                    <p className="text-text-secondary text-xs mt-0.5">{item.description}</p>
                  </div>
                  <div className="shrink-0">{item.control}</div>
                </div>
              ))}
            </div>
          ))}

          {/* Account section */}
          {user && (
            <div className="bg-card rounded-2xl border border-white/10 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
                <span className="text-lg">👤</span>
                <h2 className="text-white font-bold text-sm">Account</h2>
              </div>
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">{user.name}</p>
                  <p className="text-text-secondary text-xs">{user.phone}</p>
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="text-primary text-xs font-bold hover:underline"
                >
                  Edit Profile →
                </button>
              </div>
              <button
                onClick={() => { clearAuth(); navigate('/'); toast.success('Logged out'); }}
                className="w-full flex items-center gap-3 px-5 py-4 text-red-400 hover:bg-red-400/5
                  transition-colors text-sm font-semibold"
              >
                <span>🚪</span>
                Log Out
              </button>
            </div>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            className="w-full py-3.5 rounded-full bg-bubble-gradient text-white font-bold text-base
              shadow-brand hover:opacity-90 transition-opacity active:scale-95"
          >
            Save Settings
          </button>

          {/* Staff login — subtle link */}
          <div className="pt-4 border-t border-white/10 text-center">
            <button
              onClick={() => setStaffOpen(v => !v)}
              className="text-text-secondary text-xs hover:text-white transition-colors"
            >
              Staff / Admin Access
            </button>

            {staffOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 overflow-hidden"
              >
                <button
                  onClick={() => navigate('/admin/login')}
                  className="w-full py-2.5 rounded-xl border border-white/20 text-text-secondary
                    text-sm font-semibold hover:border-primary/40 hover:text-primary transition-colors"
                >
                  🔐 Go to Staff Login
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;