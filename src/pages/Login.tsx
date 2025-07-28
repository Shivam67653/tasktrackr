import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth, playZaWarudoSound } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import jojoBackground from '@/assets/jojo-bg.jpg';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  username: z.string().min(2, 'Username must be at least 2 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const Login: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const { login, signup, isLoading } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
    },
  });

  const onLogin = async (data: LoginFormData) => {
    // Play ZA WARUDO sound effect
    playZaWarudoSound();
    
    const success = await login(data.email, data.password);
    if (!success) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Try jotaro@jojo.com with starplatinum",
        variant: "destructive",
      });
    } else {
      toast({
        title: "ORA ORA! Welcome back!",
        description: "Successfully logged in, Stand User!",
        variant: "default",
      });
    }
  };

  const onSignup = async (data: SignupFormData) => {
    // Play ZA WARUDO sound effect
    playZaWarudoSound();
    
    const success = await signup(data.email, data.password, data.username);
    if (!success) {
      toast({
        title: "Signup Failed",
        description: "User with this email already exists",
        variant: "destructive",
      });
    } else {
      toast({
        title: "MUDA MUDA! Stand User Created!",
        description: "Your JoJo character has been assigned!",
        variant: "default",
      });
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${jojoBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-bounce" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full jojo-animate" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* JoJo Title */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-black text-transparent bg-clip-text jojo-gradient jojo-text mb-2">
            TASKTRACKR
          </h1>
          <p className="text-lg text-purple-300 font-bold tracking-wide">
            ⭐ BIZARRE TASK ADVENTURE ⭐
          </p>
        </div>

        {/* Login/Signup Form */}
        <div className="bg-black/80 backdrop-blur-sm border-2 border-purple-500/50 rounded-2xl p-8 jojo-glow">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-white jojo-text">
              {isSignup ? 'JOIN THE CRUSADE' : 'ORA ORA LOGIN'}
            </h2>
            <p className="text-purple-300 mt-2">
              {isSignup ? 'Become a Stand User!' : 'Enter your credentials'}
            </p>
          </div>

          {!isSignup ? (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-pink-300 font-bold">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="jotaro@jojo.com"
                          className="bg-purple-900/50 border-pink-500/50 text-white placeholder:text-purple-300 focus:border-pink-400 focus:ring-pink-400"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-pink-300 font-bold">Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="starplatinum"
                          className="bg-purple-900/50 border-pink-500/50 text-white placeholder:text-purple-300 focus:border-pink-400 focus:ring-pink-400"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-lg py-3 jojo-glow transition-all duration-300 hover:scale-105"
                >
                  {isLoading ? 'LOADING...' : '⭐ ORA ORA LOGIN ⭐'}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-6">
                <FormField
                  control={signupForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-pink-300 font-bold">Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Jotaro Kujo"
                          className="bg-purple-900/50 border-pink-500/50 text-white placeholder:text-purple-300 focus:border-pink-400 focus:ring-pink-400"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-pink-300 font-bold">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="your@email.com"
                          className="bg-purple-900/50 border-pink-500/50 text-white placeholder:text-purple-300 focus:border-pink-400 focus:ring-pink-400"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-pink-300 font-bold">Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Choose a strong password"
                          className="bg-purple-900/50 border-pink-500/50 text-white placeholder:text-purple-300 focus:border-pink-400 focus:ring-pink-400"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-black text-lg py-3 jojo-glow transition-all duration-300 hover:scale-105"
                >
                  {isLoading ? 'LOADING...' : '🌟 MUDA MUDA SIGNUP 🌟'}
                </Button>
              </form>
            </Form>
          )}

          <div className="mt-8 text-center">
            <p className="text-purple-300">
              {isSignup ? 'Already a Stand User?' : 'New to the adventure?'}
            </p>
            <Button
              variant="ghost"
              onClick={() => setIsSignup(!isSignup)}
              className="text-pink-400 hover:text-pink-300 font-bold mt-2 hover:bg-purple-900/50"
            >
              {isSignup ? 'LOGIN HERE' : 'JOIN THE CRUSADE'}
            </Button>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
            <p className="text-xs text-purple-300 text-center mb-2 font-bold">DEMO CREDENTIALS:</p>
            <p className="text-xs text-white text-center">Email: jotaro@jojo.com</p>
            <p className="text-xs text-white text-center">Password: starplatinum</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;