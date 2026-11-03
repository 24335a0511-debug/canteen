import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import StudentDashboard from './components/StudentDashboard';
import CanteenStaffDashboard from './components/CanteenStaffDashboard';
import CanteenAdminDashboard from './components/CanteenAdminDashboard';
import PaymentModal from './components/PaymentModal';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './services/authService';
import { 
  ChefHat, User, Award, Volume2, VolumeX, Sparkles, QrCode, X, 
  Activity, WifiOff, Users, AlertOctagon, HelpCircle, Layers, Flame, Zap, Sliders,
  ChevronDown, ChevronUp, LogOut
} from 'lucide-react';
import './App.css';

const INITIAL_MENU = [
  {
    id: 1,
    name: 'Chole Bhature Special',
    description: 'Two extra-fluffy bhature served with slow-cooked pindi chole, mint chutney, and spiced onions.',
    price: 80,
    category: 'Meals',
    station: 'Meals Tawa',
    isVeg: true,
    inStock: true,
    stockLimit: null,
    prepTime: '7 mins',
    tag: '🔥 Campus Bestseller',
    emoji: '🍛',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'Crispy Masala Dosa',
    description: 'Golden buttery rice crepe loaded with tempered potato masala, served with piping hot sambar & fresh coconut chutney.',
    price: 70,
    category: 'Meals',
    station: 'Meals Tawa',
    isVeg: true,
    inStock: true,
    stockLimit: 3, // Low stock demo
    prepTime: '5 mins',
    tag: '⚡ Fast Prep',
    emoji: '🥞',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    name: 'Mumbai Samosa Pav (2 pcs)',
    description: 'Crunchy golden potato samosas nestled inside fresh buttered ladi pav with sweet tamarind & dry garlic chutney.',
    price: 35,
    category: 'Snacks',
    station: 'Quick Snacks',
    isVeg: true,
    inStock: true,
    stockLimit: null,
    prepTime: '2 mins',
    tag: '⭐ Snack Hit',
    emoji: '🥪',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    name: 'Crispy Paneer Patty',
    description: 'Multi-layered puff pastry stuffed with spiced cottage cheese cubes, sweet bell peppers, and chipotle mayo.',
    price: 35,
    category: 'Snacks',
    station: 'Quick Snacks',
    isVeg: true,
    inStock: true,
    stockLimit: 8,
    prepTime: '3 mins',
    tag: '🧀 Cheesy',
    emoji: '🥐',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 5,
    name: 'Butter Chicken Rice Bowl',
    description: 'Smoky tandoori chicken tikka chunks simmered in a velvety makhani gravy over fragrant jeera rice.',
    price: 145,
    category: 'Meals',
    station: 'Meals Tawa',
    isVeg: false,
    inStock: true,
    stockLimit: null,
    prepTime: '9 mins',
    tag: '👑 Chef Special',
    emoji: '🍗',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 6,
    name: 'Egg Hakka Noodles',
    description: 'Wok-tossed fresh noodles with shredded farm eggs, crunchy carrots, bell peppers, and scallions.',
    price: 90,
    category: 'Meals',
    station: 'Meals Tawa',
    isVeg: false,
    inStock: true,
    stockLimit: null,
    prepTime: '6 mins',
    tag: '🥢 Wok Fresh',
    emoji: '🍜',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 7,
    name: 'Artisan Cold Coffee',
    description: 'Frothy double-shot espresso blended with chilled milk, premium vanilla cream, and chocolate syrup.',
    price: 45,
    category: 'Drinks',
    station: 'Beverage Bar',
    isVeg: true,
    inStock: true,
    stockLimit: null,
    prepTime: '2 mins',
    tag: '❄️ Chilled',
    emoji: '🥤',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 8,
    name: 'Alphonso Mango Lassi',
    description: 'Thick, probiotic yogurt smoothie sweetened with pure Ratnagiri Alphonso pulp and topped with pistachio slivers.',
    price: 40,
    category: 'Drinks',
    station: 'Beverage Bar',
    isVeg: true,
    inStock: false, // Out of stock example
    stockLimit: null,
    prepTime: '2 mins',
    tag: '🥭 Seasonal',
    emoji: '🍹',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 9,
    name: 'Fudgy Brownie with Fudge',
    description: 'Warm, gooey dark chocolate walnut brownie smothered in warm chocolate ganache.',
    price: 60,
    category: 'Dessert',
    station: 'Beverage Bar',
    isVeg: true,
    inStock: true,
    stockLimit: 5,
    prepTime: '1 min',
    tag: '🍫 Sweet Cravings',
    emoji: '🍰',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80'
  }
];

