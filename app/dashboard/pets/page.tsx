'use client'

import { useEffect, useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import Navbar, { BackLink } from '@/components/Navbar'
import Avatar from '@/components/Avatar'
import { Dog } from 'lucide-react'

const SIZES = ['small', 'medium', 'large', 'xlarge']
const SIZE_LABELS: Record<string, string> = {
  small: 'Small (< 10kg)',
  medium: 'Medium (10–25kg)',
  large: 'Large (25–45kg)',
  xlarge: 'XL (45kg+)',
}

interface Pet {
  _id: string
  name: string
  breed: string
  age: number
  size: string
  notes?: string
  photo?: string
}

const empty = { name: '', breed: '', age: '', size: 'medium', notes: '', photo: '' }

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Pet | null>(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/pets')
      .then((r) => r.json())
      .then((data) => { setPets(data); setLoading(false) })
  }, [])

  function openAdd() {
    setEditing(null)
    setForm(empty)
    setShowForm(true)
  }

  function openEdit(pet: Pet) {
    setEditing(pet)
    setForm({ name: pet.name, breed: pet.breed, age: String(pet.age), size: pet.size, notes: pet.notes || '', photo: pet.photo || '' })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload = { ...form, age: Number(form.age) }

    if (editing) {
      const res = await fetch(`/api/pets/${editing._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const updated = await res.json()
      setPets((prev) => prev.map((p) => (p._id === editing._id ? updated : p)))
    } else {
      const res = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const created = await res.json()
      setPets((prev) => [created, ...prev])
    }

    setSaving(false)
    setShowForm(false)
  }

  async function handleDelete(id: string) {
    await fetch(`/api/pets/${id}`, { method: 'DELETE' })
    setPets((prev) => prev.filter((p) => p._id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar logoHref="/dashboard">
        <BackLink href="/dashboard">Dashboard</BackLink>
      </Navbar>

      <main className="mx-auto max-w-2xl px-6 py-12 md:px-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Pets</h1>
            <p className="mt-1 text-sm text-muted">Manage your pets&apos; profiles.</p>
          </div>
          <button
            onClick={openAdd}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white bg-primary"
          >
            + Add Pet
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-muted">Loading...</p>
        ) : pets.length === 0 ? (
          <div className="rounded-2xl p-10 text-center bg-violet-50 border border-border border-dashed">
            <Dog size={36} className="shrink-0 text-primary" aria-hidden />
            <p className="mt-3 text-sm font-medium text-foreground">No pets yet</p>
            <p className="mt-1 text-xs text-muted">Add your first pet to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pets.map((pet) => (
              <div
                key={pet._id}
                className="flex items-center justify-between rounded-2xl p-5 bg-white border border-border"
              >
                <div className="flex items-center gap-4">
                  <Avatar src={pet.photo} alt={pet.name} size={48} />
                  <div>
                    <p className="font-semibold text-foreground">{pet.name}</p>
                    <p className="text-xs text-muted">
                      {pet.breed} · {pet.age} yr{pet.age !== 1 ? 's' : ''} · {SIZE_LABELS[pet.size]}
                    </p>
                    {pet.notes && (
                      <p className="mt-1 text-xs text-muted">{pet.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(pet)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium bg-background border border-border text-foreground"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pet._id)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 border border-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-3xl p-8 shadow-xl bg-white">
              <h2 className="mb-6 text-lg font-bold text-foreground">
                {editing ? 'Edit Pet' : 'Add a Pet'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Photo</label>
                  <ImageUpload
                    endpoint="petPhoto"
                    currentUrl={form.photo}
                    onUploadComplete={(url) => setForm((f) => ({ ...f, photo: url }))}
                    label="Pet Photo"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Buddy"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none border-border bg-background"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Breed <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Golden Retriever"
                    value={form.breed}
                    onChange={(e) => setForm({ ...form, breed: e.target.value })}
                    required
                    className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none border-border bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      Age (years) <span className="text-primary">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="3"
                      min="0"
                      value={form.age}
                      onChange={(e) => setForm({ ...form, age: e.target.value })}
                      required
                      className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none border-border bg-background"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      Size <span className="text-primary">*</span>
                    </label>
                    <select
                      value={form.size}
                      onChange={(e) => setForm({ ...form, size: e.target.value })}
                      className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none border-border bg-background"
                    >
                      {SIZES.map((s) => (
                        <option key={s} value={s}>{SIZE_LABELS[s]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Notes
                  </label>
                  <textarea
                    placeholder="Any special needs, allergies, etc."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={2}
                    className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none border-border bg-background"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 rounded-xl py-2.5 text-sm font-medium bg-background border border-border text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60 bg-primary"
                  >
                    {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Pet'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
