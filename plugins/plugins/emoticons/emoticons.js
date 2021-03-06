/*
* emoticons.js
*
* Creditos: CreaturePhil (Creador)
*/

exports.parse = parseEmoticons;

let emotes = {
	'facepalm': 'http://pogoblog.typepad.com/.a/6a00d8341c68bf53ef0162fff08f5e970d-600wi',
	'#freewolf': 'http://i.imgur.com/ybxWXiG.png',
	'feelsbd': 'http://i.imgur.com/YyEdmwX.png',
	'feelsbm': 'http://i.imgur.com/xwfJb2z.png',
	'feelsbn': 'http://i.imgur.com/wp51rIg.png',
	'feelsdd': 'http://i.imgur.com/fXtdLtV.png',
	'feelsdoge': 'http://i.imgur.com/GklYWvi.png',
	'feelsgd': 'http://i.imgur.com/Jf0n4BL.png',
	'feelsgn': 'http://i.imgur.com/juJQh0J.png',
	'feelshp': 'http://i.imgur.com/1W19BDG.png',
	'feelsmd': 'http://i.imgur.com/DJHMdSw.png',
	'feelsnv': 'http://i.imgur.com/XF6kIdJ.png',
	'feelsok': 'http://i.imgur.com/gu3Osve.png',
	'feelspika': 'http://i.imgur.com/mBq3BAW.png',
	'feelspink': 'http://i.imgur.com/jqfB8Di.png',
	'feelspn': 'http://i.imgur.com/wSSM6Zk.png',
	'feelspr': 'http://i.imgur.com/3VtkKfJ.png',
	'feelsrg': 'http://i.imgur.com/DsRQCsI.png',
	'feelsrs': 'http://i.imgur.com/qGEot0R.png',
	'feelssc': 'http://i.imgur.com/cm6oTZ1.png',
	'fukya': 'http://i.imgur.com/ampqCZi.gif',
	'funnylol': 'http://i.imgur.com/SlzCghq.png',
	'hmmface': 'http://i.imgur.com/Z5lOwfZ.png',
	'noface': 'http://i.imgur.com/H744eRE.png',
	'Obama': 'http://i.imgur.com/rBA9M7A.png',
	'oshet': 'http://i.imgur.com/yr5DjuZ.png',
	'Sanic': 'http://i.imgur.com/Y6etmna.png',
	'wtfman': 'http://i.imgur.com/kwR8Re9.png',
	'xaa': 'http://i.imgur.com/V728AvL.png',
	'yayface': 'http://i.imgur.com/anY1jf8.png',
	'yesface': 'http://i.imgur.com/k9YCF6K.png',

};

