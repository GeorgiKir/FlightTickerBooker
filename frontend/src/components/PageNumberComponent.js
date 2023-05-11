import React from "react";
import styled from "styled-components";

const PageNumberComponent = ({
  pageNumber,
  setPageNumber,
  reservationsOverflow,
}) => {
  const handlePageButton = (e) => {
    console.log(e.target.value);
    if (e.target.value === "previous") {
      setPageNumber(pageNumber - 1);
    }
    if (e.target.value === "next") {
      setPageNumber(pageNumber + 1);
    }
  };
  return (
    <PageNumberDiv>
      <PageNumberButton
        disabled={pageNumber === 1 ? true : false}
        value="previous"
        onClick={(e) => {
          handlePageButton(e);
        }}
      >
        Previous
      </PageNumberButton>
      <p>Page {pageNumber}</p>
      <PageNumberButton
        disabled={reservationsOverflow ? false : true}
        value="next"
        onClick={(e) => {
          handlePageButton(e);
        }}
      >
        Next
      </PageNumberButton>
    </PageNumberDiv>
  );
};

const PageNumberButton = styled.button`
  cursor: pointer;
  background-color: red;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  font-size: 25px;
`;

const PageNumberDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 30%;
  margin: 10px auto;
  & p {
    font-size: 25px;
  }
`;
export default PageNumberComponent;
