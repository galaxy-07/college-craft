
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedTransitionProps {
  children: ReactNode;
  className?: string;
  animationType?: "fade" | "slide" | "scale" | "none";
  duration?: number;
  delay?: number;
}

const AnimatedTransition = ({
  children,
  className,
  animationType = "fade",
  duration = 300,
  delay = 0,
}: AnimatedTransitionProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationClass = () => {
    if (!isVisible) return "opacity-0";
    
    switch (animationType) {
      case "fade":
        return "animate-fade-in";
      case "slide":
        return "animate-slide-in-right";
      case "scale":
        return "animate-scale-in";
      case "none":
      default:
        return "opacity-100";
    }
  };

  return (
    <div
      className={cn(
        getAnimationClass(),
        "transition-all",
        className
      )}
      style={{ 
        transitionDuration: `${duration}ms`,
        animationDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;
