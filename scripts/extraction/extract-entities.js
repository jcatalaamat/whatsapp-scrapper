import fs from 'fs';

// Read the messages file
const messages = JSON.parse(fs.readFileSync('./data/messages_20251026_201832.json', 'utf8'));

// Save messages with text content for AI processing
const messagesWithText = messages
  .filter(msg => msg.message_body && msg.message_body.trim().length > 20)
  .map(msg => ({
    id: msg.id,
    date: msg.timestamp,
    group: msg.group_name,
    sender: msg.sender_name,
    text: msg.message_body
  }));

// Write messages that need processing
fs.writeFileSync('./messages-for-extraction.json', JSON.stringify(messagesWithText, null, 2));

console.log(`Found ${messagesWithText.length} messages with substantial text content`);
console.log(`Saved to messages-for-extraction.json for AI processing`);
