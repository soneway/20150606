﻿(function (window, $) {

    //文档jq对象
    var $doc = $(window.document),
        load = {}, unload = {};


    //文档加载完成
    $(function () {
        //$.toggleSidebox(true);
    });


    //面板显示回调函数
    $.panelLoaded = function ($this, isInit) {
        var loadfn = load[$this.attr('id')];
        $.isFunction(loadfn) && loadfn($this, isInit);
    };

    //面板隐藏回调函数
    $.panelUnloaded = function ($this) {
        var unloadfn = unload[$this.attr('id')];
        $.isFunction(unloadfn) && unloadfn($this);
    };


    //客服中心
    load.panelservice = (function () {
        var msgContentEl = document.getElementsByClassName('msg_content')[0],
            $msgbox = $('#msgbox'),
            $txtMsg = $('#txt_msg');

        //获取时间字符串函数
        function getTimeStr() {
            return new Date().toTimeString().slice(0, 8);
        }

        //定位动画函数
        function animation() {
            scrollTop += 12;
            msgContentEl.scrollTop = scrollTop;
            if (scrollTop < toScrollTop) {
                requestAnimationFrame(animation);
            }
        }

        //刷新信息显示函数
        function refreshMsg(msg, isService, serviceMsg, isAutoMsg) {
            $msgbox.append('<div class="msg_item ' + (isService ? 'service' : 'client') + '">' +
            '<p class="timestamp">' + (serviceMsg || '') + getTimeStr() + '</p>' +
            (isService ? '<img class="avator" src="images/avator.jpg" />' : '') +
            '<div class="msg' + (isAutoMsg ? ' automsg' : '') + '">' + msg + '</div>' +
            '</div>');

            //定位
            var scrollTop = msgContentEl.scrollTop,
                toScrollTop = msgContentEl.scrollHeight - msgContentEl.offsetHeight;

            toScrollTop > scrollTop && requestAnimationFrame(animation);
        }

        return function ($this, isInit) {
            if (isInit) {
                //初始化内容
                $msgbox.html('');
                var msg = '<h3>请选择问题的类型</h3>' +
                    '<a>商品问题</a>' +
                    '<a>交易问题</a>' +
                    '<a>游戏/客户端/区服问题</a>' +
                    '<a>其他问题</a>';
                refreshMsg(msg, true, '交易猫在线客服-自动回复：', true);

                //问题类型点击
                $doc.on('click', '.automsg a', function () {
                    $msgbox.html('');
                    var msg = '您好，我是 客服喵喵 ，请问有什么可以帮助您的吗？';
                    refreshMsg(msg, true, '交易猫在线客服-喵喵：');
                });

                //发送按钮
                $doc.on('click', '.btn_send', function () {
                    var txt = $txtMsg.val();
                    if (txt) {
                        refreshMsg(txt);

                        //客服回复
                        setTimeout(function () {
                            var msg = '您好，我是 客服喵喵 ，请问有什么可以帮助您的吗？';
                            refreshMsg(msg, true, '交易猫在线客服-喵喵：');
                        }, 1000);
                    }
                });
            }
        };
    })();

})(this, $);