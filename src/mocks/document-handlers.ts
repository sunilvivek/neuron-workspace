import { http, HttpResponse, delay } from "msw"
import type { Document, PaginatedResult } from "@/types/document"
import type { Folder, FileAttachment } from "@/types/folder"
import type { Template } from "@/types/template"

let folders: Folder[] = [
  { id: "f1", name: "Work Projects", parentId: null, createdAt: new Date(Date.now() - 14 * 86400000).toISOString() },
  { id: "f2", name: "Design System", parentId: "f1", createdAt: new Date(Date.now() - 12 * 86400000).toISOString() },
  { id: "f3", name: "API Docs", parentId: "f1", createdAt: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: "f4", name: "Personal", parentId: null, createdAt: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: "f5", name: "Journal", parentId: "f4", createdAt: new Date(Date.now() - 6 * 86400000).toISOString() },
]

let documents: Document[] = [
  { id: "d1", title: "Getting Started Guide", content: "<h2>Welcome to Neuron Workspace</h2><p>This guide will help you get started with all the features available in your workspace.</p><h3>Quick Start</h3><ul><li>Create your first document</li><li>Organize with folders</li><li>Use templates for common workflows</li></ul>", folderId: null, type: "document", tags: ["guide", "onboarding"], favorite: true, archived: false, trashed: false, pinned: true, createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "d2", title: "Q3 Product Roadmap", content: "<h2>Q3 Roadmap</h2><p>Key deliverables for Q3 2025:</p><ol><li>Launch dashboard v2</li><li>Implement real-time collaboration</li><li>Mobile app beta</li></ol><h3>Timeline</h3><p>July: Dashboard v2, August: Collaboration, September: Mobile beta</p>", folderId: "f1", type: "plan", tags: ["roadmap", "q3"], favorite: true, archived: false, trashed: false, pinned: false, createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "d3", title: "API Architecture Notes", content: "<h2>Architecture Decisions</h2><p>We decided to use RTK Query for the data layer with MSW for mocking during development.</p><h3>Key Decisions</h3><ul><li>REST API design</li><li>Tag-based cache invalidation</li><li>FakeBaseQuery for initial setup, fetchBaseQuery for production</li></ul>", folderId: "f3", type: "document", tags: ["api", "architecture"], favorite: false, archived: false, trashed: false, pinned: false, createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "d4", title: "Design Tokens Specification", content: "<h2>Design Tokens</h2><p>Our design system uses CSS custom properties with oklch color space.</p><h3>Color Palette</h3><ul><li>Primary: oklch(0.205 0 0)</li><li>Secondary: oklch(0.97 0 0)</li><li>Chart colors: 5 variants for data visualization</li></ul>", folderId: "f2", type: "document", tags: ["design", "tokens"], favorite: false, archived: false, trashed: false, pinned: false, createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "d5", title: "Meeting Notes: Sprint Review", content: "<h2>Sprint Review - Week 28</h2><p>Attendees: Demo User, Sarah Chen, Marcus Rivera</p><h3>Completed</h3><ul><li>Dashboard redesign</li><li>Auth module</li><li>MSW integration</li></ul><h3>Next Sprint</h3><p>Focus on document management and file uploads.</p>", folderId: "f1", type: "note", tags: ["meeting", "sprint"], favorite: false, archived: false, trashed: false, pinned: false, createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "d6", title: "Weekly Journal - Week 27", content: "<h2>Week 27</h2><p>Great progress this week. Finished the dashboard workspace with all 11 widget components.</p><h3>Highlights</h3><ul><li>Productivity charts working with Recharts</li><li>Tasks widget with priority indicators</li><li>Team widget with online status</li></ul>", folderId: "f5", type: "journal", tags: ["weekly", "reflection"], favorite: false, archived: false, trashed: false, pinned: false, createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "d7", title: "Component Library Audit", content: "<h2>Component Audit</h2><p>Current shadcn/ui components in use:</p><ul><li>14 base components</li><li>4 new additions (Tabs, Table, Badge, Select)</li><li>All using Radix UI primitives</li></ul>", folderId: "f2", type: "document", tags: ["components", "audit"], favorite: false, archived: false, trashed: false, pinned: false, createdAt: new Date(Date.now() - 6 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: "d8", title: "Old Project Notes", content: "<p>These are notes from an old project that has been completed.</p>", folderId: null, type: "note", tags: ["archive"], favorite: false, archived: true, trashed: false, pinned: false, createdAt: new Date(Date.now() - 30 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 20 * 86400000).toISOString() },
  { id: "d9", title: "Deleted Draft", content: "<p>This document was moved to trash.</p>", folderId: null, type: "document", tags: [], favorite: false, archived: false, trashed: true, pinned: false, createdAt: new Date(Date.now() - 15 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: "d10", title: "Performance Report", content: "<h2>Performance Metrics</h2><p>Build size analysis:</p><ul><li>Index bundle: 517 KB (163 KB gzipped)</li><li>Dashboard: 377 KB</li><li>Notes: 387 KB</li></ul>", folderId: "f1", type: "document", tags: ["performance", "metrics"], favorite: false, archived: false, trashed: false, pinned: false, createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: "d11", title: "Brainstorm: Feature Ideas", content: "<h2>Feature Ideas</h2><ul><li>Real-time collaboration</li><li>AI-powered document summaries</li><li>Version history</li><li>Comments and annotations</li><li>Export to PDF/Markdown</li></ul>", folderId: null, type: "brainstorm", tags: ["ideas", "features"], favorite: true, archived: false, trashed: false, pinned: false, createdAt: new Date(Date.now() - 9 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "d12", title: "Weekly Journal - Week 28", content: "<h2>Week 28</h2><p>Started working on document management system. Planning the data model and API endpoints.</p><h3>Goals</h3><ul><li>Complete folder tree component</li><li>Implement document CRUD with folder organization</li><li>Add file upload mock</li></ul>", folderId: "f5", type: "journal", tags: ["weekly", "planning"], favorite: false, archived: false, trashed: false, pinned: false, createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "d13", title: "Sprint Planning Notes", content: "<h2>Sprint 29 Planning</h2><p>Focus items for the upcoming sprint.</p>", folderId: "f1", type: "note", tags: ["meeting", "sprint"], favorite: false, archived: false, trashed: false, pinned: false, createdAt: new Date(Date.now() - 12 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 11 * 86400000).toISOString() },
  { id: "d14", title: "Project Kickoff Plan", content: "<h2>Project Kickoff</h2><p>New project initialization checklist.</p>", folderId: "f1", type: "plan", tags: ["project", "kickoff"], favorite: false, archived: false, trashed: false, pinned: false, createdAt: new Date(Date.now() - 20 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 18 * 86400000).toISOString() },
]

let files: FileAttachment[] = [
  { id: "fl1", name: "design-spec.pdf", type: "pdf", size: 2457600, folderId: "f2", uploadedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "fl2", name: "architecture-diagram.png", type: "image", size: 1048576, folderId: "f3", uploadedAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: "fl3", name: "meeting-recording.mp3", type: "audio", size: 15728640, folderId: "f1", uploadedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "fl4", name: "budget-2025.xlsx", type: "spreadsheet", size: 524288, folderId: null, uploadedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "fl5", name: "brand-assets.zip", type: "archive", size: 10485760, folderId: "f2", uploadedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "fl6", name: "api-collection.json", type: "code", size: 81920, folderId: "f3", uploadedAt: new Date(Date.now() - 86400000).toISOString() },
]

const templates: Template[] = [
  { id: "t1", name: "Meeting Notes", description: "Structured template for meeting notes with agenda, attendees, and action items", content: "<h2>Meeting Notes</h2><p><strong>Date:</strong> </p><p><strong>Attendees:</strong> </p><h3>Agenda</h3><ul><li></li></ul><h3>Discussion</h3><p></p><h3>Action Items</h3><ul><li>[ ] </li></ul><h3>Next Meeting</h3><p></p>", category: "business", icon: "Users" },
  { id: "t2", name: "Project Plan", description: "Comprehensive project planning template with milestones and timeline", content: "<h2>Project Plan</h2><p><strong>Project Name:</strong> </p><p><strong>Timeline:</strong> </p><h3>Objectives</h3><ul><li></li></ul><h3>Scope</h3><p></p><h3>Milestones</h3><ol><li>Milestone 1 - </li><li>Milestone 2 - </li><li>Milestone 3 - </li></ol><h3>Resources</h3><p></p><h3>Risks</h3><p></p>", category: "business", icon: "FolderOpen" },
  { id: "t3", name: "Daily Journal", description: "Simple daily journal template for reflection and gratitude", content: "<h2>Daily Journal</h2><p><strong>Date:</strong> </p><h3>Today's Highlights</h3><ul><li></li></ul><h3>Gratitude</h3><ul><li></li></ul><h3>Lessons Learned</h3><p></p><h3>Tomorrow's Goals</h3><ul><li></li></ul>", category: "personal", icon: "BookOpen" },
  { id: "t4", name: "Documentation", description: "Technical documentation template with code examples", content: "<h2>Documentation</h2><p><strong>Module:</strong> </p><h3>Overview</h3><p></p><h3>Installation</h3><pre><code></code></pre><h3>Usage</h3><pre><code></code></pre><h3>API Reference</h3><p></p><h3>Examples</h3><p></p>", category: "development", icon: "FileText" },
  { id: "t5", name: "Brainstorm", description: "Creative brainstorming template with mind map structure", content: "<h2>Brainstorm</h2><p><strong>Topic:</strong> </p><h3>Central Idea</h3><p></p><h3>Related Ideas</h3><ul><li></li></ul><h3>Connections</h3><p></p><h3>Next Steps</h3><ul><li></li></ul>", category: "personal", icon: "Lightbulb" },
  { id: "t6", name: "To-Do List", description: "Task management template with priorities and due dates", content: "<h2>To-do List</h2><h3>High Priority</h3><ul><li>[ ] </li></ul><h3>Medium Priority</h3><ul><li>[ ] </li></ul><h3>Low Priority</h3><ul><li>[ ] </li></ul><h3>Completed</h3><ul><li>[x] </li></ul>", category: "productivity", icon: "CheckSquare" },
]

function buildFolderTree(parentId: string | null): Folder[] {
  return folders
    .filter((f) => f.parentId === parentId)
    .sort((a, b) => a.name.localeCompare(b.name))
}

function getDocumentCount(folderId: string): number {
  const childFolderIds = folders.filter((f) => f.parentId === folderId).map((f) => f.id)
  const directCount = documents.filter((d) => d.folderId === folderId && !d.trashed).length
  const childCount = childFolderIds.reduce((acc, id) => acc + getDocumentCount(id), 0)
  return directCount + childCount
}

function getFolderPath(folderId: string | null): { id: string; name: string }[] {
  if (!folderId) return []
  const folder = folders.find((f) => f.id === folderId)
  if (!folder) return []
  return [...getFolderPath(folder.parentId), { id: folder.id, name: folder.name }]
}

function matchesSearch(doc: Document, query: string): boolean {
  const q = query.toLowerCase()
  return doc.title.toLowerCase().includes(q) || doc.content.toLowerCase().includes(q)
}

function matchType(doc: Document, typeFilter: string | null): boolean {
  if (!typeFilter || typeFilter === "all") return true
  return doc.type === typeFilter
}

function matchTag(doc: Document, tagFilter: string | null): boolean {
  if (!tagFilter || tagFilter === "all") return true
  return doc.tags.includes(tagFilter)
}

function filterDocuments(params: {
  folderId?: string | null
  search?: string | null
  filter?: string
  type?: string | null
  tag?: string | null
  sortField?: string
  sortDirection?: string
}): Document[] {
  const { folderId, search, filter = "all", type, tag, sortField = "updatedAt", sortDirection = "desc" } = params

  let filtered = [...documents]

  if (filter === "favorites") filtered = filtered.filter((d) => d.favorite && !d.trashed)
  else if (filter === "archived") filtered = filtered.filter((d) => d.archived && !d.trashed)
  else if (filter === "trash") filtered = filtered.filter((d) => d.trashed)
  else if (filter === "recent") filtered = filtered.filter((d) => !d.trashed && !d.archived)
  else filtered = filtered.filter((d) => !d.trashed && !d.archived)

  if (folderId) filtered = filtered.filter((d) => d.folderId === folderId)
  else if (filter === "all" && !folderId) filtered = filtered.filter((d) => !d.folderId || d.folderId === null)

  if (search) filtered = filtered.filter((d) => matchesSearch(d, search))
  if (type) filtered = filtered.filter((d) => matchType(d, type))
  if (tag) filtered = filtered.filter((d) => matchTag(d, tag))

  filtered.sort((a, b) => {
    const aVal = a[sortField as keyof Document] as string
    const bVal = b[sortField as keyof Document] as string
    return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
  })

  return filtered
}

export const documentHandlers = [
  // Documents
  http.get("/api/documents", ({ request }) => {
    const url = new URL(request.url)
    const folderId = url.searchParams.get("folderId")
    const search = url.searchParams.get("search")
    const filter = url.searchParams.get("filter") || "all"
    const type = url.searchParams.get("type")
    const tag = url.searchParams.get("tag")
    const sortField = url.searchParams.get("sortField") || "updatedAt"
    const sortDirection = url.searchParams.get("sortDirection") || "desc"
    const page = parseInt(url.searchParams.get("page") || "1", 10)
    const pageSize = parseInt(url.searchParams.get("pageSize") || "12", 10)

    const filtered = filterDocuments({ folderId, search, filter, type, tag, sortField, sortDirection })

    const total = filtered.length
    const totalPages = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize
    const items = filtered.slice(start, start + pageSize)

    const result: PaginatedResult<Document> = { items, total, page, pageSize, totalPages }
    return HttpResponse.json(result)
  }),

  http.get("/api/documents/recent", () => {
    const recent = documents
      .filter((d) => !d.trashed && !d.archived)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 5)
    return HttpResponse.json(recent)
  }),

  http.get("/api/documents/activity", () => {
    const activity = documents
      .filter((d) => !d.trashed && !d.archived)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 8)
    return HttpResponse.json(activity)
  }),

  http.get("/api/documents/:id", ({ params }) => {
    const doc = documents.find((d) => d.id === params.id)
    if (!doc) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    return HttpResponse.json(doc)
  }),

  http.post("/api/documents", async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as { title: string; content: string; folderId?: string | null; templateId?: string }
    let content = body.content
    if (body.templateId) {
      const template = templates.find((t) => t.id === body.templateId)
      if (template) content = template.content
    }
    const newDoc: Document = {
      id: `d${Date.now()}`,
      title: body.title,
      content,
      folderId: body.folderId || null,
      type: "document",
      tags: [],
      favorite: false,
      archived: false,
      trashed: false,
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    documents = [newDoc, ...documents]
    return HttpResponse.json(newDoc, { status: 201 })
  }),

  http.post("/api/documents/:id/duplicate", ({ params }) => {
    const doc = documents.find((d) => d.id === params.id)
    if (!doc) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    const newDoc: Document = {
      ...doc,
      id: `d${Date.now()}`,
      title: `${doc.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorite: false,
      pinned: false,
    }
    documents = [newDoc, ...documents]
    return HttpResponse.json(newDoc, { status: 201 })
  }),

  http.put("/api/documents/:id", async ({ params, request }) => {
    await delay(200)
    const body = (await request.json()) as Partial<Document>
    const idx = documents.findIndex((d) => d.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    documents[idx] = { ...documents[idx], ...body, updatedAt: new Date().toISOString() }
    return HttpResponse.json(documents[idx])
  }),

  http.delete("/api/documents/:id", ({ params }) => {
    documents = documents.filter((d) => d.id !== params.id)
    return HttpResponse.json({ success: true })
  }),

  http.post("/api/documents/:id/favorite", ({ params }) => {
    const doc = documents.find((d) => d.id === params.id)
    if (!doc) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    doc.favorite = !doc.favorite
    return HttpResponse.json(doc)
  }),

  http.post("/api/documents/:id/pin", ({ params }) => {
    const doc = documents.find((d) => d.id === params.id)
    if (!doc) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    doc.pinned = !doc.pinned
    return HttpResponse.json(doc)
  }),

  http.post("/api/documents/:id/archive", ({ params }) => {
    const doc = documents.find((d) => d.id === params.id)
    if (!doc) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    doc.archived = !doc.archived
    doc.trashed = false
    return HttpResponse.json(doc)
  }),

  http.post("/api/documents/:id/trash", ({ params }) => {
    const doc = documents.find((d) => d.id === params.id)
    if (!doc) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    doc.trashed = !doc.trashed
    doc.archived = false
    return HttpResponse.json(doc)
  }),

  http.post("/api/documents/:id/restore", ({ params }) => {
    const doc = documents.find((d) => d.id === params.id)
    if (!doc) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    doc.trashed = false
    doc.archived = false
    return HttpResponse.json(doc)
  }),

  http.post("/api/documents/:id/move", async ({ params, request }) => {
    const body = (await request.json()) as { folderId: string | null }
    const doc = documents.find((d) => d.id === params.id)
    if (!doc) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    doc.folderId = body.folderId
    doc.updatedAt = new Date().toISOString()
    return HttpResponse.json(doc)
  }),

  http.get("/api/documents/tags", () => {
    const allTags = [...new Set(documents.flatMap((d) => d.tags))]
    return HttpResponse.json(allTags.sort())
  }),

  // Folders
  http.get("/api/folders", ({ request }) => {
    const url = new URL(request.url)
    const parentId = url.searchParams.get("parentId")
    const tree = buildFolderTree(parentId || null)
    const result = tree.map((f) => ({
      ...f,
      documentCount: getDocumentCount(f.id),
    }))
    return HttpResponse.json(result)
  }),

  http.get("/api/folders/tree", () => {
    function buildTree(parentId: string | null): Folder[] {
      return folders
        .filter((f) => f.parentId === parentId)
        .sort((a, b) => a.name.localeCompare(b.name))
    }
    const tree = buildTree(null).map((f) => ({
      ...f,
      children: buildTree(f.id).map((c) => ({ ...c, children: [], documentCount: getDocumentCount(c.id) })),
      documentCount: getDocumentCount(f.id),
    }))
    return HttpResponse.json(tree)
  }),

  http.get("/api/folders/:id/path", ({ params }) => {
    const path = getFolderPath(params.id as string)
    return HttpResponse.json(path)
  }),

  http.post("/api/folders", async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as { name: string; parentId?: string | null }
    const newFolder: Folder = {
      id: `f${Date.now()}`,
      name: body.name,
      parentId: body.parentId || null,
      createdAt: new Date().toISOString(),
    }
    folders = [...folders, newFolder]
    return HttpResponse.json(newFolder, { status: 201 })
  }),

  http.put("/api/folders/:id", async ({ params, request }) => {
    await delay(200)
    const body = (await request.json()) as { name: string }
    const folder = folders.find((f) => f.id === params.id)
    if (!folder) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    folder.name = body.name
    return HttpResponse.json(folder)
  }),

  http.delete("/api/folders/:id", ({ params }) => {
    const childFolders = folders.filter((f) => f.parentId === params.id)
    const allIds = [params.id as string, ...childFolders.map((f) => f.id)]
    folders = folders.filter((f) => !allIds.includes(f.id))
    documents = documents.map((d) => (allIds.includes(d.folderId || "") ? { ...d, folderId: null } : d))
    return HttpResponse.json({ success: true })
  }),

  // Files
  http.get("/api/files", ({ request }) => {
    const url = new URL(request.url)
    const folderId = url.searchParams.get("folderId")
    let filtered = [...files]
    if (folderId) filtered = filtered.filter((f) => f.folderId === folderId)
    return HttpResponse.json(filtered)
  }),

  http.post("/api/files/upload", async ({ request }) => {
    await delay(500)
    const body = (await request.json()) as { name: string; type: string; size: number; folderId?: string | null }
    const newFile: FileAttachment = {
      id: `fl${Date.now()}`,
      name: body.name,
      type: body.type,
      size: body.size,
      folderId: body.folderId || null,
      uploadedAt: new Date().toISOString(),
    }
    files = [newFile, ...files]
    return HttpResponse.json(newFile, { status: 201 })
  }),

  http.put("/api/files/:id", async ({ params, request }) => {
    await delay(200)
    const body = (await request.json()) as { name: string }
    const file = files.find((f) => f.id === params.id)
    if (!file) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    file.name = body.name
    return HttpResponse.json(file)
  }),

  http.delete("/api/files/:id", ({ params }) => {
    files = files.filter((f) => f.id !== params.id)
    return HttpResponse.json({ success: true })
  }),

  http.post("/api/files/:id/move", async ({ params, request }) => {
    const body = (await request.json()) as { folderId: string | null }
    const file = files.find((f) => f.id === params.id)
    if (!file) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    file.folderId = body.folderId
    return HttpResponse.json(file)
  }),

  // Templates
  http.get("/api/templates", () => {
    return HttpResponse.json(templates)
  }),

  // Search
  http.get("/api/search", ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get("q") || ""
    const type = url.searchParams.get("type") || "all"

    const results: { documents: Document[]; files: FileAttachment[] } = { documents: [], files: [] }

    if (type === "all" || type === "documents") {
      results.documents = documents
        .filter((d) => !d.trashed && matchesSearch(d, q))
        .slice(0, 20)
    }

    if (type === "all" || type === "files") {
      results.files = files.filter((f) => f.name.toLowerCase().includes(q.toLowerCase())).slice(0, 20)
    }

    return HttpResponse.json(results)
  }),
]
