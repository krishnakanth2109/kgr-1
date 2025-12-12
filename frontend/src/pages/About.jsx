import React, { useState, useEffect } from "react";
import { 
  Award, 
  HeartHandshake, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Users, 
  Monitor, 
  Briefcase, 
  TrendingUp, 
  CheckCircle 
} from "lucide-react";

const AboutUs = () => {
  const [showValues, setShowValues] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animations on load
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Custom CSS for advanced animations and gradients
  const customStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
      100% { transform: translateY(0px); }
    }
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animation-delay-4000 {
      animation-delay: 4s;
    }
    .image-hover-zoom {
      overflow: hidden;
    }
    .image-hover-zoom img {
      transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .image-hover-zoom:hover img {
      transform: scale(1.12);
    }
    .text-gradient {
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-image: linear-gradient(to right, #a21caf, #db2777);
    }
  `;

  return (
    <div className="min-h-screen bg-pink-50/30 font-sans overflow-hidden selection:bg-fuchsia-200 selection:text-fuchsia-900">
      <style>{customStyles}</style>

      {/* --- HERO SECTION --- */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop"
            alt="Vocational College Campus"
            className="w-full h-full object-cover"
          />
          {/* Deep Magenta Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-950/95 via-purple-900/90 to-pink-900/80"></div>
        </div>
        
        <div className={`relative z-10 text-center px-4 max-w-5xl mx-auto ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-block px-4 py-1 mb-6 border border-fuchsia-400/30 rounded-full bg-fuchsia-900/30 backdrop-blur-md">
            <span className="text-fuchsia-200 text-sm font-semibold tracking-wider uppercase">Excellence in Vocational Training</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
            Building Careers.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-fuchsia-300">
              Empowering Futures.
            </span>
          </h1>
          <p className="text-xl text-fuchsia-100 font-light max-w-2xl mx-auto leading-relaxed">
            Practical, skill-based education designed for the modern world. We turn ambition into ability.
          </p>
        </div>
        
        {/* Decorative bottom curve */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-16 md:h-24 text-pink-50/30" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-current"></path>
          </svg>
        </div>
      </section>

      {/* --- ABOUT OVERVIEW --- */}
      <section className="py-24 px-6 md:px-20 container mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center space-x-2 mb-6">
              <span className="h-0.5 w-12 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded"></span>
              <span className="text-fuchsia-700 font-bold uppercase tracking-wider text-sm">About Our College</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
              Bridging the Gap Between <span className="text-gradient">Education</span> & <span className="text-gradient">Employment</span>
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed font-medium">
              Our vocational college focuses on practical, skill-based education that prepares students for immediate employment. We combine hands-on training, industry-relevant curriculum, and guided learning to help students build strong foundations for their careers.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed font-light">
              With a commitment to quality, innovation, and hands-on learning, we prepare students to meet the demands of modern industries seamlessly.
            </p>
          </div>
          
          <div className="relative image-hover-zoom rounded-[2rem] shadow-2xl shadow-fuchsia-900/20 transform -rotate-2 hover:rotate-0 transition duration-500 border-8 border-white bg-white">
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop"
              alt="Students in a workshop"
              className="w-full h-full object-cover rounded-[1.5rem]"
            />
            {/* Floating Badge */}
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl shadow-pink-900/10 animate-float hidden md:block border border-pink-100">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-fuchsia-600 to-pink-600 p-4 rounded-full text-white shadow-lg shadow-fuchsia-600/30">
                  <Award size={28} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">25+</p>
                  <p className="text-sm text-fuchsia-800 font-semibold">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MISSION, VISION & VALUES --- */}
      <section className="bg-gradient-to-b from-white to-pink-50 py-24 px-6 relative overflow-hidden">
        {/* Abstract Background Shapes (Blobs) */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">Our Guiding Principles</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-fuchsia-600 to-pink-600 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Mission Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:shadow-fuchsia-900/10 transition-all duration-300 border-t-4 border-fuchsia-600 group hover:-translate-y-2">
              <div className="bg-fuchsia-50 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-fuchsia-600 group-hover:to-pink-600 transition-all duration-500 shadow-inner">
                <HeartHandshake size={40} className="text-fuchsia-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-fuchsia-700 transition-colors">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed">
                Our mission is to provide high-quality vocational training that equips students with the skills, confidence, and knowledge needed to succeed in today’s competitive job market.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-300 border-t-4 border-purple-600 group hover:-translate-y-2">
              <div className="bg-purple-50 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-fuchsia-600 transition-all duration-500 shadow-inner">
                <Lightbulb size={40} className="text-purple-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-purple-700 transition-colors">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed">
                We envision becoming a leading institution in vocational education by delivering innovative training programs, developing industry-ready professionals, and maintaining excellence.
              </p>
            </div>

            {/* Core Values Card (Interactive) */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:shadow-pink-900/10 transition-all duration-300 border-t-4 border-pink-500 group relative hover:-translate-y-2">
              <div className="bg-pink-50 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-rose-500 transition-all duration-500 shadow-inner">
                <Award size={40} className="text-pink-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-pink-600 transition-colors">Core Values</h3>
              
              <div className="text-slate-600 leading-relaxed">
                <p className="mb-4 font-medium">Practical Learning, Excellence, Integrity, Innovation, Student Success.</p>
                
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showValues ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                  <ul className="space-y-3 text-sm text-slate-700 bg-pink-50/50 p-5 rounded-xl border border-pink-100">
                    <li className="flex gap-3 items-center"><CheckCircle size={18} className="text-fuchsia-600 shrink-0"/> <span><strong>Practical Learning:</strong> Real-world training.</span></li>
                    <li className="flex gap-3 items-center"><CheckCircle size={18} className="text-fuchsia-600 shrink-0"/> <span><strong>Excellence:</strong> High-quality teaching.</span></li>
                    <li className="flex gap-3 items-center"><CheckCircle size={18} className="text-fuchsia-600 shrink-0"/> <span><strong>Integrity:</strong> Transparent environment.</span></li>
                    <li className="flex gap-3 items-center"><CheckCircle size={18} className="text-fuchsia-600 shrink-0"/> <span><strong>Innovation:</strong> Modern tools.</span></li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowValues(!showValues)}
                  className="mt-6 flex items-center px-6 py-2 rounded-full bg-pink-100 text-pink-700 font-bold hover:bg-pink-600 hover:text-white transition-all duration-300"
                >
                  {showValues ? "Show Less" : "Read More"} 
                  {showValues ? <ChevronUp size={18} className="ml-2" /> : <ChevronDown size={18} className="ml-2" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- EXCELLENCE IN EVERY DETAIL (Grid Section) --- */}
      <section className="py-24 px-6 md:px-20 container mx-auto">
        <div className="text-center mb-20">
          <span className="text-fuchsia-600 font-bold uppercase tracking-wider text-sm bg-fuchsia-50 px-4 py-1 rounded-full border border-fuchsia-100">Why We Stand Out</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-6">Excellence in Every Detail</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Feature 1: What We Offer */}
          <div className="group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-fuchsia-900/20 transition-all duration-500 hover:-translate-y-2 bg-white border border-slate-100">
            <div className="h-56 overflow-hidden relative">
              <div className="absolute inset-0 bg-fuchsia-900/20 group-hover:bg-fuchsia-900/0 transition-colors z-10 duration-500"></div>
              <img src="https://images.unsplash.com/photo-1513258496098-43a3d2012518?q=80&w=2070&auto=format&fit=crop" alt="Courses" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="text-fuchsia-600" size={24} />
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-fuchsia-700 transition-colors">What We Offer</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                We offer a wide range of certified vocational courses designed to meet industry requirements. Each program includes practical sessions and real-time learning.
              </p>
            </div>
          </div>

          {/* Feature 2: Our Faculty */}
          <div className="group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-fuchsia-900/20 transition-all duration-500 hover:-translate-y-2 bg-white border border-slate-100">
            <div className="h-56 overflow-hidden relative">
               <div className="absolute inset-0 bg-fuchsia-900/20 group-hover:bg-fuchsia-900/0 transition-colors z-10 duration-500"></div>
              <img src="https://images.unsplash.com/photo-1544531320-dd40e3a2c6c3?q=80&w=2070&auto=format&fit=crop" alt="Faculty" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-purple-600" size={24} />
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors">Expert Faculty</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our experienced faculty members bring strong industry knowledge. They guide students through practical tasks and personalized support to ensure development.
              </p>
            </div>
          </div>

          {/* Feature 3: Infrastructure */}
          <div className="group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-fuchsia-900/20 transition-all duration-500 hover:-translate-y-2 bg-white border border-slate-100">
            <div className="h-56 overflow-hidden relative">
               <div className="absolute inset-0 bg-fuchsia-900/20 group-hover:bg-fuchsia-900/0 transition-colors z-10 duration-500"></div>
              <img src="https://images.unsplash.com/photo-1598981457915-aea220e4047f?q=80&w=2070&auto=format&fit=crop" alt="Labs" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Monitor className="text-pink-600" size={24} />
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-pink-600 transition-colors">Modern Infrastructure</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our campus features advanced labs, workshops, digital classrooms, and a library. All facilities are designed to support practical learning.
              </p>
            </div>
          </div>

          {/* Feature 4: Industry Partnerships */}
          <div className="group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-fuchsia-900/20 transition-all duration-500 hover:-translate-y-2 bg-white border border-slate-100 lg:col-span-1.5">
            <div className="h-56 overflow-hidden relative">
               <div className="absolute inset-0 bg-fuchsia-900/20 group-hover:bg-fuchsia-900/0 transition-colors z-10 duration-500"></div>
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" alt="Industry" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="text-fuchsia-700" size={24} />
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-fuchsia-700 transition-colors">Industry Partnerships</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                We work closely with various industries to align our training with market needs. These partnerships provide internships and real-world exposure.
              </p>
            </div>
          </div>

          {/* Feature 5: Placement Support */}
          <div className="group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-fuchsia-900/20 transition-all duration-500 hover:-translate-y-2 bg-white border border-slate-100 lg:col-span-1.5">
            <div className="h-56 overflow-hidden relative">
               <div className="absolute inset-0 bg-fuchsia-900/20 group-hover:bg-fuchsia-900/0 transition-colors z-10 duration-500"></div>
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop" alt="Placement" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-rose-600" size={24} />
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors">Placement Support</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our dedicated placement cell offers career counseling, resume building, interview preparation, and connections with hiring companies. We support students from training to employment.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- WHY CHOOSE US (CTA) --- */}
      <section className="bg-fuchsia-950 text-white py-24 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-fuchsia-600 rounded-full mix-blend-overlay filter blur-[120px] opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600 rounded-full mix-blend-overlay filter blur-[120px] opacity-20 animate-blob animation-delay-4000"></div>

        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
          <div className="md:w-1/2 space-y-8">
            <h2 className="text-5xl font-extrabold leading-tight">
              Why Choose Our College?
            </h2>
            <p className="text-fuchsia-100 text-lg leading-relaxed font-light">
              We are committed to quality, practical training, industry relevance, and student success. With accessible education, strong support systems, and a career-focused approach, we help students build solid professional futures.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
               {['Practical Training', 'Expert Faculty', 'Modern Facilities', 'Strong Placement'].map((item, idx) => (
                 <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="bg-fuchsia-500 p-1.5 rounded-full shadow-lg shadow-fuchsia-500/40">
                      <CheckCircle size={18} className="text-white"/>
                    </div>
                    <span className="font-semibold tracking-wide text-fuchsia-50">{item}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="md:w-1/2 relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-600 to-pink-500 rounded-[2.5rem] rotate-6 opacity-40 blur-xl animate-pulse"></div>
             <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
              alt="Success" 
              className="relative z-10 rounded-[2.5rem] shadow-2xl border-4 border-fuchsia-400/30 w-full object-cover transform hover:scale-[1.02] transition-transform duration-500"
             />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;