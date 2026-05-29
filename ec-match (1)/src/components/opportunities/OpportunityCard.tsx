import { useState } from 'react';
import { Opportunity, UserOpportunity, UserRanking } from '../../types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Calendar, MapPin, DollarSign, Zap, ExternalLink, Star, BookmarkPlus, Loader2 } from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { OpportunityDetails } from './OpportunityDetails';
import { AnimatePresence } from 'motion/react';

interface OpportunityCardProps {
  opportunity: Opportunity | UserOpportunity;
  isFeatured?: boolean;
}

export function OpportunityCard({ opportunity, isFeatured }: OpportunityCardProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(opportunity ? 'status' in opportunity : false);
  const [showDetails, setShowDetails] = useState(false);

  if (!opportunity) return null;

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const user = auth.currentUser;
    if (!user || saved) return;

    setSaving(true);
    try {
      const userOpp: UserOpportunity = {
        ...opportunity,
        status: 'Saved',
        ranking: 'Medium',
        savedAt: new Date().toISOString(),
        hoursLogged: 0,
        impactSummary: ''
      };

      await setDoc(doc(db, 'users', user.uid, 'opportunities', opportunity.id), userOpp);
      setSaved(true);
    } catch (error) {
      console.error("Error saving opportunity:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateRanking = async (newRanking: UserRanking, e: React.MouseEvent) => {
    e.stopPropagation();
    const user = auth.currentUser;
    if (!user || !('status' in opportunity)) return;

    try {
      await updateDoc(doc(db, 'users', user.uid, 'opportunities', opportunity.id), {
        ranking: newRanking
      });
    } catch (error) {
      console.error("Error updating ranking:", error);
    }
  };

  return (
    <>
      <Card 
        className={`group relative overflow-hidden transition-all duration-500 cursor-pointer h-full border-none shadow-sm hover:shadow-md ${
          isFeatured 
            ? 'rounded-[40px] border-primary/20 shadow-2xl bg-primary/5' 
            : 'rounded-[32px] bg-card'
        }`}
        onClick={() => setShowDetails(true)}
      >
        <CardHeader className="p-6 pb-0 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full bg-muted text-muted-foreground border-none px-3">
                {opportunity.type}
              </Badge>
              <Badge variant="outline" className="rounded-full text-muted-foreground border-border px-3">
                {opportunity.subject}
              </Badge>
              {opportunity.isVerified && (
                <Badge className="rounded-full bg-emerald-500/10 text-emerald-600 border-none px-3 gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </Badge>
              )}
              {isFeatured && (
                <Badge className="rounded-full bg-amber-500 text-white border-none px-3 gap-1">
                  <Star className="w-3 h-3 fill-current" /> TOP 1
                </Badge>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < (opportunity.prestigeRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} 
                  />
                ))}
              </div>
              {'ranking' in opportunity && (
                <div className="flex gap-1">
                  {(['Best', 'Medium', 'Low'] as UserRanking[]).map(r => (
                    <button
                      key={r}
                      onClick={(e) => updateRanking(r, e)}
                      className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                        opportunity.ranking === r 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-muted text-muted-foreground border-border hover:border-primary/30'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <h3 className={`font-serif font-medium leading-tight group-hover:text-primary transition-colors text-foreground ${isFeatured ? 'text-2xl' : 'text-xl'}`}>
            {opportunity.title}
          </h3>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="p-4 bg-muted/50 rounded-2xl border border-border/30 italic text-sm text-muted-foreground leading-relaxed">
            "{opportunity.description || opportunity.rationale}"
          </div>

          <div className="grid grid-cols-2 gap-4 text-[11px] font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              {opportunity.deadline}
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5" />
              {opportunity.cost}
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              {opportunity.effortLevel} Effort
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              {opportunity.ageGroup}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex gap-3">
          <Button 
            onClick={handleSave}
            disabled={saving || saved}
            className={`flex-1 rounded-full h-11 transition-all ${
              saved 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                : 'bg-foreground text-background hover:bg-foreground/90'
            }`}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : saved ? (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            ) : (
              <BookmarkPlus className="w-4 h-4 mr-2" />
            )}
            {saved ? 'Saved' : 'Add to Dashboard'}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-11 h-11 border-border/50 text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              window.open(opportunity.url, '_blank');
            }}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>

      <AnimatePresence>
        {showDetails && (
          <OpportunityDetails 
            opportunity={opportunity} 
            onClose={() => setShowDetails(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
