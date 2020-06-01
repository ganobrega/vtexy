import React, { useEffect } from 'react';
import { Box, Button, Nav, Anchor } from 'grommet';
import * as Icons from 'grommet-icons';
import Tree from 'react-animated-tree';
import axios from 'axios';

export default () => {
  useEffect(() => {}, []);

  return (
    <Nav direction="column" background="light-3" pad="medium" fill>
      <Tree content="/" open>
        <Tree content="@Produto@">
          <Tree content="Produto" />
        </Tree>
        <Tree content="Home" />
      </Tree>

      {/* <Nav direction="row" flex justify="end">
        <Anchor icon={<Icons.Home />} hoverIndicator />
        <Anchor icon={<Icons.Download />} hoverIndicator />
        <Anchor icon={<Icons.CloudUpload />} hoverIndicator />
      </Nav> */}
    </Nav>
  );
};
