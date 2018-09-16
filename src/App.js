import React, { Component } from 'react';
import './App.css';
import ReactMapGL, {Marker} from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class App extends Component {

  width = 600;
  height = 600;

  sampleResponse = {
    body: {
      itineraries: [
        { // 1
          cost: 5,
          duration: 6,
          startTime: 7,
          endTime: 8,
          segments: [
            { // seg 1
              mode: "mode",
              shape: {
                type: "LineString",
                coordinates: [
                  [-80.547666, 43.466260],
                  [-80.540021, 43.468948],
                ],
              }, // (geojson object to draw),
              startTime: 9,
              endTime: 10,
              duration: 11,
              cost: 12,
            },
            { // seg 2
              mode: "mode2",
              shape: {
                type: "LineString",
                coordinates: [
                  [-80.540021, 43.468948],
                  [-80.524318, 43.473921],
                ],
              }, // (geojson object to draw),
              startTime: 9,
              endTime: 10,
              duration: 11,
              cost: 12,
            },
          ]
        },
      ]
    }
  }

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
    curRoute: null,
    originLocation: '',
    destinationLocation: '',
    routes: null,
  };

  updateViewport() {
    const viewport = new WebMercatorViewport({width: this.width, height: this.height});
    const bound = viewport.fitBounds(
      [[this.state.origin.lon, this.state.origin.lat],[this.state.destination.lon, this.state.destination.lat]],
      {padding: 100}
    );
    const {latitude, longitude, zoom} = bound;
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

  handleChangeOrigin = originLocation => {
    this.setState({ originLocation });
  };

  handleSelectOrigin = originLocation => {
    this.setState({ originLocation });
    geocodeByAddress(originLocation)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        console.log('Success', latLng);
        this.setState({
          origin: {
            lat: latLng.lat,
            lon: latLng.lng,
          },
        }, this.updateViewport);
      })
      .catch(error => console.error('Error', error));
  };
  handleChangeDest = destinationLocation => {
    this.setState({ destinationLocation });
  };

  handleSelectDest = destinationLocation => {
    this.setState({ destinationLocation });
    geocodeByAddress(destinationLocation)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({
          destination: {
            lat: latLng.lat,
            lon: latLng.lng,
          },
        }, this.updateViewport);
      })
      .catch(error => console.error('Error', error));
  };

  // TODO Rachelle fix segment map rendering
  renderRoute() {
    const map = this.reactMap.getMap();
    console.log('curroute coord: ' + JSON.stringify(this.state.curRoute.segments[0].shape));
    // map.on('load', () => {
      //add the GeoJSON layer here
    const segments = this.state.curRoute.segments;
    segments.forEach(seg => {
      map.addLayer({
        "id": "route",
        "type": "line",
        "source": {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "properties": {},
                "geometry": seg.shape,
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
      });
    });
  }

  onReroute() {
    // TODO|eddy
    const formData = new FormData();
    formData.append('startLat', this.state.origin.lat);
    formData.append('startLon', this.state.origin.lon);
    formData.append('endLat', this.state.destination.lat);
    formData.append('endLon', this.state.destination.lon);
    const startLat = this.state.origin.lat;
    const startLon = this.state.origin.lon;
    const endLat = this.state.destination.lat;
    const endLon = this.state.destination.lon;
    // TODO|eddy add in walkSpeed from this.state.speed here
    return fetch(`http://127.0.0.1:5000/?startLat=${startLat}&startLon=${startLon}&endLat=${endLat}&endLon=${endLon}`, { // fill this in
       method: 'POST',
       headers: {
         'Accept': 'application/json',
       },
     }).then((response) => {
    //  let response = this.sampleResponse; // TODO Eddy uncomment so that it uses the actual response
      // TODO Eddy you might need to double check that the shape of the data is exactly as expected
      console.log(response);
      return response.json().then((itineraries => {
        console.log(itineraries);
        return this.setState({
          routes: itineraries,
          curRoute: itineraries[0],
        }, this.renderRoute);
      }));
     }); // TODO EDDY also uncomment
  }

  onClick = () => {
    return this.onReroute();
  }

  renderInputter() {
    return <div style={{margin: 10}}>
      <React.Fragment>
        <label>
          <PlacesAutocomplete
           value={this.state.originLocation}
           onChange={this.handleChangeOrigin}
           onSelect={this.handleSelectOrigin}
         >
           {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
             <div>
               Origin:<input
                 {...getInputProps({
                   placeholder: 'Search Places ...',
                   className: 'location-search-input',
                 })}
               />
               <div className="autocomplete-dropdown-container">
                 {loading && <div>Loading...</div>}
                 {suggestions.map(suggestion => {
                   const className = suggestion.active
                     ? 'suggestion-item--active'
                     : 'suggestion-item';
                   // inline style for demonstration purpose
                   const style = suggestion.active
                     ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                     : { backgroundColor: '#ffffff', cursor: 'pointer' };
                   return (
                     <div
                       {...getSuggestionItemProps(suggestion, {
                         className,
                         style,
                       })}
                     >
                       <span>{suggestion.description}</span>
                     </div>
                   );
                 })}
               </div>
             </div>
           )}
         </PlacesAutocomplete>
        </label>
        <label>
        <PlacesAutocomplete
         value={this.state.destinationLocation}
         onChange={this.handleChangeDest}
         onSelect={this.handleSelectDest}
       >
         {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
           <div>
             Destination:<input
               {...getInputProps({
                 placeholder: 'Search Places ...',
                 className: 'location-search-input',
               })}
             />
             <div className="autocomplete-dropdown-container">
               {loading && <div>Loading...</div>}
               {suggestions.map(suggestion => {
                 const className = suggestion.active
                   ? 'suggestion-item--active'
                   : 'suggestion-item';
                 // inline style for demonstration purpose
                 const style = suggestion.active
                   ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                   : { backgroundColor: '#ffffff', cursor: 'pointer' };
                 return (
                   <div
                     {...getSuggestionItemProps(suggestion, {
                       className,
                       style,
                     })}
                   >
                     <span>{suggestion.description}</span>
                   </div>
                 );
               })}
             </div>
           </div>
         )}
       </PlacesAutocomplete>
       </label>
      </React.Fragment>
    </div>
  }

  renderTable() {
    return this.state.routes ?
      <Table>
        <TableHead>
          <TableRow>
            <TableCell numeric>Cost</TableCell>
            <TableCell numeric>Duration</TableCell>
            <TableCell numeric>Start Time</TableCell>
            <TableCell numeric>End Time</TableCell>
            <TableCell>Segments</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.routes.map((route, ind) =>
            <TableRow key={ind}>
              <TableCell numeric>{route.cost}</TableCell>
              <TableCell numeric>{route.duration}</TableCell>
              <TableCell numeric>{route.startTime}</TableCell>
              <TableCell numeric>{route.endTime}</TableCell>
              <TableCell component="th" scope="row">
                {route.segments.map((seg, segInd) =>
                  <div key={segInd}>
                    <header style={{fontWeight: "bold"}}>
                      Segment {segInd}
                    </header>
                    By: {seg.mode},
                    From: {JSON.parse(seg.shape).coordinates[0]},
                    To: {JSON.parse(seg.shape).coordinates[1]},
                    Start Time: {seg.startTime},
                    End Time: {seg.endTime},
                    Duration: {seg.duration},
                    Cost: {seg.cost}
                  </div>
                )}
              </TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
      : null;
  }

  renderMap() {
    return <div style={{margin: 10}}>
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
  }

  render() {
    return (
      <React.Fragment>
        <header className="App-header" style={{height: 100}}>
          <h1 className="App-title">GooseRoute</h1>
          <p>Honk</p>
        </header>
        {this.renderInputter()}
        <button style={{marginLeft: 10}} onClick={() => this.onClick()}>
          SEE ROUTES
        </button>
        {this.renderTable()}
        {this.renderMap()}
      </React.Fragment>
    );
  }
}

export default App;
