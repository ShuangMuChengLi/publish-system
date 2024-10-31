# 前端发布工具
## 安装步骤
1. root登录服务器（待优化，普通用户也能安装使用）
2. 检测是否支持unzip命令。不支持则参照文档安装unzip[文档](https://www.linchaoqun.com/rk-libs/#/detail/前端发布平台)
3. 上传发布工具所有文件到服务器
4. 给sh文件执行权限
    ```
    # 安装node（已装则忽略）
    chmod 777 install-node.sh
    # 安装发布工具
    chmod 777 install-system.sh
    # 重启服务的命令
    chmod 777 run.sh
    ```
5. 执行安装文件
    ```
    ./install-node.sh
    ./install-system.sh
    ```
## 使用
1. 访问http://[ip]:10999/#/index   
2. 新建项目。   
具体使用流程参见[文档](https://www.linchaoqun.com/rk-lib/#/detail/前端发布平台)
