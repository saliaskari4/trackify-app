import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans selection:bg-[#4ade80] selection:text-black">
      
      <nav className="fixed top-0 w-full z-50 bg-[#0d1117]/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4ade80] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(74,222,128,0.4)]">
              <span className="text-black font-black text-xs">T.</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-[#4ade80]">Trackify.</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-[#4ade80] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#4ade80] transition-colors">How it Works</a>
            
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="px-5 py-2 text-sm font-bold text-gray-300 hover:text-[#4ade80] transition-colors">
              Login
            </Link>
            <Link to="/signup" className="px-6 py-2.5 bg-[#4ade80] text-black rounded-full text-sm font-bold shadow-lg shadow-[#4ade80]/20 hover:bg-[#3dbd6d] hover:scale-105 transition-all active:scale-95">
              Signup
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#4ade80] opacity-[0.05] blur-[120px] rounded-full"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-white leading-tight">
            Track Your Expenses <span className="text-[#4ade80]">Smartly</span> & Save More 
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
            Manage your daily spending, analyze trends, and stay within your budget effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-[#4ade80] text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#3dbd6d] transition-all shadow-xl shadow-[#4ade80]/10">
              Get Started Free
            </Link>
            
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-[#4ade80]/10 blur-[100px] rounded-full"></div>
            <div className="relative bg-[#161b22] rounded-[3rem] p-4 shadow-2xl border border-gray-800">
               <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" 
                alt="Dashboard Preview" 
                className="rounded-[2rem] opacity-80"
               />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-[#0d1117] border-y border-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-16 text-white">Everything you need to <br/>Master your Money</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <FeatureCard 
              title="Smart Analytics"
              desc="Visualize your spending habits with interactive charts and deep-dive reports."
            />
            <FeatureCard 
              title="Category Management"
              desc="Organize expenses into custom categories to see exactly where your money goes."
            />
            <FeatureCard 
              title="Mobile Friendly"
              desc="Track your expenses on the go with a seamless mobile web experience."
            />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-6 bg-[#0d1117]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-16 text-white uppercase tracking-tighter">3 Simple Steps to Freedom</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <Step number="1" title="Signup/Login" desc="Create your secure account in seconds." />
            <Step number="2" title="Add Expenses" desc="Log your daily spends with just a few clicks." />
            <Step number="3" title="Save Money" desc="Analyze reports and hit your savings goals." />
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-[#4ade80] rounded-[3.5rem] p-12 text-center text-black relative overflow-hidden shadow-[0_20px_50px_rgba(74,222,128,0.15)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[80px] rounded-full"></div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter">Start Tracking Your <br/>Expenses Today</h2>
          <p className="text-black/70 mb-10 text-lg font-bold">Join thousands of users managing their finances smarter.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 px-10 py-5 bg-black text-[#4ade80] rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
            Get Started Free
          </Link>
        </div>
      </section>

      <footer className="bg-[#0d1117] border-t border-gray-800 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6 text-[#4ade80] font-black text-2xl tracking-tighter">
              Trackify.
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed font-medium">
              Making financial management simple, visual, and effective for everyone.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Product</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              <li><a href="#features" className="hover:text-[#4ade80]">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-[#4ade80]">How it Works</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Legal</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              <li><a href="#" className="hover:text-[#4ade80]">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#4ade80]">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">© 2026 Trackify. All rights reserved.</p>
          
          <div className="flex gap-6 text-gray-500">
            
            <a href="#" className="hover:text-[#4ade80] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, desc }) => (
  <div className="bg-[#161b22] p-10 rounded-[3rem] border border-gray-800 hover:border-[#4ade80]/30 hover:shadow-2xl hover:shadow-[#4ade80]/5 transition-all group">
    <div className="w-12 h-12 bg-[#4ade80]/10 rounded-xl mb-6 group-hover:scale-110 transition-transform flex items-center justify-center">
        <div className="w-4 h-4 bg-[#4ade80] rounded-full shadow-[0_0_10px_#4ade80]"></div>
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-gray-500 leading-relaxed text-sm font-medium">{desc}</p>
  </div>
);

const Step = ({ number, title, desc }) => (
  <div className="flex-1 group">
    <div className="w-16 h-16 bg-[#161b22] border-2 border-dashed border-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black text-[#4ade80] group-hover:bg-[#4ade80] group-hover:text-black group-hover:border-solid transition-all shadow-[0_0_20px_rgba(74,222,128,0.05)]">
      {number}
    </div>
    <h4 className="text-lg font-bold mb-2 text-white">{title}</h4>
    <p className="text-gray-500 text-sm max-w-[200px] mx-auto font-medium">{desc}</p>
  </div>
);

export default Landing;