"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _discord = require("discord.js");

class Discord {
  constructor(config) {
    this.ready = false;
    this.config = config;
    const token = config.discordbottoken;
    const dcbot = new _discord.Client({
      intents: [_discord.Intents.FLAGS.GUILDS]
    });
    this.dcbot = dcbot;
    this.dcbot.once('ready', () => {
      console.log('CPForever Discord Logging Ready!');
      this.ready = true;
    });
    this.dcbot.login(token);
  }

  logChatMessage(username, message, room, toxicity, profanity, sexual) {
    if (!this.ready) return;
    const channel = this.dcbot.channels.cache.get(this.config.chatlogchannel);
    channel.send(`**USER:** ${username}\n**SENT MESSAGE:** ${message}\n**IN ROOM:** ${room}\n**TOXICITY:** ${toxicity}\n**PROFANITY:** ${profanity}\n**SEXUAL:** ${sexual}`);
  }

  logLogin(username) {
    if (!this.ready) return;
    const channel = this.dcbot.channels.cache.get(this.config.loginlogchannel);
    channel.send(`**USER:** ${username} **LOGGED IN**`);
  }

  kickLogs(moderator, user) {
    if (!this.ready) return;
    const channel = this.dcbot.channels.cache.get(this.config.modlogchannel);
    channel.send(`**MODERATOR:** ${moderator} **KICKED USER** ${user}`);
  }

  banLogs(moderator, user, duration, expires) {
    if (!this.ready) return;
    const channel = this.dcbot.channels.cache.get(this.config.modlogchannel);
    channel.send(`**MODERATOR:** ${moderator} **BANNED USER** ${user} **FOR** ${duration} **UNTIL** ${expires}`);
  }

  addItemLogs(moderator, user, item) {
    if (!this.ready) return;
    const channel = this.dcbot.channels.cache.get(this.config.modlogchannel);
    channel.send(`**MODERATOR:** ${moderator} **ADDED ITEM** ${item} **TO USER** ${user}`);
  }

  addCoinLogs(moderator, user, coins) {
    if (!this.ready) return;
    const channel = this.dcbot.channels.cache.get(this.config.modlogchannel);
    channel.send(`**MODERATOR:** ${moderator} **ADDED** ${coins} **COINS TO USER** ${user}`);
  }

  changeUsernameLogs(moderator, oldname, newname) {
    if (!this.ready) return;
    const channel = this.dcbot.channels.cache.get(this.config.modlogchannel);
    channel.send(`**MODERATOR:** ${moderator} **CHANGED THE USERNAME OF** ${oldname} **TO** ${newname}`);
  }

  async reportPlayer(reason, username, id, reporterUsername, lastReport = 0) {
    if (!this.ready) return;
    const channel = this.dcbot.channels.cache.get("996152869994639410");

    if (!this.fakeReports) {
      this.fakeReports = 0;
    }

    if (reason == "lang") {
      this.fakeReports = 0;
      channel.send({
        content: `**USER:** ${reporterUsername} **REPORTED** ${username} **FOR INAPPROPRIATE LANGUAGE**\nPlease can a <@&968646503834988555> review the most recent lines on the attached chat log.\nTIP: If taking action, remember to copy-paste the username into the mod panel in case they use something like a capital i instead of an L`,
        files: [{
          attachment: `./logs/chat/${id}.log`,
          name: `${username}-log.txt`
        }]
      });
    } else if (reason == "name") {
      this.fakeReports = 0;
      channel.send(`**USER:** ${reporterUsername} **REPORTED** ${username} **FOR HAVING AN INAPPROPRIATE USERNAME**\nPlease can a <@&968646503834988555> research this username in more detail to check if it is inappropriate or not.\nTIP: If taking action, remember to copy-paste the username into the mod panel in case they use something like a capital i instead of an L`);
    } else if (reason == "igloo") {
      this.fakeReports = 0;
      channel.send(`**USER:** ${reporterUsername} **REPORTED** ${username} **FOR HAVING AN INAPPROPRIATE IGLOO**\nPlease can a <@&968646503834988555> log on and review the suitability of their igloo.\nTIP: If taking action, remember to copy-paste the username into the mod panel in case they use something like a capital i instead of an L`);
    } else if (reason == "duplicate") {
      let seconds = new Date().getTime() - lastReport;
      seconds = this.msToTime(seconds);

      if (this.fakeReports == 0) {
        this.fakeReports += 1;
        this.msg = await channel.send(`**USER:** ${reporterUsername} attempted to send a report while they were ratelimited from their last report.\n*If they continue spamming this function, please feel free to take moderator action against their account.*\n\nLast report w/o ratelimit was **${seconds} ago** and they have spammed this function **${this.fakeReports} times**.`);
      } else {
        this.fakeReports += 1;
        this.msg.edit(`**USER:** ${reporterUsername} attempted to send a report while they were ratelimited from their last report.\n*If they continue spamming this function, please feel free to take moderator action against their account.*\n\nLast report w/o ratelimit was **${seconds} ago** and they have spammed this function **${this.fakeReports} times**.`);
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
    return `${mins} minutes and ${secs} seconds`;
  }

  errorAlert(error) {
    if (!this.ready) return;
    const botadmin = this.dcbot.users.fetch(this.config.botowner);
    botadmin.send(`**ERROR:** ${error} **REPORTED**`);
  }

}

exports.default = Discord;