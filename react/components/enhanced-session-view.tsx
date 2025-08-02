'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  type AgentState,
  type ReceivedChatMessage,
  useRoomContext,
  useVoiceAssistant,
} from '@livekit/components-react';
import { LogOut, User, Settings, Mic, MicOff } from 'lucide-react';
import { toastAlert } from '@/components/alert-toast';
import { AgentControlBar } from '@/components/livekit/agent-control-bar/agent-control-bar';
import { ChatEntry } from '@/components/livekit/chat/chat-entry';
import { ChatMessageView } from '@/components/livekit/chat/chat-message-view';
import { MediaTiles } from '@/components/livekit/media-tiles';
import { Button } from '@/components/ui/button';
import useChatAndTranscription from '@/hooks/useChatAndTranscription';
import { useDebugMode } from '@/hooks/useDebug';
import { useAuth } from '@/lib/auth-context';
import type { AppConfig } from '@/lib/types';
import { cn } from '@/lib/utils';

function isAgentAvailable(agentState: AgentState) {
  return agentState == 'listening' || agentState == 'thinking' || agentState == 'speaking';
}

interface EnhancedSessionViewProps {
  appConfig: AppConfig;
  disabled: boolean;
  sessionStarted: boolean;
}

export const EnhancedSessionView = ({
  appConfig,
  disabled,
  sessionStarted,
  ref,
}: React.ComponentProps<'div'> & EnhancedSessionViewProps) => {
  const { state: agentState } = useVoiceAssistant();
  const [chatOpen, setChatOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { messages, send } = useChatAndTranscription();
  const { user, logout } = useAuth();
  const room = useRoomContext();

  useDebugMode();

  async function handleSendMessage(message: string) {
    await send(message);
  }

  async function handleLogout() {
    await logout();
    // The MainApp component will handle redirecting to landing page
  }

  useEffect(() => {
    const onChatMessage = (message: ReceivedChatMessage) => {
      if (message.from?.identity !== 'agent') {
        toastAlert({
          title: 'New message',
          description: `${message.from?.name}: ${message.message}`,
        });
      }
    };

    room.on('chatMessage', onChatMessage);
    return () => {
      room.off('chatMessage', onChatMessage);
    };
  }, [room]);

  const { supportsChatInput, supportsVideoInput, supportsScreenShare } = appConfig;
  const capabilities = {
    supportsChatInput,
    supportsVideoInput,
    supportsScreenShare,
  };

  const getAgentStateColor = () => {
    switch (agentState) {
      case 'listening':
        return 'from-green-500 to-emerald-500';
      case 'thinking':
        return 'from-yellow-500 to-orange-500';
      case 'speaking':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getAgentStateText = () => {
    switch (agentState) {
      case 'listening':
        return 'Listening...';
      case 'thinking':
        return 'Thinking...';
      case 'speaking':
        return 'Speaking...';
      default:
        return 'Ready';
    }
  };

  return (
    <main
      ref={ref}
      inert={disabled}
      className={cn(
        'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative',
        !chatOpen && 'max-h-svh overflow-hidden'
      )}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),transparent_50%)]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6 flex justify-between items-center"
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-white font-bold text-lg">L</span>
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-white">LokSeva AI</h1>
            <p className="text-gray-300 text-sm">Government Service Assistant</p>
          </div>
        </div>

        {/* User Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 text-white hover:bg-white/10"
          >
            <User className="w-4 h-4" />
            {user?.name}
          </Button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-xl"
              >
                <div className="p-3 border-b border-white/10">
                  <p className="text-white font-medium">{user?.name}</p>
                  <p className="text-gray-300 text-sm">{user?.email}</p>
                </div>
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-white hover:bg-white/10"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start text-red-300 hover:bg-red-500/20"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6">
        {/* Agent Status */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className={`w-32 h-32 rounded-full bg-gradient-to-r ${getAgentStateColor()} p-1 mb-6 mx-auto`}
            animate={{
              scale: agentState === 'listening' ? [1, 1.1, 1] : 1,
              rotate: agentState === 'thinking' ? 360 : 0,
            }}
            transition={{
              scale: { duration: 1, repeat: agentState === 'listening' ? Infinity : 0 },
              rotate: { duration: 2, repeat: agentState === 'thinking' ? Infinity : 0, ease: "linear" },
            }}
          >
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
              {agentState === 'listening' ? (
                <Mic className="w-12 h-12 text-white" />
              ) : (
                <MicOff className="w-12 h-12 text-white/70" />
              )}
            </div>
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-2">
            {getAgentStateText()}
          </h2>
          <p className="text-gray-300 text-lg">
            {isAgentAvailable(agentState) 
              ? "I'm here to help you with government services"
              : "Click the microphone to start talking"
            }
          </p>
        </motion.div>

        {/* Media Tiles */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-4xl"
        >
          <MediaTiles />
        </motion.div>

        {/* Control Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <AgentControlBar
            capabilities={capabilities}
            onChatToggle={() => setChatOpen(!chatOpen)}
            chatOpen={chatOpen}
          />
        </motion.div>
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-96 bg-white/10 backdrop-blur-md border-l border-white/20 z-50"
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-white/20">
                <h3 className="text-lg font-semibold text-white">Chat</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <ChatMessageView key={index} message={message} />
                ))}
              </div>

              <div className="p-4 border-t border-white/20">
                <ChatEntry onSend={handleSendMessage} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </main>
  );
};
