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
    try {
        const response = await axios.get(`${HOST}/api/auth/admin-profile`, {
            withCredentials: true
        });
        if (response.data) {
            // Add this to ensure authentication state is properly set
            localStorage.setItem('isAuthenticated', 'true');
            set({
                userinfo: response.data,
                isLoading: false,
                retryCount: 0
            });
            return true;
        }
    } catch (error) {
        // Clear auth state on error
        localStorage.removeItem('isAuthenticated');
        set({ 
            userinfo: null, 
            isLoading: false,
            retryCount: 0
        });
        return false;
    }
}
});
