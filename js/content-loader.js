/**
 * 内容加载器 - 用于从JSON文件加载内容并动态渲染到页面
 */

// 获取当前语言
function getCurrentLanguage() {
    // 从HTML的lang属性获取当前语言
    const htmlLang = document.documentElement.lang;
    return htmlLang.startsWith('en') ? 'en' : 'zh';
}

// 根据当前语言加载JSON数据
async function loadJsonData(dataFile) {
    const language = getCurrentLanguage();
    const langPrefix = language === 'zh' ? '' : `_${language}`;
    const filePath = `data/${dataFile}${langPrefix}.json`;
    
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            // 如果找不到特定语言的文件，尝试加载默认文件
            if (language !== 'zh') {
                const defaultResponse = await fetch(`data/${dataFile}.json`);
                if (!defaultResponse.ok) {
                    throw new Error(`HTTP error! Status: ${defaultResponse.status}`);
                }
                return await defaultResponse.json();
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`加载数据失败: ${dataFile}`, error);
        return null;
    }
}

// 加载公告数据
async function loadAnnouncementData() {
    return await loadJsonData('announcement');
}

// 加载云产品数据
async function loadCloudProductsData() {
    return await loadJsonData('cloud_products');
}

// 加载特性数据
async function loadFeaturesData() {
    return await loadJsonData('features');
}

// 加载案例数据
async function loadCaseStudiesData() {
    return await loadJsonData('case_studies');
}

// 加载评价数据
async function loadTestimonialsData() {
    return await loadJsonData('testimonials');
}

// 加载解决方案数据
async function loadSolutionsData() {
    return await loadJsonData('solutions');
}

// 加载轮播图数据
async function loadBannersData() {
    return await loadJsonData('banners');
}

// 加载页脚数据
async function loadFooterData() {
    return await loadJsonData('footer');
}

// 加载导航栏数据
async function loadNavigationData() {
    return await loadJsonData('navigation');
}

// 加载战略合作伙伴数据
async function loadStrategicPartnersData() {
    return await loadJsonData('strategic_partners');
}

// 加载技术合作伙伴数据
async function loadTechPartnersData() {
    return await loadJsonData('tech_partners');
}

// 加载合作案例数据
async function loadPartnerCasesData() {
    return await loadJsonData('partner_cases');
}

// 加载团队成员数据
async function loadTeamMembersData() {
    return await loadJsonData('team_members');
}

// 加载公司发展历程数据
async function loadCompanyHistoryData() {
    return await loadJsonData('company_history');
}

// 渲染公告
function renderAnnouncement(data) {
    if (!data) return;
    
    const marqueeContent = document.querySelector('.marquee-content span');
    if (marqueeContent) {
        // 确保数据渲染前已经清空内容
        marqueeContent.innerHTML = '';
        
        // 防止内容溢出，确保正确显示
        setTimeout(() => {
            // 如果公告内容是数组，将其连接成字符串
            if (Array.isArray(data.text)) {
                marqueeContent.innerHTML = data.text.join(' &nbsp;&nbsp;|&nbsp;&nbsp; ');
            } else {
                marqueeContent.innerHTML = data.text;
            }
            
            // 重置动画以确保正确滚动
            marqueeContent.style.animation = 'none';
            marqueeContent.offsetHeight; // 触发重绘
            
            // 获取公告栏容器宽度
            const containerWidth = document.querySelector('.announcement-text-wrapper').offsetWidth;
            const textWidth = marqueeContent.offsetWidth;
            
            // 根据内容长度决定是否需要滚动效果
            if (textWidth > containerWidth) {
                // 如果内容超出容器宽度，添加滚动动画
                marqueeContent.style.animation = 'marquee 20s linear infinite';
            } else {
                // 如果内容未超出容器宽度，不需要滚动
                marqueeContent.style.animation = 'none';
                marqueeContent.style.transform = 'translateX(0)';
            }
        }, 100);
    }

    // 如果有更多公告链接
    const moreButton = document.querySelector('.announcement-more');
    if (moreButton && data.more_link) {
        moreButton.addEventListener('click', () => {
            window.location.href = data.more_link;
        });
    } else if (moreButton && !data.more_link) {
        // 如果没有更多链接，隐藏更多按钮
        moreButton.style.display = 'none';
    }
}

