
function bindInputs() {
    $("#kP input").change(function() {
        controller.kP = parseFloat( $("#kP input").val() );
    });
    $("#kI input").change(function() {
        controller.kI = parseFloat( $("#kI input").val() );
    });
    $("#kD input").change(function() {
        controller.kD = parseFloat( $("#kD input").val() );
    });

    $("#kPx input").change(function() {
        controller.kPx = parseFloat( $("#kPx input").val() );
    });
    $("#kIx input").change(function() {
        controller.kIx = parseFloat( $("#kIx input").val() );
    });
    $("#kDx input").change(function() {
        controller.kDx = parseFloat( $("#kDx input").val() );
    });




    $("#x input").change(function() {
        cart.setPos( parseFloat( $("#x input").val() ) );
    });
    $("#v input").change(function() {
        cart.xd = parseFloat( $("#v input").val() )
    });
    $("#theta input").change(function() {
        cart.rotateRad( parseFloat( $("#theta input").val() ) );
    });
    $("#omega input").change(function() {
        cart.thetad = parseFloat( $("#omega input").val() )
    });

    $("#mc input").change(function() {
        cart.mc = parseFloat( $("#mc input").val() );
        $("#cartWlabel").text(cart.mc + 'kg');
    });
    $("#mb input").change(function() {
        cart.mb = parseFloat( $("#mb input").val() );
        $("#weight").text(cart.mb + 'kg');
    });
    $("#l input").change(function() {
        cart.setLinkLength( parseFloat( $("#l input").val() ) )
    });

    $("#b input").change(function() {
        cart.b = parseFloat( $("#b input").val() );
    });
    $("#FD input").change(function() {
        cart.FD =parseFloat( $("#FD input").val() );
    });


    $("#time input").change(function() {
        var t = parseFloat( $("#time input").val() );

        if ( isNaN(t) ) {
            $("#time input").val('Inf')
        }
    })
}



// start or stop the simulation
function startStop() {
    

    var $button = $("#startStop");
    var action = $button.attr("value");

    // tasks only for a fresh simulate
    if ( action == "Simulate" ) {
        originalStates['x'] = cart.x;
        originalStates['xd'] = cart.xd;
        originalStates['theta'] = cart.theta;
        originalStates['thetad'] = cart.thetad;

        
        simulation.start();
    }
    else if ( action == "Continue" ) { simulation.resume(); }

    if ( action == "Simulate" || action == "Continue" ) {

        $button.attr("value", "Stop");

        $("#reset").hide();
        $("#time").fadeOut(200);

        
        chart.unload();
        $("#graph").hide(300);

        // unbind the change event
        $("#settings .input-text").off("change").prop('disabled',true);


        

        var runtime = parseFloat( $("#time input").val() ); 
        if ( ! isNaN(runtime) ) {
            runTimeout = setTimeout( startStop, runtime * 1000.0 );
        }
    }
    else {
        simulation.stop();

        clearTimeout(runTimeout);

        $button.fadeIn(500);
        $("#time").fadeIn(500);
        $("#reset").fadeIn(500);

        $button.attr("value", "Continue");

        $("#settings .input-text").prop('disabled',false);
        bindInputs();

        $("#reset").click(function() {
            $button.attr("value", "Simulate");

            $('#x       input').val( originalStates['x'] ).change();
            $('#v      input').val( originalStates['xd'] ).change();
            $('#theta   input').val( originalStates['theta'] ).change();
            $('#omega  input').val( originalStates['thetad'] ).change();
            $('#F-slider').val(0);
            cart.F = 0;
            controller.thetaIntegrator.reset();
            controller.posIntegrator.reset();


            $('#graph').hide(500);
            $('#reset').hide(300);

        })
        
    }
}



function initSettings() {
    originalStates = {}; // define as global for startStop
    

    $("#startStop").click(startStop);

    $("#eq-pos").hide();
    $("#kPx, #kIx, #kDx").hide();
    $('#control-x').click(function() {
        $("#eq-Itheta, #eq-pos").clearQueue();

        if ( $('#control-x').is(':checked') ) {
            $("#eq-Itheta, #kI").hide(300, function() { $('#eq-pos, #kPx, #kIx, #kDx').show(300); });

            controller.kI = 0;
            controller.kPx = parseFloat( $("#kPx input").val() );
            controller.kIx = parseFloat( $("#kIx input").val() );
            controller.kDx = parseFloat( $("#kDx input").val() );
        }
        else {
            $("#eq-pos, #kPx, #kIx, #kDx").hide(300, function() { $("#eq-Itheta, #kI").show(300); });

            controller.kI = parseFloat( $("#kI input").val() );
            controller.kPx = 0;
            controller.kDx = 0;
            controller.kIx = 0;
        }
    })


    bindInputs(); // attach event listeners to the inputs
    $("#x input, #v input, #theta input, #omega input").trigger("change"); // override JavaScript values with HTML ones
    $("#kP input, #kI input, #kD input").trigger("change"); // override JavaScript values with HTML ones
}
