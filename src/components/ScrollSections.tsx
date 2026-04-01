'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrollSections() {
  const identityRef = useRef<HTMLElement>(null);
  const systemsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Identity section animation
      if (identityRef.current) {
        const lines = identityRef.current.querySelectorAll('.identity-line');
        gsap.from(lines, {
          opacity: 0,
          y: 30,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: identityRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      // Systems cards animation
      if (systemsRef.current) {
        const cards = systemsRef.current.querySelectorAll('.system-card');
        gsap.from(cards, {
          opacity: 0,
          y: 50,
          scale: 0.95,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: systemsRef.current,
            start: 'top 70%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      // Contact section animation
      if (contactRef.current) {
        gsap.from(contactRef.current.children, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: contactRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative z-10">
      {/* Identity Section */}
      <section 
        ref={identityRef}
        id="identity"
        className="min-h-screen flex flex-col items-center justify-center px-8 py-20"
      >
        <div className="max-w-4xl w-full">
          <h1 className="identity-line font-mono text-4xl md:text-6xl lg:text-7xl font-bold text-[#00ff88] mb-6 glow-text">
            GALLUPPI.AI
          </h1>
          <p className="identity-line text-xl md:text-2xl lg:text-3xl text-[#e0e0e0] mb-4">
            AI Systems Architecture.
          </p>
          <p className="identity-line text-xl md:text-2xl lg:text-3xl text-[#e0e0e0] mb-4">
            Telehealth Infrastructure.
          </p>
          <p className="identity-line text-xl md:text-2xl lg:text-3xl text-[#e0e0e0]">
            Strategic Leverage.
          </p>
        </div>
      </section>

      {/* Systems Section */}
      <section 
        ref={systemsRef}
        id="systems"
        className="min-h-screen flex flex-col items-center justify-center px-8 py-20"
      >
        <div className="max-w-6xl w-full">
          <h2 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold text-[#00ff88] mb-12 glow-text">
            SYSTEMS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* AiDoc */}
            <div className="system-card group relative bg-[#111111] border border-[#00ff88]/30 p-8 hover:border-[#00d4ff] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] perspective-card">
              <div className="scanline-overlay" />
              <h3 className="font-mono text-2xl font-bold text-[#00ff88] group-hover:text-[#00d4ff] mb-4 transition-colors">
                AiDoc
              </h3>
              <p className="text-[#e0e0e0] mb-4">
                AI-powered clinical infrastructure. Real-time patient monitoring, diagnostic assistance, and workflow automation.
              </p>
              <div className="font-mono text-sm text-[#666666]">
                &gt; STATUS: <span className="text-[#00ff88]">ACTIVE</span>
              </div>
            </div>

            {/* Stardust */}
            <div className="system-card group relative bg-[#111111] border border-[#00ff88]/30 p-8 hover:border-[#00d4ff] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] perspective-card">
              <div className="scanline-overlay" />
              <h3 className="font-mono text-2xl font-bold text-[#00ff88] group-hover:text-[#00d4ff] mb-4 transition-colors">
                Stardust
              </h3>
              <p className="text-[#e0e0e0] mb-4">
                Conversion flow engine. Intelligent user journey optimization with predictive analytics and adaptive interfaces.
              </p>
              <div className="font-mono text-sm text-[#666666]">
                &gt; STATUS: <span className="text-[#00ff88]">ACTIVE</span>
              </div>
            </div>

            {/* OpenClaw */}
            <div className="system-card group relative bg-[#111111] border border-[#00ff88]/30 p-8 hover:border-[#00d4ff] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] perspective-card">
              <div className="scanline-overlay" />
              <h3 className="font-mono text-2xl font-bold text-[#00ff88] group-hover:text-[#00d4ff] mb-4 transition-colors">
                OpenClaw
              </h3>
              <p className="text-[#e0e0e0] mb-4">
                Autonomous agent framework. Multi-modal AI coordination, distributed task execution, and adaptive learning.
              </p>
              <div className="font-mono text-sm text-[#666666]">
                &gt; STATUS: <span className="text-[#00ff88]">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        ref={contactRef}
        id="contact"
        className="min-h-screen flex flex-col items-center justify-center px-8 py-20"
      >
        <div className="max-w-4xl w-full">
          <div className="font-mono text-lg md:text-xl text-[#00ff88] mb-8">
            $ connect --protocol=secure
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-[#666666] font-mono">EMAIL:</span>
              <a 
                href="mailto:stefan@galluppi.ai"
                className="text-[#00ff88] hover:text-[#00d4ff] transition-colors font-mono text-lg md:text-xl glow-text-sm"
              >
                stefan@galluppi.ai
              </a>
            </div>
            
            <div className="flex items-center gap-6 mt-8">
              <a
                href="https://github.com/stefangalluppi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ff88] hover:text-[#00d4ff] transition-colors font-mono text-lg hover:glow-text-sm"
              >
                [GITHUB]
              </a>
              <a
                href="https://linkedin.com/in/stefangalluppi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ff88] hover:text-[#00d4ff] transition-colors font-mono text-lg hover:glow-text-sm"
              >
                [LINKEDIN]
              </a>
            </div>
          </div>

          <div className="mt-16 font-mono text-sm text-[#666666]">
            &gt; Connection established. End transmission.
          </div>
        </div>
      </section>
    </div>
  );
}
