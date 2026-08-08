export default function Sheet02Experience() {
  const experiences = [
    {
      id: "01",
      institution: "University of Bucharest",
      role: "B.Sc. in Computer Science (1st Year, Olympiad Class)",
      period: "2025-Present",
      metrics: [
        "Academic performance: Admission Exam score: 10/10. Informatics Baccalaureate grade: 10/10."
      ]
    },
    {
      id: "02",
      institution: "NXP Semiconductors - Kernel Summer School",
      role: "Embedded Linux Kernel Intern",
      period: "Summer 2026",
      metrics: [
        "1st Place Hackathon Winner: Developed an interactive retro system monitor for NXP i.MX93.",
        "Engineered custom kernel drivers (SPI ST7789, I2C BMP280) with fixed-point calibration and hardware interrupts.",
        "Ranked 1st in competitive technical assessments on Linux kernel internals."
      ]
    },
    {
      id: "03",
      institution: "Politehnica Bucharest - ARM Summer School",
      role: "Systems & Firmware Engineering",
      period: "Summer 2026",
      metrics: [
        "Built and deployed an ARMv8 Firmware Image Package (U-Boot, TF-A, OP-TEE) for the NXP i.MX93.",
        "Configured and compiled custom ARM64 Linux kernels and Debian/Buildroot filesystems.",
        "Implemented A/B redundant partitioning schemes and automated U-Boot environments."
      ]
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
            
            <ul className="text-sm text-slate-300 mt-auto pt-4 border-t border-slate-border/50 list-none space-y-2">
              {exp.metrics.map((metric, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-accent-teal">›</span>
                  <span>{metric}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
