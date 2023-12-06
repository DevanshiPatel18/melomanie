import React, { useState, useEffect } from 'react';
import Graph from './graph.tsx';
import CustomSlider from '../Components/CustomSlider.tsx';
import Select, { MultiValue } from 'react-select'
import { Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Image, Input, Stack, Text } from '@chakra-ui/react';
import { RecommendationParams } from '../interface.ts';
export interface IHomeProps {
}

export default function Home (props: IHomeProps) {
  const url = process.env.REACT_APP_AWS_ENDPOINT
  const [danceabilityValue, setDancebilityValue] = useState(50);
  const [speechinessValue, setSpeechinessValue] = useState(50);
  const [selectedOptions, setSelectedOptions ] = useState<MultiValue<{
    value: string;
    label: string;
  }>>([]);
  const [options, setOptions] = useState([]);
  const [mood,setMood] = useState({
    energy: 0.5,
    valance: 0.5
  })
  const [recommendations, setRecommendation] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
    const results = await fetch(`${url}/genres`);
      console.log(results)
      let option = await results.json();
      let data = option?.done?.result?.genres.map(item => {
        return {value: item, label: item}
    
      })
      console.log(data)
      setOptions(data)
  }
  fetchData();
  },[])
  const onClickRecommend = async () =>{
    const selectedGenresList = Array.prototype.map.call(selectedOptions, function(item) { return item.value; }).join(",")
    console.log(selectedGenresList)
    const params: RecommendationParams = {
      seed_artists: "4NHQUGzhtTLFvgF5SZesLK",
      seed_genres: selectedGenresList,
      seed_tracks:"0c6xIDDpzE81m2q797ordA",
      target_danceability: danceabilityValue / 100,
      target_energy: mood.energy,
      target_speechiness: speechinessValue/100,
      target_valence: mood.valance,
      limit: 10,

    }
    const result = await fetch(`${url}/recommendation`,{
      method: 'POST',
      body: JSON.stringify(params),
    })
    const data = await result.json()
    const formattedData = data.done.result.tracks.map((item) => {
      return {
        explicit: item.explicit,
        href: item.href,
        name: item.name,
        previewUrl: item.preview_url,
        uri: item.uri,
        imageUri: item.album.images?.[0]?.url
      }
    })
    setRecommendation(formattedData);
    console.log(formattedData);
  }
  return (
    <div 
    style={{display:'flex', flexGrow:1, flexDirection:'column'}}
    >
      <div 
      style={{display:'flex',justifyContent:'center'}}
      >
      <Image src={require('./title.png')}/>
      </div>
      <div 
      style={{...styles.parentContainer, justifyItems:'stretch', justifyContent:'centers'}}
      >
          <Graph mood={mood} setMood={setMood}/>
        <div 
        style={{...styles.cotainer, flex:2}}
        >
            <div
            style={{width: '100%', display:'flex', alignItems:'start'}}
            >
              <p style={{float:'left'}}>Genres</p>
              <div 
              style={{width: '100%', maxWidth: 400}}
              >
                <Select options={options} isMulti value={selectedOptions} isSearchable onChange={(newValue, action) => {
                 if(selectedOptions.length >= 5 && action.action == 'select-option'){
                  alert("Maximum 5 genres can be selected")  
                  }
                  else
                setSelectedOptions(newValue)
                }} />
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
          <Button colorScheme='blue' onClick={onClickRecommend}>Recommend</Button>
      </div>
      <div 
      style={{ display: 'flex',flexGrow:1,flexDirection:'row', flexShrink:1}}
      >
        {recommendations ? recommendations.map((item)=>{
          return (
          <Card maxW='sm' style={{display:'flex', height:'50%', width:'50%'}}>
                <CardBody>
                  <Image
                    src={item?.imageUri}
                    alt='Green double couch with wooden legs'
                    borderRadius='lg'
                  />
                  <Stack mt='6' spacing='3'>
                    <Heading size='md'>{item.name}</Heading>
                    {/* <Text>
                      This sofa is perfect for modern tropical spaces, baroque inspired
                      spaces, earthy toned spaces and for people who love a chic design with a
                      sprinkle of vintage design.
                    </Text> */}
                    <Text color='blue.600' fontSize='2xl'>
                      $450
                    </Text>
                  </Stack>
                </CardBody>
                <Divider />
                {/* <CardFooter>
                  <ButtonGroup spacing='2'>
                    <Button variant='solid' colorScheme='blue'>
                      Buy now
                    </Button>
                    <Button variant='ghost' colorScheme='blue'>
                      Add to cart
                    </Button>
                  </ButtonGroup>
                </CardFooter> */}
              </Card>)
                      
            }) : <div></div>}
      <div>
        <Input
        style={{width: '50%', float:'left'}}
        required
        pr='4.5rem'
        type={'email'}
        placeholder='Enter Email'
        />
        </div>
                </div>
     
  </div>
  );
}

const styles = {
  parentContainer:{
    margin: '5% 0',
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  cotainer:{
    // width: '100%',
    justifyContent: 'space-evenly',
  }
}