/**
 * 英文内容管理修复脚本
 * 此脚本用于修复英文内容管理器中的各种问题，包括ID不匹配、标签页切换等
 */

// 在文件顶部全局变量区域添加
// 全局变量存储语言数据
let languageEnData = null;
let languageZhData = null;

function fixEnglishContentManager() {
  // 获取所有英文内容管理相关元素
  const addBannerEnBtn = document.getElementById("add-banner-en");
  const saveBannersEnBtn = document.getElementById("save-banners-en");
  const bannersEnContainer = document.getElementById("banners-en-container");
  
  console.log("英文内容管理器修复程序启动");
  
  // 如果元素存在，手动绑定事件
  if (addBannerEnBtn) {
    console.log("手动绑定添加英文轮播图按钮事件");
    addBannerEnBtn.addEventListener("click", function() {
      const newBanner = {
        id: Date.now(),
        title: "New Banner Title",
        description: "Banner description goes here",
        image: "images/banner1.jpg",
        button1_text: "Learn More",
        button1_link: "#",
        button2_text: "Contact Us",
        button2_link: "#"
      };
      
      // 添加到数据中
      if (!window.bannersEnData) {
          window.bannersEnData = { banners: [] };
      } else if (!window.bannersEnData.banners) {
          window.bannersEnData.banners = [];
      }
      
      window.bannersEnData.banners.push(newBanner);
      
      // 重新渲染
      renderEnBanners();
    });
  } else {
    console.error("未找到添加英文轮播图按钮");
  }
  
  // 如果保存按钮存在，绑定保存事件
  if (saveBannersEnBtn) {
    console.log("手动绑定保存英文轮播图按钮事件");
    saveBannersEnBtn.addEventListener("click", async function() {
      try {
        // 确保数据格式正确
        const formattedData = window.bannersEnData || { banners: [] };
        
        const response = await fetch("api/english_content.php?type=banners", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formattedData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || "保存失败");
        }
        
        // 显示成功消息
        showAlert("success", "英文轮播图内容已成功保存！");
      } catch (error) {
        console.error("保存英文轮播图数据失败:", error);
        showAlert("danger", "保存失败，请重试！");
      }
    });
  } else {
    console.error("未找到保存英文轮播图按钮");
  }

  // 修复标签页切换
  fixTabSwitching();
  
  // 初始渲染
  renderEnBanners();
}

// 修复标签页切换功能
function fixTabSwitching() {
  console.log("修复标签页切换功能");
  
  // 获取所有标签页和内容面板
  const allTabs = document.querySelectorAll('#englishContentTabs .nav-link');
  
  // 修改：先移除所有标签页原有的click事件
  allTabs.forEach(tab => {
    // 使用新的克隆元素替换旧元素，清除所有事件
    const newTab = tab.cloneNode(true);
    tab.parentNode.replaceChild(newTab, tab);
  });
  
  // 重新获取新的标签元素
  const refreshedTabs = document.querySelectorAll('#englishContentTabs .nav-link');
  
  // 为每个标签添加点击事件
  refreshedTabs.forEach(tab => {
    const targetId = tab.getAttribute('data-bs-target');
    console.log(`为标签 ${tab.id} 添加点击事件，目标: ${targetId}`);
    
    // 移除href属性，防止页面跳转
    tab.removeAttribute('href');
    
    // 修改：使用捕获阶段处理事件
    tab.addEventListener('click', function(e) {
      // 立即阻止默认行为和事件冒泡
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      console.log(`点击标签: ${this.id}, 切换到: ${targetId}`);
      
      // 确保目标内容面板存在
      const targetPane = document.querySelector(targetId);
      if (!targetPane) {
        console.error(`找不到目标内容面板: ${targetId}`);
        return false;
      }
      
      // 隐藏所有内容面板
      document.querySelectorAll('#englishContentTabsContent .tab-pane').forEach(pane => {
        pane.classList.remove('show', 'active');
      });
      
      // 取消所有标签激活状态
      refreshedTabs.forEach(t => t.classList.remove('active'));
      
      // 激活当前标签和内容面板
      this.classList.add('active');
      targetPane.classList.add('show', 'active');
      
      // 根据当前激活的标签加载对应内容
      if (this.id === 'features-en-tab') {
        renderEnFeatures();
      } else if (this.id === 'banners-en-tab') {
        renderEnBanners();
      } else if (this.id === 'cases-en-tab') {
        renderEnCases();
      } else if (this.id === 'products-en-tab') {
        renderEnProducts();
      } else if (this.id === 'solutions-en-tab') {
        renderEnSolutions();
      } else if (this.id === 'team-en-tab') {
        renderEnTeamMembers();
      } else if (this.id === 'history-en-tab') {
        renderEnCompanyHistory();
      } else if (this.id === 'partners-en-tab') {
        renderEnPartners();
      } else if (this.id === 'footer-en-tab') {
        renderEnFooter();
      } else if (this.id === 'navigation-en-tab') {
        renderEnNavigation();
      } else if (this.id === 'language-en-tab') {
        // 特殊处理语言标签页，使用异步函数并显示加载提示
        const languageContainer = document.getElementById("language-en-container");
        if (languageContainer) {
          // 显示加载提示
          languageContainer.innerHTML = `
            <div class="alert alert-info">
              <i class="bi bi-hourglass-split me-2"></i> 正在加载语言数据...
            </div>
          `;
          
          // 异步加载数据
          (async function() {
            try {
              // 直接在这里加载语言数据
              await loadLanguageData();
              
              // 重建界面结构
              languageContainer.innerHTML = `
                <div class="card mt-3">
                  <div class="card-body">
                    <ul class="nav nav-tabs" id="languageEnTab" role="tablist">
                      <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="language-en-content-tab" data-bs-toggle="tab" data-bs-target="#language-en-content-tab-pane" type="button" role="tab">英文</button>
                      </li>
                      <li class="nav-item" role="presentation">
                        <button class="nav-link" id="language-zh-content-tab" data-bs-toggle="tab" data-bs-target="#language-zh-content-tab-pane" type="button" role="tab">中文</button>
                      </li>
                    </ul>
                    <div class="tab-content" id="languageEnTabContent">
                      <div class="tab-pane fade show active" id="language-en-content-tab-pane" role="tabpanel">
                        <div class="mt-3">
                          <div class="mb-3">
                            <div id="language-en-items-container"></div>
                            <button id="add-language-en-item" class="btn btn-outline-primary mt-2">
                              <i class="bi bi-plus"></i> 添加英文条目
                            </button>
                          </div>
                        </div>
                      </div>
                      <div class="tab-pane fade" id="language-zh-content-tab-pane" role="tabpanel">
                        <div class="mt-3">
                          <div class="mb-3">
                            <div id="language-zh-items-container"></div>
                            <button id="add-language-zh-item" class="btn btn-outline-primary mt-2">
                              <i class="bi bi-plus"></i> 添加中文条目
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              `;
              
              // 初始化标签页
              const enTab = document.getElementById("language-en-content-tab");
              const zhTab = document.getElementById("language-zh-content-tab");
              
              // 绑定标签页切换事件
              if (enTab && zhTab) {
                enTab.addEventListener("click", function(e) {
                  document.getElementById("language-en-content-tab-pane").classList.add("show", "active");
                  document.getElementById("language-zh-content-tab-pane").classList.remove("show", "active");
                  this.classList.add("active");
                  zhTab.classList.remove("active");
                  renderEnLanguageItems();
                  e.preventDefault();
                  e.stopPropagation();
                });
                
                zhTab.addEventListener("click", function(e) {
                  document.getElementById("language-zh-content-tab-pane").classList.add("show", "active");
                  document.getElementById("language-en-content-tab-pane").classList.remove("show", "active");
                  this.classList.add("active");
                  enTab.classList.remove("active");
                  renderZhLanguageItems();
                  e.preventDefault();
                  e.stopPropagation();
                });
              }
              
              // 绑定添加按钮事件
              const addEnItemBtn = document.getElementById("add-language-en-item");
              if (addEnItemBtn) {
                addEnItemBtn.addEventListener("click", addEnLanguageItem);
              }
              
              const addZhItemBtn = document.getElementById("add-language-zh-item");
              if (addZhItemBtn) {
                addZhItemBtn.addEventListener("click", addZhLanguageItem);
              }
              
              // 初始渲染英文语言条目
              renderEnLanguageItems();
            } catch (error) {
              console.error("加载语言数据失败:", error);
              languageContainer.innerHTML = `
                <div class="alert alert-danger">
                  <i class="bi bi-exclamation-triangle me-2"></i> 加载语言数据失败: ${error.message}
                </div>
              `;
            }
          })();
        }
      }
      
      return false; // 确保返回false，防止默认行为
    }, true); // 最后一个参数true表示在捕获阶段处理事件
  });
}

// 渲染英文轮播图
function renderEnBanners() {
  const bannersEnContainer = document.getElementById("banners-en-container");
  if (!bannersEnContainer) {
    console.error("未找到英文轮播图容器");
    return;
  }
  
  bannersEnContainer.innerHTML = "";
  
  // 确保window.bannersEnData有正确的结构
  if (!window.bannersEnData) {
    console.warn("轮播图数据为null，初始化为空对象");
    window.bannersEnData = { banners: [] };
  }
  
  // 确保bannersEnData有banners属性
  if (!window.bannersEnData.banners) {
    console.warn("轮播图数据缺少banners属性，初始化为空数组");
    window.bannersEnData.banners = [];
  }
  
  if (Array.isArray(window.bannersEnData.banners) && window.bannersEnData.banners.length > 0) {
    window.bannersEnData.banners.forEach((banner, index) => {
      // 确保banner对象存在
      if (!banner) banner = {};
      
      const bannerHtml = `
        <div class="card mb-3 banner-item" data-id="${banner.id || index}">
          <div class="card-body">
            <div class="d-flex justify-content-between mb-3">
              <h5 class="card-title">轮播图 #${index + 1}</h5>
              <button type="button" class="btn btn-sm btn-danger delete-banner" data-id="${banner.id || index}">删除</button>
            </div>
            <div class="mb-3">
              <label class="form-label">标题</label>
              <input type="text" class="form-control banner-title" value="${banner.title || ""}" data-id="${banner.id || index}">
            </div>
            <div class="mb-3">
              <label class="form-label">描述</label>
              <textarea class="form-control banner-description" rows="2" data-id="${banner.id || index}">${banner.description || ""}</textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">图片URL</label>
              <input type="text" class="form-control banner-image" value="${banner.image || ""}" data-id="${banner.id || index}">
            </div>
            <div class="row">
              <div class="col-md-3 mb-3">
                <label class="form-label">按钮1文本</label>
                <input type="text" class="form-control banner-button1-text" value="${banner.button1_text || ""}" data-id="${banner.id || index}">
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label">按钮1链接</label>
                <input type="text" class="form-control banner-button1-link" value="${banner.button1_link || ""}" data-id="${banner.id || index}">
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label">按钮2文本</label>
                <input type="text" class="form-control banner-button2-text" value="${banner.button2_text || ""}" data-id="${banner.id || index}">
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label">按钮2链接</label>
                <input type="text" class="form-control banner-button2-link" value="${banner.button2_link || ""}" data-id="${banner.id || index}">
              </div>
            </div>
          </div>
        </div>
      `;
      
      bannersEnContainer.innerHTML += bannerHtml;
    });
    
    // 绑定删除轮播图事件
    bindDeleteBannerEvents();
  } else {
    bannersEnContainer.innerHTML = "<div class=\"alert alert-info\">暂无轮播图数据，请添加。</div>";
  }
}

// 绑定删除轮播图事件
function bindDeleteBannerEvents() {
  const deleteButtons = document.querySelectorAll("#banners-en-container .delete-banner");
  
  deleteButtons.forEach(button => {
    button.addEventListener("click", function() {
      const id = this.getAttribute("data-id");
      
      if (window.bannersEnData && Array.isArray(window.bannersEnData.banners)) {
        const index = window.bannersEnData.banners.findIndex(banner => (banner.id || "").toString() === id.toString());
        if (index !== -1) {
          window.bannersEnData.banners.splice(index, 1);
          renderEnBanners();
        }
      }
    });
  });
}

// 显示提示消息
function showAlert(type, message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
  alertDiv.style.zIndex = '9999';
  alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.appendChild(alertDiv);
  
  // 3秒后自动关闭
  setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 300);
  }, 3000);
}

// 页面加载完成后执行修复
document.addEventListener("DOMContentLoaded", function() {
  console.log("执行英文内容管理器修复程序");
  
  // 确保全局变量已初始化
  if (typeof window.ensureGlobalVariables === 'function') {
    console.log("初始化全局变量");
    window.ensureGlobalVariables();
  } else {
    console.warn("全局变量初始化函数不可用");
  }
  
  // 立即执行修复标签页函数
  fixTabSwitching();
  
  // 模拟点击显示特性内容
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("tab")) {
    // 如果URL中指定了标签，则模拟点击
    setTimeout(function() {
      const tabName = urlParams.get("tab");
      let tabElement = null;
      
      if (tabName === "features") {
        tabElement = document.getElementById("features-en-tab");
      } else if (tabName === "cases") {
        tabElement = document.getElementById("cases-en-tab");
      } else if (tabName === "banners") {
        tabElement = document.getElementById("banners-en-tab");
      } else if (tabName === "products") {
        tabElement = document.getElementById("products-en-tab");
      } else if (tabName === "solutions") {
        tabElement = document.getElementById("solutions-en-tab");
      } else if (tabName === "team") {
        tabElement = document.getElementById("team-en-tab");
      } else if (tabName === "history") {
        tabElement = document.getElementById("history-en-tab");
      } else if (tabName === "partners") {
        tabElement = document.getElementById("partners-en-tab");
      } else if (tabName === "footer") {
        tabElement = document.getElementById("footer-en-tab");
      } else if (tabName === "navigation") {
        tabElement = document.getElementById("navigation-en-tab");
      } else if (tabName === "language-en") {
        tabElement = document.getElementById("language-en-tab");
      }
      
      if (tabElement) {
        console.log(`URL指定${tabName}标签，模拟点击`);
        tabElement.click();
      }
    }, 100);
  }
  
  // 延迟执行其他修复，确保所有元素都已加载
  setTimeout(function() {
    try {
      // 尝试获取内容相关元素并修复
      const bannersEnContainer = document.getElementById("banners-en-container");
      if (bannersEnContainer) {
        renderEnBanners();
      }
      
      const featuresEnContainer = document.getElementById("features-en-container");
      if (featuresEnContainer) {
        renderEnFeatures();
      }
      
      const casesEnContainer = document.getElementById("cases-en-container");
      if (casesEnContainer) {
        renderEnCases();
      }
      
      const productsEnContainer = document.getElementById("products-en-container");
      if (productsEnContainer) {
        renderEnProducts();
      }
      
      const solutionsEnContainer = document.getElementById("solutions-en-container");
      if (solutionsEnContainer) {
        renderEnSolutions();
      }
      
      const teamMembersEnContainer = document.getElementById("team-members-en-container");
      if (teamMembersEnContainer) {
        renderEnTeamMembers();
      }
      
      const historyEnContainer = document.getElementById("history-en-container");
      if (historyEnContainer) {
        renderEnCompanyHistory();
      }
      
      const partnersEnContainer = document.getElementById("partners-en-container");
      if (partnersEnContainer) {
        renderEnPartners();
      }
      
      const footerEnContainer = document.getElementById("footer-en-container");
      if (footerEnContainer) {
        renderEnFooter();
      }
      
      const navigationEnContainer = document.getElementById("navigation-en-container");
      if (navigationEnContainer) {
        renderEnNavigation();
      }
      
      // 绑定其他按钮事件
      bindEnglishContentEvents();
    } catch (error) {
      console.error("获取内容相关元素失败:", error);
    }
  }, 300);
});

