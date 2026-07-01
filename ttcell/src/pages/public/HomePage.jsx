import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiShield, FiExternalLink, FiArrowRight
} from 'react-icons/fi';
import ApplicationModal from '../../components/ApplicationModal';


const PROCESS_STEPS = [
  { num: '1', title: 'Registration', desc: 'Student enrollment and profile creation' },
  { num: '2', title: 'Project Allocation', desc: 'Domain and project assignment' },
  { num: '3', title: 'Training', desc: 'Concept learning and skill development' },
  { num: '4', title: 'Development', desc: 'Project development and implementation' },
  { num: '5', title: 'Evaluation', desc: 'Assessment and performance review' },
  { num: '6', title: 'Completion', desc: 'Certification and project showcase' },
];

const DOMAINS = [
  { title: 'AI & Machine Learning', desc: 'Build intelligent systems and predictive models.', badges: ['Python', 'TensorFlow', 'PyTorch'] },
  { title: 'Web Development', desc: 'Create responsive and modern web applications.', badges: ['React', 'Node.js', 'MongoDB'] },
  { title: 'Cyber Security', desc: 'Learn to secure systems and protect data.', badges: ['Kali Linux', 'Wireshark', 'Metasploit'] },
  { title: 'Embedded Systems', desc: 'Design smart embedded solutions.', badges: ['Arduino', 'STM32', 'Raspberry Pi'] },
  { title: 'IoT', desc: 'Connect devices and build IoT applications.', badges: ['MQTT', 'ESP32', 'Sensors'] },
  { title: 'Robotics', desc: 'Design, build and program robots.', badges: ['ROS', 'C++', 'Kinematics'] },
  { title: 'Data Science', desc: 'Extract insights from data and build models.', badges: ['Pandas', 'SQL', 'Tableau'] },
  { title: 'Cloud Computing', desc: 'Deploy and scale modern applications in the cloud.', badges: ['AWS', 'Docker', 'Kubernetes'] },
];

const FAQS = [
  { q: 'Who is eligible to apply for the internships?', a: 'Engineering students from recognized universities pursuing B.Tech/M.Tech or Diploma courses are eligible to apply.' },
  { q: 'Is there any stipend provided?', a: '509 Internships are academic project-based and usually do not include a stipend.' },
  { q: 'How do I apply for the programs?', a: 'You can apply by clicking the "Explore Our Opportunities and Apply" link and filling out the application form with your details and mandatory documents.' },
  { q: 'Can I choose my preferred domain for the project?', a: 'Yes, you can select your preferred research domain during the application process. Allocation is subject to availability and merit.' },
];

const INTERN_FEEDBACKS = [
  { name: 'Rahul Sharma', college: 'IIT Delhi', feedback: 'My time at 509 ABW was transformative. The hands-on experience with radar systems gave me practical insights that theory never could. Truly an unparalleled internship.', role: 'Radar Systems Intern' },
  { name: 'Ananya Verma', college: 'NIT Trichy', feedback: 'Working alongside seasoned military engineers taught me discipline and precision. The projects were challenging but incredibly rewarding for my career readiness.', role: 'Electronics Intern' },
  { name: 'Vikram Singh', college: 'BITS Pilani', feedback: 'The environment here is unlike any corporate internship. You get to contribute to missions of national importance, which instilled a great sense of pride and confidence in me.', role: 'Systems Intern' },
];


/* ─── Navbar ─── */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header>
      <nav className="bg-white border-b border-surface-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-lg bg-military-dark flex items-center justify-center flex-shrink-0">
              <FiShield className="w-5 h-5 text-gold" />
            </div>
            <div className="leading-none">
              <p className="font-extrabold text-sm text-military-dark tracking-tight">TT CELL</p>
              <p className="text-gray-400 text-[10px] mt-0.5 font-medium">509 ABW • Vocational Training</p>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            {['Home', 'Vocational Training', 'Training Domains', 'Contact'].map((item, i) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className={`no-underline relative py-1 transition-all duration-200 hover:text-military-green ${
                  i === 0
                    ? 'text-military-green font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-military-green after:rounded-full'
                    : 'after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-military-green after:rounded-full after:transition-all after:duration-300 hover:after:w-full'
                }`}>
                {item}
              </a>
            ))}
          </div>

          {/* CTA */}
          <Link to="/login">
            <button className="hidden md:flex btn-primary items-center gap-2">
              Login to Portal <FiExternalLink className="w-3.5 h-3.5" />
            </button>
          </Link>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 h-0.5 bg-gray-700 mb-1.5" />
            <div className="w-5 h-0.5 bg-gray-700 mb-1.5" />
            <div className="w-5 h-0.5 bg-gray-700" />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-surface-border py-4 px-6 space-y-1">
            {['Home', 'Vocational Training', 'Domains', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="block text-sm font-medium text-gray-700 no-underline px-3 py-2.5 rounded-lg hover:text-military-green hover:bg-surface-subtle transition-all duration-200">{item}</a>
            ))}
            <div className="pt-2">
              <Link to="/login" className="no-underline"><button className="btn-primary w-full">Login to Portal</button></Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}


