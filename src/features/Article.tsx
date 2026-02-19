import React from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';

const Article: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Container>
      <MainGrid>
        
        {/* Row 1: Top Header (360px) */}
        {/* <TopSection>
          <Column>Article Header Left</Column>
          <Column>Article Header Right</Column>
        </TopSection> */}

        {/* Row 2: Three-Column Reader Area */}
        <ReaderArea>
          
          {/* Left Side */}
          <SidePane>
            <ScrollContent height="2000px">
              <h3>Table of Contents</h3>
              <p>Independent scroll for article {id}</p>
            </ScrollContent>
          </SidePane>

          {/* Middle Content (Primary Scroll) */}
          <MiddlePane>
            <ArticleBody>
              <MetaText>Article ID: {id}</MetaText>
              <h1>The Pursuit of Knowledge</h1>
              <ContentWrapper>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                <p>{[...Array(20)].map(() => "Lorem ipsum dolor sit amet. ").join(" ")}</p>
              </ContentWrapper>
            </ArticleBody>
          </MiddlePane>

          {/* Right Side */}
          <SidePane>
            <ScrollContent height="2000px">
              <h3>Metadata</h3>
              <p>Related info here.</p>
            </ScrollContent>
          </SidePane>

        </ReaderArea>
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
  height: 100vh;
  overflow: hidden;
`;

const TopSection = styled.header`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  border-bottom: 1px solid #eee;
`;

const Column = styled.div`
  border: 1px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ReaderArea = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr 250px;
  height: 93vh;
  overflow: hidden;
`;

const SidePane = styled.aside`
  height: 100%;
  overflow-y: auto;
  background-color: #fcfcfc;
  border-right: 1px solid #eee;
  border-left: 1px solid #eee;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 4px;
  }
`;

const MiddlePane = styled.main`
  height: 100%;
  overflow-y: auto;
  padding: 0 2rem;
  background-color: #fff;
`;

const ScrollContent = styled.div<{ height: string }>`
  height: ${props => props.height};
  padding: 1rem;
`;

const ArticleBody = styled.article`
  padding: 2rem 0;
`;

const MetaText = styled.p`
  color: #888;
  font-size: 0.9rem;
`;

const ContentWrapper = styled.div`
  margin-top: 20px;
  line-height: 1.6;
  color: #333;
`;

// Route configuration
export const ArticleRoutes = {
  path: "/article/:id",
  element: <Article />,
};

export default Article;