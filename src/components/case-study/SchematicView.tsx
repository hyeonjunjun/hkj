"use client";

import { motion } from "framer-motion";
import { Project } from "@/constants/projects";

export default function SchematicView({ project }: { project: Project }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-5xl mx-auto pt-40 px-6 font-mono text-sm"
        >
            <div className="border border-foreground/20 p-8 grid grid-cols-1 md:grid-cols-3 gap-12 bg-background/50 backdrop-blur-sm">

                {/* Col 1: Tech Stack */}
                <div className="space-y-4">
                    <h3 className="uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Tech Stack</h3>
                    <ul className="space-y-2">
                        {project.schematic.stack.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-primary rounded-full" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Col 2: Design Systems */}
                <div className="space-y-4">
                    <h3 className="uppercase tracking-widest text-muted-foreground border-b border-border pb-2">System Specs</h3>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                        <span className="text-muted-foreground">Grid:</span>
                        <span>{project.schematic.grid}</span>
                        <span className="text-muted-foreground">Type:</span>
                        <span>{project.schematic.typography}</span>
                    </div>
                </div>

                {/* Col 3: Palette */}
                <div className="space-y-4">
                    <h3 className="uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Palette</h3>
                    <div className="flex gap-2">
                        {project.schematic.colors.map((color) => (
                            <div key={color} className="group relative">
                                <div
                                    className="w-12 h-12 border border-border rounded-md shadow-sm"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="absolute top-full mt-2 left-0 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                                    {color}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <div className="mt-8 text-xs text-muted-foreground text-center">
            {"//"} END OF SCHEMATIC DATA
            </div>
        </motion.div>
    );
}
