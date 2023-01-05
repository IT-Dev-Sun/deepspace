import React, { useState } from 'react';
import styled from 'styled-components';
import { FormGroup, Label, Input } from "reactstrap";

const InputStyle = styled.div`
  .option-title {
    font-size: 20px;
    margin-right: 5px;
  }
  input[type="radio"] {
    accent-color: green;
    width: 18px;
    height: 18px;
  }
`;

export default function SignUpOption({ title, onChange }) {

  const [maleCheck, setMaleCheck] = useState(false)
  const [femaleCheck, setFemaleCheck] = useState(false)
  const [otherCheck, setOtherCheck] = useState(false)


  const handleChange = (e) => {
    if (e.target.name === 'male') {
      setMaleCheck(true)
      setFemaleCheck(false)
      setOtherCheck(false)
      onChange(e.target.name)
    }
    if (e.target.name === 'female') {
      setMaleCheck(false)
      setFemaleCheck(true)
      setOtherCheck(false)
      onChange(e.target.name)
    }
    if (e.target.name === 'other') {
      setMaleCheck(false)
      setFemaleCheck(false)
      setOtherCheck(true)
      onChange(e.target.name)
    }
  }

  return (
    <InputStyle>
      <div className="pt-4 pb-3 text-center">{title}</div>
      <div className="flex items-center justify-around option-container">
        <FormGroup>
          <Label className='flex items-center'>
            <span className='option-title'>Male</span>
            <Input type="radio" name="male" onChange={handleChange} checked={maleCheck} />
          </Label>
        </FormGroup>
        <FormGroup>
          <Label className='flex items-center'>
            <span className='option-title'>Female</span>
            <Input type="radio" name="female" onChange={handleChange} checked={femaleCheck} />
          </Label>
        </FormGroup>
        <FormGroup>
          <Label className='flex items-center'>
            <span className='option-title'>Other</span>
            <Input type="radio" name="other" onChange={handleChange} checked={otherCheck} />
          </Label>
        </FormGroup>
      </div>
    </InputStyle>
  )
}