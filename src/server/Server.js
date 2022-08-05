import RateLimiterFlexible from 'rate-limiter-flexible'

import User from '../objects/user/User'


export default class Server {

    constructor(id, users, db, handler, config) {
        this.users = users
        this.db = db
        this.handler = handler
        this.config = config

        let io = this.createIo(config.socketio, {
            cors: {
                origin: config.cors.origin,
                methods: ['GET', 'POST']
            },
            path: '/'
        })

       // this.rateLimiter = new RateLimiterFlexible.RateLimiterMemory({
            // 20 events allowed per second
         //   points: 20,
         //   duration: 1
        //})
        this.addressLimiter = new RateLimiterFlexible.RateLimiterMemory({
            points: config.rateLimit.addressEventsPerSecond,
            duration: 1
        })

        this.userLimiter = new RateLimiterFlexible.RateLimiterMemory({
            points: config.rateLimit.userEventsPerSecond,
            duration: 1
        })

        this.server = io.listen(config.worlds[id].port)
        this.server.on('connection', this.connectionMade.bind(this))

        console.log(`[Server] Started world ${id} on port ${config.worlds[id].port}`)
    }

    createIo(config, options) {
        let server = (config.https)
            ? this.httpsServer(config.ssl)
            : this.httpServer()

        return require('socket.io')(server, options)
    }

    httpServer() {
        return require('http').createServer()
    }

    httpsServer(ssl) {
        let fs = require('fs')
        let loaded = {}

        // Loads ssl files
        for (let key in ssl) {
            loaded[key] = fs.readFileSync(ssl[key]).toString()
        }

        return require('https').createServer(loaded)
    }

    connectionMade(socket) {	
        let user = new User(socket, this.handler)	
        user.address = this.getSocketAddress(socket)	
        this.users[socket.id] = user	
        console.log(`[Server] Connection from: ${socket.id} ${user.address}`)	
        socket.on('message', (message) => this.messageReceived(message, user))	
        socket.on('disconnect', () => this.connectionLost(user))	
    }	
    messageReceived(message, user) {	
        this.addressLimiter.consume(user.address)	
            .then(() => {	
                let userID = this.getUserId(user)

                this.userLimiter.consume(userID)	
                    .then(() => {	
                        this.handler.handle(message, user)	
                    })	
                    .catch(() => {	
                        // Blocked user	
                    })	
            })	
            .catch(() => {	
                // Blocked address	
            })	
    }	
    connectionLost(user) {	
        console.log(`[Server] Disconnect from: ${user.socket.id} ${user.address}`)	
        this.handler.close(user)	
    }	
    getSocketAddress(socket) {	
        let headers = socket.handshake.headers	
        let ipAddressHeader = this.config.rateLimit.ipAddressHeader	
        if (ipAddressHeader && headers[ipAddressHeader]) {	
            return headers[ipAddressHeader]	
        }	
        if (headers['x-forwarded-for']) {	
            return headers['x-forwarded-for'].split(',')[0]	
        }	
        return socket.handshake.address	
    }	

    getUserId(user) {
        return (user.data && user.data.id)
            ? user.data.id
            : user.socket.id
    }

}