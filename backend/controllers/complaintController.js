const Complaint = require("../models/Complaint");


// create complaint
exports.createComplaint = async (req, res) => {
try {

const { title, description, priority } = req.body;

const complaint = await Complaint.create({
title,
description,
priority,
user: req.user.id
});

res.status(201).json({
message: "Complaint created",
complaint
});

} catch (error) {
res.status(500).json({
message: "Server error"
});
}
};


// get my complaints
// admin - search + filter complaints
exports.getAllComplaints = async (req, res) => {
  try {

    const { search, status, page = 1, limit = 5 } = req.query;

    let query = {};

    // search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // filter
    if (status) {
      query.status = status;
    }

    const complaints = await Complaint.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Complaint.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      complaints
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {

    const { search, status, page = 1, limit = 5 } = req.query;

    let query = { user: req.user.id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (status) {
      query.status = status;
    }

    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Complaint.countDocuments(query);

    res.json({
      complaints,
      total,
      page,
      pages: Math.ceil(total / limit)
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};


// admin add note
exports.updateAdminNote = async (req, res) => {
  try {

    const { adminNote } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { adminNote },
      { new: true }
    );

    res.json({
      message: "Admin note updated",
      complaint
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

// admin statistics
exports.getComplaintStats = async (req, res) => {
  try {

    const total = await Complaint.countDocuments();

    const pending = await Complaint.countDocuments({
      status: "Pending"
    });

    const inProgress = await Complaint.countDocuments({
      status: "In Progress"
    });

    const resolved = await Complaint.countDocuments({
      status: "Resolved"
    });

    res.json({
      total,
      pending,
      inProgress,
      resolved
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};





// admin update status
exports.updateComplaintStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    res.json({
      message: "Status updated",
      complaint
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

// student edit own complaint
exports.updateMyComplaint = async (req, res) => {
  try {

    const { title, description, priority } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    // check owner
    if (complaint.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    // prevent edit if resolved
    if (complaint.status === "Resolved") {
      return res.status(400).json({
        message: "Cannot edit resolved complaint"
      });
    }

    complaint.title = title || complaint.title;
    complaint.description = description || complaint.description;
    complaint.priority = priority || complaint.priority;

    await complaint.save();

    res.json({
      message: "Complaint updated",
      complaint
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

// student delete own complaint
exports.deleteMyComplaint = async (req, res) => {
  try {

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    // check owner
    if (complaint.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    // prevent delete if resolved
    if (complaint.status === "Resolved") {
      return res.status(400).json({
        message: "Cannot delete resolved complaint"
      });
    }

    await complaint.deleteOne();

    res.json({
      message: "Complaint deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};