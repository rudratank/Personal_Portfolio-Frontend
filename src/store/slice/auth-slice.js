// auth-slice.js
import axios from "axios";
import { HOST, LOGIN_ROUTE } from "@/lib/constant";

export const createAuthSlice = (set, get) => ({
  userinfo: null,
  isLoading: true,
  
  setIsLoading: (loading) => set({ 
    isLoading: loading 
  }),
  
  setUserInfo: (userinfo) => set({ 
    userinfo, 
    isLoading: false 
  }),
  
  logout: async () => {
    try {
      await axios.post(`${LOGIN_ROUTE}/logout`, {}, { 
        withCredentials: true 
      });
      
      set({ 
        userinfo: null, 
        isLoading: false
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear the state even if the API call fails
      set({ 
        userinfo: null, 
        isLoading: false
      });
    }
  },
  
  checkAuth: async () => {
    try {
      const response = await axios.get(`${HOST}/api/auth/admin-profile`, {
        withCredentials: true
      });
      
      if (response.data) {
        set({
          userinfo: response.data,
          isLoading: false
        });
        return true;
      }
      
      // If we get here, there was a response but no data
      set({ 
        userinfo: null, 
        isLoading: false
      });
      return false;
      
    } catch (error) {
      console.error('Auth check error:', error);
      set({ 
        userinfo: null, 
        isLoading: false
      });
      return false;
    }
  }
});
