import React  from 'react';
import Immutable from 'immutable'
import domtoimage from 'dom-to-image'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {Button,ButtonGroup,Form,Row,Col} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUndo , faRedo , faSearchPlus,faSearchMinus, faSearch, faHandPaper,faPen,faEraser} from '@fortawesome/free-solid-svg-icons'


class DrawArea extends React.Component {
  constructor() {
    super();

    this.state = {
      lines: new Immutable.List(),
      fontSize:5,
      color:"black",
      type:"round",
      linesInfo:[],
      isDrawing: false,
      redoList : new Immutable.List(),
      redoListInfo:[],
      zoom:false,
      width:0,
      height:0,
      enableDrawing:true,
      scale:1,
      eraser:false,
      mouseType:"crosshair"
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);
    this.setState({
      height:this.props.height,
      width:this.props.width
    })
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown(mouseEvent,scale) {
    if (mouseEvent.button !== 0 || this.state.enableDrawing===false) {
      return;
    }
    const point = this.relativeCoordinatesForEvent(mouseEvent,scale);

    let newInfo = [...this.state.linesInfo]
    let clr = this.state.color
    if (this.state.eraser){
      clr='white'
    }
    let n = {
        color:clr,
        fontSize:this.state.fontSize,
        type:this.state.type,
    }
    newInfo.push(n)
    if(scale){
      this.setState({scale})
    }
    this.setState(prevState => ({
      lines: prevState.lines.push(new Immutable.List([point])),
      linesInfo:newInfo,
      isDrawing: true,
    }));
  }

  handleMouseMove(mouseEvent) {
    if (!this.state.isDrawing || this.state.enableDrawing===false) {
      return;
    }

    const point = this.relativeCoordinatesForEventMove(mouseEvent);

    this.setState(prevState =>  ({
      lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point)),
    }));
  }

  handleMouseUp() {
    this.setState({ isDrawing: false });
  }

  relativeCoordinatesForEvent(mouseEvent,scale) {
    const boundingRect = document.getElementById("drawArea").getBoundingClientRect()
    return new Immutable.Map({
      x: Math.floor((mouseEvent.clientX - boundingRect.left)/scale),
      y: Math.floor((mouseEvent.clientY - boundingRect.top)/scale),
    });
  }

  relativeCoordinatesForEventMove(mouseEvent) {
    const boundingRect = document.getElementById("drawArea").getBoundingClientRect()
    return new Immutable.Map({
      x: Math.floor((mouseEvent.clientX - boundingRect.left)/this.state.scale),
      y: Math.floor((mouseEvent.clientY - boundingRect.top)/this.state.scale),
    });
  }

  undoFunc(){
    if(this.state.lines.size>0){
      let newLinesInfo = [...this.state.linesInfo]
      let redoInfo = newLinesInfo.pop()

      let newRedoListInfo = [...this.state.redoListInfo]
      newRedoListInfo.push(redoInfo)
      
      this.setState(prevState => ({
        redoList: prevState.redoList.push(this.state.lines.last()),
        redoListInfo:newRedoListInfo,
        lines: prevState.lines.pop(),
        linesInfo:newLinesInfo
      }))   
    }
  }


  redoFunc(){
    if(this.state.redoList.size>0){
      let newRedoListInfo = [...this.state.redoListInfo]
      let newLinesInfo = [...this.state.linesInfo]
      let x = newRedoListInfo.pop()
      newLinesInfo.push(x)
      this.setState(prevState => ({
        lines: prevState.lines.push(this.state.redoList.last()),
        redoList: prevState.redoList.pop(),
        redoListInfo:newRedoListInfo,
        linesInfo:newLinesInfo
      }))
    }
  }

  downloadPhoto=()=>{ 
    domtoimage.toPng(document.getElementById('drawArea'), { quality: 1 })
    .then(function (dataUrl) {
    var link = document.createElement('a');
    link.download = 'editiedImage.png';
    link.href = dataUrl;
    link.click();
    });
  }

  chooseMode(mode){
    if (mode === 'zoom'){
      this.setState({enableDrawing:false,eraser:false,mouseType:"grab"})
      return
    }
    if (mode === 'pen'){
      this.setState({enableDrawing:true,eraser:false,mouseType:"crosshair"})
      return
    }
    if (mode === 'eraser'){
      this.setState({enableDrawing:true,eraser:true,mouseType:"crosshair"})
      return
    }
  }

  render() {
    let sc = 1
    const getStats = (stats) => {
        sc=stats.scale
    }
    return (
      <TransformWrapper
      name="trans"
      defaultScale={1}
      defaultPositionX={200}
      defaultPositionY={100}
      onZoomChange={getStats}
      options={{
        disabled:this.state.enableDrawing,
      }}
    >
      {({ zoomIn, zoomOut, resetTransform, positionX, positionY,...rest }) => (
        <React.Fragment>
          <Row>

            <ButtonGroup aria-label="Basic example">
            <Button style={{marginLeft:'10px'}} onClick={(e)=>{this.chooseMode('zoom')}} variant={this.state.enableDrawing?'primary':'secondary'}><FontAwesomeIcon icon={faHandPaper} /></Button>
            <Button onClick={zoomIn}> <FontAwesomeIcon icon={faSearchPlus} /> </Button>
            <Button onClick={zoomOut}> <FontAwesomeIcon icon={faSearchMinus} /></Button>
            <Button onClick={resetTransform}><FontAwesomeIcon icon={faSearch} /></Button>
            <Button style={{marginLeft:'10px'}} onClick={(e)=>{this.chooseMode('pen')}} variant={this.state.enableDrawing && !this.state.eraser?'secondary':'primary'}><FontAwesomeIcon icon={faPen} /></Button>
            <Button style={{marginLeft:'10px'}} onClick={(e)=>{this.chooseMode('eraser')}} variant={this.state.eraser ?'secondary':'primary'}><FontAwesomeIcon icon={faEraser} /></Button>
            <Button style={{marginLeft:'10px'}} onClick={()=>this.undoFunc()}><FontAwesomeIcon icon={faUndo} /></Button>
            <Button  onClick={()=>this.redoFunc()}><FontAwesomeIcon icon={faRedo} /></Button>
            <Button style={{marginLeft:'10px'}} onClick={()=>{this.downloadPhoto()}}>download</Button>
            </ButtonGroup>
          </Row>
          <Row>
            <Col sm={2} md={1}>
            <Form.Group controlId="exampleForm.SelectCustom">
                <Form.Label>Type</Form.Label>
                <Form.Control as="select" >
                <option value="round">Round</option>
                <option value="square">Square</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col sm={2} md={1}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Size</Form.Label>
                <Form.Control type="number" defaultValue={this.state.fontSize} onChange={(e)=>{this.setState({fontSize:e.target.value})}}/>
              </Form.Group>
            </Col>
            <Col sm={2} md={1}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Color</Form.Label>
                <Form.Control type="color" defaultValue={this.state.color} onChange={(e)=>{this.setState({color:e.target.value})}}/>
              </Form.Group>
            </Col>
          </Row>
          <TransformComponent >
              <div
                id='drawArea'
                className="drawArea"
                onMouseDown={(e)=>this.handleMouseDown(e,sc)}
                onMouseMove={(e)=>this.handleMouseMove(e)}
                onPointerDown={(e)=>this.handleMouseDown(e,sc)}
                onPointerMove={(e)=>this.handleMouseMove(e)}
                style={{
                  width:`${this.props.width}px`,
                  height:`${this.props.height}px`,
                  backgroundImage:`url(${this.props.imageURL})`,
                  // backgroundRepeat: 'no-repeat',
                  backgroundSize:'contain',
                  backgroundPosition: 'center',
                  touchAction:'none',
                  cursor: this.state.mouseType
                }}
              >
                <Drawing lines={this.state.lines}  linesInfo={this.state.linesInfo}/>
              </div>
          </TransformComponent>
        </React.Fragment>
      )}
      </TransformWrapper>
    );
  }
}

function Drawing({ lines,linesInfo }) {
  return (
    <svg className="drawing">
      {lines.map((line, index) => (
        <DrawingLine key={index} line={line} info={linesInfo[index]}/>
      ))}
    </svg>
  );
}

function DrawingLine({ line,info }) {
  const pathData = "M " +
    line
      .map(p => {
        return `${p.get('x')} ${p.get('y')}`;
      })
      .join(" L ");

  return <path className="path"
  style={{
    strokeWidth:`${info.fontSize}px`,
    stroke: `${info.color}`,
    strokeLinejoin: "round",
    strokeLinecap: `${info.type}`
  }}
  d={pathData} />;
}

export default DrawArea ;