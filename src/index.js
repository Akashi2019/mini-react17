import React from 'react'
import ReactDOM from './mini-react/react-dom'
import Component from './mini-react/Component'
import './index.css'

class ClassComponent extends Component{
 render(){
   return (
     <div className="border">
       <p>类组件-{this.props.name}</p>
     </div>
   )
 }
}

function FunctionComponent(props){
  return (
    <div className="border">
      <p>函数组件-{props.name}</p>
    </div>
  )
}
  
  

const jsx = (
  <div className="border">
    <h1>Hello React</h1>
    <a href="www.yunzhijia.com">云之家</a>
  </div>
)


ReactDOM.render(jsx, document.getElementById("root"));