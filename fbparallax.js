/**************************************************************** 
	fbparallax.js
	a Facebook Scroll Bar-less Parallax Scrolling Plugin 
	by Jared Cole && Mike Feineman 
	
	*************************************************************
	Requirements
	*************************************************************
		fbparallax.js utilizes the help of other amazing 
		plugins created by people that are smarter than
		me. Here is what you will need to make 
		fbparallax.js work:
			-jQuery www.jquery.com
			-jquery-mousewheel https://github.com/brandonaaron/jquery-mousewheel/
			-mwheelIntend http://www.protofunc.com/scripts/jquery/mwheelIntent/
			-jScrollPane http://jscrollpane.kelvinluck.com/
			-jScrollPane's CSS (which I modified to make the scrollbars nearly invisible) http://jscrollpane.kelvinluck.com/
			
	*************************************************************
	How to set up the HTML
	*************************************************************
		- the data-type="background" attribute for the
			background parallax element
			
		- the data-type="parallax" attribute for the 
			elements inside your background that need to
			have parallax animations
		
		- the data-speed="1" attribute determines the 
			scroll speed of a parallax element
				( positive numbers will have elements scroll
					down, negative numbers will have 
					elements scroll up! )
			
		Example Structure:
		<div  class="space" data-type="background">
			<div class="tardis" data-type="parallax" data-speed="1.1"></div>
			<div class="venus" data-type="parallax" data-speed=".5"></div>
			<div class="sun" data-type="parallax" data-speed=".7"></div>
			<div class="neptune" data-type="parallax" data-speed="-.5"></div>
			<div class="earth"></div>
		</div>
		
	*************************************************************
	How to configure plugin settings: 
	*************************************************************
	Settings options are speed, distance, up_overlay, down_overlay
	settings = {
		speed : scroll_inverval_value,
		distance : pixels_scrolled_per_interval_val,
		up_overlay: $(up_scroll_helper_element),
		down_overlay: $(down_scroll_helper_element)
	}
	
	*************************************************************
	Initializing fbparallax.js
	*************************************************************
	in your $(document).ready():
		//with initialization of settings
		$('#container1').fbparallax({ up_overlay : $("#up-overlay-one"), down_overlay : $("#down-overlay-one") , distance : 80, speed : 10});
		//with default settings
		$('#container2').fbparallax();
	
****************************************************************/
(function($){
	$.fn.fbparallax = function(settings) {
		if(settings == undefined){
			settings = {};
		}
		//vars
		var start_scrolling = null;
		var this_scroll_helper = null;
		var pane = null;
		
		//setup the jScrollPane window
		pane =  $(this);
		pane.fb_parallax_name = $(this).attr("id");
		pane.jScrollPane();	
		
		//set the height && initial position of our scrolling background
		var background_h = pane.find('[data-type="background"]').innerHeight();
		var last_top_pos = 0;
		
		//an array that will hold all of our parallax elements
		var parallax_elms = [];
		
		//find all of our parallax elements in our window and their attributes and put them in our array
		pane.find('[data-type="parallax"]').each(function(){
			//we are collecting all the info about our parallax element from the data attributes
			var obj = {"element": $(this), "top": $(this).css('top'), "speed": $(this).attr('data-speed')};
			parallax_elms.push(obj);
		});
		
		//functions that fire when we start scrolling our window
		pane.scroll(function(){
			//find the where the top of our window is
			var container_pos = pane.find(".jspPane").position();
			
			//if we are at the top, go ahead and start animation, if we are at the bottom, stop animation
			if(container_pos.top > -(background_h - pane.height()) && container_pos.top != 0){
				//find out how fast our parallax elements are supposed to scroll and scroll them
				$.each(parallax_elms, function(){
					var speed = parseFloat(this.speed);
					var time = -parseFloat(container_pos.top);
					var initial_position =  parseInt(this.top);
					var new_position =  (speed * time) + initial_position;
					this.element.css(
						{"top": new_position + "px" }
					);
				});
				
			} 
			else {
				//what happens at the end? put that here or leave it blank. It's up to you!
				//console.log("can't move anymore!");
			}
		});//end of pane.scroll
		
		var hoverMouseIn = function(){
			//Mouse in events
			//fade in scroll helper 
			$(this).animate({'opacity': .7});
			
			//get direction of scroll
			this_scroll_helper = $(this).attr('data-type');
			//and start scrolling
			start_scrolling = setTimeout(doScroll, settings.speed);
		}
		
		var hoverMouseOut = function(){
				//Mouse out events
				//fade out scroll helper
				$(this).animate({'opacity': 0});	
				//stop scrolling
				clearTimeout(start_scrolling);
		}
		
		/*
			doScroll()
			This function handles what direction you scroll when scrolling
			with the overlay scroll helpers
		*/
		var doScroll = function(){
			//get jscroll pane api data
			var pane_api = pane.data('jsp');
			var scroll_by_amt = settings.distance;
			
			if(this_scroll_helper == "up-scroll-helper") {
				//start scrolling up
				pane_api.scrollByY(-scroll_by_amt);
					
			} else if (this_scroll_helper == "down-scroll-helper") {
				//start scrolling down
				pane_api.scrollByY(scroll_by_amt);
			}
			start_scrolling = setTimeout(doScroll, settings.speed);
		}
		
		//hide scroll helper overlays on doc ready and listen for hover event
		//the up overlay
		if(settings.up_overlay != undefined) {
			settings.up_overlay.css({'opacity' : 0});
			
			settings.up_overlay.hover(hoverMouseIn, hoverMouseOut);
		}
		//the down overlay
		if(settings.down_overlay != undefined) {
			settings.down_overlay.css({'opacity' : 0});
			
			settings.down_overlay.hover(hoverMouseIn, hoverMouseOut);
		}
		
	}
})(jQuery);