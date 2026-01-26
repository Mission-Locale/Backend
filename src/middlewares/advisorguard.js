/**
 * Middleware to check user's authentication.
 * @param {Request} req - Request HTTP
 * @param {Response} res - Response HTTP
 * @param {NextFunction} next - Next stage of the request
 */

async function advisorguard(req, res, next) {
  try {
    if (req.user.roleType !== "ADVISOR") throw "Unauthorized";
    return next();
  } catch (err) {
    return res.status(401).json({ message: err });
  }
}
export default advisorguard;
