# 像素科技互联网联盟企业网站管理系统 V1.0.0

## 项目介绍
这是像素科技官方网站内容管理系统，基于PHP开发，用于展示企业产品、服务、案例以及公司信息。系统具有以下特点：

- 动态内容管理：通过后台管理界面可以轻松更新网站内容
- 多语言支持：支持多语言内容切换
- 响应式设计：适配各种设备尺寸
- 模块化结构：前端展示与后端管理分离
- 完善的API接口：便于扩展和集成

本系统主要由前台展示和后台管理两部分组成，前台提供企业信息展示，后台提供内容管理功能。

## 使用教程

### 如何添加后端功能模块

添加新的后端功能模块需要遵循以下步骤：

1. **在admin目录中创建新的管理页面**
   - 复制一个现有的管理页面（如`products.php`）作为模板
   - 修改页面内容以适应新功能需求
   - 确保引入了必要的头部和底部文件

2. **在admin/api目录中创建对应的API接口**
   - 创建与功能模块同名的PHP文件（如`new_feature.php`）
   - 实现必要的CRUD操作函数
   - 遵循现有API的格式和安全验证措施

3. **创建对应的JS管理器文件**
   - 在`admin/js`目录下创建`new-feature-manager.js`
   - 实现数据加载、表单处理和保存数据的功能
   - 在`main.js`中导入并初始化管理器

4. **示例API代码结构**:
   ```php
   <?php
   // 包含必要的验证和数据库连接
   include '../includes/db_connect.php';
   include '../includes/auth_check.php';

   // 处理不同的API请求
   if ($_SERVER['REQUEST_METHOD'] === 'GET') {
       // 获取数据
   } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
       // 创建数据
   } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
       // 更新数据
   } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
       // 删除数据
   }

   // 返回JSON格式的响应
   header('Content-Type: application/json');
   echo json_encode($response);
   ?>
   ```

5. **前台展示页面创建**
   - 如需在前台展示，创建相应的PHP文件
   - 使用JavaScript从API获取数据并展示

6. **更新导航菜单**
   - 在`admin/navigation.php`中添加新功能的导航链接（已经内置，可以在控制台中添加）

## 目录结构分析

```
/
├── index.php                # 网站首页
├── about.php                # 关于我们页面
├── products.php             # 产品展示页面
├── solutions.php            # 解决方案页面
├── partners.php             # 合作伙伴页面
├── support.php              # 技术支持页面
├── contact.php              # 联系我们页面
├── header.php               # 网站头部公共部分
├── footer.php               # 网站底部公共部分
├── language-switcher.php    # 语言切换功能
│
├── admin/                   # 后台管理系统
│   ├── index.php            # 后台入口页面
│   ├── login.php            # 管理员登录页面
│   ├── logout.php           # 退出登录处理
│   ├── dashboard.php        # 管理控制面板
│   ├── navigation.php       # 导航菜单管理
│   ├── products.php         # 产品管理
│   ├── solutions.php        # 解决方案管理
│   ├── features.php         # 功能特点管理
│   ├── banners.php          # 轮播图管理
│   ├── cases.php            # 案例管理
│   ├── partner_cases.php    # 合作伙伴案例管理
│   ├── strategic_partners.php  # 战略合作伙伴管理
│   ├── tech_partners.php    # 技术合作伙伴管理
│   ├── team_members.php     # 团队成员管理
│   ├── testimonials.php     # 客户评价管理
│   ├── company_history.php  # 公司历史管理
│   ├── announcement.php     # 公告管理
│   ├── english_content.php  # 英文内容管理
│   │
│   ├── api/                 # 后台API接口
│   │   ├── announcement.php     # 公告相关API
│   │   ├── banners.php          # 轮播图相关API
│   │   ├── cases.php            # 案例相关API
│   │   ├── company_history.php  # 公司历史相关API
│   │   ├── english_content.php  # 英文内容相关API
│   │   ├── features.php         # 功能特点相关API
│   │   ├── footer.php           # 底部信息相关API
│   │   ├── navigation.php       # 导航菜单相关API
│   │   ├── partner_cases.php    # 合作伙伴案例相关API
│   │   ├── products.php         # 产品相关API
│   │   ├── quick_actions.php    # 快速操作相关API
│   │   ├── solutions.php        # 解决方案相关API
│   │   ├── strategic_partners.php  # 战略合作伙伴相关API
│   │   ├── team_members.php     # 团队成员相关API
│   │   ├── tech_partners.php    # 技术合作伙伴相关API
│   │   └── testimonials.php     # 客户评价相关API
│   │
│   ├── includes/            # 后台公共文件
│   │   ├── db_connect.php       # 数据库连接
│   │   ├── auth_check.php       # 用户验证
│   │   └── ...                  # 其他公共函数
│   │
│   ├── css/                 # 后台CSS样式文件
│   └── js/                  # 后台JavaScript文件
│       ├── main.js               # 主入口文件，负责初始化和加载所有模块
│       ├── utils.js              # 通用工具函数库
│       ├── data-loader.js        # 数据加载公共模块
│       ├── data-saver.js         # 数据保存公共模块
│       ├── quick-actions-manager.js  # 快速操作管理模块
│       ├── announcement-manager.js   # 公告管理模块
│       ├── products-manager.js       # 产品管理模块
│       ├── solutions-manager.js      # 解决方案管理模块
│       ├── features-manager.js       # 功能特点管理模块
│       ├── banners-manager.js        # 轮播图管理模块
│       ├── cases-manager.js          # 案例管理模块
│       ├── testimonials-manager.js   # 客户评价管理模块
│       ├── partner-cases-manager.js  # 合作伙伴案例管理模块
│       ├── partners-manager.js       # 合作伙伴管理模块
│       ├── team-members-manager.js   # 团队成员管理模块
│       ├── company-history-manager.js # 公司历史管理模块
│       ├── footer-manager.js         # 底部信息管理模块
│       ├── navigation-manager.js     # 导航菜单管理模块
│       ├── english-content-manager.js # 英文内容管理模块
│       ├── english-content-fix.js    # 英文内容修复工具
│       └── vendor/                  # 第三方库
│           └── jquery-3.6.0.min.js     # jQuery库
│
├── api/                     # 前台API接口
│   └── language_content.php # 多语言内容API
│
├── css/                     # 前台CSS样式文件
├── js/                      # 前台JavaScript文件
├── images/                  # 图片资源文件
├── languages/               # 多语言翻译文件
├── data/                    # 数据文件
└── old/                     # 旧版本备份文件
```

