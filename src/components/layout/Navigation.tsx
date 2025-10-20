'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { TypingAnimation } from '@/components/ui/TypingAnimation'

const navigation = [
 {
  name: 'ホーム',
  href: '/',
  hasSubmenu: false
 },
 {
  name: 'サービス',
  href: '/services',
  hasSubmenu: true,
  submenu: [
   { name: '映像制作', href: '/services/movie', description: '企業VP・採用動画' },
   { name: '写真撮影', href: '/services/photo', description: 'イベント・商品撮影' },
   { name: 'Web制作', href: '/services/web', description: 'サイト企画・制作' }
  ]
 },
 {
  name: '撮影事例',
  href: '/portfolio',
  hasSubmenu: false
 },
 {
  name: '会社概要',
  href: '/about',
  hasSubmenu: false
 },
 {
  name: '料金',
  href: '/pricing',
  hasSubmenu: false
 },
]

export function Navigation() {
 const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

 return (
  <motion.nav 
   initial={{ y: -100 }}
   animate={{ y: 0 }}
   transition={{ delay: 0.2, duration: 0.8 }}
   className="fixed top-0 w-full bg-black/20 backdrop-blur-xl border-b border-yellow-400/20 z-50"
  >
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
     {/* Logo */}
     <motion.div 
      className="flex-shrink-0 "
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400 }}
     >
      <Link href="/" className="text-2xl font-bold text-yellow-400 tracking-wide font-mono">
       <span className="text-white">&lt;</span>
       <TypingAnimation 
        text="NonTurn" 
        delay={1000}
        duration={150}
        showCursor={false}
        className="eng-only"
       />
       <span className="text-white">/&gt;</span>
      </Link>
     </motion.div>

     {/* Desktop Navigation */}
     <div className="hidden md:flex items-center space-x-8">
      {navigation.map((item) => (
       <div
        key={item.name}
        className="relative"
        onMouseEnter={() => item.hasSubmenu && setActiveSubmenu(item.name)}
        onMouseLeave={() => setActiveSubmenu(null)}
       >
        <Link
         href={item.href}
         className="text-gray-300 hover:text-yellow-400 font-medium text-sm uppercase tracking-wider transition-colors duration-300 relative group"
        >
         <motion.span
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 400 }}
         >
          {item.name}
          {item.hasSubmenu && (
           <span className="ml-1 text-xs">▼</span>
          )}
         </motion.span>
         <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
        </Link>

        {/* Submenu */}
        <AnimatePresence>
         {item.hasSubmenu && activeSubmenu === item.name && (
          <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: 10 }}
           transition={{ duration: 0.2 }}
           className="absolute top-full left-0 mt-2 w-64 bg-black/90 backdrop-blur-xl border border-yellow-400/20 rounded-lg shadow-xl"
          >
           {item.submenu?.map((subItem) => (
            <Link
             key={subItem.name}
             href={subItem.href}
             className="block px-4 py-3 hover:bg-yellow-400/10 transition-colors duration-300 group"
            >
             <div className="text-white group-hover:text-yellow-400 font-medium">
              {subItem.name}
             </div>
             <div className="text-gray-400 text-sm">
              {subItem.description}
             </div>
            </Link>
           ))}
          </motion.div>
         )}
        </AnimatePresence>
       </div>
      ))}

      {/* Contact Button */}
      <motion.div
       whileHover={{ scale: 1.05 }}
       whileTap={{ scale: 0.95 }}
      >
       <Link
        href="/contact"
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-2 font-medium text-sm uppercase tracking-wider hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 relative overflow-hidden group"
       >
        <span className="relative z-10">お問い合わせ</span>
        <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
       </Link>
      </motion.div>
     </div>

     {/* Mobile menu button */}
     <div className="md:hidden">
      <motion.button
       onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
       className="relative w-12 h-12 flex items-center justify-center group"
       whileHover={{ scale: 1.05 }}
       whileTap={{ scale: 0.95 }}
      >
       <span className="sr-only">メニューを開く</span>
       
       {/* Glow effect background */}
       <motion.div 
         className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"
         animate={{
           scale: isMobileMenuOpen ? [1, 1.2, 1] : 1,
         }}
         transition={{
           duration: 0.5,
           repeat: isMobileMenuOpen ? Infinity : 0,
           repeatType: "reverse"
         }}
       />
       
       {/* Button container with border */}
       <div className="relative w-full h-full bg-black/50 backdrop-blur-sm border border-yellow-400/30 rounded-lg group-hover:border-yellow-400/60 transition-all duration-300 overflow-hidden">
         
         {/* Animated gradient background */}
         <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
         
         {/* Hamburger lines container */}
         <div className="absolute inset-0 flex items-center justify-center">
           <div className="relative w-6 h-5">
             {/* Top line */}
             <motion.span
               className="absolute left-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]"
               style={{ width: '24px' }}
               initial={{ top: '0px' }}
               animate={{
                 rotate: isMobileMenuOpen ? 45 : 0,
                 y: isMobileMenuOpen ? 10 : 0,
                 width: isMobileMenuOpen ? '28px' : '24px',
               }}
               transition={{ duration: 0.3, ease: "easeInOut" }}
             />
             
             {/* Middle line */}
             <motion.span
               className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]"
               initial={{ width: '24px' }}
               animate={{
                 opacity: isMobileMenuOpen ? 0 : 1,
                 width: isMobileMenuOpen ? 0 : '18px',
                 x: isMobileMenuOpen ? 10 : 0,
               }}
               transition={{ duration: 0.3, ease: "easeInOut" }}
             />
             
             {/* Bottom line */}
             <motion.span
               className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]"
               style={{ width: '24px' }}
               animate={{
                 rotate: isMobileMenuOpen ? -45 : 0,
                 y: isMobileMenuOpen ? -10 : 0,
                 width: isMobileMenuOpen ? '28px' : '24px',
               }}
               transition={{ duration: 0.3, ease: "easeInOut" }}
             />
           </div>
         </div>
         
         {/* Corner accents */}
         <motion.div 
           className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-yellow-400/50"
           animate={{
             opacity: isMobileMenuOpen ? 0 : [0.5, 1, 0.5],
           }}
           transition={{
             duration: 2,
             repeat: Infinity,
             ease: "easeInOut"
           }}
         />
         <motion.div 
           className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-yellow-400/50"
           animate={{
             opacity: isMobileMenuOpen ? 0 : [0.5, 1, 0.5],
           }}
           transition={{
             duration: 2,
             repeat: Infinity,
             ease: "easeInOut",
             delay: 1
           }}
         />
       </div>
      </motion.button>
     </div>
    </div>
   </div>

   {/* Mobile menu */}
   <AnimatePresence>
    {isMobileMenuOpen && (
     <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="md:hidden bg-black/95 backdrop-blur-xl border-t border-yellow-400/20"
     >
      <div className="px-4 py-6 space-y-4">
       {navigation.map((item) => (
        <div key={item.name}>
         <Link
          href={item.href}
          className="block text-white hover:text-yellow-400 font-medium text-lg transition-colors duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
         >
          {item.name}
         </Link>
         {item.hasSubmenu && (
          <div className="ml-4 mt-2 space-y-2">
           {item.submenu?.map((subItem) => (
            <Link
             key={subItem.name}
             href={subItem.href}
             className="block text-gray-400 hover:text-yellow-400 transition-colors duration-300"
             onClick={() => setIsMobileMenuOpen(false)}
            >
             {subItem.name}
            </Link>
           ))}
          </div>
         )}
        </div>
       ))}
      </div>
     </motion.div>
    )}
   </AnimatePresence>
  </motion.nav>
 )
}