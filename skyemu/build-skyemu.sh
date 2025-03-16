cd SkyEmu || exit

git checkout f8573db83d15791b0cd94c29ceb46bf683963ff0

mkdir build && cd build

cmake ..

cmake --build .

echo "HEY! `pwd`"