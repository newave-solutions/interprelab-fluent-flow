import { Headphones } from "lucide-react";

export const DarkSection = () => {
  return (
    <section className="py-20 bg-stone-900 text-stone-100">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
          <div className="p-2 bg-stone-800 rounded-full text-nobel-gold">
            <Headphones size={20} />
          </div>
          <span className="text-xs font-bold tracking-widest uppercase text-stone-400">
            The Interpreter's Challenge
          </span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl mb-6 text-white leading-tight">
              The Reality of Medical Interpretation
            </h2>
            <p className="text-xl text-stone-400 mb-8 font-light leading-relaxed">
              Behind every successful healthcare interaction lies the critical work of skilled interpreters facing unprecedented challenges in today's evolving medical landscape.
            </p>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="mt-1 min-w-[24px] text-nobel-gold font-serif text-xl">01</div>
                <div>
                  <h4 className="font-bold text-white mb-1">A Vital Profession</h4>
                  <p className="text-sm text-stone-400">
                    Certified experts acting as the voice in critical life-or-death moments, bridging language barriers in healthcare settings.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 min-w-[24px] text-nobel-gold font-serif text-xl">02</div>
                <div>
                  <h4 className="font-bold text-white mb-1">Professional Development Gap</h4>
                  <p className="text-sm text-stone-400">
                    Limited access to affordable, high-quality training that meets the demands of modern medical interpretation.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 min-w-[24px] text-nobel-gold font-serif text-xl">03</div>
                <div>
                  <h4 className="font-bold text-white mb-1">Cognitive Overload</h4>
                  <p className="text-sm text-stone-400">
                    Managing complex terminology, emotional weight, and the pressure of accuracy in high-stakes medical situations.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-stone-800 rounded-xl p-8 border border-stone-700">
              <h3 className="font-serif text-2xl text-white mb-4">Our Mission</h3>
              <p className="text-stone-300 leading-relaxed mb-6">
                InterpreLab was built by interpreters who understand these challenges firsthand. We're creating AI-powered tools that don't replace human expertise—they enhance it.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-stone-400">
                  <div className="w-2 h-2 bg-nobel-gold rounded-full"></div>
                  <span>Affordable professional development</span>
                </div>
                <div className="flex items-center gap-2 text-stone-400">
                  <div className="w-2 h-2 bg-nobel-gold rounded-full"></div>
                  <span>Real-time AI assistance during calls</span>
                </div>
                <div className="flex items-center gap-2 text-stone-400">
                  <div className="w-2 h-2 bg-nobel-gold rounded-full"></div>
                  <span>Comprehensive performance tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
