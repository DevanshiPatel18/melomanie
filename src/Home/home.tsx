import React, { useState, useEffect } from 'react';
import Graph from './graph.tsx';
import CustomSlider from '../Components/CustomSlider.tsx';
import Select, { MultiValue } from 'react-select'
import { Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, IconButton, Image, Input, Link, Stack, Text, useToast } from '@chakra-ui/react';
import { RecommendationParams } from '../interface.ts';
import {
  FavoriteSVGIcon, ShareSVGIcon,
} from "@react-md/material-icons";
export interface IHomeProps {
}

export default function Home (props: IHomeProps) {
  const url = process.env.REACT_APP_AWS_ENDPOINT
  const toast = useToast()
  const [email, setEmail] = useState("");
  const [recommendations, setRecommendation] = useState([]);
  const [favorites,setFavorites] = useState([]);
  const [recommendationLoading, setReccomendationLoading] = useState(false);
  const [danceabilityValue, setDancebilityValue] = useState(50);
  const [speechinessValue, setSpeechinessValue] = useState(50);
  const [selectedOptions, setSelectedOptions ] = useState<MultiValue<{
    value: string;
    label: string;
  }>>([]);
  const genres = ["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"].map(item => {
    return {value: item, label: item}
  })
  const [options, setOptions] = useState(genres);
  const [mood,setMood] = useState({
    energy: 0.5,
    valance: 0.5
  })

  useEffect(() => {
  // fetchData();
  },[])
  const fetchData = async () => {
    const results = await fetch(`${url}/genres`);
      let option = await results.json();
      let data = option?.done?.result?.genres.map(item => {
        return {value: item, label: item}
    
      })
      setOptions(data)
  }
  const onClickRecommend = async () =>{
    setReccomendationLoading(true);
    const selectedGenresList = Array.prototype.map.call(selectedOptions, function(item) { return item.value; }).join(",");
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
    const data = await result?.json()
    const formattedData = data?.done?.result?.tracks?.map((item) => {
      return {
        explicit: item.explicit,
        href: item.href,
        name: item.name,
        previewUrl: item.preview_url,
        uri: item.uri,
        imageUri: item.album.images?.[0]?.url,
        artistName: item.album.name,
        trackId: item.id
      }
    })
    setRecommendation(formattedData);
    setReccomendationLoading(false);
    console.log(formattedData);
  }

  const onClickFavouriteButton = async (trackId: string) =>{
    if(email.length){
      try{
        console.log(trackId)
    const result = await fetch(`${url}/favourites/${email}/${trackId}`);
    if(!result){
      toast({
        title: 'Added to Favourites!',
        description: "Remember this email to access the favourites.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    }
    console.log(await result.json())
  }catch(error){
    toast({
      title: 'An error occured!',
      description: error,
      status: 'error',
      duration: 9000,
      isClosable: true,
  })}
  }else {
  toast({
    title: 'Email Required.',
    description: "To add Favourites we need a valid email.",
    status: 'error',
    duration: 9000,
    isClosable: true,
  })
}
  }

const onClickGetFavorites = async () => {
  const result = await fetch(`${url}/favorite/${email}`,{
    method: 'GET',
    // mode:'no-cors',
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": '*', // Required for CORS support to work
      // "Access-Control-Allow-Credentials": 'true', // Required for cookies, authorization headers with HTTPS
    },
  })
  const data = await result?.json()
  const formattedData = data?.tracks?.map((item) => {
    return {
      explicit: item.explicit,
      href: item.href,
      name: item.name,
      previewUrl: item.preview_url,
      uri: item.uri,
      imageUri: item.album.images?.[0]?.url,
      artistName: item.album.name,
      trackId: item.id
    }
  })
  setFavorites(formattedData)
}

  return (
    <div 
    style={{display:'flex', flexGrow:1, flexDirection:'column', margin:"2%", flexWrap:'wrap'}}
    >
      <div 
      style={{display:'flex',justifyContent:'center'}}
      >
      <Image src={require('./title.png')}/>
      </div>
      <div 
      style={{...styles.parentContainer, justifyItems:'stretch', justifyContent:'centers', alignItems:'stretch', gap: '10%'}}
      >
          <Graph mood={mood} setMood={setMood}/>
        <div 
        style={{...styles.cotainer,display:'flex',flexDirection:'column', flex:2, justifyContent:'space-evenly'}}
        >
            <div
            style={{width: '100%', display:'flex', flexDirection:'column'}}
            >
              <p style={{float:'left', textAlign:'left'}}>Genres</p>
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
          <Button isLoading={recommendationLoading} colorScheme='blue' onClick={onClickRecommend}>Recommend</Button>
      </div>
      { recommendations.length != 0 &&
       <>
      <div>
        <div 
        // style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}
        >
        <Input
        style={{width:'50%'}}
        required
        pr='4.5rem'
        type={'email'}
        placeholder='Enter Email'
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        />
        <Button colorScheme='blue' onClick={onClickGetFavorites}>Get Favorites</Button>
        </div>
        </div>
        <Text float={'left'} textAlign={'left'}>Recommended Songs</Text>
        <div 
        style={{ display: 'flex',flexDirection:'column', flexWrap: 'wrap'}}
        >
          <div style={{display:'flex', flexDirection:'column'}}>
          {recommendations ? recommendations.map((item)=>{
            return (
            <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline' 
            size={'sm'} 
            key={item?.uri} maxW='sm' style={{display:'flex', margin:'1% 0'}}>
                    <Image
                      src={item?.imageUri}
                      alt='Green double couch with wooden legs'
                      borderRadius='lg'
                      maxW={{ base: '100%', sm: '150px' }}
                    />
                    <Stack width={'100%'}>
                      <CardBody>
                      <Heading size='md'>{item?.name}</Heading>
                      <Text>{item.artistName}</Text>
                  </CardBody>
                  <CardFooter>
                  <ButtonGroup justifyContent={'space-between'} flexGrow={1}>
                      <IconButton
                        isRound={true}
                        variant='solid'
                        colorScheme='teal'
                        aria-label='Done'
                        fontSize='20px'
                        icon={<FavoriteSVGIcon style={{padding:8}}/>}
                        onClick={() => onClickFavouriteButton(item.trackId)}
                      />
                      <Link href={`https://open.spotify.com/track/${item.trackId}`} isExternal>
                      <IconButton
                        isRound={true}
                        variant='solid'
                        colorScheme='teal'
                        aria-label='Done'
                        fontSize='20px'
                        icon={<ShareSVGIcon style={{padding:8}}/>}
                      />
                      </Link>
                    </ButtonGroup>
                  </CardFooter>
                    </Stack>
                </Card>)
                        
                  }) : <div></div>}
                </div>
                  </div>
                  </>
              }
            <div>
              { favorites.length != 0 &&
       <>
      <div>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
        <Input
        style={{width:'50%'}}
        required
        pr='4.5rem'
        type={'email'}
        placeholder='Enter Email'
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        />
        <Button colorScheme='blue' onClick={onClickGetFavorites}>Get Favorites</Button>
        </div>
        </div>
        <Text float={'left'} textAlign={'left'}>Recommended Songs</Text>
      <div 
      style={{ display: 'flex',flexDirection:'column', flexWrap: 'wrap'}}
      >
        {favorites ? favorites.map((item)=>{
          return (
          <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline' 
          size={'sm'} 
          key={item?.uri} maxW='sm' style={{display:'flex', margin:'1% 0'}}>
                  <Image
                    src={item?.imageUri}
                    alt='Green double couch with wooden legs'
                    borderRadius='lg'
                    maxW={{ base: '100%', sm: '150px' }}
                  />
                  <Stack width={'100%'}>
                    <CardBody>
                    <Heading size='md'>{item?.name}</Heading>
                    <Text>{item.artistName}</Text>
                </CardBody>
                <CardFooter>
                <ButtonGroup justifyContent={'space-between'} flexGrow={1}>
                    <IconButton
                      isRound={true}
                      variant='solid'
                      colorScheme='teal'
                      aria-label='Done'
                      fontSize='20px'
                      icon={<FavoriteSVGIcon style={{padding:8}}/>}
                      onClick={() => onClickFavouriteButton(item.trackId)}
                    />
                    <Link href={`https://open.spotify.com/track/${item.trackId}`} isExternal>
                    <IconButton
                      isRound={true}
                      variant='solid'
                      colorScheme='teal'
                      aria-label='Done'
                      fontSize='20px'
                      icon={<ShareSVGIcon style={{padding:8}}/>}
                    />
                    </Link>
                  </ButtonGroup>
                </CardFooter>
                  </Stack>
              </Card>)
                      
            }) : <div></div>}
                </div>
                </>
            }
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