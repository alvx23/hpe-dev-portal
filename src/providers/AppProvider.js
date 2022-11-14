import React, { useMemo, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';

export const AppContext = React.createContext({
  data: {},
  user: localStorage.getItem('userInfo'),
  setUser: () => null,
});

const AppProvider = ({ children }) => {
  const [userStr, setUser] = useState(localStorage.getItem('userInfo'));

  const user = useMemo(() => {
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }, [userStr]);

  const data = useStaticQuery(graphql`
    query ContextNonPageQuery {
      platform: allMarkdownRemark(
        filter: {
          fields: {
            sourceInstanceName: { eq: "platform" }
            slug: { regex: "//home/$/" }
          }
          frontmatter: { active: { eq: true } }
        }
        sort: { fields: [frontmatter___priority] }
      ) {
        edges {
          node {
            id
            fields {
              slug
              sourceInstanceName
            }
            frontmatter {
              title
              active
            }
          }
        }
      }
      opensource: allMarkdownRemark(
        filter: {
          fields: { sourceInstanceName: { eq: "opensource" } }
          frontmatter: { active: { eq: true } }
        }
        sort: { fields: [frontmatter___priority] }
      ) {
        edges {
          node {
            id
            fields {
              slug
              sourceInstanceName
            }
            frontmatter {
              title
              active
            }
          }
        }
      }
    }
  `);

  return (
    <AppContext.Provider value={{ data, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/* eslint-disable react/prop-types */
export default ({ element }) => <AppProvider>{element}</AppProvider>;
