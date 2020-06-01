import React from 'react';
import { Grommet, Box, Grid } from 'grommet';
import { grommet } from 'grommet/themes';

import Map from './containers/Map';
import Main from './containers/Main';
import SideBar from './containers/SideBar';

const areas = [
  { name: 'map', start: [0, 0], end: [0, 0] },
  { name: 'main', start: [1, 0], end: [1, 0] },
  { name: 'sidebar', start: [2, 0], end: [2, 0] }
];

const columns = ['30%', 'flex', '100px'];

export default () => (
  <Grommet theme={grommet} full>
    <Grid columns={columns} rows={['flex']} areas={areas} fill>
      <Box gridArea="map" fill>
        <Map />
      </Box>
      <Box gridArea="main">
        <Main />
      </Box>
      <Box gridArea="sidebar">
        <SideBar />
      </Box>
    </Grid>
  </Grommet>
);
