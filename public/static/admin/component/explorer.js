layui.extend({

}).define(['element','jquery','layer','form','laypage'], function(exports) {
    let layer = layui.layer;
    let $ = layui.jquery;
    let element = layui.element;
    let form = layui.form;
    let laypage = layui.laypage;
    let explorer = {
        open:open,
        _this:null,
        selected:undefined
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
        '      <a class="layui-btn" style="margin-right: 8px">搜索<a><a class="layui-btn" style="margin-right: 8px">上传文件<a><a explorer-event="del" class="layui-btn layui-btn-danger">删除文件<a>' +
        '    </div>' +
        '  </div>' +
        '</form>' +
        '</div>';
    let contentHtml = "<div class='explorer_contain'>" + searchContain + "</div><div class='explorer_file_list'></div><div id='explorer_page'></div>";

    function getList(){
        return [
            {'id':1,'title':'测试1.png','path':'/static/admin/images/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.xls','ext':'xls'},
            {'id':1,'title':'测试1.png','path':'/static/admin/images/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.jpeg','ext':'png'},
            {'id':1,'title':'测试1.png','path':'/static/admin/images/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.csv','ext':'csv'},
            {'id':1,'title':'测试1.png','path':'/static/admin/images/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.pdf','ext':'pdf'},
            {'id':1,'title':'测试1.png','path':'/static/admin/images/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.zip','ext':'zip'},
            {'id':1,'title':'测试1.png','path':'/static/admin/images/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.jpeg','ext':'png'},
            {'id':1,'title':'测试1.png','path':'/static/admin/images/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.jpeg','ext':'png'},
            {'id':1,'title':'测试1.png','path':'/static/admin/images/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.jpeg','ext':'png'},
            {'id':1,'title':'测试1.png','path':'/static/admin/images/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.jpeg','ext':'png'},
            {'id':1,'title':'测试1.png','path':'/static/admin/images/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.jpeg','ext':'png'},
            {'id':1,'title':'测试1.png','path':'/static/admin/images/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.jpeg','ext':'jpeg'},
        ];
    }

    function getItemHtml(item){
        let title = '<div class="title"><p>' + item.title + '</p></div>';
        let img = '';
        if (item.ext === 'png' || item.ext === 'jpg' || item.ext === 'jpeg' || item.ext === 'svg'){
            img = '<div class="image-show"><img src="'+ item.path + '" alt="' + item.title + '"></div>';
        }else{
            img = '<div class="image-show"><img class="file_icon" src="/static/admin/images/file-icon/'+ item.ext + '.png" alt="' + item.title + '"></div>';
        }
        let selectIcon = '<div class="file_selected_icon" ><i class="layui-icon layui-icon-ok"></i></div>';

        return '<div class="file_item" explorer-event="select" data-href="' + item.path +'" data-file-id="'+ item.id +'">' + selectIcon + img + title +  '</div>';
    }

    function renderData(data){
        let explorerListDom = $('.explorer_file_list');
        data.map(function (item){
            explorerListDom.append(
                getItemHtml(item)
            );
        })
        // 监听事件
        explorerListDom.on('click', '*[explorer-event]', function(){
            let _this = $(this)
                ,attrEvent = _this.attr('explorer-event'),
                id = _this.data('file-id');
            if (_this.hasClass('selected')){
                _this.removeClass('selected')
            }else{
                _this.addClass('selected')
            }
        })

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
                    explorer._this.append("<div class='explorer_loading'><div class='icon_div'><i class=\"layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop\"></i></div></div>")
                    setTimeout(function () {
                        explorer._this.children('.explorer_loading').remove()
                    },1500)
                });
            }
        })

        //自定义样式
        laypage.render({
            elem: 'explorer_page'
            ,count: 100
            ,theme: '#1E9FFF'
        });
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
                renderData(getList())
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