import { FC, useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

interface SkillMeta {
  slug: string;
  name: string;
  description: string;
  agent: string;
  tags: string[];
}

const LandingNav = () => (
  <header className="border-b border-[#1a1a1a] bg-black/90 backdrop-blur-md sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
      <Link href="/">
        <span className="font-mono text-sm font-semibold uppercase tracking-tighter cursor-pointer">
          Outbound<span className="text-[#ea580c]">Studio</span>
        </span>
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/">
          <span className="font-mono text-[11px] text-[#555] hover:text-[#f0eeeb] uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back
          </span>
        </Link>
        <Link href="/sign-in">
          <button className="font-mono text-[11px] uppercase tracking-wider border border-[#282828] px-4 py-2 hover:border-[#ea580c] hover:text-[#ea580c] transition-colors text-[#f0eeeb]">
            Console
          </button>
        </Link>
      </div>
    </div>
  </header>
);

const SkillsPage: FC = () => {
  const [skills, setSkills] = useState<SkillMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/skills/index.json")
      .then((r) => r.json())
      .then((data) => { setSkills(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const agents = [...new Set(skills.map((s) => s.agent))];

  return (
    <div data-theme="dark" className="min-h-screen bg-[#000] text-[#f0eeeb]">
      <LandingNav />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="font-mono text-[11px] text-[#ea580c] uppercase tracking-widest mb-6">
          Skills Directory
        </div>
        <h1 className="display-text mb-4">Agent capabilities.</h1>
        <p className="text-[#555] text-sm font-mono mb-16 max-w-xl leading-relaxed">
          Each agent in the Outbound Studio pipeline is powered by a discrete, composable skill module.
          Browse the public reference documentation for each.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="border border-[#1e1e1e] bg-[#0a0a0a] p-6 animate-pulse h-36" />
            ))}
          </div>
        ) : skills.length === 0 ? (
          <div className="border border-[#1e1e1e] p-12 text-center font-mono text-[#444] text-sm">
            No skills found.
          </div>
        ) : (
          <div className="space-y-12">
            {agents.map((agent) => (
              <div key={agent}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-[#ea580c] text-[10px] uppercase tracking-widest">{agent}</span>
                  <div className="flex-1 h-px bg-[#1a1a1a]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#111] border border-[#111]">
                  {skills.filter((s) => s.agent === agent).map((skill) => (
                    <Link key={skill.slug} href={`/skills/${skill.slug}`}>
                      <div className="bg-[#000] p-6 hover:bg-[#0a0a0a] cursor-pointer transition-colors group flex flex-col gap-3 h-full">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-mono text-[11px] uppercase tracking-wider text-[#f0eeeb]">
                            {skill.name}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#333] group-hover:text-[#ea580c] transition-colors shrink-0 mt-0.5" />
                        </div>
                        <p className="text-[#555] text-[12px] leading-relaxed flex-1">{skill.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {skill.tags.map((tag) => (
                            <span key={tag} className="font-mono text-[9px] uppercase tracking-wider text-[#333] border border-[#1e1e1e] px-2 py-0.5">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-[#111] py-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="font-mono text-[10px] text-[#333] uppercase tracking-wider">
            Outbound Studio · Skills Reference
          </div>
          <Link href="/">
            <span className="font-mono text-[11px] text-[#444] hover:text-[#ea580c] cursor-pointer uppercase tracking-wider transition-colors flex items-center gap-1.5">
              <ExternalLink className="w-3 h-3" /> Back to home
            </span>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default SkillsPage;
