<?php

namespace app\admin\controller;

use think\facade\Db;

class File extends BaseController
{
    public function upload()
    {
        // 获取表单上传文件 例如上传了001.jpg
        $file = request()->file('file');
        // 上传到本地服务器
        $savename = \think\facade\Filesystem::disk('public')->putFile( '', $file);
        $id = Db::name('files')->insertGetId([
            'path'=>'/uploads/' . $savename,
            'filename'=>$file->getOriginalName(),
            'ext'=>$file->getOriginalExtension(),
            'size'=>$file->getSize(),
            'year'=>date('Y'),
            'month'=>date('m'),
            'day'=>date('d'),
            'create_time'=>time(),
        ]);
        if ($id){
            return json(['code'=>0,'data'=>['id'=>$id,'path'=>'/uploads/' . $savename,'title'=>$file->getOriginalName(),'ext'=>$file->getOriginalExtension(),'size'=>$file->getSize()]]);
        }else{
            return json(['code'=>50000,'message'=>"上传失败"]);
        }
    }

    public function index(){
        $list = Db::name('files')->where([])->page($this->request->param('page',1),$this->request->param('limit',10))->select();
        $count = Db::name('files')->where([])->count();
        return json(['code'=>0,'data'=>['list'=>$list,'count'=>$count]]);
    }

    public function delete(){
        $files = $this->request->param('file');
        $ids = array_column($files,'id');
        $res = Db::name('files')->whereIn('id',$ids)->delete();
        if ($res){
            return json(['code'=>0,'message'=>'success']);
        }else{
            return json(['code'=>50000,'message'=>'error']);
        }
    }
}