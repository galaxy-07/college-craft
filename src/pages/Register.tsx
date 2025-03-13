
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/components/common/ThemeToggle";
import AnimatedTransition from "@/components/common/AnimatedTransition";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [collegeEmail, setCollegeEmail] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateCollegeEmail = (email: string) => {
    // This is a simple check for demonstration purposes
    // In a real app, you would have a more comprehensive validation
    const commonEduDomains = [
      ".edu",
      "university.",
      "college.",
      "school.",
      "ac.",
      "academic.",
    ];
    
    const isEduEmail = commonEduDomains.some(domain => email.toLowerCase().includes(domain));
    setCollegeEmail(isEduEmail);
    
    return isEduEmail;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    if (newEmail.includes("@")) {
      validateCollegeEmail(newEmail);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Invalid input",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateCollegeEmail(email)) {
      toast({
        title: "Non-college email detected",
        description: "Please use your college email address to register.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate registration and email verification process
    setTimeout(() => {
      toast({
        title: "Verification email sent",
        description: "Please check your email to complete registration.",
      });
      
      // In a real app, we would redirect to a verification page
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <AnimatedTransition animationType="scale" className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Campus<span className="text-primary">Anon</span></h1>
            </div>
            <CardTitle className="text-2xl text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Enter your college email to get started
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">College Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m.johnson@university.edu"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                
                {email && !collegeEmail && (
                  <Alert variant="destructive" className="py-2">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Please use your college email address (.edu or university domain)
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <Alert variant="secondary" className="py-2">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs ml-2">
                  You'll need to verify your college email to join your college's community.
                </AlertDescription>
              </Alert>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
              
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </AnimatedTransition>
      
      <p className="mt-8 text-center text-sm text-muted-foreground">
        By signing up, you agree to our{" "}
        <Link to="/terms" className="hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
};

export default Register;
