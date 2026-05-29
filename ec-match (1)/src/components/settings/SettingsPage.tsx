import { UserProfile } from '../../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Palette, User, Shield, Bell } from 'lucide-react';

interface SettingsPageProps {
  profile: UserProfile | null;
  onLogout: () => void;
  onUpdateProfile: (data: Partial<UserProfile>) => void;
}

export function SettingsPage({ profile, onLogout, onUpdateProfile }: SettingsPageProps) {
  const colors = [
    { name: 'Slate', value: '#0f172a' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Rose', value: '#ef4444' },
    { name: 'Violet', value: '#7c3aed' }
  ];

  const handleColorChange = (color: string) => {
    onUpdateProfile({ themeColor: color });
    document.documentElement.style.setProperty('--primary', color);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-serif font-medium text-foreground">Settings</h2>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <div className="grid gap-6">
        <Card className="rounded-[32px] border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground"><Palette className="w-5 h-5" /> Appearance</CardTitle>
            <CardDescription>Customize how EC Match looks for you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-2xl">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">Theme Color</p>
                <p className="text-xs text-muted-foreground">Choose your primary accent color.</p>
              </div>
              <div className="flex gap-2">
                {colors.map(color => (
                  <button 
                    key={color.value}
                    onClick={() => handleColorChange(color.value)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${profile?.themeColor === color.value ? 'border-foreground scale-110' : 'border-transparent hover:scale-110'}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Account</CardTitle>
            <CardDescription>Manage your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-2xl">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Email Address</p>
                <p className="text-xs text-muted-foreground">{profile?.email}</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-full">Change</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-border/50 border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2"><Shield className="w-5 h-5" /> Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              className="w-full rounded-full gap-2"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
