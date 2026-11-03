import React, { useState } from 'react';
import { 
  Plus, Edit2, Trash2, Sliders, DollarSign, Wallet, 
  Megaphone, BarChart3, Clock, AlertTriangle, Check, 
  Layers, RefreshCw, X, ArrowUpRight, Search, ChefHat, 
  Sparkles, ShieldCheck, Zap
} from 'lucide-react';

export default function CanteenAdminDashboard({ 
  currentUser,
  menuItems, 
  onAddMenuItem, 
  onEditMenuItem, 
  onDeleteMenuItem,
  timeSlots,
  onUpdateSlotLimit,
  onToggleSlotOpen,
  walletBalance,
  onCreditStudentWallet,
  orders,
  announcement,
  onUpdateAnnouncement,
  onPlaySound 
}) {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'slots' | 'ledger' | 'announcements'
  
  // Add/Edit Dish Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null for add, object for edit

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Meals',
    station: 'Meals Tawa',
    price: '',
    prepTime: '5 mins',
    description: '',
    isVeg: true,
    inStock: true,
    stockLimit: '',
    tag: '',
    emoji: '🍽️'
  });

  // Wallet Credit form state
  const [searchStudentId, setSearchStudentId] = useState('CS-402');
  const [creditAmount, setCreditAmount] = useState('');
  const [creditSuccessMsg, setCreditSuccessMsg] = useState('');

  // Announcement input state
  const [announcementText, setAnnouncementText] = useState(announcement || '');

  // Calculate Revenue Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const walletOrders = orders.filter(o => o.paymentMethod === 'wallet');
  const upiOrders = orders.filter(o => o.paymentMethod === 'upi');
  const codOrders = orders.filter(o => o.paymentMethod === 'cod');

  const walletRevenue = walletOrders.reduce((sum, o) => sum + o.total, 0);
  const upiRevenue = upiOrders.reduce((sum, o) => sum + o.total, 0);
  const codRevenue = codOrders.reduce((sum, o) => sum + o.total, 0);

  // Open Modal for Add
  const handleOpenAdd = () => {
    onPlaySound?.('click');
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Meals',
      station: 'Meals Tawa',
      price: '',
      prepTime: '5 mins',
      description: '',
      isVeg: true,
      inStock: true,
      stockLimit: '',
      tag: '',
      emoji: '🍛',
      image: ''
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (item) => {
    onPlaySound?.('click');
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      station: item.station || 'Meals Tawa',
      price: item.price.toString(),
      prepTime: item.prepTime || '5 mins',
      description: item.description,
      isVeg: item.isVeg,
      inStock: item.inStock,
      stockLimit: item.stockLimit !== null ? item.stockLimit.toString() : '',
      tag: item.tag || '',
      emoji: item.emoji || '🍽️',
      image: item.image || ''
    });
    setIsModalOpen(true);
  };

  // Submit Add or Edit
  const handleSubmitDish = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert("Please provide at least a dish name and price.");
      return;
    }

    onPlaySound?.('success');

    const dishPayload = {
      name: formData.name.trim(),
      category: formData.category,
      station: formData.station,
      price: parseFloat(formData.price),
      prepTime: formData.prepTime.trim(),
      description: formData.description.trim() || 'Freshly prepared in campus kitchen.',
      isVeg: formData.isVeg,
      inStock: formData.inStock,
      stockLimit: formData.stockLimit === '' ? null : parseInt(formData.stockLimit),
      tag: formData.tag.trim(),
      emoji: formData.emoji.trim() || '🍽️',
      image: formData.image?.trim() || editingItem?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'
    };

    if (editingItem) {
      onEditMenuItem({ ...dishPayload, id: editingItem.id });
    } else {
      onAddMenuItem({ ...dishPayload, id: Date.now() });
    }

    setIsModalOpen(false);
  };

  // Handle Wallet Credit Submission
  const handleCreditStudent = (e) => {
    e.preventDefault();
    const amt = parseFloat(creditAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid rupee amount to credit.");
      return;
    }

    onPlaySound?.('success');
    onCreditStudentWallet(amt);
    setCreditSuccessMsg(`₹${amt} successfully credited to Student #${searchStudentId} (Ashal)`);
    setCreditAmount('');
    setTimeout(() => setCreditSuccessMsg(''), 4000);
  };

  // Handle Announcement Post
  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    onPlaySound?.('success');
    onUpdateAnnouncement(announcementText.trim());
    alert("📢 Announcement broadcasted live across Student and Kitchen portals!");
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      
      {/* Admin Executive Header */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '1.5rem 1.6rem', 
          marginBottom: '1.5rem', 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.6) 100%)' 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Canteen Administration Hub ⚙️</h2>
              <span style={{ 
                fontSize: '0.74rem', 
                fontWeight: 800, 
                color: 'var(--accent-purple)', 
                background: 'rgba(139, 92, 246, 0.12)', 
                padding: '2px 9px', 
                borderRadius: '999px',
                border: '1px solid rgba(139, 92, 246, 0.25)'
              }}>
                🛡️ {currentUser?.name || 'Rajesh Sharma'} (#{currentUser?.id || 'ADM-01'})
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-teal)', background: 'rgba(2, 132, 199, 0.12)', padding: '2px 8px', borderRadius: '999px' }}>
                Management Console
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Configure daily menus, control slot bottleneck thresholds, manage wallet balances, and broadcast notices.
            </p>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="glass-panel glass-panel-subtle" style={{ padding: '0.65rem 1.15rem', textAlign: 'center', minWidth: '110px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 800 }}>
                Today's Revenue
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                ₹{totalRevenue.toFixed(0)}
              </div>
            </div>

            <div className="glass-panel glass-panel-subtle" style={{ padding: '0.65rem 1.15rem', textAlign: 'center', minWidth: '110px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 800 }}>
                Active Dishes
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-peach)' }}>
                {menuItems.filter(m => m.inStock).length} / {menuItems.length}
              </div>
            </div>

            <div className="glass-panel glass-panel-subtle" style={{ padding: '0.65rem 1.15rem', textAlign: 'center', minWidth: '110px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 800 }}>
                Total Orders
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {orders.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="nav-tabs" style={{ marginBottom: '1.5rem' }}>
        <button 
          onClick={() => {
            onPlaySound?.('click');
            setActiveTab('menu');
          }}
          className={`nav-tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
        >
          <Edit2 size={16} /> Menu & Pricing Studio ({menuItems.length})
        </button>

        <button 
          onClick={() => {
            onPlaySound?.('click');
            setActiveTab('slots');
          }}
          className={`nav-tab-btn ${activeTab === 'slots' ? 'active' : ''}`}
        >
          <Sliders size={16} /> Slot Capacity & Bottlenecks
        </button>

        <button 
          onClick={() => {
            onPlaySound?.('click');
            setActiveTab('ledger');
          }}
          className={`nav-tab-btn ${activeTab === 'ledger' ? 'active' : ''}`}
        >
          <Wallet size={16} /> Financials & Wallet Credits
        </button>

        <button 
          onClick={() => {
            onPlaySound?.('click');
            setActiveTab('announcements');
          }}
          className={`nav-tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
        >
          <Megaphone size={16} /> Live Announcement Ticker
        </button>
      </div>

      {/* TAB 1: Menu & Pricing Studio (CRUD) */}
      {activeTab === 'menu' && (
        <div className="glass-panel" style={{ padding: '1.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Live Menu Catalog & Pricing</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
                Add dishes, update meal prices, adjust kitchen station routing, and toggle daily specialties.
              </p>
            </div>

            <button 
              onClick={handleOpenAdd}
              className="glass-btn glass-btn-primary"
              style={{ padding: '0.6rem 1.35rem', fontSize: '0.9rem' }}
            >
              <Plus size={18} /> Add New Dish +
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', textAlign: 'left', color: 'var(--text-tertiary)' }}>
                  <th style={{ padding: '0.85rem 0.65rem' }}>Dish & Tag</th>
                  <th style={{ padding: '0.85rem 0.65rem' }}>Category</th>
                  <th style={{ padding: '0.85rem 0.65rem' }}>Kitchen Station</th>
                  <th style={{ padding: '0.85rem 0.65rem' }}>Price (₹)</th>
                  <th style={{ padding: '0.85rem 0.65rem' }}>Batch Stock Limit</th>
                  <th style={{ padding: '0.85rem 0.65rem', textAlign: 'center' }}>Live Status</th>
                  <th style={{ padding: '0.85rem 0.65rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding: '0.85rem 0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.35rem' }}>{item.emoji || '🍽️'}</span>
                        <div>
                          <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{item.name}</div>
                          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', marginTop: '2px' }}>
                            <span style={{ 
                              fontSize: '0.65rem', 
                              fontWeight: 800, 
                              color: item.isVeg ? '#059669' : '#dc2626', 
                              background: item.isVeg ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                              padding: '1px 5px',
                              borderRadius: '4px'
                            }}>
                              {item.isVeg ? 'VEG' : 'NON-VEG'}
                            </span>
                            {item.tag && (
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-peach)' }}>
                                • {item.tag}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 0.65rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {item.category}
                    </td>

                    <td style={{ padding: '0.85rem 0.65rem' }}>
                      <span style={{ 
                        fontSize: '0.78rem', 
                        fontWeight: 700, 
                        color: item.station === 'Meals Tawa' ? 'var(--accent-peach)' : item.station === 'Beverage Bar' ? 'var(--accent-teal)' : '#10b981',
                        background: 'rgba(0,0,0,0.04)',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        {item.station || 'Meals Tawa'}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 0.65rem', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                      ₹{item.price.toFixed(0)}
                    </td>

                    <td style={{ padding: '0.85rem 0.65rem', color: 'var(--text-secondary)' }}>
                      {item.stockLimit !== null ? `${item.stockLimit} units` : 'Unlimited batch'}
                    </td>

                    <td style={{ padding: '0.85rem 0.65rem', textAlign: 'center' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 800, 
                        color: item.inStock ? 'var(--accent-green)' : 'var(--accent-red)',
                        background: item.inStock ? 'var(--accent-green-light)' : 'var(--accent-red-light)',
                        padding: '3px 8px',
                        borderRadius: '8px'
                      }}>
                        {item.inStock ? 'In Stock ✓' : 'Sold Out ✕'}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 0.65rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button 
                          onClick={() => handleOpenEdit(item)}
                          className="glass-btn"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', color: 'var(--accent-teal)' }}
                          title="Edit pricing and details"
                        >
                          <Edit2 size={14} /> Edit
                        </button>

                        <button 
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${item.name} from the canteen menu?`)) {
                              onDeleteMenuItem(item.id);
                            }
                          }}
                          className="glass-btn"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', color: 'var(--accent-red)' }}
                          title="Delete item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Time-Slot Throttling & Capacity Controller */}
      {activeTab === 'slots' && (
        <div className="glass-panel" style={{ padding: '1.6rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            Queue Throttling & Concurrency Capacity Manager
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '1.5rem' }}>
            Control the maximum allowed concurrent orders per 15-minute slot. When staff is short, decrease capacity; during campus fests, increase limits.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.15rem' }}>
            {timeSlots.map((slot) => {
              const fillPercent = Math.round((slot.fillLevel / slot.limit) * 100);
              const isThrottled = slot.status === 'full' || slot.fillLevel >= slot.limit;

              return (
                <div 
                  key={slot.time} 
                  className="glass-panel glass-card-interactive" 
                  style={{ 
                    padding: '1.25rem', 
                    borderRadius: '18px',
                    border: isThrottled ? '1.5px solid var(--accent-red)' : '1px solid rgba(255,255,255,0.7)',
                    background: isThrottled ? 'rgba(239, 68, 68, 0.03)' : 'rgba(255,255,255,0.75)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{slot.time}</div>
                    <span style={{ 
                      fontSize: '0.74rem', 
                      fontWeight: 800, 
                      color: isThrottled ? 'var(--accent-red)' : 'var(--accent-green)',
                      background: isThrottled ? 'var(--accent-red-light)' : 'var(--accent-green-light)',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      {isThrottled ? 'Capacity Capped' : 'Accepting Orders'}
                    </span>
                  </div>

                  {/* Progress fill */}
                  <div style={{ height: '6px', background: 'rgba(0,0,0,0.06)', borderRadius: '99px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${Math.min(100, fillPercent)}%`, 
                      background: isThrottled ? 'var(--accent-red)' : fillPercent > 70 ? 'var(--accent-peach)' : 'var(--accent-green)' 
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                    <span>Booked: <strong>{slot.fillLevel} orders</strong></span>
                    <span>Max Limit: <strong>{slot.limit} orders</strong></span>
                  </div>

                  {/* Adjust Capacity limit */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Adjust Max Capacity:</span>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {[10, 15, 20, 25].map(cap => (
                        <button
                          key={cap}
                          onClick={() => {
                            onPlaySound?.('click');
                            onUpdateSlotLimit?.(slot.time, cap);
                          }}
                          className="glass-btn"
                          style={{
                            padding: '0.25rem 0.55rem',
                            fontSize: '0.76rem',
                            borderRadius: '6px',
                            background: slot.limit === cap ? 'var(--text-primary)' : 'rgba(255,255,255,0.4)',
                            color: slot.limit === cap ? 'white' : 'var(--text-secondary)'
                          }}
                        >
                          {cap}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Financials & Student Wallet Ledger */}
      {activeTab === 'ledger' && (
        <div className="dashboard-grid">
          
          {/* Revenue Breakdown */}
          <div className="glass-panel" style={{ padding: '1.6rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              Payment Channel Analytics
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '1.5rem' }}>
              Comparison of instant campus pass wallets vs external UPI gateways during rush hours.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Wallet Row */}
              <div className="glass-panel" style={{ padding: '1.15rem', background: 'rgba(2, 132, 199, 0.06)', border: '1px solid rgba(2, 132, 199, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--accent-teal)' }}>Campus Pass Wallet (Zero Gateway Fee)</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{walletRevenue.toFixed(0)}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  {walletOrders.length} transactions • 100% offline-resilient to basement cell drops
                </div>
              </div>

              {/* UPI Row */}
              <div className="glass-panel" style={{ padding: '1.15rem', background: 'rgba(255, 100, 61, 0.06)', border: '1px solid rgba(255, 100, 61, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--accent-peach)' }}>Live UPI (GPay / PhonePe / Paytm)</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{upiRevenue.toFixed(0)}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  {upiOrders.length} transactions • Subject to cellular reception
                </div>
              </div>

              {/* Cash Row */}
              <div className="glass-panel" style={{ padding: '1.15rem', background: 'rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--text-secondary)' }}>Physical Counter Cash</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{codRevenue.toFixed(0)}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  {codOrders.length} transactions • Creates counter change bottlenecks
                </div>
              </div>

            </div>
          </div>

          {/* Student Account Credit / Top-Up Console */}
          <div className="glass-panel" style={{ padding: '1.6rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              Student Wallet Top-Up Tool
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '1.5rem' }}>
              When a student gives cash at the manager's office to reload their digital pass, credit it directly here.
            </p>

            <form onSubmit={handleCreditStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                  Student Roll / ID Number:
                </label>
                <input 
                  type="text" 
                  value={searchStudentId}
                  onChange={(e) => setSearchStudentId(e.target.value)}
                  className="glass-input" 
                  style={{ padding: '0.65rem 1rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                  Amount to Credit (₹):
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="number" 
                    placeholder="e.g. 500" 
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    className="glass-input" 
                    style={{ padding: '0.65rem 1rem', flex: 1 }}
                  />
                  <button type="submit" className="glass-btn glass-btn-primary">
                    Credit Pass +
                  </button>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[100, 200, 500, 1000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCreditAmount(amt.toString())}
                    className="glass-btn"
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem', flex: 1 }}
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              {/* Success Alert */}
              {creditSuccessMsg && (
                <div style={{ background: 'var(--accent-green-light)', border: '1px solid var(--accent-green)', padding: '0.75rem', borderRadius: '12px', color: 'var(--accent-green)', fontSize: '0.84rem', fontWeight: 700, animation: 'fadeIn 0.25s ease' }}>
                  ✓ {creditSuccessMsg}
                </div>
              )}

              <div className="glass-panel" style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                Current live balance for Ashal (#CS-402): <strong style={{ color: 'var(--text-primary)' }}>₹{walletBalance.toFixed(2)}</strong>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* TAB 4: Campus Announcement Notice Broadcaster */}
      {activeTab === 'announcements' && (
        <div className="glass-panel" style={{ padding: '1.6rem', maxWidth: '780px' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            Live Student Notice & Banner Broadcaster
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '1.5rem' }}>
            Broadcast real-time kitchen alerts, special menu festivals, or early closure warnings directly onto the student ordering screen.
          </p>

          <form onSubmit={handlePostAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                Announcement Message (Appears as top marquee for all students):
              </label>
              <textarea 
                rows={3}
                placeholder="e.g. 📢 Special South Indian Thali available today at Counter 1! Samosas refilling in 10 mins."
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="glass-input" 
                style={{ padding: '0.75rem 1rem', width: '100%', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="glass-btn glass-btn-primary">
                Broadcast Live Banner 📢
              </button>

              <button 
                type="button" 
                onClick={() => {
                  setAnnouncementText('');
                  onUpdateAnnouncement('');
                }}
                className="glass-btn"
                style={{ color: 'var(--accent-red)' }}
              >
                Clear Notice
              </button>
            </div>

            {announcement && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: '0.35rem' }}>
                  Current Active Banner Preview:
                </div>
                <div style={{ background: 'rgba(255, 100, 61, 0.1)', border: '1px solid rgba(255, 100, 61, 0.3)', padding: '0.75rem 1rem', borderRadius: '12px', color: 'var(--accent-peach)', fontWeight: 700, fontSize: '0.88rem' }}>
                  {announcement}
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Modal for Add / Edit Dish */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div 
            className="modal-content glass-panel" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px', padding: '2rem' }}
          >
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="glass-btn" 
              style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.4rem', borderRadius: '50%' }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              {editingItem ? 'Edit Dish & Pricing' : 'Add New Dish to Menu'}
            </h3>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              All changes sync instantly to student apps and kitchen cook queues.
            </p>

            <form onSubmit={handleSubmitDish} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Dish Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Paneer Butter Masala"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="glass-input" 
                    style={{ padding: '0.55rem 0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Emoji</label>
                  <input 
                    type="text" 
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    className="glass-input" 
                    style={{ padding: '0.55rem 0.85rem', textAlign: 'center', fontSize: '1.2rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="glass-input"
                    style={{ padding: '0.55rem 0.85rem' }}
                  >
                    <option value="Meals">Meals</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Prep Station</label>
                  <select 
                    value={formData.station}
                    onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                    className="glass-input"
                    style={{ padding: '0.55rem 0.85rem' }}
                  >
                    <option value="Meals Tawa">Meals Tawa (Hot)</option>
                    <option value="Quick Snacks">Quick Snacks Counter</option>
                    <option value="Beverage Bar">Beverage Bar</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Price (₹) *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 85"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="glass-input" 
                    style={{ padding: '0.55rem 0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Prep Time</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 6 mins"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                    className="glass-input" 
                    style={{ padding: '0.55rem 0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Description</label>
                <textarea 
                  rows={2}
                  placeholder="Ingredients and serving details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="glass-input" 
                  style={{ padding: '0.55rem 0.85rem', width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Food Photo Image URL (Optional)</label>
                <input 
                  type="url" 
                  placeholder="https://images.unsplash.com/... (or leave blank for delicious default)"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="glass-input" 
                  style={{ padding: '0.55rem 0.85rem', width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Special Tag</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 🔥 Chef Special"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="glass-input" 
                    style={{ padding: '0.55rem 0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Batch Stock Limit</label>
                  <input 
                    type="number" 
                    placeholder="Blank for unlimited"
                    value={formData.stockLimit}
                    onChange={(e) => setFormData({ ...formData, stockLimit: e.target.value })}
                    className="glass-input" 
                    style={{ padding: '0.55rem 0.85rem' }}
                  />
                </div>
              </div>

              {/* Veg / In-Stock Switches */}
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.86rem', fontWeight: 700 }}>
                  <input 
                    type="checkbox" 
                    checked={formData.isVeg}
                    onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                  />
                  Vegetarian Dish
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.86rem', fontWeight: 700 }}>
                  <input 
                    type="checkbox" 
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  />
                  Active In Stock
                </label>
              </div>

              <button 
                type="submit" 
                className="glass-btn glass-btn-primary" 
                style={{ width: '100%', marginTop: '0.75rem', padding: '0.8rem' }}
              >
                {editingItem ? 'Save Updates' : 'Add Dish to Live Menu'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
