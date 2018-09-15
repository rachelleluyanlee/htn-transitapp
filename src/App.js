import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactMapGL from 'react-map-gl';

class App extends Component {

  state = {
    viewport: {
      width: 400,
      height: 400,
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8
    },
    inputs: {
      origin: {
        lat: 0,
        lon: 0,
        speed: 0,
      },
      destination: {
        lat: 0,
        lon: 0,
        speed: 0,
      },
    }
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
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <form onSubmit={this.handleSubmit}>
          <label>
            Origin:
            <input type="text" value={this.state.origin} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={(viewport) => this.setState({viewport})}
         mapboxApiAccessToken={"pk.eyJ1IjoiZWRkeWlvbmVzY3UiLCJhIjoiY2ptM3Y2amJvMTk5bzNxcWdxOWM5MHdubiJ9.rz-F-5ZhxO_GtGezg-6pDg"}
      />
      </div>
    );
  }
}

export default App;
