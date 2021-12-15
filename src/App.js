import styled from 'styled-components';
import Scene from "./Components/Scene";
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
  return (
    <AppContainer>
      <p>What a beautiful world</p>
      <Scene />
    </AppContainer>
  );
}

export default App;
