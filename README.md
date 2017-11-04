# weChatShare
微信分享页面框架




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
