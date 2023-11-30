import React, { useState } from 'react';
import Graph from './graph.tsx';
import CustomSlider from '../Components/CustomSlider.tsx';
import Select, { MultiValue } from 'react-select'
import { Input } from '@chakra-ui/react';

export interface IHomeProps {
}

export default function Home (props: IHomeProps) {
  const [danceabilityValue, setDancebilityValue] = useState(50);
  const [speechinessValue, setSpeechinessValue] = useState(50);
  const [selectedOptions, setSelectedOptions ] = useState<MultiValue<{
    value: string;
    label: string;
}>>([]);
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

  return (
    <div style={{flex:1}}>
    <div style={styles.parentContainer}>
        <Graph/>
      <div style={styles.cotainer}>
          <div style={{width: '100%', display:'flex', alignItems:'start', flexDirection:'column'}}>
            <p style={{float:'left'}}>Genres</p>
            <div style={{width: '100%', maxWidth: 400}}>
              <Select options={options} isMulti isSearchable onChange={(newValue) => setSelectedOptions(newValue)} />
            </div>
         </div>
          <div style={{width: '100%'}}>
            <p style={{float:'left'}}>Dancability</p>
            <CustomSlider setSliderValue={setDancebilityValue} sliderValue={danceabilityValue}/>
         </div>
          <div style={{width: '100%'}}>
            <p style={{float:'left'}}>Speechiness</p>
            <CustomSlider setSliderValue={setSpeechinessValue} sliderValue={speechinessValue}/>
          </div>
        </div>
    </div>
    <div style={{margin: '5%'}}>
      <Input
      style={{width: '50%', float:'left'}}
      required
      pr='4.5rem'
      type={'email'}
      placeholder='Enter Email'
    />
  </div>
  </div>
  );
}

const styles = {
  parentContainer:{
    margin: '5%',
    flexGrow:1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap:'wrap',
  },
  cotainer:{
    width: '50%',
    justifyContent: 'space-between',
  }
}