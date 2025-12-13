import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Calendar, LogOut, Settings, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Account = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 pt-32 pb-24">
        <div className="max-w-2xl mx-auto">
          {/* Back link */}
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-nobel-gold/20 border-2 border-nobel-gold flex items-center justify-center">
                  <User className="w-8 h-8 text-nobel-gold" />
                </div>
                <div>
                  <CardTitle className="font-serif text-2xl">Account Settings</CardTitle>
                  <CardDescription>Manage your profile and preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-6">
              {/* Email */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border">
                <Mail className="w-5 h-5 text-nobel-gold" />
                <div>
                  <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Email</p>
                  <p className="text-foreground font-medium">{user?.email || 'Not available'}</p>
                </div>
              </div>

              {/* Account Created */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border">
                <Calendar className="w-5 h-5 text-nobel-gold" />
                <div>
                  <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Member Since</p>
                  <p className="text-foreground font-medium">
                    {user?.created_at ? formatDate(user.created_at) : 'Not available'}
                  </p>
                </div>
              </div>

              {/* User ID */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border">
                <User className="w-5 h-5 text-nobel-gold" />
                <div>
                  <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">User ID</p>
                  <p className="text-foreground font-mono text-sm">{user?.id || 'Not available'}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                <Button variant="outline" className="flex-1" asChild>
                  <Link to="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    App Settings
                  </Link>
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
