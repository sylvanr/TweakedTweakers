// ListItemLink.tsx
import React from 'react';
import { ListItem, ListItemText, Typography } from '@mui/material';

interface ListItemLinkProps {
  to: string;
  primaryText: string;
  secondaryText: string;
}

const ListItemLink: React.FC<ListItemLinkProps> = ({ to, primaryText, secondaryText }) => {
  return (
    <ListItem style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ListItemText
        primary={
          <Typography variant="h6">
            <a href={to} className="home-link" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {primaryText}
            </a>
          </Typography>
        }
        secondary={secondaryText}
      />
    </ListItem>
  );
};

export default ListItemLink;
