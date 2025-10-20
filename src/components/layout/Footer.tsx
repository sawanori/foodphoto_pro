'use client'

import { motion } from 'framer-motion'

const services = [
  { name: '映像制作', href: '/services/movie' },
  { name: '写真撮影', href: '/services/photo' },
  { name: '飲食店撮影', href: '/services/photo/foodphoto', highlight: true },
  { name: 'Web制作', href: '/services/web' }
]
const company = ['会社概要', 'プライバシーポリシー', '利用規約', 'サイトマップ']
const socialLinks = [
 { name: 'Instagram', icon: 'I', color: 'from-pink-500 to-yellow-500', href: 'https://www.instagram.com/nonturn2022', isEnglish: true }
]

export function Footer() {
 return (
  <footer className="py-16 bg-black relative overflow-hidden">
   {/* Footer Background Animation */}
   <div className="absolute inset-0 opacity-10">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"></div>
    {Array.from({ length: 10 }, (_, i) => {
     const leftPos = ((Math.sin(i * 1.5) + 1) / 2) * 100
     const topPos = ((Math.cos(i * 2.1) + 1) / 2) * 100
     return (
      <motion.div
       key={i}
       className="absolute w-1 h-1 bg-yellow-400 rounded-full"
       style={{
        left: `${leftPos}%`,
        top: `${topPos}%`
       }}
       animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0]
       }}
       transition={{
        duration: 3,
        delay: i * 0.3,
        repeat: Infinity
       }}
      />
     )
    })}
   </div>
   
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
     <motion.div 
      className="col-span-1 md:col-span-2 fade-in"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
     >
      <motion.h3 
       className="text-3xl font-bold mb-4 text-white tracking-wider "
       whileHover={{ scale: 1.05 }}
       transition={{ type: "spring", stiffness: 400 }}
      >
       <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent eng-only">
        NonTurn.LLC
       </span>
      </motion.h3>
      <p className="text-gray-400 mb-6 leading-relaxed">
       映像制作とクリエイティブソリューションで<br />
       ビジネスの可能性を最大化します。
      </p>
      <div className="flex space-x-4">
       {socialLinks.map((social, index) => (
        <motion.a 
         key={social.name}
         href={social.href}
         target="_blank"
         rel="noopener noreferrer"
         className={`w-12 h-12 bg-gradient-to-r ${social.color} flex items-center justify-center text-white font-bold text-lg rounded-full hover:scale-110 transition-all duration-300 shadow-lg`}
         whileHover={{ 
          scale: 1.15,
          boxShadow: "0 10px 30px rgba(251, 191, 36, 0.3)"
         }}
         whileTap={{ scale: 0.95 }}
         initial={{ opacity: 0, scale: 0 }}
         whileInView={{ opacity: 1, scale: 1 }}
         viewport={{ once: true }}
         transition={{ duration: 0.5, delay: index * 0.1 }}
        >
         {social.icon}
        </motion.a>
       ))}
      </div>
     </motion.div>
     
     <motion.div 
      className="fade-in"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
     >
      <h4 className="text-lg font-semibold mb-4 text-yellow-400 uppercase tracking-wider">サービス</h4>
      <ul className="space-y-2 text-gray-400">
       {services.map((service, index) => (
        <motion.li 
         key={service.name}
         initial={{ opacity: 0, x: -20 }}
         whileInView={{ opacity: 1, x: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.5, delay: index * 0.1 }}
        >
         <motion.a 
          href={service.href} 
          className={`${service.highlight ? 'text-orange-400 font-semibold' : ''} hover:text-yellow-400 transition-colors duration-300 relative group flex items-center`}
          whileHover={{ x: 5 }}
         >
          {service.highlight && <span className="mr-2">🍽️</span>}
          {service.name}
          {service.highlight && <span className="ml-2 text-xs bg-orange-400/20 text-orange-400 px-2 py-1 rounded-full">NEW</span>}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
         </motion.a>
        </motion.li>
       ))}
      </ul>
     </motion.div>
     
     <motion.div 
      className="fade-in"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.4 }}
     >
      <h4 className="text-lg font-semibold mb-4 text-yellow-400 uppercase tracking-wider">会社情報</h4>
      <ul className="space-y-2 text-gray-400">
       {company.map((info, index) => (
        <motion.li 
         key={info}
         initial={{ opacity: 0, x: -20 }}
         whileInView={{ opacity: 1, x: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.5, delay: index * 0.1 }}
        >
         <motion.a 
          href={info === 'プライバシーポリシー' ? '/privacy' : info === '会社概要' ? '/about' : info === '利用規約' ? '/terms' : info === 'サイトマップ' ? '/sitemap' : '#'} 
          className="hover:text-yellow-400 transition-colors duration-300 relative group"
          whileHover={{ x: 5 }}
         >
          {info}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
         </motion.a>
        </motion.li>
       ))}
      </ul>
     </motion.div>
    </div>
    
    <motion.div 
     className="border-t border-yellow-400/20 pt-8 text-center text-gray-400 fade-in"
     initial={{ opacity: 0, y: 20 }}
     whileInView={{ opacity: 1, y: 0 }}
     viewport={{ once: true }}
     transition={{ duration: 0.8, delay: 0.6 }}
    >
     <p className="">
      &copy; 2025 
      <span className="text-yellow-400 font-semibold eng-only"> NonTurn.LLC</span>
      . <span lang="en" className="eng-only">All rights reserved.</span>
     </p>
     <motion.div
      className="mt-4 w-20 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto"
      animate={{ 
       scaleX: [1, 1.5, 1],
       opacity: [0.5, 1, 0.5]
      }}
      transition={{ duration: 3, repeat: Infinity }}
     />
    </motion.div>
   </div>
  </footer>
 )
}
