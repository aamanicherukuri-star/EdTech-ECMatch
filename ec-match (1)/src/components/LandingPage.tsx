import { FormEvent, useEffect, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

type Props = {
  onStartTrial?: () => void;
  onSignIn?: () => void;
};

type PricingPlan = {
    title: string;
    price: string;
    suffix: string;
    features: string[];
    buttonLabel: string;
    featured?: boolean;
    badge?: string;
};

const pricingPlans: PricingPlan[] = [
    {
        title: 'Basic',
        price: 'x',
        suffix: '/mo',
        features: ['Basic Profile Matching', 'Weekly Newsletter'],
        buttonLabel: 'Get Started',
    },
    {
        title: 'Pro',
        price: 'x',
        suffix: '/mo',
        features: ['Everything in Basic', 'Verified Opportunities', 'Custom Study Schedules'],
        buttonLabel: 'Start Free Trial',
        featured: true,
        badge: 'Popular',
    },
    {
        title: 'Elite',
        price: 'x',
        suffix: '/mo',
        features: ['Everything in Pro', '1-on-1 Mentorship', 'Instant Examiner Responses'],
        buttonLabel: 'Contact Us',
    },
];

const faqItems = [
    {
        question: 'How does the matching algorithm work?',
        answer: 'Our proprietary AI analyzes your academic baseline, current portfolio, and holistic identity to find high-impact extracurriculars that perfectly align with your long-term goals and admission profile.',
    },
    {
        question: 'Are the opportunities verified?',
        answer: 'Yes, absolutely. Every single opportunity on our platform is manually verified by our team of experts to ensure it provides legitimate value, recognition, and impact.',
    },
    {
        question: 'Do I have to pay immediately?',
        answer: 'No! You can start with our 7-day free trial to explore all premium features. You can cancel anytime before the trial ends without being charged.',
    },
    {
        question: 'Can I use EC Match on mobile?',
        answer: 'Yes, our platform is fully responsive and designed to work seamlessly on all your devices, so you can track your progress on the go.',
    },
];

const staggerClasses = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4'];

export default function LandingPage({ onStartTrial, onSignIn }: Props = {}) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const navigateToDashboard = () => {
        if (onStartTrial) {
            onStartTrial();
            return;
        }
        window.location.href = '/dashboard';
    };
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

    const handleWaitlistSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!email) return;
        setStatus('submitting');
        setMessage('Joining waitlist…');

        try {
            await addDoc(collection(db, 'waitlist'), {
                email: email.trim().toLowerCase(),
                createdAt: serverTimestamp(),
            });
            setStatus('success');
            setMessage('Thanks! You are on the waitlist.');
            setEmail('');
        } catch (error) {
            console.error('Waitlist submission failed:', error);
            try {
                localStorage.setItem('waitlistEmail', email.trim().toLowerCase());
                setStatus('success');
                setMessage('Saved locally. You are on the waitlist once the network reconnects.');
                setEmail('');
                return;
            } catch (storageError) {
                console.error('Local waitlist save failed:', storageError);
            }
            setStatus('error');
            setMessage('Unable to join the waitlist right now. Please try again.');
        }
    };

  return (
    <div className="font-sans antialiased relative bg-[#fdfcfb] text-[#0f172a] overflow-x-hidden min-h-screen">
      

    <div className="dot-pattern" id="bg-pattern"></div>
    <div className="bg-orb orb-1"></div>
    <div className="bg-orb orb-2"></div>

    <div className="min-h-screen w-full relative flex flex-col">
        {/* Hero Section */}
        <div className="relative w-full min-h-[95vh] flex flex-col">
            
            {/* Floating Background Ornaments */}
            <div className="absolute left-[5%] md:left-[10%] top-[25%] text-slate-800/10 animate-float-1 pointer-events-none">
                <svg className="w-12 h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
            </div>
            <div className="absolute right-[5%] md:right-[15%] top-[15%] text-amber-500/30 animate-float-2 pointer-events-none">
                <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
            </div>
            <div className="absolute right-[10%] md:right-[20%] bottom-[30%] text-slate-300 animate-float-3 pointer-events-none">
                <svg className="w-12 h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M5.4 5.4a10.4 10.4 0 0 1 13.2 0"/><path d="M5.4 18.6a10.4 10.4 0 0 0 13.2 0"/><path d="M12 2v20"/><path d="M2 12h20"/></svg>
            </div>
            <div className="absolute left-[10%] md:left-[15%] bottom-[20%] text-slate-800/10 animate-float-2 pointer-events-none">
                <svg className="w-16 h-16 md:w-24 md:h-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a2 2 0 0 0-.019-3.838L12.83 4.32a2 2 0 0 0-1.66 0L2.6 7.08a2 2 0 0 0 0 3.832l8.57 3.698a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
            </div>

            {/* Floating Header */}
            <header className="relative z-10 w-full px-4 sm:px-8 lg:px-12 pt-6 fade-up flex justify-center items-center">
                {/* Left Bar: Join Waitlist */}
                <div className="bg-white/90 border border-slate-200 shadow-sm rounded-full h-16 px-6 hidden lg:flex items-center justify-center w-fit absolute left-4 sm:left-8 lg:left-12">
                    <a href="#waitlist-section" className="rounded-full bg-primary text-white hover:bg-primary/90 px-6 h-10 flex items-center justify-center uppercase text-xs font-bold tracking-wider shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition duration-200 ease-out transform">
                        Join the Waitlist
                    </a>
                </div>

                {/* Center Bar: Logo & Nav */}
                <div className="bg-white/90 border border-slate-200 shadow-sm rounded-full h-16 px-6 flex items-center gap-10 w-fit lg:-translate-x-12">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a2 2 0 0 0-.019-3.838L12.83 4.32a2 2 0 0 0-1.66 0L2.6 7.08a2 2 0 0 0 0 3.832l8.57 3.698a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="font-serif font-bold text-2xl leading-none uppercase tracking-tighter bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">EC Match</span>
                        </div>
                    </div>

                    {/* Nav Pills (Desktop) */}
                    <div className="hidden md:flex items-center gap-2">
                        <a href="#pricing" className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-primary bg-slate-100 rounded-full cursor-pointer hover:bg-slate-200 transition-colors">
                            Pricing
                        </a>
                        <a href="#wall-of-love" className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 border border-transparent rounded-full cursor-pointer hover:bg-slate-50 hover:border-slate-200 transition duration-200 ease-out">
                            Wall of Love
                        </a>
                        <a href="#faqs" className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 border border-transparent rounded-full cursor-pointer hover:bg-slate-50 hover:border-slate-200 transition duration-200 ease-out">
                            FAQs
                        </a>
                    </div>
                </div>

                {/* Right Bar: Auth Actions */}
                <div className="bg-white/90 border border-slate-200 shadow-sm rounded-full h-16 px-6 hidden lg:flex items-center justify-center gap-6 w-fit absolute right-4 sm:right-8 lg:right-12">
                    <button onClick={() => { if (onSignIn) { onSignIn(); } else { window.location.href = '/dashboard'; } }} className="text-sm font-semibold tracking-wide text-primary hover:text-primary/80 uppercase transition-colors px-2">
                        Log In
                    </button>
                    <button onClick={navigateToDashboard} className="rounded-full bg-primary text-white hover:bg-primary/90 px-6 h-10 uppercase text-xs font-bold tracking-wider shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition duration-200 ease-out transform">
                        Start Free Trial <span className="ml-2">→</span>
                    </button>
                </div>
            </header>

            {/* Hero Content */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-20 text-center max-w-5xl mx-auto w-full">
                {/* Top Badges */}
                <div className="flex flex-col items-center gap-3 mb-10 fade-up stagger-1">
                    <div className="bg-amber-400 text-amber-950 px-5 py-2 rounded-full flex items-center gap-2 shadow-md border border-amber-500/20 hover:scale-105 transition-transform cursor-default">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a2 2 0 0 0-.019-3.838L12.83 4.32a2 2 0 0 0-1.66 0L2.6 7.08a2 2 0 0 0 0 3.832l8.57 3.698a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
                        <span className="text-xs font-bold uppercase tracking-wider leading-none">Interactive 2026 Grad Club</span>
                    </div>
                </div>

                {/* Headline */}
                <div className="mb-8 relative fade-up stagger-2">
                    <h1 className="text-[3rem] sm:text-[4rem] md:text-[5.5rem] leading-[1.05] font-serif font-medium tracking-tight text-primary max-w-4xl mx-auto">
                        Premium Advisory for Extracurriculars,<br/>
                        <span className="text-primary/80 italic font-normal relative inline-block">
                            All in One Place.
                            <span className="absolute -right-8 bottom-4 text-amber-400 animate-pulse">
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                            </span>
                        </span>
                    </h1>
                </div>

                {/* Subheadline */}
                <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed mb-10 fade-up stagger-3">
                    Match your profile with verified extracurricular opportunities and instantaneous responses.
                </p>

                {/* Waitlist UI */}
                <div id="waitlist-section" className="mb-12 w-full max-w-2xl mx-auto bg-gradient-to-br from-white/95 via-white/95 to-amber-50/40 rounded-3xl border border-amber-200/30 p-8 md:p-10 shadow-xl shadow-amber-500/10 fade-up stagger-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <svg className="w-16 h-16 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div className="text-center mb-6 relative z-10">
                        <span className="text-amber-500 font-bold uppercase tracking-widest text-[10px] block mb-2">Limited Access</span>
                        <h3 className="text-2xl font-bold text-primary font-serif">Join the Waitlist</h3>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Spots are filling up fast. Secure your place for the next cohort.</p>
                    </div>
                    
                    {/* EDIT COUNTDOWN HERE */}
                    <div className="flex justify-center items-start gap-4 mb-8 relative z-10">
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-2">
                                <span className="text-2xl font-mono font-bold text-slate-800">ZZ</span>
                            </div>
                            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Days</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-300 mt-3">:</span>
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-2">
                                <span className="text-2xl font-mono font-bold text-slate-800">ZZ</span>
                            </div>
                            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Hours</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-300 mt-3">:</span>
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-2">
                                <span className="text-2xl font-mono font-bold text-slate-800">ZZ</span>
                            </div>
                            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Mins</span>
                        </div>
                    </div>
                    {/* END EDIT COUNTDOWN HERE */}
                    
                                        <form className="flex flex-col sm:flex-row gap-3 relative z-10" onSubmit={handleWaitlistSubmit}>
                                            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Enter your email address" className="flex-1 w-full px-5 h-12 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition duration-200 ease-out font-medium bg-white/90" required/>
                        <button disabled={status === 'submitting'} type="submit" className="w-full sm:w-auto sm:px-8 h-12 rounded-xl bg-primary text-white font-bold uppercase text-xs tracking-wider hover:bg-primary/90 transition duration-200 ease-out shadow-md shadow-primary/20 hover:-translate-y-0.5 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60">
                            Secure My Spot
                        </button>
                    </form>
                                        {message ? (
                                            <p className={`mt-4 text-sm font-medium ${status === 'success' ? 'text-emerald-700' : status === 'error' ? 'text-rose-600' : 'text-slate-600'}`}>
                                                {message}
                                            </p>
                                        ) : null}
                </div>

                {/* Social Proof */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 p-4 rounded-full bg-white/90 border border-slate-200 shadow-sm hover:scale-105 transition duration-200 ease-out transform fade-up stagger-4">
                    <div className="flex -space-x-3">
                        <img src="https://i.pravatar.cc/100?img=11" alt="Student" className="w-10 h-10 rounded-full border-2 border-white object-cover relative z-[4]" />
                        <img src="https://i.pravatar.cc/100?img=12" alt="Student" className="w-10 h-10 rounded-full border-2 border-white object-cover relative z-[3]" />
                        <img src="https://i.pravatar.cc/100?img=13" alt="Student" className="w-10 h-10 rounded-full border-2 border-white object-cover relative z-[2]" />
                        <img src="https://i.pravatar.cc/100?img=14" alt="Student" className="w-10 h-10 rounded-full border-2 border-white object-cover relative z-[1]" />
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 relative z-0">
                            +2k
                        </div>
                    </div>
                    <div className="flex flex-col items-center sm:items-start">
                        <div className="flex text-amber-400 gap-1 mb-1">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">From 2,400+ Students</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center fade-up stagger-4">
                    <button onClick={navigateToDashboard} className="rounded-full bg-primary hover:bg-primary/90 text-white px-8 h-14 text-sm font-bold uppercase tracking-wider w-full sm:w-auto shadow-xl shadow-primary/20 transition duration-200 ease-out transform hover:scale-105 active:scale-95 group overflow-hidden">
                        <span className="flex items-center justify-center">Get Started Free <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span></span>
                    </button>
                    <button onClick={navigateToDashboard} className="rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 h-14 text-sm font-bold uppercase tracking-wider w-full sm:w-auto shadow-sm transition duration-200 ease-out transform hover:scale-105 active:scale-95">
                        Try Practice Session
                    </button>
                </div>
            </main>
        </div>


        {/* Wall of Love Section */}
        <section id="wall-of-love" className="relative z-10 w-full max-w-7xl mx-auto px-4 py-24 border-t border-slate-200/50">
            <div className="text-center mb-16 fade-up">
                <span className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-3 block">Testimonials</span>
                <h2 className="text-4xl md:text-5xl font-serif font-medium text-primary mb-4 tracking-tight">Wall of Love</h2>
                <p className="text-slate-600 max-w-xl mx-auto text-lg">Hear from students who smashed their targets.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Testimonial 1 */}
                <div className="bg-white/90 border border-slate-200 rounded-3xl p-8 flex flex-col transition duration-300 ease-out shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 hover:rotate-1 cursor-default group relative overflow-hidden fade-up stagger-1">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <svg className="w-12 h-12 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                    </div>
                    <div className="flex text-amber-400 gap-1 mb-6 relative z-10">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    </div>
                    {/* EDIT TESTIMONIAL TEXT HERE */}
                    <p className="text-slate-700 text-lg leading-relaxed flex-1 mb-8 relative z-10">
                        "This platform completely changed my trajectory. The custom study schedules helped me land my dream internship."
                    </p>
                    {/* END EDIT TESTIMONIAL TEXT HERE */}
                    <div className="flex items-center gap-4 mt-auto relative z-10">
                        <div className="w-12 h-12 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-400">
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                        </div>
                        <div>
                            {/* EDIT NAME HERE */}
                            <div className="font-bold text-primary">Y.Y.</div>
                            {/* END EDIT NAME HERE */}
                            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">University '28</div>
                        </div>
                    </div>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-white/90 border border-slate-200 rounded-3xl p-8 flex flex-col transition duration-300 ease-out shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 hover:-rotate-1 cursor-default group relative overflow-hidden fade-up stagger-2">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <svg className="w-12 h-12 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                    </div>
                    <div className="flex text-amber-400 gap-1 mb-6 relative z-10">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    </div>
                    {/* EDIT TESTIMONIAL TEXT HERE */}
                    <p className="text-slate-700 text-lg leading-relaxed flex-1 mb-8 relative z-10">
                        "The instant responses are game-changing. I was able to iterate on my portfolio 10x faster."
                    </p>
                    {/* END EDIT TESTIMONIAL TEXT HERE */}
                    <div className="flex items-center gap-4 mt-auto relative z-10">
                        <div className="w-12 h-12 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-400">
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                        </div>
                        <div>
                            {/* EDIT NAME HERE */}
                            <div className="font-bold text-primary">Y.Y.</div>
                            {/* END EDIT NAME HERE */}
                            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">University '28</div>
                        </div>
                    </div>
                </div>

                {/* Testimonial 3 */}
                <div className="bg-white/90 border border-slate-200 rounded-3xl p-8 flex flex-col transition duration-300 ease-out shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 hover:rotate-1 cursor-default group relative overflow-hidden fade-up stagger-3">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <svg className="w-12 h-12 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                    </div>
                    <div className="flex text-amber-400 gap-1 mb-6 relative z-10">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    </div>
                    {/* EDIT TESTIMONIAL TEXT HERE */}
                    <p className="text-slate-700 text-lg leading-relaxed flex-1 mb-8 relative z-10">
                        "I didn't know where to start. The smart advisory system mapped out a plan that actually worked."
                    </p>
                    {/* END EDIT TESTIMONIAL TEXT HERE */}
                    <div className="flex items-center gap-4 mt-auto relative z-10">
                        <div className="w-12 h-12 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-400">
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                        </div>
                        <div>
                            {/* EDIT NAME HERE */}
                            <div className="font-bold text-primary">Y.Y.</div>
                            {/* END EDIT NAME HERE */}
                            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">University '28</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="relative z-10 w-full max-w-7xl mx-auto px-4 py-24 border-t border-slate-200/50">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="pricing-bg-shape bg-primary" />
                <div className="pricing-bg-shape pricing-bg-shape-secondary bg-amber-400" />
            </div>
            <div className="text-center mb-16 fade-up">
                <span className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-3 block">Pricing</span>
                <h2 className="text-4xl md:text-5xl font-serif font-medium text-primary mb-4 tracking-tight">Choose Your Plan</h2>
                <p className="text-slate-600 max-w-xl mx-auto text-lg">Invest in your future with our flexible options.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {pricingPlans.map((plan, index) => (
                    <div
                        key={plan.title}
                        className={`pricing-card pricing-card-swipe ${plan.featured ? 'pricing-card-featured bg-primary rounded-3xl shadow-xl shadow-primary/20 border border-primary overflow-hidden relative' : 'bg-white rounded-3xl border border-slate-200 shadow-sm'} fade-up ${staggerClasses[index]} transition duration-300 ease-out hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 hover:rotate-1 flex flex-col p-8`}
                    >
                        {plan.badge ? (
                            <div className="absolute top-0 right-0 bg-amber-400 text-amber-950 text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-bl-xl">
                                {plan.badge}
                            </div>
                        ) : null}
                        <h3 className={`text-xl font-bold mb-2 ${plan.featured ? 'text-white' : 'text-primary'}`}>{plan.title}</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className={`text-4xl font-bold ${plan.featured ? 'text-white' : 'text-primary'}`}>{plan.price}</span>
                            <span className={`${plan.featured ? 'text-slate-300' : 'text-slate-500'} font-medium`}>{plan.suffix}</span>
                        </div>
                        <ul className={`space-y-4 mb-8 flex-1 ${plan.featured ? 'text-slate-300' : 'text-slate-600'}`}>
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3">
                                    <svg className={`w-5 h-5 ${plan.featured ? 'text-amber-400' : 'text-amber-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={navigateToDashboard}
                            className={`${plan.featured ? 'w-full py-3 rounded-full bg-amber-400 text-amber-950 hover:bg-amber-300' : 'w-full py-3 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50'} font-bold uppercase tracking-wider transition-colors text-sm`}
                        >
                            {plan.buttonLabel}
                        </button>
                    </div>
                ))}
            </div>
        </section>

        {/* FAQs Section */}
        <section id="faqs" className="relative z-10 w-full max-w-4xl mx-auto px-4 py-24">
            <div className="text-center mb-16 fade-up">
                <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Got Questions?</span>
                <h2 className="text-4xl md:text-5xl font-serif font-medium text-primary mb-4 tracking-tight">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
                {faqItems.map((faq, index) => (
                    <details key={faq.question} className={`bg-white rounded-3xl border border-slate-200 shadow-sm transition duration-200 ease-out hover:border-slate-300 fade-up ${staggerClasses[index]} overflow-hidden group`}>
                        <summary className="w-full flex items-center justify-between p-6 text-left font-semibold text-lg text-primary outline-none cursor-pointer">
                            <span>{faq.question}</span>
                            <span className="bg-slate-100 p-2 rounded-full text-slate-500 flex-shrink-0 ml-4 group-open:bg-slate-200">
                                <svg className="w-5 h-5 faq-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </span>
                        </summary>
                        <div className="faq-answer p-6 pt-0 text-slate-600 leading-relaxed pr-8 border-t border-slate-100">
                            {faq.answer}
                        </div>
                    </details>
                ))}
            </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 w-full border-t border-slate-200 bg-white/50 mt-12 py-12">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a2 2 0 0 0-.019-3.838L12.83 4.32a2 2 0 0 0-1.66 0L2.6 7.08a2 2 0 0 0 0 3.832l8.57 3.698a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
                    </div>
                    <span className="font-serif font-bold text-lg text-primary uppercase tracking-tight">EC Match</span>
                </div>
                <div className="text-slate-500 text-sm">
                    &copy; 2026 EC Match. All rights reserved.
                </div>
                <div className="flex gap-6 text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms</a>
                </div>
            </div>
        </footer>
    </div>

    {/* Intersection Observer for Scroll Animations */}
    

    </div>
  );
}
