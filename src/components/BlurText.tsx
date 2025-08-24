import { motion } from "framer-motion";

interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export default function BlurText({
  text,
  delay = 0.15,
  animateBy = "words",
  direction = "top",
  className = "",
}: BlurTextProps) {
  // 👇 split into words and <br /> separately using regex
  const items = text.split(/(<br\s*\/?>|\s+)/);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: delay },
    },
  };

  const directions = {
    top: { y: 20, opacity: 0, filter: "blur(10px)" },
    bottom: { y: -20, opacity: 0, filter: "blur(10px)" },
    left: { x: 20, opacity: 0, filter: "blur(10px)" },
    right: { x: -20, opacity: 0, filter: "blur(10px)" },
  };

  const child = {
    hidden: directions[direction],
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.span
      className={`inline-block overflow-hidden ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, i) => {
        if (item.match(/<br\s*\/?>/)) {
          return <br key={i} />;
        }

        if (item.trim() === "") {
          return " "; // preserve spaces
        }

        return (
          <motion.span key={i} variants={child} className="inline-block mr-1">
            {item}
          </motion.span>
        );
      })}
    </motion.span>
  );
}