// 绑定英文内容相关按钮事件
function bindEnglishContentEvents() {
  // 获取所有英文内容管理相关元素
  const addBannerEnBtn = document.getElementById("add-banner-en");
  const saveBannersEnBtn = document.getElementById("save-banners-en");
  const addFeatureEnBtn = document.getElementById("add-feature-en");
  const saveFeaturesEnBtn = document.getElementById("save-features-en");
  const addCaseEnBtn = document.getElementById("add-case-en");
  const saveCasesEnBtn = document.getElementById("save-cases-en");
  const addProductEnBtn = document.getElementById("add-product-en");
  const saveProductsEnBtn = document.getElementById("save-products-en");
  const addSolutionEnBtn = document.getElementById("add-solution-en");
  const saveSolutionsEnBtn = document.getElementById("save-solutions-en");
  const addTeamMemberEnBtn = document.getElementById("add-team-member-en");
  const saveTeamEnBtn = document.getElementById("save-team-en");
  const addHistoryEnBtn = document.getElementById("add-history-en");
  const saveHistoryEnBtn = document.getElementById("save-history-en");
  const savePartnersEnBtn = document.getElementById("save-partners-en");
  const saveFooterEnBtn = document.getElementById("save-footer-en");
  const saveNavigationEnBtn = document.getElementById("save-navigation-en");
  const saveLanguageEnBtn = document.getElementById("save-language-en");
  
  console.log("开始绑定英文内容按钮事件");
  
  // 如果轮播图元素存在，手动绑定事件
  if (addBannerEnBtn) {
    console.log("手动绑定添加英文轮播图按钮事件");
    addBannerEnBtn.addEventListener("click", function() {
      const newBanner = {
        id: Date.now(),
        title: "New Banner Title",
        description: "Banner description goes here",
        image: "images/banner1.jpg",
        button1_text: "Learn More",
        button1_link: "#",
        button2_text: "Contact Us",
        button2_link: "#"
      };
      
      // 添加到数据中
      if (!window.bannersEnData) {
          window.bannersEnData = { banners: [] };
      } else if (!window.bannersEnData.banners) {
          window.bannersEnData.banners = [];
      }
      
      window.bannersEnData.banners.push(newBanner);
      
      // 重新渲染
      renderEnBanners();
    });
  } else {
    console.error("未找到添加英文轮播图按钮");
  }
  
  // 如果保存轮播图按钮存在，绑定保存事件
  if (saveBannersEnBtn) {
    console.log("手动绑定保存英文轮播图按钮事件");
    saveBannersEnBtn.addEventListener("click", async function() {
      try {
        // 确保数据格式正确
        const formattedData = window.bannersEnData || { banners: [] };
        
        const response = await fetch("api/english_content.php?type=banners", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formattedData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || "保存失败");
        }
        
        // 显示成功消息
        showAlert("success", "英文轮播图内容已成功保存！");
      } catch (error) {
        console.error("保存英文轮播图数据失败:", error);
        showAlert("danger", "保存失败，请重试！");
      }
    });
  } else {
    console.error("未找到保存英文轮播图按钮");
  }
  
  // 如果添加特性按钮存在，绑定添加特性事件
  if (addFeatureEnBtn) {
    console.log("手动绑定添加英文特性按钮事件");
    addFeatureEnBtn.addEventListener("click", function() {
      const newFeature = {
        id: Date.now(),
        icon: "bi bi-star",
        title: "New Feature",
        description: "Feature description goes here"
      };
      
      // 添加到数据中
      if (!window.featuresEnData) {
        window.featuresEnData = { features: [] };
      } else if (!window.featuresEnData.features) {
        window.featuresEnData.features = [];
      }
      
      window.featuresEnData.features.push(newFeature);
      
      // 重新渲染
      renderEnFeatures();
    });
  } else {
    console.error("未找到添加英文特性按钮");
  }
  
  // 如果保存特性按钮存在，绑定保存事件
  if (saveFeaturesEnBtn) {
    console.log("手动绑定保存英文特性按钮事件");
    saveFeaturesEnBtn.addEventListener("click", async function() {
      try {
        // 收集所有特性数据
        const features = collectFeaturesData();
        
        // 确保数据格式正确
        const formattedData = window.featuresEnData || { features: [] };
        formattedData.features = features;
        
        const response = await fetch("api/english_content.php?type=features", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formattedData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || "保存失败");
        }
        
        // 显示成功消息
        showAlert("success", "英文特性内容已成功保存！");
      } catch (error) {
        console.error("保存英文特性数据失败:", error);
        showAlert("danger", "保存失败，请重试！");
      }
    });
  } else {
    console.error("未找到保存英文特性按钮");
  }
  
  // 如果添加案例按钮存在，绑定添加案例事件
  if (addCaseEnBtn) {
    console.log("手动绑定添加英文案例按钮事件");
    addCaseEnBtn.addEventListener("click", function() {
      const newCase = {
        id: Date.now(),
        title: "New Case Study",
        image: "images/case1.jpg",
        description: "Case study description goes here"
      };
      
      // 添加到数据中
      if (!window.caseStudiesEnData) {
        window.caseStudiesEnData = { title: "Success Cases", cases: [] };
      } else if (!window.caseStudiesEnData.cases) {
        window.caseStudiesEnData.cases = [];
      }
      
      window.caseStudiesEnData.cases.push(newCase);
      
      // 重新渲染
      renderEnCases();
    });
  } else {
    console.error("未找到添加英文案例按钮");
  }
  
  // 如果保存案例按钮存在，绑定保存事件
  if (saveCasesEnBtn) {
    console.log("手动绑定保存英文案例按钮事件");
    saveCasesEnBtn.addEventListener("click", async function() {
      try {
        // 收集所有案例数据
        const cases = collectCasesData();
        
        // 确保数据格式正确
        const formattedData = window.caseStudiesEnData || { title: "Success Cases", cases: [] };
        formattedData.cases = cases;
        
        const response = await fetch("api/english_content.php?type=cases", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formattedData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || "保存失败");
        }
        
        // 显示成功消息
        showAlert("success", "英文案例内容已成功保存！");
      } catch (error) {
        console.error("保存英文案例数据失败:", error);
        showAlert("danger", "保存失败，请重试！");
      }
    });
  } else {
    console.error("未找到保存英文案例按钮");
  }
  
  // 如果添加产品按钮存在，绑定添加产品事件
  if (addProductEnBtn) {
    console.log("手动绑定添加英文产品按钮事件");
    addProductEnBtn.addEventListener("click", function() {
      const newProduct = {
        id: Date.now(),
        icon: "bi bi-cpu", 
        title: "New Cloud Product",
        description: "Product description goes here",
        link: "#"
      };
      
      // 添加到数据中
      if (!window.cloudProductsEnData) {
        window.cloudProductsEnData = { title: "Our Cloud Products", products: [] };
      } else if (!window.cloudProductsEnData.products) {
        window.cloudProductsEnData.products = [];
      }
      
      window.cloudProductsEnData.products.push(newProduct);
      
      // 重新渲染
      renderEnProducts();
    });
  } else {
    console.error("未找到添加英文产品按钮");
  }
  
  // 如果保存产品按钮存在，绑定保存事件
  if (saveProductsEnBtn) {
    console.log("手动绑定保存英文产品按钮事件");
    saveProductsEnBtn.addEventListener("click", async function() {
      try {
        // 收集所有产品数据
        const products = collectProductsData();
        
        // 确保数据格式正确
        const formattedData = window.cloudProductsEnData || { title: "Our Cloud Products", products: [] };
        formattedData.products = products;
        
        const response = await fetch("api/english_content.php?type=products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formattedData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || "保存失败");
        }
        
        // 显示成功消息
        showAlert("success", "英文产品内容已成功保存！");
      } catch (error) {
        console.error("保存英文产品数据失败:", error);
        showAlert("danger", "保存失败，请重试！");
      }
    });
  } else {
    console.error("未找到保存英文产品按钮");
  }
  
  // 解决方案按钮事件绑定
  if (addSolutionEnBtn) {
    console.log("手动绑定添加英文解决方案按钮事件");
    addSolutionEnBtn.addEventListener("click", function() {
      const newSolution = {
        id: Date.now(),
        title: "New Solution",
        subtitle: "Solution Subtitle",
        isPopular: false,
        features: ["Feature 1", "Feature 2", "Feature 3"],
        link: "#"
      };
      
      // 添加到数据中
      if (!window.solutionsEnData) {
        window.solutionsEnData = { title: "Our Solutions", plans: [] };
      } else if (!window.solutionsEnData.plans) {
        window.solutionsEnData.plans = [];
      }
      
      window.solutionsEnData.plans.push(newSolution);
      
      // 重新渲染
      renderEnSolutions();
    });
  } else {
    console.error("未找到添加英文解决方案按钮");
  }
  
  // 如果保存解决方案按钮存在，绑定保存事件
  if (saveSolutionsEnBtn) {
    console.log("手动绑定保存英文解决方案按钮事件");
    saveSolutionsEnBtn.addEventListener("click", async function() {
      try {
        // 收集所有解决方案数据
        const solutions = collectSolutionsData();
        
        // 确保数据格式正确
        const formattedData = window.solutionsEnData || { title: "Our Solutions", plans: [] };
        formattedData.plans = solutions;
        
        const response = await fetch("api/english_content.php?type=solutions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formattedData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || "保存失败");
        }
        
        // 显示成功消息
        showAlert("success", "英文解决方案内容已成功保存！");
      } catch (error) {
        console.error("保存英文解决方案数据失败:", error);
        showAlert("danger", "保存失败，请重试！");
      }
    });
  } else {
    console.error("未找到保存英文解决方案按钮");
  }
  
  // 团队成员按钮事件绑定
  if (addTeamMemberEnBtn) {
    console.log("手动绑定添加英文团队成员按钮事件");
    addTeamMemberEnBtn.addEventListener("click", function() {
      const newMember = {
        id: Date.now(),
        avatar: "images/avatar1.jpg",
        name: "New Team Member",
        position: "Position",
        description: "Team member description",
        social_type: "QQ",
        social_media: "#",
        email: "#"
      };
      
      // 添加到数据中
      if (!window.teamMembersEnData) {
        window.teamMembersEnData = { 
          title: "Core Team", 
          description: "Our team consists of industry veterans with rich technical and management experience",
          members: [] 
        };
      } else if (!window.teamMembersEnData.members) {
        window.teamMembersEnData.members = [];
      }
      
      window.teamMembersEnData.members.push(newMember);
      
      // 重新渲染
      renderEnTeamMembers();
    });
  } else {
    console.error("未找到添加英文团队成员按钮");
  }
  
  // 如果保存团队成员按钮存在，绑定保存事件
  if (saveTeamEnBtn) {
    console.log("手动绑定保存英文团队成员按钮事件");
    saveTeamEnBtn.addEventListener("click", async function() {
      try {
        // 收集所有团队成员数据
        const members = collectTeamMembersData();
        
        // 确保数据格式正确
        const formattedData = window.teamMembersEnData || { 
          title: "Core Team", 
          description: "Our team consists of industry veterans with rich technical and management experience",
          members: [] 
        };
        formattedData.members = members;
        
        const response = await fetch("api/english_content.php?type=team", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formattedData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || "保存失败");
        }
        
        // 显示成功消息
        showAlert("success", "英文团队成员内容已成功保存！");
      } catch (error) {
        console.error("保存英文团队成员数据失败:", error);
        showAlert("danger", "保存失败，请重试！");
      }
    });
  } else {
    console.error("未找到保存英文团队成员按钮");
  }
  
  // 发展历程按钮事件绑定
  if (addHistoryEnBtn) {
    console.log("手动绑定添加英文发展历程按钮事件");
    addHistoryEnBtn.addEventListener("click", function() {
      const newMilestone = {
        id: Date.now(),
        year: "2025",
        label: "Milestone",
        title: "New Milestone",
        content: "Milestone description"
      };
      
      // 添加到数据中
      if (!window.companyHistoryEnData) {
        window.companyHistoryEnData = { 
          title: "Development History", 
          description: "Our growth journey in the field of digital solutions",
          milestones: [] 
        };
      } else if (!window.companyHistoryEnData.milestones) {
        window.companyHistoryEnData.milestones = [];
      }
      
      window.companyHistoryEnData.milestones.push(newMilestone);
      
      // 重新渲染
      renderEnCompanyHistory();
    });
  } else {
    console.error("未找到添加英文发展历程按钮");
  }
  
  // 如果保存发展历程按钮存在，绑定保存事件
  if (saveHistoryEnBtn) {
    console.log("手动绑定保存英文发展历程按钮事件");
    saveHistoryEnBtn.addEventListener("click", async function() {
      try {
        // 收集所有发展历程数据
        const milestones = collectCompanyHistoryData();
        
        // 确保数据格式正确
        const formattedData = window.companyHistoryEnData || { 
          title: "Development History", 
          description: "Our growth journey in the field of digital solutions",
          milestones: [] 
        };
        formattedData.milestones = milestones;
        
        const response = await fetch("api/english_content.php?type=history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formattedData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || "保存失败");
        }
        
        // 显示成功消息
        showAlert("success", "英文发展历程内容已成功保存！");
      } catch (error) {
        console.error("保存英文发展历程数据失败:", error);
        showAlert("danger", "保存失败，请重试！");
      }
    });
  } else {
    console.error("未找到保存英文发展历程按钮");
  }
  
  // 合作伙伴按钮事件绑定 - 跳过此部分，因为add-partner-en按钮已被移除
  // 现在我们使用add-strategic-partner-en和add-tech-partner-en按钮，这些按钮在renderEnPartners函数中已创建并绑定了事件
  /*
  if (addPartnerEnBtn) {
    console.log("手动绑定添加英文合作伙伴按钮事件");
    addPartnerEnBtn.addEventListener("click", function() {
      // 打开合作伙伴标签页并创建一个新的战略合作伙伴
      const partnersTab = document.getElementById("partners-en-tab");
      if (partnersTab) {
        partnersTab.click();
        setTimeout(() => {
          addEnStrategicPartner();
        }, 100);
      }
    });
  } else {
    console.error("未找到添加英文合作伙伴按钮");
  }
  */
  
  // 如果保存合作伙伴按钮存在，绑定保存事件
  if (savePartnersEnBtn) {
    console.log("绑定保存英文合作伙伴按钮事件");
    savePartnersEnBtn.addEventListener("click", async function() {
      try {
        // 检查当前活动的标签页
        const strategicContent = document.getElementById("strategic-partners-en-content");
        if (!strategicContent) {
          console.warn("未找到战略合作伙伴内容容器，可能尚未初始化");
          showAlert("warning", "请先打开合作伙伴标签页，然后再尝试保存");
          return;
        }
        
        const isStrategicTabActive = strategicContent.classList.contains("active");
        
        if (isStrategicTabActive) {
          // 保存战略合作伙伴数据
          const strategicPartnerData = collectStrategicPartnersData();
          
          const strategicResponse = await fetch("api/english_content.php?type=strategic_partners", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(strategicPartnerData)
          });
          
          if (!strategicResponse.ok) {
            throw new Error(`HTTP error! Status: ${strategicResponse.status}`);
          }
          
          const strategicResult = await strategicResponse.json();
          
          if (!strategicResult.success) {
            throw new Error(strategicResult.message || "保存战略合作伙伴失败");
          }
          
          showAlert("success", "英文战略合作伙伴内容已成功保存！");
        } else {
          // 保存技术合作伙伴数据
          const techPartnerData = collectTechPartnersData();
          
          const techResponse = await fetch("api/english_content.php?type=tech_partners", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(techPartnerData)
          });
          
          if (!techResponse.ok) {
            throw new Error(`HTTP error! Status: ${techResponse.status}`);
          }
          
          const techResult = await techResponse.json();
          
          if (!techResult.success) {
            throw new Error(techResult.message || "保存技术合作伙伴失败");
          }
          
          showAlert("success", "英文技术合作伙伴内容已成功保存！");
        }
      } catch (error) {
        console.error("保存英文合作伙伴数据失败:", error);
        showAlert("danger", "保存失败: " + error.message);
      }
    });
  } else {
    console.error("未找到保存英文合作伙伴按钮");
  }
  
  // 绑定战略合作伙伴保存按钮
  const saveStrategicPartnersEnBtn = document.getElementById("save-strategic-partners-en");
  if (saveStrategicPartnersEnBtn) {
    console.log("绑定保存英文战略合作伙伴按钮事件");
    saveStrategicPartnersEnBtn.addEventListener("click", async function() {
      try {
        // 收集战略合作伙伴数据
        const strategicPartnerData = collectStrategicPartnersData();
        
        // 保存战略合作伙伴数据
        const strategicResponse = await fetch("api/english_content.php?type=strategic_partners", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(strategicPartnerData)
        });
        
        if (!strategicResponse.ok) {
          throw new Error(`HTTP error! Status: ${strategicResponse.status}`);
        }
        
        const strategicResult = await strategicResponse.json();
        
        if (!strategicResult.success) {
          throw new Error(strategicResult.message || "保存战略合作伙伴失败");
        }
        
        // 显示成功消息
        showAlert("success", "英文战略合作伙伴内容已成功保存！");
      } catch (error) {
        console.error("保存英文战略合作伙伴数据失败:", error);
        showAlert("danger", "保存失败: " + error.message);
      }
    });
  }
  
  // 绑定技术合作伙伴保存按钮
  const saveTechPartnersEnBtn = document.getElementById("save-tech-partners-en");
  if (saveTechPartnersEnBtn) {
    console.log("绑定保存英文技术合作伙伴按钮事件");
    saveTechPartnersEnBtn.addEventListener("click", async function() {
      try {
        // 收集技术合作伙伴数据
        const techPartnerData = collectTechPartnersData();
        
        // 保存技术合作伙伴数据
        const techResponse = await fetch("api/english_content.php?type=tech_partners", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(techPartnerData)
        });
        
        if (!techResponse.ok) {
          throw new Error(`HTTP error! Status: ${techResponse.status}`);
        }
        
        const techResult = await techResponse.json();
        
        if (!techResult.success) {
          throw new Error(techResult.message || "保存技术合作伙伴失败");
        }
        
        // 显示成功消息
        showAlert("success", "英文技术合作伙伴内容已成功保存！");
      } catch (error) {
        console.error("保存英文技术合作伙伴数据失败:", error);
        showAlert("danger", "保存失败: " + error.message);
      }
    });
  }
  
  // 页脚按钮事件绑定
  if (saveFooterEnBtn) {
    console.log("手动绑定保存英文页脚按钮事件");
    saveFooterEnBtn.addEventListener("click", async function() {
      try {
        // 收集页脚数据
        const footerData = collectFooterData();
        
        // 保存页脚数据
        const response = await fetch("api/english_content.php?type=footer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(footerData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || "保存失败");
        }
        
        // 显示成功消息
        showAlert("success", "英文页脚内容已成功保存！");
      } catch (error) {
        console.error("保存英文页脚数据失败:", error);
        showAlert("danger", "保存失败，请重试！");
      }
    });
  } else {
    console.error("未找到保存英文页脚按钮");
  }
  
  // 导航按钮事件绑定
  if (saveNavigationEnBtn) {
    console.log("手动绑定保存英文导航按钮事件");
    saveNavigationEnBtn.addEventListener("click", async function() {
      try {
        // 收集导航数据
        const navigationData = collectNavigationData();
        
        // 保存导航数据
        const response = await fetch("api/english_content.php?type=navigation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(navigationData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || "保存失败");
        }
        
        // 显示成功消息
        showAlert("success", "英文导航内容已成功保存！");
      } catch (error) {
        console.error("保存英文导航数据失败:", error);
        showAlert("danger", "保存失败，请重试！");
      }
    });
  } else {
    console.error("未找到保存英文导航按钮");
  }
  
  // 如果保存语言按钮存在，绑定保存事件
  if (saveLanguageEnBtn) {
    console.log("绑定保存语言文件按钮事件");
    saveLanguageEnBtn.addEventListener("click", async function() {
      try {
        // 检查当前活动的标签页
        const enContentTab = document.getElementById("language-en-content-tab-pane");
        if (!enContentTab) {
          console.warn("未找到英文语言内容区域，可能尚未初始化");
          showAlert("warning", "请先打开语言标签页，然后再尝试保存");
          return;
        }
        
        const isEnglishTabActive = enContentTab.classList.contains("active");
        
        if (isEnglishTabActive) {
          // 保存英文语言数据
          const enLanguageData = collectEnLanguageData();
          
          const enResponse = await fetch("../api/language_content.php?type=en", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(enLanguageData)
          });
          
          if (!enResponse.ok) {
            throw new Error(`HTTP error! Status: ${enResponse.status}`);
          }
          
          const enResult = await enResponse.json();
          
          if (!enResult.success) {
            throw new Error(enResult.message || "保存英文语言文件失败");
          }
          
          showAlert("success", "英文语言文件已成功保存！");
        } else {
          // 保存中文语言数据
          const zhLanguageData = collectZhLanguageData();
          
          const zhResponse = await fetch("../api/language_content.php?type=zh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(zhLanguageData)
          });
          
          if (!zhResponse.ok) {
            throw new Error(`HTTP error! Status: ${zhResponse.status}`);
          }
          
          const zhResult = await zhResponse.json();
          
          if (!zhResult.success) {
            throw new Error(zhResult.message || "保存中文语言文件失败");
          }
          
          showAlert("success", "中文语言文件已成功保存！");
        }
      } catch (error) {
        console.error("保存语言文件失败:", error);
        showAlert("danger", "保存失败: " + error.message);
      }
    });
  } else {
    console.error("未找到保存语言文件按钮");
  }
}

