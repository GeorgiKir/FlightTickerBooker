import styled from "styled-components";
import { useEffect, useState } from "react";

import tombstone from "../assets/tombstone.png";

const Confirmation = () => {
  const [confirmationState, setConfirmationState] = useState();
  useEffect(() => {
    const reservId = window.localStorage.reservationId;
    fetch(`/api/get-reservation/${reservId.replace(/['"]+/g, "")}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data[0]);
        setConfirmationState(data.data[0]);
      })
      .catch((e) => {
        console.log("Error: ", e);
      });
  }, []);

  return (
    <Wrapper>
      {confirmationState && (
        <ConfirmationContainerDiv>
          <h2>Your flight is confirmed.</h2>
          <p>Confirmation #: {confirmationState._id}</p>
          <p>
            Name: {confirmationState.givenName} {confirmationState.surname}
          </p>
          <p>Flight: {confirmationState.flight}</p>
          <p>Seat: {confirmationState.seat}</p>
          <p>Email: {confirmationState.email}</p>
        </ConfirmationContainerDiv>
      )}{" "}
      <img src={tombstone} style={{ width: "150px", marginTop: "30px" }} />
    </Wrapper>
    // TODO: Display the POSTed reservation information
  );
};

export const ConfirmationContainerDiv = styled.div`
  border: 3px solid red;
  padding: 10px;
  & p,
  h2 {
    font-size: 20px;
    font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
    padding: 10px 0px;
  }
  & h2 {
    color: red;
    padding: 10px 0px;
    width: 80%;
    margin: 0px auto 10px auto;
    border-bottom: 3px solid red;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
  margin: 50px auto;
`;

export default Confirmation;
