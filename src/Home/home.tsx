import React, { useState } from 'react';
import Graph from './graph.tsx';
import CustomSlider from '../Components/CustomSlider.tsx';

export interface IHomeProps {
}

export default function Home (props: IHomeProps) {
  const [danceabilityValue, setDancebilityValue] = useState(50);
  const [speechinessValue, setSpeechinessValue] = useState(50);

  return (
    <div style={styles.parentContainer}>
      <div style={{}}>
        <Graph></Graph>
      </div> 
      <div style={styles.cotainer}>
          <div style={{width: '100%'}}>
            <p style={{float:'left'}}>Genres</p>
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
  );
}

const styles = {
  parentContainer:{
    margin: '5%',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10%',
    flexWrap:'wrap',
  },
  cotainer:{
    display:'flex',
    flex:1,
    flexDirection:'column',
    width: '100%',
    justifyContent: 'space-between',
  }
}