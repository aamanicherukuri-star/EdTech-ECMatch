
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, X, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingFlowProps {
  onComplete: (data: any) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    academic: { gpa: '', gradingScale: '', rigorousCourses: [] as string[] },
    experience: { pastECs: [] as string[], competitions: [] as string[], experiences: [] as string[] },
    holistic: { background: '', books: [] as string[], movies: [] as string[], podcasts: [] as string[], personalOutlets: '' }
  });

  const [tempInput, setTempInput] = useState('');

  const addTag = (category: string, value: string) => {
    if (!value.trim()) return;
    
    setFormData(prev => {
      if (category in prev.experience) {
        return {
          ...prev,
          experience: {
            ...prev.experience,
            [category]: [...(prev.experience as any)[category], value]
          }
        };
      } else if (category in prev.holistic) {
        return {
          ...prev,
          holistic: {
            ...prev.holistic,
            [category]: [...(prev.holistic as any)[category], value]
          }
        };
      } else if (category === 'rigorousCourses') {
        return {
          ...prev,
          academic: {
            ...prev.academic,
            rigorousCourses: [...prev.academic.rigorousCourses, value]
          }
        };
      }
      return prev;
    });
    setTempInput('');
  };

  const removeTag = (category: string, index: number) => {
    setFormData(prev => {
      if (category in prev.experience) {
        const list = [...(prev.experience as any)[category]];
        list.splice(index, 1);
        return { ...prev, experience: { ...prev.experience, [category]: list } };
      } else if (category in prev.holistic) {
        const list = [...(prev.holistic as any)[category]];
        list.splice(index, 1);
        return { ...prev, holistic: { ...prev.holistic, [category]: list } };
      } else if (category === 'rigorousCourses') {
        const list = [...prev.academic.rigorousCourses];
        list.splice(index, 1);
        return { ...prev, academic: { ...prev.academic, rigorousCourses: list } };
      }
      return prev;
    });
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex justify-between items-center px-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && <div className={`w-20 h-px mx-2 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="rounded-[32px] border-border/50 bg-card">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Basic & Academic</CardTitle>
                <CardDescription>Tell us a bit about yourself. All fields are optional.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input 
                      placeholder="e.g. 17" 
                      value={formData.age}
                      onChange={e => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Input 
                      placeholder="e.g. Female" 
                      value={formData.gender}
                      onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cumulative GPA</Label>
                    <Input 
                      placeholder="e.g. 3.9" 
                      value={formData.academic.gpa}
                      onChange={e => setFormData(prev => ({ ...prev, academic: { ...prev.academic, gpa: e.target.value } }))}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Grading Scale</Label>
                    <Input 
                      placeholder="e.g. 4.0 or 100%" 
                      value={formData.academic.gradingScale}
                      onChange={e => setFormData(prev => ({ ...prev, academic: { ...prev.academic, gradingScale: e.target.value } }))}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Rigorous Courses (AP, IB, Advanced)</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add a course..." 
                      value={tempInput}
                      onChange={e => setTempInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addTag('rigorousCourses' as any, tempInput)}
                    />
                    <Button variant="outline" size="icon" onClick={() => addTag('rigorousCourses' as any, tempInput)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.academic.rigorousCourses.map((c, i) => (
                      <span key={i} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs flex items-center gap-2 border border-border">
                        {c} <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag('rigorousCourses', i)} />
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={nextStep} className="w-full bg-primary text-primary-foreground rounded-full">
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="rounded-[32px] border-border/50 bg-card">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Active Portfolio</CardTitle>
                <CardDescription>Your extracurriculars, competitions, and experiences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {['pastECs', 'competitions', 'experiences'].map((cat) => (
                  <div key={cat} className="space-y-2">
                    <Label className="capitalize">{cat.replace(/([A-Z])/g, ' $1')}</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder={`Add ${cat}...`} 
                        className="rounded-xl"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            addTag(cat as any, (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(formData.experience as any)[cat].map((item: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs flex items-center gap-2 border border-border">
                          {item} <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(cat, i)} />
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button variant="outline" onClick={prevStep} className="flex-1 rounded-full">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={nextStep} className="flex-[2] bg-primary text-primary-foreground rounded-full">
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="rounded-[32px] border-border/50 bg-card">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Holistic Identity</CardTitle>
                <CardDescription>The personal context that makes you unique.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Background & Identity</Label>
                  <Textarea 
                    placeholder="Tell us about your background, location, or personal stories..."
                    className="min-h-[100px] resize-none rounded-xl"
                    value={formData.holistic.background}
                    onChange={e => setFormData(prev => ({ ...prev, holistic: { ...prev.holistic, background: e.target.value } }))}
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>Intellectual Diet</Label>
                  {['books', 'movies', 'podcasts'].map((cat) => (
                    <div key={cat} className="space-y-2">
                      <Input 
                        placeholder={`Add a ${cat.slice(0, -1)}...`}
                        className="rounded-xl"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            addTag(cat as any, (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {(formData.holistic as any)[cat].map((item: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs flex items-center gap-2 border border-border">
                            {item} <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(cat, i)} />
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>Personal Outlets</Label>
                  <Textarea 
                    placeholder="Journaling themes, creative writing, or niche hobbies..."
                    className="min-h-[100px] resize-none rounded-xl"
                    value={formData.holistic.personalOutlets}
                    onChange={e => setFormData(prev => ({ ...prev, holistic: { ...prev.holistic, personalOutlets: e.target.value } }))}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button variant="outline" onClick={prevStep} className="flex-1 rounded-full">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={() => onComplete(formData)} className="flex-[2] bg-primary text-primary-foreground rounded-full">
                  Complete Profile <Check className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
