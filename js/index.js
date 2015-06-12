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

        //获取消息item函数
        function getMsgItem(opts) {
            return $('<div class="msg_item ' + opts.itemClass + '">' +
            '<p class="timestamp">' + (opts.nickname || '') + getTimeStr() + '</p>' +
            '<div class="msg">' + opts.msg + '</div>' +
            '</div>');
        }

        //刷新信息显示函数
        function refreshMsgList($msgItem) {

            $msgList.append($msgItem);

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

            return $msgItem;
        }

        //发送信息函数
        function sendMsg(msg, nick, itemClass) {
            return refreshMsgList(getMsgItem({
                itemClass: itemClass,
                nickname: nick,
                msg: msg
            }));
        }

        //客服消息函数
        function serviceMsg(msg, nick) {
            return sendMsg(msg, nick, 'service');
        }

        //客服图片消息函数
        function serviceImgMsg(msg, nick) {
            return sendMsg(msg, nick, 'service image');
        }

        //客户消息函数
        function clientMsg(msg, nick) {
            return sendMsg(msg, nick, 'client');
        }

        //客户图片消息函数
        function clientImgMsg(msg, nick) {
            return sendMsg(msg, nick, 'client image');
        }

        return function ($this, isInit) {
            //初始化内容
            $msgList.html('');
            serviceMsg('<div class="automsg"><h3>请选择问题的类型</h3>' +
            '<a>商品问题</a>' +
            '<a>交易问题</a>' +
            '<a>游戏/客户端/区服问题</a>' +
            '<a>其他问题</a>' +
            '<a data-type="image">回复图片</a></div>', '交易猫在线客服-自动回复：');

            //第一次加载面板
            if (isInit) {
                //问题类型点击
                $doc.on('click', '.automsg a', function () {
                    $msgList.html('');
                    var type = this.getAttribute('data-type');
                    if (type === 'image') {
                        var $msgItem = serviceImgMsg('<img src="images/thumb.jpg"/>', '交易猫在线客服-喵喵：');
                        //延迟一定时间改变消息状态
                        setTimeout(function () {
                            $msgItem.addClass('error');
                            setTimeout(function () {
                                $msgItem.addClass('ok');
                            }, 2000);
                        }, 2000);
                    }
                    else {
                        serviceMsg('您好，我是 客服喵喵 ，请问有什么可以帮助您的吗？', '交易猫在线客服-喵喵：');
                    }
                });

                //发送按钮
                $doc.on('click', '.btn_send', function () {
                    var msg = $txtMsg.val();
                    if (msg) {
                        clientMsg(msg);
                        //$txtMsg.val('');

                        //客服回复
                        setTimeout(function () {
                            serviceMsg('您好，我是 客服喵喵 ，请问有什么可以帮助您的吗？', '交易猫在线客服-喵喵：');
                        }, 2000);
                    }
                });

                //文件上传
                var fileImgEl = document.getElementById('file_img');
                fileImgEl.onchange = function (evt) {
                    var file = evt.target.files[0],
                        fr = new FileReader();

                    fr.onload = function (evt) {
                        var $msgItem = clientImgMsg('<img src="' + evt.target.result + '"/><i></i>');

                        //上传
                        var data = new FormData();
                        data.append('files[]', file);

                        //xhr请求对象
                        var xhr = new XMLHttpRequest();

                        //完成事件
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4 && xhr.status === 200) {
                                setTimeout(function () {
                                    $msgItem.addClass('ok');
                                    setTimeout(function () {
                                        $msgItem.removeClass('ok').addClass('error');
                                    }, 2000);
                                }, 2000);
                            }
                        };

                        //错误事件
                        xhr.onerror = function () {
                            $msgItem.addClass('error');
                        };

                        //进程事件
                        xhr.upload.onprogress = function (evt) {
                            $msgItem.find('i').text(Math.floor(evt.loaded / event.total * 100) + '%');
                        };

                        xhr.open('post', 'php/upload.php');
                        xhr.send(data)
                    };
                    fr.readAsDataURL(file);
                };

                //图片按钮
                $doc.on('click', '.btn_img', function () {
                    fileImgEl.click();
                });

                //重试发送
                $doc.on('click', '.error', function () {
                    var me = this;
                    $.customalert({
                        content: '重新发送该信息?',
                        isAlert: false,
                        btnOkClick: function () {
                            $(me).removeClass('error').addClass('ok');
                        }
                    });
                });

                //加号菜单
                var $addMenu = $('.add_menu');
                //显示
                $('.btn_add').on('click', function (evt) {
                    evt.stopPropagation();
                    $addMenu.addClass('visible');
                });

                $doc.on('click', '#panelservice', function () {
                    //排除.btn_add按钮
                    $addMenu.removeClass('visible');
                });
            }
        };
    })();

})(this, $);