import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  stand?: string;
  imageUrl?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// JoJo character avatars with actual image URLs
const jojoAvatars = [
  { 
    emoji: '⭐', 
    name: 'Jotaro Kujo', 
    stand: 'Star Platinum',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=face'
  },
  { 
    emoji: '🌍', 
    name: 'DIO', 
    stand: 'The World',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  { 
    emoji: '🌟', 
    name: 'Giorno Giovanna', 
    stand: 'Gold Experience',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  { 
    emoji: '💜', 
    name: 'Josuke Higashikata', 
    stand: 'Crazy Diamond',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
  },
  { 
    emoji: '🔥', 
    name: 'Joseph Joestar', 
    stand: 'Hermit Purple',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face'
  },
  { 
    emoji: '⚡', 
    name: 'Jonathan Joestar', 
    stand: 'Hamon Energy',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face'
  },
  { 
    emoji: '🌊', 
    name: 'Jolyne Cujoh', 
    stand: 'Stone Free',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
  },
  { 
    emoji: '🎭', 
    name: 'Johnny Joestar', 
    stand: 'Tusk Act 4',
    imageUrl: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face'
  }
];

// Mock users data - in real app this would be in a database
const mockUsers = [
  {
    id: '1',
    email: 'jotaro@jojo.com',
    password: 'starplatinum',
    username: 'Jotaro Kujo',
    avatar: '⭐',
    stand: 'Star Platinum',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    email: 'dio@jojo.com',
    password: 'theworld',
    username: 'DIO',
    avatar: '🌍',
    stand: 'The World',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  }
];

// ZA WARUDO sound effect function
const playZaWarudoSound = () => {
  try {
    // Create audio context and play "ZA WARUDO" sound effect
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContextClass();
    
    // Create a simple beep sequence that sounds like "ZA WARUDO"
    const playBeep = (frequency: number, duration: number, delay: number) => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
      }, delay);
    };
    
    // "ZA" - "WAR" - "UDO" sound pattern
    playBeep(200, 0.2, 0);     // ZA
    playBeep(150, 0.3, 300);   // WAR
    playBeep(100, 0.4, 700);   // UDO
  } catch (error) {
    console.log('Audio not supported or blocked:', error);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('tasktrackr_token');
    const userData = localStorage.getItem('tasktrackr_user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
        avatar: foundUser.avatar,
        stand: foundUser.stand,
        imageUrl: foundUser.imageUrl
      };
      
      // Mock JWT token
      const mockToken = `mock_jwt_${foundUser.id}_${Date.now()}`;
      
      localStorage.setItem('tasktrackr_token', mockToken);
      localStorage.setItem('tasktrackr_user', JSON.stringify(userData));
      
      setUser(userData);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (email: string, password: string, username: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    // Assign random JoJo character
    const randomJojo = jojoAvatars[Math.floor(Math.random() * jojoAvatars.length)];
    
    // Create new user
    const newUser = {
      id: String(mockUsers.length + 1),
      email,
      password,
      username,
      avatar: randomJojo.emoji,
      stand: randomJojo.stand,
      imageUrl: randomJojo.imageUrl
    };
    
    mockUsers.push(newUser);
    
    const userData = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      avatar: newUser.avatar,
      stand: newUser.stand,
      imageUrl: newUser.imageUrl
    };
    
    // Mock JWT token
    const mockToken = `mock_jwt_${newUser.id}_${Date.now()}`;
    
    localStorage.setItem('tasktrackr_token', mockToken);
    localStorage.setItem('tasktrackr_user', JSON.stringify(userData));
    
    setUser(userData);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('tasktrackr_token');
    localStorage.removeItem('tasktrackr_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { playZaWarudoSound };