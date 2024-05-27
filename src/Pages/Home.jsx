import React from "react";
import NavBar from "../components/NavBar";
import Card from "../components/Card";

function Home() {

  return (
    <>
      <NavBar />
      <section className="eventSection my-5">
        <div className="mx-5 flex justify-between items-center flex-row">
          <div className="text-6xl">Events</div>
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
              </dialog>{" "}
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
        <div className="p-2 mx-5 my-3 grid grid-cols-2 gap-5 ">
          <Card
            name={"Event-name"}
            description={
              "description Lorem ipsum dolor sit amet consectetur adipisicing elit.Sunt beatae, quos earum veniam est minima vero nobis. Laudantiumnatus magni provident blanditiis ea vel ipsa minima, explicabo aliasdolorem voluptate."
            }
            status={"onGoing"}
            tags={["tags", "sports"]}
          />

          <Card
            name={"Event-name"}
            description={
              "description Lorem ipsudantiumnatus magni provident blanditiis ea vel ipsa minima, explicabo aliasdolorem voluptate."
            }
            status={"onGoing"}
            tags={["tags", "sports"]}
          />
          <Card
            name={"Event-name"}
            description={
              "description Lorem ipsum dolor sit amet consectetur adipisicing elit.Sunt beatae, quos earum veniam est minima vero nobis. Laudantiumnatus magni provident blanditiis ea vel ipsa minima, explicabo aliasdolorem voluptate."
            }
            status={"onGoing"}
            tags={["tags", "weather"]}
          />
          <Card
            name={"Event-name"}
            description={
              "descriptdescription Lorem ipsum dolor sit amet consectetur adipisicing elit.Sunt beatae, quos earum veniam est minima vero nobis. Laudantiumnatus magni provident blanditiis ea vel ipsa minima, explicabo aliasdolorem voluptate.description Lorem ipsum dolor sit amet consectetur adipisicing elit.Sunt beatae, quos earum veniam est minima vero nobis. Laudantiumnatus magni provident blanditiis ea vel ipsa minima, explicabo aliasdolorem voluptate.description Lorem ipsum dolor sit amet consectetur adipisicing elit.Sunt beatae, quos earum veniam est minima vero nobis. Laudantiumnatus magni provident blanditiis ea vel ipsa minima, explicabo aliasdolorem voluptate."
            }
            status={"onGoing"}
            tags={["tags", "sports"]}
          />
          <Card
            name={"Event-name"}
            description={
              "description Lorem ipsum dolor sit amet consectetur adipisicing elit.Sunt beatae, quos earum veniam est minima vero nobis. Laudantiumnatus magni provident blanditiis ea vel ipsa minima, explicabo aliasdolorem voluptate."
            }
            status={"closed"}
            tags={["tags", "sports"]}
          />
          <Card
            name={"Event-name"}
            description={
              "description Lorem ipsum dolor sit amet consectetur adipisicing elit.Sunt beatae, quos earum veniam est minima vero nobis. Laudantiumnatus magni provident blanditiis ea vel ipsa minima, explicabo aliasdolorem voluptate."
            }
            status={"closed"}
            tags={["tags", "sports"]}
          />
        </div>
      </section>
    </>
  );
}

export default Home;
