'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import type { Components } from 'react-markdown'

const components: Components = {
  a({ href, children }) {
    if (href && href.startsWith('/')) {
      return <Link href={href}>{children}</Link>
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  },
  table({ children }) {
    return (
      <div className="overflow-x-auto">
        <table>{children}</table>
      </div>
    )
  },
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-sm prose-neutral max-w-none break-words prose-p:my-1.5 prose-headings:mb-1 prose-headings:mt-2 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-a:font-medium prose-a:text-primary prose-strong:text-foreground prose-pre:my-2 prose-pre:rounded-lg prose-table:my-2 prose-img:my-2 prose-img:rounded-lg">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
