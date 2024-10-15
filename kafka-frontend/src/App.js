import Messager from './Components/Messager.tsx';
import KafkaProvider from './KafkaUtil/KafkaProvider.tsx';
import './App.css';

function App() {
  return (
    <div className="App">
      <KafkaProvider>
        <Messager></Messager>
      </KafkaProvider>
    </div>
  );
}

export default App;
