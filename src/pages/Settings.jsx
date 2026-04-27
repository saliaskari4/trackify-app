import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { updateProfile, onAuthStateChanged } from 'firebase/auth';

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || '');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || '');
      } else {
        navigate('/'); 
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchSettings = async () => {
      if (user?.uid) {
        try {
          const docRef = doc(db, "settings", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setBudgetLimit(docSnap.data().monthlyLimit);
          }
        } catch (error) {
          console.error("Error fetching settings:", error);
        }
      }
    };
    fetchSettings();
  }, [user]);

  const saveSettings = async () => {
    if (!budgetLimit) return alert("Please enter a budget limit");
    setIsSaving(true);
    try {
    
      if (displayName !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName });
      }

      
      await setDoc(doc(db, "settings", user.uid), {
        monthlyLimit: budgetLimit,
        updatedAt: new Date()
      }, { merge: true });

      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to update settings.");
    }
    setIsSaving(false);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("Logged out");
      navigate('/', { replace: true }); 
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans">
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
            <Link to="/analytics" className="hover:text-white transition-colors">Analytics</Link>
            <Link to="/categories" className="hover:text-white transition-colors">Categories</Link>
            <Link to="/settings" className="text-[#4ade80]">Settings</Link>
          </div>

          <button 
            onClick={handleLogout} 
            className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6 max-w-3xl mx-auto">
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-12">Settings</h1>

        <div className="space-y-8">
          
          <section className="bg-[#161b22] border border-gray-800 rounded-[2.5rem] p-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#4ade80] mb-6">Account Profile</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4ade80] to-[#2dd4bf] rounded-3xl flex items-center justify-center text-3xl font-black text-black shadow-lg shadow-[#4ade80]/20">
                {displayName ? displayName[0].toUpperCase() : 'U'}
              </div>
              
              <div className="flex-1 w-full space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-2 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-[#0d1117] border border-gray-800 rounded-2xl px-5 py-3 focus:border-[#4ade80] outline-none text-sm transition-all font-bold" 
                  />
                </div>
                <p className="text-gray-500 text-[10px] ml-1 uppercase font-bold">{user?.email}</p>
              </div>
            </div>
          </section>

          <section className="bg-[#161b22] border border-gray-800 rounded-[2.5rem] p-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#4ade80] mb-8">Budget</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-3 ml-1">Monthly Budget (Rs.)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                    className="w-full bg-[#0d1117] border border-gray-800 rounded-2xl px-5 py-4 focus:border-[#4ade80] outline-none text-sm transition-all font-bold" 
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-700 uppercase tracking-widest">PKR</div>
                </div>
              </div>

              <button 
                onClick={saveSettings}
                disabled={isSaving}
                className="w-full py-4 bg-[#4ade80] text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
              >
                {isSaving ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </section>

          <section className="bg-[#161b22]/50 border border-red-900/20 rounded-[2.5rem] p-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-red-500 mb-6">Danger Zone</h3>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Permanent data wipe.</p>
              <button className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all">
                Delete Account
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;