// 渲染云产品
function renderCloudProducts(data) {
    if (!data) return;
    
    const productsSection = document.querySelector('.products-section');
    if (!productsSection) return;
    
    const container = productsSection.querySelector('.container');
    if (!container) return;
    
    // 清空现有内容并添加标题
    container.innerHTML = `<h2 class="text-center mb-5 fade-in text-white">${data.title}</h2><div class="row g-4" id="products-container"></div>`;
    
    const productsContainer = container.querySelector('#products-container');
    
    // 添加产品卡片
    data.products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4';
        productCard.style.animationDelay = `${index * 0.1}s`;
        productCard.innerHTML = `
            <div class="card h-100 shadow-sm fade-in">
                <div class="card-body d-flex flex-column">
                    <div class="icon-wrapper mb-3">
                        <i class="${product.icon} fs-1 text-primary"></i>
                    </div>
                    <h3 class="card-title text-white">${product.title}</h3>
                    <p class="card-text flex-grow-1 text-white-50">${product.description}</p>
                    <div class="text-center mt-4">
                        <a href="${product.link}" class="btn btn-outline-primary w-100">${getLanguageText('view_details')}</a>
                    </div>
                </div>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
}

// 渲染为什么选择我们
function renderWhyChooseUs(data) {
    if (!data) return;
    
    const whyChooseUsSection = document.querySelector('.why-choose-us');
    if (!whyChooseUsSection) return;
    
    const container = whyChooseUsSection.querySelector('.container');
    if (!container) return;
    
    // 清空现有内容并添加标题
    container.innerHTML = `<h2 class="text-center mb-5 fade-in text-white">${data.title}</h2><div class="row g-4" id="features-container"></div>`;
    
    const featuresContainer = container.querySelector('#features-container');
    
    // 添加特性卡片
    data.features.forEach((feature, index) => {
        const featureCard = document.createElement('div');
        featureCard.className = 'col-md-4';
        featureCard.style.animationDelay = `${index * 0.1}s`;
        featureCard.innerHTML = `
            <div class="feature-card text-center p-4 h-100 d-flex flex-column fade-in">
                <div class="icon-circle mb-3">
                    <i class="${feature.icon} text-primary"></i>
                </div>
                <h3 class="text-white">${feature.title}</h3>
                <p class="flex-grow-1 text-white-50">${feature.description}</p>
                <div class="text-center mt-4">
                    <a href="${feature.link || '#'}" class="btn btn-outline-primary w-100">${getLanguageText('learn_more_btn')}</a>
                </div>
            </div>
        `;
        featuresContainer.appendChild(featureCard);
    });
}

// 渲染成功案例
function renderCaseStudies(data) {
    if (!data) return;
    
    const caseStudiesSection = document.querySelector('.case-studies');
    if (!caseStudiesSection) return;
    
    const container = caseStudiesSection.querySelector('.container');
    if (!container) return;
    
    // 清空现有内容并添加标题
    container.innerHTML = `<h2 class="text-center mb-5 fade-in text-white">${data.title}</h2><div class="row g-4" id="cases-container"></div>`;
    
    const casesContainer = container.querySelector('#cases-container');
    
    // 添加案例卡片
    data.cases.forEach((caseItem, index) => {
        const caseCard = document.createElement('div');
        caseCard.className = 'col-md-6 col-lg-3';
        caseCard.style.animationDelay = `${index * 0.1}s`;
        caseCard.innerHTML = `
            <div class="card h-100 shadow-sm fade-in">
                <img src="${caseItem.image}" class="card-img-top" alt="${caseItem.title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-white">${caseItem.title}</h5>
                    <p class="card-text flex-grow-1 text-white-50">${caseItem.description}</p>
                    <div class="text-center mt-4">
                        <a href="${caseItem.link || '#'}" class="btn btn-outline-primary w-100">${getLanguageText('view_details')}</a>
                    </div>
                </div>
            </div>
        `;
        casesContainer.appendChild(caseCard);
    });
}

// 渲染客户评价
function renderTestimonials(data) {
    if (!data) return;
    
    const testimonialsSection = document.querySelector('.testimonials');
    if (!testimonialsSection) return;
    
    const container = testimonialsSection.querySelector('.container');
    if (!container) return;
    
    // 清空现有内容并添加标题和轮播结构
    container.innerHTML = `
        <h2 class="text-center mb-4 fade-in text-white">${data.title}</h2>
        <div class="row">
            <div class="col-lg-8 mx-auto">
                <div id="testimonialCarousel" class="carousel slide testimonial-carousel fade-in" data-bs-ride="carousel">
                    <div class="carousel-inner" id="testimonials-container"></div>
                    <div class="carousel-indicators">
                        ${data.reviews.map((_, index) => `
                            <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="${index}" 
                                ${index === 0 ? 'class="active" aria-current="true"' : ''} 
                                aria-label="Slide ${index + 1}"></button>
                        `).join('')}
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const testimonialsContainer = container.querySelector('#testimonials-container');
    
    // 添加评价轮播项
    data.reviews.forEach((review, index) => {
        const testimonialItem = document.createElement('div');
        testimonialItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        testimonialItem.innerHTML = `
            <div class="testimonial-item text-center p-4">
                <div>
                    <img src="${review.avatar}" alt="客户头像" class="rounded-circle" style="width: 80px; height: 80px; object-fit: cover; border: 3px solid #3f80ea; box-shadow: 0 0 15px rgba(0,0,0,0.2);">
                </div>
                <div class="testimonial-content">
                    <h5 class="text-white mb-2">${review.name}</h5>
                    <p class="mb-0 text-white-50">"${review.content}"</p>
                </div>
            </div>
        `;
        testimonialsContainer.appendChild(testimonialItem);
    });
}

