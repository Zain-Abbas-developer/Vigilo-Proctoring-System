import User from "../models/User.js";
import { ok, created, asyncHandler } from "../utils/response.js";
import ApiError from "../utils/ApiError.js";
import { getPagination, getSort, paginated } from "../utils/pagination.js";
import { createNotification } from "../services/notificationService.js";

// export const listUsers = asyncHandler(async (req, res) => {
//   const { page, limit, skip } = getPagination(req.query);
//   const sort = getSort(req.query, { createdAt: -1 });
//   const filter = {};
//   if (req.query.role) filter.role = req.query.role;
//   if (req.query.status) filter.status = req.query.status;
//   if (req.query.search) filter.$text = { $search: req.query.search };

//   const [items, total] = await Promise.all([
//     User.find(filter).sort(sort).skip(skip).limit(limit),
//     User.countDocuments(filter),
//   ]);
//   return ok(res, paginated(items, total, page, limit));
// });

export const listUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("_id name email profileImage role status isActive riskScore violations lastViolation")
      .lean();

    const items = users.map((user) => ({
      _id: user._id,
      name: user.name || "",
      email: user.email || "",
      profileImage: user.profileImage || null,
      role: user.role || "student",
      status:
        user.status ||
        (user.isActive === false ? "terminated" : "active"),
      riskScore: Number(user.riskScore) || 0,
      violations: Array.isArray(user.violations)
        ? user.violations
        : [],
      lastViolation: user.lastViolation || null,
    }));

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: {
        items,
        total: items.length,
      },
    });
  } catch (error) {
    console.error("List users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      data: {
        items: [],
        total: 0,
      },
    });
  }
};

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound("User not found");
  return ok(res, { user: user.toJSON() });
});

export const createUser = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ email: req.body.email.toLowerCase() });
  if (exists) throw ApiError.conflict("Email already in use");
  const user = await User.create({ ...req.body, createdBy: req.user._id });
  return created(res, { user: user.toJSON() }, "User created");
});

export const updateUser = asyncHandler(async (req, res) => {
  delete req.body.password;
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) throw ApiError.notFound("User not found");
  return ok(res, { user: user.toJSON() }, "User updated");
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
  if (!user) throw ApiError.notFound("User not found");

  await createNotification(user._id, {
    type: "ACCOUNT_STATUS_CHANGED",
    title: `Account status: ${status}`,
    message: `Your account has been marked as ${status}.`,
  });
  return ok(res, { user: user.toJSON() }, "Status updated");
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw ApiError.notFound("User not found");
  return ok(res, {}, "User deleted");
});

