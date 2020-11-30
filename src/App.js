import React, { Component }  from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import styled from 'styled-components';
import Main from './main';



const AppWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  height: inherit;
  flex-direction: column;
`;

class App extends Component {
  render(){
    return (
    <AppWrapper>
      <Router>
        <link
          rel='stylesheet'
          href='https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'
          integrity='sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T'
          crossOrigin='anonymous' />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <Switch>
          <Route exact path='/' component={Main}/>
        </Switch>
      </Router>
    </AppWrapper>

    );
  }
}

export default App;