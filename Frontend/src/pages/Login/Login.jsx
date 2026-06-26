import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isValid = firstName.trim().length > 0 && email.trim().length > 0 && password.length >= 8;

    const handleLogin = (e) => {
        e.preventDefault();
        if (isValid) {
            const from = location.state?.from || '/';
            navigate(from);
        }
    };

    return (
        <div className="min-h-screen bg-background dark:bg-[#00111F] flex items-center justify-center p-6 text-foreground relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-[radial-gradient(circle,rgba(0,150,255,0.05),transparent_60%)] pointer-events-none -translate-x-1/2" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(135,206,235,0.04),transparent_60%)] pointer-events-none translate-x-1/2" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-foreground/5 backdrop-blur-md border border-foreground/10 rounded-3xl p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative z-10"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-foreground mb-3">Welcome!</h1>
                    <p className="text-[#0096FF] dark:text-[#87CEEB] text-sm font-medium tracking-wide uppercase">
                        Enter your credentials
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* First Name Field */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground/60 uppercase tracking-widest pl-1 block">
                            First Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full bg-foreground/5 dark:bg-[#001726]/50 border border-foreground/15 rounded-xl px-5 py-4 text-foreground placeholder-foreground/30 focus:outline-none focus:border-[#0096FF] focus:bg-foreground/10 transition-all duration-300"
                        />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground/60 uppercase tracking-widest pl-1 block">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-foreground/5 dark:bg-[#001726]/50 border border-foreground/15 rounded-xl px-5 py-4 text-foreground placeholder-foreground/30 focus:outline-none focus:border-[#0096FF] focus:bg-foreground/10 transition-all duration-300"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground/60 uppercase tracking-widest pl-1 block">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-foreground/5 dark:bg-[#001726]/50 border border-foreground/15 rounded-xl px-5 py-4 text-foreground placeholder-foreground/30 focus:outline-none focus:border-[#0096FF] focus:bg-foreground/10 transition-all duration-300 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <p className={`text-xs pl-1 mt-1 transition-colors ${password.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-foreground/40'}`}>
                            Must be at least 8 characters long.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={!isValid}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-500 flex items-center justify-center ${
                                isValid
                                    ? 'bg-[#0096FF] text-white shadow-[0_0_20px_rgba(0,150,255,0.4)] hover:bg-[#0080ff] hover:shadow-[0_0_25px_rgba(0,150,255,0.6)] cursor-pointer translate-y-0'
                                    : 'bg-foreground/5 text-foreground/30 cursor-not-allowed border border-foreground/10'
                            }`}
                        >
                            Login
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
