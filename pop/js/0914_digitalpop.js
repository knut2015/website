var $section;
var cvs;
var ct;

$(document).ready(function(){
    $( "#tabs" ).tabs();
    $section = $('#previewSale').first();

    backgroundPreview();
    logoPrev();
    logoScale();
    prevCanvas();
    fileDownload();
    textEditer();

    $(".addObj").on('click', function(){
        // textScale();
        $(".panzoom_title").draggable();
    });
});

// preview canvas
function prevCanvas(){
    $(".previewTemp").on('click', function(){
        $("#companyLogo").css('outline', 'none');
        $(".panzoom_title input").hide();
        $(".completeTemp").fadeIn();
        html2canvas($("#previewSale"), {
            onrendered: function(canvas) {
                document.body.appendChild(canvas);

                cvs = canvas;
                canvas.id = 'canvas';
            }
        });
        
        $("#canvas").css({'left': ($(window).width() - 800) / 2 + 'px'});
        $(window).resize(function(){
            $("#preview").css({'width':$(window).width()+'px', 'height':$(window).height()+'px'});
            $("#canvas").css({'left': ($(window).width() - 800) / 2 + 'px'});
        }).trigger('resize');

        $("#preview").fadeIn().on('click', function(){
            $(this).empty().fadeOut();

            $(".completeTemp").fadeOut();
            $("canvas").fadeOut();
            $("#companyLogo").css('outline', '1px dashed silver;');
            $(".panzoom_title input").show();
        });
    });
}

// file download
function fileDownload(){
    $("#download").on('tap', function(){
        // alert(cvs.toDataURL());
         this.href = cvs.toDataURL();
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
    $( ".panzoom_logo" ).draggable();
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

// text edit
function textEditer(){
    $(".textEdit li").on('click', function(){
        var idx = $(this).index();
        var $item = $(".panzoom_title span").eq(getCurrentIdx());

        switch (idx){
            case 0:
            if ($item.hasClass('text-bold')){
                    $item.removeClass('text-bold');
                }else{
                    $item.addClass('text-bold');
                }
                break;
            case 1:
                if ($item.hasClass('text-italic')){
                    $item.removeClass('text-italic');
                }else{
                    $item.addClass('text-italic');
                }
                break;
            case 2:
                if ($item.hasClass('text-underline')){
                    $item.removeClass('text-underline');
                }

                if ($item.hasClass('text-through')){
                    $item.removeClass('text-through');
                }else{
                    $item.addClass('text-through');
                }
                break;
            case 3:
                if ($item.hasClass('text-through')){
                    $item.removeClass('text-through');
                }

                if ($item.hasClass('text-underline')){
                    $item.removeClass('text-underline');
                }else{
                    $item.addClass('text-underline');
                }
                break;
        }
    });
}

var fontScale = 20;
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

    $scope.zi = function(){
        fontScale++;
        $scope.chart.object[getIdx()].amt = fontScale.toString();
    };

    $scope.zo = function(){
        fontScale--;
        $scope.chart.object[getIdx()].amt = fontScale.toString();
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
/*
        $('.panzoom_title').on('click', function(){
            $('.panzoom_title').unbind('click');
            
            $('.panzoom_title').removeClass('active');
            $(this).addClass('active');

            for (var i = 0; i < $(".panzoom_title").size(); i++){
                if ($(".active").length > 0){
                    console.log($(".active").length);
                }
            }

            $('.active').panzoom({
                $zoomIn: $("#tabs-3").find(".zoom-in"),
                $zoomOut: $("#tabs-3").find(".zoom-out"),
                $zoomRange: $("#tabs-3").find(".zoom-range"),
                $reset: $("#tabs-3").find(".reset"),
                startTransform: 'scale(1)',
                minScale: 0.1,
                maxScale: 5,
                increment: 0.1,
                contain: true
            });
            
        });
*/
    };

    $scope.doubleClick = function($index){
        setCurrentIdx($index);
        $(window).resize(function(){
            $("#modal").css({'width':$(window).width()+'px', 'height':$(window).height()+'px'});
            $(".builder-input").css({'top': ($("#previewSale").height() - $(".builder-input").height()) / 2 + 'px', 'left': ($("#previewSale").width() - $(".builder-input").width()) / 2 + 'px'});
        }).trigger('resize');
        
        $(".builder-input").fadeIn();
        $("#modal").fadeIn().on('click', function(){
            $("#modal").fadeOut();
            $(".builder-input").fadeOut();
        });
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

    
});

var idx;

function textScale(){

// console.log($(".panzoom_title").index());
    
    
    $(".panzoom_title").draggable();

    
    

    

    $(".panzoom_title").on('click', function(){
        console.log($(".panzoom_title").index());
        console.log($(".panzoom_title").hasClass('selected-object'));
        idx = $(this).index();
        
        $(".panzoom_title").eq(idx).panzoom({
            $zoomIn: $("#tabs-3").find(".zoom-in"),
            $zoomOut: $("#tabs-3").find(".zoom-out"),
            $zoomRange: $("#tabs-3").find(".zoom-range"),
            $reset: $("#tabs-3").find(".reset"),
            startTransform: 'scale(1)',
            minScale: 0.1,
            maxScale: 5,
            increment: 0.1,
            contain: false
        });
    });

    if ($(".panzoom_title").hasClass('selected-object')){
        // console.log($(this).index());
    }

    
}
//
var idx = 0;
function setIdx(value){
    idx = value;
}
function getIdx(){
    return idx;
}

//
var currentText = 0;
function setCurrentIdx(value){
    currentText = value;
}
function getCurrentIdx(){
    return currentText;
}