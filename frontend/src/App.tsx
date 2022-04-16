import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import NewsScreen from './screens/NewsScreen';

function App() {
  return (
    <Router>
      App

      <Switch>
        <Container className="App">
          <Route path="/" exact component={NewsScreen} />
        </Container>
      </Switch>

    </Router>
    
  );
}

export default App;