// 渲染解决方案
function renderSolutions(data) {
    if (!data) return;
    
    const solutionsSection = document.querySelector('.pricing-section');
    if (!solutionsSection) return;
    
    const container = solutionsSection.querySelector('.container');
    if (!container) return;
    
    // 清空现有内容并添加标题
    container.innerHTML = `<div class="solutions-wrapper"><h2 class="text-center mb-4 fade-in text-white">${data.title}</h2><div class="row g-4" id="solutions-container"></div></div>`;
    
    const solutionsContainer = container.querySelector('#solutions-container');
    
    // 添加解决方案卡片
    data.plans.forEach((plan, index) => {
        const solutionCard = document.createElement('div');
        solutionCard.className = 'col-md-4';
        solutionCard.style.animationDelay = `${index * 0.1}s`;
        solutionCard.innerHTML = `
            <div class="card h-100 ${plan.isPopular ? 'shadow border border-primary' : 'shadow-sm'} fade-in">
                <div class="card-header text-center bg-primary text-white py-3">
                    <div class="d-flex align-items-center justify-content-center">
                        <h3 class="mb-0">${plan.title}</h3>
                        ${plan.isPopular ? '<span class="badge bg-warning ms-2">' + getLanguageText('popular_tag') + '</span>' : ''}
                    </div>
                </div>
                <div class="card-body d-flex flex-column">
                    <div class="price-tag text-center my-3">
                        <span class="h1 text-white">${plan.subtitle}</span>
                    </div>
                    <ul class="list-unstyled mt-4 flex-grow-1">
                        ${plan.features.map(feature => 
                            `<li class="mb-2 text-white-50"><i class="bi bi-check-circle-fill text-success me-2"></i>${feature}</li>`
                        ).join('')}
                    </ul>
                    <div class="text-center mt-4">
                        <a href="${plan.link}" class="btn ${plan.isPopular ? 'btn-primary' : 'btn-outline-primary'} w-100">${getLanguageText('learn_more')}</a>
                    </div>
                </div>
            </div>
        `;
        
        solutionsContainer.appendChild(solutionCard);
    });
}

