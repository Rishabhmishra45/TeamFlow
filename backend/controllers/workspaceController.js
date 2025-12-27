import Workspace from "../models/Workspace.js";
import User from "../models/User.js";

// ================= CREATE WORKSPACE =================
export const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Workspace name is required" });
    }

    const workspace = await Workspace.create({
      name,
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          role: "admin",
        },
      ],
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET USER WORKSPACES =================
export const getUserWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      "members.user": req.user._id,
    }).populate("owner", "name email");

    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= INVITE MEMBER =================
export const inviteMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const workspaceId = req.params.id;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if requester is admin
    const isAdmin = workspace.members.find(
      (m) =>
        m.user.toString() === req.user._id.toString() &&
        m.role === "admin"
    );

    if (!isAdmin) {
      return res.status(403).json({ message: "Only admin can invite users" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyMember = workspace.members.find(
      (m) => m.user.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ message: "User already in workspace" });
    }

    workspace.members.push({
      user: user._id,
      role: role || "member",
    });

    await workspace.save();

    res.json({ message: "User invited successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
