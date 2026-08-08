import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';

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

      <div className="flex flex-col gap-8">
        {posts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`}
            className="group border border-slate-border p-6 hover:border-slate-500 transition-colors bg-[#0a101a] block relative"
          >
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent-teal opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent-teal opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-2 mb-4">
              <h2 className="text-xl font-bold text-foreground group-hover:text-accent-teal transition-colors">
                {post.title}
              </h2>
              <time className="text-slate-muted text-sm shrink-0">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            
            <div className="flex gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-1 bg-slate-border/50 text-slate-muted border border-slate-border uppercase">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
        
        {posts.length === 0 && (
          <div className="text-slate-muted italic">No posts found. Add markdown files to src/content/blog to see them here.</div>
        )}
      </div>
    </div>
  );
}
