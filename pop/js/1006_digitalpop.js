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
    
    $( ".slider-range-min" ).slider({
            range: "min",
            value: 50,
            min: 12,
            max: 100,
    });

    $( ".slider-range-min_logo" ).slider({
            range: "min",
            value: 100,
            min: 12,
            max: 200,
            slide: function( event, ui ) {
                $(".panzoom_logo img").css({'width':ui.value+'%', 'height':ui.value+'%'});
            }
    });
});

// preview canvas
function prevCanvas(){
    $(".previewTemp").on('click', function(){
        $(".companyLogo").css('outline', '0px dashed silver');
        $(".panzoom_title input").hide();
        $(".completeTemp").fadeIn();
        $(".imageContainer").fadeIn();
        $(".grid").css('display', 'none');
        $("body").css('overflow', 'hidden');
        $(".btnCloseModal").fadeIn();

        html2canvas($("#previewSale"), {
            onrendered: function(canvas) {
                document.body.appendChild(canvas);

                cvs = canvas;
                canvas.id = 'canvas';
                $("#prevSaveImg").attr("src", cvs.toDataURL());
            }
        });

        $(window).resize(function(){
            $("#preview").css({'width':100+'%', 'height':$(window).height()+'px'});
            $(".imageContainer").css({'top': 0 + 'px', 'left': 0 + 'px'});
        }).trigger('resize');

        $("#preview").fadeIn().on('click', function(){
            $(this).empty().fadeOut();
            $(".btnCloseModal").empty().fadeOut();
            viewDisabled();
        });

        $(".btnCloseModal").on('click', function(){
            $(this).fadeOut();
            $("#preview").empty().fadeOut();
            viewDisabled();
        });
    });
}

function viewDisabled(){
    $(".grid").css('display', 'block');
    $(".imageContainer").fadeOut();
    $(".completeTemp").fadeOut();
    $("canvas").remove();
    $(".companyLogo").css('outline', '1px dashed silver;');
    $(".panzoom_title input").show();
    $("body").css('overflow', 'auto');
}

// file download
function fileDownload(){
    $("#download").on('mousedown', function(){
        // alert(cvs.toDataURL());
        // this.href = cvs.toDataURL();
        // this.download = 'Template.png';
        // $(this).attr('href', cvs.toDataURL());
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
    var filesUpload = document.getElementById("backImageInput");
    var t = '';

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                t=e.target.result;
                // $(".panzoom_bgImage").append("<img id='backImage'>");
                $('#backImage').attr('src', t);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    $("#backImageInput").change(function(){
        readURL(this);
    }).change();

    $(".removeBg").on('click', function(){
        $("#backImage").attr("src", "");
        $("#fileName").val("");
        t = undefined;
    });
}

// logo preview
function logoPrev(){
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                // $(".panzoom_logo").append("<img class='companyLogo'>");
                $('.companyLogo').attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
    $( ".panzoom_logo" ).draggable();

    $("#logoImg").change(function(){
        readURL(this);
    });

    $(".removeLogo").on('click', function (){
        $(".panzoom_logo img").attr('src', "");
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
            amt: '12',
            done: false
        });
    };

    $scope.selectObject = function($index) {
        $scope.selectedObjectIndex = $index;
        setIdx($index);

        var fs = parseInt($(".panzoom_title").eq(getIdx()).find('span').css('font-size').substr(0));

        $( ".slider-range-min" ).slider({
            range: "min",
            value: fs,
            min: 12,
            max: 100,
            slide: function( event, ui ) {
                $(".panzoom_title").eq(getIdx()).find('span').css('font-size', ui.value+'px');
            }
        });
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
    // $(".panzoom_title").draggable();
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