// Presets for the 4 bottleneck and congestion scenarios
const SCENARIO_PRESETS = {
  normal: {
    id: 'normal',
    label: '🟢 Off-Peak (3:30 PM)',
    subtitle: 'Low Traffic • Instant Service',
    rushPercent: 22,
    waitMinutes: 3,
    statusText: 'Low Traffic (Smooth Flow)',
    statusColor: 'var(--accent-green)',
    isNetworkOutage: false,
    stationCongestion: { meals: 'low', snacks: 'low', drinks: 'low' },
    slots: [
      { time: '07:00 PM', status: 'normal', fillLevel: 2, limit: 15, estWait: '2m' },
      { time: '07:15 PM', status: 'normal', fillLevel: 3, limit: 15, estWait: '2m' },
      { time: '07:30 PM', status: 'normal', fillLevel: 4, limit: 15, estWait: '2m' },
      { time: '07:45 PM', status: 'normal', fillLevel: 1, limit: 15, estWait: '1m' },
      { time: '08:00 PM', status: 'normal', fillLevel: 2, limit: 15, estWait: '1m' },
    ]
  },
  lunch: {
    id: 'lunch',
    label: '🟡 Lunch Surge (1:15 PM)',
    subtitle: 'Moderate Rush • Slots Filling',
    rushPercent: 64,
    waitMinutes: 11,
    statusText: 'Moderate Rush (64% Capacity)',
    statusColor: 'var(--accent-peach)',
    isNetworkOutage: false,
    stationCongestion: { meals: 'high', snacks: 'medium', drinks: 'low' },
    slots: [
      { time: '07:00 PM', status: 'normal', fillLevel: 6, limit: 15, estWait: '4m' },
      { time: '07:15 PM', status: 'busy', fillLevel: 12, limit: 15, estWait: '8m' },
      { time: '07:30 PM', status: 'busy', fillLevel: 13, limit: 15, estWait: '9m' },
      { time: '07:45 PM', status: 'normal', fillLevel: 5, limit: 15, estWait: '3m' },
      { time: '08:00 PM', status: 'normal', fillLevel: 3, limit: 15, estWait: '2m' },
    ]
  },
  peak: {
    id: 'peak',
    label: '🔴 7:30 PM Dinner Break Wave',
    subtitle: 'Maximum Peak • Slots Capped',
    rushPercent: 96,
    waitMinutes: 28,
    statusText: 'CRITICAL RUSH (96% Peak - Capping Active)',
    statusColor: 'var(--accent-red)',
    isNetworkOutage: false,
    stationCongestion: { meals: 'critical', snacks: 'high', drinks: 'medium' },
    slots: [
      { time: '07:00 PM', status: 'busy', fillLevel: 13, limit: 15, estWait: '8m' },
      { time: '07:15 PM', status: 'full', fillLevel: 15, limit: 15, estWait: 'Throttled' },
      { time: '07:30 PM', status: 'full', fillLevel: 15, limit: 15, estWait: 'Throttled' },
      { time: '07:45 PM', status: 'busy', fillLevel: 14, limit: 15, estWait: '9m' },
      { time: '08:00 PM', status: 'normal', fillLevel: 5, limit: 15, estWait: '3m' },
    ]
  },
  outage: {
    id: 'outage',
    label: '⚡ Basement Network / UPI Outage',
    subtitle: 'Cellular Drops • Wallet Critical',
    rushPercent: 88,
    waitMinutes: 24,
    statusText: 'UPI Blackout: Mobile Network Failing',
    statusColor: '#d97706',
    isNetworkOutage: true,
    stationCongestion: { meals: 'high', snacks: 'high', drinks: 'medium' },
    slots: [
      { time: '07:00 PM', status: 'busy', fillLevel: 11, limit: 15, estWait: '7m' },
      { time: '07:15 PM', status: 'full', fillLevel: 15, limit: 15, estWait: 'Throttled' },
      { time: '07:30 PM', status: 'busy', fillLevel: 14, limit: 15, estWait: '10m' },
      { time: '07:45 PM', status: 'busy', fillLevel: 12, limit: 15, estWait: '6m' },
      { time: '08:00 PM', status: 'normal', fillLevel: 4, limit: 15, estWait: '2m' },
    ]
  }
};

