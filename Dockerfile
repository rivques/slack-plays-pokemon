FROM linuxserver/webtop:fedora-xfce

WORKDIR /opt/silly

RUN dnf install -y cmake git gcc gcc-c++ make

RUN git clone https://github.com/skylersaleh/SkyEmu # why does this clone take so fucking long

RUN dnf install -y alsa-utils alsa-lib mesa-libGLU-devel alsa-lib-devel
RUN dnf install -y libXext-devel libXi-devel libXcursor-devel
COPY skyemu skyemu

RUN skyemu/build-skyemu.sh

RUN dnf install -y obs

COPY illegal_rom illegal_rom
COPY autostarts/* /etc/xdg/autostart/

ARG BUN_INSTALL=/opt/silly/bun
RUN curl -fsSL https://bun.sh/install | bash
COPY slackbot slackbot

WORKDIR /opt/silly/slackbot
RUN /opt/silly/bun/bin/bun i
ENTRYPOINT ["/opt/silly/bun/bin/bun", "run", "bot.js"]