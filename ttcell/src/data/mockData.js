export const trainees = [
  { id: 'TT24-001', name: 'Rahul Verma', email: 'rahul.v@ttcell', domain: 'AI/ML', attendance: 92, projects: 3, total: 4, status: 'active', initials: 'RV', color: '#4A6331' },
  { id: 'TT24-002', name: 'Priya Sharma', email: 'priya.s@ttcell', domain: 'Cyber Sec', attendance: 88, projects: 4, total: 4, status: 'active', initials: 'PS', color: '#3D5A80' },
  { id: 'TT24-003', name: 'Arjun Kumar', email: 'arjun.k@ttcell', domain: 'Embedded', attendance: 72, projects: 2, total: 4, status: 'at_risk', initials: 'AK', color: '#B8960C' },
  { id: 'TT24-004', name: 'Meera Rao', email: 'meera.r@ttcell', domain: 'Data Sci', attendance: 96, projects: 4, total: 4, status: 'active', initials: 'MR', color: '#4A6331' },
  { id: 'TT24-005', name: 'Vikram Singh', email: 'vikram.s@ttcell', domain: 'Web Dev', attendance: 68, projects: 1, total: 4, status: 'at_risk', initials: 'VS', color: '#C0392B' },
  { id: 'TT24-006', name: 'Ananya Patel', email: 'ananya.p@ttcell', domain: 'IoT', attendance: 85, projects: 3, total: 4, status: 'active', initials: 'AP', color: '#4A6331' },
  { id: 'TT24-007', name: 'Rohit Gupta', email: 'rohit.g@ttcell', domain: 'AI/ML', attendance: 90, projects: 3, total: 4, status: 'active', initials: 'RG', color: '#3D5A80' },
];

export const projects = [
  {
    id: 'TT24-AI-001', title: 'Edge AI Surveillance System',
    domain: 'AI/ML', team: 4, progress: 100, status: 'submitted', score: 96,
    description: 'YOLOv8-based real-time object detection on Raspberry Pi 5 with MQTT telemetry to a central React dashboard. Achieves 24 FPS at 91.3% mAP on test dataset.',
    stack: ['YOLOv8', 'Raspberry Pi 5', 'MQTT', 'React', 'Python'],
    color: '#4338CA',
  },
  {
    id: 'TT24-CY-002', title: 'Red Team Simulation Framework',
    domain: 'Cyber Sec', team: 3, progress: 68, status: 'in_progress', score: null,
    description: 'Automated penetration testing toolkit targeting SCADA systems in a sandboxed defence network environment. Report generator module in progress.',
    stack: ['Python', 'Metasploit', 'Nmap', 'Kali Linux'],
    color: '#C0392B',
  },
  {
    id: 'TT24-DS-001', title: 'Predictive Equipment Maintenance',
    domain: 'Data Sci', team: 5, progress: 81, status: 'in_progress', score: null,
    description: 'LSTM-based anomaly detection model for armoured vehicle engine telemetry. 91% accuracy on validation set. Power BI dashboard in final stages.',
    stack: ['Python', 'LSTM', 'Pandas', 'Power BI'],
    color: '#B8960C',
  },
  {
    id: 'TT24-IOT-001', title: 'LoRaWAN Battlefield Sensor Network',
    domain: 'IoT', team: 4, progress: 22, status: 'planning', score: null,
    description: 'LoRaWAN mesh network of environmental and acoustic sensors for simulated perimeter monitoring. Gateway configured; node firmware in development.',
    stack: ['ESP32', 'LoRaWAN', 'Node-RED', 'MQTT'],
    color: '#4A6331',
  },
];

export const announcements = [
  { id: 1, title: 'Mandatory Medical Checkup — Tomorrow 10:00 AM', priority: 'urgent', audience: 'All Batches', date: '12 Jun 2025', body: 'All trainees are required to report to Medical Bay (Block C, Room 101) at 10:00 AM for the mandatory bi-monthly health checkup. Bring your ID card.' },
  { id: 2, title: 'Guest Lecture: Dr. Kavita Nair, DRDO — Friday 3:00 PM', priority: 'normal', audience: 'All Batches', date: '11 Jun 2025', body: 'Dr. Kavita Nair, Principal Scientist at DRDO LRDE, will speak on "AI in Defence Systems". Seminar Hall A, 15:00–17:00. Bonus session for AI/ML and Data Science students.' },
  { id: 3, title: 'Project Submission Deadline Extended to 20 June', priority: 'notice', audience: 'AI/ML & Cyber Sec', date: '10 Jun 2025', body: 'Due to server maintenance (13–14 Jun), submission portal will be unavailable. New deadline: 20 Jun 2025, 23:59 IST. No further extensions will be granted.' },
  { id: 4, title: 'Best Project Award Ceremony — 25 Jun, 4:00 PM', priority: 'normal', audience: 'All Batches', date: '08 Jun 2025', body: 'Annual Best Project Award Ceremony will be held on 25 Jun in Parade Ground Auditorium. Top 3 projects from each domain will be showcased. CO will preside.' },
];

