import { ReactNode } from "react";
import { motion } from "motion/react"

interface InfosProps {
  icon: ReactNode;
  bgIcon: string;
  title: string;
  description: string;
}

export function CardInfo({ title, description, icon, bgIcon }: InfosProps) {
  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.02,
        boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
      }}
      className="bg-white rounded-md p-6 shadow-xl"
      data-aos="fade-up"
    >
      <div
        className={`rounded-full w-14 h-14 flex items-center justify-center mb-4 ${bgIcon}`}
      >
        {icon}
      </div>

      <span className="font-semibold text-xl">{title}</span>

      <p className="text-sm text-gray-700 mt-4">{description}</p>
    </motion.div>
  );
}
