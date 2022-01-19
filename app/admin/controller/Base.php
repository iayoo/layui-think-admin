<?php

namespace app\admin\controller;

class Base extends BaseController
{
    public function button(){
        return $this->fetch();
    }

    public function form()
    {
        return $this->fetch();
    }

    public function table()
    {
        return $this->fetch();
    }

    public function toast()
    {
        return $this->fetch();
    }
}