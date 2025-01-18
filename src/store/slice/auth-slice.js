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

  logout: async () => {
    try {
      await axios.post(`${LOGIN_ROUTE}/logout`, {}, { 
        withCredentials: true
      });
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

  checkAuth: async () => {
    const state = get();
    set({ isLoading: true });

    if (state.retryTimeout) {
      clearTimeout(state.retryTimeout);
    }

    try {
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
    } catch (error) {
      console.error('Auth check error:', error);
      
      if (error.response?.status === 429) {
        const currentRetryCount = get().retryCount;
        if (currentRetryCount < 3) {
          const timeout = setTimeout(async () => {
            set({ retryCount: currentRetryCount + 1 });
            await get().checkAuth();
          }, Math.pow(2, currentRetryCount) * 1000);

          set({ retryTimeout: timeout });
          return;
        }
      }

      localStorage.removeItem('isAuthenticated');
      set({ 
        userinfo: null, 
        isLoading: false,
        retryCount: 0
      });
    }
    return false;
  },
});