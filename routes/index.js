var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");

const passport = require("passport");
const upload = require("./multer");

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/register", function (req, res, next) {
  res.render("index");
});

router.get("/", function (req, res, next) {
  // console.log(req.flash("error"));
  res.render("login", { error: req.flash("error") });
});

router.get("/profile", isLoggedIn, async (req, res) => {
  const user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("posts");
  console.log(user);
  res.render("profile", { user });
});

router.get("/add", isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  console.log(user);
  res.render("add", { user });
});

router.get("/feeds", isLoggedIn, async (req, res) => {
  const posts = await postModel.find().populate("user");
  res.render("feeds", { posts });
  console.log(posts);
});

router.post("/register", (req, res) => {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
    failureFlash: true,
  }),
  function (req, res) {}
);

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

router.post(
  "/fileupload",
  isLoggedIn,
  upload.single("image"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No files were uploaded");
    }
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    user.profileimage = req.file.filename;
    await user.save();
    res.redirect("/profile");
  }
);

router.post(
  "/createpost",
  isLoggedIn,
  upload.single("postimage"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No files were uploaded");
    }

    const user = await userModel.findOne({
      username: req.session.passport.user,
    });

    const post = await postModel.create({
      title: req.body.title,
      description: req.body.description,
      user: user._id,
      image: req.file.filename,
    });

    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
  }
);
// router.get("/createuser", async (req, res) => {
//   let createdUser = await userModel.create({
//     username: "yuvraj_saha",
//     password: "yuvraj_saha",
//     posts: [],
//     email: "yuvrajsaha@gmail.com",
//     fullName: "Yuvraj Saha",
//   });
//   res.send(createdUser);
// });

// router.get("/createpost", async (req, res) => {
//   let createdPost = await postModel.create({
//     postText: "Hello u",
//     user: "6630a84c344ed9810b323064",
//   });
//   let user = await userModel.findOne({ _id: "6630a84c344ed9810b323064" });
//   user.posts.push(createdPost._id);
//   await user.save();
//   res.send("done");
// });

// router.get("/alluserposts", async (req, res) => {
//   let Createduser = await userModel
//     .findOne({
//       _id: "6630a84c344ed9810b323064",
//     })
//     .populate("posts");
//   res.send(Createduser);
// });

module.exports = router;
