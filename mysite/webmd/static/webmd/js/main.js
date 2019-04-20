$(function() {
    var weeklyStats;
    var tagDictionary;
    var color = d3.scale.category20();
    var diameter = 500;
    var format = d3.time.format("%Y-%m-%d");
    var bubble = d3.layout.pack()
        .sort((a, b) => { return b.count - a.count; })
        .size([diameter, diameter])
        .value((d) => {return d.count; })
        .padding(1.5);

    var svg = d3.select("#bubble-div")
        .append("svg")
        .attr("id", "bubble-graph")
        .attr("width", diameter)
        .attr("height", diameter);

    function setHeight(){
        $(".response").each(function(index, element){
            var target = $(element);
            target.removeClass("fixed-height");
            var height = target.innerHeight();
            target.attr("data-height", height)
                    .addClass("fixed-height");
        });
    };

    var defaultFilter = new Set();

    function createCheckbox(data) {
        aDate = Object.keys(data)[0];
        allCate = Object.keys(data[aDate]);

        allCate.forEach((val, i) => {
            var label = $("<label class='container'>" + tagDictionary[val] + "</label>");
            label.css("color", color(val));
            var checkBox = $('<input type="checkbox"/>');
            checkBox.attr("name", val).attr("value", val);
            checkBox.change(function() {
                if(this.checked) {
                    defaultFilter.add(val);
                } else {
                    defaultFilter.delete(val);
                }
                renderAll();
            });
            var span = $("<span class='checkmark'></span>")
            label.append(checkBox).append(span);
            $("#category-check").append(label);
            if (i < 5) {
                checkBox.prop('checked', true);
                checkBox.change();
            }
        })
        
    }

    function renderBubble(data, start, end) {        

        data = {children: data};
        var node = svg.selectAll(".node")
            .data(bubble.nodes(data).filter((d) => !d.children))            
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        
        var circle = node.append("circle")
            .attr("class", "bubble")
            .attr("r", function(d) { return 0; })
            .style("fill", function(d) { return color(d.category); })
            .on("click", (d) => {displayDetail(d.category, start, end)});

        var text = node.append("text")
            .attr("opacity", 0)
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .text((d) => tagDictionary[d.category] + " - " + d.count )
            .style("font-size", adaptLabelFontSize)
            .style("fill", "white")
            .attr("dy", ".3em");
        
        var t = d3.transition()
            .duration(1000);

        circle.transition(t).attr("r", function(d) { return d.r; });
        text.filter((d) => d.r > 0).transition(t).attr("opacity", 1);

    }

    function adaptLabelFontSize(d) {
        var xPadding, diameter, labelAvailableWidth, labelWidth;
        xPadding = 24;
        diameter = 2 * d.r;
        labelAvailableWidth = diameter - xPadding;
        labelWidth = this.getComputedTextLength();
        /*
         * The meaning of the ratio between labelAvailableWidth and labelWidth equaling 1 is that
         * the label is taking up exactly its available space.
         * With the result as `1em` the font remains the same.
         *
         * The meaning of the ratio between labelAvailableWidth and labelWidth equaling 0.5 is that
         * the label is taking up twice its available space.
         * With the result as `0.5em` the font will change to half its original size.
         */
        return (labelAvailableWidth / labelWidth) + 'em';
      }

    function groupBy(data) {
        var groups = {};
        data.forEach((d) => {
            if (d.category in groups) {
                groups[d.category] += d.count;
            } else {
                groups[d.category] = d.count;
            }
        });
        var result = [];
        Object.keys(groups).forEach((k) => {
            result.push({
                category: k,
                count: groups[k]
            })
        });
        return result;
    }

    function hideDetail() {
        var detail = d3.select("#detail-modal");
        detail.style("display", "none");
    }

    function displayDetail(tag, start, end) {
        d3.json("/static/webmd/json/new_1y.json", function(d) {
            var fstCount = -1, sndCount = -1, trdCount = -1;
            var fstObj, sndObj, trdObj;
            d.forEach((val) => {
                date = format.parse(val.date);
                if (tag === val.category && start <= date && end >= date) {
                    if (val.count > fstCount) {
                        trdCount = sndCount;
                        trdObj = sndObj;
                        sndCount = fstCount;
                        sndObj = fstObj;
                        fstCount = val.count;
                        fstObj = val;
                    } else if (val.count > sndCount) {
                        trdCount = sndCount;
                        trdObj = sndObj;
                        sndCount = val.count;
                        sndObj = val;
                    } else if (val.count > trdCount) {
                        trdCount = val.count;
                        trdObj = val;
                    }
                }
            })
            
            data = [fstObj, sndObj, trdObj];
            var detail = d3.select("#detail-modal");
            detail.style("display", "block");
            d3.select("#btn-close-modal").on("click", hideDetail);

            var header = d3.select("#detail-header");
            header.html("");
            header.text(tagDictionary[tag]);

            var container = d3.select("#detail-container section");
            container.html("");
            data.forEach((d, i) => {
                container.append("input").attr("class", "animate").attr("type", "radio")
                    .attr("name", "question").attr("id", "q" + i);
                container.append("label")
                    .attr("class", "animate")
                    .attr("for", "q" + i)
                    .append("text").text("Q: " + d.question);
                container.append("p")
                    .attr("class", "response animate")
                    .append("text").text("A: " + d.answer);
            });
            
            $("input[name=question]").on("change", function(){
                $("p.response").removeAttr("style");
                
                var target = $(this).next().next();
                target.height(target.attr("data-height"));
            })
            
            setHeight();
        });
    }
    
    function renderStream(data) {
        d3.select("#stream-graph").html("");
        var margin = {top: 20, right: 40, bottom: 30, left: 30};
        var width = window.innerWidth - margin.left - margin.right - 16; // 16 is margin of body
        var height = 300 - margin.top - margin.bottom;
        
        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "remove")
            .style("position", "absolute")
            .style("z-index", "20")
            .style("visibility", "hidden")
            .style("top", "30px")
            .style("left", "55px");
        
        var x = d3.time.scale().range([0, width]);        
        var y = d3.scale.linear().range([height-10, 0]);        
    
        var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(d3.time.months);        
        var yAxis = d3.svg.axis().scale(y);
        
        var brush = d3.svg.brush().x(x).on("brush", brushed);
        var stack = d3.layout.stack()
            .offset("silhouette")
            .values(function(d) { return d.values; })
            .x(function(d) { return d.date; })
            .y(function(d) { return d.count; });

        var nest = d3.nest()
            .key(function(d) { return d.category; });
        
        var area = d3.svg.area()
            .interpolate("cardinal")
            .x(function(d) { return x(d.date); })
            .y0(function(d) { return y(d.y0); })
            .y1(function(d) { return y(d.y0 + d.y); });
        
        var svg = d3.select("#stream-graph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        
        var streamGraph = svg.append("g")
            .attr("class", "stream")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        data.forEach(function(d) {
            d.date = format.parse(d.date);
            d.count = +d.count;
        });

        var layers = stack(nest.entries(data));
    
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);
    
        streamGraph.selectAll(".layer")
            .data(layers)
            .enter().append("path")
            .attr("class", "layer")
            .attr("d", function(d) { return area(d.values); })
            .style("fill", function(d) { return color(d.key); });
    
        streamGraph.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
    
        streamGraph.append("g")
            .attr("class", "y axis")
            .call(yAxis.orient("left"));

        streamGraph.append("g")
            .attr("class", "brush")
            .call(brush)
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", height + 7);

        function brushed() {
            var startDate = brush.extent()[0],
                endDate = brush.extent()[1];

            var selected = data.filter((d) => {
                return d.date >= startDate && d.date <= endDate;
            });
            d3.select("#bubble-graph").html("");
            if (selected.length > 0) {
                renderBubble(groupBy(selected), startDate, endDate);
            }
        }
    }

    function dataTransform(data) {
        var transformedData = [];
        Object.keys(data).sort().forEach((key) => {
            var val = data[key];
            Object.keys(val).forEach((cate) => {
                if (defaultFilter.has(cate)) {
                    var stats = {
                        category: cate,
                        count: val[cate],
                        date: key
                    }
                    transformedData.push(stats);
                }
            });
        });
        return transformedData;
    }

    function renderAll() {
        d3.select("#bubble-graph").html("");
        renderStream(dataTransform(weeklyStats));
    }

    d3.json("/static/webmd/json/static_1y.json", function(data) {
        d3.json("/static/webmd/json/trans.json", function(tags) {
            tagDictionary = tags;
            hideDetail();
            weeklyStats = data;
            renderAll();
            createCheckbox(data);
        });
    });
});