'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import projectsData from '@/data/projects.json';

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-8 py-24"
    >
      <div className="max-w-6xl w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-cyan text-sm md:text-base tracking-[0.3em] uppercase font-light mb-2">
            {'>'} SYSTEM.projects
          </h2>
          <div className="h-px w-24 bg-cyan" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold mb-16 text-text"
        >
          active deployments
        </motion.h3>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectsData.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              className="group relative"
            >
              {/* Project Card */}
              <div className="relative border border-crimson/30 p-6 transition-all duration-200 hover:border-crimson hover:bg-crimson/5" style={{ backgroundColor: '#080808' }}>
                {/* CRT distortion on hover */}
                {hoveredProject === project.id && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 border-2 border-cyan/50 pointer-events-none"
                    style={{
                      boxShadow: '0 0 20px rgba(0, 255, 213, 0.3)',
                    }}
                  />
                )}

                {/* Status Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div
                    className={`w-2 h-2 ${
                      project.status === 'active'
                        ? 'bg-crimson animate-pulse'
                        : project.status === 'published'
                        ? 'bg-cyan'
                        : 'bg-text-dim'
                    }`}
                  />
                  <span className="text-xs text-text-dim uppercase tracking-wider">
                    {project.status}
                  </span>
                </div>

                {/* Title - Flickers between code and plain */}
                <div className="mb-4 min-h-[3rem]">
                  <h4 className="text-xl md:text-2xl font-bold">
                    <motion.span
                      className="inline-block text-text group-hover:text-crimson transition-colors"
                      animate={
                        hoveredProject === project.id
                          ? {
                              opacity: [1, 0, 1],
                              transition: { duration: 0.3, repeat: 2 },
                            }
                          : {}
                      }
                    >
                      {project.name}
                    </motion.span>
                  </h4>
                </div>

                {/* Description */}
                <p className="text-text-dim text-sm md:text-base mb-6 leading-relaxed group-hover:text-text transition-colors">
                  {project.purpose}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-3 py-1 border border-cyan/40 text-cyan font-mono hover:bg-cyan/10 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Scanline effect on hover */}
                <motion.div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      'repeating-linear-gradient(0deg, transparent 0px, rgba(255, 0, 51, 0.03) 1px, transparent 2px)',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 text-text-dim text-xs md:text-sm font-mono"
        >
          <p className="flicker-slow">
            [DEPLOYMENT_STATUS] :: all systems operational :: uptime: 99.97% ::
            reconstructing reality one function at a time
          </p>
        </motion.div>
      </div>
    </section>
  );
}

