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
        url:undefined,
        upload:undefined,
        delete_url:undefined,
        images:[],
        loading:loading,
        clearLoad:clearLoad,
        file_type:[],
        is_delete:true,
        is_upload:true,
        is_file_search:true,
        is_file_filter:true,
        is_search:true,
        theme_color:undefined,
        page:{
            count:0,
            page:1,
            limit:10
        },
        images_selected:[],
        searchForm:{
            keyword:'',
            file_type:[]
        }
    }

    function getFileTypes(){
        let returnType = ['all'];
        if (explorer.file_type.length<=0){
            returnType = ['all','mp3','jpeg','jpg','png','xls','xlsx','csv']
        }else{
            explorer.file_type.map(function (item) {
                returnType.push(item)
            })
        }
        return returnType;
    }

    function getList(isFirst){
        loading();
        $.ajax({
            url:explorer.url,
            type:"GET",
            data:{
                page:explorer.page.page,
                limit:explorer.page.limit,
                file_type:explorer.searchForm.file_type,
                keyword: explorer.searchForm.keyword
            },
            success:function (res) {
                if (res.code === 0){
                    explorer.images = [];
                    explorer.page.count = res.data.count;
                    res.data.list.map(function (item) {
                        explorer.images.push({
                            id:item.id,
                            path:item.path,
                            size:item.size,
                            ext:item.ext,
                            title:item.filename,
                        });
                    })
                    refreshList(isFirst)
                }
            }
        })
    }

    function sizeFormat(size){
        let fat_size = 0;
        let unit = '';
        if (size>1024*1024*1024){
            // ??????Gm
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
            //???????????? - ??????????????????
            let uploadInst = upload.render({
                elem: '#explorer_file_uploader'
                ,accept:'file'
                ,url: explorer.upload //??????????????????????????? http ?????????????????????????????????????????????????????????????????????
                ,before: function(obj){
                    //????????????????????????????????????ie8
                    // obj.preview(function(index, file, result){
                    //     $('#demo1').attr('src', result); //???????????????base64???
                    // });
                    showProgress()
                }
                ,done: function(res){
                    clearLoad()
                    //??????????????????
                    if(res.code > 0){
                        return layer.msg('????????????');
                    }
                    //???????????????????????????
                    // ????????????????????????
                    // $('.explorer_file_list .file_item:last').remove();
                    // $('.explorer_file_list').prepend(getItemHtml({
                    //     path:res.data.path,
                    //     title:res.data.title,
                    //     ext:res.data.ext,
                    //     size:res.data.size,
                    //     id:res.data.id,
                    // }))
                    getList(true)
                }
                ,error: function(){
                    //????????????????????????????????????
                    // var demoText = $('#demoText');
                    // demoText.html('<span style="color: #FF5722;">????????????</span> <a class="layui-btn layui-btn-xs demo-reload">??????</a>');
                    // demoText.find('.demo-reload').on('click', function(){
                    //     uploadInst.upload();
                    // });
                }
                //?????????
                ,progress: function(n, elem, e){
                    showProgress(n)
                    // element.progress('demo', n + '%'); //????????? layui ?????????????????????
                    // if(n == 100){
                    //     layer.msg('????????????', {icon: 1});
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
        let magnifying ='';
        if (item.ext === 'png' || item.ext === 'jpg' || item.ext === 'jpeg' || item.ext === 'svg'){
            img = '<div class="image-show"><img src="'+ item.path + '" alt="' + item.title + '"></div>';
            magnifying = '<div class="file_image_magnifying" ><i class="layui-icon layui-icon-search" explorer-event="show"></i></div>';
        }else{
            img = '<div class="image-show"><img class="file_icon" src="/static/admin/images/file-icon/'+ item.ext + '.png" alt="' + item.title + '"></div>';
        }
        let selectIcon = '<div class="file_selected_icon" ><i class="layui-icon layui-icon-ok"></i></div>';



        return '<div class="file_item" explorer-event="select" data-href="' + item.path +'" data-file-id="'+ item.id +'">' + size + selectIcon + img + title + magnifying + '</div>';
    }

    function clearFileList(){
        $('.explorer_file_list').remove()
    }

    function handleSelected(obj){
        for (let i = 0; i <explorer.images_selected.length; i++) {
            if (explorer.images_selected[i].id === obj.data('file-id')){
                explorer.images_selected.splice(i,1);
                return;
            }
        }
        explorer.images_selected.push({
            id:obj.data('file-id'),
            path:obj.data('href'),
        })
    }

    function refreshList(is_render_page){
        clearFileList();
        $("#explorer").append('<div class="explorer_file_list"></div>');
        let explorerListDom = $(".explorer_file_list");
        explorer.images.map(function (item){
            let selected = false;
            explorer.images_selected.map(function (img) {
                if (item.id === img.id){
                    selected = true
                }
            })
            if (selected){
                explorerListDom.append(
                    $(getItemHtml(item)).addClass('selected')
                );
            }else{
                explorerListDom.append(
                    $(getItemHtml(item))
                );
            }

        })
        // ????????????
        explorerListDom.on('click', '*[explorer-event]', function(event){
            let _this = $(this);
            let attrEvent = _this.attr('explorer-event');
            if (attrEvent === 'select'){
                if (_this.hasClass('selected')){
                    _this.removeClass('selected')
                }else{
                    _this.addClass('selected')
                }
                handleSelected(_this)
            }

            if (attrEvent === 'show'){
            }

        })

        if (is_render_page){
            //???????????????
            laypage.render({
                elem: 'explorer_page'
                ,count: explorer.page.count
                ,theme: '#043382'
                ,jump: function(obj, first){
                    //obj????????????????????????????????????????????????
                    explorer.page.page = obj.curr;
                    explorer.page.limit = obj.limit;
                    //???????????????
                    if(!first){
                        getList()
                        //do something
                    }else{
                    }
                }
            });
        }
        clearLoad()
    }

    function submitDelete(){
        loading();
        $.ajax({
            url:explorer.delete_url,
            type:"POST",
            data:{file:explorer.images_selected},
            success:function (res) {
                clearLoad()
                if (res.code === 0){
                    getList(true)
                    explorer.images_selected = []
                }else{

                }
            }
        })
    }

    function render(){
        $(".explorer_contain > .search").on('click','*[explorer-event]',function(){
            let _this = $(this)
                ,attrEvent = _this.attr('explorer-event'),
                id = _this.data('file-id');
            if (attrEvent === 'del'){
                //?????????
                if (explorer.images_selected.length <= 0){
                    return;
                }
                parent.layer.confirm('????????????'+ explorer.images_selected.length +'????????????', {
                    title:'???????????????',
                    success:function (layero) {
                        // layer.setTop(layero); //??????2
                    },
                    // zIndex: layer.zIndex,
                    btn: ['??????','??????'] //??????
                }, function(index,layerObj){
                    parent.layer.close(index)
                    submitDelete()
                });
            }
        })

        form.on('checkbox(chooseAll)',function (data) {
            let checkedStatesList = [];
            let statesList = $('input[name="file_type[]"]'), statesLen = statesList.length;
            if (data.elem.checked) {   //??????
                checkedStatesList = [];
                statesList.each(function () {
                    this.checked = true;
                })
            } else {         //?????????
                checkedStatesList = [];
                statesList.each(function () {
                    this.checked = false;
                })
            }
            form.render();
        });

        form.on('submit(searchFormSubmit)', function(data){
            explorer.searchForm.keyword = data.field.keyword;
            let file_type = []
            let isAll = false;
            $("input:checkbox[name='file_type[]']:checked").each(function(i){
                if (isAll){
                    return;
                }
                if ($(this).val() === 'all'){
                    isAll = true;
                    if (file_type.length>0){
                        file_type = [];
                    }
                    return;
                }
                file_type.push($(this).val())
            });
            explorer.searchForm.file_type = file_type
            getList(true)
            return false; //?????????????????????????????????????????????????????????????????????
        });
    }

    function loading(time,append){
        // ????????????????????????loading
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

    function getContentHtml(){
        let html = "<div class='explorer_contain'>";
        html+='<div class="search"><form class="layui-form" action="">';
        if (explorer.is_file_search){
            html += '<div class="layui-form-item"><label class="layui-form-label">????????????</label><div class="layui-input-block"><input type="text" name="keyword" lay-verify="keyword" autocomplete="off" placeholder="????????????????????????" class="layui-input"></div></div>';
        }
        if (explorer.is_file_filter){
            html+='<div class="layui-form-item" pane=""><label class="layui-form-label">????????????</label><div class="layui-input-block">';
            getFileTypes().map(function (item) {
                if (item === 'all'){
                    html+='<input type="checkbox" lay-filter="chooseAll" name="file_type[]" value="all" lay-skin="primary" title="??????">'
                }else{
                    html+='<input type="checkbox" name="file_type[]" value="'+ item +'" lay-skin="primary" title="' + item + '">'
                }
            })
            html+='</div></div>';
        }
        html+='<div class="layui-form-item"><div class="layui-input-block">';
        if (explorer.is_search){
            html+='<button type="submit" lay-submit="" lay-filter="searchFormSubmit" class="layui-btn">??????</a>';
        }
        if (explorer.is_delete){
            html+= '<button type="button" explorer-event="del" class="layui-btn layui-btn-danger">????????????</button>'
        }
        if (explorer.is_upload){
            html+='<button type="button" class="layui-btn" id="explorer_file_uploader">????????????</button>';
        }
        html+='</div></div>';
        html+='</form></div>'
        html+='</div>';
        return html;
    }
    let del = 0;
    function open(){
        //??????????????????????????????
        layer.open({
            type: 1 //?????????iframe??????
            ,title: '???????????????'
            ,area: ['830px', '80%']
            ,shade: 0
            ,maxmin: true
            ,id:'explorer'
            ,content: getContentHtml()
            ,btn: ['??????', '??????'] //??????????????????
            ,yes: function(index){
                if (explorer.selected !== undefined){
                    if (explorer.selected(explorer.images_selected)){
                        layer.close(index)
                        explorer.images_selected=[];
                    }
                }
            }
            ,btn2: function(){
                layer.closeAll();
            }

            ,zIndex: layer.zIndex //??????1
            ,success: function(layerObj, index){
                render();


                form.render();
                explorer._this = $(layerObj)
                explorer._this.prepend('</div><div id="explorer_page">')
                getList(true)
                initUploader()
            }
            ,end: function(){
                //????????????
                if(typeof layer.escIndex === 'object'){
                    layer.escIndex.splice(0, 1);
                }
            }
        });
    }
    exports('explorer',explorer);
})