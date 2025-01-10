import React from 'react'
import './Transport.css'
import Maplocation from '../Maplocation/Maplocation'
import BusLocation from '../Buslocation/BusLocation'

const stopdetails = [
    {
        sequence:"0",
        name:"Durgapura",
        time:"7:00 Am",
        geocode : [26.8518, 75.7862]
    },
    {
        sequence:"1",
        name:"Saganer",
        time:"7:20 Am",
        geocode : [26.8192, 75.7660]
    },
    {
        sequence:"2",
        name:"Mansarovar",
        time:"7:30 Am",
        geocode : [26.8505, 75.7628]
    },
    {
        sequence:"3",
        name:"Vivek Vihar",
        time:"7:55 Am",
        geocode : [26.8886, 75.7644]
    }, {
        sequence:"3",
        name:"Vivek Vihar",
        time:"7:55 Am",
        geocode : [26.8886, 75.7644]
    }, {
        sequence:"3",
        name:"Vivek Vihar",
        time:"7:55 Am",
        geocode : [26.8886, 75.7644]
    }, {
        sequence:"3",
        name:"Vivek Vihar",
        time:"7:55 Am",
        geocode : [26.8886, 75.7644]
    },
]

const buspostion = 2;




function Transport() {
  return (
    <>
        <div className='locationpannel'>
            <BusLocation stopdetails={stopdetails} buspostion={buspostion} />
            <Maplocation stopdetails={stopdetails} buspostion={buspostion}/>
        </div>
    </>
  )
}

export default Transport
