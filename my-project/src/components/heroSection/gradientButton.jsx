import { useNavigate } from 'react-router-dom';

export default function GradientButton() {
  const navigate=useNavigate();
  
  const handleClick=()=>{
    navigate('/dashboard');
  }
  return (
    <button
    onClick={handleClick}
     className="
      px-6 py-3 
      text-base 
      font-semibold 
      text-white 
      rounded-xl 
      relative 
      overflow-hidden 
      group
      border-2
      border-blue-400
      bg-black
      hover:border-blue-500
      hover:bg-black/90
      transition-all
      duration-300
      flex items-center justify-center gap-2
      shadow-lg
      shadow-blue-500/20
    ">
      {/* Animated glow effect */}
      <span className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" />
      
      {/* Button content */}
      <span className="relative z-10 flex items-center">
        🚀 Generate Now
      </span>

      {/* Subtle blue glow */}
      <span className="absolute -inset-1 rounded-xl bg-blue-500 blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
    </button>
  );
}