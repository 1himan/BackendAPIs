/**
 * @fileoverview Role-based Access Control Middleware
 * Validates if the authenticated user has the required role(s) to access a route
 *
 * @module middlewares/roleMiddleware
 */

/**
 * Creates middleware to check if user has required role(s)
 *
 * @param {string|string[]} roles - Single role or array of roles that are allowed access
 * @returns {Function} Express middleware function
 *
 * @example
 * // Single role check
 * app.get('/admin', roleMiddleware('admin'), adminController.dashboard);
 *
 * @example
 * // Multiple roles check
 * app.get('/reports', roleMiddleware(['admin', 'manager']), reportController.view);
 */
const roleMiddleware = (roles) => {
  /**
   * Express middleware function that validates user role
   *
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object (set by auth middleware)
   * @param {string} req.user.role - Role of the authenticated user
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   * @returns {void|Response} Calls next() if authorized, returns 403 if unauthorized
   */
  return (req, res, next) => {
    // Convert single role to array for consistent handling
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied, insufficient role" });
    }
    next();
  };
};

module.exports = roleMiddleware;
