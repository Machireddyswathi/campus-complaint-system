const express = require("express");
const router = express.Router();

const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  updateMyComplaint,
  deleteMyComplaint,
} = require("../controllers/complaintController");

const { getComplaintStats } = require("../controllers/complaintController");
const { updateAdminNote } = require("../controllers/complaintController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/", protect, createComplaint);

router.get("/my", protect, getMyComplaints);

router.put("/note/:id", protect, authorizeRoles("ADMIN"), updateAdminNote);

router.get("/stats", protect, authorizeRoles("ADMIN"), getComplaintStats);

router.get("/", protect, authorizeRoles("ADMIN"), getAllComplaints);

// admin update status
router.put("/:id", protect, authorizeRoles("ADMIN"), updateComplaintStatus);

// student edit own
router.put("/my/:id", protect, updateMyComplaint);

// student delete own
router.delete("/my/:id", protect, deleteMyComplaint);

module.exports = router;
