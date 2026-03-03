import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowRight, Github, Linkedin, Mail, ChevronRight, Plus, Trash2, Edit2, Save, LogOut } from "lucide-react";
import { db, storage } from "./lib/firebase";
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, setDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { cn } from "./lib/utils";
import { Project, Expertise, Role, Skill } from "./types";
import { INITIAL_PROJECTS, INITIAL_EXPERTISE, INITIAL_ROLES, SKILLS } from "./constants";

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-paper/80 backdrop-blur-md border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif font-semibold tracking-tight">KMR.</Link>
        
        <div className="hidden md:flex items-center space-x-12">
          {["Expertise", "Projects", "Skills", "Contact"].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-[10px] uppercase tracking-[0.2em] hover:text-gold transition-colors"
            >
              {item}
            </a>
          ))}
          <Link to="/admin" className="text-[10px] uppercase tracking-[0.2em] border border-ink px-4 py-2 hover:bg-ink hover:text-paper transition-all">
            Admin
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 w-full bg-paper border-b border-ink/10 p-6 flex flex-col space-y-6 md:hidden"
          >
            {["Expertise", "Projects", "Skills", "Contact"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-xs uppercase tracking-[0.2em]"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            ))}
            <Link to="/admin" className="text-xs uppercase tracking-[0.2em] text-gold" onClick={() => setIsOpen(false)}>
              Admin Dashboard
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-ink text-paper py-20 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="space-y-6">
        <h2 className="text-3xl font-serif">Khalifa Mazaya Ramadhan</h2>
        <p className="text-paper/60 text-sm max-w-xs">
          Mining & Petroleum Engineering Student at Institut Teknologi Bandung.
        </p>
      </div>
      <div className="space-y-6">
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-paper/40">Navigation</h3>
        <div className="flex flex-col space-y-4">
          <a href="#expertise" className="text-sm hover:text-gold transition-colors">Expertise</a>
          <a href="#projects" className="text-sm hover:text-gold transition-colors">Projects</a>
          <a href="#skills" className="text-sm hover:text-gold transition-colors">Skills</a>
        </div>
      </div>
      <div className="space-y-6">
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-paper/40">Connect</h3>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-gold transition-colors"><Linkedin size={20} /></a>
          <a href="#" className="hover:text-gold transition-colors"><Mail size={20} /></a>
          <a href="#" className="hover:text-gold transition-colors"><Github size={20} /></a>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-paper/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] uppercase tracking-widest text-paper/40">
      <p>© 2024 Khalifa Mazaya Ramadhan. All Rights Reserved.</p>
      <p>Designed with Prestige</p>
    </div>
  </footer>
);

// --- Pages ---

