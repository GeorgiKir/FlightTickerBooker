import React from "react";
import { CustomButton } from "./Reservation";
import { useNavigate } from "react-router-dom";

const DeleteReservation = ({
  handleButton,
  setDeleteState,
  reservationState,
  setReservationId,
  setTargetReservation,
}) => {
  const navigate = useNavigate();
  const deleteReservation = (e) => {
    fetch(
      `/api/delete-reservation/${reservationState._id.replace(/['"]+/g, "")}`,
      {
        method: "DELETE",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          window.alert("Reservation was deleted successfully");
          setDeleteState(false);
          window.localStorage.removeItem("reservationId");
          setReservationId(window.localStorage.getItem("reservationId"));
          if (!setTargetReservation) {
            navigate("/");
          } else {
            setTargetReservation(false);
            navigate("/admin");
          }
        }
      })
      .catch((e) => {
        console.log("Error: ", e);
      });
  };
  return (
    <>
      <CustomButton
        onClick={(e) => {
          handleButton("cancelDeletion");
        }}
      >
        No
      </CustomButton>
      <CustomButton
        onClick={() => {
          deleteReservation();
        }}
      >
        Yes
      </CustomButton>
    </>
  );
};

export default DeleteReservation;
