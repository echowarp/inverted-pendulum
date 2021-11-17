

function cos(theta) { 
    return Math.cos( theta );
}
function sin(theta) { 
    return Math.sin( theta );
}



function blankData() {
    return {
        'columns': [
            ['time (s)'],
            ['theta (rad)'],
            ['omega (rad/s)'],
            ['force (N)'],
            ['x (m)'],
        ]
    }
}

data = new blankData();


function Simulation() {
    var self = this; 


    this.update = function() {

        // update the DT
        self.now = new Date() / 1000;
        dt = self.now - self.lastTime;
        if ( dt > 0.04 ) { dt = 0.04; console.log("big timestep") }
        dtBy2 = dt / 2;
        self.lastTime = self.now;
        self.elapsed += dt;

        
        controller.update();  // run PID controls
        self.stepPhysics();   // simulate physics


        
        

        skipTextDisplay += 1;
        if ( skipTextDisplay > 2 ) {
            skipTextDisplay = 0;
            $("#x input").val( cart.x.toFixed(2) );
            $("#v input").val( cart.xd.toFixed(2) );
            $("#theta input").val( cart.theta.toFixed(2) );
            $("#omega input").val( cart.thetad.toFixed(2) );
        }


        data.columns[0].push( self.elapsed );
        data.columns[1].push( cart.theta );
        data.columns[2].push( cart.thetad );
        data.columns[3].push( cart.F );
        data.columns[4].push( cart.x );

        /*
        skipGraphDisplay += 1;
        if ( skipGraphDisplay > 5 ) {
            skipGraphDisplay=0;
            chart.load(data);
        }
        */
    }

    this.start = function() {
        skipTextDisplay = 0;
        skipGraphDisplay = 0;

        self.elapsed = 0;

        data = new blankData();

        self.lastTime = new Date() / 1000 - 0.02; // fake a delta T for the first one
        self.interval = setInterval( self.update, 20 );
    }
    this.resume = function() {
        self.lastTime = new Date() / 1000 - 0.02; // fake a delta T for the first one
        self.interval = setInterval( self.update, 20 );
    }
    
    this.stop = function() {
        clearInterval( self.interval )

        $("#graph").show();
        chart.load(data);


        // file download button
        var date = new Date();

        text = 'Pendulum block mass,' + cart.mb;
        text += '\nCart mass,'+ cart.mc;
        text += '\nPendulum length,' + cart.l;
        text += '\nDownloaded,' + date.toLocaleString();
        text += '\n'
        text += '\nkP,' + controller.kP;
        text += '\nkI,' + controller.kI;
        text += '\nkD,' + controller.kD;
        text += '\n\n'
        for ( var i = 0; i < data.columns[0].length; i++ ) {
            text += data.columns[0][i];
            text += ',';
            text += data.columns[1][i];
            text += ',';
            text += data.columns[2][i];
            text += ',';
            text += data.columns[3][i];
            text += ',';
            text += data.columns[4][i];
            text += '\n';
        }
        $("#download").attr('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        $("#download").attr('download', "InvertedPendulumSim.csv");

        $("#showData").click(function() {
            showCSV(text);
        });
        
        setTimeout(function() {
            chart.hide('x (m)')
        }, 3000)
    }

    /////////////////////////////////////
    // physics simulation

    this.calcDynamics = function(state) {
        // xd, x, thetad, theta

        var xd = state[0];
        var x = state[1]
        var thetad = state[2];
        var theta = state[3];

        var M = cart.mc + cart.mb;
        var g = -9.81;


        var F =  cart.F + cart.FD - cart.xd * cart.b;

        var n = F - cart.mb * cos(theta) * g * sin(theta) - cart.mb * cart.l * thetad * thetad * sin(theta);
        var d =  M - cart.mb * cos(theta)*cos(theta);
        var xdd = n/d;
        var thetadd = ( xdd * cos(theta) - g * sin(theta) ) / cart.l;

        return [xdd, xd, thetadd, thetad];
    }

    this.stepPhysics = function() {
        state = [ cart.xd, cart.x, cart.thetad, cart.theta ];
        iState = [0,0,0,0];
        

        // do RK4
        rhs0 = self.calcDynamics( state );
        for ( st=0; st< state.length; st++ ) {
            iState[st] = state[st] + rhs0[st] * dtBy2;
        }
        
        rhs1 = self.calcDynamics( iState );
        for ( st=0; st< state.length; st++ ) {
            iState[st] = state[st] + rhs1[st] * dtBy2;
        }
        
        rhs2 = self.calcDynamics( iState );
        for ( st=0; st< state.length; st++ ) {
            iState[st] = state[st] + rhs2[st] * dt;
        }
        
        rhs3 = self.calcDynamics( iState );
        
        for ( st=0; st< state.length; st++ ) {
            iState[st] = state[st] + 
                (    rhs0[st]
                +2.0*rhs1[st]
                +2.0*rhs2[st]
                +    rhs3[st]
                )/6.0 * dt;
        }

        cart.xd = iState[0];
        cart.setPos( iState[1] );
        cart.thetad = iState[2];
        cart.rotateRad( iState[3] );
    }
}