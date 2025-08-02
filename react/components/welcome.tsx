import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FiMic } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

interface WelcomeProps {
  disabled: boolean;
  startButtonText: string;
  onStartCall: () => void;
}

export const Welcome = ({
  disabled,
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeProps) => {
  return (
    <div
      ref={ref}
      inert={disabled}
      className="fixed inset-0 z-10 mx-auto flex h-svh flex-col items-center justify-center text-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),transparent_50%)]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + i * 0.1,
              repeat: Infinity,
              delay: i * 0.1,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mb-6 mx-auto"
            animate={{
              boxShadow: [
                '0 0 20px rgba(6, 182, 212, 0.3)',
                '0 0 40px rgba(6, 182, 212, 0.6)',
                '0 0 20px rgba(6, 182, 212, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FiMic size={48} color="white" />
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            LokSeva AI
          </motion.h1>

          <motion.p
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Your intelligent voice assistant for Indian Government services.
            Experience seamless interaction with AI-powered assistance.
          </motion.p>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <Button
            variant="glow"
            size="xl"
            onClick={onStartCall}
            className="group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <HiSparkles size={20} />
              {startButtonText}
              <FiMic size={20} />
            </span>
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16"
        >
          {[
            { icon: '🎤', title: 'Voice Powered', desc: 'Natural voice interaction' },
            { icon: '🛡️', title: 'Secure', desc: 'Enterprise-grade security' },
            { icon: '⚡', title: 'Fast', desc: 'Instant responses' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center"
        >
          <p className="text-gray-400 text-sm">
            Developed by MAKSQUARE © 2025 |{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.livekit.io/agents/start/voice-ai/"
              className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
            >
              AI Manthan
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