// 渲染英文特性内容
function renderEnFeatures() {
  const featuresContainer = document.getElementById("features-en-container");
  if (!featuresContainer) {
    console.error("未找到英文特性容器");
    return;
  }
  
  featuresContainer.innerHTML = "";
  
  // 确保window.featuresEnData有正确的结构
  if (!window.featuresEnData) {
    console.warn("特性数据为null，初始化为空对象");
    window.featuresEnData = { features: [] };
  }
  
  // 确保featuresEnData有features属性
  if (!window.featuresEnData.features) {
    console.warn("特性数据缺少features属性，初始化为空数组");
    window.featuresEnData.features = [];
  }
  
  if (Array.isArray(window.featuresEnData.features) && window.featuresEnData.features.length > 0) {
    window.featuresEnData.features.forEach((feature, index) => {
      // 确保feature对象存在
      if (!feature) feature = {};
      
      const featureHtml = `
        <div class="card mb-3 feature-item" data-id="${feature.id || index}">
          <div class="card-body">
            <div class="d-flex justify-content-between mb-3">
              <h5 class="card-title">特性 #${index + 1}</h5>
              <button type="button" class="btn btn-sm btn-danger delete-feature" data-id="${feature.id || index}">删除</button>
            </div>
            <div class="mb-3">
              <label class="form-label">图标</label>
              <input type="text" class="form-control feature-icon" value="${feature.icon || ""}" data-id="${feature.id || index}">
            </div>
            <div class="mb-3">
              <label class="form-label">标题</label>
              <input type="text" class="form-control feature-title" value="${feature.title || ""}" data-id="${feature.id || index}">
            </div>
            <div class="mb-3">
              <label class="form-label">描述</label>
              <textarea class="form-control feature-description" rows="2" data-id="${feature.id || index}">${feature.description || ""}</textarea>
            </div>
          </div>
        </div>
      `;
      
      featuresContainer.innerHTML += featureHtml;
    });
    
    // 绑定删除特性事件
    bindDeleteFeatureEvents();
  } else {
    featuresContainer.innerHTML = "<div class=\"alert alert-info\">暂无特性数据，请添加。</div>";
  }
}

// 绑定删除特性事件
function bindDeleteFeatureEvents() {
  const deleteButtons = document.querySelectorAll("#features-en-container .delete-feature");
  
  deleteButtons.forEach(button => {
    button.addEventListener("click", function() {
      const id = this.getAttribute("data-id");
      
      if (window.featuresEnData && Array.isArray(window.featuresEnData.features)) {
        const index = window.featuresEnData.features.findIndex(feature => (feature.id || "").toString() === id.toString());
        if (index !== -1) {
          window.featuresEnData.features.splice(index, 1);
          renderEnFeatures();
        }
      }
    });
  });
}

// 渲染英文案例内容
function renderEnCases() {
  const casesContainer = document.getElementById("cases-en-container");
  if (!casesContainer) {
    console.error("未找到英文案例容器");
    return;
  }
  
  casesContainer.innerHTML = "";
  
  // 确保window.caseStudiesEnData有正确的结构
  if (!window.caseStudiesEnData) {
    console.warn("案例数据为null，初始化为空对象");
    window.caseStudiesEnData = { title: "Success Cases", cases: [] };
  }
  
  // 确保caseStudiesEnData有cases属性
  if (!window.caseStudiesEnData.cases) {
    console.warn("案例数据缺少cases属性，初始化为空数组");
    window.caseStudiesEnData.cases = [];
  }
  
  // 添加标题输入框
  casesContainer.innerHTML = `
    <div class="mb-3">
      <label class="form-label">案例集合标题</label>
      <input type="text" class="form-control" id="cases-en-title" value="${window.caseStudiesEnData.title || 'Success Cases'}">
    </div>
    <div id="cases-items-container"></div>
  `;
  
  const casesItemsContainer = document.getElementById("cases-items-container");
  
  if (Array.isArray(window.caseStudiesEnData.cases) && window.caseStudiesEnData.cases.length > 0) {
    window.caseStudiesEnData.cases.forEach((caseItem, index) => {
      // 确保case对象存在
      if (!caseItem) caseItem = {};
      
      const caseHtml = `
        <div class="card mb-3 case-item" data-id="${caseItem.id || index}">
          <div class="card-body">
            <div class="d-flex justify-content-between mb-3">
              <h5 class="card-title">案例 #${index + 1}</h5>
              <button type="button" class="btn btn-sm btn-danger delete-case" data-id="${caseItem.id || index}">删除</button>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">标题</label>
                <input type="text" class="form-control case-title" value="${caseItem.title || ""}" data-id="${caseItem.id || index}">
              </div>
              <div class="col-md-6">
                <label class="form-label">图片</label>
                <input type="text" class="form-control case-image" value="${caseItem.image || ""}" data-id="${caseItem.id || index}">
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">描述</label>
              <textarea class="form-control case-description" rows="3" data-id="${caseItem.id || index}">${caseItem.description || ""}</textarea>
            </div>
          </div>
        </div>
      `;
      
      casesItemsContainer.innerHTML += caseHtml;
    });
    
    // 绑定删除案例事件
    bindDeleteCaseEvents();
  } else {
    casesItemsContainer.innerHTML = "<div class=\"alert alert-info\">暂无案例数据，请添加。</div>";
  }
}

// 绑定删除案例事件
function bindDeleteCaseEvents() {
  const deleteButtons = document.querySelectorAll("#cases-en-container .delete-case");
  
  deleteButtons.forEach(button => {
    button.addEventListener("click", function() {
      const id = this.getAttribute("data-id");
      
      if (window.caseStudiesEnData && Array.isArray(window.caseStudiesEnData.cases)) {
        const index = window.caseStudiesEnData.cases.findIndex(caseItem => (caseItem.id || "").toString() === id.toString());
        if (index !== -1) {
          window.caseStudiesEnData.cases.splice(index, 1);
          renderEnCases();
        }
      }
    });
  });
}