export const attendance = [
  { date: '12 Jun', day: 'Thursday', session: 'AI/ML Lab · Room 4B', time: '08:52', status: 'present', leave: null },
  { date: '11 Jun', day: 'Wednesday', session: 'Project Review', time: '09:02', status: 'present', leave: null },
  { date: '10 Jun', day: 'Tuesday', session: 'Theory — Neural Nets', time: '—', status: 'leave', leave: 'Medical' },
  { date: '09 Jun', day: 'Monday', session: 'AI/ML Lab · Room 4B', time: '08:45', status: 'present', leave: null },
  { date: '07 Jun', day: 'Saturday', session: 'Self-study / Lab', time: '09:00', status: 'present', leave: null },
  { date: '06 Jun', day: 'Friday', session: 'Capstone Workshop', time: '08:58', status: 'present', leave: null },
  { date: '05 Jun', day: 'Thursday', session: 'AI/ML Lab · Room 4B', time: '09:10', status: 'present', leave: null },
];

export const repository = [
  { id: 'TT24-AI-001', title: 'Edge AI Surveillance System', domain: 'AI/ML', year: 2024, team: 4, score: 96, stack: 'YOLOv8 · Pi5 · MQTT' },
  { id: 'TT23-AI-003', title: 'NLP Radio Intent Classifier', domain: 'AI/ML', year: 2023, team: 3, score: 94, stack: 'BERT · FastAPI · Python' },
  { id: 'TT23-CY-002', title: 'SCADA Pen-Test Framework', domain: 'Cyber Sec', year: 2023, team: 3, score: 94, stack: 'Metasploit · Python · Kali' },
  { id: 'TT23-EM-001', title: 'STM32 Real-Time Motor Controller', domain: 'Embedded', year: 2023, team: 2, score: 91, stack: 'STM32 · FreeRTOS · C' },
  { id: 'TT24-DS-001', title: 'Predictive Vehicle Maintenance', domain: 'Data Sci', year: 2024, team: 5, score: 89, stack: 'LSTM · Pandas · Power BI' },
  { id: 'TT22-IOT-001', title: 'LoRaWAN Perimeter Sensor Net', domain: 'IoT', year: 2022, team: 4, score: 88, stack: 'ESP32 · LoRaWAN · Node-RED' },
];

export const traineeProjects = [
  { id: 'TT24-AI-001', title: 'Edge AI Surveillance System', type: 'Team (4)', due: '20 Jun 2025', progress: 78, status: 'in_progress', score: null, description: 'YOLOv8-based real-time detection on Raspberry Pi 5 with MQTT telemetry. Finalising alert management module.', stack: ['YOLOv8', 'Raspberry Pi 5', 'MQTT', 'React'] },
  { id: 'TT24-AI-003', title: 'NLP Radio Intent Classifier', type: 'Individual', due: '15 May 2025', progress: 100, status: 'completed', score: 94, description: 'Fine-tuned BERT model classifying radio intents into 12 operational categories. 94.3% accuracy, sub-100ms inference.', stack: ['BERT', 'Transformers', 'FastAPI', 'Python'] },
  { id: 'TT24-AI-002', title: 'Aerial Image Segmentation Pipeline', type: 'Team (3)', due: '02 Apr 2025', progress: 100, status: 'completed', score: 88, description: 'Semantic segmentation of aerial imagery into 8 terrain categories. Deployed on TT Cell inference server.', stack: ['U-Net', 'ResNet-50', 'OpenCV', 'PyTorch'] },
];

export const domainData = [
  { name: 'AI/ML', count: 31, color: '#4338CA' },
  { name: 'Web Dev', count: 23, color: '#3D5A80' },
  { name: 'Cyber Sec', count: 20, color: '#C0392B' },
  { name: 'Data Sci', count: 19, color: '#B8960C' },
  { name: 'IoT', count: 15, color: '#4A6331' },
  { name: 'Embedded', count: 14, color: '#C2185B' },
];

export const attendanceWeeks = [82, 88, 91, 85, 78, 87];
export const placementYears = [
  { year: '2019', rate: 78 },
  { year: '2020', rate: 82 },
  { year: '2021', rate: 85 },
  { year: '2022', rate: 89 },
  { year: '2023', rate: 91 },
  { year: '2024', rate: 94 },
];