## 后台JS文件功能说明

后台管理系统的JavaScript文件采用模块化结构，每个功能模块都有对应的管理器，主要职责如下：

1. **核心文件**
   - `main.js` - 系统入口文件，负责初始化所有管理器和确保全局变量存在
   - `utils.js` - 通用工具函数，提供如提示信息、导航切换等基础功能
   - `data-loader.js` - 统一的数据加载模块，处理AJAX请求获取数据
   - `data-saver.js` - 统一的数据保存模块，处理表单提交和数据验证

2. **内容管理器**
   - `announcement-manager.js` - 网站公告管理
   - `products-manager.js` - 产品信息管理
   - `solutions-manager.js` - 解决方案管理
   - `features-manager.js` - 功能特点管理
   - `banners-manager.js` - 轮播图管理
   - `cases-manager.js` - 客户案例管理
   - `testimonials-manager.js` - 客户评价管理
   - `partner-cases-manager.js` - 合作伙伴案例管理
   - `partners-manager.js` - 合作伙伴管理（包含战略与技术合作伙伴）
   - `team-members-manager.js` - 团队成员管理
   - `company-history-manager.js` - 公司历史管理
   - `footer-manager.js` - 网站底部信息管理
   - `navigation-manager.js` - 导航菜单管理
   - `quick-actions-manager.js` - 快速操作管理，提供常用功能的快捷入口

3. **多语言内容管理**
   - `english-content-manager.js` - 英文内容管理界面
   - `english-content-fix.js` - 提供英文内容校对和修复功能

## Apache License 2.0 相关要求

本项目采用 Apache License 2.0 许可证。根据该许可证，您可以：

- 自由使用、修改和分发本软件
- 将本软件用于商业用途

但您必须：

1. 在您修改的文件中包含显著的通知，说明您修改了该文件
2. 在您的衍生作品中保留原始许可证、专利、商标和归属声明
3. 如果包含NOTICE文件，则必须包含该NOTICE文件的文本（除了在附录中的归属声明）

### 许可证声明

所有源代码文件应包含以下许可证声明：

```
Copyright [yyyy] [项目名称]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

完整的许可证文本可在 http://www.apache.org/licenses/LICENSE-2.0 获取。

## 版权声明

Copyright © 2025 PTIA-Code

根据 Apache License 2.0 许可证分发 
