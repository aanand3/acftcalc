import './App.css';
import EventSlider from './Components/EventSlider';
import MDLFile from './Reference/MDLData.txt';
import SPTFile from './Reference/SPTData.txt';
import HRPFile from './Reference/HRPData.txt';
import SDCFile from './Reference/SDCData.txt'
import TimeSlider from './Components/TimeSlider';


function App()
{
  return (
    <div className="App">
      <header className="App-header">
        <EventSlider
          eventName="Deadlift"
          min={130}
          max={340}
          step={10}
          fileName={MDLFile}
        />
        <EventSlider
          eventName="Power Throw"
          min={4.3}
          max={12.5}
          step={0.1}
          fileName={SPTFile}
        />
        <EventSlider
          eventName="Hand-Release Pushups"
          min={8}
          max={60}
          step={1}
          fileName={HRPFile}
        />
        <TimeSlider
          eventName="Sprint-Drag-Carry"
          min={93}
          max={215}
          step={1}
          fileName={SDCFile}
        />
      </header>

    </div>
  );
}

export default App;
