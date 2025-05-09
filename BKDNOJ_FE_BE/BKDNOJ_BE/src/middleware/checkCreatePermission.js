module.exports = function checkCreatePermission(req, res, next) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!(user.can_create_contest || user.role === "admin")) {
    return res
      .status(403)
      .json({ error: "You do not have permission to perform this action." });
  }

  next();
};
