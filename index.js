const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");
const productRouters = require("./routes/products.routes");
const categoriesRouters = require("./routes/category.routes");
const brandsRouters = require("./routes/brands.routes");
const usersRouter = require("./routes/user.routes");
const authRouter = require("./routes/Auth.routes");
const cartRouter = require("./routes/cart.routes");
const orderRouter = require("./routes/order.routes");
const User = require("./models/user.model.js");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const Order = require("./models/order.models");
const app = express();

//webhook hello
const endpointSecret = process.env.ENDPOINT_SECRET;

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        const order = await Order.findById(
          paymentIntentSucceeded.metadata.orderId
        );
        order.paymentStatus = "received";
        await order.save();

        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

// JWT options
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

// middlewears

app.use(express.static(path.resolve(__dirname, "dist")));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.authenticate("session"));
app.use(
  cors({
    exposedHeaders: ["X-Total-count"],
  })
);
// app.use(express.raw({ type: "application/json" }));
app.use(express.json({ limit: "50mb" })); //to parse req.body
app.use("/products", isAuth(), productRouters.router);
app.use("/categories", isAuth(), categoriesRouters.router);
app.use("/brands", isAuth(), brandsRouters.router);
app.use("/users", isAuth(), usersRouter.router);
app.use("/auth", authRouter.router);
app.use("/cart", isAuth(), cartRouter.router);
app.use("/orders", isAuth(), orderRouter.router);
app.get("*", (req, res) => res.sendFile(path.resolve("dist", "index.html")));

// Password Strategies
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function verify(
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email }).exec();

      if (!user) {
        return done(null, false, { message: "invalid credentials" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        31000,
        32,
        "sha256",
        async (err, hashedPassword) => {
          if (err) return done(err);
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          }
          const token = jwt.sign(
            sanitizeUser(user),
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5h" }
          );
          return done(null, { id: user.id, role: user.role, token });
        }
      );
    } catch (error) {
      return done(error);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user));
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

//this created session variable req.user on being called
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

//this created session variable req.user when called from authroized request
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// Payments

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

app.post("/create-payment-intent", async (req, res) => {
  const { totalAmount, orderId } = req.body;
  console.log(totalAmount, orderId);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(Number(totalAmount) * 100),
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("database  connected");
}

app.listen(process.env.PORT, () => {
  console.log("server is started");
});
