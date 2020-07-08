import React, { Component } from 'react';
import Launches from './views/Launches';
import Modal from "./views/Modal";
import {create} from "axios";

const fetchUrl = async (rocketId) => {
    const request = create();
    const rocket = await request.get(`https://api.spacexdata.com/v3/rockets/${rocketId}`);
    const {flickr_images, cost_per_launch} = rocket.data;
    const coin = await request.get(`https://api.coindesk.com/v1/bpi/currentprice/USD.json`);
    const {bpi} = coin.data;
    const {rate_float} = bpi.USD;
     return  {
        cost: cost_per_launch/rate_float,
         // gets random image from array
        image: flickr_images[Math.floor(Math.random() * flickr_images.length)]
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            launch: null
        }
    }
    // will be called from the launchDetails
    showModal = async (launch) => {
        const rocket = await fetchUrl(launch.rocket.rocket_id);
        // combine launch object and rocket object
        this.setState({  launch: {...launch, ...rocket } });
    };

    hideModal = () => {
        this.setState({ launch: null });
    };
    render() {
        const {launch} = this.state;
        // create boolean variable to determine showModal
        const show = launch !== null;
        return (
          <main className={`layout`}>
            <section>
              <h2 className={'header'}> SpaceX Launches </h2>
              <Launches showModal={this.showModal} />
            {launch && (<Modal show={show} handleClose={this.hideModal}>
                <p>Rocket Details</p>
                <p>Rocket Type: {launch.rocket.rocket_type}</p>
                <p>Rocket Id: {launch.rocket.rocket_id}</p>
                <p>Launch Cost: {launch.cost}</p>
                <img alt={launch.rocket.description} src={launch.image} />
            </Modal>)}

            </section>
          </main>
        );

    }
}

export default App;
