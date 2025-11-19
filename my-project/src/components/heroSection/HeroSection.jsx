import AnimatedHeading from "./animatedHeading.jsx";
import GradientButton from "./gradientButton.jsx";


export default function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 space-y-8">
  <AnimatedHeading />
  <p className="text-lg md:text-xl text-neutral-300 max-w-xl leading-relaxed font-medium">
    Describe your UI in plain English. Get clean, editable code.
  </p>
  <GradientButton />
</div>
  );
}