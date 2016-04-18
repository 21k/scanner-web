angular.module('ngprogressBar', []).directive('progressBar', ['$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var bar = new ProgressBar.Line(element[0], {
                    strokeWidth: 4,
                    easing: 'easeInOut',
                    color: '#FFEA82',
                    trailColor: '#eee',
                    trailWidth: 1,
                    svgStyle: {width: '100%', height: '100%'},
                    from: {color: '#FFEA82'},
                    to: {color: '#ED6A5A'},
                    step: (state, bar) => {
                        bar.path.setAttribute('stroke', state.color);
                    }
                });
                scope.$watch(function(){
                    return scope.info.progress
                },function(n){
                    bar.set(parseFloat(n)/100||0)
                })
            }
        }
    }
]);