// 收集特性数据
function collectFeaturesData() {
  const features = [];
  const featureItems = document.querySelectorAll("#features-en-container .feature-item");
  
  featureItems.forEach(item => {
    const id = item.getAttribute("data-id");
    const icon = item.querySelector(".feature-icon").value;
    const title = item.querySelector(".feature-title").value;
    const description = item.querySelector(".feature-description").value;
    
    features.push({
      id: id,
      icon: icon,
      title: title,
      description: description
    });
  });
  
  return features;
}

// 收集案例数据
function collectCasesData() {
  const cases = [];
  const caseItems = document.querySelectorAll("#cases-en-container .case-item");
  
  caseItems.forEach(item => {
    const id = item.getAttribute("data-id");
    const title = item.querySelector(".case-title").value;
    const image = item.querySelector(".case-image").value;
    const description = item.querySelector(".case-description").value;
    
    cases.push({
      id: id,
      title: title,
      image: image,
      description: description
    });
  });
  
  // 获取案例集合标题
  const casesTitle = document.getElementById("cases-en-title").value;
  
  // 更新全局数据对象中的标题
  if (window.caseStudiesEnData) {
    window.caseStudiesEnData.title = casesTitle;
  }
  
  return cases;
}

// 渲染英文产品内容
function renderEnProducts() {
  const productsContainer = document.getElementById("products-en-container");
  if (!productsContainer) {
    console.error("未找到英文产品容器");
    return;
  }
  
  productsContainer.innerHTML = "";
  
  // 确保window.cloudProductsEnData有正确的结构
  if (!window.cloudProductsEnData) {
    console.warn("产品数据为null，初始化为空对象");
    window.cloudProductsEnData = { title: "Our Cloud Products", products: [] };
  }
  
  // 确保cloudProductsEnData有products属性
  if (!window.cloudProductsEnData.products) {
    console.warn("产品数据缺少products属性，初始化为空数组");
    window.cloudProductsEnData.products = [];
  }
  
  // 添加标题输入框
  productsContainer.innerHTML = `
    <div class="mb-3">
      <label class="form-label">产品集合标题</label>
      <input type="text" class="form-control" id="products-en-title" value="${window.cloudProductsEnData.title || 'Our Cloud Products'}">
    </div>
    <div id="products-items-container"></div>
  `;
  
  const productsItemsContainer = document.getElementById("products-items-container");
  
  if (Array.isArray(window.cloudProductsEnData.products) && window.cloudProductsEnData.products.length > 0) {
    window.cloudProductsEnData.products.forEach((product, index) => {
      // 确保product对象存在
      if (!product) product = {};
      
      const productHtml = `
        <div class="card mb-3 product-item" data-id="${product.id || index}">
          <div class="card-body">
            <div class="d-flex justify-content-between mb-3">
              <h5 class="card-title">产品 #${index + 1}</h5>
              <button type="button" class="btn btn-sm btn-danger delete-product" data-id="${product.id || index}">删除</button>
            </div>
            <div class="row mb-3">
              <div class="col-md-4">
                <label class="form-label">图标</label>
                <input type="text" class="form-control product-icon" value="${product.icon || ""}" data-id="${product.id || index}">
              </div>
              <div class="col-md-4">
                <label class="form-label">标题</label>
                <input type="text" class="form-control product-title" value="${product.title || ""}" data-id="${product.id || index}">
              </div>
              <div class="col-md-4">
                <label class="form-label">链接</label>
                <input type="text" class="form-control product-link" value="${product.link || ""}" data-id="${product.id || index}">
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">描述</label>
              <textarea class="form-control product-description" rows="3" data-id="${product.id || index}">${product.description || ""}</textarea>
            </div>
          </div>
        </div>
      `;
      
      productsItemsContainer.innerHTML += productHtml;
    });
    
    // 绑定删除产品事件
    bindDeleteProductEvents();
  } else {
    productsItemsContainer.innerHTML = "<div class=\"alert alert-info\">暂无产品数据，请添加。</div>";
  }
}

// 绑定删除产品事件
function bindDeleteProductEvents() {
  const deleteButtons = document.querySelectorAll("#products-en-container .delete-product");
  
  deleteButtons.forEach(button => {
    button.addEventListener("click", function() {
      const id = this.getAttribute("data-id");
      
      if (window.cloudProductsEnData && Array.isArray(window.cloudProductsEnData.products)) {
        const index = window.cloudProductsEnData.products.findIndex(product => (product.id || "").toString() === id.toString());
        if (index !== -1) {
          window.cloudProductsEnData.products.splice(index, 1);
          renderEnProducts();
        }
      }
    });
  });
}

// 收集产品数据
function collectProductsData() {
  const products = [];
  const productItems = document.querySelectorAll("#products-en-container .product-item");
  
  productItems.forEach(item => {
    const id = item.getAttribute("data-id");
    const icon = item.querySelector(".product-icon").value;
    const title = item.querySelector(".product-title").value;
    const description = item.querySelector(".product-description").value;
    const link = item.querySelector(".product-link").value;
    
    products.push({
      id: id,
      icon: icon,
      title: title,
      description: description,
      link: link
    });
  });
  
  // 获取产品集合标题
  const productsTitle = document.getElementById("products-en-title").value;
  
  // 更新全局数据对象中的标题
  if (window.cloudProductsEnData) {
    window.cloudProductsEnData.title = productsTitle;
  }
  
  return products;
}

// 渲染英文解决方案内容
function renderEnSolutions() {
  const solutionsContainer = document.getElementById("solutions-en-container");
  if (!solutionsContainer) {
    console.error("未找到英文解决方案容器");
    return;
  }
  
  solutionsContainer.innerHTML = "";
  
  // 确保window.solutionsEnData有正确的结构
  if (!window.solutionsEnData) {
    console.warn("解决方案数据为null，初始化为空对象");
    window.solutionsEnData = { title: "Our Solutions", plans: [] };
  }
  
  // 确保solutionsEnData有plans属性
  if (!window.solutionsEnData.plans) {
    console.warn("解决方案数据缺少plans属性，初始化为空数组");
    window.solutionsEnData.plans = [];
  }
  
  // 添加标题输入框
  solutionsContainer.innerHTML = `
    <div class="mb-3">
      <label class="form-label">解决方案集合标题</label>
      <input type="text" class="form-control" id="solutions-en-title" value="${window.solutionsEnData.title || 'Our Solutions'}">
    </div>
    <div id="solutions-items-container"></div>
  `;
  
  const solutionsItemsContainer = document.getElementById("solutions-items-container");
  
  if (Array.isArray(window.solutionsEnData.plans) && window.solutionsEnData.plans.length > 0) {
    window.solutionsEnData.plans.forEach((solution, index) => {
      // 确保solution对象存在
      if (!solution) solution = {};
      
      // 准备特性列表HTML
      let featuresListHtml = "";
      if (Array.isArray(solution.features)) {
        solution.features.forEach((feature, featureIndex) => {
          featuresListHtml += `
            <div class="input-group mb-2">
              <input type="text" class="form-control solution-feature" value="${feature || ""}" data-index="${featureIndex}">
              <button type="button" class="btn btn-outline-danger remove-feature" data-index="${featureIndex}">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          `;
        });
      }
      
      const solutionHtml = `
        <div class="card mb-3 solution-item" data-id="${solution.id || index}">
          <div class="card-body">
            <div class="d-flex justify-content-between mb-3">
              <h5 class="card-title">解决方案 #${index + 1}</h5>
              <button type="button" class="btn btn-sm btn-danger delete-solution" data-id="${solution.id || index}">删除</button>
            </div>
            <div class="row mb-3">
              <div class="col-md-4">
                <label class="form-label">标题</label>
                <input type="text" class="form-control solution-title" value="${solution.title || ""}" data-id="${solution.id || index}">
              </div>
              <div class="col-md-4">
                <label class="form-label">副标题</label>
                <input type="text" class="form-control solution-subtitle" value="${solution.subtitle || ""}" data-id="${solution.id || index}">
              </div>
              <div class="col-md-4">
                <label class="form-label">链接</label>
                <input type="text" class="form-control solution-link" value="${solution.link || ""}" data-id="${solution.id || index}">
              </div>
            </div>
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input solution-popular" type="checkbox" id="solution-popular-${index}" ${solution.isPopular ? 'checked' : ''}>
                <label class="form-check-label" for="solution-popular-${index}">
                  标记为推荐方案
                </label>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">特性列表</label>
              <div class="features-container">
                ${featuresListHtml}
              </div>
              <button type="button" class="btn btn-sm btn-outline-primary add-solution-feature mt-2" data-id="${solution.id || index}">
                <i class="bi bi-plus"></i> 添加特性
              </button>
            </div>
          </div>
        </div>
      `;
      
      solutionsItemsContainer.innerHTML += solutionHtml;
    });
    
    // 绑定删除解决方案事件
    bindDeleteSolutionEvents();
    
    // 绑定添加和删除特性事件
    bindSolutionFeatureEvents();
  } else {
    solutionsItemsContainer.innerHTML = "<div class=\"alert alert-info\">暂无解决方案数据，请添加。</div>";
  }
}

