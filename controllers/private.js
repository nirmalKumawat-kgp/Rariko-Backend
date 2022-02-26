exports.getPrivateData = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
  console.log(req.user);
};
