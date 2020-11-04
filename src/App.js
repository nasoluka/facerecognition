import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import './App.css';

const particlesOptions ={
  particles: {
    number: {
      value:250,
      density:{
        enable: true,
        value_area: 800
        }
      }
    }
  }


const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component{
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }
loadUser =(data)=>{
  this.setState({user: {
    id: data.id,
    name: data.name,
    email: data.email,
    password: data.password,
    entries: 0,
    joined: data.joined
  }})
}


calculateFaceLocation = (data) =>{
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  console.log(data)
  return{
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}

displayFaceBox = (box)=>{
  console.log(box)
  this.setState({box: box});
}


onChange = (event) =>{
  this.setState({input: event.target.value})
} 

onSubmit = () =>{
  this.setState({imageUrl: this.state.input})
    fetch('https://shrouded-lowlands-73466.herokuapp.com/imageurl',{
      method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            input: this.state.input
        })
    })
    .then(respose => respose.json())
    .then(response => {
      if(response){
        fetch('https://shrouded-lowlands-73466.herokuapp.com/image',{
          method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(err => console.log(err));
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
}


OnRouteChange = (route) =>{
  if(route ==='signout'){
    this.setState(initialState)
  }else if(route ==='home'){
    this.setState({isSignedIn: true})

  }
  this.setState({route: route});
}

  render(){
    const {isSignedIn,imageUrl,route,box} = this.state;
    return(
      <div className = 'App'>
        <Particles className ='particles'
          params={particlesOptions}/>
        <Navigation isSignedIn={isSignedIn} onRouteChange = {this.OnRouteChange}/>
       {route === 'home'
         ?  <div>
              <Logo/>
              <Rank name={this.state.user.name} entries = {this.state.user.entries}/>
              <ImageLinkForm onChange = {this.onChange} onSubmit ={this.onSubmit}/>
              <FaceRecognition box = {box} imageUrl = {imageUrl}/>
            </div>
          : (
            route === 'signin'
            ? <Signin loadUser={this.loadUser} OnRouteChange ={this.OnRouteChange}/>
            :<Register loadUser={this.loadUser} OnRouteChange ={this.OnRouteChange}/>
            ) 
        }
      </div>
    );
  }
} 
export default App;
