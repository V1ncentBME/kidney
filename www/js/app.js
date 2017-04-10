// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('kidney',[
    'ionic',
    'ngCordova',
    'tdy.controllers',
    'xjz.controllers',
    'zy.controllers',
    'kidney.services',
    'kidney.filters',
    'kidney.directives',
    'monospaced.qrcode',
    'ionic-datepicker'
])

.run(['$ionicPlatform', '$state', 'Storage', 'JM','$rootScope', function($ionicPlatform, $state, Storage, JM,$rootScope) {
    $ionicPlatform.ready(function() {

        //是否登陆
        var isSignIN = Storage.get("isSignIN");
        if (isSignIN == 'YES') {
            $state.go('tabs.home');
        }

        //用户ID
        var userid = '';
        $rootScope.conversation = {
            type: null,
            id: ''
        }
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        if (window.JPush) {
            window.JPush.init();
        }
        if (window.JMessage) {
            // window.Jmessage.init();
            JM.init();

            document.addEventListener('jmessage.onOpenMessage', function(msg) {
                console.info('[jmessage.onOpenMessage]:');
                console.log(msg);
                $state.go('tab.chat-detail', { chatId: msg.fromName, fromUser: msg.fromUser });
            }, false);
            document.addEventListener('jmessage.onReceiveMessage', function(msg) {
                console.info('[jmessage.onReceiveMessage]:');
                console.log(msg);
                $rootScope.$broadcast('receiveMessage', msg);
                if (device.platform == "Android") {
                    // message = window.JMessage.message;
                    // console.log(JSON.stringify(message));
                }
            }, false);
            document.addEventListener('jmessage.onReceiveCustomMessage', function(msg) {
                console.log('[jmessage.onReceiveCustomMessage]: ' + msg);
                // $rootScope.$broadcast('receiveMessage',msg);
                if (msg.targetType == 'single' && msg.fromID != $rootScope.conversation.id) {
                    if (device.platform == "Android") {
                        window.plugins.jPushPlugin.addLocalNotification(1, '本地推送内容test', msg.content.contentStringMap.type, 111, 0, null)
                            // message = window.JMessage.message;
                            // console.log(JSON.stringify(message));
                    } else {
                        window.plugins.jPushPlugin.addLocalNotificationForIOS(0, msg.content.contentStringMap.type + '本地推送内容test', 1, 111, null)
                    }
                }

            }, false);

        }
        window.addEventListener('native.keyboardshow', function(e) {
            $rootScope.$broadcast('keyboardshow', e.keyboardHeight);
        });
        window.addEventListener('native.keyboardhide', function(e) {
            $rootScope.$broadcast('keyboardhide');
        });
    });
}])

