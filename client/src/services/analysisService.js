import api from './api';

export const analysisService = {
  async createAnalysis({ jobTitle, resumeText, jobDescription }) {
    const res = await api.post('/analysis', { jobTitle, resumeText, jobDescription });
    return res.data;
  },

  async getAllAnalyses() {
    const res = await api.get('/analysis');
    return res.data;
  },

  async getAnalysisById(id) {
    const res = await api.get(`/analysis/${id}`);
    return res.data;
  },

  async uploadPdfResume(file) {
    const formData = new FormData();
    formData.append('resumeFile', file);
    const res = await api.post('/analysis/upload-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  async deleteAnalysis(id) {
    const res = await api.delete(`/analysis/${id}`);
    return res.data;
  }
};