const Portfolio = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [expertise, setExpertise] = useState<Expertise[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profileImage, setProfileImage] = useState("https://m.media-amazon.com/images/M/MV5BOTU2MTI0NTIyNV5BMl5BanBnXkFtZTcwMTA4Nzc3OA@@._V1_.jpg");

  useEffect(() => {
    const unsubRoles = onSnapshot(collection(db, "roles"), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Role));
      setRoles(data.length > 0 ? data : INITIAL_ROLES);
    });
    const unsubExpertise = onSnapshot(collection(db, "expertise"), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expertise));
      setExpertise(data.length > 0 ? data : INITIAL_EXPERTISE);
    });
    const unsubProjects = onSnapshot(collection(db, "projects"), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(data.length > 0 ? data : INITIAL_PROJECTS);
    });
    const unsubProfile = onSnapshot(doc(db, "settings", "profile"), (snap) => {
      if (snap.exists()) {
        setProfileImage(snap.data().imageUrl);
      }
    });

    return () => {
      unsubRoles();
      unsubExpertise();
      unsubProjects();
      unsubProfile();
    };
  }, []);

  return (
    <div className="pt-20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col md:flex-row items-center justify-center px-6 py-20 max-w-7xl mx-auto gap-12">
        <div className="flex-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-ink/40">Khalifa Mazaya Ramadhan</span>
            <h1 className="text-6xl md:text-8xl font-serif leading-tight">
              Engineering <br />
              <span className="italic text-gold">the Future</span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            {roles.map((role, i) => (
              <div key={i} className="border border-ink/10 px-6 py-3 rounded-full">
                <span className="text-xs uppercase tracking-widest">{role.title}</span>
              </div>
            ))}
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-ink/60 max-w-md font-serif italic"
          >
            "A dedicated student at ITB, passionate about optimizing resource extraction and sustainable energy solutions."
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 relative"
        >
          <div className="w-full aspect-[4/5] bg-ink/5 relative overflow-hidden oval-mask">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Khalifa Mazaya Ramadhan" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-ink/5 animate-pulse" />
            )}
          </div>
          <div className="absolute -bottom-6 -left-6 bg-paper border border-ink/10 p-8 hidden lg:block">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-ink/40">Based in</p>
              <p className="text-sm font-medium">Bandung, Indonesia</p>
            </div>
          </div>
          <div className="absolute top-1/2 -right-12 vertical-text hidden xl:block">
            <span className="text-[10px] uppercase tracking-[0.5em] text-ink/20 font-bold">INSTITUT TEKNOLOGI BANDUNG</span>
          </div>
        </motion.div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="bg-ink text-paper py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-paper/40">What I Do</span>
              <h2 className="text-5xl md:text-7xl font-serif">Core Expertise</h2>
            </div>
            <p className="text-paper/60 max-w-xs text-sm font-serif italic">
              Bridging the gap between theoretical engineering and practical field optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-paper/10">
            {expertise.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-12 border-b md:border-b-0 md:border-r border-paper/10 group hover:bg-paper hover:text-ink transition-all duration-500"
              >
                <span className="text-[10px] text-gold mb-8 block">0{i + 1}</span>
                <h3 className="text-2xl font-serif mb-6">{item.title}</h3>
                <p className="text-sm opacity-60 leading-relaxed font-serif italic">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-ink/40">Portfolio</span>
              <h2 className="text-5xl md:text-7xl font-serif">Selected Works</h2>
            </div>
            <div className="flex items-center space-x-4 text-[10px] uppercase tracking-widest group cursor-pointer">
              <span>View All Projects</span>
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {projects.map((project, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="group"
              >
                <div className="relative aspect-[16/10] overflow-hidden mb-8">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6 bg-paper/90 backdrop-blur px-4 py-2 text-[10px] uppercase tracking-widest">
                    {project.category}
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-serif">{project.title}</h3>
                    <p className="text-ink/60 text-sm max-w-sm">{project.description}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-ink/40">{project.year}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="bg-paper py-32 px-6 border-t border-ink/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.4em] text-ink/40">Capabilities</span>
            <h2 className="text-5xl md:text-7xl font-serif">Technical Arsenal</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-12">
            {SKILLS.map((skill, i) => (
              <div key={i} className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs uppercase tracking-widest font-semibold">{skill.name}</span>
                  <span className="text-[10px] text-ink/40">{skill.level}%</span>
                </div>
                <div className="h-[1px] bg-ink/10 w-full relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-gold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.4em] text-ink/40">Get In Touch</span>
            <h2 className="text-5xl md:text-8xl font-serif">Let's build something <span className="italic text-gold">extraordinary</span>.</h2>
          </div>
          
          <p className="text-lg text-ink/60 font-serif italic">
            Currently open for internships, research collaborations, and engineering projects.
          </p>

          <a 
            href="mailto:khalifa@example.com" 
            className="inline-flex items-center space-x-6 border border-ink px-12 py-6 text-xs uppercase tracking-[0.3em] hover:bg-ink hover:text-paper transition-all duration-500 group"
          >
            <span>Send an Inquiry</span>
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "atmin" && password === "paswut") {
      onLogin();
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-12"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-serif">Admin Access</h1>
          <p className="text-[10px] uppercase tracking-widest text-ink/40">Secure Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-ink/60">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-ink/20 py-4 focus:border-gold outline-none transition-colors"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-ink/60">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-ink/20 py-4 focus:border-gold outline-none transition-colors"
              required
            />
          </div>
          {error && <p className="text-red-500 text-[10px] uppercase tracking-widest">{error}</p>}
          <button 
            type="submit"
            className="w-full bg-ink text-paper py-6 text-[10px] uppercase tracking-[0.3em] hover:bg-gold transition-all"
          >
            Authenticate
          </button>
        </form>
        
        <Link to="/" className="block text-center text-[10px] uppercase tracking-widest text-ink/40 hover:text-ink transition-colors">
          Return to Portfolio
        </Link>
      </motion.div>
    </div>
  );
};

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<"roles" | "expertise" | "projects" | "profile">("roles");
  const [roles, setRoles] = useState<Role[]>([]);
  const [expertise, setExpertise] = useState<Expertise[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [newRole, setNewRole] = useState({ title: "", description: "" });
  const [newExpertise, setNewExpertise] = useState({ title: "", description: "" });
  const [newProject, setNewProject] = useState({ title: "", description: "", imageUrl: "", category: "", year: "" });
  const [profileUrlInput, setProfileUrlInput] = useState("");

  useEffect(() => {
    const unsubRoles = onSnapshot(collection(db, "roles"), (snap) => {
      setRoles(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Role)));
    });
    const unsubExpertise = onSnapshot(collection(db, "expertise"), (snap) => {
      setExpertise(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expertise)));
    });
    const unsubProjects = onSnapshot(collection(db, "projects"), (snap) => {
      setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    });
    const unsubProfile = onSnapshot(doc(db, "settings", "profile"), (snap) => {
      if (snap.exists()) {
        const url = snap.data().imageUrl;
        setProfileImage(url || null);
        setProfileUrlInput(url || "");
      }
    });
    return () => { unsubRoles(); unsubExpertise(); unsubProjects(); unsubProfile(); };
  }, []);

  const handleAddRole = async () => {
    if (!newRole.title) return;
    await addDoc(collection(db, "roles"), newRole);
    setNewRole({ title: "", description: "" });
  };

  const handleAddExpertise = async () => {
    if (!newExpertise.title) return;
    await addDoc(collection(db, "expertise"), newExpertise);
    setNewExpertise({ title: "", description: "" });
  };

  const handleAddProject = async () => {
    if (!newProject.title) return;
    await addDoc(collection(db, "projects"), newProject);
    setNewProject({ title: "", description: "", imageUrl: "", category: "", year: "" });
  };

  const handleDelete = async (coll: string, id: string) => {
    await deleteDoc(doc(db, coll, id));
  };

  const handleUpdateProfileUrl = async () => {
    if (!profileUrlInput) return;
    await setDoc(doc(db, "settings", "profile"), { imageUrl: profileUrlInput });
    alert("Profile photo updated via link!");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `profile/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      await setDoc(doc(db, "settings", "profile"), { imageUrl: downloadURL });
      setProfileImage(downloadURL);
      setProfileUrlInput(downloadURL);
      alert("Profile photo uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <nav className="border-b border-ink/10 px-6 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-serif">Dashboard</h1>
        <button onClick={onLogout} className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700">
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-6 lg:p-12">
        <div className="flex space-x-8 mb-12 border-b border-ink/10 overflow-x-auto whitespace-nowrap">
          {["roles", "expertise", "projects", "profile"].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "pb-4 text-[10px] uppercase tracking-widest transition-all",
                activeTab === tab ? "border-b-2 border-ink text-ink" : "text-ink/40"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Column */}
          <div className="lg:col-span-1 space-y-8">
            <h2 className="text-xl font-serif">
              {activeTab === "profile" ? "Update Profile Photo" : `Add New ${activeTab.slice(0, -1)}`}
            </h2>
            
            {activeTab === "roles" && (
              <div className="space-y-4">
                <input 
                  placeholder="Role Title" 
                  className="w-full bg-transparent border border-ink/10 p-4 text-sm outline-none focus:border-gold"
                  value={newRole.title}
                  onChange={e => setNewRole({...newRole, title: e.target.value})}
                />
                <textarea 
                  placeholder="Description" 
                  className="w-full bg-transparent border border-ink/10 p-4 text-sm outline-none focus:border-gold h-32"
                  value={newRole.description}
                  onChange={e => setNewRole({...newRole, description: e.target.value})}
                />
                <button onClick={handleAddRole} className="w-full bg-ink text-paper py-4 text-[10px] uppercase tracking-widest hover:bg-gold transition-all">Add Role</button>
              </div>
            )}

            {activeTab === "expertise" && (
              <div className="space-y-4">
                <input 
                  placeholder="Expertise Title" 
                  className="w-full bg-transparent border border-ink/10 p-4 text-sm outline-none focus:border-gold"
                  value={newExpertise.title}
                  onChange={e => setNewExpertise({...newExpertise, title: e.target.value})}
                />
                <textarea 
                  placeholder="Description" 
                  className="w-full bg-transparent border border-ink/10 p-4 text-sm outline-none focus:border-gold h-32"
                  value={newExpertise.description}
                  onChange={e => setNewExpertise({...newExpertise, description: e.target.value})}
                />
                <button onClick={handleAddExpertise} className="w-full bg-ink text-paper py-4 text-[10px] uppercase tracking-widest hover:bg-gold transition-all">Add Expertise</button>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="space-y-4">
                <input 
                  placeholder="Project Title" 
                  className="w-full bg-transparent border border-ink/10 p-4 text-sm outline-none focus:border-gold"
                  value={newProject.title}
                  onChange={e => setNewProject({...newProject, title: e.target.value})}
                />
                <input 
                  placeholder="Image URL" 
                  className="w-full bg-transparent border border-ink/10 p-4 text-sm outline-none focus:border-gold"
                  value={newProject.imageUrl}
                  onChange={e => setNewProject({...newProject, imageUrl: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    placeholder="Category" 
                    className="w-full bg-transparent border border-ink/10 p-4 text-sm outline-none focus:border-gold"
                    value={newProject.category}
                    onChange={e => setNewProject({...newProject, category: e.target.value})}
                  />
                  <input 
                    placeholder="Year" 
                    className="w-full bg-transparent border border-ink/10 p-4 text-sm outline-none focus:border-gold"
                    value={newProject.year}
                    onChange={e => setNewProject({...newProject, year: e.target.value})}
                  />
                </div>
                <textarea 
                  placeholder="Description" 
                  className="w-full bg-transparent border border-ink/10 p-4 text-sm outline-none focus:border-gold h-32"
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                />
                <button onClick={handleAddProject} className="w-full bg-ink text-paper py-4 text-[10px] uppercase tracking-widest hover:bg-gold transition-all">Add Project</button>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-serif">Option 1: Image Link (Drive, etc.)</h3>
                  <input 
                    placeholder="Paste Image URL here" 
                    className="w-full bg-transparent border border-ink/10 p-4 text-sm outline-none focus:border-gold"
                    value={profileUrlInput}
                    onChange={e => setProfileUrlInput(e.target.value)}
                  />
                  <button 
                    onClick={handleUpdateProfileUrl}
                    className="w-full bg-ink text-paper py-4 text-[10px] uppercase tracking-widest hover:bg-gold transition-all"
                  >
                    Update via Link
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-serif">Option 2: Direct Upload</h3>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="profile-upload"
                      disabled={uploading}
                    />
                    <label 
                      htmlFor="profile-upload"
                      className={cn(
                        "flex items-center justify-center w-full border-2 border-dashed border-ink/10 p-12 cursor-pointer hover:border-gold transition-all",
                        uploading && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="text-center">
                        <Plus className="mx-auto mb-2 text-ink/40" />
                        <span className="text-[10px] uppercase tracking-widest text-ink/40">
                          {uploading ? "Uploading..." : "Click to Upload File"}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* List Column */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-serif">
              {activeTab === "profile" ? "Current Profile Preview" : `Manage ${activeTab}`}
            </h2>
            <div className="space-y-4">
              {activeTab === "profile" && (
                <div className="flex flex-col items-center space-y-6 p-12 border border-ink/10">
                  <div className="w-64 aspect-[4/5] bg-ink/5 overflow-hidden oval-mask">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover grayscale"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-ink/10 flex items-center justify-center text-[10px] uppercase tracking-widest text-ink/20">No Image</div>
                    )}
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-ink/40">Current Active Photo</p>
                </div>
              )}
              {activeTab === "roles" && roles.map(role => (
                <div key={role.id} className="border border-ink/10 p-6 flex justify-between items-center group hover:border-gold transition-all">
                  <div>
                    <h3 className="font-serif text-lg">{role.title}</h3>
                    <p className="text-xs text-ink/40">{role.description}</p>
                  </div>
                  <button onClick={() => handleDelete("roles", role.id!)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {activeTab === "expertise" && expertise.map(item => (
                <div key={item.id} className="border border-ink/10 p-6 flex justify-between items-center group hover:border-gold transition-all">
                  <div>
                    <h3 className="font-serif text-lg">{item.title}</h3>
                    <p className="text-xs text-ink/40">{item.description}</p>
                  </div>
                  <button onClick={() => handleDelete("expertise", item.id!)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {activeTab === "projects" && projects.map(project => (
                <div key={project.id} className="border border-ink/10 p-6 flex justify-between items-center group hover:border-gold transition-all">
                  <div className="flex items-center space-x-4">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} className="w-12 h-12 object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-12 h-12 bg-ink/5" />
                    )}
                    <div>
                      <h3 className="font-serif text-lg">{project.title}</h3>
                      <p className="text-xs text-ink/40">{project.category} • {project.year}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete("projects", project.id!)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route 
          path="/admin" 
          element={
            isAdmin ? (
              <AdminDashboard onLogout={() => setIsAdmin(false)} />
            ) : (
              <AdminLogin onLogin={() => setIsAdmin(true)} />
            )
          } 
        />
      </Routes>
    </Router>
  );
}
