import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data - in real app this would be in a database
const mockUsers = [
  {
    id: '1',
    email: 'jotaro@jojo.com',
    password: 'starplatinum',
    username: 'Jotaro Kujo',
    avatar: '⭐'
  },
  {
    id: '2',
    email: 'dio@jojo.com',
    password: 'theworld',
    username: 'DIO',
    avatar: '🌍'
  }
];

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
        avatar: foundUser.avatar
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
    
    // Create new user
    const newUser = {
      id: String(mockUsers.length + 1),
      email,
      password,
      username,
      avatar: '🆕'
    };
    
    mockUsers.push(newUser);
    
    const userData = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      avatar: newUser.avatar
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