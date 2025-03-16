import os, time

from dotenv import load_dotenv
load_dotenv()

import requests

from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler

# Initializes your app with your bot token and socket mode handler
app = App(token=os.environ.get("SLACK_BOT_TOKEN"))

# figure out the correct thread (get the thread of the huddle Nora is in?)
# TODO

valid_buttons = [
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
]

current_thread_id = "1742060997.770279"
# on message: check if is in the thread
# if so, make request to the emu
@app.event("message")
def handle_message(event):
    print("got message!")
    # throw it away if it's not in a thread
    if "thread_ts" not in event:
        return
    # throw it away if it's not _our_ thread
    if event["thread_ts"] != current_thread_id:
        return

    print("hey got a message:")
    print(event["text"])

    rest_of_msg = event["text"].replace(fr"<@{os.environ.get('SLACK_USER_NAME')}>", "")
    button = rest_of_msg.strip().lstrip()

    if button in valid_buttons: send_button_press(button.capitalize())

def send_button_press(button):
    requests.get(f"{os.environ.get('SKYEMU_HOST')}/input?{button}=1")
    time.sleep(.02)
    requests.get(f"{os.environ.get('SKYEMU_HOST')}/input?{button}=0")

# Start your app
if __name__ == "__main__":
    SocketModeHandler(app, os.environ["SLACK_APP_TOKEN"]).start()