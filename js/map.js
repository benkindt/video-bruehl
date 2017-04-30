(function() {
	// the standard view of the map
	var mapView = new ol.View({
		center : ol.proj.fromLonLat([ 12.925105, 50.843074 ]),
		rotation : 2.28 * Math.PI / 6,
		zoom : 16
	});
	
	var vectorSource = new ol.source.Vector({
	// create empty vector
	});

	// create a bunch of icons and add to source vector
	
	function addMarker(coordinates, target){
		var geom = new ol.geom.Point( ol.proj.transform(coordinates, 'EPSG:4326', 'EPSG:3857') );
		var iconFeature = new ol.Feature({
			geometry : geom });
		target.addFeature(iconFeature);
	}
	
	addMarker([12.925105, 50.843074], vectorSource);
	addMarker([13.088624, 50.872904], vectorSource);

	// create the style
	var iconStyle = new ol.style.Style({
		image : new ol.style.Icon(/** @type {olx.style.IconOptions} */
		({
			anchor : [ 0.5, 46 ],
			anchorXUnits : 'fraction',
			anchorYUnits : 'pixels',
			opacity : 0.75,
			src : '../data/img/camera.png'
		}))
	});

	// add the feature vector to the layer vector, and apply a style to whole
	// layer
	var vectorLayer = new ol.layer.Vector({
		source : vectorSource,
		style : iconStyle
	});
	
	var mapLayer = new ol.layer.Tile({
		source : new ol.source.OSM()
	});

	var map = new ol.Map({
		layers : [ mapLayer, vectorLayer ],
		target : document.getElementById('mapid'),
		view : mapView
	});
	
	function resetView() {
		map.setView(mapView);
	}

	$("#resetViewButton").click(resetView);
})();