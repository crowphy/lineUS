/*
@Crowphy
 */
window.onload = function() {
    var chat = new Chat();
    chat.init();
};
var Chat = function() {
    this.socket = null;
};
Chat.prototype = {
    init: function() {
        var that = this;

        this.socket = io.connect('http://localhost:3000/chat', {'transports':['websocket']});
        var receivedInfo = {};        
        var temp = location.search.substr(1).split('&');
        receivedInfo.username = temp[0].split('=')[1];
        receivedInfo.userPhoneNum = temp[1].split('=')[1];
        console.log(receivedInfo);
        this.socket.on('connect', function() {
            console.log('connecting successfully');
            document.title = receivedInfo.username;
            document.getElementById('username').textContent = receivedInfo.username;
            document.getElementById('messageInput').focus();
        });

        this.socket.on('error', function(err) {
            if (document.getElementById('loginWrapper').style.display == 'none') {
                document.getElementById('status').textContent = '!fail to connect :(';
            } else {
                document.getElementById('info').textContent = '!fail to connect :(';
            }
        });

        this.socket.on('system', function(nickName, userCount, type) {
            var msg = nickName + (type == 'login' ? ' joined' : ' left');
            that._displayNewMsg('system ', msg, 'red');
            document.getElementById('status').textContent = userCount + (userCount > 1 ? ' users' : ' user') + ' online';
        });

        this.socket.on('15626213301', function(news) {
            console.log(news);
            if(news.from === receivedInfo.userPhoneNum) {
                that._displayNewMsg(news.name, news.text);
            }
        });

        this.socket.on('newImg', function(user, img, color) {
            that._displayImage(user, img);
        });

        function _sendNews() {
            var messageInput = document.getElementById('messageInput');
            var news = {};
            var pos = 'right';
            news.to = receivedInfo.userPhoneNum;
            news.receiveName = receivedInfo.username;
            news.from = '15626213301';
            news.sendName = 'Admin';
            news.uniqueId = Math.round(Math.random() * 10000);
            news.text = messageInput.value;
            if (news.text.trim().length != 0) {
                that.socket.emit('postMsg', news);
                messageInput.value = '';
                messageInput.focus();
            };            
            that._displayNewMsg('admin', news.text, pos);
            return;
        }

        document.getElementById('sendBtn').addEventListener('click', function() {
            _sendNews();       
        }, false);

        document.getElementById('messageInput').addEventListener('keyup', function(e) {
            if (e.keyCode == 13) {
                _sendNews()
            };
        }, false);


        document.getElementById('clearBtn').addEventListener('click', function() {
            document.getElementById('historyMsg').innerHTML = '';
        }, false);
        document.getElementById('sendImage').addEventListener('change', function() {
            if (this.files.length != 0) {
                var file = this.files[0],
                    reader = new FileReader(),
                    color = document.getElementById('colorStyle').value;
                if (!reader) {
                    that._displayNewMsg('system', '!your browser doesn\'t support fileReader', 'red');
                    this.value = '';
                    return;
                };
                reader.onload = function(e) {
                    this.value = '';
                    that.socket.emit('img', e.target.result, color);
                    that._displayImage('admin', e.target.result, color);
                };
                reader.readAsDataURL(file);
            };
        }, false);
        this._initialEmoji();
        document.getElementById('emoji').addEventListener('click', function(e) {
            var emojiwrapper = document.getElementById('emojiWrapper');
            emojiwrapper.style.display = 'block';
            e.stopPropagation();
        }, false);
        document.body.addEventListener('click', function(e) {
            var emojiwrapper = document.getElementById('emojiWrapper');
            if (e.target != emojiwrapper) {
                emojiwrapper.style.display = 'none';
            };
        });
        document.getElementById('emojiWrapper').addEventListener('click', function(e) {
            var target = e.target;
            if (target.nodeName.toLowerCase() == 'img') {
                var messageInput = document.getElementById('messageInput');
                messageInput.focus();
                messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
            };
        }, false);
    },
    _initialEmoji: function() {
        var emojiContainer = document.getElementById('emojiWrapper'),
            docFragment = document.createDocumentFragment();
        for (var i = 69; i > 0; i--) {
            var emojiItem = document.createElement('img');
            emojiItem.src = '/img/emoji/' + i + '.gif';
            emojiItem.title = i;
            docFragment.appendChild(emojiItem);
        };
        emojiContainer.appendChild(docFragment);
    },
    _displayNewMsg: function(user, msg, pos) {
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8),
            //determine whether the msg contains emoji
            msg = this._showEmoji(msg);
        //msgToDisplay.style.color = '#000';
        msgToDisplay.style.textAlign = pos || 'left';
        if(pos === 'right') {
            msgToDisplay.innerHTML = msg + '<span class="timespan">(' + date + '): </span>' + user;
        } else {
            msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
        }
        
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    },
    _displayImage: function(user, imgData, color) {
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span> <br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>';
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    },
    _showEmoji: function(msg) {
        var match, result = msg,
            reg = /\[emoji:\d+\]/g,
            emojiIndex,
            totalEmojiNum = document.getElementById('emojiWrapper').children.length;
        while (match = reg.exec(msg)) {
            emojiIndex = match[0].slice(7, -1);
            if (emojiIndex > totalEmojiNum) {
                result = result.replace(match[0], '[X]');
            } else {
                result = result.replace(match[0], '<img class="emoji" src="/img/emoji/' + emojiIndex + '.gif" />');//todo:fix this in chrome it will cause a new request for the image
            };
        };
        return result;
    }
};
