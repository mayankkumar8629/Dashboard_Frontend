
import AnimatedHeading from "./animatedHeading";
import GradientButton from "./gradientButton";

export default function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 space-y-8">
      <AnimatedHeading />
      <p className="text-lg md:text-xl text-neutral-300 max-w-xl leading-relaxed font-medium">
        All your data, strategy, and growth opportunities, powered together in one platform.
      </p>
      <GradientButton />
    </div>
  );
}