// 渲染轮播图
function renderBanners(data) {
    console.log(getLanguageText('rendering_carousel'), data);
    
    if (!data || !data.banners || !Array.isArray(data.banners) || data.banners.length === 0) {
        console.error(getLanguageText('invalid_carousel_data'), data);
        return;
    }
    
    const carousel = document.getElementById('mainCarousel');
    if (!carousel) {
        console.error(getLanguageText('carousel_container_not_found'));
        return;
    }
    
    const indicators = carousel.querySelector('.carousel-indicators');
    const inner = carousel.querySelector('.carousel-inner');
    
    if (!indicators || !inner) {
        console.error(getLanguageText('carousel_indicators_not_found'));
        return;
    }
    
    // 清空现有内容
    indicators.innerHTML = '';
    inner.innerHTML = '';
    
    // 添加轮播图指示器和内容
    data.banners.forEach((banner, index) => {
        if (!banner.image) {
            console.warn(getLanguageText('carousel_missing_image'), banner);
            return;
        }
        
        // 添加指示器
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.setAttribute('data-bs-target', '#mainCarousel');
        indicator.setAttribute('data-bs-slide-to', index);
        if (index === 0) {
            indicator.classList.add('active');
        }
        indicators.appendChild(indicator);
        
        // 添加轮播图内容
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        
        // 使用响应式图片
        const isMobile = window.innerWidth <= 768;
        const imageSrc = isMobile && banner.mobile_image ? banner.mobile_image : banner.image;
        
        // 预加载图片以确保尺寸一致性
        const img = new Image();
        img.onload = function() {
            // 图片加载完成后的处理
            console.log(`${getLanguageText('carousel_load_complete')} #${index+1}: ${img.width}x${img.height}`);
        };
        img.onerror = function() {
            console.error(`${getLanguageText('carousel_load_failed')} #${index+1}: ${imageSrc}`);
        };
        img.src = imageSrc;
        
        // 构建图片HTML，添加尺寸属性保持一致性
        const imageHTML = `<img src="${imageSrc}" class="d-block w-100" alt="${banner.title || getLanguageText('carousel_image')}" loading="${index === 0 ? 'eager' : 'lazy'}">`;
        
        const captionHTML = `
            <div class="carousel-caption">
                <h2>${banner.title || ''}</h2>
                <p>${banner.description || ''}</p>
                ${banner.button1_text ? `
                <div class="mt-3">
                    <a href="${banner.button1_link || '#'}" class="btn btn-primary me-2">${banner.button1_text}</a>
                    ${banner.button2_text ? `<a href="${banner.button2_link || '#'}" class="btn btn-outline-light">${banner.button2_text}</a>` : ''}
                </div>` : ''}
            </div>
        `;
        
        item.innerHTML = imageHTML + captionHTML;
        inner.appendChild(item);
    });
    
    // 确保轮播图初始化
    if (typeof bootstrap !== 'undefined') {
        try {
            const carouselInstance = new bootstrap.Carousel(carousel, {
                interval: 5000,
                ride: 'carousel',
                wrap: true
            });
            
            // 确保控制按钮背景透明
            const prevButton = carousel.querySelector('.carousel-control-prev');
            const nextButton = carousel.querySelector('.carousel-control-next');
            if (prevButton) prevButton.style.background = 'transparent';
            if (nextButton) nextButton.style.background = 'transparent';
            
            // 根据屏幕大小应用不同的处理逻辑
            if (window.innerWidth <= 991.98) {
                // 移动端和平板处理逻辑
                carousel.addEventListener('slide.bs.carousel', function() {
                    // 确保容器高度一致
                    const activeHeight = inner.querySelector('.active').offsetHeight;
                    inner.style.height = `${activeHeight}px`;
                });
                
                const carouselItems = inner.querySelectorAll('.carousel-item');
                carouselItems.forEach(item => {
                    const img = item.querySelector('img');
                    if (img) {
                        img.style.height = '100%';
                        img.style.width = '100%';
                        img.style.objectFit = 'cover';
                    }
                });
            } else {
                // 桌面端处理逻辑
                // 重置可能被设置的内联样式
                inner.style.height = '';
                const carouselItems = inner.querySelectorAll('.carousel-item');
                carouselItems.forEach(item => {
                    const img = item.querySelector('img');
                    if (img) {
                        // 确保图片填充整个轮播图区域
                        img.style.height = '100%';
                        img.style.width = '100%';
                        img.style.objectFit = 'cover';
                    }
                });
            }
            
        } catch (e) {
            console.error(getLanguageText('carousel_init_failed'), e);
        }
    }
}

