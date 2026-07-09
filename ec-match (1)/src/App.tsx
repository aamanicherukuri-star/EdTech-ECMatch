/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import { useState, useEffect } from 'react';
import { auth, db, signInWithGoogle, logout } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { Dashboard } from './components/dashboard/Dashboard';
import { OpportunityFeed } from './components/opportunities/OpportunityFeed';
import { PersonalizationPage } from './components/personalization/PersonalizationPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { Button } from './components/ui/button';
import { 
  LogOut, 
  GraduationCap, 
  LayoutDashboard, 
  Sparkles, 
  Settings, 
  User as UserIcon, 
  Moon, 
  Sun, 
  ChevronLeft,
  MessageCircleQuestion,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from './types';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import LandingPage from './components/LandingPage';

type View = 'onboarding' | 'feed' | 'dashboard' | 'personalize' | 'settings' | 'profile';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>('feed');
  const [viewHistory, setViewHistory] = useState<View[]>(['feed']);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPersonalizePopup, setShowPersonalizePopup] = useState(false);
  const [pendingStartTrial, setPendingStartTrial] = useState(false);

  useEffect(() => {
    // Dark mode initialization
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const profileDoc = await getDoc(doc(db, 'users', user.uid));
          if (profileDoc.exists()) {
            const profileData = profileDoc.data() as UserProfile;
            setUserProfile(profileData);
            setOnboardingCompleted(profileData.onboardingCompleted);
            
            // Apply theme color
            if (profileData.themeColor) {
              document.documentElement.style.setProperty('--primary', profileData.themeColor);
            }

            // If user clicked "Start Free Trial" on the landing page, take them to the dashboard.
            if (pendingStartTrial) {
              navigateTo('dashboard');
              setPendingStartTrial(false);
            } else if (profileData.onboardingCompleted) {
              navigateTo('feed');
            } else {
              navigateTo('onboarding');
            }
          } else {
            // New user - go to onboarding unless they came from Start Free Trial
            if (pendingStartTrial) {
              navigateTo('dashboard');
              setPendingStartTrial(false);
            } else {
              setOnboardingCompleted(false);
              navigateTo('onboarding');
            }
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
      setLoading(false);
      clearTimeout(timeout);
    });

    // 15 minute personalization popup
    const popupTimer = setTimeout(() => {
      if (currentView === 'feed') {
        setShowPersonalizePopup(true);
      }
    }, 15 * 60 * 1000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
      clearTimeout(popupTimer);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const navigateTo = (view: View) => {
    setCurrentView(view);
    setViewHistory(prev => [...prev, view]);
  };

  const goBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop();
      const lastView = newHistory[newHistory.length - 1];
      setCurrentView(lastView);
      setViewHistory(newHistory);
    }
  };

  const handleOnboardingComplete = async (data: any) => {
    if (!user) return;

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      age: data.age,
      gender: data.gender,
      academicBaseline: data.academic,
      activePortfolio: data.experience,
      holisticIdentity: data.holistic,
      onboardingCompleted: true,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', user.uid), profile);
      setUserProfile(profile);
      setOnboardingCompleted(true);
      navigateTo('feed');
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const skipOnboarding = () => {
    setOnboardingCompleted(true);
    navigateTo('feed');
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <GraduationCap className="w-12 h-12 text-primary opacity-20" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <LandingPage
        onStartTrial={() => {
          setPendingStartTrial(true);
          signInWithGoogle();
        }}
        onSignIn={() => signInWithGoogle()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {viewHistory.length > 1 && (
              <Button variant="ghost" size="icon" onClick={goBack} className="rounded-full">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('feed')}>
              <GraduationCap className="w-6 h-6 text-primary" />
              <span className="text-xl font-serif font-medium">EC Match</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => navigateTo('feed')}
              className={`text-sm font-medium transition-colors ${currentView === 'feed' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Discover
            </button>
            <button 
              onClick={() => navigateTo('dashboard')}
              className={`text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Dashboard
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full text-foreground">
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigateTo('settings')} className="rounded-full text-foreground">
              <Settings className="w-4 h-4" />
            </Button>
            <div 
              className="w-8 h-8 rounded-full bg-muted overflow-hidden border border-border cursor-pointer"
              onClick={() => navigateTo('profile')}
            >
              <img src={user.photoURL || ''} alt={user.displayName || ''} referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'onboarding' && !onboardingCompleted ? (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex justify-end mb-4">
                <Button variant="ghost" onClick={skipOnboarding} className="text-foreground">Skip for now</Button>
              </div>
              <OnboardingFlow onComplete={handleOnboardingComplete} />
            </motion.div>
          ) : currentView === 'feed' ? (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <OpportunityFeed profile={userProfile || undefined} />
            </motion.div>
          ) : currentView === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Dashboard />
            </motion.div>
          ) : currentView === 'personalize' ? (
            <motion.div
              key="personalize"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <PersonalizationPage profile={userProfile || undefined} />
            </motion.div>
          ) : currentView === 'settings' ? (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SettingsPage 
                profile={userProfile} 
                onLogout={logout} 
                onUpdateProfile={(data) => {
                  if (user) {
                    const newProfile = { ...userProfile, ...data } as UserProfile;
                    setUserProfile(newProfile);
                    setDoc(doc(db, 'users', user.uid), newProfile, { merge: true });
                  }
                }} 
              />
            </motion.div>
          ) : currentView === 'profile' ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ProfilePage profile={userProfile} onUpdate={setUserProfile} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Floating Personalization Button */}
      {currentView === 'feed' && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
          <AnimatePresence>
            {showPersonalizePopup && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                className="bg-primary text-primary-foreground p-4 rounded-2xl shadow-xl max-w-xs mb-2"
              >
                <p className="text-sm font-medium">Confused what to choose? Let AI help you personalize your journey!</p>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="mt-3 w-full rounded-full"
                  onClick={() => {
                    navigateTo('personalize');
                    setShowPersonalizePopup(false);
                  }}
                >
                  Personalize Now
                </Button>
                <button 
                  className="absolute -top-2 -right-2 bg-muted text-muted-foreground rounded-full p-1"
                  onClick={() => setShowPersonalizePopup(false)}
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            size="lg"
            className="rounded-full shadow-2xl h-14 px-6 gap-2 bg-foreground text-background hover:bg-foreground/90"
            onClick={() => navigateTo('personalize')}
          >
            <MessageCircleQuestion className="w-5 h-5" />
            <span className="font-medium">Confused? Personalize!</span>
          </Button>
        </div>
      )}
    </div>
  );
}
