import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { notesAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

interface Note {
    _id: string
    title: string
    content: string
    createdAt: string
    isPinned: boolean
}

const Dashboard = () => {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [notes, setNotes] = useState<Note[]>([])
    const [showNoteModal, setShowNoteModal] = useState(false)
    const [editingNote, setEditingNote] = useState<Note | null>(null)
    const [noteForm, setNoteForm] = useState({ title: '', content: '' })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNotes()
    }, [])

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem('token')
            if (token) {
                const fetchedNotes = await notesAPI.getNotes(token)
                setNotes(fetchedNotes)
            }
        } catch (error) {
            console.error('Failed to fetch notes:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/signin')
    }

    const handleCreateNote = () => { setEditingNote(null); setNoteForm({ title: '', content: '' }); setShowNoteModal(true) }
    const handleEditNote = (note: Note) => { setEditingNote(note); setNoteForm({ title: note.title, content: note.content }); setShowNoteModal(true) }

    const handleDeleteNote = async (id: string) => {
        try {
            const token = localStorage.getItem('token')
            if (token) {
                await notesAPI.deleteNote(token, id)
                setNotes(notes.filter(note => note._id !== id))
            }
        } catch (error) {
            console.error('Failed to delete note:', error)
        }
    }

    const handlePinNote = async (id: string) => {
        try {
            const token = localStorage.getItem('token')
            const note = notes.find(n => n._id === id)
            if (token && note) {
                const updated = await notesAPI.updateNote(token, id, { title: note.title, content: note.content, isPinned: !note.isPinned })
                setNotes(notes.map(note => note._id === id ? updated : note))
            }
        } catch (error) {
            console.error('Failed to pin note:', error)
        }
    }

    const handleSaveNote = async () => {
        try {
            const token = localStorage.getItem('token')
            if (token) {
                if (editingNote) {
                    const updated = await notesAPI.updateNote(token, editingNote._id, { title: noteForm.title, content: noteForm.content })
                    setNotes(notes.map(note => note._id === editingNote._id ? updated : note))
                } else {
                    const newNote = await notesAPI.createNote(token, { title: noteForm.title, content: noteForm.content })
                    setNotes([newNote, ...notes])
                }
                setShowNoteModal(false)
            }
        } catch (error) {
            console.error('Failed to save note:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <img src="/icon.png" alt="Logo" className="w-8 h-8 mr-3" />
                        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={handleCreateNote} className="hidden sm:block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">+ New Note</button>
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-medium text-gray-900">{user?.name || 'Guest'}</p>
                            <p className="text-xs text-gray-500">{user?.email || 'guest@example.com'}</p>
                        </div>
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
                        </div>
                        <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
                <div className="mb-6 bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Welcome, {user?.name || 'Guest'}!</h2>
                    <p className="text-gray-600 mb-4">Email: {user?.email || 'guest@example.com'}</p>
                    <button onClick={handleCreateNote} className="w-60 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">Create Note</button>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>

                {notes.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
                        <p className="text-gray-500 mb-4">Create your first note to get started</p>
                        <button onClick={handleCreateNote} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Create Note</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {notes.map((note) => (
                            <div key={note._id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition cursor-pointer" onClick={() => handleEditNote(note)}>
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-medium text-gray-900 truncate flex-1">{note.title}</h3>
                                    <div className="flex space-x-1 ml-2">
                                        <button onClick={(e) => { e.stopPropagation(); handlePinNote(note._id) }} className={`p-1 rounded ${note.isPinned ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}>
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteNote(note._id) }} className="p-1 rounded text-gray-400 hover:text-red-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-3 mb-3">{note.content}</p>
                                <p className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {showNoteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-hidden">
                        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">{editingNote ? 'Edit Note' : 'New Note'}</h3>
                            <button onClick={() => setShowNoteModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input type="text" value={noteForm.title} onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base" placeholder="Enter note title" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                                <textarea rows={6} value={noteForm.content} onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base" placeholder="Enter note content" />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t border-gray-200">
                            <button onClick={() => setShowNoteModal(false)} className="w-full sm:w-auto px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                            <button onClick={handleSaveNote} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">{editingNote ? 'Update' : 'Create'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
