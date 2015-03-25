var $section;
var canvas;
var ct;

$(document).ready(function(){
    $( "#tabs" ).tabs();
    $section = $('#previewSale').first();

    backgroundPreview();
    logoPrev();
    logoScale();
    prevCanvas();
    fileDownload();
});

// preview canvas
function prevCanvas(){
    $(".previewTemp").on('click', function(){
        $("#companyLogo").css('outline', 'none');
        $(".panzoom_title input").css('display', 'none');
        $(".completeTemp").fadeIn();
        html2canvas($("#previewSale"), {
            onrendered: function(canvas) {
                document.body.appendChild(canvas);
                canvas.id = 'canvas';

                canvas = document.getElementById('canvas');
                ct = canvas.getContext('2d');

                // $("#download").on('mousedown', function(){
                //     // var oImgPNG = Canvas2Image.saveAsPNG(canvas, true);
                //     // var strDataURI = oCanvas.toDataURL();
                //     Canvas2Image.saveAsImage(canvas, 800, 1000, 'png');
                // });
            }
        });
        
        $("#preview").css({'width':$(window).width()+'px', 'height':$(window).height()+'px'}).fadeIn().on('click', function(){
            $(this).empty().fadeOut();

            $(".completeTemp").fadeOut();
            $("canvas").fadeOut();
            $("#companyLogo").css('outline', '1px dashed silver;');
            $(".panzoom_title input").css('display', 'block');
        });
    });
}

// file download
function fileDownload(){
    $("#download").on('mousedown', function(){
//         var oImgPNG = Canvas2Image.saveAsPNG(canvas_2, true);

//         var img = new Image();
//         img.src = document.getElementById('canvas').toDataURL();
//         img.onload = function(){
//             ct_2.drawImage(img, 100, 50, 300, 200);
//         };
//         $("#canvas_2").css('left', 0);

        // $("#imgs").appendChild(Canvas2Image.convertToImage('canvas', 800, 1000, 'png'));
console.log(document.getElementById('canvas').toDataURL());
         this.href = document.getElementById('canvas').toDataURL();
         this.download = 'Template.png';
    });
}


// color list - angular controller
function colorCtrl($scope, $window){
    $scope.module = {};
    $scope.module.group = {};
    $scope.module.group.items = [
        {name:'black'},
        {name:'white'},
        {name:'silver'},
        {name:'gray'},
        {name:'red'},
        {name:'yellow'},
        {name:'blue'},
        {name:'skyblue'},
        {name:'orange'},
        {name:'orangeRed'},
        {name:'green'}
    ];

    $scope.clickColor = function($event, name) {
        $(".panzoom_bgImage").css('background-color', name);
    };
}

// text color list - angular controller
function colorTextCtrl($scope, $window){
    $scope.module = {};
    $scope.module.group = {};
    $scope.module.group.items = [
        {name:'black'},
        {name:'white'},
        {name:'silver'},
        {name:'gray'},
        {name:'red'},
        {name:'yellow'},
        {name:'blue'},
        {name:'skyblue'},
        {name:'orange'},
        {name:'orangeRed'},
        {name:'green'}
    ];

    $scope.clickColor = function($event, name, $index) {
        $(".panzoom_title").eq(getCurrentIdx()).css('color', name);
    };
}

// background preview image
function backgroundPreview(){
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $(".panzoom_bgImage").append("<img id='backImage'>");
                $('#backImage').attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    $("#backImageInput").change(function(){
        readURL(this);
    });

    $(".removeBg").on('click', function(){
        $(".panzoom_bgImage").empty();
        $("#fileName").val("");
    });
}

// logo preview
function logoPrev(){
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $(".panzoom_logo").append("<img id='companyLogo'>");
                $('#companyLogo').attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    $("#logoImg").change(function(){
        readURL(this);
    });

    $(".removeLogo").on('click', function (){
        $(".panzoom_logo").empty();
        $("#logoName").val("");
    });
}

// logo scale
function logoScale(){
    $section.find('.panzoom_logo').panzoom({
        $zoomIn: $("#tabs-2").find(".zoom-in"),
        $zoomOut: $("#tabs-2").find(".zoom-out"),
        $zoomRange: $("#tabs-2").find(".zoom-range"),
        $reset: $("#tabs-2").find(".reset"),
        startTransform: 'scale(1)',
        minScale: 0.1,
        maxScale: 2,
        increment: 0.1,
        contain: false
    });
}

angular.module('test', []).controller('AppCtrl', function($scope) {

    $scope.chart = {
        object: []
    };
    
    $scope.selectedObjectIndex = null;
    
    $scope.addObject = function() {
        $scope.chart.object.push({
            label: 'New Description',
            amt: '20',
            done: false
        });
    };
    
    $scope.selectObject = function($index) {
        $scope.selectedObjectIndex = $index;
        setIdx($index);

        var startX = 0, startY = 0;
        $(".panzoom_title").eq(getIdx()).css({'position':'absolute', 'cursor':'pointer'});

        $(".panzoom_title").eq(getIdx()).on('mousedown', function(event){
            event.preventDefault();
            startX = event.pageX - $(".panzoom_title").eq(getIdx()).position().left;
            startY = event.pageY - $(".panzoom_title").eq(getIdx()).position().top;

            $(document).on('mousemove', mousemove);
            $(document).on('mouseup', mouseup);
        });

        function mousemove(event) {
            y = event.pageY - startY;
            x = event.pageX - startX;
            
            $(".panzoom_title").eq(getIdx()).css({
              top: y + 'px',
              left:  x + 'px'
            });
          }
     
          function mouseup(event) {
            $(document).unbind('mousemove', mousemove);
            $(document).unbind('mouseup', mouseup);
          }
    };

    $scope.doubleClick = function($index){
        setCurrentIdx($index);
        $("#modal").css({'width':$(window).width()+'px', 'height':$(window).height()+'px'}).fadeIn()
        .on('click', function(){
            $("#modal").fadeOut();
            $(".builder-input").fadeOut();
        });
        $(".builder-input").css({'top':$(".panzoom_title").eq(getIdx()).position().top + 170 + 'px', 'left':$(".panzoom_title").eq(getIdx()).position().left + 'px'}).fadeIn();
    };

    $scope.ok = function($widget){
        for (var i = 0; i < $widget.length; i++){
            Debugger.log($widget[i].label);
        }
    };

    $scope.del = function($widget){
        for (var i = $scope.chart.object.length - 1; i >= 0; i--){
            if ($scope.chart.object[i].done){
                $scope.chart.object.splice(i, 1);
            }
        }
    };

    //
    var idx = 0;
    function setIdx(value){
        idx = value;
    }
    function getIdx(){
        return idx;
    }
});

//
var currentText = 0;
function setCurrentIdx(value){
    currentText = value;
}
function getCurrentIdx(){
    return currentText;
}