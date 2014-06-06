// dynamically including jquery 
if(!(window.jQuery)) 
	{
		var s = document.createElement('script');
		s.setAttribute('src', 'http://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.2/jquery.min.js');
		s.setAttribute('type', 'text/javascript');
		document.getElementsByTagName('head')[0].appendChild(s);
	}

window._data = {};


(function(){

function HeatMap()
{

	
	var that = this; // private instance
	
	// internal data store
	var _data  = {

		max : 0,
		min : 9007199254740992 , // max value of integer according to ECMA documentation 
		clickData : {} // data store for click

	}; 

	var _pushableData = {}; // data to be pushed
	
	// priveledged functions
	// getters and setters
	this.get = function(key)
	{
			return _data[key];
	}

	this.set = function(key,data)
	{	
		_data[key] = data;
		_pushableData = _data;

	}

	this.getPushData = function(){

		return _pushableData;
	}

	this.clearPushData = function(){
		_pushableData = {};
	}

	this.getData = function(){
		return _data;
	}

	this.eventBinder(); // calling event binder


};

HeatMap.prototype.eventBinder = function(){

	var that = this; // binding this for passing as parameter

	// attaching click event listener on all dom elements inside document
	document.addEventListener('click', function(event) {

		

		if (event===undefined) event= window.event;                     // IE hack
    	var target= 'target' in event? event.target : event.srcElement; // another IE hack

	    var root= document.compatMode==='CSS1Compat'? document.documentElement : document.body;
	    
	    var mxy= [event.clientX+root.scrollLeft, event.clientY+root.scrollTop]; // coordinates of click
	    
	    
	   
	    var path= that.getPathTo(target); // XPATH of the DOM element
	    var txy= that.getPageXY(target);  // position of element

	    var cData = that.get('clickData');
	    var max = that.get('max');
	    var min = that.get('min');

	    var x = mxy[0]-txy[0];
	    var y = mxy[1]-txy[1];

	    if(x < 0 || y < 0)
        	return;

	    if(!(cData[path]))
	    {
	    	
	    	cData[path] = {};
	    	cData[path]['count'] = 0; // count of clicks in each DOM element
	    	cData[path]['clicks'] = []; // array of click cordinates 
	    }

	    cData[path]['count']+= 1; // incrementing click count

	    if(!(x in cData[path]['clicks']))
	    {
	     	cData[path]['clicks'][x] = [];
	     	
	    }

	    if(!(y in cData[path]['clicks'][x]))
	     	cData[path]['clicks'][x][y] = 0;

        
        cData[path]['clicks'][x][y]+=1;
        
        //console.log(cData[path]['clicks'][x][y]);

        // updating max and min values of clicks
	    if(max < cData[path]['clicks'][x][y])
	    	that.set('max', cData[path]['clicks'][x][y]);

	    if(min > cData[path]['clicks'][x][y])
	    	that.set('min', cData[path]['clicks'][x][y]);
	    
	   

	    var clickPosition = x+','+y;
	   

	   	that.set('clickData',cData);
	    //console.log('Clicked element '+path+' offset '+(x)+', '+(y));
	    //console.log('click cordinates : '+ event.pageX+', '+event.pageY);
    	
    	//console.log(that.get('clickData'));	

    	window._data = that.getData(); // assigning data to global clone of object
	
	}, false);



	window.addEventListener('unload', function(event) {
	        
	        that.push(); // pushing click data to server
	      
	      });



};

// generates the XPATH of the element
HeatMap.prototype.getPathTo = function(element) {
	
    if (element.id!=='')
        return "[@id='"+element.id+"']";
    if (element===document.body)
        return element.tagName.toLowerCase();

    var ix= 0;
    var siblings= element.parentNode.childNodes;
    for (var i= 0; i<siblings.length; i++) {
        var sibling= siblings[i];
        if (sibling===element)
            return this.getPathTo(element.parentNode)+'/'+element.tagName.toLowerCase()+'['+(ix+1)+']';
        if (sibling.nodeType===1 && sibling.tagName===element.tagName)
            ix++;
    }
};

// returns the position of element
HeatMap.prototype.getPageXY = function(element) {
    var x= 0, y= 0;
    while (element) {
        x+= element.offsetLeft;
        y+= element.offsetTop;
        element= element.offsetParent;
    }
    return [x, y];
};


// timer for peridically pushing click data to server
HeatMap.prototype.push = function(){

	var that = this;

	setInterval(function(){
			console.log('pushing click data to server');
		

			var pData = that.getPushData();

		// replace the url with custom backend implementation for saving the clicks
		/*
			$.ajax({
	            url: 'myserver',
	            type: 'POST',
	            data: {
	                data: pData
	            }
	        });
		*/
	        that.clearPushData();  // clearing push data

	    },15000);

};




var hm = new HeatMap();
hm.push();

//console.log(hm.getData());

})(window);