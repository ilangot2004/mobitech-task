function validateId(resourceName) {
  return (req, res, next) => {
    if (!/^[1-9]\d*$/.test(req.params.id)) {
      return res.status(400).json({
        error: `${resourceName} id must be a positive integer`
      });
    }
    return next();
  };
}

module.exports = { validateId };