// 绑定解决方案特性相关事件
function bindSolutionFeatureEvents() {
  // 添加特性按钮事件
  const addFeatureBtns = document.querySelectorAll(".add-solution-feature");
  addFeatureBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      const solutionId = this.getAttribute("data-id");
      const solutionItem = document.querySelector(`.solution-item[data-id="${solutionId}"]`);
      const featuresContainer = solutionItem.querySelector(".features-container");
      
      // 获取当前特性数量
      const featureCount = featuresContainer.querySelectorAll(".solution-feature").length;
      
      // 创建新特性输入框
      const newFeatureHtml = `
        <div class="input-group mb-2">
          <input type="text" class="form-control solution-feature" value="New Feature" data-index="${featureCount}">
          <button type="button" class="btn btn-outline-danger remove-feature" data-index="${featureCount}">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
      
      featuresContainer.insertAdjacentHTML('beforeend', newFeatureHtml);
      
      // 绑定新添加的删除特性按钮事件
      const newRemoveBtn = featuresContainer.querySelector(`.remove-feature[data-index="${featureCount}"]`);
      newRemoveBtn.addEventListener("click", function() {
        this.closest('.input-group').remove();
      });
    });
  });
  
  // 删除特性按钮事件
  const removeFeatureBtns = document.querySelectorAll(".remove-feature");
  removeFeatureBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      this.closest('.input-group').remove();
    });
  });
}

// 绑定删除解决方案事件
function bindDeleteSolutionEvents() {
  const deleteButtons = document.querySelectorAll("#solutions-en-container .delete-solution");
  
  deleteButtons.forEach(button => {
    button.addEventListener("click", function() {
      const id = this.getAttribute("data-id");
      
      if (window.solutionsEnData && Array.isArray(window.solutionsEnData.plans)) {
        const index = window.solutionsEnData.plans.findIndex(solution => (solution.id || "").toString() === id.toString());
        if (index !== -1) {
          window.solutionsEnData.plans.splice(index, 1);
          renderEnSolutions();
        }
      }
    });
  });
}

// 收集解决方案数据
function collectSolutionsData() {
  const solutions = [];
  const solutionItems = document.querySelectorAll("#solutions-en-container .solution-item");
  
  solutionItems.forEach(item => {
    const id = item.getAttribute("data-id");
    const title = item.querySelector(".solution-title").value;
    const subtitle = item.querySelector(".solution-subtitle").value;
    const link = item.querySelector(".solution-link").value;
    const isPopular = item.querySelector(".solution-popular").checked;
    
    // 收集特性列表
    const features = [];
    const featureInputs = item.querySelectorAll(".solution-feature");
    featureInputs.forEach(input => {
      if (input.value.trim() !== "") {
        features.push(input.value.trim());
      }
    });
    
    solutions.push({
      id: id,
      title: title,
      subtitle: subtitle,
      isPopular: isPopular,
      features: features,
      link: link
    });
  });
  
  // 获取解决方案集合标题
  const solutionsTitle = document.getElementById("solutions-en-title").value;
  
  // 更新全局数据对象中的标题
  if (window.solutionsEnData) {
    window.solutionsEnData.title = solutionsTitle;
  }
  
  return solutions;
}

// 渲染英文团队成员内容
function renderEnTeamMembers() {
  const teamMembersContainer = document.getElementById("team-members-en-container");
  if (!teamMembersContainer) {
    console.error("未找到英文团队成员容器");
    return;
  }
  
  teamMembersContainer.innerHTML = "";
  
  // 确保window.teamMembersEnData有正确的结构
  if (!window.teamMembersEnData) {
    console.warn("团队成员数据为null，初始化为空对象");
    window.teamMembersEnData = { 
      title: "Core Team", 
      description: "Our team consists of industry veterans with rich technical and management experience",
      members: [] 
    };
  }
  
  // 确保teamMembersEnData有members属性
  if (!window.teamMembersEnData.members) {
    console.warn("团队成员数据缺少members属性，初始化为空数组");
    window.teamMembersEnData.members = [];
  }
  
  // 添加标题和描述输入框
  teamMembersContainer.innerHTML = `
    <div class="mb-3">
      <label class="form-label">团队标题</label>
      <input type="text" class="form-control" id="team-en-title" value="${window.teamMembersEnData.title || 'Core Team'}">
    </div>
    <div class="mb-3">
      <label class="form-label">团队描述</label>
      <textarea class="form-control" id="team-en-description" rows="2">${window.teamMembersEnData.description || 'Our team consists of industry veterans with rich technical and management experience'}</textarea>
    </div>
    <div id="team-members-items-container"></div>
  `;
  
  const teamMembersItemsContainer = document.getElementById("team-members-items-container");
  
  if (Array.isArray(window.teamMembersEnData.members) && window.teamMembersEnData.members.length > 0) {
    window.teamMembersEnData.members.forEach((member, index) => {
      // 确保member对象存在
      if (!member) member = {};
      
      const memberHtml = `
        <div class="card mb-3 member-item" data-id="${member.id || index}">
          <div class="card-body">
            <div class="d-flex justify-content-between mb-3">
              <h5 class="card-title">团队成员 #${index + 1}</h5>
              <button type="button" class="btn btn-sm btn-danger delete-member" data-id="${member.id || index}">删除</button>
            </div>
            <div class="mb-3">
              <label class="form-label">头像</label>
              <input type="text" class="form-control member-avatar" value="${member.avatar || ""}" data-id="${member.id || index}">
            </div>
            <div class="mb-3">
              <label class="form-label">姓名</label>
              <input type="text" class="form-control member-name" value="${member.name || ""}" data-id="${member.id || index}">
            </div>
            <div class="mb-3">
              <label class="form-label">职位</label>
              <input type="text" class="form-control member-position" value="${member.position || ""}" data-id="${member.id || index}">
            </div>
            <div class="mb-3">
              <label class="form-label">描述</label>
              <textarea class="form-control member-description" rows="2" data-id="${member.id || index}">${member.description || ""}</textarea>
            </div>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">社交类型</label>
                <select class="form-select member-social-type" data-id="${member.id || index}">
                  <option value="QQ" ${member.social_type === "QQ" ? "selected" : ""}>QQ</option>
                  <option value="微信" ${member.social_type === "微信" ? "selected" : ""}>微信</option>
                  <option value="领英" ${member.social_type === "领英" ? "selected" : ""}>领英</option>
                  <option value="GitHub" ${member.social_type === "GitHub" ? "selected" : ""}>GitHub</option>
                  <option value="微博" ${member.social_type === "微博" ? "selected" : ""}>微博</option>
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">社交媒体</label>
                <input type="text" class="form-control member-social-media" value="${member.social_media || ""}" data-id="${member.id || index}">
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">邮箱</label>
                <input type="text" class="form-control member-email" value="${member.email || ""}" data-id="${member.id || index}">
              </div>
            </div>
          </div>
        </div>
      `;
      
      teamMembersItemsContainer.innerHTML += memberHtml;
    });
    
    // 绑定删除团队成员事件
    bindDeleteMemberEvents();
  } else {
    teamMembersItemsContainer.innerHTML = "<div class=\"alert alert-info\">暂无团队成员数据，请添加。</div>";
  }
}

// 绑定删除团队成员事件
function bindDeleteMemberEvents() {
  const deleteButtons = document.querySelectorAll("#team-members-items-container .delete-member");
  
  deleteButtons.forEach(button => {
    button.addEventListener("click", function() {
      const id = this.getAttribute("data-id");
      
      if (window.teamMembersEnData && Array.isArray(window.teamMembersEnData.members)) {
        const index = window.teamMembersEnData.members.findIndex(member => (member.id || "").toString() === id.toString());
        if (index !== -1) {
          window.teamMembersEnData.members.splice(index, 1);
          renderEnTeamMembers();
        }
      }
    });
  });
}

// 收集团队成员数据
function collectTeamMembersData() {
  const members = [];
  const memberItems = document.querySelectorAll("#team-members-items-container .member-item");
  
  memberItems.forEach(item => {
    const id = item.getAttribute("data-id");
    const avatar = item.querySelector(".member-avatar").value;
    const name = item.querySelector(".member-name").value;
    const position = item.querySelector(".member-position").value;
    const description = item.querySelector(".member-description").value;
    const socialTypeSelect = item.querySelector(".member-social-type");
    const social_type = socialTypeSelect.options[socialTypeSelect.selectedIndex].value;
    const social_media = item.querySelector(".member-social-media").value;
    const email = item.querySelector(".member-email").value;
    
    members.push({
      id: id,
      avatar: avatar,
      name: name,
      position: position,
      description: description,
      social_type: social_type,
      social_media: social_media,
      email: email
    });
  });
  
  // 获取团队标题和描述
  const title = document.getElementById("team-en-title").value;
  const description = document.getElementById("team-en-description").value;
  
  // 更新全局数据对象中的标题和描述
  if (window.teamMembersEnData) {
    window.teamMembersEnData.title = title;
    window.teamMembersEnData.description = description;
  }
  
  return members;
}

// 渲染英文发展历程内容
function renderEnCompanyHistory() {
  const historyContainer = document.getElementById("history-en-container");
  if (!historyContainer) {
    console.error("未找到英文发展历程容器");
    return;
  }
  
  historyContainer.innerHTML = "";
  
  // 确保window.companyHistoryEnData有正确的结构
  if (!window.companyHistoryEnData) {
    console.warn("发展历程数据为null，初始化为空对象");
    window.companyHistoryEnData = { 
      title: "Development History", 
      description: "Our growth journey in the field of digital solutions",
      milestones: [] 
    };
  }
  
  // 确保companyHistoryEnData有milestones属性
  if (!window.companyHistoryEnData.milestones) {
    console.warn("发展历程数据缺少milestones属性，初始化为空数组");
    window.companyHistoryEnData.milestones = [];
  }
  
  // 添加标题和描述输入框
  historyContainer.innerHTML = `
    <div class="mb-3">
      <label class="form-label">发展历程标题</label>
      <input type="text" class="form-control" id="history-en-title" value="${window.companyHistoryEnData.title || 'Development History'}">
    </div>
    <div class="mb-3">
      <label class="form-label">发展历程描述</label>
      <textarea class="form-control" id="history-en-description" rows="2">${window.companyHistoryEnData.description || 'Our growth journey in the field of digital solutions'}</textarea>
    </div>
    <div id="history-items-container"></div>
  `;
  
  const historyItemsContainer = document.getElementById("history-items-container");
  
  if (Array.isArray(window.companyHistoryEnData.milestones) && window.companyHistoryEnData.milestones.length > 0) {
    window.companyHistoryEnData.milestones.forEach((milestone, index) => {
      // 确保milestone对象存在
      if (!milestone) milestone = {};
      
      const milestoneHtml = `
        <div class="card mb-3 milestone-item" data-id="${milestone.id || index}">
          <div class="card-body">
            <div class="d-flex justify-content-between mb-3">
              <h5 class="card-title">里程碑 #${index + 1}</h5>
              <button type="button" class="btn btn-sm btn-danger delete-milestone" data-id="${milestone.id || index}">删除</button>
            </div>
            <div class="row mb-3">
              <div class="col-md-4">
                <label class="form-label">年份</label>
                <input type="text" class="form-control milestone-year" value="${milestone.year || ""}" data-id="${milestone.id || index}">
              </div>
              <div class="col-md-4">
                <label class="form-label">标签</label>
                <input type="text" class="form-control milestone-label" value="${milestone.label || ""}" data-id="${milestone.id || index}">
              </div>
              <div class="col-md-4">
                <label class="form-label">标题</label>
                <input type="text" class="form-control milestone-title" value="${milestone.title || ""}" data-id="${milestone.id || index}">
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">内容</label>
              <textarea class="form-control milestone-content" rows="2" data-id="${milestone.id || index}">${milestone.content || ""}</textarea>
            </div>
          </div>
        </div>
      `;
      
      historyItemsContainer.innerHTML += milestoneHtml;
    });
    
    // 绑定删除里程碑事件
    bindDeleteMilestoneEvents();
  } else {
    historyItemsContainer.innerHTML = "<div class=\"alert alert-info\">暂无里程碑数据，请添加。</div>";
  }
}

// 绑定删除里程碑事件
function bindDeleteMilestoneEvents() {
  const deleteButtons = document.querySelectorAll("#history-items-container .delete-milestone");
  
  deleteButtons.forEach(button => {
    button.addEventListener("click", function() {
      const id = this.getAttribute("data-id");
      
      if (window.companyHistoryEnData && Array.isArray(window.companyHistoryEnData.milestones)) {
        const index = window.companyHistoryEnData.milestones.findIndex(milestone => (milestone.id || "").toString() === id.toString());
        if (index !== -1) {
          window.companyHistoryEnData.milestones.splice(index, 1);
          renderEnCompanyHistory();
        }
      }
    });
  });
}

// 收集发展历程数据
function collectCompanyHistoryData() {
  const milestones = [];
  const milestoneItems = document.querySelectorAll("#history-items-container .milestone-item");
  
  milestoneItems.forEach(item => {
    const id = item.getAttribute("data-id");
    const year = item.querySelector(".milestone-year").value;
    const label = item.querySelector(".milestone-label").value;
    const title = item.querySelector(".milestone-title").value;
    const content = item.querySelector(".milestone-content").value;
    
    milestones.push({
      id: id,
      year: year,
      label: label,
      title: title,
      content: content
    });
  });
  
  // 获取发展历程标题和描述
  const title = document.getElementById("history-en-title").value;
  const description = document.getElementById("history-en-description").value;
  
  // 更新全局数据对象中的标题和描述
  if (window.companyHistoryEnData) {
    window.companyHistoryEnData.title = title;
    window.companyHistoryEnData.description = description;
  }
  
  return milestones;
}

// 渲染英文合作伙伴内容
function renderEnPartners() {
  const partnersContainer = document.getElementById("partners-en-container");
  if (!partnersContainer) {
    console.error("未找到英文合作伙伴容器");
    return;
  }
  
  partnersContainer.innerHTML = "";
  
  // 创建标签页结构
  partnersContainer.innerHTML = `
    <div class="card mt-3">
      <div class="card-body">
        <ul class="nav nav-tabs" id="partnersEnTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="strategic-partners-en-tab" data-bs-toggle="tab" data-bs-target="#strategic-partners-en-content" type="button" role="tab">战略合作伙伴</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="tech-partners-en-tab" data-bs-toggle="tab" data-bs-target="#tech-partners-en-content" type="button" role="tab">技术合作伙伴</button>
          </li>
        </ul>
        <div class="tab-content" id="partnersEnTabContent">
          <div class="tab-pane fade show active" id="strategic-partners-en-content" role="tabpanel">
            <div class="mt-3">
              <div class="mb-3">
                <label for="strategic-partners-en-title" class="form-label">标题</label>
                <input type="text" class="form-control" id="strategic-partners-en-title" value="${window.strategicPartnersEnData?.title || '战略合作伙伴'}">
              </div>
              <div class="mb-3">
                <div id="strategic-partners-en-container"></div>
                <button id="add-strategic-partner-en" class="btn btn-outline-primary mt-2">
                  <i class="bi bi-plus"></i> 添加战略合作伙伴
                </button>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="tech-partners-en-content" role="tabpanel">
            <div class="mt-3">
              <div class="mb-3">
                <label for="tech-partners-en-title" class="form-label">标题</label>
                <input type="text" class="form-control" id="tech-partners-en-title" value="${window.techPartnersEnData?.title || '技术合作伙伴'}">
              </div>
              <div class="mb-3">
                <div id="tech-partners-en-container"></div>
                <button id="add-tech-partner-en" class="btn btn-outline-primary mt-2">
                  <i class="bi bi-plus"></i> 添加技术合作伙伴
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 初始化标签页
  const strategicTab = document.getElementById("strategic-partners-en-tab");
  const techTab = document.getElementById("tech-partners-en-tab");
  
  // 绑定标签页切换事件
  strategicTab.addEventListener("click", function(e) {
    document.getElementById("strategic-partners-en-content").classList.add("show", "active");
    document.getElementById("tech-partners-en-content").classList.remove("show", "active");
    this.classList.add("active");
    techTab.classList.remove("active");
    renderEnStrategicPartners();
    e.preventDefault();
    e.stopPropagation();
  });
  
  techTab.addEventListener("click", function(e) {
    document.getElementById("tech-partners-en-content").classList.add("show", "active");
    document.getElementById("strategic-partners-en-content").classList.remove("show", "active");
    this.classList.add("active");
    strategicTab.classList.remove("active");
    renderEnTechPartners();
    e.preventDefault();
    e.stopPropagation();
  });
  
  // 绑定添加按钮事件
  const addStrategicPartnerBtn = document.getElementById("add-strategic-partner-en");
  if (addStrategicPartnerBtn) {
    addStrategicPartnerBtn.addEventListener("click", addEnStrategicPartner);
  }
  
  const addTechPartnerBtn = document.getElementById("add-tech-partner-en");
  if (addTechPartnerBtn) {
    addTechPartnerBtn.addEventListener("click", addEnTechPartner);
  }
  
  // 初始渲染战略合作伙伴
  renderEnStrategicPartners();
}

// 渲染英文战略合作伙伴
function renderEnStrategicPartners() {
  const strategicPartnersContainer = document.getElementById("strategic-partners-en-container");
  if (!strategicPartnersContainer) {
    console.error("未找到英文战略合作伙伴容器");
    return;
  }
  
  strategicPartnersContainer.innerHTML = "";
  
  // 确保window.strategicPartnersEnData有正确的结构
  if (!window.strategicPartnersEnData) {
    console.warn("战略合作伙伴数据为null，初始化为空对象");
    window.strategicPartnersEnData = { 
      title: "Strategic Partners", 
      partners: [] 
    };
  }
  
  // 确保strategicPartnersEnData有partners属性
  if (!window.strategicPartnersEnData.partners) {
    console.warn("战略合作伙伴数据缺少partners属性，初始化为空数组");
    window.strategicPartnersEnData.partners = [];
  }
  
  // 更新标题输入框
  const titleInput = document.getElementById("strategic-partners-en-title");
  if (titleInput) {
    titleInput.value = window.strategicPartnersEnData.title || "Strategic Partners";
  }
  
  if (Array.isArray(window.strategicPartnersEnData.partners) && window.strategicPartnersEnData.partners.length > 0) {
    window.strategicPartnersEnData.partners.forEach((partner, index) => {
      // 确保partner对象存在
      if (!partner) partner = {};
      
      const partnerHtml = `
        <div class="card mb-3 strategic-partner-item" data-id="${partner.id || index}">
          <div class="card-body">
            <div class="d-flex justify-content-between mb-3">
              <h5 class="card-title">战略合作伙伴 #${index + 1}</h5>
              <button type="button" class="btn btn-sm btn-danger delete-strategic-partner" data-id="${partner.id || index}">删除</button>
            </div>
            <div class="mb-3">
              <label class="form-label">名称</label>
              <input type="text" class="form-control strategic-partner-name" value="${partner.name || ''}" data-id="${partner.id || index}">
            </div>
            <div class="mb-3">
              <label class="form-label">描述</label>
              <textarea class="form-control strategic-partner-description" rows="2" data-id="${partner.id || index}">${partner.description || ''}</textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">图标</label>
              <input type="text" class="form-control strategic-partner-icon" value="${partner.icon || ''}" data-id="${partner.id || index}">
              <small class="form-text text-muted">Bootstrap 图标类名，例如: bi bi-building</small>
            </div>
            <div class="mb-3">
              <label class="form-label">Logo URL</label>
              <input type="text" class="form-control strategic-partner-logo" value="${partner.logo || ''}" data-id="${partner.id || index}">
              <small class="form-text text-muted">如果提供，将优先使用Logo而不是图标</small>
            </div>
          </div>
        </div>
      `;
      
      strategicPartnersContainer.innerHTML += partnerHtml;
    });
    
    // 绑定删除战略合作伙伴事件
    bindDeleteStrategicPartnerEvents();
  } else {
    strategicPartnersContainer.innerHTML = "<div class=\"alert alert-info\">暂无战略合作伙伴数据，请添加。</div>";
  }
}

