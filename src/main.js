import React  from 'react';
import Edit from './editArea'

class Main extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imagePreviewUrl: '',
      width:Math.floor(window.innerWidth),
      height:Math.floor(.5*window.innerHeight)};
  }


  _handleImageChange(e) {
    e.preventDefault();
    if (e.target.files.length>0){
      let reader = new FileReader();
      let file = e.target.files[0];
      let prev = ''
      reader.onloadend = () => {
        const img = new Image();
        prev = reader.result
        img.src = prev
        img.onload =()=> {
          console.log(img.width + 'x' + img.height);
          let h = img.height
          let w = img.width
          while(h>.9*window.innerHeight || w>window.innerWidth){
            h=Math.floor(.9*h)
            w=Math.floor(.9*w)
          }
          this.setState({
            height:h,
            width:w
          })
        }
        this.setState({
          file: file,
          imagePreviewUrl: reader.result,
        });
      }
      reader.readAsDataURL(file)
    }
  }




  render() {
    return (
      <div>
          <input className="fileInput" 
            type="file" 
            onChange={(e)=>this._handleImageChange(e)} />
            <br/>
            <br/>
          <Edit imageURL={this.state.imagePreviewUrl} 
                height={this.state.height} 
                width={this.state.width} 
                />
      </div>

    );
  }
}

export default Main ;