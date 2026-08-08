import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';
import BlogList from '@/components/BlogList';

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-24 relative">
      {/* Background glow for aesthetics */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-teal/10 rounded-full blur-[120px] pointer-events-none z-[-1]" />
      
      <div className="mb-12">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-muted hover:text-accent-teal transition-colors text-sm uppercase tracking-widest mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">LOGS & WRITINGS</h1>
        <p className="text-slate-300">Notes on systems programming, architecture, and exploration.</p>
      </div>

      <BlogList posts={posts} />
    </div>
  );
}
