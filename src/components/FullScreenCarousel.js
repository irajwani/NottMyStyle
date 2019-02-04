import React, { Component } from 'react';
import styled from "styled-components/native"; // 3.1.6
import Carousel, {Pagination} from 'react-native-snap-carousel'; // 3.6.0
import { graphiteGray, mantisGreen, lightGray } from '../colors';
// import { iOSColors } from 'react-native-typography';

class FullScreenCarousel extends Component {

  constructor(props){
    super();
    this.state = {
      errors: [],
      activeSlide: 0,
    }
    this.props = props;
    this._carousel = {};
  }

  handleSnapToItem(index){
    console.log("snapped to ", index);
    this.setState({ activeSlide: index });
  }

  _renderItem = ( {item, index} ) => {
    console.log("rendering,", index, item)
    return (
      

        <ThumbnailBackgroundView>
          <CurrentVideoTO
             onPress={ () => { 
                console.log("clicked to index", index)
                this._carousel.snapToItem(index);
              }}
          >
            <CurrentVideoImage source={{ uri: item }} />
          </CurrentVideoTO>
            {/*<NextVideoImage source={{ uri: this.state.currentVideo.nextVideoId }}/>*/}
            
        </ThumbnailBackgroundView>
        
       

        

        
    );
  }

  get pagination () {
    const { activeSlide } = this.state;
    const {data} = this.props;
    return (
        <Pagination
          dotsLength={data.length}
          activeDotIndex={activeSlide}
          containerStyle={{ backgroundColor: '#fff' }}
          dotStyle={{
              // width: 10,
              // height: 10,
              // borderRadius: 5,
              // marginHorizontal: 8,
              backgroundColor: mantisGreen
          }}
          inactiveDotStyle={{
              backgroundColor: lightGray
              // Define styles for inactive dots here
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
    );
}

  render = () => {
    //const { params } = this.props.navigation.state;
    

    console.log("videos: updating")

    return (

      <CarouselBackgroundView>
        <Carousel
          ref={ (c) => { this._carousel = c; } }
          data={this.props.data}
          renderItem={this._renderItem.bind(this)}
          onSnapToItem={this.handleSnapToItem.bind(this)}
          sliderWidth={300}
          itemWidth={256}
          layout={'default'}
          firstItem={0}
        />
        { this.pagination }
      </CarouselBackgroundView>

    );
  }
}

export default FullScreenCarousel;


const VideoTitleText = styled.Text`
  color: white;
  top: 28;
  justify-content: center;
`
const CurrentVideoImage = styled.Image`
  ${'' /* top: 5; */}
  ${'' /* box-shadow: 5px 10px; */}
  width: 275;
  height: 400;
  border-radius: 0;
  border-width: 0;
  border-color: gray
`;

const ThumbnailBackgroundView = styled.View`
  justify-content: center;
  align-items: center;
  width: 275; 
`;

const CurrentVideoTO = styled.TouchableOpacity`
`
const CarouselBackgroundView = styled.View`
  background-color: #fff;
  ${'' /* height: 200; */}
  width: 100%;
`
// #156820