import React, { useState } from 'react';
import { 
  Search, ShoppingBag, Clock, Plus, Minus, AlertTriangle, 
  Check, QrCode, CreditCard, ChevronRight, TrendingUp, Info, 
  Sparkles, Flame, Zap, Wallet, ArrowUpRight, CheckCircle2, 
  ChefHat, Timer, WifiOff, Activity, Layers, Megaphone
} from 'lucide-react';

export default function StudentDashboard({ 
  currentUser,
  menuItems, 
  orders, 
  walletBalance, 
  onOpenPayment, 
  onRechargeWallet,
  cart, 
  setCart, 
  activeToken,
  onViewQrPass,
  onPlaySound,
  scenario,
  timeSlots = [],
  announcement
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isScheduled, setIsScheduled] = useState(false);
  const [addedItemAnim, setAddedItemAnim] = useState(null);
  const [quickRechargeOpen, setQuickRechargeOpen] = useState(false);
  
  const [selectedSlot, setSelectedSlot] = useState(
    timeSlots.find(s => s.status !== 'full')?.time || '07:45 PM'
  );

  const categories = ['All', 'Meals', 'Snacks', 'Drinks', 'Dessert'];

  const filteredMenu = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item) => {
    if (!item.inStock) return;
    onPlaySound?.('click');
    setAddedItemAnim(item.id);
    setTimeout(() => setAddedItemAnim(null), 400);

    const existing = cart.find(cartItem => cartItem.id === item.id);
    if (existing) {
      if (item.stockLimit && existing.quantity >= item.stockLimit) {
        alert(`Kitchen limit reached! Only ${item.stockLimit} portions of ${item.name} available.`);
        return;
      }
      setCart(cart.map(cartItem => 
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    onPlaySound?.('click');
    const existing = cart.find(cartItem => cartItem.id === itemId);
    if (!existing) return;
    if (existing.quantity === 1) {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    } else {
      setCart(cart.map(cartItem => 
        cartItem.id === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    if (isScheduled && !selectedSlot) {
      alert("Please select an available pick-up time slot.");
      return;
    }
    
    const total = getCartTotal();
    onOpenPayment(total, isScheduled ? selectedSlot : 'Immediate');
  };

  const getSlotDetails = (slot) => {
    if (slot.status === 'full') return { label: 'FULL (Capped)', color: 'var(--accent-red)', bg: 'var(--accent-red-light)' };
    if (slot.status === 'busy') return { label: `Busy (~${slot.estWait})`, color: 'var(--accent-peach)', bg: 'var(--accent-peach-light)' };
    return { label: `Smooth (~${slot.estWait})`, color: 'var(--accent-green)', bg: 'var(--accent-green-light)' };
  };

  return (
    <div className="dashboard-grid" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      
      {/* LEFT COLUMN: Rush Meter, Pre-Ordering Scheduler & Fresh Menu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
        
        {/* Banner with Greeting & Quick Campus Wallet */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '1.4rem 1.6rem', 
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.78) 0%, rgba(255, 255, 255, 0.48) 100%)',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Hey {currentUser?.name?.split(' ')[0] || 'Ashal'}! 👋</h2>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--accent-green)', background: 'var(--accent-green-light)', padding: '2px 8px', borderRadius: '999px' }}>
                  Student ID: #{currentUser?.id || 'CS-402'}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                Skip the peak dinner counter rush by scheduling your order slot below.
              </p>
            </div>
            
            {/* Campus Pass Wallet Widget */}
            <div 
              className="glass-panel" 
              style={{ 
                padding: '0.85rem 1.25rem', 
                background: 'rgba(2, 132, 199, 0.08)', 
                border: '1px solid rgba(2, 132, 199, 0.22)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                minWidth: '220px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-teal)', fontWeight: 800 }}>
                  Campus Pass Wallet
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Zap size={11} /> 1s Instant
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ₹{walletBalance.toFixed(2)}
                </span>
                
                <button
                  onClick={() => setQuickRechargeOpen(!quickRechargeOpen)}
                  className="glass-btn"
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', borderRadius: '8px', color: 'var(--accent-teal)' }}
                >
                  {quickRechargeOpen ? 'Cancel' : '+ Top up'}
                </button>
              </div>

              {quickRechargeOpen && (
                <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.3rem', animation: 'fadeIn 0.2s ease' }}>
                  {[50, 100, 200].map(amt => (
                    <button
                      key={amt}
                      onClick={() => {
                        onRechargeWallet(amt);
                        setQuickRechargeOpen(false);
                      }}
                      className="glass-btn glass-btn-teal"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', flex: 1, borderRadius: '6px' }}
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Admin Manager Announcement Notice */}
        {announcement && (
          <div 
            className="glass-panel" 
            style={{ 
              padding: '0.75rem 1.15rem', 
              background: 'rgba(255, 100, 61, 0.08)', 
              border: '1.5px solid rgba(255, 100, 61, 0.28)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              animation: 'fadeIn 0.3s ease'
            }}
          >
            <div style={{ background: 'var(--accent-peach)', color: 'white', padding: '5px', borderRadius: '8px', flexShrink: 0 }}>
              <Megaphone size={16} />
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
              <span style={{ color: 'var(--accent-peach)', fontWeight: 800 }}>Canteen Notice: </span>
              {announcement}
            </div>
          </div>
        )}

        {/* Network Outage / Congestion Emergency Notification (Scenario 4) */}
        {scenario?.isNetworkOutage && (
          <div 
            className="glass-panel" 
            style={{ 
              padding: '0.9rem 1.25rem', 
              background: 'rgba(245, 158, 11, 0.12)', 
              border: '1.5px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              animation: 'popBounce 0.35s ease'
            }}
          >
            <div style={{ background: '#f59e0b', color: 'white', padding: '6px', borderRadius: '10px', flexShrink: 0 }}>
              <WifiOff size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#b45309' }}>
                Canteen Basement Network Fluctuation Detected!
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Cellular tower packets dropping. Google Pay & PhonePe transactions may time out. <strong>Campus Wallet checkout is 100% active and instantaneous.</strong>
              </div>
            </div>
          </div>
        )}

        {/* Live Canteen Rush Heat Gauge - Connected to Scenario */}
        <div className="rush-meter-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div 
              style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                background: scenario?.statusColor || 'var(--accent-peach)',
                boxShadow: `0 0 8px ${scenario?.statusColor || 'var(--accent-peach)'}`
              }} 
              className="live-pulse" 
            />
            <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>
              Queue Load:
            </span>
          </div>

          <div className="rush-bar-track">
            <div 
              className="rush-bar-fill" 
              style={{ 
                width: `${scenario?.rushPercent || 75}%`,
                background: scenario?.rushPercent > 80 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #10b981, #f59e0b)'
              }} 
            />
          </div>

          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: scenario?.statusColor || 'var(--accent-peach)', whiteSpace: 'nowrap' }}>
            {scenario?.statusText || 'Normal Load'}
          </div>
        </div>

        {/* Counter Station Bottleneck Radar (Meals vs Snacks vs Drinks) */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '0.85rem 1.15rem', 
            background: 'rgba(255,255,255,0.45)', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.8rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
            <Activity size={15} style={{ color: 'var(--accent-peach)' }} /> Station Congestion Radar:
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ 
              padding: '2px 8px', 
              borderRadius: '6px', 
              background: scenario?.stationCongestion?.meals === 'critical' ? 'var(--accent-red-light)' : 'rgba(0,0,0,0.05)',
              color: scenario?.stationCongestion?.meals === 'critical' ? 'var(--accent-red)' : 'var(--text-secondary)',
              fontWeight: 700
            }}>
              🍳 Hot Meals Tawa: {scenario?.stationCongestion?.meals === 'critical' ? '98% Jammed (~25m)' : 'Moderate (~8m)'}
            </span>

            <span style={{ 
              padding: '2px 8px', 
              borderRadius: '6px', 
              background: 'var(--accent-green-light)',
              color: 'var(--accent-green)',
              fontWeight: 700
            }}>
              🥪 Snacks Counter: Smooth (~3m)
            </span>

            <span style={{ 
              padding: '2px 8px', 
              borderRadius: '6px', 
              background: 'rgba(2, 132, 199, 0.1)',
              color: 'var(--accent-teal)',
              fontWeight: 700
            }}>
              🥤 Beverage Bar: Instant (~1m)
            </span>
          </div>
        </div>

        {/* Dynamic Pre-Ordering Scheduler (Problem 1 & 4 Solution) */}
        <div className="glass-panel" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock style={{ color: 'var(--accent-peach)' }} size={20} /> Order Pickup Window
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginTop: '0.15rem' }}>
                Throttling counters to a max of 15 orders per slot prevents counter overcrowding.
              </p>
            </div>
            
            {/* Toggle order mode */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', borderRadius: '14px', padding: '0.25rem', border: '1px solid rgba(255,255,255,0.6)' }}>
              <button 
                onClick={() => {
                  onPlaySound?.('click');
                  setIsScheduled(false);
                }}
                className="nav-tab-btn" 
                style={{ 
                  padding: '0.4rem 1rem', 
                  fontSize: '0.84rem', 
                  borderRadius: '10px', 
                  background: !isScheduled ? 'white' : 'transparent', 
                  color: !isScheduled ? 'var(--text-primary)' : 'var(--text-tertiary)', 
                  boxShadow: !isScheduled ? '0 2px 8px rgba(0,0,0,0.06)' : 'none' 
                }}
              >
                Immediate Prep
              </button>
              <button 
                onClick={() => {
                  onPlaySound?.('click');
                  setIsScheduled(true);
                }}
                className="nav-tab-btn" 
                style={{ 
                  padding: '0.4rem 1rem', 
                  fontSize: '0.84rem', 
                  borderRadius: '10px', 
                  background: isScheduled ? 'white' : 'transparent', 
                  color: isScheduled ? 'var(--text-primary)' : 'var(--text-tertiary)', 
                  boxShadow: isScheduled ? '0 2px 8px rgba(0,0,0,0.06)' : 'none' 
                }}
              >
                Schedule Slot ✨
              </button>
            </div>
          </div>

          {isScheduled ? (
            <div>
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.65rem' }}>
                {timeSlots.map((slot) => {
                  const details = getSlotDetails(slot);
                  const isFull = slot.status === 'full';
                  const isSelected = selectedSlot === slot.time;
                  const fillPercent = Math.round((slot.fillLevel / slot.limit) * 100);
                  
                  return (
                    <button
                      key={slot.time}
                      disabled={isFull}
                      onClick={() => {
                        onPlaySound?.('click');
                        setSelectedSlot(slot.time);
                      }}
                      className="glass-panel"
                      style={{
                        padding: '0.9rem 1rem',
                        textAlign: 'left',
                        minWidth: '150px',
                        cursor: isFull ? 'not-allowed' : 'pointer',
                        opacity: isFull ? 0.45 : 1,
                        border: isSelected ? '2px solid var(--accent-peach)' : '1px solid rgba(255,255,255,0.6)',
                        background: isSelected ? 'rgba(255,255,255,0.9)' : 'var(--glass-bg)',
                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: isSelected ? 'var(--accent-peach-glow)' : 'var(--glass-shadow)',
                        flexShrink: 0,
                        transition: 'var(--transition-spring)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.98rem' }}>{slot.time}</span>
                        {isSelected && <Check size={14} style={{ color: 'var(--accent-peach)' }} />}
                      </div>

                      <div style={{ 
                        fontSize: '0.72rem', 
                        fontWeight: 700, 
                        color: details.color,
                        background: details.bg,
                        padding: '2px 6px',
                        borderRadius: '6px',
                        display: 'inline-block',
                        marginBottom: '0.5rem'
                      }}>
                        {details.label}
                      </div>

                      {/* Capacity Track */}
                      <div style={{ height: '4px', background: 'rgba(0,0,0,0.06)', borderRadius: '99px', overflow: 'hidden', marginBottom: '0.35rem' }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${fillPercent}%`, 
                          background: isFull ? 'var(--accent-red)' : fillPercent > 70 ? 'var(--accent-peach)' : 'var(--accent-green)' 
                        }} />
                      </div>

                      <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                        {slot.fillLevel} of {slot.limit} orders reserved
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,100,61,0.07)', border: '1px solid rgba(255,100,61,0.2)', padding: '0.85rem 1.15rem', borderRadius: '14px' }}>
              <AlertTriangle size={20} style={{ color: 'var(--accent-peach)', flexShrink: 0 }} />
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                <strong>Immediate Pickup Note:</strong> Current queue delay is estimated at <strong>~{scenario?.waitMinutes || 22} minutes</strong>. Switch to <strong>Schedule Slot</strong> to pick up your tray without waiting!
              </p>
            </div>
          )}
        </div>

        {/* Menu Presentation */}
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem' }}>Today's Live Fresh Menu</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                Real-time kitchen inventory & station routing
              </span>
            </div>
            
            <div className="glass-input-wrapper" style={{ width: '240px' }}>
              <Search className="glass-input-icon" size={16} />
              <input 
                type="text" 
                placeholder="Search food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input" 
                style={{ padding: '0.55rem 1rem 0.55rem 2.45rem', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* Categories Tab Pill Bar */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  onPlaySound?.('click');
                  setSelectedCategory(cat);
                }}
                className="nav-tab-btn"
                style={{
                  padding: '0.48rem 1.25rem',
                  fontSize: '0.86rem',
                  borderRadius: '16px',
                  background: selectedCategory === cat ? 'var(--text-primary)' : 'rgba(255, 255, 255, 0.55)',
                  color: selectedCategory === cat ? 'var(--text-white)' : 'var(--text-secondary)',
                  boxShadow: selectedCategory === cat ? '0 4px 16px rgba(15,23,42,0.18)' : 'none',
                  border: '1px solid rgba(255,255,255,0.7)',
                  flexShrink: 0
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items Cards Grid */}
          <div className="grid-cols-cards">
            {filteredMenu.map((item) => {
              const cartItem = cart.find(ci => ci.id === item.id);
              const qty = cartItem ? cartItem.quantity : 0;
              const isLowStock = item.inStock && item.stockLimit && item.stockLimit <= 5;
              const isBouncing = addedItemAnim === item.id;
              const isMealsStationJammed = item.station === 'Meals Tawa' && scenario?.stationCongestion?.meals === 'critical';

              return (
                <div 
                  key={item.id} 
                  className={`glass-panel glass-card-interactive ${isBouncing ? 'pop-bounce' : ''}`}
                  style={{ 
                    padding: '0.85rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    opacity: item.inStock ? 1 : 0.72,
                    background: item.inStock ? 'var(--glass-bg)' : 'rgba(255, 255, 255, 0.4)',
                    border: qty > 0 ? '1.5px solid var(--accent-peach)' : '1px solid rgba(255, 255, 255, 0.85)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: qty > 0 ? '0 12px 30px -4px rgba(255, 100, 61, 0.22)' : 'var(--glass-shadow-card)',
                    transition: 'var(--transition-spring)'
                  }}
                >
                  {/* Top Image Hero Banner with Frosted Badges */}
                  <div className="food-card-img-container">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="food-card-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                        {item.emoji || '🍽️'}
                      </div>
                    )}

                    {/* Floating Badges */}
                    <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 2, display: 'flex', gap: '4px' }}>
                      <span 
                        style={{ 
                          fontSize: '0.65rem', 
                          fontWeight: 800, 
                          color: item.isVeg ? '#047857' : '#b91c1c', 
                          background: 'rgba(255, 255, 255, 0.92)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          border: `1px solid ${item.isVeg ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                          padding: '2px 7px',
                          borderRadius: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
                        }}
                      >
                        {item.isVeg ? '● VEG' : '▲ NON-VEG'}
                      </span>
                    </div>

                    {item.prepTime && (
                      <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 2 }}>
                        <span 
                          style={{ 
                            fontSize: '0.66rem', 
                            fontWeight: 700, 
                            color: 'var(--text-secondary)', 
                            background: 'rgba(255, 255, 255, 0.92)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(226, 232, 240, 0.85)',
                            padding: '2px 7px',
                            borderRadius: '8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
                          }}
                        >
                          <Timer size={11} /> {item.prepTime}
                        </span>
                      </div>
                    )}

                    {/* Stock Status Overlays */}
                    {!item.inStock ? (
                      <div style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        background: 'rgba(15, 23, 42, 0.6)', 
                        backdropFilter: 'blur(4px)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'white', 
                        fontWeight: 800, 
                        fontSize: '0.82rem', 
                        letterSpacing: '0.04em',
                        zIndex: 3 
                      }}>
                        SOLD OUT FOR TODAY
                      </div>
                    ) : isLowStock ? (
                      <div style={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 0, 
                        right: 0, 
                        background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.92), rgba(239, 68, 68, 0.92))', 
                        color: 'white', 
                        fontSize: '0.68rem', 
                        fontWeight: 800, 
                        padding: '3px 8px', 
                        textAlign: 'center', 
                        zIndex: 2,
                        backdropFilter: 'blur(4px)'
                      }}>
                        🔥 Fast Filling: Only {item.stockLimit} Portions Left
                      </div>
                    ) : isMealsStationJammed ? (
                      <div style={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 0, 
                        right: 0, 
                        background: 'rgba(239, 68, 68, 0.88)', 
                        color: 'white', 
                        fontSize: '0.66rem', 
                        fontWeight: 800, 
                        padding: '2px 8px', 
                        textAlign: 'center', 
                        zIndex: 2 
                      }}>
                        ⚠️ High Stove Queue (+15m)
                      </div>
                    ) : null}
                  </div>

                  {/* Card Information */}
                  <div style={{ padding: '0 0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: 700, 
                        color: 'var(--accent-teal)', 
                        background: 'rgba(2, 132, 199, 0.08)', 
                        padding: '2px 6px', 
                        borderRadius: '6px',
                        border: '1px solid rgba(2, 132, 199, 0.18)'
                      }}>
                        {item.station}
                      </span>
                      {item.tag && (
                        <span style={{ 
                          fontSize: '0.65rem', 
                          fontWeight: 700, 
                          color: 'var(--accent-peach)', 
                          background: 'rgba(255, 100, 61, 0.08)', 
                          padding: '2px 6px', 
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 100, 61, 0.18)'
                        }}>
                          {item.tag}
                        </span>
                      )}
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--text-primary)', lineHeight: 1.25 }}>
                      {item.name}
                    </h4>

                    <p style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: '0.78rem', 
                      lineHeight: 1.4, 
                      minHeight: '36px', 
                      marginBottom: '0.85rem', 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden' 
                    }}>
                      {item.description}
                    </p>
                  </div>

                  {/* Pricing and Action Footer */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    paddingTop: '0.65rem', 
                    marginTop: 'auto',
                    borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                    paddingLeft: '0.35rem',
                    paddingRight: '0.35rem'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', display: 'block', lineHeight: 1 }}>Price</span>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        ₹{item.price.toFixed(0)}
                      </span>
                    </div>
                    
                    {item.inStock ? (
                      qty > 0 ? (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.35rem', 
                          background: 'rgba(255, 100, 61, 0.12)', 
                          border: '1px solid rgba(255, 100, 61, 0.3)', 
                          borderRadius: '12px', 
                          padding: '0.2rem 0.4rem' 
                        }}>
                          <button 
                            onClick={() => removeFromCart(item.id)} 
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.2rem', color: 'var(--accent-peach)' }}
                            title="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontWeight: 800, fontSize: '0.92rem', minWidth: '18px', textAlign: 'center', color: 'var(--accent-peach)' }}>
                            {qty}
                          </span>
                          <button 
                            onClick={() => addToCart(item)} 
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.2rem', color: 'var(--accent-peach)' }}
                            title="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => addToCart(item)} 
                          className="glass-btn glass-btn-primary" 
                          style={{ padding: '0.42rem 1.05rem', fontSize: '0.82rem', borderRadius: '12px', fontWeight: 700 }}
                        >
                          Add +
                        </button>
                      )
                    ) : (
                      <button 
                        disabled 
                        className="glass-btn" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', borderRadius: '10px', cursor: 'not-allowed', color: 'var(--text-tertiary)', background: 'rgba(0,0,0,0.04)' }}
                      >
                        Sold Out
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Digital Token Display, Live Order Journey Tracker & Cart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
        
        {/* Token Calling Live HUD */}
        <div className="glass-panel" style={{ padding: '1.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.18rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={19} style={{ color: 'var(--accent-green)' }} /> Digital Token Board
            </h3>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-green)', background: 'var(--accent-green-light)', padding: '2px 6px', borderRadius: '4px' }}>
              ● LIVE
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Approaching the counter only when your token is called prevents crowding.
          </p>

          <div className="digital-token-display">
            <span style={{ fontSize: '0.72rem', color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Now Serving at Counters
            </span>
            <div className="digital-number">
              {activeToken ? `#${activeToken}` : 'WAITING'}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 600 }}>
              Counter 1: Meals • Counter 2: Snacks & Drinks
            </span>
          </div>
        </div>

        {/* Live Order Journey Tracker */}
        <div className="glass-panel" style={{ padding: '1.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.18rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={18} style={{ color: 'var(--accent-teal)' }} /> Active Orders ({orders.length})
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Live Synced</span>
          </div>

          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.75rem', color: 'var(--text-tertiary)', fontSize: '0.86rem' }}>
              No active orders yet. Add dishes and place one!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map((order) => {
                const isReady = order.status === 'Ready';
                const isPrep = order.status === 'Preparing';
                const isPlaced = order.status === 'Placed';
                
                return (
                  <div 
                    key={order.id} 
                    className="glass-panel glass-panel-subtle" 
                    style={{ 
                      padding: '1.15rem', 
                      background: isReady ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.65)',
                      border: isReady ? '1.5px solid var(--accent-green)' : '1px solid rgba(255, 255, 255, 0.6)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                          Token #{order.token}
                        </span>
                        {order.isSurgeBatch && (
                          <span style={{ fontSize: '0.65rem', background: 'rgba(239, 68, 68, 0.12)', color: 'var(--accent-red)', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>
                            Surge Wave
                          </span>
                        )}
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                          {order.placedAt || 'Just now'}
                        </span>
                      </div>

                      <span 
                        className={isReady ? 'pulse-glow' : isPrep ? 'pulse-glow-peach' : ''}
                        style={{ 
                          fontSize: '0.74rem', 
                          fontWeight: 800, 
                          padding: '0.22rem 0.65rem', 
                          borderRadius: '8px',
                          background: isReady ? 'var(--accent-green-light)' : 
                                      isPrep ? 'var(--accent-peach-light)' : 'rgba(0,0,0,0.05)',
                          color: isReady ? 'var(--accent-green)' : 
                                 isPrep ? 'var(--accent-peach)' : 'var(--text-tertiary)',
                          border: isReady ? '1px solid var(--accent-green)' : 'none'
                        }}
                      >
                        {isReady ? '✨ Ready for Pickup' : isPrep ? '🍳 Cooking in Kitchen' : '📝 Placed in Queue'}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="order-stepper">
                      <div className="order-stepper-line" />
                      <div 
                        className="order-stepper-progress" 
                        style={{ width: isReady ? '100%' : isPrep ? '50%' : '10%' }} 
                      />

                      <div className="stepper-node">
                        <div className={`stepper-icon ${isPlaced || isPrep || isReady ? 'completed' : 'pending'}`}>
                          ✓
                        </div>
                        <span className="stepper-label active">Placed</span>
                      </div>

                      <div className="stepper-node">
                        <div className={`stepper-icon ${isPrep || isReady ? (isReady ? 'completed' : 'active') : 'pending'}`}>
                          🍳
                        </div>
                        <span className={`stepper-label ${isPrep || isReady ? 'active' : ''}`}>Cooking</span>
                      </div>

                      <div className="stepper-node">
                        <div className={`stepper-icon ${isReady ? 'completed' : 'pending'}`}>
                          🍱
                        </div>
                        <span className={`stepper-label ${isReady ? 'active' : ''}`}>Ready</span>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.6rem 0', fontWeight: 500 }}>
                      {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.5rem', color: 'var(--text-tertiary)' }}>
                      <span>Slot: <strong style={{ color: 'var(--text-primary)' }}>{order.slot}</strong></span>
                      <span>Total: <strong style={{ color: 'var(--text-primary)' }}>₹{order.total.toFixed(0)}</strong> ({order.paymentMethod?.toUpperCase()})</span>
                    </div>

                    {isReady && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <button
                          onClick={() => {
                            onPlaySound?.('click');
                            onViewQrPass?.(order);
                          }}
                          className="glass-btn glass-btn-emerald"
                          style={{ width: '100%', padding: '0.55rem', fontSize: '0.82rem', gap: '0.4rem' }}
                        >
                          <QrCode size={15} /> Open Digital Pass (Counter 2)
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Shopping Cart Drawer */}
        <div className="glass-panel" style={{ padding: '1.35rem', background: 'rgba(255,255,255,0.65)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.18rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={18} style={{ color: 'var(--accent-peach)' }} /> Your Plate ({totalCartCount})
            </h3>
            {cart.length > 0 && (
              <button 
                onClick={() => setCart([])} 
                className="glass-btn" 
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', borderRadius: '6px' }}
              >
                Clear
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.2rem 0', color: 'var(--text-tertiary)', fontSize: '0.86rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍽️</div>
              Your food plate is empty. Tap <strong>Add +</strong> on any dish to order!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.55rem', paddingRight: '0.25rem' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem' }}>
                    <div style={{ flexGrow: 1, paddingRight: '0.5rem' }}>
                      <span style={{ fontWeight: 700 }}>{item.quantity}x</span> {item.name}
                    </div>
                    <div style={{ fontWeight: 800, marginRight: '0.75rem', color: 'var(--text-primary)' }}>
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.2rem' }}>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="glass-btn" 
                        style={{ padding: '0.15rem 0.35rem', borderRadius: '4px' }}
                      >
                        -
                      </button>
                      <button 
                        onClick={() => addToCart(item)} 
                        className="glass-btn" 
                        style={{ padding: '0.15rem 0.35rem', borderRadius: '4px' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span>Pickup Mode:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {isScheduled ? `Scheduled (${selectedSlot})` : 'Immediate Preparation'}
                  </span>
                </div>
                {isScheduled && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-teal)', fontWeight: 600, fontSize: '0.74rem' }}>
                    <Info size={12} /> Counter queue bypassed for this slot.
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Total Amount</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-peach)' }}>
                  ₹{getCartTotal().toFixed(2)}
                </span>
              </div>

              <button 
                onClick={handleCheckoutClick}
                className="glass-btn glass-btn-primary" 
                style={{ width: '100%', padding: '0.85rem' }}
              >
                Proceed to Checkout <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Dynamic Island Bottom Dock */}
      {cart.length > 0 && (
        <div className="mobile-cart-dock">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              background: 'var(--accent-peach)', 
              color: 'white', 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              {totalCartCount}
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>₹{getCartTotal().toFixed(2)}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>
                {isScheduled ? `Slot: ${selectedSlot}` : 'Immediate'}
              </div>
            </div>
          </div>

          <button 
            onClick={handleCheckoutClick}
            className="glass-btn glass-btn-primary" 
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.86rem', borderRadius: '999px' }}
          >
            Review & Pay <ArrowUpRight size={16} />
          </button>
        </div>
      )}

    </div>
  );
}
