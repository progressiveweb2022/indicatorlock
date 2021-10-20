angular.module(module.name).directive(current.name, ['$compile', 'googleMapSrvc', function(compile, googleMapSrvc) {
    return {
        restrict: 'EA',
        replace: true,
        template: '<div></div>',
        scope: {
            markerOption: '=markers'
        },

        link: function(scope, element, attrs) {
            googleMapSrvc.init().then(function() {
                var map = new google.maps.Map(element.get(0)),
                    bounds = new google.maps.LatLngBounds();
                map.setOptions({
                    styles: [{
                        "featureType": "road.highway",
                        "elementType": "labels",
                        "stylers": [{
                            "hue": "#ffffff"
                        }, {
                            "saturation": -100
                        }, {
                            "lightness": 100
                        }, {
                            "visibility": "off"
                        }]
                    }, {
                        "featureType": "landscape.natural",
                        "elementType": "all",
                        "stylers": [{
                            "hue": "#ffffff"
                        }, {
                            "saturation": -100
                        }, {
                            "lightness": 100
                        }, {
                            "visibility": "on"
                        }]
                    }, {
                        "featureType": "road",
                        "elementType": "all",
                        "stylers": [{
                            "hue": "#ffe94f"
                        }, {
                            "saturation": 100
                        }, {
                            "lightness": 4
                        }, {
                            "visibility": "on"
                        }]
                    }, {
                        "featureType": "road.highway",
                        "elementType": "geometry",
                        "stylers": [{
                            "hue": "#ffe94f"
                        }, {
                            "saturation": 100
                        }, {
                            "lightness": 4
                        }, {
                            "visibility": "on"
                        }]
                    }, {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [{
                            "hue": "#333333"
                        }, {
                            "saturation": -100
                        }, {
                            "lightness": -74
                        }, {
                            "visibility": "off"
                        }]
                    }]
                });

                scope.$watchCollection('markerOption', function(markerOption) {
                    if (markerOption) {
                        var latLgn = new google.maps.LatLng(markerOption.location.lat, markerOption.location.lng);
                        bounds.extend(latLgn);

                        var marker = new google.maps.Marker({
                            position: latLgn,
                            map: map,
                            title: markerOption.company,
                            shadow: null,
                            animation: google.maps.Animation.DROP,
                            icon: './img/piggy.png'
                        });

                        map.fitBounds(bounds);
                    }
                });
            });
        }
    };
}]);
