import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config'; 
import { collection, addDoc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';

const Categories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🍔 Food');
  const [color, setColor] = useState('#4ade80');

  useEffect(() => {
    const q = query(collection(db, "categories"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const catList = [];
      snapshot.forEach((doc) => {
        catList.push({ id: doc.id, ...doc.data() });
      });
      setCategories(catList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveCategory = async () => {
    if (!name.trim()) return alert("Please enter a category name");

    try {
      await addDoc(collection(db, "categories"), {
        name: name,
        icon: icon,
        color: color,
        createdAt: serverTimestamp()
      });
      
    
      setName('');
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

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
            <Link to="/analytics" className="hover:text-white transition-colors">Analytics</Link>
            <Link to="/categories" className="text-[#4ade80]">Categories</Link>
            <Link to="/settings" className="hover:text-white transition-colors">Settings</Link>
          </div>
          <button className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest">Logout</button>
        </div>
      </nav>

      <main className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Categories</h1>
            
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#4ade80] text-black px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-[#4ade80]/10 uppercase tracking-tighter"
          >
            + Add Category
          </button>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-[#161b22] border border-gray-800 p-6 rounded-3xl">
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Total Groups</p>
            <h3 className="text-xl font-bold">{categories.length}</h3>
          </div>
          <div className="bg-[#161b22] border border-gray-800 p-6 rounded-3xl opacity-50">
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Most Used</p>
            <h3 className="text-xl font-bold">N/A</h3>
          </div>
          <div className="bg-[#161b22] border border-gray-800 p-6 rounded-3xl opacity-50">
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Budget Coverage</p>
            <h3 className="text-xl font-bold">100%</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div key={cat.id} className="bg-[#161b22] border border-gray-800 p-6 rounded-[2.5rem] hover:border-gray-700 transition-all group">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4" 
                  style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                >
                  {cat.icon.split(' ')[0]}
                </div>
                <h3 className="font-black uppercase tracking-tight text-lg">{cat.name}</h3>
                <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest mt-1">Active Category</p>
              </div>
            ))
          ) : !loading && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-[#161b22]/30 border-2 border-dashed border-gray-800 rounded-[3rem]">
               <span className="text-3xl opacity-30 mb-4"></span>
               <h3 className="text-xl font-black uppercase tracking-tight">No categories yet</h3>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/70">
          <div className="bg-[#161b22] border border-gray-800 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">New Category</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Category Name</label>
                <input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text" 
                  placeholder="e.g. Food, Travel" 
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-2xl px-5 py-4 focus:border-[#4ade80] outline-none mt-2 text-white" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Pick Icon</label>
                  <select 
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full bg-[#0d1117] border border-gray-800 rounded-2xl px-5 py-4 outline-none mt-2 text-gray-400"
                  >
                    <option>🍔 Food</option>
                    <option>✈️ Travel</option>
                    <option>🛍️ Shopping</option>
                    <option>🎮 Fun</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Color Theme</label>
                  <div className="flex gap-2 mt-3">
                    {['#4ade80', '#3b82f6', '#a855f7', '#ef4444'].map((c) => (
                      <div 
                        key={c}
                        onClick={() => setColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-8 h-8 rounded-full cursor-pointer transition-all ${color === c ? 'ring-2 ring-white border-2 border-[#0d1117] scale-110' : 'opacity-50'}`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-800 rounded-2xl font-black text-xs uppercase">Cancel</button>
              <button onClick={handleSaveCategory} className="flex-1 py-4 bg-[#4ade80] text-black rounded-2xl font-black text-xs uppercase">Save Category</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;