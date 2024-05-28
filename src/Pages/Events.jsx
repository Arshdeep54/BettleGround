import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Card from "../components/Card";
import LoadingSpinner from "../components/LoadingSpinner";

function Events() {
const [events,setEvents]=useState([])
const [loading,setLoading]=useState(false)
useEffect(()=>{
  const getEvents=()=>{
    setLoading(true)
    const eventsArray=[
      {
        eventName:"IPL",
        hostedBy:"Jay Shah",
        uid:"2zt0bWhT8ofobrG6Oo6MP9kv7aE3",
        tags:['sports','cricket'],
        description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi itaque recusandae mollitia? Enim mollitia rerum dolores maiores consectetur eius, laudantium modi, in itaque sit nostrum ipsa voluptas nobis reiciendis qui!Aliquam repudiandae ut ratione iste itaque quaerat similique dolorum animi aut tempora ullam nesciunt laudantium consequuntur sequi, dolores in, quo quidem aspernatur, nemo harum explicabo facere quam velit? Saepe, suscipit.Nesciunt ratione pariatur sequi, at architecto ullam non recusandae facere ab consequuntur, nostrum animi. Ut, minima magnam? Suscipit, eligendi. Quasi perferendis voluptates soluta aliquam ipsa error vitae at laboriosam animi.",
        status:"onGoing",
        ends:'2024-06-24',
        matches:[
          {
            outcomeA:{text:"RCB",id:1},
            outcomeB:{text:"CSK",id:2},
            status:"onGoing",
            resultAnnounced:false,
            winnerID:null,
          },
          {
            outcomeA:{text:"PBKS",id:1},
            outcomeB:{text:"MI",id:2},
            status:"onGoing",
            resultAnnounced:false,
            winnerID:null,
          },
          {
            outcomeA:{text:"DC",id:1},
            outcomeB:{text:"KKR",id:2},
            status:"onGoing",
            resultAnnounced:false,
            winnerID:null,
          },
          {
            outcomeA:{text:"SRH",id:1},
            outcomeB:{text:"RR",id:2},
            status:"onGoing",
            resultAnnounced:false,
            winnerID:null,
          },
        ]

      },
      {
        eventName:"IPL",
        hostedBy:"Jay Shah",
        tags:['sports','cricket'],
        description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi itaque recusandae mollitia? Enim mollitia rerum dolores maiores consectetur eius, laudantium modi, in itaque sit nostrum ipsa voluptas nobis reiciendis qui!Aliquam repudiandae ut ratione iste itaque quaerat similique dolorum animi aut tempora ullam nesciunt laudantium consequuntur sequi, dolores in, quo quidem aspernatur, nemo harum explicabo facere quam velit? Saepe, suscipit.Nesciunt ratione pariatur sequi, at architecto ullam non recusandae facere ab consequuntur, nostrum animi. Ut, minima magnam? Suscipit, eligendi. Quasi perferendis voluptates soluta aliquam ipsa error vitae at laboriosam animi.",
        status:"onGoing",
        ends:'2024-06-24',
        matches:[
          {
            outcomeA:{text:"RCB",id:1},
            outcomeB:{text:"CSK",id:2},
            status:"onGoing",
            resultAnnounced:false,
            winnerID:null,
          },
          {
            outcomeA:{text:"PBKS",id:1},
            outcomeB:{text:"MI",id:2},
            status:"onGoing",
            resultAnnounced:false,
            winnerID:null,
          },
          {
            outcomeA:{text:"DC",id:1},
            outcomeB:{text:"KKR",id:2},
            status:"onGoing",
            resultAnnounced:false,
            winnerID:null,
          },
          {
            outcomeA:{text:"SRH",id:1},
            outcomeB:{text:"RR",id:2},
            status:"onGoing",
            resultAnnounced:false,
            winnerID:null,
          },
        ]

      },{
        eventName:"IPL",
        hostedBy:"Jay Shah",
        tags:['sports','cricket'],
        description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi itaque recusandae mollitia? Enim mollitia rerum dolores maiores consectetur eius, laudantium modi, in itaque sit nostrum ipsa voluptas nobis reiciendis qui!Aliquam repudiandae ut ratione iste itaque quaerat similique dolorum animi aut tempora ullam nesciunt laudantium consequuntur sequi, dolores in, quo quidem aspernatur, nemo harum explicabo facere quam velit? Saepe, suscipit.Nesciunt ratione pariatur sequi, at architecto ullam non recusandae facere ab consequuntur, nostrum animi. Ut, minima magnam? Suscipit, eligendi. Quasi perferendis voluptates soluta aliquam ipsa error vitae at laboriosam animi.",
        status:"onGoing",
        ends:'2024-06-24',
        matches:[
          {
            outcomeA:{text:"RCB",id:1},
            outcomeB:{text:"CSK",id:2},
            status:"onGoing",
            resultAnnounced:false,
            winnerID:null,
          },
          {
            outcomeA:{text:"PBKS",id:1},
            outcomeB:{text:"MI",id:2},
            status:"onGoing",
            resultAnnounced:false,
            winnerID:null,
          },
          {
            outcomeA:{text:"DC",id:1},
            outcomeB:{text:"KKR",id:2},
            status:"onGoing",
            resultAnnounced:false,
            winnerID:null,
          },
          {
            outcomeA:{text:"SRH",id:1},
            outcomeB:{text:"RR",id:2},
            status:"onGoing",
            resultAnnounced:false,
            winnerID:null,
          },
        ]

      },{
        eventName:"IPL",
        hostedBy:"Jay Shah",
        uid:"2zt0bWhT8ofobrG6Oo6MP9kv7aE3",
        tags:['sports','cricket'],
        description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi itaque recusandae mollitia? Enim mollitia rerum dolores maiores consectetur eius, laudantium modi, in itaque sit nostrum ipsa voluptas nobis reiciendis qui!Aliquam repudiandae ut ratione iste itaque quaerat similique dolorum animi aut tempora ullam nesciunt laudantium consequuntur sequi, dolores in, quo quidem aspernatur, nemo harum explicabo facere quam velit? Saepe, suscipit.Nesciunt ratione pariatur sequi, at architecto ullam non recusandae facere ab consequuntur, nostrum animi. Ut, minima magnam? Suscipit, eligendi. Quasi perferendis voluptates soluta aliquam ipsa error vitae at laboriosam animi.",
        status:"onGoing",
        ends:'2024-06-24',
        matches:[
          {
            outcomeA:{text:"RCB",id:1},
            outcomeB:{text:"CSK",id:2},
            status:"onGoing",
            resultAnnounced:false,
            winnerID:null,
          },
          {
            outcomeA:{text:"PBKS",id:1},
            outcomeB:{text:"MI",id:2},
            status:"onGoing",
            resultAnnounced:false,
            winnerID:null,
          },
          {
            outcomeA:{text:"DC",id:1},
            outcomeB:{text:"KKR",id:2},
            status:"onGoing",
            resultAnnounced:false,
            winnerID:null,
          },
          {
            outcomeA:{text:"SRH",id:1},
            outcomeB:{text:"RR",id:2},
            status:"onGoing",
            resultAnnounced:false,
            winnerID:null,
          },
        ]

      }
    ]
    setEvents([...eventsArray])
  }
  getEvents();
},[])
useEffect(() => {
  if(events.length>0){
    setLoading(false)
  }
 console.log(events);
}, [events])

  return (
    <>
      <NavBar />
      <section className="eventSection my-5 mx-12">
        <div className="mx-5 flex justify-between items-center flex-row">
          <div className="text-6xl card-title m-4">Events</div>
          <div className="flex item-center flex-row">
            <div className="mx-2">
              <button
                className="btn"
                onClick={() =>
                  document.getElementById("my_modal_4").showModal()
                }
              >
                + Add Event
              </button>
              <dialog id="my_modal_4" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                  <h3 className="font-bold text-lg">Hello!</h3>
                  <p className="py-4">Click the button below to close</p>
                  <div className="modal-action">
                    <form method="dialog">
                      {/* if there is a button, it will close the modal */}
                      <button className="btn">Close</button>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
            
            <label className="input input-bordered flex items-center gap-2">
              <input type="text" className="grow" placeholder="Search" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>
        </div>
        <div className="divider divider-default"></div>
        <div className="p-2 mx-5 my-3 grid grid-cols-2 gap-5 ">
          {loading?
          (
            <LoadingSpinner/>
          )
          :
           events.map((event,index)=>{
              return (<Card
              id={index}
              name={event.eventName}
              uid={event.uid}
              hostedBy={event.hostedBy}
              description={event.description}
              status={event.status}
              tags={event.tags}
              matches={event.matches}
            />)
            })
          }
         

          
        </div>
      </section>
    </>
  );
}

export default Events;
