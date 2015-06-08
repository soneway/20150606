(function (window, $) {

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

        //刷新信息显示函数
        function refreshMsg(opts) {
            $msgbox.append('<div class="msg_item ' + (opts.itemClass || 'service') + '">' +
            '<p class="timestamp">' + (opts.serviceInfo || '') + getTimeStr() + '</p>' +
            '<div class="msg ' + (opts.msgClass || '') + '">' + opts.msg + '</div>' +
            '</div>');

            //定位
            var scrollTop = msgContentEl.scrollTop,
                toScrollTop = msgContentEl.scrollHeight - msgContentEl.offsetHeight;

            //定位滚动动画函数
            function scroll() {
                scrollTop += 10;
                msgContentEl.scrollTop = scrollTop;
                if (scrollTop < toScrollTop) {
                    requestAnimationFrame(scroll);
                }
            }

            //定位滚动
            toScrollTop > scrollTop && requestAnimationFrame(scroll);
        }

        return function ($this, isInit) {
            if (isInit) {
                //初始化内容
                $msgbox.html('');
                var msg = '<h3>请选择问题的类型</h3>' +
                    '<a>商品问题</a>' +
                    '<a>交易问题</a>' +
                    '<a>游戏/客户端/区服问题</a>' +
                    '<a data-type="image">其他问题</a>';
                refreshMsg({
                    msg: msg,
                    serviceInfo: '交易猫在线客服-自动回复：',
                    msgClass: 'automsg'
                });

                //问题类型点击
                $doc.on('click', '.automsg a', function () {
                    $msgbox.html('');

                    var type = this.getAttribute('data-type'), msg;
                    if (type === 'image') {
                        msg = '<img src="images/thumb.jpg"/>';
                        refreshMsg({
                            msg: msg,
                            itemClass: 'service image',
                            serviceInfo: '交易猫在线客服-自动回复：'
                        });
                    }
                    else {
                        msg = '您好，我是 客服喵喵 ，请问有什么可以帮助您的吗？';
                        refreshMsg({
                            msg: msg,
                            serviceInfo: '交易猫在线客服-自动回复：'
                        });
                    }
                });

                //发送按钮
                $doc.on('click', '.btn_send', function () {
                    var msg = $txtMsg.val();
                    if (msg) {
                        refreshMsg({
                            msg: msg,
                            itemClass: 'client'
                        });

                        msg === '1' && refreshMsg({
                            msg: '<img src="images/thumb.jpg"/>',
                            itemClass: 'client image'
                        });
                        //$txtMsg.val('');

                        //客服回复
                        setTimeout(function () {
                            var msg = '您好，我是 客服喵喵 ，请问有什么可以帮助您的吗？';
                            refreshMsg({
                                msg: msg,
                                serviceInfo: '交易猫在线客服-喵喵：'
                            });
                        }, 1000);
                    }
                });
            }
        };
    })();

})(this, $);