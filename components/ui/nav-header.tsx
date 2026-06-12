"use client"; 

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface TabProps {
  key?: React.Key;
  children: React.ReactNode;
  setPosition: React.Dispatch<React.SetStateAction<{ left: number; width: number; opacity: number }>>;
  onClick?: () => void;
  scrolled?: boolean;
}

function NavHeader({ 
  tabs,
  scrolled = false,
}: { 
  tabs?: { label: string; onClick: () => void }[];
  scrolled?: boolean;
}) {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const defaultTabs = [
    { label: "Home", onClick: () => {} },
    { label: "Pricing", onClick: () => {} },
    { label: "About", onClick: () => {} },
    { label: "Services", onClick: () => {} },
    { label: "Contact", onClick: () => {} },
  ];

  const activeTabs = tabs || defaultTabs;

  return (
    <ul
      className={`relative mx-auto flex w-fit items-center gap-1 rounded-full border px-2 py-1 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "border-black/10 bg-white/35"
          : "border-white/15 bg-white/10"
      }`}
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      {activeTabs.map((tab, idx) => (
        <Tab key={idx} setPosition={setPosition} onClick={tab.onClick} scrolled={scrolled}>
          {tab.label}
        </Tab>
      ))}

      <Cursor position={position} scrolled={scrolled} />
    </ul>
  );
}

const Tab = ({
  children,
  setPosition,
  onClick,
  scrolled = false,
}: TabProps) => {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      onClick={onClick}
      className={`relative z-10 block cursor-pointer select-none px-3 py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition-opacity duration-300 hover:opacity-70 md:px-4 ${
        scrolled ? "text-primary" : "text-white mix-blend-difference"
      }`}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position, scrolled }: { position: any; scrolled: boolean }) => {
  return (
    <motion.li
      animate={position}
      className={`absolute bottom-1 z-0 h-px rounded-full transition-colors duration-300 ${
        scrolled ? "bg-primary" : "bg-white/80"
      }`}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    />
  );
};

export default NavHeader;
