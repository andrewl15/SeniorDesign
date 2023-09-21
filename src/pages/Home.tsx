import React from 'react';
import logo from '../dna.svg';


function Home() {
    return (
        <div className = "home">
            <center>
                <br></br>
                <br></br>
                <br></br>
            <h1> A Graph Visualization tool for Gene Data</h1>
            <img src={logo} alt="DNA" width="400px"></img>
            </center>
        </div>
    );
}


export default Home;