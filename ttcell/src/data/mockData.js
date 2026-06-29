export const trainees = [
  { id: 'TTC-2026-001', name: 'Arjun Nambiar', email: 'arjun.n@bel.co.in', domain: 'AI/ML', attendance: 92, projects: 3, total: 4, status: 'active', initials: 'AN' },
  { id: 'TTC-2026-002', name: 'Priya Sharma', email: 'priya.s@bel.co.in', domain: 'Web Dev', attendance: 88, projects: 4, total: 4, status: 'active', initials: 'PS' },
  { id: 'TTC-2026-003', name: 'Vikram Singh', email: 'vikram.s@bel.co.in', domain: 'Cyber Sec', attendance: 72, projects: 2, total: 4, status: 'at_risk', initials: 'VS' },
  { id: 'TTC-2026-004', name: 'Meera Rao', email: 'meera.r@bel.co.in', domain: 'IoT', attendance: 96, projects: 4, total: 4, status: 'active', initials: 'MR' },
  { id: 'TTC-2026-005', name: 'Rahul Verma', email: 'rahul.v@bel.co.in', domain: 'Data Sci', attendance: 68, projects: 1, total: 4, status: 'at_risk', initials: 'RV' },
  { id: 'TTC-2026-006', name: 'Ananya Patel', email: 'ananya.p@bel.co.in', domain: 'Embedded', attendance: 85, projects: 3, total: 4, status: 'active', initials: 'AP' },
  { id: 'TTC-2026-007', name: 'Rohit Gupta', email: 'rohit.g@bel.co.in', domain: 'AI/ML', attendance: 90, projects: 3, total: 4, status: 'active', initials: 'RG' },
];

export const projects = [
  {
    id: 'PRJ-RS-001', title: 'Phased Array Calibration Utility',
    domain: 'AI/ML', team: 4, progress: 100, status: 'submitted', score: 96,
    description: 'Automated calibration script for active electronically scanned array (AESA) transceivers. Reduces calibration time by 40%.',
    stack: ['Python', 'LabVIEW', 'MATLAB'],
  },
  {
    id: 'PRJ-EW-002', title: 'Signal Intelligence Dashboard',
    domain: 'Web Dev', team: 3, progress: 68, status: 'in_progress', score: null,
    description: 'Real-time visualisation of intercepted RF signals with spectral analysis and basic threat classification.',
    stack: ['React', 'D3.js', 'Python', 'GNU Radio'],
  },
  {
    id: 'PRJ-AV-001', title: 'Flight Telemetry Processor',
    domain: 'IoT', team: 5, progress: 81, status: 'in_progress', score: null,
    description: 'Ingests and parses MIL-STD-1553 bus traffic for predictive maintenance alerts.',
    stack: ['C++', 'Qt', 'PostgreSQL'],
  },
  {
    id: 'PRJ-NC-001', title: 'Tactical Edge Node Emulator',
    domain: 'Data Sci', team: 4, progress: 22, status: 'planning', score: null,
    description: 'Emulates low-bandwidth, high-latency tactical datalinks to test C4I application resilience.',
    stack: ['Linux TC', 'Docker', 'Python'],
  },
];

export const announcements = [
  { id: 1, title: 'Directive: Equipment Inspection — Tomorrow 0900 HRS', priority: 'urgent', audience: 'All Divisions', date: '24 Jun 2026', body: 'Mandatory inventory and calibration check for all assigned lab equipment. Ensure all DMMs and Oscilloscopes are accounted for.' },
  { id: 2, title: 'Briefing: Next-Gen Naval Systems — Friday 1400 HRS', priority: 'normal', audience: 'Naval & EW Divisions', date: '22 Jun 2026', body: 'Technical briefing by Chief Engineer, Naval Systems. Subject: Integration of sonar data with surface tracking radar. Auditorium B.' },
  { id: 3, title: 'Portal Maintenance Notice', priority: 'notice', audience: 'All Users', date: '20 Jun 2026', body: 'The TTC-VTP will be offline for security patching from 2200 HRS Saturday to 0200 HRS Sunday.' },
  { id: 4, title: 'Phase 1 Assessment Results Published', priority: 'normal', audience: 'Batch 2026-A', date: '18 Jun 2026', body: 'Results for the Phase 1 technical assessment are now available. Trainees scoring below 60% must report to the Training Officer.' },
];

export const attendance = [
  { date: '24 Jun', day: 'Wednesday', session: 'Radar Lab 2', time: '08:52', status: 'present', leave: null },
  { date: '23 Jun', day: 'Tuesday', session: 'Project Review', time: '09:02', status: 'present', leave: null },
  { date: '22 Jun', day: 'Monday', session: 'Theory — Signal Proc.', time: '—', status: 'leave', leave: 'Authorised' },
  { date: '20 Jun', day: 'Saturday', session: 'Radar Lab 2', time: '08:45', status: 'present', leave: null },
  { date: '19 Jun', day: 'Friday', session: 'Self-study', time: '09:00', status: 'present', leave: null },
  { date: '18 Jun', day: 'Thursday', session: 'Assessment Brief', time: '08:58', status: 'present', leave: null },
  { date: '17 Jun', day: 'Wednesday', session: 'Radar Lab 1', time: '09:10', status: 'present', leave: null },
];

export const repository = [
  { id: 'PRJ-RS-001', title: 'Phased Array Calibration', domain: 'AI/ML', year: 2025, team: 4, score: 96, stack: 'Python · LabVIEW' },
  { id: 'PRJ-EW-003', title: 'RF Jammer Profile Gen', domain: 'Web Dev', year: 2025, team: 3, score: 94, stack: 'MATLAB · C++' },
  { id: 'PRJ-NS-002', title: 'Sonar Acoustic Modeler', domain: 'Cyber Sec', year: 2024, team: 3, score: 94, stack: 'Python · C++' },
  { id: 'PRJ-WS-001', title: 'Fire Control System GUI', domain: 'Embedded', year: 2024, team: 2, score: 91, stack: 'Qt · C++' },
];

export const traineeProjects = [
  { id: 'PRJ-RS-001', title: 'Phased Array Calibration Utility', type: 'Team (4)', due: '30 Jun 2026', progress: 78, status: 'in_progress', score: null, description: 'Automated calibration script for active electronically scanned array (AESA) transceivers.', stack: ['Python', 'LabVIEW'] },
  { id: 'PRJ-RS-003', title: 'Clutter Mitigation Algorithm', type: 'Individual', due: '15 May 2026', progress: 100, status: 'completed', score: 94, description: 'Adaptive filter to remove ground clutter from simulated radar returns.', stack: ['MATLAB', 'Python'] },
];

export const domainData = [
  { name: 'AI/ML', count: 35 },
  { name: 'Web Dev', count: 28 },
  { name: 'Cyber Sec', count: 20 },
  { name: 'Data Sci', count: 18 },
  { name: 'IoT', count: 12 },
  { name: 'Embedded', count: 15 },
];

export const attendanceWeeks = [85, 89, 92, 87, 81, 88];
export const placementYears = [
  { year: '2021', rate: 82 },
  { year: '2022', rate: 86 },
  { year: '2023', rate: 89 },
  { year: '2024', rate: 92 },
  { year: '2025', rate: 95 },
];