// 渲染页脚
function renderFooter(data) {
    if (!data) return;
    
    // 更新公司信息
    const companyInfo = document.querySelector('footer .col-lg-4 p');
    if (companyInfo) {
        companyInfo.textContent = data.company_info;
    }
    
    // 更新社交媒体链接
    const socialIcons = document.querySelector('footer .social-icons');
    if (socialIcons && data.social_links) {
        socialIcons.innerHTML = '';
        data.social_links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.link;
            a.className = 'text-white me-3';
            a.innerHTML = `<i class="${link.icon}"></i>`;
            socialIcons.appendChild(a);
        });
    }
    
    // 更新快速链接
    const quickLinks = document.querySelector('#quick-links-section ul');
    if (quickLinks && data.quick_links) {
        quickLinks.innerHTML = '';
        data.quick_links.forEach(link => {
            const li = document.createElement('li');
            li.className = 'mb-2';
            li.innerHTML = `<a href="${link.link}" class="text-white text-decoration-none">${link.text}</a>`;
            quickLinks.appendChild(li);
        });
    }
    
    // 更新解决方案链接
    const solutionLinks = document.querySelector('#solution-links-section ul');
    if (solutionLinks && data.solution_links) {
        solutionLinks.innerHTML = '';
        data.solution_links.forEach(link => {
            const li = document.createElement('li');
            li.className = 'mb-2';
            li.innerHTML = `<a href="${link.link}" class="text-white text-decoration-none">${link.text}</a>`;
            solutionLinks.appendChild(li);
        });
    }
    
    // 更新联系信息
    if (data.contact_info) {
        const contactInfo = document.querySelector('footer .col-lg-4:nth-of-type(4) ul');
        if (contactInfo) {
            contactInfo.innerHTML = `
                <li class="mb-2"><i class="bi bi-geo-alt me-2"></i>${data.contact_info.address}</li>
                <li class="mb-2"><i class="bi bi-telephone me-2"></i>${data.contact_info.phone}</li>
                <li class="mb-2"><i class="bi bi-envelope me-2"></i>${data.contact_info.email}</li>
                <li class="mb-2"><i class="bi bi-clock me-2"></i>${data.contact_info.hours}</li>
            `;
        }
    }
    
    // 更新版权信息
    const copyright = document.querySelector('footer .col-md-6:nth-of-type(1) p');
    if (copyright) {
        copyright.textContent = data.copyright;
    }
    
    // 更新ICP备案信息
    const icp = document.querySelector('footer .col-md-6:nth-of-type(2) p');
    if (icp) {
        icp.textContent = data.icp;
    }
}

// 渲染战略合作伙伴
function renderStrategicPartners(data) {
    if (!data) return;
    
    const strategicPartnersSection = document.querySelector('.strategic-partners-section');
    if (!strategicPartnersSection) return;
    
    const container = strategicPartnersSection.querySelector('.container');
    if (!container) return;
    
    // 清空现有内容并添加标题
    container.innerHTML = `<h2 class="text-center mb-5 text-white">${data.title}</h2><div class="row g-4 justify-content-center" id="strategic-partners-container"></div>`;
    
    const partnersContainer = container.querySelector('#strategic-partners-container');
    
    // 添加战略合作伙伴卡片
    data.partners.forEach(partner => {
        const partnerCard = document.createElement('div');
        partnerCard.className = 'col-lg-3 col-md-4 col-6';
        
        // 判断是否有logo
        const partnerLogo = partner.logo && partner.logo.trim() !== '' ? 
            `<img src="${partner.logo}" alt="${partner.name}" class="img-fluid mb-3" style="max-height: 80px;">` : 
            `<i class="${partner.icon} fs-1 text-primary"></i>`;
        
        partnerCard.innerHTML = `
            <div class="feature-card text-center p-4 h-100 shadow-sm border">
                <div class="logo-container d-flex justify-content-center align-items-center mb-3" style="height: 80px;">
                    ${partnerLogo}
                </div>
                <h5 class="mt-3 text-white">${partner.name}</h5>
                <p class="text-white-50 small">${partner.description || ''}</p>
            </div>
        `;
        partnersContainer.appendChild(partnerCard);
    });
}

