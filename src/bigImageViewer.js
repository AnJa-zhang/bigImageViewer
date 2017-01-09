(function($){

	'use strict';

	//!import 'src/bigImageViewer.tpl'
	
	var bigImageViewer = function(option){
    option = option || {};
    this.option = {
      image_list : "",
      image_wrapper : "",
      MAX_WIDTH : 640,
      MAX_HEIGHT : 480
    };
    this.option = $.extend(this.option, option);

    this.image_list = $(this.option.image_list);
    this.image_wrapper = this.option.image_wrapper;
    this.MAX_WIDTH = Math.min(this.option.MAX_WIDTH, $client.screen.dw) - 20;
    this.MAX_HEIGHT = Math.min(this.option.MAX_HEIGHT, $client.screen.dh) - 20;

    this.image_dialog = $(_TPL_).appendTo('body').addClass('hidden');

    this.dialog_left_ear = this.image_dialog.find('.prev');
    this.dialog_right_ear = this.image_dialog.find('.next');
    this.image_dialog.find('.fixed-box').css({
      'max-width': this.MAX_WIDTH,
      'max-height': this.MAX_HEIGHT
    });

    this.image_current_wrapper = null;
    this.image_pre_src = null;
    this.image_next_src = null;
    this.init();
  }

    bigImageViewer.prototype = $.extend(bigImageViewer.prototype, {

      	init: function(){

          var _self = this;

      		this.image_list.on('click', function(){
            _self.image_current_wrapper = _self.image_wrapper ? $(this).parents(_self.image_wrapper) : $(this);
      			_self._show(this, this.src, $(this).data('preview'));
      		});
      		this.image_dialog.on('click', '.icon-close', function() {
	            _self._hide();
	        });
      		this.image_dialog.on('click', '.image', function(e){
      			e.stopPropagation();
      		});
      		this.dialog_left_ear.on('click', function(e){
      			e.stopPropagation();
      			_self._switchToPre();
      		});
      		this.dialog_right_ear.on('click', function(e){
      			e.stopPropagation();
      			_self._switchToNext();
      		});
            $(document).on('keydown', function(e){

                if(_self.image_dialog.hasClass('hidden')){
                    return;
                }
                if(e.keyCode === 37){
                    _self.dialog_left_ear.trigger('click');
                }else if(e.keyCode === 39){
                    _self.dialog_right_ear.trigger('click');
                }
                return;
            })
      	},

        /* 打开图片展示窗口函数，参数：@原图片对象， @原图片src ，@目标图片src */
      	_show: function(_this,orgin_src,target_src){

            this._width = 0;
            this._height  = 0;
            var _self = this;

      		if(target_src){

      			this._width = _this.naturalWidth || _this.width;
      			this._height = _this.naturalHeight || _this.height;
                this.dialog_left_ear.removeClass('hidden');
                this.dialog_right_ear.removeClass('hidden');
                this.image_dialog.find('.image').addClass('self-loading').css({
                    width: this._width,
                    height: this._height
                });
                if(this.image_dialog.find('.image').children('img').length === 0){
                    this.image_dialog.find('.image').append('<img src="' + orgin_src + '">');
                }

                if(this.image_current_wrapper.prev().length < 1){
                    this.dialog_left_ear.addClass('hidden');
                }
                if(this.image_current_wrapper.next().length < 1){
                    this.dialog_right_ear.addClass('hidden');
                }

                this.image_dialog.removeClass('hidden');
                ala.page_mask.show();

      			var _preview_img = new Image();
	               _preview_img.onload = function() {

	                var w = this.width,
                        h = this.height;

                    _self._width = w > _self.MAX_WIDTH ? _self.MAX_WIDTH : w;
                    _self._height = _self._width * h / w;

                    _self._height = _self._height > _self.MAX_HEIGHT ? _self.MAX_HEIGHT : _self._height;
                    _self._width = _self._height * w / h;

	                _self.image_dialog.find('.image').removeClass('self-loading').children('img').attr('src',target_src);
	                _self.image_dialog.find('.image').removeClass('self-loading').animate({
	                    width: _self._width,
	                    height: _self._height
	                });
	            }
	            _preview_img.src = target_src;
      		}
      	},

        /* 关闭图片展示窗口函数 */
      	_hide: function(){

      		ala.page_mask.hide();
            this.image_dialog.find('.image').children('img').remove();
      		this.image_dialog.addClass('hidden');
      	},

        /* 向前切换展示图片函数 */
      	_switchToPre: function(){

            if(this.image_current_wrapper.prev().length < 1){
                return;
            }
            this.image_current_wrapper = this.image_current_wrapper.prev();
            this.image_pre_src = this.image_current_wrapper.find('img').data('preview');
            this._show(this.image_dialog.find('img'), this.image_dialog.find('img')[0].src, this.image_pre_src);
            
      	},

        /* 向后切换展示图片函数 */
      	_switchToNext: function(){

            if(this.image_current_wrapper.next().length < 1){
                return;
            }
            this.image_current_wrapper = this.image_current_wrapper.next();
            this.image_next_src = this.image_current_wrapper.find('img').data('preview');
            this._show(this.image_dialog.find('img'), this.image_dialog.find('img')[0].src, this.image_next_src);
      	}
    });

	window.ala.bigImageViewer = bigImageViewer;	

})(jQuery);