import { PerspectiveAnalysisResult } from '../services/filter/Perspective';

const channels = {
  chat: '969631117642698872',
  moderation: '970279187707465759',
  login: '969631284294991882',
  reporting: '996152869994639410',
  errors: '999483558794105023',
}

export default class Discord {
    ready = false;

    constructor(client) {
        this.dcbot = client

        this.dcbot.once('ready', () => {
            this.ready = true
        })
    }

    logChatMessage(username, message, room, filterResult) {
        if (!this.ready || process.mode === 'dev') return

        const channel = this.dcbot.channels.cache.get(channels.chat)
        let output = `**USER:** ${username}\n**SENT MESSAGE:** ${message}\n**IN ROOM:** ${room}`

        if (filterResult instanceof PerspectiveAnalysisResult) {
            output += `\n**TOXICITY:** ${toxicity}\n**PROFANITY:** ${profanity}\n**SEXUAL:** ${sexual}`
        }

        channel.send(output);
    }

    logLogin(username) {
        if (!this.ready || process.mode === 'dev') return

        const channel = this.dcbot.channels.cache.get(channels.login)
        channel.send(`**USER:** ${username} **LOGGED IN**`);
    }

    kickLogs(moderator, user) {
        if (!this.ready || process.mode === 'dev') return

        const channel = this.dcbot.channels.cache.get(channels.moderation)
        channel.send(`**MODERATOR:** ${moderator} **KICKED USER** ${user}`);
    }

    banLogs(moderator, user, duration, expires) {
        if (!this.ready || process.mode === 'dev') return

        const channel = this.dcbot.channels.cache.get(channels.moderation)
        channel.send(`**MODERATOR:** ${moderator} **BANNED USER** ${user} **FOR** ${duration} **UNTIL** ${expires}`);
    }

    addItemLogs(moderator, user, item) {
        if (!this.ready || process.mode === 'dev') return

        const channel = this.dcbot.channels.cache.get(channels.moderation)
        channel.send(`**MODERATOR:** ${moderator} **ADDED ITEM** ${item} **TO USER** ${user}`);
    }

    addCoinLogs(moderator, user, coins) {
        if (!this.ready || process.mode === 'dev') return

        const channel = this.dcbot.channels.cache.get(channels.moderation)
        channel.send(`**MODERATOR:** ${moderator} **ADDED** ${coins} **COINS TO USER** ${user}`);
    }

    changeUsernameLogs(moderator, oldname, newname) {
        if (!this.ready || process.mode === 'dev') return

        const channel = this.dcbot.channels.cache.get(channels.moderation)
        channel.send(`**MODERATOR:** ${moderator} **CHANGED THE USERNAME OF** ${oldname} **TO** ${newname}`);
    }

    activateUserLogs(moderator, user) {
        if (!this.ready || process.mode === 'dev') return;
        const channel = this.dcbot.channels.cache.get(channels.moderation);
        channel.send(`**MODERATOR:** ${moderator} **ACTIVATED USER** ${user}`);
    }

    async reportPlayer(reason, username, id, reporterUsername, lastReport=0, userID=0) {
        if (!this.ready) return
        const channel = this.dcbot.channels.cache.get(channels.reporting)

        if (!this.fakeReports) {
            this.fakeReports = 0;
        }

        if (reason == "lang") {
            this.fakeReports = 0;
            process.mode !== 'dev' && channel.send({ content: `**USER:** ${reporterUsername} **REPORTED** ${username} **FOR INAPPROPRIATE LANGUAGE**\nPlease can a <@&968646503834988555> review the most recent lines on the attached chat log.\nTIP: If taking action, remember to copy-paste the username into the mod panel in case they use something like a capital i instead of an L`, files: [{ attachment: `./logs/chat/${id}.log`, name: `${username}-log.txt`}] });
        }
        else if (reason == "name") {
            this.fakeReports = 0;
            process.mode !== 'dev' && channel.send(`**USER:** ${reporterUsername} **REPORTED** ${username} **FOR HAVING AN INAPPROPRIATE USERNAME**\nPlease can a <@&968646503834988555> research this username in more detail to check if it is inappropriate or not.\nTIP: If taking action, remember to copy-paste the username into the mod panel in case they use something like a capital i instead of an L`);
        }
        else if (reason == "igloo") {
            this.fakeReports = 0;
            process.mode !== 'dev' && channel.send(`**USER:** ${reporterUsername} **REPORTED** ${username} **FOR HAVING AN INAPPROPRIATE IGLOO**\nPlease can a <@&968646503834988555> log on and review the suitability of their igloo.\nTIP: If taking action, remember to copy-paste the username into the mod panel in case they use something like a capital i instead of an L`);
        } else if (reason == "duplicate") {
            let seconds = (new Date).getTime() - lastReport
            seconds = this.msToTime(seconds)
            if (this.fakeReports == 0) {
                this.fakeReports += 1;
                process.mode !== 'dev' && (this.msg = await channel.send(`**USER:** ${reporterUsername} attempted to send a report while they were ratelimited from their last report.\n*If they continue spamming this function, please feel free to take moderator action against their account.*\n\nLast report w/o ratelimit was **${seconds} ago** and they have spammed this function **${this.fakeReports} times**.`))
                return this.fakeReports
            } else {
                this.fakeReports += 1;
                if (this.fakeReports >= 12) {
                    let date = new Date()
                    let expiry = date.getTime() + 86400000
                    this.msg.edit(`**USER:** ${reporterUsername} attempted to send a report while they were ratelimited from their last report.\n*If they continue spamming this function, please feel free to take moderator action against their account.*\n\nLast report w/o ratelimit was **${seconds} ago** and they have spammed this function **${this.fakeReports} times**.\n\n\n**The user has been banned for spamming too much**.`)
                    return this.fakeReports
                }
                this.msg.edit(`**USER:** ${reporterUsername} attempted to send a report while they were ratelimited from their last report.\n*If they continue spamming this function, please feel free to take moderator action against their account.*\n\nLast report w/o ratelimit was **${seconds} ago** and they have spammed this function **${this.fakeReports} times**.`)
                return this.fakeReports
            }
        }
    }

    msToTime(s) {
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;
      
        return `${mins} minutes and ${secs} seconds`
      }

    errorAlert(error) {
        if (!this.ready || process.mode === 'dev') return

        const channel = this.dcbot.channels.cache.get(channels.errors)
        channel.send(`**ERROR:** ${error} **REPORTED**`);
    } 
}