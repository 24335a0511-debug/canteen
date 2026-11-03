/**
 * CampusBite Authentication Service
 * 
 * Provides session management, credential validation, and role resolution.
 * Currently operating in Demo Directory Mode until Phase 3 Spring Security JWT integration.
 */

export const DEMO_CREDENTIALS = {
  student: {
    id: 'CS-402',
    email: 'student@campusbite.edu',
    password: 'student123',
    name: 'Ashal Kumar',
    department: 'Computer Science & Engineering',
    year: '3rd Year • Section B',
    role: 'student',
    roleLabel: 'Student Portal',
    roleBadge: '🎓 Student',
    roleColor: 'var(--accent-teal)',
    roleBg: 'rgba(2, 132, 199, 0.1)',
    avatar: '👨‍🎓',
    tagline: 'Skip peak dinner counter rush & schedule tray pickups',
    dashboardPath: '/student/dashboard',
    permissions: [
      'Live fresh menu with real-time kitchen inventory',
      '15-minute slot pre-ordering with rush throttling',
      'Sub-second Campus Pass Wallet payment (offline-ready)',
      'Real-time order progress stepper & scannable QR pass'
    ]
  },
  staff: {
    id: 'KIT-08',
    email: 'chef@campusbite.edu',
    password: 'chef123',
    name: 'Chef Ramesh',
    department: 'Canteen Kitchen Operations',
    year: 'Tawa & Counter 1 Lead',
    role: 'staff',
    roleLabel: 'Kitchen Staff Hub',
    roleBadge: '👨‍🍳 Kitchen Staff',
    roleColor: 'var(--accent-peach)',
    roleBg: 'rgba(255, 100, 61, 0.12)',
    avatar: '👨‍🍳',
    tagline: 'Live station load balancing & digital token broadcasts',
    dashboardPath: '/kitchen/dashboard',
    permissions: [
      'Live incoming order tickets categorized by status',
      'Station throughput diagnostics (Tawa / Snacks / Drinks)',
      '1-click out-of-stock toggles & batch portion capping',
      'Wall-mounted cafeteria screen token announcement caller'
    ]
  },
  admin: {
    id: 'ADM-01',
    email: 'admin@campusbite.edu',
    password: 'admin123',
    name: 'Rajesh Sharma',
    department: 'Campus Hospitality & Finance',
    year: 'Canteen General Manager',
    role: 'admin',
    roleLabel: 'Admin Management Hub',
    roleBadge: '🛡️ Canteen Admin',
    roleColor: 'var(--accent-purple)',
    roleBg: 'rgba(139, 92, 246, 0.12)',
    avatar: '🛡️',
    tagline: 'Menu pricing, slot capping, wallet credits & revenue',
    dashboardPath: '/admin/dashboard',
    permissions: [
      'Full Menu & Pricing Studio (Add, edit price, tags & photos)',
      'Slot Capacity & Bottlenecks Controller (modify 15-min limits)',
      'Student Wallet Ledger (credit offline cash to digital balance)',
      'Financial Revenue Analytics (Wallet vs UPI vs Cash split)',
      'Broadcast real-time marquee alerts to all student devices'
    ]
  }
};

const USER_STORAGE_KEY = 'campusbite_user';
const TOKEN_STORAGE_KEY = 'campusbite_token';
const REMEMBER_STORAGE_KEY = 'campusbite_remember';

export const authService = {
  /**
   * Determine if the frontend is running in demo mode
   */
  isDemoMode() {
    return true; // Will return false once Phase 3 Spring Security JWT is connected
  },

  /**
   * Authenticate a user with role, username/email, and password
   */
  async login({ role, identifier, password, rememberMe = true }) {
    // Simulate real network delay (350ms) to verify loading states
    await new Promise((resolve) => setTimeout(resolve, 350));

    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!role || !DEMO_CREDENTIALS[role]) {
      throw new Error('Please select a valid user role.');
    }

    if (!cleanId) {
      throw new Error('Please enter your Campus ID or email address.');
    }

    if (!cleanPass) {
      throw new Error('Please enter your account password.');
    }

    const expectedUser = DEMO_CREDENTIALS[role];

    const matchesId = expectedUser.id.toLowerCase() === cleanId;
    const matchesEmail = expectedUser.email.toLowerCase() === cleanId;

    if (!matchesId && !matchesEmail) {
      // Check if credentials match another role to give a helpful message
      const otherRoleMatch = Object.values(DEMO_CREDENTIALS).find(
        (u) => u.id.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId
      );
      if (otherRoleMatch) {
        throw new Error(
          `These credentials belong to the ${otherRoleMatch.roleBadge} portal. Please select the '${otherRoleMatch.roleLabel}' card.`
        );
      }
      throw new Error('Unrecognized Campus ID or email. Please verify your credentials.');
    }

    if (expectedUser.password !== cleanPass) {
      throw new Error('Incorrect password. Please try again.');
    }

    // Generate demo auth token
    const token = `cb_demo_token_${expectedUser.role}_${Date.now()}`;
    const userPayload = {
      ...expectedUser,
      authenticatedAt: new Date().toISOString(),
      rememberMe: !!rememberMe
    };

    // Store session according to Remember Me setting
    this.saveSession(userPayload, token, rememberMe);

    return {
      success: true,
      user: userPayload,
      token
    };
  },

  /**
   * Save session to storage
   */
  saveSession(user, token, rememberMe) {
    try {
      this.clearSession();
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      storage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(REMEMBER_STORAGE_KEY, rememberMe ? 'true' : 'false');
    } catch (e) {
      console.warn('Failed to save session to storage', e);
    }
  },

  /**
   * Retrieve current authenticated user
   */
  getCurrentUser() {
    try {
      const fromSession = sessionStorage.getItem(USER_STORAGE_KEY);
      if (fromSession) return JSON.parse(fromSession);

      const fromLocal = localStorage.getItem(USER_STORAGE_KEY);
      if (fromLocal) return JSON.parse(fromLocal);
    } catch (e) {
      console.warn('Failed to parse stored user', e);
    }
    return null;
  },

  /**
   * Retrieve session token
   */
  getToken() {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  },

  /**
   * Check if user is logged in
   */
  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  /**
   * Check if current user has a specific role
   */
  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  },

  /**
   * Clear session on logout
   */
  logout() {
    this.clearSession();
  },

  /**
   * Clear both local and session storage keys
   */
  clearSession() {
    try {
      sessionStorage.removeItem(USER_STORAGE_KEY);
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear session storage', e);
    }
  },

  /**
   * Get target dashboard URL for a given role
   */
  getDashboardPath(role) {
    switch (role) {
      case 'student':
        return '/student/dashboard';
      case 'staff':
        return '/kitchen/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  }
};
