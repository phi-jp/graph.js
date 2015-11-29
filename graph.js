var Graph = function(options) {
  this.init(options);
};

Graph.prototype = {
  init: function(options) {
    this.element = d3.select(options.query);
    this.element.attr({
      width: options.width,
      height: options.height,
    });

    this.width = options.width;
    this.height = options.height;
    this.max = options.max;
    this.min = options.min;

    var padding = 36;
    this.left = padding;
    this.right = this.width-padding;
    this.top = padding;
    this.bottom = this.height-padding;

    this.path = this.element.append('path');
    this.axisX = this.element.append('g');
    this.axisY = this.element.append('g');

    this.scaleX = d3.scale.linear()
      .domain([0, 11])
      .range([this.left, this.right])
      ;
    this.scaleY = d3.scale.linear()
      .domain([this.max, this.min])
      .range([this.top, this.bottom])
      ;

    this.children = [];
  },

  render: function() {
    var padding = 30;
    var svg = this.element;
    var width = svg.attr('width');
    var height = svg.attr('height');

    var scaleX = d3.scale.linear()
      .domain([0, 12])
      .range([this.left, this.right])
      ;
    var scaleY = d3.scale.linear()
      .domain([this.max, this.min])
      .range([this.top, this.bottom])
      ;

    var line = d3.svg.line()
      .x(function(d, i) { return scaleX(i); })
      .y(function(d, i) { return scaleY(d); })
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

    this.g = this.parent.element.append('g');
    this.path = this.g.append('path');

    return this;
  },

  render: function(dataset) {
    var parent = this.parent;

    var line = d3.svg.line()
      .x(function(d, i) { return parent.scaleX(i); })
      .y(function(d, i) { return parent.scaleY(d); })
      ;
    this.path
      .attr({
        'stroke': this.options.stroke,
      })
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
      .remove()
      ;
    // update
    circles
      .transition()
      .duration(500)
      .attr('cx', line.x())
      .attr('cy', line.y())
      ;
  },
};

Graph.Candlestick = function(options) {
  this.init(options);
};

Graph.Candlestick.prototype = {
  init: function(options) {
    this.parent = null;

    this.options = options;
  },

  addChildTo: function(parent) {
    parent.addChild(this);

    this.g = this.parent.element.append('g');
    this.real = this.g.append('g');
    this.hige = this.g.append('g');

    return this;
  },

  render: function(dataset) {
    var parent = this.parent;

    var positive = 'blue';
    var negative = 'red';

    // hige
    var hige = this.hige.selectAll('line').data(dataset);
    hige
      .enter()
      .append('line')
      .attr({
        x1: function(d, i) { return parent.scaleX(i); },
        x2: function(d, i) { return parent.scaleX(i); },
        y1: function(d, i) { return parent.scaleY(d.low); },
        y2: function(d, i) { return parent.scaleY(d.high); },
        stroke: function(d, i) {
          return (d.open < d.close) ? positive : negative;
        },
      })
      ;

    // real
    var real = this.real.selectAll('line').data(dataset);
    real
      .enter()
      .append('line')
      .attr({
        x1: function(d, i) { return parent.scaleX(i); },
        x2: function(d, i) { return parent.scaleX(i); },
        y1: function(d, i) { return parent.scaleY(d.open); },
        y2: function(d, i) { return parent.scaleY(d.close); },
        stroke: function(d, i) {
          return (d.open < d.close) ? positive : negative;
        },
        'stroke-width': function(d, i) {
          return 10;
        },
      })
      ;
  },
};
