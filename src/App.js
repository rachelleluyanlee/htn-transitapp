import React, { Component } from 'react';
import './App.css';
import ReactMapGL, {Marker} from 'react-map-gl';

class App extends Component {

  state = {
    viewport: {
      width: 600,
      height: 600,
      latitude: 43.7577,
      longitude: -80.4376,
      zoom: 8
    },
    origin: {
      lat: 43.466260,
      lon:  -80.547666,
      speed: 0,
    },
    destination: {
      lat:  43.468948,
      lon:  -80.540021,
      speed: 0,
    },
  };

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

  render() {
    return (
      <React.Fragment>
        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={(viewport) => this.setState({viewport})}
          mapboxApiAccessToken={"pk.eyJ1IjoiZWRkeWlvbmVzY3UiLCJhIjoiY2ptM3Y2amJvMTk5bzNxcWdxOWM5MHdubiJ9.rz-F-5ZhxO_GtGezg-6pDg"}
        >
          <Marker latitude={this.state.origin.lat} longitude={this.state.origin.lon}>
            <div>0</div>
          </Marker>
          <Marker latitude={this.state.destination.lat} longitude={this.state.destination.lon}>a</Marker>
        </ReactMapGL>
      </React.Fragment>
    );
  }
}

export default App;
