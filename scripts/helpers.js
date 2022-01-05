/**
 * 
 *  wraps SVG text
 * 
 */
 
function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 0.8, // ems
            y = text.attr("y"),
            x = text.attr("x"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(Math.round(i));
    }

    return result;
};

/**
 * 
 *  Remove element of a specific filter
 *  @param filter_type          string      Type of filter (e.g. "role")
 *  @param element_to_remove    string      element to remove from the filter array of values (e.g. "Data Engineer")
 *  
*/
function removeElementFromFilter(filter_type, element_to_remove) {

    filtersArray.map(function(filter) {
        if(filter.filter === filter_type) {

            var elements = filter.value;            

            var elementIndex = elements.indexOf(element_to_remove);
            if (elementIndex !== -1) {
                elements.splice(elementIndex, 1);
            }

            filter.value = elements;
        }
    });
}

/**
 * 
 *  Update filter with a given value
 *  @param filter_type          string      Type of filter (e.g. "role")
 *  @param value                string      value to push to the array of values of that fiter (e.g. "Data Engineer")
 *  
*/
function updateFilter(filter_type, value) {

    filtersArray.map(function(filter) {
        if(filter.filter === filter_type)
            filter.value.push(value);
    })

}

function capitalize(s) {
    
    return s && s[0].toUpperCase() + s.slice(1);
}


// Convert rgb string to hex
function convertRGBtoHex(richText) {
  return richText.replace(/rgb\((.+?)\)/ig, (_, rgb) => {
    return '#' + rgb.split(',')
      .map(str => parseInt(str, 10).toString(16).padStart(2, '0'))
      .join('')
  })
}

// Convert hex string to rgb
function convertHextoRGB(hex) {
    var m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
    return `rgb(${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)})`
}

