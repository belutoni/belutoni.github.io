export default function Sheet02Experience() {
  const experiences = [
    {
      id: "01",
      institution: "University of Bucharest",
      role: "B.Sc. in Computer Science (1st Year, Olympiad Class)",
      period: "2025-Present",
      metrics: "Admission Exam score: 10/10 | Informatics Baccalaureate: 10/10."
    },
    {
      id: "02",
      institution: "NXP Semiconductors - Kernel Summer School",
      role: "Embedded Linux Kernel Intern / Participant",
      period: "Summer 2026",
      metrics: "Won 1st place in the hackathon. Ranked 1st in 2/3 competitive technical assessments evaluating Linux kernel subsystem internals."
    },
    {
      id: "03",
      institution: "Politehnica Bucharest - ARM Summer School",
      role: "Systems & Firmware Engineering",
      period: "Summer 2026",
      metrics: "Built an ARMv8 Firmware Image Package (FIP) with U-Boot, TF-A, and OP-TEE for NXP i.MX93 via SDP. Built custom ARM64 Linux kernels and rootfs using Buildroot & debootstrap."
    }
  ];

  return (
    <section id="experience" className="mb-4">
      <div className="flex justify-between items-end border-b border-slate-border pb-2 mb-8 text-slate-muted text-xs uppercase tracking-widest">
        <span>SHEET 02 / EDUCATION</span>
      </div>
      
      <h2 className="text-2xl mb-10 text-slate-300">Academic & Industry Foundation</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="border border-slate-border p-6 flex flex-col h-full hover:border-slate-500 transition-colors bg-[#0a101a] group">
            <div className="text-3xl font-bold text-slate-muted group-hover:text-foreground transition-colors mb-4">
              {exp.id}
            </div>
            
            <h3 className="text-lg font-bold text-foreground mb-2">
              {exp.institution}
            </h3>
            
            <div className="text-accent-teal text-sm mb-1">{exp.role}</div>
            <div className="text-slate-muted text-xs mb-4 uppercase">{exp.period}</div>
            
            <p className="text-sm text-slate-300 mt-auto pt-4 border-t border-slate-border/50">
              {exp.metrics}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
