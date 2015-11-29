var Graph = function(options) {
  this.init(options);
};

Graph.prototype = {
  init: function(options) {
    this.svg = d3.select(options.query);
    this.svg.attr({
      width: options.width,
      height: options.height,
    });

    this.width = options.width;
    this.height = options.height;

    var padding = 36;
    this.left = padding;
    this.right = this.width-padding;
    this.top = padding;
    this.bottom = this.height-padding;

    console.log(this);

    this.path = this.svg.append('path');
    this.axisX = this.svg.append('g');
    this.axisY = this.svg.append('g');

    this.children = [];
  },

  render: function(dataset) {
    var padding = 30;
    var svg = this.svg;
    var width = svg.attr('width');
    var height = svg.attr('height');
    var max = d3.max(dataset);
    var min = d3.min(dataset);
    var scaleX = d3.scale.linear()
      .domain([0, dataset.length-1])
      .range([this.left, this.right])
      ;
    var scaleY = d3.scale.linear()
      .domain([max, min])
      .range([this.top, this.bottom])
      ;

    var line = d3.svg.line()
      .x(function(d, i) { return scaleX(i); })
      .y(function(d, i) { return scaleY(d); })
      ;

    this.path
      .transition()
      .duration(500)
      .attr({
        'd': line(dataset),
        'stroke': 'blue',
        'stroke-width': 3,
        'fill': 'none',
      })
      ;
    
    // circle
    var circles = svg.selectAll('circle').data(dataset);
    // enter
    circles
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', 'white')
      .attr('stroke', 'blue')
      .attr('opacity', 1.0)
      ;
    // exit
    circles
      .exit()
      .transition()
      .duration(500)
      .attr('opacity', 0.0)
      .remove();
    // update
    circles
      .transition()
      .duration(500)
      .attr('cx', line.x())
      .attr('cy', line.y())
      ;
    
    // axis
    var axisX = d3.svg.axis()
      .scale(scaleX)
      .orient('bottom')
      .innerTickSize(0)
      .outerTickSize(0)
      .tickPadding(10)
      ;
    var axisY = d3.svg.axis()
      .scale(scaleY)
      .orient('left')
      .innerTickSize(0)
      .outerTickSize(0)
      .tickPadding(10)
      ;
    this.axisX
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + this.bottom + ')')
      .call(axisX)
      ;
    
    this.axisY
      .attr('class', 'axis')
      .attr('transform', 'translate(' + this.left + ', 0)')
      .call(axisY)
      ;
  },

  addChild: function(child) {
    this.children.push(child);
    child.parent = this;
  },
};

Graph.Path = function(options) {
  this.init(options);
};

Graph.Path.prototype = {
  init: function(options) {
    this.parent = null;

    this.options = options;
  },

  addChildTo: function(parent) {
    parent.addChild(this);

    this.g = this.parent.svg.append('g');
    this.path = this.g.append('path');

    return this;
  },

  render: function(dataset) {
    var parent = this.parent;
    var max = d3.max(dataset);
    var min = d3.min(dataset);
    var scaleX = d3.scale.linear()
      .domain([0, dataset.length-1])
      .range([parent.left, parent.right])
      ;
    var scaleY = d3.scale.linear()
      .domain([max, min])
      .range([parent.top, parent.bottom])
      ;

    var line = d3.svg.line()
      .x(function(d, i) { return scaleX(i); })
      .y(function(d, i) { return scaleY(d); })
      ;
    this.path
      .transition()
      .duration(500)
      .attr({
        'd': line(dataset),
        'stroke': this.options.stroke,
        'stroke-width': 3,
        'fill': 'none',
      })
      ;

    // circle
    var circles = this.g.selectAll('circle').data(dataset);
    // enter
    circles
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', 'white')
      .attr('stroke', this.options.stroke)
      .attr('opacity', 1.0)
      ;
    // exit
    circles
      .exit()
      .transition()
      .duration(500)
      .attr('opacity', 0.0)
      .remove();
    // update
    circles
      .transition()
      .duration(500)
      .attr('cx', line.x())
      .attr('cy', line.y())
      ;
  },
};


