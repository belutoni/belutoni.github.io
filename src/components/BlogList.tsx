"use client";

import { useState } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog';
import { Search } from 'lucide-react';

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags))).sort();

  // Filter posts based on search query and selected tag
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div>
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-muted" />
          </div>
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full bg-[#0a101a] border border-slate-border text-foreground pl-10 pr-4 py-3 focus:outline-none focus:border-accent-teal transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button 
            onClick={() => setSelectedTag(null)}
            className={`text-xs px-3 py-1.5 border transition-colors cursor-pointer ${selectedTag === null ? 'bg-accent-teal/10 border-accent-teal text-accent-teal' : 'bg-[#0a101a] border-slate-border text-slate-muted hover:border-slate-500'}`}
          >
            ALL
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`text-xs px-3 py-1.5 border transition-colors uppercase cursor-pointer ${selectedTag === tag ? 'bg-accent-teal/10 border-accent-teal text-accent-teal' : 'bg-[#0a101a] border-slate-border text-slate-muted hover:border-slate-500'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="text-xs text-slate-muted tracking-widest uppercase mb-2">
        Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'}
      </div>

      {/* Posts List */}
      <div className="flex flex-col gap-6">
        {filteredPosts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`}
            className="group border border-slate-border p-6 hover:border-slate-500 transition-colors bg-[#0a101a] block relative"
          >
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent-teal opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent-teal opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex flex-col gap-1 mb-4">
              <h2 className="text-xl font-bold text-foreground group-hover:text-accent-teal transition-colors">
                {post.title}
              </h2>
              <time className="text-slate-muted text-xs">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-1 bg-slate-border/50 text-slate-muted border border-slate-border uppercase">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
        
        {filteredPosts.length === 0 && (
          <div className="text-slate-muted italic py-8 text-center border border-dashed border-slate-border">
            No articles found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
