import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 mb-8 bg-transparent">
      <div className="font-bold tracking-wider mb-4 md:mb-0">
        BELUXO / DEV
      </div>
      <div className="flex flex-wrap gap-6 text-slate-muted">
        <Link href="#contact" className="hover:text-foreground transition-colors">CONTACT</Link>
        <Link href="#work" className="hover:text-foreground transition-colors">WORK</Link>
        <Link href="#experience" className="hover:text-foreground transition-colors">EDUCATION</Link>
        <Link href="#contributions" className="hover:text-foreground transition-colors">CONTRIBUTIONS</Link>
        <Link href="#skills" className="hover:text-foreground transition-colors">SKILLS</Link>
      </div>
    </nav>
  );
}
