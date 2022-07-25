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
        this.pollingDelay = 5000;

        this.theatreId = 341;

        this.#getStreamStatus();
        setInterval(this.#getStreamStatus.bind(this), this.pollingDelay);
    }

    getStream(_, user) {
        if(!this.streamAvaliable) return;

        if(user.streamActive) return;
        if(user.room.id !== this.theatreId) return;

        user.streamActive = true;
        user.send('get_stream', { source: this.stream_endpoint });
    }

    #getStreamStatus() {
        phin({
            'url': `${this.baseUrl}/api/status`,
            'parse': 'json'
        }).then(res => {
            this.streamAvaliable = res.body.online;

            this.rooms[this.theatreId].send(null, 'theatre_status', { avaliable: this.streamAvaliable, source: this.streamAvaliable ? this.stream_endpoint : null });
        }).catch(error => {
            this.streamAvaliable = false;
            console.error(`Error checking livestream API -> ${error.stack}`);
        });
    }

}
