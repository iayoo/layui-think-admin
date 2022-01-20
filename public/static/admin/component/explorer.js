layui.extend({

}).define(['element','jquery','layer','form','laypage','upload'], function(exports) {
    let layer = layui.layer;
    let $ = layui.jquery;
    let element = layui.element;
    let form = layui.form;
    let laypage = layui.laypage;
    let upload = layui.upload;
    let explorer = {
        open:open,
        _this:null,
        selected:undefined,
        url:'',
        upload:undefined,
        images:[],
        loading:loading,
        clearLoad:clearLoad
    }
    let searchContain = '<div class="search">' +
        '<form class="layui-form" action="">' +
        '  <div class="layui-form-item">' +
        '    <label class="layui-form-label">文件搜索</label>' +
        '    <div class="layui-input-block">' +
        '      <input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入标题" class="layui-input">' +
        '    </div>' +
        '  </div>' +
        ' <div class="layui-form-item" pane="">' +
        '    <label class="layui-form-label">文件类型</label>' +
        '    <div class="layui-input-block">' +
        '      <input type="checkbox" name="type[all]" lay-skin="primary" title="所有">' +
        '      <input type="checkbox" name="type[mp3]" lay-skin="primary" title="mp3">' +
        '      <input type="checkbox" name="type[mp4]" lay-skin="primary" title="mp4">' +
        '      <input type="checkbox" name="type[jpeg]" lay-skin="primary" title="jpeg">' +
        '      <input type="checkbox" name="type[jpg]" lay-skin="primary" title="jpg">' +
        '      <input type="checkbox" name="type[png]" lay-skin="primary" title="png">' +
        '      <input type="checkbox" name="type[xls]" lay-skin="primary" title="xls">' +
        '      <input type="checkbox" name="type[xlsx]" lay-skin="primary" title="xlsx">' +
        '      <input type="checkbox" name="type[csv]" lay-skin="primary" title="csv">' +
        '    </div>' +
        '  </div>'+
        '  <div class="layui-form-item">' +
        '    <div class="layui-input-block">' +
        '      <a class="layui-btn" style="margin-right: 8px">搜索</a><button type="button" class="layui-btn" style="margin-right: 8px" id="explorer_file_uploader">上传文件</button><a explorer-event="del" class="layui-btn layui-btn-danger">删除文件</a>' +
        '    </div>' +
        '  </div>' +
        '</form>' +
        '</div>';
    let contentHtml = "<div class='explorer_contain'>" + searchContain + "</div><div class='explorer_file_list'></div><div id='explorer_page'></div>";

    function getList(){
        explorer.images = [
            {'id':1,'title':'测试1.png','path':'/static/admin/images/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.xls','ext':'xls',size:'55555'},
            {'id':1,'title':'测试1.png','path':'/static/admin/images/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.jpeg','ext':'png',size:'55555'},
            {'id':1,'title':'测试1.png','path':'/static/admin/images/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.csv','ext':'csv',size:'55555'},
            {'id':1,'title':'测试1.png','path':'/static/admin/images/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.jpeg','ext':'png',size:'55555'},
            {'id':1,'title':'测试1.png','path':'/static/admin/images/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.jpeg','ext':'png',size:'555'},
            {'id':1,'title':'测试1.png','path':'/static/admin/images/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.jpeg','ext':'jpeg',size:'4508876.8'},
        ];
    }

    function sizeFormat(size){
        let fat_size = 0;
        let unit = '';
        if (size>1024*1024*1024){
            // 大于Gm
            unit = 'Gb';
            fat_size = (size/(1024*1024*1024)).toFixed(2);
        }else if(size > 1024*1024){
            unit = 'mb';
            fat_size = (size/(1024*1024)).toFixed(2);
            if (fat_size > 100){
                fat_size = (fat_size/1024).toFixed(2);
                unit = 'Gb';
            }
        }else if (size > 1024){
            unit = 'kb';
            fat_size = (size/(1024)).toFixed(2);
            if (fat_size > 100){
                fat_size = (fat_size/1024).toFixed(2);
                unit = 'mb';
            }
        }else {
            fat_size = size;
            if (fat_size > 100){
                fat_size = (fat_size/1024).toFixed(2);
                unit = 'kb';
            }
        }
        return fat_size+unit;
    }

    function initUploader(){
        if (typeof explorer.upload === 'function'){
            explorer.upload();
        }else{
            //常规使用 - 普通图片上传
            let uploadInst = upload.render({
                elem: '#explorer_file_uploader'
                ,accept:'file'
                ,url: explorer.upload //此处用的是第三方的 http 请求演示，实际使用时改成您自己的上传接口即可。
                ,before: function(obj){
                    //预读本地文件示例，不支持ie8
                    // obj.preview(function(index, file, result){
                    //     $('#demo1').attr('src', result); //图片链接（base64）
                    // });
                    showProgress()
                }
                ,done: function(res){
                    clearLoad()
                    //如果上传失败
                    if(res.code > 0){
                        return layer.msg('上传失败');
                    }
                    //上传成功的一些操作
                    // 删除最后一个元素
                    $('.explorer_file_list .file_item:last').remove();
                    $('.explorer_file_list').prepend(getItemHtml({
                        path:res.data.path,
                        title:res.data.title,
                        ext:res.data.ext,
                        size:res.data.size,
                        id:res.data.id,
                    }))
                }
                ,error: function(){
                    //演示失败状态，并实现重传
                    // var demoText = $('#demoText');
                    // demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
                    // demoText.find('.demo-reload').on('click', function(){
                    //     uploadInst.upload();
                    // });
                }
                //进度条
                ,progress: function(n, elem, e){
                    showProgress(n)
                    // element.progress('demo', n + '%'); //可配合 layui 进度条元素使用
                    // if(n == 100){
                    //     layer.msg('上传完毕', {icon: 1});
                    // }
                }
            });
        }
    }

    // function

    function getItemHtml(item){
        let title = '<div class="title"><p>' + item.title + '</p></div>';
        let img = '';
        let size = "";
        if (item.size !== undefined){

            size = "<div class='file_size'><p>" + sizeFormat(item.size) + "</p></div>";
        }
        if (item.ext === 'png' || item.ext === 'jpg' || item.ext === 'jpeg' || item.ext === 'svg'){
            img = '<div class="image-show"><img src="'+ item.path + '" alt="' + item.title + '"></div>';
        }else{
            img = '<div class="image-show"><img class="file_icon" src="/static/admin/images/file-icon/'+ item.ext + '.png" alt="' + item.title + '"></div>';
        }
        let selectIcon = '<div class="file_selected_icon" ><i class="layui-icon layui-icon-ok"></i></div>';

        return '<div class="file_item" explorer-event="select" data-href="' + item.path +'" data-file-id="'+ item.id +'">' + size + selectIcon + img + title +  '</div>';
    }

    function refreshList(){
        let explorerListDom = $('.explorer_file_list');
        explorer.images.map(function (item){
            explorerListDom.append(
                getItemHtml(item)
            );
        })
        // 监听事件
        explorerListDom.on('click', '*[explorer-event]', function(){
            let _this = $(this);
            if (_this.hasClass('selected')){
                _this.removeClass('selected')
            }else{
                _this.addClass('selected')
            }
        })
        //自定义样式
        laypage.render({
            elem: 'explorer_page'
            ,count: 100
            ,theme: '#1E9FFF'
        });
        render();
    }

    function render(){
        $(".explorer_contain > .search").on('click','*[explorer-event]',function(){
            let _this = $(this)
                ,attrEvent = _this.attr('explorer-event'),
                id = _this.data('file-id');
            if (attrEvent === 'del'){
                //询问框
                let selectedList = $('.explorer_file_list .selected');
                if (selectedList.length <= 0){
                    return;
                }
                layer.confirm('确认删除'+ selectedList.length +'个文件？', {
                    title:'确认删除？',
                    success:function (layero) {
                        layer.setTop(layero); //重点2
                    },
                    zIndex: layer.zIndex,
                    btn: ['确认','取消'] //按钮
                }, function(index,layerObj){
                    layer.close(index)
                    loading(1500);
                });
            }
        })
    }

    function loading(time,append){
        // 基于整个弹出层的loading
        let icon = '<i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>';
        let domHtml = "<div class='explorer_loading'><div class='icon_div'>" + icon + (append?append:'') +"</div></div>";
        explorer._this.append(domHtml)
        if (typeof time === 'number'){
            setTimeout(function () {
                clearLoad()
            },time);
        }
        if (typeof time === 'function'){
            return time()
        }
    }

    function clearLoad(){
        explorer._this.children('.explorer_loading').remove()
    }

    function showProgress(update){
        if (update === undefined){
            let uploadProgress = '<div class="explorer_upload_progress" ><div lay-filter="explorer_upload_progress" class="layui-progress layui-progress-big" lay-showpercent="true"><div class="layui-progress-bar" lay-percent="0%"></div></div></div>';
            loading(0,uploadProgress)
            return element.progress('explorer_upload_progress', 0+'%');
        }
        element.progress('explorer_upload_progress', update+'%');
    }

    function open(){
        //多窗口模式，层叠置顶
        layer.open({
            type: 1 //此处以iframe举例
            ,title: '资源管理器'
            ,area: ['830px', '80%']
            ,shade: 0
            ,maxmin: true
            ,id:'explorer'
            ,content: contentHtml
            ,btn: ['确定', '取消'] //只是为了演示
            ,yes: function(index){
                if (explorer.selected !== undefined){
                    let selectedList = $('.explorer_file_list .selected');
                    let data = [];
                    for (let i = 0; i < selectedList.length; i++) {
                        let o_this = $(selectedList[i])
                        data.push({
                            'id':o_this.data('file-id'),
                            'href':o_this.data('href'),
                        })
                    }
                    if (explorer.selected(data)){
                        layer.close(index)
                    }
                }
            }
            ,btn2: function(){
                layer.closeAll();
            }

            ,zIndex: layer.zIndex //重点1
            ,success: function(layerObj, index){
                form.render()
                explorer._this = $(layerObj)
                refreshList(getList())
                initUploader()
            }
            ,end: function(){
                //更新索引
                if(typeof layer.escIndex === 'object'){
                    layer.escIndex.splice(0, 1);
                }
            }
        });
    }
    exports('explorer',explorer);
})