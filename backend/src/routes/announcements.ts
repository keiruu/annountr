import { isAuthenticated } from "../middleware/jwt";

const express = require('express')
const router = express.Router();
const AnnouncementController = require('../controllers/announcements');
const asyncHandler = require('../handlers/asyncHandler');

router.put('/:id/update', asyncHandler(AnnouncementController.UpdateAnnouncement))
router.delete('/:id/delete', asyncHandler(AnnouncementController.DeleteAnnouncement));
router.post('/:id/create', asyncHandler(AnnouncementController.AddAnnouncement));
router.get('/:id', asyncHandler(AnnouncementController.GetAnnouncements));

module.exports = router

export {};