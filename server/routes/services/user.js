var mongoose = require('mongoose');
var moment = require('moment');
var UserSchema = require('../../models/userSchema');

var UserModel = mongoose.model('User', UserSchema);

var User = {
    init: function (app) {
        app.get('/', this.index);
        app.post('/user/edit', this.editUser);
        app.post('/user/register', this.register);
        app.get('/user/getallusers', this.getAllUsers);
        app.post('/user/login', this.login);
        app.post('/user/addcontact', this.addContact);
        app.post('/user/deletecontact', this.deleteContact);
        app.post('/user/changeinfo', this.changeInfo);      
        app.get('/user/getpicture', this.getPicture);
        app.post('/user/addtag', this.addTag);
    },

    index: function(req, res) {
        console.log('test');
        res.render('test', { title: 'hello' });
        // UserModel.find({}, function(err, docs) {
        //   if(err) {
        //     console.log(err);
        //   } else {
        //     res.json(docs);
        //     console.log(docs);
        //   }
        // })
    },

    register: function (req, res) {
        var userInfo = req.body;
        var time = moment().format('YYYY MM Do, h:mm:ss a');
        var user = new UserModel({
            username: userInfo.username,
            userPhoneNum: userInfo.userPhoneNum,
            password: userInfo.password,
            contacts: [{
                contactName: 'Admin',
                contactPhoneNum: '15626213301',
                isMatched: true
            }],
            createTime: time,
            //avatarUri: '',
        });

        user.save(function(err) {
            console.log(user);
            if(err) {
                res.send({
                    status: 0,
                    msg:'未知错误!'
                });
            } else {
                res.send({
                    status: 1,
                    msg: '注册成功!'
                });
            }
        });
    },
    editUser: function(req, res) {
        console.log('请求:', req.body);
        var id = req.body.id;
        UserModel.remove({_id: id}, function(err, data) {
            if(err) {
                console.log('err:', err);
                res.send({
                    status: 0,
                    msg: '出错了'
                });
            } else {
                //console.log('data:', data);
                res.render('index', {title: '管理员'});
            }     
        })
        
    },
    getAllUsers: function(req, res) {
        UserModel.find({}, function(err, data) {
            if(err) {
                console.log(err);
            } else {
                res.json(data);
            }
        })
    },
    login: function(req, res) {
        var account = req.body.account;
        var password = req.body.password;
        UserModel.find({$or: [{'username': account}, {'userPhoneNum': account}]}, function(err, data) {
            if(err) {
                res.send({
                    status: 0,
                    msg:'未知错误'
                });
            } else if(!data.length) {
                res.send({
                    status: 2,
                    msg:'用户不存在'
                });
            } else if(data[0].password !== password) {
                res.send({
                    status: 3,
                    msg:'帐号或密码错误'
                });
            } else {
                console.log('-----OK-----');
                console.log(data[0].password);
                return res.send({
                    status: 1,
                    userInfo: data
                });
            }
        });
    },
    addContact: function(req, res) {
        var _id = req.body.userID;
        var userPhoneNum = req.body.userPhoneNum;
        var contact = req.body;
        var contactPhoneNum = contact.contactPhoneNum;
        UserModel.findOne({userPhoneNum: contactPhoneNum}, function(err, user) {
            if(err) {
                console.log('err', err);
            } else {
                if(user) {
                    var contacts = user.contacts;
                    var len = contacts.length;
                    for(var i = 0; i < len; i++) {
                        if(userPhoneNum === contacts[i].contactPhoneNum) {
                            contact.isMatched = true;
                            contacts[i].isMatched = true;
                            user.save();
                            return;
                        }
                    }
                }
            }
        });
        UserModel.findById(_id, function(err, user) {
            user.contacts.push(contact);
            user.save(function(err, data) {
                if(err) {
                    console.log('err', err);
                    res.send({
                        status: 0,
                        msg:'添加失败!'
                    });
                } else {
                    res.send({
                        status: 1,
                        msg: data
                    })
                }
            });
        });
    },

    deleteContact: function(req, res) {
        var _id = req.body.userID;
        var contactID = req.body.contactID;
        UserModel.findById(_id, function(err, user) {
            user.contacts.id(contactID).remove();
            user.save(function(err, data) {
                if(err) {
                    console.log('err', err);
                    res.send({
                        status: 0,
                        msg:'删除失败!'
                    });
                } else {
                    res.send({
                        status: 1,
                        msg: data
                    })
                }
            })

        });

    },
    changeInfo: function(req, res) {
        var data = req.body;
        var _id = data.userID;
        var key = data.passKey;
        var value = data.newValue;
        console.log('data', data);
        UserModel.findById(_id, function(err, user) {
            if(err) {
                console.log('err:', err);
                return;
            }
            user[key] = value;
            user.save(function(err, doc) {
                if(err) {
                    console.log('err:', err);
                    res.send({
                        status: 0,
                        msg:'更改失败!'
                    });
                    return;
                }
                res.send({
                    status: 1,
                    msg: doc
                })
            })
            
        })
    
    },
    uploadPicture: function(req, res) {
        console.log(req);
        var _id = req.body.userID;
        var baseData = req.body.uri;
        UserModel.findById(_id, function(err, user) {
            if(err) {
                console.log('err:', err);
                return;
            }
            user.avatarUri = baseData;
            user.save(function(err, doc) {
                if(err) {
                    console.log('err:', err);
                    res.send({
                        status: 0,
                        msg:'上传失败！'
                    });
                    return;
                }
                res.send({
                    status: 1,
                    msg: doc
                })
            })
            
        })
    },

    getPicture: function(req, res) {
        //console.log('req:', req.query.id);
        var contactPhoneNum = req.query.contactphonenum;
        console.log('contactPhoneNum:', contactPhoneNum);
        UserModel.findOne({userPhoneNum: contactPhoneNum}, function(err, user) {
            if(err) {
                console.log('err:', err);
                return;
            } else {
                //console.log(err, user);
                res.send({
                    status: 1,
                    avatarUri: user.avatarUri
                })
            }            
        })
    },
    addTag: function(req, res) {
        console.log('req', req.body);
        var _id = req.body.userID;
        var type = req.body.type;
        var value = req.body.newValue;
        var opt = req.body.opt;
        UserModel.findById(_id, function(err, user) {
            if(err) {
                console.log('err:', err);
                return;
            }
            user.tags[type].push(value);
            user.save(function(err, doc) {
                if(err) {
                    console.log('err:', err);
                    res.send({
                        status: 0,
                        msg:'添加失败！'
                    });
                    return;
                }
                res.send({
                    status: 1,
                    msg: doc
                })
            })
            
        })
    }
};

module.exports = User;