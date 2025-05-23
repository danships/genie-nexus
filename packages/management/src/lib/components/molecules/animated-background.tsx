'use client';

import type React from 'react';
import { useEffect, useState, useRef, ComponentType } from 'react';
import {
  IconBrain,
  IconCpu,
  IconDatabase,
  IconWorld,
  IconCode,
  IconSparkles,
  IconRobot,
  IconGitBranch,
  IconCircuitDiode,
  IconBinary,
} from '@tabler/icons-react';
import styles from './animated-background.module.css';

// Animation types
type AnimationType = 'glow' | 'move' | 'color' | 'pulse' | 'rotate';

// Element configuration
interface BackgroundElement {
  id: number;
  Icon: React.ElementType;
  position: {
    top: string;
    left: string;
  };
  size: number;
  baseOpacity: number;
  rotation: number;
  currentAnimation: AnimationType | null;
  animationDuration: number;
}

export function AnimatedBackground() {
  const [elements, setElements] = useState<BackgroundElement[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const animationTimersRef = useRef<number[]>([]);

  // Generate random elements on mount
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes to the media query
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    // Icons to use for background elements
    const icons = [
      IconBrain,
      IconCpu,
      IconDatabase,
      IconWorld,
      IconCode,
      IconSparkles,
      IconRobot,
      IconGitBranch,
      IconCircuitDiode,
      IconBinary,
    ];

    // Generate 15-25 random elements
    const count = Math.floor(Math.random() * 11) + 15;
    const newElements: BackgroundElement[] = [];

    for (let i = 0; i < count; i++) {
      newElements.push({
        id: i,
        Icon: icons[Math.floor(Math.random() * icons.length)] as ComponentType,
        position: {
          top: `${Math.random() * 90}%`,
          left: `${Math.random() * 90}%`,
        },
        size: Math.floor(Math.random() * 16) + 16, // 16-32px (slightly larger)
        baseOpacity: Math.random() * 0.2 + 0.1, // 0.1-0.3 (more visible)
        rotation: Math.floor(Math.random() * 360),
        currentAnimation: null,
        animationDuration: Math.floor(Math.random() * 3000) + 2000, // 2-5 seconds (longer)
      });
    }

    setElements(newElements);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      // Clear all animation timers on unmount
      animationTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  // Set up animation intervals
  useEffect(() => {
    if (prefersReducedMotion || elements.length === 0) return;

    // Clear any existing timers
    animationTimersRef.current.forEach(clearTimeout);
    animationTimersRef.current = [];

    // Function to animate a random element
    const animateRandomElement = () => {
      // Animation types
      const animationTypes: AnimationType[] = [
        'glow',
        'move',
        'color',
        'pulse',
        'rotate',
      ];

      // Select a random element that's not currently animating
      const availableElements = elements.filter(
        (el) => el.currentAnimation === null,
      );

      if (availableElements.length === 0) return;

      const elementIndex = Math.floor(Math.random() * availableElements.length);
      const elementId = availableElements[elementIndex]?.id;
      const animationType =
        animationTypes[Math.floor(Math.random() * animationTypes.length)];
      const duration = availableElements[elementIndex]?.animationDuration;

      // Update the element with the new animation
      setElements((prev) =>
        prev.map((el) =>
          el.id === elementId
            ? { ...el, currentAnimation: animationType ?? null }
            : el,
        ),
      );

      // Clear the animation after it completes
      const timerId = window.setTimeout(() => {
        setElements((prev) =>
          prev.map((el) =>
            el.id === elementId ? { ...el, currentAnimation: null } : el,
          ),
        );
      }, duration);

      animationTimersRef.current.push(timerId);
    };

    // Set up interval to trigger animations
    const intervalId = window.setInterval(() => {
      // 25% chance to animate an element each interval (more frequent)
      if (Math.random() < 0.25) {
        animateRandomElement();
      }
    }, 600); // Check more frequently

    return () => {
      clearInterval(intervalId);
      animationTimersRef.current.forEach(clearTimeout);
    };
  }, [elements, prefersReducedMotion]);

  // Get animation class based on animation type
  const getAnimationClass = (animation: AnimationType | null): string => {
    if (!animation) {
      return '';
    }
    return styles[animation] ?? '';
  };

  return (
    <div className={styles['background']}>
      {elements.map((element) => {
        const isAnimating = element.currentAnimation !== null;
        const elementStyle: React.CSSProperties = {
          top: element.position.top,
          left: element.position.left,
          opacity: isAnimating
            ? Math.min(element.baseOpacity * 4, 0.8)
            : element.baseOpacity, // Much more visible when animating
          transform: `rotate(${element.rotation}deg)`,
          transition: 'opacity 0.5s ease',
          color:
            isAnimating && element.currentAnimation === 'color'
              ? 'var(--highlight-color)'
              : 'var(--icon-color)',
          animationDuration: `${element.animationDuration}ms`,
        };

        return (
          <div
            key={element.id}
            className={`${styles['element']} ${getAnimationClass(element.currentAnimation)}`}
            style={elementStyle}
          >
            <element.Icon size={element.size} />
          </div>
        );
      })}
    </div>
  );
}
