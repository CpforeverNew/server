import Plugin from '../Plugin'
import phin from 'phin'

export default class Theatre extends Plugin {

    constructor(users, rooms) {
        super(users, rooms);

        this.events = {
            'get_stream': this.getStream
        }

        this.baseUrl = 'https://livestream.cpforever.org';
        this.stream_endpoint = `${this.baseUrl}/hls/stream.m3u8`;
        
        this.streamAvaliable = false;
        this.pollingInterval = 5000;

        this.theatreId = 341;

        this.pollStreamStatus();
    }

    getStream(_, user) {
        if(!this.streamAvaliable) return;

        if(user.streamActive) return;
        if(user.room.id !== this.theatreId) return;

        user.streamActive = true;
        user.send('get_stream', { source: this.stream_endpoint });
    }

    pollStreamStatus() {
        const poll = async () => {
            try {
                const res = await phin({
                    'url': `${this.baseUrl}/api/status`,
                    'parse': 'json'
                });

                const isOnline = res.body.online;

                const room = this.rooms[this.theatreId];
                const _status = { avaliable: isOnline, source: isOnline ? this.stream_endpoint : null };

                if(this.#stateSwitch(isOnline)) {
                    room.send(null, 'theatre_status', _status);
                } else {
                    const filter = room.userValues.filter(penguin => penguin.streamActive === true);
                    room.send(null, 'theatre_status', _status, filter);
                }

                this.streamAvaliable = isOnline;
            } catch(e) {
                this.streamAvaliable = false;
                console.error(`Error checking livestream API -> ${e.stack}`);
            } finally {
                setTimeout(poll, this.pollingInterval)
            }
        }

        poll();
    }

    #stateSwitch(online) {
        return this.streamAvaliable !== online;
    }

}
