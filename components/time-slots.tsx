"use client";

import { useState } from "react";
import "../App.css";
import { Questions } from "@/lib/types";
import { useStore } from "@/lib/store";

export default function TimeSlots({
  dList,
  indexD,
}: {
  dList: string[];
  indexD: number;
}) {
  const [tList, setTList] = useState([]);

  const handleAddTimeSlot = () => {
    setTList([...tList, ""]);
  };

  const handleDeleteTimeSlot = (index: number) => {
    const newTList = [...tList];
    newTList.splice(index, 1);
    setTList(newTList);
  };

  return (
    <>
      <div className="rounded-card bottom-margin" style={{ padding: "10px" }}>
        <label htmlFor="questions" className="label1">
          TIME SLOTS DAY {indexD + 1}
        </label>
        <div className="bottom-margin">
          <div className="flex bottom-margin">
            <div>
              <label htmlFor="eventdescrip" className="text1">
                Start
              </label>
              <input
                id="duration"
                required
                className="one-line-input"
                style={{ width: "100px", marginRight: "37px" }}
                placeholder="00:00 XM"
              ></input>
            </div>
            <div>
              <label htmlFor="eventdescrip" className="text1">
                End
              </label>
              <input
                id="duration"
                required
                className="one-line-input"
                style={{ width: "100px" }}
                placeholder="00:00 XM"
              ></input>
            </div>
          </div>
        </div>
        {tList.map((value, index) => (
          <div>
            <div className="flex bottom-margin">
              <div>
                <label htmlFor="eventdescrip" className="text1">
                  Start
                </label>
                <input
                  id="duration"
                  required
                  className="one-line-input"
                  style={{ width: "100px", marginRight: "37px" }}
                  placeholder="00:00 XM"
                ></input>
              </div>
              <div>
                <label htmlFor="eventdescrip" className="text1">
                  End
                </label>
                <input
                  id="duration"
                  required
                  className="one-line-input"
                  style={{ width: "100px" }}
                  placeholder="00:00 XM"
                ></input>
              </div>
              <button
                className="button"
                onClick={() => handleDeleteTimeSlot(index)}
                style={{ marginLeft: "10px", width: "70px" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        <button className="button" onClick={handleAddTimeSlot}>
          Add Another Time Slot
        </button>
      </div>
    </>
  );
}
