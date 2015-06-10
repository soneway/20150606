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
        //消息容器
        var msgbox = document.getElementById('msgbox'),
            $msgList = $('#msg_list'),
            $txtMsg = $('#txt_msg');

        //获取时间字符串函数
        function getTimeStr() {
            return new Date().toTimeString().slice(0, 8);
        }

        //刷新信息显示函数
        function refreshMsg(opts) {
            var $msgItem = $('<div class="msg_item ' + (opts.itemClass || 'service') + '">' +
                '<p class="timestamp">' + (opts.serviceInfo || '') + getTimeStr() + '</p>' +
                '<div class="msg ' + (opts.msgClass || '') + '">' + opts.msg + '</div>' +
                '</div>');
            $msgList.append($msgItem);

            //延迟改变消息状态
            setTimeout(function () {
                $msgItem.addClass('error');
                setTimeout(function () {
                    $msgItem.addClass('ok');
                }, 1000);
            }, 1000);

            //定位信息
            var scrollTop = msgbox.scrollTop,
                toScrollTop = msgbox.scrollHeight - msgbox.offsetHeight;

            //定位滚动动画函数
            function scroll() {
                scrollTop += 10;
                msgbox.scrollTop = scrollTop;
                if (scrollTop < toScrollTop) {
                    requestAnimationFrame(scroll);
                }
            }

            //定位滚动
            toScrollTop > scrollTop && requestAnimationFrame(scroll);
        }

        return function ($this, isInit) {
            //初始化内容
            $msgList.html('');
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

            if (isInit) {
                //问题类型点击
                $doc.on('click', '.automsg a', function () {
                    $msgList.html('');

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

                //图片按钮
                var fileImgEl = document.getElementById('file_img');
                fileImgEl.onchange = function (evt) {
                    var file = evt.target.files[0],
                        fs = new FileReader();
                    fs.onload = function (evt) {
                        var msg = '<img src="' + evt.target.result + '"/>';
                        refreshMsg({
                            msg: msg,
                            itemClass: 'client image'
                        });
                    };
                    fs.readAsDataURL(file);
                };
                $doc.on('click', '.btn_img', function () {
                    fileImgEl.click();
                });

                //加号菜单
                var $addMenu = $('.add_menu');
                //显示
                $doc.on('click','.btn_add',function(){
                    $addMenu.addClass('visible');
                });

                $doc.on('click', '#panelservice', function () {
                    $addMenu.removeClass('visible');
                });
            }
        };
    })();

})(this, $);