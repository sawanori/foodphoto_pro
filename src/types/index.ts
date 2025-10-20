export interface Portfolio {
  id: string
  title: string
  category: string
  description: string
  videoUrl?: string
  thumbnailUrl: string
  clientName: string
  year: number
  tags: string[]
  featured: boolean
}

export interface Service {
  id: string
  title: string
  subtitle: string
  description: string
  detailedDescription: string
  icon: string
  gradient: string
  basePrice?: number
  currency?: string
  priceNote?: string
  features?: string[]
  plans?: ServicePlan[]
  process?: ProcessStep[]
  types?: ServiceType[]
  categories?: ServiceCategory[]
  additionalCosts?: AdditionalCost[]
  services?: WebService[]
  technologies?: Technology[]
}

export interface ServicePlan {
  name: string
  basePrice: number
  duration: string
  deliveryTime: string
  description: string
  includes: string[]
  additionalHour: number
}

export interface ProcessStep {
  step: number
  title: string
  duration: string
  description: string
  details?: string[]
  price?: string
  icon: string
  deliverables?: string[]
}

export interface ServiceType {
  name: string
  description: string
  examples: string[]
}

export interface ServiceCategory {
  name: string
  description: string
  examples: string[]
}

export interface AdditionalCost {
  item: string
  price: string
}

export interface WebService {
  name: string
  description: string
  features: string[]
}

export interface Technology {
  category: string
  tools: string[]
}

export interface Company {
  name: string
  establishedYear: number
  employeeCount: number
  location: string
  description: string
  mission: string
  vision: string
  values: string[]
}

export interface TeamMember {
  id: string
  name: string
  position: string
  image: string
  bio: string
  skills: string[]
  experience: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface ContactForm {
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  service?: string
  budget?: string
}

export interface PricingCalculatorInputs {
  workingTime: 'halfDay' | 'fullDay' | 'multiDay'
  videoDuration: 'under5' | 'over5'
  locations: number
  locationScouting: boolean
  cameraCount: number
  lighting: boolean
  audio: boolean
  editing: 'basic' | 'advanced'
  rush: boolean
}

export interface ServiceNavigation {
  id: 'movie' | 'photo' | 'web'
  name: string
  icon: string
  color: string
  description: string
}

export interface AnimationVariants {
  hidden: Record<string, unknown>
  visible: Record<string, unknown>
}

export interface MotionProps {
  initial?: string | Record<string, unknown>
  animate?: string | Record<string, unknown>
  exit?: string | Record<string, unknown>
  transition?: Record<string, unknown>
  variants?: Record<string, AnimationVariants>
}