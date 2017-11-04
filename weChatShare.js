// config配置说明
//     debug: config.debug,
//     appId: config.appId, // 必填，公众号的唯一标识
//     timestamp: config.timestamp, // 必填，生成签名的时间戳
//     nonceStr: config.nonceStr, // 必填，生成签名的随机串
//     signature: config.signature,// 必填，签名，见附录1
//     jsApiList: config.jsApiList // 必填，需要使用的JS接口列表
//MenuList配置说明
//      menuItem:share:appMessage     工具栏下显示出分享朋友按钮
//      menuItem:share:timeline     工具栏下显示出分享朋友圈按钮
//configVal配置说明
//     引用wxshare.use("configVal") ("类型")
//                                      shareTimeLine   只使用分享朋友圈功能     后使用Moments方法
//                                      shareFriends    只使用分享朋友功能       后使用Contacts方法
//                                      ""或者其他      二者皆用                 MomentsAndContacts方法
//      注意：当只使用一个分享功能时，请配置MenuList隐藏工具栏多余按钮
//  参数说明：
//          分享朋友圈： wxshare.use("configVal")('shareTimeLine').Moments("标题",'分享链接','图片地址')
//          分享朋友： wxshare.use("configVal")('shareTimeLine').Contacts("标题",'分享链接','图片地址','分享描述')
//          两者皆用： wxshare.use("configVal")('').MomentsAndContacts"朋友圈标题",'朋友圈分享链接','朋友圈图片地址',
//                                                                    "朋友标题",'朋友分享链接','朋友图片地址','朋友分享描述')


//分享朋友圈返回状态
//      使用wxshare.use("wxMoment")
//

//分享朋友返回状态


//使用说明
// configVal = configVal('shareTimeLine').Moments('这是分享朋友圈', data.ShareUrl, 'http://f11.baidu.com/it/u=3243370105,1125765815&fm=72');
// var config = configVal('shareFriends').Contacts( '这是分享朋友',  '', 'http://f11.baidu.com/it/u=3243370105,1125765815&fm=72','分享描述');
// var config = configVal('').MomentsAndContacts('这是分享朋友圈', '', 'http://f11.baidu.com/it/u=3243370105,1125765815&fm=72',
//     '这是分享朋友', '', 'http://f11.baidu.com/it/u=3243370105,1125765815&fm=72', '分享描述');


(function () {
    var moduleMap = {};
    var fileMap = {};

    var noop = function () {
    };
    var wxshare = {
        define: function (name, dependencies, factory) {
            if (!moduleMap[name]) {
                var module = {
                    name: name,
                    dependencies: dependencies,
                    factory: factory
                };
                moduleMap[name] = module;
            }
            return moduleMap[name];
        },
        use: function (name) {
            var module = moduleMap[name];

            if (!module.entity) {
                var args = [];
                for (var i = 0; i < module.dependencies.length; i++) {
                    if (moduleMap[module.dependencies[i]].entity) {
                        args.push(moduleMap[module.dependencies[i]].entity);
                    } else {
                        args.push(wxshare.use(module.dependencies[i]));
                    }
                }

                module.entity = module.factory.apply(noop, args);
            }

            return module.entity;
        },
        //防重复加载
        require: function (pathArr, callback) {
            for (var i = 0; i < pathArr.length; i++) {
                var path = pathArr[i];

                if (!fileMap[path]) {
                    var head = document.getElementsByTagName('head')[0];
                    var node = document.createElement('script');
                    node.type = 'text/javascript';
                    node.async = 'true';
                    node.src = path + '.js';
                    node.onload = function () {
                        fileMap[path] = true;
                        head.removeChild(node);
                        checkAllFiles();
                    };
                    head.appendChild(node);
                }
            }

            function checkAllFiles() {
                var allLoaded = true;
                for (var i = 0; i < pathArr.length; i++) {
                    if (!fileMap[pathArr[i]]) {
                        allLoaded = false;
                        break;
                    }
                }

                if (allLoaded) {
                    callback();
                }
            }
        }
    };

    window.wxshare = wxshare
})();

