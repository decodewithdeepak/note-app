import express from 'express';
import { body, validationResult } from 'express-validator';
import Note from '../models/Note';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all notes for authenticated user
router.get('/', authenticate, async (req: AuthRequest, res) => {
    try {
        const user = req.user!;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const search = req.query.search as string;
        const skip = (page - 1) * limit;

        let query: any = { user: user._id };

        // Add search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
            ];
        }

        const notes = await Note.find(query)
            .sort({ isPinned: -1, updatedAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Note.countDocuments(query);

        res.json({
            notes,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total,
            },
        });
    } catch (error) {
        console.error('Get notes error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single note
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
    try {
        const user = req.user!;
        const note = await Note.findOne({ _id: req.params.id, user: user._id });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json({ note });
    } catch (error) {
        console.error('Get note error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new note
router.post('/', authenticate, [
    body('title').trim().isLength({ min: 1, max: 200 }),
    body('content').trim().isLength({ min: 1, max: 10000 }),
    body('tags').optional().isArray(),
    body('backgroundColor').optional().isHexColor(),
], async (req: AuthRequest, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const user = req.user!;
        const { title, content, tags = [], backgroundColor = '#ffffff' } = req.body;

        const note = new Note({
            title,
            content,
            tags: Array.isArray(tags) ? tags.filter(tag => typeof tag === 'string' && tag.trim()) : [],
            backgroundColor,
            user: user._id,
        });

        await note.save();

        res.status(201).json({
            message: 'Note created successfully',
            note,
        });
    } catch (error) {
        console.error('Create note error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update note
router.put('/:id', authenticate, [
    body('title').optional().trim().isLength({ min: 1, max: 200 }),
    body('content').optional().trim().isLength({ min: 1, max: 10000 }),
    body('tags').optional().isArray(),
    body('backgroundColor').optional().isHexColor(),
    body('isPinned').optional().isBoolean(),
], async (req: AuthRequest, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const user = req.user!;
        const { title, content, tags, backgroundColor, isPinned } = req.body;

        const note = await Note.findOne({ _id: req.params.id, user: user._id });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Update fields if provided
        if (title !== undefined) note.title = title;
        if (content !== undefined) note.content = content;
        if (tags !== undefined) {
            note.tags = Array.isArray(tags) ? tags.filter(tag => typeof tag === 'string' && tag.trim()) : [];
        }
        if (backgroundColor !== undefined) note.backgroundColor = backgroundColor;
        if (isPinned !== undefined) note.isPinned = isPinned;

        await note.save();

        res.json({
            message: 'Note updated successfully',
            note,
        });
    } catch (error) {
        console.error('Update note error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete note
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
    try {
        const user = req.user!;
        const note = await Note.findOneAndDelete({ _id: req.params.id, user: user._id });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Toggle pin status
router.patch('/:id/pin', authenticate, async (req: AuthRequest, res) => {
    try {
        const user = req.user!;
        const note = await Note.findOne({ _id: req.params.id, user: user._id });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        note.isPinned = !note.isPinned;
        await note.save();

        res.json({
            message: `Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully`,
            note,
        });
    } catch (error) {
        console.error('Toggle pin error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get notes statistics
router.get('/stats/overview', authenticate, async (req: AuthRequest, res) => {
    try {
        const user = req.user!;

        const totalNotes = await Note.countDocuments({ user: user._id });
        const pinnedNotes = await Note.countDocuments({ user: user._id, isPinned: true });

        // Get most used tags
        const tagStats = await Note.aggregate([
            { $match: { user: user._id } },
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        res.json({
            stats: {
                totalNotes,
                pinnedNotes,
                tags: tagStats.map(tag => ({ name: tag._id, count: tag.count })),
            },
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
