const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  contact_name: String,
  phone: String,
  contact_id: String,
  timestamp: Date,
  sender: String,
  channel: String,
  message: String,
  attachment_url: String,
});

module.exports = mongoose.model('Conversation', conversationSchema);
