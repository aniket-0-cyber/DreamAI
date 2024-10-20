'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Moon, Brain, ImageIcon, Book, Users } from 'lucide-react';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const Link: React.FC<LinkProps> = ({ href, children, className }) => (
  <a href={href} className={className}>
    {children}
  </a>
);

const Icons = {
  moon: Moon,
  brain: Brain,
  image: ImageIcon,
  book: Book,
  users: Users,
};

interface FloatingImageProps {
  src: string;
  alt: string;
  className?: string;
}

const FloatingImage: React.FC<FloatingImageProps> = ({ src, alt, className }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={`absolute ${className}`}
      style={{
        width: '1200px',
        height: '800px',
        animation: `float-in-out 30s ease-in-out infinite`,
      }}
    />
  );
};

export function DreamInterpreterLandingPageComponent() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScCpCb7JTK4RaopdPfBis8mlAFBTg3NBSv9BLbN5mR5NM8Uvw/formResponse';
    
    // Replace 'entry.XXXXXX' with the actual entry ID for your email field
    const formData = new URLSearchParams();
    formData.append('entry.882552214', email);

    try {
      const response = await fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      // Since we're using no-cors, we can't actually check the response
      // We'll assume it was successful if no error was thrown
      setSubmitted(true);
      setEmail('');
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('There was an error submitting your email. Please try again.');
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0b0e] text-white overflow-hidden relative">
      {/* Background images */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/nathan-anderson-ccxSX0f6fu8-unsplash.jpg"
          alt="Starry night sky"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0b0e]/70 to-[#0a0b0e]" />
      </div>
      <FloatingImage 
        src="/images/jeremy-thomas-4dpAqfTbvKA-unsplash.jpg" 
        alt="Futuristic cityscape" 
        className="w-1/3 -left-1/4 top-1/4 opacity-30"
      />
      <FloatingImage 
        src="/images/johannes-plenio-DKix6Un55mw-unsplash.jpg" 
        alt="Ornate chamber" 
        className="w-1/2 -top-1/4 right-1/4 opacity-30"
      />
      <FloatingImage 
        src="/images/christopher-campbell-h9Rx3zOYZws-unsplash.jpg" 
        alt="Ornate chamber" 
        className="w-1/2 -top-1/4 right-1/4 opacity-30"
      />
      <FloatingImage 
        src="/images/engin-akyurt-Mg7cuxZiLH4-unsplash.jpg" 
        alt="Ornate chamber" 
        className="w-1/2 -middle-1/4 right-1/4 opacity-30"
      />
      <FloatingImage 
        src="/images/book-2929646_1920.jpg" 
        alt="Ornate chamber" 
        className="w-1/2 -bottom-1/4 left-1/3 opacity-30"
      />
      
      <header className="px-4 lg:px-6 h-20 flex items-center relative z-10">
        <Link className="flex items-center justify-center" href="#">
          <Moon className="h-8 w-8 text-yellow-400" />
          <span className="ml-2 text-xl font-bold">DreamAI</span>
        </Link>
        <nav className="ml-auto flex gap-6 sm:gap-8">
          <Link className="text-sm font-medium hover:text-yellow-400 transition-colors duration-200" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-yellow-400 transition-colors duration-200" href="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:text-yellow-400 transition-colors duration-200" href="#">
            Contact
          </Link>
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl backdrop-blur-md bg-black/30 p-12 rounded-2xl border border-white/10 shadow-2xl">
          <p className="text-yellow-400 text-lg uppercase tracking-wider font-semibold">AI-Powered Dream Analysis</p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-400">
            Unlock Your Subconscious
          </h1>
          <p className="text-white text-xl max-w-2xl mx-auto leading-relaxed">
            Experience our revolutionary AI-driven dream interpretation and visualization tool.
            Discover the hidden meanings in your dreams and gain profound insights into your subconscious mind.
          </p>
          {submitted ? (
            <div className="text-green-400 font-semibold text-xl">
              Thanks for showing interest! We'll notify you when we launch.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Input
                className="max-w-xs bg-white/10 text-white placeholder-gray-400 border-yellow-400/50 focus:border-yellow-400 transition-all duration-300"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-300 transition-colors duration-300 px-8 py-2 rounded-full font-semibold text-lg">
                Get Early Access
              </Button>
            </form>
          )}
        </div>
      </main>
      
      <section className="w-full py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'brain', title: 'AI-Powered Analysis', description: 'Advanced natural language processing to interpret your dreams with unprecedented accuracy.' },
              { icon: 'image', title: 'Dream Visualization', description: 'Generate stunning visual representations of your dreams using cutting-edge AI technology.' },
              { icon: 'book', title: 'Smart Dream Journal', description: 'Keep track of your dreams and discover patterns over time with our intelligent journaling system.' },
              { icon: 'users', title: 'Dream Community', description: 'Share and discuss dreams with others, anonymously if you prefer, in our vibrant dream exploration community.' },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center space-y-4 text-center backdrop-blur-sm bg-white/5 p-8 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="bg-yellow-400/20 p-3 rounded-full">
                  {React.createElement(Icons[feature.icon as keyof typeof Icons], { className: "h-8 w-8 text-yellow-400" })}
                </div>
                <h2 className="text-xl font-bold text-white">{feature.title}</h2>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <footer className="py-8 text-center text-sm text-gray-500 relative z-10 border-t border-white/10">
        <div className="container mx-auto px-4">
          <p>© 2024 DreamAI Interpreter. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link href="#" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">Privacy Policy</Link>
            <Link href="#" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">Terms of Service</Link>
            <Link href="#" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">Contact Us</Link>
          </div>
        </div>
      </footer>
      
      <style>{`
        @keyframes float-in-out {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          25% { transform: translate(3%, 3%) rotate(2deg); opacity: 0.3; }
          50% { transform: translate(0, 5%) rotate(0deg); opacity: 0.3; }
          75% { transform: translate(-3%, 3%) rotate(-2deg); opacity: 0.3; }
        }
        body {
          background-color: #0a0b0e;
        }
      `}</style>
    </div>
  );
}