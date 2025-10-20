'use client'

import { useScroll, useTransform } from 'framer-motion'
import { RefObject } from 'react'

interface UseScrollAnimationOptions {
  offset?: ["start end", "end start"] | ["start start", "end end"] | [string, string]
  backgroundRange?: [string, string]
  headerRange?: [string, string]
}

export function useScrollAnimation(
  targetRef: RefObject<HTMLElement>,
  options: UseScrollAnimationOptions = {}
) {
  const {
    offset = ["start end", "end start"],
    backgroundRange = ["0%", "100%"],
    headerRange = ["0%", "30%"]
  } = options

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: offset as ["start end", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], backgroundRange)
  const headerY = useTransform(scrollYProgress, [0, 1], headerRange)
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.2])

  return {
    scrollYProgress,
    backgroundY,
    headerY,
    opacity,
    scale
  }
}