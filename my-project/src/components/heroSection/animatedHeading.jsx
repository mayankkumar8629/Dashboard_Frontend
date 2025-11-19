import { useEffect, useState } from 'react';

export default function AnimatedHeading() {
  const [displayText, setDisplayText] = useState('');
  const [currentColor, setCurrentColor] = useState(0);
  const fullText = "Where Creators Become Brands";
  
  const colors = [
    // Bright White with subtle gradient
    'bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent',
    
    // Golden/Yellow - pops on blue
    'bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent',
    
    // Electric Green - high contrast
    'bg-gradient-to-r from-lime-300 to-green-400 bg-clip-text text-transparent',
    
    // Coral/Orange - warm and vibrant
    'bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent',
    
    // Pink - feminine and bright
    'bg-gradient-to-r from-pink-300 to-rose-400 bg-clip-text text-transparent',
    
    // Cyan - complementary to blue
    'bg-gradient-to-r from-cyan-300 to-teal-400 bg-clip-text text-transparent',
    
    // Light Purple - soft contrast
    'bg-gradient-to-r from-violet-300 to-purple-400 bg-clip-text text-transparent',
    
    // Silver/Metallic
    'bg-gradient-to-r from-gray-300 to-slate-400 bg-clip-text text-transparent'
  ];

  useEffect(() => {
    let timeout;
    let i = 0;
    let isTyping = true;
    let isDeleting = false;

    const typeWriter = () => {
      if (isTyping) {
        if (i < fullText.length) {
          setDisplayText(fullText.substring(0, i + 1));
          i++;
          timeout = setTimeout(typeWriter, 100);
        } else {
          isTyping = false;
          isDeleting = true;
          timeout = setTimeout(typeWriter, 1500);
        }
      } else if (isDeleting) {
        if (i > 0) {
          setDisplayText(fullText.substring(0, i - 1));
          i--;
          timeout = setTimeout(typeWriter, 50);
        } else {
          isDeleting = false;
          isTyping = true;
          // Change color when restarting
          setCurrentColor((prev) => (prev + 1) % colors.length);
          timeout = setTimeout(typeWriter, 500);
        }
      }
    };

    typeWriter();

    return () => clearTimeout(timeout);
  }, [currentColor]);

  return (
    <h1 className={`text-4xl md:text-5xl font-bold mb-6 text-center tracking-tight ${colors[currentColor]}`}>
      {displayText}
      <span className="animate-pulse text-white">|</span>
    </h1>
  );
}