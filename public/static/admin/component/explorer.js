layui.extend({

}).define(['element','jquery','layer','form'], function(exports) {
    let layer = layui.layer;
    let $ = layui.jquery;
    let element = layui.element;
    let form = layui.form;
    let explorer = {
        open:open
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
        '      <a class="layui-btn">搜索<a><a class="layui-btn">上传文件<a>' +
        '    </div>' +
        '  </div>' +
        '</form>' +
        '</div>';
    let contentHtml = "<div class='explorer_contain'>" + searchContain + "</div><div class='explorer_file_list'></div>";

    function getList(){
        return [
            {'id':1,'title':'测试1.png','path':'https://image.shutterstock.com/z/stock-photo-doctor-in-ppe-suit-and-face-mask-demonstrates-test-tubes-with-coronavirus-covid-samples-1933377338.jpg','ext':'png'},
            {'id':1,'title':'测试1.png','path':'https://image.shutterstock.com/z/stock-photo-doctor-in-ppe-suit-and-face-mask-demonstrates-test-tubes-with-coronavirus-covid-samples-1933377338.jpg','ext':'png'},
            {'id':1,'title':'测试1.png','path':'https://image.shutterstock.com/z/stock-photo-doctor-in-ppe-suit-and-face-mask-demonstrates-test-tubes-with-coronavirus-covid-samples-1933377338.jpg','ext':'png'},
            {'id':1,'title':'测试1.png','path':'https://image.shutterstock.com/z/stock-photo-doctor-in-ppe-suit-and-face-mask-demonstrates-test-tubes-with-coronavirus-covid-samples-1933377338.jpg','ext':'png'},
            {'id':1,'title':'测试1.png','path':'https://image.shutterstock.com/z/stock-photo-doctor-in-ppe-suit-and-face-mask-demonstrates-test-tubes-with-coronavirus-covid-samples-1933377338.jpg','ext':'png'},
            {'id':1,'title':'测试1.png','path':'https://image.shutterstock.com/z/stock-photo-doctor-in-ppe-suit-and-face-mask-demonstrates-test-tubes-with-coronavirus-covid-samples-1933377338.jpg','ext':'png'},
            {'id':1,'title':'测试1.png','path':'https://image.shutterstock.com/z/stock-photo-doctor-in-ppe-suit-and-face-mask-demonstrates-test-tubes-with-coronavirus-covid-samples-1933377338.jpg','ext':'png'},
        ];
    }

    function renderData(data){
        let explorerListDom = $('.explorer_file_list');
        console.log('render data');
        console.log(explorerListDom);
        data.map(function (item){
            explorerListDom.append(
                '<div class="file_item"><div class="file_del_btn" data-file-id="'+
                item.id +'"></div><div class="image-show"><img src="'+ item.path +
                '" alt="' + item.title + '"></div><div class="title"><p>' +
                item.title + '</p></div></div>'
            );
        })
    }


    function open(){
        console.log('explorer open!')

        //多窗口模式，层叠置顶
        layer.open({
            type: 1 //此处以iframe举例
            ,title: '资源管理器'
            ,area: ['80%', '80%']
            ,shade: 0
            ,maxmin: true
            // ,offset: [ //为了演示，随机坐标
            //     Math.random()*($(window).height()-300)
            //     ,Math.random()*($(window).width()-390)
            // ]
            ,content: contentHtml

            ,btn: ['继续弹出', '全部关闭'] //只是为了演示
            ,yes: function(){
                $(that).click();
            }
            ,btn2: function(){
                layer.closeAll();
            }

            ,zIndex: layer.zIndex //重点1
            ,success: function(layero, index){
                form.render()
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