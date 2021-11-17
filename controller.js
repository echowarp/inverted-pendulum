
function Integrator() {
    var self = this;
    this.last = 0;
    this.area = 0;

    this.add = function(val) {
        self.area += dtBy2 * ( self.last + val ); // TRAPEZOIDS
        self.last = val;
        return self.area;
    }
    this.reset = function() {
        self.last = 0;
        self.area = 0;
    }
}


function Controller() {
    var self = this;
    this.kP = 100.0;
    this.kD = 5.0;
    this.kI = 0;

    this.kPx = 0;
    this.kIx = 0;
    this.kDx = 0;

    this.thetaIntegrator = new Integrator();
    this.posIntegrator = new Integrator();

    this.update = function() {
        // relavent variables:
        // cart.
        //    theta  - angle
        //    thetad - angular velocity
        //    x      - position
        //    xd     - velocity
        // cart.setF: sets the force acting on the cart

        var proportional = -self.kP * cart.theta;
        var integral =  - self.kI * self.thetaIntegrator.add(cart.theta);
        var derivative = - self.kD * cart.thetad;

        var px = self.kPx * cart.x;
        var ix = self.kIx * self.posIntegrator.add(cart.x);
        var dx = self.kDx * cart.xd;
        cart.setF( proportional + integral + derivative + px + ix + dx ); 
    }
}