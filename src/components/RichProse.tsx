'use client'

export default function RichProse({ html }: { html: string }) {
  return (
    <div
      className="prose prose-zinc max-w-none 
        prose-headings:scroll-mt-24 prose-headings:font-bold
        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
        prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-3
        prose-p:leading-8 prose-p:text-gray-700
        prose-li:leading-8 prose-li:text-gray-700
        prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
        prose-blockquote:border-l-4 prose-blockquote:border-orange-400 prose-blockquote:bg-orange-50 
        prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:my-8 prose-blockquote:not-italic
        prose-table:my-8 prose-table:shadow-sm prose-table:rounded-lg prose-table:overflow-hidden
        prose-thead:bg-gray-50 prose-thead:border-b-2 prose-thead:border-gray-200
        prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold
        prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-gray-100
        prose-strong:text-gray-900 prose-strong:font-bold
        prose-a:text-orange-600 prose-a:underline prose-a:font-medium hover:prose-a:text-orange-700
        md:prose-lg md:prose-p:leading-8 md:prose-li:leading-8"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}