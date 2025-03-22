// middleware/checkRole.js
const checkRole = (requiredRole) => {
    return (req, res, next) => {
      const { auth } = req;
      
      if (!auth || !auth.payload || !auth.payload.permissions) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }
      
      const hasRole = auth.payload.permissions.includes(requiredRole);
      
      if (!hasRole) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }
      
      next();
    };
  };
  
module.exports = checkRole;