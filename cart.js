
// a class for organizing state information and displaying it

function sign(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; }

function Cart() {
    var self = this;
    this.l = 2.0;

    this.mc = 1.0;
    this.mb = 1.0;
    this.F = 0;
    this.FD = 0;
    this.b = 0;

    this.$cart = $('#cart');
    this.$link = $('#link');
    this.$track = $("#track");

    this.theta = 0;
    this.thetad = 0;
    this.x = 0;
    this.xd = 0;
    this.hscroll = 0;





    // rotate the link
    self.rotateRad = function(angle) { 
        self.theta = angle;
        
        var w = self.$link.outerWidth();
        var h = self.$link.height();
        var centerCoords = [(w/2)+'px', (h-w/2)+'px'];

        self.$link.rotate({
            center: centerCoords,
            angle: -angle * 180 / Math.PI
        });
    }
    self.rotateDeg = function(angle) {
        self.rotateRad(angle * Math.PI / 180)
    }


    // change the link length
    self.setLinkLength = function(L) {
        self.l = L;

        self.$link.height(L*100);
        self.$link.css("margin-top",(-L*100)+"px");

        self.rotateRad(self.theta)
    }
    self.setLinkLength( this.l);


    // move the cart
    self.setPos = function(pos) {
        self.x = pos;

        //virtual scrolling
        var sw = self.$track.width(); // screen width
        var offset = sw / 2 - self.$cart.width()
        var sx = pos * 100 + offset;

        var pad = 90;

        if ( sx < self.hscroll + pad) {
            self.hscroll = sx - pad;
        }
        else if ( sx > self.hscroll + sw -3*pad ) {
            self.hscroll = sx - sw + 3*pad;
        }
        
        sx = sx - self.hscroll;
        

        

        self.$track.css('background-position', -self.hscroll+'px 0');
        $("html").css('background-position', -self.hscroll/2+'px 0');
        self.$cart.css("left",sx+"px");
    }
    this.setPos(this.x);

    self.setF = function(F) {
        self.F = F;

        $("#F-slider").val(  F );
        $("#F-label-val").text( F.toFixed(2) )
    }
}