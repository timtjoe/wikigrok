import React from 'react';
import styled from 'styled-components';

// --- Search Component ---
const Search: React.FC = () => {
  return (
    <SearchContainer>
      <TextArea placeholder="What are you looking for?" />
      <SearchFooter>
        <ActionGroup>
          <ActionButton>Filter</ActionButton>
          <ActionButton>History</ActionButton>
        </ActionGroup>
        <GoButton>Go</GoButton>
      </SearchFooter>
    </SearchContainer>
  );
};

// --- Header Component ---
const Header: React.FC = () => {
  return (
    <HeaderWrapper>
      <AppBar>
        <IconBtn>⚙️</IconBtn>
      </AppBar>

      <SearchSection>
        <Title>Explore the world's knowledge</Title>
        
        <Search />
        
        <Subtext>
          <a href="https://wikipedia.org" target="_blank" rel="noreferrer">
            42 million articles powered by Wikipedia
          </a>
        </Subtext>
      </SearchSection>
    </HeaderWrapper>
  );
};

// --- Styled Components for Header ---

const HeaderWrapper = styled.header`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const AppBar = styled.nav`
  display: flex;
  justify-content: flex-end;
  padding: 10px;
`;

const IconBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
`;

const SearchSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 15px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin: 0;
  color: #111;
`;

const Subtext = styled.p`
  margin: 0;
  a {
    font-size: 0.9rem;
    color: #555;
    text-decoration: underline;
  }
`;

// --- Styled Components for Search ---

const SearchContainer = styled.div`
  width: 100%;
  max-width: 600px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 15px;
  border: none;
  resize: none;
  outline: none;
  display: block;
  font-family: inherit;
  font-size: 1rem;
`;

const SearchFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f9f9f9;
  border-top: 1px solid #eee;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: #fff;
  border: 1px solid #ddd;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  &:hover { background: #f0f0f0; }
`;

const GoButton = styled.button`
  padding: 6px 24px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  &:hover { opacity: 0.8; }
`;

export default Header;