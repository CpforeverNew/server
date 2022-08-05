FROM node:16

WORKDIR /home/node/app

# We're just going to tail /dev/null so we can keep the container open
# since (at this point) we just want to use it as an environment that
# mirrors the server
CMD [ "tail", "-f", "/dev/null" ]
