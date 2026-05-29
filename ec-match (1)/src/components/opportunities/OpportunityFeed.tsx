import { useState, useEffect } from 'react';
import { Opportunity, UserProfile } from '../../types';
import { db } from '../../lib/firebase'; // Direct import of your configured firebase instance
import { collection, getDocs } from 'firebase/firestore'; 
import { OpportunityCard } from './OpportunityCard';
import { Sparkles, Loader2, RefreshCw, SlidersHorizontal, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OpportunityFeedProps {
  profile?: UserProfile;
}

export function OpportunityFeed({ profile }: OpportunityFeedProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [useProfile, setUseProfile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Filter states
  const [filters, setFilters] = useState({
    prestige: 'all',
    cost: 'all',
    format: 'all',
    subject: '',
    type: 'all',
    ageGroup: 'all'
  });

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'opportunities'));
      
      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Opportunity[];

      // 🛑 ADD THIS LINE RIGHT HERE:
      console.log("RAW FIRESTORE ROWS LOADED:", results);

      setOpportunities(results);
      setCurrentPage(1); 
    } catch (error) {
      console.error("Error loading opportunities from Firestore:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, [profile, useProfile]);

  const filteredOpportunities = opportunities.filter(opp => {
    if (filters.cost !== 'all' && opp.cost?.toLowerCase() !== filters.cost.toLowerCase()) return false;
    if (filters.format !== 'all' && opp.format?.toLowerCase() !== filters.format.toLowerCase()) return false;
    if (filters.type !== 'all' && !opp.type?.toLowerCase().includes(filters.type.toLowerCase())) return false;
    if (filters.prestige !== 'all' && opp.prestigeRating < parseInt(filters.prestige)) return false;
    if (filters.ageGroup !== 'all' && !opp.ageGroup?.toLowerCase().includes(filters.ageGroup.toLowerCase())) return false;
    if (filters.subject) {
      const search = filters.subject.toLowerCase();
      return opp.title?.toLowerCase().includes(search) || 
             opp.subject?.toLowerCase().includes(search) || 
             opp.topic?.toLowerCase().includes(search);
    }
    return true;
  });

  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const paginatedOpportunities = filteredOpportunities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="space-y-8 py-12">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <Loader2 className="w-16 h-16 animate-spin text-muted" />
            {useProfile && <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
          </div>
          <h2 className="text-3xl font-serif font-medium text-foreground">
            Loading opportunities...
          </h2>
          <p className="text-muted-foreground max-sm:px-4 max-w-sm mx-auto">
            Fetching the latest high-impact extracurriculars from your database.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-[450px] bg-muted rounded-[32px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Live Database Selection</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-foreground">Discover Opportunities</h2>
            <p className="text-muted-foreground max-w-lg text-lg leading-relaxed">
              Displaying all verified extracurriculars synced directly from your spreadsheet database.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 bg-muted/50 px-4 py-2 rounded-full border border-border/50">
              <Switch 
                id="profile-mode" 
                checked={useProfile} 
                onCheckedChange={setUseProfile}
              />
              <Label htmlFor="profile-mode" className="text-xs font-medium cursor-pointer text-foreground">Profile-based</Label>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)} 
              className={`rounded-full gap-2 ${showFilters ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={loadOpportunities} 
              className="rounded-full text-foreground"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-6 bg-muted/30 rounded-[32px] border border-border/50">
                <div className="space-y-2">
                  <Label className="text-xs text-foreground">Cost</Label>
                  <Select value={filters.cost} onValueChange={v => setFilters({...filters, cost: v ?? 'all'})}>
                    <SelectTrigger className="rounded-xl bg-background text-foreground">
                      <SelectValue placeholder="Any Cost" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Cost</SelectItem>
                      <SelectItem value="Free">Free</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-foreground">Format</Label>
                  <Select value={filters.format} onValueChange={v => setFilters({...filters, format: v ?? 'all'})}>
                    <SelectTrigger className="rounded-xl bg-background text-foreground">
                      <SelectValue placeholder="Any Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Format</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="In-person">In-person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-foreground">Type</Label>
                  <Select value={filters.type} onValueChange={v => setFilters({...filters, type: v ?? 'all'})}>
                    <SelectTrigger className="rounded-xl bg-background text-foreground">
                      <SelectValue placeholder="Any Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Type</SelectItem>
                      <SelectItem value="Competition">Competition</SelectItem>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Project">Project based</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-foreground">Prestige</Label>
                  <Select value={filters.prestige} onValueChange={v => setFilters({...filters, prestige: v ?? 'all'})}>
                    <SelectTrigger className="rounded-xl bg-background text-foreground">
                      <SelectValue placeholder="Any Prestige" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Prestige</SelectItem>
                      <SelectItem value="3">3+ Stars</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-foreground">Age/Grade</Label>
                  <Select value={filters.ageGroup} onValueChange={v => setFilters({...filters, ageGroup: v ?? 'all'})}>
                    <SelectTrigger className="rounded-xl bg-background text-foreground">
                      <SelectValue placeholder="Any Age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Age</SelectItem>
                      <SelectItem value="14">14+</SelectItem>
                      <SelectItem value="16">16+</SelectItem>
                      <SelectItem value="9">Grade 9+</SelectItem>
                      <SelectItem value="11">Grade 11+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-foreground">Search Subject</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Subject..." 
                      className="pl-10 rounded-xl bg-background text-foreground"
                      value={filters.subject}
                      onChange={e => setFilters({...filters, subject: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {paginatedOpportunities.map((opp, index) => (
          <motion.div
            key={opp.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <OpportunityCard opportunity={opp} />
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-full text-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="rounded-full w-10 h-10"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-full text-foreground"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-20 bg-muted/30 rounded-[32px] border border-dashed border-border">
          <p className="text-muted-foreground font-medium">No matches found for these filters.</p>
          <Button variant="link" onClick={() => setFilters({prestige: 'all', cost: 'all', format: 'all', subject: '', type: 'all', ageGroup: 'all'})}>
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}