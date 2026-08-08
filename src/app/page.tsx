import NavBar from "@/components/NavBar";
import Sheet00Identity from "@/components/Sheet00Identity";
import Sheet01Projects from "@/components/Sheet01Projects";
import Sheet02Experience from "@/components/Sheet02Experience";
import Sheet03Contributions from "@/components/Sheet03Contributions";
import Sheet04Skills from "@/components/Sheet04Skills";

export default function Home() {
  return (
    <div className="min-h-screen max-w-6xl mx-auto px-6 md:px-12 lg:px-24 pb-8 relative">
      {/* Subtle Radial Glow for Aesthetics */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-teal/10 rounded-full blur-[120px] pointer-events-none z-[-1]" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-teal/5 rounded-full blur-[120px] pointer-events-none z-[-1]" />

      {/* Grid Overlay Effect (Optional, for blueprint aesthetic) */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-slate-border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-slate-border) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      <NavBar />
      
      <main className="flex flex-col gap-10 md:gap-16">
        <div className="animate-fade-up delay-100">
          <Sheet00Identity />
        </div>
        
        <div className="animate-fade-up delay-200">
          <Sheet01Projects />
        </div>
        
        <div className="animate-fade-up delay-100">
          <Sheet02Experience />
        </div>
        
        <div className="animate-fade-up delay-100">
          <Sheet03Contributions />
        </div>
        
        <div className="animate-fade-up delay-100">
          <Sheet04Skills />
        </div>
      </main>
      
      <footer className="pt-4 mt-8 flex justify-between items-center text-xs text-slate-muted uppercase tracking-widest">
        <span>© {new Date().getFullYear()} ANTONIE-GABRIEL BELU</span>
        <span>SYSTEMS / LOW-LEVEL</span>
      </footer>
    </div>
  );
}
