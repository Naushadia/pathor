const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  feed: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Post', postSchema);