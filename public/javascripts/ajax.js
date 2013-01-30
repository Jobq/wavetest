$(document).ready(function() {

  $('BODY').ajaxStop(function() {
    // gets called after every ajax request completes
    //renderCufon();
  });

	$('form[data-remote]:not([data-exclude])').live("submit", function(){
		$(this).append("<img src='/img/ajax-loader.gif' />");
	});

  $('a[data-method], a[data-remote], form[data-remote]:not([data-exclude])').live('ajax:success', function(event, data, status, xhr) {
    log("Ajaxing " + $(this).attr('id'));
    //if(ajax_redirect(xhr)) { return; }

    var self        = $(this),
      target        = $(self.attr('data-target')),
      action        = self.attr('data-action'),
      animation     = self.attr('data-animation'),
      closeModal    = self.attr('data-close_modal'),
      followUrl     = self.attr('data-follow_url'),
      resize        = self.attr('data-resize');

    if (target) {
      if (!action || (action && action == 'replace')) {
        target.replaceWith(data);
      } else if (action && action == 'replace_content') {
        if (animation && animation == 'fade_in') {
          target.hide().html(data).fadeIn();
        } else if (animation && animation == 'fade_out') {
          target.fadeOut();
        } else if (animation && animation == 'slide_down') {
          target.hide().html(data).slideDown();
        } else {
          target.html(data);
        }
      } else if (action && action == 'append') {
        target.append(data).end();
        target.children().last().find(':text:visible:first').focus();

        if ($.fancybox) {
          $.fancybox.resize();
        }
      } else if (action && action == 'prepend') {
        target.prepend(data).end();
        target.children().first().find(':text:visible:first').focus();
      }
    } else {
      self.replaceWith(data);
    }
    if(self.attr('data-target') == '#fancybox-inner'){
      $.fancybox.resize();
    }
    
    if (closeModal && $.fancybox) {
      $.fancybox.close();
      if (followUrl) { //doesn't really follow just replaces html and acts as if it did
        $('#content').html($(xhr.responseText).find('#content').html());
      }
    }

    attachFancyBox();
    bindPlanLinkClicks();
    
    if(resize === 'true'){
      $.fancybox.resize();
    }
  });
  
  $('#fancybox-content form[data-remote]').live('ajax:error', function(event, xhr, status, error) {
      $.fancybox({
        content: xhr.responseText
      });
  });
  
  $('a[data-remote].jq_removeUnsubscribe').live('click', function(){
    $(this).remove();
  })

});

var bindPlanLinkClicks = function(){
  $('.jq_choosePlanLink').live('click', function(){
    $('.jq_plan').removeClass('selected');
    $(this).parents('.jq_plan').addClass('selected');

    var planCode = $(this).data('planCode');
    $('#subscription_planCode').val(planCode);

    showSubscriptionFieldset(planCode);
    return false;
  });

  $('.jq_plan.selected').each(function(index, element){
    if($(element).find('a').data('plan') == 'PREMIUM_PLAN_V2'){
      $('.jq_subscriptionData').show();
    }
  });    
}
