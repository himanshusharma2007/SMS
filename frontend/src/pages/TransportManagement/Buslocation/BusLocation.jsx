import React, { useState } from 'react'
import './Buslocation.css'
import { PiBusFill } from "react-icons/pi";


function BusLocation(props) {
    const [circle , setCircle] = useState(0);
    const stopdetails = props.stopdetails
    const linehight = (stopdetails.length-1) * 200;
    const buspostion = props.buspostion;




  return (
    <div className='Buslocation'>
        <svg width="100%" height="100%" viewBox="0 0 1 1117" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="7" className='Buspath'>
            <line x1="0.5" y1="2.18557e-08" x2="0.499951" y2={linehight} stroke="#000"/>
            {
                stopdetails.map((e,index)=>{
                    const yPosition = 200 * index ;
                    return(
                        <>  
                            <g key={index} className='one'>
                                <circle cx="0" cy={yPosition+18} r="15" fill="#000" stroke="#000" strokeWidth="4"/>
                                <text x="-230" y={yPosition+25}  className="roadmap-text">{e.time}</text>
                                <text x="60" y={yPosition+30}  className="roadmap-text">{e.name}</text>
                            </g>
                        </>
                    )
                })
            }
            <circle cx="0" cy={buspostion*200+18} r="15" fill="#ff0" stroke="#000" strokeWidth="4"/>
          
        </svg>

        

    </div>
  )
}

export default BusLocation
