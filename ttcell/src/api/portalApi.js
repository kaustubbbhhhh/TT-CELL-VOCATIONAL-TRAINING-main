import axiosInstance from './axiosInstance';

export const dashboardApi = {
  getStats: async () => {
    const response = await axiosInstance.get('/dashboard/stats/');
    return response.data;
  },

  getTraineeStats: async (traineeId = '') => {
    const params = traineeId ? { trainee_id: traineeId } : {};
    const response = await axiosInstance.get('/dashboard/trainee-stats/', { params });
    return response.data;
  },
};

export const traineesApi = {
  list: async (params = {}) => {
    const response = await axiosInstance.get('/trainees/', { params });
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/trainees/', data);
    return response.data;
  },

  get: async (id) => {
    const response = await axiosInstance.get(`/trainees/${id}/`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/trainees/${id}/`, data);
    return response.data;
  },

  patch: async (id, data) => {
    const response = await axiosInstance.patch(`/trainees/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/trainees/${id}/`);
    return response.data;
  },

  bulkImport: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/trainees/bulk-import/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const projectsApi = {
  list: async (params = {}) => {
    const response = await axiosInstance.get('/projects/', { params });
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/projects/', data);
    return response.data;
  },

  get: async (id) => {
    const response = await axiosInstance.get(`/projects/${id}/`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/projects/${id}/`, data);
    return response.data;
  },

  patch: async (id, data) => {
    const response = await axiosInstance.patch(`/projects/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/projects/${id}/`);
    return response.data;
  },

  archive: async (id) => {
    const response = await axiosInstance.post(`/projects/${id}/archive/`);
    return response.data;
  },

  unarchive: async (id) => {
    const response = await axiosInstance.post(`/projects/${id}/unarchive/`);
    return response.data;
  },

  listAssignments: async (id) => {
    const response = await axiosInstance.get(`/projects/${id}/assignments/`);
    return response.data;
  },

  assign: async (id, traineeId, deadlineOverride = null) => {
    const data = { trainee_id: traineeId };
    if (deadlineOverride) {
      data.deadline_override = deadlineOverride;
    }
    const response = await axiosInstance.post(`/projects/${id}/assign/`, data);
    return response.data;
  },

  removeAssignment: async (id, traineeId) => {
    const response = await axiosInstance.delete(`/projects/${id}/assign/${traineeId}/`);
    return response.data;
  },
};

export const attendanceApi = {
  get: async (params = {}) => {
    const response = await axiosInstance.get('/attendance/', { params });
    return response.data;
  },

  mark: async (data) => {
    const response = await axiosInstance.post('/attendance/', data);
    return response.data;
  },

  bulkMark: async (date, sessionName, records) => {
    const response = await axiosInstance.post('/attendance/bulk-mark/', {
      date,
      session_name: sessionName,
      records,
    });
    return response.data;
  },
};

export const announcementsApi = {
  list: async () => {
    const response = await axiosInstance.get('/announcements/');
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/announcements/', data);
    return response.data;
  },

  get: async (id) => {
    const response = await axiosInstance.get(`/announcements/${id}/`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/announcements/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/announcements/${id}/`);
    return response.data;
  },
};

export const analyticsApi = {
  get: async () => {
    const response = await axiosInstance.get('/dashboard/analytics/');
    return response.data;
  },
};

export const repositoryApi = {
  list: async (params = {}) => {
    const response = await axiosInstance.get('/dashboard/repository/', { params });
    return response.data;
  },
};

export const settingsApi = {
  get: async () => {
    const response = await axiosInstance.get('/dashboard/settings/');
    return response.data;
  },

  update: async (data) => {
    const response = await axiosInstance.put('/dashboard/settings/', data);
    return response.data;
  },
};

export const reportsApi = {
  generate: async (reportType) => {
    const response = await axiosInstance.post('/dashboard/reports/', { report_type: reportType }, { responseType: 'blob' });
    return response.data;
  },
};

