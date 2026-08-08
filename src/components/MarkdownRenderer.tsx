"use client";

import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { Check, Copy } from 'lucide-react';

const PreBlock = ({ children, ...props }: any) => {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  // Extract language from the className of the <code> child
  let language = "text";
  const childArray = React.Children.toArray(children);
  if (childArray.length > 0) {
    const codeChild = childArray[0];
    if (React.isValidElement(codeChild)) {
      const element = codeChild as React.ReactElement<{ className?: string }>;
      if (element.props.className) {
        const match = /language-(\w+)/.exec(element.props.className);
        if (match) {
          language = match[1];
        }
      }
    }
  }

  const handleCopy = () => {
    if (preRef.current) {
      const text = preRef.current.innerText;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group rounded border border-slate-border bg-[#0a101a] my-6 overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 border-b border-slate-border/50 bg-[#0d141f]">
        <span className="text-[10px] uppercase text-slate-muted font-bold tracking-widest">{language}</span>
        <button 
          onClick={handleCopy} 
          className="text-slate-muted hover:text-accent-teal transition-colors flex items-center gap-1.5 text-xs"
          title="Copy code"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>
      <pre ref={preRef} className="p-4 overflow-x-auto text-sm bg-transparent m-0 border-none" {...props}>
        {children}
      </pre>
    </div>
  );
};

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        pre: PreBlock
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
