import React, { Component } from 'react';
import './App.css';
import ReactMapGL, {Marker} from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';

class App extends Component {

  width = 600;
  height = 600;

  state = {
    viewport: {
      width: this.width,
      height: this.height,
      latitude: 43.7577,
      longitude: -80.4376,
      zoom: 8
    },
    origin: {
      lat: 43.466260,
      lon:  -80.547666,
    },
    destination: {
      lat:  43.468948,
      lon:  -80.540021,
    },
    walkSpeed: 1,
    geometry: {
      "type": "LineString",
      "coordinates": [],
    },
  };

  geometrySample = {
    "type": "LineString",
    "coordinates": [
      [-80.547666, 43.466260],
      [-80.540021, 43.468948],
    ]
  }


  componentDidMount() {
    console.log('in onComponentDidRender' + this.state.geometry);
    this.setState({
      geometry: this.geometrySample
    }, this.renderRoute);
  }

  updateViewport(latitude, longitude, zoom) {
    console.log("in updateViewport");
    this.setState({
      viewport: {
        width: this.width,
        height: this.height,
        latitude,
        longitude,
        zoom,
      },
    });
  }

  updateOrigin(lat, lon) {
    this.setState({
      origin: {
        lat,
        lon,
      }
    });
  } 

  updateDestination(lat, lon) {
    this.setState({
      destination: {
        lat,
        lon,
      }
    });
  }

  renderRoute() {
    const map = this.reactMap.getMap();
    map.on('load', () => {
      //add the GeoJSON layer here
      map.addLayer({
        "id": "route",
        "type": "line",
        "source": {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "properties": {},
                "geometry": this.state.geometry,
            }
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "#888",
            "line-width": 3
        }
      })
    });
    map.fitBounds(this.state.geometry.coordinates);
    const viewport = new WebMercatorViewport({width: this.width, height: this.height});
    const bound = viewport.fitBounds(
      this.state.geometry.coordinates,
      {padding: 100}
    );
    const {latitude, longitude, zoom} = bound;
    this.updateViewport(latitude, longitude, zoom);
  }

  onGo() {
    fetch('https://mywebsite.com/endpoint/', { // fill this in
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        origin: this.state.origin,
        destination: this.state.destination,
        speed: this.state.speed,
      })
    }).then((response) => {
      console.log("response: " + response);
      this.setState({
        geometry: response.body.geometry, // todo update this with matching form .. 
      })
    });
  }

  render() {
    return (
      <React.Fragment>
        <header className="App-header" style={{height: 100}}>
          <h1 className="App-title">GooseRoute</h1>
          <p>Honk</p>
        </header>

        <div style={{margin: 10}}>
          <ReactMapGL
            ref={(reactMap) => { this.reactMap = reactMap; }}
            {...this.state.viewport}
            onViewportChange={(viewport) => this.setState({viewport})}
            mapboxApiAccessToken={"pk.eyJ1IjoiZWRkeWlvbmVzY3UiLCJhIjoiY2ptM3Y2amJvMTk5bzNxcWdxOWM5MHdubiJ9.rz-F-5ZhxO_GtGezg-6pDg"}
          >
            <Marker latitude={this.state.origin.lat} longitude={this.state.origin.lon}>
              orig
            </Marker>
            <Marker latitude={this.state.destination.lat} longitude={this.state.destination.lon}>
              dest
            </Marker>
          </ReactMapGL>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
