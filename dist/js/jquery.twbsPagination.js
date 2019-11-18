!function(t,s,e,i){"use strict";var a=t.fn.twbsPagination,n=function(s,e){if(this.$element=t(s),this.options=t.extend({},t.fn.twbsPagination.defaults,e),this.options.startPage<1||this.options.startPage>this.options.totalPages)throw new Error("Start page option is incorrect");if(this.options.totalPages=parseInt(this.options.totalPages),isNaN(this.options.totalPages))throw new Error("Total pages option is not correct!");if(this.options.visiblePages=parseInt(this.options.visiblePages),isNaN(this.options.visiblePages))throw new Error("Visible pages option is not correct!");if(this.options.beforePageClick instanceof Function&&this.$element.first().on("beforePage",this.options.beforePageClick),this.options.onPageClick instanceof Function&&this.$element.first().on("page",this.options.onPageClick),this.options.hideOnlyOnePage&&1==this.options.totalPages)return this.options.initiateStartPageClick&&this.$element.trigger("page",1),this;if(this.options.href&&(this.options.startPage=this.getPageFromQueryString(),this.options.startPage||(this.options.startPage=1)),"UL"===("function"==typeof this.$element.prop?this.$element.prop("tagName"):this.$element.attr("tagName")))this.$listContainer=this.$element;else{var i=this.$element,a=t([]);i.each(function(s){var e=t("<ul></ul>");t(this).append(e),a.push(e[0])}),this.$listContainer=a,this.$element=a}return this.$listContainer.addClass(this.options.paginationClass),this.options.initiateStartPageClick?this.show(this.options.startPage):(this.currentPage=this.options.startPage,this.render(this.getPages(this.options.startPage)),this.setupEvents()),this};n.prototype={constructor:n,destroy:function(){return this.$element.empty(),this.$element.removeData("twbs-pagination"),this.$element.off("page"),this},show:function(t){if(t<1||t>this.options.totalPages)throw new Error("Page is incorrect.");this.currentPage=t,this.$element.trigger("beforePage",t);var s=this.getPages(t);return this.render(s),this.setupEvents(),this.$element.trigger("page",t),s},enable:function(){this.show(this.currentPage)},disable:function(){var s=this;this.$listContainer.off("click").on("click","li",function(t){t.preventDefault()}),this.$listContainer.children().each(function(){t(this).hasClass(s.options.activeClass)||t(this).addClass(s.options.disabledClass)})},buildListItems:function(t){var s=[];if(this.options.first&&s.push(this.buildItem("first",1)),this.options.prev){var e=t.currentPage>1?t.currentPage-1:this.options.loop?this.options.totalPages:1;s.push(this.buildItem("prev",e))}for(var i=0;i<t.numeric.length;i++)s.push(this.buildItem("page",t.numeric[i]));if(this.options.next){var a=t.currentPage<this.options.totalPages?t.currentPage+1:this.options.loop?1:this.options.totalPages;s.push(this.buildItem("next",a))}return this.options.last&&s.push(this.buildItem("last",this.options.totalPages)),s},buildItem:function(s,e){var i=t("<li></li>"),a=t("<a></a>"),n=this.options[s]?this.makeText(this.options[s],e):e;return i.addClass(this.options[s+"Class"]),i.data("page",e),i.data("page-type",s),i.append(a.attr("href",this.makeHref(e)).addClass(this.options.anchorClass).html(n)),i},getPages:function(t){var s=[],e=Math.floor(this.options.visiblePages/2),i=t-e+1-this.options.visiblePages%2,a=t+e,n=this.options.visiblePages;n>this.options.totalPages&&(n=this.options.totalPages),i<=0&&(i=1,a=n),a>this.options.totalPages&&(i=this.options.totalPages-n+1,a=this.options.totalPages);for(var o=i;o<=a;)s.push(o),o++;return{currentPage:t,numeric:s}},render:function(s){var e=this;this.$listContainer.children().remove();var i=this.buildListItems(s);t.each(i,function(t,s){e.$listContainer.append(s)}),this.$listContainer.children().each(function(){var i=t(this);switch(i.data("page-type")){case"page":i.data("page")===s.currentPage&&i.addClass(e.options.activeClass);break;case"first":i.toggleClass(e.options.disabledClass,1===s.currentPage);break;case"last":i.toggleClass(e.options.disabledClass,s.currentPage===e.options.totalPages);break;case"prev":i.toggleClass(e.options.disabledClass,!e.options.loop&&1===s.currentPage);break;case"next":i.toggleClass(e.options.disabledClass,!e.options.loop&&s.currentPage===e.options.totalPages)}})},setupEvents:function(){var s=this;this.$listContainer.off("click").on("click","li",function(e){var i=t(this);if(i.hasClass(s.options.disabledClass)||i.hasClass(s.options.activeClass))return!1;!s.options.href&&e.preventDefault(),s.show(parseInt(i.data("page")))})},changeTotalPages:function(t,s){return this.options.totalPages=t,this.show(s)},makeHref:function(t){return this.options.href?this.generateQueryString(t):"#"},makeText:function(t,s){return t.replace(this.options.pageVariable,s).replace(this.options.totalPagesVariable,this.options.totalPages)},getPageFromQueryString:function(t){var s=this.getSearchString(t),e=new RegExp(this.options.pageVariable+"(=([^&#]*)|&|#|$)").exec(s);return e&&e[2]?(e=decodeURIComponent(e[2]),e=parseInt(e),isNaN(e)?null:e):null},generateQueryString:function(t,s){var e=this.getSearchString(s),i=new RegExp(this.options.pageVariable+"=*[^&#]*");return e?"?"+e.replace(i,this.options.pageVariable+"="+t):""},getSearchString:function(t){var e=t||s.location.search;return""===e?null:(0===e.indexOf("?")&&(e=e.substr(1)),e)},getCurrentPage:function(){return this.currentPage},getTotalPages:function(){return this.options.totalPages}},t.fn.twbsPagination=function(s){var e,i=Array.prototype.slice.call(arguments,1),a=t(this),o=a.data("twbs-pagination"),r="object"==typeof s?s:{};return o||a.data("twbs-pagination",o=new n(this,r)),"string"==typeof s&&(e=o[s].apply(o,i)),void 0===e?a:e},t.fn.twbsPagination.defaults={totalPages:1,startPage:1,visiblePages:5,initiateStartPageClick:!0,hideOnlyOnePage:!1,href:!1,pageVariable:"{{page}}",totalPagesVariable:"{{total_pages}}",page:null,first:"First",prev:"Previous",next:"Next",last:"Last",loop:!1,beforePageClick:null,onPageClick:null,paginationClass:"pagination",nextClass:"page-item next",prevClass:"page-item prev",lastClass:"page-item last",firstClass:"page-item first",pageClass:"page-item",activeClass:"active",disabledClass:"disabled",anchorClass:"page-link"},t.fn.twbsPagination.Constructor=n,t.fn.twbsPagination.noConflict=function(){return t.fn.twbsPagination=a,this},t.fn.twbsPagination.version="1.4.2"}(window.jQuery,window,document);