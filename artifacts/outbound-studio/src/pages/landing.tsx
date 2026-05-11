import { FC } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Terminal } from "lucide-react";

const AGENTS = [
  "Prospector",
  "Strategist",
  "Builder",
  "Auditor",
  "Packager",
  "Persona Tester",
  "Conductor"
];

const PipelineNode = ({ name, index }: { name: string; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="flex flex-col items-center relative"
    >
      <motion.div
        animate={{ 
          borderColor: ["#3d3a39", "#ef6f2e", "#3d3a39"],
          backgroundColor: ["transparent", "#ef6f2e11", "transparent"]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          delay: index * 0.5,
          times: [0, 0.1, 1]
        }}
        className="w-16 h-16 rounded-md border-2 flex items-center justify-center bg-card z-10 relative"
      >
        <span className="font-mono text-xl">{index + 1}</span>
      </motion.div>
      <div className="mt-4 font-mono text-sm tracking-tight">{name}</div>
    </motion.div>
  );
};

const LandingPage: FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-white">
      {/* Header */}
      <header className="fixed top-0 w-full border-b border-border bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-mono font-bold tracking-tighter uppercase text-xl">
            Outbound<span className="text-accent">Studio</span>
          </div>
          <Link href="/sign-in" className="font-mono text-sm uppercase tracking-wider hover:text-accent transition-colors flex items-center gap-2">
            Access Console <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="max-w-4xl"
          >
            <h1 className="display-text mb-8">
              Autonomous web presence generation & outbound machine.
            </h1>
            <p className="subheading text-secondary-foreground max-w-2xl mb-12">
              A 7-agent crew that finds SMBs with weak digital footprints, builds a superior version of their site on spec, and sends an aggressive 7-day claim offer. 
            </p>
            <Link href="/sign-in" className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-mono uppercase tracking-wider text-sm hover:bg-accent hover:text-white transition-colors">
              Initialize Machine <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>

        {/* Pipeline Diagram */}
        <section className="border-y border-border bg-card py-24 mb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border -translate-y-12" />
            <div className="flex justify-between items-start relative z-10">
              {AGENTS.map((agent, i) => (
                <PipelineNode key={agent} name={agent} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* AEO Section */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="heading-lg mb-6">Structural Invisibility</h2>
              <div className="p-6 border border-border bg-card font-mono text-sm leading-relaxed mb-6">
                <Terminal className="w-5 h-5 mb-4 text-accent" />
                "Right now, when someone asks ChatGPT for the best service in your city, your website is structurally invisible to it..."
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <p className="body-text text-secondary-foreground mb-6">
                Modern search is moving to LLM-based answers. Legacy SEO tactics don't format data for AI consumption. We build sites specifically engineered for Artificial Engine Optimization (AEO).
              </p>
              <p className="body-text text-secondary-foreground">
                Our agent swarm simulations test the site against actual AI models before shipping, ensuring empirical quality.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <h2 className="heading-lg mb-12 text-center">Unit Economics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-border p-8 bg-card">
              <div className="font-mono text-accent mb-2 uppercase text-xs tracking-wider">Tier 01</div>
              <div className="heading mb-4">Core Build</div>
              <div className="display-text text-3xl mb-8">$1,997</div>
              <ul className="space-y-4 font-mono text-sm text-secondary-foreground">
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-accent" /> Base generation</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-accent" /> 7-day claim window</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-accent" /> AEO structure</li>
              </ul>
            </div>
            <div className="border-2 border-primary p-8 bg-card relative">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground font-mono text-xs px-3 py-1 uppercase">Standard</div>
              <div className="font-mono text-accent mb-2 uppercase text-xs tracking-wider">Tier 02</div>
              <div className="heading mb-4">Premium</div>
              <div className="display-text text-3xl mb-8">$3,997</div>
              <ul className="space-y-4 font-mono text-sm text-secondary-foreground">
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-accent" /> Advanced features</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-accent" /> Custom integrations</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-accent" /> Deep AEO</li>
              </ul>
            </div>
            <div className="border border-border p-8 bg-card">
              <div className="font-mono text-accent mb-2 uppercase text-xs tracking-wider">Recurring</div>
              <div className="heading mb-4">Retainers</div>
              <div className="display-text text-3xl mb-8">$297<span className="text-lg text-secondary-foreground">/mo</span></div>
              <ul className="space-y-4 font-mono text-sm text-secondary-foreground">
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-accent" /> Hosting & Maintenace</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-accent" /> Monthly AI Audit</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
