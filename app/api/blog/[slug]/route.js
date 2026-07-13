import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { data: {}, body: content }
  const data = {}
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(': ')
    if (key && rest.length) data[key.trim()] = rest.join(': ').trim().replace(/^["']|["']$/g, '')
  })
  return { data, body: match[2] }
}

function markdownToHtml(md) {
  return md
    .replace(/^### (.*)/gm, '<h3>$1</h3>')
    .replace(/^## (.*)/gm, '<h2>$1</h2>')
    .replace(/^# (.*)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^\| (.+) \|$/gm, (_, row) => '<tr>' + row.split(' | ').map(c => `<td>${c.trim()}</td>`).join('') + '</tr>')
    .replace(/^\|[-| ]+\|$/gm, '')
    .replace(/(<tr>.*<\/tr>\n?)+/gs, m => `<table><tbody>${m}</tbody></table>`)
    .replace(/^- (.*)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/gs, m => `<ul>${m}</ul>`)
    .replace(/\n\n([^<\n][^\n]*)\n\n/g, '\n\n<p>$1</p>\n\n')
    .replace(/\n\n([^<\n][^\n]*?)$/g, '\n\n<p>$1</p>')
}

export async function GET(request, { params }) {
  const { slug } = params
  const filePath = path.join(process.cwd(), 'content', 'blog', `${slug}.md`)
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, body } = parseFrontmatter(raw)
  return NextResponse.json({ ...data, html: markdownToHtml(body), slug })
}