let emotesKeys = Object.keys(emotes);
let patterns = [];
let metachars = /[[\]{}()*+?.\\|^$\-,&#\s]/g;

for (let i in emotes) {
	if (emotes.hasOwnProperty(i)) {
		patterns.push('(' + i.replace(metachars, '\\$&') + ')');
	}
}
let patternRegex = new RegExp(patterns.join('|'), 'g');

/**
 * Parse emoticons in message.
 *
 * @param {String} message
 * @param {Object} room
 * @param {Object} user
 * @param {Boolean} pm - returns a string if it is in private messages
 * @returns {Boolean|String}
 */
function parseEmoticons(message, room, user, pm) {
	if (typeof message !== 'string' || (!pm && room.disableEmoticons)) return false;

	let match = false;
	let len = emotesKeys.length;


	while (len--) {
		if (message && message.indexOf(emotesKeys[len]) >= 0) {
			match = true;
			break;
		}
	}

	if (!match) return false;

	// escape HTML
	message = Chat.escapeHTML(message);

	// add emotes
	message = message.replace(patternRegex, function (match) {
		let emote = emotes[match];
		return typeof emote === 'string' ? '<img src="' + emote + '" title="' + match + '" style="height:2.5em;"/>' : match;
	});

	return message;
}

/**
 * Create a two column table listing emoticons.
 *
 * @return {String} emotes table
 */
function create_table() {
	let emotes_name = Object.keys(emotes);
	let emotes_list = [];
	let emotes_group_list = [];
	let len = emotes_name.length;

	for (var i = 0; i < len; i++) {
		emotes_list.push("<td>" +
			"<img src='" + emotes[emotes_name[i]] + "'' title='" + emotes_name[i] + "' height='50' width='50' />" +
			emotes_name[i] + "</td>");
	}

	let emotes_list_right = emotes_list.splice(len / 2, len / 2);

	for (var i = 0; i < len / 2; i++) {
		let emote1 = emotes_list[i],
			emote2 = emotes_list_right[i];
		if (emote2) {
			emotes_group_list.push("<tr>" + emote1 + emote2 + "</tr>");
		} else {
			emotes_group_list.push("<tr>" + emote1 + "</tr>");
		}
	}

	return "<div class='infobox'><div class = 'broadcast-blue'><center><b><u>Lista de caritas</u></b></center>" + "<div class='infobox-limited'><table cellspacing='0' cellpadding='5' width='100%'>" + "<tbody>" + emotes_group_list.join("") + "</tbody>" + "</table></div></div>";
}

let emotes_table = create_table();

exports.commands = {
	blockemote: 'blockemoticons',
	blockemotes: 'blockemoticons',
	blockemoticon: 'blockemoticons',
	blockemoticons: function (target, room, user) {
		if (user.blockEmoticons === (target || true)) return this.sendReply("You are already blocking emoticons in private messages! To unblock, use /unblockemoticons");
		user.blockEmoticons = true;
		return this.sendReply("You are now blocking emoticons in private messages.");
	},
	blockemoticonshelp: ["/blockemoticons - Blocks emoticons in private messages. Unblock them with /unblockemoticons."],

	unblockemote: 'unblockemoticons',
	unblockemotes: 'unblockemoticons',
	unblockemoticon: 'unblockemoticons',
	unblockemoticons: function (target, room, user) {
		if (!user.blockEmoticons) return this.sendReply("You are not blocking emoticons in private messages! To block, use /blockemoticons");
		user.blockEmoticons = false;
		return this.sendReply("You are no longer blocking emoticons in private messages.");
	},
	unblockemoticonshelp: ["/unblockemoticons - Unblocks emoticons in private messages. Block them with /blockemoticons."],

	caritas: 'emoticons',
	emotes: 'emoticons',
	emoticons: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReply("|raw|" + emotes_table);
	},
	emoticonshelp: ["/emoticons - Get a list of emoticons."],

	onofcaritas: 'toggleemoticons',
	toggleemote: 'toggleemoticons',
	toggleemotes: 'toggleemoticons',
	toggleemoticons: function (target, room, user) {
		if (!this.can('declare', null, room)) return false;
		room.disableEmoticons = !room.disableEmoticons;
		this.sendReply("Disallowing emoticons is set to " + room.disableEmoticons + " in this room.");
		if (room.disableEmoticons) {
			this.add("|raw|<div class=\"broadcast-red\"><b>las caritas han sido desactivadas!</b><br />No se podran utilizar emoticones hasta nuevo aviso.</div>");
		} else {
			this.add("|raw|<div class=\"broadcast-green\"><b>Las caritas han sido activadas!</b><br />Ya se pueden usar emoticones.</div>");
		}
	},
	toggleemoticonshelp: ["/toggleemoticons - Toggle emoticons on or off."],

	rande: 'randemote',
	randemote: function (target, room, user) {
		if (!this.runBroadcast()) return;
		let rng = Math.floor(Math.random() * emotesKeys.length);
		let randomEmote = emotesKeys[rng];
		this.sendReplyBox("<img src='" + emotes[randomEmote] + "' title='" + randomEmote + " />");
	},
	randemotehelp: ["/randemote - Get a random emote."],
};