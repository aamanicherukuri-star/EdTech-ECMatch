import { useState } from 'react';
import { UserProfile } from '../../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth, db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Loader2, Save, User, GraduationCap, Briefcase, Heart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProfilePageProps {
  profile: UserProfile | null;
  onUpdate: (profile: UserProfile) => void;
}

export function ProfilePage({ profile, onUpdate }: ProfilePageProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>(profile || {});

  const handleSave = async () => {
    if (!auth.currentUser || !profile) return;
    setLoading(true);
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, formData);
      onUpdate({ ...profile, ...formData });
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-4xl font-serif font-medium text-foreground">Edit Profile</h2>
          <p className="text-muted-foreground">Customize your academic and personal identity.</p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="basic" className="w-full flex flex-col">
        <TabsList className="flex w-full h-auto p-1 bg-muted rounded-2xl mb-12 overflow-x-auto">
          <TabsTrigger value="basic" className="flex-1 rounded-xl py-4 gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md transition-all min-w-[120px]">
            <User className="w-5 h-5" /> <span className="font-medium">Basic</span>
          </TabsTrigger>
          <TabsTrigger value="academic" className="flex-1 rounded-xl py-4 gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md transition-all min-w-[120px]">
            <GraduationCap className="w-5 h-5" /> <span className="font-medium">Academic</span>
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex-1 rounded-xl py-4 gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md transition-all min-w-[120px]">
            <Briefcase className="w-5 h-5" /> <span className="font-medium">Portfolio</span>
          </TabsTrigger>
          <TabsTrigger value="holistic" className="flex-1 rounded-xl py-4 gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md transition-all min-w-[120px]">
            <Heart className="w-5 h-5" /> <span className="font-medium">Holistic</span>
          </TabsTrigger>
        </TabsList>

        <div className="w-full">
          <TabsContent value="basic" className="w-full focus-visible:outline-none">
            <Card className="rounded-[40px] border-border/50 bg-card shadow-xl overflow-hidden">
              <CardHeader className="p-10 pb-6">
                <CardTitle className="text-3xl font-serif font-medium text-foreground">Basic Information</CardTitle>
                <CardDescription className="text-lg">Essential details for personalization.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-0 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-foreground">Display Name</Label>
                    <Input 
                      value={formData.displayName || ''} 
                      onChange={e => setFormData({...formData, displayName: e.target.value})}
                      className="rounded-2xl h-14 bg-background text-foreground border-border text-lg px-6 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-foreground">Email (Read-only)</Label>
                    <Input 
                      value={formData.email || ''} 
                      disabled
                      className="rounded-2xl h-14 bg-muted/50 text-muted-foreground border-border text-lg px-6"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-foreground">Age</Label>
                    <Input 
                      value={formData.age || ''} 
                      onChange={e => setFormData({...formData, age: e.target.value})}
                      placeholder="e.g. 17"
                      className="rounded-2xl h-14 bg-background text-foreground border-border text-lg px-6 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-foreground">Gender</Label>
                    <Input 
                      value={formData.gender || ''} 
                      onChange={e => setFormData({...formData, gender: e.target.value})}
                      placeholder="e.g. Female"
                      className="rounded-2xl h-14 bg-background text-foreground border-border text-lg px-6 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic" className="w-full focus-visible:outline-none">
            <Card className="rounded-[40px] border-border/50 bg-card shadow-xl overflow-hidden">
              <CardHeader className="p-10 pb-6">
                <CardTitle className="text-3xl font-serif font-medium text-foreground">Academic Baseline</CardTitle>
                <CardDescription className="text-lg">Your grades and coursework.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-0 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-foreground">GPA</Label>
                    <Input 
                      value={formData.academicBaseline?.gpa || ''} 
                      onChange={e => setFormData({
                        ...formData, 
                        academicBaseline: { ...formData.academicBaseline, gpa: e.target.value }
                      })}
                      placeholder="e.g. 3.9"
                      className="rounded-2xl h-14 bg-background text-foreground border-border text-lg px-6 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-foreground">Grading Scale</Label>
                    <Input 
                      value={formData.academicBaseline?.gradingScale || ''} 
                      onChange={e => setFormData({
                        ...formData, 
                        academicBaseline: { ...formData.academicBaseline, gradingScale: e.target.value }
                      })}
                      placeholder="e.g. 4.0 or 100"
                      className="rounded-2xl h-14 bg-background text-foreground border-border text-lg px-6 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium text-foreground">Subject Interests (Comma separated)</Label>
                  <Input 
                    value={formData.academicBaseline?.subjectInterests?.join(', ') || ''} 
                    onChange={e => setFormData({
                      ...formData, 
                      academicBaseline: { ...formData.academicBaseline, subjectInterests: e.target.value.split(',').map(s => s.trim()) }
                    })}
                    placeholder="e.g. Computer Science, Physics, Economics"
                    className="rounded-2xl h-14 bg-background text-foreground border-border text-lg px-6 focus:ring-2 focus:ring-primary"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="w-full focus-visible:outline-none">
            <Card className="rounded-[40px] border-border/50 bg-card shadow-xl overflow-hidden">
              <CardHeader className="p-10 pb-6">
                <CardTitle className="text-3xl font-serif font-medium text-foreground">Active Portfolio</CardTitle>
                <CardDescription className="text-lg">Your experiences and achievements.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-0 space-y-8">
                <div className="space-y-3">
                  <Label className="text-base font-medium text-foreground">Past ECs & Achievements</Label>
                  <Textarea 
                    value={formData.activePortfolio?.pastECs?.join('\n') || ''} 
                    onChange={e => setFormData({
                      ...formData, 
                      activePortfolio: { ...formData.activePortfolio, pastECs: e.target.value.split('\n').filter(s => s.trim()) }
                    })}
                    placeholder="List your previous activities, one per line..."
                    className="rounded-2xl min-h-[200px] bg-background text-foreground border-border text-lg p-6 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium text-foreground">Career Goals</Label>
                  <Input 
                    value={formData.activePortfolio?.careerGoals || ''} 
                    onChange={e => setFormData({
                      ...formData, 
                      activePortfolio: { ...formData.activePortfolio, careerGoals: e.target.value }
                    })}
                    placeholder="e.g. Software Engineer at a Top Tech Firm"
                    className="rounded-2xl h-14 bg-background text-foreground border-border text-lg px-6 focus:ring-2 focus:ring-primary"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="holistic" className="w-full focus-visible:outline-none">
            <Card className="rounded-[40px] border-border/50 bg-card shadow-xl overflow-hidden">
              <CardHeader className="p-10 pb-6">
                <CardTitle className="text-3xl font-serif font-medium text-foreground">Holistic Identity</CardTitle>
                <CardDescription className="text-lg">Your background, values, and personal story.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-0 space-y-8">
                <div className="space-y-3">
                  <Label className="text-base font-medium text-foreground">Background & Values</Label>
                  <Textarea 
                    value={formData.holisticIdentity?.background || ''} 
                    onChange={e => setFormData({
                      ...formData, 
                      holisticIdentity: { ...formData.holisticIdentity, background: e.target.value }
                    })}
                    placeholder="Tell us about your journey, what drives you, and your unique perspective..."
                    className="rounded-2xl min-h-[200px] bg-background text-foreground border-border text-lg p-6 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium text-foreground">Personal Outlets (Hobbies, Sports, etc.)</Label>
                  <Input 
                    value={formData.holisticIdentity?.personalOutlets || ''} 
                    onChange={e => setFormData({
                      ...formData, 
                      holisticIdentity: { ...formData.holisticIdentity, personalOutlets: e.target.value }
                    })}
                    placeholder="e.g. Competitive Swimming, Digital Art, Volunteering"
                    className="rounded-2xl h-14 bg-background text-foreground border-border text-lg px-6 focus:ring-2 focus:ring-primary"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