// 渲染英文技术合作伙伴
function renderEnTechPartners() {
  const techPartnersContainer = document.getElementById("tech-partners-en-container");
  if (!techPartnersContainer) {
    console.error("未找到英文技术合作伙伴容器");
    return;
  }
  
  techPartnersContainer.innerHTML = "";
  
  // 确保window.techPartnersEnData有正确的结构
  if (!window.techPartnersEnData) {
    console.warn("技术合作伙伴数据为null，初始化为空对象");
    window.techPartnersEnData = { 
      title: "Technology Partners", 
      partners: [] 
    };
  }
  
  // 确保techPartnersEnData有partners属性
  if (!window.techPartnersEnData.partners) {
    console.warn("技术合作伙伴数据缺少partners属性，初始化为空数组");
    window.techPartnersEnData.partners = [];
  }
  
  // 更新标题输入框
  const titleInput = document.getElementById("tech-partners-en-title");
  if (titleInput) {
    titleInput.value = window.techPartnersEnData.title || "Technology Partners";
  }
  
  if (Array.isArray(window.techPartnersEnData.partners) && window.techPartnersEnData.partners.length > 0) {
    window.techPartnersEnData.partners.forEach((partner, index) => {
      // 确保partner对象存在
      if (!partner) partner = {};
      
      const partnerHtml = `
        <div class="card mb-3 tech-partner-item" data-id="${partner.id || index}">
          <div class="card-body">
            <div class="d-flex justify-content-between mb-3">
              <h5 class="card-title">技术合作伙伴 #${index + 1}</h5>
              <button type="button" class="btn btn-sm btn-danger delete-tech-partner" data-id="${partner.id || index}">删除</button>
            </div>
            <div class="mb-3">
              <label class="form-label">名称</label>
              <input type="text" class="form-control tech-partner-name" value="${partner.name || ''}" data-id="${partner.id || index}">
            </div>
            <div class="mb-3">
              <label class="form-label">图标</label>
              <input type="text" class="form-control tech-partner-icon" value="${partner.icon || ''}" data-id="${partner.id || index}">
              <small class="form-text text-muted">Bootstrap 图标类名，例如: bi bi-cpu</small>
            </div>
            <div class="mb-3">
              <label class="form-label">Logo URL</label>
              <input type="text" class="form-control tech-partner-logo" value="${partner.logo || ''}" data-id="${partner.id || index}">
              <small class="form-text text-muted">如果提供，将优先使用Logo而不是图标</small>
            </div>
          </div>
        </div>
      `;
      
      techPartnersContainer.innerHTML += partnerHtml;
    });
    
    // 绑定删除技术合作伙伴事件
    bindDeleteTechPartnerEvents();
  } else {
    techPartnersContainer.innerHTML = "<div class=\"alert alert-info\">暂无技术合作伙伴数据，请添加。</div>";
  }
}

// 添加战略合作伙伴
function addEnStrategicPartner() {
  const newPartner = {
    id: Date.now(),
    name: "New Strategic Partner",
    description: "Partnership description",
    icon: "bi bi-building",
    logo: ""
  };
  
  // 添加到数据中
  if (!window.strategicPartnersEnData) {
    window.strategicPartnersEnData = { 
      title: "Strategic Partners", 
      partners: [] 
    };
  } else if (!window.strategicPartnersEnData.partners) {
    window.strategicPartnersEnData.partners = [];
  }
  
  window.strategicPartnersEnData.partners.push(newPartner);
  
  // 重新渲染
  renderEnStrategicPartners();
}

// 添加技术合作伙伴
function addEnTechPartner() {
  const newPartner = {
    id: Date.now(),
    name: "New Technology Partner",
    icon: "bi bi-cpu",
    logo: ""
  };
  
  // 添加到数据中
  if (!window.techPartnersEnData) {
    window.techPartnersEnData = { 
      title: "Technology Partners", 
      partners: [] 
    };
  } else if (!window.techPartnersEnData.partners) {
    window.techPartnersEnData.partners = [];
  }
  
  window.techPartnersEnData.partners.push(newPartner);
  
  // 重新渲染
  renderEnTechPartners();
}

// 绑定删除战略合作伙伴事件
function bindDeleteStrategicPartnerEvents() {
  const deleteButtons = document.querySelectorAll("#strategic-partners-en-container .delete-strategic-partner");
  
  deleteButtons.forEach(button => {
    button.addEventListener("click", function() {
      const id = this.getAttribute("data-id");
      
      if (window.strategicPartnersEnData && Array.isArray(window.strategicPartnersEnData.partners)) {
        const index = window.strategicPartnersEnData.partners.findIndex(partner => (partner.id || "").toString() === id.toString());
        if (index !== -1) {
          window.strategicPartnersEnData.partners.splice(index, 1);
          renderEnStrategicPartners();
        }
      }
    });
  });
}

// 绑定删除技术合作伙伴事件
function bindDeleteTechPartnerEvents() {
  const deleteButtons = document.querySelectorAll("#tech-partners-en-container .delete-tech-partner");
  
  deleteButtons.forEach(button => {
    button.addEventListener("click", function() {
      const id = this.getAttribute("data-id");
      
      if (window.techPartnersEnData && Array.isArray(window.techPartnersEnData.partners)) {
        const index = window.techPartnersEnData.partners.findIndex(partner => (partner.id || "").toString() === id.toString());
        if (index !== -1) {
          window.techPartnersEnData.partners.splice(index, 1);
          renderEnTechPartners();
        }
      }
    });
  });
}

// 收集合作伙伴数据
function collectPartnersData() {
  // 收集战略合作伙伴数据
  const strategicPartners = collectStrategicPartnersData();
  
  // 收集技术合作伙伴数据
  const techPartners = collectTechPartnersData();
  
  return {
    strategicPartners,
    techPartners
  };
}

// 收集战略合作伙伴数据
function collectStrategicPartnersData() {
  const partners = [];
  const partnerItems = document.querySelectorAll("#strategic-partners-en-container .strategic-partner-item");
  
  partnerItems.forEach(item => {
    const id = item.getAttribute("data-id");
    const name = item.querySelector(".strategic-partner-name").value;
    const description = item.querySelector(".strategic-partner-description").value;
    const icon = item.querySelector(".strategic-partner-icon").value;
    const logo = item.querySelector(".strategic-partner-logo").value;
    
    partners.push({
      id: id,
      name: name,
      description: description,
      icon: icon,
      logo: logo
    });
  });
  
  // 获取标题
  const title = document.getElementById("strategic-partners-en-title").value;
  
  // 更新全局数据
  if (window.strategicPartnersEnData) {
    window.strategicPartnersEnData.title = title;
    window.strategicPartnersEnData.partners = partners;
  }
  
  return {
    title,
    partners
  };
}

// 收集技术合作伙伴数据
function collectTechPartnersData() {
  const partners = [];
  const partnerItems = document.querySelectorAll("#tech-partners-en-container .tech-partner-item");
  
  partnerItems.forEach(item => {
    const id = item.getAttribute("data-id");
    const name = item.querySelector(".tech-partner-name").value;
    const icon = item.querySelector(".tech-partner-icon").value;
    const logo = item.querySelector(".tech-partner-logo").value;
    
    partners.push({
      id: id,
      name: name,
      icon: icon,
      logo: logo
    });
  });
  
  // 获取标题
  const title = document.getElementById("tech-partners-en-title").value;
  
  // 更新全局数据
  if (window.techPartnersEnData) {
    window.techPartnersEnData.title = title;
    window.techPartnersEnData.partners = partners;
  }
  
  return {
    title,
    partners
  };
}

// 渲染英文页脚内容
function renderEnFooter() {
  const footerContainer = document.getElementById("footer-en-container");
  if (!footerContainer) {
    console.error("未找到英文页脚容器");
    return;
  }
  
  footerContainer.innerHTML = "";
  
  // 确保window.footerEnData有正确的结构
  if (!window.footerEnData) {
    console.warn("页脚数据为null，初始化为空对象");
    window.footerEnData = {
      company_info: "",
      social_links: [],
      quick_links: [],
      solution_links: [],
      contact_info: {
        address: "",
        phone: "",
        email: "",
        hours: ""
      },
      copyright: "",
      icp: ""
    };
  }
  
  // 公司信息
  footerContainer.innerHTML += `
    <div class="card mb-3">
      <div class="card-header">公司信息</div>
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">简介</label>
          <textarea class="form-control" id="footer-company-info" rows="3">${window.footerEnData.company_info || ""}</textarea>
        </div>
      </div>
    </div>
  `;
  
  // 社交链接
  footerContainer.innerHTML += `
    <div class="card mb-3">
      <div class="card-header">社交媒体链接</div>
      <div class="card-body">
        <div id="social-links-container">
          ${renderSocialLinks()}
        </div>
        <button id="add-social-link" class="btn btn-sm btn-outline-primary mt-2">
          <i class="bi bi-plus"></i> 添加社交链接
        </button>
      </div>
    </div>
  `;
  
  // 快速链接
  footerContainer.innerHTML += `
    <div class="card mb-3">
      <div class="card-header">快速链接</div>
      <div class="card-body">
        <div id="quick-links-container">
          ${renderQuickLinks()}
        </div>
        <button id="add-quick-link" class="btn btn-sm btn-outline-primary mt-2">
          <i class="bi bi-plus"></i> 添加快速链接
        </button>
      </div>
    </div>
  `;
  
  // 解决方案链接
  footerContainer.innerHTML += `
    <div class="card mb-3">
      <div class="card-header">解决方案链接</div>
      <div class="card-body">
        <div id="solution-links-container">
          ${renderSolutionLinks()}
        </div>
        <button id="add-solution-link" class="btn btn-sm btn-outline-primary mt-2">
          <i class="bi bi-plus"></i> 添加解决方案链接
        </button>
      </div>
    </div>
  `;
  
  // 联系信息
  footerContainer.innerHTML += `
    <div class="card mb-3">
      <div class="card-header">联系信息</div>
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">地址</label>
          <input type="text" class="form-control" id="footer-address" value="${window.footerEnData.contact_info?.address || ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">电话</label>
          <input type="text" class="form-control" id="footer-phone" value="${window.footerEnData.contact_info?.phone || ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">邮箱</label>
          <input type="text" class="form-control" id="footer-email" value="${window.footerEnData.contact_info?.email || ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">工作时间</label>
          <input type="text" class="form-control" id="footer-hours" value="${window.footerEnData.contact_info?.hours || ""}">
        </div>
      </div>
    </div>
  `;
  
  // 版权信息
  footerContainer.innerHTML += `
    <div class="card mb-3">
      <div class="card-header">版权信息</div>
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">版权信息</label>
          <input type="text" class="form-control" id="footer-copyright" value="${window.footerEnData.copyright || ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">ICP备案号</label>
          <input type="text" class="form-control" id="footer-icp" value="${window.footerEnData.icp || ""}">
        </div>
      </div>
    </div>
  `;
  
  // 绑定添加链接按钮事件
  bindAddFooterLinkEvents();
}

// 渲染社交链接
function renderSocialLinks() {
  let html = "";
  
  if (Array.isArray(window.footerEnData.social_links) && window.footerEnData.social_links.length > 0) {
    window.footerEnData.social_links.forEach((link, index) => {
      html += `
        <div class="input-group mb-2 social-link-item">
          <input type="text" class="form-control social-link-icon" placeholder="图标类名" value="${link.icon || ""}" aria-label="图标">
          <input type="text" class="form-control social-link-url" placeholder="链接URL" value="${link.link || ""}" aria-label="链接">
          <button class="btn btn-outline-danger delete-social-link" type="button" data-index="${index}">删除</button>
        </div>
      `;
    });
  } else {
    html = '<div class="alert alert-info">暂无社交链接，请添加</div>';
  }
  
  return html;
}

// 渲染快速链接
function renderQuickLinks() {
  let html = "";
  
  if (Array.isArray(window.footerEnData.quick_links) && window.footerEnData.quick_links.length > 0) {
    window.footerEnData.quick_links.forEach((link, index) => {
      html += `
        <div class="input-group mb-2 quick-link-item">
          <input type="text" class="form-control quick-link-text" placeholder="文本" value="${link.text || ""}" aria-label="文本">
          <input type="text" class="form-control quick-link-url" placeholder="链接URL" value="${link.link || ""}" aria-label="链接">
          <button class="btn btn-outline-danger delete-quick-link" type="button" data-index="${index}">删除</button>
        </div>
      `;
    });
  } else {
    html = '<div class="alert alert-info">暂无快速链接，请添加</div>';
  }
  
  return html;
}

// 渲染解决方案链接
function renderSolutionLinks() {
  let html = "";
  
  if (Array.isArray(window.footerEnData.solution_links) && window.footerEnData.solution_links.length > 0) {
    window.footerEnData.solution_links.forEach((link, index) => {
      html += `
        <div class="input-group mb-2 solution-link-item">
          <input type="text" class="form-control solution-link-text" placeholder="文本" value="${link.text || ""}" aria-label="文本">
          <input type="text" class="form-control solution-link-url" placeholder="链接URL" value="${link.link || ""}" aria-label="链接">
          <button class="btn btn-outline-danger delete-solution-link" type="button" data-index="${index}">删除</button>
        </div>
      `;
    });
  } else {
    html = '<div class="alert alert-info">暂无解决方案链接，请添加</div>';
  }
  
  return html;
}

