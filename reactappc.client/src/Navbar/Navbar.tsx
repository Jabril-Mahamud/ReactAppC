// src/Navbar/Navbar.tsx
// src/Navbar.tsx

import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                        MyReactApp
                    </Link>
                </Typography>
                <Button color="inherit" component={Link} to="/">
                    Home
                </Button>
                <Button color="inherit" component={Link} to="/about">
                    About
                </Button>
                <Button color="inherit" component={Link} to="/contact">
                    Contact
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
