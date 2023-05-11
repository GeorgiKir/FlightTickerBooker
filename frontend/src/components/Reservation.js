import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ConfirmationContainerDiv } from "./Confirmation";

import DeleteReservation from "./DeleteReservation";
import UpdateReservationForm from "./UpdateReservationForm";

const Reservation = ({ setReservationId, reservId, setTargetReservation }) => {
  console.log(reservId);
  const [reservationState, setReservationState] = useState();
  const [reservationFormFlag, setreservationFormFlag] = useState(false);
  const [deleteState, setDeleteState] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (reservId) {
      fetch(`/api/get-reservation/${reservId.replace(/['"]+/g, "")}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data.data[0]);
          setReservationState(data.data[0]);
        })
        .catch((e) => {
          console.log("Error: ", e);
        });
    }
  }, []);

  const handleButton = (task) => {
    if (task === "update") {
      setreservationFormFlag(true);
      setDeleteState(false);
    } else if (task === "cancel") {
      setreservationFormFlag(false);
    } else if (task === "delete") {
      setDeleteState(true);
    } else if (task === "cancelDeletion") {
      setDeleteState(false);
    }
  };

  return (
    <>
      <Wrapper>
        {reservationState && deleteState && (
          <>
            <ConfirmationContainerDiv>
              <h2>Proceed with the permanent deletion of this reservation?</h2>
              <ReservationButtonContainer>
                <DeleteReservation
                  setReservationId={setReservationId}
                  handleButton={handleButton}
                  setDeleteState={setDeleteState}
                  reservationState={reservationState}
                  setTargetReservation={setTargetReservation}
                />
              </ReservationButtonContainer>
            </ConfirmationContainerDiv>
          </>
        )}
        {reservationState && !reservationFormFlag && !deleteState && (
          <>
            <ConfirmationContainerDiv>
              <p>Resrvation #: {reservationState._id}</p>
              <p>First Name: {reservationState.givenName}</p>
              <p>Last Name: {reservationState.surname}</p>
              <p>Flight: {reservationState.flight}</p>
              <p>Seatt: {reservationState.seat}</p>
              <p>Email: {reservationState.email}</p>
            </ConfirmationContainerDiv>

            <ReservationButtonContainer>
              <CustomButton
                onClick={() => {
                  handleButton("update");
                }}
              >
                Update Reservation
              </CustomButton>
              <CustomButton
                onClick={() => {
                  handleButton("delete");
                }}
              >
                Delete Reservation
              </CustomButton>
            </ReservationButtonContainer>
          </>
        )}
        {reservationState && reservationFormFlag && (
          <UpdateReservationForm
            handleButton={handleButton}
            setReservationState={setReservationState}
            reservationState={reservationState}
            reservId={reservId}
            setTargetReservation={setTargetReservation}
          />
        )}
        {!reservId && <h1>No reservations to show</h1>}
      </Wrapper>
    </>
  );
};

export const CustomButton = styled.button`
  cursor: pointer;
  width: 40%;
  padding: 5px;
  background-color: red;
  align-self: center;
  margin-top: 5px;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  font-size: 20px;
  &:hover {
    scale: 1.1;
  }
`;
export const ReservationButtonContainer = styled.div`
  display: flex;
  width: 50%;
  margin: 20px auto;
  justify-content: space-around;
`;

export const Wrapper = styled.div`
  width: 60%;
  margin: 20px auto;
`;

export default Reservation;
