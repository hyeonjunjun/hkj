"use client";

import { motion } from "framer-motion";
import { SHEET_ITEMS } from "@/constants/sheet-items";
import { SheetItem } from "@/components/SheetItem";
import { BlueDot } from "@/components/BlueDot";

export function ContactSheet() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 80px)",
        padding: "0 0 8px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 8,
          maxWidth: 1200,
          width: "100%",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {SHEET_ITEMS.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: index * 0.03,
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            style={{
              gridColumn: item.wide ? "span 2" : undefined,
              position: "relative",
            }}
          >
            {index === 0 && <BlueDot />}
            <SheetItem item={item} index={index} isFirst={index === 0} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ContactSheet;
