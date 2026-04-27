import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 🟢 Added useNavigate
// 🟢 Firebase imports
import { db, auth } from '../firebase/config'; // 🟢 Added auth
import { collection, onSnapshot, query, orderBy, onAuthStateChanged } from 'firebase/firestore';

const Analytics = () => {
  const navigate = useNavigate(); // 🟢 Hook initialize kiya
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({
    totalSpent: 0,
    avgDaily: 0,
    topCategory: 'N/A',
    categoryData: {}
  });

  // 🟢 Logout Functionality
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/'); // Logout ke baad landing page par redirect
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // 🟣 Firebase se data fetch karna aur calculations
  useEffect(() => {
    // 🟢 Safety Check: Agar user login nahi hai to redirect karein
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/');
      }
    });

    const q = query(collection(db, "expenses"), orderBy("date", "desc"));
    
    const unsubscribeData = onSnapshot(q, (snapshot) => {
      let total = 0;
      const catMap = {};
      const items = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const amount = Number(data.amount || 0);
        total += amount;
        
        // Category grouping
        catMap[data.category] = (catMap[data.category] || 0) + amount;
        items.push({ id: doc.id, ...data });
      });

      // Top Category nikalna
      const topCat = Object.keys(catMap).length > 0 
        ? Object.keys(catMap).reduce((a, b) => catMap[a] > catMap[b] ? a : b) 
        : 'N/A';

      setExpenses(items);
      setStats({
        totalSpent: total,
        avgDaily: (total / 30).toFixed(0),
        topCategory: topCat,
        categoryData: catMap
      });
      
      setIsLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeData();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans selection:bg-[#4ade80] selection:text-black">
      
      <nav className="fixed top-0 w-full z-50 bg-[#0d1117]/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#4ade80] rounded flex items-center justify-center">
              <span className="text-black font-black text-[10px]">T.</span>
            </div>
            <span className="text-lg font-black tracking-tighter text-[#4ade80]">Trackify.</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-400">
            <Link to="/dashboard" className="hover:text-white transition-colors">Overview</Link>
            <Link to="/expenses" className="hover:text-white transition-colors">Expenses</Link>
            <Link to="/analytics" className="text-[#4ade80]">Analytics</Link>
            <Link to="/categories" className="hover:text-white transition-colors">Categories</Link>
            <Link to="/settings" className="hover:text-white transition-colors">Settings</Link>
          </div>
          {/* 🟢 Functional Logout Button */}
          <button 
            onClick={handleLogout} 
            className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Analytics</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <InsightCard label="Total Spent" value={isLoading ? "..." : `Rs. ${stats.totalSpent}`} icon="💰" loading={isLoading} />
          <InsightCard label="Avg Daily Spend" value={isLoading ? "..." : `Rs. ${stats.avgDaily}`} icon="📊" loading={isLoading} />
          <InsightCard label="Savings" value={isLoading ? "..." : "Rs. 0"} icon="📉" loading={isLoading} />
          <InsightCard label="Top Category" value={isLoading ? "..." : stats.topCategory} icon="🔝" loading={isLoading} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-[#161b22] border border-gray-800 rounded-[2.5rem] p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8 self-start">Category Distribution</h3>
            
            {isLoading ? (
              <div className="w-48 h-48 rounded-full border-8 border-gray-800 border-t-[#4ade80] animate-spin"></div>
            ) : Object.keys(stats.categoryData).length > 0 ? (
              <>
                <div className="relative w-48 h-48 border-[12px] border-gray-800 rounded-full flex items-center justify-center">
                   <div className="absolute inset-0 border-[12px] border-[#4ade80]/40 rounded-full shadow-[0_0_20px_rgba(74,222,128,0.1)]"></div>
                   <div className="text-[10px] font-black uppercase text-[#4ade80] tracking-tighter text-center px-4">
                     {stats.topCategory} <br/> Dominating
                   </div>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                   {Object.keys(stats.categoryData).map((cat, i) => (
                     <LegendItem key={i} color={i % 2 === 0 ? "#4ade80" : "#2dd4bf"} label={cat} />
                   ))}
                </div>
              </>
            ) : (
              <div className="text-gray-600 font-bold uppercase text-[10px]">No Data Available</div>
            )}
          </div>

          <div className="bg-[#161b22] border border-gray-800 rounded-[2.5rem] p-8 min-h-[400px] flex flex-col">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8">Weekly Spending Trend</h3>
            <div className="flex-1 flex items-end justify-between gap-3 px-2 border-b border-gray-800 pb-2">
               {[30, 45, 25, 60, 40, 85, 50].map((h, i) => (
                 <div 
                   key={i} 
                   className="flex-1 bg-gradient-to-t from-[#4ade80]/10 to-[#4ade80]/40 rounded-t-lg transition-all duration-1000 border-t-2 border-[#4ade80]"
                   style={{ height: isLoading ? '10px' : `${h}%` }}
                 ></div>
               ))}
            </div>
            <div className="flex justify-between mt-4 px-2 text-[9px] font-black text-gray-600 uppercase tracking-tighter">
               <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-10 gap-8">
          <div className="lg:col-span-6 bg-[#161b22] border border-gray-800 rounded-[2.5rem] p-8">
             <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-8">Detailed Breakdown</h3>
             <div className="space-y-4">
                {Object.entries(stats.categoryData).length > 0 ? (
                  Object.entries(stats.categoryData).map(([cat, amt]) => (
                    <div key={cat} className="flex justify-between items-center p-4 bg-[#0d1117] rounded-2xl border border-gray-800 hover:border-[#4ade80]/30 transition-all">
                      <span className="font-bold text-sm uppercase tracking-tight">{cat}</span>
                      <span className="font-black text-[#4ade80]">Rs. {amt}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-10 text-gray-600 text-sm italic">Add transactions to see breakdown.</p>
                )}
             </div>
          </div>

          <div className="lg:col-span-4 bg-[#161b22] border border-gray-800 rounded-[2.5rem] p-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-6">Budget Health</h3>
            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <span className="text-xs font-bold text-gray-400">Total Budget Status</span>
                <span className="text-sm font-black text-[#4ade80]">{stats.totalSpent > 10000 ? 'Warning' : 'Safe'}</span>
              </div>
              <div className="w-full h-3 bg-[#0d1117] rounded-full overflow-hidden border border-gray-800">
                <div 
                  className="h-full bg-[#4ade80] rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(74,222,128,0.2)]"
                  style={{ width: `${Math.min((stats.totalSpent / 20000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="p-5 bg-[#0d1117] rounded-3xl border border-gray-800">
               <h4 className="text-[10px] font-black text-[#4ade80] uppercase tracking-widest mb-2">Smart Tip 💡</h4>
               <p className="text-xs text-gray-500 leading-relaxed font-medium">
                 {stats.totalSpent > 0 
                   ? `Your top spending is on ${stats.topCategory}. Try to limit this category next week to save more!` 
                   : "Regular tracking helps identify if you're overspending on weekends!"}
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// ... Sub-components remain the same
const InsightCard = ({ label, value, icon }) => (
  <div className="bg-[#161b22] border border-gray-800 p-6 rounded-[2rem] hover:border-[#4ade80]/20 transition-all group relative overflow-hidden">
    <div className="flex items-center justify-between mb-4">
      <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{label}</span>
      <span className="text-lg opacity-50 group-hover:opacity-100 transition-opacity">{icon}</span>
    </div>
    <h2 className="text-2xl font-black text-white">{value}</h2>
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{label}</span>
  </div>
);

export default Analytics;