import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { db, auth } from '../firebase/config'; 
import { collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';

const Dashboard = () => {
  const navigate = useNavigate(); 
  const [user, setUser] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [budgetLimit, setBudgetLimit] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentDate = "April 2026";

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/'); 
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/'); 
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchBudget = async () => {
      const docRef = doc(db, "settings", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBudgetLimit(Number(docSnap.data().monthlyLimit || 0));
      }
    };
    fetchBudget();

    const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));
    const unsubscribeExpenses = onSnapshot(q, (snapshot) => {
      let total = 0;
      const expensesArr = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        total += Number(data.amount || 0);
        expensesArr.push({ id: doc.id, ...data });
      });

      setTotalSpent(total);
      setRecentExpenses(expensesArr.slice(0, 3));
      setLoading(false);
    });

    return () => unsubscribeExpenses();
  }, [user]);

  const remainingBudget = budgetLimit - totalSpent;
  const usedPercentage = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;

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
            <Link to="/dashboard" className="text-[#4ade80]">Overview</Link>
            <Link to="/expenses" className="hover:text-white transition-colors">Expenses</Link>
            <Link to="/analytics" className="hover:text-white transition-colors">Analytics</Link>
            <Link to="/categories" className="hover:text-white transition-colors">Categories</Link>
            <Link to="/settings" className="hover:text-white transition-colors">Settings</Link>
          </div>
          
          <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest">
            Logout
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Manage your Finances! </h1>
            <p className="text-gray-500 font-medium">{currentDate}</p>
          </div>
          <Link to="/expenses" className="bg-[#4ade80] text-black px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-[#4ade80]/10 flex items-center justify-center gap-2 uppercase tracking-tighter">
            + Add Expense
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <SummaryCard label="Total Spent" value={`Rs. ${totalSpent}`} subtext="This Month" color="#4ade80" />
          <SummaryCard 
            label="Remaining Budget" 
            value={`Rs. ${remainingBudget}`} 
            subtext={`${usedPercentage.toFixed(0)}% Used`} 
            color={remainingBudget < 0 ? "#ef4444" : "#3dbd6d"} 
          />
          <SummaryCard label="Budget Limit" value={`Rs. ${budgetLimit}`} subtext="From Settings" color="#2dd4bf" />
          <SummaryCard label="Daily Avg" value={`Rs. ${(totalSpent / 30).toFixed(0)}`} subtext="Est. for month" color="#4ade80" />
        </div>

        <div className="grid lg:grid-cols-10 gap-8 mb-10">
          <div className="lg:col-span-6 bg-[#161b22] border border-gray-800 rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-xl uppercase tracking-tighter">Recent Expenses</h3>
              <Link to="/expenses" className="text-[#4ade80] text-xs font-black uppercase tracking-widest hover:underline">View All</Link>
            </div>
            
            {loading ? (
              <div className="py-12 text-center text-gray-600 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Cloud...</div>
            ) : recentExpenses.length > 0 ? (
              <div className="space-y-4">
                {recentExpenses.map((exp) => (
                  <div key={exp.id} className="flex items-center justify-between p-4 bg-[#0d1117] border border-gray-800 rounded-2xl">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-lg">💰</div>
                       <div>
                          <p className="font-black text-sm uppercase tracking-tight">{exp.category}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">{exp.date}</p>
                       </div>
                    </div>
                    <p className="font-black text-[#4ade80]">Rs. {exp.amount}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                  <span className="text-2xl">☕</span>
                </div>
                <p className="text-gray-500 font-medium">No expenses yet — add your first one</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-[#161b22] border border-gray-800 rounded-[2.5rem] p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-xl uppercase tracking-tighter">Analytics</h3>
              <Link to="/analytics" className="text-[#4ade80] text-xs font-black uppercase tracking-widest hover:underline">Details</Link>
            </div>
            <div className="flex-1 flex items-center justify-center relative py-10">
              <div 
                className="w-32 h-32 rounded-full border-4 border-gray-800 transition-all duration-1000"
                style={{ 
                  borderTopColor: '#4ade80',
                  transform: `rotate(${usedPercentage * 3.6}deg)`
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                {usedPercentage.toFixed(0)}% Used
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-[#161b22] border border-gray-800 rounded-[2.5rem] p-8">
              <h3 className="font-black text-xl uppercase tracking-tighter mb-6">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-4">
                <Link to="/categories"><ActionButton label="Categories" icon="🗂" /></Link>
                <Link to="/analytics"><ActionButton label="Reports" icon="📊" /></Link>
                <Link to="/settings"><ActionButton label="Settings" icon="⚙️" /></Link>
              </div>
          </div>

          <div className="bg-[#161b22] border border-gray-800 rounded-[2.5rem] p-8 flex flex-col justify-center">
            <div className="flex justify-between items-end mb-4">
              <h3 className="font-black text-xl uppercase tracking-tighter">Monthly Limit Progress</h3>
              <span className="text-[#4ade80] font-black text-sm">{usedPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
              <div 
                className={`h-full transition-all duration-1000 ${usedPercentage > 90 ? 'bg-red-500' : 'bg-[#4ade80]'}`} 
                style={{ width: `${Math.min(usedPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SummaryCard = ({ label, value, subtext, color }) => (
  <div className="bg-[#161b22] border border-gray-800 p-6 rounded-[2rem] hover:border-gray-700 transition-all">
    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
    <h2 className="text-2xl font-black mb-1" style={{ color: color }}>{value}</h2>
    <p className="text-gray-600 text-[10px] font-bold uppercase">{subtext}</p>
  </div>
);

const ActionButton = ({ label, icon }) => (
  <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-[#0d1117] border border-gray-800 hover:border-[#4ade80]/40 hover:scale-105 transition-all group cursor-pointer">
    <span className="text-2xl mb-2 grayscale group-hover:grayscale-0 transition-all">{icon}</span>
    <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter group-hover:text-white">{label}</span>
  </div>
);

export default Dashboard;