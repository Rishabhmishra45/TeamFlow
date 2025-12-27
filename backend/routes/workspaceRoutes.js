import express from "express";
import Workspace from "../models/Workspace.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* ================= CREATE WORKSPACE ================= */
router.post("/", protect, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Workspace name required" });
    }

    const workspace = await Workspace.create({
      name,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "admin" }],
    });

    res.status(201).json(workspace);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= GET USER WORKSPACES ================= */
router.get("/", protect, async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      "members.user": req.user._id,
    }).populate("members.user", "name email");

    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= INVITE MEMBER ================= */
router.post("/:id/invite", protect, async (req, res) => {
  try {
    const { email, role } = req.body;

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // only admin can invite
    const isAdmin = workspace.members.find(
      (m) =>
        m.user.toString() === req.user._id.toString() &&
        m.role === "admin"
    );

    if (!isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyMember = workspace.members.find(
      (m) => m.user.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ message: "User already member" });
    }

    workspace.members.push({
      user: user._id,
      role: role || "member",
    });

    await workspace.save();
    res.json({ message: "Member invited successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
