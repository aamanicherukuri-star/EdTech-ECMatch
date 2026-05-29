import { useState, useEffect } from 'react';
import { PipelineStatus, UserOpportunity, UserRanking } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Download, 
  Clock, 
  CheckCircle2, 
  MoreVertical, 
  Loader2, 
  ChevronRight, 
  ChevronLeft,
  Star,
  Trophy,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { auth, db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';

const COLUMNS: PipelineStatus[] = ['Saved', 'In Progress', 'Applied', 'Completed'];

export function Dashboard() {
  const [opportunities, setOpportunities] = useState<UserOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'opportunities'),
      orderBy('savedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => {
        const data = doc.data() as UserOpportunity;
        // Auto-rank if not set
        if (!data.ranking) {
          if (data.prestigeRating >= 4) data.ranking = 'Best';
          else if (data.prestigeRating >= 2) data.ranking = 'Medium';
          else data.ranking = 'Low';
        }
        return data;
      });
      setOpportunities(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching opportunities:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (oppId: string, currentStatus: PipelineStatus, direction: 'next' | 'prev') => {
    const user = auth.currentUser;
    if (!user) return;

    const currentIndex = COLUMNS.indexOf(currentStatus);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (nextIndex < 0 || nextIndex >= COLUMNS.length) return;

    const nextStatus = COLUMNS[nextIndex];
    
    try {
      await updateDoc(doc(db, 'users', user.uid, 'opportunities', oppId), {
        status: nextStatus
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const updateRanking = async (oppId: string, newRanking: UserRanking) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.uid, 'opportunities', oppId), {
        ranking: newRanking
      });
    } catch (error) {
      console.error("Error updating ranking:", error);
    }
  };

  const generatePortfolio = () => {
    // Sort by ranking priority: Best > Medium > Low
    const priorityMap = { 'Best': 0, 'Medium': 1, 'Low': 2 };
    const sorted = [...opportunities].sort((a, b) => 
      (priorityMap[a.ranking] || 1) - (priorityMap[b.ranking] || 1)
    );

    let portfolio = "EXTRACURRICULAR PORTFOLIO\n";
    portfolio += "==========================\n\n";

    sorted.forEach((opp, index) => {
      portfolio += `${index + 1}. ${opp.title.toUpperCase()}\n`;
      portfolio += `Priority: ${opp.ranking}\n`;
      portfolio += `Type: ${opp.type}\n`;
      portfolio += `Status: ${opp.status}\n`;
      
      // Higher rank gets more detailed info
      if (opp.ranking === 'Best') {
        portfolio += `Description: ${opp.description || opp.rationale}\n`;
        portfolio += `Impact: ${opp.impactSummary || 'Significant contribution to the field.'}\n`;
        portfolio += `Hours Logged: ${opp.hoursLogged}h\n`;
      } else if (opp.ranking === 'Medium') {
        portfolio += `Description: ${opp.description || opp.rationale}\n`;
        portfolio += `Hours Logged: ${opp.hoursLogged}h\n`;
      } else {
        portfolio += `Brief: ${opp.title} - ${opp.type}\n`;
      }
      
      portfolio += "--------------------------\n\n";
    });

    const blob = new Blob([portfolio], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EC-Match-Portfolio.txt';
    a.click();
  };

  const getColumnItems = (status: PipelineStatus) => 
    opportunities.filter(o => o.status === status);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-serif font-medium text-foreground">Your Dashboard</h2>
          <p className="text-muted-foreground">Manage and rank your curated opportunities for your portfolio.</p>
        </div>
        <Button onClick={generatePortfolio} className="bg-primary text-primary-foreground rounded-full gap-2">
          <Download className="w-4 h-4" /> Generate Portfolio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {COLUMNS.map((col, colIndex) => (
          <div key={col} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{col}</h3>
              <Badge variant="secondary" className="rounded-full bg-muted text-muted-foreground border-none">
                {getColumnItems(col).length}
              </Badge>
            </div>
            
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {getColumnItems(col).map((opp) => (
                  <motion.div
                    key={opp.id}
                    layoutId={opp.id}
                    className="p-5 bg-card rounded-[24px] shadow-sm border border-border/50 space-y-4 cursor-pointer hover:border-primary/30 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium leading-tight pr-4">{opp.title}</h4>
                      <div className="flex gap-1">
                        {colIndex > 0 && (
                          <button 
                            onClick={() => updateStatus(opp.id, opp.status, 'prev')}
                            className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                        )}
                        {colIndex < COLUMNS.length - 1 && (
                          <button 
                            onClick={() => updateStatus(opp.id, opp.status, 'next')}
                            className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {opp.hoursLogged}h
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {opp.effortLevel}
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        {(['Best', 'Medium', 'Low'] as UserRanking[]).map(r => (
                          <button
                            key={r}
                            onClick={() => updateRanking(opp.id, r)}
                            className={`text-[8px] px-1.5 py-0.5 rounded-full border transition-all ${
                              opp.ranking === r 
                                ? 'bg-primary text-primary-foreground border-primary' 
                                : 'bg-muted text-muted-foreground border-border'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {getColumnItems(col).length === 0 && (
                  <div className="h-32 border-2 border-dashed border-border/50 rounded-[24px] flex items-center justify-center">
                    <span className="text-xs text-muted-foreground font-medium">Empty</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  );
}
