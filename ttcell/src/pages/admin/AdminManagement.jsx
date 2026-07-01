import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Table,
  TableHead, TableBody, TableRow, TableCell, TableContainer,
  LinearProgress, Chip, TextField, InputAdornment, MenuItem, Select,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Snackbar, Alert, FormControlLabel, Switch
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {
  StatusChip, DomainChip, AttendanceBar, MetricCard,
  PageHeader, Breadcrumb, AnnouncementCard,
} from '../../components/UIComponents';
import { traineesApi, projectsApi, attendanceApi, announcementsApi, settingsApi } from '../../api/portalApi';
import { useNavigate } from 'react-router-dom';

// Helper to get initials and color for avatar
function getAvatarProps(name) {
  if (!name) return { initials: 'TR', color: '#4B5D3A' };
  const parts = name.split(' ');
  const initials = parts.map(p => p[0]).join('').substring(0, 2).toUpperCase();
  const colors = ['#4B5D3A', '#3D5A80', '#C2185B', '#B8960C', '#00796B', '#5E35B1', '#E65100'];
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  const color = colors[sum % colors.length];
  return { initials, color };
}

// ── TRAINEES PAGE ──────────────────────────────────────────────
export function TraineesPage() {
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('All');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [activeBatchId, setActiveBatchId] = useState('');
  const [activeBatchStatus, setActiveBatchStatus] = useState('active');

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTrainee, setNewTrainee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    college_name: '',
    father_name: '',
    father_phone: '',
    mother_name: '',
    mother_phone: '',
    year: 'II',
    branch: '',
    section: 'A',
    enrollment_number: '',
    domain: 'AI/ML',
    batch_id: 'B_01',
  });

  // Edit Modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTrainee, setEditTrainee] = useState(null);

  // Feedback
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchTrainees = async () => {
    setLoading(true);
    try {
      const params = {};
      if (domain !== 'All') params.domain = domain;
      if (search.trim()) params.q = search;
      if (sectionFilter !== 'All') params.section = sectionFilter;

      const res = await traineesApi.list(params);
      let results = res.data.results || res.data || [];
      if (sectionFilter !== 'All') {
        results = results.filter(t => t.section === sectionFilter);
      }
      setTrainees(results);
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: 'Failed to load trainees.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveBatch = async () => {
    try {
      const res = await settingsApi.get();
      if (res && res.data) {
        setActiveBatchId(res.data.batch_identifier || '');
        setActiveBatchStatus(res.data.active_batch_status || 'active');
      }
    } catch (err) {
      console.error('Failed to load active batch settings:', err);
    }
  };

  useEffect(() => {
    fetchActiveBatch();
    fetchTrainees();
  }, [domain, sectionFilter]);

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchTrainees();
    }
  };

  const handleImportCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      const res = await traineesApi.bulkImport(file);
      setToast({
        open: true,
        message: `Import complete: Created ${res.data.created}, skipped ${res.data.skipped} due to validation errors.`,
        severity: 'success'
      });
      fetchTrainees();
      window.dispatchEvent(new Event('dashboardStatsUpdated'));
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: 'Failed to import CSV.', severity: 'error' });
    } finally {
      setLoading(false);
      e.target.value = ''; // clear input
    }
  };

  const handleCreateTrainee = async () => {
    const paddedEnrollment = String(newTrainee.enrollment_number || '').padStart(2, '0');
    const roll_number = `${newTrainee.section}${paddedEnrollment}`;
    if (!newTrainee.first_name || !newTrainee.email || !newTrainee.enrollment_number || !newTrainee.phone) {
      setToast({ open: true, message: 'Please fill in all required fields.', severity: 'warning' });
      return;
    }
    if (!/^\d{10}$/.test(newTrainee.phone)) {
      setToast({ open: true, message: 'Phone number must be 10 digits.', severity: 'warning' });
      return;
    }
    try {
      setLoading(true);
      await traineesApi.create({ ...newTrainee, roll_number });
      setToast({ open: true, message: 'Trainee profile created successfully.', severity: 'success' });
      setIsAddOpen(false);
      setNewTrainee({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        college_name: '',
        father_name: '',
        father_phone: '',
        mother_name: '',
        mother_phone: '',
        year: 'II',
        branch: '',
        section: 'A',
        enrollment_number: '',
        domain: 'AI/ML',
        batch_id: 'B_01',
      });
      fetchTrainees();
      window.dispatchEvent(new Event('dashboardStatsUpdated'));
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to create trainee.';
      setToast({ open: true, message: msg, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTraineeSubmit = async () => {
    if (!editTrainee.first_name || !editTrainee.email) {
      setToast({ open: true, message: 'Please fill in all required fields.', severity: 'warning' });
      return;
    }
    try {
      setLoading(true);
      const updatePayload = {
        first_name: editTrainee.first_name,
        last_name: editTrainee.last_name,
        email: editTrainee.email,
        phone: editTrainee.phone,
        college_name: editTrainee.college_name,
        father_name: editTrainee.father_name,
        father_phone: editTrainee.father_phone,
        mother_name: editTrainee.mother_name,
        mother_phone: editTrainee.mother_phone,
        year: editTrainee.year,
        branch: editTrainee.branch,
        section: editTrainee.section,
        enrollment_number: editTrainee.enrollment_number,
        domain: editTrainee.domain,
        batch_id: editTrainee.batch_id,
      };
      
      // Compute roll number only if enrollment number and section are present
      if (editTrainee.section && editTrainee.enrollment_number) {
        const paddedEnrollment = String(editTrainee.enrollment_number || '').padStart(2, '0');
        updatePayload.roll_number = `${editTrainee.section}${paddedEnrollment}`;
      } else {
        updatePayload.roll_number = editTrainee.roll_number;
      }
      
      await traineesApi.patch(editTrainee.id, updatePayload);
      setToast({ open: true, message: 'Trainee profile updated successfully.', severity: 'success' });
      setIsEditOpen(false);
      setEditTrainee(null);
      fetchTrainees();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to update trainee.';
      setToast({ open: true, message: msg, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrainee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trainee?")) return;
    try {
      setLoading(true);
      await traineesApi.delete(id);
      setToast({ open: true, message: 'Trainee soft-deleted successfully.', severity: 'success' });
      fetchTrainees();
      window.dispatchEvent(new Event('dashboardStatsUpdated'));
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: 'Failed to delete trainee.', severity: 'error' });
      setLoading(false);
    }
  };

  return (
    <Box>
      <Breadcrumb items={[{ label: 'Dashboard', onClick: () => navigate('/admin') }, { label: 'Trainees' }]} />
      <PageHeader
        title="Trainee Management"
        subtitle={`${trainees.length} enrolled trainees active in Batch ${activeBatchId || '...'}`}
        actions={
          <>
            <Button variant="outlined" size="small" component="label">
              📥 Import CSV
              <input type="file" accept=".csv" hidden onChange={handleImportCSV} />
            </Button>
            {activeBatchStatus === 'active' && (
              <Button 
                variant="contained" 
                size="small" 
                onClick={() => {
                  setNewTrainee(prev => ({ ...prev, batch_id: activeBatchId || 'B_01' }));
                  setIsAddOpen(true);
                }}
              >
                + Add Trainee
              </Button>
            )}
          </>
        }
      />

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 1.25, mb: 2.5, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search by name, roll number (press Enter)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyPress={handleSearchKeyPress}
          sx={{ flex: 1, minWidth: 220 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: '#7A8B99' }} onClick={fetchTrainees} style={{ cursor: 'pointer' }} />
              </InputAdornment>
            )
          }}
        />
        <Select size="small" value={domain} onChange={e => setDomain(e.target.value)} sx={{ minWidth: 150 }}>
          {['All', 'AI/ML', 'Web Dev', 'Cyber Sec', 'Data Sci', 'IoT', 'Embedded'].map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
        </Select>
        <Select size="small" value={sectionFilter} onChange={e => setSectionFilter(e.target.value)} sx={{ minWidth: 120 }}>
          {['All', 'A', 'B', 'C', 'D'].map(s => <MenuItem key={s} value={s}>{s === 'All' ? 'All Sections' : `Section ${s}`}</MenuItem>)}
        </Select>
      </Box>

      <Card>
        {loading ? (
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress sx={{ color: '#4B5D3A' }} />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Roll No.</TableCell>
                  <TableCell>Domain</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trainees.length > 0 ? (
                  trainees.map(s => {
                    const avatar = getAvatarProps(s.full_name);
                    return (
                      <TableRow key={s.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                            <Box sx={{ width: 34, height: 34, borderRadius: '50%', background: `${avatar.color}22`, color: avatar.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                              {avatar.initials}
                            </Box>
                            <Box>
                              <Typography sx={{ fontWeight: 700, fontSize: '0.8375rem' }}>{s.full_name}</Typography>
                              <Typography variant="caption">{s.email}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.8rem' }}>{s.roll_number}</Typography>
                        </TableCell>
                        <TableCell><DomainChip domain={s.domain} /></TableCell>
                        <TableCell>{s.phone || '—'}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              sx={{ fontSize: '0.72rem', py: 0.5, px: 1.25 }}
                              onClick={() => { setEditTrainee(s); setIsEditOpen(true); }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              sx={{ fontSize: '0.72rem', py: 0.5, px: 1.25 }}
                              onClick={() => handleDeleteTrainee(s.id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography sx={{ color: '#7A8B99', py: 2 }}>No trainees found.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Add Trainee Dialog */}
      <Dialog open={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Add New Trainee</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 3, minWidth: 320 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="First Name *" size="small" fullWidth value={newTrainee.first_name} onChange={e => setNewTrainee({ ...newTrainee, first_name: e.target.value })} />
            <TextField label="Last Name" size="small" fullWidth value={newTrainee.last_name} onChange={e => setNewTrainee({ ...newTrainee, last_name: e.target.value })} />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="Email Address *" size="small" fullWidth value={newTrainee.email} onChange={e => setNewTrainee({ ...newTrainee, email: e.target.value })} />
            <TextField label="Phone (10 digits) *" size="small" fullWidth value={newTrainee.phone} onChange={e => setNewTrainee({ ...newTrainee, phone: e.target.value })} />
          </Box>
          <TextField label="College Name" size="small" fullWidth value={newTrainee.college_name} onChange={e => setNewTrainee({ ...newTrainee, college_name: e.target.value })} />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="Father's Name" size="small" fullWidth value={newTrainee.father_name} onChange={e => setNewTrainee({ ...newTrainee, father_name: e.target.value })} />
            <TextField label="Father's Phone" size="small" fullWidth value={newTrainee.father_phone} onChange={e => setNewTrainee({ ...newTrainee, father_phone: e.target.value })} />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="Mother's Name" size="small" fullWidth value={newTrainee.mother_name} onChange={e => setNewTrainee({ ...newTrainee, mother_name: e.target.value })} />
            <TextField label="Mother's Phone" size="small" fullWidth value={newTrainee.mother_phone} onChange={e => setNewTrainee({ ...newTrainee, mother_phone: e.target.value })} />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Year</InputLabel>
              <Select value={newTrainee.year} label="Year" onChange={e => setNewTrainee({ ...newTrainee, year: e.target.value })}>
                <MenuItem value="II">II Year</MenuItem>
                <MenuItem value="III">III Year</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Branch" size="small" fullWidth value={newTrainee.branch} onChange={e => setNewTrainee({ ...newTrainee, branch: e.target.value })} />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Section *</InputLabel>
              <Select value={newTrainee.section} label="Section *" onChange={e => setNewTrainee({ ...newTrainee, section: e.target.value })}>
                {['A', 'B', 'C', 'D'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Enrollment Number *" size="small" fullWidth type="number" value={newTrainee.enrollment_number} onChange={e => setNewTrainee({ ...newTrainee, enrollment_number: e.target.value })} />
            <TextField
              label="Final Roll Number"
              size="small"
              fullWidth
              disabled
              value={newTrainee.section && newTrainee.enrollment_number ? `${newTrainee.section}${String(newTrainee.enrollment_number).padStart(2, '0')}` : ''}
              InputProps={{ readOnly: true }}
            />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Domain</InputLabel>
              <Select value={newTrainee.domain} label="Domain" onChange={e => setNewTrainee({ ...newTrainee, domain: e.target.value })}>
                {['AI/ML', 'Web Dev', 'Cyber Sec', 'Data Sci', 'IoT', 'Embedded'].map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Batch ID *" size="small" fullWidth value={newTrainee.batch_id} onChange={e => setNewTrainee({ ...newTrainee, batch_id: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateTrainee} sx={{ background: '#4B5D3A', '&:hover': { background: '#3D4A2F' } }}>Create Profile</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Trainee Dialog */}
      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Edit Trainee Profile</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 3, minWidth: 320 }}>
          {editTrainee && (
            <>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField label="First Name *" size="small" fullWidth value={editTrainee.first_name || ''} onChange={e => setEditTrainee({ ...editTrainee, first_name: e.target.value })} />
                <TextField label="Last Name" size="small" fullWidth value={editTrainee.last_name || ''} onChange={e => setEditTrainee({ ...editTrainee, last_name: e.target.value })} />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField label="Email Address *" size="small" fullWidth value={editTrainee.email || ''} onChange={e => setEditTrainee({ ...editTrainee, email: e.target.value })} />
                <TextField label="Phone (10 digits) *" size="small" fullWidth value={editTrainee.phone || ''} onChange={e => setEditTrainee({ ...editTrainee, phone: e.target.value })} />
              </Box>
              <TextField label="College Name" size="small" fullWidth value={editTrainee.college_name || ''} onChange={e => setEditTrainee({ ...editTrainee, college_name: e.target.value })} />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField label="Father's Name" size="small" fullWidth value={editTrainee.father_name || ''} onChange={e => setEditTrainee({ ...editTrainee, father_name: e.target.value })} />
                <TextField label="Father's Phone" size="small" fullWidth value={editTrainee.father_phone || ''} onChange={e => setEditTrainee({ ...editTrainee, father_phone: e.target.value })} />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField label="Mother's Name" size="small" fullWidth value={editTrainee.mother_name || ''} onChange={e => setEditTrainee({ ...editTrainee, mother_name: e.target.value })} />
                <TextField label="Mother's Phone" size="small" fullWidth value={editTrainee.mother_phone || ''} onChange={e => setEditTrainee({ ...editTrainee, mother_phone: e.target.value })} />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Year</InputLabel>
                  <Select value={editTrainee.year || 'II'} label="Year" onChange={e => setEditTrainee({ ...editTrainee, year: e.target.value })}>
                    <MenuItem value="II">II Year</MenuItem>
                    <MenuItem value="III">III Year</MenuItem>
                  </Select>
                </FormControl>
                <TextField label="Branch" size="small" fullWidth value={editTrainee.branch || ''} onChange={e => setEditTrainee({ ...editTrainee, branch: e.target.value })} />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Section *</InputLabel>
                  <Select value={editTrainee.section || 'A'} label="Section *" onChange={e => setEditTrainee({ ...editTrainee, section: e.target.value })}>
                    {['A', 'B', 'C', 'D'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>
                <TextField label="Enrollment Number" size="small" fullWidth type="number" value={editTrainee.enrollment_number || ''} onChange={e => setEditTrainee({ ...editTrainee, enrollment_number: e.target.value })} />
                <TextField
                  label="Final Roll Number"
                  size="small"
                  fullWidth
                  disabled
                  value={editTrainee.section && editTrainee.enrollment_number ? `${editTrainee.section}${String(editTrainee.enrollment_number).padStart(2, '0')}` : ''}
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Domain</InputLabel>
                  <Select value={editTrainee.domain || 'AI/ML'} label="Domain" onChange={e => setEditTrainee({ ...editTrainee, domain: e.target.value })}>
                    {['AI/ML', 'Web Dev', 'Cyber Sec', 'Data Sci', 'IoT', 'Embedded'].map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                  </Select>
                </FormControl>
                <TextField label="Batch ID *" size="small" fullWidth value={editTrainee.batch_id || ''} onChange={e => setEditTrainee({ ...editTrainee, batch_id: e.target.value })} />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateTraineeSubmit} sx={{ background: '#4B5D3A', '&:hover': { background: '#3D4A2F' } }}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}

// ── PROJECTS PAGE ──────────────────────────────────────────────
const statusColors = { submitted: '#4B5D3A', in_progress: '#B8960C', planning: '#3D5A80', completed: '#1E3A8A' };
const statusLabels = { submitted: 'Submitted', in_progress: 'In Progress', planning: 'Planning', completed: 'Completed' };

export function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [showArchived, setShowArchived] = useState(false);
  const [activeBatchId, setActiveBatchId] = useState('');

  // Assignment Modal
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [trainees, setTrainees] = useState([]);
  const [assignment, setAssignment] = useState({
    projectId: '',
    traineeId: '',
    deadline: ''
  });

  // Create Project Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    project_code: '',
    title: '',
    description: '',
    domain: 'AI/ML',
    system_domain: 'Software',
    team: 1,
    stack: ''
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (showArchived) params.is_archived = 'all';
      const res = await projectsApi.list(params);
      setProjects(res.data.results || res.data || []);
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: 'Failed to load projects.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveBatch = async () => {
    try {
      const res = await settingsApi.get();
      if (res && res.data) {
        setActiveBatchId(res.data.batch_identifier || '');
      }
    } catch (err) {
      console.error('Failed to load active batch settings:', err);
    }
  };

  useEffect(() => {
    fetchActiveBatch();
    fetchProjects();
  }, [showArchived]);

  const handleOpenAssign = async (projectId) => {
    setAssignment({ projectId, traineeId: '', deadline: '' });
    try {
      const res = await traineesApi.list({ unassigned: true });
      setTrainees(res.data.results || res.data || []);
      setIsAssignOpen(true);
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: 'Failed to fetch trainee list for assignment.', severity: 'error' });
    }
  };

  const handleAssignSubmit = async () => {
    if (!assignment.traineeId) {
      setToast({ open: true, message: 'Please select a trainee.', severity: 'warning' });
      return;
    }
    try {
      setLoading(true);
      await projectsApi.assign(assignment.projectId, assignment.traineeId, assignment.deadline || null);
      setToast({ open: true, message: 'Trainee assigned to project successfully.', severity: 'success' });
      setIsAssignOpen(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to assign trainee.';
      setToast({ open: true, message: msg, severity: 'error' });
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.project_code || !newProject.title || !newProject.description) {
      setToast({ open: true, message: 'Please fill in all required fields.', severity: 'warning' });
      return;
    }
    try {
      setLoading(true);
      const stackList = newProject.stack.split(',').map(s => s.trim()).filter(Boolean);
      await projectsApi.create({
        ...newProject,
        stack: stackList
      });
      setToast({ open: true, message: 'Project created successfully.', severity: 'success' });
      setIsCreateOpen(false);
      setNewProject({
        project_code: '',
        title: '',
        description: '',
        domain: 'AI/ML',
        system_domain: 'Software',
        team: 1,
        stack: ''
      });
      fetchProjects();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to create project.';
      setToast({ open: true, message: msg, severity: 'error' });
      setLoading(false);
    }
  };

  const handleToggleArchive = async (id, isArchived) => {
    try {
      setLoading(true);
      if (isArchived) {
        await projectsApi.unarchive(id);
        setToast({ open: true, message: 'Project unarchived.', severity: 'success' });
      } else {
        await projectsApi.archive(id);
        setToast({ open: true, message: 'Project archived.', severity: 'success' });
      }
      fetchProjects();
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: 'Failed to update archive status.', severity: 'error' });
      setLoading(false);
    }
  };

  return (
    <Box>
      <Breadcrumb items={[{ label: 'Dashboard', onClick: () => navigate('/admin') }, { label: 'Projects' }]} />
      <PageHeader
        title="Project Management"
        subtitle={`${projects.length} capstone projects active in Batch ${activeBatchId || '...'}`}
        actions={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControlLabel
              control={<Switch checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} size="small" />}
              label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Show Archived</Typography>}
            />
            <Button variant="contained" size="small" onClick={() => setIsCreateOpen(true)}>+ Add Project</Button>
          </Box>
        }
      />

      {loading && projects.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress sx={{ color: '#4B5D3A' }} /></Box>
      ) : (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {projects.length > 0 ? (
            projects.map(p => (
              <Card key={p.id} sx={{ borderLeft: `4px solid ${statusColors[p.status] || '#4B5D3A'}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.25, flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                      <Typography variant="h6">{p.title}</Typography>
                      <Typography variant="caption">{p.project_code} · Team of {p.team} · {p.domain} Domain</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                      <Chip
                        label={statusLabels[p.status] || p.status}
                        size="small"
                        sx={{
                          background: `${statusColors[p.status]}22`,
                          color: statusColors[p.status],
                          fontWeight: 700,
                          fontSize: '0.7rem'
                        }}
                      />
                      {p.score !== undefined && p.score !== null && (
                        <Chip label={`Score: ${p.score}/100`} size="small" sx={{ background: '#EEF2E8', color: '#4B5D3A', fontWeight: 700, fontSize: '0.7rem' }} />
                      )}
                      <Button variant="outlined" size="small" sx={{ fontSize: '0.65rem', py: 0.25 }} onClick={() => handleOpenAssign(p.id)}>Assign</Button>
                      <Button variant="outlined" size="small" color="secondary" sx={{ fontSize: '0.65rem', py: 0.25 }} onClick={() => handleToggleArchive(p.id, p.is_archived)}>
                        {p.is_archived ? 'Unarchive' : 'Archive'}
                      </Button>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#445566', mb: 1.75, lineHeight: 1.65 }}>{p.description}</Typography>
                  <Box sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption">Progress</Typography>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: statusColors[p.status] || '#4B5D3A' }}>{p.progress}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={p.progress}
                      sx={{
                        height: 7,
                        borderRadius: 10,
                        background: '#EBF0F5',
                        '& .MuiLinearProgress-bar': { background: statusColors[p.status] || '#4B5D3A', borderRadius: 10 }
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                    {p.stack && p.stack.map(s => <Chip key={s} label={s} size="small" sx={{ background: '#EBF0F5', color: '#445566', fontWeight: 600, fontSize: '0.68rem' }} />)}
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: '#7A8B99', textAlign: 'center', py: 4 }}>No projects available.</Typography>
          )}
        </Box>
      )}

      {/* Assign Trainee Modal */}
      <Dialog open={isAssignOpen} onClose={() => setIsAssignOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Assign Trainee to Project</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 3, minWidth: 320 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Select Trainee</InputLabel>
            <Select
              value={assignment.traineeId}
              label="Select Trainee"
              onChange={e => setAssignment({ ...assignment, traineeId: e.target.value })}
            >
              {trainees.length === 0 && (
                <MenuItem disabled value="">No unassigned trainees available</MenuItem>
              )}
              {trainees.map(t => (
                <MenuItem key={t.id} value={t.id}>{t.roll_number} - {t.full_name} ({t.domain})</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Deadline Override (Optional)"
            type="date"
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
            value={assignment.deadline}
            onChange={e => setAssignment({ ...assignment, deadline: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAssignOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAssignSubmit} sx={{ background: '#4B5D3A', '&:hover': { background: '#3D4A2F' } }}>Assign Trainee</Button>
        </DialogActions>
      </Dialog>

      {/* Create Project Modal */}
      <Dialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Create New Project</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 3, minWidth: 320 }}>
          <TextField
            label="Project Code *"
            placeholder="e.g. Project-xx"
            size="small"
            fullWidth
            value={newProject.project_code}
            onChange={e => setNewProject({ ...newProject, project_code: e.target.value })}
          />
          <TextField
            label="Project Title *"
            size="small"
            fullWidth
            value={newProject.title}
            onChange={e => setNewProject({ ...newProject, title: e.target.value })}
          />
          <TextField
            label="Description *"
            multiline
            rows={3}
            size="small"
            fullWidth
            value={newProject.description}
            onChange={e => setNewProject({ ...newProject, description: e.target.value })}
          />
          <FormControl size="small" fullWidth>
            <InputLabel>Domain</InputLabel>
            <Select
              value={newProject.domain}
              label="Domain"
              onChange={e => setNewProject({ ...newProject, domain: e.target.value })}
            >
              {['AI/ML', 'Web Dev', 'Cyber Sec', 'Data Sci', 'IoT', 'Embedded'].map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>System Domain</InputLabel>
            <Select
              value={newProject.system_domain}
              label="System Domain"
              onChange={e => setNewProject({ ...newProject, system_domain: e.target.value })}
            >
              {['Hardware', 'Software'].map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField
            label="Recommended Team Size"
            type="number"
            size="small"
            fullWidth
            value={newProject.team}
            onChange={e => setNewProject({ ...newProject, team: parseInt(e.target.value) || 1 })}
          />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateProject} sx={{ background: '#4B5D3A', '&:hover': { background: '#3D4A2F' } }}>Create Project</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}

// ── ATTENDANCE PAGE ───────────────────────────────────────────
export function AttendancePage() {
  const navigate = useNavigate();

  const [trainees, setTrainees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [sessionName, setSessionName] = useState('Daily Morning Session');

  // Interactive changes
  const [editedAttendance, setEditedAttendance] = useState({}); // maps trainee_id -> { status, notes }

  const fetchRegister = async () => {
    setLoading(true);
    try {
      const [traineesRes, recordsRes] = await Promise.all([
        traineesApi.list(),
        attendanceApi.get({ date: selectedDate })
      ]);
      const trList = traineesRes.data.results || traineesRes.data || [];
      const recList = recordsRes.data || [];

      setTrainees(trList);
      setAttendanceRecords(recList);

      // Seed edited attendance map
      const initialMap = {};
      trList.forEach(t => {
        const matchingRecord = recList.find(r => {
          const rTraineeId = typeof r.trainee_id === 'object' ? r.trainee_id.id : r.trainee_id;
          return String(rTraineeId) === String(t.id);
        });

        initialMap[t.id] = {
          status: matchingRecord ? matchingRecord.status : 'present',
          notes: matchingRecord ? (matchingRecord.notes || '') : '',
          time_in: matchingRecord ? (matchingRecord.time_in || '09:00') : '09:00',
          leave_type: matchingRecord ? (matchingRecord.leave_type || '') : ''
        };
      });
      setEditedAttendance(initialMap);
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: 'Failed to load attendance registry.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegister();
  }, [selectedDate]);

  const handleStatusChange = (traineeId, statusVal) => {
    setEditedAttendance({
      ...editedAttendance,
      [traineeId]: {
        ...editedAttendance[traineeId],
        status: statusVal,
        // Reset leave if present/absent
        leave_type: statusVal === 'leave' ? 'Casual' : ''
      }
    });
  };

  const handleNotesChange = (traineeId, notesVal) => {
    setEditedAttendance({
      ...editedAttendance,
      [traineeId]: {
        ...editedAttendance[traineeId],
        notes: notesVal
      }
    });
  };

  const handleLeaveTypeChange = (traineeId, leaveVal) => {
    setEditedAttendance({
      ...editedAttendance,
      [traineeId]: {
        ...editedAttendance[traineeId],
        leave_type: leaveVal
      }
    });
  };

  const handleSaveAttendance = async () => {
    try {
      setLoading(true);
      const recordsToPost = Object.keys(editedAttendance).map(tid => ({
        trainee_id: tid,
        status: editedAttendance[tid].status,
        session_name: sessionName,
        time_in: editedAttendance[tid].status === 'present' ? editedAttendance[tid].time_in : null,
        leave_type: editedAttendance[tid].status === 'leave' ? editedAttendance[tid].leave_type : null,
        notes: editedAttendance[tid].notes || null
      }));

      await attendanceApi.bulkMark(selectedDate, sessionName, recordsToPost);
      setToast({ open: true, message: 'Attendance registry saved successfully.', severity: 'success' });
      fetchRegister();
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: 'Failed to save attendance registry.', severity: 'error' });
      setLoading(false);
    }
  };

  // Metrics computation based on loaded data
  const totalCount = trainees.length;
  const presentCount = Object.values(editedAttendance).filter(v => v.status === 'present').length;
  const absentCount = Object.values(editedAttendance).filter(v => v.status === 'absent').length;
  const leaveCount = Object.values(editedAttendance).filter(v => v.status === 'leave').length;

  return (
    <Box>
      <Breadcrumb items={[{ label: 'Dashboard', onClick: () => navigate('/admin') }, { label: 'Attendance' }]} />
      <PageHeader
        title="Attendance Management"
        subtitle="Mark, update and review daily trainee registers"
        actions={
          <>
            <Button variant="contained" size="small" onClick={handleSaveAttendance} sx={{ background: '#4B5D3A', '&:hover': { background: '#3D4A2F' } }}>
              Save Register
            </Button>
          </>
        }
      />

      {/* Date controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          label="Attendance Date"
          type="date"
          size="small"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Session Name / Topic"
          size="small"
          value={sessionName}
          onChange={e => setSessionName(e.target.value)}
          sx={{ minWidth: 260 }}
        />
      </Box>

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        <Grid item xs={6} md={3}><MetricCard label="Present Today" value={String(presentCount)} sub={`of ${totalCount} trainees`} accentColor="#4B5D3A" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="Absent Today" value={String(absentCount)} sub="Requires review" accentColor="#C0392B" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="On Approved Leave" value={String(leaveCount)} sub="Medical / Casual" accentColor="#B8960C" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="Register Status" value={attendanceRecords.length > 0 ? "Saved" : "Unsaved"} sub="MongoDB Status" accentColor="#3D5A80" /></Grid>
      </Grid>

      <Card>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress sx={{ color: '#4B5D3A' }} /></Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Roll No.</TableCell>
                  <TableCell>Domain</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Leave Type</TableCell>
                  <TableCell>Notes / Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trainees.length > 0 ? (
                  trainees.map(t => {
                    const avatar = getAvatarProps(t.full_name);
                    const state = editedAttendance[t.id] || { status: 'present', notes: '', leave_type: '' };
                    return (
                      <TableRow key={t.id} sx={{ background: state.status === 'absent' ? 'rgba(252,236,234,0.35)' : 'transparent' }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                            <Box sx={{ width: 32, height: 32, borderRadius: '50%', background: '#EEF2E8', color: '#4B5D3A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>
                              {avatar.initials}
                            </Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.8375rem' }}>{t.full_name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell><Typography sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{t.roll_number}</Typography></TableCell>
                        <TableCell><DomainChip domain={t.domain} /></TableCell>
                        <TableCell>
                          <Select
                            size="small"
                            value={state.status}
                            onChange={e => handleStatusChange(t.id, e.target.value)}
                            sx={{ minWidth: 110, fontSize: '0.8rem' }}
                          >
                            <MenuItem value="present">Present</MenuItem>
                            <MenuItem value="absent">Absent</MenuItem>
                            <MenuItem value="leave">Leave</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {state.status === 'leave' ? (
                            <Select
                              size="small"
                              value={state.leave_type || 'Casual'}
                              onChange={e => handleLeaveTypeChange(t.id, e.target.value)}
                              sx={{ minWidth: 100, fontSize: '0.8rem' }}
                            >
                              <MenuItem value="Medical">Medical</MenuItem>
                              <MenuItem value="Casual">Casual</MenuItem>
                              <MenuItem value="Duty">Duty</MenuItem>
                            </Select>
                          ) : '—'}
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            placeholder="Add remark..."
                            value={state.notes || ''}
                            onChange={e => handleNotesChange(t.id, e.target.value)}
                            sx={{ width: '100%', '& input': { fontSize: '0.8rem' } }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography sx={{ color: '#7A8B99', py: 2 }}>No active trainees found to mark.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}

// ── ANNOUNCEMENTS PAGE ──────────────────────────────────────────
export function AnnouncementsPage() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Form state
  const [form, setForm] = useState({
    title: '',
    body: '',
    target_audience: 'All Batches',
    priority: 'normal',
    is_draft: false
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await announcementsApi.list();
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: 'Failed to load announcements.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePublish = async (isDraftVal = false) => {
    if (!form.title.trim() || !form.body.trim()) {
      setToast({ open: true, message: 'Title and message body are required.', severity: 'warning' });
      return;
    }
    try {
      setLoading(true);
      await announcementsApi.create({
        ...form,
        is_draft: isDraftVal
      });
      setToast({ open: true, message: isDraftVal ? 'Announcement saved as draft.' : 'Announcement published.', severity: 'success' });
      setForm({
        title: '',
        body: '',
        target_audience: 'All Batches',
        priority: 'normal',
        is_draft: false
      });
      fetchAnnouncements();
      window.dispatchEvent(new Event('dashboardStatsUpdated'));
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: 'Failed to save announcement.', severity: 'error' });
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      setLoading(true);
      await announcementsApi.delete(id);
      setToast({ open: true, message: 'Announcement deleted successfully.', severity: 'success' });
      fetchAnnouncements();
      window.dispatchEvent(new Event('dashboardStatsUpdated'));
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: 'Failed to delete announcement.', severity: 'error' });
      setLoading(false);
    }
  };

  return (
    <Box>
      <Breadcrumb items={[{ label: 'Dashboard', onClick: () => navigate('/admin') }, { label: 'Announcements' }]} />
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Announcement Center</Typography>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2.5 }}>Post New Announcement</Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, mb: 0.75 }}>Announcement Title *</Typography>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="e.g. Revised Session Schedule for AI/ML"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, mb: 0.75 }}>Full Message *</Typography>
                  <TextField
                    size="small"
                    fullWidth
                    multiline
                    rows={5}
                    placeholder="Write the full announcement here..."
                    value={form.body}
                    onChange={e => setForm({ ...form, body: e.target.value })}
                  />
                </Box>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, mb: 0.75 }}>Target Audience</Typography>
                    <Select
                      size="small"
                      fullWidth
                      value={form.target_audience}
                      onChange={e => setForm({ ...form, target_audience: e.target.value })}
                    >
                      {['All Batches', 'AI/ML Domain', 'Web Dev Domain', 'Cyber Sec Domain', 'Data Sci Domain', 'IoT Domain', 'Embedded Domain'].map(o => (
                        <MenuItem key={o} value={o}>{o}</MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, mb: 0.75 }}>Priority Level</Typography>
                    <Select
                      size="small"
                      fullWidth
                      value={form.priority}
                      onChange={e => setForm({ ...form, priority: e.target.value })}
                    >
                      {['normal', 'urgent', 'notice', 'informational'].map(o => (
                        <MenuItem key={o} value={o}>{o.toUpperCase()}</MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="contained" sx={{ flex: 1, background: '#4B5D3A', '&:hover': { background: '#3D4A2F' } }} onClick={() => handlePublish(false)}>
                    Publish Now
                  </Button>
                  <Button variant="outlined" onClick={() => handlePublish(true)}>
                    Save Draft
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="h6">Announcements List</Typography>
            <Chip label={`${announcements.length} total`} size="small" sx={{ background: '#EEF2E8', color: '#4B5D3A', fontWeight: 700 }} />
          </Box>

          {loading && announcements.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress sx={{ color: '#4B5D3A' }} /></Box>
          ) : (
            <Box sx={{ display: 'grid', gap: 1.5 }}>
              {announcements.length > 0 ? (
                announcements.map(a => (
                  <Box key={a.id} sx={{ position: 'relative' }}>
                    <AnnouncementCard
                      title={`${a.is_draft ? '[DRAFT] ' : ''}${a.title}`}
                      meta={`${new Date(a.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} · ${a.target_audience} · ${a.priority.toUpperCase()}`}
                      priority={a.priority}
                    />
                    <Button
                      variant="text"
                      color="error"
                      size="small"
                      sx={{ position: 'absolute', right: 10, bottom: 8, fontSize: '0.68rem', minWidth: 0, p: 0.5 }}
                      onClick={() => handleDelete(a.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: '#7A8B99', textAlign: 'center', py: 4 }}>No announcements published.</Typography>
              )}
            </Box>
          )}
        </Grid>
      </Grid>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}

