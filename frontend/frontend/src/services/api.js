// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const apiService = {
  // FAQ endpoints
  getFAQs: async () => {
    try {
      const response = await axios.get(`${API_URL}/faqs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
  },
  
  addFAQ: async (faqData) => {
    try {
      const response = await axios.post(`${API_URL}/faqs`, faqData);
      return response.data;
    } catch (error) {
      console.error('Error adding FAQ:', error);
      throw error;
    }
  },
  
  deleteFAQ: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/faqs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  }
};