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
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-PtQUddNlLuJJoosSVrWRbq4z7OHdMiu0Bw&s" alt="Courses" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
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
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHcr2PNfaq7h6wvImTx6Inx3eelM7wrgYfgA&s" alt="Faculty" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
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
              <img src="data:image/jpeg;base64,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" alt="Labs" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
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