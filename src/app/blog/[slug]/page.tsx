import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { getAllPosts, getPostBySlug } from '@/lib/blog';

// Generate static pages at build time
export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full max-w-3xl mx-auto px-6 md:px-12 py-12 md:py-24 relative">
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-teal/10 rounded-full blur-[120px] pointer-events-none z-[-1]" />
      
      <Link href="/blog" className="inline-flex items-center gap-2 text-slate-muted hover:text-accent-teal transition-colors text-sm uppercase tracking-widest mb-12">
        <ArrowLeft className="w-4 h-4" /> Back to Logs
      </Link>

      <header className="mb-6 border-b border-slate-border/50 pb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight break-words">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-slate-muted text-sm">
          <time>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          <span>•</span>
          <div className="flex gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 bg-slate-border/50 border border-slate-border uppercase">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      <article className="prose prose-sm md:prose-base w-full max-w-full overflow-hidden prose-invert prose-slate prose-headings:text-foreground prose-a:text-accent-teal hover:prose-a:text-accent-teal/80 text-slate-300 leading-loose break-words">
        <MarkdownRenderer content={post.content} />
      </article>
    </div>
  );
}
