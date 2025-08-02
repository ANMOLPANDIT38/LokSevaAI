'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LandingPage } from '@/components/landing-page';
import { LoginPage } from '@/components/auth/login-page';
import { RegisterPage } from '@/components/auth/register-page';
import { App } from '@/components/app';
import { useAuth } from '@/lib/auth-context';
import type { AppConfig } from '@/lib/types';

type AppState = 'landing' | 'login' | 'register' | 'voice-interface';

interface MainAppProps {
  appConfig: AppConfig;
}

export function MainApp({ appConfig }: MainAppProps) {
  const [appState, setAppState] = useState<AppState>('landing');
  const { user, isLoading, login, register } = useAuth();

  // Redirect to voice interface if user is already authenticated
  useEffect(() => {
    if (user && appState !== 'voice-interface') {
      setAppState('voice-interface');
    }
  }, [user, appState]);

  const handleGetStarted = () => {
    if (user) {
      setAppState('voice-interface');
    } else {
      setAppState('login');
    }
  };

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    setAppState('voice-interface');
  };

  const handleRegister = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    await register(userData);
    setAppState('voice-interface');
  };

  const handleBackToLanding = () => {
    setAppState('landing');
  };

  const handleSwitchToLogin = () => {
    setAppState('login');
  };

  const handleSwitchToRegister = () => {
    setAppState('register');
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 border-4 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-white/70 text-lg">Loading LokSeva AI...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {appState === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage onGetStarted={handleGetStarted} />
          </motion.div>
        )}

        {appState === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <LoginPage
              onLogin={handleLogin}
              onBackToLanding={handleBackToLanding}
              onSwitchToRegister={handleSwitchToRegister}
            />
          </motion.div>
        )}

        {appState === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <RegisterPage
              onRegister={handleRegister}
              onBackToLanding={handleBackToLanding}
              onSwitchToLogin={handleSwitchToLogin}
            />
          </motion.div>
        )}

        {appState === 'voice-interface' && user && (
          <motion.div
            key="voice-interface"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <App appConfig={appConfig} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
