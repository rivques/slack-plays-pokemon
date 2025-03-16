# slack-plays-pokemon
To use:
1. set up `slackbot/.env` according to `slackbot/.env.example`
2. build and run docker-compose.yml
3. VNC into the container
4. in the emulator, turn on the http server
4. in the container, open Chrome, log into Slack, and pick a channel
5. make sure the slackbot is in the channel, start a huddle, and share the emulator screen
5. in the huddle thread, write "SPP here!" to get the slackbot to recognize it
6. everthing should work! you should be able to close the vnc session now