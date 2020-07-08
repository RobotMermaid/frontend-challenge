import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

class LaunchesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      launches: [],
      loading: false,
      filterTerm: "",
      sort: 'Mission'
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    var api = axios.create();
    api
      .get("https://api.spacexdata.com/v3/launches")
      .then((launches) => {
        this.setState({
          launches: launches.data,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  getContent() {
    if (this.state.loading) {
      return <div> LOADING </div>;
    }

    if (!this.state.launches.length) {
      return <div> NO DATA </div>;
    }

    // add my showModal async/awaits function added to props in app;
    const {showModal} = this.props;
    // new launchDetails array with sorted and filtered results from when DidMount then map in tags
    const launchDetails = this.state.launches.filter((launch) => {
      return launch.mission_name.toLowerCase().includes(this.state.filterTerm.toLowerCase())
    }).sort((a, b) => {
      // filterTerm will be one of Mission or Rocket - default is Mission
      if (this.state.sort === "Rocket") {
        return a.rocket.rocket_name > b.rocket.rocket_name ? 1 : -1;
      }
      return a.mission_name > b.mission_name ? 1 : -1;
    }).map((launch) =>
      (<li className="launch" key={launch.flight_number}>
          <h2> {launch.mission_name} </h2>
          <button type="button" onClick={() => showModal(launch)}>
            Rocket Details
          </button>
          <div> {launch.rocket.rocket_name} </div>
          <div className="launch-details-popup">
            {launch.details || "No details to display"}
          </div>
      </li>)
    );

    return <ul>{launchDetails}</ul>;
  }

  render() {

    var handleFilterChange = (e) => {
      const filterTerm = e.currentTarget.value;
      this.setState({ filterTerm: filterTerm })
    };

    var handleSortClick = (sortBy) => {
      var currentSort = this.state.sort;
      var newSort;
      if (currentSort === 'Rocket') {
        newSort = 'Mission'
      } else {
        newSort = 'Rocket'
      }
      this.setState({ sort: newSort })
    };

    return (
      <div>
        <div className={'search'}>
          <label htmlFor="term-filter">Term:</label>
          <input name="filter" type="text" onChange={handleFilterChange} />
          <button onClick={() => handleSortClick('Rocket')}>Sort by {this.state.sort}</button>
        </div>
        {this.getContent()}
      </div>
    );
  }
}

var mapStateToProps = (state) => state;

var mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(LaunchesView);
