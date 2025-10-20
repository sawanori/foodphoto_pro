'use client'

import { useMemo } from 'react'
import { PricingCalculatorInputs, ServiceNavigation } from '@/types'

export function usePricingCalculator(
  selectedService: ServiceNavigation['id'],
  inputs: PricingCalculatorInputs
) {
  const estimatedPrice = useMemo(() => {
    if (selectedService !== 'movie') {
      return 50000 // Default for other services
    }
    
    // Base pricing by working time
    let basePrice = 220000 // Default 1 day
    if (inputs.workingTime === 'halfDay') {
      basePrice = 150000
    } else if (inputs.workingTime === 'multiDay') {
      basePrice = 400000 // 2 days base
    }
    
    let additionalCosts = 0
    
    // Video duration additional cost
    if (inputs.videoDuration === 'over5') {
      additionalCosts += basePrice * 0.3 // +30%
    }
    
    // Location scouting
    if (inputs.locationScouting) {
      additionalCosts += 55000
    }
    
    // Camera count
    if (inputs.cameraCount === 2) {
      additionalCosts += 50000
    } else if (inputs.cameraCount >= 3) {
      additionalCosts += 100000
    }
    
    // Lighting
    if (inputs.lighting) {
      additionalCosts += 30000
    }
    
    // Audio recording
    if (inputs.audio) {
      additionalCosts += 20000
    }
    
    // Editing level
    if (inputs.editing === 'advanced') {
      additionalCosts += basePrice * 0.5 // +50%
    }
    
    // Rush handling
    if (inputs.rush) {
      additionalCosts += (basePrice + additionalCosts) * 0.3 // +30% of total
    }
    
    return Math.round(basePrice + additionalCosts)
  }, [selectedService, inputs])

  const breakdown = useMemo(() => {
    if (selectedService !== 'movie') {
      return {
        basePrice: 50000,
        additionalCosts: [],
        total: 50000
      }
    }

    let basePrice = 220000
    if (inputs.workingTime === 'halfDay') {
      basePrice = 150000
    } else if (inputs.workingTime === 'multiDay') {
      basePrice = 400000
    }

    const additionalCosts = []

    if (inputs.videoDuration === 'over5') {
      additionalCosts.push({
        item: '動画時間延長（5分以上）',
        cost: Math.round(basePrice * 0.3)
      })
    }

    if (inputs.locationScouting) {
      additionalCosts.push({
        item: 'ロケハン',
        cost: 55000
      })
    }

    if (inputs.cameraCount === 2) {
      additionalCosts.push({
        item: 'カメラ2台',
        cost: 50000
      })
    } else if (inputs.cameraCount >= 3) {
      additionalCosts.push({
        item: 'カメラ3台以上',
        cost: 100000
      })
    }

    if (inputs.lighting) {
      additionalCosts.push({
        item: '照明機材',
        cost: 30000
      })
    }

    if (inputs.audio) {
      additionalCosts.push({
        item: '音声収録',
        cost: 20000
      })
    }

    if (inputs.editing === 'advanced') {
      additionalCosts.push({
        item: 'アドバンス編集',
        cost: Math.round(basePrice * 0.5)
      })
    }

    const subtotal = basePrice + additionalCosts.reduce((sum, item) => sum + item.cost, 0)

    if (inputs.rush) {
      additionalCosts.push({
        item: 'お急ぎ対応（+30%）',
        cost: Math.round(subtotal * 0.3)
      })
    }

    return {
      basePrice,
      additionalCosts,
      total: estimatedPrice
    }
  }, [selectedService, inputs, estimatedPrice])

  return {
    estimatedPrice,
    breakdown
  }
}