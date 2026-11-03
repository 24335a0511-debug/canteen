import React, { useState } from 'react';
import { X, Smartphone, CreditCard, ShieldCheck, Wallet, ArrowRight, Loader2, Zap, AlertCircle, Sparkles, WifiOff } from 'lucide-react';

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  totalAmount, 
  onPaymentSuccess, 
  walletBalance, 
  onRecharge,
  onPlaySound,
  isNetworkOutage = false 
}) {
  const [paymentMethod, setPaymentMethod] = useState('wallet'); // 'wallet' | 'upi' | 'cod'
  const [upiProvider, setUpiProvider] = useState(''); // 'Google Pay' | 'PhonePe' | 'Paytm'
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('select'); // 'select' | 'processing' | 'success'
  const [processingMsg, setProcessingMsg] = useState('');
  
  const [rechargeAmount, setRechargeAmount] = useState('');

  if (!isOpen) return null;

  const handleWalletPayment = () => {
    if (walletBalance < totalAmount) {
      alert("Insufficient wallet balance! Please recharge your Campus Wallet below.");
      return;
    }
    
    onPlaySound?.('click');
    setIsProcessing(true);
    setProcessingMsg('Validating campus canteen ledger token securely...');
    setStep('processing');
    
    setTimeout(() => {
      onPaymentSuccess('wallet');
      setStep('success');
      setIsProcessing(false);
    }, 1100);
  };

  const handleUPIPayment = (provider) => {
    setUpiProvider(provider);
    onPlaySound?.('click');
    setIsProcessing(true);
    setStep('processing');
    
    if (isNetworkOutage) {
      // Simulate slow connection packet loss
      setProcessingMsg(`Connecting to ${provider}... [⚠️ Weak Signal: Retrying packet handshake 1/2]`);
      setTimeout(() => {
        setProcessingMsg(`Weak basement reception... Bank clearance delayed, finalizing transaction...`);
      }, 2000);

      setTimeout(() => {
        onPaymentSuccess('upi');
        setStep('success');
        setIsProcessing(false);
      }, 4200);
    } else {
      setProcessingMsg(`Connecting to ${provider}...`);
      setTimeout(() => {
        onPaymentSuccess('upi');
        setStep('success');
        setIsProcessing(false);
      }, 1800);
    }
  };

  const handleCODPayment = () => {
    onPlaySound?.('click');
    setIsProcessing(true);
    setProcessingMsg('Registering cash receipt token...');
    setStep('processing');
    
    setTimeout(() => {
      onPaymentSuccess('cod');
      setStep('success');
      setIsProcessing(false);
    }, 900);
  };

  const handleQuickRecharge = (amount) => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;
    onRecharge(amt);
    setRechargeAmount('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative' }}
      >
        {step !== 'processing' && (
          <button 
            onClick={onClose} 
            className="glass-btn" 
            style={{ 
              position: 'absolute', 
              top: '1.25rem', 
              right: '1.25rem', 
              padding: '0.45rem', 
              borderRadius: '50%',
              zIndex: 10
            }}
          >
            <X size={18} />
          </button>
        )}

        {step === 'select' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <div style={{ background: 'var(--accent-peach-light)', padding: '6px', borderRadius: '10px' }}>
                <CreditCard size={22} style={{ color: 'var(--accent-peach)' }} />
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Complete Payment</h3>
            </div>
            
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.86rem', marginBottom: '1.25rem' }}>
              Choose your checkout method. Campus Wallet ensures 1-second offline-proof orders.
            </p>

            {/* Network Outage Warning if active */}
            {isNetworkOutage && (
              <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', padding: '0.65rem 0.9rem', borderRadius: '12px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#b45309' }}>
                <WifiOff size={16} style={{ flexShrink: 0 }} />
                <span>
                  <strong>Basement Cellular Outage:</strong> 4G/5G signals are unstable. Live UPI may experience timeout delays. Campus Wallet is unaffected.
                </span>
              </div>
            )}

            {/* Bill Preview Card */}
            <div 
              className="glass-panel" 
              style={{ 
                padding: '1rem 1.25rem', 
                marginBottom: '1.25rem', 
                background: 'linear-gradient(135deg, rgba(255, 100, 61, 0.08) 0%, rgba(255, 255, 255, 0.5) 100%)', 
                border: '1px solid rgba(255, 100, 61, 0.25)' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', fontWeight: 700 }}>
                    Final Total
                  </span>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>All taxes & kitchen packaging included</div>
                </div>
                <span style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--accent-peach)' }}>
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Methods */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              
              {/* Option 1: Campus Wallet */}
              <div 
                className="glass-panel glass-card-interactive"
                onClick={() => setPaymentMethod('wallet')}
                style={{ 
                  padding: '1rem', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  border: paymentMethod === 'wallet' ? '2px solid var(--accent-peach)' : '1px solid rgba(255,255,255,0.7)',
                  background: paymentMethod === 'wallet' ? 'rgba(255,255,255,0.88)' : 'var(--glass-bg)',
                  boxShadow: paymentMethod === 'wallet' ? 'var(--accent-peach-glow)' : 'var(--glass-shadow-card)',
                  borderRadius: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(2, 132, 199, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Wallet size={20} style={{ color: 'var(--accent-teal)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      Campus Wallet Pass <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-green)', background: 'var(--accent-green-light)', padding: '1px 5px', borderRadius: '4px' }}>Recommended</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                      Available Balance: <strong style={{ color: 'var(--text-primary)' }}>₹{walletBalance.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                {walletBalance < totalAmount ? (
                  <span style={{ fontSize: '0.74rem', color: 'var(--accent-red)', fontWeight: 700, background: 'var(--accent-red-light)', padding: '2px 6px', borderRadius: '6px' }}>
                    Low Balance
                  </span>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)', fontWeight: 800 }}>
                    Instant (1s) ✓
                  </span>
                )}
              </div>

              {/* Wallet Quick Recharge Widget inside modal */}
              {walletBalance < totalAmount && paymentMethod === 'wallet' && (
                <div className="glass-panel" style={{ padding: '0.9rem', background: 'rgba(2, 132, 199, 0.06)', border: '1px solid rgba(2, 132, 199, 0.2)', borderRadius: '14px', animation: 'fadeIn 0.25s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem', color: 'var(--accent-teal)' }}>
                    <Zap size={14} /> Quick Top-Up Needed:
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    {[50, 100, 200, 500].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleQuickRecharge(amt)}
                        className="glass-btn glass-btn-teal"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.78rem', flex: 1, borderRadius: '8px' }}
                      >
                        +₹{amt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Option 2: Instant UPI */}
              <div 
                className="glass-panel glass-card-interactive"
                onClick={() => setPaymentMethod('upi')}
                style={{ 
                  padding: '1rem', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '0.65rem',
                  border: paymentMethod === 'upi' ? '2px solid var(--accent-peach)' : '1px solid rgba(255,255,255,0.7)',
                  background: paymentMethod === 'upi' ? 'rgba(255,255,255,0.88)' : 'var(--glass-bg)',
                  boxShadow: paymentMethod === 'upi' ? 'var(--accent-peach-glow)' : 'var(--glass-shadow-card)',
                  borderRadius: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(255, 100, 61, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Smartphone size={20} style={{ color: 'var(--accent-peach)' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>Direct UPI Gateway</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Google Pay, PhonePe, Paytm</div>
                    </div>
                  </div>

                  {isNetworkOutage && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-red)', fontWeight: 700, background: 'var(--accent-red-light)', padding: '2px 6px', borderRadius: '4px' }}>
                      Weak Signal
                    </span>
                  )}
                </div>
                
                {paymentMethod === 'upi' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '0.35rem', animation: 'fadeIn 0.25s ease' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleUPIPayment('Google Pay'); }} 
                      className="glass-btn" 
                      style={{ padding: '0.55rem', fontSize: '0.82rem', fontWeight: 700 }}
                    >
                      <span style={{ color: '#4285F4' }}>G</span><span style={{ color: '#EA4335' }}>P</span><span style={{ color: '#FBBC05' }}>a</span><span style={{ color: '#34A853' }}>y</span>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleUPIPayment('PhonePe'); }} 
                      className="glass-btn" 
                      style={{ padding: '0.55rem', fontSize: '0.82rem', fontWeight: 700, color: '#5f259f' }}
                    >
                      PhonePe
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleUPIPayment('Paytm'); }} 
                      className="glass-btn" 
                      style={{ padding: '0.55rem', fontSize: '0.82rem', fontWeight: 700, color: '#00b9f5' }}
                    >
                      Paytm
                    </button>
                  </div>
                )}
              </div>

              {/* Option 3: Counter Payment */}
              <div 
                className="glass-panel glass-card-interactive"
                onClick={() => setPaymentMethod('cod')}
                style={{ 
                  padding: '1rem', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  border: paymentMethod === 'cod' ? '2px solid var(--accent-peach)' : '1px solid rgba(255,255,255,0.7)',
                  background: paymentMethod === 'cod' ? 'rgba(255,255,255,0.88)' : 'var(--glass-bg)',
                  borderRadius: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard size={20} style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>Cash at Counter</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--accent-red)', fontWeight: 600 }}>
                      ⚠️ Slow. Adds physical billing line wait.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pay CTA */}
            {paymentMethod !== 'upi' && (
              <button 
                onClick={paymentMethod === 'wallet' ? handleWalletPayment : handleCODPayment}
                className="glass-btn glass-btn-primary" 
                style={{ width: '100%', padding: '0.95rem', fontSize: '1rem' }}
              >
                Confirm Order with {paymentMethod === 'wallet' ? 'Campus Wallet' : 'Cash Counter'} <ArrowRight size={18} />
              </button>
            )}
          </div>
        )}

        {/* Processing State */}
        {step === 'processing' && (
          <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
            <Loader2 size={52} className="spin" style={{ color: 'var(--accent-peach)', margin: '0 auto 1.5rem auto', animation: 'spin 1.2s linear infinite' }} />
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
            <h4 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {paymentMethod === 'upi' ? `Authorizing via ${upiProvider}...` : 'Reserving your order slot...'}
            </h4>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.88rem', maxWidth: '380px', margin: '0 auto' }}>
              {processingMsg}
            </p>
          </div>
        )}

        {/* Success State */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '1.75rem 0' }}>
            <div 
              style={{ 
                width: '72px', 
                height: '72px', 
                borderRadius: '50%', 
                background: 'var(--accent-green-light)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 1.25rem auto',
                border: '2px solid var(--accent-green)',
                boxShadow: 'var(--accent-green-glow)'
              }}
            >
              <ShieldCheck size={42} style={{ color: 'var(--accent-green)' }} />
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              <Sparkles size={13} /> Token Dispatched to Kitchen
            </div>

            <h4 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              Order Confirmed!
            </h4>
            
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.88rem', marginBottom: '1.5rem', maxWidth: '360px', margin: '0 auto 1.5rem auto' }}>
              Your order is queued in the kitchen. Keep an eye on the <strong>Live Token Board</strong> to collect your meal!
            </p>

            <button 
              onClick={() => {
                onClose();
                setStep('select');
              }}
              className="glass-btn glass-btn-primary" 
              style={{ width: '100%', padding: '0.9rem' }}
            >
              Back to Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
