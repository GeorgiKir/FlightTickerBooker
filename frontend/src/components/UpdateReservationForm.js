import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  CustomButton,
  ReservationButtonContainer,
  Wrapper,
} from "./Reservation";
import { StyledForm } from "./SeatSelect/Form";

const UpdateReservationForm = ({
  handleButton,
  reservationState,
  setTargetReservation,
}) => {
  const navigate = useNavigate();
  const [updateState, setUpdateState] = useState({
    id: reservationState._id,
    flight: reservationState.flight,
    seat: reservationState.seat,
    firstName: reservationState.givenName,
    lastName: reservationState.surname,
    email: reservationState.email,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("/api/update-reservation", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...updateState,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          window.alert(data.data);
          if (
            window.localStorage.getItem("reservationId") &&
            updateState.id ===
              window.localStorage.getItem("reservationId").replace(/['"]+/g, "")
          ) {
            navigate("/confirmation");
          } else {
            setTargetReservation(false);
            navigate("/admin");
          }
        } else if (data.status === 400) {
          window.alert(data.data);
        }
      })
      .catch((e) => {
        console.log("Error: ", e);
      });
  };

  const handleUpdate = (e) => {
    setUpdateState({ ...updateState, [e.target.id]: e.target.value });
  };

  return (
    <Wrapper>
      <StyledForm onSubmit={(e) => handleSubmit(e)}>
        <InputArea>
          <CustomLabel for="firstName">First Name:</CustomLabel>
          <input
            defaultValue={reservationState.givenName}
            key="firstName"
            id="firstName"
            onChange={(e) => handleUpdate(e)}
          />
        </InputArea>

        <InputArea>
          <CustomLabel for="lastName">Last Name:</CustomLabel>
          <input
            defaultValue={reservationState.surname}
            key="lastName"
            id="lastName"
            onChange={(e) => handleUpdate(e)}
          />
        </InputArea>
        <InputArea>
          <CustomLabel for="seat">Seat:</CustomLabel>
          <input
            defaultValue={reservationState.seat}
            key="seat"
            id="seat"
            onChange={(e) => handleUpdate(e)}
          />
        </InputArea>
        <InputArea>
          <CustomLabel for="flight">Flight:</CustomLabel>
          <select
            id="flight"
            key="flight"
            placeholder="Select Flight"
            onChange={(e) => handleUpdate(e)}
          >
            <option> Please Select Flight</option>
            <option value="FD489">FD489</option>
            <option value="SA231">SA231</option>
          </select>
        </InputArea>
        <InputArea>
          <CustomLabel for="email">Email:</CustomLabel>
          <input
            defaultValue={reservationState.email}
            key="email"
            id="email"
            onChange={(e) => handleUpdate(e)}
          />
        </InputArea>
        <CustomButton type="submit">Submit</CustomButton>
      </StyledForm>

      <ReservationButtonContainer>
        <CustomButton
          onClick={() => {
            handleButton("cancel");
          }}
        >
          CANCEL
        </CustomButton>
      </ReservationButtonContainer>
    </Wrapper>
  );
};

const CustomLabel = styled.label`
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  font-size: 25px;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  & select {
    font-family: var(--font-body);
    font-size: 24px;
    height: 42px;
    border: 2px solid var(--color-orange);
    border-radius: 4px;
    padding: 0 12px;
  }
`;
export default UpdateReservationForm;
