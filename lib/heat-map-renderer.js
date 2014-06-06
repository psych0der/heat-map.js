
// parses the XPATH expression and returns the element
var getElementByXpath = function (path) {
	
	if(path[0]!='[')
		path = '//'+path;

	//console.log(path);
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
};


// function to give max of 2 floats
function maxF(val1, val2)
{
	val1 = parseFloat(val1);
	val2 = parseFloat(val2);
	//console.log(val1+','+val2);
	if(val1 > val2)
		return val1;
	else
		return val2;
};


// function to calculate RGB values according to min and max values
function rgb(maximum ,minimun, value)
{
	var min = parseFloat(minimun);
	var max = parseFloat(maximum);
	var halfmax = (min+max)/2;

	var val1 = 255*(1 - parseFloat(value)/halfmax);
	var val2 = 255*(parseFloat(value)/halfmax - 1);
	
	var b = parseInt(maxF(0, val1));
    var r = parseInt(maxF(0, val2));
    var g = 255 - b - r;

    return 'rgb('+r+','+g+','+b+')';

};



// heatmap rendering heatmap
function displayHeatmap()
{
	var data = window._data;
	var max = data.max;
	var min = data.min;
	//console.log(data);

	for (path in data['clickData'])
	{

		var element_data = data.clickData[path];
		var element = getElementByXpath(path); // identifies the element using XPATH
		//console.log('element .. ');
		//console.log(element);
		var offset = $(element).offset(); 

		var d = element_data.clicks;

		for(var x in d){
                    // jump over undefined indexes
                    if(x === undefined)
                        continue;
                    for(var y in d[x]){
                        if(y === undefined)
                            continue;
                        // calcuating offset of div to be drawn according to click cordinates and parent DOM element
                        var print_x = parseInt(x) + parseInt(offset.left);
                        var print_y = parseInt(y) + parseInt(offset.top);
                        //console.log('mark :'+print_x+','+print_y);

                        var color = rgb(max,min,d[x][y]); // getting color according to value of clicks
                        for(var i = 0; i<d[x][y];i++)
                        {
                        	
                        	// generating div on the fly, to mark the click
                        	$('<div class="spot"></div>').offset({left:print_x,top:print_y}).css({'background-color':color,'box-shadow' : '0px 0px 20px 10px '+color}).appendTo('#overlay');

                        }
                    }

        	}

	}

}

// function to display click map
function displayClickmap()
{
	var data = window._data;
	var max = data.max;
	//console.log(data);
	
	$('#overlay2').empty();

	for (path in data['clickData'])
	{

		var element_data = data.clickData[path];
		var element = getElementByXpath(path);
		
		var offset = $(element).offset();

		var count = element_data.count;

		
                         
                        var height = $(element).outerHeight();
                        var width = $(element).outerWidth();
                        
                        $('<div class="spot"></div>').offset({left:offset.left,top:offset.top}).css({'height':height+'px','width':width+'px'}).attr('class','bordered-div').text(count).appendTo('#overlay2');
                        
    }
       
}






$(document).ready(function(){

// toggling the heatmap button
$('#toggle').click(function(event){
	event.preventDefault();

	var overlay = document.getElementById('overlay');
	overlay.style.opacity = .6;
	if(overlay.style.display == "block")
	{	
		overlay.style.display = "none";
		$('#clickmap').css('display','block'); // enabling clickmap button

	}	
		
	else 
	{
		$('#clickmap').css('display','none'); // disabling clickmap button
		overlay.style.display = "block";

		// dynamically giving dimension to overlay
		$('#overlay').css({
 			width:  $(document).width(),
 			height:  $(document).height()
		});
		displayHeatmap();
	}

	return false;
	//console.log(window.clickData);
	
});


$('#clickmap').click(function(event){
	event.preventDefault();
	$('#toggle').css('display','none');
	var overlay = document.getElementById('overlay2');
	overlay.style.opacity = .6;
	if(overlay.style.display == "block")
	{
		overlay.style.display = "none";
		$('#toggle').css('display','block');
	}
		
	else 
	{	
		$('#toggle').css('display','none');
		overlay.style.display = "block";

		// dynamically giving dimension to overlay
		$('#overlay2').css({
 			width:  $(document).width(),
 			height:  $(document).height()
		});
		displayClickmap();
	}

	return false;
	
	
});

})