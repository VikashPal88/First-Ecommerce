const passport = require("passport");

exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt", { session: false });
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  // Tdod thisi s temperoary
  // token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzA5NjVmMjczMzI0NThhZWE0NzRlNSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzIzODk3NTQ5LCJleHAiOjE3MjM5MTU1NDl9.5S8Z3NZkn_nslV0ktGZ8AyCJauvBESfNSh0BhF7I9yk";
  return token;
};
