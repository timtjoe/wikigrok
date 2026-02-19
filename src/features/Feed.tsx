import React from "react";
import { Link } from "react-router";
import styled from "styled-components";
import Search from "./Search";
import Header from "@/components/Header";

const Feed: React.FC = () => {
  const boxes = Array.from({ length: 24 }, (_, i) => i + 1);

  return (
    <Container>
      <MainGrid>
        {/* Header Section */}
        <TopSection>
          <Column>
            <Header />
          </Column>
        </TopSection>

        {/* Content Section */}
        <FeedGrid>
          {boxes.map((id) => (
            <StyledLink to={`/article/${id}`} key={id}>
              <Card>
                <Thumbnail />
                <Metadata>
                  <Avatar />
                  <TextLines>
                    <TitleLine />
                    <SubLine />
                  </TextLines>
                </Metadata>
              </Card>
            </StyledLink>
          ))}
        </FeedGrid>
      </MainGrid>
    </Container>
  );
};

// --- Styled Components ---

const Container = styled.div`
  max-width: 1028px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-rows: 360px 1fr;
  min-height: 100vh;
`;
const Column = styled.div`
  border: 1px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  /* min-height: 368px; */
`;

const TopSection = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-bottom: 1px solid #eee;
  & > ${Column} {
    width: 100%;
    /* max-width: 600px; */
  }
`;


const FeedGrid = styled.main`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 24px 0;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Thumbnail = styled.div`
  aspect-ratio: 16 / 9;
  background-color: #000;
  border-radius: 12px;
`;

const Metadata = styled.div`
  display: flex;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  background-color: #333;
  border-radius: 50%;
  flex-shrink: 0;
`;

const TextLines = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TitleLine = styled.div`
  width: 90%;
  height: 16px;
  background: #eee;
  border-radius: 4px;
`;

const SubLine = styled.div`
  width: 60%;
  height: 12px;
  background: #f5f5f5;
  border-radius: 4px;
`;

export default Feed;