//初始配置
wxshare.define("configVal", [], function () {
    var configVal = function (type) {

        var Moments = '', Contacts = '', MomentsAndContacts = '';

        switch (type) {
            case "shareTimeLine": {
                Moments = function (title, link, imgUrl) {
                    return {
                        type: type,
                        title: title,
                        link: link,
                        imgUrl: imgUrl
                    };
                };

                break;
            }
            case "shareFriends": {
                Contacts = function (title, link, imgUrl, desc) {
                    return {
                        type: type,
                        title: title,
                        link: link,
                        imgUrl: imgUrl,
                        desc: desc
                    };
                };

                break;
            }
            default: {
                MomentsAndContacts = function (titleMoment, linkMoment, imgUrMoment,
                                               titleContacts, linkContacts, imgUrlContacts, descContacts) {
                    return {
                        type: type,
                        titleMoment: titleMoment,
                        linkMoment: linkMoment,
                        imgUrMoment: imgUrMoment,
                        titleContacts: titleContacts,
                        linkContacts: linkContacts,
                        imgUrlContacts: imgUrlContacts,
                        descContacts: descContacts
                    }

                };
            }
        }
        return {
            Moments: Moments,
            Contacts: Contacts,
            MomentsAndContacts: MomentsAndContacts
        };

    };
    return configVal;
});
wxshare.define("wxsConfig", ["wxsShowMenu", "configDone"], function (showMyMenu, configDone) {
    var wxsConfig = function (config, configVal, MenuList) {
        wx.config({
            debug: config.debug,
            appId: config.appId, // 必填，公众号的唯一标识
            timestamp: config.timestamp, // 必填，生成签名的时间戳
            nonceStr: config.nonceStr, // 必填，生成签名的随机串
            signature: config.signature,// 必填，签名，见附录1
            jsApiList: config.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function () {
            console.log("Config Ready");
            switch (configVal.type) {
                case "shareTimeLine": {
                    configDone.configDone('shareTimeLine')(configVal.title, configVal.link, configVal.imgUrl);
                    break;
                }
                case "shareFriends": {
                    configDone.configDone('shareFriends')(configVal.title, configVal.desc, configVal.link, configVal.imgUrl);
                    break;
                }
                default : {
                    console.log(configVal);
                    configDone.configDone('shareTimeLine')(configVal.titleMoment, configVal.linkMoment, configVal.imgUrMoment);
                    configDone.configDone('shareFriends')(configVal.titleContacts, configVal.descContacts, configVal.linkContacts, configVal.imgUrlContacts)
                }
            }

            showMyMenu(MenuList)
        });
        wx.error(function (res) {
            console.log("err", res)
        });
    };
    return wxsConfig;
});

//朋友圈或者好友选择单一功能
wxshare.define("configDone", ["wxsOnMenuShareTimeLine", "wxsOnMenuShareAppMessage"], function (wxsOnMenuShareTimeLine, wxsOnMenuShareAppMessage) {
    return {
        configDone: function (type) {
            var shareFun;

            switch (type) {
                case "shareTimeLine": {
                    shareFun = function (title, link, imgUrl) {
                        wxsOnMenuShareTimeLine(title, link, imgUrl);
                    };
                    break;
                }
                case "shareFriends": {
                    shareFun = function (title, desc, link, imgUrl) {
                        wxsOnMenuShareAppMessage(title, link, imgUrl);
                    };
                    break;
                }
            }
            return shareFun;
        }
    };
});

//分享朋友圈
wxshare.define("wxsOnMenuShareTimeLine", ["wxMoment"], function (wxMoment) {
    var wxsOnMenuShareTimeLine = function (title, link, imgUrl) {
        wx.onMenuShareTimeline({
            title: title,   // 分享标题
            link: link,     // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            success: function () {
                wxMoment.wxMomentSuccess();
            },
            cancel: function () {
                console.log('cancel')
            },
            fail: function (err) {
                console.log('fail', err)
            }
        });
    };
    return wxsOnMenuShareTimeLine;
});
wxshare.define("wxMoment", [], function () {
    return {
        wxMomentSuccess: function () {
            console.log("success")
        },
        wxMomentCancel: function () {
            console.log("cancel")
        },
        wxMomentFail: function () {
            console.log("fail")
        }
    };
});


//分享好友
wxshare.define("wxsOnMenuShareAppMessage", [], function () {
    var wxsOnMenuShareAppMessage = function (title, desc, link, imgUrl) {
        wx.onMenuShareAppMessage({
            title: title,   // 分享标题
            link: link,     // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            success: function () {
                alert('分享好友成功')
            },
            cancel: function () {
                console.log('cancel')
            },
            fail: function (err) {
                console.log('fail', err)
            }
        });
    };
    return wxsOnMenuShareAppMessage;
});

//显示工具栏
wxshare.define("wxsShowMenu", [], function () {
    var wxsShowMenu = function (menuList) {
        wx.hideAllNonBaseMenuItem({
            success: function () {
                console.log('hideAllNonBaseMenuItem success');
            }
        });
        wx.showMenuItems({
            menuList: menuList,
            success: function () {
                console.log('showMenuItems success');
            }
        });
    };
    return wxsShowMenu;
});