// 渲染技术合作伙伴
function renderTechPartners(data) {
    if (!data) return;
    
    const techPartnersSection = document.querySelector('.tech-partners-section');
    if (!techPartnersSection) return;
    
    const container = techPartnersSection.querySelector('.container');
    if (!container) return;
    
    // 清空现有内容并添加标题
    container.innerHTML = `<h2 class="text-center mb-5 text-white">${data.title}</h2><div class="row g-4 justify-content-center" id="tech-partners-container"></div>`;
    
    const partnersContainer = container.querySelector('#tech-partners-container');
    
    // 添加技术合作伙伴卡片
    data.partners.forEach(partner => {
        const partnerCard = document.createElement('div');
        partnerCard.className = 'col-lg-2 col-md-3 col-6';
        
        // 判断是否有logo
        const partnerContent = partner.logo && partner.logo.trim() !== '' ? 
            `<img src="${partner.logo}" alt="${partner.name}" class="img-fluid" style="max-height: 60px;">` : 
            `<i class="${partner.icon} fs-1 text-primary"></i>`;
        
        partnerCard.innerHTML = `
            <div class="feature-card text-center p-3 h-100 shadow-sm border">
                <div class="logo-container d-flex justify-content-center align-items-center" style="height: 60px;">
                    ${partnerContent}
                </div>
                <p class="mt-3 mb-0 fw-medium text-white">${partner.name}</p>
            </div>
        `;
        partnersContainer.appendChild(partnerCard);
    });
}

// 渲染合作案例
function renderPartnerCases(data) {
    if (!data) return;
    
    const caseStudiesSection = document.querySelector('.case-studies-section');
    if (!caseStudiesSection) return;
    
    const container = caseStudiesSection.querySelector('.container');
    if (!container) return;
    
    // 清空现有内容并添加标题
    container.innerHTML = `<h2 class="text-center mb-5 text-white">${data.title}</h2><div class="row g-4" id="partner-cases-container"></div>`;
    
    const casesContainer = container.querySelector('#partner-cases-container');
    
    // 添加案例卡片
    data.cases.forEach(caseItem => {
        const caseCard = document.createElement('div');
        caseCard.className = 'col-lg-4 col-md-6';
        
        // 构建合作伙伴HTML
        let partnersHTML = '';
        if (caseItem.partners) {
            // 多个合作伙伴
            caseItem.partners.forEach(partner => {
                // 判断是否有logo
                if (partner.logo && partner.logo.trim() !== '') {
                    partnersHTML += `
                        <div class="d-flex align-items-center ${partnersHTML ? 'ms-3' : ''}">
                            <div class="logo-container me-2" style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                                <img src="${partner.logo}" alt="${partner.name}" style="max-height: 24px; max-width: 24px;">
                            </div>
                            <span class="text-white">${partner.name}</span>
                        </div>
                    `;
                } else {
                    partnersHTML += `
                        <div class="d-flex align-items-center ${partnersHTML ? 'ms-3' : ''}">
                            <div class="logo-container me-2" style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                                <i class="${partner.icon} text-primary"></i>
                            </div>
                            <span class="text-white">${partner.name}</span>
                        </div>
                    `;
                }
            });
        } else if (caseItem.partner_name) {
            // 单个合作伙伴
            if (caseItem.partner_logo && caseItem.partner_logo.trim() !== '') {
                partnersHTML = `
                    <div class="d-flex align-items-center">
                        <div class="logo-container me-2" style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                            <img src="${caseItem.partner_logo}" alt="${caseItem.partner_name}" style="max-height: 24px; max-width: 24px;">
                        </div>
                        <span class="text-white">${caseItem.partner_name}</span>
                    </div>
                `;
            } else {
                partnersHTML = `
                    <div class="d-flex align-items-center">
                        <div class="logo-container me-2" style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                            <i class="${caseItem.partner_icon} text-primary"></i>
                        </div>
                        <span class="text-white">${caseItem.partner_name}</span>
                    </div>
                `;
            }
        }
        
        caseCard.innerHTML = `
            <div class="case-card h-100 shadow-sm">
                <img src="${caseItem.image}" alt="${caseItem.title}" class="card-img-top">
                <div class="card-body">
                    <h4 class="card-title text-white">${caseItem.title}</h4>
                    <p class="card-text text-white-50">${caseItem.description}</p>
                    <div class="d-flex align-items-center mt-3">
                        ${partnersHTML}
                    </div>
                </div>
            </div>
        `;
        casesContainer.appendChild(caseCard);
    });
}

