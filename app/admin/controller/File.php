<?php

namespace app\admin\controller;

class File extends BaseController
{
    public function upload()
    {
        // 获取表单上传文件 例如上传了001.jpg
        $file = request()->file('file');
        // 上传到本地服务器
        $savename = \think\facade\Filesystem::disk('public')->putFile( '', $file);
        return json(['code'=>0,'data'=>['id'=>time(),'path'=>'/uploads/' . $savename,'title'=>$file->getOriginalName(),'ext'=>$file->getOriginalExtension(),'size'=>$file->getSize()]]);
    }
}