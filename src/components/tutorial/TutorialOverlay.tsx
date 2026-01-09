import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTutorial } from '@/contexts/TutorialContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Sparkles, MousePointer, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const TutorialOverlay: React.FC = () => {
  const { isActive, currentStep, currentStepIndex, totalSteps, nextStep, previousStep, skipTutorial } = useTutorial();
  const { t } = useLanguage();
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showKeyboardHint, setShowKeyboardHint] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive) return;
    
    switch (e.key) {
      case 'ArrowRight':
      case 'Enter':
        e.preventDefault();
        nextStep();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        previousStep();
        break;
      case 'Escape':
        e.preventDefault();
        skipTutorial();
        break;
    }
  }, [isActive, nextStep, previousStep, skipTutorial]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Show keyboard hint after a delay
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowKeyboardHint(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowKeyboardHint(false);
    }
  }, [isActive, currentStepIndex]);

  // Find and track the target element
  useEffect(() => {
    if (!isActive || !currentStep) {
      setTargetRect(null);
      return;
    }

    const updateTargetRect = () => {
      const element = document.querySelector(currentStep.targetSelector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    // Trigger animation on step change
    setIsAnimating(true);
    setShowKeyboardHint(false);
    const animTimer = setTimeout(() => setIsAnimating(false), 300);

    updateTargetRect();

    // Update on resize/scroll
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);

    // Observe for layout changes
    const observer = new MutationObserver(updateTargetRect);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
      observer.disconnect();
      clearTimeout(animTimer);
    };
  }, [isActive, currentStep]);

  if (!isActive || !currentStep || !targetRect) {
    return null;
  }

  const padding = 8;
  const spotlightStyle = {
    top: targetRect.top - padding,
    left: targetRect.left - padding,
    width: targetRect.width + padding * 2,
    height: targetRect.height + padding * 2,
  };

  // Calculate tooltip position
  const getTooltipPosition = () => {
    const tooltipWidth = 340;
    const tooltipHeight = 280;
    const offset = 16;

    let top = 0;
    let left = 0;

    switch (currentStep.position) {
      case 'right':
        top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
        left = targetRect.left + targetRect.width + offset + padding;
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
        left = targetRect.left - tooltipWidth - offset - padding;
        break;
      case 'bottom':
        top = targetRect.top + targetRect.height + offset + padding;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        break;
      case 'top':
        top = targetRect.top - tooltipHeight - offset - padding;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        break;
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 16) left = 16;
    if (left + tooltipWidth > viewportWidth - 16) left = viewportWidth - tooltipWidth - 16;
    if (top < 16) top = 16;
    if (top + tooltipHeight > viewportHeight - 16) top = viewportHeight - tooltipHeight - 16;

    return { top, left };
  };

  const tooltipPos = getTooltipPosition();

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Dark overlay with spotlight cutout */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={spotlightStyle.left}
              y={spotlightStyle.top}
              width={spotlightStyle.width}
              height={spotlightStyle.height}
              rx="8"
              fill="black"
              className={cn("transition-all duration-300", isAnimating && "animate-pulse")}
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#spotlight-mask)"
          className="pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        />
      </svg>

      {/* Spotlight highlight ring with pulse animation */}
      <div
        className={cn(
          "absolute rounded-lg transition-all duration-300",
          isAnimating && "animate-pulse"
        )}
        style={{
          top: spotlightStyle.top,
          left: spotlightStyle.left,
          width: spotlightStyle.width,
          height: spotlightStyle.height,
          boxShadow: '0 0 0 3px hsl(var(--primary)), 0 0 0 6px hsl(var(--primary) / 0.3), 0 0 30px 10px hsl(var(--primary) / 0.2)',
          pointerEvents: currentStep.isInteractive ? 'auto' : 'none',
        }}
      />

      {/* Interactive area indicator */}
      {currentStep.isInteractive && (
        <div
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            top: spotlightStyle.top,
            left: spotlightStyle.left,
            width: spotlightStyle.width,
            height: spotlightStyle.height,
          }}
        >
          <div className="absolute inset-0 border-2 border-dashed border-primary/50 rounded-lg animate-pulse" />
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
            <MousePointer className="w-3 h-3" />
            {t('tutorialTryIt')}
          </div>
        </div>
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={cn(
          "absolute w-[340px] bg-card border border-border rounded-xl shadow-2xl pointer-events-auto",
          "transition-all duration-300 ease-out",
          isAnimating ? "opacity-0 scale-95 translate-y-2" : "opacity-100 scale-100 translate-y-0"
        )}
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">{t(currentStep.titleKey)}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
            onClick={skipTutorial}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(currentStep.descriptionKey)}
          </p>
          
          {currentStep.isInteractive && currentStep.interactionHint && (
            <div className="bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/20 rounded-lg p-3">
              <p className="text-xs text-primary font-medium flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                {t(currentStep.interactionHint)}
              </p>
              <p className="text-xs text-primary/70">
                {t('tutorialClickToContinue')}
              </p>
            </div>
          )}

          {/* Keyboard hint */}
          {showKeyboardHint && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2 animate-fade-in">
              <Keyboard className="w-3 h-3" />
              {t('tutorialKeyboardHint')}
            </div>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 py-2 border-t border-border/50">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentStepIndex
                  ? "bg-primary w-6"
                  : index < currentStepIndex
                  ? "bg-primary/50"
                  : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30 rounded-b-xl">
          <span className="text-xs text-muted-foreground font-medium">
            {t('tutorialStep')} {currentStepIndex + 1} / {totalSteps}
          </span>
          
          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={previousStep}
                className="gap-1 h-8"
              >
                <ChevronLeft className="w-4 h-4" />
                {t('tutorialPrev')}
              </Button>
            )}
            
            <Button
              size="sm"
              onClick={nextStep}
              className="gap-1 h-8 min-w-[100px]"
            >
              {currentStepIndex === totalSteps - 1 ? t('tutorialFinish') : t('tutorialNext')}
              {currentStepIndex < totalSteps - 1 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;