// 绑定添加页脚链接按钮事件
function bindAddFooterLinkEvents() {
  // 添加社交链接按钮
  const addSocialLinkBtn = document.getElementById("add-social-link");
  if (addSocialLinkBtn) {
    addSocialLinkBtn.addEventListener("click", function() {
      // 确保社交链接数组存在
      if (!window.footerEnData.social_links) {
        window.footerEnData.social_links = [];
      }
      
      // 添加新的社交链接
      window.footerEnData.social_links.push({
        icon: "bi bi-facebook",
        link: "#"
      });
      
      // 更新UI
      document.getElementById("social-links-container").innerHTML = renderSocialLinks();
      bindDeleteFooterLinkEvents();
    });
  }
  
  // 添加快速链接按钮
  const addQuickLinkBtn = document.getElementById("add-quick-link");
  if (addQuickLinkBtn) {
    addQuickLinkBtn.addEventListener("click", function() {
      // 确保快速链接数组存在
      if (!window.footerEnData.quick_links) {
        window.footerEnData.quick_links = [];
      }
      
      // 添加新的快速链接
      window.footerEnData.quick_links.push({
        text: "New Link",
        link: "#"
      });
      
      // 更新UI
      document.getElementById("quick-links-container").innerHTML = renderQuickLinks();
      bindDeleteFooterLinkEvents();
    });
  }
  
  // 添加解决方案链接按钮
  const addSolutionLinkBtn = document.getElementById("add-solution-link");
  if (addSolutionLinkBtn) {
    addSolutionLinkBtn.addEventListener("click", function() {
      // 确保解决方案链接数组存在
      if (!window.footerEnData.solution_links) {
        window.footerEnData.solution_links = [];
      }
      
      // 添加新的解决方案链接
      window.footerEnData.solution_links.push({
        text: "New Solution",
        link: "#"
      });
      
      // 更新UI
      document.getElementById("solution-links-container").innerHTML = renderSolutionLinks();
      bindDeleteFooterLinkEvents();
    });
  }
  
  // 绑定删除链接事件
  bindDeleteFooterLinkEvents();
}

// 绑定删除页脚链接事件
function bindDeleteFooterLinkEvents() {
  // 删除社交链接按钮
  const deleteSocialLinkBtns = document.querySelectorAll(".delete-social-link");
  deleteSocialLinkBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      const index = parseInt(this.getAttribute("data-index"));
      
      if (Array.isArray(window.footerEnData.social_links) && index >= 0 && index < window.footerEnData.social_links.length) {
        window.footerEnData.social_links.splice(index, 1);
        document.getElementById("social-links-container").innerHTML = renderSocialLinks();
        bindDeleteFooterLinkEvents();
      }
    });
  });
  
  // 删除快速链接按钮
  const deleteQuickLinkBtns = document.querySelectorAll(".delete-quick-link");
  deleteQuickLinkBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      const index = parseInt(this.getAttribute("data-index"));
      
      if (Array.isArray(window.footerEnData.quick_links) && index >= 0 && index < window.footerEnData.quick_links.length) {
        window.footerEnData.quick_links.splice(index, 1);
        document.getElementById("quick-links-container").innerHTML = renderQuickLinks();
        bindDeleteFooterLinkEvents();
      }
    });
  });
  
  // 删除解决方案链接按钮
  const deleteSolutionLinkBtns = document.querySelectorAll(".delete-solution-link");
  deleteSolutionLinkBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      const index = parseInt(this.getAttribute("data-index"));
      
      if (Array.isArray(window.footerEnData.solution_links) && index >= 0 && index < window.footerEnData.solution_links.length) {
        window.footerEnData.solution_links.splice(index, 1);
        document.getElementById("solution-links-container").innerHTML = renderSolutionLinks();
        bindDeleteFooterLinkEvents();
      }
    });
  });
}

// 收集页脚数据
function collectFooterData() {
  // 收集公司信息
  const companyInfo = document.getElementById("footer-company-info").value;
  
  // 收集社交链接
  const socialLinks = [];
  const socialLinkItems = document.querySelectorAll(".social-link-item");
  socialLinkItems.forEach(item => {
    const icon = item.querySelector(".social-link-icon").value;
    const link = item.querySelector(".social-link-url").value;
    
    socialLinks.push({
      icon: icon,
      link: link
    });
  });
  
  // 收集快速链接
  const quickLinks = [];
  const quickLinkItems = document.querySelectorAll(".quick-link-item");
  quickLinkItems.forEach(item => {
    const text = item.querySelector(".quick-link-text").value;
    const link = item.querySelector(".quick-link-url").value;
    
    quickLinks.push({
      text: text,
      link: link
    });
  });
  
  // 收集解决方案链接
  const solutionLinks = [];
  const solutionLinkItems = document.querySelectorAll(".solution-link-item");
  solutionLinkItems.forEach(item => {
    const text = item.querySelector(".solution-link-text").value;
    const link = item.querySelector(".solution-link-url").value;
    
    solutionLinks.push({
      text: text,
      link: link
    });
  });
  
  // 收集联系信息
  const contactInfo = {
    address: document.getElementById("footer-address").value,
    phone: document.getElementById("footer-phone").value,
    email: document.getElementById("footer-email").value,
    hours: document.getElementById("footer-hours").value
  };
  
  // 收集版权信息
  const copyright = document.getElementById("footer-copyright").value;
  const icp = document.getElementById("footer-icp").value;
  
  // 构建完整数据结构
  const footerData = {
    company_info: companyInfo,
    social_links: socialLinks,
    quick_links: quickLinks,
    solution_links: solutionLinks,
    contact_info: contactInfo,
    copyright: copyright,
    icp: icp
  };
  
  // 更新全局数据
  window.footerEnData = footerData;
  
  return footerData;
}

// 渲染英文导航内容
function renderEnNavigation() {
  const navigationContainer = document.getElementById("navigation-en-container");
  if (!navigationContainer) {
    console.error("未找到英文导航容器");
    return;
  }
  
  navigationContainer.innerHTML = "";
  
  // 确保window.navigationEnData有正确的结构
  if (!window.navigationEnData) {
    console.warn("导航数据为null，初始化为空对象");
    window.navigationEnData = {
      main_nav: [],
      login_buttons: []
    };
  }
  
  // 主导航部分
  navigationContainer.innerHTML += `
    <div class="card mb-3">
      <div class="card-header">主导航</div>
      <div class="card-body">
        <div id="main-nav-container">
          ${renderMainNavItems()}
        </div>
        <button id="add-main-nav-item" class="btn btn-sm btn-outline-primary mt-2">
          <i class="bi bi-plus"></i> 添加导航项
        </button>
      </div>
    </div>
  `;
  
  // 登录按钮部分
  navigationContainer.innerHTML += `
    <div class="card mb-3">
      <div class="card-header">登录按钮</div>
      <div class="card-body">
        <div id="login-buttons-container">
          ${renderLoginButtons()}
        </div>
        <button id="add-login-button" class="btn btn-sm btn-outline-primary mt-2">
          <i class="bi bi-plus"></i> 添加登录按钮
        </button>
      </div>
    </div>
  `;
  
  // 绑定添加按钮事件
  bindNavigationEvents();
}

// 渲染主导航项
function renderMainNavItems() {
  let html = "";
  
  if (Array.isArray(window.navigationEnData.main_nav) && window.navigationEnData.main_nav.length > 0) {
    window.navigationEnData.main_nav.forEach((navItem, index) => {
      let dropdownItemsHtml = "";
      
      // 如果是下拉菜单，渲染下拉项
      if (navItem.dropdown && Array.isArray(navItem.dropdown_items)) {
        navItem.dropdown_items.forEach((dropdownItem, dropdownIndex) => {
          dropdownItemsHtml += `
            <div class="input-group mb-2 dropdown-item-group" data-nav-index="${index}" data-dropdown-index="${dropdownIndex}">
              <input type="text" class="form-control dropdown-item-title" placeholder="标题" value="${dropdownItem.title || ""}" aria-label="标题">
              <input type="text" class="form-control dropdown-item-link" placeholder="链接" value="${dropdownItem.link || ""}" aria-label="链接">
              <button class="btn btn-outline-danger delete-dropdown-item" type="button">删除</button>
            </div>
          `;
        });
      }
      
      html += `
        <div class="card mb-3 nav-item-card" data-index="${index}">
          <div class="card-body">
            <div class="d-flex justify-content-between mb-3">
              <h5 class="card-title">导航项 #${index + 1}</h5>
              <button type="button" class="btn btn-sm btn-danger delete-nav-item" data-index="${index}">删除</button>
            </div>
            <div class="mb-3">
              <label class="form-label">标题</label>
              <input type="text" class="form-control nav-item-title" value="${navItem.title || ""}" data-index="${index}">
            </div>
            <div class="mb-3">
              <label class="form-label">链接</label>
              <input type="text" class="form-control nav-item-link" value="${navItem.link || ""}" data-index="${index}">
            </div>
            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input nav-item-active" id="nav-active-${index}" ${navItem.active ? 'checked' : ''} data-index="${index}">
              <label class="form-check-label" for="nav-active-${index}">活动项</label>
            </div>
            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input nav-item-dropdown" id="nav-dropdown-${index}" ${navItem.dropdown ? 'checked' : ''} data-index="${index}">
              <label class="form-check-label" for="nav-dropdown-${index}">下拉菜单</label>
            </div>
            
            <div class="dropdown-items-container" style="${navItem.dropdown ? '' : 'display: none;'}">
              <h6>下拉菜单项</h6>
              <div class="dropdown-items" data-nav-index="${index}">
                ${dropdownItemsHtml}
              </div>
              <button type="button" class="btn btn-sm btn-outline-secondary add-dropdown-item mt-2" data-index="${index}">
                <i class="bi bi-plus"></i> 添加下拉项
              </button>
            </div>
          </div>
        </div>
      `;
    });
  } else {
    html = '<div class="alert alert-info">暂无导航项，请添加。</div>';
  }
  
  return html;
}

// 渲染登录按钮
function renderLoginButtons() {
  let html = "";
  
  if (Array.isArray(window.navigationEnData.login_buttons) && window.navigationEnData.login_buttons.length > 0) {
    window.navigationEnData.login_buttons.forEach((button, index) => {
      html += `
        <div class="card mb-3 login-button-card" data-index="${index}">
          <div class="card-body">
            <div class="d-flex justify-content-between mb-3">
              <h5 class="card-title">按钮 #${index + 1}</h5>
              <button type="button" class="btn btn-sm btn-danger delete-login-button" data-index="${index}">删除</button>
            </div>
            <div class="mb-3">
              <label class="form-label">标题</label>
              <input type="text" class="form-control login-button-title" value="${button.title || ""}" data-index="${index}">
            </div>
            <div class="mb-3">
              <label class="form-label">链接</label>
              <input type="text" class="form-control login-button-link" value="${button.link || ""}" data-index="${index}">
            </div>
            <div class="mb-3">
              <label class="form-label">样式</label>
              <select class="form-select login-button-style" data-index="${index}">
                <option value="primary" ${button.style === 'primary' ? 'selected' : ''}>主要</option>
                <option value="secondary" ${button.style === 'secondary' ? 'selected' : ''}>次要</option>
                <option value="success" ${button.style === 'success' ? 'selected' : ''}>成功</option>
                <option value="danger" ${button.style === 'danger' ? 'selected' : ''}>危险</option>
                <option value="warning" ${button.style === 'warning' ? 'selected' : ''}>警告</option>
                <option value="info" ${button.style === 'info' ? 'selected' : ''}>信息</option>
                <option value="light" ${button.style === 'light' ? 'selected' : ''}>浅色</option>
                <option value="dark" ${button.style === 'dark' ? 'selected' : ''}>深色</option>
                <option value="link" ${button.style === 'link' ? 'selected' : ''}>链接</option>
                <option value="outline-primary" ${button.style === 'outline-primary' ? 'selected' : ''}>主要轮廓</option>
                <option value="outline-secondary" ${button.style === 'outline-secondary' ? 'selected' : ''}>次要轮廓</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">CSS类名</label>
              <input type="text" class="form-control login-button-class" value="${button.class || ""}" data-index="${index}">
            </div>
          </div>
        </div>
      `;
    });
  } else {
    html = '<div class="alert alert-info">暂无登录按钮，请添加。</div>';
  }
  
  return html;
}

// 绑定导航管理相关事件
function bindNavigationEvents() {
  // 添加主导航项按钮事件
  const addMainNavBtn = document.getElementById("add-main-nav-item");
  if (addMainNavBtn) {
    addMainNavBtn.addEventListener("click", function() {
      // 确保main_nav数组存在
      if (!window.navigationEnData.main_nav) {
        window.navigationEnData.main_nav = [];
      }
      
      // 添加新的导航项
      window.navigationEnData.main_nav.push({
        title: "New Item",
        link: "#",
        active: false,
        dropdown: false,
        dropdown_items: []
      });
      
      // 重新渲染
      document.getElementById("main-nav-container").innerHTML = renderMainNavItems();
      bindNavigationDeleteEvents();
      bindNavigationChangeEvents();
    });
  }
  
  // 添加登录按钮事件
  const addLoginBtn = document.getElementById("add-login-button");
  if (addLoginBtn) {
    addLoginBtn.addEventListener("click", function() {
      // 确保login_buttons数组存在
      if (!window.navigationEnData.login_buttons) {
        window.navigationEnData.login_buttons = [];
      }
      
      // 添加新的登录按钮
      window.navigationEnData.login_buttons.push({
        title: "New Button",
        link: "#",
        style: "primary",
        class: "btn btn-primary"
      });
      
      // 重新渲染
      document.getElementById("login-buttons-container").innerHTML = renderLoginButtons();
      bindNavigationDeleteEvents();
    });
  }
  
  // 绑定删除事件和change事件
  bindNavigationDeleteEvents();
  bindNavigationChangeEvents();
}