const INITIAL_ORDERS = [
  {
    id: 'ord-1',
    token: '101',
    items: [
      { id: 2, name: 'Crispy Masala Dosa', price: 70, quantity: 1, emoji: '🥞' },
      { id: 7, name: 'Artisan Cold Coffee', price: 45, quantity: 1, emoji: '🥤' }
    ],
    total: 115,
    slot: '07:15 PM',
    status: 'Preparing',
    paymentMethod: 'wallet',
    placedAt: '7:08 PM',
    progress: 60
  },
  {
    id: 'ord-2',
    token: '102',
    items: [
      { id: 3, name: 'Mumbai Samosa Pav', price: 35, quantity: 2, emoji: '🥪' }
    ],
    total: 70,
    slot: 'Immediate',
    status: 'Ready',
    paymentMethod: 'upi',
    placedAt: '7:02 PM',
    progress: 100
  },
  {
    id: 'ord-3',
    token: '98',
    items: [
      { id: 4, name: 'Crispy Paneer Patty', price: 35, quantity: 1, emoji: '🥐' }
    ],
    total: 35,
    slot: '07:00 PM',
    status: 'Collected',
    paymentMethod: 'wallet',
    placedAt: '6:50 PM',
    progress: 100
  }
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Role-Based Authentication State initialized from authService
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    playSoundEffect('click');
    authService.logout();
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

  const [menuItems, setMenuItems] = useState(INITIAL_MENU);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [walletBalance, setWalletBalance] = useState(240.0);
  const [activeToken, setActiveToken] = useState('102');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Congestion Scenario Management
  const [currentScenario, setCurrentScenario] = useState('peak'); // default to peak demo
  const [isSimulatorExpanded, setIsSimulatorExpanded] = useState(true);
  const [timeSlots, setTimeSlots] = useState(SCENARIO_PRESETS.peak.slots);
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const [announcement, setAnnouncement] = useState('📢 Special: Crispy Masala Dosa & Samosa Pav hot on tawa. Pre-schedule your slot to skip counter wait!');

  const [cart, setCart] = useState([]);
  
  // Payment Modal State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [pendingSlot, setPendingSlot] = useState('');

  // Big QR Pass Preview Modal
  const [viewingQrOrder, setViewingQrOrder] = useState(null);

  // Web Audio Synthesizer
  const playSoundEffect = (type = 'click') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === 'call') {
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now);
        osc1.frequency.setValueAtTime(659.25, now + 0.18);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(783.99, now);
        osc2.frequency.setValueAtTime(1046.50, now + 0.18);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.7);
        osc2.stop(now + 0.7);
      } else if (type === 'surge') {
        // Dramatic triple siren tick for rush surge
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.3);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'success') {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      } else {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {}
  };

  // Switch Scenario Preset
  const handleSelectScenario = (scenarioKey) => {
    playSoundEffect('click');
    setCurrentScenario(scenarioKey);
    const preset = SCENARIO_PRESETS[scenarioKey];
    setTimeSlots(preset.slots);
  };

  // Simulate Instant Flash Surge (5 students rush order at once)
  const handleTriggerFlashMob = () => {
    playSoundEffect('surge');
    const surgeOrders = [
      {
        id: `ord-surge-1-${Date.now()}`,
        token: (103 + Math.floor(Math.random() * 20)).toString(),
        items: [{ id: 1, name: 'Chole Bhature Special', price: 80, quantity: 2, emoji: '🍛' }],
        total: 160,
        slot: '07:15 PM',
        status: 'Preparing',
        paymentMethod: 'wallet',
        placedAt: 'Just now',
        progress: 40,
        isSurgeBatch: true
      },
      {
        id: `ord-surge-2-${Date.now()}`,
        token: (124 + Math.floor(Math.random() * 20)).toString(),
        items: [{ id: 2, name: 'Crispy Masala Dosa', price: 70, quantity: 1, emoji: '🥞' }],
        total: 70,
        slot: 'Immediate',
        status: 'Placed',
        paymentMethod: 'upi',
        placedAt: 'Just now',
        progress: 10,
        isSurgeBatch: true
      },
      {
        id: `ord-surge-3-${Date.now()}`,
        token: (145 + Math.floor(Math.random() * 20)).toString(),
        items: [{ id: 3, name: 'Mumbai Samosa Pav', price: 35, quantity: 3, emoji: '🥪' }],
        total: 105,
        slot: '07:30 PM',
        status: 'Preparing',
        paymentMethod: 'wallet',
        placedAt: 'Just now',
        progress: 50,
        isSurgeBatch: true
      }
    ];

    setOrders(prev => [...surgeOrders, ...prev]);

    // Fill up the time slots further to demonstrate throttle trigger
    setTimeSlots(prev => prev.map(s => {
      if (s.time === '07:15 PM' || s.time === '07:30 PM') {
        return { ...s, fillLevel: 15, status: 'full', estWait: 'Throttled' };
      }
      return { ...s, fillLevel: Math.min(s.limit, s.fillLevel + 2) };
    }));

    alert("⚡ RUSH EVENT TRIGGERED: 3 student groups just ordered simultaneously! Kitchen queue loaded and 07:15 PM slot capped to prevent physical counter jam.");
  };

  const getNextTokenNumber = () => {
    if (orders.length === 0) return '101';
    const tokens = orders.map(o => parseInt(o.token)).filter(t => !isNaN(t));
    if (tokens.length === 0) return '101';
    return (Math.max(...tokens) + 1).toString();
  };

  const handleOpenPayment = (amount, slot) => {
    playSoundEffect('click');
    setPendingTotal(amount);
    setPendingSlot(slot);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (method) => {
    playSoundEffect('success');
    if (method === 'wallet') {
      setWalletBalance(prev => Math.max(0, prev - pendingTotal));
    }

    const newToken = getNextTokenNumber();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newOrder = {
      id: `ord-${Date.now()}`,
      token: newToken,
      items: [...cart],
      total: pendingTotal,
      slot: pendingSlot,
      status: 'Placed',
      paymentMethod: method,
      placedAt: timeNow,
      progress: 25
    };

    const updatedMenu = menuItems.map(menuItem => {
      const cartItem = cart.find(ci => ci.id === menuItem.id);
      if (cartItem && menuItem.stockLimit !== null) {
        const remaining = menuItem.stockLimit - cartItem.quantity;
        return {
          ...menuItem,
          stockLimit: remaining <= 0 ? null : remaining,
          inStock: remaining <= 0 ? false : menuItem.inStock
        };
      }
      return menuItem;
    });

    setMenuItems(updatedMenu);
    setOrders([newOrder, ...orders]);
    setCart([]);
  };

  const handleRechargeWallet = (amount) => {
    playSoundEffect('success');
    setWalletBalance(prev => prev + amount);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    playSoundEffect('click');
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const progress = newStatus === 'Preparing' ? 65 : newStatus === 'Ready' ? 100 : 100;
        return { ...order, status: newStatus, progress };
      }
      return order;
    }));
  };

  const handleToggleStock = (itemId) => {
    playSoundEffect('click');
    setMenuItems(menuItems.map(item => 
      item.id === itemId ? { ...item, inStock: !item.inStock } : item
    ));
  };

  const handleUpdateStockLimit = (itemId, limit) => {
    setMenuItems(menuItems.map(item => 
      item.id === itemId ? { ...item, stockLimit: limit, inStock: limit === 0 ? false : item.inStock } : item
    ));
  };

  const handleCallToken = (token) => {
    playSoundEffect('call');
    setActiveToken(token);
  };

  // Admin CRUD Handlers
  const handleAddMenuItem = (newItem) => {
    setMenuItems([newItem, ...menuItems]);
  };

  const handleEditMenuItem = (updatedItem) => {
    setMenuItems(menuItems.map(m => m.id === updatedItem.id ? updatedItem : m));
  };

  const handleDeleteMenuItem = (itemId) => {
    setMenuItems(menuItems.filter(m => m.id !== itemId));
  };

  const handleUpdateSlotLimit = (slotTime, newLimit) => {
    setTimeSlots(prev => prev.map(s => {
      if (s.time === slotTime) {
        const isFull = s.fillLevel >= newLimit;
        return {
          ...s,
          limit: newLimit,
          status: isFull ? 'full' : s.fillLevel > newLimit * 0.7 ? 'busy' : 'normal',
          estWait: isFull ? 'Throttled' : `${Math.max(1, Math.round(s.fillLevel * 0.6))}m`
        };
      }
      return s;
    }));
  };

  const handleCreditStudentWallet = (amount) => {
    setWalletBalance(prev => prev + amount);
  };

  const handleUpdateAnnouncement = (text) => {
    setAnnouncement(text);
  };

  const activePreset = SCENARIO_PRESETS[currentScenario];

  return (
    <div>
      {/* Background Blobs */}
      <div className="liquid-bg-container">
        <div className="liquid-blob blob-1"></div>
        <div className="liquid-blob blob-2"></div>
        <div className="liquid-blob blob-3"></div>
        <div className="liquid-blob blob-4"></div>
      </div>

      <div className="app-container">
        
        {/* Interactive Congestion & Bottleneck Simulator Control Bar (Visible in Dashboards) */}
        {currentUser && location.pathname !== '/login' && (
          isSimulatorExpanded ? (
          <div 
            className="glass-panel" 
            style={{ 
              padding: '0.75rem 1.25rem', 
              marginBottom: '1.25rem', 
              background: 'rgba(255, 255, 255, 0.78)',
              backdropFilter: 'blur(30px) saturate(200%)',
              WebkitBackdropFilter: 'blur(30px) saturate(200%)',
              color: 'var(--text-primary)',
              borderRadius: '20px',
              border: '1.5px solid rgba(255, 255, 255, 0.95)',
              boxShadow: '0 12px 32px -6px rgba(100, 116, 139, 0.1), inset 0 1px 1px rgba(255, 255, 255, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              transition: 'var(--transition-spring)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(255, 100, 61, 0.15) 0%, rgba(255, 100, 61, 0.25) 100%)', 
                padding: '7px', 
                borderRadius: '12px', 
                color: 'var(--accent-peach)',
                boxShadow: '0 2px 8px rgba(255, 100, 61, 0.15)'
              }}>
                <Activity size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-primary)' }}>
                  Queue Congestion Simulator
                  <span style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: 700, 
                    background: 'rgba(255, 100, 61, 0.12)', 
                    color: 'var(--accent-peach)', 
                    padding: '2px 8px', 
                    borderRadius: '999px',
                    border: '1px solid rgba(255, 100, 61, 0.25)'
                  }}>
                    Interactive Demo
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                  Simulate rush spikes, dinner breaks, and basement network outages
                </div>
              </div>
            </div>

            {/* Scenario Selectors */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {Object.keys(SCENARIO_PRESETS).map(key => {
                const item = SCENARIO_PRESETS[key];
                const isSelected = currentScenario === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectScenario(key)}
                    className="glass-btn"
                    style={{
                      padding: '0.35rem 0.8rem',
                      fontSize: '0.75rem',
                      borderRadius: '12px',
                      background: isSelected ? 'var(--accent-peach-gradient)' : 'rgba(255, 255, 255, 0.85)',
                      color: isSelected ? 'white' : 'var(--text-secondary)',
                      border: isSelected ? '1px solid rgba(255, 255, 255, 0.5)' : '1px solid rgba(226, 232, 240, 0.8)',
                      boxShadow: isSelected ? '0 4px 14px rgba(255, 100, 61, 0.35)' : '0 2px 6px rgba(0, 0, 0, 0.03)',
                      fontWeight: isSelected ? 700 : 600,
                      transition: 'var(--transition-spring)'
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}

              {/* Live Surge Mob Trigger */}
              <button
                onClick={handleTriggerFlashMob}
                className="glass-btn"
                style={{
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.75rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
                  fontWeight: 700
                }}
                title="Inject 3 instant orders into kitchen queue"
              >
                <Zap size={13} /> Flash Rush (+3 Orders)
              </button>

              {/* Theory Explanation Modal Trigger */}
              <button
                onClick={() => setShowTheoryModal(true)}
                className="glass-btn"
                style={{ 
                  padding: '0.35rem 0.65rem', 
                  fontSize: '0.75rem', 
                  borderRadius: '12px', 
                  background: 'rgba(255, 255, 255, 0.85)', 
                  color: 'var(--text-secondary)',
                  border: '1px solid rgba(226, 232, 240, 0.8)'
                }}
                title="Show Queue Mathematics & Indian College Problem Statement"
              >
                <HelpCircle size={15} />
              </button>

              {/* Minimize Toggle */}
              <button
                onClick={() => setIsSimulatorExpanded(false)}
                className="glass-btn"
                style={{ 
                  padding: '0.35rem 0.55rem', 
                  fontSize: '0.75rem', 
                  borderRadius: '12px', 
                  background: 'rgba(255, 255, 255, 0.85)', 
                  color: 'var(--text-tertiary)',
                  border: '1px solid rgba(226, 232, 240, 0.8)'
                }}
                title="Minimize Simulator Bar"
              >
                <ChevronUp size={15} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <button
              onClick={() => setIsSimulatorExpanded(true)}
              className="glass-btn glass-panel"
              style={{
                padding: '0.45rem 1.25rem',
                fontSize: '0.78rem',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.85)',
                color: 'var(--text-secondary)',
                border: '1px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 4px 16px rgba(100, 116, 139, 0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer'
              }}
            >
              <Activity size={15} style={{ color: 'var(--accent-peach)' }} />
              <span>Queue Simulator: <strong style={{ color: 'var(--text-primary)' }}>{activePreset.label}</strong></span>
              <ChevronDown size={14} />
            </button>
          </div>
        ))}

        {/* Global Navigation Header */}
        <header 
          className="glass-panel" 
          style={{ 
            padding: '0.85rem 1.4rem', 
            marginBottom: '1.5rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          {/* Logo Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div 
              style={{ 
                background: 'var(--accent-peach-gradient)', 
                color: 'white', 
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--accent-peach-glow)',
                border: '1px solid rgba(255, 255, 255, 0.4)'
              }}
            >
              <ChefHat size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h1 style={{ fontSize: '1.45rem', fontWeight: 800, lineHeight: 1 }}>CampusBite</h1>
                <span style={{ 
                  background: 'rgba(255, 100, 61, 0.12)', 
                  color: 'var(--accent-peach)', 
                  fontSize: '0.68rem', 
                  fontWeight: 700, 
                  padding: '2px 7px', 
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 100, 61, 0.25)'
                }}>
                  iOS 27 Glass
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                Next-Gen College Canteen Queue Intelligence
              </span>
            </div>
          </div>

          {/* Right Controls: User Profile + Sound Toggle + Switch Role */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            
            {/* Audio Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playSoundEffect('click');
              }}
              title={soundEnabled ? 'Chime sound enabled' : 'Sound muted'}
              className="glass-btn"
              style={{ 
                padding: '0.45rem', 
                borderRadius: '50%', 
                width: '38px', 
                height: '38px',
                color: soundEnabled ? 'var(--accent-peach)' : 'var(--text-tertiary)'
              }}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {currentUser && location.pathname !== '/login' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                {/* User Identity Profile Pill */}
                <div 
                  className="glass-panel" 
                  style={{ 
                    padding: '0.35rem 0.95rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.6rem',
                    borderRadius: '999px',
                    background: 'rgba(255, 255, 255, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{currentUser.avatar}</span>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                      #{currentUser.id}
                    </div>
                  </div>
                  <span 
                    style={{ 
                      fontSize: '0.72rem', 
                      fontWeight: 800, 
                      color: currentUser.roleColor, 
                      background: currentUser.roleBg, 
                      padding: '2px 9px', 
                      borderRadius: '999px',
                      border: `1px solid ${currentUser.roleColor}33`,
                      marginLeft: '0.2rem'
                    }}
                  >
                    {currentUser.roleBadge}
                  </span>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={handleLogout}
                  className="glass-btn"
                  style={{
                    padding: '0.45rem 0.95rem',
                    fontSize: '0.8rem',
                    borderRadius: '12px',
                    color: 'var(--accent-red)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                  title="Sign out of your account"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <span style={{ 
                fontSize: '0.78rem', 
                fontWeight: 700, 
                color: 'var(--accent-peach)', 
                background: 'rgba(255, 100, 61, 0.1)', 
                padding: '4px 10px', 
                borderRadius: '999px',
                border: '1px solid rgba(255, 100, 61, 0.2)'
              }}>
                Role Access Gateway
              </span>
            )}

          </div>
        </header>

        {/* React Router Role-Based Navigation & Route Guards */}
        <Routes>
          <Route 
            path="/login" 
            element={
              !currentUser ? (
                <LoginPage onLoginSuccess={handleLogin} onPlaySound={playSoundEffect} />
              ) : (
                <Navigate to={authService.getDashboardPath(currentUser.role)} replace />
              )
            } 
          />
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student']} currentUser={currentUser}>
                <StudentDashboard 
                  currentUser={currentUser}
                  menuItems={menuItems}
                  orders={orders}
                  walletBalance={walletBalance}
                  onOpenPayment={handleOpenPayment}
                  onRechargeWallet={handleRechargeWallet}
                  cart={cart}
                  setCart={setCart}
                  activeToken={activeToken}
                  onViewQrPass={(order) => setViewingQrOrder(order)}
                  onPlaySound={playSoundEffect}
                  scenario={activePreset}
                  timeSlots={timeSlots}
                  onSelectSlotTime={(time) => {}}
                  announcement={announcement}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/kitchen/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['staff']} currentUser={currentUser}>
                <CanteenStaffDashboard 
                  currentUser={currentUser}
                  menuItems={menuItems}
                  orders={orders}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onToggleStock={handleToggleStock}
                  onUpdateStockLimit={handleUpdateStockLimit}
                  activeToken={activeToken}
                  onCallToken={handleCallToken}
                  onPlaySound={playSoundEffect}
                  scenario={activePreset}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']} currentUser={currentUser}>
                <CanteenAdminDashboard 
                  currentUser={currentUser}
                  menuItems={menuItems}
                  onAddMenuItem={handleAddMenuItem}
                  onEditMenuItem={handleEditMenuItem}
                  onDeleteMenuItem={handleDeleteMenuItem}
                  timeSlots={timeSlots}
                  onUpdateSlotLimit={handleUpdateSlotLimit}
                  walletBalance={walletBalance}
                  onCreditStudentWallet={handleCreditStudentWallet}
                  orders={orders}
                  announcement={announcement}
                  onUpdateAnnouncement={handleUpdateAnnouncement}
                  onPlaySound={playSoundEffect}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <Navigate 
                to={currentUser ? authService.getDashboardPath(currentUser.role) : '/login'} 
                replace 
              />
            } 
          />
          <Route 
            path="*" 
            element={
              <Navigate 
                to={currentUser ? authService.getDashboardPath(currentUser.role) : '/login'} 
                replace 
              />
            } 
          />
        </Routes>

        {/* Payment Modal */}
        <PaymentModal 
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          totalAmount={pendingTotal}
          walletBalance={walletBalance}
          onPaymentSuccess={handlePaymentSuccess}
          onRecharge={handleRechargeWallet}
          onPlaySound={playSoundEffect}
          isNetworkOutage={activePreset.isNetworkOutage}
        />

        {/* Large Scannable Digital QR Ticket Modal */}
        {viewingQrOrder && (
          <div className="modal-overlay" onClick={() => setViewingQrOrder(null)}>
            <div 
              className="modal-content glass-panel" 
              onClick={(e) => e.stopPropagation()}
              style={{ textAlign: 'center', maxWidth: '420px', padding: '2.2rem 1.75rem' }}
            >
              <button 
                onClick={() => setViewingQrOrder(null)} 
                className="glass-btn" 
                style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.4rem', borderRadius: '50%' }}
              >
                <X size={18} />
              </button>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--accent-green-light)', color: 'var(--accent-green)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
                <Sparkles size={14} /> Ready for Counter Pickup
              </div>

              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.2rem' }}>
                Token #{viewingQrOrder.token}
              </h3>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Show this digital pass to the canteen chef at <strong>Counter 2</strong>
              </p>

              <div 
                style={{ 
                  background: 'white', 
                  padding: '1.5rem', 
                  borderRadius: '24px', 
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
                  display: 'inline-block',
                  margin: '0 auto 1.5rem auto',
                  border: '2px solid rgba(0, 0, 0, 0.06)'
                }}
              >
                <div style={{ width: '180px', height: '180px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={170} style={{ color: '#0f172a' }} />
                  <div style={{ position: 'absolute', background: 'white', padding: '5px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <ChefHat size={20} style={{ color: 'var(--accent-peach)' }} />
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '0.9rem', textAlign: 'left', background: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Slot Window:</span>
                  <span style={{ fontWeight: 700 }}>{viewingQrOrder.slot}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Items:</span>
                  <span style={{ fontWeight: 600 }}>{viewingQrOrder.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Total Paid:</span>
                  <span style={{ fontWeight: 800, color: 'var(--accent-green)' }}>₹{viewingQrOrder.total.toFixed(0)}</span>
                </div>
              </div>

              <button 
                onClick={() => setViewingQrOrder(null)}
                className="glass-btn glass-btn-primary" 
                style={{ width: '100%' }}
              >
                Close Pass
              </button>
            </div>
          </div>
        )}

        {/* Academic / Faculty Presentation Theory Modal */}
        {showTheoryModal && (
          <div className="modal-overlay" onClick={() => setShowTheoryModal(false)}>
            <div 
              className="modal-content glass-panel" 
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '580px', padding: '2rem' }}
            >
              <button 
                onClick={() => setShowTheoryModal(false)} 
                className="glass-btn" 
                style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.4rem', borderRadius: '50%' }}
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ background: 'var(--accent-peach-light)', padding: '6px', borderRadius: '10px' }}>
                  <Layers size={22} style={{ color: 'var(--accent-peach)' }} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Faculty Presentation Brief</h3>
              </div>

              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Why Indian College Canteens fail under standard online ordering and how CampusBite solves it:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.86rem' }}>
                <div className="glass-panel" style={{ padding: '0.9rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <div style={{ fontWeight: 800, color: '#dc2626', marginBottom: '0.2rem' }}>
                    1. The Counter Surge Dilemma (Arrival Rate &gt; Service Rate)
                  </div>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    When 150 students are dismissed at 7:30 PM, ordering without time throttling causes 150 students to crowd one service ledge simultaneously. Our <strong>Time-Slot Capping Algorithm</strong> restricts each slot to a max of 15 orders, flattening peak load curves.
                  </p>
                </div>

                <div className="glass-panel" style={{ padding: '0.9rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ fontWeight: 800, color: '#d97706', marginBottom: '0.2rem' }}>
                    2. Basement Cellular Drops (The UPI Freeze)
                  </div>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    College canteens frequently have 1-bar cellular reception. Bank OTPs and UPI PIN roundtrips timeout during peak rush. The <strong>Campus Pass Wallet</strong> performs sub-second local ledger deduction, making checkout 100% resilient to cellular drops.
                  </p>
                </div>

                <div className="glass-panel" style={{ padding: '0.9rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ fontWeight: 800, color: '#059669', marginBottom: '0.2rem' }}>
                    3. Digital Token Board & Station Segmentation
                  </div>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    Students remain comfortably seated until their token flashes green on the digital board. Counter 1 is segregated for Hot Meals, while Counter 2 handles instant snacks and beverages.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowTheoryModal(false)}
                className="glass-btn glass-btn-primary" 
                style={{ width: '100%', marginTop: '1.25rem', padding: '0.75rem' }}
              >
                Close Presentation Brief
              </button>
            </div>
          </div>
        )}

        {/* Presentation Footer */}
        <footer style={{ marginTop: 'auto', padding: '2.5rem 0 1.25rem 0', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>
            <Award size={15} style={{ color: 'var(--accent-peach)' }} /> 
            CampusBite Canteen Queue Solution • Designed with iOS 27 Liquid Glass for Student Presentations
          </div>
        </footer>
      </div>
    </div>
  );
}
