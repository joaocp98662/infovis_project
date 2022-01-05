// Parallel Sets by Jason Davies, http://www.jasondavies.com/
// Functionality based on http://eagereyes.org/parallel-sets
/* global d3 */
/* eslint indent: "off" */
(function() {
  d3.parsets = function(data) {
    var event_top = d3.dispatch("sortDimensions", "sortCategories"),
        // dimensions_ = dimensions,
        dimensions_ = autoDimensions,
        dimensionFormat = String,
        tooltip_ = defaultTooltip,
        categoryTooltip = defaultCategoryTooltip,
        value_,
        spacing = 20,
        width,
        height,
        tension = 1,
        tension0,
        duration = 500;

    // https://stackoverflow.com/questions/47844765/d3-rebind-in-d3-v4
    // Copies a variable number of methods from source to target.
    d3.rebind = function(target, source) {
      var i = 1, n = arguments.length, method;
      while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
      return target;
    }; 

    // Method is assumed to be a standard D3 getter-setter:
    // If passed with no arguments, gets the value.
    // If passed with arguments, sets the value and returns the target.
    function d3_rebind(target, source, method) {
      return function() {
        var value = method.apply(source, arguments);
        return value === source ? target : value;
      };
    }

    function d3_functor(v) {
      return typeof v === "function" ? v : function() { return v; };
    }

    function parsets(selection) {
      selection.each(function(data, i) {
        //console.log("parsets ", data);
        var g = d3.select(this),
            ordinal = d3.scaleOrdinal(),
            dragging = false,
            dimensionNames = dimensions_.call(this, data, i),
            dimensions = [],
            tree = {children: {}, count: 0},
            nodes,
            total,
            ribbon,
            ribbonEnter;

        // d3.select(window).on("mousemove.parsets." + ++parsetsId, unhighlight);

        var tooltips_to_remove = d3.selectAll(".tooltip_parsets");
        
        if(tooltips_to_remove.size() > 1) {

          tooltips_to_remove.filter(function(t, i) {
            
            if(i < tooltips_to_remove.size() - 1)
              d3.select(this).remove();
          })
        }

        if (tension0 == null) tension0 = tension;
        g.selectAll(".ribbon")
            .data(["ribbon"], String)
          .enter().append("g")
            .attr("class", String);

        updateDimensions();

        function tensionTween() {
          var i = d3.interpolateNumber(tension0, tension);
          return function(t) {
            tension0 = i(t);
            ribbon.merge(ribbonEnter).attr("d", ribbonPath);
          };
        }

        function updateDimensions() {
          // Cache existing bound dimensions to preserve sort order.
          var dimension = g.selectAll("g.dimension"),
              cache = {};
          dimension.each(function(d) { cache[d.name] = d; });
          dimensionNames.forEach(function(d) {
            if (!cache.hasOwnProperty(d)) {
              cache[d] = {name: d, categories: []};
            }
            dimensions.push(cache[d]);
          });
          dimensions.sort(compareY);
          // Populate tree with existing nodes.
          g.select(".ribbon").selectAll("path")
              .each(function(d) {
                var path = d.path.split("\0"),
                    node = tree,
                    n = path.length - 1;
                for (var i = 0; i < n; i++) {
                  var p = path[i];
                  node = node.children.hasOwnProperty(p) ? node.children[p]
                      : node.children[p] = {children: {}, count: 0};
                }
                node.children[d.name] = d;
              });          
          tree = buildTree(tree, data, dimensions.map(dimensionName), value_);
          cache = dimensions.map(function(d) {            
            var t = {};
            d.categories.forEach(function(c) {
              t[c.name] = c;
            });
            return t;
          });
          (function categories(d, i) {
            if (!d.children) return;
            var dim = dimensions[i],
                t = cache[i];
            for (var k in d.children) {
              if (!t.hasOwnProperty(k)) {
                dim.categories.push(t[k] = {name: k});
              }
              categories(d.children[k], i + 1);
            }
          })(tree, 0);
          
          ordinal.domain([]).range(d3.range(dimensions[0].categories.length));
          nodes = layout(tree, dimensions, ordinal);
          total = getTotal(dimensions);
          dimensions.forEach(function(d) {
            d.count = total;
          });
          dimension = dimension.data(dimensions, dimensionName);          

          var dEnter = dimension.enter().append("g")
              .attr("class", "dimension")
              .attr("transform", function(d) { return "translate(0," + d.y + ")"; })
              .on("mousedown.parsets", cancelEvent);
          dimension.merge(dEnter).each(function(d) {
                d.y0 = d.y;
                d.categories.forEach(function(d) { d.x0 = d.x; });
              });
          dEnter.append("rect")
              .attr("width", width)
              .attr("y", -45)
              .attr("height", 45);
          var textEnter = dEnter.append("text")
              .attr("class", "dimension")
              .attr("transform", function(d) {
                if(d.name=="q5") {
                  return "translate(0,-25)";
                } else {
                  return "translate(0,+40)";
                }
              });
          textEnter.append("tspan")
              .attr("class", "name")
              .text(dimensionFormatName);
          dimension.merge(dEnter)
          dimension.merge(dEnter).transition().duration(duration)
              .attr("transform", function(d) { return "translate(0," + d.y + ")"; })
              .tween("ribbon", ribbonTweenY);
          dimension.exit().remove();

          updateCategories(dimension.merge(dEnter));
          updateRibbons();

          var language_filter = filtersArray.find(function(filter) {
            return filter.filter === "language";
          });

          if(typeof language_filter !== "undefined") {

            var selected_ribbons = d3.select(".parallelSet").select("svg").select("g").selectAll("path").filter(function(d) {
              return (language_filter.value.includes(d.name));
            });

            var roles_categories = d3.select(".parallelSet").select("svg").select("g.dimension");

            var role_dimension = d3.select(".parallelSet").select("g.dimension");
            var language_dimension = d3.select(role_dimension.node().nextSibling);

            var categories_to_show = language_dimension.selectAll("g.category").filter(function() {
              var language = d3.select(this).attr("name");
              return (language_filter.value.includes(language));
            });

            categories_to_show
              .attr("selected", true);

            var categories_rects = categories_to_show.select("rect");

            categories_rects.style("fill-opacity", 0.3); // unhighlight category rect

            selected_ribbons.attr("selected", true);
            selected_ribbons.style("fill-opacity", 0.9);

          }

        }

        function sortBy(type, f, dimension) {
          return function(d) {
            var direction = this.__direction = -(this.__direction || 1);
            d3.select(this).text(direction > 0 ? type + " »" : "« " + type);
            d.categories.sort(function() { return direction * f.apply(this, arguments); });
            nodes = layout(tree, dimensions, ordinal);
            updateCategories(dimension.merge(dimension.enter()));
            updateRibbons();

            // This isn't really doing anything...
            event_top.call("sortCategories");
          };
        }

        function updateRibbons() {
          ribbon = g.select(".ribbon").selectAll("path")
              .data(nodes, function(d) { return d.path; });

          ribbonEnter = ribbon.enter().append("path")
              .each(function(d) {
                d.source.x0 = d.source.x;
                d.target.x0 = d.target.x;
              });

          ribbonEnter.merge(ribbon)
              // .attr("class", function(d) { console.log(Object.keys(count_roles)[d.major]); return "category-" + d.major; })
              .attr("role", function(d) { return d.parent.name; })
              .style("cursor", "pointer")
              .attr("language", function(d) { 
                if(!(d.name in count_roles)) //if not a role then it's a programming language
                  return d.name;
              })
              .style("fill", function(d) {
                return roles_colors[d.parent.name];
              })              
              .attr("d", ribbonPath)
              .on("mouseover", function(event, d) {

                // showTooltip(event, tooltip_.call(this, d));
                var count = d.count,
                    path = [];
                while (d.parent) {
                  if (d.name) path.unshift(capitalize(d.name));
                  d = d.parent;
                }

                var text = path.join(" → ") + "<br>" + comma(count) + " (" + percent(count / d.count) + ")";

                var m = d3.pointer(event, body.node());

                tooltip
                  .style("display", null)
                  .style("visibility", "visible")
                  .style("left", m[0] + 30 + "px")
                  .style("top", m[1] - 20 + "px")
                  .html(text);

                var ribbon_path = d3.select(this);

                ribbon_path.style("fill-opacity", 0.9);

              })
              .on("mouseout", function(event, d) {

                var ribbon_path = d3.select(this);

                if(ribbon_path.attr("selected") !== "true") {
                  ribbon_path.style("fill-opacity", 0.5);
                }

                tooltip.style("visibility", "hidden");

              })
              .on("click", function(event, d) {

                var ribbon_path = d3.select(this);

                var role = ribbon_path.attr("role");

                if(ribbon_path.attr("selected") === "true") {

                  removeElementFromFilter("language", d.name);
                  removeElementFromFilter("role", role);

                  drawGlobal(original_data);

                } else {

                  var role_filter = filtersArray.find(function(filter) {
                    return filter.filter === "role";
                  });

                  console.log(filtersArray);

                  if(!(role_filter.value.includes(role))) {
                    console.log(role);
                    updateFilter("role", role);
                  }

                  language_filter = filtersArray.find(function(f) {
                    return f.filter === "language";
                  })

                  if(typeof language_filter === "undefined") {

                    //criar filtro
                    filtersArray.push({ "filter": "language", "value": [d.name] });

                  } else { //update filtro
                    updateFilter("language", d.name);
                  }

                  drawGlobal(original_data);

                }

              })
          ribbonEnter.merge(ribbon).sort(function(a, b) { return b.count - a.count; });
          ribbon.exit().remove();

          // var mouse = g.select(".ribbon-mouse").selectAll("path")
          //     .data(nodes, function(d) { return d.path; });
          // var mouseEnter = mouse.enter().append("path");   

          // mouseEnter.merge(mouse)
          //     .on("mousemove.parsets", function(event, d) {
          //       ribbon.classed("active", false);
          //       if (dragging) return;
          //       highlight(d = d.node, true);
          //       showTooltip(event, tooltip_.call(this, d));
          //       event.stopPropagation();
          //     });
          // mouse.merge(mouseEnter)
          //     .sort(function(a, b) { return b.count - a.count; })
          //     .attr("d", ribbonPathStatic)
          //     .attr("role", function(d) {
          //       return d.parent.name;
          //     });
          // mouse.exit().remove();
        }

        // Animates the x-coordinates only of the relevant ribbon paths.
        function ribbonTweenX(d) {
          var nodes = [d],
              r = ribbon.merge(ribbonEnter).filter(function(r) {
                var s, t;
                if (r.source.node === d) nodes.push(s = r.source);
                if (r.target.node === d) nodes.push(t = r.target);
                return s || t;
              }),
              i = nodes.map(function(d) { return d3.interpolateNumber(d.x0, d.x); }),
              n = nodes.length;
          return function(t) {
            for (var j = 0; j < n; j++) nodes[j].x0 = i[j](t);
            r.attr("d", ribbonPath);
          };
        }

        // Animates the y-coordinates only of the relevant ribbon paths.
        function ribbonTweenY(d) {
          var r = ribbon.merge(ribbonEnter).filter(function(r) { return r.source.dimension.name == d.name || r.target.dimension.name == d.name; }),
              i = d3.interpolateNumber(d.y0, d.y);
          return function(t) {
            d.y0 = i(t);
            r.attr("d", ribbonPath);
          };
        }

        // Highlight a node and its descendants, and optionally its ancestors.
        function highlight(d, ancestors) {
          var array = [];
          if (dragging) return;
          var highlight = [];
          (function recurse(d) {
            highlight.push(d);
            for (var k in d.children) recurse(d.children[k]);
          })(d);
          highlight.shift();          
          if (ancestors)  {            
            while (d) {
              highlight.push(d), d = d.parent;
            }
          }
          ribbonEnter
            .filter(function(d) {
              var active = highlight.indexOf(d.node) >= 0;            
              if (active) this.parentNode.appendChild(this);
              return active;
            })
            .classed("active", true);

          ribbon
            .filter(function(d) {
              var active = highlight.indexOf(d.node) >= 0;            
              if (active) this.parentNode.appendChild(this);
              return active;
            })
            .classed("active", true);            
        }

        // Unhighlight all nodes.
        function unhighlight() {
          ribbonEnter.classed("active", false);
          hideTooltip();
        }

        var selected_category_text = d3.select("div.parallelSet").select("svg").select("g.dimension").selectAll("g.category").selectAll("text").filter(function() {

          var category_text = d3.select(this);

            return d3.select("div#heatmap").select("svg.chart").select("g").select(".g_roles").selectAll("g.tick").select("text").filter(function() {
              if(category_text.text() === map_roles_acronimous[d3.select(this).text()]) {
                return d3.select(this);
              }
            })
        });

        var heat_map_selected = d3.select("div#heatmap").select("svg.chart").select("g").select(".g_roles").selectAll("g.tick").select("text").filter(function() {
         return d3.select(this).attr("selected") === "true";
        });

        var selected_category = selected_category_text.select(function() {
          return this.closest(".category");  // Get the closest parent matching the selector string.
        });

        // updates category
        if(heat_map_selected.size() > 0) {
          selected_category.attr("selected", "true");
        }

        function updateCategories(g) {
          var category = g.selectAll("g.category")
              .data(function(d) { return d.categories; }, function(d) { return d.name; });

          var categoryEnter = category.enter().append("g")
              .attr("class", "category")
              .attr("name", function(d) {
                  return d.name;
              })
              .style("cursor", "pointer");

          categoryEnter.merge(category)
              .attr("transform", function(d) { return "translate(" + d.x + ")"; });

          // TODO: Don't really understand why I had to comment this one out
          // category.exit().remove();

          category
              .merge(categoryEnter)
              .on("mousemove.parsets", function(event, d) {
                // ribbon.classed("active", false);
                // d.nodes.forEach(function(d) { highlight(d); })

                hovered_category = d3.select(this);

                hovered_category.select("rect").style("fill-opacity", 0.3); // highlight category rect

                if(d.name in count_roles) { //check if its a role category

                  hovered_ribbons = d3.select(".ribbon").selectAll("path").filter(function(p) {
                    return d3.select(this).attr("role") === d.name;
                  });

                  hovered_ribbons.style("fill-opacity", 0.9); //highlight ribbons
                }

                showTooltip(event, categoryTooltip.call(this, d));

              })
              .on("mouseout.parsets", function(event, d) {

                if(d.name in count_roles) { //check if its a role category

                  var categories = d3.select(".parallelSet").select("g.dimension").selectAll(".category")   

                  var categories_rects = categories.select("rect");

                  categories_rects.style("fill-opacity", 0); // unhighlight category rect

                  var ribbons = d3.select(".ribbon").selectAll("path").filter(function() {
                    return d3.select(this).attr("selected") !== "true";
                  });

                  ribbons.style("fill-opacity", 0.5); // unhighlight ribbons


                } else { // programming languages

                  var role_dimension = d3.select(".parallelSet").select("g.dimension");
                  var language_dimension = d3.select(role_dimension.node().nextSibling);

                  var categories_to_hide = language_dimension.selectAll("g.category").filter(function() {
                    return d3.select(this).attr("selected") !== "true";
                  });

                  var categories_rects = categories_to_hide.select("rect");

                  categories_rects.style("fill-opacity", 0); // unhighlight category rect
                }                

                hideTooltip();

              })
              .on("click", function(event, d) {

                if(d.name in count_roles) { //check if its a role category

                  selected_category = d3.select(this);

                  var heatmap_squares = d3.select("div#heatmap").select("svg.chart").select("g").selectAll("rect").filter(function(e) {
                      return e.role === d.name;
                  });

                    var selected_axis_labels = d3.select("div#heatmap").select("svg.chart").select("g").select("g.g_roles").selectAll("g.tick").select("text").filter(function() {
                        return d3.select(this).attr("role") === d.name;
                    });           

                  if(selected_category.attr("selected")) {

                    /* ****** update array of filters ****** */
                    removeElementFromFilter("role", d.name);

                    /* ******* heatmap ******* */

                    selected_axis_labels.attr("selected", null);

                    heatmap_squares
                             .style("stroke", null)
                             .attr("selected", null);

                   /* ******* end heatmap ******* */

                    hideTooltip();

                    role_filter_updated = true;

                    drawGlobal(original_data);

                  } else {

                    // dar highlight no heatmap e fazer update global

                    /* ******* heatmap ******* */

                    selected_axis_labels
                      .attr("selected", "true");

                    // enable elements of the type of role selected
                    heatmap_squares
                        .style("stroke", roles_colors[d.name])
                        .style("stroke-width", "2px")
                        .attr("selected", true);

                    /* ******* end heatmap ******* */

                    updateFilter("role", d.name);

                    role_filter_updated = true;

                    drawGlobal(original_data);

                  }

                } else { // programming languages

                  selected_category = d3.select(this);

                  if(selected_category.attr("selected")) {

                    /* ****** update array of filters ****** */
                    removeElementFromFilter("language", d.name);

                    drawGlobal(original_data);

                  } else {

                    language_filter = filtersArray.find(function(f) {
                      return f.filter === "language";
                    })

                    if(typeof language_filter === "undefined") {

                      //criar filtro
                      filtersArray.push({ "filter": "language", "value": [d.name] });

                    } else { //update filtro
                      updateFilter("language", d.name);
                    }

                    drawGlobal(original_data);

                  }

                }
              });

              // .on("mouseout.parsets", unhighlight)
              // .on("mousedown.parsets", cancelEvent)
          category.merge(categoryEnter).transition().duration(duration)
              .attr("transform", function(d) { return "translate(" + d.x + ")"; })
              .tween("ribbon", ribbonTweenX);

          categoryEnter.append("rect")
              .attr("width", function(d) { return d.dx; })
              .attr("y", function(d) {
                  if((Object.keys(count_roles)).includes(d.name)) {
                    return -20;
                  } else {
                    return 0;
                  }
                })
              .attr("height", 20);
          categoryEnter.append("line")
              .style("stroke-width", 2);
          categoryEnter.append("text")
              .attr("class", d => d.dimension.name)
              .attr("name", function(d) {
                  if(!(Object.keys(count_roles)).includes(d.name)) {
                    return d.name;
                  }
                })
              .attr("y", function(d) {
                  if((Object.keys(count_roles)).includes(d.name)) {
                    return "-.3em";
                  } else {
                    return 16;
                  }
                });
          category.merge(categoryEnter).select("rect")            
              .attr("width", function(d) { return d.dx; })
              // .attr("class", function(d) {
              //   return "category-" + (d.dimension === dimensions[0] ? ordinal(d.name) : "background");
              // })
              .style("fill", function(d) {            
                if((d.dimension === dimensions[0])) {
                  return roles_colors[d.name];
                }
              })              
          category.merge(categoryEnter).select("line")
              .attr("x2", function(d) { return d.dx; });
          category.merge(categoryEnter).select("text")
              .text(truncateText(function(d) { return d.name; }, function(d) { return d.dx; }));
        }
      });
    }

    parsets.dimensionFormat = function(_) {
      if (!arguments.length) return dimensionFormat;
      dimensionFormat = _;
      return parsets;
    };

    parsets.dimensions = function(_) {
      if (!arguments.length) return dimensions_;
      dimensions_ = d3_functor(_);
      return parsets;
    };

    parsets.value = function(_) {
      if (!arguments.length) return value_;
      value_ = d3_functor(_);
      return parsets;
    };

    parsets.width = function(_) {
      if (!arguments.length) return width;
      width = +_;
      return parsets;
    };

    parsets.height = function(_) {
      if (!arguments.length) return height;
      height = +_;
      return parsets;
    };

    parsets.spacing = function(_) {
      if (!arguments.length) return spacing;
      spacing = +_;
      return parsets;
    };

    parsets.tension = function(_) {
      if (!arguments.length) return tension;
      tension = +_;
      return parsets;
    };

    parsets.duration = function(_) {
      if (!arguments.length) return duration;
      duration = +_;
      return parsets;
    };

    parsets.tooltip = function(_) {
      if (!arguments.length) return tooltip;
      tooltip_ = _ == null ? defaultTooltip : _;
      return parsets;
    };

    parsets.categoryTooltip = function(_) {
      if (!arguments.length) return categoryTooltip;
      categoryTooltip = _ == null ? defaultCategoryTooltip : _;
      return parsets;
    };

    var body = d3.select("body");
    var tooltip = body.append("div")
        .style("display", "none")
        .attr("class", "parsets tooltip_parsets");

    return d3.rebind(parsets, event_top, "on").value(1).width(960).height(600);

    function dimensionFormatName(d, i) {
      if(dimensionFormat.call(this, d.name, i) === "q5")
        return "Roles";
      else
        return "Programming Languages";
    }

    function showTooltip(event, html) {
      var m = d3.pointer(event, body.node());
    
      tooltip
          .style("display", null)
          .style("visibility", "visible")
          .style("left", m[0] + 30 + "px")
          .style("top", m[1] - 20 + "px")
          .html(html);
    }

    function hideTooltip() {
      // tooltip.style("display", "none");
      tooltip.style("visibility", "hidden");
    }

    function transition(g) {
      return duration ? g.transition().duration(duration).ease(parsetsEase) : g;
    }

    function layout(tree, dimensions, ordinal) {
      var nodes = [],
          nd = dimensions.length,
          y0 = 45,
          dy = (height - y0 - 2) / (nd - 1);
      dimensions.forEach(function(d, i) {
        d.categories.forEach(function(c) {
          c.dimension = d;
          c.count = 0;
          c.nodes = [];
        });
        d.y = y0 + i * dy;
      });

      var index = 0;

      // Compute per-category counts.
      var total = (function rollup(d, i) {
        if (!d.children) return d.count;
        var dim = dimensions[i],
            total = 0;
        dim.categories.forEach(function(c) {
          // if((Object.keys(count_roles)).includes(c.name)) {
          //   var child = d.children[c.name];
          //   if (!child) return;
          //   child.count = count_roles[Object.keys(count_roles)[i]];
          //   console.log(child);
          // } else {

          // }          
          var child = d.children[c.name];
          if (!child) return;
          c.nodes.push(child);
          var count = rollup(child, i + 1);
          c.count += count;
          total += count;
        });
        return total;
      })(tree, 0);

      // Stack the counts.
      dimensions.forEach(function(d) {
        // console.log(d);
        d.categories = d.categories.filter(function(d) { return d.count; });
        var x = 0,
            p = spacing / (d.categories.length - 1);
        d.categories.forEach(function(c) {
          c.x = x;
          c.dx = c.count / total * (width - spacing);
          c.in = {dx: 0};
          c.out = {dx: 0};
          x += c.dx + p;
        });
      });

      var dim = dimensions[0];
      dim.categories.forEach(function(c) {
        var k = c.name;
        if (tree.children.hasOwnProperty(k)) {
          recurse(c, {node: tree.children[k], path: k}, 1, ordinal(k));
        }
      });

      function recurse(p, d, depth, major) {
        var node = d.node,
            dimension = dimensions[depth];
        dimension.categories.forEach(function(c) {
          var k = c.name;
          if (!node.children.hasOwnProperty(k)) return;
          var child = node.children[k];
          child.path = d.path + "\0" + k;
          var target = child.target || {node: c, dimension: dimension};
          target.x = c.in.dx;
          target.dx = child.count / total * (width - spacing);
          c.in.dx += target.dx;
          var source = child.source || {node: p, dimension: dimensions[depth - 1]};
          source.x = p.out.dx;
          source.dx = target.dx;
          p.out.dx += source.dx;

          child.node = child;
          child.source = source;
          child.target = target;
          child.major = major;
          nodes.push(child);
          if (depth + 1 < dimensions.length) recurse(c, child, depth + 1, major);
        });
      }
      return nodes;
    }

    // Dynamic path string for transitions.
    function ribbonPath(d) {
      var s = d.source,
          t = d.target;
      return ribbonPathString(s.node.x0 + s.x0, s.dimension.y0, s.dx, t.node.x0 + t.x0, t.dimension.y0, t.dx, tension0);
    }

    // Static path string for mouse handlers.
    function ribbonPathStatic(d) {
      var s = d.source,
          t = d.target;
      return ribbonPathString(s.node.x + s.x, s.dimension.y, s.dx, t.node.x + t.x, t.dimension.y, t.dx, tension);
    }

    function ribbonPathString(sx, sy, sdx, tx, ty, tdx, tension) {
      var m0, m1;
      return (tension === 1 ? [
          "M", [sx, sy],
          "L", [tx, ty],
          "h", tdx,
          "L", [sx + sdx, sy],
          "Z"]
       : ["M", [sx, sy],
          "C", [sx, m0 = tension * sy + (1 - tension) * ty], " ",
               [tx, m1 = tension * ty + (1 - tension) * sy], " ", [tx, ty],
          "h", tdx,
          "C", [tx + tdx, m1], " ", [sx + sdx, m0], " ", [sx + sdx, sy],
          "Z"]).join("");
    }

    function compareY(a, b) {
      a = height * a.y, b = height * b.y;
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : a <= a ? -1 : b <= b ? 1 : NaN;
    }
  };
  d3.parsets.tree = buildTree;

  function autoDimensions(d) {
    return d.length ? d3.keys(d[0]).sort() : [];
  }

  function cancelEvent(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  function dimensionName(d) { return d.name; }

  function getTotal(dimensions) {
    // console.log(dimensions[0].categories);
    return dimensions[0].categories.reduce(function(a, d) {
      return a + d.count;
    }, 0);
  }

  // Given a text function and width function, truncates the text if necessary to
  // fit within the given width.
  function truncateText(text, width) {
    return function(d, i) {

      if((Object.keys(count_roles)).includes(d.name)) {
        return map_roles_acronimous[d.name];
      } else {

        var t = this.textContent = text(d, i),
            w = width(d, i);
        if (this.getComputedTextLength() < w) return capitalize(t);
        this.textContent = "…" + t;
        var lo = 0,
            hi = t.length + 1,
            x;
        while (lo < hi) {
          var mid = lo + hi >> 1;
          if ((x = this.getSubStringLength(0, mid)) < w) lo = mid + 1;
          else hi = mid;
        }
        return lo > 1 ? capitalize(t.substr(0, lo - 2)) + "…" : "";
      }
    };
  }

  var percent = d3.format(".1%"),
      // comma = d3.format(",f"),
      comma = d3.format(","),
      parsetsEase = d3.easeElastic,
      parsetsId = 0;

  // Construct tree of all category counts for a given ordered list of
  // dimensions.  Similar to d3.nest, except we also set the parent.
  function buildTree(root, data, dimensions, value) {
    zeroCounts(root);
    var n = data.length,
        nd = dimensions.length;
    for (var i = 0; i < n; i++) {
      var d = data[i],
          v = +value(d, i),
          node = root;
      for (var j = 0; j < nd; j++) {
        var dimension = dimensions[j],
            category = d[dimension],
            children = node.children;
        node.count += v;
        node = children.hasOwnProperty(category) ? children[category]
            : children[category] = {
              children: j === nd - 1 ? null : {},
              count: 0,
              parent: node,
              dimension: dimension,
              name: category
            };
      }
      node.count += v;
    }

    return root;
  }

  function zeroCounts(d) {
    d.count = 0;
    if (d.children) {
      for (var k in d.children) zeroCounts(d.children[k]);
    }
  }

  function identity(d) { return d; }

  function translateY(d) { return "translate(0," + d.y + ")"; }

  function defaultTooltip(d) {

    //hideTooltip();
    
    var count = d.count,
        path = [];
    while (d.parent) {
      if (d.name) path.unshift(capitalize(d.name));
      d = d.parent;
    }
    return path.join(" → ") + "<br>" + comma(count) + " (" + percent(count / d.count) + ")";
  }

  function defaultCategoryTooltip(d) {

    if((Object.keys(count_roles)).includes(d.name)) {
      return d.name + "<br>" + comma(count_roles[d.name]) + " (" + percent(count_roles[d.name] / count_roles.total) + ")";
    } else {
      return capitalize(d.name) + "<br>" + comma(d.count) + " (" + percent(d.count / d.dimension.count) + ")";
    }
  }
  
})();