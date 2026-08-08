export default function Sheet01Projects() {
  const projects = [
    {
      id: "01",
      title: "zisc-v - RISC-V Assembler",
      tags: ["ZIG", "DFA", "RISC-V"],
      description: "A high-performance assembler front end with explicit token lifetimes, manual allocation, and multi-base numeric parsing.",
      details: [
        "Designed and implemented a high-performance RISC-V assembly lexer in Zig using a Deterministic Finite Automaton (DFA) state machine to tokenize raw source code.",
        "Implemented lexing and parsing logic for registers, string literals, and numeric literals in binary, octal, decimal, and hexadecimal formats.",
        "Managed token lifetimes manually using Zig's allocator model and std.ArrayList to prevent memory leaks."
      ],
      link: "https://github.com/belutoni/zisc-v"
    },
    {
      id: "02",
      title: "Minimal x86 Operating System",
      tags: ["C++23", "NASM", "QEMU"],
      description: "A custom boot path into protected mode, a monolithic kernel, and a type-safe VGA text system.",
      details: [
        "Developed a monolithic x86 kernel and a custom bootloader in NASM Assembly to initialize the GDT, enable the A20 line, and transition the CPU to 32-bit Protected Mode.",
        "Built a type-safe VGA text-mode driver using C++23 concepts to enforce compile-time constraints on stream formatting."
      ],
      link: "https://github.com/belutoni/minimal-x86-os"
    }
  ];

  return (
    <section id="work" className="mb-4">
      <div className="flex justify-between items-end border-b border-slate-border pb-2 mb-8 text-slate-muted text-xs uppercase tracking-widest">
        <span>SHEET 01 / SELECTED PROJECTS</span>
      </div>
      
      <h2 className="text-2xl mb-10 text-slate-300">Systems, drawn from first principles.</h2>
      
      <div className="grid grid-cols-1 gap-12">
        {projects.map((project) => (
          <div key={project.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 group">
            <div className="md:col-span-2 text-accent-teal text-4xl md:text-5xl font-bold">
              {project.id}
            </div>
            
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="md:col-span-10 border border-slate-border p-6 relative hover:border-slate-500 transition-colors duration-300 bg-[#0a101a] block cursor-pointer">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent-teal opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent-teal opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <h3 className="text-xl font-bold text-foreground group-hover:text-accent-teal transition-colors">{project.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-slate-border/50 text-slate-muted border border-slate-border uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="text-foreground mb-4">
                {project.description}
              </p>
              
              <ul className="text-sm text-slate-muted list-none space-y-2 mt-4 pt-4 border-t border-slate-border/50">
                {project.details.map((detail, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-accent-teal">›</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
