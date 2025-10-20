export interface Heading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(html: string): Heading[] {
  const headings: Heading[] = [];
  const regex = /<h([2-3])[^>]*>([^<]+)<\/h[2-3]>/gi;
  let match;
  let index = 0;

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, ''); // 内部のHTMLタグを除去
    const id = `heading-${index}`;
    headings.push({ id, text, level });
    index++;
  }

  return headings;
}

export function addIdsToHeadings(html: string): string {
  let index = 0;
  return html.replace(/<h([2-3])([^>]*)>/gi, (match, level, attrs) => {
    const id = `heading-${index}`;
    index++;
    // 既存のIDがある場合は上書きしない
    if (attrs.includes('id=')) {
      return match;
    }
    return `<h${level}${attrs} id="${id}">`;
  });
}