// 渲染团队成员
function renderTeamMembers(data) {
    if (!data) return;
    
    const teamSection = document.querySelector('.team-section');
    if (!teamSection) return;
    
    const container = teamSection.querySelector('.container');
    if (!container) return;
    
    // 清空现有内容并添加标题和描述
    container.innerHTML = `
        <h2 class="text-center mb-3 text-white">${data.title}</h2>
        <p class="text-center mb-5 text-white-50">${data.description}</p>
        <div class="row g-4" id="team-container"></div>
    `;
    
    const teamContainer = container.querySelector('#team-container');
    
    // 获取社交媒体图标的函数
    function getSocialIcon(type) {
        const iconMap = {
            'QQ': 'bi-chat-fill',
            'WeChat': 'bi-wechat',
            'LinkedIn': 'bi-linkedin',
            'GitHub': 'bi-github',
            'Weibo': 'bi-sina-weibo'
        };
        return iconMap[type] || 'bi-person';
    }
    
    // 添加团队成员卡片
    data.members.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'col-lg-3 col-md-6';
        memberCard.innerHTML = `
            <div class="team-card text-center h-100">
                <div class="team-img-wrapper mb-3">
                    <img src="${member.avatar}" alt="${member.name}" class="img-fluid rounded-circle">
                </div>
                <h4 class="text-white">${member.name}</h4>
                <p class="text-white-50">${member.position}</p>
                <p class="text-white-50">${member.description}</p>
                <div class="social-icons mt-3">
                    <a href="${member.social_media}" class="text-primary me-2"><i class="${getSocialIcon(member.social_type)}"></i> ${member.social_type}</a>
                    <a href="${member.email}" class="text-primary"><i class="bi bi-envelope"></i> Email</a>
                </div>
            </div>
        `;
        teamContainer.appendChild(memberCard);
    });
}

// 渲染公司发展历程
function renderCompanyHistory(data) {
    if (!data) return;
    
    const historySection = document.querySelector('.history-section');
    if (!historySection) return;
    
    const container = historySection.querySelector('#history-container');
    if (!container) return;
    
    // 清空现有内容
    container.innerHTML = '';
    
    // 添加里程碑卡片
    data.milestones.forEach((milestone, index) => {
        const historyCard = document.createElement('div');
        historyCard.className = 'history-card';
        historyCard.setAttribute('data-aos', 'fade-up');
        historyCard.setAttribute('data-aos-delay', `${index * 100}`);
        
        historyCard.innerHTML = `
            <div class="history-card-inner">
                <div class="year-badge">
                    <span class="year">${milestone.year}</span>
                    <span class="label">${milestone.label}</span>
                </div>
                <div class="history-content">
                    <h4>${milestone.title}</h4>
                    <p>${milestone.content}</p>
                </div>
            </div>
        `;
        
        container.appendChild(historyCard);
    });
}

