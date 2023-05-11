import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Plane from "./Plane";
import Form from "./Form";

const SeatSelect = ({ selectedFlight, setReservationId }) => {
  const [selectedSeat, setSelectedSeat] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e, formData) => {
    e.preventDefault();

    fetch("/api/add-reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        flight: selectedFlight,
        seat: selectedSeat,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        window.localStorage.setItem(
          "reservationId",
          JSON.stringify(data.data.insertedId)
        );
        setReservationId(window.localStorage.getItem("reservationId"));
        navigate("/confirmation");
      })
      .catch((e) => {
        console.log("Error: ", e);
      });
  };

  return (
    <Wrapper>
      <h2>Select your seat and Provide your information!</h2>
      <>
        <FormWrapper>
          <Plane
            setSelectedSeat={setSelectedSeat}
            selectedFlight={selectedFlight}
          />
          <Form handleSubmit={handleSubmit} selectedSeat={selectedSeat} />
        </FormWrapper>
      </>
    </Wrapper>
  );
};

const FormWrapper = styled.div`
  display: flex;
  margin: 50px 0px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

export default SeatSelect;
