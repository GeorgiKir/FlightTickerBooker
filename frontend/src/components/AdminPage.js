import React from "react";
import { useEffect, useState } from "react";
import Reservation, { Wrapper } from "./Reservation";
import { ConfirmationContainerDiv } from "./Confirmation";
import styled from "styled-components";
import PageNumberComponent from "./PageNumberComponent";

const AdminPage = ({ setReservationId }) => {
  const [allReservations, setAllReservations] = useState();
  const [targetReservation, setTargetReservation] = useState();
  const [reservationsOverflow, setReservationsOverflow] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  useEffect(() => {
    fetch(`/api/admin/get-reservations/${pageNumber}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        setAllReservations(data.data.targetReservations);
        setReservationsOverflow(data.data.reservationsChecker);
      });
  }, [targetReservation, pageNumber]);
  return (
    <>
      <Wrapper>
        {allReservations && !targetReservation && (
          <>
            <ConfirmationContainerDiv>
              {allReservations.map((item) => {
                return (
                  <AdminReservationDiv
                    onClick={() => {
                      setTargetReservation(item);
                    }}
                  >
                    <p>
                      <span>Reservation #:</span> {item._id}
                    </p>
                    <p>
                      <span>Reservation Info:</span> {item.givenName}{" "}
                      {item.surname} {item.flight} {item.seat}
                    </p>
                  </AdminReservationDiv>
                );
              })}
            </ConfirmationContainerDiv>
            <PageNumberComponent
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              reservationsOverflow={reservationsOverflow}
            />
          </>
        )}
      </Wrapper>{" "}
      {allReservations && targetReservation && (
        <Reservation
          reservId={targetReservation._id}
          setReservationId={setReservationId}
          setTargetReservation={setTargetReservation}
        />
      )}
    </>
  );
};

const AdminReservationDiv = styled.button`
  cursor: pointer;
  border: none;
  border-bottom: 1px solid red;
  background: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  & span {
    color: black;
  }
`;

export default AdminPage;
