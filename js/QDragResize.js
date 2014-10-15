// JavaScript Document

(function($) {
	
	$.fn.DragReize = function( setting ) {
		$.each(this, function(i, e) {
			$(this).Qresize( setting );
			$(this).parent().Drag( setting );
		});
	};
	
	var l = function(arg) {
		console.log( arg );
	};
	
	function getTopAndLeft(node, arg) {
		if( node instanceof $ )
			node = node[0];
		var result = {
			left : 0,
			top : 0	
		};
		
		while( node.tagName.toLowerCase()!="body" ) {
			result.left += node.offsetLeft;
			result.top += node.offsetTop;
			node = node.parentNode;
		};
		
		return result;
	};
	
	function QReSize() {
		this.Qinit.apply(this, arguments);
	};
	
	$.fn.Qresize = QReSize.instance = function(setting) {
		setting = setting || {};
		$.each(this, function(i, e) {
			new QReSize( $(e) , setting );
		});
	};
	
	QReSize.prototype = {
		constructor : QReSize,
		Qinit : function(arg,setting) {
			this.setting = $.extend(true, {
				maxWidth : false,
				maxHeight : false,
				minWidth : 100,
				minHeight : 100,
			} ,setting);
			this.setStyle();
			this.dom(arg);
			this.initSelecorr();
			this.initVar();
			this.events();
		},
		dom : function(arg) {
			this.el = $(arg);
			this.wrap = $( this.getStaticHtml() );
			this.el.parent().append( this.wrap );
			this.wrap.append( this.el );
		},
		setStyle : function() {
			/*
				
				.drag{
					position:absolute;
					border:1px solid #000;
				}
				.drag .dragresize{
					position:absolute;
					width:8px;
					height:8px;
					background:#000;
				}
				.drag .dragresize-tl{
					left:-4px;
					top:-4px;
				}
				.drag .dragresize-tm{
					margin-left:-4px;
					left:50%;
					top:-4px;
				}
				.drag .dragresize-tr{
					top:-4px;
					right:-4px;
				}
				.drag .dragresize-ml{
					left:-4px;
					top:50%;
					margin-top:-4px;
				}
				.drag .dragresize-mr{
					right:-4px;
					top:50%;
					margin-top:-4px;
				}
				.drag .dragresize-bl{
					left:-4px;
					bottom:-4px;
				}
				.drag .dragresize-bm{
					bottom:-4px;
					left:50%;
					margin-left:-4px;
				}
				.drag .dragresize-br{
					bottom:-4px;
					right:-4px;
				}	
			*/
			var style = $("<style>").text(function() {
				return "					.drag{					position:absolute;					border:1px solid #000;				}				.drag .dragresize{					position:absolute;					width:8px;					height:8px;					background:#000;				}				.drag .dragresize-tl{					left:-4px;					top:-4px;				}				.drag .dragresize-tm{					margin-left:-4px;					left:50%;					top:-4px;				}				.drag .dragresize-tr{					top:-4px;					right:-4px;				}				.drag .dragresize-ml{					left:-4px;					top:50%;					margin-top:-4px;				}				.drag .dragresize-mr{					right:-4px;					top:50%;					margin-top:-4px;				}				.drag .dragresize-bl{					left:-4px;					bottom:-4px;				}				.drag .dragresize-bm{					bottom:-4px;					left:50%;					margin-left:-4px;				}				.drag .dragresize-br{					bottom:-4px;					right:-4px;				}	"
			});	
			$("body").append( style );	
		},
		getStaticHtml : function() {
			return '<div class="drag">\
				<div class="dragresize dragresize-tl">\
				</div>\
				<div class="dragresize dragresize-tm">\
				</div>\
				<div class="dragresize dragresize-tr">\
				</div>\
				<div class="dragresize dragresize-ml">\
				</div>\
				<div class="dragresize dragresize-mr">\
				</div>\
				<div class="dragresize dragresize-bl">\
				</div>\
				<div class="dragresize dragresize-bm">\
				</div>\
				<div class="dragresize dragresize-br">\
				</div>\
			</div>'
		},
		initSelecorr : function() {
			this.$drag = this.wrap;
			this.$doc = $(document);
			this.$b = $(".dragresize",this.wrap);
		},
		initVar : function() {
			this.w = 0;
			this.h = 0;
			this.t = 0;
			this.l = 0;
			this.initX;
			this.initY;
			this._this = null;
		},
		events : function() {
			var _this = this;
			var contextFn = $.proxy(_this.fnResizeMove,_this)
			_this.$b.on("mousedown", fnResizeDown);
			function fnResizeDown(ev) {
				__this = $(this);
				//___this是点击的元素
				//_this是这个实例
				_this.__this = __this;
				_this.initX = ev.pageX;
				_this.initY = ev.pageY;
				_this.w = _this.$drag.width();
				_this.h = _this.$drag.height();
				_this.t = getTopAndLeft(__this).top;
				_this.l = getTopAndLeft(__this).left;
				_this.$doc.on( "mousemove", contextFn );
				ev.preventDefault();
				ev.stopImmediatePropagation();
				l(ev);
			};
			
			_this.$doc.on("mouseup", function() {
				_this.$doc.off("mousemove", contextFn );	
			});
			
		},
		fnResizeMove : function(ev) {
			var _this = this;
			var __this = _this.__this;
			var newX = ev.pageX;
			var newY = ev.pageY;
			var h = _this.h;
			var w = _this.w;
			var t = _this.t;
			var l = _this.l;
			var initX = _this.initX;
			var initY = _this.initY;
			var resultWidth = 0;
			var resultHeight = 0;
			switch( true ) {
				
				//上
				case _this.__this.hasClass("dragresize-tm") :
					resultHeight = Math.max((h - (newY - initY)  + 2), _this.setting.minWidth);
					_this.$drag.height( resultHeight );
					
					if(resultHeight === _this.setting.minWidth)break;
					_this.$drag.css( "top", newY - initY + t + 2);
					//只要新的高度减去旧的高度变大那么就是说top变大;
					//top既然变大,相应的height要变小;
				break;
				
				//左
				case _this.__this.hasClass("dragresize-ml") :
					resultWidth = Math.max( (initX-newX + w  + 2), _this.setting.minWidth);
					_this.$drag.width( resultWidth );
					
					if( resultWidth === _this.setting.minWidth)break;
					_this.$drag.css("left", newX - initX + l + 2);
				break;
				
				//右
				case _this.__this.hasClass("dragresize-mr") :
					resultWidth = Math.max( (newX - initX + w + 2), _this.setting.minWidth);
					_this.$drag.width( resultWidth );
					
				break;
				
				//下
				case _this.__this.hasClass("dragresize-bm") :
					resultHeight = Math.max( (newY - initY + h  + 2), _this.setting.minHeight);
					_this.$drag.height( resultHeight );
				break;
				
				//左上角
				case _this.__this.hasClass("dragresize-tl") :
					//只要新的高度减去旧的高度变大那么就是说top变大;
					//top既然变大,相应的height要变小;
					var resultHeight = Math.max( (h - (newY - initY)  + 2 ), _this.setting.minHeight);
					var resultWidth = Math.max( (initX-newX + w  + 2), _this.setting.minWidth );
					/*
					if( resultWidth === _this.setting.minWidth ){
						
					}
					if( resultWidth === _this.setting.minWidth && resultHeight === _this.setting.minHeight ) {
						
					};
					
					if(resultWidth === _this.setting.minWidth) {
						
					}else if(resultHeight === _this.setting.minHeight) {
						
					}else{
					};
					*/
					
					_this.$drag.height( resultHeight );
					_this.$drag.width( resultWidth );
					_this.$drag.css("left", newX - initX + l + 2);
					_this.$drag.css( "top", newY - initY + t  + 2);
				break;
				
				//右上角
				case _this.__this.hasClass("dragresize-tr") :
					//只要新的高度减去旧的高度变大那么就是说top变大;
					//top既然变大,相应的height要变小;
					resultHeight = Math.max((h - (newY - initY)  + 2), _this.setting.minWidth);
					resultWidth = Math.max( (newX - initX + w + 2), _this.setting.minWidth);
					_this.$drag.width( resultWidth );
					_this.$drag.height( resultHeight );
					
					if( resultHeight === _this.setting.minWidth )break;
					_this.$drag.css( "top", newY - initY + t + 2);
					
				break;
				
				//右下角
				case _this.__this.hasClass("dragresize-br") :
					resultWidth = Math.max( (newX - initX + w + 2), _this.setting.minWidth);
					resultHeight = Math.max( (newY - initY + h  + 2), _this.setting.minHeight);
					_this.$drag.width( resultWidth );
					_this.$drag.height( resultHeight );
				break;
				
				//左下角
				case _this.__this.hasClass("dragresize-bl") :
					resultWidth = Math.max( (initX-newX + w  + 2), _this.setting.minWidth);
					_this.$drag.width( resultWidth );
					
					resultHeight = Math.max( (newY - initY + h  + 2), _this.setting.minHeight);
					_this.$drag.height( resultHeight );
					
					if( resultWidth === _this.setting.minWidth)break;
					_this.$drag.css("left", newX - initX + l + 2);
				break;
				
			};
			

		}
	};
	//////////////////////////////////////////////////////////////////////////////////////////
	/*
	*new Dragable()
	*{ range : { top : 100 ,left: 200, x : 0 , y : 0} }
	*{ clientScreen : true }
	*new Dragable({el : f("#div1").get(0)});
	*/
	var Dragable = function( setting ) {
		if( !(this instanceof Dragable)) {
			return new Dragable( setting );
		};
		this.defaults = {
			el : $(setting.el)
		};
		$.extend( this.defaults  ,setting );
		this.init();
	};
	$.fn.Drag = Dragable.instance = function(setting) {
		setting = setting || {};
		$.each(this, function( i, e) {
			new Dragable({
				el:$(this),
				clientScreen : setting.clientScreen,
				range : setting.range
			});
		});
	};
	Dragable.prototype = {
		constructor : Dragable,
		init : function(  ) {
			this.setPosition( this.defaults.el );
			this.ev( this.defaults );
		},
		setPosition : function( el ) {
			var posStatus;
			if( el.css("position") !== "absolute" ) {
				var lt = getTopAndLeft( el[0] );
				var l = lt.left;
				var t = lt.top;
				var w = el.css("width");
				var h = el.css("height");
				
				el.css("position","absolute");
				
				el.css("top", t);
				el.css("height", h);
				el.css("left", l);
				el.css("width", w);
			};
		},
		ev : function(defaults) {
			var el = defaults.el;
			var dx , dy;
			dx = 0;
			dy = 0;
			
			var moveFn = function(ev) {
				
				var ev = ev || window.event;
				var x = ev.pageX - dx;
				var y = ev.pageY - dy;
				if( defaults.clientScreen ) {
					var xy = {
						width : $(window).width(),
						height : $(window).height()
					};
					var range = {
						x : Math.max.apply(Math,[ xy.width-parseInt($(el).css("width")) - parseInt($(el).css("margin-left"))-parseInt($(el).css("margin-right")) ]),
						y : Math.max.apply(Math,[ xy.height-parseInt($(el).css("height")) - parseInt($(el).css("margin-top")) - parseInt($(el).css("margin-bottom"))]),
						top : 0,
						left : 0
					};
				};
				if( defaults.range ) {
					range = defaults.range;
				};
				//如果是视区内 或者 在defaults有个range
				if( defaults.clientScreen || defaults.range ) {
					if( x>range.x ) {
						x  = range.x;
					};
					if( y>range.y ) {
						y  = range.y;
					};
					if( x<range.left ) {
						x = range.left
					};
					if( y<range.top ) {
						y = range.top;
					};
				};
				el.css("left", x);
				el.css("top", y);
				ev.stopPropagation&&ev.stopPropagation();
				ev.cancelBubble = true;
	
				ev.preventDefault&&ev.preventDefault();
				ev.returnValue = false;
	
			};
			
			el.on("mousedown",function( ev ) {
				var ev = ev || window.event;
				var el = defaults.el;
				var offset = getTopAndLeft( el[0] );
				var x = ev.pageX - offset.left;
				var y = ev.pageY - offset.top;
				dx = x;
				dy = y;
				$(document).on("mousemove", moveFn);
				$(document).on("mouseup",function() {
					$(document).off("mousemove", moveFn);
				});
			});
		}
	};	
})(jQuery)