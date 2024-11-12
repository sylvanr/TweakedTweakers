import React from 'react';
import { ListItem } from '@mui/material';

import './ScrapingInfo.css';

interface ListItemProps {
  title: string;
  desc: string;
}

const ListItemComponent: React.FC<ListItemProps> = ({ title, desc }) => (
  <ListItem>
    <div>
      <b>{title}</b>: {desc}
    </div>
  </ListItem>
);

export default ListItemComponent;
