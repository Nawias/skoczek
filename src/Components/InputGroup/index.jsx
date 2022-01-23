import React from 'react';
import {
  InputGroupContainer,
  VectorInputContainer,
  VectorInput as StyledVectorInput,
  TextInputContainer
} from "./styles";

const VectorInput = ({setValue,value,name}) => {
  return(
    <VectorInputContainer>
      {name}
      <StyledVectorInput>
        <TextInput name={'X'} value={value.x} setValue={(val)=>setValue({x:val, y:value.y})}/>
        <TextInput name={'Y'} value={value.y} setValue={(val)=>setValue({x:value.x, y:val})}/>
      </StyledVectorInput>
    </VectorInputContainer>
  )
}

const TextInput = ({setValue,value,name}) => {
  const handleChange = (event) => {
    setValue(event.target.value)
  }
  return(
    <TextInputContainer>
      {name}
      <input type={'text'} value={value} onChange={handleChange}/>
    </TextInputContainer>
  )
}

const InputGroup = ({initialSpeed, setInitialSpeed,jumpForce, setJumpForce,windForce1, setWindForce1,windForce2, setWindForce2,windForce3, setWindForce3}) => {

  return (
    <InputGroupContainer>
      <TextInput name={'Initial speed'} value={initialSpeed} setValue={setInitialSpeed} />
      <TextInput name={'Jump force'} value={jumpForce} setValue={setJumpForce} />
      <VectorInput name={'Wind 1'} value={windForce1} setValue={setWindForce1} />
      <VectorInput name={'Wind 2'} value={windForce2} setValue={setWindForce2} />
      <VectorInput name={'Wind 3'} value={windForce3} setValue={setWindForce3} />
    </InputGroupContainer>
  )

};



export default InputGroup;