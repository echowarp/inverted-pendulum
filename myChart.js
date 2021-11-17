
$(document).ready(function() {
    
    chart = c3.generate({
        bindto: '#chart',
        data: {
            x: 'time (s)',

            columns: [],

            axes: {
                'theta (rad)': 'y',
                'force (N)': 'y2',
            }
        },
        axis: {
            x: {
                tick: {
                    count: 10,
                    format: function(x) { return x.toFixed(1) },
                    culling: { max: 4 }
                },
                label: "time (s)",
            },
            y: {
                label: "rad or m"
            },
            y2: {
                show: true,
                label: 'Force (N)'
            }
        },
        legend: { position: 'right' },
        tooltip: {
            format: {
                title: function (d) { return 't: ' + d.toFixed(4) + " s"; },
                value: function (d) { return d.toFixed(6); }
            }
        },
        transition: {
            duration: 0
        },
        grid: {
            y: { 
                lines: [{value: 0}] 
            },
            y2: {
                lines: [{value: 0}]
            }
        },
        zoom: {enabled: true}
    });

    chart.resize({height:270, width: 650});

    $("#graph").hide();
    
});


function showCSV(text) {
    var $dialog = $('<div id="dialog"></div>');
    $dialog.text(text);

    $dialog.dialog({
        title: "Simulation Results in Comma-seperated value (CSV) format. Copy into plain text file with '.csv' extensions",
        show: {effect: "blind", duration: 600},
        hide: {effect: "blind", duration: 600},
        width: "90%",
        height: $(window).height() * 0.9,
    }); // jquery UI function
}