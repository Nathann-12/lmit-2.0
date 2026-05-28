import React from 'react';
import { motion } from 'framer-motion';

export const ScrollReveal = ({ children, className = '', delay = 0, yOffset = 50, direction = 'up' }) => {
  // Determine starting position based on direction
  const yStart = direction === 'up' ? yOffset : direction === 'down' ? -yOffset : 0;
  const xStart = direction === 'left' ? yOffset : direction === 'right' ? -yOffset : 0;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: yStart, x: xStart }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: delay / 1000, 
        ease: [0.16, 1, 0.3, 1] // Apple-like ease-out curve
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