// 渲染导航栏
function renderNavigation(data) {
    if (!data) return;
    
    // 获取导航容器
    const navbarNav = document.querySelector('#navbarNav');
    if (!navbarNav) return;
    
    // 获取主导航和登录按钮容器
    const mainNav = navbarNav.querySelector('.navbar-nav');
    const loginButtons = navbarNav.querySelector('.d-flex');
    
    if (!mainNav || !loginButtons) return;
    
    // 清空现有内容
    mainNav.innerHTML = '';
    loginButtons.innerHTML = '';
    
    // 渲染主导航菜单
    data.main_nav.forEach(item => {
        const navItem = document.createElement('li');
        navItem.className = 'nav-item';
        
        if (item.dropdown && item.dropdown_items && item.dropdown_items.length > 0) {
            // 下拉菜单
            navItem.classList.add('dropdown');
            navItem.innerHTML = `
                <a class="nav-link dropdown-toggle ${item.active ? 'active' : ''}" href="${item.link}" role="button" data-bs-toggle="dropdown">
                    ${item.title}
                </a>
                <ul class="dropdown-menu">
                    ${item.dropdown_items.map(subItem => 
                        `<li><a class="dropdown-item" href="${subItem.link}">${subItem.title}</a></li>`
                    ).join('')}
                </ul>
            `;
        } else {
            // 普通菜单项
            navItem.innerHTML = `<a class="nav-link ${item.active ? 'active' : ''}" href="${item.link}">${item.title}</a>`;
        }
        
        mainNav.appendChild(navItem);
    });
    
    // 渲染登录按钮
    data.login_buttons.forEach((button, index) => {
        const btnLink = document.createElement('a');
        btnLink.href = button.link;
        
        // 确保按钮有正确的样式类
        if (button.class) {
            btnLink.className = button.class;
        } else if (button.style) {
            // 如果有style属性但没有class属性，根据style生成class
            btnLink.className = 'btn ' + (button.style.includes('outline') ? 
                           'btn-' + button.style : 
                           'btn-' + button.style);
        } else {
            // 默认样式
            btnLink.className = 'btn btn-primary';
        }
        
        // 为除最后一个按钮外的所有按钮添加右侧外边距
        if (index < data.login_buttons.length - 1) {
            btnLink.classList.add('me-2');
        }
        
        btnLink.textContent = button.title || button.text || '';
        loginButtons.appendChild(btnLink);
    });
}

// 页面加载完成后初始化内容
document.addEventListener('DOMContentLoaded', initContent);

// 获取当前语言的文本
function getLanguageText(key) {
    // 从HTML页面获取语言变量，如果不存在则返回键名
    if (window.languageStrings && window.languageStrings[key]) {
        return window.languageStrings[key];
    }
    return key;
}

// 初始化函数 - 加载所有内容
async function initContent() {
    // 加载各部分数据
    const navigationData = await loadNavigationData();
    const announcementData = await loadAnnouncementData();
    const bannersData = await loadBannersData();
    const footerData = await loadFooterData();
    const cloudProductsData = await loadCloudProductsData();
    const featuresData = await loadFeaturesData();
    const caseStudiesData = await loadCaseStudiesData();
    const testimonialsData = await loadTestimonialsData();
    const solutionsData = await loadSolutionsData();
    const strategicPartnersData = await loadStrategicPartnersData();
    const techPartnersData = await loadTechPartnersData();
    const partnerCasesData = await loadPartnerCasesData();
    const teamMembersData = await loadTeamMembersData();
    
    // 渲染各部分内容
    renderNavigation(navigationData);
    renderAnnouncement(announcementData);
    renderBanners(bannersData);
    renderFooter(footerData);
    renderCloudProducts(cloudProductsData);
    renderWhyChooseUs(featuresData);
    renderCaseStudies(caseStudiesData);
    renderTestimonials(testimonialsData);
    renderSolutions(solutionsData);
    
    // 渲染合作伙伴相关内容
    renderStrategicPartners(strategicPartnersData);
    renderTechPartners(techPartnersData);
    renderPartnerCases(partnerCasesData);
    
    // 渲染团队成员
    renderTeamMembers(teamMembersData);
    
    // 加载公司发展历程数据
    const historyData = await loadCompanyHistoryData();
    if (historyData) {
        renderCompanyHistory(historyData);
    }
    
    // 初始化WOW.js和AOS
    if (typeof WOW !== 'undefined') {
        new WOW().init();
    }
    
    if (typeof AOS !== 'undefined') {
        AOS.init();
    }
}