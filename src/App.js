import styled from 'styled-components';
import Scene from "./Components/Scene";
import InputGroup from "./Components/InputGroup";
import {useState} from "react";
const AppContainer = styled.div`
  display: flex;
  flex:1;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 100vh;
  margin:0;
  background-color: #3e3e3e;
`

function App() {
  const [initialSpeed, setInitialSpeed] = useState(16);
  const [jumpForce, setJumpForce] = useState(0.7);
  const [windForce1, setWindForce1] = useState({x:-0.02,y:-0.03});
  const [windForce2, setWindForce2] = useState({x:0,y:-0.01});
  const [windForce3, setWindForce3] = useState({x:0.02,y:0.015});
  return (
    <AppContainer>
      <InputGroup initialSpeed={initialSpeed} setInitialSpeed={setInitialSpeed} jumpForce={jumpForce}  setJumpForce={setJumpForce} windForce1={windForce1}  setWindForce1={setWindForce1} windForce2={windForce2}  setWindForce2={setWindForce2} windForce3={windForce3}  setWindForce3={setWindForce3} />
      <Scene initialSpeed={initialSpeed} jumpForce={jumpForce} windForce1={windForce1} windForce2={windForce2} windForce3={windForce3} />
    </AppContainer>
  );
}

export default App;