/* ─── Hero ─── */
function HeroSection() {
  return (
    <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-start overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/new_radar_bg.jpg")' }}>
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 z-10 w-full mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            509 ABW<br />
            Internship Program
          </h1>
          <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-8">
            At 509 Army Base Workshop, we explore the extraordinary every day and our work is more than just a profession — it's a lifelong pursuit and a passion. We offer students challenging projects and on-the-job experiences, building confidence, essential technical skills, and career readiness.
          </p>
        </motion.div>
      </div>
    </section>
  );
}


/* ─── Internship Comparison ─── */
function InternshipComparisonSection({ onApplyClick }) {
  return (
    <section className="py-20 bg-white text-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-extrabold mb-6 text-military-dark">
              Vocational Summer Training
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              45 days academic project-based internships. Work on real projects, build your resume, and strengthen your career readiness without stipend constraints. We offer multiple sessions annually.
            </p>
            
            <button onClick={onApplyClick} className="flex items-center gap-2 text-red-600 font-bold hover:underline text-lg transition-all hover:text-red-700 group">
              Click Here to Explore Our Opportunities and Apply 
              <span className="w-5 h-5 flex items-center justify-center bg-red-600 text-white rounded-full ml-1 text-xs group-hover:bg-red-700 transition-colors">
                <FiArrowRight />
              </span>
            </button>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl relative">
            <img src="/army_radar_about.png" alt="509 Internship" className="w-full h-80 object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}


/* ─── Process Steps ─── */
function ProcessSection() {
  return (
    <section id="vocational-training" className="py-20 bg-surface-muted">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-12">
          <span className="section-label">Our Vocational Training Process —</span>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute top-12 left-[8%] right-[8%] h-0.5 bg-gold/30" />
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-14 h-14 rounded-full bg-military-dark text-white flex items-center justify-center text-lg mx-auto mb-4 font-bold relative z-10 border-2 border-gold">
                  {step.num}
                </div>
                <p className="font-bold text-sm text-military-dark">{step.title}</p>
                <p className="text-xs text-gray-500 mt-1 leading-snug">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ─── Domains ─── */
function DomainsSection() {
  return (
    <section id="training-domains" className="py-24 bg-surface-subtle">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-military-dark">Training Domains</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Explore our specialized tracks designed to equip you with industry-leading skills and hands-on technical expertise.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DOMAINS.map((d, i) => (
            <motion.div 
              key={d.title} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }} 
              className="group relative bg-white border border-surface-border rounded-2xl p-8 shadow-card hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col h-full overflow-hidden hover:shadow-card-hover"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out bg-gradient-to-r from-military-light to-gold" />
              
              <h3 className="font-bold text-lg text-gray-900 mb-3 tracking-tight">{d.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">{d.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {d.badges.map(b => (
                  <span key={b} className="text-xs px-2.5 py-1 rounded-full bg-surface-subtle text-military-green font-medium">{b}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ─── Path to 509 (Testimonials) ─── */
function PathTo509Section() {
  return (
    <section className="py-20 bg-surface-muted">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4 text-military-dark">My Path to 509</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Hear from our past interns about their journey, experiences, and how the 509 ABW internship shaped their technical careers.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {INTERN_FEEDBACKS.map((fb, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-card border border-surface-border relative hover:shadow-card-hover transition-all duration-300"
            >
              <div className="absolute top-6 right-6 opacity-20 text-6xl font-serif text-gold">"</div>
              <p className="text-gray-700 italic mb-8 relative z-10 text-sm leading-relaxed">"{fb.feedback}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-military-light/10 text-military-light">
                  {fb.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-military-dark">{fb.name}</h4>
                  <p className="text-xs text-gray-500">{fb.role} • {fb.college}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ─── FAQ ─── */
function FAQSection() {
  return (
    <section id="faq" className="w-full">
      {/* Top Section */}
      <div className="py-24 px-6 text-center md:text-left bg-military-light">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
            Frequently Asked<br />Questions
          </h2>
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="py-16 px-6 bg-military-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="flex flex-col items-start gap-4">
                <div className="w-12 h-12 bg-gold text-military-dark rounded-full flex items-center justify-center font-extrabold text-2xl flex-shrink-0 shadow-lg">
                  ?
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-3 leading-snug">{faq.q}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-right">
             <button className="text-gold font-bold hover:underline flex items-center justify-end w-full gap-2 text-sm transition-all">
                More Frequently Asked Questions <FiArrowRight className="w-5 h-5 bg-red-600 rounded-full p-0.5 text-white" />
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ─── Main Landing Page ─── */
export default function LandingPage() {
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  return (
    <div className="min-h-screen landing-page-root">
      <Navbar />
      <HeroSection />
      <InternshipComparisonSection onApplyClick={() => setShowApplicationForm(true)} />
      <ProcessSection />
      <DomainsSection />
      <PathTo509Section />
      <FAQSection />
      <ApplicationModal isOpen={showApplicationForm} onClose={() => setShowApplicationForm(false)} />
    </div>
  );
}
