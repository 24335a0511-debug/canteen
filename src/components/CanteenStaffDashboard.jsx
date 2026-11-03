import React, { useState } from 'react';
import { 
  ToggleLeft, ToggleRight, ListFilter, ClipboardList, RefreshCw, 
  CheckCircle, Volume2, ShieldAlert, Sparkles, ChefHat, Search, 
  Flame, CheckCircle2, Clock, ArrowRight, BellRing, Activity, AlertTriangle, Layers
} from 'lucide-react';

export default function CanteenStaffDashboard({ 
  currentUser,
  menuItems, 
  orders, 
  onUpdateOrderStatus, 
  onToggleStock, 
  onUpdateStockLimit, 
  activeToken, 
  onCallToken,
  onPlaySound,
  scenario 
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory' | 'calling'
  const [tokenOverride, setTokenOverride] = useState('');
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'Placed' | 'Preparing' | 'Ready'
  const [searchToken, setSearchToken] = useState('');

  const activeOrders = orders.filter(o => o.status !== 'Collected');
  const completedOrders = orders.filter(o => o.status === 'Collected');

  const filteredOrders = activeOrders.filter(o => {
    const matchesStatus = orderFilter === 'all' || o.status === orderFilter;
    const matchesSearch = searchToken === '' || o.token.includes(searchToken.trim());
    return matchesStatus && matchesSearch;
  });

  const handleCallCustomToken = (e) => {
    e.preventDefault();
    if (tokenOverride.trim()) {
      onPlaySound?.('call');
      onCallToken(tokenOverride.trim());
      setTokenOverride('');
    }
  };

  const pendingCount = orders.filter(o => o.status === 'Placed' || o.status === 'Preparing').length;
  const readyCount = orders.filter(o => o.status === 'Ready').length;

  // Station tickets count
  const mealsTickets = activeOrders.filter(o => o.items.some(i => i.station === 'Meals Tawa' || i.name.includes('Dosa') || i.name.includes('Chole') || i.name.includes('Rice'))).length;
  const snacksTickets = activeOrders.filter(o => o.items.some(i => i.station === 'Quick Snacks' || i.name.includes('Pav') || i.name.includes('Patty'))).length;
  const drinksTickets = activeOrders.filter(o => o.items.some(i => i.station === 'Beverage Bar' || i.name.includes('Coffee') || i.name.includes('Brownie'))).length;

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      
      {/* Staff Stats Header */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '1.5rem 1.6rem', 
          marginBottom: '1.25rem', 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 100%)' 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Canteen Kitchen Hub 🍳</h2>
              <span style={{ 
                fontSize: '0.74rem', 
                fontWeight: 800, 
                color: 'var(--accent-peach)', 
                background: 'rgba(255, 100, 61, 0.12)', 
                padding: '2px 9px', 
                borderRadius: '999px',
                border: '1px solid rgba(255, 100, 61, 0.25)'
              }}>
                👨‍🍳 {currentUser?.name || 'Chef Ramesh'} (#{currentUser?.id || 'KIT-08'})
              </span>
              <span style={{ 
                fontSize: '0.72rem', 
                fontWeight: 800, 
                color: scenario?.statusColor || 'var(--accent-peach)', 
                background: 'rgba(0,0,0,0.06)', 
                padding: '2px 8px', 
                borderRadius: '999px' 
              }}>
                Mode: {scenario?.label || 'Peak Rush'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Logged in as Kitchen Station Head. Manage live tickets, station load balancing, and wall token broadcasting.
            </p>
          </div>
          
          {/* Key Metric Counters */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="glass-panel glass-panel-subtle" style={{ padding: '0.65rem 1.15rem', textAlign: 'center', minWidth: '100px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 800 }}>
                Pending Prep
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-peach)' }}>
                {pendingCount}
              </div>
            </div>

            <div className="glass-panel glass-panel-subtle" style={{ padding: '0.65rem 1.15rem', textAlign: 'center', minWidth: '100px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 800 }}>
                Ready to Handover
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                {readyCount}
              </div>
            </div>

            <div className="glass-panel glass-panel-subtle" style={{ padding: '0.65rem 1.15rem', textAlign: 'center', minWidth: '100px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 800 }}>
                Fulfilled Today
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {completedOrders.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Station Bottleneck Diagnostics Bar */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '0.85rem 1.25rem', 
          marginBottom: '1.5rem',
          background: 'rgba(255,255,255,0.6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.85rem' }}>
          <Layers size={16} style={{ color: 'var(--accent-peach)' }} /> Station Load Balance:
        </div>

        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
            <span style={{ fontWeight: 700 }}>🍳 Meals Tawa Station:</span>
            <span style={{ 
              fontWeight: 800, 
              color: mealsTickets >= 4 ? 'var(--accent-red)' : 'var(--accent-green)',
              background: mealsTickets >= 4 ? 'var(--accent-red-light)' : 'var(--accent-green-light)',
              padding: '1px 6px',
              borderRadius: '4px'
            }}>
              {mealsTickets} Active Tickets {mealsTickets >= 4 ? '(Bottleneck Surge)' : '(Normal)'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
            <span style={{ fontWeight: 700 }}>🥪 Snacks Counter:</span>
            <span style={{ fontWeight: 800, color: 'var(--accent-green)', background: 'var(--accent-green-light)', padding: '1px 6px', borderRadius: '4px' }}>
              {snacksTickets} Active Tickets (Clear)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
            <span style={{ fontWeight: 700 }}>🥤 Beverage Station:</span>
            <span style={{ fontWeight: 800, color: 'var(--accent-teal)', background: 'rgba(2, 132, 199, 0.1)', padding: '1px 6px', borderRadius: '4px' }}>
              {drinksTickets} Active Tickets (Instant)
            </span>
          </div>
        </div>
      </div>

      {/* Main Mode Segmented Control */}
      <div className="nav-tabs" style={{ marginBottom: '1.5rem' }}>
        <button 
          onClick={() => {
            onPlaySound?.('click');
            setActiveTab('orders');
          }}
          className={`nav-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
        >
          <ClipboardList size={16} /> Kitchen Queue ({activeOrders.length})
        </button>
        <button 
          onClick={() => {
            onPlaySound?.('click');
            setActiveTab('inventory');
          }}
          className={`nav-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
        >
          <RefreshCw size={16} /> Dynamic Stock & Limits ({menuItems.length})
        </button>
        <button 
          onClick={() => {
            onPlaySound?.('click');
            setActiveTab('calling');
          }}
          className={`nav-tab-btn ${activeTab === 'calling' ? 'active' : ''}`}
        >
          <BellRing size={16} /> Token Caller Broadcaster
        </button>
      </div>

      {/* TAB 1: Kitchen Orders Workflow Queue */}
      {activeTab === 'orders' && (
        <div className="dashboard-grid">
          
          {/* Main Queue Column */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ChefHat size={22} style={{ color: 'var(--accent-peach)' }} /> Active Cooking Orders
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  Prioritize scheduled slots to guarantee zero-wait handovers
                </span>
              </div>

              {/* Search Token */}
              <div className="glass-input-wrapper" style={{ width: '180px' }}>
                <Search className="glass-input-icon" size={15} />
                <input 
                  type="text" 
                  placeholder="Filter token #"
                  value={searchToken}
                  onChange={(e) => setSearchToken(e.target.value)}
                  className="glass-input" 
                  style={{ padding: '0.45rem 0.8rem 0.45rem 2.2rem', fontSize: '0.84rem' }}
                />
              </div>
            </div>

            {/* Filter pills */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'Placed', label: 'Placed (New)' },
                { id: 'Preparing', label: 'Cooking Now' },
                { id: 'Ready', label: 'Ready for Pickup' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    onPlaySound?.('click');
                    setOrderFilter(f.id);
                  }}
                  className="glass-btn"
                  style={{
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.82rem',
                    borderRadius: '12px',
                    background: orderFilter === f.id ? 'var(--text-primary)' : 'rgba(255,255,255,0.4)',
                    color: orderFilter === f.id ? 'white' : 'var(--text-secondary)',
                    boxShadow: orderFilter === f.id ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 0', color: 'var(--text-tertiary)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
                No orders waiting in this filter. Kitchen queue is clear!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                {filteredOrders.map((order) => {
                  const isPlaced = order.status === 'Placed';
                  const isPreparing = order.status === 'Preparing';
                  const isReady = order.status === 'Ready';
                  const isScheduled = order.slot !== 'Immediate';

                  return (
                    <div 
                      key={order.id} 
                      className="glass-panel glass-card-interactive" 
                      style={{ 
                        padding: '1.35rem', 
                        background: isReady ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.75)',
                        border: isReady ? '1.5px solid var(--accent-green)' : '1px solid rgba(255, 255, 255, 0.7)',
                        borderRadius: '18px'
                      }}
                    >
                      {/* Ticket Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Token #{order.token}</span>
                            
                            <span style={{ 
                              fontSize: '0.72rem', 
                              fontWeight: 700, 
                              padding: '2px 8px', 
                              borderRadius: '6px', 
                              background: isScheduled ? 'rgba(2, 132, 199, 0.12)' : 'rgba(255, 100, 61, 0.12)',
                              color: isScheduled ? 'var(--accent-teal)' : 'var(--accent-peach)',
                              border: isScheduled ? '1px solid rgba(2, 132, 199, 0.25)' : '1px solid rgba(255, 100, 61, 0.25)'
                            }}>
                              {isScheduled ? `⏰ Slot: ${order.slot}` : '⚡ Direct Immediate'}
                            </span>

                            {order.isSurgeBatch && (
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-red)', background: 'var(--accent-red-light)', padding: '2px 6px', borderRadius: '4px' }}>
                                Flash Mob Wave
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                            Ordered at: <strong>{order.placedAt || 'Recent'}</strong> • Paid via: <strong>{order.paymentMethod?.toUpperCase()}</strong>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 800, 
                          padding: '0.3rem 0.75rem', 
                          borderRadius: '8px',
                          background: isReady ? 'var(--accent-green-light)' : 
                                      isPreparing ? 'var(--accent-peach-light)' : 'rgba(0,0,0,0.06)',
                          color: isReady ? 'var(--accent-green)' : 
                                 isPreparing ? 'var(--accent-peach)' : 'var(--text-tertiary)',
                          border: isReady ? '1px solid var(--accent-green)' : 'none'
                        }}>
                          {order.status}
                        </span>
                      </div>

                      {/* Items List */}
                      <div style={{ margin: '0.75rem 0', padding: '0.65rem 0', borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        {order.items.map((item) => (
                          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', marginBottom: '0.3rem' }}>
                            <span><strong>{item.quantity}x</strong> {item.name}</span>
                            <span style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(0)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Controls */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800 }}>Total: ₹{order.total.toFixed(0)}</span>
                        
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {isPlaced && (
                            <button 
                              onClick={() => onUpdateOrderStatus(order.id, 'Preparing')}
                              className="glass-btn glass-btn-teal"
                              style={{ padding: '0.45rem 1.15rem', fontSize: '0.86rem' }}
                            >
                              Accept & Start Cook 🍳
                            </button>
                          )}

                          {isPreparing && (
                            <button 
                              onClick={() => {
                                onUpdateOrderStatus(order.id, 'Ready');
                                onPlaySound?.('call');
                                onCallToken(order.token);
                              }}
                              className="glass-btn glass-btn-primary"
                              style={{ padding: '0.45rem 1.15rem', fontSize: '0.86rem' }}
                            >
                              Ready & Call Token 📢
                            </button>
                          )}

                          {isReady && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button 
                                onClick={() => {
                                  onPlaySound?.('call');
                                  onCallToken(order.token);
                                }}
                                className="glass-btn"
                                style={{ padding: '0.45rem 0.95rem', fontSize: '0.86rem', color: 'var(--accent-teal)' }}
                                title="Re-announce token on canteen screen"
                              >
                                <Volume2 size={16} /> Re-Call #{order.token}
                              </button>
                              
                              <button 
                                onClick={() => onUpdateOrderStatus(order.id, 'Collected')}
                                className="glass-btn glass-btn-emerald"
                                style={{ padding: '0.45rem 1.15rem', fontSize: '0.86rem' }}
                              >
                                Handed Over ✓
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Fulfilled History Column */}
          <div className="glass-panel" style={{ padding: '1.35rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.18rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} style={{ color: 'var(--accent-green)' }} /> Handed Over Today ({completedOrders.length})
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>
              Completed food pickups archived safely.
            </p>

            <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.55rem', paddingRight: '0.2rem' }}>
              {completedOrders.map(order => (
                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.4)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.6)' }}>
                  <div>
                    <strong>Token #{order.token}</strong>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '0.74rem' }}>
                      {order.items.length} items • Slot: {order.slot}
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--text-secondary)' }}>
                    ₹{order.total.toFixed(0)}
                  </div>
                </div>
              ))}
              {completedOrders.length === 0 && (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>
                  No orders completed yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Dynamic Stock & Menu Toggles */}
      {activeTab === 'inventory' && (
        <div className="glass-panel" style={{ padding: '1.6rem' }}>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>Dynamic Canteen Stock Switcher</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            Prevent student disappointment by turning off sold-out items instantly or setting capped batch availability.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', textAlign: 'left' }}>
                  <th style={{ padding: '0.85rem 0.65rem' }}>Dish & Info</th>
                  <th style={{ padding: '0.85rem 0.65rem' }}>Category</th>
                  <th style={{ padding: '0.85rem 0.65rem' }}>Price</th>
                  <th style={{ padding: '0.85rem 0.65rem', textAlign: 'center' }}>Live In-Stock Toggle</th>
                  <th style={{ padding: '0.85rem 0.65rem', textAlign: 'center' }}>Portion Capacity Limit</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding: '0.85rem 0.65rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
                        {item.isVeg ? '🟩 Veg' : '🟥 Non-Veg'} • Prep: {item.prepTime || '5 mins'}
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 0.65rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.category}</td>
                    <td style={{ padding: '0.85rem 0.65rem', fontWeight: 800 }}>₹{item.price}</td>
                    
                    <td style={{ padding: '0.85rem 0.65rem', textAlign: 'center' }}>
                      <button 
                        onClick={() => onToggleStock(item.id)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                      >
                        {item.inStock ? (
                          <ToggleRight size={42} style={{ color: 'var(--accent-green)' }} />
                        ) : (
                          <ToggleLeft size={42} style={{ color: 'var(--text-tertiary)' }} />
                        )}
                      </button>
                    </td>

                    <td style={{ padding: '0.85rem 0.65rem', textAlign: 'center' }}>
                      <input 
                        type="number" 
                        disabled={!item.inStock}
                        placeholder="Unlimited"
                        value={item.stockLimit || ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseInt(e.target.value);
                          onUpdateStockLimit(item.id, val);
                        }}
                        style={{ 
                          width: '90px', 
                          padding: '0.4rem', 
                          borderRadius: '8px', 
                          border: '1px solid rgba(0,0,0,0.15)',
                          textAlign: 'center',
                          fontWeight: 700,
                          opacity: item.inStock ? 1 : 0.4
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Token Board Calling Simulator */}
      {activeTab === 'calling' && (
        <div className="dashboard-grid">
          
          {/* Controls */}
          <div className="glass-panel" style={{ padding: '1.6rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>Canteen Broadcaster Console</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '1.5rem' }}>
              Broadcast ready orders onto the cafeteria wall screen to avoid counter crowding.
            </p>

            <form onSubmit={handleCallCustomToken} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ flexGrow: 1 }}>
                <input 
                  type="text" 
                  placeholder="Enter token number (e.g. 105)" 
                  value={tokenOverride}
                  onChange={(e) => setTokenOverride(e.target.value)}
                  className="glass-input" 
                  style={{ padding: '0.65rem 1rem', fontSize: '0.92rem' }}
                />
              </div>
              <button type="submit" className="glass-btn glass-btn-teal">
                Broadcast Token 📢
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                Ready to Pick Up ({orders.filter(o => o.status === 'Ready').length}):
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                {orders.filter(o => o.status === 'Ready').map(order => (
                  <button
                    key={order.id}
                    onClick={() => {
                      onPlaySound?.('call');
                      onCallToken(order.token);
                    }}
                    className="glass-btn glass-btn-primary"
                    style={{ padding: '0.55rem 1.15rem', fontSize: '0.88rem' }}
                  >
                    Call #{order.token}
                  </button>
                ))}

                {orders.filter(o => o.status === 'Ready').length === 0 && (
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                    No orders currently waiting in "Ready" status.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live High-Def Token Display Preview */}
          <div className="glass-panel" style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h4 style={{ fontSize: '1.15rem', marginBottom: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Wall-Mounted Cafeteria Display Preview
            </h4>

            <div className="digital-token-display" style={{ padding: '3.2rem 1.5rem' }}>
              <span style={{ fontSize: '0.95rem', color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                Now Serving at Food Counter
              </span>
              <div className="digital-number" style={{ fontSize: '5.2rem', margin: '1rem 0' }}>
                {activeToken ? `#${activeToken}` : 'WAITING'}
              </div>
              <span style={{ fontSize: '0.84rem', color: '#047857', fontWeight: 700 }}>
                ● Real-Time Broadcast Feed
              </span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