// --------路由, url模式设置----------------
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js

    //android导航栏在顶部解决办法
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');
      
    //注册与登录
    $stateProvider
    //登陆
    .state('signin', {
        cache: false,
        url: '/signin',
        templateUrl: 'partials/others/signin.html',
        controller: 'SignInCtrl'
    })
    .state('phonevalid', {
        url: '/phonevalid',
        cache: false,
        templateUrl: 'partials/others/phonevalid.html',
        controller: 'phonevalidCtrl'
    })

    .state('messages',{
      cache:false,
      url:'/messages',
      templateUrl:'partials/others/AllMessage.html',
      controller:'messageCtrl'
    })
    .state('messagesDetail',{
      cache:false,
      url:'/messagesDetail',
      templateUrl:'partials/others/VaryMessage.html',
      controller:'VaryMessageCtrl'
    })
    
    
    //选项卡
    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'partials/tabs.html'
    }) 
    
    //主页面
    .state('tab.home', {
        //cache: false,
        url: '/home',
        views: {
            'tab-home':{
                controller: 'homeCtrl',
                templateUrl: 'partials/home/homepage.html'
            }
        }
    })
        
    //咨询
    .state('tab.consult', {
        //cache: false,
        url: '/consult',
        views: {
            'tab-consult':{
                controller: 'consultCtrl',
                templateUrl: 'partials/consult/consult.html'
            }
        }
    })
            
    //患者页面
    .state('tab.patient', {
        // cache: false,
        url: '/patient',
        views: {
            'tab-patient':{
                controller: 'patientCtrl',
                templateUrl: 'partials/patient/patient.html'
            }
        }
    })

    //tuandui
    .state('tab.groups', {
        // cache: false,
        url: '/groups',
        views: {
            'tab-groups':{
                controller: 'groupsCtrl',
                templateUrl: 'partials/group/groups.html'
            }
        }
    })

    //"我"页面
    .state('tab.me', {
        // cache: false,
        url: '/me',
        views: {
            'tab-me':{
                controller: 'meCtrl',
                templateUrl: 'partials/me/mepage.html'
            }
        }
    })

    // views-tab-home

    // views-tab-consult

    //进行中
    .state('tab.doing', {
        // cache: false,
        url: '/doing',
        views: {
            'tab-consult':{
                controller: 'doingCtrl',
                templateUrl: 'partials/consult/doing.html'
            }
        }
    })
    //进行中详情
    .state('tab.detail', {
        // cache: false,
        url: '/detail/:type/:chatId',
        views: {
            'tab-consult':{
                controller: 'detailCtrl',
                templateUrl: 'partials/consult/detail.html'
            }
        }
    })
    //已完成
    .state('tab.did', {
        // cache: false,
        url: '/did',
        views: {
            'tab-consult':{
                controller: 'didCtrl',
                templateUrl: 'partials/consult/did.html'
            }
        }
    })

    // views-tab-patient

    //患者详情页面
    .state('tab.patientDetail', {
        // cache: false,
        url: '/patientDetail',
        views: {
            'tab-patient':{
                controller: 'patientDetailCtrl',
                templateUrl: 'partials/patient/patientDetail.html'
            }
        }
    })
    .state('tab.DoctorDiagnose', {
        // cache: false,
        url: '/DoctorDiagnose',
        views: {
            'tab-patient':{
                controller: 'DoctorDiagnoseCtrl',
                templateUrl: 'partials/patient/DoctorDiagnose.html'
            }
        }
    })
    .state('tab.TestRecord', {
        // cache: false,
        url: '/TestRecord',
        views: {
            'tab-patient':{
                controller: 'TestRecordCtrl',
                templateUrl: 'partials/patient/testrecord.html'
            }
        }
    })

    .state('tab.TaskSet', {
        // cache: false,
        url: '/TaskSet',
        views: {
            'tab-patient':{
                controller: 'TaskSetCtrl',
                templateUrl: 'partials/patient/TaskSet.html'
            }
        }
    })

    // views-tab-groups
    .state('tab.new-group', {
        url: '/newgroup',
        views: {
            'tab-groups': {
                templateUrl: 'partials/group/new-group.html',
                controller: 'NewGroupCtrl'
            }
        }
    })
    .state('tab.groups-search', {
        url: '/groups/search',
        views: {
            'tab-groups': {
                templateUrl: 'partials/group/groups-search.html',
                controller: 'GroupsSearchCtrl'
            }
        }
    })
    .state('tab.group-add', {
            url: '/groups/add/:groupId',
            views: {
                'tab-groups': {
                    templateUrl: 'partials/group/group-add.html',
                    controller: 'GroupAddCtrl'
                }
            }
        })
    .state('tab.group-add-member', {
            url: '/groups/addmember/:groupId',
            views: {
                'tab-groups': {
                    templateUrl: 'partials/group/group-add-member.html',
                    controller: 'GroupAddMemberCtrl'
                }
            }
        })
    .state('tab.group-detail', {
            url: '/groups/:groupId',
            views: {
                'tab-groups': {
                    templateUrl: 'partials/group/group-detail.html',
                    controller: 'GroupDetailCtrl'
                }
            }
        })
    .state('tab.group-qrcode', {
            url: '/groups/qrcode/:groupId',
            views: {
                'tab-groups': {
                    templateUrl: 'partials/group/group-qrcode.html',
                    controller: 'GroupQrcodeCtrl'
                }
            }
        })
    .state('tab.group-chat', {
            url: '/groups/chat/:type/:teamId/:groupId',
            views: {
                'tab-groups': {
                    templateUrl: 'partials/group/group-chat.html',
                    controller: 'GroupChatCtrl'
                }
            }

        })
    .state('tab.group-conclusion', {
            url: '/groups/conclusion/:type/:teamId/:groupId',
            views: {
                'tab-groups': {
                    templateUrl: 'partials/group/conclusion.html',
                    controller: 'GroupConclusionCtrl'
                }
            }

        })
    .state('tab.group-patient', {
        // cache: false,
        url: '/group/:teamId/patients',
        views: {
            'tab-groups':{
                controller: 'groupPatientCtrl',
                templateUrl: 'partials/group/group-patient.html'
            }
        }
    })

    // views-tab-me

    //schedual
    .state('tab.schedual', {
        // cache: false,
        url: '/schedual',
        views: {
            'tab-me':{
                controller: 'schedualCtrl',
                templateUrl: 'partials/me/schedual.html'
            }
        }
    })
    //我的二维码
    .state('tab.QRcode', {
        // cache: false,
        url: '/qrcode',
        views: {
            'tab-me':{
                controller: 'QRcodeCtrl',
                templateUrl: 'partials/me/qrcode.html'
            }
        }
    })
            
    //我的信息
    .state('tab.myinfo', {
        // cache: false,
        url: '/myinfo',
        views: {
            'tab-me':{
                controller: 'myinfoCtrl',
                templateUrl: 'partials/me/myinfo.html'
            }
        }
    })
            
    //收费定制
    .state('tab.myfee', {
        // cache: false,
        url: '/myfee',
        views: {
            'tab-me':{
                controller: 'myfeeCtrl',
                templateUrl: 'partials/me/myfee.html'
            }
        }
    })

    //我的评价
    .state('tab.feedback', {
        // cache: false,
        url: '/feedback',
        views: {
            'tab-me':{
                controller: 'feedbackCtrl',
                templateUrl: 'partials/me/feedback.html'
            }
        }
    })

    //设置
    .state('tab.set', {
        // cache: false,
        url: '/set',
        views: {
            'tab-me':{
                controller: 'setCtrl',
                templateUrl: 'partials/me/set.html'
            }
        }
    })
    // 设置内容页
    .state('tab.set-content', {
        url: '/me/set/set-content/:type',
            views: {
            'tab-me': {
                templateUrl: 'partials/me/set/set-content.html',
                controller: 'set-contentCtrl'
            }
        }
    })

    //关于
    .state('tab.about', {
        // cache: false,
        url: '/about',
        views: {
            'tab-me':{
                controller: 'myinfoCtrl',
                templateUrl: 'partials/me/about.html'
            }
        }
    })


    $urlRouterProvider.otherwise('/signin');

});   