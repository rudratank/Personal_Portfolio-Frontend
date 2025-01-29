import axios from "axios";
import { HOST, LOGIN_ROUTE } from "@/lib/constant";

export const createAuthSlice = (set, get) => ({
  userinfo: null,
  isLoading: true,
  retryCount: 0,
  retryTimeout: null,

  setIsLoading: (loading) => set({ isLoading: loading }),

  setUserInfo: (userinfo) => {
    if (userinfo) {
      localStorage.setItem('isAuthenticated', 'true');
    }
    set({ 
      userinfo, 
      isLoading: false,
      retryCount: 0
    });
  },

  checkAuth: async () => {
    const state = get();
    set({ isLoading: true });

    // Clear any existing retry timeouts
    if (state.retryTimeout) {
      clearTimeout(state.retryTimeout);
    }

    try {
      // Check if token exists in cookies
      const hasToken = document.cookie.includes('token');
      if (!hasToken) {
        localStorage.removeItem('isAuthenticated');
        set({ 
          userinfo: null, 
          isLoading: false,
          retryCount: 0
        });
        return false;
      }

      const response = await axios.get(`${HOST}/api/auth/admin-profile`, {
        withCredentials: true
      });

      if (response.data) {
        localStorage.setItem('isAuthenticated', 'true');
        set({
          userinfo: response.data,
          isLoading: false,
          retryCount: 0
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Auth check error:', error);
      
      // Handle rate limiting
      if (error.response?.status === 429) {
        const currentRetryCount = get().retryCount;
        if (currentRetryCount < 3) {
          const timeout = setTimeout(async () => {
            set({ retryCount: currentRetryCount + 1 });
            await get().checkAuth();
          }, Math.pow(2, currentRetryCount) * 1000);
          set({ retryTimeout: timeout });
          return false;
        }
      }

      // Clear auth state on any error
      localStorage.removeItem('isAuthenticated');
      set({ 
        userinfo: null, 
        isLoading: false,
        retryCount: 0
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await axios.post(`${LOGIN_ROUTE}/logout`, {}, { 
        withCredentials: true
      });
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      localStorage.removeItem('isAuthenticated');
      set({ 
        userinfo: null, 
        isLoading: false,
        retryCount: 0
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
});
