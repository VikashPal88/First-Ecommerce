const passport = require("passport");

exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt", { session: false });
};

// exports.isAuth = (req, res, done) => {
//   return passport.authenticate("jwt", { session: false }, (err, user, info) => {
//     if (err) return done(err, false);
//     if (!user) return res.status(401).json({ message: "Unauthorized" });
//     req.user = user; // Attach user to request object
//     done();
//   })(req, res, done);
// };

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
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YmIyNjZmNDcwY2FlOGE3ZDI5NTEyMCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzIzNTQxMTAzfQ.0GdaFs5-x0Y2Mzsi3J9oeLpWIokydYbSnYQJpzrL6wA";
  return token;
};
