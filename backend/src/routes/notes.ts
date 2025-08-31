import express from 'express';
import { body, validationResult, param } from 'express-validator';
import Note from '../models/Note';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get all notes for authenticated user
router.get('/', authenticate, async (req: any, res: any) => {
    try {
        const user = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const tag = req.query.tag;
        const sortBy = req.query.sortBy || 'updatedAt';
        const sortOrder = req.query.sortOrder || 'desc';

        const query: any = { user: user._id };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        if (tag) {
            query.tags = { $in: [tag] };
        }

        const skip = (page - 1) * limit;

        const sortOptions: any = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const notes = await Note.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .populate('user', 'name email');

        const total = await Note.countDocuments(query);

        res.json({
            notes,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single note
router.get('/:id', authenticate, async (req: any, res: any) => {
    try {
        const user = req.user;
        const note = await Note.findOne({ _id: req.params.id, user: user._id });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json(note);
    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new note
router.post('/', authenticate, [
    body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be 1-200 characters'),
    body('content').trim().isLength({ min: 1, max: 10000 }).withMessage('Content is required and must be 1-10000 characters'),
    body('tags').optional().isArray(),
], async (req: any, res: any) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const user = req.user;
        const { title, content, tags = [] } = req.body;

        const note = new Note({
            title,
            content,
            tags: Array.isArray(tags) ? tags.filter(tag => typeof tag === 'string' && tag.trim()) : [],
            user: user._id,
        });

        await note.save();

        res.status(201).json({
            message: 'Note created successfully',
            note
        });
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update note
router.put('/:id', authenticate, [
    param('id').isMongoId().withMessage('Invalid note ID'),
    body('title').optional().trim().isLength({ min: 1, max: 200 }),
    body('content').optional().trim().isLength({ min: 1, max: 10000 }),
    body('tags').optional().isArray(),
], async (req: any, res: any) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const user = req.user;
        const { title, content, tags } = req.body;

        const note = await Note.findOne({ _id: req.params.id, user: user._id });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        if (title !== undefined) note.title = title;
        if (content !== undefined) note.content = content;
        if (tags !== undefined) {
            note.tags = Array.isArray(tags) ? tags.filter(tag => typeof tag === 'string' && tag.trim()) : [];
        }

        await note.save();

        res.json({
            message: 'Note updated successfully',
            note
        });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete note
router.delete('/:id', authenticate, [
    param('id').isMongoId().withMessage('Invalid note ID'),
], async (req: any, res: any) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const user = req.user;
        const note = await Note.findOneAndDelete({ _id: req.params.id, user: user._id });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get notes statistics
router.get('/stats/summary', authenticate, async (req: any, res: any) => {
    try {
        const user = req.user;

        const totalNotes = await Note.countDocuments({ user: user._id });

        // Get tags distribution
        const tagsAggregation = await Note.aggregate([
            { $match: { user: user._id } },
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        const tags = tagsAggregation.map(item => ({
            tag: item._id,
            count: item.count
        }));

        res.json({
            totalNotes,
            tags
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
