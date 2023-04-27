import './App.css';
import { Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import ChatRoom from './pages/ChatRoom';

function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact />
      <Route path="/chat" component={ChatRoom} />
    </div>
  );
}

export default App;
