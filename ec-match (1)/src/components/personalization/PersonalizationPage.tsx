import { useState, useEffect, useRef } from 'react';
import { UserProfile, Opportunity } from '../../types';
import { curateOpportunities } from '../../services/geminiService';
import { OpportunityCard } from '../opportunities/OpportunityCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  BrainCircuit, 
  Trophy, 
  Target, 
  Star,
  MessageSquare,
  Menu,
  Plus,
  MoreVertical,
  Trash2,
  Edit2,
  X,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface PersonalizationPageProps {
  profile?: UserProfile;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
  results?: Opportunity[];
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  createdAt: number;
}

export function PersonalizationPage({ profile }: PersonalizationPageProps) {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('chat_sessions');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Error parsing chat_sessions", e);
      return [];
    }
  });
  
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem('current_session_id');
      return saved || null;
    } catch (e) {
      return null;
    }
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Opportunity[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find(s => s.id === currentSessionId) || (sessions.length > 0 ? sessions[0] : null);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('chat_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem('current_session_id', currentSessionId);
    }
  }, [currentSessionId]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSession?.messages, loading]);

  const createNewChat = () => {
    const newSessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: newSessionId,
      name: 'New Chat',
      messages: [
        { role: 'ai', text: "Welcome to your Personalization Space! I'm your AI advisor. Tell me exactly what you're looking for—be it a specific subject, a location, or a career goal." }
      ],
      createdAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSessionId);
    setResults([]);
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    localStorage.setItem('chat_sessions', JSON.stringify(newSessions)); // Force save
    if (currentSessionId === id) {
      setCurrentSessionId(newSessions.length > 0 ? newSessions[0].id : null);
      if (newSessions.length === 0) setResults([]);
    }
  };

  const renameSession = (id: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setRenamingId(null);
      return;
    }
    setSessions(prev => prev.map(s => s.id === id ? { ...s, name: trimmed } : s));
    setRenamingId(null);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    let sessionId = currentSessionId;
    let allSessions = [...sessions];
    let session = allSessions.find(s => s.id === sessionId);

    if (!session) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        name: input.slice(0, 30) + (input.length > 30 ? '...' : ''),
        messages: [],
        createdAt: Date.now()
      };
      allSessions = [newSession, ...allSessions];
      sessionId = newSession.id;
      session = newSession;
      setCurrentSessionId(sessionId);
    }

    const userMsg = input;
    setInput('');
    
    // Add user message to current session messages
    const updatedMessages: Message[] = [
      ...(session.messages || []),
      { role: 'user', text: userMsg }
    ];

    // Update sessions state with the user message
    const sessionsWithUserMsg = allSessions.map(s => s.id === sessionId ? { ...s, messages: updatedMessages } : s);
    setSessions(sessionsWithUserMsg);
    setLoading(true);

    try {
      const curated = await curateOpportunities(profile || {} as any, userMsg);
      const aiMsg: Message = { 
        role: 'ai', 
        text: `I've analyzed your request and curated a personalized selection of ${curated.length} opportunities. Click "Load ECs" below to view them in the display area.`,
        results: curated
      };
      
      const finalSessions = sessionsWithUserMsg.map(s => s.id === sessionId ? { 
        ...s, 
        messages: [...updatedMessages, aiMsg],
        name: s.name === 'New Chat' ? userMsg.slice(0, 30) + (userMsg.length > 30 ? '...' : '') : s.name
      } : s);

      setSessions(finalSessions);
      setResults(curated);
    } catch (error) {
      console.error("Personalization error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadECs = (opps: Opportunity[]) => {
    setResults(opps);
  };

  const top1 = results[0];
  const top3 = results.slice(1, 4);
  const next5 = results.slice(4, 9);
  const next10 = results.slice(9, 19);

  return (
    <div className="flex flex-col md:flex-row gap-0 h-[calc(100vh-140px)] relative overflow-hidden bg-background border border-border/50 rounded-[40px] shadow-2xl">
      {/* Sidebar Toggle Button (when hidden) */}
      {!showSidebar && (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setShowSidebar(true)} 
          className="absolute left-6 top-6 z-50 rounded-full h-10 w-10 bg-background shadow-md border-border/50"
        >
          <Menu className="w-5 h-5 text-primary" />
        </Button>
      )}

      {/* Sidebar (Chat History) */}
      <AnimatePresence mode="wait">
        {showSidebar && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="h-full bg-muted/20 border-r border-border/50 flex flex-col overflow-hidden z-40 shrink-0"
          >
            <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background/40 backdrop-blur-md shrink-0">
              <h3 className="font-serif font-medium text-foreground flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> History
              </h3>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={createNewChat} className="rounded-full hover:bg-primary/10 text-primary h-9 w-9">
                  <Plus className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowSidebar(false)} className="rounded-full h-9 w-9">
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </Button>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full overflow-hidden">
                <div className="p-4 space-y-2">
                  {sessions.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-xs text-muted-foreground font-medium">No chat history yet</p>
                    </div>
                  )}
                  {sessions.map(session => (
                    <div 
                      key={session.id}
                      onClick={() => {
                        setCurrentSessionId(session.id);
                        const lastAiMsg = [...session.messages].reverse().find(m => m.role === 'ai' && m.results);
                        if (lastAiMsg?.results) setResults(lastAiMsg.results);
                        else setResults([]);
                      }}
                      className={`group relative flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                        currentSessionId === session.id 
                          ? 'bg-primary text-primary-foreground shadow-lg' 
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      
                      {renamingId === session.id ? (
                        <div className="flex-1 min-w-0" onClick={e => e.stopPropagation()}>
                          <Input
                            autoFocus
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') renameSession(session.id, tempName);
                              if (e.key === 'Escape') setRenamingId(null);
                            }}
                            onBlur={() => renameSession(session.id, tempName)}
                            className="h-7 py-0 px-2 text-sm bg-background text-foreground border-none"
                          />
                        </div>
                      ) : (
                        <span className="text-sm font-medium truncate flex-1">{session.name}</span>
                      )}
                      
                      <div onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger 
                            className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                              currentSessionId === session.id 
                                ? 'text-primary-foreground hover:bg-white/20' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl z-50">
                            <DropdownMenuItem onClick={() => {
                              setRenamingId(session.id);
                              setTempName(session.name);
                            }}>
                              <Edit2 className="w-4 h-4 mr-2" /> Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              variant="destructive"
                              className="focus:bg-destructive/10"
                              onClick={(e) => deleteSession(session.id, e as any)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row min-w-0 h-full overflow-hidden">
        {/* AI Chat Area */}
        <div className="w-full md:w-[450px] flex flex-col bg-muted/10 border-r border-border/50 h-full overflow-hidden">
          <div className="p-6 border-b border-border/50 bg-background/40 backdrop-blur-md flex items-center justify-between shrink-0 h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <BrainCircuit className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-serif font-medium text-foreground">AI Advisor</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Personalization</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {loading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
              {currentSession && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-9 w-9 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground">
                    <MoreVertical className="w-5 h-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setRenamingId(currentSession.id);
                      setTempName(currentSession.name);
                    }}>
                      <Edit2 className="w-4 h-4 mr-2" /> Rename Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      variant="destructive"
                      onClick={(e) => deleteSession(currentSession.id, e as any)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Chat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <div className="flex-1 min-h-0 bg-background/5 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                {currentSession?.messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-background border border-border rounded-tl-none text-foreground'
                    }`}>
                      {msg.text}
                    </div>
                    {msg.role === 'ai' && msg.results && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => loadECs(msg.results!)}
                        className="mt-3 rounded-full gap-2 text-xs font-bold border-primary/30 text-primary hover:bg-primary/5 shadow-sm transition-all active:scale-95"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" /> Load ECs
                      </Button>
                    )}
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-background border border-border p-4 rounded-3xl rounded-tl-none shadow-sm">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} className="h-4" />
              </div>
            </ScrollArea>
          </div>

          <div className="p-6 bg-background/40 backdrop-blur-md border-t border-border/50 shrink-0">
            <div className="relative">
              <Input 
                placeholder="Ask me anything..." 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="rounded-[24px] pr-14 h-14 bg-background text-foreground border-border focus:ring-primary text-base px-6 shadow-sm overflow-hidden"
                disabled={loading}
              />
              <Button 
                size="icon" 
                onClick={handleSend}
                className="absolute right-2 top-2 rounded-full w-10 h-10 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-transform active:scale-95"
                disabled={loading || !input.trim()}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Segment (Display Area) */}
        <div className="flex-1 min-w-0 bg-muted/5 h-full overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-8 md:p-12 space-y-16 pb-24">
              <AnimatePresence mode="wait">
                {results.length > 0 ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-20 max-w-6xl mx-auto"
                  >
                    {/* TOP 1 */}
                    <section className="space-y-8">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-amber-500">
                          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                            <Star className="w-8 h-8 fill-current" />
                          </div>
                          <div>
                            <h2 className="text-4xl font-serif font-medium text-foreground">The Ultimate Match</h2>
                            <p className="text-muted-foreground text-sm">Perfectly aligned with your profile and goals</p>
                          </div>
                        </div>
                        <div className="self-start md:self-center px-6 py-2 rounded-full bg-amber-500/10 text-amber-500 text-sm font-bold uppercase tracking-widest border border-amber-500/20 shadow-sm">
                          99% Match Score
                        </div>
                      </div>
                      <div className="max-w-4xl">
                        <OpportunityCard opportunity={top1} isFeatured />
                      </div>
                    </section>

                    {/* TOP 3 */}
                    {top3.length > 0 && (
                      <section className="space-y-10">
                        <div className="flex items-center gap-4 text-primary">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Trophy className="w-6 h-6" />
                          </div>
                          <h2 className="text-3xl font-serif font-medium text-foreground">Top Recommendations</h2>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {top3.map(opp => <OpportunityCard key={opp.id} opportunity={opp} />)}
                        </div>
                      </section>
                    )}

                    {/* NEXT 5 & 10 */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-20">
                      {next5.length > 0 && (
                        <section className="space-y-10">
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                              <Target className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-serif font-medium text-foreground">Strong Contenders</h2>
                          </div>
                          <div className="space-y-8">
                            {next5.map(opp => <OpportunityCard key={opp.id} opportunity={opp} />)}
                          </div>
                        </section>
                      )}
                      {next10.length > 0 && (
                        <section className="space-y-10">
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                              <Sparkles className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-serif font-medium text-foreground">Discovery Pool</h2>
                          </div>
                          <div className="space-y-8">
                            {next10.map(opp => <OpportunityCard key={opp.id} opportunity={opp} />)}
                          </div>
                        </section>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-[60vh] flex flex-col items-center justify-center text-center space-y-10"
                  >
                    <div className="relative">
                      <div className="w-32 h-32 rounded-[48px] bg-muted/50 flex items-center justify-center animate-pulse">
                        <MessageSquare className="w-16 h-16 text-muted-foreground/50" />
                      </div>
                      <div className="absolute -top-4 -right-4 w-12 h-12 rounded-3xl bg-primary flex items-center justify-center shadow-xl shadow-primary/30">
                        <Sparkles className="w-6 h-6 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-4xl font-serif font-medium text-foreground">
                        {loading ? "Analyzing your request..." : "Start the Conversation"}
                      </h2>
                      <p className="text-muted-foreground max-w-lg text-xl leading-relaxed">
                        {loading 
                          ? "Our AI is searching through thousands of opportunities to find your perfect matches." 
                          : "Tell the AI Advisor what you're looking for to see personalized recommendations here."}
                      </p>
                    </div>
                    {!loading && (
                      <div className="flex flex-wrap justify-center gap-4 max-w-2xl">
                        {['Computer Science', 'Biology', 'Debate', 'Summer Camps', 'Research'].map(tag => (
                          <Button 
                            key={tag} 
                            variant="outline" 
                            className="rounded-full px-8 py-6 text-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                            onClick={() => setInput(`Find me opportunities related to ${tag}`)}
                          >
                            {tag}
                          </Button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
