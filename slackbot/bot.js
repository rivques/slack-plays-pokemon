const { App, subtype } = require('@slack/bolt');
const axios = require('axios');

// Initialize the app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Valid buttons for the emulator
const validButtons = [
  "a",
  "b",
  "x",
  "y",
  "up",
  "down",
  "left",
  "right",
  "select",
  "start"
];
// https://hackclub.slack.com/archives/C08EG7ESA2W/p1742083033446409?thread_ts=1742083029.266069&cid=C08EG7ESA2W
// https://hackclub.slack.com/archives/C08EG7ESA2W/p1742083627701709?thread_ts=1742083623.100279&cid=C08EG7ESA2W
// Thread ID to monitor
let currentThreadId = "1742083623.100279";

// Listen for app mentions


app.message( async ({ event }) => {
  console.log("Got message!");

  // Throw away if not in a thread
  if (!event.thread_ts) {
    return;
  }
  // if it's a request to make it our thread:
  if (event.text.includes("SPP here!") && process.env.ADMIN_USERS.split(",").includes(event.user)) {
    currentThreadId = event.thread_ts
    console.log(`Now listening to ${currentThreadId} (requested by @${event.user})`)
    return;
  }

  // Throw away if not our thread
  if (event.thread_ts !== currentThreadId) {
    return;
  }

  console.log("Hey got a message:");
  console.log(event.text);

  // Extract button from the message
  const restOfMsg = event.text.replace(`<@${process.env.SLACK_USER_NAME}>`, "");
  const button = restOfMsg.trim().toLowerCase();

  if (validButtons.includes(button)) {
    await sendButtonPress(button.charAt(0).toUpperCase() + button.slice(1));
  }
});

async function sendButtonPress(button) {
  try {
    await axios.get(`${process.env.SKYEMU_HOST}/input?${button}=1`);
    await new Promise(resolve => setTimeout(resolve, 200)); // 20ms delay
    await axios.get(`${process.env.SKYEMU_HOST}/input?${button}=0`);
  } catch (error) {
    console.error(`Error sending button press: ${error}`);
  }
}

// Start the app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();