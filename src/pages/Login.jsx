import { useState, useEffect } from "react";
import { auth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid Email or Password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] p-6 text-white font-sans relative overflow-hidden">
      
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#4ade80] opacity-[0.03] blur-[120px] rounded-full"></div>

      <div className="bg-[#161b22] p-12 rounded-[3.5rem] shadow-2xl w-full max-w-md border border-gray-800 relative z-10">
        <div className="text-center mb-12">
          <div className="text-5xl font-black text-[#4ade80] mb-6 tracking-tighter">Trackify.</div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
          
        </div>
        
        {error && (
          <div className="bg-red-900/10 border border-red-500/30 text-red-400 p-4 rounded-2xl mb-8 text-center text-xs font-bold uppercase">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
          
          <input type="text" style={{ display: "none" }} />
          <input type="password" style={{ display: "none" }} />

          <div>
            <input 
              type="email" 
              name="user_email_unique" 
              autoComplete="new-password" 
              value={email}
              placeholder="Email Address" 
              className="w-full p-4 bg-[#0d1117] border border-gray-800 rounded-2xl focus:ring-2 focus:ring-[#4ade80] outline-none transition-all placeholder-gray-800 text-white"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <input 
              type="password" 
              name="user_password_unique" 
              autoComplete="new-password"
              value={password}
              placeholder="Password" 
              className="w-full p-4 bg-[#0d1117] border border-gray-800 rounded-2xl focus:ring-2 focus:ring-[#4ade80] outline-none transition-all placeholder-gray-800 text-white"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full bg-[#4ade80] text-black p-5 rounded-2xl font-black shadow-[0_10px_25px_rgba(74,222,128,0.1)] hover:bg-[#3dbd6d] transition-all transform active:scale-95 uppercase tracking-widest text-sm mt-4">
            Sign In
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/signup" className="text-[#4ade80] font-bold hover:brightness-125 transition-all">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;