// 绑定删除导航相关元素的事件
function bindNavigationDeleteEvents() {
  // 删除主导航项按钮事件
  const deleteNavItemBtns = document.querySelectorAll(".delete-nav-item");
  deleteNavItemBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      const index = parseInt(this.getAttribute("data-index"));
      
      if (window.navigationEnData && Array.isArray(window.navigationEnData.main_nav) && 
          index >= 0 && index < window.navigationEnData.main_nav.length) {
        window.navigationEnData.main_nav.splice(index, 1);
        document.getElementById("main-nav-container").innerHTML = renderMainNavItems();
        bindNavigationDeleteEvents();
        bindNavigationChangeEvents();
      }
    });
  });
  
  // 删除下拉菜单项按钮事件
  const deleteDropdownItemBtns = document.querySelectorAll(".delete-dropdown-item");
  deleteDropdownItemBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      const navIndex = parseInt(this.parentElement.getAttribute("data-nav-index"));
      const dropdownIndex = parseInt(this.parentElement.getAttribute("data-dropdown-index"));
      
      if (window.navigationEnData && 
          Array.isArray(window.navigationEnData.main_nav) && 
          navIndex >= 0 && navIndex < window.navigationEnData.main_nav.length &&
          Array.isArray(window.navigationEnData.main_nav[navIndex].dropdown_items) &&
          dropdownIndex >= 0 && dropdownIndex < window.navigationEnData.main_nav[navIndex].dropdown_items.length) {
        window.navigationEnData.main_nav[navIndex].dropdown_items.splice(dropdownIndex, 1);
        document.getElementById("main-nav-container").innerHTML = renderMainNavItems();
        bindNavigationDeleteEvents();
        bindNavigationChangeEvents();
      }
    });
  });
  
  // 删除登录按钮事件
  const deleteLoginBtnBtns = document.querySelectorAll(".delete-login-button");
  deleteLoginBtnBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      const index = parseInt(this.getAttribute("data-index"));
      
      if (window.navigationEnData && 
          Array.isArray(window.navigationEnData.login_buttons) && 
          index >= 0 && index < window.navigationEnData.login_buttons.length) {
        window.navigationEnData.login_buttons.splice(index, 1);
        document.getElementById("login-buttons-container").innerHTML = renderLoginButtons();
        bindNavigationDeleteEvents();
      }
    });
  });
}

// 绑定导航元素变化事件
function bindNavigationChangeEvents() {
  // 下拉菜单切换事件
  const dropdownCheckboxes = document.querySelectorAll(".nav-item-dropdown");
  dropdownCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", function() {
      const index = parseInt(this.getAttribute("data-index"));
      const isDropdown = this.checked;
      
      if (window.navigationEnData && 
          Array.isArray(window.navigationEnData.main_nav) && 
          index >= 0 && index < window.navigationEnData.main_nav.length) {
        window.navigationEnData.main_nav[index].dropdown = isDropdown;
        
        // 确保有dropdown_items数组
        if (isDropdown && !Array.isArray(window.navigationEnData.main_nav[index].dropdown_items)) {
          window.navigationEnData.main_nav[index].dropdown_items = [];
        }
        
        // 显示或隐藏下拉项容器
        const dropdownContainer = document.querySelector(`.nav-item-card[data-index="${index}"] .dropdown-items-container`);
        if (dropdownContainer) {
          dropdownContainer.style.display = isDropdown ? "" : "none";
        }
      }
    });
  });
  
  // 添加下拉项按钮事件
  const addDropdownItemBtns = document.querySelectorAll(".add-dropdown-item");
  addDropdownItemBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      const navIndex = parseInt(this.getAttribute("data-index"));
      
      if (window.navigationEnData && 
          Array.isArray(window.navigationEnData.main_nav) && 
          navIndex >= 0 && navIndex < window.navigationEnData.main_nav.length) {
        
        // 确保有dropdown_items数组
        if (!Array.isArray(window.navigationEnData.main_nav[navIndex].dropdown_items)) {
          window.navigationEnData.main_nav[navIndex].dropdown_items = [];
        }
        
        // 添加新的下拉项
        window.navigationEnData.main_nav[navIndex].dropdown_items.push({
          title: "New Dropdown Item",
          link: "#"
        });
        
        // 重新渲染
        document.getElementById("main-nav-container").innerHTML = renderMainNavItems();
        bindNavigationDeleteEvents();
        bindNavigationChangeEvents();
      }
    });
  });
}

// 收集导航数据
function collectNavigationData() {
  // 收集主导航数据
  const mainNav = [];
  const navItemCards = document.querySelectorAll(".nav-item-card");
  
  navItemCards.forEach(card => {
    const index = parseInt(card.getAttribute("data-index"));
    const title = card.querySelector(".nav-item-title").value;
    const link = card.querySelector(".nav-item-link").value;
    const active = card.querySelector(".nav-item-active").checked;
    const dropdown = card.querySelector(".nav-item-dropdown").checked;
    
    const navItem = {
      title: title,
      link: link,
      active: active,
      dropdown: dropdown
    };
    
    // 如果是下拉菜单，收集下拉项数据
    if (dropdown) {
      const dropdownItems = [];
      const dropdownItemGroups = card.querySelectorAll(`.dropdown-item-group[data-nav-index="${index}"]`);
      
      dropdownItemGroups.forEach(group => {
        const dropdownItemTitle = group.querySelector(".dropdown-item-title").value;
        const dropdownItemLink = group.querySelector(".dropdown-item-link").value;
        
        dropdownItems.push({
          title: dropdownItemTitle,
          link: dropdownItemLink
        });
      });
      
      navItem.dropdown_items = dropdownItems;
    } else {
      navItem.dropdown_items = [];
    }
    
    mainNav.push(navItem);
  });
  
  // 收集登录按钮数据
  const loginButtons = [];
  const loginButtonCards = document.querySelectorAll(".login-button-card");
  
  loginButtonCards.forEach(card => {
    const title = card.querySelector(".login-button-title").value;
    const link = card.querySelector(".login-button-link").value;
    const styleSelect = card.querySelector(".login-button-style");
    const style = styleSelect.options[styleSelect.selectedIndex].value;
    const className = card.querySelector(".login-button-class").value;
    
    loginButtons.push({
      title: title,
      link: link,
      style: style,
      class: className
    });
  });
  
  // 构建完整数据结构
  const navigationData = {
    main_nav: mainNav,
    login_buttons: loginButtons
  };
  
  // 更新全局数据
  window.navigationEnData = navigationData;
  
  return navigationData;
}

// 在文件末尾添加语言相关函数
// 渲染语言管理界面
function renderEnLanguage() {
  const languageContainer = document.getElementById("language-en-container");
  if (!languageContainer) {
    console.error("未找到语言管理容器");
    return;
  }
  
  languageContainer.innerHTML = "";
  
  // 加载语言数据
  loadLanguageData();
  
  // 创建标签页结构
  languageContainer.innerHTML = `
    <div class="card mt-3">
      <div class="card-body">
        <ul class="nav nav-tabs" id="languageEnTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="language-en-content-tab" data-bs-toggle="tab" data-bs-target="#language-en-content-tab-pane" type="button" role="tab">英文</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="language-zh-content-tab" data-bs-toggle="tab" data-bs-target="#language-zh-content-tab-pane" type="button" role="tab">中文</button>
          </li>
        </ul>
        <div class="tab-content" id="languageEnTabContent">
          <div class="tab-pane fade show active" id="language-en-content-tab-pane" role="tabpanel">
            <div class="mt-3">
              <div class="mb-3">
                <div id="language-en-items-container"></div>
                <button id="add-language-en-item" class="btn btn-outline-primary mt-2">
                  <i class="bi bi-plus"></i> 添加英文条目
                </button>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="language-zh-content-tab-pane" role="tabpanel">
            <div class="mt-3">
              <div class="mb-3">
                <div id="language-zh-items-container"></div>
                <button id="add-language-zh-item" class="btn btn-outline-primary mt-2">
                  <i class="bi bi-plus"></i> 添加中文条目
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 初始化标签页
  const enTab = document.getElementById("language-en-content-tab");
  const zhTab = document.getElementById("language-zh-content-tab");
  
  // 绑定标签页切换事件
  enTab.addEventListener("click", function(e) {
    document.getElementById("language-en-content-tab-pane").classList.add("show", "active");
    document.getElementById("language-zh-content-tab-pane").classList.remove("show", "active");
    this.classList.add("active");
    zhTab.classList.remove("active");
    renderEnLanguageItems();
    e.preventDefault();
    e.stopPropagation();
  });
  
  zhTab.addEventListener("click", function(e) {
    document.getElementById("language-zh-content-tab-pane").classList.add("show", "active");
    document.getElementById("language-en-content-tab-pane").classList.remove("show", "active");
    this.classList.add("active");
    enTab.classList.remove("active");
    renderZhLanguageItems();
    e.preventDefault();
    e.stopPropagation();
  });
  
  // 绑定添加按钮事件
  const addEnItemBtn = document.getElementById("add-language-en-item");
  if (addEnItemBtn) {
    addEnItemBtn.addEventListener("click", addEnLanguageItem);
  }
  
  const addZhItemBtn = document.getElementById("add-language-zh-item");
  if (addZhItemBtn) {
    addZhItemBtn.addEventListener("click", addZhLanguageItem);
  }
  
  // 初始渲染英文语言条目
  renderEnLanguageItems();
}

// 加载语言数据
async function loadLanguageData() {
  try {
    // 获取英文语言数据
    const enResponse = await fetch("../api/language_content.php?type=en");
    if (enResponse.ok) {
      languageEnData = await enResponse.json();
    } else {
      console.error("获取英文语言数据失败");
      languageEnData = {};
    }
    
    // 获取中文语言数据
    const zhResponse = await fetch("../api/language_content.php?type=zh");
    if (zhResponse.ok) {
      languageZhData = await zhResponse.json();
    } else {
      console.error("获取中文语言数据失败");
      languageZhData = {};
    }
  } catch (error) {
    console.error("加载语言数据失败:", error);
    languageEnData = {};
    languageZhData = {};
  }
}

// 渲染英文语言条目
function renderEnLanguageItems() {
  const container = document.getElementById("language-en-items-container");
  if (!container) {
    console.error("未找到英文语言条目容器");
    return;
  }
  
  container.innerHTML = "";
  
  // 确保有语言数据
  if (!languageEnData || Object.keys(languageEnData).length === 0) {
    container.innerHTML = "<div class=\"alert alert-info\">暂无英文语言数据，请添加。</div>";
    return;
  }
  
  // 构建表格显示语言条目
  let tableHtml = `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>键</th>
          <th>值</th>
          <th width="100">操作</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  // 遍历语言条目并添加到表格中
  for (const [key, value] of Object.entries(languageEnData)) {
    tableHtml += `
      <tr class="language-item" data-key="${key}">
        <td>
          <input type="text" class="form-control language-key" value="${key}" readonly>
        </td>
        <td>
          <input type="text" class="form-control language-value" value="${value}">
        </td>
        <td>
          <button class="btn btn-sm btn-danger delete-language-item" data-key="${key}">删除</button>
        </td>
      </tr>
    `;
  }
  
  tableHtml += `
      </tbody>
    </table>
  `;
  
  container.innerHTML = tableHtml;
  
  // 绑定删除事件
  bindDeleteEnLanguageItemEvents();
}

// 渲染中文语言条目
function renderZhLanguageItems() {
  const container = document.getElementById("language-zh-items-container");
  if (!container) {
    console.error("未找到中文语言条目容器");
    return;
  }
  
  container.innerHTML = "";
  
  // 确保有语言数据
  if (!languageZhData || Object.keys(languageZhData).length === 0) {
    container.innerHTML = "<div class=\"alert alert-info\">暂无中文语言数据，请添加。</div>";
    return;
  }
  
  // 构建表格显示语言条目
  let tableHtml = `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>键</th>
          <th>值</th>
          <th width="100">操作</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  // 遍历语言条目并添加到表格中
  for (const [key, value] of Object.entries(languageZhData)) {
    tableHtml += `
      <tr class="language-item" data-key="${key}">
        <td>
          <input type="text" class="form-control language-key" value="${key}" readonly>
        </td>
        <td>
          <input type="text" class="form-control language-value" value="${value}">
        </td>
        <td>
          <button class="btn btn-sm btn-danger delete-language-item" data-key="${key}">删除</button>
        </td>
      </tr>
    `;
  }
  
  tableHtml += `
      </tbody>
    </table>
  `;
  
  container.innerHTML = tableHtml;
  
  // 绑定删除事件
  bindDeleteZhLanguageItemEvents();
}

// 添加英文语言条目
function addEnLanguageItem() {
  // 弹出模态框让用户输入键和值
  const key = prompt("请输入语言条目的键（key）:");
  if (!key) return;
  
  const value = prompt("请输入语言条目的值（value）:");
  if (value === null) return;
  
  // 检查键是否已存在
  if (languageEnData[key]) {
    if (!confirm(`键 "${key}" 已存在，是否覆盖?`)) {
      return;
    }
  }
  
  // 添加到语言数据中
  languageEnData[key] = value;
  
  // 重新渲染
  renderEnLanguageItems();
}

// 添加中文语言条目
function addZhLanguageItem() {
  // 弹出模态框让用户输入键和值
  const key = prompt("请输入语言条目的键（key）:");
  if (!key) return;
  
  const value = prompt("请输入语言条目的值（value）:");
  if (value === null) return;
  
  // 检查键是否已存在
  if (languageZhData[key]) {
    if (!confirm(`键 "${key}" 已存在，是否覆盖?`)) {
      return;
    }
  }
  
  // 添加到语言数据中
  languageZhData[key] = value;
  
  // 重新渲染
  renderZhLanguageItems();
}

// 绑定删除英文语言条目的事件
function bindDeleteEnLanguageItemEvents() {
  const deleteButtons = document.querySelectorAll("#language-en-items-container .delete-language-item");
  deleteButtons.forEach(button => {
    button.addEventListener("click", function() {
      const key = this.getAttribute("data-key");
      if (confirm(`确定要删除键为 "${key}" 的条目吗?`)) {
        delete languageEnData[key];
        renderEnLanguageItems();
      }
    });
  });
}

// 绑定删除中文语言条目的事件
function bindDeleteZhLanguageItemEvents() {
  const deleteButtons = document.querySelectorAll("#language-zh-items-container .delete-language-item");
  deleteButtons.forEach(button => {
    button.addEventListener("click", function() {
      const key = this.getAttribute("data-key");
      if (confirm(`确定要删除键为 "${key}" 的条目吗?`)) {
        delete languageZhData[key];
        renderZhLanguageItems();
      }
    });
  });
}

// 收集英文语言数据
function collectEnLanguageData() {
  const languageData = {};
  const languageItems = document.querySelectorAll("#language-en-items-container .language-item");
  
  languageItems.forEach(item => {
    const key = item.querySelector(".language-key").value;
    const value = item.querySelector(".language-value").value;
    languageData[key] = value;
  });
  
  return languageData;
}

// 收集中文语言数据
function collectZhLanguageData() {
  const languageData = {};
  const languageItems = document.querySelectorAll("#language-zh-items-container .language-item");
  
  languageItems.forEach(item => {
    const key = item.querySelector(".language-key").value;
    const value = item.querySelector(".language-value").value;
    languageData[key] = value;
  });
  
  return languageData;
}