import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { db, auth } from "../firebase/config";
import { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp, where, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const Expenses = () => {
  const navigate = useNavigate(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
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

    const q = query(
      collection(db, "expenses"), 
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      setExpenses(items);
      setLoading(false);
    }, (error) => {
      console.error("Snapshot error:", error);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, [user]);

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login first");
    
    try {
      await addDoc(collection(db, "expenses"), {
        userId: user.uid,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        notes: formData.notes,
        createdAt: serverTimestamp()
      });

      setIsModalOpen(false);
      setFormData({ amount: '', category: '', date: new Date().toISOString().split('T')[0], notes: '' });
    } catch (error) {
      console.error("Error saving expense: ", error);
      alert("Failed to save. Try again.");
    }
  };

  const deleteExpense = async (id) => {
    if(window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteDoc(doc(db, "expenses", id));
      } catch (error) {
        console.error("Error deleting: ", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans selection:bg-[#4ade80] selection:text-black">
      
      {/* Navbar */}
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
            <Link to="/expenses" className="text-[#4ade80]">Expenses</Link>
            <Link to="/analytics" className="hover:text-white transition-colors">Analytics</Link>
            <Link to="/categories" className="hover:text-white transition-colors">Categories</Link>
            <Link to="/settings" className="hover:text-white transition-colors">Settings</Link>
          </div>
          
          <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest">
            Logout
          </button>
        </div>
      </nav>

      <main className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Expenses</h1>
            
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#4ade80] text-black px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-[#4ade80]/10 uppercase"
          >
            + Add Expense
          </button>
        </div>

        <div className="bg-[#161b22] border border-gray-800 rounded-[2.5rem] overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-gray-500 font-bold animate-pulse uppercase text-xs tracking-widest">Syncing with Cloud...</div>
          ) : expenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-800/20 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <th className="px-8 py-5">Category</th>
                    <th className="px-8 py-5">Amount</th>
                    <th className="px-8 py-5">Date</th>
                    <th className="px-8 py-5">Notes</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {expenses.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-800/10 transition-colors group">
                      <td className="px-8 py-5 font-bold">{item.category}</td>
                      <td className="px-8 py-5 text-[#4ade80] font-black italic">Rs. {item.amount}</td>
                      <td className="px-8 py-5 text-gray-400 text-sm">{item.date}</td>
                      <td className="px-8 py-5 text-gray-500 text-sm">{item.notes || "-"}</td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => deleteExpense(item.id)}
                          className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-[#0d1117] rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-800 text-3xl">💸</div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tighter">No data in Cloud</h3>
              <p className="text-gray-500 text-sm">Add your first expense to sync with Firebase.</p>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/60">
          <form onSubmit={handleSaveExpense} className="bg-[#161b22] border border-gray-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-200">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 text-[#4ade80]">Add New Expense</h2>
            
            <div className="space-y-4">
              <input 
                required type="number" placeholder="Amount (Rs.)" 
                className="w-full bg-[#0d1117] border border-gray-800 rounded-2xl px-5 py-4 outline-none focus:border-[#4ade80] font-bold"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
              <select 
                required className="w-full bg-[#0d1117] border border-gray-800 rounded-2xl px-5 py-4 outline-none focus:border-[#4ade80] text-gray-400 font-bold"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Health">Health</option>
                <option value="Shopping">Shopping</option>
                <option value="Rent">Rent</option>
                <option value="Entertainment">Entertainment</option>
              </select>
              <input 
                required type="date" 
                className="w-full bg-[#0d1117] border border-gray-800 rounded-2xl px-5 py-4 outline-none focus:border-[#4ade80] text-gray-400"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
              <textarea 
                placeholder="Notes (Optional)" 
                className="w-full bg-[#0d1117] border border-gray-800 rounded-2xl px-5 py-4 outline-none focus:border-[#4ade80] text-sm"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>

            <div className="flex gap-4 mt-10">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl font-black text-xs uppercase bg-gray-800 hover:bg-gray-700">Cancel</button>
              <button type="submit" className="flex-1 py-4 rounded-2xl font-black text-xs uppercase bg-[#4ade80] text-black hover:scale-105 transition-all shadow-lg shadow-[#4ade80]/20">Save to Cloud</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Expenses;