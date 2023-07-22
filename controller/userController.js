const User = require("../model/user");
const Feed = require("../model/post");
const jwt = require("jsonwebtoken");
const axios = require("axios");

exports.discord = async (req, res) => {
  try {
    res.redirect(process.env.URL);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "something went wrong" });
  }
};

exports.callback = async (req, res) => {
  if (!req.query.code) throw new Error("Code not provided.");
  try {
    const { code } = req.query;
    const params = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.CALLBACK_URL,
    });

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept-Encoding": "application/x-www-form-urlencoded",
    };

    const response = await axios.post(
      "https://discord.com/api/oauth2/token",
      params,
      {
        headers,
      }
    );

    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
        ...headers,
      },
    });

    const { id, global_name } = userResponse.data;

    var user = await User.findOne({ discordId: id });

    if (user) {
      const accessToken = generateAccessToken({ _id: user._id });
      res.status(200).send({
        token: accessToken,
        message: "user already registered",
      });
    } else {
      var user = await User.create({
        name: global_name,
        discordId: id,
      });
      const accessToken = generateAccessToken({ _id: user._id });
      res.status(200).send({
        message: "user created sucessfully",
        Token: accessToken,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "something went wrong" });
  }
};

exports.post = async (req, res) => {
  try {
    var feed = await Feed.create({
      user_id: req._id,
      feed: req.body.feed,
    });
    res.status(200).send({ message: "feed posted sucessfully", feed: feed });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "something went wrong" });
  }
};

exports.get = async (req, res) => {
  try {
    var feed = await Feed.findOne({ _id: req.query.id });
    res.status(200).send({ message: "feed retrieved sucessfully", feed: feed });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "something went wrong" });
  }
};

exports.patch = async (req, res) => {
  try {
    var feed = await Feed.findByIdAndUpdate(
      { _id: req.query.id },
      { feed: req.body.feed },
      { new: true }
    );
    res.status(200).send({ message: "feed updated sucessfully", feed: feed });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "something went wrong" });
  }
};

exports.delete = async (req, res) => {
  try {
    var feed = await Feed.deleteOne({ _id: req.query.id });
    res.status(200).send({ message: "feed deleted sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "something went wrong" });
  }
};

const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};
