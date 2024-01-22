$(function () {

    function isMobile(){
        var UserAgent = navigator.userAgent;
        if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
            return true;
        }else{
            return false;
        }
    }
    function get_pushid() {
        window.ReactNativeWebView.postMessage('');
        window.document.addEventListener('message', function (data) {
            if (data.data) {
                $.ajax({
                    url:'/manager/dashboard/set_push_id',
                    type:'post',
                    data: {
                        subscription_id:data.data
                    },
                    dataType: "json",
                    success:function(obj){
                        if (obj.success) {
                            console.log(obj.success)
                        }
                    }
                })
            }
        })
    }

    if (isMobile()) {
        get_pushid();
    }

    $("button[class='nav-link']").click(function () {
        console.log($(this).data('idx'))

        $("#dynamicTbody").empty();
        $.ajax({
            url:'/manager/dashboard/getWidgetItems',
            type:'post',
            data: {
                widget_idx:$(this).data('idx'),
            },
            dataType: "json",
            success:function(obj){
                if (obj.success) {

                    var html = '';
                    $.each(obj.board_type, function (key, value) {
                        key = key+1;
                        html += "<tr>";
                        var che = '';
                        if (value.display == 'Y') { che = 'checked'; }
                        html += "<td>"+"<input type='checkbox' class='form-check-input' "+che+" name='data"+key+"_display' value='Y' />"+"</td>";
                        html += "<td>"+"<input type='text' class='form-control ps-0' value='"+value.name+"' name='data"+key+"_name' />"+"</td>";
                        html += "<td>"+"<select class='form-select' name='data"+key+"_symbol'>";

                        $.each(obj.symbols, function (key1, value1) {
                            var sel = '';
                            if (value.symbol == value1.symbol) { sel = 'selected'; }
                            html += "<option value='"+value1.idx+"' "+sel+">"+value1.symbol+"</option>";
                        })
                        html +=  "</select>"+"</td>";
                        html += "</tr>";
                    })
                    $("#dynamicTbody").append(html);

                }
            }
        })

        $("[name='idx']").val($(this).data('idx'));
        $("[name='widget_name']").val($(this).data('title'));

        setTimeout(() => $("#modal-widget").modal("show"), 1000);

    });

    $("[name='modal_submit']").click(function () {
        $.ajax({
            url:'/manager/dashboard/widgetNameChange',
            type:'post',
            data:$("[name='frm']").serialize(),
            dataType: "json",
            success:function(obj){
                if (obj.success) {
                    location.reload();
                }
            }
        })
    })


    if (document.getElementById('chartdiv')) {

        $.ajax({
            url:'/manager/dashboard/getChart',
            type:'post',
            data: {
                widget_idx:$("#chartdiv").data('idx')
            },
            dataType: "json",
            success:function(obj){
                var data = []
                var field = []
                $.each(obj.obj, function (key, value) {
                    // console.log(value.date1);
                    var d = value.dates.split(' ');
                    var y = d[0].split('-');
                    var h = d[1].split(':');
                    data.push({
                        date: new Date(y[0], y[1]-1, y[2],h[0],h[1],h[2]).getTime(),

                    });

                    $.each(obj.fields, function (key1, value1) {
                        // console.log(kk+'||'+obj.obj[key][kk])
                        data[key][value1.field] = obj.obj[key][value1.field];
                    })

                })

                // console.log(data)
                $.each(obj.fields, function (key, value) {
                    field.push({
                        fieldDate: value.field,
                        fieldName: value.name,
                    });
                })


                am5.ready(function() {

                    // Create root element
                    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
                    var root = am5.Root.new("chartdiv");

                    // Set themes
                    // https://www.amcharts.com/docs/v5/concepts/themes/
                    root.setThemes([
                        am5themes_Animated.new(root)
                    ]);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





/*



                                                    // Create chart
                            // https://www.amcharts.com/docs/v5/charts/xy-chart/
                            var chart = root.container.children.push(
                                am5xy.XYChart.new(root, {
                                panX: true,
                                panY: true,
                                wheelX: "panX",
                                wheelY: "zoomX",
                                layout: root.verticalLayout,
                                pinchZoomX: true
                                })
                            );
                            
                            // Add cursor
                            // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
                            var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
                                behavior: "none"
                            }));
                            cursor.lineY.set("visible", false);
                            
                            // The data
                            var data = [
                                {
                                year: "1930",
                                italy: 1,
                                germany: 5,
                                uk: 3
                                },
                                {
                                year: "1934",
                                italy: 1,
                                germany: 2,
                                uk: 6
                                },
                                {
                                year: "1938",
                                italy: 2,
                                germany: 3,
                                uk: 1
                                },
                                {
                                year: "1950",
                                italy: 3,
                                germany: 4,
                                uk: 1
                                },
                                {
                                year: "1954",
                                italy: 5,
                                germany: 1,
                                uk: 2
                                },
                                {
                                year: "1958",
                                italy: 3,
                                germany: 2,
                                uk: 1
                                },
                                {
                                year: "1962",
                                italy: 1,
                                germany: 2,
                                uk: 3
                                },
                                {
                                year: "1966",
                                italy: 2,
                                germany: 1,
                                uk: 5
                                },
                                {
                                year: "1970",
                                italy: 3,
                                germany: 5,
                                uk: 2
                                },
                                {
                                year: "1974",
                                italy: 4,
                                germany: 3,
                                uk: 6
                                },
                                {
                                year: "1978",
                                italy: 1,
                                germany: 2,
                                uk: 4
                                }
                            ];
                            
                            // Create axes
                            // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
                            var xRenderer = am5xy.AxisRendererX.new(root, {
                                minorGridEnabled: true
                            });
                            xRenderer.grid.template.set("location", 0.5);
                            xRenderer.labels.template.setAll({
                                location: 0.5,
                                multiLocation: 0.5
                            });
                            
                            var xAxis = chart.xAxes.push(
                                am5xy.CategoryAxis.new(root, {
                                categoryField: "year",
                                renderer: xRenderer,
                                tooltip: am5.Tooltip.new(root, {})
                                })
                            );
                            
                            xAxis.data.setAll(data);
                            
                            var yAxis = chart.yAxes.push(
                                am5xy.ValueAxis.new(root, {
                                maxPrecision: 0,
                                renderer: am5xy.AxisRendererY.new(root, {
                                    inversed: false
                                })
                                })
                            );
                            
                            // Add series
                            // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
                            
                            function createSeries(name, field) {
                                var series = chart.series.push(
                                am5xy.LineSeries.new(root, {
                                    name: name,
                                    xAxis: xAxis,
                                    yAxis: yAxis,
                                    valueYField: field,
                                    categoryXField: "year",
                                    tooltip: am5.Tooltip.new(root, {
                                    pointerOrientation: "horizontal",
                                    labelText: "[bold]{name}[/]\n{categoryX}: {valueY}"
                                    })
                                })
                                );
                            
                            
                                series.bullets.push(function () {
                                return am5.Bullet.new(root, {
                                    sprite: am5.Circle.new(root, {
                                    radius: 5,
                                    fill: series.get("fill")
                                    })
                                });
                                });
                            
                                // create hover state for series and for mainContainer, so that when series is hovered,
                                // the state would be passed down to the strokes which are in mainContainer.
                                series.set("setStateOnChildren", true);
                                series.states.create("hover", {});
                            
                                series.mainContainer.set("setStateOnChildren", true);
                                series.mainContainer.states.create("hover", {});
                            
                                series.strokes.template.states.create("hover", {
                                strokeWidth: 4
                                });
                            
                                series.data.setAll(data);
                                series.appear(1000);
                            }
                            
                           // createSeries(value.fieldDate, value.fieldName);

                            //$.each(field, function (key, value) {

                              //  createSeries(value.fieldDate, value.fieldName);

                                //createSeries(value.fieldDate, value.fieldName);

                            //})

                            createSeries("Italy", "italy");
                           createSeries("Germany", "germany");
                            createSeries("UK", "uk");
                            
                            // Add scrollbar
                            // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
                            chart.set("scrollbarX", am5.Scrollbar.new(root, {
                                orientation: "horizontal",
                                marginBottom: 20
                            }));
                            
                            var legend = chart.children.push(
                                am5.Legend.new(root, {
                                centerX: am5.p50,
                                x: am5.p50
                                })
                            );
                            
                            // Make series change state when legend item is hovered
                            legend.itemContainers.template.states.create("hover", {});
                            
                            legend.itemContainers.template.events.on("pointerover", function (e) {
                                e.target.dataItem.dataContext.hover();
                            });
                            legend.itemContainers.template.events.on("pointerout", function (e) {
                                e.target.dataItem.dataContext.unhover();
                            });
                            
                            legend.data.setAll(chart.series.values);
                            
*/

























































                    // Create chart
                    // https://www.amcharts.com/docs/v5/charts/xy-chart/
                    var chart = root.container.children.push(
                        am5xy.XYChart.new(root, {
                            focusable: true,
                            panX: true,
                            panY: true,
                            wheelX: "panX",
                            wheelY: "zoomX",
                            pinchZoomX:true
                        })
                    );

                    var easing = am5.ease.linear;
                    chart.get("colors").set("step", 3);

                    // Create axes
                    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
                    var xAxis = chart.xAxes.push(
                        am5xy.DateAxis.new(root, {
                            maxDeviation: 0.5,
                            groupData: true,
                            baseInterval: {
                                maxDeviation: 0.1,
                                groupData: false,
                                timeUnit: "minute",
                                count: 1
                            },
                            tooltipDateFormat: "yyyy-MM-dd hh:mm",
                            renderer: am5xy.AxisRendererX.new(root, {
                                minGridDistance: 100, pan:"zoom"
                            }),
                            tooltip: am5.Tooltip.new(root, {})
                        })
                    );

                    var legend = chart.children.push(
                        am5.Legend.new(root, {
                            x: am5.p50,
                            centerX: 300,
                            centerY: am5.m50,
                            y: am5.percent(99),
                        })
                    );


                    function createAxisAndSeries(fieldDate, fieldNamw, opposite) {
                        var yRenderer = am5xy.AxisRendererY.new(root, {
                        //    opposite: opposite
                        });
                        var yAxis = chart.yAxes.push(
                            am5xy.ValueAxis.new(root, {                    // https://www.amcharts.com/docs/v5/reference/valueaxis/
                                visible: true,
                                //maxDeviation: 1,
                                renderer: yRenderer
                            })
                        );

                    //    if (chart.yAxes.indexOf(yAxis) > 0) {
                    //        yAxis.set("syncWithAxis", chart.yAxes.getIndex(0));
                    //    }

                        // Add series
                        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
                        var series = chart.series.push(
                            am5xy.LineSeries.new(root, {
                                name: fieldNamw,
                                xAxis: xAxis,
                                yAxis: yAxis,
                                valueYField: fieldDate,
                                valueXField: "date",
                                tooltip: am5.Tooltip.new(root, {
                                    pointerOrientation: "horizontal",
                                    labelText: "[bold]{name}[/] : {valueY}"
                                })
                            })
                        );

                        //series.fills.template.setAll({ fillOpacity: 0.2, visible: true });
                        series.strokes.template.setAll({ strokeWidth: 1 });

                        yRenderer.grid.template.set("strokeOpacity", 0.05);
                        yRenderer.labels.template.set("fill", series.get("fill"));
                        yRenderer.setAll({
                            stroke: series.get("fill"),
                            strokeOpacity: 1,
                            opacity: 1
                        });

                        // Set up data processor to parse string dates
                        // https://www.amcharts.com/docs/v5/concepts/data/#Pre_processing_data
                        series.data.processor = am5.DataProcessor.new(root, {
                            dateFormat: "yyyy-MM-dd",
                            dateFields: ["date"]
                        });

                        series.data.setAll(data);
                        legend.data.setAll(chart.series.values);

                    }

                    // Add cursor
                    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
                    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
                        xAxis: xAxis,
                        behavior: "none"
                    }));
                    cursor.lineY.set("visible", false);

                    // add scrollbar
                    chart.set("scrollbarX", am5.Scrollbar.new(root, {
                        orientation: "horizontal"
                    }));


                    $.each(field, function (key, value) {
                        if (key % 2) {
                            createAxisAndSeries(value.fieldDate, value.fieldName, false);
                        } else {
                            createAxisAndSeries(value.fieldDate, value.fieldName, true);
                        }
                    })



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                    // Make stuff animate on load
                    // https://www.amcharts.com/docs/v5/concepts/animations/
                    chart.appear(1000, 100);


                }); // end am5.ready()


            }
        })
    }

});