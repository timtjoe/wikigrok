import React from 'react';
import styled from 'styled-components';

const Search: React.FC = () => {
  return (
    <SearchContainer>
      <SearchInput 
        placeholder="Explore the world's knowledge"
      />
      <SearchFooter>
        <ActionGroup>
          <ActionButton type="button">Filter</ActionButton>
          <ActionButton type="button">History</ActionButton>
        </ActionGroup>
        <SubmitButton type="submit">Go</SubmitButton>
      </SearchFooter>
    </SearchContainer>
  );
};

// --- Styled Components ---

const SearchContainer = styled.div`
  width: 100%;
  max-width: 600px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const SearchInput = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 16px;
  border: none;
  resize: none;
  outline: none;
  font-size: 1.1rem;
  font-family: inherit;
  color: #333;

  &::placeholder {
    color: #aaa;
  }
`;

const SearchFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #fcfcfc;
  border-top: 1px solid #f0f0f0;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid #ddd;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #666;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const SubmitButton = styled.button`
  background-color: #000;
  color: #fff;
  border: none;
  padding: 6px 20px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

export default Search;